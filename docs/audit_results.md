# WebRTC Flow Deep Audit Results (Final Revision)

## 1. NEWLY DISCOVERED BUGS & RACE CONDITIONS

After a third, more adversarial review, several critical bugs and race conditions were discovered that were missed in previous audits. These issues go beyond the single-viewer architectural flaw and affect the stability and correctness of the implementation.

### Bug #1: Stale `viewerId` Closure in Callbacks (High Severity)

**Problem**: The `useWebRTC` hook incorrectly captures a stale `_viewerId` because it is missing from the dependency arrays of `useCallback` hooks.

**Evidence**:

```javascript
// useWebRTC.js
const sendICECandidate = useCallback(
  async (candidate) => {
    // ... uses _viewerId in the body of the POST request
  },
  [roomId, role, config] // <-- CRITICAL: _viewerId is missing
);

const startCandidatePolling = useCallback(async () => {
  // ... setInterval calls fetch with a URL that uses _viewerId
}, [roomId, role]); // <-- CRITICAL: _viewerId is missing
```

**Impact**: If a viewer changes their ID, the WebRTC logic will continue to use the **old ID** for all API calls. `sendICECandidate` will post candidates to a Redis key with the old ID, and `startCandidatePolling` will poll a URL with the old ID. The client will be sending and listening to the wrong "mailbox." This will cause the ICE candidate exchange to fail silently, likely preventing a successful connection.

**Fix**: Add `_viewerId` to the dependency arrays of both `useCallback` hooks to ensure the functions are re-created with the correct `viewerId` whenever it changes.

### Bug #2: Race Condition in ICE Candidate API (Medium Severity)

**Problem**: The `api/candidate.js` GET handler is not atomic. It reads a list of candidates and then deletes the entire list. It is possible for a client to add a new candidate _after_ the read but _before_ the delete.

**Evidence**:

```javascript
// api/candidate.js
// 1. Get all candidates currently in the list
const arr = (await redis.lrange(key, 0, -1)) || [];

// ---> RACE CONDITION WINDOW <---
// A client could push a new candidate here.

if (arr.length > 0) {
  // 2. Delete the entire list, including the new candidate that was never read.
  await redis.del(key);
}
```

**Impact**: ICE candidates can be permanently lost without being processed. This can lead to longer connection times or, in networks requiring specific candidates for NAT traversal, complete connection failure.

**Fix**: The operation should be made atomic. Instead of `LRANGE` followed by `DEL`, the API should use `LMOVE` in a loop or a Redis transaction (`MULTI`/`EXEC`) to move the candidates to a temporary key before processing and deleting. A simpler, acceptable fix is to use `LTRIM` to remove only the candidates that were read.

### Bug #3: React State Update on Unmounted Component (Low Severity)

**Problem**: The polling functions in `useWebRTC.js` make asynchronous `fetch` calls. If the component unmounts before a call completes, the `.then()` or `catch()` block will attempt to call `setError` or `setConnectionState` on an unmounted component.

**Evidence**: There is no mechanism to check if the component is still mounted before setting state in the polling callbacks.

**Impact**: This will generate a "Can't perform a React state update on an unmounted component" warning in the console and constitutes a memory leak.

**Fix**: Implement a mounted check. Create a ref (`const isMounted = useRef(true)`) and set it to `false` in the `useEffect` cleanup function. Check `if (isMounted.current)` before any state update in an async callback.

### Bug #4: Inefficient/Infinite ICE Candidate Polling (Low Severity)

**Problem**: `startCandidatePolling` polls every second and never stops unless the primary connection state moves to `connected` or `failed`. It does not have its own timeout or backoff strategy.

**Impact**: In a scenario where the connection gets stuck in the `connecting` state (e.g., a firewall issue not causing an immediate failure), the client will poll the `/api/candidate` endpoint indefinitely, creating unnecessary server load.

**Fix**: The candidate polling should have its own timeout, similar to the offer/answer polling, or it should be cleared when the main connection timeout is hit.

---

## 2. CRITICAL FINDING: Single Viewer Architecture Limitation

_(This finding from the previous audit remains correct and is the most significant architectural issue.)_

The application is architecturally limited to **one viewer per screen-sharing session** due to a single-use offer mechanism and a host-side implementation that only handles one peer connection. The claim of "Multiple Viewer Support" in the original audit document is false.

---

## 3. Final Conclusion

This final, deeper audit reveals that while the core logic for a single-viewer session is mostly functional, the implementation contains several subtle but important bugs related to state management, race conditions, and resource efficiency. The initial `WEBRTC_FLOW_AUDIT.md` document was not only misleading about multi-viewer support but also overlooked these underlying stability issues. The application is a good proof-of-concept but would require fixing these bugs before being considered robust.
