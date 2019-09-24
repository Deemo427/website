(function webpackUniversalModuleDefinition(root, factory) {
    if (typeof exports === 'object' && typeof module === 'object') module.exports = factory();
    else if (typeof define === 'function' && define.amd) define("Barba", [], factory);
    else if (typeof exports === 'object') exports.Barba = factory();
    else root.Barba = factory()
})(this, function () {
    return (function (modules) {
        var installedModules = {};

        function __webpack_require__(moduleId) {
            if (installedModules[moduleId]) return installedModules[moduleId].exports;
            var module = installedModules[moduleId] = {
                exports: {}
                , id: moduleId
                , loaded: !1
            };
            modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
            module.loaded = !0;
            return module.exports
        }
        __webpack_require__.m = modules;
        __webpack_require__.c = installedModules;
        __webpack_require__.p = "http://localhost:8080/dist";
        return __webpack_require__(0)
    })([function (module, exports, __webpack_require__) {
        if (typeof Promise !== 'function') {
            window.Promise = __webpack_require__(1)
        }
        var Barba = {
            version: '1.0.0'
            , BaseTransition: __webpack_require__(4)
            , BaseView: __webpack_require__(6)
            , BaseCache: __webpack_require__(8)
            , Dispatcher: __webpack_require__(7)
            , HistoryManager: __webpack_require__(9)
            , Pjax: __webpack_require__(10)
            , Prefetch: __webpack_require__(13)
            , Utils: __webpack_require__(5)
        };
        module.exports = Barba
    }, function (module, exports, __webpack_require__) {
        (function (setImmediate) {
            (function (root) {
                var setTimeoutFunc = setTimeout;

                function noop() {}
                var asap = (typeof setImmediate === 'function' && setImmediate) || function (fn) {
                    setTimeoutFunc(fn, 0)
                };
                var onUnhandledRejection = function onUnhandledRejection(err) {
                    if (typeof console !== 'undefined' && console) {
                        console.warn('Possible Unhandled Promise Rejection:', err)
                    }
                };

                function bind(fn, thisArg) {
                    return function () {
                        fn.apply(thisArg, arguments)
                    }
                }

                function Promise(fn) {
                    if (typeof this !== 'object') throw new TypeError('Promises must be constructed via new');
                    if (typeof fn !== 'function') throw new TypeError('not a function');
                    this._state = 0;
                    this._handled = !1;
                    this._value = undefined;
                    this._deferreds = [];
                    doResolve(fn, this)
                }

                function handle(self, deferred) {
                    while (self._state === 3) {
                        self = self._value
                    }
                    if (self._state === 0) {
                        self._deferreds.push(deferred);
                        return
                    }
                    self._handled = !0;
                    asap(function () {
                        var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
                        if (cb === null) {
                            (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
                            return
                        }
                        var ret;
                        try {
                            ret = cb(self._value)
                        }
                        catch (e) {
                            reject(deferred.promise, e);
                            return
                        }
                        resolve(deferred.promise, ret)
                    })
                }

                function resolve(self, newValue) {
                    try {
                        if (newValue === self) throw new TypeError('A promise cannot be resolved with itself.');
                        if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
                            var then = newValue.then;
                            if (newValue instanceof Promise) {
                                self._state = 3;
                                self._value = newValue;
                                finale(self);
                                return
                            }
                            else if (typeof then === 'function') {
                                doResolve(bind(then, newValue), self);
                                return
                            }
                        }
                        self._state = 1;
                        self._value = newValue;
                        finale(self)
                    }
                    catch (e) {
                        reject(self, e)
                    }
                }

                function reject(self, newValue) {
                    self._state = 2;
                    self._value = newValue;
                    finale(self)
                }

                function finale(self) {
                    if (self._state === 2 && self._deferreds.length === 0) {
                        asap(function () {
                            if (!self._handled) {
                                onUnhandledRejection(self._value)
                            }
                        })
                    }
                    for (var i = 0, len = self._deferreds.length; i < len; i++) {
                        handle(self, self._deferreds[i])
                    }
                    self._deferreds = null
                }

                function Handler(onFulfilled, onRejected, promise) {
                    this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
                    this.onRejected = typeof onRejected === 'function' ? onRejected : null;
                    this.promise = promise
                }

                function doResolve(fn, self) {
                    var done = !1;
                    try {
                        fn(function (value) {
                            if (done) return;
                            done = !0;
                            resolve(self, value)
                        }, function (reason) {
                            if (done) return;
                            done = !0;
                            reject(self, reason)
                        })
                    }
                    catch (ex) {
                        if (done) return;
                        done = !0;
                        reject(self, ex)
                    }
                }
                Promise.prototype['catch'] = function (onRejected) {
                    return this.then(null, onRejected)
                };
                Promise.prototype.then = function (onFulfilled, onRejected) {
                    var prom = new(this.constructor)(noop);
                    handle(this, new Handler(onFulfilled, onRejected, prom));
                    return prom
                };
                Promise.all = function (arr) {
                    var args = Array.prototype.slice.call(arr);
                    return new Promise(function (resolve, reject) {
                        if (args.length === 0) return resolve([]);
                        var remaining = args.length;

                        function res(i, val) {
                            try {
                                if (val && (typeof val === 'object' || typeof val === 'function')) {
                                    var then = val.then;
                                    if (typeof then === 'function') {
                                        then.call(val, function (val) {
                                            res(i, val)
                                        }, reject);
                                        return
                                    }
                                }
                                args[i] = val;
                                if (--remaining === 0) {
                                    resolve(args)
                                }
                            }
                            catch (ex) {
                                reject(ex)
                            }
                        }
                        for (var i = 0; i < args.length; i++) {
                            res(i, args[i])
                        }
                    })
                };
                Promise.resolve = function (value) {
                    if (value && typeof value === 'object' && value.constructor === Promise) {
                        return value
                    }
                    return new Promise(function (resolve) {
                        resolve(value)
                    })
                };
                Promise.reject = function (value) {
                    return new Promise(function (resolve, reject) {
                        reject(value)
                    })
                };
                Promise.race = function (values) {
                    return new Promise(function (resolve, reject) {
                        for (var i = 0, len = values.length; i < len; i++) {
                            values[i].then(resolve, reject)
                        }
                    })
                };
                Promise._setImmediateFn = function _setImmediateFn(fn) {
                    asap = fn
                };
                Promise._setUnhandledRejectionFn = function _setUnhandledRejectionFn(fn) {
                    onUnhandledRejection = fn
                };
                if (typeof module !== 'undefined' && module.exports) {
                    module.exports = Promise
                }
                else if (!root.Promise) {
                    root.Promise = Promise
                }
            })(this)
        }.call(exports, __webpack_require__(2).setImmediate))
    }, function (module, exports, __webpack_require__) {
        (function (setImmediate, clearImmediate) {
            var nextTick = __webpack_require__(3).nextTick;
            var apply = Function.prototype.apply;
            var slice = Array.prototype.slice;
            var immediateIds = {};
            var nextImmediateId = 0;
            exports.setTimeout = function () {
                return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout)
            };
            exports.setInterval = function () {
                return new Timeout(apply.call(setInterval, window, arguments), clearInterval)
            };
            exports.clearTimeout = exports.clearInterval = function (timeout) {
                timeout.close()
            };

            function Timeout(id, clearFn) {
                this._id = id;
                this._clearFn = clearFn
            }
            Timeout.prototype.unref = Timeout.prototype.ref = function () {};
            Timeout.prototype.close = function () {
                this._clearFn.call(window, this._id)
            };
            exports.enroll = function (item, msecs) {
                clearTimeout(item._idleTimeoutId);
                item._idleTimeout = msecs
            };
            exports.unenroll = function (item) {
                clearTimeout(item._idleTimeoutId);
                item._idleTimeout = -1
            };
            exports._unrefActive = exports.active = function (item) {
                clearTimeout(item._idleTimeoutId);
                var msecs = item._idleTimeout;
                if (msecs >= 0) {
                    item._idleTimeoutId = setTimeout(function onTimeout() {
                        if (item._onTimeout) item._onTimeout()
                    }, msecs)
                }
            };
            exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function (fn) {
                var id = nextImmediateId++;
                var args = arguments.length < 2 ? !1 : slice.call(arguments, 1);
                immediateIds[id] = !0;
                nextTick(function onNextTick() {
                    if (immediateIds[id]) {
                        if (args) {
                            fn.apply(null, args)
                        }
                        else {
                            fn.call(null)
                        }
                        exports.clearImmediate(id)
                    }
                });
                return id
            };
            exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function (id) {
                delete immediateIds[id]
            }
        }.call(exports, __webpack_require__(2).setImmediate, __webpack_require__(2).clearImmediate))
    }, function (module, exports) {
        var process = module.exports = {};
        var cachedSetTimeout;
        var cachedClearTimeout;
        (function () {
            try {
                cachedSetTimeout = setTimeout
            }
            catch (e) {
                cachedSetTimeout = function () {
                    throw new Error('setTimeout is not defined')
                }
            }
            try {
                cachedClearTimeout = clearTimeout
            }
            catch (e) {
                cachedClearTimeout = function () {
                    throw new Error('clearTimeout is not defined')
                }
            }
        }())
        var queue = [];
        var draining = !1;
        var currentQueue;
        var queueIndex = -1;

        function cleanUpNextTick() {
            if (!draining || !currentQueue) {
                return
            }
            draining = !1;
            if (currentQueue.length) {
                queue = currentQueue.concat(queue)
            }
            else {
                queueIndex = -1
            }
            if (queue.length) {
                drainQueue()
            }
        }

        function drainQueue() {
            if (draining) {
                return
            }
            var timeout = cachedSetTimeout(cleanUpNextTick);
            draining = !0;
            var len = queue.length;
            while (len) {
                currentQueue = queue;
                queue = [];
                while (++queueIndex < len) {
                    if (currentQueue) {
                        currentQueue[queueIndex].run()
                    }
                }
                queueIndex = -1;
                len = queue.length
            }
            currentQueue = null;
            draining = !1;
            cachedClearTimeout(timeout)
        }
        process.nextTick = function (fun) {
            var args = new Array(arguments.length - 1);
            if (arguments.length > 1) {
                for (var i = 1; i < arguments.length; i++) {
                    args[i - 1] = arguments[i]
                }
            }
            queue.push(new Item(fun, args));
            if (queue.length === 1 && !draining) {
                cachedSetTimeout(drainQueue, 0)
            }
        };

        function Item(fun, array) {
            this.fun = fun;
            this.array = array
        }
        Item.prototype.run = function () {
            this.fun.apply(null, this.array)
        };
        process.title = 'browser';
        process.browser = !0;
        process.env = {};
        process.argv = [];
        process.version = '';
        process.versions = {};

        function noop() {}
        process.on = noop;
        process.addListener = noop;
        process.once = noop;
        process.off = noop;
        process.removeListener = noop;
        process.removeAllListeners = noop;
        process.emit = noop;
        process.binding = function (name) {
            throw new Error('process.binding is not supported')
        };
        process.cwd = function () {
            return '/'
        };
        process.chdir = function (dir) {
            throw new Error('process.chdir is not supported')
        };
        process.umask = function () {
            return 0
        }
    }, function (module, exports, __webpack_require__) {
        var Utils = __webpack_require__(5);
        var BaseTransition = {
            oldContainer: undefined
            , newContainer: undefined
            , newContainerLoading: undefined
            , extend: function (obj) {
                return Utils.extend(this, obj)
            }
            , init: function (oldContainer, newContainer) {
                var _this = this;
                this.oldContainer = oldContainer;
                this._newContainerPromise = newContainer;
                this.deferred = Utils.deferred();
                this.newContainerReady = Utils.deferred();
                this.newContainerLoading = this.newContainerReady.promise;
                this.start();
                this._newContainerPromise.then(function (newContainer) {
                    _this.newContainer = newContainer;
                    _this.newContainerReady.resolve()
                });
                return this.deferred.promise
            }
            , done: function () {
                this.oldContainer.parentNode.removeChild(this.oldContainer);
                this.newContainer.style.visibility = 'visible';
                this.deferred.resolve()
            }
            , start: function () {}
        , };
        module.exports = BaseTransition
    }, function (module, exports) {
        var Utils = {
            getCurrentUrl: function () {
                return window.location.protocol + '//' + window.location.host + window.location.pathname + window.location.search
            }
            , cleanLink: function (url) {
                return url.replace(/#.*/, '')
            }
            , xhrTimeout: 5000
            , xhr: function (url) {
                var deferred = this.deferred();
                var req = new XMLHttpRequest();
                req.onreadystatechange = function () {
                    if (req.readyState === 4) {
                        if (req.status === 200) {
                            return deferred.resolve(req.responseText)
                        }
                        else {
                            return deferred.reject(new Error('xhr: HTTP code is not 200'))
                        }
                    }
                };
                req.ontimeout = function () {
                    return deferred.reject(new Error('xhr: Timeout exceeded'))
                };
                req.open('GET', url);
                req.timeout = this.xhrTimeout;
                req.setRequestHeader('x-barba', 'yes');
                req.send();
                return deferred.promise
            }
            , extend: function (obj, props) {
                var newObj = Object.create(obj);
                for (var prop in props) {
                    if (props.hasOwnProperty(prop)) {
                        newObj[prop] = props[prop]
                    }
                }
                return newObj
            }
            , deferred: function () {
                return new function () {
                    this.resolve = null;
                    this.reject = null;
                    this.promise = new Promise(function (resolve, reject) {
                        this.resolve = resolve;
                        this.reject = reject
                    }.bind(this))
                }
            }
            , getPort: function (p) {
                var port = typeof p !== 'undefined' ? p : window.location.port;
                var protocol = window.location.protocol;
                if (port != '') return parseInt(port);
                if (protocol === 'http:') return 80;
                if (protocol === 'https:') return 443
            }
        };
        module.exports = Utils
    }, function (module, exports, __webpack_require__) {
        var Dispatcher = __webpack_require__(7);
        var Utils = __webpack_require__(5);
        var BaseView = {
            namespace: null
            , extend: function (obj) {
                return Utils.extend(this, obj)
            }
            , init: function () {
                var _this = this;
                Dispatcher.on('initStateChange', function (newStatus, oldStatus) {
                    if (oldStatus && oldStatus.namespace === _this.namespace) _this.onLeave()
                });
                Dispatcher.on('newPageReady', function (newStatus, oldStatus, container) {
                    _this.container = container;
                    if (newStatus.namespace === _this.namespace) _this.onEnter()
                });
                Dispatcher.on('transitionCompleted', function (newStatus, oldStatus) {
                    if (newStatus.namespace === _this.namespace) _this.onEnterCompleted();
                    if (oldStatus && oldStatus.namespace === _this.namespace) _this.onLeaveCompleted()
                })
            }
            , onEnter: function () {}
            , onEnterCompleted: function () {}
            , onLeave: function () {}
            , onLeaveCompleted: function () {}
        }
        module.exports = BaseView
    }, function (module, exports) {
        var Dispatcher = {
            events: {}
            , on: function (e, f) {
                this.events[e] = this.events[e] || [];
                this.events[e].push(f)
            }
            , off: function (e, f) {
                if (e in this.events === !1) return;
                this.events[e].splice(this.events[e].indexOf(f), 1)
            }
            , trigger: function (e) {
                if (e in this.events === !1) return;
                for (var i = 0; i < this.events[e].length; i++) {
                    this.events[e][i].apply(this, Array.prototype.slice.call(arguments, 1))
                }
            }
        };
        module.exports = Dispatcher
    }, function (module, exports, __webpack_require__) {
        var Utils = __webpack_require__(5);
        var BaseCache = {
            data: {}
            , extend: function (obj) {
                return Utils.extend(this, obj)
            }
            , set: function (key, val) {
                this.data[key] = val
            }
            , get: function (key) {
                return this.data[key]
            }
            , reset: function () {
                this.data = {}
            }
        };
        module.exports = BaseCache
    }, function (module, exports) {
        var HistoryManager = {
            history: []
            , add: function (url, namespace) {
                if (!namespace) namespace = undefined;
                this.history.push({
                    url: url
                    , namespace: namespace
                })
            }
            , currentStatus: function () {
                return this.history[this.history.length - 1]
            }
            , prevStatus: function () {
                var history = this.history;
                if (history.length < 2) return null;
                return history[history.length - 2]
            }
        };
        module.exports = HistoryManager
    }, function (module, exports, __webpack_require__) {
        var Utils = __webpack_require__(5);
        var Dispatcher = __webpack_require__(7);
        var HideShowTransition = __webpack_require__(11);
        var BaseCache = __webpack_require__(8);
        var HistoryManager = __webpack_require__(9);
        var Dom = __webpack_require__(12);
        var Pjax = {
            Dom: Dom
            , History: HistoryManager
            , Cache: BaseCache
            , cacheEnabled: !0
            , transitionProgress: !1
            , ignoreClassLink: 'no-barba'
            , start: function () {
                this.init()
            }
            , init: function () {
                var container = this.Dom.getContainer();
                var wrapper = this.Dom.getWrapper();
                wrapper.setAttribute('aria-live', 'polite');
                this.History.add(this.getCurrentUrl(), this.Dom.getNamespace(container));
                Dispatcher.trigger('initStateChange', this.History.currentStatus());
                Dispatcher.trigger('newPageReady', this.History.currentStatus(), {}, container, this.Dom.currentHTML);
                Dispatcher.trigger('transitionCompleted', this.History.currentStatus());
                this.bindEvents()
            }
            , bindEvents: function () {
                document.addEventListener('click', this.onLinkClick.bind(this));
                window.addEventListener('popstate', this.onStateChange.bind(this))
            }
            , getCurrentUrl: function () {
                return Utils.cleanLink(Utils.getCurrentUrl())
            }
            , goTo: function (url) {
                window.history.pushState(null, null, url);
                this.onStateChange()
            }
            , forceGoTo: function (url) {
                window.location = url
            }
            , load: function (url) {
                var deferred = Utils.deferred();
                var _this = this;
                var xhr;
                xhr = this.Cache.get(url);
                if (!xhr) {
                    xhr = Utils.xhr(url);
                    this.Cache.set(url, xhr)
                }
                xhr.then(function (data) {
                    var container = _this.Dom.parseResponse(data);
                    _this.Dom.putContainer(container);
                    if (!_this.cacheEnabled) _this.Cache.reset();
                    deferred.resolve(container)
                }, function () {
                    _this.forceGoTo(url);
                    deferred.reject()
                });
                return deferred.promise
            }
            , getHref: function (el) {
                if (!el) {
                    return undefined
                }
                if (el.getAttribute && typeof el.getAttribute('xlink:href') === 'string') {
                    return el.getAttribute('xlink:href')
                }
                if (typeof el.href === 'string') {
                    return el.href
                }
                return undefined
            }
            , onLinkClick: function (evt) {
                var el = evt.target;
                while (el && !this.getHref(el)) {
                    el = el.parentNode
                }
                if (this.preventCheck(evt, el)) {
                    evt.stopPropagation();
                    evt.preventDefault();
                    Dispatcher.trigger('linkClicked', el, evt);
                    var href = this.getHref(el);
                    this.goTo(href)
                }
            }
            , preventCheck: function (evt, element) {
                if (!window.history.pushState) return !1;
                var href = this.getHref(element);
                if (!element || !href) return !1;
                if (evt.which > 1 || evt.metaKey || evt.ctrlKey || evt.shiftKey || evt.altKey) return !1;
                if (element.target && element.target === '_blank') return !1;
                if (window.location.protocol !== element.protocol || window.location.hostname !== element.hostname) return !1;
                if (Utils.getPort() !== Utils.getPort(element.port)) return !1;
                if (location.href.indexOf(href) > -1 && href.indexOf('#') > -1) return !1;
                if (element.getAttribute && typeof element.getAttribute('download') === 'string') return !1;
                if (Utils.cleanLink(href) === Utils.cleanLink(location.href)) return !1;
                if (element.classList.contains(this.ignoreClassLink)) return !1;
                return !0
            }
            , getTransition: function () {
                return HideShowTransition
            }
            , onStateChange: function () {
                var newUrl = this.getCurrentUrl();
                if (this.transitionProgress) this.forceGoTo(newUrl);
                if (this.History.currentStatus().url === newUrl) return !1;
                this.History.add(newUrl);
                var newContainer = this.load(newUrl);
                var transition = Object.create(this.getTransition());
                this.transitionProgress = !0;
                Dispatcher.trigger('initStateChange', this.History.currentStatus(), this.History.prevStatus());
                var transitionInstance = transition.init(this.Dom.getContainer(), newContainer);
                newContainer.then(this.onNewContainerLoaded.bind(this));
                transitionInstance.then(this.onTransitionEnd.bind(this))
            }
            , onNewContainerLoaded: function (container) {
                var currentStatus = this.History.currentStatus();
                currentStatus.namespace = this.Dom.getNamespace(container);
                Dispatcher.trigger('newPageReady', this.History.currentStatus(), this.History.prevStatus(), container, this.Dom.currentHTML)
            }
            , onTransitionEnd: function () {
                this.transitionProgress = !1;
                Dispatcher.trigger('transitionCompleted', this.History.currentStatus(), this.History.prevStatus())
            }
        };
        module.exports = Pjax
    }, function (module, exports, __webpack_require__) {
        var BaseTransition = __webpack_require__(4);
        var HideShowTransition = BaseTransition.extend({
            start: function () {
                this.newContainerLoading.then(this.finish.bind(this))
            }
            , finish: function () {
                document.body.scrollTop = 0;
                this.done()
            }
        });
        module.exports = HideShowTransition
    }, function (module, exports) {
        var Dom = {
            dataNamespace: 'namespace'
            , wrapperId: 'barba-wrapper'
            , containerClass: 'barba-container'
            , currentHTML: document.documentElement.innerHTML
            , parseResponse: function (responseText) {
                this.currentHTML = responseText;
                var wrapper = document.createElement('div');
                wrapper.innerHTML = responseText;
                var titleEl = wrapper.querySelector('title');
                if (titleEl) document.title = titleEl.textContent;
                return this.getContainer(wrapper)
            }
            , getWrapper: function () {
                var wrapper = document.getElementById(this.wrapperId);
                if (!wrapper) throw new Error('Barba.js: wrapper not found!');
                return wrapper
            }
            , getContainer: function (element) {
                if (!element) element = document.body;
                if (!element) throw new Error('Barba.js: DOM not ready!');
                var container = this.parseContainer(element);
                if (container && container.jquery) container = container[0];
                if (!container) throw new Error('Barba.js: no container found');
                return container
            }
            , getNamespace: function (element) {
                if (element && element.dataset) {
                    return element.dataset[this.dataNamespace]
                }
                else if (element) {
                    return element.getAttribute('data-' + this.dataNamespace)
                }
                return null
            }
            , putContainer: function (element) {
                element.style.visibility = 'hidden';
                var wrapper = this.getWrapper();
                wrapper.appendChild(element)
            }
            , parseContainer: function (element) {
                return element.querySelector('.' + this.containerClass)
            }
        };
        module.exports = Dom
    }, function (module, exports, __webpack_require__) {
        var Utils = __webpack_require__(5);
        var Pjax = __webpack_require__(10);
        var Prefetch = {
            ignoreClassLink: 'no-barba-prefetch'
            , init: function () {
                if (!window.history.pushState) {
                    return !1
                }
                document.body.addEventListener('mouseover', this.onLinkEnter.bind(this));
                document.body.addEventListener('touchstart', this.onLinkEnter.bind(this))
            }
            , onLinkEnter: function (evt) {
                var el = evt.target;
                while (el && !Pjax.getHref(el)) {
                    el = el.parentNode
                }
                if (!el || el.classList.contains(this.ignoreClassLink)) {
                    return
                }
                var url = Pjax.getHref(el);
                if (Pjax.preventCheck(evt, el) && !Pjax.Cache.get(url)) {
                    var xhr = Utils.xhr(url);
                    Pjax.Cache.set(url, xhr)
                }
            }
        };
        module.exports = Prefetch
    }])
})