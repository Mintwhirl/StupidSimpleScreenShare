# Stupid Simple Screen Share

A minimal proof-of-concept browser-only screen-share app.

## Features

- Browser-based P2P screen sharing using WebRTC.
- Signaling implemented with Vercel Serverless Functions and Upstash Redis.
- No voice, video only.
- Ephemeral rooms with a 30-minute expiration.

## Deployment

### 1. Upstash Redis

1.  Create a new Redis database on [Upstash](https://upstash.com/).
2.  Get the `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` from your database dashboard.

### 2. Vercel

1.  Push the code to your own GitHub repository.
2.  Create a new project on [Vercel](https://vercel.com) and import your repository.
3.  In the project settings, add the following environment variables:
    -   `UPSTASH_REDIS_REST_URL`
    -   `UPSTASH_REDIS_REST_TOKEN`
4.  Deploy!

## Minimal Test Checklist

1.  **Host:**
    -   Open the deployed Vercel URL.
    -   Click "Start Sharing".
    -   Your screen should appear in the video element.
    -   A shareable URL should be displayed.

2.  **Viewer (on a different network if possible):**
    -   Open the shareable URL from the host.
    -   The viewer should see the host's screen within a few seconds.

3.  **Stop Sharing:**
    -   The host clicks "Stop Sharing".
    -   The video stream should stop for both the host and the viewer.

4.  **Room Expiration:**
    -   Wait 30 minutes after creating a room.
    -   Attempting to join the room should fail.
