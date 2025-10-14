const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f || (m.f = ['assets/HostView-NSlyEnKb.js', 'assets/useWebRTC-DWdJ4QII.js', 'assets/ViewerView-C_jMyvY1.js'])
) => i.map((i) => d[i]);
(function () {
  const _ = document.createElement('link').relList;
  if (_ && _.supports && _.supports('modulepreload')) return;
  for (const Y of document.querySelectorAll('link[rel="modulepreload"]')) r(Y);
  new MutationObserver((Y) => {
    for (const J of Y)
      if (J.type === 'childList')
        for (const $ of J.addedNodes) $.tagName === 'LINK' && $.rel === 'modulepreload' && r($);
  }).observe(document, { childList: !0, subtree: !0 });
  function M(Y) {
    const J = {};
    return (
      Y.integrity && (J.integrity = Y.integrity),
      Y.referrerPolicy && (J.referrerPolicy = Y.referrerPolicy),
      Y.crossOrigin === 'use-credentials'
        ? (J.credentials = 'include')
        : Y.crossOrigin === 'anonymous'
          ? (J.credentials = 'omit')
          : (J.credentials = 'same-origin'),
      J
    );
  }
  function r(Y) {
    if (Y.ep) return;
    Y.ep = !0;
    const J = M(Y);
    fetch(Y.href, J);
  }
})();
function C0(z) {
  return z && z.__esModule && Object.prototype.hasOwnProperty.call(z, 'default') ? z.default : z;
}
var rf = { exports: {} },
  zu = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var z0;
function ah() {
  if (z0) return zu;
  z0 = 1;
  var z = Symbol.for('react.transitional.element'),
    _ = Symbol.for('react.fragment');
  function M(r, Y, J) {
    var $ = null;
    if ((J !== void 0 && ($ = '' + J), Y.key !== void 0 && ($ = '' + Y.key), 'key' in Y)) {
      J = {};
      for (var it in Y) it !== 'key' && (J[it] = Y[it]);
    } else J = Y;
    return ((Y = J.ref), { $$typeof: z, type: r, key: $, ref: Y !== void 0 ? Y : null, props: J });
  }
  return ((zu.Fragment = _), (zu.jsx = M), (zu.jsxs = M), zu);
}
var T0;
function uh() {
  return (T0 || ((T0 = 1), (rf.exports = ah())), rf.exports);
}
var A = uh(),
  df = { exports: {} },
  L = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var A0;
function nh() {
  if (A0) return L;
  A0 = 1;
  var z = Symbol.for('react.transitional.element'),
    _ = Symbol.for('react.portal'),
    M = Symbol.for('react.fragment'),
    r = Symbol.for('react.strict_mode'),
    Y = Symbol.for('react.profiler'),
    J = Symbol.for('react.consumer'),
    $ = Symbol.for('react.context'),
    it = Symbol.for('react.forward_ref'),
    j = Symbol.for('react.suspense'),
    p = Symbol.for('react.memo'),
    Z = Symbol.for('react.lazy'),
    R = Symbol.for('react.activity'),
    W = Symbol.iterator;
  function jt(o) {
    return o === null || typeof o != 'object'
      ? null
      : ((o = (W && o[W]) || o['@@iterator']), typeof o == 'function' ? o : null);
  }
  var Et = {
      isMounted: function () {
        return !1;
      },
      enqueueForceUpdate: function () {},
      enqueueReplaceState: function () {},
      enqueueSetState: function () {},
    },
    Ct = Object.assign,
    tl = {};
  function Q(o, T, O) {
    ((this.props = o), (this.context = T), (this.refs = tl), (this.updater = O || Et));
  }
  ((Q.prototype.isReactComponent = {}),
    (Q.prototype.setState = function (o, T) {
      if (typeof o != 'object' && typeof o != 'function' && o != null)
        throw Error(
          'takes an object of state variables to update or a function which returns an object of state variables.'
        );
      this.updater.enqueueSetState(this, o, T, 'setState');
    }),
    (Q.prototype.forceUpdate = function (o) {
      this.updater.enqueueForceUpdate(this, o, 'forceUpdate');
    }));
  function X() {}
  X.prototype = Q.prototype;
  function D(o, T, O) {
    ((this.props = o), (this.context = T), (this.refs = tl), (this.updater = O || Et));
  }
  var U = (D.prototype = new X());
  ((U.constructor = D), Ct(U, Q.prototype), (U.isPureReactComponent = !0));
  var zt = Array.isArray;
  function Rt() {}
  var k = { H: null, A: null, T: null, S: null },
    St = Object.prototype.hasOwnProperty;
  function _l(o, T, O) {
    var C = O.ref;
    return { $$typeof: z, type: o, key: T, ref: C !== void 0 ? C : null, props: O };
  }
  function Ze(o, T) {
    return _l(o.type, T, o.props);
  }
  function Ml(o) {
    return typeof o == 'object' && o !== null && o.$$typeof === z;
  }
  function Kt(o) {
    var T = { '=': '=0', ':': '=2' };
    return (
      '$' +
      o.replace(/[=:]/g, function (O) {
        return T[O];
      })
    );
  }
  var ze = /\/+/g;
  function Ul(o, T) {
    return typeof o == 'object' && o !== null && o.key != null ? Kt('' + o.key) : T.toString(36);
  }
  function El(o) {
    switch (o.status) {
      case 'fulfilled':
        return o.value;
      case 'rejected':
        throw o.reason;
      default:
        switch (
          (typeof o.status == 'string'
            ? o.then(Rt, Rt)
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
  function b(o, T, O, C, V) {
    var F = typeof o;
    (F === 'undefined' || F === 'boolean') && (o = null);
    var ct = !1;
    if (o === null) ct = !0;
    else
      switch (F) {
        case 'bigint':
        case 'string':
        case 'number':
          ct = !0;
          break;
        case 'object':
          switch (o.$$typeof) {
            case z:
            case _:
              ct = !0;
              break;
            case Z:
              return ((ct = o._init), b(ct(o._payload), T, O, C, V));
          }
      }
    if (ct)
      return (
        (V = V(o)),
        (ct = C === '' ? '.' + Ul(o, 0) : C),
        zt(V)
          ? ((O = ''),
            ct != null && (O = ct.replace(ze, '$&/') + '/'),
            b(V, T, O, '', function (Da) {
              return Da;
            }))
          : V != null &&
            (Ml(V) &&
              (V = Ze(
                V,
                O + (V.key == null || (o && o.key === V.key) ? '' : ('' + V.key).replace(ze, '$&/') + '/') + ct
              )),
            T.push(V)),
        1
      );
    ct = 0;
    var Vt = C === '' ? '.' : C + ':';
    if (zt(o)) for (var _t = 0; _t < o.length; _t++) ((C = o[_t]), (F = Vt + Ul(C, _t)), (ct += b(C, T, O, F, V)));
    else if (((_t = jt(o)), typeof _t == 'function'))
      for (o = _t.call(o), _t = 0; !(C = o.next()).done; )
        ((C = C.value), (F = Vt + Ul(C, _t++)), (ct += b(C, T, O, F, V)));
    else if (F === 'object') {
      if (typeof o.then == 'function') return b(El(o), T, O, C, V);
      throw (
        (T = String(o)),
        Error(
          'Objects are not valid as a React child (found: ' +
            (T === '[object Object]' ? 'object with keys {' + Object.keys(o).join(', ') + '}' : T) +
            '). If you meant to render a collection of children, use an array instead.'
        )
      );
    }
    return ct;
  }
  function x(o, T, O) {
    if (o == null) return o;
    var C = [],
      V = 0;
    return (
      b(o, C, '', '', function (F) {
        return T.call(O, F, V++);
      }),
      C
    );
  }
  function G(o) {
    if (o._status === -1) {
      var T = o._result;
      ((T = T()),
        T.then(
          function (O) {
            (o._status === 0 || o._status === -1) && ((o._status = 1), (o._result = O));
          },
          function (O) {
            (o._status === 0 || o._status === -1) && ((o._status = 2), (o._result = O));
          }
        ),
        o._status === -1 && ((o._status = 0), (o._result = T)));
    }
    if (o._status === 1) return o._result.default;
    throw o._result;
  }
  var rt =
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
      map: x,
      forEach: function (o, T, O) {
        x(
          o,
          function () {
            T.apply(this, arguments);
          },
          O
        );
      },
      count: function (o) {
        var T = 0;
        return (
          x(o, function () {
            T++;
          }),
          T
        );
      },
      toArray: function (o) {
        return (
          x(o, function (T) {
            return T;
          }) || []
        );
      },
      only: function (o) {
        if (!Ml(o)) throw Error('React.Children.only expected to receive a single React element child.');
        return o;
      },
    };
  return (
    (L.Activity = R),
    (L.Children = yt),
    (L.Component = Q),
    (L.Fragment = M),
    (L.Profiler = Y),
    (L.PureComponent = D),
    (L.StrictMode = r),
    (L.Suspense = j),
    (L.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = k),
    (L.__COMPILER_RUNTIME = {
      __proto__: null,
      c: function (o) {
        return k.H.useMemoCache(o);
      },
    }),
    (L.cache = function (o) {
      return function () {
        return o.apply(null, arguments);
      };
    }),
    (L.cacheSignal = function () {
      return null;
    }),
    (L.cloneElement = function (o, T, O) {
      if (o == null) throw Error('The argument must be a React element, but you passed ' + o + '.');
      var C = Ct({}, o.props),
        V = o.key;
      if (T != null)
        for (F in (T.key !== void 0 && (V = '' + T.key), T))
          !St.call(T, F) ||
            F === 'key' ||
            F === '__self' ||
            F === '__source' ||
            (F === 'ref' && T.ref === void 0) ||
            (C[F] = T[F]);
      var F = arguments.length - 2;
      if (F === 1) C.children = O;
      else if (1 < F) {
        for (var ct = Array(F), Vt = 0; Vt < F; Vt++) ct[Vt] = arguments[Vt + 2];
        C.children = ct;
      }
      return _l(o.type, V, C);
    }),
    (L.createContext = function (o) {
      return (
        (o = { $$typeof: $, _currentValue: o, _currentValue2: o, _threadCount: 0, Provider: null, Consumer: null }),
        (o.Provider = o),
        (o.Consumer = { $$typeof: J, _context: o }),
        o
      );
    }),
    (L.createElement = function (o, T, O) {
      var C,
        V = {},
        F = null;
      if (T != null)
        for (C in (T.key !== void 0 && (F = '' + T.key), T))
          St.call(T, C) && C !== 'key' && C !== '__self' && C !== '__source' && (V[C] = T[C]);
      var ct = arguments.length - 2;
      if (ct === 1) V.children = O;
      else if (1 < ct) {
        for (var Vt = Array(ct), _t = 0; _t < ct; _t++) Vt[_t] = arguments[_t + 2];
        V.children = Vt;
      }
      if (o && o.defaultProps) for (C in ((ct = o.defaultProps), ct)) V[C] === void 0 && (V[C] = ct[C]);
      return _l(o, F, V);
    }),
    (L.createRef = function () {
      return { current: null };
    }),
    (L.forwardRef = function (o) {
      return { $$typeof: it, render: o };
    }),
    (L.isValidElement = Ml),
    (L.lazy = function (o) {
      return { $$typeof: Z, _payload: { _status: -1, _result: o }, _init: G };
    }),
    (L.memo = function (o, T) {
      return { $$typeof: p, type: o, compare: T === void 0 ? null : T };
    }),
    (L.startTransition = function (o) {
      var T = k.T,
        O = {};
      k.T = O;
      try {
        var C = o(),
          V = k.S;
        (V !== null && V(O, C), typeof C == 'object' && C !== null && typeof C.then == 'function' && C.then(Rt, rt));
      } catch (F) {
        rt(F);
      } finally {
        (T !== null && O.types !== null && (T.types = O.types), (k.T = T));
      }
    }),
    (L.unstable_useCacheRefresh = function () {
      return k.H.useCacheRefresh();
    }),
    (L.use = function (o) {
      return k.H.use(o);
    }),
    (L.useActionState = function (o, T, O) {
      return k.H.useActionState(o, T, O);
    }),
    (L.useCallback = function (o, T) {
      return k.H.useCallback(o, T);
    }),
    (L.useContext = function (o) {
      return k.H.useContext(o);
    }),
    (L.useDebugValue = function () {}),
    (L.useDeferredValue = function (o, T) {
      return k.H.useDeferredValue(o, T);
    }),
    (L.useEffect = function (o, T) {
      return k.H.useEffect(o, T);
    }),
    (L.useEffectEvent = function (o) {
      return k.H.useEffectEvent(o);
    }),
    (L.useId = function () {
      return k.H.useId();
    }),
    (L.useImperativeHandle = function (o, T, O) {
      return k.H.useImperativeHandle(o, T, O);
    }),
    (L.useInsertionEffect = function (o, T) {
      return k.H.useInsertionEffect(o, T);
    }),
    (L.useLayoutEffect = function (o, T) {
      return k.H.useLayoutEffect(o, T);
    }),
    (L.useMemo = function (o, T) {
      return k.H.useMemo(o, T);
    }),
    (L.useOptimistic = function (o, T) {
      return k.H.useOptimistic(o, T);
    }),
    (L.useReducer = function (o, T, O) {
      return k.H.useReducer(o, T, O);
    }),
    (L.useRef = function (o) {
      return k.H.useRef(o);
    }),
    (L.useState = function (o) {
      return k.H.useState(o);
    }),
    (L.useSyncExternalStore = function (o, T, O) {
      return k.H.useSyncExternalStore(o, T, O);
    }),
    (L.useTransition = function () {
      return k.H.useTransition();
    }),
    (L.version = '19.2.0'),
    L
  );
}
var _0;
function Sf() {
  return (_0 || ((_0 = 1), (df.exports = nh())), df.exports);
}
var ft = Sf();
const ih = C0(ft);
var mf = { exports: {} },
  Tu = {},
  hf = { exports: {} },
  yf = {};
/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var M0;
function ch() {
  return (
    M0 ||
      ((M0 = 1),
      (function (z) {
        function _(b, x) {
          var G = b.length;
          b.push(x);
          t: for (; 0 < G; ) {
            var rt = (G - 1) >>> 1,
              yt = b[rt];
            if (0 < Y(yt, x)) ((b[rt] = x), (b[G] = yt), (G = rt));
            else break t;
          }
        }
        function M(b) {
          return b.length === 0 ? null : b[0];
        }
        function r(b) {
          if (b.length === 0) return null;
          var x = b[0],
            G = b.pop();
          if (G !== x) {
            b[0] = G;
            t: for (var rt = 0, yt = b.length, o = yt >>> 1; rt < o; ) {
              var T = 2 * (rt + 1) - 1,
                O = b[T],
                C = T + 1,
                V = b[C];
              if (0 > Y(O, G))
                C < yt && 0 > Y(V, O) ? ((b[rt] = V), (b[C] = G), (rt = C)) : ((b[rt] = O), (b[T] = G), (rt = T));
              else if (C < yt && 0 > Y(V, G)) ((b[rt] = V), (b[C] = G), (rt = C));
              else break t;
            }
          }
          return x;
        }
        function Y(b, x) {
          var G = b.sortIndex - x.sortIndex;
          return G !== 0 ? G : b.id - x.id;
        }
        if (((z.unstable_now = void 0), typeof performance == 'object' && typeof performance.now == 'function')) {
          var J = performance;
          z.unstable_now = function () {
            return J.now();
          };
        } else {
          var $ = Date,
            it = $.now();
          z.unstable_now = function () {
            return $.now() - it;
          };
        }
        var j = [],
          p = [],
          Z = 1,
          R = null,
          W = 3,
          jt = !1,
          Et = !1,
          Ct = !1,
          tl = !1,
          Q = typeof setTimeout == 'function' ? setTimeout : null,
          X = typeof clearTimeout == 'function' ? clearTimeout : null,
          D = typeof setImmediate < 'u' ? setImmediate : null;
        function U(b) {
          for (var x = M(p); x !== null; ) {
            if (x.callback === null) r(p);
            else if (x.startTime <= b) (r(p), (x.sortIndex = x.expirationTime), _(j, x));
            else break;
            x = M(p);
          }
        }
        function zt(b) {
          if (((Ct = !1), U(b), !Et))
            if (M(j) !== null) ((Et = !0), Rt || ((Rt = !0), Kt()));
            else {
              var x = M(p);
              x !== null && El(zt, x.startTime - b);
            }
        }
        var Rt = !1,
          k = -1,
          St = 5,
          _l = -1;
        function Ze() {
          return tl ? !0 : !(z.unstable_now() - _l < St);
        }
        function Ml() {
          if (((tl = !1), Rt)) {
            var b = z.unstable_now();
            _l = b;
            var x = !0;
            try {
              t: {
                ((Et = !1), Ct && ((Ct = !1), X(k), (k = -1)), (jt = !0));
                var G = W;
                try {
                  l: {
                    for (U(b), R = M(j); R !== null && !(R.expirationTime > b && Ze()); ) {
                      var rt = R.callback;
                      if (typeof rt == 'function') {
                        ((R.callback = null), (W = R.priorityLevel));
                        var yt = rt(R.expirationTime <= b);
                        if (((b = z.unstable_now()), typeof yt == 'function')) {
                          ((R.callback = yt), U(b), (x = !0));
                          break l;
                        }
                        (R === M(j) && r(j), U(b));
                      } else r(j);
                      R = M(j);
                    }
                    if (R !== null) x = !0;
                    else {
                      var o = M(p);
                      (o !== null && El(zt, o.startTime - b), (x = !1));
                    }
                  }
                  break t;
                } finally {
                  ((R = null), (W = G), (jt = !1));
                }
                x = void 0;
              }
            } finally {
              x ? Kt() : (Rt = !1);
            }
          }
        }
        var Kt;
        if (typeof D == 'function')
          Kt = function () {
            D(Ml);
          };
        else if (typeof MessageChannel < 'u') {
          var ze = new MessageChannel(),
            Ul = ze.port2;
          ((ze.port1.onmessage = Ml),
            (Kt = function () {
              Ul.postMessage(null);
            }));
        } else
          Kt = function () {
            Q(Ml, 0);
          };
        function El(b, x) {
          k = Q(function () {
            b(z.unstable_now());
          }, x);
        }
        ((z.unstable_IdlePriority = 5),
          (z.unstable_ImmediatePriority = 1),
          (z.unstable_LowPriority = 4),
          (z.unstable_NormalPriority = 3),
          (z.unstable_Profiling = null),
          (z.unstable_UserBlockingPriority = 2),
          (z.unstable_cancelCallback = function (b) {
            b.callback = null;
          }),
          (z.unstable_forceFrameRate = function (b) {
            0 > b || 125 < b
              ? console.error(
                  'forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported'
                )
              : (St = 0 < b ? Math.floor(1e3 / b) : 5);
          }),
          (z.unstable_getCurrentPriorityLevel = function () {
            return W;
          }),
          (z.unstable_next = function (b) {
            switch (W) {
              case 1:
              case 2:
              case 3:
                var x = 3;
                break;
              default:
                x = W;
            }
            var G = W;
            W = x;
            try {
              return b();
            } finally {
              W = G;
            }
          }),
          (z.unstable_requestPaint = function () {
            tl = !0;
          }),
          (z.unstable_runWithPriority = function (b, x) {
            switch (b) {
              case 1:
              case 2:
              case 3:
              case 4:
              case 5:
                break;
              default:
                b = 3;
            }
            var G = W;
            W = b;
            try {
              return x();
            } finally {
              W = G;
            }
          }),
          (z.unstable_scheduleCallback = function (b, x, G) {
            var rt = z.unstable_now();
            switch (
              (typeof G == 'object' && G !== null
                ? ((G = G.delay), (G = typeof G == 'number' && 0 < G ? rt + G : rt))
                : (G = rt),
              b)
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
              (yt = G + yt),
              (b = { id: Z++, callback: x, priorityLevel: b, startTime: G, expirationTime: yt, sortIndex: -1 }),
              G > rt
                ? ((b.sortIndex = G),
                  _(p, b),
                  M(j) === null && b === M(p) && (Ct ? (X(k), (k = -1)) : (Ct = !0), El(zt, G - rt)))
                : ((b.sortIndex = yt), _(j, b), Et || jt || ((Et = !0), Rt || ((Rt = !0), Kt()))),
              b
            );
          }),
          (z.unstable_shouldYield = Ze),
          (z.unstable_wrapCallback = function (b) {
            var x = W;
            return function () {
              var G = W;
              W = x;
              try {
                return b.apply(this, arguments);
              } finally {
                W = G;
              }
            };
          }));
      })(yf)),
    yf
  );
}
var x0;
function fh() {
  return (x0 || ((x0 = 1), (hf.exports = ch())), hf.exports);
}
var vf = { exports: {} },
  Zt = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var O0;
function sh() {
  if (O0) return Zt;
  O0 = 1;
  var z = Sf();
  function _(j) {
    var p = 'https://react.dev/errors/' + j;
    if (1 < arguments.length) {
      p += '?args[]=' + encodeURIComponent(arguments[1]);
      for (var Z = 2; Z < arguments.length; Z++) p += '&args[]=' + encodeURIComponent(arguments[Z]);
    }
    return (
      'Minified React error #' +
      j +
      '; visit ' +
      p +
      ' for the full message or use the non-minified dev environment for full errors and additional helpful warnings.'
    );
  }
  function M() {}
  var r = {
      d: {
        f: M,
        r: function () {
          throw Error(_(522));
        },
        D: M,
        C: M,
        L: M,
        m: M,
        X: M,
        S: M,
        M,
      },
      p: 0,
      findDOMNode: null,
    },
    Y = Symbol.for('react.portal');
  function J(j, p, Z) {
    var R = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: Y, key: R == null ? null : '' + R, children: j, containerInfo: p, implementation: Z };
  }
  var $ = z.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function it(j, p) {
    if (j === 'font') return '';
    if (typeof p == 'string') return p === 'use-credentials' ? p : '';
  }
  return (
    (Zt.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = r),
    (Zt.createPortal = function (j, p) {
      var Z = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
      if (!p || (p.nodeType !== 1 && p.nodeType !== 9 && p.nodeType !== 11)) throw Error(_(299));
      return J(j, p, null, Z);
    }),
    (Zt.flushSync = function (j) {
      var p = $.T,
        Z = r.p;
      try {
        if ((($.T = null), (r.p = 2), j)) return j();
      } finally {
        (($.T = p), (r.p = Z), r.d.f());
      }
    }),
    (Zt.preconnect = function (j, p) {
      typeof j == 'string' &&
        (p
          ? ((p = p.crossOrigin), (p = typeof p == 'string' ? (p === 'use-credentials' ? p : '') : void 0))
          : (p = null),
        r.d.C(j, p));
    }),
    (Zt.prefetchDNS = function (j) {
      typeof j == 'string' && r.d.D(j);
    }),
    (Zt.preinit = function (j, p) {
      if (typeof j == 'string' && p && typeof p.as == 'string') {
        var Z = p.as,
          R = it(Z, p.crossOrigin),
          W = typeof p.integrity == 'string' ? p.integrity : void 0,
          jt = typeof p.fetchPriority == 'string' ? p.fetchPriority : void 0;
        Z === 'style'
          ? r.d.S(j, typeof p.precedence == 'string' ? p.precedence : void 0, {
              crossOrigin: R,
              integrity: W,
              fetchPriority: jt,
            })
          : Z === 'script' &&
            r.d.X(j, {
              crossOrigin: R,
              integrity: W,
              fetchPriority: jt,
              nonce: typeof p.nonce == 'string' ? p.nonce : void 0,
            });
      }
    }),
    (Zt.preinitModule = function (j, p) {
      if (typeof j == 'string')
        if (typeof p == 'object' && p !== null) {
          if (p.as == null || p.as === 'script') {
            var Z = it(p.as, p.crossOrigin);
            r.d.M(j, {
              crossOrigin: Z,
              integrity: typeof p.integrity == 'string' ? p.integrity : void 0,
              nonce: typeof p.nonce == 'string' ? p.nonce : void 0,
            });
          }
        } else p == null && r.d.M(j);
    }),
    (Zt.preload = function (j, p) {
      if (typeof j == 'string' && typeof p == 'object' && p !== null && typeof p.as == 'string') {
        var Z = p.as,
          R = it(Z, p.crossOrigin);
        r.d.L(j, Z, {
          crossOrigin: R,
          integrity: typeof p.integrity == 'string' ? p.integrity : void 0,
          nonce: typeof p.nonce == 'string' ? p.nonce : void 0,
          type: typeof p.type == 'string' ? p.type : void 0,
          fetchPriority: typeof p.fetchPriority == 'string' ? p.fetchPriority : void 0,
          referrerPolicy: typeof p.referrerPolicy == 'string' ? p.referrerPolicy : void 0,
          imageSrcSet: typeof p.imageSrcSet == 'string' ? p.imageSrcSet : void 0,
          imageSizes: typeof p.imageSizes == 'string' ? p.imageSizes : void 0,
          media: typeof p.media == 'string' ? p.media : void 0,
        });
      }
    }),
    (Zt.preloadModule = function (j, p) {
      if (typeof j == 'string')
        if (p) {
          var Z = it(p.as, p.crossOrigin);
          r.d.m(j, {
            as: typeof p.as == 'string' && p.as !== 'script' ? p.as : void 0,
            crossOrigin: Z,
            integrity: typeof p.integrity == 'string' ? p.integrity : void 0,
          });
        } else r.d.m(j);
    }),
    (Zt.requestFormReset = function (j) {
      r.d.r(j);
    }),
    (Zt.unstable_batchedUpdates = function (j, p) {
      return j(p);
    }),
    (Zt.useFormState = function (j, p, Z) {
      return $.H.useFormState(j, p, Z);
    }),
    (Zt.useFormStatus = function () {
      return $.H.useHostTransitionStatus();
    }),
    (Zt.version = '19.2.0'),
    Zt
  );
}
var D0;
function oh() {
  if (D0) return vf.exports;
  D0 = 1;
  function z() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > 'u' || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != 'function'))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(z);
      } catch (_) {
        console.error(_);
      }
  }
  return (z(), (vf.exports = sh()), vf.exports);
}
/**
 * @license React
 * react-dom-client.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var N0;
function rh() {
  if (N0) return Tu;
  N0 = 1;
  var z = fh(),
    _ = Sf(),
    M = oh();
  function r(t) {
    var l = 'https://react.dev/errors/' + t;
    if (1 < arguments.length) {
      l += '?args[]=' + encodeURIComponent(arguments[1]);
      for (var e = 2; e < arguments.length; e++) l += '&args[]=' + encodeURIComponent(arguments[e]);
    }
    return (
      'Minified React error #' +
      t +
      '; visit ' +
      l +
      ' for the full message or use the non-minified dev environment for full errors and additional helpful warnings.'
    );
  }
  function Y(t) {
    return !(!t || (t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11));
  }
  function J(t) {
    var l = t,
      e = t;
    if (t.alternate) for (; l.return; ) l = l.return;
    else {
      t = l;
      do ((l = t), (l.flags & 4098) !== 0 && (e = l.return), (t = l.return));
      while (t);
    }
    return l.tag === 3 ? e : null;
  }
  function $(t) {
    if (t.tag === 13) {
      var l = t.memoizedState;
      if ((l === null && ((t = t.alternate), t !== null && (l = t.memoizedState)), l !== null)) return l.dehydrated;
    }
    return null;
  }
  function it(t) {
    if (t.tag === 31) {
      var l = t.memoizedState;
      if ((l === null && ((t = t.alternate), t !== null && (l = t.memoizedState)), l !== null)) return l.dehydrated;
    }
    return null;
  }
  function j(t) {
    if (J(t) !== t) throw Error(r(188));
  }
  function p(t) {
    var l = t.alternate;
    if (!l) {
      if (((l = J(t)), l === null)) throw Error(r(188));
      return l !== t ? null : t;
    }
    for (var e = t, a = l; ; ) {
      var u = e.return;
      if (u === null) break;
      var n = u.alternate;
      if (n === null) {
        if (((a = u.return), a !== null)) {
          e = a;
          continue;
        }
        break;
      }
      if (u.child === n.child) {
        for (n = u.child; n; ) {
          if (n === e) return (j(u), t);
          if (n === a) return (j(u), l);
          n = n.sibling;
        }
        throw Error(r(188));
      }
      if (e.return !== a.return) ((e = u), (a = n));
      else {
        for (var i = !1, c = u.child; c; ) {
          if (c === e) {
            ((i = !0), (e = u), (a = n));
            break;
          }
          if (c === a) {
            ((i = !0), (a = u), (e = n));
            break;
          }
          c = c.sibling;
        }
        if (!i) {
          for (c = n.child; c; ) {
            if (c === e) {
              ((i = !0), (e = n), (a = u));
              break;
            }
            if (c === a) {
              ((i = !0), (a = n), (e = u));
              break;
            }
            c = c.sibling;
          }
          if (!i) throw Error(r(189));
        }
      }
      if (e.alternate !== a) throw Error(r(190));
    }
    if (e.tag !== 3) throw Error(r(188));
    return e.stateNode.current === e ? t : l;
  }
  function Z(t) {
    var l = t.tag;
    if (l === 5 || l === 26 || l === 27 || l === 6) return t;
    for (t = t.child; t !== null; ) {
      if (((l = Z(t)), l !== null)) return l;
      t = t.sibling;
    }
    return null;
  }
  var R = Object.assign,
    W = Symbol.for('react.element'),
    jt = Symbol.for('react.transitional.element'),
    Et = Symbol.for('react.portal'),
    Ct = Symbol.for('react.fragment'),
    tl = Symbol.for('react.strict_mode'),
    Q = Symbol.for('react.profiler'),
    X = Symbol.for('react.consumer'),
    D = Symbol.for('react.context'),
    U = Symbol.for('react.forward_ref'),
    zt = Symbol.for('react.suspense'),
    Rt = Symbol.for('react.suspense_list'),
    k = Symbol.for('react.memo'),
    St = Symbol.for('react.lazy'),
    _l = Symbol.for('react.activity'),
    Ze = Symbol.for('react.memo_cache_sentinel'),
    Ml = Symbol.iterator;
  function Kt(t) {
    return t === null || typeof t != 'object'
      ? null
      : ((t = (Ml && t[Ml]) || t['@@iterator']), typeof t == 'function' ? t : null);
  }
  var ze = Symbol.for('react.client.reference');
  function Ul(t) {
    if (t == null) return null;
    if (typeof t == 'function') return t.$$typeof === ze ? null : t.displayName || t.name || null;
    if (typeof t == 'string') return t;
    switch (t) {
      case Ct:
        return 'Fragment';
      case Q:
        return 'Profiler';
      case tl:
        return 'StrictMode';
      case zt:
        return 'Suspense';
      case Rt:
        return 'SuspenseList';
      case _l:
        return 'Activity';
    }
    if (typeof t == 'object')
      switch (t.$$typeof) {
        case Et:
          return 'Portal';
        case D:
          return t.displayName || 'Context';
        case X:
          return (t._context.displayName || 'Context') + '.Consumer';
        case U:
          var l = t.render;
          return (
            (t = t.displayName),
            t || ((t = l.displayName || l.name || ''), (t = t !== '' ? 'ForwardRef(' + t + ')' : 'ForwardRef')),
            t
          );
        case k:
          return ((l = t.displayName || null), l !== null ? l : Ul(t.type) || 'Memo');
        case St:
          ((l = t._payload), (t = t._init));
          try {
            return Ul(t(l));
          } catch {}
      }
    return null;
  }
  var El = Array.isArray,
    b = _.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
    x = M.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
    G = { pending: !1, data: null, method: null, action: null },
    rt = [],
    yt = -1;
  function o(t) {
    return { current: t };
  }
  function T(t) {
    0 > yt || ((t.current = rt[yt]), (rt[yt] = null), yt--);
  }
  function O(t, l) {
    (yt++, (rt[yt] = t.current), (t.current = l));
  }
  var C = o(null),
    V = o(null),
    F = o(null),
    ct = o(null);
  function Vt(t, l) {
    switch ((O(F, l), O(V, t), O(C, null), l.nodeType)) {
      case 9:
      case 11:
        t = (t = l.documentElement) && (t = t.namespaceURI) ? wr(t) : 0;
        break;
      default:
        if (((t = l.tagName), (l = l.namespaceURI))) ((l = wr(l)), (t = Kr(l, t)));
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
    (T(C), O(C, t));
  }
  function _t() {
    (T(C), T(V), T(F));
  }
  function Da(t) {
    t.memoizedState !== null && O(ct, t);
    var l = C.current,
      e = Kr(l, t.type);
    l !== e && (O(V, t), O(C, e));
  }
  function Mu(t) {
    (V.current === t && (T(C), T(V)), ct.current === t && (T(ct), (bu._currentValue = G)));
  }
  var Kn, pf;
  function Te(t) {
    if (Kn === void 0)
      try {
        throw Error();
      } catch (e) {
        var l = e.stack.trim().match(/\n( *(at )?)/);
        ((Kn = (l && l[1]) || ''),
          (pf =
            -1 <
            e.stack.indexOf(`
    at`)
              ? ' (<anonymous>)'
              : -1 < e.stack.indexOf('@')
                ? '@unknown:0:0'
                : ''));
      }
    return (
      `
` +
      Kn +
      t +
      pf
    );
  }
  var Jn = !1;
  function kn(t, l) {
    if (!t || Jn) return '';
    Jn = !0;
    var e = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var a = {
        DetermineComponentFrameRoot: function () {
          try {
            if (l) {
              var E = function () {
                throw Error();
              };
              if (
                (Object.defineProperty(E.prototype, 'props', {
                  set: function () {
                    throw Error();
                  },
                }),
                typeof Reflect == 'object' && Reflect.construct)
              ) {
                try {
                  Reflect.construct(E, []);
                } catch (v) {
                  var y = v;
                }
                Reflect.construct(t, [], E);
              } else {
                try {
                  E.call();
                } catch (v) {
                  y = v;
                }
                t.call(E.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (v) {
                y = v;
              }
              (E = t()) && typeof E.catch == 'function' && E.catch(function () {});
            }
          } catch (v) {
            if (v && y && typeof v.stack == 'string') return [v.stack, y.stack];
          }
          return [null, null];
        },
      };
      a.DetermineComponentFrameRoot.displayName = 'DetermineComponentFrameRoot';
      var u = Object.getOwnPropertyDescriptor(a.DetermineComponentFrameRoot, 'name');
      u &&
        u.configurable &&
        Object.defineProperty(a.DetermineComponentFrameRoot, 'name', { value: 'DetermineComponentFrameRoot' });
      var n = a.DetermineComponentFrameRoot(),
        i = n[0],
        c = n[1];
      if (i && c) {
        var f = i.split(`
`),
          h = c.split(`
`);
        for (u = a = 0; a < f.length && !f[a].includes('DetermineComponentFrameRoot'); ) a++;
        for (; u < h.length && !h[u].includes('DetermineComponentFrameRoot'); ) u++;
        if (a === f.length || u === h.length)
          for (a = f.length - 1, u = h.length - 1; 1 <= a && 0 <= u && f[a] !== h[u]; ) u--;
        for (; 1 <= a && 0 <= u; a--, u--)
          if (f[a] !== h[u]) {
            if (a !== 1 || u !== 1)
              do
                if ((a--, u--, 0 > u || f[a] !== h[u])) {
                  var g =
                    `
` + f[a].replace(' at new ', ' at ');
                  return (
                    t.displayName && g.includes('<anonymous>') && (g = g.replace('<anonymous>', t.displayName)),
                    g
                  );
                }
              while (1 <= a && 0 <= u);
            break;
          }
      }
    } finally {
      ((Jn = !1), (Error.prepareStackTrace = e));
    }
    return (e = t ? t.displayName || t.name : '') ? Te(e) : '';
  }
  function H0(t, l) {
    switch (t.tag) {
      case 26:
      case 27:
      case 5:
        return Te(t.type);
      case 16:
        return Te('Lazy');
      case 13:
        return t.child !== l && l !== null ? Te('Suspense Fallback') : Te('Suspense');
      case 19:
        return Te('SuspenseList');
      case 0:
      case 15:
        return kn(t.type, !1);
      case 11:
        return kn(t.type.render, !1);
      case 1:
        return kn(t.type, !0);
      case 31:
        return Te('Activity');
      default:
        return '';
    }
  }
  function Ef(t) {
    try {
      var l = '',
        e = null;
      do ((l += H0(t, e)), (e = t), (t = t.return));
      while (t);
      return l;
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
  var $n = Object.prototype.hasOwnProperty,
    Wn = z.unstable_scheduleCallback,
    Fn = z.unstable_cancelCallback,
    R0 = z.unstable_shouldYield,
    q0 = z.unstable_requestPaint,
    ll = z.unstable_now,
    B0 = z.unstable_getCurrentPriorityLevel,
    zf = z.unstable_ImmediatePriority,
    Tf = z.unstable_UserBlockingPriority,
    xu = z.unstable_NormalPriority,
    Y0 = z.unstable_LowPriority,
    Af = z.unstable_IdlePriority,
    G0 = z.log,
    X0 = z.unstable_setDisableYieldValue,
    Na = null,
    el = null;
  function Wl(t) {
    if ((typeof G0 == 'function' && X0(t), el && typeof el.setStrictMode == 'function'))
      try {
        el.setStrictMode(Na, t);
      } catch {}
  }
  var al = Math.clz32 ? Math.clz32 : Z0,
    Q0 = Math.log,
    L0 = Math.LN2;
  function Z0(t) {
    return ((t >>>= 0), t === 0 ? 32 : (31 - ((Q0(t) / L0) | 0)) | 0);
  }
  var Ou = 256,
    Du = 262144,
    Nu = 4194304;
  function Ae(t) {
    var l = t & 42;
    if (l !== 0) return l;
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
  function Uu(t, l, e) {
    var a = t.pendingLanes;
    if (a === 0) return 0;
    var u = 0,
      n = t.suspendedLanes,
      i = t.pingedLanes;
    t = t.warmLanes;
    var c = a & 134217727;
    return (
      c !== 0
        ? ((a = c & ~n),
          a !== 0 ? (u = Ae(a)) : ((i &= c), i !== 0 ? (u = Ae(i)) : e || ((e = c & ~t), e !== 0 && (u = Ae(e)))))
        : ((c = a & ~n), c !== 0 ? (u = Ae(c)) : i !== 0 ? (u = Ae(i)) : e || ((e = a & ~t), e !== 0 && (u = Ae(e)))),
      u === 0
        ? 0
        : l !== 0 &&
            l !== u &&
            (l & n) === 0 &&
            ((n = u & -u), (e = l & -l), n >= e || (n === 32 && (e & 4194048) !== 0))
          ? l
          : u
    );
  }
  function Ua(t, l) {
    return (t.pendingLanes & ~(t.suspendedLanes & ~t.pingedLanes) & l) === 0;
  }
  function V0(t, l) {
    switch (t) {
      case 1:
      case 2:
      case 4:
      case 8:
      case 64:
        return l + 250;
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
        return l + 5e3;
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
  function _f() {
    var t = Nu;
    return ((Nu <<= 1), (Nu & 62914560) === 0 && (Nu = 4194304), t);
  }
  function In(t) {
    for (var l = [], e = 0; 31 > e; e++) l.push(t);
    return l;
  }
  function ja(t, l) {
    ((t.pendingLanes |= l), l !== 268435456 && ((t.suspendedLanes = 0), (t.pingedLanes = 0), (t.warmLanes = 0)));
  }
  function w0(t, l, e, a, u, n) {
    var i = t.pendingLanes;
    ((t.pendingLanes = e),
      (t.suspendedLanes = 0),
      (t.pingedLanes = 0),
      (t.warmLanes = 0),
      (t.expiredLanes &= e),
      (t.entangledLanes &= e),
      (t.errorRecoveryDisabledLanes &= e),
      (t.shellSuspendCounter = 0));
    var c = t.entanglements,
      f = t.expirationTimes,
      h = t.hiddenUpdates;
    for (e = i & ~e; 0 < e; ) {
      var g = 31 - al(e),
        E = 1 << g;
      ((c[g] = 0), (f[g] = -1));
      var y = h[g];
      if (y !== null)
        for (h[g] = null, g = 0; g < y.length; g++) {
          var v = y[g];
          v !== null && (v.lane &= -536870913);
        }
      e &= ~E;
    }
    (a !== 0 && Mf(t, a, 0), n !== 0 && u === 0 && t.tag !== 0 && (t.suspendedLanes |= n & ~(i & ~l)));
  }
  function Mf(t, l, e) {
    ((t.pendingLanes |= l), (t.suspendedLanes &= ~l));
    var a = 31 - al(l);
    ((t.entangledLanes |= l), (t.entanglements[a] = t.entanglements[a] | 1073741824 | (e & 261930)));
  }
  function xf(t, l) {
    var e = (t.entangledLanes |= l);
    for (t = t.entanglements; e; ) {
      var a = 31 - al(e),
        u = 1 << a;
      ((u & l) | (t[a] & l) && (t[a] |= l), (e &= ~u));
    }
  }
  function Of(t, l) {
    var e = l & -l;
    return ((e = (e & 42) !== 0 ? 1 : Pn(e)), (e & (t.suspendedLanes | l)) !== 0 ? 0 : e);
  }
  function Pn(t) {
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
  function ti(t) {
    return ((t &= -t), 2 < t ? (8 < t ? ((t & 134217727) !== 0 ? 32 : 268435456) : 8) : 2);
  }
  function Df() {
    var t = x.p;
    return t !== 0 ? t : ((t = window.event), t === void 0 ? 32 : y0(t.type));
  }
  function Nf(t, l) {
    var e = x.p;
    try {
      return ((x.p = t), l());
    } finally {
      x.p = e;
    }
  }
  var Fl = Math.random().toString(36).slice(2),
    Yt = '__reactFiber$' + Fl,
    Jt = '__reactProps$' + Fl,
    Ve = '__reactContainer$' + Fl,
    li = '__reactEvents$' + Fl,
    K0 = '__reactListeners$' + Fl,
    J0 = '__reactHandles$' + Fl,
    Uf = '__reactResources$' + Fl,
    Ca = '__reactMarker$' + Fl;
  function ei(t) {
    (delete t[Yt], delete t[Jt], delete t[li], delete t[K0], delete t[J0]);
  }
  function we(t) {
    var l = t[Yt];
    if (l) return l;
    for (var e = t.parentNode; e; ) {
      if ((l = e[Ve] || e[Yt])) {
        if (((e = l.alternate), l.child !== null || (e !== null && e.child !== null)))
          for (t = Pr(t); t !== null; ) {
            if ((e = t[Yt])) return e;
            t = Pr(t);
          }
        return l;
      }
      ((t = e), (e = t.parentNode));
    }
    return null;
  }
  function Ke(t) {
    if ((t = t[Yt] || t[Ve])) {
      var l = t.tag;
      if (l === 5 || l === 6 || l === 13 || l === 31 || l === 26 || l === 27 || l === 3) return t;
    }
    return null;
  }
  function Ha(t) {
    var l = t.tag;
    if (l === 5 || l === 26 || l === 27 || l === 6) return t.stateNode;
    throw Error(r(33));
  }
  function Je(t) {
    var l = t[Uf];
    return (l || (l = t[Uf] = { hoistableStyles: new Map(), hoistableScripts: new Map() }), l);
  }
  function qt(t) {
    t[Ca] = !0;
  }
  var jf = new Set(),
    Cf = {};
  function _e(t, l) {
    (ke(t, l), ke(t + 'Capture', l));
  }
  function ke(t, l) {
    for (Cf[t] = l, t = 0; t < l.length; t++) jf.add(l[t]);
  }
  var k0 = RegExp(
      '^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$'
    ),
    Hf = {},
    Rf = {};
  function $0(t) {
    return $n.call(Rf, t) ? !0 : $n.call(Hf, t) ? !1 : k0.test(t) ? (Rf[t] = !0) : ((Hf[t] = !0), !1);
  }
  function ju(t, l, e) {
    if ($0(l))
      if (e === null) t.removeAttribute(l);
      else {
        switch (typeof e) {
          case 'undefined':
          case 'function':
          case 'symbol':
            t.removeAttribute(l);
            return;
          case 'boolean':
            var a = l.toLowerCase().slice(0, 5);
            if (a !== 'data-' && a !== 'aria-') {
              t.removeAttribute(l);
              return;
            }
        }
        t.setAttribute(l, '' + e);
      }
  }
  function Cu(t, l, e) {
    if (e === null) t.removeAttribute(l);
    else {
      switch (typeof e) {
        case 'undefined':
        case 'function':
        case 'symbol':
        case 'boolean':
          t.removeAttribute(l);
          return;
      }
      t.setAttribute(l, '' + e);
    }
  }
  function jl(t, l, e, a) {
    if (a === null) t.removeAttribute(e);
    else {
      switch (typeof a) {
        case 'undefined':
        case 'function':
        case 'symbol':
        case 'boolean':
          t.removeAttribute(e);
          return;
      }
      t.setAttributeNS(l, e, '' + a);
    }
  }
  function rl(t) {
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
  function qf(t) {
    var l = t.type;
    return (t = t.nodeName) && t.toLowerCase() === 'input' && (l === 'checkbox' || l === 'radio');
  }
  function W0(t, l, e) {
    var a = Object.getOwnPropertyDescriptor(t.constructor.prototype, l);
    if (!t.hasOwnProperty(l) && typeof a < 'u' && typeof a.get == 'function' && typeof a.set == 'function') {
      var u = a.get,
        n = a.set;
      return (
        Object.defineProperty(t, l, {
          configurable: !0,
          get: function () {
            return u.call(this);
          },
          set: function (i) {
            ((e = '' + i), n.call(this, i));
          },
        }),
        Object.defineProperty(t, l, { enumerable: a.enumerable }),
        {
          getValue: function () {
            return e;
          },
          setValue: function (i) {
            e = '' + i;
          },
          stopTracking: function () {
            ((t._valueTracker = null), delete t[l]);
          },
        }
      );
    }
  }
  function ai(t) {
    if (!t._valueTracker) {
      var l = qf(t) ? 'checked' : 'value';
      t._valueTracker = W0(t, l, '' + t[l]);
    }
  }
  function Bf(t) {
    if (!t) return !1;
    var l = t._valueTracker;
    if (!l) return !0;
    var e = l.getValue(),
      a = '';
    return (t && (a = qf(t) ? (t.checked ? 'true' : 'false') : t.value), (t = a), t !== e ? (l.setValue(t), !0) : !1);
  }
  function Hu(t) {
    if (((t = t || (typeof document < 'u' ? document : void 0)), typeof t > 'u')) return null;
    try {
      return t.activeElement || t.body;
    } catch {
      return t.body;
    }
  }
  var F0 = /[\n"\\]/g;
  function dl(t) {
    return t.replace(F0, function (l) {
      return '\\' + l.charCodeAt(0).toString(16) + ' ';
    });
  }
  function ui(t, l, e, a, u, n, i, c) {
    ((t.name = ''),
      i != null && typeof i != 'function' && typeof i != 'symbol' && typeof i != 'boolean'
        ? (t.type = i)
        : t.removeAttribute('type'),
      l != null
        ? i === 'number'
          ? ((l === 0 && t.value === '') || t.value != l) && (t.value = '' + rl(l))
          : t.value !== '' + rl(l) && (t.value = '' + rl(l))
        : (i !== 'submit' && i !== 'reset') || t.removeAttribute('value'),
      l != null ? ni(t, i, rl(l)) : e != null ? ni(t, i, rl(e)) : a != null && t.removeAttribute('value'),
      u == null && n != null && (t.defaultChecked = !!n),
      u != null && (t.checked = u && typeof u != 'function' && typeof u != 'symbol'),
      c != null && typeof c != 'function' && typeof c != 'symbol' && typeof c != 'boolean'
        ? (t.name = '' + rl(c))
        : t.removeAttribute('name'));
  }
  function Yf(t, l, e, a, u, n, i, c) {
    if (
      (n != null && typeof n != 'function' && typeof n != 'symbol' && typeof n != 'boolean' && (t.type = n),
      l != null || e != null)
    ) {
      if (!((n !== 'submit' && n !== 'reset') || l != null)) {
        ai(t);
        return;
      }
      ((e = e != null ? '' + rl(e) : ''),
        (l = l != null ? '' + rl(l) : e),
        c || l === t.value || (t.value = l),
        (t.defaultValue = l));
    }
    ((a = a ?? u),
      (a = typeof a != 'function' && typeof a != 'symbol' && !!a),
      (t.checked = c ? t.checked : !!a),
      (t.defaultChecked = !!a),
      i != null && typeof i != 'function' && typeof i != 'symbol' && typeof i != 'boolean' && (t.name = i),
      ai(t));
  }
  function ni(t, l, e) {
    (l === 'number' && Hu(t.ownerDocument) === t) || t.defaultValue === '' + e || (t.defaultValue = '' + e);
  }
  function $e(t, l, e, a) {
    if (((t = t.options), l)) {
      l = {};
      for (var u = 0; u < e.length; u++) l['$' + e[u]] = !0;
      for (e = 0; e < t.length; e++)
        ((u = l.hasOwnProperty('$' + t[e].value)),
          t[e].selected !== u && (t[e].selected = u),
          u && a && (t[e].defaultSelected = !0));
    } else {
      for (e = '' + rl(e), l = null, u = 0; u < t.length; u++) {
        if (t[u].value === e) {
          ((t[u].selected = !0), a && (t[u].defaultSelected = !0));
          return;
        }
        l !== null || t[u].disabled || (l = t[u]);
      }
      l !== null && (l.selected = !0);
    }
  }
  function Gf(t, l, e) {
    if (l != null && ((l = '' + rl(l)), l !== t.value && (t.value = l), e == null)) {
      t.defaultValue !== l && (t.defaultValue = l);
      return;
    }
    t.defaultValue = e != null ? '' + rl(e) : '';
  }
  function Xf(t, l, e, a) {
    if (l == null) {
      if (a != null) {
        if (e != null) throw Error(r(92));
        if (El(a)) {
          if (1 < a.length) throw Error(r(93));
          a = a[0];
        }
        e = a;
      }
      (e == null && (e = ''), (l = e));
    }
    ((e = rl(l)), (t.defaultValue = e), (a = t.textContent), a === e && a !== '' && a !== null && (t.value = a), ai(t));
  }
  function We(t, l) {
    if (l) {
      var e = t.firstChild;
      if (e && e === t.lastChild && e.nodeType === 3) {
        e.nodeValue = l;
        return;
      }
    }
    t.textContent = l;
  }
  var I0 = new Set(
    'animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp'.split(
      ' '
    )
  );
  function Qf(t, l, e) {
    var a = l.indexOf('--') === 0;
    e == null || typeof e == 'boolean' || e === ''
      ? a
        ? t.setProperty(l, '')
        : l === 'float'
          ? (t.cssFloat = '')
          : (t[l] = '')
      : a
        ? t.setProperty(l, e)
        : typeof e != 'number' || e === 0 || I0.has(l)
          ? l === 'float'
            ? (t.cssFloat = e)
            : (t[l] = ('' + e).trim())
          : (t[l] = e + 'px');
  }
  function Lf(t, l, e) {
    if (l != null && typeof l != 'object') throw Error(r(62));
    if (((t = t.style), e != null)) {
      for (var a in e)
        !e.hasOwnProperty(a) ||
          (l != null && l.hasOwnProperty(a)) ||
          (a.indexOf('--') === 0 ? t.setProperty(a, '') : a === 'float' ? (t.cssFloat = '') : (t[a] = ''));
      for (var u in l) ((a = l[u]), l.hasOwnProperty(u) && e[u] !== a && Qf(t, u, a));
    } else for (var n in l) l.hasOwnProperty(n) && Qf(t, n, l[n]);
  }
  function ii(t) {
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
  var P0 = new Map([
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
    td =
      /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function Ru(t) {
    return td.test('' + t)
      ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')"
      : t;
  }
  function Cl() {}
  var ci = null;
  function fi(t) {
    return (
      (t = t.target || t.srcElement || window),
      t.correspondingUseElement && (t = t.correspondingUseElement),
      t.nodeType === 3 ? t.parentNode : t
    );
  }
  var Fe = null,
    Ie = null;
  function Zf(t) {
    var l = Ke(t);
    if (l && (t = l.stateNode)) {
      var e = t[Jt] || null;
      t: switch (((t = l.stateNode), l.type)) {
        case 'input':
          if (
            (ui(t, e.value, e.defaultValue, e.defaultValue, e.checked, e.defaultChecked, e.type, e.name),
            (l = e.name),
            e.type === 'radio' && l != null)
          ) {
            for (e = t; e.parentNode; ) e = e.parentNode;
            for (e = e.querySelectorAll('input[name="' + dl('' + l) + '"][type="radio"]'), l = 0; l < e.length; l++) {
              var a = e[l];
              if (a !== t && a.form === t.form) {
                var u = a[Jt] || null;
                if (!u) throw Error(r(90));
                ui(a, u.value, u.defaultValue, u.defaultValue, u.checked, u.defaultChecked, u.type, u.name);
              }
            }
            for (l = 0; l < e.length; l++) ((a = e[l]), a.form === t.form && Bf(a));
          }
          break t;
        case 'textarea':
          Gf(t, e.value, e.defaultValue);
          break t;
        case 'select':
          ((l = e.value), l != null && $e(t, !!e.multiple, l, !1));
      }
    }
  }
  var si = !1;
  function Vf(t, l, e) {
    if (si) return t(l, e);
    si = !0;
    try {
      var a = t(l);
      return a;
    } finally {
      if (((si = !1), (Fe !== null || Ie !== null) && (Tn(), Fe && ((l = Fe), (t = Ie), (Ie = Fe = null), Zf(l), t))))
        for (l = 0; l < t.length; l++) Zf(t[l]);
    }
  }
  function Ra(t, l) {
    var e = t.stateNode;
    if (e === null) return null;
    var a = e[Jt] || null;
    if (a === null) return null;
    e = a[l];
    t: switch (l) {
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
    if (e && typeof e != 'function') throw Error(r(231, l, typeof e));
    return e;
  }
  var Hl = !(typeof window > 'u' || typeof window.document > 'u' || typeof window.document.createElement > 'u'),
    oi = !1;
  if (Hl)
    try {
      var qa = {};
      (Object.defineProperty(qa, 'passive', {
        get: function () {
          oi = !0;
        },
      }),
        window.addEventListener('test', qa, qa),
        window.removeEventListener('test', qa, qa));
    } catch {
      oi = !1;
    }
  var Il = null,
    ri = null,
    qu = null;
  function wf() {
    if (qu) return qu;
    var t,
      l = ri,
      e = l.length,
      a,
      u = 'value' in Il ? Il.value : Il.textContent,
      n = u.length;
    for (t = 0; t < e && l[t] === u[t]; t++);
    var i = e - t;
    for (a = 1; a <= i && l[e - a] === u[n - a]; a++);
    return (qu = u.slice(t, 1 < a ? 1 - a : void 0));
  }
  function Bu(t) {
    var l = t.keyCode;
    return (
      'charCode' in t ? ((t = t.charCode), t === 0 && l === 13 && (t = 13)) : (t = l),
      t === 10 && (t = 13),
      32 <= t || t === 13 ? t : 0
    );
  }
  function Yu() {
    return !0;
  }
  function Kf() {
    return !1;
  }
  function kt(t) {
    function l(e, a, u, n, i) {
      ((this._reactName = e),
        (this._targetInst = u),
        (this.type = a),
        (this.nativeEvent = n),
        (this.target = i),
        (this.currentTarget = null));
      for (var c in t) t.hasOwnProperty(c) && ((e = t[c]), (this[c] = e ? e(n) : n[c]));
      return (
        (this.isDefaultPrevented = (n.defaultPrevented != null ? n.defaultPrevented : n.returnValue === !1) ? Yu : Kf),
        (this.isPropagationStopped = Kf),
        this
      );
    }
    return (
      R(l.prototype, {
        preventDefault: function () {
          this.defaultPrevented = !0;
          var e = this.nativeEvent;
          e &&
            (e.preventDefault ? e.preventDefault() : typeof e.returnValue != 'unknown' && (e.returnValue = !1),
            (this.isDefaultPrevented = Yu));
        },
        stopPropagation: function () {
          var e = this.nativeEvent;
          e &&
            (e.stopPropagation ? e.stopPropagation() : typeof e.cancelBubble != 'unknown' && (e.cancelBubble = !0),
            (this.isPropagationStopped = Yu));
        },
        persist: function () {},
        isPersistent: Yu,
      }),
      l
    );
  }
  var Me = {
      eventPhase: 0,
      bubbles: 0,
      cancelable: 0,
      timeStamp: function (t) {
        return t.timeStamp || Date.now();
      },
      defaultPrevented: 0,
      isTrusted: 0,
    },
    Gu = kt(Me),
    Ba = R({}, Me, { view: 0, detail: 0 }),
    ld = kt(Ba),
    di,
    mi,
    Ya,
    Xu = R({}, Ba, {
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
      getModifierState: yi,
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
          : (t !== Ya &&
              (Ya && t.type === 'mousemove'
                ? ((di = t.screenX - Ya.screenX), (mi = t.screenY - Ya.screenY))
                : (mi = di = 0),
              (Ya = t)),
            di);
      },
      movementY: function (t) {
        return 'movementY' in t ? t.movementY : mi;
      },
    }),
    Jf = kt(Xu),
    ed = R({}, Xu, { dataTransfer: 0 }),
    ad = kt(ed),
    ud = R({}, Ba, { relatedTarget: 0 }),
    hi = kt(ud),
    nd = R({}, Me, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
    id = kt(nd),
    cd = R({}, Me, {
      clipboardData: function (t) {
        return 'clipboardData' in t ? t.clipboardData : window.clipboardData;
      },
    }),
    fd = kt(cd),
    sd = R({}, Me, { data: 0 }),
    kf = kt(sd),
    od = {
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
    rd = {
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
    dd = { Alt: 'altKey', Control: 'ctrlKey', Meta: 'metaKey', Shift: 'shiftKey' };
  function md(t) {
    var l = this.nativeEvent;
    return l.getModifierState ? l.getModifierState(t) : (t = dd[t]) ? !!l[t] : !1;
  }
  function yi() {
    return md;
  }
  var hd = R({}, Ba, {
      key: function (t) {
        if (t.key) {
          var l = od[t.key] || t.key;
          if (l !== 'Unidentified') return l;
        }
        return t.type === 'keypress'
          ? ((t = Bu(t)), t === 13 ? 'Enter' : String.fromCharCode(t))
          : t.type === 'keydown' || t.type === 'keyup'
            ? rd[t.keyCode] || 'Unidentified'
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
      getModifierState: yi,
      charCode: function (t) {
        return t.type === 'keypress' ? Bu(t) : 0;
      },
      keyCode: function (t) {
        return t.type === 'keydown' || t.type === 'keyup' ? t.keyCode : 0;
      },
      which: function (t) {
        return t.type === 'keypress' ? Bu(t) : t.type === 'keydown' || t.type === 'keyup' ? t.keyCode : 0;
      },
    }),
    yd = kt(hd),
    vd = R({}, Xu, {
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
    $f = kt(vd),
    gd = R({}, Ba, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: yi,
    }),
    bd = kt(gd),
    Sd = R({}, Me, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
    pd = kt(Sd),
    Ed = R({}, Xu, {
      deltaX: function (t) {
        return 'deltaX' in t ? t.deltaX : 'wheelDeltaX' in t ? -t.wheelDeltaX : 0;
      },
      deltaY: function (t) {
        return 'deltaY' in t ? t.deltaY : 'wheelDeltaY' in t ? -t.wheelDeltaY : 'wheelDelta' in t ? -t.wheelDelta : 0;
      },
      deltaZ: 0,
      deltaMode: 0,
    }),
    zd = kt(Ed),
    Td = R({}, Me, { newState: 0, oldState: 0 }),
    Ad = kt(Td),
    _d = [9, 13, 27, 32],
    vi = Hl && 'CompositionEvent' in window,
    Ga = null;
  Hl && 'documentMode' in document && (Ga = document.documentMode);
  var Md = Hl && 'TextEvent' in window && !Ga,
    Wf = Hl && (!vi || (Ga && 8 < Ga && 11 >= Ga)),
    Ff = ' ',
    If = !1;
  function Pf(t, l) {
    switch (t) {
      case 'keyup':
        return _d.indexOf(l.keyCode) !== -1;
      case 'keydown':
        return l.keyCode !== 229;
      case 'keypress':
      case 'mousedown':
      case 'focusout':
        return !0;
      default:
        return !1;
    }
  }
  function ts(t) {
    return ((t = t.detail), typeof t == 'object' && 'data' in t ? t.data : null);
  }
  var Pe = !1;
  function xd(t, l) {
    switch (t) {
      case 'compositionend':
        return ts(l);
      case 'keypress':
        return l.which !== 32 ? null : ((If = !0), Ff);
      case 'textInput':
        return ((t = l.data), t === Ff && If ? null : t);
      default:
        return null;
    }
  }
  function Od(t, l) {
    if (Pe)
      return t === 'compositionend' || (!vi && Pf(t, l)) ? ((t = wf()), (qu = ri = Il = null), (Pe = !1), t) : null;
    switch (t) {
      case 'paste':
        return null;
      case 'keypress':
        if (!(l.ctrlKey || l.altKey || l.metaKey) || (l.ctrlKey && l.altKey)) {
          if (l.char && 1 < l.char.length) return l.char;
          if (l.which) return String.fromCharCode(l.which);
        }
        return null;
      case 'compositionend':
        return Wf && l.locale !== 'ko' ? null : l.data;
      default:
        return null;
    }
  }
  var Dd = {
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
  function ls(t) {
    var l = t && t.nodeName && t.nodeName.toLowerCase();
    return l === 'input' ? !!Dd[t.type] : l === 'textarea';
  }
  function es(t, l, e, a) {
    (Fe ? (Ie ? Ie.push(a) : (Ie = [a])) : (Fe = a),
      (l = Nn(l, 'onChange')),
      0 < l.length && ((e = new Gu('onChange', 'change', null, e, a)), t.push({ event: e, listeners: l })));
  }
  var Xa = null,
    Qa = null;
  function Nd(t) {
    Gr(t, 0);
  }
  function Qu(t) {
    var l = Ha(t);
    if (Bf(l)) return t;
  }
  function as(t, l) {
    if (t === 'change') return l;
  }
  var us = !1;
  if (Hl) {
    var gi;
    if (Hl) {
      var bi = 'oninput' in document;
      if (!bi) {
        var ns = document.createElement('div');
        (ns.setAttribute('oninput', 'return;'), (bi = typeof ns.oninput == 'function'));
      }
      gi = bi;
    } else gi = !1;
    us = gi && (!document.documentMode || 9 < document.documentMode);
  }
  function is() {
    Xa && (Xa.detachEvent('onpropertychange', cs), (Qa = Xa = null));
  }
  function cs(t) {
    if (t.propertyName === 'value' && Qu(Qa)) {
      var l = [];
      (es(l, Qa, t, fi(t)), Vf(Nd, l));
    }
  }
  function Ud(t, l, e) {
    t === 'focusin' ? (is(), (Xa = l), (Qa = e), Xa.attachEvent('onpropertychange', cs)) : t === 'focusout' && is();
  }
  function jd(t) {
    if (t === 'selectionchange' || t === 'keyup' || t === 'keydown') return Qu(Qa);
  }
  function Cd(t, l) {
    if (t === 'click') return Qu(l);
  }
  function Hd(t, l) {
    if (t === 'input' || t === 'change') return Qu(l);
  }
  function Rd(t, l) {
    return (t === l && (t !== 0 || 1 / t === 1 / l)) || (t !== t && l !== l);
  }
  var ul = typeof Object.is == 'function' ? Object.is : Rd;
  function La(t, l) {
    if (ul(t, l)) return !0;
    if (typeof t != 'object' || t === null || typeof l != 'object' || l === null) return !1;
    var e = Object.keys(t),
      a = Object.keys(l);
    if (e.length !== a.length) return !1;
    for (a = 0; a < e.length; a++) {
      var u = e[a];
      if (!$n.call(l, u) || !ul(t[u], l[u])) return !1;
    }
    return !0;
  }
  function fs(t) {
    for (; t && t.firstChild; ) t = t.firstChild;
    return t;
  }
  function ss(t, l) {
    var e = fs(t);
    t = 0;
    for (var a; e; ) {
      if (e.nodeType === 3) {
        if (((a = t + e.textContent.length), t <= l && a >= l)) return { node: e, offset: l - t };
        t = a;
      }
      t: {
        for (; e; ) {
          if (e.nextSibling) {
            e = e.nextSibling;
            break t;
          }
          e = e.parentNode;
        }
        e = void 0;
      }
      e = fs(e);
    }
  }
  function os(t, l) {
    return t && l
      ? t === l
        ? !0
        : t && t.nodeType === 3
          ? !1
          : l && l.nodeType === 3
            ? os(t, l.parentNode)
            : 'contains' in t
              ? t.contains(l)
              : t.compareDocumentPosition
                ? !!(t.compareDocumentPosition(l) & 16)
                : !1
      : !1;
  }
  function rs(t) {
    t =
      t != null && t.ownerDocument != null && t.ownerDocument.defaultView != null
        ? t.ownerDocument.defaultView
        : window;
    for (var l = Hu(t.document); l instanceof t.HTMLIFrameElement; ) {
      try {
        var e = typeof l.contentWindow.location.href == 'string';
      } catch {
        e = !1;
      }
      if (e) t = l.contentWindow;
      else break;
      l = Hu(t.document);
    }
    return l;
  }
  function Si(t) {
    var l = t && t.nodeName && t.nodeName.toLowerCase();
    return (
      l &&
      ((l === 'input' &&
        (t.type === 'text' || t.type === 'search' || t.type === 'tel' || t.type === 'url' || t.type === 'password')) ||
        l === 'textarea' ||
        t.contentEditable === 'true')
    );
  }
  var qd = Hl && 'documentMode' in document && 11 >= document.documentMode,
    ta = null,
    pi = null,
    Za = null,
    Ei = !1;
  function ds(t, l, e) {
    var a = e.window === e ? e.document : e.nodeType === 9 ? e : e.ownerDocument;
    Ei ||
      ta == null ||
      ta !== Hu(a) ||
      ((a = ta),
      'selectionStart' in a && Si(a)
        ? (a = { start: a.selectionStart, end: a.selectionEnd })
        : ((a = ((a.ownerDocument && a.ownerDocument.defaultView) || window).getSelection()),
          (a = {
            anchorNode: a.anchorNode,
            anchorOffset: a.anchorOffset,
            focusNode: a.focusNode,
            focusOffset: a.focusOffset,
          })),
      (Za && La(Za, a)) ||
        ((Za = a),
        (a = Nn(pi, 'onSelect')),
        0 < a.length &&
          ((l = new Gu('onSelect', 'select', null, l, e)), t.push({ event: l, listeners: a }), (l.target = ta))));
  }
  function xe(t, l) {
    var e = {};
    return ((e[t.toLowerCase()] = l.toLowerCase()), (e['Webkit' + t] = 'webkit' + l), (e['Moz' + t] = 'moz' + l), e);
  }
  var la = {
      animationend: xe('Animation', 'AnimationEnd'),
      animationiteration: xe('Animation', 'AnimationIteration'),
      animationstart: xe('Animation', 'AnimationStart'),
      transitionrun: xe('Transition', 'TransitionRun'),
      transitionstart: xe('Transition', 'TransitionStart'),
      transitioncancel: xe('Transition', 'TransitionCancel'),
      transitionend: xe('Transition', 'TransitionEnd'),
    },
    zi = {},
    ms = {};
  Hl &&
    ((ms = document.createElement('div').style),
    'AnimationEvent' in window ||
      (delete la.animationend.animation, delete la.animationiteration.animation, delete la.animationstart.animation),
    'TransitionEvent' in window || delete la.transitionend.transition);
  function Oe(t) {
    if (zi[t]) return zi[t];
    if (!la[t]) return t;
    var l = la[t],
      e;
    for (e in l) if (l.hasOwnProperty(e) && e in ms) return (zi[t] = l[e]);
    return t;
  }
  var hs = Oe('animationend'),
    ys = Oe('animationiteration'),
    vs = Oe('animationstart'),
    Bd = Oe('transitionrun'),
    Yd = Oe('transitionstart'),
    Gd = Oe('transitioncancel'),
    gs = Oe('transitionend'),
    bs = new Map(),
    Ti =
      'abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel'.split(
        ' '
      );
  Ti.push('scrollEnd');
  function zl(t, l) {
    (bs.set(t, l), _e(l, [t]));
  }
  var Lu =
      typeof reportError == 'function'
        ? reportError
        : function (t) {
            if (typeof window == 'object' && typeof window.ErrorEvent == 'function') {
              var l = new window.ErrorEvent('error', {
                bubbles: !0,
                cancelable: !0,
                message:
                  typeof t == 'object' && t !== null && typeof t.message == 'string' ? String(t.message) : String(t),
                error: t,
              });
              if (!window.dispatchEvent(l)) return;
            } else if (typeof process == 'object' && typeof process.emit == 'function') {
              process.emit('uncaughtException', t);
              return;
            }
            console.error(t);
          },
    ml = [],
    ea = 0,
    Ai = 0;
  function Zu() {
    for (var t = ea, l = (Ai = ea = 0); l < t; ) {
      var e = ml[l];
      ml[l++] = null;
      var a = ml[l];
      ml[l++] = null;
      var u = ml[l];
      ml[l++] = null;
      var n = ml[l];
      if (((ml[l++] = null), a !== null && u !== null)) {
        var i = a.pending;
        (i === null ? (u.next = u) : ((u.next = i.next), (i.next = u)), (a.pending = u));
      }
      n !== 0 && Ss(e, u, n);
    }
  }
  function Vu(t, l, e, a) {
    ((ml[ea++] = t),
      (ml[ea++] = l),
      (ml[ea++] = e),
      (ml[ea++] = a),
      (Ai |= a),
      (t.lanes |= a),
      (t = t.alternate),
      t !== null && (t.lanes |= a));
  }
  function _i(t, l, e, a) {
    return (Vu(t, l, e, a), wu(t));
  }
  function De(t, l) {
    return (Vu(t, null, null, l), wu(t));
  }
  function Ss(t, l, e) {
    t.lanes |= e;
    var a = t.alternate;
    a !== null && (a.lanes |= e);
    for (var u = !1, n = t.return; n !== null; )
      ((n.childLanes |= e),
        (a = n.alternate),
        a !== null && (a.childLanes |= e),
        n.tag === 22 && ((t = n.stateNode), t === null || t._visibility & 1 || (u = !0)),
        (t = n),
        (n = n.return));
    return t.tag === 3
      ? ((n = t.stateNode),
        u &&
          l !== null &&
          ((u = 31 - al(e)),
          (t = n.hiddenUpdates),
          (a = t[u]),
          a === null ? (t[u] = [l]) : a.push(l),
          (l.lane = e | 536870912)),
        n)
      : null;
  }
  function wu(t) {
    if (50 < ru) throw ((ru = 0), (Hc = null), Error(r(185)));
    for (var l = t.return; l !== null; ) ((t = l), (l = t.return));
    return t.tag === 3 ? t.stateNode : null;
  }
  var aa = {};
  function Xd(t, l, e, a) {
    ((this.tag = t),
      (this.key = e),
      (this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null),
      (this.index = 0),
      (this.refCleanup = this.ref = null),
      (this.pendingProps = l),
      (this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null),
      (this.mode = a),
      (this.subtreeFlags = this.flags = 0),
      (this.deletions = null),
      (this.childLanes = this.lanes = 0),
      (this.alternate = null));
  }
  function nl(t, l, e, a) {
    return new Xd(t, l, e, a);
  }
  function Mi(t) {
    return ((t = t.prototype), !(!t || !t.isReactComponent));
  }
  function Rl(t, l) {
    var e = t.alternate;
    return (
      e === null
        ? ((e = nl(t.tag, l, t.key, t.mode)),
          (e.elementType = t.elementType),
          (e.type = t.type),
          (e.stateNode = t.stateNode),
          (e.alternate = t),
          (t.alternate = e))
        : ((e.pendingProps = l), (e.type = t.type), (e.flags = 0), (e.subtreeFlags = 0), (e.deletions = null)),
      (e.flags = t.flags & 65011712),
      (e.childLanes = t.childLanes),
      (e.lanes = t.lanes),
      (e.child = t.child),
      (e.memoizedProps = t.memoizedProps),
      (e.memoizedState = t.memoizedState),
      (e.updateQueue = t.updateQueue),
      (l = t.dependencies),
      (e.dependencies = l === null ? null : { lanes: l.lanes, firstContext: l.firstContext }),
      (e.sibling = t.sibling),
      (e.index = t.index),
      (e.ref = t.ref),
      (e.refCleanup = t.refCleanup),
      e
    );
  }
  function ps(t, l) {
    t.flags &= 65011714;
    var e = t.alternate;
    return (
      e === null
        ? ((t.childLanes = 0),
          (t.lanes = l),
          (t.child = null),
          (t.subtreeFlags = 0),
          (t.memoizedProps = null),
          (t.memoizedState = null),
          (t.updateQueue = null),
          (t.dependencies = null),
          (t.stateNode = null))
        : ((t.childLanes = e.childLanes),
          (t.lanes = e.lanes),
          (t.child = e.child),
          (t.subtreeFlags = 0),
          (t.deletions = null),
          (t.memoizedProps = e.memoizedProps),
          (t.memoizedState = e.memoizedState),
          (t.updateQueue = e.updateQueue),
          (t.type = e.type),
          (l = e.dependencies),
          (t.dependencies = l === null ? null : { lanes: l.lanes, firstContext: l.firstContext })),
      t
    );
  }
  function Ku(t, l, e, a, u, n) {
    var i = 0;
    if (((a = t), typeof t == 'function')) Mi(t) && (i = 1);
    else if (typeof t == 'string') i = wm(t, e, C.current) ? 26 : t === 'html' || t === 'head' || t === 'body' ? 27 : 5;
    else
      t: switch (t) {
        case _l:
          return ((t = nl(31, e, l, u)), (t.elementType = _l), (t.lanes = n), t);
        case Ct:
          return Ne(e.children, u, n, l);
        case tl:
          ((i = 8), (u |= 24));
          break;
        case Q:
          return ((t = nl(12, e, l, u | 2)), (t.elementType = Q), (t.lanes = n), t);
        case zt:
          return ((t = nl(13, e, l, u)), (t.elementType = zt), (t.lanes = n), t);
        case Rt:
          return ((t = nl(19, e, l, u)), (t.elementType = Rt), (t.lanes = n), t);
        default:
          if (typeof t == 'object' && t !== null)
            switch (t.$$typeof) {
              case D:
                i = 10;
                break t;
              case X:
                i = 9;
                break t;
              case U:
                i = 11;
                break t;
              case k:
                i = 14;
                break t;
              case St:
                ((i = 16), (a = null));
                break t;
            }
          ((i = 29), (e = Error(r(130, t === null ? 'null' : typeof t, ''))), (a = null));
      }
    return ((l = nl(i, e, l, u)), (l.elementType = t), (l.type = a), (l.lanes = n), l);
  }
  function Ne(t, l, e, a) {
    return ((t = nl(7, t, a, l)), (t.lanes = e), t);
  }
  function xi(t, l, e) {
    return ((t = nl(6, t, null, l)), (t.lanes = e), t);
  }
  function Es(t) {
    var l = nl(18, null, null, 0);
    return ((l.stateNode = t), l);
  }
  function Oi(t, l, e) {
    return (
      (l = nl(4, t.children !== null ? t.children : [], t.key, l)),
      (l.lanes = e),
      (l.stateNode = { containerInfo: t.containerInfo, pendingChildren: null, implementation: t.implementation }),
      l
    );
  }
  var zs = new WeakMap();
  function hl(t, l) {
    if (typeof t == 'object' && t !== null) {
      var e = zs.get(t);
      return e !== void 0 ? e : ((l = { value: t, source: l, stack: Ef(l) }), zs.set(t, l), l);
    }
    return { value: t, source: l, stack: Ef(l) };
  }
  var ua = [],
    na = 0,
    Ju = null,
    Va = 0,
    yl = [],
    vl = 0,
    Pl = null,
    xl = 1,
    Ol = '';
  function ql(t, l) {
    ((ua[na++] = Va), (ua[na++] = Ju), (Ju = t), (Va = l));
  }
  function Ts(t, l, e) {
    ((yl[vl++] = xl), (yl[vl++] = Ol), (yl[vl++] = Pl), (Pl = t));
    var a = xl;
    t = Ol;
    var u = 32 - al(a) - 1;
    ((a &= ~(1 << u)), (e += 1));
    var n = 32 - al(l) + u;
    if (30 < n) {
      var i = u - (u % 5);
      ((n = (a & ((1 << i) - 1)).toString(32)),
        (a >>= i),
        (u -= i),
        (xl = (1 << (32 - al(l) + u)) | (e << u) | a),
        (Ol = n + t));
    } else ((xl = (1 << n) | (e << u) | a), (Ol = t));
  }
  function Di(t) {
    t.return !== null && (ql(t, 1), Ts(t, 1, 0));
  }
  function Ni(t) {
    for (; t === Ju; ) ((Ju = ua[--na]), (ua[na] = null), (Va = ua[--na]), (ua[na] = null));
    for (; t === Pl; )
      ((Pl = yl[--vl]), (yl[vl] = null), (Ol = yl[--vl]), (yl[vl] = null), (xl = yl[--vl]), (yl[vl] = null));
  }
  function As(t, l) {
    ((yl[vl++] = xl), (yl[vl++] = Ol), (yl[vl++] = Pl), (xl = l.id), (Ol = l.overflow), (Pl = t));
  }
  var Gt = null,
    gt = null,
    et = !1,
    te = null,
    gl = !1,
    Ui = Error(r(519));
  function le(t) {
    var l = Error(r(418, 1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? 'text' : 'HTML', ''));
    throw (wa(hl(l, t)), Ui);
  }
  function _s(t) {
    var l = t.stateNode,
      e = t.type,
      a = t.memoizedProps;
    switch (((l[Yt] = t), (l[Jt] = a), e)) {
      case 'dialog':
        (P('cancel', l), P('close', l));
        break;
      case 'iframe':
      case 'object':
      case 'embed':
        P('load', l);
        break;
      case 'video':
      case 'audio':
        for (e = 0; e < mu.length; e++) P(mu[e], l);
        break;
      case 'source':
        P('error', l);
        break;
      case 'img':
      case 'image':
      case 'link':
        (P('error', l), P('load', l));
        break;
      case 'details':
        P('toggle', l);
        break;
      case 'input':
        (P('invalid', l), Yf(l, a.value, a.defaultValue, a.checked, a.defaultChecked, a.type, a.name, !0));
        break;
      case 'select':
        P('invalid', l);
        break;
      case 'textarea':
        (P('invalid', l), Xf(l, a.value, a.defaultValue, a.children));
    }
    ((e = a.children),
      (typeof e != 'string' && typeof e != 'number' && typeof e != 'bigint') ||
      l.textContent === '' + e ||
      a.suppressHydrationWarning === !0 ||
      Zr(l.textContent, e)
        ? (a.popover != null && (P('beforetoggle', l), P('toggle', l)),
          a.onScroll != null && P('scroll', l),
          a.onScrollEnd != null && P('scrollend', l),
          a.onClick != null && (l.onclick = Cl),
          (l = !0))
        : (l = !1),
      l || le(t, !0));
  }
  function Ms(t) {
    for (Gt = t.return; Gt; )
      switch (Gt.tag) {
        case 5:
        case 31:
        case 13:
          gl = !1;
          return;
        case 27:
        case 3:
          gl = !0;
          return;
        default:
          Gt = Gt.return;
      }
  }
  function ia(t) {
    if (t !== Gt) return !1;
    if (!et) return (Ms(t), (et = !0), !1);
    var l = t.tag,
      e;
    if (
      ((e = l !== 3 && l !== 27) &&
        ((e = l === 5) && ((e = t.type), (e = !(e !== 'form' && e !== 'button') || $c(t.type, t.memoizedProps))),
        (e = !e)),
      e && gt && le(t),
      Ms(t),
      l === 13)
    ) {
      if (((t = t.memoizedState), (t = t !== null ? t.dehydrated : null), !t)) throw Error(r(317));
      gt = Ir(t);
    } else if (l === 31) {
      if (((t = t.memoizedState), (t = t !== null ? t.dehydrated : null), !t)) throw Error(r(317));
      gt = Ir(t);
    } else
      l === 27
        ? ((l = gt), ye(t.type) ? ((t = tf), (tf = null), (gt = t)) : (gt = l))
        : (gt = Gt ? Sl(t.stateNode.nextSibling) : null);
    return !0;
  }
  function Ue() {
    ((gt = Gt = null), (et = !1));
  }
  function ji() {
    var t = te;
    return (t !== null && (It === null ? (It = t) : It.push.apply(It, t), (te = null)), t);
  }
  function wa(t) {
    te === null ? (te = [t]) : te.push(t);
  }
  var Ci = o(null),
    je = null,
    Bl = null;
  function ee(t, l, e) {
    (O(Ci, l._currentValue), (l._currentValue = e));
  }
  function Yl(t) {
    ((t._currentValue = Ci.current), T(Ci));
  }
  function Hi(t, l, e) {
    for (; t !== null; ) {
      var a = t.alternate;
      if (
        ((t.childLanes & l) !== l
          ? ((t.childLanes |= l), a !== null && (a.childLanes |= l))
          : a !== null && (a.childLanes & l) !== l && (a.childLanes |= l),
        t === e)
      )
        break;
      t = t.return;
    }
  }
  function Ri(t, l, e, a) {
    var u = t.child;
    for (u !== null && (u.return = t); u !== null; ) {
      var n = u.dependencies;
      if (n !== null) {
        var i = u.child;
        n = n.firstContext;
        t: for (; n !== null; ) {
          var c = n;
          n = u;
          for (var f = 0; f < l.length; f++)
            if (c.context === l[f]) {
              ((n.lanes |= e), (c = n.alternate), c !== null && (c.lanes |= e), Hi(n.return, e, t), a || (i = null));
              break t;
            }
          n = c.next;
        }
      } else if (u.tag === 18) {
        if (((i = u.return), i === null)) throw Error(r(341));
        ((i.lanes |= e), (n = i.alternate), n !== null && (n.lanes |= e), Hi(i, e, t), (i = null));
      } else i = u.child;
      if (i !== null) i.return = u;
      else
        for (i = u; i !== null; ) {
          if (i === t) {
            i = null;
            break;
          }
          if (((u = i.sibling), u !== null)) {
            ((u.return = i.return), (i = u));
            break;
          }
          i = i.return;
        }
      u = i;
    }
  }
  function ca(t, l, e, a) {
    t = null;
    for (var u = l, n = !1; u !== null; ) {
      if (!n) {
        if ((u.flags & 524288) !== 0) n = !0;
        else if ((u.flags & 262144) !== 0) break;
      }
      if (u.tag === 10) {
        var i = u.alternate;
        if (i === null) throw Error(r(387));
        if (((i = i.memoizedProps), i !== null)) {
          var c = u.type;
          ul(u.pendingProps.value, i.value) || (t !== null ? t.push(c) : (t = [c]));
        }
      } else if (u === ct.current) {
        if (((i = u.alternate), i === null)) throw Error(r(387));
        i.memoizedState.memoizedState !== u.memoizedState.memoizedState && (t !== null ? t.push(bu) : (t = [bu]));
      }
      u = u.return;
    }
    (t !== null && Ri(l, t, e, a), (l.flags |= 262144));
  }
  function ku(t) {
    for (t = t.firstContext; t !== null; ) {
      if (!ul(t.context._currentValue, t.memoizedValue)) return !0;
      t = t.next;
    }
    return !1;
  }
  function Ce(t) {
    ((je = t), (Bl = null), (t = t.dependencies), t !== null && (t.firstContext = null));
  }
  function Xt(t) {
    return xs(je, t);
  }
  function $u(t, l) {
    return (je === null && Ce(t), xs(t, l));
  }
  function xs(t, l) {
    var e = l._currentValue;
    if (((l = { context: l, memoizedValue: e, next: null }), Bl === null)) {
      if (t === null) throw Error(r(308));
      ((Bl = l), (t.dependencies = { lanes: 0, firstContext: l }), (t.flags |= 524288));
    } else Bl = Bl.next = l;
    return e;
  }
  var Qd =
      typeof AbortController < 'u'
        ? AbortController
        : function () {
            var t = [],
              l = (this.signal = {
                aborted: !1,
                addEventListener: function (e, a) {
                  t.push(a);
                },
              });
            this.abort = function () {
              ((l.aborted = !0),
                t.forEach(function (e) {
                  return e();
                }));
            };
          },
    Ld = z.unstable_scheduleCallback,
    Zd = z.unstable_NormalPriority,
    Ot = { $$typeof: D, Consumer: null, Provider: null, _currentValue: null, _currentValue2: null, _threadCount: 0 };
  function qi() {
    return { controller: new Qd(), data: new Map(), refCount: 0 };
  }
  function Ka(t) {
    (t.refCount--,
      t.refCount === 0 &&
        Ld(Zd, function () {
          t.controller.abort();
        }));
  }
  var Ja = null,
    Bi = 0,
    fa = 0,
    sa = null;
  function Vd(t, l) {
    if (Ja === null) {
      var e = (Ja = []);
      ((Bi = 0),
        (fa = Xc()),
        (sa = {
          status: 'pending',
          value: void 0,
          then: function (a) {
            e.push(a);
          },
        }));
    }
    return (Bi++, l.then(Os, Os), l);
  }
  function Os() {
    if (--Bi === 0 && Ja !== null) {
      sa !== null && (sa.status = 'fulfilled');
      var t = Ja;
      ((Ja = null), (fa = 0), (sa = null));
      for (var l = 0; l < t.length; l++) (0, t[l])();
    }
  }
  function wd(t, l) {
    var e = [],
      a = {
        status: 'pending',
        value: null,
        reason: null,
        then: function (u) {
          e.push(u);
        },
      };
    return (
      t.then(
        function () {
          ((a.status = 'fulfilled'), (a.value = l));
          for (var u = 0; u < e.length; u++) (0, e[u])(l);
        },
        function (u) {
          for (a.status = 'rejected', a.reason = u, u = 0; u < e.length; u++) (0, e[u])(void 0);
        }
      ),
      a
    );
  }
  var Ds = b.S;
  b.S = function (t, l) {
    ((mr = ll()),
      typeof l == 'object' && l !== null && typeof l.then == 'function' && Vd(t, l),
      Ds !== null && Ds(t, l));
  };
  var He = o(null);
  function Yi() {
    var t = He.current;
    return t !== null ? t : vt.pooledCache;
  }
  function Wu(t, l) {
    l === null ? O(He, He.current) : O(He, l.pool);
  }
  function Ns() {
    var t = Yi();
    return t === null ? null : { parent: Ot._currentValue, pool: t };
  }
  var oa = Error(r(460)),
    Gi = Error(r(474)),
    Fu = Error(r(542)),
    Iu = { then: function () {} };
  function Us(t) {
    return ((t = t.status), t === 'fulfilled' || t === 'rejected');
  }
  function js(t, l, e) {
    switch (((e = t[e]), e === void 0 ? t.push(l) : e !== l && (l.then(Cl, Cl), (l = e)), l.status)) {
      case 'fulfilled':
        return l.value;
      case 'rejected':
        throw ((t = l.reason), Hs(t), t);
      default:
        if (typeof l.status == 'string') l.then(Cl, Cl);
        else {
          if (((t = vt), t !== null && 100 < t.shellSuspendCounter)) throw Error(r(482));
          ((t = l),
            (t.status = 'pending'),
            t.then(
              function (a) {
                if (l.status === 'pending') {
                  var u = l;
                  ((u.status = 'fulfilled'), (u.value = a));
                }
              },
              function (a) {
                if (l.status === 'pending') {
                  var u = l;
                  ((u.status = 'rejected'), (u.reason = a));
                }
              }
            ));
        }
        switch (l.status) {
          case 'fulfilled':
            return l.value;
          case 'rejected':
            throw ((t = l.reason), Hs(t), t);
        }
        throw ((qe = l), oa);
    }
  }
  function Re(t) {
    try {
      var l = t._init;
      return l(t._payload);
    } catch (e) {
      throw e !== null && typeof e == 'object' && typeof e.then == 'function' ? ((qe = e), oa) : e;
    }
  }
  var qe = null;
  function Cs() {
    if (qe === null) throw Error(r(459));
    var t = qe;
    return ((qe = null), t);
  }
  function Hs(t) {
    if (t === oa || t === Fu) throw Error(r(483));
  }
  var ra = null,
    ka = 0;
  function Pu(t) {
    var l = ka;
    return ((ka += 1), ra === null && (ra = []), js(ra, t, l));
  }
  function $a(t, l) {
    ((l = l.props.ref), (t.ref = l !== void 0 ? l : null));
  }
  function tn(t, l) {
    throw l.$$typeof === W
      ? Error(r(525))
      : ((t = Object.prototype.toString.call(l)),
        Error(r(31, t === '[object Object]' ? 'object with keys {' + Object.keys(l).join(', ') + '}' : t)));
  }
  function Rs(t) {
    function l(d, s) {
      if (t) {
        var m = d.deletions;
        m === null ? ((d.deletions = [s]), (d.flags |= 16)) : m.push(s);
      }
    }
    function e(d, s) {
      if (!t) return null;
      for (; s !== null; ) (l(d, s), (s = s.sibling));
      return null;
    }
    function a(d) {
      for (var s = new Map(); d !== null; ) (d.key !== null ? s.set(d.key, d) : s.set(d.index, d), (d = d.sibling));
      return s;
    }
    function u(d, s) {
      return ((d = Rl(d, s)), (d.index = 0), (d.sibling = null), d);
    }
    function n(d, s, m) {
      return (
        (d.index = m),
        t
          ? ((m = d.alternate),
            m !== null ? ((m = m.index), m < s ? ((d.flags |= 67108866), s) : m) : ((d.flags |= 67108866), s))
          : ((d.flags |= 1048576), s)
      );
    }
    function i(d) {
      return (t && d.alternate === null && (d.flags |= 67108866), d);
    }
    function c(d, s, m, S) {
      return s === null || s.tag !== 6
        ? ((s = xi(m, d.mode, S)), (s.return = d), s)
        : ((s = u(s, m)), (s.return = d), s);
    }
    function f(d, s, m, S) {
      var q = m.type;
      return q === Ct
        ? g(d, s, m.props.children, S, m.key)
        : s !== null &&
            (s.elementType === q || (typeof q == 'object' && q !== null && q.$$typeof === St && Re(q) === s.type))
          ? ((s = u(s, m.props)), $a(s, m), (s.return = d), s)
          : ((s = Ku(m.type, m.key, m.props, null, d.mode, S)), $a(s, m), (s.return = d), s);
    }
    function h(d, s, m, S) {
      return s === null ||
        s.tag !== 4 ||
        s.stateNode.containerInfo !== m.containerInfo ||
        s.stateNode.implementation !== m.implementation
        ? ((s = Oi(m, d.mode, S)), (s.return = d), s)
        : ((s = u(s, m.children || [])), (s.return = d), s);
    }
    function g(d, s, m, S, q) {
      return s === null || s.tag !== 7
        ? ((s = Ne(m, d.mode, S, q)), (s.return = d), s)
        : ((s = u(s, m)), (s.return = d), s);
    }
    function E(d, s, m) {
      if ((typeof s == 'string' && s !== '') || typeof s == 'number' || typeof s == 'bigint')
        return ((s = xi('' + s, d.mode, m)), (s.return = d), s);
      if (typeof s == 'object' && s !== null) {
        switch (s.$$typeof) {
          case jt:
            return ((m = Ku(s.type, s.key, s.props, null, d.mode, m)), $a(m, s), (m.return = d), m);
          case Et:
            return ((s = Oi(s, d.mode, m)), (s.return = d), s);
          case St:
            return ((s = Re(s)), E(d, s, m));
        }
        if (El(s) || Kt(s)) return ((s = Ne(s, d.mode, m, null)), (s.return = d), s);
        if (typeof s.then == 'function') return E(d, Pu(s), m);
        if (s.$$typeof === D) return E(d, $u(d, s), m);
        tn(d, s);
      }
      return null;
    }
    function y(d, s, m, S) {
      var q = s !== null ? s.key : null;
      if ((typeof m == 'string' && m !== '') || typeof m == 'number' || typeof m == 'bigint')
        return q !== null ? null : c(d, s, '' + m, S);
      if (typeof m == 'object' && m !== null) {
        switch (m.$$typeof) {
          case jt:
            return m.key === q ? f(d, s, m, S) : null;
          case Et:
            return m.key === q ? h(d, s, m, S) : null;
          case St:
            return ((m = Re(m)), y(d, s, m, S));
        }
        if (El(m) || Kt(m)) return q !== null ? null : g(d, s, m, S, null);
        if (typeof m.then == 'function') return y(d, s, Pu(m), S);
        if (m.$$typeof === D) return y(d, s, $u(d, m), S);
        tn(d, m);
      }
      return null;
    }
    function v(d, s, m, S, q) {
      if ((typeof S == 'string' && S !== '') || typeof S == 'number' || typeof S == 'bigint')
        return ((d = d.get(m) || null), c(s, d, '' + S, q));
      if (typeof S == 'object' && S !== null) {
        switch (S.$$typeof) {
          case jt:
            return ((d = d.get(S.key === null ? m : S.key) || null), f(s, d, S, q));
          case Et:
            return ((d = d.get(S.key === null ? m : S.key) || null), h(s, d, S, q));
          case St:
            return ((S = Re(S)), v(d, s, m, S, q));
        }
        if (El(S) || Kt(S)) return ((d = d.get(m) || null), g(s, d, S, q, null));
        if (typeof S.then == 'function') return v(d, s, m, Pu(S), q);
        if (S.$$typeof === D) return v(d, s, m, $u(s, S), q);
        tn(s, S);
      }
      return null;
    }
    function N(d, s, m, S) {
      for (var q = null, at = null, H = s, K = (s = 0), lt = null; H !== null && K < m.length; K++) {
        H.index > K ? ((lt = H), (H = null)) : (lt = H.sibling);
        var ut = y(d, H, m[K], S);
        if (ut === null) {
          H === null && (H = lt);
          break;
        }
        (t && H && ut.alternate === null && l(d, H),
          (s = n(ut, s, K)),
          at === null ? (q = ut) : (at.sibling = ut),
          (at = ut),
          (H = lt));
      }
      if (K === m.length) return (e(d, H), et && ql(d, K), q);
      if (H === null) {
        for (; K < m.length; K++)
          ((H = E(d, m[K], S)), H !== null && ((s = n(H, s, K)), at === null ? (q = H) : (at.sibling = H), (at = H)));
        return (et && ql(d, K), q);
      }
      for (H = a(H); K < m.length; K++)
        ((lt = v(H, d, K, m[K], S)),
          lt !== null &&
            (t && lt.alternate !== null && H.delete(lt.key === null ? K : lt.key),
            (s = n(lt, s, K)),
            at === null ? (q = lt) : (at.sibling = lt),
            (at = lt)));
      return (
        t &&
          H.forEach(function (pe) {
            return l(d, pe);
          }),
        et && ql(d, K),
        q
      );
    }
    function B(d, s, m, S) {
      if (m == null) throw Error(r(151));
      for (
        var q = null, at = null, H = s, K = (s = 0), lt = null, ut = m.next();
        H !== null && !ut.done;
        K++, ut = m.next()
      ) {
        H.index > K ? ((lt = H), (H = null)) : (lt = H.sibling);
        var pe = y(d, H, ut.value, S);
        if (pe === null) {
          H === null && (H = lt);
          break;
        }
        (t && H && pe.alternate === null && l(d, H),
          (s = n(pe, s, K)),
          at === null ? (q = pe) : (at.sibling = pe),
          (at = pe),
          (H = lt));
      }
      if (ut.done) return (e(d, H), et && ql(d, K), q);
      if (H === null) {
        for (; !ut.done; K++, ut = m.next())
          ((ut = E(d, ut.value, S)),
            ut !== null && ((s = n(ut, s, K)), at === null ? (q = ut) : (at.sibling = ut), (at = ut)));
        return (et && ql(d, K), q);
      }
      for (H = a(H); !ut.done; K++, ut = m.next())
        ((ut = v(H, d, K, ut.value, S)),
          ut !== null &&
            (t && ut.alternate !== null && H.delete(ut.key === null ? K : ut.key),
            (s = n(ut, s, K)),
            at === null ? (q = ut) : (at.sibling = ut),
            (at = ut)));
      return (
        t &&
          H.forEach(function (eh) {
            return l(d, eh);
          }),
        et && ql(d, K),
        q
      );
    }
    function ht(d, s, m, S) {
      if (
        (typeof m == 'object' && m !== null && m.type === Ct && m.key === null && (m = m.props.children),
        typeof m == 'object' && m !== null)
      ) {
        switch (m.$$typeof) {
          case jt:
            t: {
              for (var q = m.key; s !== null; ) {
                if (s.key === q) {
                  if (((q = m.type), q === Ct)) {
                    if (s.tag === 7) {
                      (e(d, s.sibling), (S = u(s, m.props.children)), (S.return = d), (d = S));
                      break t;
                    }
                  } else if (
                    s.elementType === q ||
                    (typeof q == 'object' && q !== null && q.$$typeof === St && Re(q) === s.type)
                  ) {
                    (e(d, s.sibling), (S = u(s, m.props)), $a(S, m), (S.return = d), (d = S));
                    break t;
                  }
                  e(d, s);
                  break;
                } else l(d, s);
                s = s.sibling;
              }
              m.type === Ct
                ? ((S = Ne(m.props.children, d.mode, S, m.key)), (S.return = d), (d = S))
                : ((S = Ku(m.type, m.key, m.props, null, d.mode, S)), $a(S, m), (S.return = d), (d = S));
            }
            return i(d);
          case Et:
            t: {
              for (q = m.key; s !== null; ) {
                if (s.key === q)
                  if (
                    s.tag === 4 &&
                    s.stateNode.containerInfo === m.containerInfo &&
                    s.stateNode.implementation === m.implementation
                  ) {
                    (e(d, s.sibling), (S = u(s, m.children || [])), (S.return = d), (d = S));
                    break t;
                  } else {
                    e(d, s);
                    break;
                  }
                else l(d, s);
                s = s.sibling;
              }
              ((S = Oi(m, d.mode, S)), (S.return = d), (d = S));
            }
            return i(d);
          case St:
            return ((m = Re(m)), ht(d, s, m, S));
        }
        if (El(m)) return N(d, s, m, S);
        if (Kt(m)) {
          if (((q = Kt(m)), typeof q != 'function')) throw Error(r(150));
          return ((m = q.call(m)), B(d, s, m, S));
        }
        if (typeof m.then == 'function') return ht(d, s, Pu(m), S);
        if (m.$$typeof === D) return ht(d, s, $u(d, m), S);
        tn(d, m);
      }
      return (typeof m == 'string' && m !== '') || typeof m == 'number' || typeof m == 'bigint'
        ? ((m = '' + m),
          s !== null && s.tag === 6
            ? (e(d, s.sibling), (S = u(s, m)), (S.return = d), (d = S))
            : (e(d, s), (S = xi(m, d.mode, S)), (S.return = d), (d = S)),
          i(d))
        : e(d, s);
    }
    return function (d, s, m, S) {
      try {
        ka = 0;
        var q = ht(d, s, m, S);
        return ((ra = null), q);
      } catch (H) {
        if (H === oa || H === Fu) throw H;
        var at = nl(29, H, null, d.mode);
        return ((at.lanes = S), (at.return = d), at);
      } finally {
      }
    };
  }
  var Be = Rs(!0),
    qs = Rs(!1),
    ae = !1;
  function Xi(t) {
    t.updateQueue = {
      baseState: t.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null,
    };
  }
  function Qi(t, l) {
    ((t = t.updateQueue),
      l.updateQueue === t &&
        (l.updateQueue = {
          baseState: t.baseState,
          firstBaseUpdate: t.firstBaseUpdate,
          lastBaseUpdate: t.lastBaseUpdate,
          shared: t.shared,
          callbacks: null,
        }));
  }
  function ue(t) {
    return { lane: t, tag: 0, payload: null, callback: null, next: null };
  }
  function ne(t, l, e) {
    var a = t.updateQueue;
    if (a === null) return null;
    if (((a = a.shared), (nt & 2) !== 0)) {
      var u = a.pending;
      return (
        u === null ? (l.next = l) : ((l.next = u.next), (u.next = l)),
        (a.pending = l),
        (l = wu(t)),
        Ss(t, null, e),
        l
      );
    }
    return (Vu(t, a, l, e), wu(t));
  }
  function Wa(t, l, e) {
    if (((l = l.updateQueue), l !== null && ((l = l.shared), (e & 4194048) !== 0))) {
      var a = l.lanes;
      ((a &= t.pendingLanes), (e |= a), (l.lanes = e), xf(t, e));
    }
  }
  function Li(t, l) {
    var e = t.updateQueue,
      a = t.alternate;
    if (a !== null && ((a = a.updateQueue), e === a)) {
      var u = null,
        n = null;
      if (((e = e.firstBaseUpdate), e !== null)) {
        do {
          var i = { lane: e.lane, tag: e.tag, payload: e.payload, callback: null, next: null };
          (n === null ? (u = n = i) : (n = n.next = i), (e = e.next));
        } while (e !== null);
        n === null ? (u = n = l) : (n = n.next = l);
      } else u = n = l;
      ((e = {
        baseState: a.baseState,
        firstBaseUpdate: u,
        lastBaseUpdate: n,
        shared: a.shared,
        callbacks: a.callbacks,
      }),
        (t.updateQueue = e));
      return;
    }
    ((t = e.lastBaseUpdate), t === null ? (e.firstBaseUpdate = l) : (t.next = l), (e.lastBaseUpdate = l));
  }
  var Zi = !1;
  function Fa() {
    if (Zi) {
      var t = sa;
      if (t !== null) throw t;
    }
  }
  function Ia(t, l, e, a) {
    Zi = !1;
    var u = t.updateQueue;
    ae = !1;
    var n = u.firstBaseUpdate,
      i = u.lastBaseUpdate,
      c = u.shared.pending;
    if (c !== null) {
      u.shared.pending = null;
      var f = c,
        h = f.next;
      ((f.next = null), i === null ? (n = h) : (i.next = h), (i = f));
      var g = t.alternate;
      g !== null &&
        ((g = g.updateQueue),
        (c = g.lastBaseUpdate),
        c !== i && (c === null ? (g.firstBaseUpdate = h) : (c.next = h), (g.lastBaseUpdate = f)));
    }
    if (n !== null) {
      var E = u.baseState;
      ((i = 0), (g = h = f = null), (c = n));
      do {
        var y = c.lane & -536870913,
          v = y !== c.lane;
        if (v ? (tt & y) === y : (a & y) === y) {
          (y !== 0 && y === fa && (Zi = !0),
            g !== null && (g = g.next = { lane: 0, tag: c.tag, payload: c.payload, callback: null, next: null }));
          t: {
            var N = t,
              B = c;
            y = l;
            var ht = e;
            switch (B.tag) {
              case 1:
                if (((N = B.payload), typeof N == 'function')) {
                  E = N.call(ht, E, y);
                  break t;
                }
                E = N;
                break t;
              case 3:
                N.flags = (N.flags & -65537) | 128;
              case 0:
                if (((N = B.payload), (y = typeof N == 'function' ? N.call(ht, E, y) : N), y == null)) break t;
                E = R({}, E, y);
                break t;
              case 2:
                ae = !0;
            }
          }
          ((y = c.callback),
            y !== null &&
              ((t.flags |= 64),
              v && (t.flags |= 8192),
              (v = u.callbacks),
              v === null ? (u.callbacks = [y]) : v.push(y)));
        } else
          ((v = { lane: y, tag: c.tag, payload: c.payload, callback: c.callback, next: null }),
            g === null ? ((h = g = v), (f = E)) : (g = g.next = v),
            (i |= y));
        if (((c = c.next), c === null)) {
          if (((c = u.shared.pending), c === null)) break;
          ((v = c), (c = v.next), (v.next = null), (u.lastBaseUpdate = v), (u.shared.pending = null));
        }
      } while (!0);
      (g === null && (f = E),
        (u.baseState = f),
        (u.firstBaseUpdate = h),
        (u.lastBaseUpdate = g),
        n === null && (u.shared.lanes = 0),
        (oe |= i),
        (t.lanes = i),
        (t.memoizedState = E));
    }
  }
  function Bs(t, l) {
    if (typeof t != 'function') throw Error(r(191, t));
    t.call(l);
  }
  function Ys(t, l) {
    var e = t.callbacks;
    if (e !== null) for (t.callbacks = null, t = 0; t < e.length; t++) Bs(e[t], l);
  }
  var da = o(null),
    ln = o(0);
  function Gs(t, l) {
    ((t = Jl), O(ln, t), O(da, l), (Jl = t | l.baseLanes));
  }
  function Vi() {
    (O(ln, Jl), O(da, da.current));
  }
  function wi() {
    ((Jl = ln.current), T(da), T(ln));
  }
  var il = o(null),
    bl = null;
  function ie(t) {
    var l = t.alternate;
    (O(Mt, Mt.current & 1),
      O(il, t),
      bl === null && (l === null || da.current !== null || l.memoizedState !== null) && (bl = t));
  }
  function Ki(t) {
    (O(Mt, Mt.current), O(il, t), bl === null && (bl = t));
  }
  function Xs(t) {
    t.tag === 22 ? (O(Mt, Mt.current), O(il, t), bl === null && (bl = t)) : ce();
  }
  function ce() {
    (O(Mt, Mt.current), O(il, il.current));
  }
  function cl(t) {
    (T(il), bl === t && (bl = null), T(Mt));
  }
  var Mt = o(0);
  function en(t) {
    for (var l = t; l !== null; ) {
      if (l.tag === 13) {
        var e = l.memoizedState;
        if (e !== null && ((e = e.dehydrated), e === null || Ic(e) || Pc(e))) return l;
      } else if (
        l.tag === 19 &&
        (l.memoizedProps.revealOrder === 'forwards' ||
          l.memoizedProps.revealOrder === 'backwards' ||
          l.memoizedProps.revealOrder === 'unstable_legacy-backwards' ||
          l.memoizedProps.revealOrder === 'together')
      ) {
        if ((l.flags & 128) !== 0) return l;
      } else if (l.child !== null) {
        ((l.child.return = l), (l = l.child));
        continue;
      }
      if (l === t) break;
      for (; l.sibling === null; ) {
        if (l.return === null || l.return === t) return null;
        l = l.return;
      }
      ((l.sibling.return = l.return), (l = l.sibling));
    }
    return null;
  }
  var Gl = 0,
    w = null,
    dt = null,
    Dt = null,
    an = !1,
    ma = !1,
    Ye = !1,
    un = 0,
    Pa = 0,
    ha = null,
    Kd = 0;
  function Tt() {
    throw Error(r(321));
  }
  function Ji(t, l) {
    if (l === null) return !1;
    for (var e = 0; e < l.length && e < t.length; e++) if (!ul(t[e], l[e])) return !1;
    return !0;
  }
  function ki(t, l, e, a, u, n) {
    return (
      (Gl = n),
      (w = l),
      (l.memoizedState = null),
      (l.updateQueue = null),
      (l.lanes = 0),
      (b.H = t === null || t.memoizedState === null ? Ao : sc),
      (Ye = !1),
      (n = e(a, u)),
      (Ye = !1),
      ma && (n = Ls(l, e, a, u)),
      Qs(t),
      n
    );
  }
  function Qs(t) {
    b.H = eu;
    var l = dt !== null && dt.next !== null;
    if (((Gl = 0), (Dt = dt = w = null), (an = !1), (Pa = 0), (ha = null), l)) throw Error(r(300));
    t === null || Nt || ((t = t.dependencies), t !== null && ku(t) && (Nt = !0));
  }
  function Ls(t, l, e, a) {
    w = t;
    var u = 0;
    do {
      if ((ma && (ha = null), (Pa = 0), (ma = !1), 25 <= u)) throw Error(r(301));
      if (((u += 1), (Dt = dt = null), t.updateQueue != null)) {
        var n = t.updateQueue;
        ((n.lastEffect = null), (n.events = null), (n.stores = null), n.memoCache != null && (n.memoCache.index = 0));
      }
      ((b.H = _o), (n = l(e, a)));
    } while (ma);
    return n;
  }
  function Jd() {
    var t = b.H,
      l = t.useState()[0];
    return (
      (l = typeof l.then == 'function' ? tu(l) : l),
      (t = t.useState()[0]),
      (dt !== null ? dt.memoizedState : null) !== t && (w.flags |= 1024),
      l
    );
  }
  function $i() {
    var t = un !== 0;
    return ((un = 0), t);
  }
  function Wi(t, l, e) {
    ((l.updateQueue = t.updateQueue), (l.flags &= -2053), (t.lanes &= ~e));
  }
  function Fi(t) {
    if (an) {
      for (t = t.memoizedState; t !== null; ) {
        var l = t.queue;
        (l !== null && (l.pending = null), (t = t.next));
      }
      an = !1;
    }
    ((Gl = 0), (Dt = dt = w = null), (ma = !1), (Pa = un = 0), (ha = null));
  }
  function wt() {
    var t = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return (Dt === null ? (w.memoizedState = Dt = t) : (Dt = Dt.next = t), Dt);
  }
  function xt() {
    if (dt === null) {
      var t = w.alternate;
      t = t !== null ? t.memoizedState : null;
    } else t = dt.next;
    var l = Dt === null ? w.memoizedState : Dt.next;
    if (l !== null) ((Dt = l), (dt = t));
    else {
      if (t === null) throw w.alternate === null ? Error(r(467)) : Error(r(310));
      ((dt = t),
        (t = {
          memoizedState: dt.memoizedState,
          baseState: dt.baseState,
          baseQueue: dt.baseQueue,
          queue: dt.queue,
          next: null,
        }),
        Dt === null ? (w.memoizedState = Dt = t) : (Dt = Dt.next = t));
    }
    return Dt;
  }
  function nn() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function tu(t) {
    var l = Pa;
    return (
      (Pa += 1),
      ha === null && (ha = []),
      (t = js(ha, t, l)),
      (l = w),
      (Dt === null ? l.memoizedState : Dt.next) === null &&
        ((l = l.alternate), (b.H = l === null || l.memoizedState === null ? Ao : sc)),
      t
    );
  }
  function cn(t) {
    if (t !== null && typeof t == 'object') {
      if (typeof t.then == 'function') return tu(t);
      if (t.$$typeof === D) return Xt(t);
    }
    throw Error(r(438, String(t)));
  }
  function Ii(t) {
    var l = null,
      e = w.updateQueue;
    if ((e !== null && (l = e.memoCache), l == null)) {
      var a = w.alternate;
      a !== null &&
        ((a = a.updateQueue),
        a !== null &&
          ((a = a.memoCache),
          a != null &&
            (l = {
              data: a.data.map(function (u) {
                return u.slice();
              }),
              index: 0,
            })));
    }
    if (
      (l == null && (l = { data: [], index: 0 }),
      e === null && ((e = nn()), (w.updateQueue = e)),
      (e.memoCache = l),
      (e = l.data[l.index]),
      e === void 0)
    )
      for (e = l.data[l.index] = Array(t), a = 0; a < t; a++) e[a] = Ze;
    return (l.index++, e);
  }
  function Xl(t, l) {
    return typeof l == 'function' ? l(t) : l;
  }
  function fn(t) {
    var l = xt();
    return Pi(l, dt, t);
  }
  function Pi(t, l, e) {
    var a = t.queue;
    if (a === null) throw Error(r(311));
    a.lastRenderedReducer = e;
    var u = t.baseQueue,
      n = a.pending;
    if (n !== null) {
      if (u !== null) {
        var i = u.next;
        ((u.next = n.next), (n.next = i));
      }
      ((l.baseQueue = u = n), (a.pending = null));
    }
    if (((n = t.baseState), u === null)) t.memoizedState = n;
    else {
      l = u.next;
      var c = (i = null),
        f = null,
        h = l,
        g = !1;
      do {
        var E = h.lane & -536870913;
        if (E !== h.lane ? (tt & E) === E : (Gl & E) === E) {
          var y = h.revertLane;
          if (y === 0)
            (f !== null &&
              (f = f.next =
                {
                  lane: 0,
                  revertLane: 0,
                  gesture: null,
                  action: h.action,
                  hasEagerState: h.hasEagerState,
                  eagerState: h.eagerState,
                  next: null,
                }),
              E === fa && (g = !0));
          else if ((Gl & y) === y) {
            ((h = h.next), y === fa && (g = !0));
            continue;
          } else
            ((E = {
              lane: 0,
              revertLane: h.revertLane,
              gesture: null,
              action: h.action,
              hasEagerState: h.hasEagerState,
              eagerState: h.eagerState,
              next: null,
            }),
              f === null ? ((c = f = E), (i = n)) : (f = f.next = E),
              (w.lanes |= y),
              (oe |= y));
          ((E = h.action), Ye && e(n, E), (n = h.hasEagerState ? h.eagerState : e(n, E)));
        } else
          ((y = {
            lane: E,
            revertLane: h.revertLane,
            gesture: h.gesture,
            action: h.action,
            hasEagerState: h.hasEagerState,
            eagerState: h.eagerState,
            next: null,
          }),
            f === null ? ((c = f = y), (i = n)) : (f = f.next = y),
            (w.lanes |= E),
            (oe |= E));
        h = h.next;
      } while (h !== null && h !== l);
      if ((f === null ? (i = n) : (f.next = c), !ul(n, t.memoizedState) && ((Nt = !0), g && ((e = sa), e !== null))))
        throw e;
      ((t.memoizedState = n), (t.baseState = i), (t.baseQueue = f), (a.lastRenderedState = n));
    }
    return (u === null && (a.lanes = 0), [t.memoizedState, a.dispatch]);
  }
  function tc(t) {
    var l = xt(),
      e = l.queue;
    if (e === null) throw Error(r(311));
    e.lastRenderedReducer = t;
    var a = e.dispatch,
      u = e.pending,
      n = l.memoizedState;
    if (u !== null) {
      e.pending = null;
      var i = (u = u.next);
      do ((n = t(n, i.action)), (i = i.next));
      while (i !== u);
      (ul(n, l.memoizedState) || (Nt = !0),
        (l.memoizedState = n),
        l.baseQueue === null && (l.baseState = n),
        (e.lastRenderedState = n));
    }
    return [n, a];
  }
  function Zs(t, l, e) {
    var a = w,
      u = xt(),
      n = et;
    if (n) {
      if (e === void 0) throw Error(r(407));
      e = e();
    } else e = l();
    var i = !ul((dt || u).memoizedState, e);
    if (
      (i && ((u.memoizedState = e), (Nt = !0)),
      (u = u.queue),
      ac(Ks.bind(null, a, u, t), [t]),
      u.getSnapshot !== l || i || (Dt !== null && Dt.memoizedState.tag & 1))
    ) {
      if (((a.flags |= 2048), ya(9, { destroy: void 0 }, ws.bind(null, a, u, e, l), null), vt === null))
        throw Error(r(349));
      n || (Gl & 127) !== 0 || Vs(a, l, e);
    }
    return e;
  }
  function Vs(t, l, e) {
    ((t.flags |= 16384),
      (t = { getSnapshot: l, value: e }),
      (l = w.updateQueue),
      l === null
        ? ((l = nn()), (w.updateQueue = l), (l.stores = [t]))
        : ((e = l.stores), e === null ? (l.stores = [t]) : e.push(t)));
  }
  function ws(t, l, e, a) {
    ((l.value = e), (l.getSnapshot = a), Js(l) && ks(t));
  }
  function Ks(t, l, e) {
    return e(function () {
      Js(l) && ks(t);
    });
  }
  function Js(t) {
    var l = t.getSnapshot;
    t = t.value;
    try {
      var e = l();
      return !ul(t, e);
    } catch {
      return !0;
    }
  }
  function ks(t) {
    var l = De(t, 2);
    l !== null && Pt(l, t, 2);
  }
  function lc(t) {
    var l = wt();
    if (typeof t == 'function') {
      var e = t;
      if (((t = e()), Ye)) {
        Wl(!0);
        try {
          e();
        } finally {
          Wl(!1);
        }
      }
    }
    return (
      (l.memoizedState = l.baseState = t),
      (l.queue = { pending: null, lanes: 0, dispatch: null, lastRenderedReducer: Xl, lastRenderedState: t }),
      l
    );
  }
  function $s(t, l, e, a) {
    return ((t.baseState = e), Pi(t, dt, typeof a == 'function' ? a : Xl));
  }
  function kd(t, l, e, a, u) {
    if (rn(t)) throw Error(r(485));
    if (((t = l.action), t !== null)) {
      var n = {
        payload: u,
        action: t,
        next: null,
        isTransition: !0,
        status: 'pending',
        value: null,
        reason: null,
        listeners: [],
        then: function (i) {
          n.listeners.push(i);
        },
      };
      (b.T !== null ? e(!0) : (n.isTransition = !1),
        a(n),
        (e = l.pending),
        e === null ? ((n.next = l.pending = n), Ws(l, n)) : ((n.next = e.next), (l.pending = e.next = n)));
    }
  }
  function Ws(t, l) {
    var e = l.action,
      a = l.payload,
      u = t.state;
    if (l.isTransition) {
      var n = b.T,
        i = {};
      b.T = i;
      try {
        var c = e(u, a),
          f = b.S;
        (f !== null && f(i, c), Fs(t, l, c));
      } catch (h) {
        ec(t, l, h);
      } finally {
        (n !== null && i.types !== null && (n.types = i.types), (b.T = n));
      }
    } else
      try {
        ((n = e(u, a)), Fs(t, l, n));
      } catch (h) {
        ec(t, l, h);
      }
  }
  function Fs(t, l, e) {
    e !== null && typeof e == 'object' && typeof e.then == 'function'
      ? e.then(
          function (a) {
            Is(t, l, a);
          },
          function (a) {
            return ec(t, l, a);
          }
        )
      : Is(t, l, e);
  }
  function Is(t, l, e) {
    ((l.status = 'fulfilled'),
      (l.value = e),
      Ps(l),
      (t.state = e),
      (l = t.pending),
      l !== null && ((e = l.next), e === l ? (t.pending = null) : ((e = e.next), (l.next = e), Ws(t, e))));
  }
  function ec(t, l, e) {
    var a = t.pending;
    if (((t.pending = null), a !== null)) {
      a = a.next;
      do ((l.status = 'rejected'), (l.reason = e), Ps(l), (l = l.next));
      while (l !== a);
    }
    t.action = null;
  }
  function Ps(t) {
    t = t.listeners;
    for (var l = 0; l < t.length; l++) (0, t[l])();
  }
  function to(t, l) {
    return l;
  }
  function lo(t, l) {
    if (et) {
      var e = vt.formState;
      if (e !== null) {
        t: {
          var a = w;
          if (et) {
            if (gt) {
              l: {
                for (var u = gt, n = gl; u.nodeType !== 8; ) {
                  if (!n) {
                    u = null;
                    break l;
                  }
                  if (((u = Sl(u.nextSibling)), u === null)) {
                    u = null;
                    break l;
                  }
                }
                ((n = u.data), (u = n === 'F!' || n === 'F' ? u : null));
              }
              if (u) {
                ((gt = Sl(u.nextSibling)), (a = u.data === 'F!'));
                break t;
              }
            }
            le(a);
          }
          a = !1;
        }
        a && (l = e[0]);
      }
    }
    return (
      (e = wt()),
      (e.memoizedState = e.baseState = l),
      (a = { pending: null, lanes: 0, dispatch: null, lastRenderedReducer: to, lastRenderedState: l }),
      (e.queue = a),
      (e = Eo.bind(null, w, a)),
      (a.dispatch = e),
      (a = lc(!1)),
      (n = fc.bind(null, w, !1, a.queue)),
      (a = wt()),
      (u = { state: l, dispatch: null, action: t, pending: null }),
      (a.queue = u),
      (e = kd.bind(null, w, u, n, e)),
      (u.dispatch = e),
      (a.memoizedState = t),
      [l, e, !1]
    );
  }
  function eo(t) {
    var l = xt();
    return ao(l, dt, t);
  }
  function ao(t, l, e) {
    if (((l = Pi(t, l, to)[0]), (t = fn(Xl)[0]), typeof l == 'object' && l !== null && typeof l.then == 'function'))
      try {
        var a = tu(l);
      } catch (i) {
        throw i === oa ? Fu : i;
      }
    else a = l;
    l = xt();
    var u = l.queue,
      n = u.dispatch;
    return (
      e !== l.memoizedState && ((w.flags |= 2048), ya(9, { destroy: void 0 }, $d.bind(null, u, e), null)),
      [a, n, t]
    );
  }
  function $d(t, l) {
    t.action = l;
  }
  function uo(t) {
    var l = xt(),
      e = dt;
    if (e !== null) return ao(l, e, t);
    (xt(), (l = l.memoizedState), (e = xt()));
    var a = e.queue.dispatch;
    return ((e.memoizedState = t), [l, a, !1]);
  }
  function ya(t, l, e, a) {
    return (
      (t = { tag: t, create: e, deps: a, inst: l, next: null }),
      (l = w.updateQueue),
      l === null && ((l = nn()), (w.updateQueue = l)),
      (e = l.lastEffect),
      e === null ? (l.lastEffect = t.next = t) : ((a = e.next), (e.next = t), (t.next = a), (l.lastEffect = t)),
      t
    );
  }
  function no() {
    return xt().memoizedState;
  }
  function sn(t, l, e, a) {
    var u = wt();
    ((w.flags |= t), (u.memoizedState = ya(1 | l, { destroy: void 0 }, e, a === void 0 ? null : a)));
  }
  function on(t, l, e, a) {
    var u = xt();
    a = a === void 0 ? null : a;
    var n = u.memoizedState.inst;
    dt !== null && a !== null && Ji(a, dt.memoizedState.deps)
      ? (u.memoizedState = ya(l, n, e, a))
      : ((w.flags |= t), (u.memoizedState = ya(1 | l, n, e, a)));
  }
  function io(t, l) {
    sn(8390656, 8, t, l);
  }
  function ac(t, l) {
    on(2048, 8, t, l);
  }
  function Wd(t) {
    w.flags |= 4;
    var l = w.updateQueue;
    if (l === null) ((l = nn()), (w.updateQueue = l), (l.events = [t]));
    else {
      var e = l.events;
      e === null ? (l.events = [t]) : e.push(t);
    }
  }
  function co(t) {
    var l = xt().memoizedState;
    return (
      Wd({ ref: l, nextImpl: t }),
      function () {
        if ((nt & 2) !== 0) throw Error(r(440));
        return l.impl.apply(void 0, arguments);
      }
    );
  }
  function fo(t, l) {
    return on(4, 2, t, l);
  }
  function so(t, l) {
    return on(4, 4, t, l);
  }
  function oo(t, l) {
    if (typeof l == 'function') {
      t = t();
      var e = l(t);
      return function () {
        typeof e == 'function' ? e() : l(null);
      };
    }
    if (l != null)
      return (
        (t = t()),
        (l.current = t),
        function () {
          l.current = null;
        }
      );
  }
  function ro(t, l, e) {
    ((e = e != null ? e.concat([t]) : null), on(4, 4, oo.bind(null, l, t), e));
  }
  function uc() {}
  function mo(t, l) {
    var e = xt();
    l = l === void 0 ? null : l;
    var a = e.memoizedState;
    return l !== null && Ji(l, a[1]) ? a[0] : ((e.memoizedState = [t, l]), t);
  }
  function ho(t, l) {
    var e = xt();
    l = l === void 0 ? null : l;
    var a = e.memoizedState;
    if (l !== null && Ji(l, a[1])) return a[0];
    if (((a = t()), Ye)) {
      Wl(!0);
      try {
        t();
      } finally {
        Wl(!1);
      }
    }
    return ((e.memoizedState = [a, l]), a);
  }
  function nc(t, l, e) {
    return e === void 0 || ((Gl & 1073741824) !== 0 && (tt & 261930) === 0)
      ? (t.memoizedState = l)
      : ((t.memoizedState = e), (t = yr()), (w.lanes |= t), (oe |= t), e);
  }
  function yo(t, l, e, a) {
    return ul(e, l)
      ? e
      : da.current !== null
        ? ((t = nc(t, e, a)), ul(t, l) || (Nt = !0), t)
        : (Gl & 42) === 0 || ((Gl & 1073741824) !== 0 && (tt & 261930) === 0)
          ? ((Nt = !0), (t.memoizedState = e))
          : ((t = yr()), (w.lanes |= t), (oe |= t), l);
  }
  function vo(t, l, e, a, u) {
    var n = x.p;
    x.p = n !== 0 && 8 > n ? n : 8;
    var i = b.T,
      c = {};
    ((b.T = c), fc(t, !1, l, e));
    try {
      var f = u(),
        h = b.S;
      if ((h !== null && h(c, f), f !== null && typeof f == 'object' && typeof f.then == 'function')) {
        var g = wd(f, a);
        lu(t, l, g, ol(t));
      } else lu(t, l, a, ol(t));
    } catch (E) {
      lu(t, l, { then: function () {}, status: 'rejected', reason: E }, ol());
    } finally {
      ((x.p = n), i !== null && c.types !== null && (i.types = c.types), (b.T = i));
    }
  }
  function Fd() {}
  function ic(t, l, e, a) {
    if (t.tag !== 5) throw Error(r(476));
    var u = go(t).queue;
    vo(
      t,
      u,
      l,
      G,
      e === null
        ? Fd
        : function () {
            return (bo(t), e(a));
          }
    );
  }
  function go(t) {
    var l = t.memoizedState;
    if (l !== null) return l;
    l = {
      memoizedState: G,
      baseState: G,
      baseQueue: null,
      queue: { pending: null, lanes: 0, dispatch: null, lastRenderedReducer: Xl, lastRenderedState: G },
      next: null,
    };
    var e = {};
    return (
      (l.next = {
        memoizedState: e,
        baseState: e,
        baseQueue: null,
        queue: { pending: null, lanes: 0, dispatch: null, lastRenderedReducer: Xl, lastRenderedState: e },
        next: null,
      }),
      (t.memoizedState = l),
      (t = t.alternate),
      t !== null && (t.memoizedState = l),
      l
    );
  }
  function bo(t) {
    var l = go(t);
    (l.next === null && (l = t.alternate.memoizedState), lu(t, l.next.queue, {}, ol()));
  }
  function cc() {
    return Xt(bu);
  }
  function So() {
    return xt().memoizedState;
  }
  function po() {
    return xt().memoizedState;
  }
  function Id(t) {
    for (var l = t.return; l !== null; ) {
      switch (l.tag) {
        case 24:
        case 3:
          var e = ol();
          t = ue(e);
          var a = ne(l, t, e);
          (a !== null && (Pt(a, l, e), Wa(a, l, e)), (l = { cache: qi() }), (t.payload = l));
          return;
      }
      l = l.return;
    }
  }
  function Pd(t, l, e) {
    var a = ol();
    ((e = { lane: a, revertLane: 0, gesture: null, action: e, hasEagerState: !1, eagerState: null, next: null }),
      rn(t) ? zo(l, e) : ((e = _i(t, l, e, a)), e !== null && (Pt(e, t, a), To(e, l, a))));
  }
  function Eo(t, l, e) {
    var a = ol();
    lu(t, l, e, a);
  }
  function lu(t, l, e, a) {
    var u = { lane: a, revertLane: 0, gesture: null, action: e, hasEagerState: !1, eagerState: null, next: null };
    if (rn(t)) zo(l, u);
    else {
      var n = t.alternate;
      if (t.lanes === 0 && (n === null || n.lanes === 0) && ((n = l.lastRenderedReducer), n !== null))
        try {
          var i = l.lastRenderedState,
            c = n(i, e);
          if (((u.hasEagerState = !0), (u.eagerState = c), ul(c, i))) return (Vu(t, l, u, 0), vt === null && Zu(), !1);
        } catch {
        } finally {
        }
      if (((e = _i(t, l, u, a)), e !== null)) return (Pt(e, t, a), To(e, l, a), !0);
    }
    return !1;
  }
  function fc(t, l, e, a) {
    if (
      ((a = { lane: 2, revertLane: Xc(), gesture: null, action: a, hasEagerState: !1, eagerState: null, next: null }),
      rn(t))
    ) {
      if (l) throw Error(r(479));
    } else ((l = _i(t, e, a, 2)), l !== null && Pt(l, t, 2));
  }
  function rn(t) {
    var l = t.alternate;
    return t === w || (l !== null && l === w);
  }
  function zo(t, l) {
    ma = an = !0;
    var e = t.pending;
    (e === null ? (l.next = l) : ((l.next = e.next), (e.next = l)), (t.pending = l));
  }
  function To(t, l, e) {
    if ((e & 4194048) !== 0) {
      var a = l.lanes;
      ((a &= t.pendingLanes), (e |= a), (l.lanes = e), xf(t, e));
    }
  }
  var eu = {
    readContext: Xt,
    use: cn,
    useCallback: Tt,
    useContext: Tt,
    useEffect: Tt,
    useImperativeHandle: Tt,
    useLayoutEffect: Tt,
    useInsertionEffect: Tt,
    useMemo: Tt,
    useReducer: Tt,
    useRef: Tt,
    useState: Tt,
    useDebugValue: Tt,
    useDeferredValue: Tt,
    useTransition: Tt,
    useSyncExternalStore: Tt,
    useId: Tt,
    useHostTransitionStatus: Tt,
    useFormState: Tt,
    useActionState: Tt,
    useOptimistic: Tt,
    useMemoCache: Tt,
    useCacheRefresh: Tt,
  };
  eu.useEffectEvent = Tt;
  var Ao = {
      readContext: Xt,
      use: cn,
      useCallback: function (t, l) {
        return ((wt().memoizedState = [t, l === void 0 ? null : l]), t);
      },
      useContext: Xt,
      useEffect: io,
      useImperativeHandle: function (t, l, e) {
        ((e = e != null ? e.concat([t]) : null), sn(4194308, 4, oo.bind(null, l, t), e));
      },
      useLayoutEffect: function (t, l) {
        return sn(4194308, 4, t, l);
      },
      useInsertionEffect: function (t, l) {
        sn(4, 2, t, l);
      },
      useMemo: function (t, l) {
        var e = wt();
        l = l === void 0 ? null : l;
        var a = t();
        if (Ye) {
          Wl(!0);
          try {
            t();
          } finally {
            Wl(!1);
          }
        }
        return ((e.memoizedState = [a, l]), a);
      },
      useReducer: function (t, l, e) {
        var a = wt();
        if (e !== void 0) {
          var u = e(l);
          if (Ye) {
            Wl(!0);
            try {
              e(l);
            } finally {
              Wl(!1);
            }
          }
        } else u = l;
        return (
          (a.memoizedState = a.baseState = u),
          (t = { pending: null, lanes: 0, dispatch: null, lastRenderedReducer: t, lastRenderedState: u }),
          (a.queue = t),
          (t = t.dispatch = Pd.bind(null, w, t)),
          [a.memoizedState, t]
        );
      },
      useRef: function (t) {
        var l = wt();
        return ((t = { current: t }), (l.memoizedState = t));
      },
      useState: function (t) {
        t = lc(t);
        var l = t.queue,
          e = Eo.bind(null, w, l);
        return ((l.dispatch = e), [t.memoizedState, e]);
      },
      useDebugValue: uc,
      useDeferredValue: function (t, l) {
        var e = wt();
        return nc(e, t, l);
      },
      useTransition: function () {
        var t = lc(!1);
        return ((t = vo.bind(null, w, t.queue, !0, !1)), (wt().memoizedState = t), [!1, t]);
      },
      useSyncExternalStore: function (t, l, e) {
        var a = w,
          u = wt();
        if (et) {
          if (e === void 0) throw Error(r(407));
          e = e();
        } else {
          if (((e = l()), vt === null)) throw Error(r(349));
          (tt & 127) !== 0 || Vs(a, l, e);
        }
        u.memoizedState = e;
        var n = { value: e, getSnapshot: l };
        return (
          (u.queue = n),
          io(Ks.bind(null, a, n, t), [t]),
          (a.flags |= 2048),
          ya(9, { destroy: void 0 }, ws.bind(null, a, n, e, l), null),
          e
        );
      },
      useId: function () {
        var t = wt(),
          l = vt.identifierPrefix;
        if (et) {
          var e = Ol,
            a = xl;
          ((e = (a & ~(1 << (32 - al(a) - 1))).toString(32) + e),
            (l = '_' + l + 'R_' + e),
            (e = un++),
            0 < e && (l += 'H' + e.toString(32)),
            (l += '_'));
        } else ((e = Kd++), (l = '_' + l + 'r_' + e.toString(32) + '_'));
        return (t.memoizedState = l);
      },
      useHostTransitionStatus: cc,
      useFormState: lo,
      useActionState: lo,
      useOptimistic: function (t) {
        var l = wt();
        l.memoizedState = l.baseState = t;
        var e = { pending: null, lanes: 0, dispatch: null, lastRenderedReducer: null, lastRenderedState: null };
        return ((l.queue = e), (l = fc.bind(null, w, !0, e)), (e.dispatch = l), [t, l]);
      },
      useMemoCache: Ii,
      useCacheRefresh: function () {
        return (wt().memoizedState = Id.bind(null, w));
      },
      useEffectEvent: function (t) {
        var l = wt(),
          e = { impl: t };
        return (
          (l.memoizedState = e),
          function () {
            if ((nt & 2) !== 0) throw Error(r(440));
            return e.impl.apply(void 0, arguments);
          }
        );
      },
    },
    sc = {
      readContext: Xt,
      use: cn,
      useCallback: mo,
      useContext: Xt,
      useEffect: ac,
      useImperativeHandle: ro,
      useInsertionEffect: fo,
      useLayoutEffect: so,
      useMemo: ho,
      useReducer: fn,
      useRef: no,
      useState: function () {
        return fn(Xl);
      },
      useDebugValue: uc,
      useDeferredValue: function (t, l) {
        var e = xt();
        return yo(e, dt.memoizedState, t, l);
      },
      useTransition: function () {
        var t = fn(Xl)[0],
          l = xt().memoizedState;
        return [typeof t == 'boolean' ? t : tu(t), l];
      },
      useSyncExternalStore: Zs,
      useId: So,
      useHostTransitionStatus: cc,
      useFormState: eo,
      useActionState: eo,
      useOptimistic: function (t, l) {
        var e = xt();
        return $s(e, dt, t, l);
      },
      useMemoCache: Ii,
      useCacheRefresh: po,
    };
  sc.useEffectEvent = co;
  var _o = {
    readContext: Xt,
    use: cn,
    useCallback: mo,
    useContext: Xt,
    useEffect: ac,
    useImperativeHandle: ro,
    useInsertionEffect: fo,
    useLayoutEffect: so,
    useMemo: ho,
    useReducer: tc,
    useRef: no,
    useState: function () {
      return tc(Xl);
    },
    useDebugValue: uc,
    useDeferredValue: function (t, l) {
      var e = xt();
      return dt === null ? nc(e, t, l) : yo(e, dt.memoizedState, t, l);
    },
    useTransition: function () {
      var t = tc(Xl)[0],
        l = xt().memoizedState;
      return [typeof t == 'boolean' ? t : tu(t), l];
    },
    useSyncExternalStore: Zs,
    useId: So,
    useHostTransitionStatus: cc,
    useFormState: uo,
    useActionState: uo,
    useOptimistic: function (t, l) {
      var e = xt();
      return dt !== null ? $s(e, dt, t, l) : ((e.baseState = t), [t, e.queue.dispatch]);
    },
    useMemoCache: Ii,
    useCacheRefresh: po,
  };
  _o.useEffectEvent = co;
  function oc(t, l, e, a) {
    ((l = t.memoizedState),
      (e = e(a, l)),
      (e = e == null ? l : R({}, l, e)),
      (t.memoizedState = e),
      t.lanes === 0 && (t.updateQueue.baseState = e));
  }
  var rc = {
    enqueueSetState: function (t, l, e) {
      t = t._reactInternals;
      var a = ol(),
        u = ue(a);
      ((u.payload = l), e != null && (u.callback = e), (l = ne(t, u, a)), l !== null && (Pt(l, t, a), Wa(l, t, a)));
    },
    enqueueReplaceState: function (t, l, e) {
      t = t._reactInternals;
      var a = ol(),
        u = ue(a);
      ((u.tag = 1),
        (u.payload = l),
        e != null && (u.callback = e),
        (l = ne(t, u, a)),
        l !== null && (Pt(l, t, a), Wa(l, t, a)));
    },
    enqueueForceUpdate: function (t, l) {
      t = t._reactInternals;
      var e = ol(),
        a = ue(e);
      ((a.tag = 2), l != null && (a.callback = l), (l = ne(t, a, e)), l !== null && (Pt(l, t, e), Wa(l, t, e)));
    },
  };
  function Mo(t, l, e, a, u, n, i) {
    return (
      (t = t.stateNode),
      typeof t.shouldComponentUpdate == 'function'
        ? t.shouldComponentUpdate(a, n, i)
        : l.prototype && l.prototype.isPureReactComponent
          ? !La(e, a) || !La(u, n)
          : !0
    );
  }
  function xo(t, l, e, a) {
    ((t = l.state),
      typeof l.componentWillReceiveProps == 'function' && l.componentWillReceiveProps(e, a),
      typeof l.UNSAFE_componentWillReceiveProps == 'function' && l.UNSAFE_componentWillReceiveProps(e, a),
      l.state !== t && rc.enqueueReplaceState(l, l.state, null));
  }
  function Ge(t, l) {
    var e = l;
    if ('ref' in l) {
      e = {};
      for (var a in l) a !== 'ref' && (e[a] = l[a]);
    }
    if ((t = t.defaultProps)) {
      e === l && (e = R({}, e));
      for (var u in t) e[u] === void 0 && (e[u] = t[u]);
    }
    return e;
  }
  function Oo(t) {
    Lu(t);
  }
  function Do(t) {
    console.error(t);
  }
  function No(t) {
    Lu(t);
  }
  function dn(t, l) {
    try {
      var e = t.onUncaughtError;
      e(l.value, { componentStack: l.stack });
    } catch (a) {
      setTimeout(function () {
        throw a;
      });
    }
  }
  function Uo(t, l, e) {
    try {
      var a = t.onCaughtError;
      a(e.value, { componentStack: e.stack, errorBoundary: l.tag === 1 ? l.stateNode : null });
    } catch (u) {
      setTimeout(function () {
        throw u;
      });
    }
  }
  function dc(t, l, e) {
    return (
      (e = ue(e)),
      (e.tag = 3),
      (e.payload = { element: null }),
      (e.callback = function () {
        dn(t, l);
      }),
      e
    );
  }
  function jo(t) {
    return ((t = ue(t)), (t.tag = 3), t);
  }
  function Co(t, l, e, a) {
    var u = e.type.getDerivedStateFromError;
    if (typeof u == 'function') {
      var n = a.value;
      ((t.payload = function () {
        return u(n);
      }),
        (t.callback = function () {
          Uo(l, e, a);
        }));
    }
    var i = e.stateNode;
    i !== null &&
      typeof i.componentDidCatch == 'function' &&
      (t.callback = function () {
        (Uo(l, e, a), typeof u != 'function' && (re === null ? (re = new Set([this])) : re.add(this)));
        var c = a.stack;
        this.componentDidCatch(a.value, { componentStack: c !== null ? c : '' });
      });
  }
  function tm(t, l, e, a, u) {
    if (((e.flags |= 32768), a !== null && typeof a == 'object' && typeof a.then == 'function')) {
      if (((l = e.alternate), l !== null && ca(l, e, u, !0), (e = il.current), e !== null)) {
        switch (e.tag) {
          case 31:
          case 13:
            return (
              bl === null ? An() : e.alternate === null && At === 0 && (At = 3),
              (e.flags &= -257),
              (e.flags |= 65536),
              (e.lanes = u),
              a === Iu
                ? (e.flags |= 16384)
                : ((l = e.updateQueue), l === null ? (e.updateQueue = new Set([a])) : l.add(a), Bc(t, a, u)),
              !1
            );
          case 22:
            return (
              (e.flags |= 65536),
              a === Iu
                ? (e.flags |= 16384)
                : ((l = e.updateQueue),
                  l === null
                    ? ((l = { transitions: null, markerInstances: null, retryQueue: new Set([a]) }),
                      (e.updateQueue = l))
                    : ((e = l.retryQueue), e === null ? (l.retryQueue = new Set([a])) : e.add(a)),
                  Bc(t, a, u)),
              !1
            );
        }
        throw Error(r(435, e.tag));
      }
      return (Bc(t, a, u), An(), !1);
    }
    if (et)
      return (
        (l = il.current),
        l !== null
          ? ((l.flags & 65536) === 0 && (l.flags |= 256),
            (l.flags |= 65536),
            (l.lanes = u),
            a !== Ui && ((t = Error(r(422), { cause: a })), wa(hl(t, e))))
          : (a !== Ui && ((l = Error(r(423), { cause: a })), wa(hl(l, e))),
            (t = t.current.alternate),
            (t.flags |= 65536),
            (u &= -u),
            (t.lanes |= u),
            (a = hl(a, e)),
            (u = dc(t.stateNode, a, u)),
            Li(t, u),
            At !== 4 && (At = 2)),
        !1
      );
    var n = Error(r(520), { cause: a });
    if (((n = hl(n, e)), ou === null ? (ou = [n]) : ou.push(n), At !== 4 && (At = 2), l === null)) return !0;
    ((a = hl(a, e)), (e = l));
    do {
      switch (e.tag) {
        case 3:
          return ((e.flags |= 65536), (t = u & -u), (e.lanes |= t), (t = dc(e.stateNode, a, t)), Li(e, t), !1);
        case 1:
          if (
            ((l = e.type),
            (n = e.stateNode),
            (e.flags & 128) === 0 &&
              (typeof l.getDerivedStateFromError == 'function' ||
                (n !== null && typeof n.componentDidCatch == 'function' && (re === null || !re.has(n)))))
          )
            return ((e.flags |= 65536), (u &= -u), (e.lanes |= u), (u = jo(u)), Co(u, t, e, a), Li(e, u), !1);
      }
      e = e.return;
    } while (e !== null);
    return !1;
  }
  var mc = Error(r(461)),
    Nt = !1;
  function Qt(t, l, e, a) {
    l.child = t === null ? qs(l, null, e, a) : Be(l, t.child, e, a);
  }
  function Ho(t, l, e, a, u) {
    e = e.render;
    var n = l.ref;
    if ('ref' in a) {
      var i = {};
      for (var c in a) c !== 'ref' && (i[c] = a[c]);
    } else i = a;
    return (
      Ce(l),
      (a = ki(t, l, e, i, n, u)),
      (c = $i()),
      t !== null && !Nt ? (Wi(t, l, u), Ql(t, l, u)) : (et && c && Di(l), (l.flags |= 1), Qt(t, l, a, u), l.child)
    );
  }
  function Ro(t, l, e, a, u) {
    if (t === null) {
      var n = e.type;
      return typeof n == 'function' && !Mi(n) && n.defaultProps === void 0 && e.compare === null
        ? ((l.tag = 15), (l.type = n), qo(t, l, n, a, u))
        : ((t = Ku(e.type, null, a, l, l.mode, u)), (t.ref = l.ref), (t.return = l), (l.child = t));
    }
    if (((n = t.child), !Ec(t, u))) {
      var i = n.memoizedProps;
      if (((e = e.compare), (e = e !== null ? e : La), e(i, a) && t.ref === l.ref)) return Ql(t, l, u);
    }
    return ((l.flags |= 1), (t = Rl(n, a)), (t.ref = l.ref), (t.return = l), (l.child = t));
  }
  function qo(t, l, e, a, u) {
    if (t !== null) {
      var n = t.memoizedProps;
      if (La(n, a) && t.ref === l.ref)
        if (((Nt = !1), (l.pendingProps = a = n), Ec(t, u))) (t.flags & 131072) !== 0 && (Nt = !0);
        else return ((l.lanes = t.lanes), Ql(t, l, u));
    }
    return hc(t, l, e, a, u);
  }
  function Bo(t, l, e, a) {
    var u = a.children,
      n = t !== null ? t.memoizedState : null;
    if (
      (t === null &&
        l.stateNode === null &&
        (l.stateNode = { _visibility: 1, _pendingMarkers: null, _retryCache: null, _transitions: null }),
      a.mode === 'hidden')
    ) {
      if ((l.flags & 128) !== 0) {
        if (((n = n !== null ? n.baseLanes | e : e), t !== null)) {
          for (a = l.child = t.child, u = 0; a !== null; ) ((u = u | a.lanes | a.childLanes), (a = a.sibling));
          a = u & ~n;
        } else ((a = 0), (l.child = null));
        return Yo(t, l, n, e, a);
      }
      if ((e & 536870912) !== 0)
        ((l.memoizedState = { baseLanes: 0, cachePool: null }),
          t !== null && Wu(l, n !== null ? n.cachePool : null),
          n !== null ? Gs(l, n) : Vi(),
          Xs(l));
      else return ((a = l.lanes = 536870912), Yo(t, l, n !== null ? n.baseLanes | e : e, e, a));
    } else
      n !== null
        ? (Wu(l, n.cachePool), Gs(l, n), ce(), (l.memoizedState = null))
        : (t !== null && Wu(l, null), Vi(), ce());
    return (Qt(t, l, u, e), l.child);
  }
  function au(t, l) {
    return (
      (t !== null && t.tag === 22) ||
        l.stateNode !== null ||
        (l.stateNode = { _visibility: 1, _pendingMarkers: null, _retryCache: null, _transitions: null }),
      l.sibling
    );
  }
  function Yo(t, l, e, a, u) {
    var n = Yi();
    return (
      (n = n === null ? null : { parent: Ot._currentValue, pool: n }),
      (l.memoizedState = { baseLanes: e, cachePool: n }),
      t !== null && Wu(l, null),
      Vi(),
      Xs(l),
      t !== null && ca(t, l, a, !0),
      (l.childLanes = u),
      null
    );
  }
  function mn(t, l) {
    return (
      (l = yn({ mode: l.mode, children: l.children }, t.mode)),
      (l.ref = t.ref),
      (t.child = l),
      (l.return = t),
      l
    );
  }
  function Go(t, l, e) {
    return (Be(l, t.child, null, e), (t = mn(l, l.pendingProps)), (t.flags |= 2), cl(l), (l.memoizedState = null), t);
  }
  function lm(t, l, e) {
    var a = l.pendingProps,
      u = (l.flags & 128) !== 0;
    if (((l.flags &= -129), t === null)) {
      if (et) {
        if (a.mode === 'hidden') return ((t = mn(l, a)), (l.lanes = 536870912), au(null, t));
        if (
          (Ki(l),
          (t = gt)
            ? ((t = Fr(t, gl)),
              (t = t !== null && t.data === '&' ? t : null),
              t !== null &&
                ((l.memoizedState = {
                  dehydrated: t,
                  treeContext: Pl !== null ? { id: xl, overflow: Ol } : null,
                  retryLane: 536870912,
                  hydrationErrors: null,
                }),
                (e = Es(t)),
                (e.return = l),
                (l.child = e),
                (Gt = l),
                (gt = null)))
            : (t = null),
          t === null)
        )
          throw le(l);
        return ((l.lanes = 536870912), null);
      }
      return mn(l, a);
    }
    var n = t.memoizedState;
    if (n !== null) {
      var i = n.dehydrated;
      if ((Ki(l), u))
        if (l.flags & 256) ((l.flags &= -257), (l = Go(t, l, e)));
        else if (l.memoizedState !== null) ((l.child = t.child), (l.flags |= 128), (l = null));
        else throw Error(r(558));
      else if ((Nt || ca(t, l, e, !1), (u = (e & t.childLanes) !== 0), Nt || u)) {
        if (((a = vt), a !== null && ((i = Of(a, e)), i !== 0 && i !== n.retryLane)))
          throw ((n.retryLane = i), De(t, i), Pt(a, t, i), mc);
        (An(), (l = Go(t, l, e)));
      } else
        ((t = n.treeContext),
          (gt = Sl(i.nextSibling)),
          (Gt = l),
          (et = !0),
          (te = null),
          (gl = !1),
          t !== null && As(l, t),
          (l = mn(l, a)),
          (l.flags |= 4096));
      return l;
    }
    return (
      (t = Rl(t.child, { mode: a.mode, children: a.children })),
      (t.ref = l.ref),
      (l.child = t),
      (t.return = l),
      t
    );
  }
  function hn(t, l) {
    var e = l.ref;
    if (e === null) t !== null && t.ref !== null && (l.flags |= 4194816);
    else {
      if (typeof e != 'function' && typeof e != 'object') throw Error(r(284));
      (t === null || t.ref !== e) && (l.flags |= 4194816);
    }
  }
  function hc(t, l, e, a, u) {
    return (
      Ce(l),
      (e = ki(t, l, e, a, void 0, u)),
      (a = $i()),
      t !== null && !Nt ? (Wi(t, l, u), Ql(t, l, u)) : (et && a && Di(l), (l.flags |= 1), Qt(t, l, e, u), l.child)
    );
  }
  function Xo(t, l, e, a, u, n) {
    return (
      Ce(l),
      (l.updateQueue = null),
      (e = Ls(l, a, e, u)),
      Qs(t),
      (a = $i()),
      t !== null && !Nt ? (Wi(t, l, n), Ql(t, l, n)) : (et && a && Di(l), (l.flags |= 1), Qt(t, l, e, n), l.child)
    );
  }
  function Qo(t, l, e, a, u) {
    if ((Ce(l), l.stateNode === null)) {
      var n = aa,
        i = e.contextType;
      (typeof i == 'object' && i !== null && (n = Xt(i)),
        (n = new e(a, n)),
        (l.memoizedState = n.state !== null && n.state !== void 0 ? n.state : null),
        (n.updater = rc),
        (l.stateNode = n),
        (n._reactInternals = l),
        (n = l.stateNode),
        (n.props = a),
        (n.state = l.memoizedState),
        (n.refs = {}),
        Xi(l),
        (i = e.contextType),
        (n.context = typeof i == 'object' && i !== null ? Xt(i) : aa),
        (n.state = l.memoizedState),
        (i = e.getDerivedStateFromProps),
        typeof i == 'function' && (oc(l, e, i, a), (n.state = l.memoizedState)),
        typeof e.getDerivedStateFromProps == 'function' ||
          typeof n.getSnapshotBeforeUpdate == 'function' ||
          (typeof n.UNSAFE_componentWillMount != 'function' && typeof n.componentWillMount != 'function') ||
          ((i = n.state),
          typeof n.componentWillMount == 'function' && n.componentWillMount(),
          typeof n.UNSAFE_componentWillMount == 'function' && n.UNSAFE_componentWillMount(),
          i !== n.state && rc.enqueueReplaceState(n, n.state, null),
          Ia(l, a, n, u),
          Fa(),
          (n.state = l.memoizedState)),
        typeof n.componentDidMount == 'function' && (l.flags |= 4194308),
        (a = !0));
    } else if (t === null) {
      n = l.stateNode;
      var c = l.memoizedProps,
        f = Ge(e, c);
      n.props = f;
      var h = n.context,
        g = e.contextType;
      ((i = aa), typeof g == 'object' && g !== null && (i = Xt(g)));
      var E = e.getDerivedStateFromProps;
      ((g = typeof E == 'function' || typeof n.getSnapshotBeforeUpdate == 'function'),
        (c = l.pendingProps !== c),
        g ||
          (typeof n.UNSAFE_componentWillReceiveProps != 'function' &&
            typeof n.componentWillReceiveProps != 'function') ||
          ((c || h !== i) && xo(l, n, a, i)),
        (ae = !1));
      var y = l.memoizedState;
      ((n.state = y),
        Ia(l, a, n, u),
        Fa(),
        (h = l.memoizedState),
        c || y !== h || ae
          ? (typeof E == 'function' && (oc(l, e, E, a), (h = l.memoizedState)),
            (f = ae || Mo(l, e, f, a, y, h, i))
              ? (g ||
                  (typeof n.UNSAFE_componentWillMount != 'function' && typeof n.componentWillMount != 'function') ||
                  (typeof n.componentWillMount == 'function' && n.componentWillMount(),
                  typeof n.UNSAFE_componentWillMount == 'function' && n.UNSAFE_componentWillMount()),
                typeof n.componentDidMount == 'function' && (l.flags |= 4194308))
              : (typeof n.componentDidMount == 'function' && (l.flags |= 4194308),
                (l.memoizedProps = a),
                (l.memoizedState = h)),
            (n.props = a),
            (n.state = h),
            (n.context = i),
            (a = f))
          : (typeof n.componentDidMount == 'function' && (l.flags |= 4194308), (a = !1)));
    } else {
      ((n = l.stateNode),
        Qi(t, l),
        (i = l.memoizedProps),
        (g = Ge(e, i)),
        (n.props = g),
        (E = l.pendingProps),
        (y = n.context),
        (h = e.contextType),
        (f = aa),
        typeof h == 'object' && h !== null && (f = Xt(h)),
        (c = e.getDerivedStateFromProps),
        (h = typeof c == 'function' || typeof n.getSnapshotBeforeUpdate == 'function') ||
          (typeof n.UNSAFE_componentWillReceiveProps != 'function' &&
            typeof n.componentWillReceiveProps != 'function') ||
          ((i !== E || y !== f) && xo(l, n, a, f)),
        (ae = !1),
        (y = l.memoizedState),
        (n.state = y),
        Ia(l, a, n, u),
        Fa());
      var v = l.memoizedState;
      i !== E || y !== v || ae || (t !== null && t.dependencies !== null && ku(t.dependencies))
        ? (typeof c == 'function' && (oc(l, e, c, a), (v = l.memoizedState)),
          (g = ae || Mo(l, e, g, a, y, v, f) || (t !== null && t.dependencies !== null && ku(t.dependencies)))
            ? (h ||
                (typeof n.UNSAFE_componentWillUpdate != 'function' && typeof n.componentWillUpdate != 'function') ||
                (typeof n.componentWillUpdate == 'function' && n.componentWillUpdate(a, v, f),
                typeof n.UNSAFE_componentWillUpdate == 'function' && n.UNSAFE_componentWillUpdate(a, v, f)),
              typeof n.componentDidUpdate == 'function' && (l.flags |= 4),
              typeof n.getSnapshotBeforeUpdate == 'function' && (l.flags |= 1024))
            : (typeof n.componentDidUpdate != 'function' ||
                (i === t.memoizedProps && y === t.memoizedState) ||
                (l.flags |= 4),
              typeof n.getSnapshotBeforeUpdate != 'function' ||
                (i === t.memoizedProps && y === t.memoizedState) ||
                (l.flags |= 1024),
              (l.memoizedProps = a),
              (l.memoizedState = v)),
          (n.props = a),
          (n.state = v),
          (n.context = f),
          (a = g))
        : (typeof n.componentDidUpdate != 'function' ||
            (i === t.memoizedProps && y === t.memoizedState) ||
            (l.flags |= 4),
          typeof n.getSnapshotBeforeUpdate != 'function' ||
            (i === t.memoizedProps && y === t.memoizedState) ||
            (l.flags |= 1024),
          (a = !1));
    }
    return (
      (n = a),
      hn(t, l),
      (a = (l.flags & 128) !== 0),
      n || a
        ? ((n = l.stateNode),
          (e = a && typeof e.getDerivedStateFromError != 'function' ? null : n.render()),
          (l.flags |= 1),
          t !== null && a ? ((l.child = Be(l, t.child, null, u)), (l.child = Be(l, null, e, u))) : Qt(t, l, e, u),
          (l.memoizedState = n.state),
          (t = l.child))
        : (t = Ql(t, l, u)),
      t
    );
  }
  function Lo(t, l, e, a) {
    return (Ue(), (l.flags |= 256), Qt(t, l, e, a), l.child);
  }
  var yc = { dehydrated: null, treeContext: null, retryLane: 0, hydrationErrors: null };
  function vc(t) {
    return { baseLanes: t, cachePool: Ns() };
  }
  function gc(t, l, e) {
    return ((t = t !== null ? t.childLanes & ~e : 0), l && (t |= sl), t);
  }
  function Zo(t, l, e) {
    var a = l.pendingProps,
      u = !1,
      n = (l.flags & 128) !== 0,
      i;
    if (
      ((i = n) || (i = t !== null && t.memoizedState === null ? !1 : (Mt.current & 2) !== 0),
      i && ((u = !0), (l.flags &= -129)),
      (i = (l.flags & 32) !== 0),
      (l.flags &= -33),
      t === null)
    ) {
      if (et) {
        if (
          (u ? ie(l) : ce(),
          (t = gt)
            ? ((t = Fr(t, gl)),
              (t = t !== null && t.data !== '&' ? t : null),
              t !== null &&
                ((l.memoizedState = {
                  dehydrated: t,
                  treeContext: Pl !== null ? { id: xl, overflow: Ol } : null,
                  retryLane: 536870912,
                  hydrationErrors: null,
                }),
                (e = Es(t)),
                (e.return = l),
                (l.child = e),
                (Gt = l),
                (gt = null)))
            : (t = null),
          t === null)
        )
          throw le(l);
        return (Pc(t) ? (l.lanes = 32) : (l.lanes = 536870912), null);
      }
      var c = a.children;
      return (
        (a = a.fallback),
        u
          ? (ce(),
            (u = l.mode),
            (c = yn({ mode: 'hidden', children: c }, u)),
            (a = Ne(a, u, e, null)),
            (c.return = l),
            (a.return = l),
            (c.sibling = a),
            (l.child = c),
            (a = l.child),
            (a.memoizedState = vc(e)),
            (a.childLanes = gc(t, i, e)),
            (l.memoizedState = yc),
            au(null, a))
          : (ie(l), bc(l, c))
      );
    }
    var f = t.memoizedState;
    if (f !== null && ((c = f.dehydrated), c !== null)) {
      if (n)
        l.flags & 256
          ? (ie(l), (l.flags &= -257), (l = Sc(t, l, e)))
          : l.memoizedState !== null
            ? (ce(), (l.child = t.child), (l.flags |= 128), (l = null))
            : (ce(),
              (c = a.fallback),
              (u = l.mode),
              (a = yn({ mode: 'visible', children: a.children }, u)),
              (c = Ne(c, u, e, null)),
              (c.flags |= 2),
              (a.return = l),
              (c.return = l),
              (a.sibling = c),
              (l.child = a),
              Be(l, t.child, null, e),
              (a = l.child),
              (a.memoizedState = vc(e)),
              (a.childLanes = gc(t, i, e)),
              (l.memoizedState = yc),
              (l = au(null, a)));
      else if ((ie(l), Pc(c))) {
        if (((i = c.nextSibling && c.nextSibling.dataset), i)) var h = i.dgst;
        ((i = h),
          (a = Error(r(419))),
          (a.stack = ''),
          (a.digest = i),
          wa({ value: a, source: null, stack: null }),
          (l = Sc(t, l, e)));
      } else if ((Nt || ca(t, l, e, !1), (i = (e & t.childLanes) !== 0), Nt || i)) {
        if (((i = vt), i !== null && ((a = Of(i, e)), a !== 0 && a !== f.retryLane)))
          throw ((f.retryLane = a), De(t, a), Pt(i, t, a), mc);
        (Ic(c) || An(), (l = Sc(t, l, e)));
      } else
        Ic(c)
          ? ((l.flags |= 192), (l.child = t.child), (l = null))
          : ((t = f.treeContext),
            (gt = Sl(c.nextSibling)),
            (Gt = l),
            (et = !0),
            (te = null),
            (gl = !1),
            t !== null && As(l, t),
            (l = bc(l, a.children)),
            (l.flags |= 4096));
      return l;
    }
    return u
      ? (ce(),
        (c = a.fallback),
        (u = l.mode),
        (f = t.child),
        (h = f.sibling),
        (a = Rl(f, { mode: 'hidden', children: a.children })),
        (a.subtreeFlags = f.subtreeFlags & 65011712),
        h !== null ? (c = Rl(h, c)) : ((c = Ne(c, u, e, null)), (c.flags |= 2)),
        (c.return = l),
        (a.return = l),
        (a.sibling = c),
        (l.child = a),
        au(null, a),
        (a = l.child),
        (c = t.child.memoizedState),
        c === null
          ? (c = vc(e))
          : ((u = c.cachePool),
            u !== null ? ((f = Ot._currentValue), (u = u.parent !== f ? { parent: f, pool: f } : u)) : (u = Ns()),
            (c = { baseLanes: c.baseLanes | e, cachePool: u })),
        (a.memoizedState = c),
        (a.childLanes = gc(t, i, e)),
        (l.memoizedState = yc),
        au(t.child, a))
      : (ie(l),
        (e = t.child),
        (t = e.sibling),
        (e = Rl(e, { mode: 'visible', children: a.children })),
        (e.return = l),
        (e.sibling = null),
        t !== null && ((i = l.deletions), i === null ? ((l.deletions = [t]), (l.flags |= 16)) : i.push(t)),
        (l.child = e),
        (l.memoizedState = null),
        e);
  }
  function bc(t, l) {
    return ((l = yn({ mode: 'visible', children: l }, t.mode)), (l.return = t), (t.child = l));
  }
  function yn(t, l) {
    return ((t = nl(22, t, null, l)), (t.lanes = 0), t);
  }
  function Sc(t, l, e) {
    return (Be(l, t.child, null, e), (t = bc(l, l.pendingProps.children)), (t.flags |= 2), (l.memoizedState = null), t);
  }
  function Vo(t, l, e) {
    t.lanes |= l;
    var a = t.alternate;
    (a !== null && (a.lanes |= l), Hi(t.return, l, e));
  }
  function pc(t, l, e, a, u, n) {
    var i = t.memoizedState;
    i === null
      ? (t.memoizedState = {
          isBackwards: l,
          rendering: null,
          renderingStartTime: 0,
          last: a,
          tail: e,
          tailMode: u,
          treeForkCount: n,
        })
      : ((i.isBackwards = l),
        (i.rendering = null),
        (i.renderingStartTime = 0),
        (i.last = a),
        (i.tail = e),
        (i.tailMode = u),
        (i.treeForkCount = n));
  }
  function wo(t, l, e) {
    var a = l.pendingProps,
      u = a.revealOrder,
      n = a.tail;
    a = a.children;
    var i = Mt.current,
      c = (i & 2) !== 0;
    if (
      (c ? ((i = (i & 1) | 2), (l.flags |= 128)) : (i &= 1),
      O(Mt, i),
      Qt(t, l, a, e),
      (a = et ? Va : 0),
      !c && t !== null && (t.flags & 128) !== 0)
    )
      t: for (t = l.child; t !== null; ) {
        if (t.tag === 13) t.memoizedState !== null && Vo(t, e, l);
        else if (t.tag === 19) Vo(t, e, l);
        else if (t.child !== null) {
          ((t.child.return = t), (t = t.child));
          continue;
        }
        if (t === l) break t;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === l) break t;
          t = t.return;
        }
        ((t.sibling.return = t.return), (t = t.sibling));
      }
    switch (u) {
      case 'forwards':
        for (e = l.child, u = null; e !== null; )
          ((t = e.alternate), t !== null && en(t) === null && (u = e), (e = e.sibling));
        ((e = u),
          e === null ? ((u = l.child), (l.child = null)) : ((u = e.sibling), (e.sibling = null)),
          pc(l, !1, u, e, n, a));
        break;
      case 'backwards':
      case 'unstable_legacy-backwards':
        for (e = null, u = l.child, l.child = null; u !== null; ) {
          if (((t = u.alternate), t !== null && en(t) === null)) {
            l.child = u;
            break;
          }
          ((t = u.sibling), (u.sibling = e), (e = u), (u = t));
        }
        pc(l, !0, e, null, n, a);
        break;
      case 'together':
        pc(l, !1, null, null, void 0, a);
        break;
      default:
        l.memoizedState = null;
    }
    return l.child;
  }
  function Ql(t, l, e) {
    if ((t !== null && (l.dependencies = t.dependencies), (oe |= l.lanes), (e & l.childLanes) === 0))
      if (t !== null) {
        if ((ca(t, l, e, !1), (e & l.childLanes) === 0)) return null;
      } else return null;
    if (t !== null && l.child !== t.child) throw Error(r(153));
    if (l.child !== null) {
      for (t = l.child, e = Rl(t, t.pendingProps), l.child = e, e.return = l; t.sibling !== null; )
        ((t = t.sibling), (e = e.sibling = Rl(t, t.pendingProps)), (e.return = l));
      e.sibling = null;
    }
    return l.child;
  }
  function Ec(t, l) {
    return (t.lanes & l) !== 0 ? !0 : ((t = t.dependencies), !!(t !== null && ku(t)));
  }
  function em(t, l, e) {
    switch (l.tag) {
      case 3:
        (Vt(l, l.stateNode.containerInfo), ee(l, Ot, t.memoizedState.cache), Ue());
        break;
      case 27:
      case 5:
        Da(l);
        break;
      case 4:
        Vt(l, l.stateNode.containerInfo);
        break;
      case 10:
        ee(l, l.type, l.memoizedProps.value);
        break;
      case 31:
        if (l.memoizedState !== null) return ((l.flags |= 128), Ki(l), null);
        break;
      case 13:
        var a = l.memoizedState;
        if (a !== null)
          return a.dehydrated !== null
            ? (ie(l), (l.flags |= 128), null)
            : (e & l.child.childLanes) !== 0
              ? Zo(t, l, e)
              : (ie(l), (t = Ql(t, l, e)), t !== null ? t.sibling : null);
        ie(l);
        break;
      case 19:
        var u = (t.flags & 128) !== 0;
        if (((a = (e & l.childLanes) !== 0), a || (ca(t, l, e, !1), (a = (e & l.childLanes) !== 0)), u)) {
          if (a) return wo(t, l, e);
          l.flags |= 128;
        }
        if (
          ((u = l.memoizedState),
          u !== null && ((u.rendering = null), (u.tail = null), (u.lastEffect = null)),
          O(Mt, Mt.current),
          a)
        )
          break;
        return null;
      case 22:
        return ((l.lanes = 0), Bo(t, l, e, l.pendingProps));
      case 24:
        ee(l, Ot, t.memoizedState.cache);
    }
    return Ql(t, l, e);
  }
  function Ko(t, l, e) {
    if (t !== null)
      if (t.memoizedProps !== l.pendingProps) Nt = !0;
      else {
        if (!Ec(t, e) && (l.flags & 128) === 0) return ((Nt = !1), em(t, l, e));
        Nt = (t.flags & 131072) !== 0;
      }
    else ((Nt = !1), et && (l.flags & 1048576) !== 0 && Ts(l, Va, l.index));
    switch (((l.lanes = 0), l.tag)) {
      case 16:
        t: {
          var a = l.pendingProps;
          if (((t = Re(l.elementType)), (l.type = t), typeof t == 'function'))
            Mi(t)
              ? ((a = Ge(t, a)), (l.tag = 1), (l = Qo(null, l, t, a, e)))
              : ((l.tag = 0), (l = hc(null, l, t, a, e)));
          else {
            if (t != null) {
              var u = t.$$typeof;
              if (u === U) {
                ((l.tag = 11), (l = Ho(null, l, t, a, e)));
                break t;
              } else if (u === k) {
                ((l.tag = 14), (l = Ro(null, l, t, a, e)));
                break t;
              }
            }
            throw ((l = Ul(t) || t), Error(r(306, l, '')));
          }
        }
        return l;
      case 0:
        return hc(t, l, l.type, l.pendingProps, e);
      case 1:
        return ((a = l.type), (u = Ge(a, l.pendingProps)), Qo(t, l, a, u, e));
      case 3:
        t: {
          if ((Vt(l, l.stateNode.containerInfo), t === null)) throw Error(r(387));
          a = l.pendingProps;
          var n = l.memoizedState;
          ((u = n.element), Qi(t, l), Ia(l, a, null, e));
          var i = l.memoizedState;
          if (((a = i.cache), ee(l, Ot, a), a !== n.cache && Ri(l, [Ot], e, !0), Fa(), (a = i.element), n.isDehydrated))
            if (
              ((n = { element: a, isDehydrated: !1, cache: i.cache }),
              (l.updateQueue.baseState = n),
              (l.memoizedState = n),
              l.flags & 256)
            ) {
              l = Lo(t, l, a, e);
              break t;
            } else if (a !== u) {
              ((u = hl(Error(r(424)), l)), wa(u), (l = Lo(t, l, a, e)));
              break t;
            } else {
              switch (((t = l.stateNode.containerInfo), t.nodeType)) {
                case 9:
                  t = t.body;
                  break;
                default:
                  t = t.nodeName === 'HTML' ? t.ownerDocument.body : t;
              }
              for (gt = Sl(t.firstChild), Gt = l, et = !0, te = null, gl = !0, e = qs(l, null, a, e), l.child = e; e; )
                ((e.flags = (e.flags & -3) | 4096), (e = e.sibling));
            }
          else {
            if ((Ue(), a === u)) {
              l = Ql(t, l, e);
              break t;
            }
            Qt(t, l, a, e);
          }
          l = l.child;
        }
        return l;
      case 26:
        return (
          hn(t, l),
          t === null
            ? (e = a0(l.type, null, l.pendingProps, null))
              ? (l.memoizedState = e)
              : et ||
                ((e = l.type),
                (t = l.pendingProps),
                (a = Un(F.current).createElement(e)),
                (a[Yt] = l),
                (a[Jt] = t),
                Lt(a, e, t),
                qt(a),
                (l.stateNode = a))
            : (l.memoizedState = a0(l.type, t.memoizedProps, l.pendingProps, t.memoizedState)),
          null
        );
      case 27:
        return (
          Da(l),
          t === null &&
            et &&
            ((a = l.stateNode = t0(l.type, l.pendingProps, F.current)),
            (Gt = l),
            (gl = !0),
            (u = gt),
            ye(l.type) ? ((tf = u), (gt = Sl(a.firstChild))) : (gt = u)),
          Qt(t, l, l.pendingProps.children, e),
          hn(t, l),
          t === null && (l.flags |= 4194304),
          l.child
        );
      case 5:
        return (
          t === null &&
            et &&
            ((u = a = gt) &&
              ((a = jm(a, l.type, l.pendingProps, gl)),
              a !== null ? ((l.stateNode = a), (Gt = l), (gt = Sl(a.firstChild)), (gl = !1), (u = !0)) : (u = !1)),
            u || le(l)),
          Da(l),
          (u = l.type),
          (n = l.pendingProps),
          (i = t !== null ? t.memoizedProps : null),
          (a = n.children),
          $c(u, n) ? (a = null) : i !== null && $c(u, i) && (l.flags |= 32),
          l.memoizedState !== null && ((u = ki(t, l, Jd, null, null, e)), (bu._currentValue = u)),
          hn(t, l),
          Qt(t, l, a, e),
          l.child
        );
      case 6:
        return (
          t === null &&
            et &&
            ((t = e = gt) &&
              ((e = Cm(e, l.pendingProps, gl)),
              e !== null ? ((l.stateNode = e), (Gt = l), (gt = null), (t = !0)) : (t = !1)),
            t || le(l)),
          null
        );
      case 13:
        return Zo(t, l, e);
      case 4:
        return (
          Vt(l, l.stateNode.containerInfo),
          (a = l.pendingProps),
          t === null ? (l.child = Be(l, null, a, e)) : Qt(t, l, a, e),
          l.child
        );
      case 11:
        return Ho(t, l, l.type, l.pendingProps, e);
      case 7:
        return (Qt(t, l, l.pendingProps, e), l.child);
      case 8:
        return (Qt(t, l, l.pendingProps.children, e), l.child);
      case 12:
        return (Qt(t, l, l.pendingProps.children, e), l.child);
      case 10:
        return ((a = l.pendingProps), ee(l, l.type, a.value), Qt(t, l, a.children, e), l.child);
      case 9:
        return (
          (u = l.type._context),
          (a = l.pendingProps.children),
          Ce(l),
          (u = Xt(u)),
          (a = a(u)),
          (l.flags |= 1),
          Qt(t, l, a, e),
          l.child
        );
      case 14:
        return Ro(t, l, l.type, l.pendingProps, e);
      case 15:
        return qo(t, l, l.type, l.pendingProps, e);
      case 19:
        return wo(t, l, e);
      case 31:
        return lm(t, l, e);
      case 22:
        return Bo(t, l, e, l.pendingProps);
      case 24:
        return (
          Ce(l),
          (a = Xt(Ot)),
          t === null
            ? ((u = Yi()),
              u === null &&
                ((u = vt),
                (n = qi()),
                (u.pooledCache = n),
                n.refCount++,
                n !== null && (u.pooledCacheLanes |= e),
                (u = n)),
              (l.memoizedState = { parent: a, cache: u }),
              Xi(l),
              ee(l, Ot, u))
            : ((t.lanes & e) !== 0 && (Qi(t, l), Ia(l, null, null, e), Fa()),
              (u = t.memoizedState),
              (n = l.memoizedState),
              u.parent !== a
                ? ((u = { parent: a, cache: a }),
                  (l.memoizedState = u),
                  l.lanes === 0 && (l.memoizedState = l.updateQueue.baseState = u),
                  ee(l, Ot, a))
                : ((a = n.cache), ee(l, Ot, a), a !== u.cache && Ri(l, [Ot], e, !0))),
          Qt(t, l, l.pendingProps.children, e),
          l.child
        );
      case 29:
        throw l.pendingProps;
    }
    throw Error(r(156, l.tag));
  }
  function Ll(t) {
    t.flags |= 4;
  }
  function zc(t, l, e, a, u) {
    if (((l = (t.mode & 32) !== 0) && (l = !1), l)) {
      if (((t.flags |= 16777216), (u & 335544128) === u))
        if (t.stateNode.complete) t.flags |= 8192;
        else if (Sr()) t.flags |= 8192;
        else throw ((qe = Iu), Gi);
    } else t.flags &= -16777217;
  }
  function Jo(t, l) {
    if (l.type !== 'stylesheet' || (l.state.loading & 4) !== 0) t.flags &= -16777217;
    else if (((t.flags |= 16777216), !f0(l)))
      if (Sr()) t.flags |= 8192;
      else throw ((qe = Iu), Gi);
  }
  function vn(t, l) {
    (l !== null && (t.flags |= 4),
      t.flags & 16384 && ((l = t.tag !== 22 ? _f() : 536870912), (t.lanes |= l), (Sa |= l)));
  }
  function uu(t, l) {
    if (!et)
      switch (t.tailMode) {
        case 'hidden':
          l = t.tail;
          for (var e = null; l !== null; ) (l.alternate !== null && (e = l), (l = l.sibling));
          e === null ? (t.tail = null) : (e.sibling = null);
          break;
        case 'collapsed':
          e = t.tail;
          for (var a = null; e !== null; ) (e.alternate !== null && (a = e), (e = e.sibling));
          a === null ? (l || t.tail === null ? (t.tail = null) : (t.tail.sibling = null)) : (a.sibling = null);
      }
  }
  function bt(t) {
    var l = t.alternate !== null && t.alternate.child === t.child,
      e = 0,
      a = 0;
    if (l)
      for (var u = t.child; u !== null; )
        ((e |= u.lanes | u.childLanes),
          (a |= u.subtreeFlags & 65011712),
          (a |= u.flags & 65011712),
          (u.return = t),
          (u = u.sibling));
    else
      for (u = t.child; u !== null; )
        ((e |= u.lanes | u.childLanes), (a |= u.subtreeFlags), (a |= u.flags), (u.return = t), (u = u.sibling));
    return ((t.subtreeFlags |= a), (t.childLanes = e), l);
  }
  function am(t, l, e) {
    var a = l.pendingProps;
    switch ((Ni(l), l.tag)) {
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return (bt(l), null);
      case 1:
        return (bt(l), null);
      case 3:
        return (
          (e = l.stateNode),
          (a = null),
          t !== null && (a = t.memoizedState.cache),
          l.memoizedState.cache !== a && (l.flags |= 2048),
          Yl(Ot),
          _t(),
          e.pendingContext && ((e.context = e.pendingContext), (e.pendingContext = null)),
          (t === null || t.child === null) &&
            (ia(l)
              ? Ll(l)
              : t === null || (t.memoizedState.isDehydrated && (l.flags & 256) === 0) || ((l.flags |= 1024), ji())),
          bt(l),
          null
        );
      case 26:
        var u = l.type,
          n = l.memoizedState;
        return (
          t === null
            ? (Ll(l), n !== null ? (bt(l), Jo(l, n)) : (bt(l), zc(l, u, null, a, e)))
            : n
              ? n !== t.memoizedState
                ? (Ll(l), bt(l), Jo(l, n))
                : (bt(l), (l.flags &= -16777217))
              : ((t = t.memoizedProps), t !== a && Ll(l), bt(l), zc(l, u, t, a, e)),
          null
        );
      case 27:
        if ((Mu(l), (e = F.current), (u = l.type), t !== null && l.stateNode != null)) t.memoizedProps !== a && Ll(l);
        else {
          if (!a) {
            if (l.stateNode === null) throw Error(r(166));
            return (bt(l), null);
          }
          ((t = C.current), ia(l) ? _s(l) : ((t = t0(u, a, e)), (l.stateNode = t), Ll(l)));
        }
        return (bt(l), null);
      case 5:
        if ((Mu(l), (u = l.type), t !== null && l.stateNode != null)) t.memoizedProps !== a && Ll(l);
        else {
          if (!a) {
            if (l.stateNode === null) throw Error(r(166));
            return (bt(l), null);
          }
          if (((n = C.current), ia(l))) _s(l);
          else {
            var i = Un(F.current);
            switch (n) {
              case 1:
                n = i.createElementNS('http://www.w3.org/2000/svg', u);
                break;
              case 2:
                n = i.createElementNS('http://www.w3.org/1998/Math/MathML', u);
                break;
              default:
                switch (u) {
                  case 'svg':
                    n = i.createElementNS('http://www.w3.org/2000/svg', u);
                    break;
                  case 'math':
                    n = i.createElementNS('http://www.w3.org/1998/Math/MathML', u);
                    break;
                  case 'script':
                    ((n = i.createElement('div')),
                      (n.innerHTML = '<script><\/script>'),
                      (n = n.removeChild(n.firstChild)));
                    break;
                  case 'select':
                    ((n =
                      typeof a.is == 'string' ? i.createElement('select', { is: a.is }) : i.createElement('select')),
                      a.multiple ? (n.multiple = !0) : a.size && (n.size = a.size));
                    break;
                  default:
                    n = typeof a.is == 'string' ? i.createElement(u, { is: a.is }) : i.createElement(u);
                }
            }
            ((n[Yt] = l), (n[Jt] = a));
            t: for (i = l.child; i !== null; ) {
              if (i.tag === 5 || i.tag === 6) n.appendChild(i.stateNode);
              else if (i.tag !== 4 && i.tag !== 27 && i.child !== null) {
                ((i.child.return = i), (i = i.child));
                continue;
              }
              if (i === l) break t;
              for (; i.sibling === null; ) {
                if (i.return === null || i.return === l) break t;
                i = i.return;
              }
              ((i.sibling.return = i.return), (i = i.sibling));
            }
            l.stateNode = n;
            t: switch ((Lt(n, u, a), u)) {
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
            a && Ll(l);
          }
        }
        return (bt(l), zc(l, l.type, t === null ? null : t.memoizedProps, l.pendingProps, e), null);
      case 6:
        if (t && l.stateNode != null) t.memoizedProps !== a && Ll(l);
        else {
          if (typeof a != 'string' && l.stateNode === null) throw Error(r(166));
          if (((t = F.current), ia(l))) {
            if (((t = l.stateNode), (e = l.memoizedProps), (a = null), (u = Gt), u !== null))
              switch (u.tag) {
                case 27:
                case 5:
                  a = u.memoizedProps;
              }
            ((t[Yt] = l),
              (t = !!(t.nodeValue === e || (a !== null && a.suppressHydrationWarning === !0) || Zr(t.nodeValue, e))),
              t || le(l, !0));
          } else ((t = Un(t).createTextNode(a)), (t[Yt] = l), (l.stateNode = t));
        }
        return (bt(l), null);
      case 31:
        if (((e = l.memoizedState), t === null || t.memoizedState !== null)) {
          if (((a = ia(l)), e !== null)) {
            if (t === null) {
              if (!a) throw Error(r(318));
              if (((t = l.memoizedState), (t = t !== null ? t.dehydrated : null), !t)) throw Error(r(557));
              t[Yt] = l;
            } else (Ue(), (l.flags & 128) === 0 && (l.memoizedState = null), (l.flags |= 4));
            (bt(l), (t = !1));
          } else
            ((e = ji()), t !== null && t.memoizedState !== null && (t.memoizedState.hydrationErrors = e), (t = !0));
          if (!t) return l.flags & 256 ? (cl(l), l) : (cl(l), null);
          if ((l.flags & 128) !== 0) throw Error(r(558));
        }
        return (bt(l), null);
      case 13:
        if (((a = l.memoizedState), t === null || (t.memoizedState !== null && t.memoizedState.dehydrated !== null))) {
          if (((u = ia(l)), a !== null && a.dehydrated !== null)) {
            if (t === null) {
              if (!u) throw Error(r(318));
              if (((u = l.memoizedState), (u = u !== null ? u.dehydrated : null), !u)) throw Error(r(317));
              u[Yt] = l;
            } else (Ue(), (l.flags & 128) === 0 && (l.memoizedState = null), (l.flags |= 4));
            (bt(l), (u = !1));
          } else
            ((u = ji()), t !== null && t.memoizedState !== null && (t.memoizedState.hydrationErrors = u), (u = !0));
          if (!u) return l.flags & 256 ? (cl(l), l) : (cl(l), null);
        }
        return (
          cl(l),
          (l.flags & 128) !== 0
            ? ((l.lanes = e), l)
            : ((e = a !== null),
              (t = t !== null && t.memoizedState !== null),
              e &&
                ((a = l.child),
                (u = null),
                a.alternate !== null &&
                  a.alternate.memoizedState !== null &&
                  a.alternate.memoizedState.cachePool !== null &&
                  (u = a.alternate.memoizedState.cachePool.pool),
                (n = null),
                a.memoizedState !== null && a.memoizedState.cachePool !== null && (n = a.memoizedState.cachePool.pool),
                n !== u && (a.flags |= 2048)),
              e !== t && e && (l.child.flags |= 8192),
              vn(l, l.updateQueue),
              bt(l),
              null)
        );
      case 4:
        return (_t(), t === null && Vc(l.stateNode.containerInfo), bt(l), null);
      case 10:
        return (Yl(l.type), bt(l), null);
      case 19:
        if ((T(Mt), (a = l.memoizedState), a === null)) return (bt(l), null);
        if (((u = (l.flags & 128) !== 0), (n = a.rendering), n === null))
          if (u) uu(a, !1);
          else {
            if (At !== 0 || (t !== null && (t.flags & 128) !== 0))
              for (t = l.child; t !== null; ) {
                if (((n = en(t)), n !== null)) {
                  for (
                    l.flags |= 128,
                      uu(a, !1),
                      t = n.updateQueue,
                      l.updateQueue = t,
                      vn(l, t),
                      l.subtreeFlags = 0,
                      t = e,
                      e = l.child;
                    e !== null;

                  )
                    (ps(e, t), (e = e.sibling));
                  return (O(Mt, (Mt.current & 1) | 2), et && ql(l, a.treeForkCount), l.child);
                }
                t = t.sibling;
              }
            a.tail !== null && ll() > En && ((l.flags |= 128), (u = !0), uu(a, !1), (l.lanes = 4194304));
          }
        else {
          if (!u)
            if (((t = en(n)), t !== null)) {
              if (
                ((l.flags |= 128),
                (u = !0),
                (t = t.updateQueue),
                (l.updateQueue = t),
                vn(l, t),
                uu(a, !0),
                a.tail === null && a.tailMode === 'hidden' && !n.alternate && !et)
              )
                return (bt(l), null);
            } else
              2 * ll() - a.renderingStartTime > En &&
                e !== 536870912 &&
                ((l.flags |= 128), (u = !0), uu(a, !1), (l.lanes = 4194304));
          a.isBackwards
            ? ((n.sibling = l.child), (l.child = n))
            : ((t = a.last), t !== null ? (t.sibling = n) : (l.child = n), (a.last = n));
        }
        return a.tail !== null
          ? ((t = a.tail),
            (a.rendering = t),
            (a.tail = t.sibling),
            (a.renderingStartTime = ll()),
            (t.sibling = null),
            (e = Mt.current),
            O(Mt, u ? (e & 1) | 2 : e & 1),
            et && ql(l, a.treeForkCount),
            t)
          : (bt(l), null);
      case 22:
      case 23:
        return (
          cl(l),
          wi(),
          (a = l.memoizedState !== null),
          t !== null ? (t.memoizedState !== null) !== a && (l.flags |= 8192) : a && (l.flags |= 8192),
          a
            ? (e & 536870912) !== 0 && (l.flags & 128) === 0 && (bt(l), l.subtreeFlags & 6 && (l.flags |= 8192))
            : bt(l),
          (e = l.updateQueue),
          e !== null && vn(l, e.retryQueue),
          (e = null),
          t !== null &&
            t.memoizedState !== null &&
            t.memoizedState.cachePool !== null &&
            (e = t.memoizedState.cachePool.pool),
          (a = null),
          l.memoizedState !== null && l.memoizedState.cachePool !== null && (a = l.memoizedState.cachePool.pool),
          a !== e && (l.flags |= 2048),
          t !== null && T(He),
          null
        );
      case 24:
        return (
          (e = null),
          t !== null && (e = t.memoizedState.cache),
          l.memoizedState.cache !== e && (l.flags |= 2048),
          Yl(Ot),
          bt(l),
          null
        );
      case 25:
        return null;
      case 30:
        return null;
    }
    throw Error(r(156, l.tag));
  }
  function um(t, l) {
    switch ((Ni(l), l.tag)) {
      case 1:
        return ((t = l.flags), t & 65536 ? ((l.flags = (t & -65537) | 128), l) : null);
      case 3:
        return (
          Yl(Ot),
          _t(),
          (t = l.flags),
          (t & 65536) !== 0 && (t & 128) === 0 ? ((l.flags = (t & -65537) | 128), l) : null
        );
      case 26:
      case 27:
      case 5:
        return (Mu(l), null);
      case 31:
        if (l.memoizedState !== null) {
          if ((cl(l), l.alternate === null)) throw Error(r(340));
          Ue();
        }
        return ((t = l.flags), t & 65536 ? ((l.flags = (t & -65537) | 128), l) : null);
      case 13:
        if ((cl(l), (t = l.memoizedState), t !== null && t.dehydrated !== null)) {
          if (l.alternate === null) throw Error(r(340));
          Ue();
        }
        return ((t = l.flags), t & 65536 ? ((l.flags = (t & -65537) | 128), l) : null);
      case 19:
        return (T(Mt), null);
      case 4:
        return (_t(), null);
      case 10:
        return (Yl(l.type), null);
      case 22:
      case 23:
        return (
          cl(l),
          wi(),
          t !== null && T(He),
          (t = l.flags),
          t & 65536 ? ((l.flags = (t & -65537) | 128), l) : null
        );
      case 24:
        return (Yl(Ot), null);
      case 25:
        return null;
      default:
        return null;
    }
  }
  function ko(t, l) {
    switch ((Ni(l), l.tag)) {
      case 3:
        (Yl(Ot), _t());
        break;
      case 26:
      case 27:
      case 5:
        Mu(l);
        break;
      case 4:
        _t();
        break;
      case 31:
        l.memoizedState !== null && cl(l);
        break;
      case 13:
        cl(l);
        break;
      case 19:
        T(Mt);
        break;
      case 10:
        Yl(l.type);
        break;
      case 22:
      case 23:
        (cl(l), wi(), t !== null && T(He));
        break;
      case 24:
        Yl(Ot);
    }
  }
  function nu(t, l) {
    try {
      var e = l.updateQueue,
        a = e !== null ? e.lastEffect : null;
      if (a !== null) {
        var u = a.next;
        e = u;
        do {
          if ((e.tag & t) === t) {
            a = void 0;
            var n = e.create,
              i = e.inst;
            ((a = n()), (i.destroy = a));
          }
          e = e.next;
        } while (e !== u);
      }
    } catch (c) {
      ot(l, l.return, c);
    }
  }
  function fe(t, l, e) {
    try {
      var a = l.updateQueue,
        u = a !== null ? a.lastEffect : null;
      if (u !== null) {
        var n = u.next;
        a = n;
        do {
          if ((a.tag & t) === t) {
            var i = a.inst,
              c = i.destroy;
            if (c !== void 0) {
              ((i.destroy = void 0), (u = l));
              var f = e,
                h = c;
              try {
                h();
              } catch (g) {
                ot(u, f, g);
              }
            }
          }
          a = a.next;
        } while (a !== n);
      }
    } catch (g) {
      ot(l, l.return, g);
    }
  }
  function $o(t) {
    var l = t.updateQueue;
    if (l !== null) {
      var e = t.stateNode;
      try {
        Ys(l, e);
      } catch (a) {
        ot(t, t.return, a);
      }
    }
  }
  function Wo(t, l, e) {
    ((e.props = Ge(t.type, t.memoizedProps)), (e.state = t.memoizedState));
    try {
      e.componentWillUnmount();
    } catch (a) {
      ot(t, l, a);
    }
  }
  function iu(t, l) {
    try {
      var e = t.ref;
      if (e !== null) {
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
        typeof e == 'function' ? (t.refCleanup = e(a)) : (e.current = a);
      }
    } catch (u) {
      ot(t, l, u);
    }
  }
  function Dl(t, l) {
    var e = t.ref,
      a = t.refCleanup;
    if (e !== null)
      if (typeof a == 'function')
        try {
          a();
        } catch (u) {
          ot(t, l, u);
        } finally {
          ((t.refCleanup = null), (t = t.alternate), t != null && (t.refCleanup = null));
        }
      else if (typeof e == 'function')
        try {
          e(null);
        } catch (u) {
          ot(t, l, u);
        }
      else e.current = null;
  }
  function Fo(t) {
    var l = t.type,
      e = t.memoizedProps,
      a = t.stateNode;
    try {
      t: switch (l) {
        case 'button':
        case 'input':
        case 'select':
        case 'textarea':
          e.autoFocus && a.focus();
          break t;
        case 'img':
          e.src ? (a.src = e.src) : e.srcSet && (a.srcset = e.srcSet);
      }
    } catch (u) {
      ot(t, t.return, u);
    }
  }
  function Tc(t, l, e) {
    try {
      var a = t.stateNode;
      (Mm(a, t.type, e, l), (a[Jt] = l));
    } catch (u) {
      ot(t, t.return, u);
    }
  }
  function Io(t) {
    return t.tag === 5 || t.tag === 3 || t.tag === 26 || (t.tag === 27 && ye(t.type)) || t.tag === 4;
  }
  function Ac(t) {
    t: for (;;) {
      for (; t.sibling === null; ) {
        if (t.return === null || Io(t.return)) return null;
        t = t.return;
      }
      for (t.sibling.return = t.return, t = t.sibling; t.tag !== 5 && t.tag !== 6 && t.tag !== 18; ) {
        if ((t.tag === 27 && ye(t.type)) || t.flags & 2 || t.child === null || t.tag === 4) continue t;
        ((t.child.return = t), (t = t.child));
      }
      if (!(t.flags & 2)) return t.stateNode;
    }
  }
  function _c(t, l, e) {
    var a = t.tag;
    if (a === 5 || a === 6)
      ((t = t.stateNode),
        l
          ? (e.nodeType === 9 ? e.body : e.nodeName === 'HTML' ? e.ownerDocument.body : e).insertBefore(t, l)
          : ((l = e.nodeType === 9 ? e.body : e.nodeName === 'HTML' ? e.ownerDocument.body : e),
            l.appendChild(t),
            (e = e._reactRootContainer),
            e != null || l.onclick !== null || (l.onclick = Cl)));
    else if (a !== 4 && (a === 27 && ye(t.type) && ((e = t.stateNode), (l = null)), (t = t.child), t !== null))
      for (_c(t, l, e), t = t.sibling; t !== null; ) (_c(t, l, e), (t = t.sibling));
  }
  function gn(t, l, e) {
    var a = t.tag;
    if (a === 5 || a === 6) ((t = t.stateNode), l ? e.insertBefore(t, l) : e.appendChild(t));
    else if (a !== 4 && (a === 27 && ye(t.type) && (e = t.stateNode), (t = t.child), t !== null))
      for (gn(t, l, e), t = t.sibling; t !== null; ) (gn(t, l, e), (t = t.sibling));
  }
  function Po(t) {
    var l = t.stateNode,
      e = t.memoizedProps;
    try {
      for (var a = t.type, u = l.attributes; u.length; ) l.removeAttributeNode(u[0]);
      (Lt(l, a, e), (l[Yt] = t), (l[Jt] = e));
    } catch (n) {
      ot(t, t.return, n);
    }
  }
  var Zl = !1,
    Ut = !1,
    Mc = !1,
    tr = typeof WeakSet == 'function' ? WeakSet : Set,
    Bt = null;
  function nm(t, l) {
    if (((t = t.containerInfo), (Jc = Yn), (t = rs(t)), Si(t))) {
      if ('selectionStart' in t) var e = { start: t.selectionStart, end: t.selectionEnd };
      else
        t: {
          e = ((e = t.ownerDocument) && e.defaultView) || window;
          var a = e.getSelection && e.getSelection();
          if (a && a.rangeCount !== 0) {
            e = a.anchorNode;
            var u = a.anchorOffset,
              n = a.focusNode;
            a = a.focusOffset;
            try {
              (e.nodeType, n.nodeType);
            } catch {
              e = null;
              break t;
            }
            var i = 0,
              c = -1,
              f = -1,
              h = 0,
              g = 0,
              E = t,
              y = null;
            l: for (;;) {
              for (
                var v;
                E !== e || (u !== 0 && E.nodeType !== 3) || (c = i + u),
                  E !== n || (a !== 0 && E.nodeType !== 3) || (f = i + a),
                  E.nodeType === 3 && (i += E.nodeValue.length),
                  (v = E.firstChild) !== null;

              )
                ((y = E), (E = v));
              for (;;) {
                if (E === t) break l;
                if ((y === e && ++h === u && (c = i), y === n && ++g === a && (f = i), (v = E.nextSibling) !== null))
                  break;
                ((E = y), (y = E.parentNode));
              }
              E = v;
            }
            e = c === -1 || f === -1 ? null : { start: c, end: f };
          } else e = null;
        }
      e = e || { start: 0, end: 0 };
    } else e = null;
    for (kc = { focusedElem: t, selectionRange: e }, Yn = !1, Bt = l; Bt !== null; )
      if (((l = Bt), (t = l.child), (l.subtreeFlags & 1028) !== 0 && t !== null)) ((t.return = l), (Bt = t));
      else
        for (; Bt !== null; ) {
          switch (((l = Bt), (n = l.alternate), (t = l.flags), l.tag)) {
            case 0:
              if ((t & 4) !== 0 && ((t = l.updateQueue), (t = t !== null ? t.events : null), t !== null))
                for (e = 0; e < t.length; e++) ((u = t[e]), (u.ref.impl = u.nextImpl));
              break;
            case 11:
            case 15:
              break;
            case 1:
              if ((t & 1024) !== 0 && n !== null) {
                ((t = void 0), (e = l), (u = n.memoizedProps), (n = n.memoizedState), (a = e.stateNode));
                try {
                  var N = Ge(e.type, u);
                  ((t = a.getSnapshotBeforeUpdate(N, n)), (a.__reactInternalSnapshotBeforeUpdate = t));
                } catch (B) {
                  ot(e, e.return, B);
                }
              }
              break;
            case 3:
              if ((t & 1024) !== 0) {
                if (((t = l.stateNode.containerInfo), (e = t.nodeType), e === 9)) Fc(t);
                else if (e === 1)
                  switch (t.nodeName) {
                    case 'HEAD':
                    case 'HTML':
                    case 'BODY':
                      Fc(t);
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
              if ((t & 1024) !== 0) throw Error(r(163));
          }
          if (((t = l.sibling), t !== null)) {
            ((t.return = l.return), (Bt = t));
            break;
          }
          Bt = l.return;
        }
  }
  function lr(t, l, e) {
    var a = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        (wl(t, e), a & 4 && nu(5, e));
        break;
      case 1:
        if ((wl(t, e), a & 4))
          if (((t = e.stateNode), l === null))
            try {
              t.componentDidMount();
            } catch (i) {
              ot(e, e.return, i);
            }
          else {
            var u = Ge(e.type, l.memoizedProps);
            l = l.memoizedState;
            try {
              t.componentDidUpdate(u, l, t.__reactInternalSnapshotBeforeUpdate);
            } catch (i) {
              ot(e, e.return, i);
            }
          }
        (a & 64 && $o(e), a & 512 && iu(e, e.return));
        break;
      case 3:
        if ((wl(t, e), a & 64 && ((t = e.updateQueue), t !== null))) {
          if (((l = null), e.child !== null))
            switch (e.child.tag) {
              case 27:
              case 5:
                l = e.child.stateNode;
                break;
              case 1:
                l = e.child.stateNode;
            }
          try {
            Ys(t, l);
          } catch (i) {
            ot(e, e.return, i);
          }
        }
        break;
      case 27:
        l === null && a & 4 && Po(e);
      case 26:
      case 5:
        (wl(t, e), l === null && a & 4 && Fo(e), a & 512 && iu(e, e.return));
        break;
      case 12:
        wl(t, e);
        break;
      case 31:
        (wl(t, e), a & 4 && ur(t, e));
        break;
      case 13:
        (wl(t, e),
          a & 4 && nr(t, e),
          a & 64 &&
            ((t = e.memoizedState),
            t !== null && ((t = t.dehydrated), t !== null && ((e = hm.bind(null, e)), Hm(t, e)))));
        break;
      case 22:
        if (((a = e.memoizedState !== null || Zl), !a)) {
          ((l = (l !== null && l.memoizedState !== null) || Ut), (u = Zl));
          var n = Ut;
          ((Zl = a), (Ut = l) && !n ? Kl(t, e, (e.subtreeFlags & 8772) !== 0) : wl(t, e), (Zl = u), (Ut = n));
        }
        break;
      case 30:
        break;
      default:
        wl(t, e);
    }
  }
  function er(t) {
    var l = t.alternate;
    (l !== null && ((t.alternate = null), er(l)),
      (t.child = null),
      (t.deletions = null),
      (t.sibling = null),
      t.tag === 5 && ((l = t.stateNode), l !== null && ei(l)),
      (t.stateNode = null),
      (t.return = null),
      (t.dependencies = null),
      (t.memoizedProps = null),
      (t.memoizedState = null),
      (t.pendingProps = null),
      (t.stateNode = null),
      (t.updateQueue = null));
  }
  var pt = null,
    $t = !1;
  function Vl(t, l, e) {
    for (e = e.child; e !== null; ) (ar(t, l, e), (e = e.sibling));
  }
  function ar(t, l, e) {
    if (el && typeof el.onCommitFiberUnmount == 'function')
      try {
        el.onCommitFiberUnmount(Na, e);
      } catch {}
    switch (e.tag) {
      case 26:
        (Ut || Dl(e, l),
          Vl(t, l, e),
          e.memoizedState ? e.memoizedState.count-- : e.stateNode && ((e = e.stateNode), e.parentNode.removeChild(e)));
        break;
      case 27:
        Ut || Dl(e, l);
        var a = pt,
          u = $t;
        (ye(e.type) && ((pt = e.stateNode), ($t = !1)), Vl(t, l, e), yu(e.stateNode), (pt = a), ($t = u));
        break;
      case 5:
        Ut || Dl(e, l);
      case 6:
        if (((a = pt), (u = $t), (pt = null), Vl(t, l, e), (pt = a), ($t = u), pt !== null))
          if ($t)
            try {
              (pt.nodeType === 9 ? pt.body : pt.nodeName === 'HTML' ? pt.ownerDocument.body : pt).removeChild(
                e.stateNode
              );
            } catch (n) {
              ot(e, l, n);
            }
          else
            try {
              pt.removeChild(e.stateNode);
            } catch (n) {
              ot(e, l, n);
            }
        break;
      case 18:
        pt !== null &&
          ($t
            ? ((t = pt),
              $r(t.nodeType === 9 ? t.body : t.nodeName === 'HTML' ? t.ownerDocument.body : t, e.stateNode),
              xa(t))
            : $r(pt, e.stateNode));
        break;
      case 4:
        ((a = pt), (u = $t), (pt = e.stateNode.containerInfo), ($t = !0), Vl(t, l, e), (pt = a), ($t = u));
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        (fe(2, e, l), Ut || fe(4, e, l), Vl(t, l, e));
        break;
      case 1:
        (Ut || (Dl(e, l), (a = e.stateNode), typeof a.componentWillUnmount == 'function' && Wo(e, l, a)), Vl(t, l, e));
        break;
      case 21:
        Vl(t, l, e);
        break;
      case 22:
        ((Ut = (a = Ut) || e.memoizedState !== null), Vl(t, l, e), (Ut = a));
        break;
      default:
        Vl(t, l, e);
    }
  }
  function ur(t, l) {
    if (l.memoizedState === null && ((t = l.alternate), t !== null && ((t = t.memoizedState), t !== null))) {
      t = t.dehydrated;
      try {
        xa(t);
      } catch (e) {
        ot(l, l.return, e);
      }
    }
  }
  function nr(t, l) {
    if (
      l.memoizedState === null &&
      ((t = l.alternate), t !== null && ((t = t.memoizedState), t !== null && ((t = t.dehydrated), t !== null)))
    )
      try {
        xa(t);
      } catch (e) {
        ot(l, l.return, e);
      }
  }
  function im(t) {
    switch (t.tag) {
      case 31:
      case 13:
      case 19:
        var l = t.stateNode;
        return (l === null && (l = t.stateNode = new tr()), l);
      case 22:
        return ((t = t.stateNode), (l = t._retryCache), l === null && (l = t._retryCache = new tr()), l);
      default:
        throw Error(r(435, t.tag));
    }
  }
  function bn(t, l) {
    var e = im(t);
    l.forEach(function (a) {
      if (!e.has(a)) {
        e.add(a);
        var u = ym.bind(null, t, a);
        a.then(u, u);
      }
    });
  }
  function Wt(t, l) {
    var e = l.deletions;
    if (e !== null)
      for (var a = 0; a < e.length; a++) {
        var u = e[a],
          n = t,
          i = l,
          c = i;
        t: for (; c !== null; ) {
          switch (c.tag) {
            case 27:
              if (ye(c.type)) {
                ((pt = c.stateNode), ($t = !1));
                break t;
              }
              break;
            case 5:
              ((pt = c.stateNode), ($t = !1));
              break t;
            case 3:
            case 4:
              ((pt = c.stateNode.containerInfo), ($t = !0));
              break t;
          }
          c = c.return;
        }
        if (pt === null) throw Error(r(160));
        (ar(n, i, u), (pt = null), ($t = !1), (n = u.alternate), n !== null && (n.return = null), (u.return = null));
      }
    if (l.subtreeFlags & 13886) for (l = l.child; l !== null; ) (ir(l, t), (l = l.sibling));
  }
  var Tl = null;
  function ir(t, l) {
    var e = t.alternate,
      a = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        (Wt(l, t), Ft(t), a & 4 && (fe(3, t, t.return), nu(3, t), fe(5, t, t.return)));
        break;
      case 1:
        (Wt(l, t),
          Ft(t),
          a & 512 && (Ut || e === null || Dl(e, e.return)),
          a & 64 &&
            Zl &&
            ((t = t.updateQueue),
            t !== null &&
              ((a = t.callbacks),
              a !== null &&
                ((e = t.shared.hiddenCallbacks), (t.shared.hiddenCallbacks = e === null ? a : e.concat(a))))));
        break;
      case 26:
        var u = Tl;
        if ((Wt(l, t), Ft(t), a & 512 && (Ut || e === null || Dl(e, e.return)), a & 4)) {
          var n = e !== null ? e.memoizedState : null;
          if (((a = t.memoizedState), e === null))
            if (a === null)
              if (t.stateNode === null) {
                t: {
                  ((a = t.type), (e = t.memoizedProps), (u = u.ownerDocument || u));
                  l: switch (a) {
                    case 'title':
                      ((n = u.getElementsByTagName('title')[0]),
                        (!n ||
                          n[Ca] ||
                          n[Yt] ||
                          n.namespaceURI === 'http://www.w3.org/2000/svg' ||
                          n.hasAttribute('itemprop')) &&
                          ((n = u.createElement(a)), u.head.insertBefore(n, u.querySelector('head > title'))),
                        Lt(n, a, e),
                        (n[Yt] = t),
                        qt(n),
                        (a = n));
                      break t;
                    case 'link':
                      var i = i0('link', 'href', u).get(a + (e.href || ''));
                      if (i) {
                        for (var c = 0; c < i.length; c++)
                          if (
                            ((n = i[c]),
                            n.getAttribute('href') === (e.href == null || e.href === '' ? null : e.href) &&
                              n.getAttribute('rel') === (e.rel == null ? null : e.rel) &&
                              n.getAttribute('title') === (e.title == null ? null : e.title) &&
                              n.getAttribute('crossorigin') === (e.crossOrigin == null ? null : e.crossOrigin))
                          ) {
                            i.splice(c, 1);
                            break l;
                          }
                      }
                      ((n = u.createElement(a)), Lt(n, a, e), u.head.appendChild(n));
                      break;
                    case 'meta':
                      if ((i = i0('meta', 'content', u).get(a + (e.content || '')))) {
                        for (c = 0; c < i.length; c++)
                          if (
                            ((n = i[c]),
                            n.getAttribute('content') === (e.content == null ? null : '' + e.content) &&
                              n.getAttribute('name') === (e.name == null ? null : e.name) &&
                              n.getAttribute('property') === (e.property == null ? null : e.property) &&
                              n.getAttribute('http-equiv') === (e.httpEquiv == null ? null : e.httpEquiv) &&
                              n.getAttribute('charset') === (e.charSet == null ? null : e.charSet))
                          ) {
                            i.splice(c, 1);
                            break l;
                          }
                      }
                      ((n = u.createElement(a)), Lt(n, a, e), u.head.appendChild(n));
                      break;
                    default:
                      throw Error(r(468, a));
                  }
                  ((n[Yt] = t), qt(n), (a = n));
                }
                t.stateNode = a;
              } else c0(u, t.type, t.stateNode);
            else t.stateNode = n0(u, a, t.memoizedProps);
          else
            n !== a
              ? (n === null ? e.stateNode !== null && ((e = e.stateNode), e.parentNode.removeChild(e)) : n.count--,
                a === null ? c0(u, t.type, t.stateNode) : n0(u, a, t.memoizedProps))
              : a === null && t.stateNode !== null && Tc(t, t.memoizedProps, e.memoizedProps);
        }
        break;
      case 27:
        (Wt(l, t),
          Ft(t),
          a & 512 && (Ut || e === null || Dl(e, e.return)),
          e !== null && a & 4 && Tc(t, t.memoizedProps, e.memoizedProps));
        break;
      case 5:
        if ((Wt(l, t), Ft(t), a & 512 && (Ut || e === null || Dl(e, e.return)), t.flags & 32)) {
          u = t.stateNode;
          try {
            We(u, '');
          } catch (N) {
            ot(t, t.return, N);
          }
        }
        (a & 4 && t.stateNode != null && ((u = t.memoizedProps), Tc(t, u, e !== null ? e.memoizedProps : u)),
          a & 1024 && (Mc = !0));
        break;
      case 6:
        if ((Wt(l, t), Ft(t), a & 4)) {
          if (t.stateNode === null) throw Error(r(162));
          ((a = t.memoizedProps), (e = t.stateNode));
          try {
            e.nodeValue = a;
          } catch (N) {
            ot(t, t.return, N);
          }
        }
        break;
      case 3:
        if (
          ((Hn = null),
          (u = Tl),
          (Tl = jn(l.containerInfo)),
          Wt(l, t),
          (Tl = u),
          Ft(t),
          a & 4 && e !== null && e.memoizedState.isDehydrated)
        )
          try {
            xa(l.containerInfo);
          } catch (N) {
            ot(t, t.return, N);
          }
        Mc && ((Mc = !1), cr(t));
        break;
      case 4:
        ((a = Tl), (Tl = jn(t.stateNode.containerInfo)), Wt(l, t), Ft(t), (Tl = a));
        break;
      case 12:
        (Wt(l, t), Ft(t));
        break;
      case 31:
        (Wt(l, t), Ft(t), a & 4 && ((a = t.updateQueue), a !== null && ((t.updateQueue = null), bn(t, a))));
        break;
      case 13:
        (Wt(l, t),
          Ft(t),
          t.child.flags & 8192 && (t.memoizedState !== null) != (e !== null && e.memoizedState !== null) && (pn = ll()),
          a & 4 && ((a = t.updateQueue), a !== null && ((t.updateQueue = null), bn(t, a))));
        break;
      case 22:
        u = t.memoizedState !== null;
        var f = e !== null && e.memoizedState !== null,
          h = Zl,
          g = Ut;
        if (((Zl = h || u), (Ut = g || f), Wt(l, t), (Ut = g), (Zl = h), Ft(t), a & 8192))
          t: for (
            l = t.stateNode,
              l._visibility = u ? l._visibility & -2 : l._visibility | 1,
              u && (e === null || f || Zl || Ut || Xe(t)),
              e = null,
              l = t;
            ;

          ) {
            if (l.tag === 5 || l.tag === 26) {
              if (e === null) {
                f = e = l;
                try {
                  if (((n = f.stateNode), u))
                    ((i = n.style),
                      typeof i.setProperty == 'function'
                        ? i.setProperty('display', 'none', 'important')
                        : (i.display = 'none'));
                  else {
                    c = f.stateNode;
                    var E = f.memoizedProps.style,
                      y = E != null && E.hasOwnProperty('display') ? E.display : null;
                    c.style.display = y == null || typeof y == 'boolean' ? '' : ('' + y).trim();
                  }
                } catch (N) {
                  ot(f, f.return, N);
                }
              }
            } else if (l.tag === 6) {
              if (e === null) {
                f = l;
                try {
                  f.stateNode.nodeValue = u ? '' : f.memoizedProps;
                } catch (N) {
                  ot(f, f.return, N);
                }
              }
            } else if (l.tag === 18) {
              if (e === null) {
                f = l;
                try {
                  var v = f.stateNode;
                  u ? Wr(v, !0) : Wr(f.stateNode, !1);
                } catch (N) {
                  ot(f, f.return, N);
                }
              }
            } else if (((l.tag !== 22 && l.tag !== 23) || l.memoizedState === null || l === t) && l.child !== null) {
              ((l.child.return = l), (l = l.child));
              continue;
            }
            if (l === t) break t;
            for (; l.sibling === null; ) {
              if (l.return === null || l.return === t) break t;
              (e === l && (e = null), (l = l.return));
            }
            (e === l && (e = null), (l.sibling.return = l.return), (l = l.sibling));
          }
        a & 4 &&
          ((a = t.updateQueue), a !== null && ((e = a.retryQueue), e !== null && ((a.retryQueue = null), bn(t, e))));
        break;
      case 19:
        (Wt(l, t), Ft(t), a & 4 && ((a = t.updateQueue), a !== null && ((t.updateQueue = null), bn(t, a))));
        break;
      case 30:
        break;
      case 21:
        break;
      default:
        (Wt(l, t), Ft(t));
    }
  }
  function Ft(t) {
    var l = t.flags;
    if (l & 2) {
      try {
        for (var e, a = t.return; a !== null; ) {
          if (Io(a)) {
            e = a;
            break;
          }
          a = a.return;
        }
        if (e == null) throw Error(r(160));
        switch (e.tag) {
          case 27:
            var u = e.stateNode,
              n = Ac(t);
            gn(t, n, u);
            break;
          case 5:
            var i = e.stateNode;
            e.flags & 32 && (We(i, ''), (e.flags &= -33));
            var c = Ac(t);
            gn(t, c, i);
            break;
          case 3:
          case 4:
            var f = e.stateNode.containerInfo,
              h = Ac(t);
            _c(t, h, f);
            break;
          default:
            throw Error(r(161));
        }
      } catch (g) {
        ot(t, t.return, g);
      }
      t.flags &= -3;
    }
    l & 4096 && (t.flags &= -4097);
  }
  function cr(t) {
    if (t.subtreeFlags & 1024)
      for (t = t.child; t !== null; ) {
        var l = t;
        (cr(l), l.tag === 5 && l.flags & 1024 && l.stateNode.reset(), (t = t.sibling));
      }
  }
  function wl(t, l) {
    if (l.subtreeFlags & 8772) for (l = l.child; l !== null; ) (lr(t, l.alternate, l), (l = l.sibling));
  }
  function Xe(t) {
    for (t = t.child; t !== null; ) {
      var l = t;
      switch (l.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          (fe(4, l, l.return), Xe(l));
          break;
        case 1:
          Dl(l, l.return);
          var e = l.stateNode;
          (typeof e.componentWillUnmount == 'function' && Wo(l, l.return, e), Xe(l));
          break;
        case 27:
          yu(l.stateNode);
        case 26:
        case 5:
          (Dl(l, l.return), Xe(l));
          break;
        case 22:
          l.memoizedState === null && Xe(l);
          break;
        case 30:
          Xe(l);
          break;
        default:
          Xe(l);
      }
      t = t.sibling;
    }
  }
  function Kl(t, l, e) {
    for (e = e && (l.subtreeFlags & 8772) !== 0, l = l.child; l !== null; ) {
      var a = l.alternate,
        u = t,
        n = l,
        i = n.flags;
      switch (n.tag) {
        case 0:
        case 11:
        case 15:
          (Kl(u, n, e), nu(4, n));
          break;
        case 1:
          if ((Kl(u, n, e), (a = n), (u = a.stateNode), typeof u.componentDidMount == 'function'))
            try {
              u.componentDidMount();
            } catch (h) {
              ot(a, a.return, h);
            }
          if (((a = n), (u = a.updateQueue), u !== null)) {
            var c = a.stateNode;
            try {
              var f = u.shared.hiddenCallbacks;
              if (f !== null) for (u.shared.hiddenCallbacks = null, u = 0; u < f.length; u++) Bs(f[u], c);
            } catch (h) {
              ot(a, a.return, h);
            }
          }
          (e && i & 64 && $o(n), iu(n, n.return));
          break;
        case 27:
          Po(n);
        case 26:
        case 5:
          (Kl(u, n, e), e && a === null && i & 4 && Fo(n), iu(n, n.return));
          break;
        case 12:
          Kl(u, n, e);
          break;
        case 31:
          (Kl(u, n, e), e && i & 4 && ur(u, n));
          break;
        case 13:
          (Kl(u, n, e), e && i & 4 && nr(u, n));
          break;
        case 22:
          (n.memoizedState === null && Kl(u, n, e), iu(n, n.return));
          break;
        case 30:
          break;
        default:
          Kl(u, n, e);
      }
      l = l.sibling;
    }
  }
  function xc(t, l) {
    var e = null;
    (t !== null &&
      t.memoizedState !== null &&
      t.memoizedState.cachePool !== null &&
      (e = t.memoizedState.cachePool.pool),
      (t = null),
      l.memoizedState !== null && l.memoizedState.cachePool !== null && (t = l.memoizedState.cachePool.pool),
      t !== e && (t != null && t.refCount++, e != null && Ka(e)));
  }
  function Oc(t, l) {
    ((t = null),
      l.alternate !== null && (t = l.alternate.memoizedState.cache),
      (l = l.memoizedState.cache),
      l !== t && (l.refCount++, t != null && Ka(t)));
  }
  function Al(t, l, e, a) {
    if (l.subtreeFlags & 10256) for (l = l.child; l !== null; ) (fr(t, l, e, a), (l = l.sibling));
  }
  function fr(t, l, e, a) {
    var u = l.flags;
    switch (l.tag) {
      case 0:
      case 11:
      case 15:
        (Al(t, l, e, a), u & 2048 && nu(9, l));
        break;
      case 1:
        Al(t, l, e, a);
        break;
      case 3:
        (Al(t, l, e, a),
          u & 2048 &&
            ((t = null),
            l.alternate !== null && (t = l.alternate.memoizedState.cache),
            (l = l.memoizedState.cache),
            l !== t && (l.refCount++, t != null && Ka(t))));
        break;
      case 12:
        if (u & 2048) {
          (Al(t, l, e, a), (t = l.stateNode));
          try {
            var n = l.memoizedProps,
              i = n.id,
              c = n.onPostCommit;
            typeof c == 'function' && c(i, l.alternate === null ? 'mount' : 'update', t.passiveEffectDuration, -0);
          } catch (f) {
            ot(l, l.return, f);
          }
        } else Al(t, l, e, a);
        break;
      case 31:
        Al(t, l, e, a);
        break;
      case 13:
        Al(t, l, e, a);
        break;
      case 23:
        break;
      case 22:
        ((n = l.stateNode),
          (i = l.alternate),
          l.memoizedState !== null
            ? n._visibility & 2
              ? Al(t, l, e, a)
              : cu(t, l)
            : n._visibility & 2
              ? Al(t, l, e, a)
              : ((n._visibility |= 2), va(t, l, e, a, (l.subtreeFlags & 10256) !== 0 || !1)),
          u & 2048 && xc(i, l));
        break;
      case 24:
        (Al(t, l, e, a), u & 2048 && Oc(l.alternate, l));
        break;
      default:
        Al(t, l, e, a);
    }
  }
  function va(t, l, e, a, u) {
    for (u = u && ((l.subtreeFlags & 10256) !== 0 || !1), l = l.child; l !== null; ) {
      var n = t,
        i = l,
        c = e,
        f = a,
        h = i.flags;
      switch (i.tag) {
        case 0:
        case 11:
        case 15:
          (va(n, i, c, f, u), nu(8, i));
          break;
        case 23:
          break;
        case 22:
          var g = i.stateNode;
          (i.memoizedState !== null
            ? g._visibility & 2
              ? va(n, i, c, f, u)
              : cu(n, i)
            : ((g._visibility |= 2), va(n, i, c, f, u)),
            u && h & 2048 && xc(i.alternate, i));
          break;
        case 24:
          (va(n, i, c, f, u), u && h & 2048 && Oc(i.alternate, i));
          break;
        default:
          va(n, i, c, f, u);
      }
      l = l.sibling;
    }
  }
  function cu(t, l) {
    if (l.subtreeFlags & 10256)
      for (l = l.child; l !== null; ) {
        var e = t,
          a = l,
          u = a.flags;
        switch (a.tag) {
          case 22:
            (cu(e, a), u & 2048 && xc(a.alternate, a));
            break;
          case 24:
            (cu(e, a), u & 2048 && Oc(a.alternate, a));
            break;
          default:
            cu(e, a);
        }
        l = l.sibling;
      }
  }
  var fu = 8192;
  function ga(t, l, e) {
    if (t.subtreeFlags & fu) for (t = t.child; t !== null; ) (sr(t, l, e), (t = t.sibling));
  }
  function sr(t, l, e) {
    switch (t.tag) {
      case 26:
        (ga(t, l, e), t.flags & fu && t.memoizedState !== null && Km(e, Tl, t.memoizedState, t.memoizedProps));
        break;
      case 5:
        ga(t, l, e);
        break;
      case 3:
      case 4:
        var a = Tl;
        ((Tl = jn(t.stateNode.containerInfo)), ga(t, l, e), (Tl = a));
        break;
      case 22:
        t.memoizedState === null &&
          ((a = t.alternate),
          a !== null && a.memoizedState !== null ? ((a = fu), (fu = 16777216), ga(t, l, e), (fu = a)) : ga(t, l, e));
        break;
      default:
        ga(t, l, e);
    }
  }
  function or(t) {
    var l = t.alternate;
    if (l !== null && ((t = l.child), t !== null)) {
      l.child = null;
      do ((l = t.sibling), (t.sibling = null), (t = l));
      while (t !== null);
    }
  }
  function su(t) {
    var l = t.deletions;
    if ((t.flags & 16) !== 0) {
      if (l !== null)
        for (var e = 0; e < l.length; e++) {
          var a = l[e];
          ((Bt = a), dr(a, t));
        }
      or(t);
    }
    if (t.subtreeFlags & 10256) for (t = t.child; t !== null; ) (rr(t), (t = t.sibling));
  }
  function rr(t) {
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        (su(t), t.flags & 2048 && fe(9, t, t.return));
        break;
      case 3:
        su(t);
        break;
      case 12:
        su(t);
        break;
      case 22:
        var l = t.stateNode;
        t.memoizedState !== null && l._visibility & 2 && (t.return === null || t.return.tag !== 13)
          ? ((l._visibility &= -3), Sn(t))
          : su(t);
        break;
      default:
        su(t);
    }
  }
  function Sn(t) {
    var l = t.deletions;
    if ((t.flags & 16) !== 0) {
      if (l !== null)
        for (var e = 0; e < l.length; e++) {
          var a = l[e];
          ((Bt = a), dr(a, t));
        }
      or(t);
    }
    for (t = t.child; t !== null; ) {
      switch (((l = t), l.tag)) {
        case 0:
        case 11:
        case 15:
          (fe(8, l, l.return), Sn(l));
          break;
        case 22:
          ((e = l.stateNode), e._visibility & 2 && ((e._visibility &= -3), Sn(l)));
          break;
        default:
          Sn(l);
      }
      t = t.sibling;
    }
  }
  function dr(t, l) {
    for (; Bt !== null; ) {
      var e = Bt;
      switch (e.tag) {
        case 0:
        case 11:
        case 15:
          fe(8, e, l);
          break;
        case 23:
        case 22:
          if (e.memoizedState !== null && e.memoizedState.cachePool !== null) {
            var a = e.memoizedState.cachePool.pool;
            a != null && a.refCount++;
          }
          break;
        case 24:
          Ka(e.memoizedState.cache);
      }
      if (((a = e.child), a !== null)) ((a.return = e), (Bt = a));
      else
        t: for (e = t; Bt !== null; ) {
          a = Bt;
          var u = a.sibling,
            n = a.return;
          if ((er(a), a === e)) {
            Bt = null;
            break t;
          }
          if (u !== null) {
            ((u.return = n), (Bt = u));
            break t;
          }
          Bt = n;
        }
    }
  }
  var cm = {
      getCacheForType: function (t) {
        var l = Xt(Ot),
          e = l.data.get(t);
        return (e === void 0 && ((e = t()), l.data.set(t, e)), e);
      },
      cacheSignal: function () {
        return Xt(Ot).controller.signal;
      },
    },
    fm = typeof WeakMap == 'function' ? WeakMap : Map,
    nt = 0,
    vt = null,
    I = null,
    tt = 0,
    st = 0,
    fl = null,
    se = !1,
    ba = !1,
    Dc = !1,
    Jl = 0,
    At = 0,
    oe = 0,
    Qe = 0,
    Nc = 0,
    sl = 0,
    Sa = 0,
    ou = null,
    It = null,
    Uc = !1,
    pn = 0,
    mr = 0,
    En = 1 / 0,
    zn = null,
    re = null,
    Ht = 0,
    de = null,
    pa = null,
    kl = 0,
    jc = 0,
    Cc = null,
    hr = null,
    ru = 0,
    Hc = null;
  function ol() {
    return (nt & 2) !== 0 && tt !== 0 ? tt & -tt : b.T !== null ? Xc() : Df();
  }
  function yr() {
    if (sl === 0)
      if ((tt & 536870912) === 0 || et) {
        var t = Du;
        ((Du <<= 1), (Du & 3932160) === 0 && (Du = 262144), (sl = t));
      } else sl = 536870912;
    return ((t = il.current), t !== null && (t.flags |= 32), sl);
  }
  function Pt(t, l, e) {
    (((t === vt && (st === 2 || st === 9)) || t.cancelPendingCommit !== null) && (Ea(t, 0), me(t, tt, sl, !1)),
      ja(t, e),
      ((nt & 2) === 0 || t !== vt) &&
        (t === vt && ((nt & 2) === 0 && (Qe |= e), At === 4 && me(t, tt, sl, !1)), Nl(t)));
  }
  function vr(t, l, e) {
    if ((nt & 6) !== 0) throw Error(r(327));
    var a = (!e && (l & 127) === 0 && (l & t.expiredLanes) === 0) || Ua(t, l),
      u = a ? rm(t, l) : qc(t, l, !0),
      n = a;
    do {
      if (u === 0) {
        ba && !a && me(t, l, 0, !1);
        break;
      } else {
        if (((e = t.current.alternate), n && !sm(e))) {
          ((u = qc(t, l, !1)), (n = !1));
          continue;
        }
        if (u === 2) {
          if (((n = l), t.errorRecoveryDisabledLanes & n)) var i = 0;
          else ((i = t.pendingLanes & -536870913), (i = i !== 0 ? i : i & 536870912 ? 536870912 : 0));
          if (i !== 0) {
            l = i;
            t: {
              var c = t;
              u = ou;
              var f = c.current.memoizedState.isDehydrated;
              if ((f && (Ea(c, i).flags |= 256), (i = qc(c, i, !1)), i !== 2)) {
                if (Dc && !f) {
                  ((c.errorRecoveryDisabledLanes |= n), (Qe |= n), (u = 4));
                  break t;
                }
                ((n = It), (It = u), n !== null && (It === null ? (It = n) : It.push.apply(It, n)));
              }
              u = i;
            }
            if (((n = !1), u !== 2)) continue;
          }
        }
        if (u === 1) {
          (Ea(t, 0), me(t, l, 0, !0));
          break;
        }
        t: {
          switch (((a = t), (n = u), n)) {
            case 0:
            case 1:
              throw Error(r(345));
            case 4:
              if ((l & 4194048) !== l) break;
            case 6:
              me(a, l, sl, !se);
              break t;
            case 2:
              It = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(r(329));
          }
          if ((l & 62914560) === l && ((u = pn + 300 - ll()), 10 < u)) {
            if ((me(a, l, sl, !se), Uu(a, 0, !0) !== 0)) break t;
            ((kl = l),
              (a.timeoutHandle = Jr(gr.bind(null, a, e, It, zn, Uc, l, sl, Qe, Sa, se, n, 'Throttled', -0, 0), u)));
            break t;
          }
          gr(a, e, It, zn, Uc, l, sl, Qe, Sa, se, n, null, -0, 0);
        }
      }
      break;
    } while (!0);
    Nl(t);
  }
  function gr(t, l, e, a, u, n, i, c, f, h, g, E, y, v) {
    if (((t.timeoutHandle = -1), (E = l.subtreeFlags), E & 8192 || (E & 16785408) === 16785408)) {
      ((E = {
        stylesheets: null,
        count: 0,
        imgCount: 0,
        imgBytes: 0,
        suspenseyImages: [],
        waitingForImages: !0,
        waitingForViewTransition: !1,
        unsuspend: Cl,
      }),
        sr(l, n, E));
      var N = (n & 62914560) === n ? pn - ll() : (n & 4194048) === n ? mr - ll() : 0;
      if (((N = Jm(E, N)), N !== null)) {
        ((kl = n),
          (t.cancelPendingCommit = N(_r.bind(null, t, l, n, e, a, u, i, c, f, g, E, null, y, v))),
          me(t, n, i, !h));
        return;
      }
    }
    _r(t, l, n, e, a, u, i, c, f);
  }
  function sm(t) {
    for (var l = t; ; ) {
      var e = l.tag;
      if (
        (e === 0 || e === 11 || e === 15) &&
        l.flags & 16384 &&
        ((e = l.updateQueue), e !== null && ((e = e.stores), e !== null))
      )
        for (var a = 0; a < e.length; a++) {
          var u = e[a],
            n = u.getSnapshot;
          u = u.value;
          try {
            if (!ul(n(), u)) return !1;
          } catch {
            return !1;
          }
        }
      if (((e = l.child), l.subtreeFlags & 16384 && e !== null)) ((e.return = l), (l = e));
      else {
        if (l === t) break;
        for (; l.sibling === null; ) {
          if (l.return === null || l.return === t) return !0;
          l = l.return;
        }
        ((l.sibling.return = l.return), (l = l.sibling));
      }
    }
    return !0;
  }
  function me(t, l, e, a) {
    ((l &= ~Nc),
      (l &= ~Qe),
      (t.suspendedLanes |= l),
      (t.pingedLanes &= ~l),
      a && (t.warmLanes |= l),
      (a = t.expirationTimes));
    for (var u = l; 0 < u; ) {
      var n = 31 - al(u),
        i = 1 << n;
      ((a[n] = -1), (u &= ~i));
    }
    e !== 0 && Mf(t, e, l);
  }
  function Tn() {
    return (nt & 6) === 0 ? (du(0), !1) : !0;
  }
  function Rc() {
    if (I !== null) {
      if (st === 0) var t = I.return;
      else ((t = I), (Bl = je = null), Fi(t), (ra = null), (ka = 0), (t = I));
      for (; t !== null; ) (ko(t.alternate, t), (t = t.return));
      I = null;
    }
  }
  function Ea(t, l) {
    var e = t.timeoutHandle;
    (e !== -1 && ((t.timeoutHandle = -1), Dm(e)),
      (e = t.cancelPendingCommit),
      e !== null && ((t.cancelPendingCommit = null), e()),
      (kl = 0),
      Rc(),
      (vt = t),
      (I = e = Rl(t.current, null)),
      (tt = l),
      (st = 0),
      (fl = null),
      (se = !1),
      (ba = Ua(t, l)),
      (Dc = !1),
      (Sa = sl = Nc = Qe = oe = At = 0),
      (It = ou = null),
      (Uc = !1),
      (l & 8) !== 0 && (l |= l & 32));
    var a = t.entangledLanes;
    if (a !== 0)
      for (t = t.entanglements, a &= l; 0 < a; ) {
        var u = 31 - al(a),
          n = 1 << u;
        ((l |= t[u]), (a &= ~n));
      }
    return ((Jl = l), Zu(), e);
  }
  function br(t, l) {
    ((w = null),
      (b.H = eu),
      l === oa || l === Fu
        ? ((l = Cs()), (st = 3))
        : l === Gi
          ? ((l = Cs()), (st = 4))
          : (st = l === mc ? 8 : l !== null && typeof l == 'object' && typeof l.then == 'function' ? 6 : 1),
      (fl = l),
      I === null && ((At = 1), dn(t, hl(l, t.current))));
  }
  function Sr() {
    var t = il.current;
    return t === null
      ? !0
      : (tt & 4194048) === tt
        ? bl === null
        : (tt & 62914560) === tt || (tt & 536870912) !== 0
          ? t === bl
          : !1;
  }
  function pr() {
    var t = b.H;
    return ((b.H = eu), t === null ? eu : t);
  }
  function Er() {
    var t = b.A;
    return ((b.A = cm), t);
  }
  function An() {
    ((At = 4),
      se || ((tt & 4194048) !== tt && il.current !== null) || (ba = !0),
      ((oe & 134217727) === 0 && (Qe & 134217727) === 0) || vt === null || me(vt, tt, sl, !1));
  }
  function qc(t, l, e) {
    var a = nt;
    nt |= 2;
    var u = pr(),
      n = Er();
    ((vt !== t || tt !== l) && ((zn = null), Ea(t, l)), (l = !1));
    var i = At;
    t: do
      try {
        if (st !== 0 && I !== null) {
          var c = I,
            f = fl;
          switch (st) {
            case 8:
              (Rc(), (i = 6));
              break t;
            case 3:
            case 2:
            case 9:
            case 6:
              il.current === null && (l = !0);
              var h = st;
              if (((st = 0), (fl = null), za(t, c, f, h), e && ba)) {
                i = 0;
                break t;
              }
              break;
            default:
              ((h = st), (st = 0), (fl = null), za(t, c, f, h));
          }
        }
        (om(), (i = At));
        break;
      } catch (g) {
        br(t, g);
      }
    while (!0);
    return (
      l && t.shellSuspendCounter++,
      (Bl = je = null),
      (nt = a),
      (b.H = u),
      (b.A = n),
      I === null && ((vt = null), (tt = 0), Zu()),
      i
    );
  }
  function om() {
    for (; I !== null; ) zr(I);
  }
  function rm(t, l) {
    var e = nt;
    nt |= 2;
    var a = pr(),
      u = Er();
    vt !== t || tt !== l ? ((zn = null), (En = ll() + 500), Ea(t, l)) : (ba = Ua(t, l));
    t: do
      try {
        if (st !== 0 && I !== null) {
          l = I;
          var n = fl;
          l: switch (st) {
            case 1:
              ((st = 0), (fl = null), za(t, l, n, 1));
              break;
            case 2:
            case 9:
              if (Us(n)) {
                ((st = 0), (fl = null), Tr(l));
                break;
              }
              ((l = function () {
                ((st !== 2 && st !== 9) || vt !== t || (st = 7), Nl(t));
              }),
                n.then(l, l));
              break t;
            case 3:
              st = 7;
              break t;
            case 4:
              st = 5;
              break t;
            case 7:
              Us(n) ? ((st = 0), (fl = null), Tr(l)) : ((st = 0), (fl = null), za(t, l, n, 7));
              break;
            case 5:
              var i = null;
              switch (I.tag) {
                case 26:
                  i = I.memoizedState;
                case 5:
                case 27:
                  var c = I;
                  if (i ? f0(i) : c.stateNode.complete) {
                    ((st = 0), (fl = null));
                    var f = c.sibling;
                    if (f !== null) I = f;
                    else {
                      var h = c.return;
                      h !== null ? ((I = h), _n(h)) : (I = null);
                    }
                    break l;
                  }
              }
              ((st = 0), (fl = null), za(t, l, n, 5));
              break;
            case 6:
              ((st = 0), (fl = null), za(t, l, n, 6));
              break;
            case 8:
              (Rc(), (At = 6));
              break t;
            default:
              throw Error(r(462));
          }
        }
        dm();
        break;
      } catch (g) {
        br(t, g);
      }
    while (!0);
    return ((Bl = je = null), (b.H = a), (b.A = u), (nt = e), I !== null ? 0 : ((vt = null), (tt = 0), Zu(), At));
  }
  function dm() {
    for (; I !== null && !R0(); ) zr(I);
  }
  function zr(t) {
    var l = Ko(t.alternate, t, Jl);
    ((t.memoizedProps = t.pendingProps), l === null ? _n(t) : (I = l));
  }
  function Tr(t) {
    var l = t,
      e = l.alternate;
    switch (l.tag) {
      case 15:
      case 0:
        l = Xo(e, l, l.pendingProps, l.type, void 0, tt);
        break;
      case 11:
        l = Xo(e, l, l.pendingProps, l.type.render, l.ref, tt);
        break;
      case 5:
        Fi(l);
      default:
        (ko(e, l), (l = I = ps(l, Jl)), (l = Ko(e, l, Jl)));
    }
    ((t.memoizedProps = t.pendingProps), l === null ? _n(t) : (I = l));
  }
  function za(t, l, e, a) {
    ((Bl = je = null), Fi(l), (ra = null), (ka = 0));
    var u = l.return;
    try {
      if (tm(t, u, l, e, tt)) {
        ((At = 1), dn(t, hl(e, t.current)), (I = null));
        return;
      }
    } catch (n) {
      if (u !== null) throw ((I = u), n);
      ((At = 1), dn(t, hl(e, t.current)), (I = null));
      return;
    }
    l.flags & 32768
      ? (et || a === 1
          ? (t = !0)
          : ba || (tt & 536870912) !== 0
            ? (t = !1)
            : ((se = t = !0),
              (a === 2 || a === 9 || a === 3 || a === 6) &&
                ((a = il.current), a !== null && a.tag === 13 && (a.flags |= 16384))),
        Ar(l, t))
      : _n(l);
  }
  function _n(t) {
    var l = t;
    do {
      if ((l.flags & 32768) !== 0) {
        Ar(l, se);
        return;
      }
      t = l.return;
      var e = am(l.alternate, l, Jl);
      if (e !== null) {
        I = e;
        return;
      }
      if (((l = l.sibling), l !== null)) {
        I = l;
        return;
      }
      I = l = t;
    } while (l !== null);
    At === 0 && (At = 5);
  }
  function Ar(t, l) {
    do {
      var e = um(t.alternate, t);
      if (e !== null) {
        ((e.flags &= 32767), (I = e));
        return;
      }
      if (
        ((e = t.return),
        e !== null && ((e.flags |= 32768), (e.subtreeFlags = 0), (e.deletions = null)),
        !l && ((t = t.sibling), t !== null))
      ) {
        I = t;
        return;
      }
      I = t = e;
    } while (t !== null);
    ((At = 6), (I = null));
  }
  function _r(t, l, e, a, u, n, i, c, f) {
    t.cancelPendingCommit = null;
    do Mn();
    while (Ht !== 0);
    if ((nt & 6) !== 0) throw Error(r(327));
    if (l !== null) {
      if (l === t.current) throw Error(r(177));
      if (
        ((n = l.lanes | l.childLanes),
        (n |= Ai),
        w0(t, e, n, i, c, f),
        t === vt && ((I = vt = null), (tt = 0)),
        (pa = l),
        (de = t),
        (kl = e),
        (jc = n),
        (Cc = u),
        (hr = a),
        (l.subtreeFlags & 10256) !== 0 || (l.flags & 10256) !== 0
          ? ((t.callbackNode = null),
            (t.callbackPriority = 0),
            vm(xu, function () {
              return (Nr(), null);
            }))
          : ((t.callbackNode = null), (t.callbackPriority = 0)),
        (a = (l.flags & 13878) !== 0),
        (l.subtreeFlags & 13878) !== 0 || a)
      ) {
        ((a = b.T), (b.T = null), (u = x.p), (x.p = 2), (i = nt), (nt |= 4));
        try {
          nm(t, l, e);
        } finally {
          ((nt = i), (x.p = u), (b.T = a));
        }
      }
      ((Ht = 1), Mr(), xr(), Or());
    }
  }
  function Mr() {
    if (Ht === 1) {
      Ht = 0;
      var t = de,
        l = pa,
        e = (l.flags & 13878) !== 0;
      if ((l.subtreeFlags & 13878) !== 0 || e) {
        ((e = b.T), (b.T = null));
        var a = x.p;
        x.p = 2;
        var u = nt;
        nt |= 4;
        try {
          ir(l, t);
          var n = kc,
            i = rs(t.containerInfo),
            c = n.focusedElem,
            f = n.selectionRange;
          if (i !== c && c && c.ownerDocument && os(c.ownerDocument.documentElement, c)) {
            if (f !== null && Si(c)) {
              var h = f.start,
                g = f.end;
              if ((g === void 0 && (g = h), 'selectionStart' in c))
                ((c.selectionStart = h), (c.selectionEnd = Math.min(g, c.value.length)));
              else {
                var E = c.ownerDocument || document,
                  y = (E && E.defaultView) || window;
                if (y.getSelection) {
                  var v = y.getSelection(),
                    N = c.textContent.length,
                    B = Math.min(f.start, N),
                    ht = f.end === void 0 ? B : Math.min(f.end, N);
                  !v.extend && B > ht && ((i = ht), (ht = B), (B = i));
                  var d = ss(c, B),
                    s = ss(c, ht);
                  if (
                    d &&
                    s &&
                    (v.rangeCount !== 1 ||
                      v.anchorNode !== d.node ||
                      v.anchorOffset !== d.offset ||
                      v.focusNode !== s.node ||
                      v.focusOffset !== s.offset)
                  ) {
                    var m = E.createRange();
                    (m.setStart(d.node, d.offset),
                      v.removeAllRanges(),
                      B > ht
                        ? (v.addRange(m), v.extend(s.node, s.offset))
                        : (m.setEnd(s.node, s.offset), v.addRange(m)));
                  }
                }
              }
            }
            for (E = [], v = c; (v = v.parentNode); )
              v.nodeType === 1 && E.push({ element: v, left: v.scrollLeft, top: v.scrollTop });
            for (typeof c.focus == 'function' && c.focus(), c = 0; c < E.length; c++) {
              var S = E[c];
              ((S.element.scrollLeft = S.left), (S.element.scrollTop = S.top));
            }
          }
          ((Yn = !!Jc), (kc = Jc = null));
        } finally {
          ((nt = u), (x.p = a), (b.T = e));
        }
      }
      ((t.current = l), (Ht = 2));
    }
  }
  function xr() {
    if (Ht === 2) {
      Ht = 0;
      var t = de,
        l = pa,
        e = (l.flags & 8772) !== 0;
      if ((l.subtreeFlags & 8772) !== 0 || e) {
        ((e = b.T), (b.T = null));
        var a = x.p;
        x.p = 2;
        var u = nt;
        nt |= 4;
        try {
          lr(t, l.alternate, l);
        } finally {
          ((nt = u), (x.p = a), (b.T = e));
        }
      }
      Ht = 3;
    }
  }
  function Or() {
    if (Ht === 4 || Ht === 3) {
      ((Ht = 0), q0());
      var t = de,
        l = pa,
        e = kl,
        a = hr;
      (l.subtreeFlags & 10256) !== 0 || (l.flags & 10256) !== 0
        ? (Ht = 5)
        : ((Ht = 0), (pa = de = null), Dr(t, t.pendingLanes));
      var u = t.pendingLanes;
      if ((u === 0 && (re = null), ti(e), (l = l.stateNode), el && typeof el.onCommitFiberRoot == 'function'))
        try {
          el.onCommitFiberRoot(Na, l, void 0, (l.current.flags & 128) === 128);
        } catch {}
      if (a !== null) {
        ((l = b.T), (u = x.p), (x.p = 2), (b.T = null));
        try {
          for (var n = t.onRecoverableError, i = 0; i < a.length; i++) {
            var c = a[i];
            n(c.value, { componentStack: c.stack });
          }
        } finally {
          ((b.T = l), (x.p = u));
        }
      }
      ((kl & 3) !== 0 && Mn(),
        Nl(t),
        (u = t.pendingLanes),
        (e & 261930) !== 0 && (u & 42) !== 0 ? (t === Hc ? ru++ : ((ru = 0), (Hc = t))) : (ru = 0),
        du(0));
    }
  }
  function Dr(t, l) {
    (t.pooledCacheLanes &= l) === 0 && ((l = t.pooledCache), l != null && ((t.pooledCache = null), Ka(l)));
  }
  function Mn() {
    return (Mr(), xr(), Or(), Nr());
  }
  function Nr() {
    if (Ht !== 5) return !1;
    var t = de,
      l = jc;
    jc = 0;
    var e = ti(kl),
      a = b.T,
      u = x.p;
    try {
      ((x.p = 32 > e ? 32 : e), (b.T = null), (e = Cc), (Cc = null));
      var n = de,
        i = kl;
      if (((Ht = 0), (pa = de = null), (kl = 0), (nt & 6) !== 0)) throw Error(r(331));
      var c = nt;
      if (
        ((nt |= 4),
        rr(n.current),
        fr(n, n.current, i, e),
        (nt = c),
        du(0, !1),
        el && typeof el.onPostCommitFiberRoot == 'function')
      )
        try {
          el.onPostCommitFiberRoot(Na, n);
        } catch {}
      return !0;
    } finally {
      ((x.p = u), (b.T = a), Dr(t, l));
    }
  }
  function Ur(t, l, e) {
    ((l = hl(e, l)), (l = dc(t.stateNode, l, 2)), (t = ne(t, l, 2)), t !== null && (ja(t, 2), Nl(t)));
  }
  function ot(t, l, e) {
    if (t.tag === 3) Ur(t, t, e);
    else
      for (; l !== null; ) {
        if (l.tag === 3) {
          Ur(l, t, e);
          break;
        } else if (l.tag === 1) {
          var a = l.stateNode;
          if (
            typeof l.type.getDerivedStateFromError == 'function' ||
            (typeof a.componentDidCatch == 'function' && (re === null || !re.has(a)))
          ) {
            ((t = hl(e, t)), (e = jo(2)), (a = ne(l, e, 2)), a !== null && (Co(e, a, l, t), ja(a, 2), Nl(a)));
            break;
          }
        }
        l = l.return;
      }
  }
  function Bc(t, l, e) {
    var a = t.pingCache;
    if (a === null) {
      a = t.pingCache = new fm();
      var u = new Set();
      a.set(l, u);
    } else ((u = a.get(l)), u === void 0 && ((u = new Set()), a.set(l, u)));
    u.has(e) || ((Dc = !0), u.add(e), (t = mm.bind(null, t, l, e)), l.then(t, t));
  }
  function mm(t, l, e) {
    var a = t.pingCache;
    (a !== null && a.delete(l),
      (t.pingedLanes |= t.suspendedLanes & e),
      (t.warmLanes &= ~e),
      vt === t &&
        (tt & e) === e &&
        (At === 4 || (At === 3 && (tt & 62914560) === tt && 300 > ll() - pn) ? (nt & 2) === 0 && Ea(t, 0) : (Nc |= e),
        Sa === tt && (Sa = 0)),
      Nl(t));
  }
  function jr(t, l) {
    (l === 0 && (l = _f()), (t = De(t, l)), t !== null && (ja(t, l), Nl(t)));
  }
  function hm(t) {
    var l = t.memoizedState,
      e = 0;
    (l !== null && (e = l.retryLane), jr(t, e));
  }
  function ym(t, l) {
    var e = 0;
    switch (t.tag) {
      case 31:
      case 13:
        var a = t.stateNode,
          u = t.memoizedState;
        u !== null && (e = u.retryLane);
        break;
      case 19:
        a = t.stateNode;
        break;
      case 22:
        a = t.stateNode._retryCache;
        break;
      default:
        throw Error(r(314));
    }
    (a !== null && a.delete(l), jr(t, e));
  }
  function vm(t, l) {
    return Wn(t, l);
  }
  var xn = null,
    Ta = null,
    Yc = !1,
    On = !1,
    Gc = !1,
    he = 0;
  function Nl(t) {
    (t !== Ta && t.next === null && (Ta === null ? (xn = Ta = t) : (Ta = Ta.next = t)),
      (On = !0),
      Yc || ((Yc = !0), bm()));
  }
  function du(t, l) {
    if (!Gc && On) {
      Gc = !0;
      do
        for (var e = !1, a = xn; a !== null; ) {
          if (t !== 0) {
            var u = a.pendingLanes;
            if (u === 0) var n = 0;
            else {
              var i = a.suspendedLanes,
                c = a.pingedLanes;
              ((n = (1 << (31 - al(42 | t) + 1)) - 1),
                (n &= u & ~(i & ~c)),
                (n = n & 201326741 ? (n & 201326741) | 1 : n ? n | 2 : 0));
            }
            n !== 0 && ((e = !0), qr(a, n));
          } else
            ((n = tt),
              (n = Uu(a, a === vt ? n : 0, a.cancelPendingCommit !== null || a.timeoutHandle !== -1)),
              (n & 3) === 0 || Ua(a, n) || ((e = !0), qr(a, n)));
          a = a.next;
        }
      while (e);
      Gc = !1;
    }
  }
  function gm() {
    Cr();
  }
  function Cr() {
    On = Yc = !1;
    var t = 0;
    he !== 0 && Om() && (t = he);
    for (var l = ll(), e = null, a = xn; a !== null; ) {
      var u = a.next,
        n = Hr(a, l);
      (n === 0
        ? ((a.next = null), e === null ? (xn = u) : (e.next = u), u === null && (Ta = e))
        : ((e = a), (t !== 0 || (n & 3) !== 0) && (On = !0)),
        (a = u));
    }
    ((Ht !== 0 && Ht !== 5) || du(t), he !== 0 && (he = 0));
  }
  function Hr(t, l) {
    for (var e = t.suspendedLanes, a = t.pingedLanes, u = t.expirationTimes, n = t.pendingLanes & -62914561; 0 < n; ) {
      var i = 31 - al(n),
        c = 1 << i,
        f = u[i];
      (f === -1 ? ((c & e) === 0 || (c & a) !== 0) && (u[i] = V0(c, l)) : f <= l && (t.expiredLanes |= c), (n &= ~c));
    }
    if (
      ((l = vt),
      (e = tt),
      (e = Uu(t, t === l ? e : 0, t.cancelPendingCommit !== null || t.timeoutHandle !== -1)),
      (a = t.callbackNode),
      e === 0 || (t === l && (st === 2 || st === 9)) || t.cancelPendingCommit !== null)
    )
      return (a !== null && a !== null && Fn(a), (t.callbackNode = null), (t.callbackPriority = 0));
    if ((e & 3) === 0 || Ua(t, e)) {
      if (((l = e & -e), l === t.callbackPriority)) return l;
      switch ((a !== null && Fn(a), ti(e))) {
        case 2:
        case 8:
          e = Tf;
          break;
        case 32:
          e = xu;
          break;
        case 268435456:
          e = Af;
          break;
        default:
          e = xu;
      }
      return ((a = Rr.bind(null, t)), (e = Wn(e, a)), (t.callbackPriority = l), (t.callbackNode = e), l);
    }
    return (a !== null && a !== null && Fn(a), (t.callbackPriority = 2), (t.callbackNode = null), 2);
  }
  function Rr(t, l) {
    if (Ht !== 0 && Ht !== 5) return ((t.callbackNode = null), (t.callbackPriority = 0), null);
    var e = t.callbackNode;
    if (Mn() && t.callbackNode !== e) return null;
    var a = tt;
    return (
      (a = Uu(t, t === vt ? a : 0, t.cancelPendingCommit !== null || t.timeoutHandle !== -1)),
      a === 0
        ? null
        : (vr(t, a, l), Hr(t, ll()), t.callbackNode != null && t.callbackNode === e ? Rr.bind(null, t) : null)
    );
  }
  function qr(t, l) {
    if (Mn()) return null;
    vr(t, l, !0);
  }
  function bm() {
    Nm(function () {
      (nt & 6) !== 0 ? Wn(zf, gm) : Cr();
    });
  }
  function Xc() {
    if (he === 0) {
      var t = fa;
      (t === 0 && ((t = Ou), (Ou <<= 1), (Ou & 261888) === 0 && (Ou = 256)), (he = t));
    }
    return he;
  }
  function Br(t) {
    return t == null || typeof t == 'symbol' || typeof t == 'boolean' ? null : typeof t == 'function' ? t : Ru('' + t);
  }
  function Yr(t, l) {
    var e = l.ownerDocument.createElement('input');
    return (
      (e.name = l.name),
      (e.value = l.value),
      t.id && e.setAttribute('form', t.id),
      l.parentNode.insertBefore(e, l),
      (t = new FormData(t)),
      e.parentNode.removeChild(e),
      t
    );
  }
  function Sm(t, l, e, a, u) {
    if (l === 'submit' && e && e.stateNode === u) {
      var n = Br((u[Jt] || null).action),
        i = a.submitter;
      i &&
        ((l = (l = i[Jt] || null) ? Br(l.formAction) : i.getAttribute('formAction')),
        l !== null && ((n = l), (i = null)));
      var c = new Gu('action', 'action', null, a, u);
      t.push({
        event: c,
        listeners: [
          {
            instance: null,
            listener: function () {
              if (a.defaultPrevented) {
                if (he !== 0) {
                  var f = i ? Yr(u, i) : new FormData(u);
                  ic(e, { pending: !0, data: f, method: u.method, action: n }, null, f);
                }
              } else
                typeof n == 'function' &&
                  (c.preventDefault(),
                  (f = i ? Yr(u, i) : new FormData(u)),
                  ic(e, { pending: !0, data: f, method: u.method, action: n }, n, f));
            },
            currentTarget: u,
          },
        ],
      });
    }
  }
  for (var Qc = 0; Qc < Ti.length; Qc++) {
    var Lc = Ti[Qc],
      pm = Lc.toLowerCase(),
      Em = Lc[0].toUpperCase() + Lc.slice(1);
    zl(pm, 'on' + Em);
  }
  (zl(hs, 'onAnimationEnd'),
    zl(ys, 'onAnimationIteration'),
    zl(vs, 'onAnimationStart'),
    zl('dblclick', 'onDoubleClick'),
    zl('focusin', 'onFocus'),
    zl('focusout', 'onBlur'),
    zl(Bd, 'onTransitionRun'),
    zl(Yd, 'onTransitionStart'),
    zl(Gd, 'onTransitionCancel'),
    zl(gs, 'onTransitionEnd'),
    ke('onMouseEnter', ['mouseout', 'mouseover']),
    ke('onMouseLeave', ['mouseout', 'mouseover']),
    ke('onPointerEnter', ['pointerout', 'pointerover']),
    ke('onPointerLeave', ['pointerout', 'pointerover']),
    _e('onChange', 'change click focusin focusout input keydown keyup selectionchange'.split(' ')),
    _e('onSelect', 'focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange'.split(' ')),
    _e('onBeforeInput', ['compositionend', 'keypress', 'textInput', 'paste']),
    _e('onCompositionEnd', 'compositionend focusout keydown keypress keyup mousedown'.split(' ')),
    _e('onCompositionStart', 'compositionstart focusout keydown keypress keyup mousedown'.split(' ')),
    _e('onCompositionUpdate', 'compositionupdate focusout keydown keypress keyup mousedown'.split(' ')));
  var mu =
      'abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting'.split(
        ' '
      ),
    zm = new Set('beforetoggle cancel close invalid load scroll scrollend toggle'.split(' ').concat(mu));
  function Gr(t, l) {
    l = (l & 4) !== 0;
    for (var e = 0; e < t.length; e++) {
      var a = t[e],
        u = a.event;
      a = a.listeners;
      t: {
        var n = void 0;
        if (l)
          for (var i = a.length - 1; 0 <= i; i--) {
            var c = a[i],
              f = c.instance,
              h = c.currentTarget;
            if (((c = c.listener), f !== n && u.isPropagationStopped())) break t;
            ((n = c), (u.currentTarget = h));
            try {
              n(u);
            } catch (g) {
              Lu(g);
            }
            ((u.currentTarget = null), (n = f));
          }
        else
          for (i = 0; i < a.length; i++) {
            if (
              ((c = a[i]),
              (f = c.instance),
              (h = c.currentTarget),
              (c = c.listener),
              f !== n && u.isPropagationStopped())
            )
              break t;
            ((n = c), (u.currentTarget = h));
            try {
              n(u);
            } catch (g) {
              Lu(g);
            }
            ((u.currentTarget = null), (n = f));
          }
      }
    }
  }
  function P(t, l) {
    var e = l[li];
    e === void 0 && (e = l[li] = new Set());
    var a = t + '__bubble';
    e.has(a) || (Xr(l, t, 2, !1), e.add(a));
  }
  function Zc(t, l, e) {
    var a = 0;
    (l && (a |= 4), Xr(e, t, a, l));
  }
  var Dn = '_reactListening' + Math.random().toString(36).slice(2);
  function Vc(t) {
    if (!t[Dn]) {
      ((t[Dn] = !0),
        jf.forEach(function (e) {
          e !== 'selectionchange' && (zm.has(e) || Zc(e, !1, t), Zc(e, !0, t));
        }));
      var l = t.nodeType === 9 ? t : t.ownerDocument;
      l === null || l[Dn] || ((l[Dn] = !0), Zc('selectionchange', !1, l));
    }
  }
  function Xr(t, l, e, a) {
    switch (y0(l)) {
      case 2:
        var u = Wm;
        break;
      case 8:
        u = Fm;
        break;
      default:
        u = nf;
    }
    ((e = u.bind(null, l, e, t)),
      (u = void 0),
      !oi || (l !== 'touchstart' && l !== 'touchmove' && l !== 'wheel') || (u = !0),
      a
        ? u !== void 0
          ? t.addEventListener(l, e, { capture: !0, passive: u })
          : t.addEventListener(l, e, !0)
        : u !== void 0
          ? t.addEventListener(l, e, { passive: u })
          : t.addEventListener(l, e, !1));
  }
  function wc(t, l, e, a, u) {
    var n = a;
    if ((l & 1) === 0 && (l & 2) === 0 && a !== null)
      t: for (;;) {
        if (a === null) return;
        var i = a.tag;
        if (i === 3 || i === 4) {
          var c = a.stateNode.containerInfo;
          if (c === u) break;
          if (i === 4)
            for (i = a.return; i !== null; ) {
              var f = i.tag;
              if ((f === 3 || f === 4) && i.stateNode.containerInfo === u) return;
              i = i.return;
            }
          for (; c !== null; ) {
            if (((i = we(c)), i === null)) return;
            if (((f = i.tag), f === 5 || f === 6 || f === 26 || f === 27)) {
              a = n = i;
              continue t;
            }
            c = c.parentNode;
          }
        }
        a = a.return;
      }
    Vf(function () {
      var h = n,
        g = fi(e),
        E = [];
      t: {
        var y = bs.get(t);
        if (y !== void 0) {
          var v = Gu,
            N = t;
          switch (t) {
            case 'keypress':
              if (Bu(e) === 0) break t;
            case 'keydown':
            case 'keyup':
              v = yd;
              break;
            case 'focusin':
              ((N = 'focus'), (v = hi));
              break;
            case 'focusout':
              ((N = 'blur'), (v = hi));
              break;
            case 'beforeblur':
            case 'afterblur':
              v = hi;
              break;
            case 'click':
              if (e.button === 2) break t;
            case 'auxclick':
            case 'dblclick':
            case 'mousedown':
            case 'mousemove':
            case 'mouseup':
            case 'mouseout':
            case 'mouseover':
            case 'contextmenu':
              v = Jf;
              break;
            case 'drag':
            case 'dragend':
            case 'dragenter':
            case 'dragexit':
            case 'dragleave':
            case 'dragover':
            case 'dragstart':
            case 'drop':
              v = ad;
              break;
            case 'touchcancel':
            case 'touchend':
            case 'touchmove':
            case 'touchstart':
              v = bd;
              break;
            case hs:
            case ys:
            case vs:
              v = id;
              break;
            case gs:
              v = pd;
              break;
            case 'scroll':
            case 'scrollend':
              v = ld;
              break;
            case 'wheel':
              v = zd;
              break;
            case 'copy':
            case 'cut':
            case 'paste':
              v = fd;
              break;
            case 'gotpointercapture':
            case 'lostpointercapture':
            case 'pointercancel':
            case 'pointerdown':
            case 'pointermove':
            case 'pointerout':
            case 'pointerover':
            case 'pointerup':
              v = $f;
              break;
            case 'toggle':
            case 'beforetoggle':
              v = Ad;
          }
          var B = (l & 4) !== 0,
            ht = !B && (t === 'scroll' || t === 'scrollend'),
            d = B ? (y !== null ? y + 'Capture' : null) : y;
          B = [];
          for (var s = h, m; s !== null; ) {
            var S = s;
            if (
              ((m = S.stateNode),
              (S = S.tag),
              (S !== 5 && S !== 26 && S !== 27) ||
                m === null ||
                d === null ||
                ((S = Ra(s, d)), S != null && B.push(hu(s, S, m))),
              ht)
            )
              break;
            s = s.return;
          }
          0 < B.length && ((y = new v(y, N, null, e, g)), E.push({ event: y, listeners: B }));
        }
      }
      if ((l & 7) === 0) {
        t: {
          if (
            ((y = t === 'mouseover' || t === 'pointerover'),
            (v = t === 'mouseout' || t === 'pointerout'),
            y && e !== ci && (N = e.relatedTarget || e.fromElement) && (we(N) || N[Ve]))
          )
            break t;
          if (
            (v || y) &&
            ((y = g.window === g ? g : (y = g.ownerDocument) ? y.defaultView || y.parentWindow : window),
            v
              ? ((N = e.relatedTarget || e.toElement),
                (v = h),
                (N = N ? we(N) : null),
                N !== null && ((ht = J(N)), (B = N.tag), N !== ht || (B !== 5 && B !== 27 && B !== 6)) && (N = null))
              : ((v = null), (N = h)),
            v !== N)
          ) {
            if (
              ((B = Jf),
              (S = 'onMouseLeave'),
              (d = 'onMouseEnter'),
              (s = 'mouse'),
              (t === 'pointerout' || t === 'pointerover') &&
                ((B = $f), (S = 'onPointerLeave'), (d = 'onPointerEnter'), (s = 'pointer')),
              (ht = v == null ? y : Ha(v)),
              (m = N == null ? y : Ha(N)),
              (y = new B(S, s + 'leave', v, e, g)),
              (y.target = ht),
              (y.relatedTarget = m),
              (S = null),
              we(g) === h && ((B = new B(d, s + 'enter', N, e, g)), (B.target = m), (B.relatedTarget = ht), (S = B)),
              (ht = S),
              v && N)
            )
              l: {
                for (B = Tm, d = v, s = N, m = 0, S = d; S; S = B(S)) m++;
                S = 0;
                for (var q = s; q; q = B(q)) S++;
                for (; 0 < m - S; ) ((d = B(d)), m--);
                for (; 0 < S - m; ) ((s = B(s)), S--);
                for (; m--; ) {
                  if (d === s || (s !== null && d === s.alternate)) {
                    B = d;
                    break l;
                  }
                  ((d = B(d)), (s = B(s)));
                }
                B = null;
              }
            else B = null;
            (v !== null && Qr(E, y, v, B, !1), N !== null && ht !== null && Qr(E, ht, N, B, !0));
          }
        }
        t: {
          if (
            ((y = h ? Ha(h) : window),
            (v = y.nodeName && y.nodeName.toLowerCase()),
            v === 'select' || (v === 'input' && y.type === 'file'))
          )
            var at = as;
          else if (ls(y))
            if (us) at = Hd;
            else {
              at = jd;
              var H = Ud;
            }
          else
            ((v = y.nodeName),
              !v || v.toLowerCase() !== 'input' || (y.type !== 'checkbox' && y.type !== 'radio')
                ? h && ii(h.elementType) && (at = as)
                : (at = Cd));
          if (at && (at = at(t, h))) {
            es(E, at, e, g);
            break t;
          }
          (H && H(t, y, h),
            t === 'focusout' && h && y.type === 'number' && h.memoizedProps.value != null && ni(y, 'number', y.value));
        }
        switch (((H = h ? Ha(h) : window), t)) {
          case 'focusin':
            (ls(H) || H.contentEditable === 'true') && ((ta = H), (pi = h), (Za = null));
            break;
          case 'focusout':
            Za = pi = ta = null;
            break;
          case 'mousedown':
            Ei = !0;
            break;
          case 'contextmenu':
          case 'mouseup':
          case 'dragend':
            ((Ei = !1), ds(E, e, g));
            break;
          case 'selectionchange':
            if (qd) break;
          case 'keydown':
          case 'keyup':
            ds(E, e, g);
        }
        var K;
        if (vi)
          t: {
            switch (t) {
              case 'compositionstart':
                var lt = 'onCompositionStart';
                break t;
              case 'compositionend':
                lt = 'onCompositionEnd';
                break t;
              case 'compositionupdate':
                lt = 'onCompositionUpdate';
                break t;
            }
            lt = void 0;
          }
        else
          Pe
            ? Pf(t, e) && (lt = 'onCompositionEnd')
            : t === 'keydown' && e.keyCode === 229 && (lt = 'onCompositionStart');
        (lt &&
          (Wf &&
            e.locale !== 'ko' &&
            (Pe || lt !== 'onCompositionStart'
              ? lt === 'onCompositionEnd' && Pe && (K = wf())
              : ((Il = g), (ri = 'value' in Il ? Il.value : Il.textContent), (Pe = !0))),
          (H = Nn(h, lt)),
          0 < H.length &&
            ((lt = new kf(lt, t, null, e, g)),
            E.push({ event: lt, listeners: H }),
            K ? (lt.data = K) : ((K = ts(e)), K !== null && (lt.data = K)))),
          (K = Md ? xd(t, e) : Od(t, e)) &&
            ((lt = Nn(h, 'onBeforeInput')),
            0 < lt.length &&
              ((H = new kf('onBeforeInput', 'beforeinput', null, e, g)),
              E.push({ event: H, listeners: lt }),
              (H.data = K))),
          Sm(E, t, h, e, g));
      }
      Gr(E, l);
    });
  }
  function hu(t, l, e) {
    return { instance: t, listener: l, currentTarget: e };
  }
  function Nn(t, l) {
    for (var e = l + 'Capture', a = []; t !== null; ) {
      var u = t,
        n = u.stateNode;
      if (
        ((u = u.tag),
        (u !== 5 && u !== 26 && u !== 27) ||
          n === null ||
          ((u = Ra(t, e)), u != null && a.unshift(hu(t, u, n)), (u = Ra(t, l)), u != null && a.push(hu(t, u, n))),
        t.tag === 3)
      )
        return a;
      t = t.return;
    }
    return [];
  }
  function Tm(t) {
    if (t === null) return null;
    do t = t.return;
    while (t && t.tag !== 5 && t.tag !== 27);
    return t || null;
  }
  function Qr(t, l, e, a, u) {
    for (var n = l._reactName, i = []; e !== null && e !== a; ) {
      var c = e,
        f = c.alternate,
        h = c.stateNode;
      if (((c = c.tag), f !== null && f === a)) break;
      ((c !== 5 && c !== 26 && c !== 27) ||
        h === null ||
        ((f = h),
        u
          ? ((h = Ra(e, n)), h != null && i.unshift(hu(e, h, f)))
          : u || ((h = Ra(e, n)), h != null && i.push(hu(e, h, f)))),
        (e = e.return));
    }
    i.length !== 0 && t.push({ event: l, listeners: i });
  }
  var Am = /\r\n?/g,
    _m = /\u0000|\uFFFD/g;
  function Lr(t) {
    return (typeof t == 'string' ? t : '' + t)
      .replace(
        Am,
        `
`
      )
      .replace(_m, '');
  }
  function Zr(t, l) {
    return ((l = Lr(l)), Lr(t) === l);
  }
  function mt(t, l, e, a, u, n) {
    switch (e) {
      case 'children':
        typeof a == 'string'
          ? l === 'body' || (l === 'textarea' && a === '') || We(t, a)
          : (typeof a == 'number' || typeof a == 'bigint') && l !== 'body' && We(t, '' + a);
        break;
      case 'className':
        Cu(t, 'class', a);
        break;
      case 'tabIndex':
        Cu(t, 'tabindex', a);
        break;
      case 'dir':
      case 'role':
      case 'viewBox':
      case 'width':
      case 'height':
        Cu(t, e, a);
        break;
      case 'style':
        Lf(t, a, n);
        break;
      case 'data':
        if (l !== 'object') {
          Cu(t, 'data', a);
          break;
        }
      case 'src':
      case 'href':
        if (a === '' && (l !== 'a' || e !== 'href')) {
          t.removeAttribute(e);
          break;
        }
        if (a == null || typeof a == 'function' || typeof a == 'symbol' || typeof a == 'boolean') {
          t.removeAttribute(e);
          break;
        }
        ((a = Ru('' + a)), t.setAttribute(e, a));
        break;
      case 'action':
      case 'formAction':
        if (typeof a == 'function') {
          t.setAttribute(
            e,
            "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')"
          );
          break;
        } else
          typeof n == 'function' &&
            (e === 'formAction'
              ? (l !== 'input' && mt(t, l, 'name', u.name, u, null),
                mt(t, l, 'formEncType', u.formEncType, u, null),
                mt(t, l, 'formMethod', u.formMethod, u, null),
                mt(t, l, 'formTarget', u.formTarget, u, null))
              : (mt(t, l, 'encType', u.encType, u, null),
                mt(t, l, 'method', u.method, u, null),
                mt(t, l, 'target', u.target, u, null)));
        if (a == null || typeof a == 'symbol' || typeof a == 'boolean') {
          t.removeAttribute(e);
          break;
        }
        ((a = Ru('' + a)), t.setAttribute(e, a));
        break;
      case 'onClick':
        a != null && (t.onclick = Cl);
        break;
      case 'onScroll':
        a != null && P('scroll', t);
        break;
      case 'onScrollEnd':
        a != null && P('scrollend', t);
        break;
      case 'dangerouslySetInnerHTML':
        if (a != null) {
          if (typeof a != 'object' || !('__html' in a)) throw Error(r(61));
          if (((e = a.__html), e != null)) {
            if (u.children != null) throw Error(r(60));
            t.innerHTML = e;
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
        ((e = Ru('' + a)), t.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', e));
        break;
      case 'contentEditable':
      case 'spellCheck':
      case 'draggable':
      case 'value':
      case 'autoReverse':
      case 'externalResourcesRequired':
      case 'focusable':
      case 'preserveAlpha':
        a != null && typeof a != 'function' && typeof a != 'symbol' ? t.setAttribute(e, '' + a) : t.removeAttribute(e);
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
        a && typeof a != 'function' && typeof a != 'symbol' ? t.setAttribute(e, '') : t.removeAttribute(e);
        break;
      case 'capture':
      case 'download':
        a === !0
          ? t.setAttribute(e, '')
          : a !== !1 && a != null && typeof a != 'function' && typeof a != 'symbol'
            ? t.setAttribute(e, a)
            : t.removeAttribute(e);
        break;
      case 'cols':
      case 'rows':
      case 'size':
      case 'span':
        a != null && typeof a != 'function' && typeof a != 'symbol' && !isNaN(a) && 1 <= a
          ? t.setAttribute(e, a)
          : t.removeAttribute(e);
        break;
      case 'rowSpan':
      case 'start':
        a == null || typeof a == 'function' || typeof a == 'symbol' || isNaN(a)
          ? t.removeAttribute(e)
          : t.setAttribute(e, a);
        break;
      case 'popover':
        (P('beforetoggle', t), P('toggle', t), ju(t, 'popover', a));
        break;
      case 'xlinkActuate':
        jl(t, 'http://www.w3.org/1999/xlink', 'xlink:actuate', a);
        break;
      case 'xlinkArcrole':
        jl(t, 'http://www.w3.org/1999/xlink', 'xlink:arcrole', a);
        break;
      case 'xlinkRole':
        jl(t, 'http://www.w3.org/1999/xlink', 'xlink:role', a);
        break;
      case 'xlinkShow':
        jl(t, 'http://www.w3.org/1999/xlink', 'xlink:show', a);
        break;
      case 'xlinkTitle':
        jl(t, 'http://www.w3.org/1999/xlink', 'xlink:title', a);
        break;
      case 'xlinkType':
        jl(t, 'http://www.w3.org/1999/xlink', 'xlink:type', a);
        break;
      case 'xmlBase':
        jl(t, 'http://www.w3.org/XML/1998/namespace', 'xml:base', a);
        break;
      case 'xmlLang':
        jl(t, 'http://www.w3.org/XML/1998/namespace', 'xml:lang', a);
        break;
      case 'xmlSpace':
        jl(t, 'http://www.w3.org/XML/1998/namespace', 'xml:space', a);
        break;
      case 'is':
        ju(t, 'is', a);
        break;
      case 'innerText':
      case 'textContent':
        break;
      default:
        (!(2 < e.length) || (e[0] !== 'o' && e[0] !== 'O') || (e[1] !== 'n' && e[1] !== 'N')) &&
          ((e = P0.get(e) || e), ju(t, e, a));
    }
  }
  function Kc(t, l, e, a, u, n) {
    switch (e) {
      case 'style':
        Lf(t, a, n);
        break;
      case 'dangerouslySetInnerHTML':
        if (a != null) {
          if (typeof a != 'object' || !('__html' in a)) throw Error(r(61));
          if (((e = a.__html), e != null)) {
            if (u.children != null) throw Error(r(60));
            t.innerHTML = e;
          }
        }
        break;
      case 'children':
        typeof a == 'string' ? We(t, a) : (typeof a == 'number' || typeof a == 'bigint') && We(t, '' + a);
        break;
      case 'onScroll':
        a != null && P('scroll', t);
        break;
      case 'onScrollEnd':
        a != null && P('scrollend', t);
        break;
      case 'onClick':
        a != null && (t.onclick = Cl);
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
        if (!Cf.hasOwnProperty(e))
          t: {
            if (
              e[0] === 'o' &&
              e[1] === 'n' &&
              ((u = e.endsWith('Capture')),
              (l = e.slice(2, u ? e.length - 7 : void 0)),
              (n = t[Jt] || null),
              (n = n != null ? n[e] : null),
              typeof n == 'function' && t.removeEventListener(l, n, u),
              typeof a == 'function')
            ) {
              (typeof n != 'function' &&
                n !== null &&
                (e in t ? (t[e] = null) : t.hasAttribute(e) && t.removeAttribute(e)),
                t.addEventListener(l, a, u));
              break t;
            }
            e in t ? (t[e] = a) : a === !0 ? t.setAttribute(e, '') : ju(t, e, a);
          }
    }
  }
  function Lt(t, l, e) {
    switch (l) {
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
        (P('error', t), P('load', t));
        var a = !1,
          u = !1,
          n;
        for (n in e)
          if (e.hasOwnProperty(n)) {
            var i = e[n];
            if (i != null)
              switch (n) {
                case 'src':
                  a = !0;
                  break;
                case 'srcSet':
                  u = !0;
                  break;
                case 'children':
                case 'dangerouslySetInnerHTML':
                  throw Error(r(137, l));
                default:
                  mt(t, l, n, i, e, null);
              }
          }
        (u && mt(t, l, 'srcSet', e.srcSet, e, null), a && mt(t, l, 'src', e.src, e, null));
        return;
      case 'input':
        P('invalid', t);
        var c = (n = i = u = null),
          f = null,
          h = null;
        for (a in e)
          if (e.hasOwnProperty(a)) {
            var g = e[a];
            if (g != null)
              switch (a) {
                case 'name':
                  u = g;
                  break;
                case 'type':
                  i = g;
                  break;
                case 'checked':
                  f = g;
                  break;
                case 'defaultChecked':
                  h = g;
                  break;
                case 'value':
                  n = g;
                  break;
                case 'defaultValue':
                  c = g;
                  break;
                case 'children':
                case 'dangerouslySetInnerHTML':
                  if (g != null) throw Error(r(137, l));
                  break;
                default:
                  mt(t, l, a, g, e, null);
              }
          }
        Yf(t, n, c, f, h, i, u, !1);
        return;
      case 'select':
        (P('invalid', t), (a = i = n = null));
        for (u in e)
          if (e.hasOwnProperty(u) && ((c = e[u]), c != null))
            switch (u) {
              case 'value':
                n = c;
                break;
              case 'defaultValue':
                i = c;
                break;
              case 'multiple':
                a = c;
              default:
                mt(t, l, u, c, e, null);
            }
        ((l = n), (e = i), (t.multiple = !!a), l != null ? $e(t, !!a, l, !1) : e != null && $e(t, !!a, e, !0));
        return;
      case 'textarea':
        (P('invalid', t), (n = u = a = null));
        for (i in e)
          if (e.hasOwnProperty(i) && ((c = e[i]), c != null))
            switch (i) {
              case 'value':
                a = c;
                break;
              case 'defaultValue':
                u = c;
                break;
              case 'children':
                n = c;
                break;
              case 'dangerouslySetInnerHTML':
                if (c != null) throw Error(r(91));
                break;
              default:
                mt(t, l, i, c, e, null);
            }
        Xf(t, a, u, n);
        return;
      case 'option':
        for (f in e)
          if (e.hasOwnProperty(f) && ((a = e[f]), a != null))
            switch (f) {
              case 'selected':
                t.selected = a && typeof a != 'function' && typeof a != 'symbol';
                break;
              default:
                mt(t, l, f, a, e, null);
            }
        return;
      case 'dialog':
        (P('beforetoggle', t), P('toggle', t), P('cancel', t), P('close', t));
        break;
      case 'iframe':
      case 'object':
        P('load', t);
        break;
      case 'video':
      case 'audio':
        for (a = 0; a < mu.length; a++) P(mu[a], t);
        break;
      case 'image':
        (P('error', t), P('load', t));
        break;
      case 'details':
        P('toggle', t);
        break;
      case 'embed':
      case 'source':
      case 'link':
        (P('error', t), P('load', t));
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
        for (h in e)
          if (e.hasOwnProperty(h) && ((a = e[h]), a != null))
            switch (h) {
              case 'children':
              case 'dangerouslySetInnerHTML':
                throw Error(r(137, l));
              default:
                mt(t, l, h, a, e, null);
            }
        return;
      default:
        if (ii(l)) {
          for (g in e) e.hasOwnProperty(g) && ((a = e[g]), a !== void 0 && Kc(t, l, g, a, e, void 0));
          return;
        }
    }
    for (c in e) e.hasOwnProperty(c) && ((a = e[c]), a != null && mt(t, l, c, a, e, null));
  }
  function Mm(t, l, e, a) {
    switch (l) {
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
        var u = null,
          n = null,
          i = null,
          c = null,
          f = null,
          h = null,
          g = null;
        for (v in e) {
          var E = e[v];
          if (e.hasOwnProperty(v) && E != null)
            switch (v) {
              case 'checked':
                break;
              case 'value':
                break;
              case 'defaultValue':
                f = E;
              default:
                a.hasOwnProperty(v) || mt(t, l, v, null, a, E);
            }
        }
        for (var y in a) {
          var v = a[y];
          if (((E = e[y]), a.hasOwnProperty(y) && (v != null || E != null)))
            switch (y) {
              case 'type':
                n = v;
                break;
              case 'name':
                u = v;
                break;
              case 'checked':
                h = v;
                break;
              case 'defaultChecked':
                g = v;
                break;
              case 'value':
                i = v;
                break;
              case 'defaultValue':
                c = v;
                break;
              case 'children':
              case 'dangerouslySetInnerHTML':
                if (v != null) throw Error(r(137, l));
                break;
              default:
                v !== E && mt(t, l, y, v, a, E);
            }
        }
        ui(t, i, c, f, h, g, n, u);
        return;
      case 'select':
        v = i = c = y = null;
        for (n in e)
          if (((f = e[n]), e.hasOwnProperty(n) && f != null))
            switch (n) {
              case 'value':
                break;
              case 'multiple':
                v = f;
              default:
                a.hasOwnProperty(n) || mt(t, l, n, null, a, f);
            }
        for (u in a)
          if (((n = a[u]), (f = e[u]), a.hasOwnProperty(u) && (n != null || f != null)))
            switch (u) {
              case 'value':
                y = n;
                break;
              case 'defaultValue':
                c = n;
                break;
              case 'multiple':
                i = n;
              default:
                n !== f && mt(t, l, u, n, a, f);
            }
        ((l = c),
          (e = i),
          (a = v),
          y != null ? $e(t, !!e, y, !1) : !!a != !!e && (l != null ? $e(t, !!e, l, !0) : $e(t, !!e, e ? [] : '', !1)));
        return;
      case 'textarea':
        v = y = null;
        for (c in e)
          if (((u = e[c]), e.hasOwnProperty(c) && u != null && !a.hasOwnProperty(c)))
            switch (c) {
              case 'value':
                break;
              case 'children':
                break;
              default:
                mt(t, l, c, null, a, u);
            }
        for (i in a)
          if (((u = a[i]), (n = e[i]), a.hasOwnProperty(i) && (u != null || n != null)))
            switch (i) {
              case 'value':
                y = u;
                break;
              case 'defaultValue':
                v = u;
                break;
              case 'children':
                break;
              case 'dangerouslySetInnerHTML':
                if (u != null) throw Error(r(91));
                break;
              default:
                u !== n && mt(t, l, i, u, a, n);
            }
        Gf(t, y, v);
        return;
      case 'option':
        for (var N in e)
          if (((y = e[N]), e.hasOwnProperty(N) && y != null && !a.hasOwnProperty(N)))
            switch (N) {
              case 'selected':
                t.selected = !1;
                break;
              default:
                mt(t, l, N, null, a, y);
            }
        for (f in a)
          if (((y = a[f]), (v = e[f]), a.hasOwnProperty(f) && y !== v && (y != null || v != null)))
            switch (f) {
              case 'selected':
                t.selected = y && typeof y != 'function' && typeof y != 'symbol';
                break;
              default:
                mt(t, l, f, y, a, v);
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
        for (var B in e)
          ((y = e[B]), e.hasOwnProperty(B) && y != null && !a.hasOwnProperty(B) && mt(t, l, B, null, a, y));
        for (h in a)
          if (((y = a[h]), (v = e[h]), a.hasOwnProperty(h) && y !== v && (y != null || v != null)))
            switch (h) {
              case 'children':
              case 'dangerouslySetInnerHTML':
                if (y != null) throw Error(r(137, l));
                break;
              default:
                mt(t, l, h, y, a, v);
            }
        return;
      default:
        if (ii(l)) {
          for (var ht in e)
            ((y = e[ht]), e.hasOwnProperty(ht) && y !== void 0 && !a.hasOwnProperty(ht) && Kc(t, l, ht, void 0, a, y));
          for (g in a)
            ((y = a[g]),
              (v = e[g]),
              !a.hasOwnProperty(g) || y === v || (y === void 0 && v === void 0) || Kc(t, l, g, y, a, v));
          return;
        }
    }
    for (var d in e) ((y = e[d]), e.hasOwnProperty(d) && y != null && !a.hasOwnProperty(d) && mt(t, l, d, null, a, y));
    for (E in a)
      ((y = a[E]), (v = e[E]), !a.hasOwnProperty(E) || y === v || (y == null && v == null) || mt(t, l, E, y, a, v));
  }
  function Vr(t) {
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
  function xm() {
    if (typeof performance.getEntriesByType == 'function') {
      for (var t = 0, l = 0, e = performance.getEntriesByType('resource'), a = 0; a < e.length; a++) {
        var u = e[a],
          n = u.transferSize,
          i = u.initiatorType,
          c = u.duration;
        if (n && c && Vr(i)) {
          for (i = 0, c = u.responseEnd, a += 1; a < e.length; a++) {
            var f = e[a],
              h = f.startTime;
            if (h > c) break;
            var g = f.transferSize,
              E = f.initiatorType;
            g && Vr(E) && ((f = f.responseEnd), (i += g * (f < c ? 1 : (c - h) / (f - h))));
          }
          if ((--a, (l += (8 * (n + i)) / (u.duration / 1e3)), t++, 10 < t)) break;
        }
      }
      if (0 < t) return l / t / 1e6;
    }
    return navigator.connection && ((t = navigator.connection.downlink), typeof t == 'number') ? t : 5;
  }
  var Jc = null,
    kc = null;
  function Un(t) {
    return t.nodeType === 9 ? t : t.ownerDocument;
  }
  function wr(t) {
    switch (t) {
      case 'http://www.w3.org/2000/svg':
        return 1;
      case 'http://www.w3.org/1998/Math/MathML':
        return 2;
      default:
        return 0;
    }
  }
  function Kr(t, l) {
    if (t === 0)
      switch (l) {
        case 'svg':
          return 1;
        case 'math':
          return 2;
        default:
          return 0;
      }
    return t === 1 && l === 'foreignObject' ? 0 : t;
  }
  function $c(t, l) {
    return (
      t === 'textarea' ||
      t === 'noscript' ||
      typeof l.children == 'string' ||
      typeof l.children == 'number' ||
      typeof l.children == 'bigint' ||
      (typeof l.dangerouslySetInnerHTML == 'object' &&
        l.dangerouslySetInnerHTML !== null &&
        l.dangerouslySetInnerHTML.__html != null)
    );
  }
  var Wc = null;
  function Om() {
    var t = window.event;
    return t && t.type === 'popstate' ? (t === Wc ? !1 : ((Wc = t), !0)) : ((Wc = null), !1);
  }
  var Jr = typeof setTimeout == 'function' ? setTimeout : void 0,
    Dm = typeof clearTimeout == 'function' ? clearTimeout : void 0,
    kr = typeof Promise == 'function' ? Promise : void 0,
    Nm =
      typeof queueMicrotask == 'function'
        ? queueMicrotask
        : typeof kr < 'u'
          ? function (t) {
              return kr.resolve(null).then(t).catch(Um);
            }
          : Jr;
  function Um(t) {
    setTimeout(function () {
      throw t;
    });
  }
  function ye(t) {
    return t === 'head';
  }
  function $r(t, l) {
    var e = l,
      a = 0;
    do {
      var u = e.nextSibling;
      if ((t.removeChild(e), u && u.nodeType === 8))
        if (((e = u.data), e === '/$' || e === '/&')) {
          if (a === 0) {
            (t.removeChild(u), xa(l));
            return;
          }
          a--;
        } else if (e === '$' || e === '$?' || e === '$~' || e === '$!' || e === '&') a++;
        else if (e === 'html') yu(t.ownerDocument.documentElement);
        else if (e === 'head') {
          ((e = t.ownerDocument.head), yu(e));
          for (var n = e.firstChild; n; ) {
            var i = n.nextSibling,
              c = n.nodeName;
            (n[Ca] ||
              c === 'SCRIPT' ||
              c === 'STYLE' ||
              (c === 'LINK' && n.rel.toLowerCase() === 'stylesheet') ||
              e.removeChild(n),
              (n = i));
          }
        } else e === 'body' && yu(t.ownerDocument.body);
      e = u;
    } while (e);
    xa(l);
  }
  function Wr(t, l) {
    var e = t;
    t = 0;
    do {
      var a = e.nextSibling;
      if (
        (e.nodeType === 1
          ? l
            ? ((e._stashedDisplay = e.style.display), (e.style.display = 'none'))
            : ((e.style.display = e._stashedDisplay || ''),
              e.getAttribute('style') === '' && e.removeAttribute('style'))
          : e.nodeType === 3 &&
            (l ? ((e._stashedText = e.nodeValue), (e.nodeValue = '')) : (e.nodeValue = e._stashedText || '')),
        a && a.nodeType === 8)
      )
        if (((e = a.data), e === '/$')) {
          if (t === 0) break;
          t--;
        } else (e !== '$' && e !== '$?' && e !== '$~' && e !== '$!') || t++;
      e = a;
    } while (e);
  }
  function Fc(t) {
    var l = t.firstChild;
    for (l && l.nodeType === 10 && (l = l.nextSibling); l; ) {
      var e = l;
      switch (((l = l.nextSibling), e.nodeName)) {
        case 'HTML':
        case 'HEAD':
        case 'BODY':
          (Fc(e), ei(e));
          continue;
        case 'SCRIPT':
        case 'STYLE':
          continue;
        case 'LINK':
          if (e.rel.toLowerCase() === 'stylesheet') continue;
      }
      t.removeChild(e);
    }
  }
  function jm(t, l, e, a) {
    for (; t.nodeType === 1; ) {
      var u = e;
      if (t.nodeName.toLowerCase() !== l.toLowerCase()) {
        if (!a && (t.nodeName !== 'INPUT' || t.type !== 'hidden')) break;
      } else if (a) {
        if (!t[Ca])
          switch (l) {
            case 'meta':
              if (!t.hasAttribute('itemprop')) break;
              return t;
            case 'link':
              if (((n = t.getAttribute('rel')), n === 'stylesheet' && t.hasAttribute('data-precedence'))) break;
              if (
                n !== u.rel ||
                t.getAttribute('href') !== (u.href == null || u.href === '' ? null : u.href) ||
                t.getAttribute('crossorigin') !== (u.crossOrigin == null ? null : u.crossOrigin) ||
                t.getAttribute('title') !== (u.title == null ? null : u.title)
              )
                break;
              return t;
            case 'style':
              if (t.hasAttribute('data-precedence')) break;
              return t;
            case 'script':
              if (
                ((n = t.getAttribute('src')),
                (n !== (u.src == null ? null : u.src) ||
                  t.getAttribute('type') !== (u.type == null ? null : u.type) ||
                  t.getAttribute('crossorigin') !== (u.crossOrigin == null ? null : u.crossOrigin)) &&
                  n &&
                  t.hasAttribute('async') &&
                  !t.hasAttribute('itemprop'))
              )
                break;
              return t;
            default:
              return t;
          }
      } else if (l === 'input' && t.type === 'hidden') {
        var n = u.name == null ? null : '' + u.name;
        if (u.type === 'hidden' && t.getAttribute('name') === n) return t;
      } else return t;
      if (((t = Sl(t.nextSibling)), t === null)) break;
    }
    return null;
  }
  function Cm(t, l, e) {
    if (l === '') return null;
    for (; t.nodeType !== 3; )
      if (
        ((t.nodeType !== 1 || t.nodeName !== 'INPUT' || t.type !== 'hidden') && !e) ||
        ((t = Sl(t.nextSibling)), t === null)
      )
        return null;
    return t;
  }
  function Fr(t, l) {
    for (; t.nodeType !== 8; )
      if (
        ((t.nodeType !== 1 || t.nodeName !== 'INPUT' || t.type !== 'hidden') && !l) ||
        ((t = Sl(t.nextSibling)), t === null)
      )
        return null;
    return t;
  }
  function Ic(t) {
    return t.data === '$?' || t.data === '$~';
  }
  function Pc(t) {
    return t.data === '$!' || (t.data === '$?' && t.ownerDocument.readyState !== 'loading');
  }
  function Hm(t, l) {
    var e = t.ownerDocument;
    if (t.data === '$~') t._reactRetry = l;
    else if (t.data !== '$?' || e.readyState !== 'loading') l();
    else {
      var a = function () {
        (l(), e.removeEventListener('DOMContentLoaded', a));
      };
      (e.addEventListener('DOMContentLoaded', a), (t._reactRetry = a));
    }
  }
  function Sl(t) {
    for (; t != null; t = t.nextSibling) {
      var l = t.nodeType;
      if (l === 1 || l === 3) break;
      if (l === 8) {
        if (((l = t.data), l === '$' || l === '$!' || l === '$?' || l === '$~' || l === '&' || l === 'F!' || l === 'F'))
          break;
        if (l === '/$' || l === '/&') return null;
      }
    }
    return t;
  }
  var tf = null;
  function Ir(t) {
    t = t.nextSibling;
    for (var l = 0; t; ) {
      if (t.nodeType === 8) {
        var e = t.data;
        if (e === '/$' || e === '/&') {
          if (l === 0) return Sl(t.nextSibling);
          l--;
        } else (e !== '$' && e !== '$!' && e !== '$?' && e !== '$~' && e !== '&') || l++;
      }
      t = t.nextSibling;
    }
    return null;
  }
  function Pr(t) {
    t = t.previousSibling;
    for (var l = 0; t; ) {
      if (t.nodeType === 8) {
        var e = t.data;
        if (e === '$' || e === '$!' || e === '$?' || e === '$~' || e === '&') {
          if (l === 0) return t;
          l--;
        } else (e !== '/$' && e !== '/&') || l++;
      }
      t = t.previousSibling;
    }
    return null;
  }
  function t0(t, l, e) {
    switch (((l = Un(e)), t)) {
      case 'html':
        if (((t = l.documentElement), !t)) throw Error(r(452));
        return t;
      case 'head':
        if (((t = l.head), !t)) throw Error(r(453));
        return t;
      case 'body':
        if (((t = l.body), !t)) throw Error(r(454));
        return t;
      default:
        throw Error(r(451));
    }
  }
  function yu(t) {
    for (var l = t.attributes; l.length; ) t.removeAttributeNode(l[0]);
    ei(t);
  }
  var pl = new Map(),
    l0 = new Set();
  function jn(t) {
    return typeof t.getRootNode == 'function' ? t.getRootNode() : t.nodeType === 9 ? t : t.ownerDocument;
  }
  var $l = x.d;
  x.d = { f: Rm, r: qm, D: Bm, C: Ym, L: Gm, m: Xm, X: Lm, S: Qm, M: Zm };
  function Rm() {
    var t = $l.f(),
      l = Tn();
    return t || l;
  }
  function qm(t) {
    var l = Ke(t);
    l !== null && l.tag === 5 && l.type === 'form' ? bo(l) : $l.r(t);
  }
  var Aa = typeof document > 'u' ? null : document;
  function e0(t, l, e) {
    var a = Aa;
    if (a && typeof l == 'string' && l) {
      var u = dl(l);
      ((u = 'link[rel="' + t + '"][href="' + u + '"]'),
        typeof e == 'string' && (u += '[crossorigin="' + e + '"]'),
        l0.has(u) ||
          (l0.add(u),
          (t = { rel: t, crossOrigin: e, href: l }),
          a.querySelector(u) === null &&
            ((l = a.createElement('link')), Lt(l, 'link', t), qt(l), a.head.appendChild(l))));
    }
  }
  function Bm(t) {
    ($l.D(t), e0('dns-prefetch', t, null));
  }
  function Ym(t, l) {
    ($l.C(t, l), e0('preconnect', t, l));
  }
  function Gm(t, l, e) {
    $l.L(t, l, e);
    var a = Aa;
    if (a && t && l) {
      var u = 'link[rel="preload"][as="' + dl(l) + '"]';
      l === 'image' && e && e.imageSrcSet
        ? ((u += '[imagesrcset="' + dl(e.imageSrcSet) + '"]'),
          typeof e.imageSizes == 'string' && (u += '[imagesizes="' + dl(e.imageSizes) + '"]'))
        : (u += '[href="' + dl(t) + '"]');
      var n = u;
      switch (l) {
        case 'style':
          n = _a(t);
          break;
        case 'script':
          n = Ma(t);
      }
      pl.has(n) ||
        ((t = R({ rel: 'preload', href: l === 'image' && e && e.imageSrcSet ? void 0 : t, as: l }, e)),
        pl.set(n, t),
        a.querySelector(u) !== null ||
          (l === 'style' && a.querySelector(vu(n))) ||
          (l === 'script' && a.querySelector(gu(n))) ||
          ((l = a.createElement('link')), Lt(l, 'link', t), qt(l), a.head.appendChild(l)));
    }
  }
  function Xm(t, l) {
    $l.m(t, l);
    var e = Aa;
    if (e && t) {
      var a = l && typeof l.as == 'string' ? l.as : 'script',
        u = 'link[rel="modulepreload"][as="' + dl(a) + '"][href="' + dl(t) + '"]',
        n = u;
      switch (a) {
        case 'audioworklet':
        case 'paintworklet':
        case 'serviceworker':
        case 'sharedworker':
        case 'worker':
        case 'script':
          n = Ma(t);
      }
      if (!pl.has(n) && ((t = R({ rel: 'modulepreload', href: t }, l)), pl.set(n, t), e.querySelector(u) === null)) {
        switch (a) {
          case 'audioworklet':
          case 'paintworklet':
          case 'serviceworker':
          case 'sharedworker':
          case 'worker':
          case 'script':
            if (e.querySelector(gu(n))) return;
        }
        ((a = e.createElement('link')), Lt(a, 'link', t), qt(a), e.head.appendChild(a));
      }
    }
  }
  function Qm(t, l, e) {
    $l.S(t, l, e);
    var a = Aa;
    if (a && t) {
      var u = Je(a).hoistableStyles,
        n = _a(t);
      l = l || 'default';
      var i = u.get(n);
      if (!i) {
        var c = { loading: 0, preload: null };
        if ((i = a.querySelector(vu(n)))) c.loading = 5;
        else {
          ((t = R({ rel: 'stylesheet', href: t, 'data-precedence': l }, e)), (e = pl.get(n)) && lf(t, e));
          var f = (i = a.createElement('link'));
          (qt(f),
            Lt(f, 'link', t),
            (f._p = new Promise(function (h, g) {
              ((f.onload = h), (f.onerror = g));
            })),
            f.addEventListener('load', function () {
              c.loading |= 1;
            }),
            f.addEventListener('error', function () {
              c.loading |= 2;
            }),
            (c.loading |= 4),
            Cn(i, l, a));
        }
        ((i = { type: 'stylesheet', instance: i, count: 1, state: c }), u.set(n, i));
      }
    }
  }
  function Lm(t, l) {
    $l.X(t, l);
    var e = Aa;
    if (e && t) {
      var a = Je(e).hoistableScripts,
        u = Ma(t),
        n = a.get(u);
      n ||
        ((n = e.querySelector(gu(u))),
        n ||
          ((t = R({ src: t, async: !0 }, l)),
          (l = pl.get(u)) && ef(t, l),
          (n = e.createElement('script')),
          qt(n),
          Lt(n, 'link', t),
          e.head.appendChild(n)),
        (n = { type: 'script', instance: n, count: 1, state: null }),
        a.set(u, n));
    }
  }
  function Zm(t, l) {
    $l.M(t, l);
    var e = Aa;
    if (e && t) {
      var a = Je(e).hoistableScripts,
        u = Ma(t),
        n = a.get(u);
      n ||
        ((n = e.querySelector(gu(u))),
        n ||
          ((t = R({ src: t, async: !0, type: 'module' }, l)),
          (l = pl.get(u)) && ef(t, l),
          (n = e.createElement('script')),
          qt(n),
          Lt(n, 'link', t),
          e.head.appendChild(n)),
        (n = { type: 'script', instance: n, count: 1, state: null }),
        a.set(u, n));
    }
  }
  function a0(t, l, e, a) {
    var u = (u = F.current) ? jn(u) : null;
    if (!u) throw Error(r(446));
    switch (t) {
      case 'meta':
      case 'title':
        return null;
      case 'style':
        return typeof e.precedence == 'string' && typeof e.href == 'string'
          ? ((l = _a(e.href)),
            (e = Je(u).hoistableStyles),
            (a = e.get(l)),
            a || ((a = { type: 'style', instance: null, count: 0, state: null }), e.set(l, a)),
            a)
          : { type: 'void', instance: null, count: 0, state: null };
      case 'link':
        if (e.rel === 'stylesheet' && typeof e.href == 'string' && typeof e.precedence == 'string') {
          t = _a(e.href);
          var n = Je(u).hoistableStyles,
            i = n.get(t);
          if (
            (i ||
              ((u = u.ownerDocument || u),
              (i = { type: 'stylesheet', instance: null, count: 0, state: { loading: 0, preload: null } }),
              n.set(t, i),
              (n = u.querySelector(vu(t))) && !n._p && ((i.instance = n), (i.state.loading = 5)),
              pl.has(t) ||
                ((e = {
                  rel: 'preload',
                  as: 'style',
                  href: e.href,
                  crossOrigin: e.crossOrigin,
                  integrity: e.integrity,
                  media: e.media,
                  hrefLang: e.hrefLang,
                  referrerPolicy: e.referrerPolicy,
                }),
                pl.set(t, e),
                n || Vm(u, t, e, i.state))),
            l && a === null)
          )
            throw Error(r(528, ''));
          return i;
        }
        if (l && a !== null) throw Error(r(529, ''));
        return null;
      case 'script':
        return (
          (l = e.async),
          (e = e.src),
          typeof e == 'string' && l && typeof l != 'function' && typeof l != 'symbol'
            ? ((l = Ma(e)),
              (e = Je(u).hoistableScripts),
              (a = e.get(l)),
              a || ((a = { type: 'script', instance: null, count: 0, state: null }), e.set(l, a)),
              a)
            : { type: 'void', instance: null, count: 0, state: null }
        );
      default:
        throw Error(r(444, t));
    }
  }
  function _a(t) {
    return 'href="' + dl(t) + '"';
  }
  function vu(t) {
    return 'link[rel="stylesheet"][' + t + ']';
  }
  function u0(t) {
    return R({}, t, { 'data-precedence': t.precedence, precedence: null });
  }
  function Vm(t, l, e, a) {
    t.querySelector('link[rel="preload"][as="style"][' + l + ']')
      ? (a.loading = 1)
      : ((l = t.createElement('link')),
        (a.preload = l),
        l.addEventListener('load', function () {
          return (a.loading |= 1);
        }),
        l.addEventListener('error', function () {
          return (a.loading |= 2);
        }),
        Lt(l, 'link', e),
        qt(l),
        t.head.appendChild(l));
  }
  function Ma(t) {
    return '[src="' + dl(t) + '"]';
  }
  function gu(t) {
    return 'script[async]' + t;
  }
  function n0(t, l, e) {
    if ((l.count++, l.instance === null))
      switch (l.type) {
        case 'style':
          var a = t.querySelector('style[data-href~="' + dl(e.href) + '"]');
          if (a) return ((l.instance = a), qt(a), a);
          var u = R({}, e, { 'data-href': e.href, 'data-precedence': e.precedence, href: null, precedence: null });
          return (
            (a = (t.ownerDocument || t).createElement('style')),
            qt(a),
            Lt(a, 'style', u),
            Cn(a, e.precedence, t),
            (l.instance = a)
          );
        case 'stylesheet':
          u = _a(e.href);
          var n = t.querySelector(vu(u));
          if (n) return ((l.state.loading |= 4), (l.instance = n), qt(n), n);
          ((a = u0(e)), (u = pl.get(u)) && lf(a, u), (n = (t.ownerDocument || t).createElement('link')), qt(n));
          var i = n;
          return (
            (i._p = new Promise(function (c, f) {
              ((i.onload = c), (i.onerror = f));
            })),
            Lt(n, 'link', a),
            (l.state.loading |= 4),
            Cn(n, e.precedence, t),
            (l.instance = n)
          );
        case 'script':
          return (
            (n = Ma(e.src)),
            (u = t.querySelector(gu(n)))
              ? ((l.instance = u), qt(u), u)
              : ((a = e),
                (u = pl.get(n)) && ((a = R({}, e)), ef(a, u)),
                (t = t.ownerDocument || t),
                (u = t.createElement('script')),
                qt(u),
                Lt(u, 'link', a),
                t.head.appendChild(u),
                (l.instance = u))
          );
        case 'void':
          return null;
        default:
          throw Error(r(443, l.type));
      }
    else
      l.type === 'stylesheet' &&
        (l.state.loading & 4) === 0 &&
        ((a = l.instance), (l.state.loading |= 4), Cn(a, e.precedence, t));
    return l.instance;
  }
  function Cn(t, l, e) {
    for (
      var a = e.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),
        u = a.length ? a[a.length - 1] : null,
        n = u,
        i = 0;
      i < a.length;
      i++
    ) {
      var c = a[i];
      if (c.dataset.precedence === l) n = c;
      else if (n !== u) break;
    }
    n
      ? n.parentNode.insertBefore(t, n.nextSibling)
      : ((l = e.nodeType === 9 ? e.head : e), l.insertBefore(t, l.firstChild));
  }
  function lf(t, l) {
    (t.crossOrigin == null && (t.crossOrigin = l.crossOrigin),
      t.referrerPolicy == null && (t.referrerPolicy = l.referrerPolicy),
      t.title == null && (t.title = l.title));
  }
  function ef(t, l) {
    (t.crossOrigin == null && (t.crossOrigin = l.crossOrigin),
      t.referrerPolicy == null && (t.referrerPolicy = l.referrerPolicy),
      t.integrity == null && (t.integrity = l.integrity));
  }
  var Hn = null;
  function i0(t, l, e) {
    if (Hn === null) {
      var a = new Map(),
        u = (Hn = new Map());
      u.set(e, a);
    } else ((u = Hn), (a = u.get(e)), a || ((a = new Map()), u.set(e, a)));
    if (a.has(t)) return a;
    for (a.set(t, null), e = e.getElementsByTagName(t), u = 0; u < e.length; u++) {
      var n = e[u];
      if (
        !(n[Ca] || n[Yt] || (t === 'link' && n.getAttribute('rel') === 'stylesheet')) &&
        n.namespaceURI !== 'http://www.w3.org/2000/svg'
      ) {
        var i = n.getAttribute(l) || '';
        i = t + i;
        var c = a.get(i);
        c ? c.push(n) : a.set(i, [n]);
      }
    }
    return a;
  }
  function c0(t, l, e) {
    ((t = t.ownerDocument || t), t.head.insertBefore(e, l === 'title' ? t.querySelector('head > title') : null));
  }
  function wm(t, l, e) {
    if (e === 1 || l.itemProp != null) return !1;
    switch (t) {
      case 'meta':
      case 'title':
        return !0;
      case 'style':
        if (typeof l.precedence != 'string' || typeof l.href != 'string' || l.href === '') break;
        return !0;
      case 'link':
        if (typeof l.rel != 'string' || typeof l.href != 'string' || l.href === '' || l.onLoad || l.onError) break;
        switch (l.rel) {
          case 'stylesheet':
            return ((t = l.disabled), typeof l.precedence == 'string' && t == null);
          default:
            return !0;
        }
      case 'script':
        if (
          l.async &&
          typeof l.async != 'function' &&
          typeof l.async != 'symbol' &&
          !l.onLoad &&
          !l.onError &&
          l.src &&
          typeof l.src == 'string'
        )
          return !0;
    }
    return !1;
  }
  function f0(t) {
    return !(t.type === 'stylesheet' && (t.state.loading & 3) === 0);
  }
  function Km(t, l, e, a) {
    if (
      e.type === 'stylesheet' &&
      (typeof a.media != 'string' || matchMedia(a.media).matches !== !1) &&
      (e.state.loading & 4) === 0
    ) {
      if (e.instance === null) {
        var u = _a(a.href),
          n = l.querySelector(vu(u));
        if (n) {
          ((l = n._p),
            l !== null &&
              typeof l == 'object' &&
              typeof l.then == 'function' &&
              (t.count++, (t = Rn.bind(t)), l.then(t, t)),
            (e.state.loading |= 4),
            (e.instance = n),
            qt(n));
          return;
        }
        ((n = l.ownerDocument || l), (a = u0(a)), (u = pl.get(u)) && lf(a, u), (n = n.createElement('link')), qt(n));
        var i = n;
        ((i._p = new Promise(function (c, f) {
          ((i.onload = c), (i.onerror = f));
        })),
          Lt(n, 'link', a),
          (e.instance = n));
      }
      (t.stylesheets === null && (t.stylesheets = new Map()),
        t.stylesheets.set(e, l),
        (l = e.state.preload) &&
          (e.state.loading & 3) === 0 &&
          (t.count++, (e = Rn.bind(t)), l.addEventListener('load', e), l.addEventListener('error', e)));
    }
  }
  var af = 0;
  function Jm(t, l) {
    return (
      t.stylesheets && t.count === 0 && Bn(t, t.stylesheets),
      0 < t.count || 0 < t.imgCount
        ? function (e) {
            var a = setTimeout(function () {
              if ((t.stylesheets && Bn(t, t.stylesheets), t.unsuspend)) {
                var n = t.unsuspend;
                ((t.unsuspend = null), n());
              }
            }, 6e4 + l);
            0 < t.imgBytes && af === 0 && (af = 62500 * xm());
            var u = setTimeout(
              function () {
                if (
                  ((t.waitingForImages = !1), t.count === 0 && (t.stylesheets && Bn(t, t.stylesheets), t.unsuspend))
                ) {
                  var n = t.unsuspend;
                  ((t.unsuspend = null), n());
                }
              },
              (t.imgBytes > af ? 50 : 800) + l
            );
            return (
              (t.unsuspend = e),
              function () {
                ((t.unsuspend = null), clearTimeout(a), clearTimeout(u));
              }
            );
          }
        : null
    );
  }
  function Rn() {
    if ((this.count--, this.count === 0 && (this.imgCount === 0 || !this.waitingForImages))) {
      if (this.stylesheets) Bn(this, this.stylesheets);
      else if (this.unsuspend) {
        var t = this.unsuspend;
        ((this.unsuspend = null), t());
      }
    }
  }
  var qn = null;
  function Bn(t, l) {
    ((t.stylesheets = null),
      t.unsuspend !== null && (t.count++, (qn = new Map()), l.forEach(km, t), (qn = null), Rn.call(t)));
  }
  function km(t, l) {
    if (!(l.state.loading & 4)) {
      var e = qn.get(t);
      if (e) var a = e.get(null);
      else {
        ((e = new Map()), qn.set(t, e));
        for (var u = t.querySelectorAll('link[data-precedence],style[data-precedence]'), n = 0; n < u.length; n++) {
          var i = u[n];
          (i.nodeName === 'LINK' || i.getAttribute('media') !== 'not all') && (e.set(i.dataset.precedence, i), (a = i));
        }
        a && e.set(null, a);
      }
      ((u = l.instance),
        (i = u.getAttribute('data-precedence')),
        (n = e.get(i) || a),
        n === a && e.set(null, u),
        e.set(i, u),
        this.count++,
        (a = Rn.bind(this)),
        u.addEventListener('load', a),
        u.addEventListener('error', a),
        n
          ? n.parentNode.insertBefore(u, n.nextSibling)
          : ((t = t.nodeType === 9 ? t.head : t), t.insertBefore(u, t.firstChild)),
        (l.state.loading |= 4));
    }
  }
  var bu = { $$typeof: D, Provider: null, Consumer: null, _currentValue: G, _currentValue2: G, _threadCount: 0 };
  function $m(t, l, e, a, u, n, i, c, f) {
    ((this.tag = 1),
      (this.containerInfo = t),
      (this.pingCache = this.current = this.pendingChildren = null),
      (this.timeoutHandle = -1),
      (this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null),
      (this.callbackPriority = 0),
      (this.expirationTimes = In(-1)),
      (this.entangledLanes =
        this.shellSuspendCounter =
        this.errorRecoveryDisabledLanes =
        this.expiredLanes =
        this.warmLanes =
        this.pingedLanes =
        this.suspendedLanes =
        this.pendingLanes =
          0),
      (this.entanglements = In(0)),
      (this.hiddenUpdates = In(null)),
      (this.identifierPrefix = a),
      (this.onUncaughtError = u),
      (this.onCaughtError = n),
      (this.onRecoverableError = i),
      (this.pooledCache = null),
      (this.pooledCacheLanes = 0),
      (this.formState = f),
      (this.incompleteTransitions = new Map()));
  }
  function s0(t, l, e, a, u, n, i, c, f, h, g, E) {
    return (
      (t = new $m(t, l, e, i, f, h, g, E, c)),
      (l = 1),
      n === !0 && (l |= 24),
      (n = nl(3, null, null, l)),
      (t.current = n),
      (n.stateNode = t),
      (l = qi()),
      l.refCount++,
      (t.pooledCache = l),
      l.refCount++,
      (n.memoizedState = { element: a, isDehydrated: e, cache: l }),
      Xi(n),
      t
    );
  }
  function o0(t) {
    return t ? ((t = aa), t) : aa;
  }
  function r0(t, l, e, a, u, n) {
    ((u = o0(u)),
      a.context === null ? (a.context = u) : (a.pendingContext = u),
      (a = ue(l)),
      (a.payload = { element: e }),
      (n = n === void 0 ? null : n),
      n !== null && (a.callback = n),
      (e = ne(t, a, l)),
      e !== null && (Pt(e, t, l), Wa(e, t, l)));
  }
  function d0(t, l) {
    if (((t = t.memoizedState), t !== null && t.dehydrated !== null)) {
      var e = t.retryLane;
      t.retryLane = e !== 0 && e < l ? e : l;
    }
  }
  function uf(t, l) {
    (d0(t, l), (t = t.alternate) && d0(t, l));
  }
  function m0(t) {
    if (t.tag === 13 || t.tag === 31) {
      var l = De(t, 67108864);
      (l !== null && Pt(l, t, 67108864), uf(t, 67108864));
    }
  }
  function h0(t) {
    if (t.tag === 13 || t.tag === 31) {
      var l = ol();
      l = Pn(l);
      var e = De(t, l);
      (e !== null && Pt(e, t, l), uf(t, l));
    }
  }
  var Yn = !0;
  function Wm(t, l, e, a) {
    var u = b.T;
    b.T = null;
    var n = x.p;
    try {
      ((x.p = 2), nf(t, l, e, a));
    } finally {
      ((x.p = n), (b.T = u));
    }
  }
  function Fm(t, l, e, a) {
    var u = b.T;
    b.T = null;
    var n = x.p;
    try {
      ((x.p = 8), nf(t, l, e, a));
    } finally {
      ((x.p = n), (b.T = u));
    }
  }
  function nf(t, l, e, a) {
    if (Yn) {
      var u = cf(a);
      if (u === null) (wc(t, l, a, Gn, e), v0(t, a));
      else if (Pm(u, t, l, e, a)) a.stopPropagation();
      else if ((v0(t, a), l & 4 && -1 < Im.indexOf(t))) {
        for (; u !== null; ) {
          var n = Ke(u);
          if (n !== null)
            switch (n.tag) {
              case 3:
                if (((n = n.stateNode), n.current.memoizedState.isDehydrated)) {
                  var i = Ae(n.pendingLanes);
                  if (i !== 0) {
                    var c = n;
                    for (c.pendingLanes |= 2, c.entangledLanes |= 2; i; ) {
                      var f = 1 << (31 - al(i));
                      ((c.entanglements[1] |= f), (i &= ~f));
                    }
                    (Nl(n), (nt & 6) === 0 && ((En = ll() + 500), du(0)));
                  }
                }
                break;
              case 31:
              case 13:
                ((c = De(n, 2)), c !== null && Pt(c, n, 2), Tn(), uf(n, 2));
            }
          if (((n = cf(a)), n === null && wc(t, l, a, Gn, e), n === u)) break;
          u = n;
        }
        u !== null && a.stopPropagation();
      } else wc(t, l, a, null, e);
    }
  }
  function cf(t) {
    return ((t = fi(t)), ff(t));
  }
  var Gn = null;
  function ff(t) {
    if (((Gn = null), (t = we(t)), t !== null)) {
      var l = J(t);
      if (l === null) t = null;
      else {
        var e = l.tag;
        if (e === 13) {
          if (((t = $(l)), t !== null)) return t;
          t = null;
        } else if (e === 31) {
          if (((t = it(l)), t !== null)) return t;
          t = null;
        } else if (e === 3) {
          if (l.stateNode.current.memoizedState.isDehydrated) return l.tag === 3 ? l.stateNode.containerInfo : null;
          t = null;
        } else l !== t && (t = null);
      }
    }
    return ((Gn = t), null);
  }
  function y0(t) {
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
        switch (B0()) {
          case zf:
            return 2;
          case Tf:
            return 8;
          case xu:
          case Y0:
            return 32;
          case Af:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var sf = !1,
    ve = null,
    ge = null,
    be = null,
    Su = new Map(),
    pu = new Map(),
    Se = [],
    Im =
      'mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset'.split(
        ' '
      );
  function v0(t, l) {
    switch (t) {
      case 'focusin':
      case 'focusout':
        ve = null;
        break;
      case 'dragenter':
      case 'dragleave':
        ge = null;
        break;
      case 'mouseover':
      case 'mouseout':
        be = null;
        break;
      case 'pointerover':
      case 'pointerout':
        Su.delete(l.pointerId);
        break;
      case 'gotpointercapture':
      case 'lostpointercapture':
        pu.delete(l.pointerId);
    }
  }
  function Eu(t, l, e, a, u, n) {
    return t === null || t.nativeEvent !== n
      ? ((t = { blockedOn: l, domEventName: e, eventSystemFlags: a, nativeEvent: n, targetContainers: [u] }),
        l !== null && ((l = Ke(l)), l !== null && m0(l)),
        t)
      : ((t.eventSystemFlags |= a), (l = t.targetContainers), u !== null && l.indexOf(u) === -1 && l.push(u), t);
  }
  function Pm(t, l, e, a, u) {
    switch (l) {
      case 'focusin':
        return ((ve = Eu(ve, t, l, e, a, u)), !0);
      case 'dragenter':
        return ((ge = Eu(ge, t, l, e, a, u)), !0);
      case 'mouseover':
        return ((be = Eu(be, t, l, e, a, u)), !0);
      case 'pointerover':
        var n = u.pointerId;
        return (Su.set(n, Eu(Su.get(n) || null, t, l, e, a, u)), !0);
      case 'gotpointercapture':
        return ((n = u.pointerId), pu.set(n, Eu(pu.get(n) || null, t, l, e, a, u)), !0);
    }
    return !1;
  }
  function g0(t) {
    var l = we(t.target);
    if (l !== null) {
      var e = J(l);
      if (e !== null) {
        if (((l = e.tag), l === 13)) {
          if (((l = $(e)), l !== null)) {
            ((t.blockedOn = l),
              Nf(t.priority, function () {
                h0(e);
              }));
            return;
          }
        } else if (l === 31) {
          if (((l = it(e)), l !== null)) {
            ((t.blockedOn = l),
              Nf(t.priority, function () {
                h0(e);
              }));
            return;
          }
        } else if (l === 3 && e.stateNode.current.memoizedState.isDehydrated) {
          t.blockedOn = e.tag === 3 ? e.stateNode.containerInfo : null;
          return;
        }
      }
    }
    t.blockedOn = null;
  }
  function Xn(t) {
    if (t.blockedOn !== null) return !1;
    for (var l = t.targetContainers; 0 < l.length; ) {
      var e = cf(t.nativeEvent);
      if (e === null) {
        e = t.nativeEvent;
        var a = new e.constructor(e.type, e);
        ((ci = a), e.target.dispatchEvent(a), (ci = null));
      } else return ((l = Ke(e)), l !== null && m0(l), (t.blockedOn = e), !1);
      l.shift();
    }
    return !0;
  }
  function b0(t, l, e) {
    Xn(t) && e.delete(l);
  }
  function th() {
    ((sf = !1),
      ve !== null && Xn(ve) && (ve = null),
      ge !== null && Xn(ge) && (ge = null),
      be !== null && Xn(be) && (be = null),
      Su.forEach(b0),
      pu.forEach(b0));
  }
  function Qn(t, l) {
    t.blockedOn === l &&
      ((t.blockedOn = null), sf || ((sf = !0), z.unstable_scheduleCallback(z.unstable_NormalPriority, th)));
  }
  var Ln = null;
  function S0(t) {
    Ln !== t &&
      ((Ln = t),
      z.unstable_scheduleCallback(z.unstable_NormalPriority, function () {
        Ln === t && (Ln = null);
        for (var l = 0; l < t.length; l += 3) {
          var e = t[l],
            a = t[l + 1],
            u = t[l + 2];
          if (typeof a != 'function') {
            if (ff(a || e) === null) continue;
            break;
          }
          var n = Ke(e);
          n !== null && (t.splice(l, 3), (l -= 3), ic(n, { pending: !0, data: u, method: e.method, action: a }, a, u));
        }
      }));
  }
  function xa(t) {
    function l(f) {
      return Qn(f, t);
    }
    (ve !== null && Qn(ve, t), ge !== null && Qn(ge, t), be !== null && Qn(be, t), Su.forEach(l), pu.forEach(l));
    for (var e = 0; e < Se.length; e++) {
      var a = Se[e];
      a.blockedOn === t && (a.blockedOn = null);
    }
    for (; 0 < Se.length && ((e = Se[0]), e.blockedOn === null); ) (g0(e), e.blockedOn === null && Se.shift());
    if (((e = (t.ownerDocument || t).$$reactFormReplay), e != null))
      for (a = 0; a < e.length; a += 3) {
        var u = e[a],
          n = e[a + 1],
          i = u[Jt] || null;
        if (typeof n == 'function') i || S0(e);
        else if (i) {
          var c = null;
          if (n && n.hasAttribute('formAction')) {
            if (((u = n), (i = n[Jt] || null))) c = i.formAction;
            else if (ff(u) !== null) continue;
          } else c = i.action;
          (typeof c == 'function' ? (e[a + 1] = c) : (e.splice(a, 3), (a -= 3)), S0(e));
        }
      }
  }
  function p0() {
    function t(n) {
      n.canIntercept &&
        n.info === 'react-transition' &&
        n.intercept({
          handler: function () {
            return new Promise(function (i) {
              return (u = i);
            });
          },
          focusReset: 'manual',
          scroll: 'manual',
        });
    }
    function l() {
      (u !== null && (u(), (u = null)), a || setTimeout(e, 20));
    }
    function e() {
      if (!a && !navigation.transition) {
        var n = navigation.currentEntry;
        n &&
          n.url != null &&
          navigation.navigate(n.url, { state: n.getState(), info: 'react-transition', history: 'replace' });
      }
    }
    if (typeof navigation == 'object') {
      var a = !1,
        u = null;
      return (
        navigation.addEventListener('navigate', t),
        navigation.addEventListener('navigatesuccess', l),
        navigation.addEventListener('navigateerror', l),
        setTimeout(e, 100),
        function () {
          ((a = !0),
            navigation.removeEventListener('navigate', t),
            navigation.removeEventListener('navigatesuccess', l),
            navigation.removeEventListener('navigateerror', l),
            u !== null && (u(), (u = null)));
        }
      );
    }
  }
  function of(t) {
    this._internalRoot = t;
  }
  ((Zn.prototype.render = of.prototype.render =
    function (t) {
      var l = this._internalRoot;
      if (l === null) throw Error(r(409));
      var e = l.current,
        a = ol();
      r0(e, a, t, l, null, null);
    }),
    (Zn.prototype.unmount = of.prototype.unmount =
      function () {
        var t = this._internalRoot;
        if (t !== null) {
          this._internalRoot = null;
          var l = t.containerInfo;
          (r0(t.current, 2, null, t, null, null), Tn(), (l[Ve] = null));
        }
      }));
  function Zn(t) {
    this._internalRoot = t;
  }
  Zn.prototype.unstable_scheduleHydration = function (t) {
    if (t) {
      var l = Df();
      t = { blockedOn: null, target: t, priority: l };
      for (var e = 0; e < Se.length && l !== 0 && l < Se[e].priority; e++);
      (Se.splice(e, 0, t), e === 0 && g0(t));
    }
  };
  var E0 = _.version;
  if (E0 !== '19.2.0') throw Error(r(527, E0, '19.2.0'));
  x.findDOMNode = function (t) {
    var l = t._reactInternals;
    if (l === void 0)
      throw typeof t.render == 'function' ? Error(r(188)) : ((t = Object.keys(t).join(',')), Error(r(268, t)));
    return ((t = p(l)), (t = t !== null ? Z(t) : null), (t = t === null ? null : t.stateNode), t);
  };
  var lh = {
    bundleType: 0,
    version: '19.2.0',
    rendererPackageName: 'react-dom',
    currentDispatcherRef: b,
    reconcilerVersion: '19.2.0',
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < 'u') {
    var Vn = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Vn.isDisabled && Vn.supportsFiber)
      try {
        ((Na = Vn.inject(lh)), (el = Vn));
      } catch {}
  }
  return (
    (Tu.createRoot = function (t, l) {
      if (!Y(t)) throw Error(r(299));
      var e = !1,
        a = '',
        u = Oo,
        n = Do,
        i = No;
      return (
        l != null &&
          (l.unstable_strictMode === !0 && (e = !0),
          l.identifierPrefix !== void 0 && (a = l.identifierPrefix),
          l.onUncaughtError !== void 0 && (u = l.onUncaughtError),
          l.onCaughtError !== void 0 && (n = l.onCaughtError),
          l.onRecoverableError !== void 0 && (i = l.onRecoverableError)),
        (l = s0(t, 1, !1, null, null, e, a, null, u, n, i, p0)),
        (t[Ve] = l.current),
        Vc(t),
        new of(l)
      );
    }),
    (Tu.hydrateRoot = function (t, l, e) {
      if (!Y(t)) throw Error(r(299));
      var a = !1,
        u = '',
        n = Oo,
        i = Do,
        c = No,
        f = null;
      return (
        e != null &&
          (e.unstable_strictMode === !0 && (a = !0),
          e.identifierPrefix !== void 0 && (u = e.identifierPrefix),
          e.onUncaughtError !== void 0 && (n = e.onUncaughtError),
          e.onCaughtError !== void 0 && (i = e.onCaughtError),
          e.onRecoverableError !== void 0 && (c = e.onRecoverableError),
          e.formState !== void 0 && (f = e.formState)),
        (l = s0(t, 1, !0, l, e ?? null, a, u, f, n, i, c, p0)),
        (l.context = o0(null)),
        (e = l.current),
        (a = ol()),
        (a = Pn(a)),
        (u = ue(a)),
        (u.callback = null),
        ne(e, u, a),
        (e = a),
        (l.current.lanes = e),
        ja(l, e),
        Nl(l),
        (t[Ve] = l.current),
        Vc(t),
        new Zn(l)
      );
    }),
    (Tu.version = '19.2.0'),
    Tu
  );
}
var U0;
function dh() {
  if (U0) return mf.exports;
  U0 = 1;
  function z() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > 'u' || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != 'function'))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(z);
      } catch (_) {
        console.error(_);
      }
  }
  return (z(), (mf.exports = rh()), mf.exports);
}
var mh = dh();
const hh = C0(mh),
  yh = 'modulepreload',
  vh = function (z) {
    return '/' + z;
  },
  j0 = {},
  wn = function (_, M, r) {
    let Y = Promise.resolve();
    if (M && M.length > 0) {
      let j = function (p) {
        return Promise.all(
          p.map((Z) =>
            Promise.resolve(Z).then(
              (R) => ({ status: 'fulfilled', value: R }),
              (R) => ({ status: 'rejected', reason: R })
            )
          )
        );
      };
      document.getElementsByTagName('link');
      const $ = document.querySelector('meta[property=csp-nonce]'),
        it = $?.nonce || $?.getAttribute('nonce');
      Y = j(
        M.map((p) => {
          if (((p = vh(p)), p in j0)) return;
          j0[p] = !0;
          const Z = p.endsWith('.css'),
            R = Z ? '[rel="stylesheet"]' : '';
          if (document.querySelector(`link[href="${p}"]${R}`)) return;
          const W = document.createElement('link');
          if (
            ((W.rel = Z ? 'stylesheet' : yh),
            Z || (W.as = 'script'),
            (W.crossOrigin = ''),
            (W.href = p),
            it && W.setAttribute('nonce', it),
            document.head.appendChild(W),
            Z)
          )
            return new Promise((jt, Et) => {
              (W.addEventListener('load', jt),
                W.addEventListener('error', () => Et(new Error(`Unable to preload CSS for ${p}`))));
            });
        })
      );
    }
    function J($) {
      const it = new Event('vite:preloadError', { cancelable: !0 });
      if (((it.payload = $), window.dispatchEvent(it), !it.defaultPrevented)) throw $;
    }
    return Y.then(($) => {
      for (const it of $ || []) it.status === 'rejected' && J(it.reason);
      return _().catch(J);
    });
  };
function gh() {
  const [z, _] = ft.useState(null),
    [M, r] = ft.useState(!0),
    [Y, J] = ft.useState(null),
    $ = ft.useCallback(async () => {
      try {
        (r(!0), J(null));
        const Q = window.location.hostname === 'localhost';
        if (
          (console.log('Environment check:', {
            DEV: !1,
            MODE: 'production',
            hostname: window.location.hostname,
            isDevelopment: Q,
          }),
          Q)
        ) {
          (console.log('Development mode: Using mock configuration'),
            _({ authSecret: 'dev-mock-secret-key-123', environment: 'development' }),
            r(!1));
          return;
        }
        const X = await fetch('/api/config');
        if (!X.ok) throw new Error(`Failed to fetch config: ${X.status}`);
        const D = await X.json();
        if (D.success && D.config) (console.log('Setting config:', D.config), _(D.config));
        else throw new Error('Invalid config response format');
      } catch (Q) {
        (console.error('Failed to fetch client configuration:', Q), J(Q.message), _(null));
      } finally {
        r(!1);
      }
    }, []);
  ft.useEffect(() => {
    $();
  }, [$]);
  const it = ft.useCallback(async () => {
      try {
        console.log('Creating room with config:', z);
        const X = { 'Content-Type': 'application/json', ...(z?.authSecret && { 'x-auth-secret': z.authSecret }) };
        console.log('Request headers:', X);
        const D = await fetch('/api/create-room', { method: 'POST', headers: X });
        if (!D.ok) throw new Error(`Failed to create room: ${D.status}`);
        return await D.json();
      } catch (Q) {
        throw (console.error('Error creating room:', Q), Q);
      }
    }, [z]),
    j = ft.useCallback(
      async (Q, X, D) => {
        try {
          const U = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...(z?.authSecret && { 'x-auth-secret': z.authSecret }) },
            body: JSON.stringify({ roomId: Q, message: X, sender: D }),
          });
          if (!U.ok) throw new Error(`Failed to send message: ${U.status}`);
          return await U.json();
        } catch (U) {
          throw (console.error('Error sending chat message:', U), U);
        }
      },
      [z]
    ),
    p = ft.useCallback(async (Q, X = 0) => {
      try {
        const D = await fetch(`/api/chat?roomId=${Q}&since=${X}`);
        if (!D.ok) throw new Error(`Failed to get messages: ${D.status}`);
        return await D.json();
      } catch (D) {
        throw (console.error('Error getting chat messages:', D), D);
      }
    }, []),
    Z = ft.useCallback(
      async (Q, X) => {
        try {
          const D = await fetch('/api/offer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...(z?.authSecret && { 'x-auth-secret': z.authSecret }) },
            body: JSON.stringify({ roomId: Q, desc: X }),
          });
          if (!D.ok) throw new Error(`Failed to send offer: ${D.status}`);
          return await D.json();
        } catch (D) {
          throw (console.error('Error sending offer:', D), D);
        }
      },
      [z]
    ),
    R = ft.useCallback(async (Q) => {
      try {
        const X = await fetch(`/api/offer?roomId=${Q}`);
        if (!X.ok) {
          if (X.status === 404) return null;
          throw new Error(`Failed to get offer: ${X.status}`);
        }
        return await X.json();
      } catch (X) {
        throw (console.error('Error getting offer:', X), X);
      }
    }, []),
    W = ft.useCallback(
      async (Q, X) => {
        try {
          const D = await fetch('/api/answer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...(z?.authSecret && { 'x-auth-secret': z.authSecret }) },
            body: JSON.stringify({ roomId: Q, desc: X }),
          });
          if (!D.ok) throw new Error(`Failed to send answer: ${D.status}`);
          return await D.json();
        } catch (D) {
          throw (console.error('Error sending answer:', D), D);
        }
      },
      [z]
    ),
    jt = ft.useCallback(async (Q) => {
      try {
        const X = await fetch(`/api/answer?roomId=${Q}`);
        if (!X.ok) {
          if (X.status === 404) return null;
          throw new Error(`Failed to get answer: ${X.status}`);
        }
        return await X.json();
      } catch (X) {
        throw (console.error('Error getting answer:', X), X);
      }
    }, []),
    Et = ft.useCallback(
      async (Q, X, D) => {
        try {
          const U = await fetch('/api/candidate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...(z?.authSecret && { 'x-auth-secret': z.authSecret }) },
            body: JSON.stringify({ roomId: Q, role: X, candidate: D }),
          });
          if (!U.ok) throw new Error(`Failed to send ICE candidate: ${U.status}`);
          return await U.json();
        } catch (U) {
          throw (console.error('Error sending ICE candidate:', U), U);
        }
      },
      [z]
    ),
    Ct = ft.useCallback(async (Q, X) => {
      try {
        const D = await fetch(`/api/candidate?roomId=${Q}&role=${X}`);
        if (!D.ok) throw new Error(`Failed to get ICE candidates: ${D.status}`);
        return await D.json();
      } catch (D) {
        throw (console.error('Error getting ICE candidates:', D), D);
      }
    }, []),
    tl = ft.useCallback(async (Q, X) => {
      try {
        const D = await fetch(`/api/diagnostics?roomId=${Q}&role=${X}`);
        if (!D.ok) throw new Error(`Failed to get diagnostics: ${D.status}`);
        return await D.json();
      } catch (D) {
        throw (console.error('Error getting diagnostics:', D), D);
      }
    }, []);
  return {
    config: z,
    loading: M,
    error: Y,
    fetchConfig: $,
    createRoom: it,
    sendChatMessage: j,
    getChatMessages: p,
    sendOffer: Z,
    getOffer: R,
    sendAnswer: W,
    getAnswer: jt,
    sendICECandidate: Et,
    getICECandidates: Ct,
    getDiagnostics: tl,
  };
}
class _u {
  constructor() {
    ((this.metrics = new Map()),
      (this.errors = []),
      (this.performance = { pageLoad: null, connectionTime: null, messageLatency: [] }),
      (this.isEnabled = !0));
  }
  trackMetric(_, M, r = {}) {
    if (!this.isEnabled) return;
    const Y = { name: _, value: M, tags: r, timestamp: Date.now() };
    (this.metrics.set(_, Y), console.log('Metric tracked:', Y));
  }
  trackError(_, M = {}) {
    const r = {
      message: _.message,
      stack: _.stack,
      context: M,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    };
    (this.errors.push(r), console.error('Error tracked:', r), this.isEnabled && _u.sendErrorToService(r));
  }
  trackPerformance(_, M) {
    this.isEnabled && ((this.performance[_] = M), console.log(`Performance: ${_} = ${M}ms`));
  }
  trackWebRTCStats(_) {
    !_ ||
      !this.isEnabled ||
      _.getStats().then((M) => {
        M.forEach((r) => {
          r.type === 'candidate-pair' &&
            r.state === 'succeeded' &&
            (this.trackMetric('webrtc.connection.success', 1),
            this.trackPerformance('webrtc.connection.time', r.currentRoundTripTime * 1e3));
        });
      });
  }
  trackMessageLatency(_, M) {
    const r = M - _;
    (this.performance.messageLatency.push(r),
      this.performance.messageLatency.length > 100 && this.performance.messageLatency.shift(),
      this.trackMetric('chat.message.latency', r));
  }
  getPerformanceSummary() {
    const _ = this.performance.messageLatency,
      M = _.length > 0 ? _.reduce((r, Y) => r + Y, 0) / _.length : 0;
    return {
      pageLoad: this.performance.pageLoad,
      connectionTime: this.performance.connectionTime,
      averageMessageLatency: M,
      messageCount: _.length,
      errorCount: this.errors.length,
    };
  }
  getAllMetrics() {
    return Array.from(this.metrics.values());
  }
  getAllErrors() {
    return this.errors;
  }
  clear() {
    (this.metrics.clear(),
      (this.errors = []),
      (this.performance = { pageLoad: null, connectionTime: null, messageLatency: [] }));
  }
  static sendErrorToService(_) {
    console.log('Would send error to service:', _);
  }
  static sendMetricsToService(_) {
    console.log('Would send metrics to service:', _);
  }
}
const Oa = new _u();
typeof window < 'u' &&
  (window.addEventListener('load', () => {
    const z = performance.now();
    Oa.trackPerformance('pageLoad', z);
  }),
  window.addEventListener('beforeunload', () => {
    const z = Oa.getAllMetrics(),
      _ = Oa.getAllErrors();
    (_u.sendMetricsToService(z), _.length > 0 && _u.sendErrorToService(_));
  }));
const Au = (z, _, M) => Oa.trackMetric(z, _, M),
  bh = (z, _) => Oa.trackError(z, _),
  Sh = (z, _) => Oa.trackPerformance(z, _);
class Le {
  constructor() {
    ((this.isEnabled = !0),
      (this.sessionId = Le.generateSessionId()),
      (this.userId = Le.getOrCreateUserId()),
      (this.events = []),
      (this.pageViews = []));
  }
  static generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  static getOrCreateUserId() {
    let _ = localStorage.getItem('analytics_user_id');
    return (
      _ ||
        ((_ = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`),
        localStorage.setItem('analytics_user_id', _)),
      _
    );
  }
  trackPageView(_, M = {}) {
    const r = {
      type: 'page_view',
      page: _,
      properties: {
        ...M,
        sessionId: this.sessionId,
        userId: this.userId,
        timestamp: Date.now(),
        url: window.location.href,
        referrer: document.referrer,
      },
    };
    (this.pageViews.push(r), console.log('Page view tracked:', r), this.isEnabled && Le.sendToAnalytics(r));
  }
  trackEvent(_, M = {}) {
    const r = {
      type: 'event',
      name: _,
      properties: { ...M, sessionId: this.sessionId, userId: this.userId, timestamp: Date.now() },
    };
    (this.events.push(r), console.log('Event tracked:', r), this.isEnabled && Le.sendToAnalytics(r));
  }
  trackInteraction(_, M, r = {}) {
    this.trackEvent('user_interaction', { element: _, action: M, ...r });
  }
  trackScreenShare(_, M = {}) {
    this.trackEvent('screen_share', { action: _, ...M });
  }
  trackChat(_, M = {}) {
    this.trackEvent('chat', { action: _, ...M });
  }
  trackWebRTC(_, M = {}) {
    this.trackEvent('webrtc', { action: _, ...M });
  }
  trackPerformance(_, M, r = {}) {
    this.trackEvent('performance', { metric: _, value: M, ...r });
  }
  trackError(_, M = {}) {
    this.trackEvent('error', { message: _.message, stack: _.stack, context: M });
  }
  getSessionSummary() {
    return {
      sessionId: this.sessionId,
      userId: this.userId,
      pageViews: this.pageViews.length,
      events: this.events.length,
      duration: Date.now() - (this.pageViews[0]?.properties.timestamp || Date.now()),
      startTime: this.pageViews[0]?.properties.timestamp || Date.now(),
    };
  }
  getAllEvents() {
    return [...this.pageViews, ...this.events];
  }
  clear() {
    ((this.events = []), (this.pageViews = []));
  }
  static sendToAnalytics(_) {
    console.log('Would send to analytics service:', _);
  }
  identify(_) {
    const M = { type: 'identify', userId: this.userId, traits: _, timestamp: Date.now() };
    (console.log('User identified:', M), this.isEnabled && Le.sendToAnalytics(M));
  }
  setUserProperties(_) {
    (localStorage.setItem('analytics_user_properties', JSON.stringify(_)), this.identify(_));
  }
  static getUserProperties() {
    const _ = localStorage.getItem('analytics_user_properties');
    return _ ? JSON.parse(_) : {};
  }
}
const Ee = new Le();
typeof window < 'u' &&
  (Ee.trackPageView('home', {
    userAgent: navigator.userAgent,
    screenResolution: `${screen.width}x${screen.height}`,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
  }),
  document.addEventListener('visibilitychange', () => {
    document.visibilityState === 'visible' ? Ee.trackEvent('page_visible') : Ee.trackEvent('page_hidden');
  }),
  window.addEventListener('beforeunload', () => {
    const z = Ee.getSessionSummary();
    Ee.trackEvent('session_end', z);
  }));
const gf = (z, _) => Ee.trackPageView(z, _),
  bf = (z, _) => Ee.trackEvent(z, _),
  ph = (z, _, M) => Ee.trackInteraction(z, _, M),
  Eh = ft.lazy(() => wn(() => import('./HostView-NSlyEnKb.js'), __vite__mapDeps([0, 1]))),
  zh = ft.lazy(() => wn(() => import('./ViewerView-C_jMyvY1.js'), __vite__mapDeps([2, 1]))),
  Th = ft.lazy(() => wn(() => import('./Chat-Y4XnLm7A.js'), [])),
  Ah = ft.lazy(() => wn(() => import('./Diagnostics-BR1n0VXx.js'), []));
function _h() {
  const [z, _] = ft.useState('home'),
    [M, r] = ft.useState(''),
    [Y, J] = ft.useState(''),
    [$, it] = ft.useState(!1),
    [j, p] = ft.useState(!1),
    { config: Z, loading: R, error: W, createRoom: jt } = gh(),
    Et = ft.useMemo(() => {
      const U = Array.from({ length: 50 }, (k, St) => ({
          id: St,
          left: Math.random() * 100,
          top: Math.random() * 100,
          delay: Math.random() * 3,
          duration: 2 + Math.random() * 2,
        })),
        zt = Array.from({ length: 20 }, (k, St) => ({ id: St, top: St * 8, delay: St * 0.1 })),
        Rt = Array.from({ length: 15 }, (k, St) => ({ id: St, left: St * 8, delay: St * 0.2 }));
      return { stars: U, gridLines: zt, gridColumns: Rt };
    }, []);
  ft.useEffect(() => {
    const U = new URLSearchParams(window.location.search);
    if (U.has('room')) {
      const zt = U.get('room');
      (r(zt), _('viewer'));
    }
  }, []);
  const Ct = async () => {
      const U = performance.now();
      try {
        Au('room.creation.attempt', 1);
        const zt = await jt();
        (r(zt.roomId), _('host'));
        const Rt = performance.now();
        (Sh('room.creation.time', Rt - U),
          Au('room.creation.success', 1),
          bf('room_created', { roomId: zt.roomId }),
          gf('host'));
      } catch (zt) {
        (console.error('Error creating room:', zt),
          bh(zt, { action: 'createRoom' }),
          Au('room.creation.error', 1),
          alert('Failed to create room. Please try again.'));
      }
    },
    tl = () => {
      if (!M.trim()) {
        (Au('room.join.error', 1, { reason: 'no_room_id' }), alert('Please enter a room ID'));
        return;
      }
      (Au('room.join.attempt', 1), bf('room_joined', { roomId: M.trim() }), gf('viewer'), _('viewer'));
    },
    Q = () => {
      (bf('navigation', { from: z, to: 'home' }), gf('home'), _('home'), r(''), J(''), it(!1), p(!1));
    },
    X = () => {
      Q();
    },
    D = () => {
      alert('Recording functionality will be implemented soon!');
    };
  return R
    ? A.jsx('div', {
        className: 'min-h-screen bg-gray-100 flex items-center justify-center',
        children: A.jsxs('div', {
          className: 'text-center',
          children: [
            A.jsx('div', { className: 'animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4' }),
            A.jsx('p', { className: 'text-gray-600', children: 'Loading configuration...' }),
          ],
        }),
      })
    : W
      ? A.jsx('div', {
          className: 'min-h-screen bg-gray-100 flex items-center justify-center',
          children: A.jsxs('div', {
            className: 'text-center',
            children: [
              A.jsx('div', { className: 'text-red-600 text-xl mb-4', children: '⚠️ Configuration Error' }),
              A.jsx('p', { className: 'text-gray-600 mb-4', children: 'Failed to load application configuration.' }),
              A.jsx('button', {
                onClick: () => window.location.reload(),
                className: 'bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700',
                children: 'Retry',
              }),
            ],
          }),
        })
      : A.jsxs('div', {
          className: 'min-h-screen relative overflow-hidden',
          children: [
            A.jsxs('div', {
              className: 'fixed inset-0 z-0',
              children: [
                A.jsx('div', {
                  className: 'absolute inset-0 bg-gradient-to-b from-purple-900 via-purple-800 to-indigo-900',
                  children: A.jsx('div', {
                    className: 'absolute inset-0',
                    children: Et.stars.map((U) =>
                      A.jsx(
                        'div',
                        {
                          className: 'absolute w-1 h-1 bg-white rounded-full animate-pulse',
                          style: {
                            left: `${U.left}%`,
                            top: `${U.top}%`,
                            animationDelay: `${U.delay}s`,
                            animationDuration: `${U.duration}s`,
                          },
                        },
                        U.id
                      )
                    ),
                  }),
                }),
                A.jsx('div', {
                  className:
                    'absolute top-10 right-10 w-32 h-32 bg-gradient-radial from-yellow-400 via-orange-500 to-red-500 rounded-full blur-xl opacity-80 animate-pulse',
                }),
                A.jsxs('div', {
                  className: 'absolute bottom-0 left-0 right-0 h-64',
                  children: [
                    A.jsx('div', {
                      className:
                        'absolute bottom-0 left-0 w-64 h-48 bg-gradient-to-t from-purple-700 to-purple-500 transform -skew-x-12 opacity-80',
                    }),
                    A.jsx('div', {
                      className:
                        'absolute bottom-0 left-32 w-48 h-36 bg-gradient-to-t from-blue-700 to-blue-500 transform -skew-x-6 opacity-70',
                    }),
                    A.jsx('div', {
                      className:
                        'absolute bottom-0 right-0 w-56 h-52 bg-gradient-to-t from-purple-600 to-purple-400 transform skew-x-12 opacity-75',
                    }),
                    A.jsx('div', {
                      className:
                        'absolute bottom-0 left-0 w-64 h-48 bg-gradient-to-t from-pink-400 to-transparent transform -skew-x-12 opacity-30',
                    }),
                    A.jsx('div', {
                      className:
                        'absolute bottom-0 right-0 w-56 h-52 bg-gradient-to-t from-pink-400 to-transparent transform skew-x-12 opacity-30',
                    }),
                  ],
                }),
                A.jsx('div', {
                  className: 'absolute bottom-0 left-0 right-0 h-32 opacity-40',
                  children: A.jsxs('div', {
                    className: 'relative w-full h-full',
                    children: [
                      Et.gridLines.map((U) =>
                        A.jsx(
                          'div',
                          {
                            className:
                              'absolute w-full h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent',
                            style: {
                              top: `${U.top}px`,
                              animation: 'pulse 3s ease-in-out infinite, glow 4s ease-in-out infinite',
                              animationDelay: `${U.delay}s`,
                            },
                          },
                          U.id
                        )
                      ),
                      Et.gridColumns.map((U) =>
                        A.jsx(
                          'div',
                          {
                            className:
                              'absolute h-full w-px bg-gradient-to-b from-transparent via-purple-400 to-transparent',
                            style: {
                              left: `${U.left}%`,
                              animation: 'pulse 4s ease-in-out infinite, glow 5s ease-in-out infinite',
                              animationDelay: `${U.delay}s`,
                            },
                          },
                          U.id
                        )
                      ),
                    ],
                  }),
                }),
              ],
            }),
            A.jsx('div', {
              className: 'relative z-10 min-h-screen flex items-center justify-center p-4',
              children:
                z === 'home'
                  ? A.jsxs('div', {
                      className: 'w-full max-w-md lg:max-w-lg xl:max-w-xl mx-auto',
                      children: [
                        A.jsx('div', {
                          className: 'text-center mb-8',
                          children: A.jsx('h1', {
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
                        A.jsxs('div', {
                          className:
                            'bg-purple-900 bg-opacity-30 backdrop-blur-md border border-purple-400 border-opacity-40 rounded-2xl p-6 shadow-2xl',
                          style: {
                            boxShadow:
                              '0 0 30px rgba(147, 51, 234, 0.3), 0 0 60px rgba(59, 130, 246, 0.2), inset 0 0 20px rgba(255, 255, 255, 0.1)',
                          },
                          children: [
                            A.jsxs('div', {
                              className: 'space-y-4 mb-6',
                              children: [
                                A.jsxs('div', {
                                  className: 'grid grid-cols-2 gap-3',
                                  children: [
                                    A.jsx('button', {
                                      onClick: () => {
                                        (ph('start_sharing_button', 'click'), Ct());
                                      },
                                      className:
                                        'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-xl text-sm uppercase tracking-wide transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-50',
                                      style: {
                                        boxShadow: '0 0 20px rgba(236, 72, 153, 0.4), 0 0 40px rgba(147, 51, 234, 0.3)',
                                      },
                                      'aria-label': 'Start sharing your screen to create a new room',
                                      onMouseEnter: (U) => {
                                        U.target.style.boxShadow =
                                          '0 0 30px rgba(236, 72, 153, 0.8), 0 0 60px rgba(147, 51, 234, 0.6), 0 0 90px rgba(236, 72, 153, 0.4)';
                                      },
                                      onMouseLeave: (U) => {
                                        U.target.style.boxShadow =
                                          '0 0 20px rgba(236, 72, 153, 0.4), 0 0 40px rgba(147, 51, 234, 0.3)';
                                      },
                                      children: 'Start sharing my screen',
                                    }),
                                    A.jsx('button', {
                                      onClick: X,
                                      className:
                                        'bg-purple-800 bg-opacity-50 hover:bg-opacity-70 text-white font-bold py-3 px-4 rounded-xl text-sm uppercase tracking-wide transition-all duration-300 border border-purple-400 border-opacity-30 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50',
                                      'aria-label': 'Stop screen sharing and return to home',
                                      children: 'Stop sharing',
                                    }),
                                  ],
                                }),
                                A.jsxs('div', {
                                  className: 'grid grid-cols-2 gap-3',
                                  children: [
                                    A.jsx('button', {
                                      onClick: D,
                                      className:
                                        'bg-purple-800 bg-opacity-50 hover:bg-opacity-70 text-white font-bold py-3 px-4 rounded-xl text-sm uppercase tracking-wide transition-all duration-300 border border-purple-400 border-opacity-30 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50',
                                      'aria-label': 'Start recording the screen sharing session',
                                      children: 'Start Recording',
                                    }),
                                    A.jsxs('button', {
                                      onClick: () => p(!j),
                                      className:
                                        'bg-purple-800 bg-opacity-50 hover:bg-opacity-70 text-white font-bold py-3 px-4 rounded-xl text-sm uppercase tracking-wide transition-all duration-300 border border-purple-400 border-opacity-30 flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50',
                                      'aria-label': 'Toggle diagnostics panel to view connection information',
                                      children: [
                                        A.jsxs('svg', {
                                          className: 'w-4 h-4',
                                          fill: 'none',
                                          stroke: 'currentColor',
                                          viewBox: '0 0 24 24',
                                          children: [
                                            A.jsx('path', {
                                              strokeLinecap: 'round',
                                              strokeLinejoin: 'round',
                                              strokeWidth: 2,
                                              d: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
                                            }),
                                            A.jsx('path', {
                                              strokeLinecap: 'round',
                                              strokeLinejoin: 'round',
                                              strokeWidth: 2,
                                              d: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z',
                                            }),
                                          ],
                                        }),
                                        A.jsx('span', { children: 'Diagnostics' }),
                                      ],
                                    }),
                                  ],
                                }),
                                A.jsxs('div', {
                                  className: 'grid grid-cols-2 gap-3',
                                  children: [
                                    A.jsx('button', {
                                      onClick: tl,
                                      className:
                                        'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-3 px-4 rounded-xl text-sm uppercase tracking-wide transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50',
                                      style: {
                                        boxShadow: '0 0 20px rgba(59, 130, 246, 0.4), 0 0 40px rgba(6, 182, 212, 0.3)',
                                      },
                                      'aria-label': 'Join a room as a viewer to watch screen sharing',
                                      onMouseEnter: (U) => {
                                        U.target.style.boxShadow =
                                          '0 0 30px rgba(59, 130, 246, 0.8), 0 0 60px rgba(6, 182, 212, 0.6), 0 0 90px rgba(59, 130, 246, 0.4)';
                                      },
                                      onMouseLeave: (U) => {
                                        U.target.style.boxShadow =
                                          '0 0 20px rgba(59, 130, 246, 0.4), 0 0 40px rgba(6, 182, 212, 0.3)';
                                      },
                                      children: 'Open room link (viewer)',
                                    }),
                                    A.jsx('input', {
                                      type: 'text',
                                      placeholder: 'Paste room id here',
                                      value: M,
                                      onChange: (U) => r(U.target.value),
                                      className:
                                        'bg-purple-800 bg-opacity-50 hover:bg-opacity-70 text-white placeholder-gray-300 font-bold py-3 px-4 rounded-xl text-sm uppercase tracking-wide transition-all duration-300 border border-purple-400 border-opacity-30 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50',
                                      'aria-label': 'Enter room ID to join a screen sharing session',
                                    }),
                                  ],
                                }),
                              ],
                            }),
                            A.jsx('div', {
                              className: 'text-center mb-6',
                              children: A.jsx('p', {
                                className: 'text-white text-sm font-medium',
                                children: 'Status: idle',
                              }),
                            }),
                            A.jsxs('div', {
                              className: 'space-y-6',
                              children: [
                                A.jsxs('div', {
                                  children: [
                                    A.jsx('h3', {
                                      className: 'text-white text-sm font-bold mb-3 uppercase tracking-wide',
                                      children: 'Local preview',
                                    }),
                                    A.jsxs('div', {
                                      className: 'grid grid-cols-1 sm:grid-cols-2 gap-3',
                                      children: [
                                        A.jsxs('div', {
                                          className:
                                            'bg-purple-800 bg-opacity-40 border border-purple-400 border-opacity-30 rounded-xl p-3 flex flex-col items-center justify-center min-h-[120px]',
                                          children: [
                                            A.jsxs('div', {
                                              className: 'flex items-center space-x-2 mb-2',
                                              children: [
                                                A.jsx('svg', {
                                                  className: 'w-4 h-4 text-white',
                                                  fill: 'currentColor',
                                                  viewBox: '0 0 24 24',
                                                  children: A.jsx('path', { d: 'M8 5v14l11-7z' }),
                                                }),
                                                A.jsx('span', { className: 'text-white text-xs', children: '0:00' }),
                                              ],
                                            }),
                                            A.jsxs('div', {
                                              className: 'flex items-center space-x-2 mb-2',
                                              children: [
                                                A.jsx('svg', {
                                                  className: 'w-4 h-4 text-white',
                                                  fill: 'none',
                                                  stroke: 'currentColor',
                                                  viewBox: '0 0 24 24',
                                                  children: A.jsx('path', {
                                                    strokeLinecap: 'round',
                                                    strokeLinejoin: 'round',
                                                    strokeWidth: 2,
                                                    d: 'M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z',
                                                  }),
                                                }),
                                                A.jsx('svg', {
                                                  className: 'w-4 h-4 text-white',
                                                  fill: 'none',
                                                  stroke: 'currentColor',
                                                  viewBox: '0 0 24 24',
                                                  children: A.jsx('path', {
                                                    strokeLinecap: 'round',
                                                    strokeLinejoin: 'round',
                                                    strokeWidth: 2,
                                                    d: 'M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z',
                                                  }),
                                                }),
                                              ],
                                            }),
                                            A.jsx('div', { className: 'w-full h-0.5 bg-white bg-opacity-30 rounded' }),
                                          ],
                                        }),
                                        A.jsxs('div', {
                                          className:
                                            'bg-purple-800 bg-opacity-40 border border-purple-400 border-opacity-30 rounded-xl p-3 flex flex-col items-center justify-center min-h-[120px]',
                                          children: [
                                            A.jsxs('div', {
                                              className: 'flex items-center space-x-2 mb-2',
                                              children: [
                                                A.jsx('svg', {
                                                  className: 'w-4 h-4 text-white',
                                                  fill: 'currentColor',
                                                  viewBox: '0 0 24 24',
                                                  children: A.jsx('path', { d: 'M8 5v14l11-7z' }),
                                                }),
                                                A.jsx('span', { className: 'text-white text-xs', children: '0:00' }),
                                              ],
                                            }),
                                            A.jsxs('div', {
                                              className: 'flex items-center space-x-2 mb-2',
                                              children: [
                                                A.jsx('svg', {
                                                  className: 'w-4 h-4 text-white',
                                                  fill: 'none',
                                                  stroke: 'currentColor',
                                                  viewBox: '0 0 24 24',
                                                  children: A.jsx('path', {
                                                    strokeLinecap: 'round',
                                                    strokeLinejoin: 'round',
                                                    strokeWidth: 2,
                                                    d: 'M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z',
                                                  }),
                                                }),
                                                A.jsx('svg', {
                                                  className: 'w-4 h-4 text-white',
                                                  fill: 'none',
                                                  stroke: 'currentColor',
                                                  viewBox: '0 0 24 24',
                                                  children: A.jsx('path', {
                                                    strokeLinecap: 'round',
                                                    strokeLinejoin: 'round',
                                                    strokeWidth: 2,
                                                    d: 'M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z',
                                                  }),
                                                }),
                                              ],
                                            }),
                                            A.jsx('div', { className: 'w-full h-0.5 bg-white bg-opacity-30 rounded' }),
                                          ],
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                                A.jsxs('div', {
                                  children: [
                                    A.jsx('h3', {
                                      className: 'text-white text-sm font-bold mb-3 uppercase tracking-wide',
                                      children: 'Remote preview',
                                    }),
                                    A.jsx('div', {
                                      className:
                                        'bg-purple-800 bg-opacity-40 border border-purple-400 border-opacity-30 rounded-xl p-8 flex items-center justify-center min-h-[120px]',
                                      children: A.jsx('p', {
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
                  : A.jsxs('div', {
                      className: 'w-full max-w-7xl mx-auto',
                      children: [
                        A.jsx('header', {
                          className:
                            'bg-black bg-opacity-30 backdrop-blur-sm border-b border-purple-500 border-opacity-30 mb-8',
                          children: A.jsx('div', {
                            className: 'px-4 sm:px-6 lg:px-8',
                            children: A.jsxs('div', {
                              className: 'flex justify-between items-center h-16',
                              children: [
                                A.jsxs('div', {
                                  className: 'flex items-center',
                                  children: [
                                    A.jsx('h1', {
                                      className: 'text-xl font-semibold text-white',
                                      children: 'Stupid Simple Screen Share',
                                    }),
                                    z !== 'home' &&
                                      A.jsxs('span', {
                                        className: 'ml-4 text-sm text-purple-300',
                                        children: ['Room: ', M],
                                      }),
                                  ],
                                }),
                                A.jsx('div', {
                                  className: 'flex items-center space-x-4',
                                  children:
                                    z !== 'home' &&
                                    A.jsxs(A.Fragment, {
                                      children: [
                                        A.jsx('button', {
                                          onClick: () => it(!$),
                                          className: `px-3 py-1 text-sm rounded transition-all ${$ ? 'bg-blue-600 text-white shadow-lg shadow-blue-500 shadow-opacity-50' : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'}`,
                                          children: 'Chat',
                                        }),
                                        A.jsx('button', {
                                          onClick: () => p(!j),
                                          className: `px-3 py-1 text-sm rounded transition-all ${j ? 'bg-green-600 text-white shadow-lg shadow-green-500 shadow-opacity-50' : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'}`,
                                          children: 'Diagnostics',
                                        }),
                                        A.jsx('button', {
                                          onClick: Q,
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
                        A.jsx('main', {
                          className: 'px-4 sm:px-6 lg:px-8',
                          children: A.jsxs(ft.Suspense, {
                            fallback: A.jsx('div', { className: 'text-center text-white', children: 'Loading...' }),
                            children: [
                              z === 'host' && A.jsx(Eh, { roomId: M, config: Z, onGoHome: Q }),
                              z === 'viewer' &&
                                A.jsx(zh, { roomId: M, viewerId: Y, setViewerId: J, config: Z, onGoHome: Q }),
                            ],
                          }),
                        }),
                        $ &&
                          z !== 'home' &&
                          A.jsx('div', {
                            className:
                              'fixed right-0 top-16 bottom-0 w-80 bg-black bg-opacity-80 backdrop-blur-sm shadow-lg border-l border-purple-500 border-opacity-30 z-50',
                            children: A.jsx(ft.Suspense, {
                              fallback: A.jsx('div', {
                                className: 'text-center text-white p-4',
                                children: 'Loading chat...',
                              }),
                              children: A.jsx(Th, { roomId: M, role: z === 'host' ? 'host' : 'viewer', viewerId: Y }),
                            }),
                          }),
                        j &&
                          z !== 'home' &&
                          A.jsx('div', {
                            className:
                              'fixed left-0 top-16 bottom-0 w-80 bg-black bg-opacity-80 backdrop-blur-sm shadow-lg border-r border-purple-500 border-opacity-30 z-50',
                            children: A.jsx(ft.Suspense, {
                              fallback: A.jsx('div', {
                                className: 'text-center text-white p-4',
                                children: 'Loading diagnostics...',
                              }),
                              children: A.jsx(Ah, { roomId: M, role: z === 'host' ? 'host' : 'viewer' }),
                            }),
                          }),
                      ],
                    }),
            }),
          ],
        });
}
hh.createRoot(document.getElementById('root')).render(A.jsx(ih.StrictMode, { children: A.jsx(_h, {}) }));
export { A as j, ft as r, gh as u };
//# sourceMappingURL=main-DEmRS2_I.js.map
