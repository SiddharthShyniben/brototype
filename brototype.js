/*global module:true, window:true, require:false, define:false*/
(function () {
    'use strict';

    // Bromise... it's stronger than a Promise
    function Bromise(object, method, args) {
        this.object = object;
        this.method = method;
        this.args = args.length > 1 ? args.slice(1) : [];
    }

    Bromise.brototype = Bromise.prototype = {
        "butWhenIdo": function (callback, context) {
            if (this.method instanceof Function) {
                var returnValue = this.method.apply(this.object, this.args);
                if (returnValue) {
                    (callback || function () { }).call(context || this.object, returnValue);
                }
            }
            return context;
        },

        "hereComeTheErrors": function (callback) {
            if (this.method instanceof Function) {
                try {
                    this.method.apply(this.object, this.args);
                } catch (e) {
                    callback(e);
                }
            } else {
                callback(this.method + ' is not a function.');
            }
        },
        "errorsAreComing": function () {
            this.hereComeTheErrors.apply(this, arguments);
        }
    };

    function Bro(obj) {
        if (this instanceof Bro) {
            this.obj = obj;
        } else {
            return new Bro(obj);
        }
    }

    Bro.TOTALLY = true;
    Bro.NOWAY = false;

    Bro.brototype = Bro.prototype = {
        "isThatEvenAThing": function () {
            return this.obj !== void 0;
        },

        "doYouEven": function (key, callback, options) {
            if (!(callback instanceof Function)) {
                options = callback;
            }
            var optionsBro = Bro(options || {});
            if (!(key instanceof Array)) {
                key = [key];
            }
            var self = this;
            if (key.every(function (k) {
                var bro = self.iCanHaz(k);
                return (Bro(bro).isThatEvenAThing() === Bro.TOTALLY);
            })) {
                optionsBro.iDontAlways('forSure').butWhenIdo();

                // Perform callback function
                if (callback) {
                    for (var i = 0; i < key.length; i++) {
                        callback(self.obj[key[i]], key[i]);
                    }
                }

                return Bro.TOTALLY;
            } else {
                optionsBro.iDontAlways('sorryBro').butWhenIdo();
                return Bro.NOWAY;
            }
        },

        "iCanHaz": function (key) {
            if (Array.isArray(key)) {
                var index, value, result = [];
                for (index in key) {
                    if (key.hasOwnProperty(index)) {
                        value = this.iCanHaz(key[index]);
                        result.push(value);
                    }
                }
                return result;
            }
            var props = key.split('.'),
                item = this.obj;
            for (var i = 0; i < props.length; i++) {
                if (typeof item === "undefined" || item === null || Bro(item = item[props[i]]).isThatEvenAThing() === Bro.NOWAY) {
                    return undefined;
                }
            }
            return item;
        },

        "comeAtMe": function (brobject) {
            var i, prop,
                bro = Bro(brobject),
                keys = bro.giveMeProps(),
                obj = (this instanceof Bro) ? this.obj : Bro.prototype;
            for (i = 0; i < keys.length; i++) {
                prop = keys[i];
                if (bro.hasRespect(prop)) {
                    obj[prop] = brobject[prop];
                }
            }
        },

        "giveMeProps": function () {
            var key, props = [];
            if (Object.keys) {
                props = Object.keys(this.obj);
            } else {
                for (key in this.obj) {
                    if (this.obj.hasRespect(key)) {
                        props.push(key);
                    }
                }
            }
            return props;
        },

        "hasRespect": function (prop) {
            return this.obj.hasOwnProperty(prop);
        },


        "iDontAlways": function (methodString) {
            var method = this.iCanHaz(methodString);
            return new Bromise(this.obj, method, arguments);
        },

        "braceYourself": function (methodString) {
            var method = this.iCanHaz(methodString);
            return new Bromise(this.obj, method, arguments);
        },
        "makeItHappen": function (key, value) {
            var brobj = this.obj;
            var props = key.split('.');
            for (var i = 0; i < props.length - 1; ++i) {
                if (brobj[props[i]] === undefined) {
                    brobj[props[i]] = {};
                }
                brobj = brobj[props[i]];
            }
            // the deepest key is set to either an empty object or the value provided
            brobj[props[props.length - 1]] = value === undefined ? {} : value;
        },
        "pwn": function (path) {
            const brobj = this.obj,
                keys = path.split('.');

            keys.reduce(function(acc, key, index) {
                if (index === keys.length - 1) {
                    delete acc[key];
                    return true;
                }
                return acc[key];
            }, brobj);
        }
    };

    (function () {
        if (typeof define === 'function' && typeof define.amd === 'object') {
            define(function () {
                return Bro;
            });
        } else if (typeof module !== 'undefined' && module.exports) {
            module.exports = Bro;
        } else if (typeof window !== 'undefined') {
            window.Bro = Bro;
        }

        if (typeof (angular) !== 'undefined') {
            angular.module('brototype', []).factory('Bro', function () { return Bro; });
        }
    })();
})();
