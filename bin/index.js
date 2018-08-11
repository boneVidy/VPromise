(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Vpromise = /** @class */ (function () {
        function Vpromise(excutor) {
            var _this = this;
            this.status = 'pending';
            this.value = undefined;
            this.resolveCbs = [];
            this.rejectCbs = [];
            var resolve = function (data) {
                if (_this.status === 'pending') {
                    _this.status = 'fulfilled';
                    _this.value = data;
                    _this.resolveCbs.forEach(function (cb) { return cb(_this.value); });
                }
            };
            var reject = function (reson) {
                if (_this.status === 'pending') {
                    _this.status = 'rejected';
                    _this.reson = reson;
                    _this.rejectCbs.forEach(function (cb) { return cb(reson); });
                }
            };
            try {
                excutor(resolve, reject);
            }
            catch (error) {
                reject(error);
            }
        }
        Vpromise.resolve = function (data) {
            return new Vpromise(function (resolve) {
                resolve(data);
            });
        };
        Vpromise.reject = function (reson) {
            return new Vpromise(function (resolve, reject) {
                reject(reson);
            });
        };
        Vpromise.prototype.then = function (onfulfilled, onrejected) {
            var onFulfilledHandler = typeof onfulfilled === 'function' ? onfulfilled : function () { return onfulfilled; };
            var onRejectedHandler = typeof onrejected === 'function' ? onrejected : function () { return onrejected; };
            var self = this;
            var newPromise = new Vpromise(function (resolve, reject) {
                if (self.status === 'fulfilled') {
                    // @ts-ignore
                    setTimeout(function () {
                        try {
                            var value = onFulfilledHandler(self.value);
                            resolvePromise(newPromise, value, resolve, reject);
                        }
                        catch (error) {
                            reject(error);
                        }
                    }, 0);
                }
                if (self.status === 'rejected') {
                    // @ts-ignore
                    setTimeout(function () {
                        try {
                            var value = onRejectedHandler(self.reson);
                            resolvePromise(newPromise, value, resolve, reject);
                        }
                        catch (error) {
                            reject(error);
                        }
                    }, 0);
                }
                if (self.status === 'pending') {
                    onFulfilledHandler && self.resolveCbs.push(function () {
                        // @ts-ignore
                        setTimeout(function () {
                            try {
                                var value = onFulfilledHandler(self.value);
                                resolvePromise(newPromise, value, resolve, reject);
                            }
                            catch (error) {
                                reject(error);
                            }
                        }, 0);
                    });
                    onRejectedHandler && self.rejectCbs.push(function () {
                        // @ts-ignore
                        setTimeout(function () {
                            try {
                                var value = onRejectedHandler(self.reson);
                                resolvePromise(newPromise, value, resolve, reject);
                            }
                            catch (error) {
                                reject(error);
                            }
                        }, 0);
                    });
                }
            });
            return newPromise;
        };
        Vpromise.prototype.catch = function (onrejected) {
            var onRejectedHandler = typeof onrejected === 'function' ? onrejected : function () { return onrejected; };
            //@ts-ignore
            return this.then(null, onRejectedHandler);
        };
        Vpromise.defer = function () {
            var dfd = {};
            dfd.promise = new Vpromise(function (resolve, reject) {
                dfd.resolve = resolve;
                dfd.reject = reject;
            });
            return dfd;
        };
        // @ts-ignore
        Vpromise.all = function (values) {
            return new Vpromise(function (resolve, reject) {
                var length = values.length;
                var results = [];
                var count = 0;
                var addResult = function (i, data) {
                    results[i] = data;
                    count++;
                    if (length === count) {
                        resolve(results);
                    }
                };
                var _loop_1 = function (i) {
                    var currentVal = values[i];
                    if (isPromise(currentVal)) {
                        currentVal.then(function (data) {
                            addResult(i, data);
                        }, reject);
                    }
                    else {
                        addResult(i, currentVal);
                    }
                };
                for (var i = 0; i < length; i++) {
                    _loop_1(i);
                }
            });
        };
        // @ts-ignore
        Vpromise.race = function (values) {
            return new Vpromise(function (resolve, reject) {
                for (var i = 0; i < values.length; i++) {
                    var currentVal = values[i];
                    if (isPromise(currentVal)) {
                        currentVal.then(function (data) {
                            resolve(data);
                        }, reject);
                    }
                    else {
                        resolve(currentVal);
                    }
                }
            });
        };
        return Vpromise;
    }());
    exports.Vpromise = Vpromise;
    var resolvePromise = function (promise, value, resolve, reject) {
        if (promise === value) {
            return reject(new TypeError("chaing cycle"));
        }
        var isCalled = false;
        if (value !== null && (typeof value === 'object' || typeof value === 'function')) {
            if (value.then) {
                try {
                    var then = value.then;
                    if (typeof then === 'function') {
                        then.call(value, function (newV) {
                            if (isCalled) {
                                return;
                            }
                            isCalled = true;
                            resolvePromise(promise, newV, resolve, reject);
                        }, function (e) {
                            if (isCalled) {
                                return;
                            }
                            isCalled = true;
                            reject(e);
                        });
                    }
                    else {
                        resolve(value);
                    }
                }
                catch (error) {
                    reject(error);
                }
            }
            else {
                resolve(value);
            }
        }
        else {
            resolve(value);
        }
    };
    function isPromise(obj) {
        return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
    }
});
//# sourceMappingURL=index.js.map