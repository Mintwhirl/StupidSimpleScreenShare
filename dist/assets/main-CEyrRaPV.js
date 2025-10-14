(function () {
  const Z = document.createElement('link').relList;
  if (Z && Z.supports && Z.supports('modulepreload')) return;
  for (const w of document.querySelectorAll('link[rel="modulepreload"]')) d(w);
  new MutationObserver((w) => {
    for (const C of w)
      if (C.type === 'childList')
        for (const K of C.addedNodes) K.tagName === 'LINK' && K.rel === 'modulepreload' && d(K);
  }).observe(document, { childList: !0, subtree: !0 });
  function z(w) {
    const C = {};
    return (
      w.integrity && (C.integrity = w.integrity),
      w.referrerPolicy && (C.referrerPolicy = w.referrerPolicy),
      w.crossOrigin === 'use-credentials'
        ? (C.credentials = 'include')
        : w.crossOrigin === 'anonymous'
          ? (C.credentials = 'omit')
          : (C.credentials = 'same-origin'),
      C
    );
  }
  function d(w) {
    if (w.ep) return;
    w.ep = !0;
    const C = z(w);
    fetch(w.href, C);
  }
})();
function Td(b) {
  return b && b.__esModule && Object.prototype.hasOwnProperty.call(b, 'default') ? b.default : b;
}
var ns = { exports: {} },
  pn = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var yd;
function Fm() {
  if (yd) return pn;
  yd = 1;
  var b = Symbol.for('react.transitional.element'),
    Z = Symbol.for('react.fragment');
  function z(d, w, C) {
    var K = null;
    if ((C !== void 0 && (K = '' + C), w.key !== void 0 && (K = '' + w.key), 'key' in w)) {
      C = {};
      for (var I in w) I !== 'key' && (C[I] = w[I]);
    } else C = w;
    return ((w = C.ref), { $$typeof: b, type: d, key: K, ref: w !== void 0 ? w : null, props: C });
  }
  return ((pn.Fragment = Z), (pn.jsx = z), (pn.jsxs = z), pn);
}
var gd;
function Im() {
  return (gd || ((gd = 1), (ns.exports = Fm())), ns.exports);
}
var i = Im(),
  us = { exports: {} },
  W = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var vd;
function Pm() {
  if (vd) return W;
  vd = 1;
  var b = Symbol.for('react.transitional.element'),
    Z = Symbol.for('react.portal'),
    z = Symbol.for('react.fragment'),
    d = Symbol.for('react.strict_mode'),
    w = Symbol.for('react.profiler'),
    C = Symbol.for('react.consumer'),
    K = Symbol.for('react.context'),
    I = Symbol.for('react.forward_ref'),
    O = Symbol.for('react.suspense'),
    S = Symbol.for('react.memo'),
    B = Symbol.for('react.lazy'),
    R = Symbol.for('react.activity'),
    Q = Symbol.iterator;
  function at(o) {
    return o === null || typeof o != 'object'
      ? null
      : ((o = (Q && o[Q]) || o['@@iterator']), typeof o == 'function' ? o : null);
  }
  var et = {
      isMounted: function () {
        return !1;
      },
      enqueueForceUpdate: function () {},
      enqueueReplaceState: function () {},
      enqueueSetState: function () {},
    },
    F = Object.assign,
    $ = {};
  function p(o, T, H) {
    ((this.props = o), (this.context = T), (this.refs = $), (this.updater = H || et));
  }
  ((p.prototype.isReactComponent = {}),
    (p.prototype.setState = function (o, T) {
      if (typeof o != 'object' && typeof o != 'function' && o != null)
        throw Error(
          'takes an object of state variables to update or a function which returns an object of state variables.'
        );
      this.updater.enqueueSetState(this, o, T, 'setState');
    }),
    (p.prototype.forceUpdate = function (o) {
      this.updater.enqueueForceUpdate(this, o, 'forceUpdate');
    }));
  function D() {}
  D.prototype = p.prototype;
  function U(o, T, H) {
    ((this.props = o), (this.context = T), (this.refs = $), (this.updater = H || et));
  }
  var J = (U.prototype = new D());
  ((J.constructor = U), F(J, p.prototype), (J.isPureReactComponent = !0));
  var ut = Array.isArray;
  function At() {}
  var k = { H: null, A: null, T: null, S: null },
    Ot = Object.prototype.hasOwnProperty;
  function Nt(o, T, H) {
    var G = H.ref;
    return { $$typeof: b, type: o, key: T, ref: G !== void 0 ? G : null, props: H };
  }
  function Pt(o, T) {
    return Nt(o.type, T, o.props);
  }
  function $t(o) {
    return typeof o == 'object' && o !== null && o.$$typeof === b;
  }
  function Dt(o) {
    var T = { '=': '=0', ':': '=2' };
    return (
      '$' +
      o.replace(/[=:]/g, function (H) {
        return T[H];
      })
    );
  }
  var wt = /\/+/g;
  function nt(o, T) {
    return typeof o == 'object' && o !== null && o.key != null ? Dt('' + o.key) : T.toString(36);
  }
  function _(o) {
    switch (o.status) {
      case 'fulfilled':
        return o.value;
      case 'rejected':
        throw o.reason;
      default:
        switch (
          (typeof o.status == 'string'
            ? o.then(At, At)
            : ((o.status = 'pending'),
              o.then(
                function (T) {
                  o.status === 'pending' && ((o.status = 'fulfilled'), (o.value = T));
                },
                function (T) {
                  o.status === 'pending' && ((o.status = 'rejected'), (o.reason = T));
                }
              )),
          o.status)
        ) {
          case 'fulfilled':
            return o.value;
          case 'rejected':
            throw o.reason;
        }
    }
    throw o;
  }
  function m(o, T, H, G, P) {
    var ct = typeof o;
    (ct === 'undefined' || ct === 'boolean') && (o = null);
    var vt = !1;
    if (o === null) vt = !0;
    else
      switch (ct) {
        case 'bigint':
        case 'string':
        case 'number':
          vt = !0;
          break;
        case 'object':
          switch (o.$$typeof) {
            case b:
            case Z:
              vt = !0;
              break;
            case B:
              return ((vt = o._init), m(vt(o._payload), T, H, G, P));
          }
      }
    if (vt)
      return (
        (P = P(o)),
        (vt = G === '' ? '.' + nt(o, 0) : G),
        ut(P)
          ? ((H = ''),
            vt != null && (H = vt.replace(wt, '$&/') + '/'),
            m(P, T, H, '', function (za) {
              return za;
            }))
          : P != null &&
            ($t(P) &&
              (P = Pt(
                P,
                H + (P.key == null || (o && o.key === P.key) ? '' : ('' + P.key).replace(wt, '$&/') + '/') + vt
              )),
            T.push(P)),
        1
      );
    vt = 0;
    var Ft = G === '' ? '.' : G + ':';
    if (ut(o)) for (var Ut = 0; Ut < o.length; Ut++) ((G = o[Ut]), (ct = Ft + nt(G, Ut)), (vt += m(G, T, H, ct, P)));
    else if (((Ut = at(o)), typeof Ut == 'function'))
      for (o = Ut.call(o), Ut = 0; !(G = o.next()).done; )
        ((G = G.value), (ct = Ft + nt(G, Ut++)), (vt += m(G, T, H, ct, P)));
    else if (ct === 'object') {
      if (typeof o.then == 'function') return m(_(o), T, H, G, P);
      throw (
        (T = String(o)),
        Error(
          'Objects are not valid as a React child (found: ' +
            (T === '[object Object]' ? 'object with keys {' + Object.keys(o).join(', ') + '}' : T) +
            '). If you meant to render a collection of children, use an array instead.'
        )
      );
    }
    return vt;
  }
  function M(o, T, H) {
    if (o == null) return o;
    var G = [],
      P = 0;
    return (
      m(o, G, '', '', function (ct) {
        return T.call(H, ct, P++);
      }),
      G
    );
  }
  function q(o) {
    if (o._status === -1) {
      var T = o._result;
      ((T = T()),
        T.then(
          function (H) {
            (o._status === 0 || o._status === -1) && ((o._status = 1), (o._result = H));
          },
          function (H) {
            (o._status === 0 || o._status === -1) && ((o._status = 2), (o._result = H));
          }
        ),
        o._status === -1 && ((o._status = 0), (o._result = T)));
    }
    if (o._status === 1) return o._result.default;
    throw o._result;
  }
  var dt =
      typeof reportError == 'function'
        ? reportError
        : function (o) {
            if (typeof window == 'object' && typeof window.ErrorEvent == 'function') {
              var T = new window.ErrorEvent('error', {
                bubbles: !0,
                cancelable: !0,
                message:
                  typeof o == 'object' && o !== null && typeof o.message == 'string' ? String(o.message) : String(o),
                error: o,
              });
              if (!window.dispatchEvent(T)) return;
            } else if (typeof process == 'object' && typeof process.emit == 'function') {
              process.emit('uncaughtException', o);
              return;
            }
            console.error(o);
          },
    yt = {
      map: M,
      forEach: function (o, T, H) {
        M(
          o,
          function () {
            T.apply(this, arguments);
          },
          H
        );
      },
      count: function (o) {
        var T = 0;
        return (
          M(o, function () {
            T++;
          }),
          T
        );
      },
      toArray: function (o) {
        return (
          M(o, function (T) {
            return T;
          }) || []
        );
      },
      only: function (o) {
        if (!$t(o)) throw Error('React.Children.only expected to receive a single React element child.');
        return o;
      },
    };
  return (
    (W.Activity = R),
    (W.Children = yt),
    (W.Component = p),
    (W.Fragment = z),
    (W.Profiler = w),
    (W.PureComponent = U),
    (W.StrictMode = d),
    (W.Suspense = O),
    (W.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = k),
    (W.__COMPILER_RUNTIME = {
      __proto__: null,
      c: function (o) {
        return k.H.useMemoCache(o);
      },
    }),
    (W.cache = function (o) {
      return function () {
        return o.apply(null, arguments);
      };
    }),
    (W.cacheSignal = function () {
      return null;
    }),
    (W.cloneElement = function (o, T, H) {
      if (o == null) throw Error('The argument must be a React element, but you passed ' + o + '.');
      var G = F({}, o.props),
        P = o.key;
      if (T != null)
        for (ct in (T.key !== void 0 && (P = '' + T.key), T))
          !Ot.call(T, ct) ||
            ct === 'key' ||
            ct === '__self' ||
            ct === '__source' ||
            (ct === 'ref' && T.ref === void 0) ||
            (G[ct] = T[ct]);
      var ct = arguments.length - 2;
      if (ct === 1) G.children = H;
      else if (1 < ct) {
        for (var vt = Array(ct), Ft = 0; Ft < ct; Ft++) vt[Ft] = arguments[Ft + 2];
        G.children = vt;
      }
      return Nt(o.type, P, G);
    }),
    (W.createContext = function (o) {
      return (
        (o = { $$typeof: K, _currentValue: o, _currentValue2: o, _threadCount: 0, Provider: null, Consumer: null }),
        (o.Provider = o),
        (o.Consumer = { $$typeof: C, _context: o }),
        o
      );
    }),
    (W.createElement = function (o, T, H) {
      var G,
        P = {},
        ct = null;
      if (T != null)
        for (G in (T.key !== void 0 && (ct = '' + T.key), T))
          Ot.call(T, G) && G !== 'key' && G !== '__self' && G !== '__source' && (P[G] = T[G]);
      var vt = arguments.length - 2;
      if (vt === 1) P.children = H;
      else if (1 < vt) {
        for (var Ft = Array(vt), Ut = 0; Ut < vt; Ut++) Ft[Ut] = arguments[Ut + 2];
        P.children = Ft;
      }
      if (o && o.defaultProps) for (G in ((vt = o.defaultProps), vt)) P[G] === void 0 && (P[G] = vt[G]);
      return Nt(o, ct, P);
    }),
    (W.createRef = function () {
      return { current: null };
    }),
    (W.forwardRef = function (o) {
      return { $$typeof: I, render: o };
    }),
    (W.isValidElement = $t),
    (W.lazy = function (o) {
      return { $$typeof: B, _payload: { _status: -1, _result: o }, _init: q };
    }),
    (W.memo = function (o, T) {
      return { $$typeof: S, type: o, compare: T === void 0 ? null : T };
    }),
    (W.startTransition = function (o) {
      var T = k.T,
        H = {};
      k.T = H;
      try {
        var G = o(),
          P = k.S;
        (P !== null && P(H, G), typeof G == 'object' && G !== null && typeof G.then == 'function' && G.then(At, dt));
      } catch (ct) {
        dt(ct);
      } finally {
        (T !== null && H.types !== null && (T.types = H.types), (k.T = T));
      }
    }),
    (W.unstable_useCacheRefresh = function () {
      return k.H.useCacheRefresh();
    }),
    (W.use = function (o) {
      return k.H.use(o);
    }),
    (W.useActionState = function (o, T, H) {
      return k.H.useActionState(o, T, H);
    }),
    (W.useCallback = function (o, T) {
      return k.H.useCallback(o, T);
    }),
    (W.useContext = function (o) {
      return k.H.useContext(o);
    }),
    (W.useDebugValue = function () {}),
    (W.useDeferredValue = function (o, T) {
      return k.H.useDeferredValue(o, T);
    }),
    (W.useEffect = function (o, T) {
      return k.H.useEffect(o, T);
    }),
    (W.useEffectEvent = function (o) {
      return k.H.useEffectEvent(o);
    }),
    (W.useId = function () {
      return k.H.useId();
    }),
    (W.useImperativeHandle = function (o, T, H) {
      return k.H.useImperativeHandle(o, T, H);
    }),
    (W.useInsertionEffect = function (o, T) {
      return k.H.useInsertionEffect(o, T);
    }),
    (W.useLayoutEffect = function (o, T) {
      return k.H.useLayoutEffect(o, T);
    }),
    (W.useMemo = function (o, T) {
      return k.H.useMemo(o, T);
    }),
    (W.useOptimistic = function (o, T) {
      return k.H.useOptimistic(o, T);
    }),
    (W.useReducer = function (o, T, H) {
      return k.H.useReducer(o, T, H);
    }),
    (W.useRef = function (o) {
      return k.H.useRef(o);
    }),
    (W.useState = function (o) {
      return k.H.useState(o);
    }),
    (W.useSyncExternalStore = function (o, T, H) {
      return k.H.useSyncExternalStore(o, T, H);
    }),
    (W.useTransition = function () {
      return k.H.useTransition();
    }),
    (W.version = '19.2.0'),
    W
  );
}
var bd;
function rs() {
  return (bd || ((bd = 1), (us.exports = Pm())), us.exports);
}
var A = rs();
const th = Td(A);
var cs = { exports: {} },
  Sn = {},
  is = { exports: {} },
  ss = {};
/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var xd;
function eh() {
  return (
    xd ||
      ((xd = 1),
      (function (b) {
        function Z(m, M) {
          var q = m.length;
          m.push(M);
          t: for (; 0 < q; ) {
            var dt = (q - 1) >>> 1,
              yt = m[dt];
            if (0 < w(yt, M)) ((m[dt] = M), (m[q] = yt), (q = dt));
            else break t;
          }
        }
        function z(m) {
          return m.length === 0 ? null : m[0];
        }
        function d(m) {
          if (m.length === 0) return null;
          var M = m[0],
            q = m.pop();
          if (q !== M) {
            m[0] = q;
            t: for (var dt = 0, yt = m.length, o = yt >>> 1; dt < o; ) {
              var T = 2 * (dt + 1) - 1,
                H = m[T],
                G = T + 1,
                P = m[G];
              if (0 > w(H, q))
                G < yt && 0 > w(P, H) ? ((m[dt] = P), (m[G] = q), (dt = G)) : ((m[dt] = H), (m[T] = q), (dt = T));
              else if (G < yt && 0 > w(P, q)) ((m[dt] = P), (m[G] = q), (dt = G));
              else break t;
            }
          }
          return M;
        }
        function w(m, M) {
          var q = m.sortIndex - M.sortIndex;
          return q !== 0 ? q : m.id - M.id;
        }
        if (((b.unstable_now = void 0), typeof performance == 'object' && typeof performance.now == 'function')) {
          var C = performance;
          b.unstable_now = function () {
            return C.now();
          };
        } else {
          var K = Date,
            I = K.now();
          b.unstable_now = function () {
            return K.now() - I;
          };
        }
        var O = [],
          S = [],
          B = 1,
          R = null,
          Q = 3,
          at = !1,
          et = !1,
          F = !1,
          $ = !1,
          p = typeof setTimeout == 'function' ? setTimeout : null,
          D = typeof clearTimeout == 'function' ? clearTimeout : null,
          U = typeof setImmediate < 'u' ? setImmediate : null;
        function J(m) {
          for (var M = z(S); M !== null; ) {
            if (M.callback === null) d(S);
            else if (M.startTime <= m) (d(S), (M.sortIndex = M.expirationTime), Z(O, M));
            else break;
            M = z(S);
          }
        }
        function ut(m) {
          if (((F = !1), J(m), !et))
            if (z(O) !== null) ((et = !0), At || ((At = !0), Dt()));
            else {
              var M = z(S);
              M !== null && _(ut, M.startTime - m);
            }
        }
        var At = !1,
          k = -1,
          Ot = 5,
          Nt = -1;
        function Pt() {
          return $ ? !0 : !(b.unstable_now() - Nt < Ot);
        }
        function $t() {
          if ((($ = !1), At)) {
            var m = b.unstable_now();
            Nt = m;
            var M = !0;
            try {
              t: {
                ((et = !1), F && ((F = !1), D(k), (k = -1)), (at = !0));
                var q = Q;
                try {
                  e: {
                    for (J(m), R = z(O); R !== null && !(R.expirationTime > m && Pt()); ) {
                      var dt = R.callback;
                      if (typeof dt == 'function') {
                        ((R.callback = null), (Q = R.priorityLevel));
                        var yt = dt(R.expirationTime <= m);
                        if (((m = b.unstable_now()), typeof yt == 'function')) {
                          ((R.callback = yt), J(m), (M = !0));
                          break e;
                        }
                        (R === z(O) && d(O), J(m));
                      } else d(O);
                      R = z(O);
                    }
                    if (R !== null) M = !0;
                    else {
                      var o = z(S);
                      (o !== null && _(ut, o.startTime - m), (M = !1));
                    }
                  }
                  break t;
                } finally {
                  ((R = null), (Q = q), (at = !1));
                }
                M = void 0;
              }
            } finally {
              M ? Dt() : (At = !1);
            }
          }
        }
        var Dt;
        if (typeof U == 'function')
          Dt = function () {
            U($t);
          };
        else if (typeof MessageChannel < 'u') {
          var wt = new MessageChannel(),
            nt = wt.port2;
          ((wt.port1.onmessage = $t),
            (Dt = function () {
              nt.postMessage(null);
            }));
        } else
          Dt = function () {
            p($t, 0);
          };
        function _(m, M) {
          k = p(function () {
            m(b.unstable_now());
          }, M);
        }
        ((b.unstable_IdlePriority = 5),
          (b.unstable_ImmediatePriority = 1),
          (b.unstable_LowPriority = 4),
          (b.unstable_NormalPriority = 3),
          (b.unstable_Profiling = null),
          (b.unstable_UserBlockingPriority = 2),
          (b.unstable_cancelCallback = function (m) {
            m.callback = null;
          }),
          (b.unstable_forceFrameRate = function (m) {
            0 > m || 125 < m
              ? console.error(
                  'forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported'
                )
              : (Ot = 0 < m ? Math.floor(1e3 / m) : 5);
          }),
          (b.unstable_getCurrentPriorityLevel = function () {
            return Q;
          }),
          (b.unstable_next = function (m) {
            switch (Q) {
              case 1:
              case 2:
              case 3:
                var M = 3;
                break;
              default:
                M = Q;
            }
            var q = Q;
            Q = M;
            try {
              return m();
            } finally {
              Q = q;
            }
          }),
          (b.unstable_requestPaint = function () {
            $ = !0;
          }),
          (b.unstable_runWithPriority = function (m, M) {
            switch (m) {
              case 1:
              case 2:
              case 3:
              case 4:
              case 5:
                break;
              default:
                m = 3;
            }
            var q = Q;
            Q = m;
            try {
              return M();
            } finally {
              Q = q;
            }
          }),
          (b.unstable_scheduleCallback = function (m, M, q) {
            var dt = b.unstable_now();
            switch (
              (typeof q == 'object' && q !== null
                ? ((q = q.delay), (q = typeof q == 'number' && 0 < q ? dt + q : dt))
                : (q = dt),
              m)
            ) {
              case 1:
                var yt = -1;
                break;
              case 2:
                yt = 250;
                break;
              case 5:
                yt = 1073741823;
                break;
              case 4:
                yt = 1e4;
                break;
              default:
                yt = 5e3;
            }
            return (
              (yt = q + yt),
              (m = { id: B++, callback: M, priorityLevel: m, startTime: q, expirationTime: yt, sortIndex: -1 }),
              q > dt
                ? ((m.sortIndex = q),
                  Z(S, m),
                  z(O) === null && m === z(S) && (F ? (D(k), (k = -1)) : (F = !0), _(ut, q - dt)))
                : ((m.sortIndex = yt), Z(O, m), et || at || ((et = !0), At || ((At = !0), Dt()))),
              m
            );
          }),
          (b.unstable_shouldYield = Pt),
          (b.unstable_wrapCallback = function (m) {
            var M = Q;
            return function () {
              var q = Q;
              Q = M;
              try {
                return m.apply(this, arguments);
              } finally {
                Q = q;
              }
            };
          }));
      })(ss)),
    ss
  );
}
var pd;
function lh() {
  return (pd || ((pd = 1), (is.exports = eh())), is.exports);
}
var fs = { exports: {} },
  Wt = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Sd;
function ah() {
  if (Sd) return Wt;
  Sd = 1;
  var b = rs();
  function Z(O) {
    var S = 'https://react.dev/errors/' + O;
    if (1 < arguments.length) {
      S += '?args[]=' + encodeURIComponent(arguments[1]);
      for (var B = 2; B < arguments.length; B++) S += '&args[]=' + encodeURIComponent(arguments[B]);
    }
    return (
      'Minified React error #' +
      O +
      '; visit ' +
      S +
      ' for the full message or use the non-minified dev environment for full errors and additional helpful warnings.'
    );
  }
  function z() {}
  var d = {
      d: {
        f: z,
        r: function () {
          throw Error(Z(522));
        },
        D: z,
        C: z,
        L: z,
        m: z,
        X: z,
        S: z,
        M: z,
      },
      p: 0,
      findDOMNode: null,
    },
    w = Symbol.for('react.portal');
  function C(O, S, B) {
    var R = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: w, key: R == null ? null : '' + R, children: O, containerInfo: S, implementation: B };
  }
  var K = b.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function I(O, S) {
    if (O === 'font') return '';
    if (typeof S == 'string') return S === 'use-credentials' ? S : '';
  }
  return (
    (Wt.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = d),
    (Wt.createPortal = function (O, S) {
      var B = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
      if (!S || (S.nodeType !== 1 && S.nodeType !== 9 && S.nodeType !== 11)) throw Error(Z(299));
      return C(O, S, null, B);
    }),
    (Wt.flushSync = function (O) {
      var S = K.T,
        B = d.p;
      try {
        if (((K.T = null), (d.p = 2), O)) return O();
      } finally {
        ((K.T = S), (d.p = B), d.d.f());
      }
    }),
    (Wt.preconnect = function (O, S) {
      typeof O == 'string' &&
        (S
          ? ((S = S.crossOrigin), (S = typeof S == 'string' ? (S === 'use-credentials' ? S : '') : void 0))
          : (S = null),
        d.d.C(O, S));
    }),
    (Wt.prefetchDNS = function (O) {
      typeof O == 'string' && d.d.D(O);
    }),
    (Wt.preinit = function (O, S) {
      if (typeof O == 'string' && S && typeof S.as == 'string') {
        var B = S.as,
          R = I(B, S.crossOrigin),
          Q = typeof S.integrity == 'string' ? S.integrity : void 0,
          at = typeof S.fetchPriority == 'string' ? S.fetchPriority : void 0;
        B === 'style'
          ? d.d.S(O, typeof S.precedence == 'string' ? S.precedence : void 0, {
              crossOrigin: R,
              integrity: Q,
              fetchPriority: at,
            })
          : B === 'script' &&
            d.d.X(O, {
              crossOrigin: R,
              integrity: Q,
              fetchPriority: at,
              nonce: typeof S.nonce == 'string' ? S.nonce : void 0,
            });
      }
    }),
    (Wt.preinitModule = function (O, S) {
      if (typeof O == 'string')
        if (typeof S == 'object' && S !== null) {
          if (S.as == null || S.as === 'script') {
            var B = I(S.as, S.crossOrigin);
            d.d.M(O, {
              crossOrigin: B,
              integrity: typeof S.integrity == 'string' ? S.integrity : void 0,
              nonce: typeof S.nonce == 'string' ? S.nonce : void 0,
            });
          }
        } else S == null && d.d.M(O);
    }),
    (Wt.preload = function (O, S) {
      if (typeof O == 'string' && typeof S == 'object' && S !== null && typeof S.as == 'string') {
        var B = S.as,
          R = I(B, S.crossOrigin);
        d.d.L(O, B, {
          crossOrigin: R,
          integrity: typeof S.integrity == 'string' ? S.integrity : void 0,
          nonce: typeof S.nonce == 'string' ? S.nonce : void 0,
          type: typeof S.type == 'string' ? S.type : void 0,
          fetchPriority: typeof S.fetchPriority == 'string' ? S.fetchPriority : void 0,
          referrerPolicy: typeof S.referrerPolicy == 'string' ? S.referrerPolicy : void 0,
          imageSrcSet: typeof S.imageSrcSet == 'string' ? S.imageSrcSet : void 0,
          imageSizes: typeof S.imageSizes == 'string' ? S.imageSizes : void 0,
          media: typeof S.media == 'string' ? S.media : void 0,
        });
      }
    }),
    (Wt.preloadModule = function (O, S) {
      if (typeof O == 'string')
        if (S) {
          var B = I(S.as, S.crossOrigin);
          d.d.m(O, {
            as: typeof S.as == 'string' && S.as !== 'script' ? S.as : void 0,
            crossOrigin: B,
            integrity: typeof S.integrity == 'string' ? S.integrity : void 0,
          });
        } else d.d.m(O);
    }),
    (Wt.requestFormReset = function (O) {
      d.d.r(O);
    }),
    (Wt.unstable_batchedUpdates = function (O, S) {
      return O(S);
    }),
    (Wt.useFormState = function (O, S, B) {
      return K.H.useFormState(O, S, B);
    }),
    (Wt.useFormStatus = function () {
      return K.H.useHostTransitionStatus();
    }),
    (Wt.version = '19.2.0'),
    Wt
  );
}
var Ed;
function nh() {
  if (Ed) return fs.exports;
  Ed = 1;
  function b() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > 'u' || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != 'function'))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(b);
      } catch (Z) {
        console.error(Z);
      }
  }
  return (b(), (fs.exports = ah()), fs.exports);
}
/**
 * @license React
 * react-dom-client.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var jd;
function uh() {
  if (jd) return Sn;
  jd = 1;
  var b = lh(),
    Z = rs(),
    z = nh();
  function d(t) {
    var e = 'https://react.dev/errors/' + t;
    if (1 < arguments.length) {
      e += '?args[]=' + encodeURIComponent(arguments[1]);
      for (var l = 2; l < arguments.length; l++) e += '&args[]=' + encodeURIComponent(arguments[l]);
    }
    return (
      'Minified React error #' +
      t +
      '; visit ' +
      e +
      ' for the full message or use the non-minified dev environment for full errors and additional helpful warnings.'
    );
  }
  function w(t) {
    return !(!t || (t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11));
  }
  function C(t) {
    var e = t,
      l = t;
    if (t.alternate) for (; e.return; ) e = e.return;
    else {
      t = e;
      do ((e = t), (e.flags & 4098) !== 0 && (l = e.return), (t = e.return));
      while (t);
    }
    return e.tag === 3 ? l : null;
  }
  function K(t) {
    if (t.tag === 13) {
      var e = t.memoizedState;
      if ((e === null && ((t = t.alternate), t !== null && (e = t.memoizedState)), e !== null)) return e.dehydrated;
    }
    return null;
  }
  function I(t) {
    if (t.tag === 31) {
      var e = t.memoizedState;
      if ((e === null && ((t = t.alternate), t !== null && (e = t.memoizedState)), e !== null)) return e.dehydrated;
    }
    return null;
  }
  function O(t) {
    if (C(t) !== t) throw Error(d(188));
  }
  function S(t) {
    var e = t.alternate;
    if (!e) {
      if (((e = C(t)), e === null)) throw Error(d(188));
      return e !== t ? null : t;
    }
    for (var l = t, a = e; ; ) {
      var n = l.return;
      if (n === null) break;
      var u = n.alternate;
      if (u === null) {
        if (((a = n.return), a !== null)) {
          l = a;
          continue;
        }
        break;
      }
      if (n.child === u.child) {
        for (u = n.child; u; ) {
          if (u === l) return (O(n), t);
          if (u === a) return (O(n), e);
          u = u.sibling;
        }
        throw Error(d(188));
      }
      if (l.return !== a.return) ((l = n), (a = u));
      else {
        for (var c = !1, s = n.child; s; ) {
          if (s === l) {
            ((c = !0), (l = n), (a = u));
            break;
          }
          if (s === a) {
            ((c = !0), (a = n), (l = u));
            break;
          }
          s = s.sibling;
        }
        if (!c) {
          for (s = u.child; s; ) {
            if (s === l) {
              ((c = !0), (l = u), (a = n));
              break;
            }
            if (s === a) {
              ((c = !0), (a = u), (l = n));
              break;
            }
            s = s.sibling;
          }
          if (!c) throw Error(d(189));
        }
      }
      if (l.alternate !== a) throw Error(d(190));
    }
    if (l.tag !== 3) throw Error(d(188));
    return l.stateNode.current === l ? t : e;
  }
  function B(t) {
    var e = t.tag;
    if (e === 5 || e === 26 || e === 27 || e === 6) return t;
    for (t = t.child; t !== null; ) {
      if (((e = B(t)), e !== null)) return e;
      t = t.sibling;
    }
    return null;
  }
  var R = Object.assign,
    Q = Symbol.for('react.element'),
    at = Symbol.for('react.transitional.element'),
    et = Symbol.for('react.portal'),
    F = Symbol.for('react.fragment'),
    $ = Symbol.for('react.strict_mode'),
    p = Symbol.for('react.profiler'),
    D = Symbol.for('react.consumer'),
    U = Symbol.for('react.context'),
    J = Symbol.for('react.forward_ref'),
    ut = Symbol.for('react.suspense'),
    At = Symbol.for('react.suspense_list'),
    k = Symbol.for('react.memo'),
    Ot = Symbol.for('react.lazy'),
    Nt = Symbol.for('react.activity'),
    Pt = Symbol.for('react.memo_cache_sentinel'),
    $t = Symbol.iterator;
  function Dt(t) {
    return t === null || typeof t != 'object'
      ? null
      : ((t = ($t && t[$t]) || t['@@iterator']), typeof t == 'function' ? t : null);
  }
  var wt = Symbol.for('react.client.reference');
  function nt(t) {
    if (t == null) return null;
    if (typeof t == 'function') return t.$$typeof === wt ? null : t.displayName || t.name || null;
    if (typeof t == 'string') return t;
    switch (t) {
      case F:
        return 'Fragment';
      case p:
        return 'Profiler';
      case $:
        return 'StrictMode';
      case ut:
        return 'Suspense';
      case At:
        return 'SuspenseList';
      case Nt:
        return 'Activity';
    }
    if (typeof t == 'object')
      switch (t.$$typeof) {
        case et:
          return 'Portal';
        case U:
          return t.displayName || 'Context';
        case D:
          return (t._context.displayName || 'Context') + '.Consumer';
        case J:
          var e = t.render;
          return (
            (t = t.displayName),
            t || ((t = e.displayName || e.name || ''), (t = t !== '' ? 'ForwardRef(' + t + ')' : 'ForwardRef')),
            t
          );
        case k:
          return ((e = t.displayName || null), e !== null ? e : nt(t.type) || 'Memo');
        case Ot:
          ((e = t._payload), (t = t._init));
          try {
            return nt(t(e));
          } catch {}
      }
    return null;
  }
  var _ = Array.isArray,
    m = Z.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
    M = z.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
    q = { pending: !1, data: null, method: null, action: null },
    dt = [],
    yt = -1;
  function o(t) {
    return { current: t };
  }
  function T(t) {
    0 > yt || ((t.current = dt[yt]), (dt[yt] = null), yt--);
  }
  function H(t, e) {
    (yt++, (dt[yt] = t.current), (t.current = e));
  }
  var G = o(null),
    P = o(null),
    ct = o(null),
    vt = o(null);
  function Ft(t, e) {
    switch ((H(ct, e), H(P, t), H(G, null), e.nodeType)) {
      case 9:
      case 11:
        t = (t = e.documentElement) && (t = t.namespaceURI) ? qo(t) : 0;
        break;
      default:
        if (((t = e.tagName), (e = e.namespaceURI))) ((e = qo(e)), (t = Yo(e, t)));
        else
          switch (t) {
            case 'svg':
              t = 1;
              break;
            case 'math':
              t = 2;
              break;
            default:
              t = 0;
          }
    }
    (T(G), H(G, t));
  }
  function Ut() {
    (T(G), T(P), T(ct));
  }
  function za(t) {
    t.memoizedState !== null && H(vt, t);
    var e = G.current,
      l = Yo(e, t.type);
    e !== l && (H(P, t), H(G, l));
  }
  function En(t) {
    (P.current === t && (T(G), T(P)), vt.current === t && (T(vt), (gn._currentValue = q)));
  }
  var Gu, ds;
  function jl(t) {
    if (Gu === void 0)
      try {
        throw Error();
      } catch (l) {
        var e = l.stack.trim().match(/\n( *(at )?)/);
        ((Gu = (e && e[1]) || ''),
          (ds =
            -1 <
            l.stack.indexOf(`
    at`)
              ? ' (<anonymous>)'
              : -1 < l.stack.indexOf('@')
                ? '@unknown:0:0'
                : ''));
      }
    return (
      `
` +
      Gu +
      t +
      ds
    );
  }
  var Xu = !1;
  function Qu(t, e) {
    if (!t || Xu) return '';
    Xu = !0;
    var l = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var a = {
        DetermineComponentFrameRoot: function () {
          try {
            if (e) {
              var N = function () {
                throw Error();
              };
              if (
                (Object.defineProperty(N.prototype, 'props', {
                  set: function () {
                    throw Error();
                  },
                }),
                typeof Reflect == 'object' && Reflect.construct)
              ) {
                try {
                  Reflect.construct(N, []);
                } catch (x) {
                  var v = x;
                }
                Reflect.construct(t, [], N);
              } else {
                try {
                  N.call();
                } catch (x) {
                  v = x;
                }
                t.call(N.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (x) {
                v = x;
              }
              (N = t()) && typeof N.catch == 'function' && N.catch(function () {});
            }
          } catch (x) {
            if (x && v && typeof x.stack == 'string') return [x.stack, v.stack];
          }
          return [null, null];
        },
      };
      a.DetermineComponentFrameRoot.displayName = 'DetermineComponentFrameRoot';
      var n = Object.getOwnPropertyDescriptor(a.DetermineComponentFrameRoot, 'name');
      n &&
        n.configurable &&
        Object.defineProperty(a.DetermineComponentFrameRoot, 'name', { value: 'DetermineComponentFrameRoot' });
      var u = a.DetermineComponentFrameRoot(),
        c = u[0],
        s = u[1];
      if (c && s) {
        var f = c.split(`
`),
          g = s.split(`
`);
        for (n = a = 0; a < f.length && !f[a].includes('DetermineComponentFrameRoot'); ) a++;
        for (; n < g.length && !g[n].includes('DetermineComponentFrameRoot'); ) n++;
        if (a === f.length || n === g.length)
          for (a = f.length - 1, n = g.length - 1; 1 <= a && 0 <= n && f[a] !== g[n]; ) n--;
        for (; 1 <= a && 0 <= n; a--, n--)
          if (f[a] !== g[n]) {
            if (a !== 1 || n !== 1)
              do
                if ((a--, n--, 0 > n || f[a] !== g[n])) {
                  var E =
                    `
` + f[a].replace(' at new ', ' at ');
                  return (
                    t.displayName && E.includes('<anonymous>') && (E = E.replace('<anonymous>', t.displayName)),
                    E
                  );
                }
              while (1 <= a && 0 <= n);
            break;
          }
      }
    } finally {
      ((Xu = !1), (Error.prepareStackTrace = l));
    }
    return (l = t ? t.displayName || t.name : '') ? jl(l) : '';
  }
  function Md(t, e) {
    switch (t.tag) {
      case 26:
      case 27:
      case 5:
        return jl(t.type);
      case 16:
        return jl('Lazy');
      case 13:
        return t.child !== e && e !== null ? jl('Suspense Fallback') : jl('Suspense');
      case 19:
        return jl('SuspenseList');
      case 0:
      case 15:
        return Qu(t.type, !1);
      case 11:
        return Qu(t.type.render, !1);
      case 1:
        return Qu(t.type, !0);
      case 31:
        return jl('Activity');
      default:
        return '';
    }
  }
  function ms(t) {
    try {
      var e = '',
        l = null;
      do ((e += Md(t, l)), (l = t), (t = t.return));
      while (t);
      return e;
    } catch (a) {
      return (
        `
Error generating stack: ` +
        a.message +
        `
` +
        a.stack
      );
    }
  }
  var Lu = Object.prototype.hasOwnProperty,
    Zu = b.unstable_scheduleCallback,
    Vu = b.unstable_cancelCallback,
    Od = b.unstable_shouldYield,
    Cd = b.unstable_requestPaint,
    ie = b.unstable_now,
    _d = b.unstable_getCurrentPriorityLevel,
    hs = b.unstable_ImmediatePriority,
    ys = b.unstable_UserBlockingPriority,
    jn = b.unstable_NormalPriority,
    Dd = b.unstable_LowPriority,
    gs = b.unstable_IdlePriority,
    Ud = b.log,
    Rd = b.unstable_setDisableYieldValue,
    Aa = null,
    se = null;
  function Ie(t) {
    if ((typeof Ud == 'function' && Rd(t), se && typeof se.setStrictMode == 'function'))
      try {
        se.setStrictMode(Aa, t);
      } catch {}
  }
  var fe = Math.clz32 ? Math.clz32 : Bd,
    Hd = Math.log,
    wd = Math.LN2;
  function Bd(t) {
    return ((t >>>= 0), t === 0 ? 32 : (31 - ((Hd(t) / wd) | 0)) | 0);
  }
  var Nn = 256,
    Tn = 262144,
    zn = 4194304;
  function Nl(t) {
    var e = t & 42;
    if (e !== 0) return e;
    switch (t & -t) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
        return 64;
      case 128:
        return 128;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
        return t & 261888;
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return t & 3932160;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return t & 62914560;
      case 67108864:
        return 67108864;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 0;
      default:
        return t;
    }
  }
  function An(t, e, l) {
    var a = t.pendingLanes;
    if (a === 0) return 0;
    var n = 0,
      u = t.suspendedLanes,
      c = t.pingedLanes;
    t = t.warmLanes;
    var s = a & 134217727;
    return (
      s !== 0
        ? ((a = s & ~u),
          a !== 0 ? (n = Nl(a)) : ((c &= s), c !== 0 ? (n = Nl(c)) : l || ((l = s & ~t), l !== 0 && (n = Nl(l)))))
        : ((s = a & ~u), s !== 0 ? (n = Nl(s)) : c !== 0 ? (n = Nl(c)) : l || ((l = a & ~t), l !== 0 && (n = Nl(l)))),
      n === 0
        ? 0
        : e !== 0 &&
            e !== n &&
            (e & u) === 0 &&
            ((u = n & -n), (l = e & -e), u >= l || (u === 32 && (l & 4194048) !== 0))
          ? e
          : n
    );
  }
  function Ma(t, e) {
    return (t.pendingLanes & ~(t.suspendedLanes & ~t.pingedLanes) & e) === 0;
  }
  function qd(t, e) {
    switch (t) {
      case 1:
      case 2:
      case 4:
      case 8:
      case 64:
        return e + 250;
      case 16:
      case 32:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return e + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return -1;
      case 67108864:
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function vs() {
    var t = zn;
    return ((zn <<= 1), (zn & 62914560) === 0 && (zn = 4194304), t);
  }
  function Ku(t) {
    for (var e = [], l = 0; 31 > l; l++) e.push(t);
    return e;
  }
  function Oa(t, e) {
    ((t.pendingLanes |= e), e !== 268435456 && ((t.suspendedLanes = 0), (t.pingedLanes = 0), (t.warmLanes = 0)));
  }
  function Yd(t, e, l, a, n, u) {
    var c = t.pendingLanes;
    ((t.pendingLanes = l),
      (t.suspendedLanes = 0),
      (t.pingedLanes = 0),
      (t.warmLanes = 0),
      (t.expiredLanes &= l),
      (t.entangledLanes &= l),
      (t.errorRecoveryDisabledLanes &= l),
      (t.shellSuspendCounter = 0));
    var s = t.entanglements,
      f = t.expirationTimes,
      g = t.hiddenUpdates;
    for (l = c & ~l; 0 < l; ) {
      var E = 31 - fe(l),
        N = 1 << E;
      ((s[E] = 0), (f[E] = -1));
      var v = g[E];
      if (v !== null)
        for (g[E] = null, E = 0; E < v.length; E++) {
          var x = v[E];
          x !== null && (x.lane &= -536870913);
        }
      l &= ~N;
    }
    (a !== 0 && bs(t, a, 0), u !== 0 && n === 0 && t.tag !== 0 && (t.suspendedLanes |= u & ~(c & ~e)));
  }
  function bs(t, e, l) {
    ((t.pendingLanes |= e), (t.suspendedLanes &= ~e));
    var a = 31 - fe(e);
    ((t.entangledLanes |= e), (t.entanglements[a] = t.entanglements[a] | 1073741824 | (l & 261930)));
  }
  function xs(t, e) {
    var l = (t.entangledLanes |= e);
    for (t = t.entanglements; l; ) {
      var a = 31 - fe(l),
        n = 1 << a;
      ((n & e) | (t[a] & e) && (t[a] |= e), (l &= ~n));
    }
  }
  function ps(t, e) {
    var l = e & -e;
    return ((l = (l & 42) !== 0 ? 1 : Ju(l)), (l & (t.suspendedLanes | e)) !== 0 ? 0 : l);
  }
  function Ju(t) {
    switch (t) {
      case 2:
        t = 1;
        break;
      case 8:
        t = 4;
        break;
      case 32:
        t = 16;
        break;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        t = 128;
        break;
      case 268435456:
        t = 134217728;
        break;
      default:
        t = 0;
    }
    return t;
  }
  function ku(t) {
    return ((t &= -t), 2 < t ? (8 < t ? ((t & 134217727) !== 0 ? 32 : 268435456) : 8) : 2);
  }
  function Ss() {
    var t = M.p;
    return t !== 0 ? t : ((t = window.event), t === void 0 ? 32 : sd(t.type));
  }
  function Es(t, e) {
    var l = M.p;
    try {
      return ((M.p = t), e());
    } finally {
      M.p = l;
    }
  }
  var Pe = Math.random().toString(36).slice(2),
    Zt = '__reactFiber$' + Pe,
    te = '__reactProps$' + Pe,
    Ql = '__reactContainer$' + Pe,
    $u = '__reactEvents$' + Pe,
    Gd = '__reactListeners$' + Pe,
    Xd = '__reactHandles$' + Pe,
    js = '__reactResources$' + Pe,
    Ca = '__reactMarker$' + Pe;
  function Wu(t) {
    (delete t[Zt], delete t[te], delete t[$u], delete t[Gd], delete t[Xd]);
  }
  function Ll(t) {
    var e = t[Zt];
    if (e) return e;
    for (var l = t.parentNode; l; ) {
      if ((e = l[Ql] || l[Zt])) {
        if (((l = e.alternate), e.child !== null || (l !== null && l.child !== null)))
          for (t = Ko(t); t !== null; ) {
            if ((l = t[Zt])) return l;
            t = Ko(t);
          }
        return e;
      }
      ((t = l), (l = t.parentNode));
    }
    return null;
  }
  function Zl(t) {
    if ((t = t[Zt] || t[Ql])) {
      var e = t.tag;
      if (e === 5 || e === 6 || e === 13 || e === 31 || e === 26 || e === 27 || e === 3) return t;
    }
    return null;
  }
  function _a(t) {
    var e = t.tag;
    if (e === 5 || e === 26 || e === 27 || e === 6) return t.stateNode;
    throw Error(d(33));
  }
  function Vl(t) {
    var e = t[js];
    return (e || (e = t[js] = { hoistableStyles: new Map(), hoistableScripts: new Map() }), e);
  }
  function Qt(t) {
    t[Ca] = !0;
  }
  var Ns = new Set(),
    Ts = {};
  function Tl(t, e) {
    (Kl(t, e), Kl(t + 'Capture', e));
  }
  function Kl(t, e) {
    for (Ts[t] = e, t = 0; t < e.length; t++) Ns.add(e[t]);
  }
  var Qd = RegExp(
      '^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$'
    ),
    zs = {},
    As = {};
  function Ld(t) {
    return Lu.call(As, t) ? !0 : Lu.call(zs, t) ? !1 : Qd.test(t) ? (As[t] = !0) : ((zs[t] = !0), !1);
  }
  function Mn(t, e, l) {
    if (Ld(e))
      if (l === null) t.removeAttribute(e);
      else {
        switch (typeof l) {
          case 'undefined':
          case 'function':
          case 'symbol':
            t.removeAttribute(e);
            return;
          case 'boolean':
            var a = e.toLowerCase().slice(0, 5);
            if (a !== 'data-' && a !== 'aria-') {
              t.removeAttribute(e);
              return;
            }
        }
        t.setAttribute(e, '' + l);
      }
  }
  function On(t, e, l) {
    if (l === null) t.removeAttribute(e);
    else {
      switch (typeof l) {
        case 'undefined':
        case 'function':
        case 'symbol':
        case 'boolean':
          t.removeAttribute(e);
          return;
      }
      t.setAttribute(e, '' + l);
    }
  }
  function Re(t, e, l, a) {
    if (a === null) t.removeAttribute(l);
    else {
      switch (typeof a) {
        case 'undefined':
        case 'function':
        case 'symbol':
        case 'boolean':
          t.removeAttribute(l);
          return;
      }
      t.setAttributeNS(e, l, '' + a);
    }
  }
  function ve(t) {
    switch (typeof t) {
      case 'bigint':
      case 'boolean':
      case 'number':
      case 'string':
      case 'undefined':
        return t;
      case 'object':
        return t;
      default:
        return '';
    }
  }
  function Ms(t) {
    var e = t.type;
    return (t = t.nodeName) && t.toLowerCase() === 'input' && (e === 'checkbox' || e === 'radio');
  }
  function Zd(t, e, l) {
    var a = Object.getOwnPropertyDescriptor(t.constructor.prototype, e);
    if (!t.hasOwnProperty(e) && typeof a < 'u' && typeof a.get == 'function' && typeof a.set == 'function') {
      var n = a.get,
        u = a.set;
      return (
        Object.defineProperty(t, e, {
          configurable: !0,
          get: function () {
            return n.call(this);
          },
          set: function (c) {
            ((l = '' + c), u.call(this, c));
          },
        }),
        Object.defineProperty(t, e, { enumerable: a.enumerable }),
        {
          getValue: function () {
            return l;
          },
          setValue: function (c) {
            l = '' + c;
          },
          stopTracking: function () {
            ((t._valueTracker = null), delete t[e]);
          },
        }
      );
    }
  }
  function Fu(t) {
    if (!t._valueTracker) {
      var e = Ms(t) ? 'checked' : 'value';
      t._valueTracker = Zd(t, e, '' + t[e]);
    }
  }
  function Os(t) {
    if (!t) return !1;
    var e = t._valueTracker;
    if (!e) return !0;
    var l = e.getValue(),
      a = '';
    return (t && (a = Ms(t) ? (t.checked ? 'true' : 'false') : t.value), (t = a), t !== l ? (e.setValue(t), !0) : !1);
  }
  function Cn(t) {
    if (((t = t || (typeof document < 'u' ? document : void 0)), typeof t > 'u')) return null;
    try {
      return t.activeElement || t.body;
    } catch {
      return t.body;
    }
  }
  var Vd = /[\n"\\]/g;
  function be(t) {
    return t.replace(Vd, function (e) {
      return '\\' + e.charCodeAt(0).toString(16) + ' ';
    });
  }
  function Iu(t, e, l, a, n, u, c, s) {
    ((t.name = ''),
      c != null && typeof c != 'function' && typeof c != 'symbol' && typeof c != 'boolean'
        ? (t.type = c)
        : t.removeAttribute('type'),
      e != null
        ? c === 'number'
          ? ((e === 0 && t.value === '') || t.value != e) && (t.value = '' + ve(e))
          : t.value !== '' + ve(e) && (t.value = '' + ve(e))
        : (c !== 'submit' && c !== 'reset') || t.removeAttribute('value'),
      e != null ? Pu(t, c, ve(e)) : l != null ? Pu(t, c, ve(l)) : a != null && t.removeAttribute('value'),
      n == null && u != null && (t.defaultChecked = !!u),
      n != null && (t.checked = n && typeof n != 'function' && typeof n != 'symbol'),
      s != null && typeof s != 'function' && typeof s != 'symbol' && typeof s != 'boolean'
        ? (t.name = '' + ve(s))
        : t.removeAttribute('name'));
  }
  function Cs(t, e, l, a, n, u, c, s) {
    if (
      (u != null && typeof u != 'function' && typeof u != 'symbol' && typeof u != 'boolean' && (t.type = u),
      e != null || l != null)
    ) {
      if (!((u !== 'submit' && u !== 'reset') || e != null)) {
        Fu(t);
        return;
      }
      ((l = l != null ? '' + ve(l) : ''),
        (e = e != null ? '' + ve(e) : l),
        s || e === t.value || (t.value = e),
        (t.defaultValue = e));
    }
    ((a = a ?? n),
      (a = typeof a != 'function' && typeof a != 'symbol' && !!a),
      (t.checked = s ? t.checked : !!a),
      (t.defaultChecked = !!a),
      c != null && typeof c != 'function' && typeof c != 'symbol' && typeof c != 'boolean' && (t.name = c),
      Fu(t));
  }
  function Pu(t, e, l) {
    (e === 'number' && Cn(t.ownerDocument) === t) || t.defaultValue === '' + l || (t.defaultValue = '' + l);
  }
  function Jl(t, e, l, a) {
    if (((t = t.options), e)) {
      e = {};
      for (var n = 0; n < l.length; n++) e['$' + l[n]] = !0;
      for (l = 0; l < t.length; l++)
        ((n = e.hasOwnProperty('$' + t[l].value)),
          t[l].selected !== n && (t[l].selected = n),
          n && a && (t[l].defaultSelected = !0));
    } else {
      for (l = '' + ve(l), e = null, n = 0; n < t.length; n++) {
        if (t[n].value === l) {
          ((t[n].selected = !0), a && (t[n].defaultSelected = !0));
          return;
        }
        e !== null || t[n].disabled || (e = t[n]);
      }
      e !== null && (e.selected = !0);
    }
  }
  function _s(t, e, l) {
    if (e != null && ((e = '' + ve(e)), e !== t.value && (t.value = e), l == null)) {
      t.defaultValue !== e && (t.defaultValue = e);
      return;
    }
    t.defaultValue = l != null ? '' + ve(l) : '';
  }
  function Ds(t, e, l, a) {
    if (e == null) {
      if (a != null) {
        if (l != null) throw Error(d(92));
        if (_(a)) {
          if (1 < a.length) throw Error(d(93));
          a = a[0];
        }
        l = a;
      }
      (l == null && (l = ''), (e = l));
    }
    ((l = ve(e)), (t.defaultValue = l), (a = t.textContent), a === l && a !== '' && a !== null && (t.value = a), Fu(t));
  }
  function kl(t, e) {
    if (e) {
      var l = t.firstChild;
      if (l && l === t.lastChild && l.nodeType === 3) {
        l.nodeValue = e;
        return;
      }
    }
    t.textContent = e;
  }
  var Kd = new Set(
    'animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp'.split(
      ' '
    )
  );
  function Us(t, e, l) {
    var a = e.indexOf('--') === 0;
    l == null || typeof l == 'boolean' || l === ''
      ? a
        ? t.setProperty(e, '')
        : e === 'float'
          ? (t.cssFloat = '')
          : (t[e] = '')
      : a
        ? t.setProperty(e, l)
        : typeof l != 'number' || l === 0 || Kd.has(e)
          ? e === 'float'
            ? (t.cssFloat = l)
            : (t[e] = ('' + l).trim())
          : (t[e] = l + 'px');
  }
  function Rs(t, e, l) {
    if (e != null && typeof e != 'object') throw Error(d(62));
    if (((t = t.style), l != null)) {
      for (var a in l)
        !l.hasOwnProperty(a) ||
          (e != null && e.hasOwnProperty(a)) ||
          (a.indexOf('--') === 0 ? t.setProperty(a, '') : a === 'float' ? (t.cssFloat = '') : (t[a] = ''));
      for (var n in e) ((a = e[n]), e.hasOwnProperty(n) && l[n] !== a && Us(t, n, a));
    } else for (var u in e) e.hasOwnProperty(u) && Us(t, u, e[u]);
  }
  function tc(t) {
    if (t.indexOf('-') === -1) return !1;
    switch (t) {
      case 'annotation-xml':
      case 'color-profile':
      case 'font-face':
      case 'font-face-src':
      case 'font-face-uri':
      case 'font-face-format':
      case 'font-face-name':
      case 'missing-glyph':
        return !1;
      default:
        return !0;
    }
  }
  var Jd = new Map([
      ['acceptCharset', 'accept-charset'],
      ['htmlFor', 'for'],
      ['httpEquiv', 'http-equiv'],
      ['crossOrigin', 'crossorigin'],
      ['accentHeight', 'accent-height'],
      ['alignmentBaseline', 'alignment-baseline'],
      ['arabicForm', 'arabic-form'],
      ['baselineShift', 'baseline-shift'],
      ['capHeight', 'cap-height'],
      ['clipPath', 'clip-path'],
      ['clipRule', 'clip-rule'],
      ['colorInterpolation', 'color-interpolation'],
      ['colorInterpolationFilters', 'color-interpolation-filters'],
      ['colorProfile', 'color-profile'],
      ['colorRendering', 'color-rendering'],
      ['dominantBaseline', 'dominant-baseline'],
      ['enableBackground', 'enable-background'],
      ['fillOpacity', 'fill-opacity'],
      ['fillRule', 'fill-rule'],
      ['floodColor', 'flood-color'],
      ['floodOpacity', 'flood-opacity'],
      ['fontFamily', 'font-family'],
      ['fontSize', 'font-size'],
      ['fontSizeAdjust', 'font-size-adjust'],
      ['fontStretch', 'font-stretch'],
      ['fontStyle', 'font-style'],
      ['fontVariant', 'font-variant'],
      ['fontWeight', 'font-weight'],
      ['glyphName', 'glyph-name'],
      ['glyphOrientationHorizontal', 'glyph-orientation-horizontal'],
      ['glyphOrientationVertical', 'glyph-orientation-vertical'],
      ['horizAdvX', 'horiz-adv-x'],
      ['horizOriginX', 'horiz-origin-x'],
      ['imageRendering', 'image-rendering'],
      ['letterSpacing', 'letter-spacing'],
      ['lightingColor', 'lighting-color'],
      ['markerEnd', 'marker-end'],
      ['markerMid', 'marker-mid'],
      ['markerStart', 'marker-start'],
      ['overlinePosition', 'overline-position'],
      ['overlineThickness', 'overline-thickness'],
      ['paintOrder', 'paint-order'],
      ['panose-1', 'panose-1'],
      ['pointerEvents', 'pointer-events'],
      ['renderingIntent', 'rendering-intent'],
      ['shapeRendering', 'shape-rendering'],
      ['stopColor', 'stop-color'],
      ['stopOpacity', 'stop-opacity'],
      ['strikethroughPosition', 'strikethrough-position'],
      ['strikethroughThickness', 'strikethrough-thickness'],
      ['strokeDasharray', 'stroke-dasharray'],
      ['strokeDashoffset', 'stroke-dashoffset'],
      ['strokeLinecap', 'stroke-linecap'],
      ['strokeLinejoin', 'stroke-linejoin'],
      ['strokeMiterlimit', 'stroke-miterlimit'],
      ['strokeOpacity', 'stroke-opacity'],
      ['strokeWidth', 'stroke-width'],
      ['textAnchor', 'text-anchor'],
      ['textDecoration', 'text-decoration'],
      ['textRendering', 'text-rendering'],
      ['transformOrigin', 'transform-origin'],
      ['underlinePosition', 'underline-position'],
      ['underlineThickness', 'underline-thickness'],
      ['unicodeBidi', 'unicode-bidi'],
      ['unicodeRange', 'unicode-range'],
      ['unitsPerEm', 'units-per-em'],
      ['vAlphabetic', 'v-alphabetic'],
      ['vHanging', 'v-hanging'],
      ['vIdeographic', 'v-ideographic'],
      ['vMathematical', 'v-mathematical'],
      ['vectorEffect', 'vector-effect'],
      ['vertAdvY', 'vert-adv-y'],
      ['vertOriginX', 'vert-origin-x'],
      ['vertOriginY', 'vert-origin-y'],
      ['wordSpacing', 'word-spacing'],
      ['writingMode', 'writing-mode'],
      ['xmlnsXlink', 'xmlns:xlink'],
      ['xHeight', 'x-height'],
    ]),
    kd =
      /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function _n(t) {
    return kd.test('' + t)
      ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')"
      : t;
  }
  function He() {}
  var ec = null;
  function lc(t) {
    return (
      (t = t.target || t.srcElement || window),
      t.correspondingUseElement && (t = t.correspondingUseElement),
      t.nodeType === 3 ? t.parentNode : t
    );
  }
  var $l = null,
    Wl = null;
  function Hs(t) {
    var e = Zl(t);
    if (e && (t = e.stateNode)) {
      var l = t[te] || null;
      t: switch (((t = e.stateNode), e.type)) {
        case 'input':
          if (
            (Iu(t, l.value, l.defaultValue, l.defaultValue, l.checked, l.defaultChecked, l.type, l.name),
            (e = l.name),
            l.type === 'radio' && e != null)
          ) {
            for (l = t; l.parentNode; ) l = l.parentNode;
            for (l = l.querySelectorAll('input[name="' + be('' + e) + '"][type="radio"]'), e = 0; e < l.length; e++) {
              var a = l[e];
              if (a !== t && a.form === t.form) {
                var n = a[te] || null;
                if (!n) throw Error(d(90));
                Iu(a, n.value, n.defaultValue, n.defaultValue, n.checked, n.defaultChecked, n.type, n.name);
              }
            }
            for (e = 0; e < l.length; e++) ((a = l[e]), a.form === t.form && Os(a));
          }
          break t;
        case 'textarea':
          _s(t, l.value, l.defaultValue);
          break t;
        case 'select':
          ((e = l.value), e != null && Jl(t, !!l.multiple, e, !1));
      }
    }
  }
  var ac = !1;
  function ws(t, e, l) {
    if (ac) return t(e, l);
    ac = !0;
    try {
      var a = t(e);
      return a;
    } finally {
      if (((ac = !1), ($l !== null || Wl !== null) && (bu(), $l && ((e = $l), (t = Wl), (Wl = $l = null), Hs(e), t))))
        for (e = 0; e < t.length; e++) Hs(t[e]);
    }
  }
  function Da(t, e) {
    var l = t.stateNode;
    if (l === null) return null;
    var a = l[te] || null;
    if (a === null) return null;
    l = a[e];
    t: switch (e) {
      case 'onClick':
      case 'onClickCapture':
      case 'onDoubleClick':
      case 'onDoubleClickCapture':
      case 'onMouseDown':
      case 'onMouseDownCapture':
      case 'onMouseMove':
      case 'onMouseMoveCapture':
      case 'onMouseUp':
      case 'onMouseUpCapture':
      case 'onMouseEnter':
        ((a = !a.disabled) ||
          ((t = t.type), (a = !(t === 'button' || t === 'input' || t === 'select' || t === 'textarea'))),
          (t = !a));
        break t;
      default:
        t = !1;
    }
    if (t) return null;
    if (l && typeof l != 'function') throw Error(d(231, e, typeof l));
    return l;
  }
  var we = !(typeof window > 'u' || typeof window.document > 'u' || typeof window.document.createElement > 'u'),
    nc = !1;
  if (we)
    try {
      var Ua = {};
      (Object.defineProperty(Ua, 'passive', {
        get: function () {
          nc = !0;
        },
      }),
        window.addEventListener('test', Ua, Ua),
        window.removeEventListener('test', Ua, Ua));
    } catch {
      nc = !1;
    }
  var tl = null,
    uc = null,
    Dn = null;
  function Bs() {
    if (Dn) return Dn;
    var t,
      e = uc,
      l = e.length,
      a,
      n = 'value' in tl ? tl.value : tl.textContent,
      u = n.length;
    for (t = 0; t < l && e[t] === n[t]; t++);
    var c = l - t;
    for (a = 1; a <= c && e[l - a] === n[u - a]; a++);
    return (Dn = n.slice(t, 1 < a ? 1 - a : void 0));
  }
  function Un(t) {
    var e = t.keyCode;
    return (
      'charCode' in t ? ((t = t.charCode), t === 0 && e === 13 && (t = 13)) : (t = e),
      t === 10 && (t = 13),
      32 <= t || t === 13 ? t : 0
    );
  }
  function Rn() {
    return !0;
  }
  function qs() {
    return !1;
  }
  function ee(t) {
    function e(l, a, n, u, c) {
      ((this._reactName = l),
        (this._targetInst = n),
        (this.type = a),
        (this.nativeEvent = u),
        (this.target = c),
        (this.currentTarget = null));
      for (var s in t) t.hasOwnProperty(s) && ((l = t[s]), (this[s] = l ? l(u) : u[s]));
      return (
        (this.isDefaultPrevented = (u.defaultPrevented != null ? u.defaultPrevented : u.returnValue === !1) ? Rn : qs),
        (this.isPropagationStopped = qs),
        this
      );
    }
    return (
      R(e.prototype, {
        preventDefault: function () {
          this.defaultPrevented = !0;
          var l = this.nativeEvent;
          l &&
            (l.preventDefault ? l.preventDefault() : typeof l.returnValue != 'unknown' && (l.returnValue = !1),
            (this.isDefaultPrevented = Rn));
        },
        stopPropagation: function () {
          var l = this.nativeEvent;
          l &&
            (l.stopPropagation ? l.stopPropagation() : typeof l.cancelBubble != 'unknown' && (l.cancelBubble = !0),
            (this.isPropagationStopped = Rn));
        },
        persist: function () {},
        isPersistent: Rn,
      }),
      e
    );
  }
  var zl = {
      eventPhase: 0,
      bubbles: 0,
      cancelable: 0,
      timeStamp: function (t) {
        return t.timeStamp || Date.now();
      },
      defaultPrevented: 0,
      isTrusted: 0,
    },
    Hn = ee(zl),
    Ra = R({}, zl, { view: 0, detail: 0 }),
    $d = ee(Ra),
    cc,
    ic,
    Ha,
    wn = R({}, Ra, {
      screenX: 0,
      screenY: 0,
      clientX: 0,
      clientY: 0,
      pageX: 0,
      pageY: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      getModifierState: fc,
      button: 0,
      buttons: 0,
      relatedTarget: function (t) {
        return t.relatedTarget === void 0
          ? t.fromElement === t.srcElement
            ? t.toElement
            : t.fromElement
          : t.relatedTarget;
      },
      movementX: function (t) {
        return 'movementX' in t
          ? t.movementX
          : (t !== Ha &&
              (Ha && t.type === 'mousemove'
                ? ((cc = t.screenX - Ha.screenX), (ic = t.screenY - Ha.screenY))
                : (ic = cc = 0),
              (Ha = t)),
            cc);
      },
      movementY: function (t) {
        return 'movementY' in t ? t.movementY : ic;
      },
    }),
    Ys = ee(wn),
    Wd = R({}, wn, { dataTransfer: 0 }),
    Fd = ee(Wd),
    Id = R({}, Ra, { relatedTarget: 0 }),
    sc = ee(Id),
    Pd = R({}, zl, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
    t0 = ee(Pd),
    e0 = R({}, zl, {
      clipboardData: function (t) {
        return 'clipboardData' in t ? t.clipboardData : window.clipboardData;
      },
    }),
    l0 = ee(e0),
    a0 = R({}, zl, { data: 0 }),
    Gs = ee(a0),
    n0 = {
      Esc: 'Escape',
      Spacebar: ' ',
      Left: 'ArrowLeft',
      Up: 'ArrowUp',
      Right: 'ArrowRight',
      Down: 'ArrowDown',
      Del: 'Delete',
      Win: 'OS',
      Menu: 'ContextMenu',
      Apps: 'ContextMenu',
      Scroll: 'ScrollLock',
      MozPrintableKey: 'Unidentified',
    },
    u0 = {
      8: 'Backspace',
      9: 'Tab',
      12: 'Clear',
      13: 'Enter',
      16: 'Shift',
      17: 'Control',
      18: 'Alt',
      19: 'Pause',
      20: 'CapsLock',
      27: 'Escape',
      32: ' ',
      33: 'PageUp',
      34: 'PageDown',
      35: 'End',
      36: 'Home',
      37: 'ArrowLeft',
      38: 'ArrowUp',
      39: 'ArrowRight',
      40: 'ArrowDown',
      45: 'Insert',
      46: 'Delete',
      112: 'F1',
      113: 'F2',
      114: 'F3',
      115: 'F4',
      116: 'F5',
      117: 'F6',
      118: 'F7',
      119: 'F8',
      120: 'F9',
      121: 'F10',
      122: 'F11',
      123: 'F12',
      144: 'NumLock',
      145: 'ScrollLock',
      224: 'Meta',
    },
    c0 = { Alt: 'altKey', Control: 'ctrlKey', Meta: 'metaKey', Shift: 'shiftKey' };
  function i0(t) {
    var e = this.nativeEvent;
    return e.getModifierState ? e.getModifierState(t) : (t = c0[t]) ? !!e[t] : !1;
  }
  function fc() {
    return i0;
  }
  var s0 = R({}, Ra, {
      key: function (t) {
        if (t.key) {
          var e = n0[t.key] || t.key;
          if (e !== 'Unidentified') return e;
        }
        return t.type === 'keypress'
          ? ((t = Un(t)), t === 13 ? 'Enter' : String.fromCharCode(t))
          : t.type === 'keydown' || t.type === 'keyup'
            ? u0[t.keyCode] || 'Unidentified'
            : '';
      },
      code: 0,
      location: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      repeat: 0,
      locale: 0,
      getModifierState: fc,
      charCode: function (t) {
        return t.type === 'keypress' ? Un(t) : 0;
      },
      keyCode: function (t) {
        return t.type === 'keydown' || t.type === 'keyup' ? t.keyCode : 0;
      },
      which: function (t) {
        return t.type === 'keypress' ? Un(t) : t.type === 'keydown' || t.type === 'keyup' ? t.keyCode : 0;
      },
    }),
    f0 = ee(s0),
    r0 = R({}, wn, {
      pointerId: 0,
      width: 0,
      height: 0,
      pressure: 0,
      tangentialPressure: 0,
      tiltX: 0,
      tiltY: 0,
      twist: 0,
      pointerType: 0,
      isPrimary: 0,
    }),
    Xs = ee(r0),
    o0 = R({}, Ra, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: fc,
    }),
    d0 = ee(o0),
    m0 = R({}, zl, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
    h0 = ee(m0),
    y0 = R({}, wn, {
      deltaX: function (t) {
        return 'deltaX' in t ? t.deltaX : 'wheelDeltaX' in t ? -t.wheelDeltaX : 0;
      },
      deltaY: function (t) {
        return 'deltaY' in t ? t.deltaY : 'wheelDeltaY' in t ? -t.wheelDeltaY : 'wheelDelta' in t ? -t.wheelDelta : 0;
      },
      deltaZ: 0,
      deltaMode: 0,
    }),
    g0 = ee(y0),
    v0 = R({}, zl, { newState: 0, oldState: 0 }),
    b0 = ee(v0),
    x0 = [9, 13, 27, 32],
    rc = we && 'CompositionEvent' in window,
    wa = null;
  we && 'documentMode' in document && (wa = document.documentMode);
  var p0 = we && 'TextEvent' in window && !wa,
    Qs = we && (!rc || (wa && 8 < wa && 11 >= wa)),
    Ls = ' ',
    Zs = !1;
  function Vs(t, e) {
    switch (t) {
      case 'keyup':
        return x0.indexOf(e.keyCode) !== -1;
      case 'keydown':
        return e.keyCode !== 229;
      case 'keypress':
      case 'mousedown':
      case 'focusout':
        return !0;
      default:
        return !1;
    }
  }
  function Ks(t) {
    return ((t = t.detail), typeof t == 'object' && 'data' in t ? t.data : null);
  }
  var Fl = !1;
  function S0(t, e) {
    switch (t) {
      case 'compositionend':
        return Ks(e);
      case 'keypress':
        return e.which !== 32 ? null : ((Zs = !0), Ls);
      case 'textInput':
        return ((t = e.data), t === Ls && Zs ? null : t);
      default:
        return null;
    }
  }
  function E0(t, e) {
    if (Fl)
      return t === 'compositionend' || (!rc && Vs(t, e)) ? ((t = Bs()), (Dn = uc = tl = null), (Fl = !1), t) : null;
    switch (t) {
      case 'paste':
        return null;
      case 'keypress':
        if (!(e.ctrlKey || e.altKey || e.metaKey) || (e.ctrlKey && e.altKey)) {
          if (e.char && 1 < e.char.length) return e.char;
          if (e.which) return String.fromCharCode(e.which);
        }
        return null;
      case 'compositionend':
        return Qs && e.locale !== 'ko' ? null : e.data;
      default:
        return null;
    }
  }
  var j0 = {
    color: !0,
    date: !0,
    datetime: !0,
    'datetime-local': !0,
    email: !0,
    month: !0,
    number: !0,
    password: !0,
    range: !0,
    search: !0,
    tel: !0,
    text: !0,
    time: !0,
    url: !0,
    week: !0,
  };
  function Js(t) {
    var e = t && t.nodeName && t.nodeName.toLowerCase();
    return e === 'input' ? !!j0[t.type] : e === 'textarea';
  }
  function ks(t, e, l, a) {
    ($l ? (Wl ? Wl.push(a) : (Wl = [a])) : ($l = a),
      (e = Tu(e, 'onChange')),
      0 < e.length && ((l = new Hn('onChange', 'change', null, l, a)), t.push({ event: l, listeners: e })));
  }
  var Ba = null,
    qa = null;
  function N0(t) {
    Do(t, 0);
  }
  function Bn(t) {
    var e = _a(t);
    if (Os(e)) return t;
  }
  function $s(t, e) {
    if (t === 'change') return e;
  }
  var Ws = !1;
  if (we) {
    var oc;
    if (we) {
      var dc = 'oninput' in document;
      if (!dc) {
        var Fs = document.createElement('div');
        (Fs.setAttribute('oninput', 'return;'), (dc = typeof Fs.oninput == 'function'));
      }
      oc = dc;
    } else oc = !1;
    Ws = oc && (!document.documentMode || 9 < document.documentMode);
  }
  function Is() {
    Ba && (Ba.detachEvent('onpropertychange', Ps), (qa = Ba = null));
  }
  function Ps(t) {
    if (t.propertyName === 'value' && Bn(qa)) {
      var e = [];
      (ks(e, qa, t, lc(t)), ws(N0, e));
    }
  }
  function T0(t, e, l) {
    t === 'focusin' ? (Is(), (Ba = e), (qa = l), Ba.attachEvent('onpropertychange', Ps)) : t === 'focusout' && Is();
  }
  function z0(t) {
    if (t === 'selectionchange' || t === 'keyup' || t === 'keydown') return Bn(qa);
  }
  function A0(t, e) {
    if (t === 'click') return Bn(e);
  }
  function M0(t, e) {
    if (t === 'input' || t === 'change') return Bn(e);
  }
  function O0(t, e) {
    return (t === e && (t !== 0 || 1 / t === 1 / e)) || (t !== t && e !== e);
  }
  var re = typeof Object.is == 'function' ? Object.is : O0;
  function Ya(t, e) {
    if (re(t, e)) return !0;
    if (typeof t != 'object' || t === null || typeof e != 'object' || e === null) return !1;
    var l = Object.keys(t),
      a = Object.keys(e);
    if (l.length !== a.length) return !1;
    for (a = 0; a < l.length; a++) {
      var n = l[a];
      if (!Lu.call(e, n) || !re(t[n], e[n])) return !1;
    }
    return !0;
  }
  function tf(t) {
    for (; t && t.firstChild; ) t = t.firstChild;
    return t;
  }
  function ef(t, e) {
    var l = tf(t);
    t = 0;
    for (var a; l; ) {
      if (l.nodeType === 3) {
        if (((a = t + l.textContent.length), t <= e && a >= e)) return { node: l, offset: e - t };
        t = a;
      }
      t: {
        for (; l; ) {
          if (l.nextSibling) {
            l = l.nextSibling;
            break t;
          }
          l = l.parentNode;
        }
        l = void 0;
      }
      l = tf(l);
    }
  }
  function lf(t, e) {
    return t && e
      ? t === e
        ? !0
        : t && t.nodeType === 3
          ? !1
          : e && e.nodeType === 3
            ? lf(t, e.parentNode)
            : 'contains' in t
              ? t.contains(e)
              : t.compareDocumentPosition
                ? !!(t.compareDocumentPosition(e) & 16)
                : !1
      : !1;
  }
  function af(t) {
    t =
      t != null && t.ownerDocument != null && t.ownerDocument.defaultView != null
        ? t.ownerDocument.defaultView
        : window;
    for (var e = Cn(t.document); e instanceof t.HTMLIFrameElement; ) {
      try {
        var l = typeof e.contentWindow.location.href == 'string';
      } catch {
        l = !1;
      }
      if (l) t = e.contentWindow;
      else break;
      e = Cn(t.document);
    }
    return e;
  }
  function mc(t) {
    var e = t && t.nodeName && t.nodeName.toLowerCase();
    return (
      e &&
      ((e === 'input' &&
        (t.type === 'text' || t.type === 'search' || t.type === 'tel' || t.type === 'url' || t.type === 'password')) ||
        e === 'textarea' ||
        t.contentEditable === 'true')
    );
  }
  var C0 = we && 'documentMode' in document && 11 >= document.documentMode,
    Il = null,
    hc = null,
    Ga = null,
    yc = !1;
  function nf(t, e, l) {
    var a = l.window === l ? l.document : l.nodeType === 9 ? l : l.ownerDocument;
    yc ||
      Il == null ||
      Il !== Cn(a) ||
      ((a = Il),
      'selectionStart' in a && mc(a)
        ? (a = { start: a.selectionStart, end: a.selectionEnd })
        : ((a = ((a.ownerDocument && a.ownerDocument.defaultView) || window).getSelection()),
          (a = {
            anchorNode: a.anchorNode,
            anchorOffset: a.anchorOffset,
            focusNode: a.focusNode,
            focusOffset: a.focusOffset,
          })),
      (Ga && Ya(Ga, a)) ||
        ((Ga = a),
        (a = Tu(hc, 'onSelect')),
        0 < a.length &&
          ((e = new Hn('onSelect', 'select', null, e, l)), t.push({ event: e, listeners: a }), (e.target = Il))));
  }
  function Al(t, e) {
    var l = {};
    return ((l[t.toLowerCase()] = e.toLowerCase()), (l['Webkit' + t] = 'webkit' + e), (l['Moz' + t] = 'moz' + e), l);
  }
  var Pl = {
      animationend: Al('Animation', 'AnimationEnd'),
      animationiteration: Al('Animation', 'AnimationIteration'),
      animationstart: Al('Animation', 'AnimationStart'),
      transitionrun: Al('Transition', 'TransitionRun'),
      transitionstart: Al('Transition', 'TransitionStart'),
      transitioncancel: Al('Transition', 'TransitionCancel'),
      transitionend: Al('Transition', 'TransitionEnd'),
    },
    gc = {},
    uf = {};
  we &&
    ((uf = document.createElement('div').style),
    'AnimationEvent' in window ||
      (delete Pl.animationend.animation, delete Pl.animationiteration.animation, delete Pl.animationstart.animation),
    'TransitionEvent' in window || delete Pl.transitionend.transition);
  function Ml(t) {
    if (gc[t]) return gc[t];
    if (!Pl[t]) return t;
    var e = Pl[t],
      l;
    for (l in e) if (e.hasOwnProperty(l) && l in uf) return (gc[t] = e[l]);
    return t;
  }
  var cf = Ml('animationend'),
    sf = Ml('animationiteration'),
    ff = Ml('animationstart'),
    _0 = Ml('transitionrun'),
    D0 = Ml('transitionstart'),
    U0 = Ml('transitioncancel'),
    rf = Ml('transitionend'),
    of = new Map(),
    vc =
      'abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel'.split(
        ' '
      );
  vc.push('scrollEnd');
  function Ae(t, e) {
    (of.set(t, e), Tl(e, [t]));
  }
  var qn =
      typeof reportError == 'function'
        ? reportError
        : function (t) {
            if (typeof window == 'object' && typeof window.ErrorEvent == 'function') {
              var e = new window.ErrorEvent('error', {
                bubbles: !0,
                cancelable: !0,
                message:
                  typeof t == 'object' && t !== null && typeof t.message == 'string' ? String(t.message) : String(t),
                error: t,
              });
              if (!window.dispatchEvent(e)) return;
            } else if (typeof process == 'object' && typeof process.emit == 'function') {
              process.emit('uncaughtException', t);
              return;
            }
            console.error(t);
          },
    xe = [],
    ta = 0,
    bc = 0;
  function Yn() {
    for (var t = ta, e = (bc = ta = 0); e < t; ) {
      var l = xe[e];
      xe[e++] = null;
      var a = xe[e];
      xe[e++] = null;
      var n = xe[e];
      xe[e++] = null;
      var u = xe[e];
      if (((xe[e++] = null), a !== null && n !== null)) {
        var c = a.pending;
        (c === null ? (n.next = n) : ((n.next = c.next), (c.next = n)), (a.pending = n));
      }
      u !== 0 && df(l, n, u);
    }
  }
  function Gn(t, e, l, a) {
    ((xe[ta++] = t),
      (xe[ta++] = e),
      (xe[ta++] = l),
      (xe[ta++] = a),
      (bc |= a),
      (t.lanes |= a),
      (t = t.alternate),
      t !== null && (t.lanes |= a));
  }
  function xc(t, e, l, a) {
    return (Gn(t, e, l, a), Xn(t));
  }
  function Ol(t, e) {
    return (Gn(t, null, null, e), Xn(t));
  }
  function df(t, e, l) {
    t.lanes |= l;
    var a = t.alternate;
    a !== null && (a.lanes |= l);
    for (var n = !1, u = t.return; u !== null; )
      ((u.childLanes |= l),
        (a = u.alternate),
        a !== null && (a.childLanes |= l),
        u.tag === 22 && ((t = u.stateNode), t === null || t._visibility & 1 || (n = !0)),
        (t = u),
        (u = u.return));
    return t.tag === 3
      ? ((u = t.stateNode),
        n &&
          e !== null &&
          ((n = 31 - fe(l)),
          (t = u.hiddenUpdates),
          (a = t[n]),
          a === null ? (t[n] = [e]) : a.push(e),
          (e.lane = l | 536870912)),
        u)
      : null;
  }
  function Xn(t) {
    if (50 < fn) throw ((fn = 0), (Mi = null), Error(d(185)));
    for (var e = t.return; e !== null; ) ((t = e), (e = t.return));
    return t.tag === 3 ? t.stateNode : null;
  }
  var ea = {};
  function R0(t, e, l, a) {
    ((this.tag = t),
      (this.key = l),
      (this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null),
      (this.index = 0),
      (this.refCleanup = this.ref = null),
      (this.pendingProps = e),
      (this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null),
      (this.mode = a),
      (this.subtreeFlags = this.flags = 0),
      (this.deletions = null),
      (this.childLanes = this.lanes = 0),
      (this.alternate = null));
  }
  function oe(t, e, l, a) {
    return new R0(t, e, l, a);
  }
  function pc(t) {
    return ((t = t.prototype), !(!t || !t.isReactComponent));
  }
  function Be(t, e) {
    var l = t.alternate;
    return (
      l === null
        ? ((l = oe(t.tag, e, t.key, t.mode)),
          (l.elementType = t.elementType),
          (l.type = t.type),
          (l.stateNode = t.stateNode),
          (l.alternate = t),
          (t.alternate = l))
        : ((l.pendingProps = e), (l.type = t.type), (l.flags = 0), (l.subtreeFlags = 0), (l.deletions = null)),
      (l.flags = t.flags & 65011712),
      (l.childLanes = t.childLanes),
      (l.lanes = t.lanes),
      (l.child = t.child),
      (l.memoizedProps = t.memoizedProps),
      (l.memoizedState = t.memoizedState),
      (l.updateQueue = t.updateQueue),
      (e = t.dependencies),
      (l.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }),
      (l.sibling = t.sibling),
      (l.index = t.index),
      (l.ref = t.ref),
      (l.refCleanup = t.refCleanup),
      l
    );
  }
  function mf(t, e) {
    t.flags &= 65011714;
    var l = t.alternate;
    return (
      l === null
        ? ((t.childLanes = 0),
          (t.lanes = e),
          (t.child = null),
          (t.subtreeFlags = 0),
          (t.memoizedProps = null),
          (t.memoizedState = null),
          (t.updateQueue = null),
          (t.dependencies = null),
          (t.stateNode = null))
        : ((t.childLanes = l.childLanes),
          (t.lanes = l.lanes),
          (t.child = l.child),
          (t.subtreeFlags = 0),
          (t.deletions = null),
          (t.memoizedProps = l.memoizedProps),
          (t.memoizedState = l.memoizedState),
          (t.updateQueue = l.updateQueue),
          (t.type = l.type),
          (e = l.dependencies),
          (t.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext })),
      t
    );
  }
  function Qn(t, e, l, a, n, u) {
    var c = 0;
    if (((a = t), typeof t == 'function')) pc(t) && (c = 1);
    else if (typeof t == 'string') c = Ym(t, l, G.current) ? 26 : t === 'html' || t === 'head' || t === 'body' ? 27 : 5;
    else
      t: switch (t) {
        case Nt:
          return ((t = oe(31, l, e, n)), (t.elementType = Nt), (t.lanes = u), t);
        case F:
          return Cl(l.children, n, u, e);
        case $:
          ((c = 8), (n |= 24));
          break;
        case p:
          return ((t = oe(12, l, e, n | 2)), (t.elementType = p), (t.lanes = u), t);
        case ut:
          return ((t = oe(13, l, e, n)), (t.elementType = ut), (t.lanes = u), t);
        case At:
          return ((t = oe(19, l, e, n)), (t.elementType = At), (t.lanes = u), t);
        default:
          if (typeof t == 'object' && t !== null)
            switch (t.$$typeof) {
              case U:
                c = 10;
                break t;
              case D:
                c = 9;
                break t;
              case J:
                c = 11;
                break t;
              case k:
                c = 14;
                break t;
              case Ot:
                ((c = 16), (a = null));
                break t;
            }
          ((c = 29), (l = Error(d(130, t === null ? 'null' : typeof t, ''))), (a = null));
      }
    return ((e = oe(c, l, e, n)), (e.elementType = t), (e.type = a), (e.lanes = u), e);
  }
  function Cl(t, e, l, a) {
    return ((t = oe(7, t, a, e)), (t.lanes = l), t);
  }
  function Sc(t, e, l) {
    return ((t = oe(6, t, null, e)), (t.lanes = l), t);
  }
  function hf(t) {
    var e = oe(18, null, null, 0);
    return ((e.stateNode = t), e);
  }
  function Ec(t, e, l) {
    return (
      (e = oe(4, t.children !== null ? t.children : [], t.key, e)),
      (e.lanes = l),
      (e.stateNode = { containerInfo: t.containerInfo, pendingChildren: null, implementation: t.implementation }),
      e
    );
  }
  var yf = new WeakMap();
  function pe(t, e) {
    if (typeof t == 'object' && t !== null) {
      var l = yf.get(t);
      return l !== void 0 ? l : ((e = { value: t, source: e, stack: ms(e) }), yf.set(t, e), e);
    }
    return { value: t, source: e, stack: ms(e) };
  }
  var la = [],
    aa = 0,
    Ln = null,
    Xa = 0,
    Se = [],
    Ee = 0,
    el = null,
    Ce = 1,
    _e = '';
  function qe(t, e) {
    ((la[aa++] = Xa), (la[aa++] = Ln), (Ln = t), (Xa = e));
  }
  function gf(t, e, l) {
    ((Se[Ee++] = Ce), (Se[Ee++] = _e), (Se[Ee++] = el), (el = t));
    var a = Ce;
    t = _e;
    var n = 32 - fe(a) - 1;
    ((a &= ~(1 << n)), (l += 1));
    var u = 32 - fe(e) + n;
    if (30 < u) {
      var c = n - (n % 5);
      ((u = (a & ((1 << c) - 1)).toString(32)),
        (a >>= c),
        (n -= c),
        (Ce = (1 << (32 - fe(e) + n)) | (l << n) | a),
        (_e = u + t));
    } else ((Ce = (1 << u) | (l << n) | a), (_e = t));
  }
  function jc(t) {
    t.return !== null && (qe(t, 1), gf(t, 1, 0));
  }
  function Nc(t) {
    for (; t === Ln; ) ((Ln = la[--aa]), (la[aa] = null), (Xa = la[--aa]), (la[aa] = null));
    for (; t === el; )
      ((el = Se[--Ee]), (Se[Ee] = null), (_e = Se[--Ee]), (Se[Ee] = null), (Ce = Se[--Ee]), (Se[Ee] = null));
  }
  function vf(t, e) {
    ((Se[Ee++] = Ce), (Se[Ee++] = _e), (Se[Ee++] = el), (Ce = e.id), (_e = e.overflow), (el = t));
  }
  var Vt = null,
    Tt = null,
    ot = !1,
    ll = null,
    je = !1,
    Tc = Error(d(519));
  function al(t) {
    var e = Error(d(418, 1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? 'text' : 'HTML', ''));
    throw (Qa(pe(e, t)), Tc);
  }
  function bf(t) {
    var e = t.stateNode,
      l = t.type,
      a = t.memoizedProps;
    switch (((e[Zt] = t), (e[te] = a), l)) {
      case 'dialog':
        (st('cancel', e), st('close', e));
        break;
      case 'iframe':
      case 'object':
      case 'embed':
        st('load', e);
        break;
      case 'video':
      case 'audio':
        for (l = 0; l < on.length; l++) st(on[l], e);
        break;
      case 'source':
        st('error', e);
        break;
      case 'img':
      case 'image':
      case 'link':
        (st('error', e), st('load', e));
        break;
      case 'details':
        st('toggle', e);
        break;
      case 'input':
        (st('invalid', e), Cs(e, a.value, a.defaultValue, a.checked, a.defaultChecked, a.type, a.name, !0));
        break;
      case 'select':
        st('invalid', e);
        break;
      case 'textarea':
        (st('invalid', e), Ds(e, a.value, a.defaultValue, a.children));
    }
    ((l = a.children),
      (typeof l != 'string' && typeof l != 'number' && typeof l != 'bigint') ||
      e.textContent === '' + l ||
      a.suppressHydrationWarning === !0 ||
      wo(e.textContent, l)
        ? (a.popover != null && (st('beforetoggle', e), st('toggle', e)),
          a.onScroll != null && st('scroll', e),
          a.onScrollEnd != null && st('scrollend', e),
          a.onClick != null && (e.onclick = He),
          (e = !0))
        : (e = !1),
      e || al(t, !0));
  }
  function xf(t) {
    for (Vt = t.return; Vt; )
      switch (Vt.tag) {
        case 5:
        case 31:
        case 13:
          je = !1;
          return;
        case 27:
        case 3:
          je = !0;
          return;
        default:
          Vt = Vt.return;
      }
  }
  function na(t) {
    if (t !== Vt) return !1;
    if (!ot) return (xf(t), (ot = !0), !1);
    var e = t.tag,
      l;
    if (
      ((l = e !== 3 && e !== 27) &&
        ((l = e === 5) && ((l = t.type), (l = !(l !== 'form' && l !== 'button') || Li(t.type, t.memoizedProps))),
        (l = !l)),
      l && Tt && al(t),
      xf(t),
      e === 13)
    ) {
      if (((t = t.memoizedState), (t = t !== null ? t.dehydrated : null), !t)) throw Error(d(317));
      Tt = Vo(t);
    } else if (e === 31) {
      if (((t = t.memoizedState), (t = t !== null ? t.dehydrated : null), !t)) throw Error(d(317));
      Tt = Vo(t);
    } else
      e === 27
        ? ((e = Tt), vl(t.type) ? ((t = ki), (ki = null), (Tt = t)) : (Tt = e))
        : (Tt = Vt ? Te(t.stateNode.nextSibling) : null);
    return !0;
  }
  function _l() {
    ((Tt = Vt = null), (ot = !1));
  }
  function zc() {
    var t = ll;
    return (t !== null && (ue === null ? (ue = t) : ue.push.apply(ue, t), (ll = null)), t);
  }
  function Qa(t) {
    ll === null ? (ll = [t]) : ll.push(t);
  }
  var Ac = o(null),
    Dl = null,
    Ye = null;
  function nl(t, e, l) {
    (H(Ac, e._currentValue), (e._currentValue = l));
  }
  function Ge(t) {
    ((t._currentValue = Ac.current), T(Ac));
  }
  function Mc(t, e, l) {
    for (; t !== null; ) {
      var a = t.alternate;
      if (
        ((t.childLanes & e) !== e
          ? ((t.childLanes |= e), a !== null && (a.childLanes |= e))
          : a !== null && (a.childLanes & e) !== e && (a.childLanes |= e),
        t === l)
      )
        break;
      t = t.return;
    }
  }
  function Oc(t, e, l, a) {
    var n = t.child;
    for (n !== null && (n.return = t); n !== null; ) {
      var u = n.dependencies;
      if (u !== null) {
        var c = n.child;
        u = u.firstContext;
        t: for (; u !== null; ) {
          var s = u;
          u = n;
          for (var f = 0; f < e.length; f++)
            if (s.context === e[f]) {
              ((u.lanes |= l), (s = u.alternate), s !== null && (s.lanes |= l), Mc(u.return, l, t), a || (c = null));
              break t;
            }
          u = s.next;
        }
      } else if (n.tag === 18) {
        if (((c = n.return), c === null)) throw Error(d(341));
        ((c.lanes |= l), (u = c.alternate), u !== null && (u.lanes |= l), Mc(c, l, t), (c = null));
      } else c = n.child;
      if (c !== null) c.return = n;
      else
        for (c = n; c !== null; ) {
          if (c === t) {
            c = null;
            break;
          }
          if (((n = c.sibling), n !== null)) {
            ((n.return = c.return), (c = n));
            break;
          }
          c = c.return;
        }
      n = c;
    }
  }
  function ua(t, e, l, a) {
    t = null;
    for (var n = e, u = !1; n !== null; ) {
      if (!u) {
        if ((n.flags & 524288) !== 0) u = !0;
        else if ((n.flags & 262144) !== 0) break;
      }
      if (n.tag === 10) {
        var c = n.alternate;
        if (c === null) throw Error(d(387));
        if (((c = c.memoizedProps), c !== null)) {
          var s = n.type;
          re(n.pendingProps.value, c.value) || (t !== null ? t.push(s) : (t = [s]));
        }
      } else if (n === vt.current) {
        if (((c = n.alternate), c === null)) throw Error(d(387));
        c.memoizedState.memoizedState !== n.memoizedState.memoizedState && (t !== null ? t.push(gn) : (t = [gn]));
      }
      n = n.return;
    }
    (t !== null && Oc(e, t, l, a), (e.flags |= 262144));
  }
  function Zn(t) {
    for (t = t.firstContext; t !== null; ) {
      if (!re(t.context._currentValue, t.memoizedValue)) return !0;
      t = t.next;
    }
    return !1;
  }
  function Ul(t) {
    ((Dl = t), (Ye = null), (t = t.dependencies), t !== null && (t.firstContext = null));
  }
  function Kt(t) {
    return pf(Dl, t);
  }
  function Vn(t, e) {
    return (Dl === null && Ul(t), pf(t, e));
  }
  function pf(t, e) {
    var l = e._currentValue;
    if (((e = { context: e, memoizedValue: l, next: null }), Ye === null)) {
      if (t === null) throw Error(d(308));
      ((Ye = e), (t.dependencies = { lanes: 0, firstContext: e }), (t.flags |= 524288));
    } else Ye = Ye.next = e;
    return l;
  }
  var H0 =
      typeof AbortController < 'u'
        ? AbortController
        : function () {
            var t = [],
              e = (this.signal = {
                aborted: !1,
                addEventListener: function (l, a) {
                  t.push(a);
                },
              });
            this.abort = function () {
              ((e.aborted = !0),
                t.forEach(function (l) {
                  return l();
                }));
            };
          },
    w0 = b.unstable_scheduleCallback,
    B0 = b.unstable_NormalPriority,
    Bt = { $$typeof: U, Consumer: null, Provider: null, _currentValue: null, _currentValue2: null, _threadCount: 0 };
  function Cc() {
    return { controller: new H0(), data: new Map(), refCount: 0 };
  }
  function La(t) {
    (t.refCount--,
      t.refCount === 0 &&
        w0(B0, function () {
          t.controller.abort();
        }));
  }
  var Za = null,
    _c = 0,
    ca = 0,
    ia = null;
  function q0(t, e) {
    if (Za === null) {
      var l = (Za = []);
      ((_c = 0),
        (ca = Ri()),
        (ia = {
          status: 'pending',
          value: void 0,
          then: function (a) {
            l.push(a);
          },
        }));
    }
    return (_c++, e.then(Sf, Sf), e);
  }
  function Sf() {
    if (--_c === 0 && Za !== null) {
      ia !== null && (ia.status = 'fulfilled');
      var t = Za;
      ((Za = null), (ca = 0), (ia = null));
      for (var e = 0; e < t.length; e++) (0, t[e])();
    }
  }
  function Y0(t, e) {
    var l = [],
      a = {
        status: 'pending',
        value: null,
        reason: null,
        then: function (n) {
          l.push(n);
        },
      };
    return (
      t.then(
        function () {
          ((a.status = 'fulfilled'), (a.value = e));
          for (var n = 0; n < l.length; n++) (0, l[n])(e);
        },
        function (n) {
          for (a.status = 'rejected', a.reason = n, n = 0; n < l.length; n++) (0, l[n])(void 0);
        }
      ),
      a
    );
  }
  var Ef = m.S;
  m.S = function (t, e) {
    ((uo = ie()),
      typeof e == 'object' && e !== null && typeof e.then == 'function' && q0(t, e),
      Ef !== null && Ef(t, e));
  };
  var Rl = o(null);
  function Dc() {
    var t = Rl.current;
    return t !== null ? t : jt.pooledCache;
  }
  function Kn(t, e) {
    e === null ? H(Rl, Rl.current) : H(Rl, e.pool);
  }
  function jf() {
    var t = Dc();
    return t === null ? null : { parent: Bt._currentValue, pool: t };
  }
  var sa = Error(d(460)),
    Uc = Error(d(474)),
    Jn = Error(d(542)),
    kn = { then: function () {} };
  function Nf(t) {
    return ((t = t.status), t === 'fulfilled' || t === 'rejected');
  }
  function Tf(t, e, l) {
    switch (((l = t[l]), l === void 0 ? t.push(e) : l !== e && (e.then(He, He), (e = l)), e.status)) {
      case 'fulfilled':
        return e.value;
      case 'rejected':
        throw ((t = e.reason), Af(t), t);
      default:
        if (typeof e.status == 'string') e.then(He, He);
        else {
          if (((t = jt), t !== null && 100 < t.shellSuspendCounter)) throw Error(d(482));
          ((t = e),
            (t.status = 'pending'),
            t.then(
              function (a) {
                if (e.status === 'pending') {
                  var n = e;
                  ((n.status = 'fulfilled'), (n.value = a));
                }
              },
              function (a) {
                if (e.status === 'pending') {
                  var n = e;
                  ((n.status = 'rejected'), (n.reason = a));
                }
              }
            ));
        }
        switch (e.status) {
          case 'fulfilled':
            return e.value;
          case 'rejected':
            throw ((t = e.reason), Af(t), t);
        }
        throw ((wl = e), sa);
    }
  }
  function Hl(t) {
    try {
      var e = t._init;
      return e(t._payload);
    } catch (l) {
      throw l !== null && typeof l == 'object' && typeof l.then == 'function' ? ((wl = l), sa) : l;
    }
  }
  var wl = null;
  function zf() {
    if (wl === null) throw Error(d(459));
    var t = wl;
    return ((wl = null), t);
  }
  function Af(t) {
    if (t === sa || t === Jn) throw Error(d(483));
  }
  var fa = null,
    Va = 0;
  function $n(t) {
    var e = Va;
    return ((Va += 1), fa === null && (fa = []), Tf(fa, t, e));
  }
  function Ka(t, e) {
    ((e = e.props.ref), (t.ref = e !== void 0 ? e : null));
  }
  function Wn(t, e) {
    throw e.$$typeof === Q
      ? Error(d(525))
      : ((t = Object.prototype.toString.call(e)),
        Error(d(31, t === '[object Object]' ? 'object with keys {' + Object.keys(e).join(', ') + '}' : t)));
  }
  function Mf(t) {
    function e(h, r) {
      if (t) {
        var y = h.deletions;
        y === null ? ((h.deletions = [r]), (h.flags |= 16)) : y.push(r);
      }
    }
    function l(h, r) {
      if (!t) return null;
      for (; r !== null; ) (e(h, r), (r = r.sibling));
      return null;
    }
    function a(h) {
      for (var r = new Map(); h !== null; ) (h.key !== null ? r.set(h.key, h) : r.set(h.index, h), (h = h.sibling));
      return r;
    }
    function n(h, r) {
      return ((h = Be(h, r)), (h.index = 0), (h.sibling = null), h);
    }
    function u(h, r, y) {
      return (
        (h.index = y),
        t
          ? ((y = h.alternate),
            y !== null ? ((y = y.index), y < r ? ((h.flags |= 67108866), r) : y) : ((h.flags |= 67108866), r))
          : ((h.flags |= 1048576), r)
      );
    }
    function c(h) {
      return (t && h.alternate === null && (h.flags |= 67108866), h);
    }
    function s(h, r, y, j) {
      return r === null || r.tag !== 6
        ? ((r = Sc(y, h.mode, j)), (r.return = h), r)
        : ((r = n(r, y)), (r.return = h), r);
    }
    function f(h, r, y, j) {
      var L = y.type;
      return L === F
        ? E(h, r, y.props.children, j, y.key)
        : r !== null &&
            (r.elementType === L || (typeof L == 'object' && L !== null && L.$$typeof === Ot && Hl(L) === r.type))
          ? ((r = n(r, y.props)), Ka(r, y), (r.return = h), r)
          : ((r = Qn(y.type, y.key, y.props, null, h.mode, j)), Ka(r, y), (r.return = h), r);
    }
    function g(h, r, y, j) {
      return r === null ||
        r.tag !== 4 ||
        r.stateNode.containerInfo !== y.containerInfo ||
        r.stateNode.implementation !== y.implementation
        ? ((r = Ec(y, h.mode, j)), (r.return = h), r)
        : ((r = n(r, y.children || [])), (r.return = h), r);
    }
    function E(h, r, y, j, L) {
      return r === null || r.tag !== 7
        ? ((r = Cl(y, h.mode, j, L)), (r.return = h), r)
        : ((r = n(r, y)), (r.return = h), r);
    }
    function N(h, r, y) {
      if ((typeof r == 'string' && r !== '') || typeof r == 'number' || typeof r == 'bigint')
        return ((r = Sc('' + r, h.mode, y)), (r.return = h), r);
      if (typeof r == 'object' && r !== null) {
        switch (r.$$typeof) {
          case at:
            return ((y = Qn(r.type, r.key, r.props, null, h.mode, y)), Ka(y, r), (y.return = h), y);
          case et:
            return ((r = Ec(r, h.mode, y)), (r.return = h), r);
          case Ot:
            return ((r = Hl(r)), N(h, r, y));
        }
        if (_(r) || Dt(r)) return ((r = Cl(r, h.mode, y, null)), (r.return = h), r);
        if (typeof r.then == 'function') return N(h, $n(r), y);
        if (r.$$typeof === U) return N(h, Vn(h, r), y);
        Wn(h, r);
      }
      return null;
    }
    function v(h, r, y, j) {
      var L = r !== null ? r.key : null;
      if ((typeof y == 'string' && y !== '') || typeof y == 'number' || typeof y == 'bigint')
        return L !== null ? null : s(h, r, '' + y, j);
      if (typeof y == 'object' && y !== null) {
        switch (y.$$typeof) {
          case at:
            return y.key === L ? f(h, r, y, j) : null;
          case et:
            return y.key === L ? g(h, r, y, j) : null;
          case Ot:
            return ((y = Hl(y)), v(h, r, y, j));
        }
        if (_(y) || Dt(y)) return L !== null ? null : E(h, r, y, j, null);
        if (typeof y.then == 'function') return v(h, r, $n(y), j);
        if (y.$$typeof === U) return v(h, r, Vn(h, y), j);
        Wn(h, y);
      }
      return null;
    }
    function x(h, r, y, j, L) {
      if ((typeof j == 'string' && j !== '') || typeof j == 'number' || typeof j == 'bigint')
        return ((h = h.get(y) || null), s(r, h, '' + j, L));
      if (typeof j == 'object' && j !== null) {
        switch (j.$$typeof) {
          case at:
            return ((h = h.get(j.key === null ? y : j.key) || null), f(r, h, j, L));
          case et:
            return ((h = h.get(j.key === null ? y : j.key) || null), g(r, h, j, L));
          case Ot:
            return ((j = Hl(j)), x(h, r, y, j, L));
        }
        if (_(j) || Dt(j)) return ((h = h.get(y) || null), E(r, h, j, L, null));
        if (typeof j.then == 'function') return x(h, r, y, $n(j), L);
        if (j.$$typeof === U) return x(h, r, y, Vn(r, j), L);
        Wn(r, j);
      }
      return null;
    }
    function Y(h, r, y, j) {
      for (var L = null, mt = null, X = r, lt = (r = 0), rt = null; X !== null && lt < y.length; lt++) {
        X.index > lt ? ((rt = X), (X = null)) : (rt = X.sibling);
        var ht = v(h, X, y[lt], j);
        if (ht === null) {
          X === null && (X = rt);
          break;
        }
        (t && X && ht.alternate === null && e(h, X),
          (r = u(ht, r, lt)),
          mt === null ? (L = ht) : (mt.sibling = ht),
          (mt = ht),
          (X = rt));
      }
      if (lt === y.length) return (l(h, X), ot && qe(h, lt), L);
      if (X === null) {
        for (; lt < y.length; lt++)
          ((X = N(h, y[lt], j)), X !== null && ((r = u(X, r, lt)), mt === null ? (L = X) : (mt.sibling = X), (mt = X)));
        return (ot && qe(h, lt), L);
      }
      for (X = a(X); lt < y.length; lt++)
        ((rt = x(X, h, lt, y[lt], j)),
          rt !== null &&
            (t && rt.alternate !== null && X.delete(rt.key === null ? lt : rt.key),
            (r = u(rt, r, lt)),
            mt === null ? (L = rt) : (mt.sibling = rt),
            (mt = rt)));
      return (
        t &&
          X.forEach(function (El) {
            return e(h, El);
          }),
        ot && qe(h, lt),
        L
      );
    }
    function V(h, r, y, j) {
      if (y == null) throw Error(d(151));
      for (
        var L = null, mt = null, X = r, lt = (r = 0), rt = null, ht = y.next();
        X !== null && !ht.done;
        lt++, ht = y.next()
      ) {
        X.index > lt ? ((rt = X), (X = null)) : (rt = X.sibling);
        var El = v(h, X, ht.value, j);
        if (El === null) {
          X === null && (X = rt);
          break;
        }
        (t && X && El.alternate === null && e(h, X),
          (r = u(El, r, lt)),
          mt === null ? (L = El) : (mt.sibling = El),
          (mt = El),
          (X = rt));
      }
      if (ht.done) return (l(h, X), ot && qe(h, lt), L);
      if (X === null) {
        for (; !ht.done; lt++, ht = y.next())
          ((ht = N(h, ht.value, j)),
            ht !== null && ((r = u(ht, r, lt)), mt === null ? (L = ht) : (mt.sibling = ht), (mt = ht)));
        return (ot && qe(h, lt), L);
      }
      for (X = a(X); !ht.done; lt++, ht = y.next())
        ((ht = x(X, h, lt, ht.value, j)),
          ht !== null &&
            (t && ht.alternate !== null && X.delete(ht.key === null ? lt : ht.key),
            (r = u(ht, r, lt)),
            mt === null ? (L = ht) : (mt.sibling = ht),
            (mt = ht)));
      return (
        t &&
          X.forEach(function (Wm) {
            return e(h, Wm);
          }),
        ot && qe(h, lt),
        L
      );
    }
    function Et(h, r, y, j) {
      if (
        (typeof y == 'object' && y !== null && y.type === F && y.key === null && (y = y.props.children),
        typeof y == 'object' && y !== null)
      ) {
        switch (y.$$typeof) {
          case at:
            t: {
              for (var L = y.key; r !== null; ) {
                if (r.key === L) {
                  if (((L = y.type), L === F)) {
                    if (r.tag === 7) {
                      (l(h, r.sibling), (j = n(r, y.props.children)), (j.return = h), (h = j));
                      break t;
                    }
                  } else if (
                    r.elementType === L ||
                    (typeof L == 'object' && L !== null && L.$$typeof === Ot && Hl(L) === r.type)
                  ) {
                    (l(h, r.sibling), (j = n(r, y.props)), Ka(j, y), (j.return = h), (h = j));
                    break t;
                  }
                  l(h, r);
                  break;
                } else e(h, r);
                r = r.sibling;
              }
              y.type === F
                ? ((j = Cl(y.props.children, h.mode, j, y.key)), (j.return = h), (h = j))
                : ((j = Qn(y.type, y.key, y.props, null, h.mode, j)), Ka(j, y), (j.return = h), (h = j));
            }
            return c(h);
          case et:
            t: {
              for (L = y.key; r !== null; ) {
                if (r.key === L)
                  if (
                    r.tag === 4 &&
                    r.stateNode.containerInfo === y.containerInfo &&
                    r.stateNode.implementation === y.implementation
                  ) {
                    (l(h, r.sibling), (j = n(r, y.children || [])), (j.return = h), (h = j));
                    break t;
                  } else {
                    l(h, r);
                    break;
                  }
                else e(h, r);
                r = r.sibling;
              }
              ((j = Ec(y, h.mode, j)), (j.return = h), (h = j));
            }
            return c(h);
          case Ot:
            return ((y = Hl(y)), Et(h, r, y, j));
        }
        if (_(y)) return Y(h, r, y, j);
        if (Dt(y)) {
          if (((L = Dt(y)), typeof L != 'function')) throw Error(d(150));
          return ((y = L.call(y)), V(h, r, y, j));
        }
        if (typeof y.then == 'function') return Et(h, r, $n(y), j);
        if (y.$$typeof === U) return Et(h, r, Vn(h, y), j);
        Wn(h, y);
      }
      return (typeof y == 'string' && y !== '') || typeof y == 'number' || typeof y == 'bigint'
        ? ((y = '' + y),
          r !== null && r.tag === 6
            ? (l(h, r.sibling), (j = n(r, y)), (j.return = h), (h = j))
            : (l(h, r), (j = Sc(y, h.mode, j)), (j.return = h), (h = j)),
          c(h))
        : l(h, r);
    }
    return function (h, r, y, j) {
      try {
        Va = 0;
        var L = Et(h, r, y, j);
        return ((fa = null), L);
      } catch (X) {
        if (X === sa || X === Jn) throw X;
        var mt = oe(29, X, null, h.mode);
        return ((mt.lanes = j), (mt.return = h), mt);
      } finally {
      }
    };
  }
  var Bl = Mf(!0),
    Of = Mf(!1),
    ul = !1;
  function Rc(t) {
    t.updateQueue = {
      baseState: t.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null,
    };
  }
  function Hc(t, e) {
    ((t = t.updateQueue),
      e.updateQueue === t &&
        (e.updateQueue = {
          baseState: t.baseState,
          firstBaseUpdate: t.firstBaseUpdate,
          lastBaseUpdate: t.lastBaseUpdate,
          shared: t.shared,
          callbacks: null,
        }));
  }
  function cl(t) {
    return { lane: t, tag: 0, payload: null, callback: null, next: null };
  }
  function il(t, e, l) {
    var a = t.updateQueue;
    if (a === null) return null;
    if (((a = a.shared), (gt & 2) !== 0)) {
      var n = a.pending;
      return (
        n === null ? (e.next = e) : ((e.next = n.next), (n.next = e)),
        (a.pending = e),
        (e = Xn(t)),
        df(t, null, l),
        e
      );
    }
    return (Gn(t, a, e, l), Xn(t));
  }
  function Ja(t, e, l) {
    if (((e = e.updateQueue), e !== null && ((e = e.shared), (l & 4194048) !== 0))) {
      var a = e.lanes;
      ((a &= t.pendingLanes), (l |= a), (e.lanes = l), xs(t, l));
    }
  }
  function wc(t, e) {
    var l = t.updateQueue,
      a = t.alternate;
    if (a !== null && ((a = a.updateQueue), l === a)) {
      var n = null,
        u = null;
      if (((l = l.firstBaseUpdate), l !== null)) {
        do {
          var c = { lane: l.lane, tag: l.tag, payload: l.payload, callback: null, next: null };
          (u === null ? (n = u = c) : (u = u.next = c), (l = l.next));
        } while (l !== null);
        u === null ? (n = u = e) : (u = u.next = e);
      } else n = u = e;
      ((l = {
        baseState: a.baseState,
        firstBaseUpdate: n,
        lastBaseUpdate: u,
        shared: a.shared,
        callbacks: a.callbacks,
      }),
        (t.updateQueue = l));
      return;
    }
    ((t = l.lastBaseUpdate), t === null ? (l.firstBaseUpdate = e) : (t.next = e), (l.lastBaseUpdate = e));
  }
  var Bc = !1;
  function ka() {
    if (Bc) {
      var t = ia;
      if (t !== null) throw t;
    }
  }
  function $a(t, e, l, a) {
    Bc = !1;
    var n = t.updateQueue;
    ul = !1;
    var u = n.firstBaseUpdate,
      c = n.lastBaseUpdate,
      s = n.shared.pending;
    if (s !== null) {
      n.shared.pending = null;
      var f = s,
        g = f.next;
      ((f.next = null), c === null ? (u = g) : (c.next = g), (c = f));
      var E = t.alternate;
      E !== null &&
        ((E = E.updateQueue),
        (s = E.lastBaseUpdate),
        s !== c && (s === null ? (E.firstBaseUpdate = g) : (s.next = g), (E.lastBaseUpdate = f)));
    }
    if (u !== null) {
      var N = n.baseState;
      ((c = 0), (E = g = f = null), (s = u));
      do {
        var v = s.lane & -536870913,
          x = v !== s.lane;
        if (x ? (ft & v) === v : (a & v) === v) {
          (v !== 0 && v === ca && (Bc = !0),
            E !== null && (E = E.next = { lane: 0, tag: s.tag, payload: s.payload, callback: null, next: null }));
          t: {
            var Y = t,
              V = s;
            v = e;
            var Et = l;
            switch (V.tag) {
              case 1:
                if (((Y = V.payload), typeof Y == 'function')) {
                  N = Y.call(Et, N, v);
                  break t;
                }
                N = Y;
                break t;
              case 3:
                Y.flags = (Y.flags & -65537) | 128;
              case 0:
                if (((Y = V.payload), (v = typeof Y == 'function' ? Y.call(Et, N, v) : Y), v == null)) break t;
                N = R({}, N, v);
                break t;
              case 2:
                ul = !0;
            }
          }
          ((v = s.callback),
            v !== null &&
              ((t.flags |= 64),
              x && (t.flags |= 8192),
              (x = n.callbacks),
              x === null ? (n.callbacks = [v]) : x.push(v)));
        } else
          ((x = { lane: v, tag: s.tag, payload: s.payload, callback: s.callback, next: null }),
            E === null ? ((g = E = x), (f = N)) : (E = E.next = x),
            (c |= v));
        if (((s = s.next), s === null)) {
          if (((s = n.shared.pending), s === null)) break;
          ((x = s), (s = x.next), (x.next = null), (n.lastBaseUpdate = x), (n.shared.pending = null));
        }
      } while (!0);
      (E === null && (f = N),
        (n.baseState = f),
        (n.firstBaseUpdate = g),
        (n.lastBaseUpdate = E),
        u === null && (n.shared.lanes = 0),
        (dl |= c),
        (t.lanes = c),
        (t.memoizedState = N));
    }
  }
  function Cf(t, e) {
    if (typeof t != 'function') throw Error(d(191, t));
    t.call(e);
  }
  function _f(t, e) {
    var l = t.callbacks;
    if (l !== null) for (t.callbacks = null, t = 0; t < l.length; t++) Cf(l[t], e);
  }
  var ra = o(null),
    Fn = o(0);
  function Df(t, e) {
    ((t = $e), H(Fn, t), H(ra, e), ($e = t | e.baseLanes));
  }
  function qc() {
    (H(Fn, $e), H(ra, ra.current));
  }
  function Yc() {
    (($e = Fn.current), T(ra), T(Fn));
  }
  var de = o(null),
    Ne = null;
  function sl(t) {
    var e = t.alternate;
    (H(Rt, Rt.current & 1),
      H(de, t),
      Ne === null && (e === null || ra.current !== null || e.memoizedState !== null) && (Ne = t));
  }
  function Gc(t) {
    (H(Rt, Rt.current), H(de, t), Ne === null && (Ne = t));
  }
  function Uf(t) {
    t.tag === 22 ? (H(Rt, Rt.current), H(de, t), Ne === null && (Ne = t)) : fl();
  }
  function fl() {
    (H(Rt, Rt.current), H(de, de.current));
  }
  function me(t) {
    (T(de), Ne === t && (Ne = null), T(Rt));
  }
  var Rt = o(0);
  function In(t) {
    for (var e = t; e !== null; ) {
      if (e.tag === 13) {
        var l = e.memoizedState;
        if (l !== null && ((l = l.dehydrated), l === null || Ki(l) || Ji(l))) return e;
      } else if (
        e.tag === 19 &&
        (e.memoizedProps.revealOrder === 'forwards' ||
          e.memoizedProps.revealOrder === 'backwards' ||
          e.memoizedProps.revealOrder === 'unstable_legacy-backwards' ||
          e.memoizedProps.revealOrder === 'together')
      ) {
        if ((e.flags & 128) !== 0) return e;
      } else if (e.child !== null) {
        ((e.child.return = e), (e = e.child));
        continue;
      }
      if (e === t) break;
      for (; e.sibling === null; ) {
        if (e.return === null || e.return === t) return null;
        e = e.return;
      }
      ((e.sibling.return = e.return), (e = e.sibling));
    }
    return null;
  }
  var Xe = 0,
    tt = null,
    pt = null,
    qt = null,
    Pn = !1,
    oa = !1,
    ql = !1,
    tu = 0,
    Wa = 0,
    da = null,
    G0 = 0;
  function Ct() {
    throw Error(d(321));
  }
  function Xc(t, e) {
    if (e === null) return !1;
    for (var l = 0; l < e.length && l < t.length; l++) if (!re(t[l], e[l])) return !1;
    return !0;
  }
  function Qc(t, e, l, a, n, u) {
    return (
      (Xe = u),
      (tt = e),
      (e.memoizedState = null),
      (e.updateQueue = null),
      (e.lanes = 0),
      (m.H = t === null || t.memoizedState === null ? gr : ai),
      (ql = !1),
      (u = l(a, n)),
      (ql = !1),
      oa && (u = Hf(e, l, a, n)),
      Rf(t),
      u
    );
  }
  function Rf(t) {
    m.H = Pa;
    var e = pt !== null && pt.next !== null;
    if (((Xe = 0), (qt = pt = tt = null), (Pn = !1), (Wa = 0), (da = null), e)) throw Error(d(300));
    t === null || Yt || ((t = t.dependencies), t !== null && Zn(t) && (Yt = !0));
  }
  function Hf(t, e, l, a) {
    tt = t;
    var n = 0;
    do {
      if ((oa && (da = null), (Wa = 0), (oa = !1), 25 <= n)) throw Error(d(301));
      if (((n += 1), (qt = pt = null), t.updateQueue != null)) {
        var u = t.updateQueue;
        ((u.lastEffect = null), (u.events = null), (u.stores = null), u.memoCache != null && (u.memoCache.index = 0));
      }
      ((m.H = vr), (u = e(l, a)));
    } while (oa);
    return u;
  }
  function X0() {
    var t = m.H,
      e = t.useState()[0];
    return (
      (e = typeof e.then == 'function' ? Fa(e) : e),
      (t = t.useState()[0]),
      (pt !== null ? pt.memoizedState : null) !== t && (tt.flags |= 1024),
      e
    );
  }
  function Lc() {
    var t = tu !== 0;
    return ((tu = 0), t);
  }
  function Zc(t, e, l) {
    ((e.updateQueue = t.updateQueue), (e.flags &= -2053), (t.lanes &= ~l));
  }
  function Vc(t) {
    if (Pn) {
      for (t = t.memoizedState; t !== null; ) {
        var e = t.queue;
        (e !== null && (e.pending = null), (t = t.next));
      }
      Pn = !1;
    }
    ((Xe = 0), (qt = pt = tt = null), (oa = !1), (Wa = tu = 0), (da = null));
  }
  function It() {
    var t = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return (qt === null ? (tt.memoizedState = qt = t) : (qt = qt.next = t), qt);
  }
  function Ht() {
    if (pt === null) {
      var t = tt.alternate;
      t = t !== null ? t.memoizedState : null;
    } else t = pt.next;
    var e = qt === null ? tt.memoizedState : qt.next;
    if (e !== null) ((qt = e), (pt = t));
    else {
      if (t === null) throw tt.alternate === null ? Error(d(467)) : Error(d(310));
      ((pt = t),
        (t = {
          memoizedState: pt.memoizedState,
          baseState: pt.baseState,
          baseQueue: pt.baseQueue,
          queue: pt.queue,
          next: null,
        }),
        qt === null ? (tt.memoizedState = qt = t) : (qt = qt.next = t));
    }
    return qt;
  }
  function eu() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function Fa(t) {
    var e = Wa;
    return (
      (Wa += 1),
      da === null && (da = []),
      (t = Tf(da, t, e)),
      (e = tt),
      (qt === null ? e.memoizedState : qt.next) === null &&
        ((e = e.alternate), (m.H = e === null || e.memoizedState === null ? gr : ai)),
      t
    );
  }
  function lu(t) {
    if (t !== null && typeof t == 'object') {
      if (typeof t.then == 'function') return Fa(t);
      if (t.$$typeof === U) return Kt(t);
    }
    throw Error(d(438, String(t)));
  }
  function Kc(t) {
    var e = null,
      l = tt.updateQueue;
    if ((l !== null && (e = l.memoCache), e == null)) {
      var a = tt.alternate;
      a !== null &&
        ((a = a.updateQueue),
        a !== null &&
          ((a = a.memoCache),
          a != null &&
            (e = {
              data: a.data.map(function (n) {
                return n.slice();
              }),
              index: 0,
            })));
    }
    if (
      (e == null && (e = { data: [], index: 0 }),
      l === null && ((l = eu()), (tt.updateQueue = l)),
      (l.memoCache = e),
      (l = e.data[e.index]),
      l === void 0)
    )
      for (l = e.data[e.index] = Array(t), a = 0; a < t; a++) l[a] = Pt;
    return (e.index++, l);
  }
  function Qe(t, e) {
    return typeof e == 'function' ? e(t) : e;
  }
  function au(t) {
    var e = Ht();
    return Jc(e, pt, t);
  }
  function Jc(t, e, l) {
    var a = t.queue;
    if (a === null) throw Error(d(311));
    a.lastRenderedReducer = l;
    var n = t.baseQueue,
      u = a.pending;
    if (u !== null) {
      if (n !== null) {
        var c = n.next;
        ((n.next = u.next), (u.next = c));
      }
      ((e.baseQueue = n = u), (a.pending = null));
    }
    if (((u = t.baseState), n === null)) t.memoizedState = u;
    else {
      e = n.next;
      var s = (c = null),
        f = null,
        g = e,
        E = !1;
      do {
        var N = g.lane & -536870913;
        if (N !== g.lane ? (ft & N) === N : (Xe & N) === N) {
          var v = g.revertLane;
          if (v === 0)
            (f !== null &&
              (f = f.next =
                {
                  lane: 0,
                  revertLane: 0,
                  gesture: null,
                  action: g.action,
                  hasEagerState: g.hasEagerState,
                  eagerState: g.eagerState,
                  next: null,
                }),
              N === ca && (E = !0));
          else if ((Xe & v) === v) {
            ((g = g.next), v === ca && (E = !0));
            continue;
          } else
            ((N = {
              lane: 0,
              revertLane: g.revertLane,
              gesture: null,
              action: g.action,
              hasEagerState: g.hasEagerState,
              eagerState: g.eagerState,
              next: null,
            }),
              f === null ? ((s = f = N), (c = u)) : (f = f.next = N),
              (tt.lanes |= v),
              (dl |= v));
          ((N = g.action), ql && l(u, N), (u = g.hasEagerState ? g.eagerState : l(u, N)));
        } else
          ((v = {
            lane: N,
            revertLane: g.revertLane,
            gesture: g.gesture,
            action: g.action,
            hasEagerState: g.hasEagerState,
            eagerState: g.eagerState,
            next: null,
          }),
            f === null ? ((s = f = v), (c = u)) : (f = f.next = v),
            (tt.lanes |= N),
            (dl |= N));
        g = g.next;
      } while (g !== null && g !== e);
      if ((f === null ? (c = u) : (f.next = s), !re(u, t.memoizedState) && ((Yt = !0), E && ((l = ia), l !== null))))
        throw l;
      ((t.memoizedState = u), (t.baseState = c), (t.baseQueue = f), (a.lastRenderedState = u));
    }
    return (n === null && (a.lanes = 0), [t.memoizedState, a.dispatch]);
  }
  function kc(t) {
    var e = Ht(),
      l = e.queue;
    if (l === null) throw Error(d(311));
    l.lastRenderedReducer = t;
    var a = l.dispatch,
      n = l.pending,
      u = e.memoizedState;
    if (n !== null) {
      l.pending = null;
      var c = (n = n.next);
      do ((u = t(u, c.action)), (c = c.next));
      while (c !== n);
      (re(u, e.memoizedState) || (Yt = !0),
        (e.memoizedState = u),
        e.baseQueue === null && (e.baseState = u),
        (l.lastRenderedState = u));
    }
    return [u, a];
  }
  function wf(t, e, l) {
    var a = tt,
      n = Ht(),
      u = ot;
    if (u) {
      if (l === void 0) throw Error(d(407));
      l = l();
    } else l = e();
    var c = !re((pt || n).memoizedState, l);
    if (
      (c && ((n.memoizedState = l), (Yt = !0)),
      (n = n.queue),
      Fc(Yf.bind(null, a, n, t), [t]),
      n.getSnapshot !== e || c || (qt !== null && qt.memoizedState.tag & 1))
    ) {
      if (((a.flags |= 2048), ma(9, { destroy: void 0 }, qf.bind(null, a, n, l, e), null), jt === null))
        throw Error(d(349));
      u || (Xe & 127) !== 0 || Bf(a, e, l);
    }
    return l;
  }
  function Bf(t, e, l) {
    ((t.flags |= 16384),
      (t = { getSnapshot: e, value: l }),
      (e = tt.updateQueue),
      e === null
        ? ((e = eu()), (tt.updateQueue = e), (e.stores = [t]))
        : ((l = e.stores), l === null ? (e.stores = [t]) : l.push(t)));
  }
  function qf(t, e, l, a) {
    ((e.value = l), (e.getSnapshot = a), Gf(e) && Xf(t));
  }
  function Yf(t, e, l) {
    return l(function () {
      Gf(e) && Xf(t);
    });
  }
  function Gf(t) {
    var e = t.getSnapshot;
    t = t.value;
    try {
      var l = e();
      return !re(t, l);
    } catch {
      return !0;
    }
  }
  function Xf(t) {
    var e = Ol(t, 2);
    e !== null && ce(e, t, 2);
  }
  function $c(t) {
    var e = It();
    if (typeof t == 'function') {
      var l = t;
      if (((t = l()), ql)) {
        Ie(!0);
        try {
          l();
        } finally {
          Ie(!1);
        }
      }
    }
    return (
      (e.memoizedState = e.baseState = t),
      (e.queue = { pending: null, lanes: 0, dispatch: null, lastRenderedReducer: Qe, lastRenderedState: t }),
      e
    );
  }
  function Qf(t, e, l, a) {
    return ((t.baseState = l), Jc(t, pt, typeof a == 'function' ? a : Qe));
  }
  function Q0(t, e, l, a, n) {
    if (cu(t)) throw Error(d(485));
    if (((t = e.action), t !== null)) {
      var u = {
        payload: n,
        action: t,
        next: null,
        isTransition: !0,
        status: 'pending',
        value: null,
        reason: null,
        listeners: [],
        then: function (c) {
          u.listeners.push(c);
        },
      };
      (m.T !== null ? l(!0) : (u.isTransition = !1),
        a(u),
        (l = e.pending),
        l === null ? ((u.next = e.pending = u), Lf(e, u)) : ((u.next = l.next), (e.pending = l.next = u)));
    }
  }
  function Lf(t, e) {
    var l = e.action,
      a = e.payload,
      n = t.state;
    if (e.isTransition) {
      var u = m.T,
        c = {};
      m.T = c;
      try {
        var s = l(n, a),
          f = m.S;
        (f !== null && f(c, s), Zf(t, e, s));
      } catch (g) {
        Wc(t, e, g);
      } finally {
        (u !== null && c.types !== null && (u.types = c.types), (m.T = u));
      }
    } else
      try {
        ((u = l(n, a)), Zf(t, e, u));
      } catch (g) {
        Wc(t, e, g);
      }
  }
  function Zf(t, e, l) {
    l !== null && typeof l == 'object' && typeof l.then == 'function'
      ? l.then(
          function (a) {
            Vf(t, e, a);
          },
          function (a) {
            return Wc(t, e, a);
          }
        )
      : Vf(t, e, l);
  }
  function Vf(t, e, l) {
    ((e.status = 'fulfilled'),
      (e.value = l),
      Kf(e),
      (t.state = l),
      (e = t.pending),
      e !== null && ((l = e.next), l === e ? (t.pending = null) : ((l = l.next), (e.next = l), Lf(t, l))));
  }
  function Wc(t, e, l) {
    var a = t.pending;
    if (((t.pending = null), a !== null)) {
      a = a.next;
      do ((e.status = 'rejected'), (e.reason = l), Kf(e), (e = e.next));
      while (e !== a);
    }
    t.action = null;
  }
  function Kf(t) {
    t = t.listeners;
    for (var e = 0; e < t.length; e++) (0, t[e])();
  }
  function Jf(t, e) {
    return e;
  }
  function kf(t, e) {
    if (ot) {
      var l = jt.formState;
      if (l !== null) {
        t: {
          var a = tt;
          if (ot) {
            if (Tt) {
              e: {
                for (var n = Tt, u = je; n.nodeType !== 8; ) {
                  if (!u) {
                    n = null;
                    break e;
                  }
                  if (((n = Te(n.nextSibling)), n === null)) {
                    n = null;
                    break e;
                  }
                }
                ((u = n.data), (n = u === 'F!' || u === 'F' ? n : null));
              }
              if (n) {
                ((Tt = Te(n.nextSibling)), (a = n.data === 'F!'));
                break t;
              }
            }
            al(a);
          }
          a = !1;
        }
        a && (e = l[0]);
      }
    }
    return (
      (l = It()),
      (l.memoizedState = l.baseState = e),
      (a = { pending: null, lanes: 0, dispatch: null, lastRenderedReducer: Jf, lastRenderedState: e }),
      (l.queue = a),
      (l = mr.bind(null, tt, a)),
      (a.dispatch = l),
      (a = $c(!1)),
      (u = li.bind(null, tt, !1, a.queue)),
      (a = It()),
      (n = { state: e, dispatch: null, action: t, pending: null }),
      (a.queue = n),
      (l = Q0.bind(null, tt, n, u, l)),
      (n.dispatch = l),
      (a.memoizedState = t),
      [e, l, !1]
    );
  }
  function $f(t) {
    var e = Ht();
    return Wf(e, pt, t);
  }
  function Wf(t, e, l) {
    if (((e = Jc(t, e, Jf)[0]), (t = au(Qe)[0]), typeof e == 'object' && e !== null && typeof e.then == 'function'))
      try {
        var a = Fa(e);
      } catch (c) {
        throw c === sa ? Jn : c;
      }
    else a = e;
    e = Ht();
    var n = e.queue,
      u = n.dispatch;
    return (
      l !== e.memoizedState && ((tt.flags |= 2048), ma(9, { destroy: void 0 }, L0.bind(null, n, l), null)),
      [a, u, t]
    );
  }
  function L0(t, e) {
    t.action = e;
  }
  function Ff(t) {
    var e = Ht(),
      l = pt;
    if (l !== null) return Wf(e, l, t);
    (Ht(), (e = e.memoizedState), (l = Ht()));
    var a = l.queue.dispatch;
    return ((l.memoizedState = t), [e, a, !1]);
  }
  function ma(t, e, l, a) {
    return (
      (t = { tag: t, create: l, deps: a, inst: e, next: null }),
      (e = tt.updateQueue),
      e === null && ((e = eu()), (tt.updateQueue = e)),
      (l = e.lastEffect),
      l === null ? (e.lastEffect = t.next = t) : ((a = l.next), (l.next = t), (t.next = a), (e.lastEffect = t)),
      t
    );
  }
  function If() {
    return Ht().memoizedState;
  }
  function nu(t, e, l, a) {
    var n = It();
    ((tt.flags |= t), (n.memoizedState = ma(1 | e, { destroy: void 0 }, l, a === void 0 ? null : a)));
  }
  function uu(t, e, l, a) {
    var n = Ht();
    a = a === void 0 ? null : a;
    var u = n.memoizedState.inst;
    pt !== null && a !== null && Xc(a, pt.memoizedState.deps)
      ? (n.memoizedState = ma(e, u, l, a))
      : ((tt.flags |= t), (n.memoizedState = ma(1 | e, u, l, a)));
  }
  function Pf(t, e) {
    nu(8390656, 8, t, e);
  }
  function Fc(t, e) {
    uu(2048, 8, t, e);
  }
  function Z0(t) {
    tt.flags |= 4;
    var e = tt.updateQueue;
    if (e === null) ((e = eu()), (tt.updateQueue = e), (e.events = [t]));
    else {
      var l = e.events;
      l === null ? (e.events = [t]) : l.push(t);
    }
  }
  function tr(t) {
    var e = Ht().memoizedState;
    return (
      Z0({ ref: e, nextImpl: t }),
      function () {
        if ((gt & 2) !== 0) throw Error(d(440));
        return e.impl.apply(void 0, arguments);
      }
    );
  }
  function er(t, e) {
    return uu(4, 2, t, e);
  }
  function lr(t, e) {
    return uu(4, 4, t, e);
  }
  function ar(t, e) {
    if (typeof e == 'function') {
      t = t();
      var l = e(t);
      return function () {
        typeof l == 'function' ? l() : e(null);
      };
    }
    if (e != null)
      return (
        (t = t()),
        (e.current = t),
        function () {
          e.current = null;
        }
      );
  }
  function nr(t, e, l) {
    ((l = l != null ? l.concat([t]) : null), uu(4, 4, ar.bind(null, e, t), l));
  }
  function Ic() {}
  function ur(t, e) {
    var l = Ht();
    e = e === void 0 ? null : e;
    var a = l.memoizedState;
    return e !== null && Xc(e, a[1]) ? a[0] : ((l.memoizedState = [t, e]), t);
  }
  function cr(t, e) {
    var l = Ht();
    e = e === void 0 ? null : e;
    var a = l.memoizedState;
    if (e !== null && Xc(e, a[1])) return a[0];
    if (((a = t()), ql)) {
      Ie(!0);
      try {
        t();
      } finally {
        Ie(!1);
      }
    }
    return ((l.memoizedState = [a, e]), a);
  }
  function Pc(t, e, l) {
    return l === void 0 || ((Xe & 1073741824) !== 0 && (ft & 261930) === 0)
      ? (t.memoizedState = e)
      : ((t.memoizedState = l), (t = io()), (tt.lanes |= t), (dl |= t), l);
  }
  function ir(t, e, l, a) {
    return re(l, e)
      ? l
      : ra.current !== null
        ? ((t = Pc(t, l, a)), re(t, e) || (Yt = !0), t)
        : (Xe & 42) === 0 || ((Xe & 1073741824) !== 0 && (ft & 261930) === 0)
          ? ((Yt = !0), (t.memoizedState = l))
          : ((t = io()), (tt.lanes |= t), (dl |= t), e);
  }
  function sr(t, e, l, a, n) {
    var u = M.p;
    M.p = u !== 0 && 8 > u ? u : 8;
    var c = m.T,
      s = {};
    ((m.T = s), li(t, !1, e, l));
    try {
      var f = n(),
        g = m.S;
      if ((g !== null && g(s, f), f !== null && typeof f == 'object' && typeof f.then == 'function')) {
        var E = Y0(f, a);
        Ia(t, e, E, ge(t));
      } else Ia(t, e, a, ge(t));
    } catch (N) {
      Ia(t, e, { then: function () {}, status: 'rejected', reason: N }, ge());
    } finally {
      ((M.p = u), c !== null && s.types !== null && (c.types = s.types), (m.T = c));
    }
  }
  function V0() {}
  function ti(t, e, l, a) {
    if (t.tag !== 5) throw Error(d(476));
    var n = fr(t).queue;
    sr(
      t,
      n,
      e,
      q,
      l === null
        ? V0
        : function () {
            return (rr(t), l(a));
          }
    );
  }
  function fr(t) {
    var e = t.memoizedState;
    if (e !== null) return e;
    e = {
      memoizedState: q,
      baseState: q,
      baseQueue: null,
      queue: { pending: null, lanes: 0, dispatch: null, lastRenderedReducer: Qe, lastRenderedState: q },
      next: null,
    };
    var l = {};
    return (
      (e.next = {
        memoizedState: l,
        baseState: l,
        baseQueue: null,
        queue: { pending: null, lanes: 0, dispatch: null, lastRenderedReducer: Qe, lastRenderedState: l },
        next: null,
      }),
      (t.memoizedState = e),
      (t = t.alternate),
      t !== null && (t.memoizedState = e),
      e
    );
  }
  function rr(t) {
    var e = fr(t);
    (e.next === null && (e = t.alternate.memoizedState), Ia(t, e.next.queue, {}, ge()));
  }
  function ei() {
    return Kt(gn);
  }
  function or() {
    return Ht().memoizedState;
  }
  function dr() {
    return Ht().memoizedState;
  }
  function K0(t) {
    for (var e = t.return; e !== null; ) {
      switch (e.tag) {
        case 24:
        case 3:
          var l = ge();
          t = cl(l);
          var a = il(e, t, l);
          (a !== null && (ce(a, e, l), Ja(a, e, l)), (e = { cache: Cc() }), (t.payload = e));
          return;
      }
      e = e.return;
    }
  }
  function J0(t, e, l) {
    var a = ge();
    ((l = { lane: a, revertLane: 0, gesture: null, action: l, hasEagerState: !1, eagerState: null, next: null }),
      cu(t) ? hr(e, l) : ((l = xc(t, e, l, a)), l !== null && (ce(l, t, a), yr(l, e, a))));
  }
  function mr(t, e, l) {
    var a = ge();
    Ia(t, e, l, a);
  }
  function Ia(t, e, l, a) {
    var n = { lane: a, revertLane: 0, gesture: null, action: l, hasEagerState: !1, eagerState: null, next: null };
    if (cu(t)) hr(e, n);
    else {
      var u = t.alternate;
      if (t.lanes === 0 && (u === null || u.lanes === 0) && ((u = e.lastRenderedReducer), u !== null))
        try {
          var c = e.lastRenderedState,
            s = u(c, l);
          if (((n.hasEagerState = !0), (n.eagerState = s), re(s, c))) return (Gn(t, e, n, 0), jt === null && Yn(), !1);
        } catch {
        } finally {
        }
      if (((l = xc(t, e, n, a)), l !== null)) return (ce(l, t, a), yr(l, e, a), !0);
    }
    return !1;
  }
  function li(t, e, l, a) {
    if (
      ((a = { lane: 2, revertLane: Ri(), gesture: null, action: a, hasEagerState: !1, eagerState: null, next: null }),
      cu(t))
    ) {
      if (e) throw Error(d(479));
    } else ((e = xc(t, l, a, 2)), e !== null && ce(e, t, 2));
  }
  function cu(t) {
    var e = t.alternate;
    return t === tt || (e !== null && e === tt);
  }
  function hr(t, e) {
    oa = Pn = !0;
    var l = t.pending;
    (l === null ? (e.next = e) : ((e.next = l.next), (l.next = e)), (t.pending = e));
  }
  function yr(t, e, l) {
    if ((l & 4194048) !== 0) {
      var a = e.lanes;
      ((a &= t.pendingLanes), (l |= a), (e.lanes = l), xs(t, l));
    }
  }
  var Pa = {
    readContext: Kt,
    use: lu,
    useCallback: Ct,
    useContext: Ct,
    useEffect: Ct,
    useImperativeHandle: Ct,
    useLayoutEffect: Ct,
    useInsertionEffect: Ct,
    useMemo: Ct,
    useReducer: Ct,
    useRef: Ct,
    useState: Ct,
    useDebugValue: Ct,
    useDeferredValue: Ct,
    useTransition: Ct,
    useSyncExternalStore: Ct,
    useId: Ct,
    useHostTransitionStatus: Ct,
    useFormState: Ct,
    useActionState: Ct,
    useOptimistic: Ct,
    useMemoCache: Ct,
    useCacheRefresh: Ct,
  };
  Pa.useEffectEvent = Ct;
  var gr = {
      readContext: Kt,
      use: lu,
      useCallback: function (t, e) {
        return ((It().memoizedState = [t, e === void 0 ? null : e]), t);
      },
      useContext: Kt,
      useEffect: Pf,
      useImperativeHandle: function (t, e, l) {
        ((l = l != null ? l.concat([t]) : null), nu(4194308, 4, ar.bind(null, e, t), l));
      },
      useLayoutEffect: function (t, e) {
        return nu(4194308, 4, t, e);
      },
      useInsertionEffect: function (t, e) {
        nu(4, 2, t, e);
      },
      useMemo: function (t, e) {
        var l = It();
        e = e === void 0 ? null : e;
        var a = t();
        if (ql) {
          Ie(!0);
          try {
            t();
          } finally {
            Ie(!1);
          }
        }
        return ((l.memoizedState = [a, e]), a);
      },
      useReducer: function (t, e, l) {
        var a = It();
        if (l !== void 0) {
          var n = l(e);
          if (ql) {
            Ie(!0);
            try {
              l(e);
            } finally {
              Ie(!1);
            }
          }
        } else n = e;
        return (
          (a.memoizedState = a.baseState = n),
          (t = { pending: null, lanes: 0, dispatch: null, lastRenderedReducer: t, lastRenderedState: n }),
          (a.queue = t),
          (t = t.dispatch = J0.bind(null, tt, t)),
          [a.memoizedState, t]
        );
      },
      useRef: function (t) {
        var e = It();
        return ((t = { current: t }), (e.memoizedState = t));
      },
      useState: function (t) {
        t = $c(t);
        var e = t.queue,
          l = mr.bind(null, tt, e);
        return ((e.dispatch = l), [t.memoizedState, l]);
      },
      useDebugValue: Ic,
      useDeferredValue: function (t, e) {
        var l = It();
        return Pc(l, t, e);
      },
      useTransition: function () {
        var t = $c(!1);
        return ((t = sr.bind(null, tt, t.queue, !0, !1)), (It().memoizedState = t), [!1, t]);
      },
      useSyncExternalStore: function (t, e, l) {
        var a = tt,
          n = It();
        if (ot) {
          if (l === void 0) throw Error(d(407));
          l = l();
        } else {
          if (((l = e()), jt === null)) throw Error(d(349));
          (ft & 127) !== 0 || Bf(a, e, l);
        }
        n.memoizedState = l;
        var u = { value: l, getSnapshot: e };
        return (
          (n.queue = u),
          Pf(Yf.bind(null, a, u, t), [t]),
          (a.flags |= 2048),
          ma(9, { destroy: void 0 }, qf.bind(null, a, u, l, e), null),
          l
        );
      },
      useId: function () {
        var t = It(),
          e = jt.identifierPrefix;
        if (ot) {
          var l = _e,
            a = Ce;
          ((l = (a & ~(1 << (32 - fe(a) - 1))).toString(32) + l),
            (e = '_' + e + 'R_' + l),
            (l = tu++),
            0 < l && (e += 'H' + l.toString(32)),
            (e += '_'));
        } else ((l = G0++), (e = '_' + e + 'r_' + l.toString(32) + '_'));
        return (t.memoizedState = e);
      },
      useHostTransitionStatus: ei,
      useFormState: kf,
      useActionState: kf,
      useOptimistic: function (t) {
        var e = It();
        e.memoizedState = e.baseState = t;
        var l = { pending: null, lanes: 0, dispatch: null, lastRenderedReducer: null, lastRenderedState: null };
        return ((e.queue = l), (e = li.bind(null, tt, !0, l)), (l.dispatch = e), [t, e]);
      },
      useMemoCache: Kc,
      useCacheRefresh: function () {
        return (It().memoizedState = K0.bind(null, tt));
      },
      useEffectEvent: function (t) {
        var e = It(),
          l = { impl: t };
        return (
          (e.memoizedState = l),
          function () {
            if ((gt & 2) !== 0) throw Error(d(440));
            return l.impl.apply(void 0, arguments);
          }
        );
      },
    },
    ai = {
      readContext: Kt,
      use: lu,
      useCallback: ur,
      useContext: Kt,
      useEffect: Fc,
      useImperativeHandle: nr,
      useInsertionEffect: er,
      useLayoutEffect: lr,
      useMemo: cr,
      useReducer: au,
      useRef: If,
      useState: function () {
        return au(Qe);
      },
      useDebugValue: Ic,
      useDeferredValue: function (t, e) {
        var l = Ht();
        return ir(l, pt.memoizedState, t, e);
      },
      useTransition: function () {
        var t = au(Qe)[0],
          e = Ht().memoizedState;
        return [typeof t == 'boolean' ? t : Fa(t), e];
      },
      useSyncExternalStore: wf,
      useId: or,
      useHostTransitionStatus: ei,
      useFormState: $f,
      useActionState: $f,
      useOptimistic: function (t, e) {
        var l = Ht();
        return Qf(l, pt, t, e);
      },
      useMemoCache: Kc,
      useCacheRefresh: dr,
    };
  ai.useEffectEvent = tr;
  var vr = {
    readContext: Kt,
    use: lu,
    useCallback: ur,
    useContext: Kt,
    useEffect: Fc,
    useImperativeHandle: nr,
    useInsertionEffect: er,
    useLayoutEffect: lr,
    useMemo: cr,
    useReducer: kc,
    useRef: If,
    useState: function () {
      return kc(Qe);
    },
    useDebugValue: Ic,
    useDeferredValue: function (t, e) {
      var l = Ht();
      return pt === null ? Pc(l, t, e) : ir(l, pt.memoizedState, t, e);
    },
    useTransition: function () {
      var t = kc(Qe)[0],
        e = Ht().memoizedState;
      return [typeof t == 'boolean' ? t : Fa(t), e];
    },
    useSyncExternalStore: wf,
    useId: or,
    useHostTransitionStatus: ei,
    useFormState: Ff,
    useActionState: Ff,
    useOptimistic: function (t, e) {
      var l = Ht();
      return pt !== null ? Qf(l, pt, t, e) : ((l.baseState = t), [t, l.queue.dispatch]);
    },
    useMemoCache: Kc,
    useCacheRefresh: dr,
  };
  vr.useEffectEvent = tr;
  function ni(t, e, l, a) {
    ((e = t.memoizedState),
      (l = l(a, e)),
      (l = l == null ? e : R({}, e, l)),
      (t.memoizedState = l),
      t.lanes === 0 && (t.updateQueue.baseState = l));
  }
  var ui = {
    enqueueSetState: function (t, e, l) {
      t = t._reactInternals;
      var a = ge(),
        n = cl(a);
      ((n.payload = e), l != null && (n.callback = l), (e = il(t, n, a)), e !== null && (ce(e, t, a), Ja(e, t, a)));
    },
    enqueueReplaceState: function (t, e, l) {
      t = t._reactInternals;
      var a = ge(),
        n = cl(a);
      ((n.tag = 1),
        (n.payload = e),
        l != null && (n.callback = l),
        (e = il(t, n, a)),
        e !== null && (ce(e, t, a), Ja(e, t, a)));
    },
    enqueueForceUpdate: function (t, e) {
      t = t._reactInternals;
      var l = ge(),
        a = cl(l);
      ((a.tag = 2), e != null && (a.callback = e), (e = il(t, a, l)), e !== null && (ce(e, t, l), Ja(e, t, l)));
    },
  };
  function br(t, e, l, a, n, u, c) {
    return (
      (t = t.stateNode),
      typeof t.shouldComponentUpdate == 'function'
        ? t.shouldComponentUpdate(a, u, c)
        : e.prototype && e.prototype.isPureReactComponent
          ? !Ya(l, a) || !Ya(n, u)
          : !0
    );
  }
  function xr(t, e, l, a) {
    ((t = e.state),
      typeof e.componentWillReceiveProps == 'function' && e.componentWillReceiveProps(l, a),
      typeof e.UNSAFE_componentWillReceiveProps == 'function' && e.UNSAFE_componentWillReceiveProps(l, a),
      e.state !== t && ui.enqueueReplaceState(e, e.state, null));
  }
  function Yl(t, e) {
    var l = e;
    if ('ref' in e) {
      l = {};
      for (var a in e) a !== 'ref' && (l[a] = e[a]);
    }
    if ((t = t.defaultProps)) {
      l === e && (l = R({}, l));
      for (var n in t) l[n] === void 0 && (l[n] = t[n]);
    }
    return l;
  }
  function pr(t) {
    qn(t);
  }
  function Sr(t) {
    console.error(t);
  }
  function Er(t) {
    qn(t);
  }
  function iu(t, e) {
    try {
      var l = t.onUncaughtError;
      l(e.value, { componentStack: e.stack });
    } catch (a) {
      setTimeout(function () {
        throw a;
      });
    }
  }
  function jr(t, e, l) {
    try {
      var a = t.onCaughtError;
      a(l.value, { componentStack: l.stack, errorBoundary: e.tag === 1 ? e.stateNode : null });
    } catch (n) {
      setTimeout(function () {
        throw n;
      });
    }
  }
  function ci(t, e, l) {
    return (
      (l = cl(l)),
      (l.tag = 3),
      (l.payload = { element: null }),
      (l.callback = function () {
        iu(t, e);
      }),
      l
    );
  }
  function Nr(t) {
    return ((t = cl(t)), (t.tag = 3), t);
  }
  function Tr(t, e, l, a) {
    var n = l.type.getDerivedStateFromError;
    if (typeof n == 'function') {
      var u = a.value;
      ((t.payload = function () {
        return n(u);
      }),
        (t.callback = function () {
          jr(e, l, a);
        }));
    }
    var c = l.stateNode;
    c !== null &&
      typeof c.componentDidCatch == 'function' &&
      (t.callback = function () {
        (jr(e, l, a), typeof n != 'function' && (ml === null ? (ml = new Set([this])) : ml.add(this)));
        var s = a.stack;
        this.componentDidCatch(a.value, { componentStack: s !== null ? s : '' });
      });
  }
  function k0(t, e, l, a, n) {
    if (((l.flags |= 32768), a !== null && typeof a == 'object' && typeof a.then == 'function')) {
      if (((e = l.alternate), e !== null && ua(e, l, n, !0), (l = de.current), l !== null)) {
        switch (l.tag) {
          case 31:
          case 13:
            return (
              Ne === null ? xu() : l.alternate === null && _t === 0 && (_t = 3),
              (l.flags &= -257),
              (l.flags |= 65536),
              (l.lanes = n),
              a === kn
                ? (l.flags |= 16384)
                : ((e = l.updateQueue), e === null ? (l.updateQueue = new Set([a])) : e.add(a), _i(t, a, n)),
              !1
            );
          case 22:
            return (
              (l.flags |= 65536),
              a === kn
                ? (l.flags |= 16384)
                : ((e = l.updateQueue),
                  e === null
                    ? ((e = { transitions: null, markerInstances: null, retryQueue: new Set([a]) }),
                      (l.updateQueue = e))
                    : ((l = e.retryQueue), l === null ? (e.retryQueue = new Set([a])) : l.add(a)),
                  _i(t, a, n)),
              !1
            );
        }
        throw Error(d(435, l.tag));
      }
      return (_i(t, a, n), xu(), !1);
    }
    if (ot)
      return (
        (e = de.current),
        e !== null
          ? ((e.flags & 65536) === 0 && (e.flags |= 256),
            (e.flags |= 65536),
            (e.lanes = n),
            a !== Tc && ((t = Error(d(422), { cause: a })), Qa(pe(t, l))))
          : (a !== Tc && ((e = Error(d(423), { cause: a })), Qa(pe(e, l))),
            (t = t.current.alternate),
            (t.flags |= 65536),
            (n &= -n),
            (t.lanes |= n),
            (a = pe(a, l)),
            (n = ci(t.stateNode, a, n)),
            wc(t, n),
            _t !== 4 && (_t = 2)),
        !1
      );
    var u = Error(d(520), { cause: a });
    if (((u = pe(u, l)), sn === null ? (sn = [u]) : sn.push(u), _t !== 4 && (_t = 2), e === null)) return !0;
    ((a = pe(a, l)), (l = e));
    do {
      switch (l.tag) {
        case 3:
          return ((l.flags |= 65536), (t = n & -n), (l.lanes |= t), (t = ci(l.stateNode, a, t)), wc(l, t), !1);
        case 1:
          if (
            ((e = l.type),
            (u = l.stateNode),
            (l.flags & 128) === 0 &&
              (typeof e.getDerivedStateFromError == 'function' ||
                (u !== null && typeof u.componentDidCatch == 'function' && (ml === null || !ml.has(u)))))
          )
            return ((l.flags |= 65536), (n &= -n), (l.lanes |= n), (n = Nr(n)), Tr(n, t, l, a), wc(l, n), !1);
      }
      l = l.return;
    } while (l !== null);
    return !1;
  }
  var ii = Error(d(461)),
    Yt = !1;
  function Jt(t, e, l, a) {
    e.child = t === null ? Of(e, null, l, a) : Bl(e, t.child, l, a);
  }
  function zr(t, e, l, a, n) {
    l = l.render;
    var u = e.ref;
    if ('ref' in a) {
      var c = {};
      for (var s in a) s !== 'ref' && (c[s] = a[s]);
    } else c = a;
    return (
      Ul(e),
      (a = Qc(t, e, l, c, u, n)),
      (s = Lc()),
      t !== null && !Yt ? (Zc(t, e, n), Le(t, e, n)) : (ot && s && jc(e), (e.flags |= 1), Jt(t, e, a, n), e.child)
    );
  }
  function Ar(t, e, l, a, n) {
    if (t === null) {
      var u = l.type;
      return typeof u == 'function' && !pc(u) && u.defaultProps === void 0 && l.compare === null
        ? ((e.tag = 15), (e.type = u), Mr(t, e, u, a, n))
        : ((t = Qn(l.type, null, a, e, e.mode, n)), (t.ref = e.ref), (t.return = e), (e.child = t));
    }
    if (((u = t.child), !yi(t, n))) {
      var c = u.memoizedProps;
      if (((l = l.compare), (l = l !== null ? l : Ya), l(c, a) && t.ref === e.ref)) return Le(t, e, n);
    }
    return ((e.flags |= 1), (t = Be(u, a)), (t.ref = e.ref), (t.return = e), (e.child = t));
  }
  function Mr(t, e, l, a, n) {
    if (t !== null) {
      var u = t.memoizedProps;
      if (Ya(u, a) && t.ref === e.ref)
        if (((Yt = !1), (e.pendingProps = a = u), yi(t, n))) (t.flags & 131072) !== 0 && (Yt = !0);
        else return ((e.lanes = t.lanes), Le(t, e, n));
    }
    return si(t, e, l, a, n);
  }
  function Or(t, e, l, a) {
    var n = a.children,
      u = t !== null ? t.memoizedState : null;
    if (
      (t === null &&
        e.stateNode === null &&
        (e.stateNode = { _visibility: 1, _pendingMarkers: null, _retryCache: null, _transitions: null }),
      a.mode === 'hidden')
    ) {
      if ((e.flags & 128) !== 0) {
        if (((u = u !== null ? u.baseLanes | l : l), t !== null)) {
          for (a = e.child = t.child, n = 0; a !== null; ) ((n = n | a.lanes | a.childLanes), (a = a.sibling));
          a = n & ~u;
        } else ((a = 0), (e.child = null));
        return Cr(t, e, u, l, a);
      }
      if ((l & 536870912) !== 0)
        ((e.memoizedState = { baseLanes: 0, cachePool: null }),
          t !== null && Kn(e, u !== null ? u.cachePool : null),
          u !== null ? Df(e, u) : qc(),
          Uf(e));
      else return ((a = e.lanes = 536870912), Cr(t, e, u !== null ? u.baseLanes | l : l, l, a));
    } else
      u !== null
        ? (Kn(e, u.cachePool), Df(e, u), fl(), (e.memoizedState = null))
        : (t !== null && Kn(e, null), qc(), fl());
    return (Jt(t, e, n, l), e.child);
  }
  function tn(t, e) {
    return (
      (t !== null && t.tag === 22) ||
        e.stateNode !== null ||
        (e.stateNode = { _visibility: 1, _pendingMarkers: null, _retryCache: null, _transitions: null }),
      e.sibling
    );
  }
  function Cr(t, e, l, a, n) {
    var u = Dc();
    return (
      (u = u === null ? null : { parent: Bt._currentValue, pool: u }),
      (e.memoizedState = { baseLanes: l, cachePool: u }),
      t !== null && Kn(e, null),
      qc(),
      Uf(e),
      t !== null && ua(t, e, a, !0),
      (e.childLanes = n),
      null
    );
  }
  function su(t, e) {
    return (
      (e = ru({ mode: e.mode, children: e.children }, t.mode)),
      (e.ref = t.ref),
      (t.child = e),
      (e.return = t),
      e
    );
  }
  function _r(t, e, l) {
    return (Bl(e, t.child, null, l), (t = su(e, e.pendingProps)), (t.flags |= 2), me(e), (e.memoizedState = null), t);
  }
  function $0(t, e, l) {
    var a = e.pendingProps,
      n = (e.flags & 128) !== 0;
    if (((e.flags &= -129), t === null)) {
      if (ot) {
        if (a.mode === 'hidden') return ((t = su(e, a)), (e.lanes = 536870912), tn(null, t));
        if (
          (Gc(e),
          (t = Tt)
            ? ((t = Zo(t, je)),
              (t = t !== null && t.data === '&' ? t : null),
              t !== null &&
                ((e.memoizedState = {
                  dehydrated: t,
                  treeContext: el !== null ? { id: Ce, overflow: _e } : null,
                  retryLane: 536870912,
                  hydrationErrors: null,
                }),
                (l = hf(t)),
                (l.return = e),
                (e.child = l),
                (Vt = e),
                (Tt = null)))
            : (t = null),
          t === null)
        )
          throw al(e);
        return ((e.lanes = 536870912), null);
      }
      return su(e, a);
    }
    var u = t.memoizedState;
    if (u !== null) {
      var c = u.dehydrated;
      if ((Gc(e), n))
        if (e.flags & 256) ((e.flags &= -257), (e = _r(t, e, l)));
        else if (e.memoizedState !== null) ((e.child = t.child), (e.flags |= 128), (e = null));
        else throw Error(d(558));
      else if ((Yt || ua(t, e, l, !1), (n = (l & t.childLanes) !== 0), Yt || n)) {
        if (((a = jt), a !== null && ((c = ps(a, l)), c !== 0 && c !== u.retryLane)))
          throw ((u.retryLane = c), Ol(t, c), ce(a, t, c), ii);
        (xu(), (e = _r(t, e, l)));
      } else
        ((t = u.treeContext),
          (Tt = Te(c.nextSibling)),
          (Vt = e),
          (ot = !0),
          (ll = null),
          (je = !1),
          t !== null && vf(e, t),
          (e = su(e, a)),
          (e.flags |= 4096));
      return e;
    }
    return (
      (t = Be(t.child, { mode: a.mode, children: a.children })),
      (t.ref = e.ref),
      (e.child = t),
      (t.return = e),
      t
    );
  }
  function fu(t, e) {
    var l = e.ref;
    if (l === null) t !== null && t.ref !== null && (e.flags |= 4194816);
    else {
      if (typeof l != 'function' && typeof l != 'object') throw Error(d(284));
      (t === null || t.ref !== l) && (e.flags |= 4194816);
    }
  }
  function si(t, e, l, a, n) {
    return (
      Ul(e),
      (l = Qc(t, e, l, a, void 0, n)),
      (a = Lc()),
      t !== null && !Yt ? (Zc(t, e, n), Le(t, e, n)) : (ot && a && jc(e), (e.flags |= 1), Jt(t, e, l, n), e.child)
    );
  }
  function Dr(t, e, l, a, n, u) {
    return (
      Ul(e),
      (e.updateQueue = null),
      (l = Hf(e, a, l, n)),
      Rf(t),
      (a = Lc()),
      t !== null && !Yt ? (Zc(t, e, u), Le(t, e, u)) : (ot && a && jc(e), (e.flags |= 1), Jt(t, e, l, u), e.child)
    );
  }
  function Ur(t, e, l, a, n) {
    if ((Ul(e), e.stateNode === null)) {
      var u = ea,
        c = l.contextType;
      (typeof c == 'object' && c !== null && (u = Kt(c)),
        (u = new l(a, u)),
        (e.memoizedState = u.state !== null && u.state !== void 0 ? u.state : null),
        (u.updater = ui),
        (e.stateNode = u),
        (u._reactInternals = e),
        (u = e.stateNode),
        (u.props = a),
        (u.state = e.memoizedState),
        (u.refs = {}),
        Rc(e),
        (c = l.contextType),
        (u.context = typeof c == 'object' && c !== null ? Kt(c) : ea),
        (u.state = e.memoizedState),
        (c = l.getDerivedStateFromProps),
        typeof c == 'function' && (ni(e, l, c, a), (u.state = e.memoizedState)),
        typeof l.getDerivedStateFromProps == 'function' ||
          typeof u.getSnapshotBeforeUpdate == 'function' ||
          (typeof u.UNSAFE_componentWillMount != 'function' && typeof u.componentWillMount != 'function') ||
          ((c = u.state),
          typeof u.componentWillMount == 'function' && u.componentWillMount(),
          typeof u.UNSAFE_componentWillMount == 'function' && u.UNSAFE_componentWillMount(),
          c !== u.state && ui.enqueueReplaceState(u, u.state, null),
          $a(e, a, u, n),
          ka(),
          (u.state = e.memoizedState)),
        typeof u.componentDidMount == 'function' && (e.flags |= 4194308),
        (a = !0));
    } else if (t === null) {
      u = e.stateNode;
      var s = e.memoizedProps,
        f = Yl(l, s);
      u.props = f;
      var g = u.context,
        E = l.contextType;
      ((c = ea), typeof E == 'object' && E !== null && (c = Kt(E)));
      var N = l.getDerivedStateFromProps;
      ((E = typeof N == 'function' || typeof u.getSnapshotBeforeUpdate == 'function'),
        (s = e.pendingProps !== s),
        E ||
          (typeof u.UNSAFE_componentWillReceiveProps != 'function' &&
            typeof u.componentWillReceiveProps != 'function') ||
          ((s || g !== c) && xr(e, u, a, c)),
        (ul = !1));
      var v = e.memoizedState;
      ((u.state = v),
        $a(e, a, u, n),
        ka(),
        (g = e.memoizedState),
        s || v !== g || ul
          ? (typeof N == 'function' && (ni(e, l, N, a), (g = e.memoizedState)),
            (f = ul || br(e, l, f, a, v, g, c))
              ? (E ||
                  (typeof u.UNSAFE_componentWillMount != 'function' && typeof u.componentWillMount != 'function') ||
                  (typeof u.componentWillMount == 'function' && u.componentWillMount(),
                  typeof u.UNSAFE_componentWillMount == 'function' && u.UNSAFE_componentWillMount()),
                typeof u.componentDidMount == 'function' && (e.flags |= 4194308))
              : (typeof u.componentDidMount == 'function' && (e.flags |= 4194308),
                (e.memoizedProps = a),
                (e.memoizedState = g)),
            (u.props = a),
            (u.state = g),
            (u.context = c),
            (a = f))
          : (typeof u.componentDidMount == 'function' && (e.flags |= 4194308), (a = !1)));
    } else {
      ((u = e.stateNode),
        Hc(t, e),
        (c = e.memoizedProps),
        (E = Yl(l, c)),
        (u.props = E),
        (N = e.pendingProps),
        (v = u.context),
        (g = l.contextType),
        (f = ea),
        typeof g == 'object' && g !== null && (f = Kt(g)),
        (s = l.getDerivedStateFromProps),
        (g = typeof s == 'function' || typeof u.getSnapshotBeforeUpdate == 'function') ||
          (typeof u.UNSAFE_componentWillReceiveProps != 'function' &&
            typeof u.componentWillReceiveProps != 'function') ||
          ((c !== N || v !== f) && xr(e, u, a, f)),
        (ul = !1),
        (v = e.memoizedState),
        (u.state = v),
        $a(e, a, u, n),
        ka());
      var x = e.memoizedState;
      c !== N || v !== x || ul || (t !== null && t.dependencies !== null && Zn(t.dependencies))
        ? (typeof s == 'function' && (ni(e, l, s, a), (x = e.memoizedState)),
          (E = ul || br(e, l, E, a, v, x, f) || (t !== null && t.dependencies !== null && Zn(t.dependencies)))
            ? (g ||
                (typeof u.UNSAFE_componentWillUpdate != 'function' && typeof u.componentWillUpdate != 'function') ||
                (typeof u.componentWillUpdate == 'function' && u.componentWillUpdate(a, x, f),
                typeof u.UNSAFE_componentWillUpdate == 'function' && u.UNSAFE_componentWillUpdate(a, x, f)),
              typeof u.componentDidUpdate == 'function' && (e.flags |= 4),
              typeof u.getSnapshotBeforeUpdate == 'function' && (e.flags |= 1024))
            : (typeof u.componentDidUpdate != 'function' ||
                (c === t.memoizedProps && v === t.memoizedState) ||
                (e.flags |= 4),
              typeof u.getSnapshotBeforeUpdate != 'function' ||
                (c === t.memoizedProps && v === t.memoizedState) ||
                (e.flags |= 1024),
              (e.memoizedProps = a),
              (e.memoizedState = x)),
          (u.props = a),
          (u.state = x),
          (u.context = f),
          (a = E))
        : (typeof u.componentDidUpdate != 'function' ||
            (c === t.memoizedProps && v === t.memoizedState) ||
            (e.flags |= 4),
          typeof u.getSnapshotBeforeUpdate != 'function' ||
            (c === t.memoizedProps && v === t.memoizedState) ||
            (e.flags |= 1024),
          (a = !1));
    }
    return (
      (u = a),
      fu(t, e),
      (a = (e.flags & 128) !== 0),
      u || a
        ? ((u = e.stateNode),
          (l = a && typeof l.getDerivedStateFromError != 'function' ? null : u.render()),
          (e.flags |= 1),
          t !== null && a ? ((e.child = Bl(e, t.child, null, n)), (e.child = Bl(e, null, l, n))) : Jt(t, e, l, n),
          (e.memoizedState = u.state),
          (t = e.child))
        : (t = Le(t, e, n)),
      t
    );
  }
  function Rr(t, e, l, a) {
    return (_l(), (e.flags |= 256), Jt(t, e, l, a), e.child);
  }
  var fi = { dehydrated: null, treeContext: null, retryLane: 0, hydrationErrors: null };
  function ri(t) {
    return { baseLanes: t, cachePool: jf() };
  }
  function oi(t, e, l) {
    return ((t = t !== null ? t.childLanes & ~l : 0), e && (t |= ye), t);
  }
  function Hr(t, e, l) {
    var a = e.pendingProps,
      n = !1,
      u = (e.flags & 128) !== 0,
      c;
    if (
      ((c = u) || (c = t !== null && t.memoizedState === null ? !1 : (Rt.current & 2) !== 0),
      c && ((n = !0), (e.flags &= -129)),
      (c = (e.flags & 32) !== 0),
      (e.flags &= -33),
      t === null)
    ) {
      if (ot) {
        if (
          (n ? sl(e) : fl(),
          (t = Tt)
            ? ((t = Zo(t, je)),
              (t = t !== null && t.data !== '&' ? t : null),
              t !== null &&
                ((e.memoizedState = {
                  dehydrated: t,
                  treeContext: el !== null ? { id: Ce, overflow: _e } : null,
                  retryLane: 536870912,
                  hydrationErrors: null,
                }),
                (l = hf(t)),
                (l.return = e),
                (e.child = l),
                (Vt = e),
                (Tt = null)))
            : (t = null),
          t === null)
        )
          throw al(e);
        return (Ji(t) ? (e.lanes = 32) : (e.lanes = 536870912), null);
      }
      var s = a.children;
      return (
        (a = a.fallback),
        n
          ? (fl(),
            (n = e.mode),
            (s = ru({ mode: 'hidden', children: s }, n)),
            (a = Cl(a, n, l, null)),
            (s.return = e),
            (a.return = e),
            (s.sibling = a),
            (e.child = s),
            (a = e.child),
            (a.memoizedState = ri(l)),
            (a.childLanes = oi(t, c, l)),
            (e.memoizedState = fi),
            tn(null, a))
          : (sl(e), di(e, s))
      );
    }
    var f = t.memoizedState;
    if (f !== null && ((s = f.dehydrated), s !== null)) {
      if (u)
        e.flags & 256
          ? (sl(e), (e.flags &= -257), (e = mi(t, e, l)))
          : e.memoizedState !== null
            ? (fl(), (e.child = t.child), (e.flags |= 128), (e = null))
            : (fl(),
              (s = a.fallback),
              (n = e.mode),
              (a = ru({ mode: 'visible', children: a.children }, n)),
              (s = Cl(s, n, l, null)),
              (s.flags |= 2),
              (a.return = e),
              (s.return = e),
              (a.sibling = s),
              (e.child = a),
              Bl(e, t.child, null, l),
              (a = e.child),
              (a.memoizedState = ri(l)),
              (a.childLanes = oi(t, c, l)),
              (e.memoizedState = fi),
              (e = tn(null, a)));
      else if ((sl(e), Ji(s))) {
        if (((c = s.nextSibling && s.nextSibling.dataset), c)) var g = c.dgst;
        ((c = g),
          (a = Error(d(419))),
          (a.stack = ''),
          (a.digest = c),
          Qa({ value: a, source: null, stack: null }),
          (e = mi(t, e, l)));
      } else if ((Yt || ua(t, e, l, !1), (c = (l & t.childLanes) !== 0), Yt || c)) {
        if (((c = jt), c !== null && ((a = ps(c, l)), a !== 0 && a !== f.retryLane)))
          throw ((f.retryLane = a), Ol(t, a), ce(c, t, a), ii);
        (Ki(s) || xu(), (e = mi(t, e, l)));
      } else
        Ki(s)
          ? ((e.flags |= 192), (e.child = t.child), (e = null))
          : ((t = f.treeContext),
            (Tt = Te(s.nextSibling)),
            (Vt = e),
            (ot = !0),
            (ll = null),
            (je = !1),
            t !== null && vf(e, t),
            (e = di(e, a.children)),
            (e.flags |= 4096));
      return e;
    }
    return n
      ? (fl(),
        (s = a.fallback),
        (n = e.mode),
        (f = t.child),
        (g = f.sibling),
        (a = Be(f, { mode: 'hidden', children: a.children })),
        (a.subtreeFlags = f.subtreeFlags & 65011712),
        g !== null ? (s = Be(g, s)) : ((s = Cl(s, n, l, null)), (s.flags |= 2)),
        (s.return = e),
        (a.return = e),
        (a.sibling = s),
        (e.child = a),
        tn(null, a),
        (a = e.child),
        (s = t.child.memoizedState),
        s === null
          ? (s = ri(l))
          : ((n = s.cachePool),
            n !== null ? ((f = Bt._currentValue), (n = n.parent !== f ? { parent: f, pool: f } : n)) : (n = jf()),
            (s = { baseLanes: s.baseLanes | l, cachePool: n })),
        (a.memoizedState = s),
        (a.childLanes = oi(t, c, l)),
        (e.memoizedState = fi),
        tn(t.child, a))
      : (sl(e),
        (l = t.child),
        (t = l.sibling),
        (l = Be(l, { mode: 'visible', children: a.children })),
        (l.return = e),
        (l.sibling = null),
        t !== null && ((c = e.deletions), c === null ? ((e.deletions = [t]), (e.flags |= 16)) : c.push(t)),
        (e.child = l),
        (e.memoizedState = null),
        l);
  }
  function di(t, e) {
    return ((e = ru({ mode: 'visible', children: e }, t.mode)), (e.return = t), (t.child = e));
  }
  function ru(t, e) {
    return ((t = oe(22, t, null, e)), (t.lanes = 0), t);
  }
  function mi(t, e, l) {
    return (Bl(e, t.child, null, l), (t = di(e, e.pendingProps.children)), (t.flags |= 2), (e.memoizedState = null), t);
  }
  function wr(t, e, l) {
    t.lanes |= e;
    var a = t.alternate;
    (a !== null && (a.lanes |= e), Mc(t.return, e, l));
  }
  function hi(t, e, l, a, n, u) {
    var c = t.memoizedState;
    c === null
      ? (t.memoizedState = {
          isBackwards: e,
          rendering: null,
          renderingStartTime: 0,
          last: a,
          tail: l,
          tailMode: n,
          treeForkCount: u,
        })
      : ((c.isBackwards = e),
        (c.rendering = null),
        (c.renderingStartTime = 0),
        (c.last = a),
        (c.tail = l),
        (c.tailMode = n),
        (c.treeForkCount = u));
  }
  function Br(t, e, l) {
    var a = e.pendingProps,
      n = a.revealOrder,
      u = a.tail;
    a = a.children;
    var c = Rt.current,
      s = (c & 2) !== 0;
    if (
      (s ? ((c = (c & 1) | 2), (e.flags |= 128)) : (c &= 1),
      H(Rt, c),
      Jt(t, e, a, l),
      (a = ot ? Xa : 0),
      !s && t !== null && (t.flags & 128) !== 0)
    )
      t: for (t = e.child; t !== null; ) {
        if (t.tag === 13) t.memoizedState !== null && wr(t, l, e);
        else if (t.tag === 19) wr(t, l, e);
        else if (t.child !== null) {
          ((t.child.return = t), (t = t.child));
          continue;
        }
        if (t === e) break t;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e) break t;
          t = t.return;
        }
        ((t.sibling.return = t.return), (t = t.sibling));
      }
    switch (n) {
      case 'forwards':
        for (l = e.child, n = null; l !== null; )
          ((t = l.alternate), t !== null && In(t) === null && (n = l), (l = l.sibling));
        ((l = n),
          l === null ? ((n = e.child), (e.child = null)) : ((n = l.sibling), (l.sibling = null)),
          hi(e, !1, n, l, u, a));
        break;
      case 'backwards':
      case 'unstable_legacy-backwards':
        for (l = null, n = e.child, e.child = null; n !== null; ) {
          if (((t = n.alternate), t !== null && In(t) === null)) {
            e.child = n;
            break;
          }
          ((t = n.sibling), (n.sibling = l), (l = n), (n = t));
        }
        hi(e, !0, l, null, u, a);
        break;
      case 'together':
        hi(e, !1, null, null, void 0, a);
        break;
      default:
        e.memoizedState = null;
    }
    return e.child;
  }
  function Le(t, e, l) {
    if ((t !== null && (e.dependencies = t.dependencies), (dl |= e.lanes), (l & e.childLanes) === 0))
      if (t !== null) {
        if ((ua(t, e, l, !1), (l & e.childLanes) === 0)) return null;
      } else return null;
    if (t !== null && e.child !== t.child) throw Error(d(153));
    if (e.child !== null) {
      for (t = e.child, l = Be(t, t.pendingProps), e.child = l, l.return = e; t.sibling !== null; )
        ((t = t.sibling), (l = l.sibling = Be(t, t.pendingProps)), (l.return = e));
      l.sibling = null;
    }
    return e.child;
  }
  function yi(t, e) {
    return (t.lanes & e) !== 0 ? !0 : ((t = t.dependencies), !!(t !== null && Zn(t)));
  }
  function W0(t, e, l) {
    switch (e.tag) {
      case 3:
        (Ft(e, e.stateNode.containerInfo), nl(e, Bt, t.memoizedState.cache), _l());
        break;
      case 27:
      case 5:
        za(e);
        break;
      case 4:
        Ft(e, e.stateNode.containerInfo);
        break;
      case 10:
        nl(e, e.type, e.memoizedProps.value);
        break;
      case 31:
        if (e.memoizedState !== null) return ((e.flags |= 128), Gc(e), null);
        break;
      case 13:
        var a = e.memoizedState;
        if (a !== null)
          return a.dehydrated !== null
            ? (sl(e), (e.flags |= 128), null)
            : (l & e.child.childLanes) !== 0
              ? Hr(t, e, l)
              : (sl(e), (t = Le(t, e, l)), t !== null ? t.sibling : null);
        sl(e);
        break;
      case 19:
        var n = (t.flags & 128) !== 0;
        if (((a = (l & e.childLanes) !== 0), a || (ua(t, e, l, !1), (a = (l & e.childLanes) !== 0)), n)) {
          if (a) return Br(t, e, l);
          e.flags |= 128;
        }
        if (
          ((n = e.memoizedState),
          n !== null && ((n.rendering = null), (n.tail = null), (n.lastEffect = null)),
          H(Rt, Rt.current),
          a)
        )
          break;
        return null;
      case 22:
        return ((e.lanes = 0), Or(t, e, l, e.pendingProps));
      case 24:
        nl(e, Bt, t.memoizedState.cache);
    }
    return Le(t, e, l);
  }
  function qr(t, e, l) {
    if (t !== null)
      if (t.memoizedProps !== e.pendingProps) Yt = !0;
      else {
        if (!yi(t, l) && (e.flags & 128) === 0) return ((Yt = !1), W0(t, e, l));
        Yt = (t.flags & 131072) !== 0;
      }
    else ((Yt = !1), ot && (e.flags & 1048576) !== 0 && gf(e, Xa, e.index));
    switch (((e.lanes = 0), e.tag)) {
      case 16:
        t: {
          var a = e.pendingProps;
          if (((t = Hl(e.elementType)), (e.type = t), typeof t == 'function'))
            pc(t)
              ? ((a = Yl(t, a)), (e.tag = 1), (e = Ur(null, e, t, a, l)))
              : ((e.tag = 0), (e = si(null, e, t, a, l)));
          else {
            if (t != null) {
              var n = t.$$typeof;
              if (n === J) {
                ((e.tag = 11), (e = zr(null, e, t, a, l)));
                break t;
              } else if (n === k) {
                ((e.tag = 14), (e = Ar(null, e, t, a, l)));
                break t;
              }
            }
            throw ((e = nt(t) || t), Error(d(306, e, '')));
          }
        }
        return e;
      case 0:
        return si(t, e, e.type, e.pendingProps, l);
      case 1:
        return ((a = e.type), (n = Yl(a, e.pendingProps)), Ur(t, e, a, n, l));
      case 3:
        t: {
          if ((Ft(e, e.stateNode.containerInfo), t === null)) throw Error(d(387));
          a = e.pendingProps;
          var u = e.memoizedState;
          ((n = u.element), Hc(t, e), $a(e, a, null, l));
          var c = e.memoizedState;
          if (((a = c.cache), nl(e, Bt, a), a !== u.cache && Oc(e, [Bt], l, !0), ka(), (a = c.element), u.isDehydrated))
            if (
              ((u = { element: a, isDehydrated: !1, cache: c.cache }),
              (e.updateQueue.baseState = u),
              (e.memoizedState = u),
              e.flags & 256)
            ) {
              e = Rr(t, e, a, l);
              break t;
            } else if (a !== n) {
              ((n = pe(Error(d(424)), e)), Qa(n), (e = Rr(t, e, a, l)));
              break t;
            } else {
              switch (((t = e.stateNode.containerInfo), t.nodeType)) {
                case 9:
                  t = t.body;
                  break;
                default:
                  t = t.nodeName === 'HTML' ? t.ownerDocument.body : t;
              }
              for (Tt = Te(t.firstChild), Vt = e, ot = !0, ll = null, je = !0, l = Of(e, null, a, l), e.child = l; l; )
                ((l.flags = (l.flags & -3) | 4096), (l = l.sibling));
            }
          else {
            if ((_l(), a === n)) {
              e = Le(t, e, l);
              break t;
            }
            Jt(t, e, a, l);
          }
          e = e.child;
        }
        return e;
      case 26:
        return (
          fu(t, e),
          t === null
            ? (l = Wo(e.type, null, e.pendingProps, null))
              ? (e.memoizedState = l)
              : ot ||
                ((l = e.type),
                (t = e.pendingProps),
                (a = zu(ct.current).createElement(l)),
                (a[Zt] = e),
                (a[te] = t),
                kt(a, l, t),
                Qt(a),
                (e.stateNode = a))
            : (e.memoizedState = Wo(e.type, t.memoizedProps, e.pendingProps, t.memoizedState)),
          null
        );
      case 27:
        return (
          za(e),
          t === null &&
            ot &&
            ((a = e.stateNode = Jo(e.type, e.pendingProps, ct.current)),
            (Vt = e),
            (je = !0),
            (n = Tt),
            vl(e.type) ? ((ki = n), (Tt = Te(a.firstChild))) : (Tt = n)),
          Jt(t, e, e.pendingProps.children, l),
          fu(t, e),
          t === null && (e.flags |= 4194304),
          e.child
        );
      case 5:
        return (
          t === null &&
            ot &&
            ((n = a = Tt) &&
              ((a = zm(a, e.type, e.pendingProps, je)),
              a !== null ? ((e.stateNode = a), (Vt = e), (Tt = Te(a.firstChild)), (je = !1), (n = !0)) : (n = !1)),
            n || al(e)),
          za(e),
          (n = e.type),
          (u = e.pendingProps),
          (c = t !== null ? t.memoizedProps : null),
          (a = u.children),
          Li(n, u) ? (a = null) : c !== null && Li(n, c) && (e.flags |= 32),
          e.memoizedState !== null && ((n = Qc(t, e, X0, null, null, l)), (gn._currentValue = n)),
          fu(t, e),
          Jt(t, e, a, l),
          e.child
        );
      case 6:
        return (
          t === null &&
            ot &&
            ((t = l = Tt) &&
              ((l = Am(l, e.pendingProps, je)),
              l !== null ? ((e.stateNode = l), (Vt = e), (Tt = null), (t = !0)) : (t = !1)),
            t || al(e)),
          null
        );
      case 13:
        return Hr(t, e, l);
      case 4:
        return (
          Ft(e, e.stateNode.containerInfo),
          (a = e.pendingProps),
          t === null ? (e.child = Bl(e, null, a, l)) : Jt(t, e, a, l),
          e.child
        );
      case 11:
        return zr(t, e, e.type, e.pendingProps, l);
      case 7:
        return (Jt(t, e, e.pendingProps, l), e.child);
      case 8:
        return (Jt(t, e, e.pendingProps.children, l), e.child);
      case 12:
        return (Jt(t, e, e.pendingProps.children, l), e.child);
      case 10:
        return ((a = e.pendingProps), nl(e, e.type, a.value), Jt(t, e, a.children, l), e.child);
      case 9:
        return (
          (n = e.type._context),
          (a = e.pendingProps.children),
          Ul(e),
          (n = Kt(n)),
          (a = a(n)),
          (e.flags |= 1),
          Jt(t, e, a, l),
          e.child
        );
      case 14:
        return Ar(t, e, e.type, e.pendingProps, l);
      case 15:
        return Mr(t, e, e.type, e.pendingProps, l);
      case 19:
        return Br(t, e, l);
      case 31:
        return $0(t, e, l);
      case 22:
        return Or(t, e, l, e.pendingProps);
      case 24:
        return (
          Ul(e),
          (a = Kt(Bt)),
          t === null
            ? ((n = Dc()),
              n === null &&
                ((n = jt),
                (u = Cc()),
                (n.pooledCache = u),
                u.refCount++,
                u !== null && (n.pooledCacheLanes |= l),
                (n = u)),
              (e.memoizedState = { parent: a, cache: n }),
              Rc(e),
              nl(e, Bt, n))
            : ((t.lanes & l) !== 0 && (Hc(t, e), $a(e, null, null, l), ka()),
              (n = t.memoizedState),
              (u = e.memoizedState),
              n.parent !== a
                ? ((n = { parent: a, cache: a }),
                  (e.memoizedState = n),
                  e.lanes === 0 && (e.memoizedState = e.updateQueue.baseState = n),
                  nl(e, Bt, a))
                : ((a = u.cache), nl(e, Bt, a), a !== n.cache && Oc(e, [Bt], l, !0))),
          Jt(t, e, e.pendingProps.children, l),
          e.child
        );
      case 29:
        throw e.pendingProps;
    }
    throw Error(d(156, e.tag));
  }
  function Ze(t) {
    t.flags |= 4;
  }
  function gi(t, e, l, a, n) {
    if (((e = (t.mode & 32) !== 0) && (e = !1), e)) {
      if (((t.flags |= 16777216), (n & 335544128) === n))
        if (t.stateNode.complete) t.flags |= 8192;
        else if (oo()) t.flags |= 8192;
        else throw ((wl = kn), Uc);
    } else t.flags &= -16777217;
  }
  function Yr(t, e) {
    if (e.type !== 'stylesheet' || (e.state.loading & 4) !== 0) t.flags &= -16777217;
    else if (((t.flags |= 16777216), !ed(e)))
      if (oo()) t.flags |= 8192;
      else throw ((wl = kn), Uc);
  }
  function ou(t, e) {
    (e !== null && (t.flags |= 4),
      t.flags & 16384 && ((e = t.tag !== 22 ? vs() : 536870912), (t.lanes |= e), (va |= e)));
  }
  function en(t, e) {
    if (!ot)
      switch (t.tailMode) {
        case 'hidden':
          e = t.tail;
          for (var l = null; e !== null; ) (e.alternate !== null && (l = e), (e = e.sibling));
          l === null ? (t.tail = null) : (l.sibling = null);
          break;
        case 'collapsed':
          l = t.tail;
          for (var a = null; l !== null; ) (l.alternate !== null && (a = l), (l = l.sibling));
          a === null ? (e || t.tail === null ? (t.tail = null) : (t.tail.sibling = null)) : (a.sibling = null);
      }
  }
  function zt(t) {
    var e = t.alternate !== null && t.alternate.child === t.child,
      l = 0,
      a = 0;
    if (e)
      for (var n = t.child; n !== null; )
        ((l |= n.lanes | n.childLanes),
          (a |= n.subtreeFlags & 65011712),
          (a |= n.flags & 65011712),
          (n.return = t),
          (n = n.sibling));
    else
      for (n = t.child; n !== null; )
        ((l |= n.lanes | n.childLanes), (a |= n.subtreeFlags), (a |= n.flags), (n.return = t), (n = n.sibling));
    return ((t.subtreeFlags |= a), (t.childLanes = l), e);
  }
  function F0(t, e, l) {
    var a = e.pendingProps;
    switch ((Nc(e), e.tag)) {
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return (zt(e), null);
      case 1:
        return (zt(e), null);
      case 3:
        return (
          (l = e.stateNode),
          (a = null),
          t !== null && (a = t.memoizedState.cache),
          e.memoizedState.cache !== a && (e.flags |= 2048),
          Ge(Bt),
          Ut(),
          l.pendingContext && ((l.context = l.pendingContext), (l.pendingContext = null)),
          (t === null || t.child === null) &&
            (na(e)
              ? Ze(e)
              : t === null || (t.memoizedState.isDehydrated && (e.flags & 256) === 0) || ((e.flags |= 1024), zc())),
          zt(e),
          null
        );
      case 26:
        var n = e.type,
          u = e.memoizedState;
        return (
          t === null
            ? (Ze(e), u !== null ? (zt(e), Yr(e, u)) : (zt(e), gi(e, n, null, a, l)))
            : u
              ? u !== t.memoizedState
                ? (Ze(e), zt(e), Yr(e, u))
                : (zt(e), (e.flags &= -16777217))
              : ((t = t.memoizedProps), t !== a && Ze(e), zt(e), gi(e, n, t, a, l)),
          null
        );
      case 27:
        if ((En(e), (l = ct.current), (n = e.type), t !== null && e.stateNode != null)) t.memoizedProps !== a && Ze(e);
        else {
          if (!a) {
            if (e.stateNode === null) throw Error(d(166));
            return (zt(e), null);
          }
          ((t = G.current), na(e) ? bf(e) : ((t = Jo(n, a, l)), (e.stateNode = t), Ze(e)));
        }
        return (zt(e), null);
      case 5:
        if ((En(e), (n = e.type), t !== null && e.stateNode != null)) t.memoizedProps !== a && Ze(e);
        else {
          if (!a) {
            if (e.stateNode === null) throw Error(d(166));
            return (zt(e), null);
          }
          if (((u = G.current), na(e))) bf(e);
          else {
            var c = zu(ct.current);
            switch (u) {
              case 1:
                u = c.createElementNS('http://www.w3.org/2000/svg', n);
                break;
              case 2:
                u = c.createElementNS('http://www.w3.org/1998/Math/MathML', n);
                break;
              default:
                switch (n) {
                  case 'svg':
                    u = c.createElementNS('http://www.w3.org/2000/svg', n);
                    break;
                  case 'math':
                    u = c.createElementNS('http://www.w3.org/1998/Math/MathML', n);
                    break;
                  case 'script':
                    ((u = c.createElement('div')),
                      (u.innerHTML = '<script><\/script>'),
                      (u = u.removeChild(u.firstChild)));
                    break;
                  case 'select':
                    ((u =
                      typeof a.is == 'string' ? c.createElement('select', { is: a.is }) : c.createElement('select')),
                      a.multiple ? (u.multiple = !0) : a.size && (u.size = a.size));
                    break;
                  default:
                    u = typeof a.is == 'string' ? c.createElement(n, { is: a.is }) : c.createElement(n);
                }
            }
            ((u[Zt] = e), (u[te] = a));
            t: for (c = e.child; c !== null; ) {
              if (c.tag === 5 || c.tag === 6) u.appendChild(c.stateNode);
              else if (c.tag !== 4 && c.tag !== 27 && c.child !== null) {
                ((c.child.return = c), (c = c.child));
                continue;
              }
              if (c === e) break t;
              for (; c.sibling === null; ) {
                if (c.return === null || c.return === e) break t;
                c = c.return;
              }
              ((c.sibling.return = c.return), (c = c.sibling));
            }
            e.stateNode = u;
            t: switch ((kt(u, n, a), n)) {
              case 'button':
              case 'input':
              case 'select':
              case 'textarea':
                a = !!a.autoFocus;
                break t;
              case 'img':
                a = !0;
                break t;
              default:
                a = !1;
            }
            a && Ze(e);
          }
        }
        return (zt(e), gi(e, e.type, t === null ? null : t.memoizedProps, e.pendingProps, l), null);
      case 6:
        if (t && e.stateNode != null) t.memoizedProps !== a && Ze(e);
        else {
          if (typeof a != 'string' && e.stateNode === null) throw Error(d(166));
          if (((t = ct.current), na(e))) {
            if (((t = e.stateNode), (l = e.memoizedProps), (a = null), (n = Vt), n !== null))
              switch (n.tag) {
                case 27:
                case 5:
                  a = n.memoizedProps;
              }
            ((t[Zt] = e),
              (t = !!(t.nodeValue === l || (a !== null && a.suppressHydrationWarning === !0) || wo(t.nodeValue, l))),
              t || al(e, !0));
          } else ((t = zu(t).createTextNode(a)), (t[Zt] = e), (e.stateNode = t));
        }
        return (zt(e), null);
      case 31:
        if (((l = e.memoizedState), t === null || t.memoizedState !== null)) {
          if (((a = na(e)), l !== null)) {
            if (t === null) {
              if (!a) throw Error(d(318));
              if (((t = e.memoizedState), (t = t !== null ? t.dehydrated : null), !t)) throw Error(d(557));
              t[Zt] = e;
            } else (_l(), (e.flags & 128) === 0 && (e.memoizedState = null), (e.flags |= 4));
            (zt(e), (t = !1));
          } else
            ((l = zc()), t !== null && t.memoizedState !== null && (t.memoizedState.hydrationErrors = l), (t = !0));
          if (!t) return e.flags & 256 ? (me(e), e) : (me(e), null);
          if ((e.flags & 128) !== 0) throw Error(d(558));
        }
        return (zt(e), null);
      case 13:
        if (((a = e.memoizedState), t === null || (t.memoizedState !== null && t.memoizedState.dehydrated !== null))) {
          if (((n = na(e)), a !== null && a.dehydrated !== null)) {
            if (t === null) {
              if (!n) throw Error(d(318));
              if (((n = e.memoizedState), (n = n !== null ? n.dehydrated : null), !n)) throw Error(d(317));
              n[Zt] = e;
            } else (_l(), (e.flags & 128) === 0 && (e.memoizedState = null), (e.flags |= 4));
            (zt(e), (n = !1));
          } else
            ((n = zc()), t !== null && t.memoizedState !== null && (t.memoizedState.hydrationErrors = n), (n = !0));
          if (!n) return e.flags & 256 ? (me(e), e) : (me(e), null);
        }
        return (
          me(e),
          (e.flags & 128) !== 0
            ? ((e.lanes = l), e)
            : ((l = a !== null),
              (t = t !== null && t.memoizedState !== null),
              l &&
                ((a = e.child),
                (n = null),
                a.alternate !== null &&
                  a.alternate.memoizedState !== null &&
                  a.alternate.memoizedState.cachePool !== null &&
                  (n = a.alternate.memoizedState.cachePool.pool),
                (u = null),
                a.memoizedState !== null && a.memoizedState.cachePool !== null && (u = a.memoizedState.cachePool.pool),
                u !== n && (a.flags |= 2048)),
              l !== t && l && (e.child.flags |= 8192),
              ou(e, e.updateQueue),
              zt(e),
              null)
        );
      case 4:
        return (Ut(), t === null && qi(e.stateNode.containerInfo), zt(e), null);
      case 10:
        return (Ge(e.type), zt(e), null);
      case 19:
        if ((T(Rt), (a = e.memoizedState), a === null)) return (zt(e), null);
        if (((n = (e.flags & 128) !== 0), (u = a.rendering), u === null))
          if (n) en(a, !1);
          else {
            if (_t !== 0 || (t !== null && (t.flags & 128) !== 0))
              for (t = e.child; t !== null; ) {
                if (((u = In(t)), u !== null)) {
                  for (
                    e.flags |= 128,
                      en(a, !1),
                      t = u.updateQueue,
                      e.updateQueue = t,
                      ou(e, t),
                      e.subtreeFlags = 0,
                      t = l,
                      l = e.child;
                    l !== null;

                  )
                    (mf(l, t), (l = l.sibling));
                  return (H(Rt, (Rt.current & 1) | 2), ot && qe(e, a.treeForkCount), e.child);
                }
                t = t.sibling;
              }
            a.tail !== null && ie() > gu && ((e.flags |= 128), (n = !0), en(a, !1), (e.lanes = 4194304));
          }
        else {
          if (!n)
            if (((t = In(u)), t !== null)) {
              if (
                ((e.flags |= 128),
                (n = !0),
                (t = t.updateQueue),
                (e.updateQueue = t),
                ou(e, t),
                en(a, !0),
                a.tail === null && a.tailMode === 'hidden' && !u.alternate && !ot)
              )
                return (zt(e), null);
            } else
              2 * ie() - a.renderingStartTime > gu &&
                l !== 536870912 &&
                ((e.flags |= 128), (n = !0), en(a, !1), (e.lanes = 4194304));
          a.isBackwards
            ? ((u.sibling = e.child), (e.child = u))
            : ((t = a.last), t !== null ? (t.sibling = u) : (e.child = u), (a.last = u));
        }
        return a.tail !== null
          ? ((t = a.tail),
            (a.rendering = t),
            (a.tail = t.sibling),
            (a.renderingStartTime = ie()),
            (t.sibling = null),
            (l = Rt.current),
            H(Rt, n ? (l & 1) | 2 : l & 1),
            ot && qe(e, a.treeForkCount),
            t)
          : (zt(e), null);
      case 22:
      case 23:
        return (
          me(e),
          Yc(),
          (a = e.memoizedState !== null),
          t !== null ? (t.memoizedState !== null) !== a && (e.flags |= 8192) : a && (e.flags |= 8192),
          a
            ? (l & 536870912) !== 0 && (e.flags & 128) === 0 && (zt(e), e.subtreeFlags & 6 && (e.flags |= 8192))
            : zt(e),
          (l = e.updateQueue),
          l !== null && ou(e, l.retryQueue),
          (l = null),
          t !== null &&
            t.memoizedState !== null &&
            t.memoizedState.cachePool !== null &&
            (l = t.memoizedState.cachePool.pool),
          (a = null),
          e.memoizedState !== null && e.memoizedState.cachePool !== null && (a = e.memoizedState.cachePool.pool),
          a !== l && (e.flags |= 2048),
          t !== null && T(Rl),
          null
        );
      case 24:
        return (
          (l = null),
          t !== null && (l = t.memoizedState.cache),
          e.memoizedState.cache !== l && (e.flags |= 2048),
          Ge(Bt),
          zt(e),
          null
        );
      case 25:
        return null;
      case 30:
        return null;
    }
    throw Error(d(156, e.tag));
  }
  function I0(t, e) {
    switch ((Nc(e), e.tag)) {
      case 1:
        return ((t = e.flags), t & 65536 ? ((e.flags = (t & -65537) | 128), e) : null);
      case 3:
        return (
          Ge(Bt),
          Ut(),
          (t = e.flags),
          (t & 65536) !== 0 && (t & 128) === 0 ? ((e.flags = (t & -65537) | 128), e) : null
        );
      case 26:
      case 27:
      case 5:
        return (En(e), null);
      case 31:
        if (e.memoizedState !== null) {
          if ((me(e), e.alternate === null)) throw Error(d(340));
          _l();
        }
        return ((t = e.flags), t & 65536 ? ((e.flags = (t & -65537) | 128), e) : null);
      case 13:
        if ((me(e), (t = e.memoizedState), t !== null && t.dehydrated !== null)) {
          if (e.alternate === null) throw Error(d(340));
          _l();
        }
        return ((t = e.flags), t & 65536 ? ((e.flags = (t & -65537) | 128), e) : null);
      case 19:
        return (T(Rt), null);
      case 4:
        return (Ut(), null);
      case 10:
        return (Ge(e.type), null);
      case 22:
      case 23:
        return (
          me(e),
          Yc(),
          t !== null && T(Rl),
          (t = e.flags),
          t & 65536 ? ((e.flags = (t & -65537) | 128), e) : null
        );
      case 24:
        return (Ge(Bt), null);
      case 25:
        return null;
      default:
        return null;
    }
  }
  function Gr(t, e) {
    switch ((Nc(e), e.tag)) {
      case 3:
        (Ge(Bt), Ut());
        break;
      case 26:
      case 27:
      case 5:
        En(e);
        break;
      case 4:
        Ut();
        break;
      case 31:
        e.memoizedState !== null && me(e);
        break;
      case 13:
        me(e);
        break;
      case 19:
        T(Rt);
        break;
      case 10:
        Ge(e.type);
        break;
      case 22:
      case 23:
        (me(e), Yc(), t !== null && T(Rl));
        break;
      case 24:
        Ge(Bt);
    }
  }
  function ln(t, e) {
    try {
      var l = e.updateQueue,
        a = l !== null ? l.lastEffect : null;
      if (a !== null) {
        var n = a.next;
        l = n;
        do {
          if ((l.tag & t) === t) {
            a = void 0;
            var u = l.create,
              c = l.inst;
            ((a = u()), (c.destroy = a));
          }
          l = l.next;
        } while (l !== n);
      }
    } catch (s) {
      xt(e, e.return, s);
    }
  }
  function rl(t, e, l) {
    try {
      var a = e.updateQueue,
        n = a !== null ? a.lastEffect : null;
      if (n !== null) {
        var u = n.next;
        a = u;
        do {
          if ((a.tag & t) === t) {
            var c = a.inst,
              s = c.destroy;
            if (s !== void 0) {
              ((c.destroy = void 0), (n = e));
              var f = l,
                g = s;
              try {
                g();
              } catch (E) {
                xt(n, f, E);
              }
            }
          }
          a = a.next;
        } while (a !== u);
      }
    } catch (E) {
      xt(e, e.return, E);
    }
  }
  function Xr(t) {
    var e = t.updateQueue;
    if (e !== null) {
      var l = t.stateNode;
      try {
        _f(e, l);
      } catch (a) {
        xt(t, t.return, a);
      }
    }
  }
  function Qr(t, e, l) {
    ((l.props = Yl(t.type, t.memoizedProps)), (l.state = t.memoizedState));
    try {
      l.componentWillUnmount();
    } catch (a) {
      xt(t, e, a);
    }
  }
  function an(t, e) {
    try {
      var l = t.ref;
      if (l !== null) {
        switch (t.tag) {
          case 26:
          case 27:
          case 5:
            var a = t.stateNode;
            break;
          case 30:
            a = t.stateNode;
            break;
          default:
            a = t.stateNode;
        }
        typeof l == 'function' ? (t.refCleanup = l(a)) : (l.current = a);
      }
    } catch (n) {
      xt(t, e, n);
    }
  }
  function De(t, e) {
    var l = t.ref,
      a = t.refCleanup;
    if (l !== null)
      if (typeof a == 'function')
        try {
          a();
        } catch (n) {
          xt(t, e, n);
        } finally {
          ((t.refCleanup = null), (t = t.alternate), t != null && (t.refCleanup = null));
        }
      else if (typeof l == 'function')
        try {
          l(null);
        } catch (n) {
          xt(t, e, n);
        }
      else l.current = null;
  }
  function Lr(t) {
    var e = t.type,
      l = t.memoizedProps,
      a = t.stateNode;
    try {
      t: switch (e) {
        case 'button':
        case 'input':
        case 'select':
        case 'textarea':
          l.autoFocus && a.focus();
          break t;
        case 'img':
          l.src ? (a.src = l.src) : l.srcSet && (a.srcset = l.srcSet);
      }
    } catch (n) {
      xt(t, t.return, n);
    }
  }
  function vi(t, e, l) {
    try {
      var a = t.stateNode;
      (pm(a, t.type, l, e), (a[te] = e));
    } catch (n) {
      xt(t, t.return, n);
    }
  }
  function Zr(t) {
    return t.tag === 5 || t.tag === 3 || t.tag === 26 || (t.tag === 27 && vl(t.type)) || t.tag === 4;
  }
  function bi(t) {
    t: for (;;) {
      for (; t.sibling === null; ) {
        if (t.return === null || Zr(t.return)) return null;
        t = t.return;
      }
      for (t.sibling.return = t.return, t = t.sibling; t.tag !== 5 && t.tag !== 6 && t.tag !== 18; ) {
        if ((t.tag === 27 && vl(t.type)) || t.flags & 2 || t.child === null || t.tag === 4) continue t;
        ((t.child.return = t), (t = t.child));
      }
      if (!(t.flags & 2)) return t.stateNode;
    }
  }
  function xi(t, e, l) {
    var a = t.tag;
    if (a === 5 || a === 6)
      ((t = t.stateNode),
        e
          ? (l.nodeType === 9 ? l.body : l.nodeName === 'HTML' ? l.ownerDocument.body : l).insertBefore(t, e)
          : ((e = l.nodeType === 9 ? l.body : l.nodeName === 'HTML' ? l.ownerDocument.body : l),
            e.appendChild(t),
            (l = l._reactRootContainer),
            l != null || e.onclick !== null || (e.onclick = He)));
    else if (a !== 4 && (a === 27 && vl(t.type) && ((l = t.stateNode), (e = null)), (t = t.child), t !== null))
      for (xi(t, e, l), t = t.sibling; t !== null; ) (xi(t, e, l), (t = t.sibling));
  }
  function du(t, e, l) {
    var a = t.tag;
    if (a === 5 || a === 6) ((t = t.stateNode), e ? l.insertBefore(t, e) : l.appendChild(t));
    else if (a !== 4 && (a === 27 && vl(t.type) && (l = t.stateNode), (t = t.child), t !== null))
      for (du(t, e, l), t = t.sibling; t !== null; ) (du(t, e, l), (t = t.sibling));
  }
  function Vr(t) {
    var e = t.stateNode,
      l = t.memoizedProps;
    try {
      for (var a = t.type, n = e.attributes; n.length; ) e.removeAttributeNode(n[0]);
      (kt(e, a, l), (e[Zt] = t), (e[te] = l));
    } catch (u) {
      xt(t, t.return, u);
    }
  }
  var Ve = !1,
    Gt = !1,
    pi = !1,
    Kr = typeof WeakSet == 'function' ? WeakSet : Set,
    Lt = null;
  function P0(t, e) {
    if (((t = t.containerInfo), (Xi = Uu), (t = af(t)), mc(t))) {
      if ('selectionStart' in t) var l = { start: t.selectionStart, end: t.selectionEnd };
      else
        t: {
          l = ((l = t.ownerDocument) && l.defaultView) || window;
          var a = l.getSelection && l.getSelection();
          if (a && a.rangeCount !== 0) {
            l = a.anchorNode;
            var n = a.anchorOffset,
              u = a.focusNode;
            a = a.focusOffset;
            try {
              (l.nodeType, u.nodeType);
            } catch {
              l = null;
              break t;
            }
            var c = 0,
              s = -1,
              f = -1,
              g = 0,
              E = 0,
              N = t,
              v = null;
            e: for (;;) {
              for (
                var x;
                N !== l || (n !== 0 && N.nodeType !== 3) || (s = c + n),
                  N !== u || (a !== 0 && N.nodeType !== 3) || (f = c + a),
                  N.nodeType === 3 && (c += N.nodeValue.length),
                  (x = N.firstChild) !== null;

              )
                ((v = N), (N = x));
              for (;;) {
                if (N === t) break e;
                if ((v === l && ++g === n && (s = c), v === u && ++E === a && (f = c), (x = N.nextSibling) !== null))
                  break;
                ((N = v), (v = N.parentNode));
              }
              N = x;
            }
            l = s === -1 || f === -1 ? null : { start: s, end: f };
          } else l = null;
        }
      l = l || { start: 0, end: 0 };
    } else l = null;
    for (Qi = { focusedElem: t, selectionRange: l }, Uu = !1, Lt = e; Lt !== null; )
      if (((e = Lt), (t = e.child), (e.subtreeFlags & 1028) !== 0 && t !== null)) ((t.return = e), (Lt = t));
      else
        for (; Lt !== null; ) {
          switch (((e = Lt), (u = e.alternate), (t = e.flags), e.tag)) {
            case 0:
              if ((t & 4) !== 0 && ((t = e.updateQueue), (t = t !== null ? t.events : null), t !== null))
                for (l = 0; l < t.length; l++) ((n = t[l]), (n.ref.impl = n.nextImpl));
              break;
            case 11:
            case 15:
              break;
            case 1:
              if ((t & 1024) !== 0 && u !== null) {
                ((t = void 0), (l = e), (n = u.memoizedProps), (u = u.memoizedState), (a = l.stateNode));
                try {
                  var Y = Yl(l.type, n);
                  ((t = a.getSnapshotBeforeUpdate(Y, u)), (a.__reactInternalSnapshotBeforeUpdate = t));
                } catch (V) {
                  xt(l, l.return, V);
                }
              }
              break;
            case 3:
              if ((t & 1024) !== 0) {
                if (((t = e.stateNode.containerInfo), (l = t.nodeType), l === 9)) Vi(t);
                else if (l === 1)
                  switch (t.nodeName) {
                    case 'HEAD':
                    case 'HTML':
                    case 'BODY':
                      Vi(t);
                      break;
                    default:
                      t.textContent = '';
                  }
              }
              break;
            case 5:
            case 26:
            case 27:
            case 6:
            case 4:
            case 17:
              break;
            default:
              if ((t & 1024) !== 0) throw Error(d(163));
          }
          if (((t = e.sibling), t !== null)) {
            ((t.return = e.return), (Lt = t));
            break;
          }
          Lt = e.return;
        }
  }
  function Jr(t, e, l) {
    var a = l.flags;
    switch (l.tag) {
      case 0:
      case 11:
      case 15:
        (Je(t, l), a & 4 && ln(5, l));
        break;
      case 1:
        if ((Je(t, l), a & 4))
          if (((t = l.stateNode), e === null))
            try {
              t.componentDidMount();
            } catch (c) {
              xt(l, l.return, c);
            }
          else {
            var n = Yl(l.type, e.memoizedProps);
            e = e.memoizedState;
            try {
              t.componentDidUpdate(n, e, t.__reactInternalSnapshotBeforeUpdate);
            } catch (c) {
              xt(l, l.return, c);
            }
          }
        (a & 64 && Xr(l), a & 512 && an(l, l.return));
        break;
      case 3:
        if ((Je(t, l), a & 64 && ((t = l.updateQueue), t !== null))) {
          if (((e = null), l.child !== null))
            switch (l.child.tag) {
              case 27:
              case 5:
                e = l.child.stateNode;
                break;
              case 1:
                e = l.child.stateNode;
            }
          try {
            _f(t, e);
          } catch (c) {
            xt(l, l.return, c);
          }
        }
        break;
      case 27:
        e === null && a & 4 && Vr(l);
      case 26:
      case 5:
        (Je(t, l), e === null && a & 4 && Lr(l), a & 512 && an(l, l.return));
        break;
      case 12:
        Je(t, l);
        break;
      case 31:
        (Je(t, l), a & 4 && Wr(t, l));
        break;
      case 13:
        (Je(t, l),
          a & 4 && Fr(t, l),
          a & 64 &&
            ((t = l.memoizedState),
            t !== null && ((t = t.dehydrated), t !== null && ((l = sm.bind(null, l)), Mm(t, l)))));
        break;
      case 22:
        if (((a = l.memoizedState !== null || Ve), !a)) {
          ((e = (e !== null && e.memoizedState !== null) || Gt), (n = Ve));
          var u = Gt;
          ((Ve = a), (Gt = e) && !u ? ke(t, l, (l.subtreeFlags & 8772) !== 0) : Je(t, l), (Ve = n), (Gt = u));
        }
        break;
      case 30:
        break;
      default:
        Je(t, l);
    }
  }
  function kr(t) {
    var e = t.alternate;
    (e !== null && ((t.alternate = null), kr(e)),
      (t.child = null),
      (t.deletions = null),
      (t.sibling = null),
      t.tag === 5 && ((e = t.stateNode), e !== null && Wu(e)),
      (t.stateNode = null),
      (t.return = null),
      (t.dependencies = null),
      (t.memoizedProps = null),
      (t.memoizedState = null),
      (t.pendingProps = null),
      (t.stateNode = null),
      (t.updateQueue = null));
  }
  var Mt = null,
    le = !1;
  function Ke(t, e, l) {
    for (l = l.child; l !== null; ) ($r(t, e, l), (l = l.sibling));
  }
  function $r(t, e, l) {
    if (se && typeof se.onCommitFiberUnmount == 'function')
      try {
        se.onCommitFiberUnmount(Aa, l);
      } catch {}
    switch (l.tag) {
      case 26:
        (Gt || De(l, e),
          Ke(t, e, l),
          l.memoizedState ? l.memoizedState.count-- : l.stateNode && ((l = l.stateNode), l.parentNode.removeChild(l)));
        break;
      case 27:
        Gt || De(l, e);
        var a = Mt,
          n = le;
        (vl(l.type) && ((Mt = l.stateNode), (le = !1)), Ke(t, e, l), mn(l.stateNode), (Mt = a), (le = n));
        break;
      case 5:
        Gt || De(l, e);
      case 6:
        if (((a = Mt), (n = le), (Mt = null), Ke(t, e, l), (Mt = a), (le = n), Mt !== null))
          if (le)
            try {
              (Mt.nodeType === 9 ? Mt.body : Mt.nodeName === 'HTML' ? Mt.ownerDocument.body : Mt).removeChild(
                l.stateNode
              );
            } catch (u) {
              xt(l, e, u);
            }
          else
            try {
              Mt.removeChild(l.stateNode);
            } catch (u) {
              xt(l, e, u);
            }
        break;
      case 18:
        Mt !== null &&
          (le
            ? ((t = Mt),
              Qo(t.nodeType === 9 ? t.body : t.nodeName === 'HTML' ? t.ownerDocument.body : t, l.stateNode),
              Ta(t))
            : Qo(Mt, l.stateNode));
        break;
      case 4:
        ((a = Mt), (n = le), (Mt = l.stateNode.containerInfo), (le = !0), Ke(t, e, l), (Mt = a), (le = n));
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        (rl(2, l, e), Gt || rl(4, l, e), Ke(t, e, l));
        break;
      case 1:
        (Gt || (De(l, e), (a = l.stateNode), typeof a.componentWillUnmount == 'function' && Qr(l, e, a)), Ke(t, e, l));
        break;
      case 21:
        Ke(t, e, l);
        break;
      case 22:
        ((Gt = (a = Gt) || l.memoizedState !== null), Ke(t, e, l), (Gt = a));
        break;
      default:
        Ke(t, e, l);
    }
  }
  function Wr(t, e) {
    if (e.memoizedState === null && ((t = e.alternate), t !== null && ((t = t.memoizedState), t !== null))) {
      t = t.dehydrated;
      try {
        Ta(t);
      } catch (l) {
        xt(e, e.return, l);
      }
    }
  }
  function Fr(t, e) {
    if (
      e.memoizedState === null &&
      ((t = e.alternate), t !== null && ((t = t.memoizedState), t !== null && ((t = t.dehydrated), t !== null)))
    )
      try {
        Ta(t);
      } catch (l) {
        xt(e, e.return, l);
      }
  }
  function tm(t) {
    switch (t.tag) {
      case 31:
      case 13:
      case 19:
        var e = t.stateNode;
        return (e === null && (e = t.stateNode = new Kr()), e);
      case 22:
        return ((t = t.stateNode), (e = t._retryCache), e === null && (e = t._retryCache = new Kr()), e);
      default:
        throw Error(d(435, t.tag));
    }
  }
  function mu(t, e) {
    var l = tm(t);
    e.forEach(function (a) {
      if (!l.has(a)) {
        l.add(a);
        var n = fm.bind(null, t, a);
        a.then(n, n);
      }
    });
  }
  function ae(t, e) {
    var l = e.deletions;
    if (l !== null)
      for (var a = 0; a < l.length; a++) {
        var n = l[a],
          u = t,
          c = e,
          s = c;
        t: for (; s !== null; ) {
          switch (s.tag) {
            case 27:
              if (vl(s.type)) {
                ((Mt = s.stateNode), (le = !1));
                break t;
              }
              break;
            case 5:
              ((Mt = s.stateNode), (le = !1));
              break t;
            case 3:
            case 4:
              ((Mt = s.stateNode.containerInfo), (le = !0));
              break t;
          }
          s = s.return;
        }
        if (Mt === null) throw Error(d(160));
        ($r(u, c, n), (Mt = null), (le = !1), (u = n.alternate), u !== null && (u.return = null), (n.return = null));
      }
    if (e.subtreeFlags & 13886) for (e = e.child; e !== null; ) (Ir(e, t), (e = e.sibling));
  }
  var Me = null;
  function Ir(t, e) {
    var l = t.alternate,
      a = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        (ae(e, t), ne(t), a & 4 && (rl(3, t, t.return), ln(3, t), rl(5, t, t.return)));
        break;
      case 1:
        (ae(e, t),
          ne(t),
          a & 512 && (Gt || l === null || De(l, l.return)),
          a & 64 &&
            Ve &&
            ((t = t.updateQueue),
            t !== null &&
              ((a = t.callbacks),
              a !== null &&
                ((l = t.shared.hiddenCallbacks), (t.shared.hiddenCallbacks = l === null ? a : l.concat(a))))));
        break;
      case 26:
        var n = Me;
        if ((ae(e, t), ne(t), a & 512 && (Gt || l === null || De(l, l.return)), a & 4)) {
          var u = l !== null ? l.memoizedState : null;
          if (((a = t.memoizedState), l === null))
            if (a === null)
              if (t.stateNode === null) {
                t: {
                  ((a = t.type), (l = t.memoizedProps), (n = n.ownerDocument || n));
                  e: switch (a) {
                    case 'title':
                      ((u = n.getElementsByTagName('title')[0]),
                        (!u ||
                          u[Ca] ||
                          u[Zt] ||
                          u.namespaceURI === 'http://www.w3.org/2000/svg' ||
                          u.hasAttribute('itemprop')) &&
                          ((u = n.createElement(a)), n.head.insertBefore(u, n.querySelector('head > title'))),
                        kt(u, a, l),
                        (u[Zt] = t),
                        Qt(u),
                        (a = u));
                      break t;
                    case 'link':
                      var c = Po('link', 'href', n).get(a + (l.href || ''));
                      if (c) {
                        for (var s = 0; s < c.length; s++)
                          if (
                            ((u = c[s]),
                            u.getAttribute('href') === (l.href == null || l.href === '' ? null : l.href) &&
                              u.getAttribute('rel') === (l.rel == null ? null : l.rel) &&
                              u.getAttribute('title') === (l.title == null ? null : l.title) &&
                              u.getAttribute('crossorigin') === (l.crossOrigin == null ? null : l.crossOrigin))
                          ) {
                            c.splice(s, 1);
                            break e;
                          }
                      }
                      ((u = n.createElement(a)), kt(u, a, l), n.head.appendChild(u));
                      break;
                    case 'meta':
                      if ((c = Po('meta', 'content', n).get(a + (l.content || '')))) {
                        for (s = 0; s < c.length; s++)
                          if (
                            ((u = c[s]),
                            u.getAttribute('content') === (l.content == null ? null : '' + l.content) &&
                              u.getAttribute('name') === (l.name == null ? null : l.name) &&
                              u.getAttribute('property') === (l.property == null ? null : l.property) &&
                              u.getAttribute('http-equiv') === (l.httpEquiv == null ? null : l.httpEquiv) &&
                              u.getAttribute('charset') === (l.charSet == null ? null : l.charSet))
                          ) {
                            c.splice(s, 1);
                            break e;
                          }
                      }
                      ((u = n.createElement(a)), kt(u, a, l), n.head.appendChild(u));
                      break;
                    default:
                      throw Error(d(468, a));
                  }
                  ((u[Zt] = t), Qt(u), (a = u));
                }
                t.stateNode = a;
              } else td(n, t.type, t.stateNode);
            else t.stateNode = Io(n, a, t.memoizedProps);
          else
            u !== a
              ? (u === null ? l.stateNode !== null && ((l = l.stateNode), l.parentNode.removeChild(l)) : u.count--,
                a === null ? td(n, t.type, t.stateNode) : Io(n, a, t.memoizedProps))
              : a === null && t.stateNode !== null && vi(t, t.memoizedProps, l.memoizedProps);
        }
        break;
      case 27:
        (ae(e, t),
          ne(t),
          a & 512 && (Gt || l === null || De(l, l.return)),
          l !== null && a & 4 && vi(t, t.memoizedProps, l.memoizedProps));
        break;
      case 5:
        if ((ae(e, t), ne(t), a & 512 && (Gt || l === null || De(l, l.return)), t.flags & 32)) {
          n = t.stateNode;
          try {
            kl(n, '');
          } catch (Y) {
            xt(t, t.return, Y);
          }
        }
        (a & 4 && t.stateNode != null && ((n = t.memoizedProps), vi(t, n, l !== null ? l.memoizedProps : n)),
          a & 1024 && (pi = !0));
        break;
      case 6:
        if ((ae(e, t), ne(t), a & 4)) {
          if (t.stateNode === null) throw Error(d(162));
          ((a = t.memoizedProps), (l = t.stateNode));
          try {
            l.nodeValue = a;
          } catch (Y) {
            xt(t, t.return, Y);
          }
        }
        break;
      case 3:
        if (
          ((Ou = null),
          (n = Me),
          (Me = Au(e.containerInfo)),
          ae(e, t),
          (Me = n),
          ne(t),
          a & 4 && l !== null && l.memoizedState.isDehydrated)
        )
          try {
            Ta(e.containerInfo);
          } catch (Y) {
            xt(t, t.return, Y);
          }
        pi && ((pi = !1), Pr(t));
        break;
      case 4:
        ((a = Me), (Me = Au(t.stateNode.containerInfo)), ae(e, t), ne(t), (Me = a));
        break;
      case 12:
        (ae(e, t), ne(t));
        break;
      case 31:
        (ae(e, t), ne(t), a & 4 && ((a = t.updateQueue), a !== null && ((t.updateQueue = null), mu(t, a))));
        break;
      case 13:
        (ae(e, t),
          ne(t),
          t.child.flags & 8192 && (t.memoizedState !== null) != (l !== null && l.memoizedState !== null) && (yu = ie()),
          a & 4 && ((a = t.updateQueue), a !== null && ((t.updateQueue = null), mu(t, a))));
        break;
      case 22:
        n = t.memoizedState !== null;
        var f = l !== null && l.memoizedState !== null,
          g = Ve,
          E = Gt;
        if (((Ve = g || n), (Gt = E || f), ae(e, t), (Gt = E), (Ve = g), ne(t), a & 8192))
          t: for (
            e = t.stateNode,
              e._visibility = n ? e._visibility & -2 : e._visibility | 1,
              n && (l === null || f || Ve || Gt || Gl(t)),
              l = null,
              e = t;
            ;

          ) {
            if (e.tag === 5 || e.tag === 26) {
              if (l === null) {
                f = l = e;
                try {
                  if (((u = f.stateNode), n))
                    ((c = u.style),
                      typeof c.setProperty == 'function'
                        ? c.setProperty('display', 'none', 'important')
                        : (c.display = 'none'));
                  else {
                    s = f.stateNode;
                    var N = f.memoizedProps.style,
                      v = N != null && N.hasOwnProperty('display') ? N.display : null;
                    s.style.display = v == null || typeof v == 'boolean' ? '' : ('' + v).trim();
                  }
                } catch (Y) {
                  xt(f, f.return, Y);
                }
              }
            } else if (e.tag === 6) {
              if (l === null) {
                f = e;
                try {
                  f.stateNode.nodeValue = n ? '' : f.memoizedProps;
                } catch (Y) {
                  xt(f, f.return, Y);
                }
              }
            } else if (e.tag === 18) {
              if (l === null) {
                f = e;
                try {
                  var x = f.stateNode;
                  n ? Lo(x, !0) : Lo(f.stateNode, !1);
                } catch (Y) {
                  xt(f, f.return, Y);
                }
              }
            } else if (((e.tag !== 22 && e.tag !== 23) || e.memoizedState === null || e === t) && e.child !== null) {
              ((e.child.return = e), (e = e.child));
              continue;
            }
            if (e === t) break t;
            for (; e.sibling === null; ) {
              if (e.return === null || e.return === t) break t;
              (l === e && (l = null), (e = e.return));
            }
            (l === e && (l = null), (e.sibling.return = e.return), (e = e.sibling));
          }
        a & 4 &&
          ((a = t.updateQueue), a !== null && ((l = a.retryQueue), l !== null && ((a.retryQueue = null), mu(t, l))));
        break;
      case 19:
        (ae(e, t), ne(t), a & 4 && ((a = t.updateQueue), a !== null && ((t.updateQueue = null), mu(t, a))));
        break;
      case 30:
        break;
      case 21:
        break;
      default:
        (ae(e, t), ne(t));
    }
  }
  function ne(t) {
    var e = t.flags;
    if (e & 2) {
      try {
        for (var l, a = t.return; a !== null; ) {
          if (Zr(a)) {
            l = a;
            break;
          }
          a = a.return;
        }
        if (l == null) throw Error(d(160));
        switch (l.tag) {
          case 27:
            var n = l.stateNode,
              u = bi(t);
            du(t, u, n);
            break;
          case 5:
            var c = l.stateNode;
            l.flags & 32 && (kl(c, ''), (l.flags &= -33));
            var s = bi(t);
            du(t, s, c);
            break;
          case 3:
          case 4:
            var f = l.stateNode.containerInfo,
              g = bi(t);
            xi(t, g, f);
            break;
          default:
            throw Error(d(161));
        }
      } catch (E) {
        xt(t, t.return, E);
      }
      t.flags &= -3;
    }
    e & 4096 && (t.flags &= -4097);
  }
  function Pr(t) {
    if (t.subtreeFlags & 1024)
      for (t = t.child; t !== null; ) {
        var e = t;
        (Pr(e), e.tag === 5 && e.flags & 1024 && e.stateNode.reset(), (t = t.sibling));
      }
  }
  function Je(t, e) {
    if (e.subtreeFlags & 8772) for (e = e.child; e !== null; ) (Jr(t, e.alternate, e), (e = e.sibling));
  }
  function Gl(t) {
    for (t = t.child; t !== null; ) {
      var e = t;
      switch (e.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          (rl(4, e, e.return), Gl(e));
          break;
        case 1:
          De(e, e.return);
          var l = e.stateNode;
          (typeof l.componentWillUnmount == 'function' && Qr(e, e.return, l), Gl(e));
          break;
        case 27:
          mn(e.stateNode);
        case 26:
        case 5:
          (De(e, e.return), Gl(e));
          break;
        case 22:
          e.memoizedState === null && Gl(e);
          break;
        case 30:
          Gl(e);
          break;
        default:
          Gl(e);
      }
      t = t.sibling;
    }
  }
  function ke(t, e, l) {
    for (l = l && (e.subtreeFlags & 8772) !== 0, e = e.child; e !== null; ) {
      var a = e.alternate,
        n = t,
        u = e,
        c = u.flags;
      switch (u.tag) {
        case 0:
        case 11:
        case 15:
          (ke(n, u, l), ln(4, u));
          break;
        case 1:
          if ((ke(n, u, l), (a = u), (n = a.stateNode), typeof n.componentDidMount == 'function'))
            try {
              n.componentDidMount();
            } catch (g) {
              xt(a, a.return, g);
            }
          if (((a = u), (n = a.updateQueue), n !== null)) {
            var s = a.stateNode;
            try {
              var f = n.shared.hiddenCallbacks;
              if (f !== null) for (n.shared.hiddenCallbacks = null, n = 0; n < f.length; n++) Cf(f[n], s);
            } catch (g) {
              xt(a, a.return, g);
            }
          }
          (l && c & 64 && Xr(u), an(u, u.return));
          break;
        case 27:
          Vr(u);
        case 26:
        case 5:
          (ke(n, u, l), l && a === null && c & 4 && Lr(u), an(u, u.return));
          break;
        case 12:
          ke(n, u, l);
          break;
        case 31:
          (ke(n, u, l), l && c & 4 && Wr(n, u));
          break;
        case 13:
          (ke(n, u, l), l && c & 4 && Fr(n, u));
          break;
        case 22:
          (u.memoizedState === null && ke(n, u, l), an(u, u.return));
          break;
        case 30:
          break;
        default:
          ke(n, u, l);
      }
      e = e.sibling;
    }
  }
  function Si(t, e) {
    var l = null;
    (t !== null &&
      t.memoizedState !== null &&
      t.memoizedState.cachePool !== null &&
      (l = t.memoizedState.cachePool.pool),
      (t = null),
      e.memoizedState !== null && e.memoizedState.cachePool !== null && (t = e.memoizedState.cachePool.pool),
      t !== l && (t != null && t.refCount++, l != null && La(l)));
  }
  function Ei(t, e) {
    ((t = null),
      e.alternate !== null && (t = e.alternate.memoizedState.cache),
      (e = e.memoizedState.cache),
      e !== t && (e.refCount++, t != null && La(t)));
  }
  function Oe(t, e, l, a) {
    if (e.subtreeFlags & 10256) for (e = e.child; e !== null; ) (to(t, e, l, a), (e = e.sibling));
  }
  function to(t, e, l, a) {
    var n = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        (Oe(t, e, l, a), n & 2048 && ln(9, e));
        break;
      case 1:
        Oe(t, e, l, a);
        break;
      case 3:
        (Oe(t, e, l, a),
          n & 2048 &&
            ((t = null),
            e.alternate !== null && (t = e.alternate.memoizedState.cache),
            (e = e.memoizedState.cache),
            e !== t && (e.refCount++, t != null && La(t))));
        break;
      case 12:
        if (n & 2048) {
          (Oe(t, e, l, a), (t = e.stateNode));
          try {
            var u = e.memoizedProps,
              c = u.id,
              s = u.onPostCommit;
            typeof s == 'function' && s(c, e.alternate === null ? 'mount' : 'update', t.passiveEffectDuration, -0);
          } catch (f) {
            xt(e, e.return, f);
          }
        } else Oe(t, e, l, a);
        break;
      case 31:
        Oe(t, e, l, a);
        break;
      case 13:
        Oe(t, e, l, a);
        break;
      case 23:
        break;
      case 22:
        ((u = e.stateNode),
          (c = e.alternate),
          e.memoizedState !== null
            ? u._visibility & 2
              ? Oe(t, e, l, a)
              : nn(t, e)
            : u._visibility & 2
              ? Oe(t, e, l, a)
              : ((u._visibility |= 2), ha(t, e, l, a, (e.subtreeFlags & 10256) !== 0 || !1)),
          n & 2048 && Si(c, e));
        break;
      case 24:
        (Oe(t, e, l, a), n & 2048 && Ei(e.alternate, e));
        break;
      default:
        Oe(t, e, l, a);
    }
  }
  function ha(t, e, l, a, n) {
    for (n = n && ((e.subtreeFlags & 10256) !== 0 || !1), e = e.child; e !== null; ) {
      var u = t,
        c = e,
        s = l,
        f = a,
        g = c.flags;
      switch (c.tag) {
        case 0:
        case 11:
        case 15:
          (ha(u, c, s, f, n), ln(8, c));
          break;
        case 23:
          break;
        case 22:
          var E = c.stateNode;
          (c.memoizedState !== null
            ? E._visibility & 2
              ? ha(u, c, s, f, n)
              : nn(u, c)
            : ((E._visibility |= 2), ha(u, c, s, f, n)),
            n && g & 2048 && Si(c.alternate, c));
          break;
        case 24:
          (ha(u, c, s, f, n), n && g & 2048 && Ei(c.alternate, c));
          break;
        default:
          ha(u, c, s, f, n);
      }
      e = e.sibling;
    }
  }
  function nn(t, e) {
    if (e.subtreeFlags & 10256)
      for (e = e.child; e !== null; ) {
        var l = t,
          a = e,
          n = a.flags;
        switch (a.tag) {
          case 22:
            (nn(l, a), n & 2048 && Si(a.alternate, a));
            break;
          case 24:
            (nn(l, a), n & 2048 && Ei(a.alternate, a));
            break;
          default:
            nn(l, a);
        }
        e = e.sibling;
      }
  }
  var un = 8192;
  function ya(t, e, l) {
    if (t.subtreeFlags & un) for (t = t.child; t !== null; ) (eo(t, e, l), (t = t.sibling));
  }
  function eo(t, e, l) {
    switch (t.tag) {
      case 26:
        (ya(t, e, l), t.flags & un && t.memoizedState !== null && Gm(l, Me, t.memoizedState, t.memoizedProps));
        break;
      case 5:
        ya(t, e, l);
        break;
      case 3:
      case 4:
        var a = Me;
        ((Me = Au(t.stateNode.containerInfo)), ya(t, e, l), (Me = a));
        break;
      case 22:
        t.memoizedState === null &&
          ((a = t.alternate),
          a !== null && a.memoizedState !== null ? ((a = un), (un = 16777216), ya(t, e, l), (un = a)) : ya(t, e, l));
        break;
      default:
        ya(t, e, l);
    }
  }
  function lo(t) {
    var e = t.alternate;
    if (e !== null && ((t = e.child), t !== null)) {
      e.child = null;
      do ((e = t.sibling), (t.sibling = null), (t = e));
      while (t !== null);
    }
  }
  function cn(t) {
    var e = t.deletions;
    if ((t.flags & 16) !== 0) {
      if (e !== null)
        for (var l = 0; l < e.length; l++) {
          var a = e[l];
          ((Lt = a), no(a, t));
        }
      lo(t);
    }
    if (t.subtreeFlags & 10256) for (t = t.child; t !== null; ) (ao(t), (t = t.sibling));
  }
  function ao(t) {
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        (cn(t), t.flags & 2048 && rl(9, t, t.return));
        break;
      case 3:
        cn(t);
        break;
      case 12:
        cn(t);
        break;
      case 22:
        var e = t.stateNode;
        t.memoizedState !== null && e._visibility & 2 && (t.return === null || t.return.tag !== 13)
          ? ((e._visibility &= -3), hu(t))
          : cn(t);
        break;
      default:
        cn(t);
    }
  }
  function hu(t) {
    var e = t.deletions;
    if ((t.flags & 16) !== 0) {
      if (e !== null)
        for (var l = 0; l < e.length; l++) {
          var a = e[l];
          ((Lt = a), no(a, t));
        }
      lo(t);
    }
    for (t = t.child; t !== null; ) {
      switch (((e = t), e.tag)) {
        case 0:
        case 11:
        case 15:
          (rl(8, e, e.return), hu(e));
          break;
        case 22:
          ((l = e.stateNode), l._visibility & 2 && ((l._visibility &= -3), hu(e)));
          break;
        default:
          hu(e);
      }
      t = t.sibling;
    }
  }
  function no(t, e) {
    for (; Lt !== null; ) {
      var l = Lt;
      switch (l.tag) {
        case 0:
        case 11:
        case 15:
          rl(8, l, e);
          break;
        case 23:
        case 22:
          if (l.memoizedState !== null && l.memoizedState.cachePool !== null) {
            var a = l.memoizedState.cachePool.pool;
            a != null && a.refCount++;
          }
          break;
        case 24:
          La(l.memoizedState.cache);
      }
      if (((a = l.child), a !== null)) ((a.return = l), (Lt = a));
      else
        t: for (l = t; Lt !== null; ) {
          a = Lt;
          var n = a.sibling,
            u = a.return;
          if ((kr(a), a === l)) {
            Lt = null;
            break t;
          }
          if (n !== null) {
            ((n.return = u), (Lt = n));
            break t;
          }
          Lt = u;
        }
    }
  }
  var em = {
      getCacheForType: function (t) {
        var e = Kt(Bt),
          l = e.data.get(t);
        return (l === void 0 && ((l = t()), e.data.set(t, l)), l);
      },
      cacheSignal: function () {
        return Kt(Bt).controller.signal;
      },
    },
    lm = typeof WeakMap == 'function' ? WeakMap : Map,
    gt = 0,
    jt = null,
    it = null,
    ft = 0,
    bt = 0,
    he = null,
    ol = !1,
    ga = !1,
    ji = !1,
    $e = 0,
    _t = 0,
    dl = 0,
    Xl = 0,
    Ni = 0,
    ye = 0,
    va = 0,
    sn = null,
    ue = null,
    Ti = !1,
    yu = 0,
    uo = 0,
    gu = 1 / 0,
    vu = null,
    ml = null,
    Xt = 0,
    hl = null,
    ba = null,
    We = 0,
    zi = 0,
    Ai = null,
    co = null,
    fn = 0,
    Mi = null;
  function ge() {
    return (gt & 2) !== 0 && ft !== 0 ? ft & -ft : m.T !== null ? Ri() : Ss();
  }
  function io() {
    if (ye === 0)
      if ((ft & 536870912) === 0 || ot) {
        var t = Tn;
        ((Tn <<= 1), (Tn & 3932160) === 0 && (Tn = 262144), (ye = t));
      } else ye = 536870912;
    return ((t = de.current), t !== null && (t.flags |= 32), ye);
  }
  function ce(t, e, l) {
    (((t === jt && (bt === 2 || bt === 9)) || t.cancelPendingCommit !== null) && (xa(t, 0), yl(t, ft, ye, !1)),
      Oa(t, l),
      ((gt & 2) === 0 || t !== jt) &&
        (t === jt && ((gt & 2) === 0 && (Xl |= l), _t === 4 && yl(t, ft, ye, !1)), Ue(t)));
  }
  function so(t, e, l) {
    if ((gt & 6) !== 0) throw Error(d(327));
    var a = (!l && (e & 127) === 0 && (e & t.expiredLanes) === 0) || Ma(t, e),
      n = a ? um(t, e) : Ci(t, e, !0),
      u = a;
    do {
      if (n === 0) {
        ga && !a && yl(t, e, 0, !1);
        break;
      } else {
        if (((l = t.current.alternate), u && !am(l))) {
          ((n = Ci(t, e, !1)), (u = !1));
          continue;
        }
        if (n === 2) {
          if (((u = e), t.errorRecoveryDisabledLanes & u)) var c = 0;
          else ((c = t.pendingLanes & -536870913), (c = c !== 0 ? c : c & 536870912 ? 536870912 : 0));
          if (c !== 0) {
            e = c;
            t: {
              var s = t;
              n = sn;
              var f = s.current.memoizedState.isDehydrated;
              if ((f && (xa(s, c).flags |= 256), (c = Ci(s, c, !1)), c !== 2)) {
                if (ji && !f) {
                  ((s.errorRecoveryDisabledLanes |= u), (Xl |= u), (n = 4));
                  break t;
                }
                ((u = ue), (ue = n), u !== null && (ue === null ? (ue = u) : ue.push.apply(ue, u)));
              }
              n = c;
            }
            if (((u = !1), n !== 2)) continue;
          }
        }
        if (n === 1) {
          (xa(t, 0), yl(t, e, 0, !0));
          break;
        }
        t: {
          switch (((a = t), (u = n), u)) {
            case 0:
            case 1:
              throw Error(d(345));
            case 4:
              if ((e & 4194048) !== e) break;
            case 6:
              yl(a, e, ye, !ol);
              break t;
            case 2:
              ue = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(d(329));
          }
          if ((e & 62914560) === e && ((n = yu + 300 - ie()), 10 < n)) {
            if ((yl(a, e, ye, !ol), An(a, 0, !0) !== 0)) break t;
            ((We = e),
              (a.timeoutHandle = Go(fo.bind(null, a, l, ue, vu, Ti, e, ye, Xl, va, ol, u, 'Throttled', -0, 0), n)));
            break t;
          }
          fo(a, l, ue, vu, Ti, e, ye, Xl, va, ol, u, null, -0, 0);
        }
      }
      break;
    } while (!0);
    Ue(t);
  }
  function fo(t, e, l, a, n, u, c, s, f, g, E, N, v, x) {
    if (((t.timeoutHandle = -1), (N = e.subtreeFlags), N & 8192 || (N & 16785408) === 16785408)) {
      ((N = {
        stylesheets: null,
        count: 0,
        imgCount: 0,
        imgBytes: 0,
        suspenseyImages: [],
        waitingForImages: !0,
        waitingForViewTransition: !1,
        unsuspend: He,
      }),
        eo(e, u, N));
      var Y = (u & 62914560) === u ? yu - ie() : (u & 4194048) === u ? uo - ie() : 0;
      if (((Y = Xm(N, Y)), Y !== null)) {
        ((We = u),
          (t.cancelPendingCommit = Y(bo.bind(null, t, e, u, l, a, n, c, s, f, E, N, null, v, x))),
          yl(t, u, c, !g));
        return;
      }
    }
    bo(t, e, u, l, a, n, c, s, f);
  }
  function am(t) {
    for (var e = t; ; ) {
      var l = e.tag;
      if (
        (l === 0 || l === 11 || l === 15) &&
        e.flags & 16384 &&
        ((l = e.updateQueue), l !== null && ((l = l.stores), l !== null))
      )
        for (var a = 0; a < l.length; a++) {
          var n = l[a],
            u = n.getSnapshot;
          n = n.value;
          try {
            if (!re(u(), n)) return !1;
          } catch {
            return !1;
          }
        }
      if (((l = e.child), e.subtreeFlags & 16384 && l !== null)) ((l.return = e), (e = l));
      else {
        if (e === t) break;
        for (; e.sibling === null; ) {
          if (e.return === null || e.return === t) return !0;
          e = e.return;
        }
        ((e.sibling.return = e.return), (e = e.sibling));
      }
    }
    return !0;
  }
  function yl(t, e, l, a) {
    ((e &= ~Ni),
      (e &= ~Xl),
      (t.suspendedLanes |= e),
      (t.pingedLanes &= ~e),
      a && (t.warmLanes |= e),
      (a = t.expirationTimes));
    for (var n = e; 0 < n; ) {
      var u = 31 - fe(n),
        c = 1 << u;
      ((a[u] = -1), (n &= ~c));
    }
    l !== 0 && bs(t, l, e);
  }
  function bu() {
    return (gt & 6) === 0 ? (rn(0), !1) : !0;
  }
  function Oi() {
    if (it !== null) {
      if (bt === 0) var t = it.return;
      else ((t = it), (Ye = Dl = null), Vc(t), (fa = null), (Va = 0), (t = it));
      for (; t !== null; ) (Gr(t.alternate, t), (t = t.return));
      it = null;
    }
  }
  function xa(t, e) {
    var l = t.timeoutHandle;
    (l !== -1 && ((t.timeoutHandle = -1), jm(l)),
      (l = t.cancelPendingCommit),
      l !== null && ((t.cancelPendingCommit = null), l()),
      (We = 0),
      Oi(),
      (jt = t),
      (it = l = Be(t.current, null)),
      (ft = e),
      (bt = 0),
      (he = null),
      (ol = !1),
      (ga = Ma(t, e)),
      (ji = !1),
      (va = ye = Ni = Xl = dl = _t = 0),
      (ue = sn = null),
      (Ti = !1),
      (e & 8) !== 0 && (e |= e & 32));
    var a = t.entangledLanes;
    if (a !== 0)
      for (t = t.entanglements, a &= e; 0 < a; ) {
        var n = 31 - fe(a),
          u = 1 << n;
        ((e |= t[n]), (a &= ~u));
      }
    return (($e = e), Yn(), l);
  }
  function ro(t, e) {
    ((tt = null),
      (m.H = Pa),
      e === sa || e === Jn
        ? ((e = zf()), (bt = 3))
        : e === Uc
          ? ((e = zf()), (bt = 4))
          : (bt = e === ii ? 8 : e !== null && typeof e == 'object' && typeof e.then == 'function' ? 6 : 1),
      (he = e),
      it === null && ((_t = 1), iu(t, pe(e, t.current))));
  }
  function oo() {
    var t = de.current;
    return t === null
      ? !0
      : (ft & 4194048) === ft
        ? Ne === null
        : (ft & 62914560) === ft || (ft & 536870912) !== 0
          ? t === Ne
          : !1;
  }
  function mo() {
    var t = m.H;
    return ((m.H = Pa), t === null ? Pa : t);
  }
  function ho() {
    var t = m.A;
    return ((m.A = em), t);
  }
  function xu() {
    ((_t = 4),
      ol || ((ft & 4194048) !== ft && de.current !== null) || (ga = !0),
      ((dl & 134217727) === 0 && (Xl & 134217727) === 0) || jt === null || yl(jt, ft, ye, !1));
  }
  function Ci(t, e, l) {
    var a = gt;
    gt |= 2;
    var n = mo(),
      u = ho();
    ((jt !== t || ft !== e) && ((vu = null), xa(t, e)), (e = !1));
    var c = _t;
    t: do
      try {
        if (bt !== 0 && it !== null) {
          var s = it,
            f = he;
          switch (bt) {
            case 8:
              (Oi(), (c = 6));
              break t;
            case 3:
            case 2:
            case 9:
            case 6:
              de.current === null && (e = !0);
              var g = bt;
              if (((bt = 0), (he = null), pa(t, s, f, g), l && ga)) {
                c = 0;
                break t;
              }
              break;
            default:
              ((g = bt), (bt = 0), (he = null), pa(t, s, f, g));
          }
        }
        (nm(), (c = _t));
        break;
      } catch (E) {
        ro(t, E);
      }
    while (!0);
    return (
      e && t.shellSuspendCounter++,
      (Ye = Dl = null),
      (gt = a),
      (m.H = n),
      (m.A = u),
      it === null && ((jt = null), (ft = 0), Yn()),
      c
    );
  }
  function nm() {
    for (; it !== null; ) yo(it);
  }
  function um(t, e) {
    var l = gt;
    gt |= 2;
    var a = mo(),
      n = ho();
    jt !== t || ft !== e ? ((vu = null), (gu = ie() + 500), xa(t, e)) : (ga = Ma(t, e));
    t: do
      try {
        if (bt !== 0 && it !== null) {
          e = it;
          var u = he;
          e: switch (bt) {
            case 1:
              ((bt = 0), (he = null), pa(t, e, u, 1));
              break;
            case 2:
            case 9:
              if (Nf(u)) {
                ((bt = 0), (he = null), go(e));
                break;
              }
              ((e = function () {
                ((bt !== 2 && bt !== 9) || jt !== t || (bt = 7), Ue(t));
              }),
                u.then(e, e));
              break t;
            case 3:
              bt = 7;
              break t;
            case 4:
              bt = 5;
              break t;
            case 7:
              Nf(u) ? ((bt = 0), (he = null), go(e)) : ((bt = 0), (he = null), pa(t, e, u, 7));
              break;
            case 5:
              var c = null;
              switch (it.tag) {
                case 26:
                  c = it.memoizedState;
                case 5:
                case 27:
                  var s = it;
                  if (c ? ed(c) : s.stateNode.complete) {
                    ((bt = 0), (he = null));
                    var f = s.sibling;
                    if (f !== null) it = f;
                    else {
                      var g = s.return;
                      g !== null ? ((it = g), pu(g)) : (it = null);
                    }
                    break e;
                  }
              }
              ((bt = 0), (he = null), pa(t, e, u, 5));
              break;
            case 6:
              ((bt = 0), (he = null), pa(t, e, u, 6));
              break;
            case 8:
              (Oi(), (_t = 6));
              break t;
            default:
              throw Error(d(462));
          }
        }
        cm();
        break;
      } catch (E) {
        ro(t, E);
      }
    while (!0);
    return ((Ye = Dl = null), (m.H = a), (m.A = n), (gt = l), it !== null ? 0 : ((jt = null), (ft = 0), Yn(), _t));
  }
  function cm() {
    for (; it !== null && !Od(); ) yo(it);
  }
  function yo(t) {
    var e = qr(t.alternate, t, $e);
    ((t.memoizedProps = t.pendingProps), e === null ? pu(t) : (it = e));
  }
  function go(t) {
    var e = t,
      l = e.alternate;
    switch (e.tag) {
      case 15:
      case 0:
        e = Dr(l, e, e.pendingProps, e.type, void 0, ft);
        break;
      case 11:
        e = Dr(l, e, e.pendingProps, e.type.render, e.ref, ft);
        break;
      case 5:
        Vc(e);
      default:
        (Gr(l, e), (e = it = mf(e, $e)), (e = qr(l, e, $e)));
    }
    ((t.memoizedProps = t.pendingProps), e === null ? pu(t) : (it = e));
  }
  function pa(t, e, l, a) {
    ((Ye = Dl = null), Vc(e), (fa = null), (Va = 0));
    var n = e.return;
    try {
      if (k0(t, n, e, l, ft)) {
        ((_t = 1), iu(t, pe(l, t.current)), (it = null));
        return;
      }
    } catch (u) {
      if (n !== null) throw ((it = n), u);
      ((_t = 1), iu(t, pe(l, t.current)), (it = null));
      return;
    }
    e.flags & 32768
      ? (ot || a === 1
          ? (t = !0)
          : ga || (ft & 536870912) !== 0
            ? (t = !1)
            : ((ol = t = !0),
              (a === 2 || a === 9 || a === 3 || a === 6) &&
                ((a = de.current), a !== null && a.tag === 13 && (a.flags |= 16384))),
        vo(e, t))
      : pu(e);
  }
  function pu(t) {
    var e = t;
    do {
      if ((e.flags & 32768) !== 0) {
        vo(e, ol);
        return;
      }
      t = e.return;
      var l = F0(e.alternate, e, $e);
      if (l !== null) {
        it = l;
        return;
      }
      if (((e = e.sibling), e !== null)) {
        it = e;
        return;
      }
      it = e = t;
    } while (e !== null);
    _t === 0 && (_t = 5);
  }
  function vo(t, e) {
    do {
      var l = I0(t.alternate, t);
      if (l !== null) {
        ((l.flags &= 32767), (it = l));
        return;
      }
      if (
        ((l = t.return),
        l !== null && ((l.flags |= 32768), (l.subtreeFlags = 0), (l.deletions = null)),
        !e && ((t = t.sibling), t !== null))
      ) {
        it = t;
        return;
      }
      it = t = l;
    } while (t !== null);
    ((_t = 6), (it = null));
  }
  function bo(t, e, l, a, n, u, c, s, f) {
    t.cancelPendingCommit = null;
    do Su();
    while (Xt !== 0);
    if ((gt & 6) !== 0) throw Error(d(327));
    if (e !== null) {
      if (e === t.current) throw Error(d(177));
      if (
        ((u = e.lanes | e.childLanes),
        (u |= bc),
        Yd(t, l, u, c, s, f),
        t === jt && ((it = jt = null), (ft = 0)),
        (ba = e),
        (hl = t),
        (We = l),
        (zi = u),
        (Ai = n),
        (co = a),
        (e.subtreeFlags & 10256) !== 0 || (e.flags & 10256) !== 0
          ? ((t.callbackNode = null),
            (t.callbackPriority = 0),
            rm(jn, function () {
              return (jo(), null);
            }))
          : ((t.callbackNode = null), (t.callbackPriority = 0)),
        (a = (e.flags & 13878) !== 0),
        (e.subtreeFlags & 13878) !== 0 || a)
      ) {
        ((a = m.T), (m.T = null), (n = M.p), (M.p = 2), (c = gt), (gt |= 4));
        try {
          P0(t, e, l);
        } finally {
          ((gt = c), (M.p = n), (m.T = a));
        }
      }
      ((Xt = 1), xo(), po(), So());
    }
  }
  function xo() {
    if (Xt === 1) {
      Xt = 0;
      var t = hl,
        e = ba,
        l = (e.flags & 13878) !== 0;
      if ((e.subtreeFlags & 13878) !== 0 || l) {
        ((l = m.T), (m.T = null));
        var a = M.p;
        M.p = 2;
        var n = gt;
        gt |= 4;
        try {
          Ir(e, t);
          var u = Qi,
            c = af(t.containerInfo),
            s = u.focusedElem,
            f = u.selectionRange;
          if (c !== s && s && s.ownerDocument && lf(s.ownerDocument.documentElement, s)) {
            if (f !== null && mc(s)) {
              var g = f.start,
                E = f.end;
              if ((E === void 0 && (E = g), 'selectionStart' in s))
                ((s.selectionStart = g), (s.selectionEnd = Math.min(E, s.value.length)));
              else {
                var N = s.ownerDocument || document,
                  v = (N && N.defaultView) || window;
                if (v.getSelection) {
                  var x = v.getSelection(),
                    Y = s.textContent.length,
                    V = Math.min(f.start, Y),
                    Et = f.end === void 0 ? V : Math.min(f.end, Y);
                  !x.extend && V > Et && ((c = Et), (Et = V), (V = c));
                  var h = ef(s, V),
                    r = ef(s, Et);
                  if (
                    h &&
                    r &&
                    (x.rangeCount !== 1 ||
                      x.anchorNode !== h.node ||
                      x.anchorOffset !== h.offset ||
                      x.focusNode !== r.node ||
                      x.focusOffset !== r.offset)
                  ) {
                    var y = N.createRange();
                    (y.setStart(h.node, h.offset),
                      x.removeAllRanges(),
                      V > Et
                        ? (x.addRange(y), x.extend(r.node, r.offset))
                        : (y.setEnd(r.node, r.offset), x.addRange(y)));
                  }
                }
              }
            }
            for (N = [], x = s; (x = x.parentNode); )
              x.nodeType === 1 && N.push({ element: x, left: x.scrollLeft, top: x.scrollTop });
            for (typeof s.focus == 'function' && s.focus(), s = 0; s < N.length; s++) {
              var j = N[s];
              ((j.element.scrollLeft = j.left), (j.element.scrollTop = j.top));
            }
          }
          ((Uu = !!Xi), (Qi = Xi = null));
        } finally {
          ((gt = n), (M.p = a), (m.T = l));
        }
      }
      ((t.current = e), (Xt = 2));
    }
  }
  function po() {
    if (Xt === 2) {
      Xt = 0;
      var t = hl,
        e = ba,
        l = (e.flags & 8772) !== 0;
      if ((e.subtreeFlags & 8772) !== 0 || l) {
        ((l = m.T), (m.T = null));
        var a = M.p;
        M.p = 2;
        var n = gt;
        gt |= 4;
        try {
          Jr(t, e.alternate, e);
        } finally {
          ((gt = n), (M.p = a), (m.T = l));
        }
      }
      Xt = 3;
    }
  }
  function So() {
    if (Xt === 4 || Xt === 3) {
      ((Xt = 0), Cd());
      var t = hl,
        e = ba,
        l = We,
        a = co;
      (e.subtreeFlags & 10256) !== 0 || (e.flags & 10256) !== 0
        ? (Xt = 5)
        : ((Xt = 0), (ba = hl = null), Eo(t, t.pendingLanes));
      var n = t.pendingLanes;
      if ((n === 0 && (ml = null), ku(l), (e = e.stateNode), se && typeof se.onCommitFiberRoot == 'function'))
        try {
          se.onCommitFiberRoot(Aa, e, void 0, (e.current.flags & 128) === 128);
        } catch {}
      if (a !== null) {
        ((e = m.T), (n = M.p), (M.p = 2), (m.T = null));
        try {
          for (var u = t.onRecoverableError, c = 0; c < a.length; c++) {
            var s = a[c];
            u(s.value, { componentStack: s.stack });
          }
        } finally {
          ((m.T = e), (M.p = n));
        }
      }
      ((We & 3) !== 0 && Su(),
        Ue(t),
        (n = t.pendingLanes),
        (l & 261930) !== 0 && (n & 42) !== 0 ? (t === Mi ? fn++ : ((fn = 0), (Mi = t))) : (fn = 0),
        rn(0));
    }
  }
  function Eo(t, e) {
    (t.pooledCacheLanes &= e) === 0 && ((e = t.pooledCache), e != null && ((t.pooledCache = null), La(e)));
  }
  function Su() {
    return (xo(), po(), So(), jo());
  }
  function jo() {
    if (Xt !== 5) return !1;
    var t = hl,
      e = zi;
    zi = 0;
    var l = ku(We),
      a = m.T,
      n = M.p;
    try {
      ((M.p = 32 > l ? 32 : l), (m.T = null), (l = Ai), (Ai = null));
      var u = hl,
        c = We;
      if (((Xt = 0), (ba = hl = null), (We = 0), (gt & 6) !== 0)) throw Error(d(331));
      var s = gt;
      if (
        ((gt |= 4),
        ao(u.current),
        to(u, u.current, c, l),
        (gt = s),
        rn(0, !1),
        se && typeof se.onPostCommitFiberRoot == 'function')
      )
        try {
          se.onPostCommitFiberRoot(Aa, u);
        } catch {}
      return !0;
    } finally {
      ((M.p = n), (m.T = a), Eo(t, e));
    }
  }
  function No(t, e, l) {
    ((e = pe(l, e)), (e = ci(t.stateNode, e, 2)), (t = il(t, e, 2)), t !== null && (Oa(t, 2), Ue(t)));
  }
  function xt(t, e, l) {
    if (t.tag === 3) No(t, t, l);
    else
      for (; e !== null; ) {
        if (e.tag === 3) {
          No(e, t, l);
          break;
        } else if (e.tag === 1) {
          var a = e.stateNode;
          if (
            typeof e.type.getDerivedStateFromError == 'function' ||
            (typeof a.componentDidCatch == 'function' && (ml === null || !ml.has(a)))
          ) {
            ((t = pe(l, t)), (l = Nr(2)), (a = il(e, l, 2)), a !== null && (Tr(l, a, e, t), Oa(a, 2), Ue(a)));
            break;
          }
        }
        e = e.return;
      }
  }
  function _i(t, e, l) {
    var a = t.pingCache;
    if (a === null) {
      a = t.pingCache = new lm();
      var n = new Set();
      a.set(e, n);
    } else ((n = a.get(e)), n === void 0 && ((n = new Set()), a.set(e, n)));
    n.has(l) || ((ji = !0), n.add(l), (t = im.bind(null, t, e, l)), e.then(t, t));
  }
  function im(t, e, l) {
    var a = t.pingCache;
    (a !== null && a.delete(e),
      (t.pingedLanes |= t.suspendedLanes & l),
      (t.warmLanes &= ~l),
      jt === t &&
        (ft & l) === l &&
        (_t === 4 || (_t === 3 && (ft & 62914560) === ft && 300 > ie() - yu) ? (gt & 2) === 0 && xa(t, 0) : (Ni |= l),
        va === ft && (va = 0)),
      Ue(t));
  }
  function To(t, e) {
    (e === 0 && (e = vs()), (t = Ol(t, e)), t !== null && (Oa(t, e), Ue(t)));
  }
  function sm(t) {
    var e = t.memoizedState,
      l = 0;
    (e !== null && (l = e.retryLane), To(t, l));
  }
  function fm(t, e) {
    var l = 0;
    switch (t.tag) {
      case 31:
      case 13:
        var a = t.stateNode,
          n = t.memoizedState;
        n !== null && (l = n.retryLane);
        break;
      case 19:
        a = t.stateNode;
        break;
      case 22:
        a = t.stateNode._retryCache;
        break;
      default:
        throw Error(d(314));
    }
    (a !== null && a.delete(e), To(t, l));
  }
  function rm(t, e) {
    return Zu(t, e);
  }
  var Eu = null,
    Sa = null,
    Di = !1,
    ju = !1,
    Ui = !1,
    gl = 0;
  function Ue(t) {
    (t !== Sa && t.next === null && (Sa === null ? (Eu = Sa = t) : (Sa = Sa.next = t)),
      (ju = !0),
      Di || ((Di = !0), dm()));
  }
  function rn(t, e) {
    if (!Ui && ju) {
      Ui = !0;
      do
        for (var l = !1, a = Eu; a !== null; ) {
          if (t !== 0) {
            var n = a.pendingLanes;
            if (n === 0) var u = 0;
            else {
              var c = a.suspendedLanes,
                s = a.pingedLanes;
              ((u = (1 << (31 - fe(42 | t) + 1)) - 1),
                (u &= n & ~(c & ~s)),
                (u = u & 201326741 ? (u & 201326741) | 1 : u ? u | 2 : 0));
            }
            u !== 0 && ((l = !0), Oo(a, u));
          } else
            ((u = ft),
              (u = An(a, a === jt ? u : 0, a.cancelPendingCommit !== null || a.timeoutHandle !== -1)),
              (u & 3) === 0 || Ma(a, u) || ((l = !0), Oo(a, u)));
          a = a.next;
        }
      while (l);
      Ui = !1;
    }
  }
  function om() {
    zo();
  }
  function zo() {
    ju = Di = !1;
    var t = 0;
    gl !== 0 && Em() && (t = gl);
    for (var e = ie(), l = null, a = Eu; a !== null; ) {
      var n = a.next,
        u = Ao(a, e);
      (u === 0
        ? ((a.next = null), l === null ? (Eu = n) : (l.next = n), n === null && (Sa = l))
        : ((l = a), (t !== 0 || (u & 3) !== 0) && (ju = !0)),
        (a = n));
    }
    ((Xt !== 0 && Xt !== 5) || rn(t), gl !== 0 && (gl = 0));
  }
  function Ao(t, e) {
    for (var l = t.suspendedLanes, a = t.pingedLanes, n = t.expirationTimes, u = t.pendingLanes & -62914561; 0 < u; ) {
      var c = 31 - fe(u),
        s = 1 << c,
        f = n[c];
      (f === -1 ? ((s & l) === 0 || (s & a) !== 0) && (n[c] = qd(s, e)) : f <= e && (t.expiredLanes |= s), (u &= ~s));
    }
    if (
      ((e = jt),
      (l = ft),
      (l = An(t, t === e ? l : 0, t.cancelPendingCommit !== null || t.timeoutHandle !== -1)),
      (a = t.callbackNode),
      l === 0 || (t === e && (bt === 2 || bt === 9)) || t.cancelPendingCommit !== null)
    )
      return (a !== null && a !== null && Vu(a), (t.callbackNode = null), (t.callbackPriority = 0));
    if ((l & 3) === 0 || Ma(t, l)) {
      if (((e = l & -l), e === t.callbackPriority)) return e;
      switch ((a !== null && Vu(a), ku(l))) {
        case 2:
        case 8:
          l = ys;
          break;
        case 32:
          l = jn;
          break;
        case 268435456:
          l = gs;
          break;
        default:
          l = jn;
      }
      return ((a = Mo.bind(null, t)), (l = Zu(l, a)), (t.callbackPriority = e), (t.callbackNode = l), e);
    }
    return (a !== null && a !== null && Vu(a), (t.callbackPriority = 2), (t.callbackNode = null), 2);
  }
  function Mo(t, e) {
    if (Xt !== 0 && Xt !== 5) return ((t.callbackNode = null), (t.callbackPriority = 0), null);
    var l = t.callbackNode;
    if (Su() && t.callbackNode !== l) return null;
    var a = ft;
    return (
      (a = An(t, t === jt ? a : 0, t.cancelPendingCommit !== null || t.timeoutHandle !== -1)),
      a === 0
        ? null
        : (so(t, a, e), Ao(t, ie()), t.callbackNode != null && t.callbackNode === l ? Mo.bind(null, t) : null)
    );
  }
  function Oo(t, e) {
    if (Su()) return null;
    so(t, e, !0);
  }
  function dm() {
    Nm(function () {
      (gt & 6) !== 0 ? Zu(hs, om) : zo();
    });
  }
  function Ri() {
    if (gl === 0) {
      var t = ca;
      (t === 0 && ((t = Nn), (Nn <<= 1), (Nn & 261888) === 0 && (Nn = 256)), (gl = t));
    }
    return gl;
  }
  function Co(t) {
    return t == null || typeof t == 'symbol' || typeof t == 'boolean' ? null : typeof t == 'function' ? t : _n('' + t);
  }
  function _o(t, e) {
    var l = e.ownerDocument.createElement('input');
    return (
      (l.name = e.name),
      (l.value = e.value),
      t.id && l.setAttribute('form', t.id),
      e.parentNode.insertBefore(l, e),
      (t = new FormData(t)),
      l.parentNode.removeChild(l),
      t
    );
  }
  function mm(t, e, l, a, n) {
    if (e === 'submit' && l && l.stateNode === n) {
      var u = Co((n[te] || null).action),
        c = a.submitter;
      c &&
        ((e = (e = c[te] || null) ? Co(e.formAction) : c.getAttribute('formAction')),
        e !== null && ((u = e), (c = null)));
      var s = new Hn('action', 'action', null, a, n);
      t.push({
        event: s,
        listeners: [
          {
            instance: null,
            listener: function () {
              if (a.defaultPrevented) {
                if (gl !== 0) {
                  var f = c ? _o(n, c) : new FormData(n);
                  ti(l, { pending: !0, data: f, method: n.method, action: u }, null, f);
                }
              } else
                typeof u == 'function' &&
                  (s.preventDefault(),
                  (f = c ? _o(n, c) : new FormData(n)),
                  ti(l, { pending: !0, data: f, method: n.method, action: u }, u, f));
            },
            currentTarget: n,
          },
        ],
      });
    }
  }
  for (var Hi = 0; Hi < vc.length; Hi++) {
    var wi = vc[Hi],
      hm = wi.toLowerCase(),
      ym = wi[0].toUpperCase() + wi.slice(1);
    Ae(hm, 'on' + ym);
  }
  (Ae(cf, 'onAnimationEnd'),
    Ae(sf, 'onAnimationIteration'),
    Ae(ff, 'onAnimationStart'),
    Ae('dblclick', 'onDoubleClick'),
    Ae('focusin', 'onFocus'),
    Ae('focusout', 'onBlur'),
    Ae(_0, 'onTransitionRun'),
    Ae(D0, 'onTransitionStart'),
    Ae(U0, 'onTransitionCancel'),
    Ae(rf, 'onTransitionEnd'),
    Kl('onMouseEnter', ['mouseout', 'mouseover']),
    Kl('onMouseLeave', ['mouseout', 'mouseover']),
    Kl('onPointerEnter', ['pointerout', 'pointerover']),
    Kl('onPointerLeave', ['pointerout', 'pointerover']),
    Tl('onChange', 'change click focusin focusout input keydown keyup selectionchange'.split(' ')),
    Tl('onSelect', 'focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange'.split(' ')),
    Tl('onBeforeInput', ['compositionend', 'keypress', 'textInput', 'paste']),
    Tl('onCompositionEnd', 'compositionend focusout keydown keypress keyup mousedown'.split(' ')),
    Tl('onCompositionStart', 'compositionstart focusout keydown keypress keyup mousedown'.split(' ')),
    Tl('onCompositionUpdate', 'compositionupdate focusout keydown keypress keyup mousedown'.split(' ')));
  var on =
      'abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting'.split(
        ' '
      ),
    gm = new Set('beforetoggle cancel close invalid load scroll scrollend toggle'.split(' ').concat(on));
  function Do(t, e) {
    e = (e & 4) !== 0;
    for (var l = 0; l < t.length; l++) {
      var a = t[l],
        n = a.event;
      a = a.listeners;
      t: {
        var u = void 0;
        if (e)
          for (var c = a.length - 1; 0 <= c; c--) {
            var s = a[c],
              f = s.instance,
              g = s.currentTarget;
            if (((s = s.listener), f !== u && n.isPropagationStopped())) break t;
            ((u = s), (n.currentTarget = g));
            try {
              u(n);
            } catch (E) {
              qn(E);
            }
            ((n.currentTarget = null), (u = f));
          }
        else
          for (c = 0; c < a.length; c++) {
            if (
              ((s = a[c]),
              (f = s.instance),
              (g = s.currentTarget),
              (s = s.listener),
              f !== u && n.isPropagationStopped())
            )
              break t;
            ((u = s), (n.currentTarget = g));
            try {
              u(n);
            } catch (E) {
              qn(E);
            }
            ((n.currentTarget = null), (u = f));
          }
      }
    }
  }
  function st(t, e) {
    var l = e[$u];
    l === void 0 && (l = e[$u] = new Set());
    var a = t + '__bubble';
    l.has(a) || (Uo(e, t, 2, !1), l.add(a));
  }
  function Bi(t, e, l) {
    var a = 0;
    (e && (a |= 4), Uo(l, t, a, e));
  }
  var Nu = '_reactListening' + Math.random().toString(36).slice(2);
  function qi(t) {
    if (!t[Nu]) {
      ((t[Nu] = !0),
        Ns.forEach(function (l) {
          l !== 'selectionchange' && (gm.has(l) || Bi(l, !1, t), Bi(l, !0, t));
        }));
      var e = t.nodeType === 9 ? t : t.ownerDocument;
      e === null || e[Nu] || ((e[Nu] = !0), Bi('selectionchange', !1, e));
    }
  }
  function Uo(t, e, l, a) {
    switch (sd(e)) {
      case 2:
        var n = Zm;
        break;
      case 8:
        n = Vm;
        break;
      default:
        n = Pi;
    }
    ((l = n.bind(null, e, l, t)),
      (n = void 0),
      !nc || (e !== 'touchstart' && e !== 'touchmove' && e !== 'wheel') || (n = !0),
      a
        ? n !== void 0
          ? t.addEventListener(e, l, { capture: !0, passive: n })
          : t.addEventListener(e, l, !0)
        : n !== void 0
          ? t.addEventListener(e, l, { passive: n })
          : t.addEventListener(e, l, !1));
  }
  function Yi(t, e, l, a, n) {
    var u = a;
    if ((e & 1) === 0 && (e & 2) === 0 && a !== null)
      t: for (;;) {
        if (a === null) return;
        var c = a.tag;
        if (c === 3 || c === 4) {
          var s = a.stateNode.containerInfo;
          if (s === n) break;
          if (c === 4)
            for (c = a.return; c !== null; ) {
              var f = c.tag;
              if ((f === 3 || f === 4) && c.stateNode.containerInfo === n) return;
              c = c.return;
            }
          for (; s !== null; ) {
            if (((c = Ll(s)), c === null)) return;
            if (((f = c.tag), f === 5 || f === 6 || f === 26 || f === 27)) {
              a = u = c;
              continue t;
            }
            s = s.parentNode;
          }
        }
        a = a.return;
      }
    ws(function () {
      var g = u,
        E = lc(l),
        N = [];
      t: {
        var v = of.get(t);
        if (v !== void 0) {
          var x = Hn,
            Y = t;
          switch (t) {
            case 'keypress':
              if (Un(l) === 0) break t;
            case 'keydown':
            case 'keyup':
              x = f0;
              break;
            case 'focusin':
              ((Y = 'focus'), (x = sc));
              break;
            case 'focusout':
              ((Y = 'blur'), (x = sc));
              break;
            case 'beforeblur':
            case 'afterblur':
              x = sc;
              break;
            case 'click':
              if (l.button === 2) break t;
            case 'auxclick':
            case 'dblclick':
            case 'mousedown':
            case 'mousemove':
            case 'mouseup':
            case 'mouseout':
            case 'mouseover':
            case 'contextmenu':
              x = Ys;
              break;
            case 'drag':
            case 'dragend':
            case 'dragenter':
            case 'dragexit':
            case 'dragleave':
            case 'dragover':
            case 'dragstart':
            case 'drop':
              x = Fd;
              break;
            case 'touchcancel':
            case 'touchend':
            case 'touchmove':
            case 'touchstart':
              x = d0;
              break;
            case cf:
            case sf:
            case ff:
              x = t0;
              break;
            case rf:
              x = h0;
              break;
            case 'scroll':
            case 'scrollend':
              x = $d;
              break;
            case 'wheel':
              x = g0;
              break;
            case 'copy':
            case 'cut':
            case 'paste':
              x = l0;
              break;
            case 'gotpointercapture':
            case 'lostpointercapture':
            case 'pointercancel':
            case 'pointerdown':
            case 'pointermove':
            case 'pointerout':
            case 'pointerover':
            case 'pointerup':
              x = Xs;
              break;
            case 'toggle':
            case 'beforetoggle':
              x = b0;
          }
          var V = (e & 4) !== 0,
            Et = !V && (t === 'scroll' || t === 'scrollend'),
            h = V ? (v !== null ? v + 'Capture' : null) : v;
          V = [];
          for (var r = g, y; r !== null; ) {
            var j = r;
            if (
              ((y = j.stateNode),
              (j = j.tag),
              (j !== 5 && j !== 26 && j !== 27) ||
                y === null ||
                h === null ||
                ((j = Da(r, h)), j != null && V.push(dn(r, j, y))),
              Et)
            )
              break;
            r = r.return;
          }
          0 < V.length && ((v = new x(v, Y, null, l, E)), N.push({ event: v, listeners: V }));
        }
      }
      if ((e & 7) === 0) {
        t: {
          if (
            ((v = t === 'mouseover' || t === 'pointerover'),
            (x = t === 'mouseout' || t === 'pointerout'),
            v && l !== ec && (Y = l.relatedTarget || l.fromElement) && (Ll(Y) || Y[Ql]))
          )
            break t;
          if (
            (x || v) &&
            ((v = E.window === E ? E : (v = E.ownerDocument) ? v.defaultView || v.parentWindow : window),
            x
              ? ((Y = l.relatedTarget || l.toElement),
                (x = g),
                (Y = Y ? Ll(Y) : null),
                Y !== null && ((Et = C(Y)), (V = Y.tag), Y !== Et || (V !== 5 && V !== 27 && V !== 6)) && (Y = null))
              : ((x = null), (Y = g)),
            x !== Y)
          ) {
            if (
              ((V = Ys),
              (j = 'onMouseLeave'),
              (h = 'onMouseEnter'),
              (r = 'mouse'),
              (t === 'pointerout' || t === 'pointerover') &&
                ((V = Xs), (j = 'onPointerLeave'), (h = 'onPointerEnter'), (r = 'pointer')),
              (Et = x == null ? v : _a(x)),
              (y = Y == null ? v : _a(Y)),
              (v = new V(j, r + 'leave', x, l, E)),
              (v.target = Et),
              (v.relatedTarget = y),
              (j = null),
              Ll(E) === g && ((V = new V(h, r + 'enter', Y, l, E)), (V.target = y), (V.relatedTarget = Et), (j = V)),
              (Et = j),
              x && Y)
            )
              e: {
                for (V = vm, h = x, r = Y, y = 0, j = h; j; j = V(j)) y++;
                j = 0;
                for (var L = r; L; L = V(L)) j++;
                for (; 0 < y - j; ) ((h = V(h)), y--);
                for (; 0 < j - y; ) ((r = V(r)), j--);
                for (; y--; ) {
                  if (h === r || (r !== null && h === r.alternate)) {
                    V = h;
                    break e;
                  }
                  ((h = V(h)), (r = V(r)));
                }
                V = null;
              }
            else V = null;
            (x !== null && Ro(N, v, x, V, !1), Y !== null && Et !== null && Ro(N, Et, Y, V, !0));
          }
        }
        t: {
          if (
            ((v = g ? _a(g) : window),
            (x = v.nodeName && v.nodeName.toLowerCase()),
            x === 'select' || (x === 'input' && v.type === 'file'))
          )
            var mt = $s;
          else if (Js(v))
            if (Ws) mt = M0;
            else {
              mt = z0;
              var X = T0;
            }
          else
            ((x = v.nodeName),
              !x || x.toLowerCase() !== 'input' || (v.type !== 'checkbox' && v.type !== 'radio')
                ? g && tc(g.elementType) && (mt = $s)
                : (mt = A0));
          if (mt && (mt = mt(t, g))) {
            ks(N, mt, l, E);
            break t;
          }
          (X && X(t, v, g),
            t === 'focusout' && g && v.type === 'number' && g.memoizedProps.value != null && Pu(v, 'number', v.value));
        }
        switch (((X = g ? _a(g) : window), t)) {
          case 'focusin':
            (Js(X) || X.contentEditable === 'true') && ((Il = X), (hc = g), (Ga = null));
            break;
          case 'focusout':
            Ga = hc = Il = null;
            break;
          case 'mousedown':
            yc = !0;
            break;
          case 'contextmenu':
          case 'mouseup':
          case 'dragend':
            ((yc = !1), nf(N, l, E));
            break;
          case 'selectionchange':
            if (C0) break;
          case 'keydown':
          case 'keyup':
            nf(N, l, E);
        }
        var lt;
        if (rc)
          t: {
            switch (t) {
              case 'compositionstart':
                var rt = 'onCompositionStart';
                break t;
              case 'compositionend':
                rt = 'onCompositionEnd';
                break t;
              case 'compositionupdate':
                rt = 'onCompositionUpdate';
                break t;
            }
            rt = void 0;
          }
        else
          Fl
            ? Vs(t, l) && (rt = 'onCompositionEnd')
            : t === 'keydown' && l.keyCode === 229 && (rt = 'onCompositionStart');
        (rt &&
          (Qs &&
            l.locale !== 'ko' &&
            (Fl || rt !== 'onCompositionStart'
              ? rt === 'onCompositionEnd' && Fl && (lt = Bs())
              : ((tl = E), (uc = 'value' in tl ? tl.value : tl.textContent), (Fl = !0))),
          (X = Tu(g, rt)),
          0 < X.length &&
            ((rt = new Gs(rt, t, null, l, E)),
            N.push({ event: rt, listeners: X }),
            lt ? (rt.data = lt) : ((lt = Ks(l)), lt !== null && (rt.data = lt)))),
          (lt = p0 ? S0(t, l) : E0(t, l)) &&
            ((rt = Tu(g, 'onBeforeInput')),
            0 < rt.length &&
              ((X = new Gs('onBeforeInput', 'beforeinput', null, l, E)),
              N.push({ event: X, listeners: rt }),
              (X.data = lt))),
          mm(N, t, g, l, E));
      }
      Do(N, e);
    });
  }
  function dn(t, e, l) {
    return { instance: t, listener: e, currentTarget: l };
  }
  function Tu(t, e) {
    for (var l = e + 'Capture', a = []; t !== null; ) {
      var n = t,
        u = n.stateNode;
      if (
        ((n = n.tag),
        (n !== 5 && n !== 26 && n !== 27) ||
          u === null ||
          ((n = Da(t, l)), n != null && a.unshift(dn(t, n, u)), (n = Da(t, e)), n != null && a.push(dn(t, n, u))),
        t.tag === 3)
      )
        return a;
      t = t.return;
    }
    return [];
  }
  function vm(t) {
    if (t === null) return null;
    do t = t.return;
    while (t && t.tag !== 5 && t.tag !== 27);
    return t || null;
  }
  function Ro(t, e, l, a, n) {
    for (var u = e._reactName, c = []; l !== null && l !== a; ) {
      var s = l,
        f = s.alternate,
        g = s.stateNode;
      if (((s = s.tag), f !== null && f === a)) break;
      ((s !== 5 && s !== 26 && s !== 27) ||
        g === null ||
        ((f = g),
        n
          ? ((g = Da(l, u)), g != null && c.unshift(dn(l, g, f)))
          : n || ((g = Da(l, u)), g != null && c.push(dn(l, g, f)))),
        (l = l.return));
    }
    c.length !== 0 && t.push({ event: e, listeners: c });
  }
  var bm = /\r\n?/g,
    xm = /\u0000|\uFFFD/g;
  function Ho(t) {
    return (typeof t == 'string' ? t : '' + t)
      .replace(
        bm,
        `
`
      )
      .replace(xm, '');
  }
  function wo(t, e) {
    return ((e = Ho(e)), Ho(t) === e);
  }
  function St(t, e, l, a, n, u) {
    switch (l) {
      case 'children':
        typeof a == 'string'
          ? e === 'body' || (e === 'textarea' && a === '') || kl(t, a)
          : (typeof a == 'number' || typeof a == 'bigint') && e !== 'body' && kl(t, '' + a);
        break;
      case 'className':
        On(t, 'class', a);
        break;
      case 'tabIndex':
        On(t, 'tabindex', a);
        break;
      case 'dir':
      case 'role':
      case 'viewBox':
      case 'width':
      case 'height':
        On(t, l, a);
        break;
      case 'style':
        Rs(t, a, u);
        break;
      case 'data':
        if (e !== 'object') {
          On(t, 'data', a);
          break;
        }
      case 'src':
      case 'href':
        if (a === '' && (e !== 'a' || l !== 'href')) {
          t.removeAttribute(l);
          break;
        }
        if (a == null || typeof a == 'function' || typeof a == 'symbol' || typeof a == 'boolean') {
          t.removeAttribute(l);
          break;
        }
        ((a = _n('' + a)), t.setAttribute(l, a));
        break;
      case 'action':
      case 'formAction':
        if (typeof a == 'function') {
          t.setAttribute(
            l,
            "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')"
          );
          break;
        } else
          typeof u == 'function' &&
            (l === 'formAction'
              ? (e !== 'input' && St(t, e, 'name', n.name, n, null),
                St(t, e, 'formEncType', n.formEncType, n, null),
                St(t, e, 'formMethod', n.formMethod, n, null),
                St(t, e, 'formTarget', n.formTarget, n, null))
              : (St(t, e, 'encType', n.encType, n, null),
                St(t, e, 'method', n.method, n, null),
                St(t, e, 'target', n.target, n, null)));
        if (a == null || typeof a == 'symbol' || typeof a == 'boolean') {
          t.removeAttribute(l);
          break;
        }
        ((a = _n('' + a)), t.setAttribute(l, a));
        break;
      case 'onClick':
        a != null && (t.onclick = He);
        break;
      case 'onScroll':
        a != null && st('scroll', t);
        break;
      case 'onScrollEnd':
        a != null && st('scrollend', t);
        break;
      case 'dangerouslySetInnerHTML':
        if (a != null) {
          if (typeof a != 'object' || !('__html' in a)) throw Error(d(61));
          if (((l = a.__html), l != null)) {
            if (n.children != null) throw Error(d(60));
            t.innerHTML = l;
          }
        }
        break;
      case 'multiple':
        t.multiple = a && typeof a != 'function' && typeof a != 'symbol';
        break;
      case 'muted':
        t.muted = a && typeof a != 'function' && typeof a != 'symbol';
        break;
      case 'suppressContentEditableWarning':
      case 'suppressHydrationWarning':
      case 'defaultValue':
      case 'defaultChecked':
      case 'innerHTML':
      case 'ref':
        break;
      case 'autoFocus':
        break;
      case 'xlinkHref':
        if (a == null || typeof a == 'function' || typeof a == 'boolean' || typeof a == 'symbol') {
          t.removeAttribute('xlink:href');
          break;
        }
        ((l = _n('' + a)), t.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', l));
        break;
      case 'contentEditable':
      case 'spellCheck':
      case 'draggable':
      case 'value':
      case 'autoReverse':
      case 'externalResourcesRequired':
      case 'focusable':
      case 'preserveAlpha':
        a != null && typeof a != 'function' && typeof a != 'symbol' ? t.setAttribute(l, '' + a) : t.removeAttribute(l);
        break;
      case 'inert':
      case 'allowFullScreen':
      case 'async':
      case 'autoPlay':
      case 'controls':
      case 'default':
      case 'defer':
      case 'disabled':
      case 'disablePictureInPicture':
      case 'disableRemotePlayback':
      case 'formNoValidate':
      case 'hidden':
      case 'loop':
      case 'noModule':
      case 'noValidate':
      case 'open':
      case 'playsInline':
      case 'readOnly':
      case 'required':
      case 'reversed':
      case 'scoped':
      case 'seamless':
      case 'itemScope':
        a && typeof a != 'function' && typeof a != 'symbol' ? t.setAttribute(l, '') : t.removeAttribute(l);
        break;
      case 'capture':
      case 'download':
        a === !0
          ? t.setAttribute(l, '')
          : a !== !1 && a != null && typeof a != 'function' && typeof a != 'symbol'
            ? t.setAttribute(l, a)
            : t.removeAttribute(l);
        break;
      case 'cols':
      case 'rows':
      case 'size':
      case 'span':
        a != null && typeof a != 'function' && typeof a != 'symbol' && !isNaN(a) && 1 <= a
          ? t.setAttribute(l, a)
          : t.removeAttribute(l);
        break;
      case 'rowSpan':
      case 'start':
        a == null || typeof a == 'function' || typeof a == 'symbol' || isNaN(a)
          ? t.removeAttribute(l)
          : t.setAttribute(l, a);
        break;
      case 'popover':
        (st('beforetoggle', t), st('toggle', t), Mn(t, 'popover', a));
        break;
      case 'xlinkActuate':
        Re(t, 'http://www.w3.org/1999/xlink', 'xlink:actuate', a);
        break;
      case 'xlinkArcrole':
        Re(t, 'http://www.w3.org/1999/xlink', 'xlink:arcrole', a);
        break;
      case 'xlinkRole':
        Re(t, 'http://www.w3.org/1999/xlink', 'xlink:role', a);
        break;
      case 'xlinkShow':
        Re(t, 'http://www.w3.org/1999/xlink', 'xlink:show', a);
        break;
      case 'xlinkTitle':
        Re(t, 'http://www.w3.org/1999/xlink', 'xlink:title', a);
        break;
      case 'xlinkType':
        Re(t, 'http://www.w3.org/1999/xlink', 'xlink:type', a);
        break;
      case 'xmlBase':
        Re(t, 'http://www.w3.org/XML/1998/namespace', 'xml:base', a);
        break;
      case 'xmlLang':
        Re(t, 'http://www.w3.org/XML/1998/namespace', 'xml:lang', a);
        break;
      case 'xmlSpace':
        Re(t, 'http://www.w3.org/XML/1998/namespace', 'xml:space', a);
        break;
      case 'is':
        Mn(t, 'is', a);
        break;
      case 'innerText':
      case 'textContent':
        break;
      default:
        (!(2 < l.length) || (l[0] !== 'o' && l[0] !== 'O') || (l[1] !== 'n' && l[1] !== 'N')) &&
          ((l = Jd.get(l) || l), Mn(t, l, a));
    }
  }
  function Gi(t, e, l, a, n, u) {
    switch (l) {
      case 'style':
        Rs(t, a, u);
        break;
      case 'dangerouslySetInnerHTML':
        if (a != null) {
          if (typeof a != 'object' || !('__html' in a)) throw Error(d(61));
          if (((l = a.__html), l != null)) {
            if (n.children != null) throw Error(d(60));
            t.innerHTML = l;
          }
        }
        break;
      case 'children':
        typeof a == 'string' ? kl(t, a) : (typeof a == 'number' || typeof a == 'bigint') && kl(t, '' + a);
        break;
      case 'onScroll':
        a != null && st('scroll', t);
        break;
      case 'onScrollEnd':
        a != null && st('scrollend', t);
        break;
      case 'onClick':
        a != null && (t.onclick = He);
        break;
      case 'suppressContentEditableWarning':
      case 'suppressHydrationWarning':
      case 'innerHTML':
      case 'ref':
        break;
      case 'innerText':
      case 'textContent':
        break;
      default:
        if (!Ts.hasOwnProperty(l))
          t: {
            if (
              l[0] === 'o' &&
              l[1] === 'n' &&
              ((n = l.endsWith('Capture')),
              (e = l.slice(2, n ? l.length - 7 : void 0)),
              (u = t[te] || null),
              (u = u != null ? u[l] : null),
              typeof u == 'function' && t.removeEventListener(e, u, n),
              typeof a == 'function')
            ) {
              (typeof u != 'function' &&
                u !== null &&
                (l in t ? (t[l] = null) : t.hasAttribute(l) && t.removeAttribute(l)),
                t.addEventListener(e, a, n));
              break t;
            }
            l in t ? (t[l] = a) : a === !0 ? t.setAttribute(l, '') : Mn(t, l, a);
          }
    }
  }
  function kt(t, e, l) {
    switch (e) {
      case 'div':
      case 'span':
      case 'svg':
      case 'path':
      case 'a':
      case 'g':
      case 'p':
      case 'li':
        break;
      case 'img':
        (st('error', t), st('load', t));
        var a = !1,
          n = !1,
          u;
        for (u in l)
          if (l.hasOwnProperty(u)) {
            var c = l[u];
            if (c != null)
              switch (u) {
                case 'src':
                  a = !0;
                  break;
                case 'srcSet':
                  n = !0;
                  break;
                case 'children':
                case 'dangerouslySetInnerHTML':
                  throw Error(d(137, e));
                default:
                  St(t, e, u, c, l, null);
              }
          }
        (n && St(t, e, 'srcSet', l.srcSet, l, null), a && St(t, e, 'src', l.src, l, null));
        return;
      case 'input':
        st('invalid', t);
        var s = (u = c = n = null),
          f = null,
          g = null;
        for (a in l)
          if (l.hasOwnProperty(a)) {
            var E = l[a];
            if (E != null)
              switch (a) {
                case 'name':
                  n = E;
                  break;
                case 'type':
                  c = E;
                  break;
                case 'checked':
                  f = E;
                  break;
                case 'defaultChecked':
                  g = E;
                  break;
                case 'value':
                  u = E;
                  break;
                case 'defaultValue':
                  s = E;
                  break;
                case 'children':
                case 'dangerouslySetInnerHTML':
                  if (E != null) throw Error(d(137, e));
                  break;
                default:
                  St(t, e, a, E, l, null);
              }
          }
        Cs(t, u, s, f, g, c, n, !1);
        return;
      case 'select':
        (st('invalid', t), (a = c = u = null));
        for (n in l)
          if (l.hasOwnProperty(n) && ((s = l[n]), s != null))
            switch (n) {
              case 'value':
                u = s;
                break;
              case 'defaultValue':
                c = s;
                break;
              case 'multiple':
                a = s;
              default:
                St(t, e, n, s, l, null);
            }
        ((e = u), (l = c), (t.multiple = !!a), e != null ? Jl(t, !!a, e, !1) : l != null && Jl(t, !!a, l, !0));
        return;
      case 'textarea':
        (st('invalid', t), (u = n = a = null));
        for (c in l)
          if (l.hasOwnProperty(c) && ((s = l[c]), s != null))
            switch (c) {
              case 'value':
                a = s;
                break;
              case 'defaultValue':
                n = s;
                break;
              case 'children':
                u = s;
                break;
              case 'dangerouslySetInnerHTML':
                if (s != null) throw Error(d(91));
                break;
              default:
                St(t, e, c, s, l, null);
            }
        Ds(t, a, n, u);
        return;
      case 'option':
        for (f in l)
          if (l.hasOwnProperty(f) && ((a = l[f]), a != null))
            switch (f) {
              case 'selected':
                t.selected = a && typeof a != 'function' && typeof a != 'symbol';
                break;
              default:
                St(t, e, f, a, l, null);
            }
        return;
      case 'dialog':
        (st('beforetoggle', t), st('toggle', t), st('cancel', t), st('close', t));
        break;
      case 'iframe':
      case 'object':
        st('load', t);
        break;
      case 'video':
      case 'audio':
        for (a = 0; a < on.length; a++) st(on[a], t);
        break;
      case 'image':
        (st('error', t), st('load', t));
        break;
      case 'details':
        st('toggle', t);
        break;
      case 'embed':
      case 'source':
      case 'link':
        (st('error', t), st('load', t));
      case 'area':
      case 'base':
      case 'br':
      case 'col':
      case 'hr':
      case 'keygen':
      case 'meta':
      case 'param':
      case 'track':
      case 'wbr':
      case 'menuitem':
        for (g in l)
          if (l.hasOwnProperty(g) && ((a = l[g]), a != null))
            switch (g) {
              case 'children':
              case 'dangerouslySetInnerHTML':
                throw Error(d(137, e));
              default:
                St(t, e, g, a, l, null);
            }
        return;
      default:
        if (tc(e)) {
          for (E in l) l.hasOwnProperty(E) && ((a = l[E]), a !== void 0 && Gi(t, e, E, a, l, void 0));
          return;
        }
    }
    for (s in l) l.hasOwnProperty(s) && ((a = l[s]), a != null && St(t, e, s, a, l, null));
  }
  function pm(t, e, l, a) {
    switch (e) {
      case 'div':
      case 'span':
      case 'svg':
      case 'path':
      case 'a':
      case 'g':
      case 'p':
      case 'li':
        break;
      case 'input':
        var n = null,
          u = null,
          c = null,
          s = null,
          f = null,
          g = null,
          E = null;
        for (x in l) {
          var N = l[x];
          if (l.hasOwnProperty(x) && N != null)
            switch (x) {
              case 'checked':
                break;
              case 'value':
                break;
              case 'defaultValue':
                f = N;
              default:
                a.hasOwnProperty(x) || St(t, e, x, null, a, N);
            }
        }
        for (var v in a) {
          var x = a[v];
          if (((N = l[v]), a.hasOwnProperty(v) && (x != null || N != null)))
            switch (v) {
              case 'type':
                u = x;
                break;
              case 'name':
                n = x;
                break;
              case 'checked':
                g = x;
                break;
              case 'defaultChecked':
                E = x;
                break;
              case 'value':
                c = x;
                break;
              case 'defaultValue':
                s = x;
                break;
              case 'children':
              case 'dangerouslySetInnerHTML':
                if (x != null) throw Error(d(137, e));
                break;
              default:
                x !== N && St(t, e, v, x, a, N);
            }
        }
        Iu(t, c, s, f, g, E, u, n);
        return;
      case 'select':
        x = c = s = v = null;
        for (u in l)
          if (((f = l[u]), l.hasOwnProperty(u) && f != null))
            switch (u) {
              case 'value':
                break;
              case 'multiple':
                x = f;
              default:
                a.hasOwnProperty(u) || St(t, e, u, null, a, f);
            }
        for (n in a)
          if (((u = a[n]), (f = l[n]), a.hasOwnProperty(n) && (u != null || f != null)))
            switch (n) {
              case 'value':
                v = u;
                break;
              case 'defaultValue':
                s = u;
                break;
              case 'multiple':
                c = u;
              default:
                u !== f && St(t, e, n, u, a, f);
            }
        ((e = s),
          (l = c),
          (a = x),
          v != null ? Jl(t, !!l, v, !1) : !!a != !!l && (e != null ? Jl(t, !!l, e, !0) : Jl(t, !!l, l ? [] : '', !1)));
        return;
      case 'textarea':
        x = v = null;
        for (s in l)
          if (((n = l[s]), l.hasOwnProperty(s) && n != null && !a.hasOwnProperty(s)))
            switch (s) {
              case 'value':
                break;
              case 'children':
                break;
              default:
                St(t, e, s, null, a, n);
            }
        for (c in a)
          if (((n = a[c]), (u = l[c]), a.hasOwnProperty(c) && (n != null || u != null)))
            switch (c) {
              case 'value':
                v = n;
                break;
              case 'defaultValue':
                x = n;
                break;
              case 'children':
                break;
              case 'dangerouslySetInnerHTML':
                if (n != null) throw Error(d(91));
                break;
              default:
                n !== u && St(t, e, c, n, a, u);
            }
        _s(t, v, x);
        return;
      case 'option':
        for (var Y in l)
          if (((v = l[Y]), l.hasOwnProperty(Y) && v != null && !a.hasOwnProperty(Y)))
            switch (Y) {
              case 'selected':
                t.selected = !1;
                break;
              default:
                St(t, e, Y, null, a, v);
            }
        for (f in a)
          if (((v = a[f]), (x = l[f]), a.hasOwnProperty(f) && v !== x && (v != null || x != null)))
            switch (f) {
              case 'selected':
                t.selected = v && typeof v != 'function' && typeof v != 'symbol';
                break;
              default:
                St(t, e, f, v, a, x);
            }
        return;
      case 'img':
      case 'link':
      case 'area':
      case 'base':
      case 'br':
      case 'col':
      case 'embed':
      case 'hr':
      case 'keygen':
      case 'meta':
      case 'param':
      case 'source':
      case 'track':
      case 'wbr':
      case 'menuitem':
        for (var V in l)
          ((v = l[V]), l.hasOwnProperty(V) && v != null && !a.hasOwnProperty(V) && St(t, e, V, null, a, v));
        for (g in a)
          if (((v = a[g]), (x = l[g]), a.hasOwnProperty(g) && v !== x && (v != null || x != null)))
            switch (g) {
              case 'children':
              case 'dangerouslySetInnerHTML':
                if (v != null) throw Error(d(137, e));
                break;
              default:
                St(t, e, g, v, a, x);
            }
        return;
      default:
        if (tc(e)) {
          for (var Et in l)
            ((v = l[Et]), l.hasOwnProperty(Et) && v !== void 0 && !a.hasOwnProperty(Et) && Gi(t, e, Et, void 0, a, v));
          for (E in a)
            ((v = a[E]),
              (x = l[E]),
              !a.hasOwnProperty(E) || v === x || (v === void 0 && x === void 0) || Gi(t, e, E, v, a, x));
          return;
        }
    }
    for (var h in l) ((v = l[h]), l.hasOwnProperty(h) && v != null && !a.hasOwnProperty(h) && St(t, e, h, null, a, v));
    for (N in a)
      ((v = a[N]), (x = l[N]), !a.hasOwnProperty(N) || v === x || (v == null && x == null) || St(t, e, N, v, a, x));
  }
  function Bo(t) {
    switch (t) {
      case 'css':
      case 'script':
      case 'font':
      case 'img':
      case 'image':
      case 'input':
      case 'link':
        return !0;
      default:
        return !1;
    }
  }
  function Sm() {
    if (typeof performance.getEntriesByType == 'function') {
      for (var t = 0, e = 0, l = performance.getEntriesByType('resource'), a = 0; a < l.length; a++) {
        var n = l[a],
          u = n.transferSize,
          c = n.initiatorType,
          s = n.duration;
        if (u && s && Bo(c)) {
          for (c = 0, s = n.responseEnd, a += 1; a < l.length; a++) {
            var f = l[a],
              g = f.startTime;
            if (g > s) break;
            var E = f.transferSize,
              N = f.initiatorType;
            E && Bo(N) && ((f = f.responseEnd), (c += E * (f < s ? 1 : (s - g) / (f - g))));
          }
          if ((--a, (e += (8 * (u + c)) / (n.duration / 1e3)), t++, 10 < t)) break;
        }
      }
      if (0 < t) return e / t / 1e6;
    }
    return navigator.connection && ((t = navigator.connection.downlink), typeof t == 'number') ? t : 5;
  }
  var Xi = null,
    Qi = null;
  function zu(t) {
    return t.nodeType === 9 ? t : t.ownerDocument;
  }
  function qo(t) {
    switch (t) {
      case 'http://www.w3.org/2000/svg':
        return 1;
      case 'http://www.w3.org/1998/Math/MathML':
        return 2;
      default:
        return 0;
    }
  }
  function Yo(t, e) {
    if (t === 0)
      switch (e) {
        case 'svg':
          return 1;
        case 'math':
          return 2;
        default:
          return 0;
      }
    return t === 1 && e === 'foreignObject' ? 0 : t;
  }
  function Li(t, e) {
    return (
      t === 'textarea' ||
      t === 'noscript' ||
      typeof e.children == 'string' ||
      typeof e.children == 'number' ||
      typeof e.children == 'bigint' ||
      (typeof e.dangerouslySetInnerHTML == 'object' &&
        e.dangerouslySetInnerHTML !== null &&
        e.dangerouslySetInnerHTML.__html != null)
    );
  }
  var Zi = null;
  function Em() {
    var t = window.event;
    return t && t.type === 'popstate' ? (t === Zi ? !1 : ((Zi = t), !0)) : ((Zi = null), !1);
  }
  var Go = typeof setTimeout == 'function' ? setTimeout : void 0,
    jm = typeof clearTimeout == 'function' ? clearTimeout : void 0,
    Xo = typeof Promise == 'function' ? Promise : void 0,
    Nm =
      typeof queueMicrotask == 'function'
        ? queueMicrotask
        : typeof Xo < 'u'
          ? function (t) {
              return Xo.resolve(null).then(t).catch(Tm);
            }
          : Go;
  function Tm(t) {
    setTimeout(function () {
      throw t;
    });
  }
  function vl(t) {
    return t === 'head';
  }
  function Qo(t, e) {
    var l = e,
      a = 0;
    do {
      var n = l.nextSibling;
      if ((t.removeChild(l), n && n.nodeType === 8))
        if (((l = n.data), l === '/$' || l === '/&')) {
          if (a === 0) {
            (t.removeChild(n), Ta(e));
            return;
          }
          a--;
        } else if (l === '$' || l === '$?' || l === '$~' || l === '$!' || l === '&') a++;
        else if (l === 'html') mn(t.ownerDocument.documentElement);
        else if (l === 'head') {
          ((l = t.ownerDocument.head), mn(l));
          for (var u = l.firstChild; u; ) {
            var c = u.nextSibling,
              s = u.nodeName;
            (u[Ca] ||
              s === 'SCRIPT' ||
              s === 'STYLE' ||
              (s === 'LINK' && u.rel.toLowerCase() === 'stylesheet') ||
              l.removeChild(u),
              (u = c));
          }
        } else l === 'body' && mn(t.ownerDocument.body);
      l = n;
    } while (l);
    Ta(e);
  }
  function Lo(t, e) {
    var l = t;
    t = 0;
    do {
      var a = l.nextSibling;
      if (
        (l.nodeType === 1
          ? e
            ? ((l._stashedDisplay = l.style.display), (l.style.display = 'none'))
            : ((l.style.display = l._stashedDisplay || ''),
              l.getAttribute('style') === '' && l.removeAttribute('style'))
          : l.nodeType === 3 &&
            (e ? ((l._stashedText = l.nodeValue), (l.nodeValue = '')) : (l.nodeValue = l._stashedText || '')),
        a && a.nodeType === 8)
      )
        if (((l = a.data), l === '/$')) {
          if (t === 0) break;
          t--;
        } else (l !== '$' && l !== '$?' && l !== '$~' && l !== '$!') || t++;
      l = a;
    } while (l);
  }
  function Vi(t) {
    var e = t.firstChild;
    for (e && e.nodeType === 10 && (e = e.nextSibling); e; ) {
      var l = e;
      switch (((e = e.nextSibling), l.nodeName)) {
        case 'HTML':
        case 'HEAD':
        case 'BODY':
          (Vi(l), Wu(l));
          continue;
        case 'SCRIPT':
        case 'STYLE':
          continue;
        case 'LINK':
          if (l.rel.toLowerCase() === 'stylesheet') continue;
      }
      t.removeChild(l);
    }
  }
  function zm(t, e, l, a) {
    for (; t.nodeType === 1; ) {
      var n = l;
      if (t.nodeName.toLowerCase() !== e.toLowerCase()) {
        if (!a && (t.nodeName !== 'INPUT' || t.type !== 'hidden')) break;
      } else if (a) {
        if (!t[Ca])
          switch (e) {
            case 'meta':
              if (!t.hasAttribute('itemprop')) break;
              return t;
            case 'link':
              if (((u = t.getAttribute('rel')), u === 'stylesheet' && t.hasAttribute('data-precedence'))) break;
              if (
                u !== n.rel ||
                t.getAttribute('href') !== (n.href == null || n.href === '' ? null : n.href) ||
                t.getAttribute('crossorigin') !== (n.crossOrigin == null ? null : n.crossOrigin) ||
                t.getAttribute('title') !== (n.title == null ? null : n.title)
              )
                break;
              return t;
            case 'style':
              if (t.hasAttribute('data-precedence')) break;
              return t;
            case 'script':
              if (
                ((u = t.getAttribute('src')),
                (u !== (n.src == null ? null : n.src) ||
                  t.getAttribute('type') !== (n.type == null ? null : n.type) ||
                  t.getAttribute('crossorigin') !== (n.crossOrigin == null ? null : n.crossOrigin)) &&
                  u &&
                  t.hasAttribute('async') &&
                  !t.hasAttribute('itemprop'))
              )
                break;
              return t;
            default:
              return t;
          }
      } else if (e === 'input' && t.type === 'hidden') {
        var u = n.name == null ? null : '' + n.name;
        if (n.type === 'hidden' && t.getAttribute('name') === u) return t;
      } else return t;
      if (((t = Te(t.nextSibling)), t === null)) break;
    }
    return null;
  }
  function Am(t, e, l) {
    if (e === '') return null;
    for (; t.nodeType !== 3; )
      if (
        ((t.nodeType !== 1 || t.nodeName !== 'INPUT' || t.type !== 'hidden') && !l) ||
        ((t = Te(t.nextSibling)), t === null)
      )
        return null;
    return t;
  }
  function Zo(t, e) {
    for (; t.nodeType !== 8; )
      if (
        ((t.nodeType !== 1 || t.nodeName !== 'INPUT' || t.type !== 'hidden') && !e) ||
        ((t = Te(t.nextSibling)), t === null)
      )
        return null;
    return t;
  }
  function Ki(t) {
    return t.data === '$?' || t.data === '$~';
  }
  function Ji(t) {
    return t.data === '$!' || (t.data === '$?' && t.ownerDocument.readyState !== 'loading');
  }
  function Mm(t, e) {
    var l = t.ownerDocument;
    if (t.data === '$~') t._reactRetry = e;
    else if (t.data !== '$?' || l.readyState !== 'loading') e();
    else {
      var a = function () {
        (e(), l.removeEventListener('DOMContentLoaded', a));
      };
      (l.addEventListener('DOMContentLoaded', a), (t._reactRetry = a));
    }
  }
  function Te(t) {
    for (; t != null; t = t.nextSibling) {
      var e = t.nodeType;
      if (e === 1 || e === 3) break;
      if (e === 8) {
        if (((e = t.data), e === '$' || e === '$!' || e === '$?' || e === '$~' || e === '&' || e === 'F!' || e === 'F'))
          break;
        if (e === '/$' || e === '/&') return null;
      }
    }
    return t;
  }
  var ki = null;
  function Vo(t) {
    t = t.nextSibling;
    for (var e = 0; t; ) {
      if (t.nodeType === 8) {
        var l = t.data;
        if (l === '/$' || l === '/&') {
          if (e === 0) return Te(t.nextSibling);
          e--;
        } else (l !== '$' && l !== '$!' && l !== '$?' && l !== '$~' && l !== '&') || e++;
      }
      t = t.nextSibling;
    }
    return null;
  }
  function Ko(t) {
    t = t.previousSibling;
    for (var e = 0; t; ) {
      if (t.nodeType === 8) {
        var l = t.data;
        if (l === '$' || l === '$!' || l === '$?' || l === '$~' || l === '&') {
          if (e === 0) return t;
          e--;
        } else (l !== '/$' && l !== '/&') || e++;
      }
      t = t.previousSibling;
    }
    return null;
  }
  function Jo(t, e, l) {
    switch (((e = zu(l)), t)) {
      case 'html':
        if (((t = e.documentElement), !t)) throw Error(d(452));
        return t;
      case 'head':
        if (((t = e.head), !t)) throw Error(d(453));
        return t;
      case 'body':
        if (((t = e.body), !t)) throw Error(d(454));
        return t;
      default:
        throw Error(d(451));
    }
  }
  function mn(t) {
    for (var e = t.attributes; e.length; ) t.removeAttributeNode(e[0]);
    Wu(t);
  }
  var ze = new Map(),
    ko = new Set();
  function Au(t) {
    return typeof t.getRootNode == 'function' ? t.getRootNode() : t.nodeType === 9 ? t : t.ownerDocument;
  }
  var Fe = M.d;
  M.d = { f: Om, r: Cm, D: _m, C: Dm, L: Um, m: Rm, X: wm, S: Hm, M: Bm };
  function Om() {
    var t = Fe.f(),
      e = bu();
    return t || e;
  }
  function Cm(t) {
    var e = Zl(t);
    e !== null && e.tag === 5 && e.type === 'form' ? rr(e) : Fe.r(t);
  }
  var Ea = typeof document > 'u' ? null : document;
  function $o(t, e, l) {
    var a = Ea;
    if (a && typeof e == 'string' && e) {
      var n = be(e);
      ((n = 'link[rel="' + t + '"][href="' + n + '"]'),
        typeof l == 'string' && (n += '[crossorigin="' + l + '"]'),
        ko.has(n) ||
          (ko.add(n),
          (t = { rel: t, crossOrigin: l, href: e }),
          a.querySelector(n) === null &&
            ((e = a.createElement('link')), kt(e, 'link', t), Qt(e), a.head.appendChild(e))));
    }
  }
  function _m(t) {
    (Fe.D(t), $o('dns-prefetch', t, null));
  }
  function Dm(t, e) {
    (Fe.C(t, e), $o('preconnect', t, e));
  }
  function Um(t, e, l) {
    Fe.L(t, e, l);
    var a = Ea;
    if (a && t && e) {
      var n = 'link[rel="preload"][as="' + be(e) + '"]';
      e === 'image' && l && l.imageSrcSet
        ? ((n += '[imagesrcset="' + be(l.imageSrcSet) + '"]'),
          typeof l.imageSizes == 'string' && (n += '[imagesizes="' + be(l.imageSizes) + '"]'))
        : (n += '[href="' + be(t) + '"]');
      var u = n;
      switch (e) {
        case 'style':
          u = ja(t);
          break;
        case 'script':
          u = Na(t);
      }
      ze.has(u) ||
        ((t = R({ rel: 'preload', href: e === 'image' && l && l.imageSrcSet ? void 0 : t, as: e }, l)),
        ze.set(u, t),
        a.querySelector(n) !== null ||
          (e === 'style' && a.querySelector(hn(u))) ||
          (e === 'script' && a.querySelector(yn(u))) ||
          ((e = a.createElement('link')), kt(e, 'link', t), Qt(e), a.head.appendChild(e)));
    }
  }
  function Rm(t, e) {
    Fe.m(t, e);
    var l = Ea;
    if (l && t) {
      var a = e && typeof e.as == 'string' ? e.as : 'script',
        n = 'link[rel="modulepreload"][as="' + be(a) + '"][href="' + be(t) + '"]',
        u = n;
      switch (a) {
        case 'audioworklet':
        case 'paintworklet':
        case 'serviceworker':
        case 'sharedworker':
        case 'worker':
        case 'script':
          u = Na(t);
      }
      if (!ze.has(u) && ((t = R({ rel: 'modulepreload', href: t }, e)), ze.set(u, t), l.querySelector(n) === null)) {
        switch (a) {
          case 'audioworklet':
          case 'paintworklet':
          case 'serviceworker':
          case 'sharedworker':
          case 'worker':
          case 'script':
            if (l.querySelector(yn(u))) return;
        }
        ((a = l.createElement('link')), kt(a, 'link', t), Qt(a), l.head.appendChild(a));
      }
    }
  }
  function Hm(t, e, l) {
    Fe.S(t, e, l);
    var a = Ea;
    if (a && t) {
      var n = Vl(a).hoistableStyles,
        u = ja(t);
      e = e || 'default';
      var c = n.get(u);
      if (!c) {
        var s = { loading: 0, preload: null };
        if ((c = a.querySelector(hn(u)))) s.loading = 5;
        else {
          ((t = R({ rel: 'stylesheet', href: t, 'data-precedence': e }, l)), (l = ze.get(u)) && $i(t, l));
          var f = (c = a.createElement('link'));
          (Qt(f),
            kt(f, 'link', t),
            (f._p = new Promise(function (g, E) {
              ((f.onload = g), (f.onerror = E));
            })),
            f.addEventListener('load', function () {
              s.loading |= 1;
            }),
            f.addEventListener('error', function () {
              s.loading |= 2;
            }),
            (s.loading |= 4),
            Mu(c, e, a));
        }
        ((c = { type: 'stylesheet', instance: c, count: 1, state: s }), n.set(u, c));
      }
    }
  }
  function wm(t, e) {
    Fe.X(t, e);
    var l = Ea;
    if (l && t) {
      var a = Vl(l).hoistableScripts,
        n = Na(t),
        u = a.get(n);
      u ||
        ((u = l.querySelector(yn(n))),
        u ||
          ((t = R({ src: t, async: !0 }, e)),
          (e = ze.get(n)) && Wi(t, e),
          (u = l.createElement('script')),
          Qt(u),
          kt(u, 'link', t),
          l.head.appendChild(u)),
        (u = { type: 'script', instance: u, count: 1, state: null }),
        a.set(n, u));
    }
  }
  function Bm(t, e) {
    Fe.M(t, e);
    var l = Ea;
    if (l && t) {
      var a = Vl(l).hoistableScripts,
        n = Na(t),
        u = a.get(n);
      u ||
        ((u = l.querySelector(yn(n))),
        u ||
          ((t = R({ src: t, async: !0, type: 'module' }, e)),
          (e = ze.get(n)) && Wi(t, e),
          (u = l.createElement('script')),
          Qt(u),
          kt(u, 'link', t),
          l.head.appendChild(u)),
        (u = { type: 'script', instance: u, count: 1, state: null }),
        a.set(n, u));
    }
  }
  function Wo(t, e, l, a) {
    var n = (n = ct.current) ? Au(n) : null;
    if (!n) throw Error(d(446));
    switch (t) {
      case 'meta':
      case 'title':
        return null;
      case 'style':
        return typeof l.precedence == 'string' && typeof l.href == 'string'
          ? ((e = ja(l.href)),
            (l = Vl(n).hoistableStyles),
            (a = l.get(e)),
            a || ((a = { type: 'style', instance: null, count: 0, state: null }), l.set(e, a)),
            a)
          : { type: 'void', instance: null, count: 0, state: null };
      case 'link':
        if (l.rel === 'stylesheet' && typeof l.href == 'string' && typeof l.precedence == 'string') {
          t = ja(l.href);
          var u = Vl(n).hoistableStyles,
            c = u.get(t);
          if (
            (c ||
              ((n = n.ownerDocument || n),
              (c = { type: 'stylesheet', instance: null, count: 0, state: { loading: 0, preload: null } }),
              u.set(t, c),
              (u = n.querySelector(hn(t))) && !u._p && ((c.instance = u), (c.state.loading = 5)),
              ze.has(t) ||
                ((l = {
                  rel: 'preload',
                  as: 'style',
                  href: l.href,
                  crossOrigin: l.crossOrigin,
                  integrity: l.integrity,
                  media: l.media,
                  hrefLang: l.hrefLang,
                  referrerPolicy: l.referrerPolicy,
                }),
                ze.set(t, l),
                u || qm(n, t, l, c.state))),
            e && a === null)
          )
            throw Error(d(528, ''));
          return c;
        }
        if (e && a !== null) throw Error(d(529, ''));
        return null;
      case 'script':
        return (
          (e = l.async),
          (l = l.src),
          typeof l == 'string' && e && typeof e != 'function' && typeof e != 'symbol'
            ? ((e = Na(l)),
              (l = Vl(n).hoistableScripts),
              (a = l.get(e)),
              a || ((a = { type: 'script', instance: null, count: 0, state: null }), l.set(e, a)),
              a)
            : { type: 'void', instance: null, count: 0, state: null }
        );
      default:
        throw Error(d(444, t));
    }
  }
  function ja(t) {
    return 'href="' + be(t) + '"';
  }
  function hn(t) {
    return 'link[rel="stylesheet"][' + t + ']';
  }
  function Fo(t) {
    return R({}, t, { 'data-precedence': t.precedence, precedence: null });
  }
  function qm(t, e, l, a) {
    t.querySelector('link[rel="preload"][as="style"][' + e + ']')
      ? (a.loading = 1)
      : ((e = t.createElement('link')),
        (a.preload = e),
        e.addEventListener('load', function () {
          return (a.loading |= 1);
        }),
        e.addEventListener('error', function () {
          return (a.loading |= 2);
        }),
        kt(e, 'link', l),
        Qt(e),
        t.head.appendChild(e));
  }
  function Na(t) {
    return '[src="' + be(t) + '"]';
  }
  function yn(t) {
    return 'script[async]' + t;
  }
  function Io(t, e, l) {
    if ((e.count++, e.instance === null))
      switch (e.type) {
        case 'style':
          var a = t.querySelector('style[data-href~="' + be(l.href) + '"]');
          if (a) return ((e.instance = a), Qt(a), a);
          var n = R({}, l, { 'data-href': l.href, 'data-precedence': l.precedence, href: null, precedence: null });
          return (
            (a = (t.ownerDocument || t).createElement('style')),
            Qt(a),
            kt(a, 'style', n),
            Mu(a, l.precedence, t),
            (e.instance = a)
          );
        case 'stylesheet':
          n = ja(l.href);
          var u = t.querySelector(hn(n));
          if (u) return ((e.state.loading |= 4), (e.instance = u), Qt(u), u);
          ((a = Fo(l)), (n = ze.get(n)) && $i(a, n), (u = (t.ownerDocument || t).createElement('link')), Qt(u));
          var c = u;
          return (
            (c._p = new Promise(function (s, f) {
              ((c.onload = s), (c.onerror = f));
            })),
            kt(u, 'link', a),
            (e.state.loading |= 4),
            Mu(u, l.precedence, t),
            (e.instance = u)
          );
        case 'script':
          return (
            (u = Na(l.src)),
            (n = t.querySelector(yn(u)))
              ? ((e.instance = n), Qt(n), n)
              : ((a = l),
                (n = ze.get(u)) && ((a = R({}, l)), Wi(a, n)),
                (t = t.ownerDocument || t),
                (n = t.createElement('script')),
                Qt(n),
                kt(n, 'link', a),
                t.head.appendChild(n),
                (e.instance = n))
          );
        case 'void':
          return null;
        default:
          throw Error(d(443, e.type));
      }
    else
      e.type === 'stylesheet' &&
        (e.state.loading & 4) === 0 &&
        ((a = e.instance), (e.state.loading |= 4), Mu(a, l.precedence, t));
    return e.instance;
  }
  function Mu(t, e, l) {
    for (
      var a = l.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),
        n = a.length ? a[a.length - 1] : null,
        u = n,
        c = 0;
      c < a.length;
      c++
    ) {
      var s = a[c];
      if (s.dataset.precedence === e) u = s;
      else if (u !== n) break;
    }
    u
      ? u.parentNode.insertBefore(t, u.nextSibling)
      : ((e = l.nodeType === 9 ? l.head : l), e.insertBefore(t, e.firstChild));
  }
  function $i(t, e) {
    (t.crossOrigin == null && (t.crossOrigin = e.crossOrigin),
      t.referrerPolicy == null && (t.referrerPolicy = e.referrerPolicy),
      t.title == null && (t.title = e.title));
  }
  function Wi(t, e) {
    (t.crossOrigin == null && (t.crossOrigin = e.crossOrigin),
      t.referrerPolicy == null && (t.referrerPolicy = e.referrerPolicy),
      t.integrity == null && (t.integrity = e.integrity));
  }
  var Ou = null;
  function Po(t, e, l) {
    if (Ou === null) {
      var a = new Map(),
        n = (Ou = new Map());
      n.set(l, a);
    } else ((n = Ou), (a = n.get(l)), a || ((a = new Map()), n.set(l, a)));
    if (a.has(t)) return a;
    for (a.set(t, null), l = l.getElementsByTagName(t), n = 0; n < l.length; n++) {
      var u = l[n];
      if (
        !(u[Ca] || u[Zt] || (t === 'link' && u.getAttribute('rel') === 'stylesheet')) &&
        u.namespaceURI !== 'http://www.w3.org/2000/svg'
      ) {
        var c = u.getAttribute(e) || '';
        c = t + c;
        var s = a.get(c);
        s ? s.push(u) : a.set(c, [u]);
      }
    }
    return a;
  }
  function td(t, e, l) {
    ((t = t.ownerDocument || t), t.head.insertBefore(l, e === 'title' ? t.querySelector('head > title') : null));
  }
  function Ym(t, e, l) {
    if (l === 1 || e.itemProp != null) return !1;
    switch (t) {
      case 'meta':
      case 'title':
        return !0;
      case 'style':
        if (typeof e.precedence != 'string' || typeof e.href != 'string' || e.href === '') break;
        return !0;
      case 'link':
        if (typeof e.rel != 'string' || typeof e.href != 'string' || e.href === '' || e.onLoad || e.onError) break;
        switch (e.rel) {
          case 'stylesheet':
            return ((t = e.disabled), typeof e.precedence == 'string' && t == null);
          default:
            return !0;
        }
      case 'script':
        if (
          e.async &&
          typeof e.async != 'function' &&
          typeof e.async != 'symbol' &&
          !e.onLoad &&
          !e.onError &&
          e.src &&
          typeof e.src == 'string'
        )
          return !0;
    }
    return !1;
  }
  function ed(t) {
    return !(t.type === 'stylesheet' && (t.state.loading & 3) === 0);
  }
  function Gm(t, e, l, a) {
    if (
      l.type === 'stylesheet' &&
      (typeof a.media != 'string' || matchMedia(a.media).matches !== !1) &&
      (l.state.loading & 4) === 0
    ) {
      if (l.instance === null) {
        var n = ja(a.href),
          u = e.querySelector(hn(n));
        if (u) {
          ((e = u._p),
            e !== null &&
              typeof e == 'object' &&
              typeof e.then == 'function' &&
              (t.count++, (t = Cu.bind(t)), e.then(t, t)),
            (l.state.loading |= 4),
            (l.instance = u),
            Qt(u));
          return;
        }
        ((u = e.ownerDocument || e), (a = Fo(a)), (n = ze.get(n)) && $i(a, n), (u = u.createElement('link')), Qt(u));
        var c = u;
        ((c._p = new Promise(function (s, f) {
          ((c.onload = s), (c.onerror = f));
        })),
          kt(u, 'link', a),
          (l.instance = u));
      }
      (t.stylesheets === null && (t.stylesheets = new Map()),
        t.stylesheets.set(l, e),
        (e = l.state.preload) &&
          (l.state.loading & 3) === 0 &&
          (t.count++, (l = Cu.bind(t)), e.addEventListener('load', l), e.addEventListener('error', l)));
    }
  }
  var Fi = 0;
  function Xm(t, e) {
    return (
      t.stylesheets && t.count === 0 && Du(t, t.stylesheets),
      0 < t.count || 0 < t.imgCount
        ? function (l) {
            var a = setTimeout(function () {
              if ((t.stylesheets && Du(t, t.stylesheets), t.unsuspend)) {
                var u = t.unsuspend;
                ((t.unsuspend = null), u());
              }
            }, 6e4 + e);
            0 < t.imgBytes && Fi === 0 && (Fi = 62500 * Sm());
            var n = setTimeout(
              function () {
                if (
                  ((t.waitingForImages = !1), t.count === 0 && (t.stylesheets && Du(t, t.stylesheets), t.unsuspend))
                ) {
                  var u = t.unsuspend;
                  ((t.unsuspend = null), u());
                }
              },
              (t.imgBytes > Fi ? 50 : 800) + e
            );
            return (
              (t.unsuspend = l),
              function () {
                ((t.unsuspend = null), clearTimeout(a), clearTimeout(n));
              }
            );
          }
        : null
    );
  }
  function Cu() {
    if ((this.count--, this.count === 0 && (this.imgCount === 0 || !this.waitingForImages))) {
      if (this.stylesheets) Du(this, this.stylesheets);
      else if (this.unsuspend) {
        var t = this.unsuspend;
        ((this.unsuspend = null), t());
      }
    }
  }
  var _u = null;
  function Du(t, e) {
    ((t.stylesheets = null),
      t.unsuspend !== null && (t.count++, (_u = new Map()), e.forEach(Qm, t), (_u = null), Cu.call(t)));
  }
  function Qm(t, e) {
    if (!(e.state.loading & 4)) {
      var l = _u.get(t);
      if (l) var a = l.get(null);
      else {
        ((l = new Map()), _u.set(t, l));
        for (var n = t.querySelectorAll('link[data-precedence],style[data-precedence]'), u = 0; u < n.length; u++) {
          var c = n[u];
          (c.nodeName === 'LINK' || c.getAttribute('media') !== 'not all') && (l.set(c.dataset.precedence, c), (a = c));
        }
        a && l.set(null, a);
      }
      ((n = e.instance),
        (c = n.getAttribute('data-precedence')),
        (u = l.get(c) || a),
        u === a && l.set(null, n),
        l.set(c, n),
        this.count++,
        (a = Cu.bind(this)),
        n.addEventListener('load', a),
        n.addEventListener('error', a),
        u
          ? u.parentNode.insertBefore(n, u.nextSibling)
          : ((t = t.nodeType === 9 ? t.head : t), t.insertBefore(n, t.firstChild)),
        (e.state.loading |= 4));
    }
  }
  var gn = { $$typeof: U, Provider: null, Consumer: null, _currentValue: q, _currentValue2: q, _threadCount: 0 };
  function Lm(t, e, l, a, n, u, c, s, f) {
    ((this.tag = 1),
      (this.containerInfo = t),
      (this.pingCache = this.current = this.pendingChildren = null),
      (this.timeoutHandle = -1),
      (this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null),
      (this.callbackPriority = 0),
      (this.expirationTimes = Ku(-1)),
      (this.entangledLanes =
        this.shellSuspendCounter =
        this.errorRecoveryDisabledLanes =
        this.expiredLanes =
        this.warmLanes =
        this.pingedLanes =
        this.suspendedLanes =
        this.pendingLanes =
          0),
      (this.entanglements = Ku(0)),
      (this.hiddenUpdates = Ku(null)),
      (this.identifierPrefix = a),
      (this.onUncaughtError = n),
      (this.onCaughtError = u),
      (this.onRecoverableError = c),
      (this.pooledCache = null),
      (this.pooledCacheLanes = 0),
      (this.formState = f),
      (this.incompleteTransitions = new Map()));
  }
  function ld(t, e, l, a, n, u, c, s, f, g, E, N) {
    return (
      (t = new Lm(t, e, l, c, f, g, E, N, s)),
      (e = 1),
      u === !0 && (e |= 24),
      (u = oe(3, null, null, e)),
      (t.current = u),
      (u.stateNode = t),
      (e = Cc()),
      e.refCount++,
      (t.pooledCache = e),
      e.refCount++,
      (u.memoizedState = { element: a, isDehydrated: l, cache: e }),
      Rc(u),
      t
    );
  }
  function ad(t) {
    return t ? ((t = ea), t) : ea;
  }
  function nd(t, e, l, a, n, u) {
    ((n = ad(n)),
      a.context === null ? (a.context = n) : (a.pendingContext = n),
      (a = cl(e)),
      (a.payload = { element: l }),
      (u = u === void 0 ? null : u),
      u !== null && (a.callback = u),
      (l = il(t, a, e)),
      l !== null && (ce(l, t, e), Ja(l, t, e)));
  }
  function ud(t, e) {
    if (((t = t.memoizedState), t !== null && t.dehydrated !== null)) {
      var l = t.retryLane;
      t.retryLane = l !== 0 && l < e ? l : e;
    }
  }
  function Ii(t, e) {
    (ud(t, e), (t = t.alternate) && ud(t, e));
  }
  function cd(t) {
    if (t.tag === 13 || t.tag === 31) {
      var e = Ol(t, 67108864);
      (e !== null && ce(e, t, 67108864), Ii(t, 67108864));
    }
  }
  function id(t) {
    if (t.tag === 13 || t.tag === 31) {
      var e = ge();
      e = Ju(e);
      var l = Ol(t, e);
      (l !== null && ce(l, t, e), Ii(t, e));
    }
  }
  var Uu = !0;
  function Zm(t, e, l, a) {
    var n = m.T;
    m.T = null;
    var u = M.p;
    try {
      ((M.p = 2), Pi(t, e, l, a));
    } finally {
      ((M.p = u), (m.T = n));
    }
  }
  function Vm(t, e, l, a) {
    var n = m.T;
    m.T = null;
    var u = M.p;
    try {
      ((M.p = 8), Pi(t, e, l, a));
    } finally {
      ((M.p = u), (m.T = n));
    }
  }
  function Pi(t, e, l, a) {
    if (Uu) {
      var n = ts(a);
      if (n === null) (Yi(t, e, a, Ru, l), fd(t, a));
      else if (Jm(n, t, e, l, a)) a.stopPropagation();
      else if ((fd(t, a), e & 4 && -1 < Km.indexOf(t))) {
        for (; n !== null; ) {
          var u = Zl(n);
          if (u !== null)
            switch (u.tag) {
              case 3:
                if (((u = u.stateNode), u.current.memoizedState.isDehydrated)) {
                  var c = Nl(u.pendingLanes);
                  if (c !== 0) {
                    var s = u;
                    for (s.pendingLanes |= 2, s.entangledLanes |= 2; c; ) {
                      var f = 1 << (31 - fe(c));
                      ((s.entanglements[1] |= f), (c &= ~f));
                    }
                    (Ue(u), (gt & 6) === 0 && ((gu = ie() + 500), rn(0)));
                  }
                }
                break;
              case 31:
              case 13:
                ((s = Ol(u, 2)), s !== null && ce(s, u, 2), bu(), Ii(u, 2));
            }
          if (((u = ts(a)), u === null && Yi(t, e, a, Ru, l), u === n)) break;
          n = u;
        }
        n !== null && a.stopPropagation();
      } else Yi(t, e, a, null, l);
    }
  }
  function ts(t) {
    return ((t = lc(t)), es(t));
  }
  var Ru = null;
  function es(t) {
    if (((Ru = null), (t = Ll(t)), t !== null)) {
      var e = C(t);
      if (e === null) t = null;
      else {
        var l = e.tag;
        if (l === 13) {
          if (((t = K(e)), t !== null)) return t;
          t = null;
        } else if (l === 31) {
          if (((t = I(e)), t !== null)) return t;
          t = null;
        } else if (l === 3) {
          if (e.stateNode.current.memoizedState.isDehydrated) return e.tag === 3 ? e.stateNode.containerInfo : null;
          t = null;
        } else e !== t && (t = null);
      }
    }
    return ((Ru = t), null);
  }
  function sd(t) {
    switch (t) {
      case 'beforetoggle':
      case 'cancel':
      case 'click':
      case 'close':
      case 'contextmenu':
      case 'copy':
      case 'cut':
      case 'auxclick':
      case 'dblclick':
      case 'dragend':
      case 'dragstart':
      case 'drop':
      case 'focusin':
      case 'focusout':
      case 'input':
      case 'invalid':
      case 'keydown':
      case 'keypress':
      case 'keyup':
      case 'mousedown':
      case 'mouseup':
      case 'paste':
      case 'pause':
      case 'play':
      case 'pointercancel':
      case 'pointerdown':
      case 'pointerup':
      case 'ratechange':
      case 'reset':
      case 'resize':
      case 'seeked':
      case 'submit':
      case 'toggle':
      case 'touchcancel':
      case 'touchend':
      case 'touchstart':
      case 'volumechange':
      case 'change':
      case 'selectionchange':
      case 'textInput':
      case 'compositionstart':
      case 'compositionend':
      case 'compositionupdate':
      case 'beforeblur':
      case 'afterblur':
      case 'beforeinput':
      case 'blur':
      case 'fullscreenchange':
      case 'focus':
      case 'hashchange':
      case 'popstate':
      case 'select':
      case 'selectstart':
        return 2;
      case 'drag':
      case 'dragenter':
      case 'dragexit':
      case 'dragleave':
      case 'dragover':
      case 'mousemove':
      case 'mouseout':
      case 'mouseover':
      case 'pointermove':
      case 'pointerout':
      case 'pointerover':
      case 'scroll':
      case 'touchmove':
      case 'wheel':
      case 'mouseenter':
      case 'mouseleave':
      case 'pointerenter':
      case 'pointerleave':
        return 8;
      case 'message':
        switch (_d()) {
          case hs:
            return 2;
          case ys:
            return 8;
          case jn:
          case Dd:
            return 32;
          case gs:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var ls = !1,
    bl = null,
    xl = null,
    pl = null,
    vn = new Map(),
    bn = new Map(),
    Sl = [],
    Km =
      'mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset'.split(
        ' '
      );
  function fd(t, e) {
    switch (t) {
      case 'focusin':
      case 'focusout':
        bl = null;
        break;
      case 'dragenter':
      case 'dragleave':
        xl = null;
        break;
      case 'mouseover':
      case 'mouseout':
        pl = null;
        break;
      case 'pointerover':
      case 'pointerout':
        vn.delete(e.pointerId);
        break;
      case 'gotpointercapture':
      case 'lostpointercapture':
        bn.delete(e.pointerId);
    }
  }
  function xn(t, e, l, a, n, u) {
    return t === null || t.nativeEvent !== u
      ? ((t = { blockedOn: e, domEventName: l, eventSystemFlags: a, nativeEvent: u, targetContainers: [n] }),
        e !== null && ((e = Zl(e)), e !== null && cd(e)),
        t)
      : ((t.eventSystemFlags |= a), (e = t.targetContainers), n !== null && e.indexOf(n) === -1 && e.push(n), t);
  }
  function Jm(t, e, l, a, n) {
    switch (e) {
      case 'focusin':
        return ((bl = xn(bl, t, e, l, a, n)), !0);
      case 'dragenter':
        return ((xl = xn(xl, t, e, l, a, n)), !0);
      case 'mouseover':
        return ((pl = xn(pl, t, e, l, a, n)), !0);
      case 'pointerover':
        var u = n.pointerId;
        return (vn.set(u, xn(vn.get(u) || null, t, e, l, a, n)), !0);
      case 'gotpointercapture':
        return ((u = n.pointerId), bn.set(u, xn(bn.get(u) || null, t, e, l, a, n)), !0);
    }
    return !1;
  }
  function rd(t) {
    var e = Ll(t.target);
    if (e !== null) {
      var l = C(e);
      if (l !== null) {
        if (((e = l.tag), e === 13)) {
          if (((e = K(l)), e !== null)) {
            ((t.blockedOn = e),
              Es(t.priority, function () {
                id(l);
              }));
            return;
          }
        } else if (e === 31) {
          if (((e = I(l)), e !== null)) {
            ((t.blockedOn = e),
              Es(t.priority, function () {
                id(l);
              }));
            return;
          }
        } else if (e === 3 && l.stateNode.current.memoizedState.isDehydrated) {
          t.blockedOn = l.tag === 3 ? l.stateNode.containerInfo : null;
          return;
        }
      }
    }
    t.blockedOn = null;
  }
  function Hu(t) {
    if (t.blockedOn !== null) return !1;
    for (var e = t.targetContainers; 0 < e.length; ) {
      var l = ts(t.nativeEvent);
      if (l === null) {
        l = t.nativeEvent;
        var a = new l.constructor(l.type, l);
        ((ec = a), l.target.dispatchEvent(a), (ec = null));
      } else return ((e = Zl(l)), e !== null && cd(e), (t.blockedOn = l), !1);
      e.shift();
    }
    return !0;
  }
  function od(t, e, l) {
    Hu(t) && l.delete(e);
  }
  function km() {
    ((ls = !1),
      bl !== null && Hu(bl) && (bl = null),
      xl !== null && Hu(xl) && (xl = null),
      pl !== null && Hu(pl) && (pl = null),
      vn.forEach(od),
      bn.forEach(od));
  }
  function wu(t, e) {
    t.blockedOn === e &&
      ((t.blockedOn = null), ls || ((ls = !0), b.unstable_scheduleCallback(b.unstable_NormalPriority, km)));
  }
  var Bu = null;
  function dd(t) {
    Bu !== t &&
      ((Bu = t),
      b.unstable_scheduleCallback(b.unstable_NormalPriority, function () {
        Bu === t && (Bu = null);
        for (var e = 0; e < t.length; e += 3) {
          var l = t[e],
            a = t[e + 1],
            n = t[e + 2];
          if (typeof a != 'function') {
            if (es(a || l) === null) continue;
            break;
          }
          var u = Zl(l);
          u !== null && (t.splice(e, 3), (e -= 3), ti(u, { pending: !0, data: n, method: l.method, action: a }, a, n));
        }
      }));
  }
  function Ta(t) {
    function e(f) {
      return wu(f, t);
    }
    (bl !== null && wu(bl, t), xl !== null && wu(xl, t), pl !== null && wu(pl, t), vn.forEach(e), bn.forEach(e));
    for (var l = 0; l < Sl.length; l++) {
      var a = Sl[l];
      a.blockedOn === t && (a.blockedOn = null);
    }
    for (; 0 < Sl.length && ((l = Sl[0]), l.blockedOn === null); ) (rd(l), l.blockedOn === null && Sl.shift());
    if (((l = (t.ownerDocument || t).$$reactFormReplay), l != null))
      for (a = 0; a < l.length; a += 3) {
        var n = l[a],
          u = l[a + 1],
          c = n[te] || null;
        if (typeof u == 'function') c || dd(l);
        else if (c) {
          var s = null;
          if (u && u.hasAttribute('formAction')) {
            if (((n = u), (c = u[te] || null))) s = c.formAction;
            else if (es(n) !== null) continue;
          } else s = c.action;
          (typeof s == 'function' ? (l[a + 1] = s) : (l.splice(a, 3), (a -= 3)), dd(l));
        }
      }
  }
  function md() {
    function t(u) {
      u.canIntercept &&
        u.info === 'react-transition' &&
        u.intercept({
          handler: function () {
            return new Promise(function (c) {
              return (n = c);
            });
          },
          focusReset: 'manual',
          scroll: 'manual',
        });
    }
    function e() {
      (n !== null && (n(), (n = null)), a || setTimeout(l, 20));
    }
    function l() {
      if (!a && !navigation.transition) {
        var u = navigation.currentEntry;
        u &&
          u.url != null &&
          navigation.navigate(u.url, { state: u.getState(), info: 'react-transition', history: 'replace' });
      }
    }
    if (typeof navigation == 'object') {
      var a = !1,
        n = null;
      return (
        navigation.addEventListener('navigate', t),
        navigation.addEventListener('navigatesuccess', e),
        navigation.addEventListener('navigateerror', e),
        setTimeout(l, 100),
        function () {
          ((a = !0),
            navigation.removeEventListener('navigate', t),
            navigation.removeEventListener('navigatesuccess', e),
            navigation.removeEventListener('navigateerror', e),
            n !== null && (n(), (n = null)));
        }
      );
    }
  }
  function as(t) {
    this._internalRoot = t;
  }
  ((qu.prototype.render = as.prototype.render =
    function (t) {
      var e = this._internalRoot;
      if (e === null) throw Error(d(409));
      var l = e.current,
        a = ge();
      nd(l, a, t, e, null, null);
    }),
    (qu.prototype.unmount = as.prototype.unmount =
      function () {
        var t = this._internalRoot;
        if (t !== null) {
          this._internalRoot = null;
          var e = t.containerInfo;
          (nd(t.current, 2, null, t, null, null), bu(), (e[Ql] = null));
        }
      }));
  function qu(t) {
    this._internalRoot = t;
  }
  qu.prototype.unstable_scheduleHydration = function (t) {
    if (t) {
      var e = Ss();
      t = { blockedOn: null, target: t, priority: e };
      for (var l = 0; l < Sl.length && e !== 0 && e < Sl[l].priority; l++);
      (Sl.splice(l, 0, t), l === 0 && rd(t));
    }
  };
  var hd = Z.version;
  if (hd !== '19.2.0') throw Error(d(527, hd, '19.2.0'));
  M.findDOMNode = function (t) {
    var e = t._reactInternals;
    if (e === void 0)
      throw typeof t.render == 'function' ? Error(d(188)) : ((t = Object.keys(t).join(',')), Error(d(268, t)));
    return ((t = S(e)), (t = t !== null ? B(t) : null), (t = t === null ? null : t.stateNode), t);
  };
  var $m = {
    bundleType: 0,
    version: '19.2.0',
    rendererPackageName: 'react-dom',
    currentDispatcherRef: m,
    reconcilerVersion: '19.2.0',
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < 'u') {
    var Yu = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Yu.isDisabled && Yu.supportsFiber)
      try {
        ((Aa = Yu.inject($m)), (se = Yu));
      } catch {}
  }
  return (
    (Sn.createRoot = function (t, e) {
      if (!w(t)) throw Error(d(299));
      var l = !1,
        a = '',
        n = pr,
        u = Sr,
        c = Er;
      return (
        e != null &&
          (e.unstable_strictMode === !0 && (l = !0),
          e.identifierPrefix !== void 0 && (a = e.identifierPrefix),
          e.onUncaughtError !== void 0 && (n = e.onUncaughtError),
          e.onCaughtError !== void 0 && (u = e.onCaughtError),
          e.onRecoverableError !== void 0 && (c = e.onRecoverableError)),
        (e = ld(t, 1, !1, null, null, l, a, null, n, u, c, md)),
        (t[Ql] = e.current),
        qi(t),
        new as(e)
      );
    }),
    (Sn.hydrateRoot = function (t, e, l) {
      if (!w(t)) throw Error(d(299));
      var a = !1,
        n = '',
        u = pr,
        c = Sr,
        s = Er,
        f = null;
      return (
        l != null &&
          (l.unstable_strictMode === !0 && (a = !0),
          l.identifierPrefix !== void 0 && (n = l.identifierPrefix),
          l.onUncaughtError !== void 0 && (u = l.onUncaughtError),
          l.onCaughtError !== void 0 && (c = l.onCaughtError),
          l.onRecoverableError !== void 0 && (s = l.onRecoverableError),
          l.formState !== void 0 && (f = l.formState)),
        (e = ld(t, 1, !0, e, l ?? null, a, n, f, u, c, s, md)),
        (e.context = ad(null)),
        (l = e.current),
        (a = ge()),
        (a = Ju(a)),
        (n = cl(a)),
        (n.callback = null),
        il(l, n, a),
        (l = a),
        (e.current.lanes = l),
        Oa(e, l),
        Ue(e),
        (t[Ql] = e.current),
        qi(t),
        new qu(e)
      );
    }),
    (Sn.version = '19.2.0'),
    Sn
  );
}
var Nd;
function ch() {
  if (Nd) return cs.exports;
  Nd = 1;
  function b() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > 'u' || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != 'function'))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(b);
      } catch (Z) {
        console.error(Z);
      }
  }
  return (b(), (cs.exports = uh()), cs.exports);
}
var ih = ch();
const sh = Td(ih),
  os = A.forwardRef(({ className: b, ...Z }, z) => {
    const d = A.useRef(null),
      w = z || d;
    return (
      A.useEffect(() => {
        const C = w.current;
        if (!C) return;
        const K = () => {
            console.log('Video metadata loaded:', {
              duration: C.duration,
              videoWidth: C.videoWidth,
              videoHeight: C.videoHeight,
            });
          },
          I = () => {
            console.log('Video data loaded');
          },
          O = () => {
            console.log('Video can start playing');
          },
          S = () => {
            console.log('Video started playing');
          },
          B = () => {
            console.log('Video paused');
          },
          R = () => {
            console.log('Video ended');
          },
          Q = (F) => {
            console.error('Video error:', F);
          },
          at = () => {
            console.log('Video waiting for data');
          },
          et = () => {
            console.log('Video stalled');
          };
        return (
          C.addEventListener('loadedmetadata', K),
          C.addEventListener('loadeddata', I),
          C.addEventListener('canplay', O),
          C.addEventListener('play', S),
          C.addEventListener('pause', B),
          C.addEventListener('ended', R),
          C.addEventListener('error', Q),
          C.addEventListener('waiting', at),
          C.addEventListener('stalled', et),
          () => {
            (C.removeEventListener('loadedmetadata', K),
              C.removeEventListener('loadeddata', I),
              C.removeEventListener('canplay', O),
              C.removeEventListener('play', S),
              C.removeEventListener('pause', B),
              C.removeEventListener('ended', R),
              C.removeEventListener('error', Q),
              C.removeEventListener('waiting', at),
              C.removeEventListener('stalled', et));
          }
        );
      }, [w]),
      i.jsx('video', { ref: w, className: b, ...Z })
    );
  });
os.displayName = 'VideoPlayer';
function zd(b, Z, z, d = null) {
  const [w, C] = A.useState('disconnected'),
    [K, I] = A.useState(null),
    [O, S] = A.useState(null),
    [B, R] = A.useState(null),
    [Q, at] = A.useState({}),
    [et, F] = A.useState([]),
    $ = A.useRef(null),
    p = A.useRef(null),
    D = A.useRef(null),
    U = A.useRef(null);
  A.useEffect(() => {
    const _ = [];
    (_.push({ urls: 'stun:stun.l.google.com:19302' }),
      _.push({ urls: 'stun:stun1.l.google.com:19302' }),
      z?.turn && _.push({ urls: z.turn.urls, username: z.turn.username, credential: z.turn.credential }),
      F(_));
  }, [z]);
  const J = A.useCallback(
      async (_) => {
        if (!(!b || !Z))
          try {
            const m = await fetch('/api/candidate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', ...(z?.authSecret && { 'x-auth-secret': z.authSecret }) },
              body: JSON.stringify({
                roomId: b,
                role: Z,
                candidate: { candidate: _.candidate, sdpMid: _.sdpMid, sdpMLineIndex: _.sdpMLineIndex },
              }),
            });
            if (!m.ok) throw new Error(`Failed to send ICE candidate: ${m.status}`);
          } catch (m) {
            (console.error('Error sending ICE candidate:', m), R(`Failed to send ICE candidate: ${m.message}`));
          }
      },
      [b, Z, z]
    ),
    ut = A.useCallback(() => {
      const _ = new RTCPeerConnection({ iceServers: et });
      return (
        (_.onicecandidate = (m) => {
          m.candidate && J(m.candidate);
        }),
        (_.onconnectionstatechange = () => {
          (console.log('Connection state changed:', _.connectionState), C(_.connectionState));
        }),
        (_.oniceconnectionstatechange = () => {
          console.log('ICE connection state changed:', _.iceConnectionState);
        }),
        (_.ontrack = (m) => {
          (console.log('Received remote stream:', m.streams[0]), I(m.streams[0]));
        }),
        (_.ondatachannel = (m) => {
          const M = m.channel;
          ((p.current = M),
            (M.onopen = () => {
              console.log('Data channel opened');
            }),
            (M.onmessage = (q) => {
              console.log('Received data channel message:', q.data);
            }));
        }),
        _
      );
    }, [et]),
    At = A.useCallback(
      async (_) => {
        if (b)
          try {
            const m = await fetch('/api/offer', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', ...(z?.authSecret && { 'x-auth-secret': z.authSecret }) },
              body: JSON.stringify({ roomId: b, desc: _ }),
            });
            if (!m.ok) throw new Error(`Failed to send offer: ${m.status}`);
          } catch (m) {
            (console.error('Error sending offer:', m), R(`Failed to send offer: ${m.message}`));
          }
      },
      [b, z]
    ),
    k = A.useCallback(
      async (_) => {
        if (b)
          try {
            const m = await fetch('/api/answer', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', ...(z?.authSecret && { 'x-auth-secret': z.authSecret }) },
              body: JSON.stringify({ roomId: b, desc: _ }),
            });
            if (!m.ok) throw new Error(`Failed to send answer: ${m.status}`);
          } catch (m) {
            (console.error('Error sending answer:', m), R(`Failed to send answer: ${m.message}`));
          }
      },
      [b, z]
    ),
    Ot = A.useCallback(async () => {
      if (Z !== 'host') throw new Error('Only hosts can start screen sharing');
      try {
        (R(null), C('connecting'));
        const _ = await navigator.mediaDevices.getDisplayMedia({ video: !0, audio: !0 });
        S(_);
        const m = ut();
        (($.current = m),
          _.getTracks().forEach((q) => {
            m.addTrack(q, _);
          }));
        const M = await m.createOffer({ offerToReceiveAudio: !0, offerToReceiveVideo: !0 });
        return (await m.setLocalDescription(M), await At(M), wt(), _);
      } catch (_) {
        throw (
          console.error('Error starting screen share:', _),
          R(`Failed to start screen sharing: ${_.message}`),
          C('disconnected'),
          _
        );
      }
    }, [Z, ut, At]),
    Nt = A.useCallback(async () => {
      if (Z !== 'viewer') throw new Error('Only viewers can connect to host');
      try {
        (R(null), C('connecting'));
        const _ = ut();
        (($.current = _), Dt(), nt());
      } catch (_) {
        throw (
          console.error('Error connecting to host:', _),
          R(`Failed to connect to host: ${_.message}`),
          C('disconnected'),
          _
        );
      }
    }, [Z, ut]),
    Pt = A.useCallback(async () => {
      try {
        (O && (O.getTracks().forEach((_) => _.stop()), S(null)),
          $.current && ($.current.close(), ($.current = null)),
          D.current && (clearInterval(D.current), (D.current = null)),
          U.current && (clearInterval(U.current), (U.current = null)),
          C('disconnected'),
          I(null));
      } catch (_) {
        (console.error('Error stopping screen share:', _), R(`Failed to stop screen sharing: ${_.message}`));
      }
    }, [O]),
    $t = A.useCallback(async () => {
      await Pt();
    }, [Pt]),
    Dt = A.useCallback(async () => {
      (D.current && clearInterval(D.current),
        (D.current = setInterval(async () => {
          try {
            const _ = await fetch(`/api/offer?roomId=${b}`);
            if (_.ok) {
              const m = await _.json();
              if (m.desc) {
                (clearInterval(D.current), (D.current = null));
                const M = $.current;
                if (M) {
                  await M.setRemoteDescription(m.desc);
                  const q = await M.createAnswer();
                  (await M.setLocalDescription(q), await k(q));
                }
              }
            }
          } catch (_) {
            console.error('Error polling for offers:', _);
          }
        }, 1e3)));
    }, [b, k]),
    wt = A.useCallback(async () => {
      (D.current && clearInterval(D.current),
        (D.current = setInterval(async () => {
          try {
            const _ = await fetch(`/api/answer?roomId=${b}`);
            if (_.ok) {
              const m = await _.json();
              if (m.desc) {
                (clearInterval(D.current), (D.current = null));
                const M = $.current;
                M && (await M.setRemoteDescription(m.desc));
              }
            }
          } catch (_) {
            console.error('Error polling for answers:', _);
          }
        }, 1e3)));
    }, [b]),
    nt = A.useCallback(async () => {
      (U.current && clearInterval(U.current),
        (U.current = setInterval(async () => {
          try {
            const _ = await fetch(`/api/candidate?roomId=${b}&role=${Z}`);
            if (_.ok) {
              const m = await _.json();
              if (m.candidates && m.candidates.length > 0) {
                const M = $.current;
                if (M) for (const q of m.candidates) await M.addIceCandidate(q);
              }
            }
          } catch (_) {
            console.error('Error polling for ICE candidates:', _);
          }
        }, 1e3)));
    }, [b, Z]);
  return (
    A.useEffect(
      () => () => {
        (D.current && clearInterval(D.current),
          U.current && clearInterval(U.current),
          $.current && $.current.close(),
          O && O.getTracks().forEach((_) => _.stop()));
      },
      [O]
    ),
    {
      connectionState: w,
      remoteStream: K,
      localStream: O,
      error: B,
      peerConnections,
      startScreenShare: Ot,
      stopScreenShare: Pt,
      connectToHost: Nt,
      disconnect: $t,
    }
  );
}
function fh({ roomId: b, config: Z, onGoHome: z }) {
  const [d, w] = A.useState(!1),
    [C, K] = A.useState('disconnected'),
    [I, O] = A.useState(0),
    [S, B] = A.useState(null),
    [R, Q] = A.useState('Start Sharing'),
    at = A.useRef(null),
    { startScreenShare: et, stopScreenShare: F, connectionState: $, peerConnections: p, error: D } = zd(b, 'host', Z);
  (A.useEffect(() => {
    K($);
  }, [$]),
    A.useEffect(() => {
      O(Object.keys(p).length);
    }, [p]),
    A.useEffect(() => {
      D && B(D);
    }, [D]));
  const U = async () => {
      try {
        (B(null), Q('Starting...'));
        const Nt = await et();
        Nt && at.current && ((at.current.srcObject = Nt), w(!0), Q('Stop Sharing'));
      } catch (Nt) {
        (console.error('Error starting screen share:', Nt),
          B('Failed to start screen sharing. Please check your browser permissions.'),
          Q('Start Sharing'));
      }
    },
    J = async () => {
      try {
        (await F(), at.current && (at.current.srcObject = null), w(!1), Q('Start Sharing'));
      } catch (Nt) {
        (console.error('Error stopping screen share:', Nt), B('Failed to stop screen sharing.'));
      }
    },
    ut = () => {
      d ? J() : U();
    },
    At = () => {
      navigator.clipboard
        .writeText(b)
        .then(() => {
          console.log('Room ID copied to clipboard');
        })
        .catch((Nt) => {
          console.error('Failed to copy room ID:', Nt);
        });
    },
    k = () => {
      switch (C) {
        case 'connected':
          return 'text-green-600';
        case 'connecting':
          return 'text-yellow-600';
        case 'disconnected':
          return 'text-red-600';
        default:
          return 'text-gray-600';
      }
    },
    Ot = () => {
      switch (C) {
        case 'connected':
          return 'Connected';
        case 'connecting':
          return 'Connecting...';
        case 'disconnected':
          return 'Disconnected';
        default:
          return 'Unknown';
      }
    };
  return i.jsxs('div', {
    className: 'space-y-6',
    children: [
      i.jsx('div', {
        className: 'bg-white rounded-lg shadow-md p-6',
        children: i.jsxs('div', {
          className: 'flex items-center justify-between',
          children: [
            i.jsxs('div', {
              children: [
                i.jsx('h2', { className: 'text-2xl font-bold text-gray-900 mb-2', children: '🖥️ Screen Sharing Room' }),
                i.jsx('p', {
                  className: 'text-gray-600',
                  children: 'Share your screen with others. Viewers can join using the room ID below.',
                }),
              ],
            }),
            i.jsxs('div', {
              className: 'text-right',
              children: [
                i.jsxs('div', { className: `text-sm font-medium ${k()}`, children: ['Status: ', Ot()] }),
                i.jsxs('div', { className: 'text-sm text-gray-500', children: ['Viewers: ', I] }),
              ],
            }),
          ],
        }),
      }),
      i.jsxs('div', {
        className: 'bg-white rounded-lg shadow-md p-6',
        children: [
          i.jsx('h3', { className: 'text-lg font-semibold text-gray-900 mb-4', children: 'Room Information' }),
          i.jsx('div', {
            className: 'flex items-center space-x-4',
            children: i.jsxs('div', {
              className: 'flex-1',
              children: [
                i.jsx('label', { className: 'block text-sm font-medium text-gray-700 mb-2', children: 'Room ID' }),
                i.jsxs('div', {
                  className: 'flex items-center space-x-2',
                  children: [
                    i.jsx('input', {
                      type: 'text',
                      value: b,
                      readOnly: !0,
                      className:
                        'flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 font-mono text-sm',
                    }),
                    i.jsx('button', {
                      onClick: At,
                      className: 'px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors',
                      children: 'Copy',
                    }),
                  ],
                }),
              ],
            }),
          }),
          i.jsx('p', {
            className: 'text-sm text-gray-500 mt-2',
            children: 'Share this room ID with others so they can view your screen.',
          }),
        ],
      }),
      i.jsxs('div', {
        className: 'bg-white rounded-lg shadow-md p-6',
        children: [
          i.jsx('h3', { className: 'text-lg font-semibold text-gray-900 mb-4', children: 'Screen Share Controls' }),
          i.jsxs('div', {
            className: 'flex items-center justify-center space-x-4',
            children: [
              i.jsx('button', {
                onClick: ut,
                disabled: C === 'connecting',
                className: `px-6 py-3 rounded-lg font-medium transition-colors ${d ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-green-600 text-white hover:bg-green-700'} ${C === 'connecting' ? 'opacity-50 cursor-not-allowed' : ''}`,
                children: C === 'connecting' ? 'Connecting...' : R,
              }),
              d &&
                i.jsxs('div', {
                  className: 'flex items-center space-x-2 text-green-600',
                  children: [
                    i.jsx('div', { className: 'w-2 h-2 bg-green-600 rounded-full animate-pulse' }),
                    i.jsx('span', { className: 'text-sm font-medium', children: 'Sharing Active' }),
                  ],
                }),
            ],
          }),
          !d &&
            i.jsx('div', {
              className: 'mt-4 text-center',
              children: i.jsx('p', {
                className: 'text-sm text-gray-600',
                children: 'Click "Start Sharing" to begin sharing your screen with viewers.',
              }),
            }),
        ],
      }),
      S &&
        i.jsx('div', {
          className: 'bg-red-50 border border-red-200 rounded-lg p-4',
          children: i.jsxs('div', {
            className: 'flex items-center',
            children: [
              i.jsx('div', { className: 'text-red-600 mr-2', children: '⚠️' }),
              i.jsxs('div', {
                children: [
                  i.jsx('h4', { className: 'text-red-800 font-medium', children: 'Error' }),
                  i.jsx('p', { className: 'text-red-700 text-sm mt-1', children: S }),
                ],
              }),
            ],
          }),
        }),
      d &&
        i.jsxs('div', {
          className: 'bg-white rounded-lg shadow-md p-6',
          children: [
            i.jsx('h3', { className: 'text-lg font-semibold text-gray-900 mb-4', children: 'Your Screen (Preview)' }),
            i.jsxs('div', {
              className: 'relative',
              children: [
                i.jsx(os, {
                  ref: at,
                  className: 'w-full max-w-2xl mx-auto rounded-lg border border-gray-200',
                  muted: !0,
                  autoPlay: !0,
                  playsInline: !0,
                }),
                i.jsx('div', {
                  className: 'absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs',
                  children: 'You are sharing this screen',
                }),
              ],
            }),
          ],
        }),
      i.jsxs('div', {
        className: 'bg-blue-50 border border-blue-200 rounded-lg p-6',
        children: [
          i.jsx('h3', { className: 'text-lg font-semibold text-blue-900 mb-4', children: '📋 Instructions' }),
          i.jsxs('div', {
            className: 'space-y-2 text-sm text-blue-800',
            children: [
              i.jsx('p', { children: '• Click "Start Sharing" to begin screen sharing' }),
              i.jsx('p', { children: '• Select the screen or application you want to share' }),
              i.jsx('p', { children: '• Share the Room ID with viewers so they can join' }),
              i.jsx('p', { children: '• Use the Chat feature to communicate with viewers' }),
              i.jsx('p', { children: `• Click "Stop Sharing" when you're done` }),
            ],
          }),
        ],
      }),
      i.jsx('div', {
        className: 'flex justify-center space-x-4',
        children: i.jsx('button', {
          onClick: z,
          className: 'px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors',
          children: 'Back to Home',
        }),
      }),
    ],
  });
}
function rh({ roomId: b, viewerId: Z, setViewerId: z, config: d, onGoHome: w }) {
  const [C, K] = A.useState('disconnected'),
    [I, O] = A.useState(!1),
    [S, B] = A.useState(null),
    [R, Q] = A.useState(!1),
    [at, et] = A.useState('unknown'),
    F = A.useRef(null),
    { connectToHost: $, disconnect: p, connectionState: D, remoteStream: U, error: J } = zd(b, 'viewer', d, Z);
  (A.useEffect(() => {
    (K(D), O(D === 'connected'));
  }, [D]),
    A.useEffect(() => {
      U && F.current && (F.current.srcObject = U);
    }, [U]),
    A.useEffect(() => {
      J && (B(J), Q(!1));
    }, [J]),
    A.useEffect(() => {
      b && !R && !I && ut();
    }, [b]));
  const ut = async () => {
      if (!b.trim()) {
        B('Please enter a room ID');
        return;
      }
      try {
        (B(null), Q(!0), et('connecting'), await $(), et('connected'));
      } catch (wt) {
        (console.error('Error connecting to host:', wt),
          B('Failed to connect to host. Please check the room ID and try again.'),
          et('disconnected'));
      } finally {
        Q(!1);
      }
    },
    At = async () => {
      try {
        (await p(), et('disconnected'), F.current && (F.current.srcObject = null));
      } catch (wt) {
        console.error('Error disconnecting:', wt);
      }
    },
    k = () => {
      At().then(() => {
        setTimeout(ut, 1e3);
      });
    },
    Ot = () => {
      const wt = `viewer_${Math.random().toString(36).substring(2, 8)}`;
      return (z(wt), wt);
    },
    Nt = () => {
      switch (C) {
        case 'connected':
          return 'text-green-600';
        case 'connecting':
          return 'text-yellow-600';
        case 'disconnected':
          return 'text-red-600';
        default:
          return 'text-gray-600';
      }
    },
    Pt = () => {
      switch (C) {
        case 'connected':
          return 'Connected';
        case 'connecting':
          return 'Connecting...';
        case 'disconnected':
          return 'Disconnected';
        default:
          return 'Unknown';
      }
    },
    $t = () => {
      switch (at) {
        case 'connected':
          return 'text-green-600';
        case 'connecting':
          return 'text-yellow-600';
        case 'disconnected':
          return 'text-red-600';
        default:
          return 'text-gray-600';
      }
    },
    Dt = () => {
      switch (at) {
        case 'connected':
          return 'Host Online';
        case 'connecting':
          return 'Connecting to Host...';
        case 'disconnected':
          return 'Host Offline';
        default:
          return 'Unknown';
      }
    };
  return i.jsxs('div', {
    className: 'space-y-6',
    children: [
      i.jsx('div', {
        className: 'bg-white rounded-lg shadow-md p-6',
        children: i.jsxs('div', {
          className: 'flex items-center justify-between',
          children: [
            i.jsxs('div', {
              children: [
                i.jsx('h2', { className: 'text-2xl font-bold text-gray-900 mb-2', children: '👀 Viewing Room' }),
                i.jsxs('p', {
                  className: 'text-gray-600',
                  children: ['Connected to room: ', i.jsx('span', { className: 'font-mono font-medium', children: b })],
                }),
              ],
            }),
            i.jsxs('div', {
              className: 'text-right',
              children: [
                i.jsxs('div', { className: `text-sm font-medium ${Nt()}`, children: ['Connection: ', Pt()] }),
                i.jsx('div', { className: `text-sm font-medium ${$t()}`, children: Dt() }),
              ],
            }),
          ],
        }),
      }),
      i.jsxs('div', {
        className: 'bg-white rounded-lg shadow-md p-6',
        children: [
          i.jsx('h3', { className: 'text-lg font-semibold text-gray-900 mb-4', children: 'Your Viewer ID' }),
          i.jsxs('div', {
            className: 'flex items-center space-x-4',
            children: [
              i.jsx('div', {
                className: 'flex-1',
                children: i.jsx('input', {
                  type: 'text',
                  value: Z || '',
                  onChange: (wt) => z(wt.target.value),
                  placeholder: 'Enter your name or leave blank for auto-generated ID',
                  className:
                    'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
                }),
              }),
              i.jsx('button', {
                onClick: Ot,
                className: 'px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors',
                children: 'Generate ID',
              }),
            ],
          }),
          i.jsx('p', {
            className: 'text-sm text-gray-500 mt-2',
            children: 'This ID helps identify you in the chat and diagnostics.',
          }),
        ],
      }),
      i.jsxs('div', {
        className: 'bg-white rounded-lg shadow-md p-6',
        children: [
          i.jsx('h3', { className: 'text-lg font-semibold text-gray-900 mb-4', children: 'Connection Controls' }),
          i.jsx('div', {
            className: 'flex items-center justify-center space-x-4',
            children: I
              ? i.jsxs('div', {
                  className: 'flex items-center space-x-4',
                  children: [
                    i.jsx('button', {
                      onClick: k,
                      className: 'px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors',
                      children: 'Reconnect',
                    }),
                    i.jsx('button', {
                      onClick: At,
                      className: 'px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors',
                      children: 'Disconnect',
                    }),
                  ],
                })
              : i.jsx('button', {
                  onClick: ut,
                  disabled: R,
                  className: `px-6 py-3 rounded-lg font-medium transition-colors ${R ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`,
                  children: R ? 'Connecting...' : 'Connect to Host',
                }),
          }),
          I &&
            i.jsx('div', {
              className: 'mt-4 text-center',
              children: i.jsxs('div', {
                className: 'flex items-center justify-center space-x-2 text-green-600',
                children: [
                  i.jsx('div', { className: 'w-2 h-2 bg-green-600 rounded-full animate-pulse' }),
                  i.jsx('span', { className: 'text-sm font-medium', children: 'Connected to Host' }),
                ],
              }),
            }),
        ],
      }),
      S &&
        i.jsxs('div', {
          className: 'bg-red-50 border border-red-200 rounded-lg p-4',
          children: [
            i.jsxs('div', {
              className: 'flex items-center',
              children: [
                i.jsx('div', { className: 'text-red-600 mr-2', children: '⚠️' }),
                i.jsxs('div', {
                  children: [
                    i.jsx('h4', { className: 'text-red-800 font-medium', children: 'Connection Error' }),
                    i.jsx('p', { className: 'text-red-700 text-sm mt-1', children: S }),
                  ],
                }),
              ],
            }),
            i.jsx('div', {
              className: 'mt-3',
              children: i.jsx('button', {
                onClick: k,
                className: 'text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors',
                children: 'Try Again',
              }),
            }),
          ],
        }),
      I &&
        i.jsxs('div', {
          className: 'bg-white rounded-lg shadow-md p-6',
          children: [
            i.jsx('h3', { className: 'text-lg font-semibold text-gray-900 mb-4', children: "Host's Screen" }),
            i.jsxs('div', {
              className: 'relative',
              children: [
                i.jsx(os, {
                  ref: F,
                  className: 'w-full max-w-4xl mx-auto rounded-lg border border-gray-200 bg-black',
                  autoPlay: !0,
                  playsInline: !0,
                }),
                !U &&
                  i.jsx('div', {
                    className: 'absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg',
                    children: i.jsxs('div', {
                      className: 'text-center',
                      children: [
                        i.jsx('div', {
                          className: 'animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4',
                        }),
                        i.jsx('p', { className: 'text-gray-600', children: 'Waiting for host to start sharing...' }),
                      ],
                    }),
                  }),
                U &&
                  i.jsx('div', {
                    className: 'absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs',
                    children: 'Live',
                  }),
              ],
            }),
          ],
        }),
      !I &&
        !R &&
        i.jsx('div', {
          className: 'bg-white rounded-lg shadow-md p-6',
          children: i.jsxs('div', {
            className: 'text-center py-12',
            children: [
              i.jsx('div', { className: 'text-6xl mb-4', children: '📺' }),
              i.jsx('h3', { className: 'text-xl font-semibold text-gray-900 mb-2', children: 'Ready to View' }),
              i.jsx('p', {
                className: 'text-gray-600 mb-6',
                children: 'Click "Connect to Host" to start viewing the shared screen.',
              }),
              i.jsx('button', {
                onClick: ut,
                className: 'px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors',
                children: 'Connect to Host',
              }),
            ],
          }),
        }),
      i.jsxs('div', {
        className: 'bg-blue-50 border border-blue-200 rounded-lg p-6',
        children: [
          i.jsx('h3', { className: 'text-lg font-semibold text-blue-900 mb-4', children: '📋 Instructions' }),
          i.jsxs('div', {
            className: 'space-y-2 text-sm text-blue-800',
            children: [
              i.jsx('p', { children: '• Make sure the host has started sharing their screen' }),
              i.jsx('p', { children: '• Click "Connect to Host" to join the viewing session' }),
              i.jsx('p', { children: '• Use the Chat feature to communicate with the host' }),
              i.jsx('p', { children: '• The screen will appear automatically when the host starts sharing' }),
              i.jsx('p', { children: `• Click "Disconnect" when you're done viewing` }),
            ],
          }),
        ],
      }),
      i.jsx('div', {
        className: 'flex justify-center space-x-4',
        children: i.jsx('button', {
          onClick: w,
          className: 'px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors',
          children: 'Back to Home',
        }),
      }),
    ],
  });
}
function Ad() {
  const [b, Z] = A.useState(null),
    [z, d] = A.useState(!0),
    [w, C] = A.useState(null),
    K = A.useCallback(async () => {
      try {
        (d(!0), C(null));
        const p = await fetch('/api/config');
        if (!p.ok) throw new Error(`Failed to fetch config: ${p.status}`);
        const D = await p.json();
        if (D.success && D.config) Z(D.config);
        else throw new Error('Invalid config response format');
      } catch (p) {
        (console.error('Failed to fetch client configuration:', p), C(p.message), Z(null));
      } finally {
        d(!1);
      }
    }, []);
  A.useEffect(() => {
    K();
  }, [K]);
  const I = A.useCallback(async () => {
      try {
        const p = await fetch('/api/create-room', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...(b?.authSecret && { 'x-auth-secret': b.authSecret }) },
        });
        if (!p.ok) throw new Error(`Failed to create room: ${p.status}`);
        return await p.json();
      } catch (p) {
        throw (console.error('Error creating room:', p), p);
      }
    }, [b]),
    O = A.useCallback(
      async (p, D, U) => {
        try {
          const J = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...(b?.authSecret && { 'x-auth-secret': b.authSecret }) },
            body: JSON.stringify({ roomId: p, message: D, sender: U }),
          });
          if (!J.ok) throw new Error(`Failed to send message: ${J.status}`);
          return await J.json();
        } catch (J) {
          throw (console.error('Error sending chat message:', J), J);
        }
      },
      [b]
    ),
    S = A.useCallback(async (p, D = 0) => {
      try {
        const U = await fetch(`/api/chat?roomId=${p}&since=${D}`);
        if (!U.ok) throw new Error(`Failed to get messages: ${U.status}`);
        return await U.json();
      } catch (U) {
        throw (console.error('Error getting chat messages:', U), U);
      }
    }, []),
    B = A.useCallback(
      async (p, D) => {
        try {
          const U = await fetch('/api/offer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...(b?.authSecret && { 'x-auth-secret': b.authSecret }) },
            body: JSON.stringify({ roomId: p, desc: D }),
          });
          if (!U.ok) throw new Error(`Failed to send offer: ${U.status}`);
          return await U.json();
        } catch (U) {
          throw (console.error('Error sending offer:', U), U);
        }
      },
      [b]
    ),
    R = A.useCallback(async (p) => {
      try {
        const D = await fetch(`/api/offer?roomId=${p}`);
        if (!D.ok) {
          if (D.status === 404) return null;
          throw new Error(`Failed to get offer: ${D.status}`);
        }
        return await D.json();
      } catch (D) {
        throw (console.error('Error getting offer:', D), D);
      }
    }, []),
    Q = A.useCallback(
      async (p, D) => {
        try {
          const U = await fetch('/api/answer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...(b?.authSecret && { 'x-auth-secret': b.authSecret }) },
            body: JSON.stringify({ roomId: p, desc: D }),
          });
          if (!U.ok) throw new Error(`Failed to send answer: ${U.status}`);
          return await U.json();
        } catch (U) {
          throw (console.error('Error sending answer:', U), U);
        }
      },
      [b]
    ),
    at = A.useCallback(async (p) => {
      try {
        const D = await fetch(`/api/answer?roomId=${p}`);
        if (!D.ok) {
          if (D.status === 404) return null;
          throw new Error(`Failed to get answer: ${D.status}`);
        }
        return await D.json();
      } catch (D) {
        throw (console.error('Error getting answer:', D), D);
      }
    }, []),
    et = A.useCallback(
      async (p, D, U) => {
        try {
          const J = await fetch('/api/candidate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...(b?.authSecret && { 'x-auth-secret': b.authSecret }) },
            body: JSON.stringify({ roomId: p, role: D, candidate: U }),
          });
          if (!J.ok) throw new Error(`Failed to send ICE candidate: ${J.status}`);
          return await J.json();
        } catch (J) {
          throw (console.error('Error sending ICE candidate:', J), J);
        }
      },
      [b]
    ),
    F = A.useCallback(async (p, D) => {
      try {
        const U = await fetch(`/api/candidate?roomId=${p}&role=${D}`);
        if (!U.ok) throw new Error(`Failed to get ICE candidates: ${U.status}`);
        return await U.json();
      } catch (U) {
        throw (console.error('Error getting ICE candidates:', U), U);
      }
    }, []),
    $ = A.useCallback(async (p, D) => {
      try {
        const U = await fetch(`/api/diagnostics?roomId=${p}&role=${D}`);
        if (!U.ok) throw new Error(`Failed to get diagnostics: ${U.status}`);
        return await U.json();
      } catch (U) {
        throw (console.error('Error getting diagnostics:', U), U);
      }
    }, []);
  return {
    config: b,
    loading: z,
    error: w,
    fetchConfig: K,
    createRoom: I,
    sendChatMessage: O,
    getChatMessages: S,
    sendOffer: B,
    getOffer: R,
    sendAnswer: Q,
    getAnswer: at,
    sendICECandidate: et,
    getICECandidates: F,
    getDiagnostics: $,
  };
}
function oh(b, Z, z) {
  const [d, w] = A.useState([]),
    [C, K] = A.useState(!1),
    [I, O] = A.useState(null),
    [S, B] = A.useState(!1),
    [R, Q] = A.useState(0),
    { sendChatMessage: at, getChatMessages: et } = Ad(),
    F = A.useRef(null),
    $ = A.useRef(null),
    p = A.useCallback(async () => {
      if (!(!b || !S))
        try {
          const nt = await et(b, R);
          nt.messages &&
            nt.messages.length > 0 &&
            w((_) => {
              const m = new Set(_.map((q) => q.id)),
                M = nt.messages.filter((q) => !m.has(q.id));
              if (M.length > 0) {
                const q = Math.max(...M.map((dt) => dt.timestamp));
                return (Q(q), [..._, ...M].sort((dt, yt) => dt.timestamp - yt.timestamp));
              }
              return _;
            });
        } catch (nt) {
          (console.error('Error polling messages:', nt),
            O('Failed to fetch messages'),
            B(!1),
            $.current && clearTimeout($.current),
            ($.current = setTimeout(() => {
              (B(!0), O(null));
            }, 5e3)));
        }
    }, [b, R, S, et]),
    D = A.useCallback(() => {
      (F.current && clearInterval(F.current), (F.current = setInterval(p, 2e3)));
    }, [p]),
    U = A.useCallback(() => {
      F.current && (clearInterval(F.current), (F.current = null));
    }, []);
  A.useEffect(
    () => (
      b && z ? (B(!0), O(null), w([]), Q(0), D()) : (B(!1), U()),
      () => {
        (U(), $.current && clearTimeout($.current));
      }
    ),
    [b, z, D, U]
  );
  const J = A.useCallback(
      async (nt, _ = z) => {
        if (!b || !_ || !nt.trim()) throw new Error('Room ID, sender, and message are required');
        try {
          (K(!0), O(null));
          const m = await at(b, nt, _);
          if (m.ok) {
            const M = { id: m.message.id, sender: _, message: nt, timestamp: m.message.timestamp };
            return (
              w((q) => [...q, M].sort((dt, yt) => dt.timestamp - yt.timestamp)),
              Q(m.message.timestamp),
              m.message
            );
          } else throw new Error('Failed to send message');
        } catch (m) {
          throw (console.error('Error sending message:', m), O(`Failed to send message: ${m.message}`), m);
        } finally {
          K(!1);
        }
      },
      [b, z, at]
    ),
    ut = A.useCallback(async () => {
      if (b)
        try {
          (K(!0), O(null));
          const nt = await et(b, 0);
          if (nt.messages && (w(nt.messages.sort((_, m) => _.timestamp - m.timestamp)), nt.messages.length > 0)) {
            const _ = Math.max(...nt.messages.map((m) => m.timestamp));
            Q(_);
          }
        } catch (nt) {
          (console.error('Error loading initial messages:', nt), O('Failed to load messages'));
        } finally {
          K(!1);
        }
    }, [b, et]);
  A.useEffect(() => {
    b && ut();
  }, [b, ut]);
  const At = A.useCallback(() => {
      (w([]), Q(0), O(null));
    }, []),
    k = A.useCallback(() => d.length, [d]),
    Ot = A.useCallback((nt) => d.filter((_) => _.sender === nt), [d]),
    Nt = A.useCallback(() => (d.length > 0 ? d[d.length - 1] : null), [d]),
    Pt = A.useCallback((nt) => d.some((_) => _.sender === nt), [d]),
    $t = A.useCallback(() => {
      const nt = new Set(d.map((_) => _.sender));
      return Array.from(nt);
    }, [d]),
    Dt = A.useCallback(
      (nt) => ({
        ...nt,
        formattedTime: new Date(nt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        formattedDate: new Date(nt.timestamp).toLocaleDateString(),
        isFromCurrentUser: nt.sender === z,
      }),
      [z]
    ),
    wt = A.useCallback(() => d.map(Dt), [d, Dt]);
  return (
    A.useEffect(
      () => () => {
        (U(), $.current && clearTimeout($.current));
      },
      [U]
    ),
    {
      messages: d,
      loading: C,
      error: I,
      isConnected: S,
      lastMessageTime: R,
      sendMessage: J,
      clearMessages: At,
      loadInitialMessages: ut,
      getMessageCount: k,
      getMessagesBySender: Ot,
      getLatestMessage: Nt,
      hasSenderSentMessages: Pt,
      getUniqueSenders: $t,
      getFormattedMessages: wt,
    }
  );
}
function dh({ roomId: b, role: Z, viewerId: z }) {
  const [d, w] = A.useState(''),
    [C, K] = A.useState(z || Z),
    I = A.useRef(null),
    { messages: O, sendMessage: S, loading: B, error: R, isConnected: Q } = oh(b, Z, C);
  (A.useEffect(() => {
    I.current?.scrollIntoView({ behavior: 'smooth' });
  }, [O]),
    A.useEffect(() => {
      z && K(z);
    }, [z]));
  const at = async (p) => {
      if ((p.preventDefault(), !(!d.trim() || !C.trim())))
        try {
          (await S(d.trim(), C.trim()), w(''));
        } catch (D) {
          console.error('Error sending message:', D);
        }
    },
    et = (p) => {
      p.key === 'Enter' && !p.shiftKey && (p.preventDefault(), at(p));
    },
    F = (p) => new Date(p).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    $ = (p) => (p === 'host' ? '🖥️ Host' : p.startsWith('viewer_') ? `👀 ${p}` : `👤 ${p}`);
  return i.jsxs('div', {
    className: 'flex flex-col h-full bg-white',
    children: [
      i.jsxs('div', {
        className: 'flex-shrink-0 bg-blue-600 text-white p-4',
        children: [
          i.jsxs('div', {
            className: 'flex items-center justify-between',
            children: [
              i.jsx('h3', { className: 'text-lg font-semibold', children: '💬 Chat' }),
              i.jsxs('div', {
                className: 'flex items-center space-x-2',
                children: [
                  i.jsx('div', { className: `w-2 h-2 rounded-full ${Q ? 'bg-green-400' : 'bg-red-400'}` }),
                  i.jsx('span', { className: 'text-sm', children: Q ? 'Connected' : 'Disconnected' }),
                ],
              }),
            ],
          }),
          i.jsxs('p', { className: 'text-blue-100 text-sm mt-1', children: ['Room: ', b] }),
        ],
      }),
      i.jsxs('div', {
        className: 'flex-1 overflow-y-auto p-4 space-y-3',
        children: [
          B &&
            O.length === 0 &&
            i.jsxs('div', {
              className: 'text-center text-gray-500 py-4',
              children: [
                i.jsx('div', {
                  className: 'animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2',
                }),
                'Loading messages...',
              ],
            }),
          R &&
            i.jsx('div', {
              className: 'bg-red-50 border border-red-200 rounded-lg p-3',
              children: i.jsxs('div', { className: 'text-red-600 text-sm', children: ['⚠️ ', R] }),
            }),
          O.length === 0 &&
            !B &&
            i.jsxs('div', {
              className: 'text-center text-gray-500 py-8',
              children: [
                i.jsx('div', { className: 'text-4xl mb-2', children: '💬' }),
                i.jsx('p', { children: 'No messages yet' }),
                i.jsx('p', { className: 'text-sm', children: 'Start the conversation!' }),
              ],
            }),
          O.map((p) =>
            i.jsx(
              'div',
              {
                className: `flex ${p.sender === C ? 'justify-end' : 'justify-start'}`,
                children: i.jsxs('div', {
                  className: `max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${p.sender === C ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'}`,
                  children: [
                    p.sender !== C &&
                      i.jsx('div', { className: 'text-xs font-medium text-gray-600 mb-1', children: $(p.sender) }),
                    i.jsx('div', { className: 'text-sm whitespace-pre-wrap break-words', children: p.message }),
                    i.jsx('div', {
                      className: `text-xs mt-1 ${p.sender === C ? 'text-blue-100' : 'text-gray-500'}`,
                      children: F(p.timestamp),
                    }),
                  ],
                }),
              },
              p.id
            )
          ),
          i.jsx('div', { ref: I }),
        ],
      }),
      i.jsx('div', {
        className: 'flex-shrink-0 border-t bg-gray-50 p-4',
        children: i.jsxs('form', {
          onSubmit: at,
          className: 'space-y-3',
          children: [
            i.jsx('div', {
              children: i.jsx('input', {
                type: 'text',
                value: C,
                onChange: (p) => K(p.target.value),
                placeholder: 'Your name',
                className:
                  'w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
                maxLength: 50,
              }),
            }),
            i.jsxs('div', {
              className: 'flex space-x-2',
              children: [
                i.jsx('textarea', {
                  value: d,
                  onChange: (p) => w(p.target.value),
                  onKeyPress: et,
                  placeholder: 'Type your message... (Enter to send, Shift+Enter for new line)',
                  className:
                    'flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none',
                  rows: 2,
                  maxLength: 500,
                }),
                i.jsx('button', {
                  type: 'submit',
                  disabled: !d.trim() || !C.trim() || B,
                  className: `px-4 py-2 text-sm font-medium rounded-lg transition-colors ${!d.trim() || !C.trim() || B ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`,
                  children: B
                    ? i.jsx('div', { className: 'animate-spin rounded-full h-4 w-4 border-b-2 border-white' })
                    : 'Send',
                }),
              ],
            }),
            i.jsxs('div', {
              className: 'flex justify-between text-xs text-gray-500',
              children: [
                i.jsxs('span', { children: [d.length, '/500 characters'] }),
                i.jsx('span', { children: 'Press Enter to send, Shift+Enter for new line' }),
              ],
            }),
          ],
        }),
      }),
      !Q &&
        i.jsx('div', {
          className: 'flex-shrink-0 bg-yellow-50 border-t border-yellow-200 p-3',
          children: i.jsxs('div', {
            className: 'flex items-center text-yellow-800',
            children: [
              i.jsx('div', { className: 'w-2 h-2 bg-yellow-400 rounded-full mr-2' }),
              i.jsx('span', { className: 'text-sm', children: 'Reconnecting to chat...' }),
            ],
          }),
        }),
    ],
  });
}
function mh({ roomId: b, role: Z }) {
  const [z, d] = A.useState(null),
    [w, C] = A.useState(!1),
    [K, I] = A.useState(null),
    [O, S] = A.useState(!0),
    [B, R] = A.useState(5e3),
    Q = async () => {
      try {
        (C(!0), I(null));
        const p = await fetch(`/api/diagnostics?roomId=${b}&role=${Z}`);
        if (!p.ok) throw new Error(`Failed to fetch diagnostics: ${p.status}`);
        const D = await p.json();
        d(D);
      } catch (p) {
        (console.error('Error fetching diagnostics:', p), I(p.message));
      } finally {
        C(!1);
      }
    };
  A.useEffect(() => {
    if (O && b) {
      Q();
      const p = setInterval(Q, B);
      return () => clearInterval(p);
    }
  }, [O, B, b, Z]);
  const at = () => {
      Q();
    },
    et = (p) => {
      if (p === 0) return '0 Bytes';
      const D = 1024,
        U = ['Bytes', 'KB', 'MB', 'GB'],
        J = Math.floor(Math.log(p) / Math.log(D));
      return `${parseFloat((p / D ** J).toFixed(2))} ${U[J]}`;
    },
    F = (p) => new Date(p).toLocaleString(),
    $ = (p) => {
      switch (p) {
        case 'connected':
          return 'text-green-600';
        case 'connecting':
          return 'text-yellow-600';
        case 'disconnected':
          return 'text-red-600';
        default:
          return 'text-gray-600';
      }
    };
  return i.jsxs('div', {
    className: 'flex flex-col h-full bg-white',
    children: [
      i.jsxs('div', {
        className: 'flex-shrink-0 bg-green-600 text-white p-4',
        children: [
          i.jsxs('div', {
            className: 'flex items-center justify-between',
            children: [
              i.jsx('h3', { className: 'text-lg font-semibold', children: '🔧 Diagnostics' }),
              i.jsx('div', {
                className: 'flex items-center space-x-2',
                children: i.jsx('button', {
                  onClick: at,
                  disabled: w,
                  className: 'px-3 py-1 text-sm bg-green-700 rounded hover:bg-green-800 disabled:opacity-50',
                  children: w ? 'Loading...' : 'Refresh',
                }),
              }),
            ],
          }),
          i.jsxs('p', { className: 'text-green-100 text-sm mt-1', children: ['Room: ', b, ' | Role: ', Z] }),
        ],
      }),
      i.jsx('div', {
        className: 'flex-shrink-0 bg-gray-50 border-b p-3',
        children: i.jsxs('div', {
          className: 'flex items-center justify-between',
          children: [
            i.jsxs('label', {
              className: 'flex items-center space-x-2',
              children: [
                i.jsx('input', {
                  type: 'checkbox',
                  checked: O,
                  onChange: (p) => S(p.target.checked),
                  className: 'rounded',
                }),
                i.jsx('span', { className: 'text-sm text-gray-700', children: 'Auto-refresh' }),
              ],
            }),
            i.jsxs('select', {
              value: B,
              onChange: (p) => R(Number(p.target.value)),
              className: 'text-sm border border-gray-300 rounded px-2 py-1',
              children: [
                i.jsx('option', { value: 1e3, children: '1s' }),
                i.jsx('option', { value: 5e3, children: '5s' }),
                i.jsx('option', { value: 1e4, children: '10s' }),
                i.jsx('option', { value: 3e4, children: '30s' }),
              ],
            }),
          ],
        }),
      }),
      i.jsxs('div', {
        className: 'flex-1 overflow-y-auto p-4',
        children: [
          w &&
            !z &&
            i.jsxs('div', {
              className: 'text-center text-gray-500 py-8',
              children: [
                i.jsx('div', {
                  className: 'animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2',
                }),
                'Loading diagnostics...',
              ],
            }),
          K &&
            i.jsx('div', {
              className: 'bg-red-50 border border-red-200 rounded-lg p-3 mb-4',
              children: i.jsxs('div', { className: 'text-red-600 text-sm', children: ['⚠️ ', K] }),
            }),
          z &&
            i.jsxs('div', {
              className: 'space-y-4',
              children: [
                i.jsxs('div', {
                  className: 'bg-white border border-gray-200 rounded-lg p-4',
                  children: [
                    i.jsx('h4', { className: 'font-semibold text-gray-900 mb-3', children: 'Connection Status' }),
                    i.jsxs('div', {
                      className: 'grid grid-cols-2 gap-4 text-sm',
                      children: [
                        i.jsxs('div', {
                          children: [
                            i.jsx('span', { className: 'text-gray-600', children: 'Status:' }),
                            i.jsx('span', {
                              className: `ml-2 font-medium ${$(z.connectionStatus)}`,
                              children: z.connectionStatus,
                            }),
                          ],
                        }),
                        i.jsxs('div', {
                          children: [
                            i.jsx('span', { className: 'text-gray-600', children: 'Role:' }),
                            i.jsx('span', { className: 'ml-2 font-medium', children: z.role }),
                          ],
                        }),
                        i.jsxs('div', {
                          children: [
                            i.jsx('span', { className: 'text-gray-600', children: 'Room ID:' }),
                            i.jsx('span', { className: 'ml-2 font-mono text-xs', children: z.roomId }),
                          ],
                        }),
                        i.jsxs('div', {
                          children: [
                            i.jsx('span', { className: 'text-gray-600', children: 'Last Updated:' }),
                            i.jsx('span', { className: 'ml-2 text-xs', children: F(z.timestamp) }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
                z.webrtc &&
                  i.jsxs('div', {
                    className: 'bg-white border border-gray-200 rounded-lg p-4',
                    children: [
                      i.jsx('h4', { className: 'font-semibold text-gray-900 mb-3', children: 'WebRTC Statistics' }),
                      i.jsxs('div', {
                        className: 'space-y-2 text-sm',
                        children: [
                          i.jsxs('div', {
                            className: 'grid grid-cols-2 gap-4',
                            children: [
                              i.jsxs('div', {
                                children: [
                                  i.jsx('span', { className: 'text-gray-600', children: 'ICE Connection State:' }),
                                  i.jsx('span', {
                                    className: `ml-2 font-medium ${$(z.webrtc.iceConnectionState)}`,
                                    children: z.webrtc.iceConnectionState,
                                  }),
                                ],
                              }),
                              i.jsxs('div', {
                                children: [
                                  i.jsx('span', { className: 'text-gray-600', children: 'Signaling State:' }),
                                  i.jsx('span', { className: 'ml-2 font-medium', children: z.webrtc.signalingState }),
                                ],
                              }),
                            ],
                          }),
                          z.webrtc.stats &&
                            i.jsxs('div', {
                              className: 'mt-3',
                              children: [
                                i.jsx('h5', {
                                  className: 'font-medium text-gray-800 mb-2',
                                  children: 'Connection Stats',
                                }),
                                i.jsxs('div', {
                                  className: 'grid grid-cols-2 gap-4 text-xs',
                                  children: [
                                    i.jsxs('div', {
                                      children: [
                                        i.jsx('span', { className: 'text-gray-600', children: 'Bytes Sent:' }),
                                        i.jsx('span', {
                                          className: 'ml-2 font-mono',
                                          children: et(z.webrtc.stats.bytesSent || 0),
                                        }),
                                      ],
                                    }),
                                    i.jsxs('div', {
                                      children: [
                                        i.jsx('span', { className: 'text-gray-600', children: 'Bytes Received:' }),
                                        i.jsx('span', {
                                          className: 'ml-2 font-mono',
                                          children: et(z.webrtc.stats.bytesReceived || 0),
                                        }),
                                      ],
                                    }),
                                    i.jsxs('div', {
                                      children: [
                                        i.jsx('span', { className: 'text-gray-600', children: 'Packets Sent:' }),
                                        i.jsx('span', {
                                          className: 'ml-2 font-mono',
                                          children: z.webrtc.stats.packetsSent || 0,
                                        }),
                                      ],
                                    }),
                                    i.jsxs('div', {
                                      children: [
                                        i.jsx('span', { className: 'text-gray-600', children: 'Packets Received:' }),
                                        i.jsx('span', {
                                          className: 'ml-2 font-mono',
                                          children: z.webrtc.stats.packetsReceived || 0,
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                              ],
                            }),
                        ],
                      }),
                    ],
                  }),
                i.jsxs('div', {
                  className: 'bg-white border border-gray-200 rounded-lg p-4',
                  children: [
                    i.jsx('h4', { className: 'font-semibold text-gray-900 mb-3', children: 'Browser Information' }),
                    i.jsxs('div', {
                      className: 'grid grid-cols-2 gap-4 text-sm',
                      children: [
                        i.jsxs('div', {
                          children: [
                            i.jsx('span', { className: 'text-gray-600', children: 'User Agent:' }),
                            i.jsx('span', { className: 'ml-2 text-xs font-mono', children: z.browser?.userAgent }),
                          ],
                        }),
                        i.jsxs('div', {
                          children: [
                            i.jsx('span', { className: 'text-gray-600', children: 'Platform:' }),
                            i.jsx('span', { className: 'ml-2', children: z.browser?.platform }),
                          ],
                        }),
                        i.jsxs('div', {
                          children: [
                            i.jsx('span', { className: 'text-gray-600', children: 'WebRTC Support:' }),
                            i.jsx('span', {
                              className: `ml-2 font-medium ${z.browser?.webrtcSupport ? 'text-green-600' : 'text-red-600'}`,
                              children: z.browser?.webrtcSupport ? 'Yes' : 'No',
                            }),
                          ],
                        }),
                        i.jsxs('div', {
                          children: [
                            i.jsx('span', { className: 'text-gray-600', children: 'Screen Share Support:' }),
                            i.jsx('span', {
                              className: `ml-2 font-medium ${z.browser?.screenShareSupport ? 'text-green-600' : 'text-red-600'}`,
                              children: z.browser?.screenShareSupport ? 'Yes' : 'No',
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
                z.network &&
                  i.jsxs('div', {
                    className: 'bg-white border border-gray-200 rounded-lg p-4',
                    children: [
                      i.jsx('h4', { className: 'font-semibold text-gray-900 mb-3', children: 'Network Information' }),
                      i.jsxs('div', {
                        className: 'space-y-2 text-sm',
                        children: [
                          i.jsxs('div', {
                            className: 'grid grid-cols-2 gap-4',
                            children: [
                              i.jsxs('div', {
                                children: [
                                  i.jsx('span', { className: 'text-gray-600', children: 'Connection Type:' }),
                                  i.jsx('span', { className: 'ml-2', children: z.network.connectionType || 'Unknown' }),
                                ],
                              }),
                              i.jsxs('div', {
                                children: [
                                  i.jsx('span', { className: 'text-gray-600', children: 'Effective Type:' }),
                                  i.jsx('span', { className: 'ml-2', children: z.network.effectiveType || 'Unknown' }),
                                ],
                              }),
                            ],
                          }),
                          i.jsxs('div', {
                            className: 'grid grid-cols-2 gap-4',
                            children: [
                              i.jsxs('div', {
                                children: [
                                  i.jsx('span', { className: 'text-gray-600', children: 'Downlink:' }),
                                  i.jsxs('span', {
                                    className: 'ml-2',
                                    children: [z.network.downlink || 'Unknown', ' Mbps'],
                                  }),
                                ],
                              }),
                              i.jsxs('div', {
                                children: [
                                  i.jsx('span', { className: 'text-gray-600', children: 'RTT:' }),
                                  i.jsxs('span', { className: 'ml-2', children: [z.network.rtt || 'Unknown', ' ms'] }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                z.errors &&
                  z.errors.length > 0 &&
                  i.jsxs('div', {
                    className: 'bg-red-50 border border-red-200 rounded-lg p-4',
                    children: [
                      i.jsx('h4', { className: 'font-semibold text-red-900 mb-3', children: 'Recent Errors' }),
                      i.jsx('div', {
                        className: 'space-y-2',
                        children: z.errors.map((p, D) =>
                          i.jsxs(
                            'div',
                            {
                              className: 'text-sm text-red-800',
                              children: [
                                i.jsx('div', { className: 'font-medium', children: p.message }),
                                i.jsx('div', { className: 'text-xs text-red-600 mt-1', children: F(p.timestamp) }),
                              ],
                            },
                            D
                          )
                        ),
                      }),
                    ],
                  }),
              ],
            }),
          !z &&
            !w &&
            !K &&
            i.jsxs('div', {
              className: 'text-center text-gray-500 py-8',
              children: [
                i.jsx('div', { className: 'text-4xl mb-2', children: '🔧' }),
                i.jsx('p', { children: 'No diagnostics data available' }),
                i.jsx('p', { className: 'text-sm', children: 'Click refresh to load diagnostics' }),
              ],
            }),
        ],
      }),
    ],
  });
}
function hh() {
  const [b, Z] = A.useState('home'),
    [z, d] = A.useState(''),
    [w, C] = A.useState(''),
    [K, I] = A.useState(!1),
    [O, S] = A.useState(!1),
    { config: B, loading: R, error: Q } = Ad(),
    at = A.useMemo(() => {
      const p = Array.from({ length: 50 }, (J, ut) => ({
          id: ut,
          left: Math.random() * 100,
          top: Math.random() * 100,
          delay: Math.random() * 3,
          duration: 2 + Math.random() * 2,
        })),
        D = Array.from({ length: 20 }, (J, ut) => ({ id: ut, top: ut * 8, delay: ut * 0.1 })),
        U = Array.from({ length: 15 }, (J, ut) => ({ id: ut, left: ut * 8, delay: ut * 0.2 }));
      return { stars: p, gridLines: D, gridColumns: U };
    }, []);
  A.useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.has('room')) {
      const D = p.get('room');
      (d(D), Z('viewer'));
    }
  }, []);
  const et = async () => {
      try {
        const p = await fetch('/api/create-room', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...(B?.authSecret && { 'x-auth-secret': B.authSecret }) },
        });
        if (!p.ok) throw new Error(`Failed to create room: ${p.status}`);
        const D = await p.json();
        (d(D.roomId), Z('host'));
      } catch (p) {
        (console.error('Error creating room:', p), alert('Failed to create room. Please try again.'));
      }
    },
    F = () => {
      if (!z.trim()) {
        alert('Please enter a room ID');
        return;
      }
      Z('viewer');
    },
    $ = () => {
      (Z('home'), d(''), C(''), I(!1), S(!1));
    };
  return R
    ? i.jsx('div', {
        className: 'min-h-screen bg-gray-100 flex items-center justify-center',
        children: i.jsxs('div', {
          className: 'text-center',
          children: [
            i.jsx('div', { className: 'animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4' }),
            i.jsx('p', { className: 'text-gray-600', children: 'Loading configuration...' }),
          ],
        }),
      })
    : Q
      ? i.jsx('div', {
          className: 'min-h-screen bg-gray-100 flex items-center justify-center',
          children: i.jsxs('div', {
            className: 'text-center',
            children: [
              i.jsx('div', { className: 'text-red-600 text-xl mb-4', children: '⚠️ Configuration Error' }),
              i.jsx('p', { className: 'text-gray-600 mb-4', children: 'Failed to load application configuration.' }),
              i.jsx('button', {
                onClick: () => window.location.reload(),
                className: 'bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700',
                children: 'Retry',
              }),
            ],
          }),
        })
      : i.jsxs('div', {
          className: 'min-h-screen relative overflow-hidden',
          children: [
            i.jsxs('div', {
              className: 'fixed inset-0 z-0',
              children: [
                i.jsx('div', {
                  className: 'absolute inset-0 bg-gradient-to-b from-purple-900 via-purple-800 to-indigo-900',
                  children: i.jsx('div', {
                    className: 'absolute inset-0',
                    children: at.stars.map((p) =>
                      i.jsx(
                        'div',
                        {
                          className: 'absolute w-1 h-1 bg-white rounded-full animate-pulse',
                          style: {
                            left: `${p.left}%`,
                            top: `${p.top}%`,
                            animationDelay: `${p.delay}s`,
                            animationDuration: `${p.duration}s`,
                          },
                        },
                        p.id
                      )
                    ),
                  }),
                }),
                i.jsx('div', {
                  className:
                    'absolute top-10 right-10 w-32 h-32 bg-gradient-radial from-yellow-400 via-orange-500 to-red-500 rounded-full blur-xl opacity-80 animate-pulse',
                }),
                i.jsxs('div', {
                  className: 'absolute bottom-0 left-0 right-0 h-64',
                  children: [
                    i.jsx('div', {
                      className:
                        'absolute bottom-0 left-0 w-64 h-48 bg-gradient-to-t from-purple-700 to-purple-500 transform -skew-x-12 opacity-80',
                    }),
                    i.jsx('div', {
                      className:
                        'absolute bottom-0 left-32 w-48 h-36 bg-gradient-to-t from-blue-700 to-blue-500 transform -skew-x-6 opacity-70',
                    }),
                    i.jsx('div', {
                      className:
                        'absolute bottom-0 right-0 w-56 h-52 bg-gradient-to-t from-purple-600 to-purple-400 transform skew-x-12 opacity-75',
                    }),
                    i.jsx('div', {
                      className:
                        'absolute bottom-0 left-0 w-64 h-48 bg-gradient-to-t from-pink-400 to-transparent transform -skew-x-12 opacity-30',
                    }),
                    i.jsx('div', {
                      className:
                        'absolute bottom-0 right-0 w-56 h-52 bg-gradient-to-t from-pink-400 to-transparent transform skew-x-12 opacity-30',
                    }),
                  ],
                }),
                i.jsx('div', {
                  className: 'absolute bottom-0 left-0 right-0 h-32 opacity-40',
                  children: i.jsxs('div', {
                    className: 'relative w-full h-full',
                    children: [
                      at.gridLines.map((p) =>
                        i.jsx(
                          'div',
                          {
                            className:
                              'absolute w-full h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-pulse',
                            style: { top: `${p.top}px`, animationDelay: `${p.delay}s`, animationDuration: '3s' },
                          },
                          p.id
                        )
                      ),
                      at.gridColumns.map((p) =>
                        i.jsx(
                          'div',
                          {
                            className:
                              'absolute h-full w-px bg-gradient-to-b from-transparent via-purple-400 to-transparent animate-pulse',
                            style: { left: `${p.left}%`, animationDelay: `${p.delay}s`, animationDuration: '4s' },
                          },
                          p.id
                        )
                      ),
                    ],
                  }),
                }),
              ],
            }),
            i.jsx('div', {
              className: 'relative z-10 min-h-screen flex items-center justify-center p-4',
              children:
                b === 'home'
                  ? i.jsxs('div', {
                      className: 'w-full max-w-md mx-auto',
                      children: [
                        i.jsx('div', {
                          className: 'text-center mb-8',
                          children: i.jsx('h1', {
                            className:
                              'text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 uppercase tracking-wider drop-shadow-lg',
                            style: {
                              fontFamily: '"Righteous", cursive',
                              textShadow:
                                '0 0 20px rgba(59, 130, 246, 0.5), 0 0 40px rgba(147, 51, 234, 0.5), 0 0 60px rgba(236, 72, 153, 0.5)',
                              fontWeight: '400',
                              fontStyle: 'normal',
                            },
                            children: 'STUPID-SIMPLE SCREEN SHARE',
                          }),
                        }),
                        i.jsxs('div', {
                          className:
                            'bg-purple-900 bg-opacity-30 backdrop-blur-md border border-purple-400 border-opacity-40 rounded-2xl p-6 shadow-2xl',
                          style: {
                            boxShadow:
                              '0 0 30px rgba(147, 51, 234, 0.3), 0 0 60px rgba(59, 130, 246, 0.2), inset 0 0 20px rgba(255, 255, 255, 0.1)',
                          },
                          children: [
                            i.jsxs('div', {
                              className: 'space-y-4 mb-6',
                              children: [
                                i.jsxs('div', {
                                  className: 'grid grid-cols-2 gap-3',
                                  children: [
                                    i.jsx('button', {
                                      onClick: et,
                                      className:
                                        'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-xl text-sm uppercase tracking-wide transition-all duration-300 transform hover:scale-105 shadow-lg',
                                      style: {
                                        boxShadow: '0 0 20px rgba(236, 72, 153, 0.4), 0 0 40px rgba(147, 51, 234, 0.3)',
                                      },
                                      children: 'Start sharing my screen',
                                    }),
                                    i.jsx('button', {
                                      className:
                                        'bg-purple-800 bg-opacity-50 hover:bg-opacity-70 text-white font-bold py-3 px-4 rounded-xl text-sm uppercase tracking-wide transition-all duration-300 border border-purple-400 border-opacity-30',
                                      children: 'Stop sharing',
                                    }),
                                  ],
                                }),
                                i.jsxs('div', {
                                  className: 'grid grid-cols-2 gap-3',
                                  children: [
                                    i.jsx('button', {
                                      className:
                                        'bg-purple-800 bg-opacity-50 hover:bg-opacity-70 text-white font-bold py-3 px-4 rounded-xl text-sm uppercase tracking-wide transition-all duration-300 border border-purple-400 border-opacity-30',
                                      children: 'Start Recording',
                                    }),
                                    i.jsxs('button', {
                                      onClick: () => S(!O),
                                      className:
                                        'bg-purple-800 bg-opacity-50 hover:bg-opacity-70 text-white font-bold py-3 px-4 rounded-xl text-sm uppercase tracking-wide transition-all duration-300 border border-purple-400 border-opacity-30 flex items-center justify-center space-x-2',
                                      children: [
                                        i.jsxs('svg', {
                                          className: 'w-4 h-4',
                                          fill: 'none',
                                          stroke: 'currentColor',
                                          viewBox: '0 0 24 24',
                                          children: [
                                            i.jsx('path', {
                                              strokeLinecap: 'round',
                                              strokeLinejoin: 'round',
                                              strokeWidth: 2,
                                              d: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
                                            }),
                                            i.jsx('path', {
                                              strokeLinecap: 'round',
                                              strokeLinejoin: 'round',
                                              strokeWidth: 2,
                                              d: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z',
                                            }),
                                          ],
                                        }),
                                        i.jsx('span', { children: 'Diagnostics' }),
                                      ],
                                    }),
                                  ],
                                }),
                                i.jsxs('div', {
                                  className: 'grid grid-cols-2 gap-3',
                                  children: [
                                    i.jsx('button', {
                                      onClick: F,
                                      className:
                                        'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-3 px-4 rounded-xl text-sm uppercase tracking-wide transition-all duration-300 transform hover:scale-105 shadow-lg',
                                      style: {
                                        boxShadow: '0 0 20px rgba(59, 130, 246, 0.4), 0 0 40px rgba(6, 182, 212, 0.3)',
                                      },
                                      children: 'Open room link (viewer)',
                                    }),
                                    i.jsx('input', {
                                      type: 'text',
                                      placeholder: 'Paste room id here',
                                      value: z,
                                      onChange: (p) => d(p.target.value),
                                      className:
                                        'bg-purple-800 bg-opacity-50 hover:bg-opacity-70 text-white placeholder-gray-300 font-bold py-3 px-4 rounded-xl text-sm uppercase tracking-wide transition-all duration-300 border border-purple-400 border-opacity-30 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50',
                                    }),
                                  ],
                                }),
                              ],
                            }),
                            i.jsx('div', {
                              className: 'text-center mb-6',
                              children: i.jsx('p', {
                                className: 'text-white text-sm font-medium',
                                children: 'Status: idle',
                              }),
                            }),
                            i.jsxs('div', {
                              className: 'space-y-6',
                              children: [
                                i.jsxs('div', {
                                  children: [
                                    i.jsx('h3', {
                                      className: 'text-white text-sm font-bold mb-3 uppercase tracking-wide',
                                      children: 'Local preview',
                                    }),
                                    i.jsxs('div', {
                                      className: 'grid grid-cols-2 gap-3',
                                      children: [
                                        i.jsxs('div', {
                                          className:
                                            'bg-purple-800 bg-opacity-40 border border-purple-400 border-opacity-30 rounded-xl p-3 flex flex-col items-center justify-center min-h-[120px]',
                                          children: [
                                            i.jsxs('div', {
                                              className: 'flex items-center space-x-2 mb-2',
                                              children: [
                                                i.jsx('svg', {
                                                  className: 'w-4 h-4 text-white',
                                                  fill: 'currentColor',
                                                  viewBox: '0 0 24 24',
                                                  children: i.jsx('path', { d: 'M8 5v14l11-7z' }),
                                                }),
                                                i.jsx('span', { className: 'text-white text-xs', children: '0:00' }),
                                              ],
                                            }),
                                            i.jsxs('div', {
                                              className: 'flex items-center space-x-2 mb-2',
                                              children: [
                                                i.jsx('svg', {
                                                  className: 'w-4 h-4 text-white',
                                                  fill: 'none',
                                                  stroke: 'currentColor',
                                                  viewBox: '0 0 24 24',
                                                  children: i.jsx('path', {
                                                    strokeLinecap: 'round',
                                                    strokeLinejoin: 'round',
                                                    strokeWidth: 2,
                                                    d: 'M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z',
                                                  }),
                                                }),
                                                i.jsx('svg', {
                                                  className: 'w-4 h-4 text-white',
                                                  fill: 'none',
                                                  stroke: 'currentColor',
                                                  viewBox: '0 0 24 24',
                                                  children: i.jsx('path', {
                                                    strokeLinecap: 'round',
                                                    strokeLinejoin: 'round',
                                                    strokeWidth: 2,
                                                    d: 'M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z',
                                                  }),
                                                }),
                                              ],
                                            }),
                                            i.jsx('div', { className: 'w-full h-0.5 bg-white bg-opacity-30 rounded' }),
                                          ],
                                        }),
                                        i.jsxs('div', {
                                          className:
                                            'bg-purple-800 bg-opacity-40 border border-purple-400 border-opacity-30 rounded-xl p-3 flex flex-col items-center justify-center min-h-[120px]',
                                          children: [
                                            i.jsxs('div', {
                                              className: 'flex items-center space-x-2 mb-2',
                                              children: [
                                                i.jsx('svg', {
                                                  className: 'w-4 h-4 text-white',
                                                  fill: 'currentColor',
                                                  viewBox: '0 0 24 24',
                                                  children: i.jsx('path', { d: 'M8 5v14l11-7z' }),
                                                }),
                                                i.jsx('span', { className: 'text-white text-xs', children: '0:00' }),
                                              ],
                                            }),
                                            i.jsxs('div', {
                                              className: 'flex items-center space-x-2 mb-2',
                                              children: [
                                                i.jsx('svg', {
                                                  className: 'w-4 h-4 text-white',
                                                  fill: 'none',
                                                  stroke: 'currentColor',
                                                  viewBox: '0 0 24 24',
                                                  children: i.jsx('path', {
                                                    strokeLinecap: 'round',
                                                    strokeLinejoin: 'round',
                                                    strokeWidth: 2,
                                                    d: 'M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z',
                                                  }),
                                                }),
                                                i.jsx('svg', {
                                                  className: 'w-4 h-4 text-white',
                                                  fill: 'none',
                                                  stroke: 'currentColor',
                                                  viewBox: '0 0 24 24',
                                                  children: i.jsx('path', {
                                                    strokeLinecap: 'round',
                                                    strokeLinejoin: 'round',
                                                    strokeWidth: 2,
                                                    d: 'M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z',
                                                  }),
                                                }),
                                              ],
                                            }),
                                            i.jsx('div', { className: 'w-full h-0.5 bg-white bg-opacity-30 rounded' }),
                                          ],
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                                i.jsxs('div', {
                                  children: [
                                    i.jsx('h3', {
                                      className: 'text-white text-sm font-bold mb-3 uppercase tracking-wide',
                                      children: 'Remote preview',
                                    }),
                                    i.jsx('div', {
                                      className:
                                        'bg-purple-800 bg-opacity-40 border border-purple-400 border-opacity-30 rounded-xl p-8 flex items-center justify-center min-h-[120px]',
                                      children: i.jsx('p', {
                                        className: 'text-white text-sm opacity-60',
                                        children: 'No remote connection',
                                      }),
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    })
                  : i.jsxs('div', {
                      className: 'w-full max-w-7xl mx-auto',
                      children: [
                        i.jsx('header', {
                          className:
                            'bg-black bg-opacity-30 backdrop-blur-sm border-b border-purple-500 border-opacity-30 mb-8',
                          children: i.jsx('div', {
                            className: 'px-4 sm:px-6 lg:px-8',
                            children: i.jsxs('div', {
                              className: 'flex justify-between items-center h-16',
                              children: [
                                i.jsxs('div', {
                                  className: 'flex items-center',
                                  children: [
                                    i.jsx('h1', {
                                      className: 'text-xl font-semibold text-white',
                                      children: 'Stupid Simple Screen Share',
                                    }),
                                    b !== 'home' &&
                                      i.jsxs('span', {
                                        className: 'ml-4 text-sm text-purple-300',
                                        children: ['Room: ', z],
                                      }),
                                  ],
                                }),
                                i.jsx('div', {
                                  className: 'flex items-center space-x-4',
                                  children:
                                    b !== 'home' &&
                                    i.jsxs(i.Fragment, {
                                      children: [
                                        i.jsx('button', {
                                          onClick: () => I(!K),
                                          className: `px-3 py-1 text-sm rounded transition-all ${K ? 'bg-blue-600 text-white shadow-lg shadow-blue-500 shadow-opacity-50' : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'}`,
                                          children: 'Chat',
                                        }),
                                        i.jsx('button', {
                                          onClick: () => S(!O),
                                          className: `px-3 py-1 text-sm rounded transition-all ${O ? 'bg-green-600 text-white shadow-lg shadow-green-500 shadow-opacity-50' : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'}`,
                                          children: 'Diagnostics',
                                        }),
                                        i.jsx('button', {
                                          onClick: $,
                                          className:
                                            'px-3 py-1 text-sm bg-white bg-opacity-20 text-white rounded hover:bg-opacity-30 transition-all',
                                          children: 'Home',
                                        }),
                                      ],
                                    }),
                                }),
                              ],
                            }),
                          }),
                        }),
                        i.jsxs('main', {
                          className: 'px-4 sm:px-6 lg:px-8',
                          children: [
                            b === 'host' && i.jsx(fh, { roomId: z, config: B, onGoHome: $ }),
                            b === 'viewer' &&
                              i.jsx(rh, { roomId: z, viewerId: w, setViewerId: C, config: B, onGoHome: $ }),
                          ],
                        }),
                        K &&
                          b !== 'home' &&
                          i.jsx('div', {
                            className:
                              'fixed right-0 top-16 bottom-0 w-80 bg-black bg-opacity-80 backdrop-blur-sm shadow-lg border-l border-purple-500 border-opacity-30 z-50',
                            children: i.jsx(dh, { roomId: z, role: b === 'host' ? 'host' : 'viewer', viewerId: w }),
                          }),
                        O &&
                          b !== 'home' &&
                          i.jsx('div', {
                            className:
                              'fixed left-0 top-16 bottom-0 w-80 bg-black bg-opacity-80 backdrop-blur-sm shadow-lg border-r border-purple-500 border-opacity-30 z-50',
                            children: i.jsx(mh, { roomId: z, role: b === 'host' ? 'host' : 'viewer' }),
                          }),
                      ],
                    }),
            }),
          ],
        });
}
sh.createRoot(document.getElementById('root')).render(i.jsx(th.StrictMode, { children: i.jsx(hh, {}) }));
//# sourceMappingURL=main-CEyrRaPV.js.map
