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
                var _loop_1 = function (i) {
                    var currentVal = values[i];
                    if (isPromise(currentVal)) {
                        currentVal.then(function (data) {
                            results[i] = data;
                            count++;
                            if (length === count) {
                                resolve(results);
                            }
                        }, reject);
                    }
                    else {
                        results[i] = currentVal;
                        count++;
                        if (length === count) {
                            resolve(results);
                        }
                    }
                };
                for (var i = 0; i < length; i++) {
                    _loop_1(i);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7SUFZQTtRQXNERSxrQkFBYSxPQUF3QjtZQUFyQyxpQkFvQkM7WUF6RU8sV0FBTSxHQUFtQixTQUFTLENBQUM7WUFDbkMsVUFBSyxHQUFpQixTQUFTLENBQUM7WUFFaEMsZUFBVSxHQUFjLEVBQUUsQ0FBQztZQUMzQixjQUFTLEdBQWMsRUFBRSxDQUFDO1lBa0RoQyxJQUFNLE9BQU8sR0FBRyxVQUFDLElBQU87Z0JBQ3RCLElBQUksS0FBSSxDQUFDLE1BQU0sS0FBSyxTQUFTLEVBQUU7b0JBQzdCLEtBQUksQ0FBQyxNQUFNLEdBQUcsV0FBVyxDQUFDO29CQUMxQixLQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztvQkFDbEIsS0FBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsVUFBQSxFQUFFLElBQUksT0FBQSxFQUFFLENBQUMsS0FBSSxDQUFDLEtBQUssQ0FBQyxFQUFkLENBQWMsQ0FBQyxDQUFDO2lCQUMvQztZQUNILENBQUMsQ0FBQztZQUNGLElBQU0sTUFBTSxHQUFHLFVBQUMsS0FBVTtnQkFDeEIsSUFBSSxLQUFJLENBQUMsTUFBTSxLQUFLLFNBQVMsRUFBRTtvQkFDN0IsS0FBSSxDQUFDLE1BQU0sR0FBRSxVQUFVLENBQUM7b0JBQ3hCLEtBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO29CQUNuQixLQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFBLEVBQUUsSUFBSSxPQUFBLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBVCxDQUFTLENBQUMsQ0FBQztpQkFDekM7WUFDSCxDQUFDLENBQUE7WUFDRCxJQUFJO2dCQUNGLE9BQU8sQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7YUFDMUI7WUFBQyxPQUFPLEtBQUssRUFBRTtnQkFDZCxNQUFNLENBQUMsS0FBSyxDQUFDLENB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