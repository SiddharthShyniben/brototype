/*global describe:false, it:false, beforeEach:false */

var Bro = require('./brototype');
var assert = require('assert');

describe('Bro.doYouEven', function() {
    it('should be defined', function() {
        var a = {},
            bro = Bro(a);
        assert.notEqual(bro.doYouEven, undefined);
    });

    it('should return true for defined properties', function() {
        var a = {foo: 'bar'},
            bro = Bro(a);
        assert.equal(bro.doYouEven('foo'), true);
    });

    it('should return true for nested properties', function() {
        var a = {foo: {bar: 'baz'}},
            bro = Bro(a);
        assert.equal(bro.doYouEven('foo.bar'), true);
    });

    it('should return true for more than one nested property', function() {
        var a = {b: {c: 'foo'},d: {e: 'bar'}},
            bro = Bro(a);
        assert.equal(bro.doYouEven(['b.c', 'd.x']), false);
        assert.equal(bro.doYouEven(['b.c', 'd.e']), true);
    });

    it('should return false for undefined properties', function() {
        var a = {foo: 'bar'},
            bro = Bro(a);
        assert.equal(bro.doYouEven('bar'), false);
    });

    it('should fail gracefully if the object is not defined', function() {
        var a = undefined,
            bro = Bro(a);
        assert.equal(bro.doYouEven('foo.bar'), false);
    });

    it('should fail gracefully if the object is null', function() {
        var a = null,
            bro = Bro(a);
        assert.equal(bro.doYouEven('foo.bar'), false);
    });

    it('should fail gracefully if a traversed subproperty is null', function(){
        var a = {test: null},
            bro = Bro(a);
        assert.equal(bro.doYouEven('test.0.test'), false);
    });

    it('should pass a simple callback function', function() {
        var a = {foo: 'bar'},
            bro = Bro(a);
        bro.doYouEven('foo', function(prop) {
            assert.equal(prop, 'bar');
        });
    });

    it('should pass callback function to more than one nested property', function() {
        var a = {foo: 'bar', a: {b: 'c'}},
            bro = Bro(a);
        bro.doYouEven(['foo', 'b.c'], function(prop, key) {
            assert.equal(prop, a[key]);
        });
    });
});

describe('Bro.iCanHaz', function() {
    it('should return the value of the deep property', function() {
        var a = {b: {c: {d: 32}}},
            bro = Bro(a);
        assert.equal(bro.iCanHaz('b.c.d'), 32);
    });

    it('should return undefined for missing property', function() {
        var a = {b: 32},
            bro = Bro(a);
        assert.equal(bro.iCanHaz('b.c.d'), undefined);
    });

    it('should return an array when an array is requested', function() {
        var a = {a: 'foo', b: 'bar', c: 'fred'},
            values = Bro(a).iCanHaz(['a', 'b', 'c', 'd']);

        assert.notEqual(values.indexOf('foo'), -1);
        assert.notEqual(values.indexOf('bar'), -1);
        assert.notEqual(values.indexOf('fred'), -1);
    });
});

describe('Bro.giveMeProps', function() {
    it('should return an object\'s keys', function() {
        var a = {
                "foo": 1,
                "bar": 2
            },
            keys = Bro(a).giveMeProps();
        assert.equal(keys.length, 2);
        assert.notEqual(keys.indexOf('foo'), -1);
        assert.notEqual(keys.indexOf('bar'), -1);
    });
});

describe('Bro.comeAtMe', function() {
    it('should extend first object with second object', function() {
        var a = {
                "foo": 1,
                "bar": 2
            },b = {
                "bar": 3,
                "baz": function(){return false;}
            };
            Bro(a).comeAtMe(b);
        assert.equal(a.foo, 1);
        assert.equal(a.bar, 3);
        assert.equal(a.baz(), false);
    });
});

describe('Bro.iDontAlways', function() {
    var fired,
        success,
        param,
        context,
        obj = {
            "foo": function() {
                fired = true;
                context = this;
                return 91;
            },
            "bar": 3
        },
        fn = function(p) {
            success = true;
            param = p;
        };

    beforeEach(function() {
        fired = false;
        success = false;
        param = null;
        context = null;
    });

    it('should check that the requested method is a function', function() {
        var bro = Bro(obj);
        bro.iDontAlways('bar').butWhenIdo(fn);
        assert.equal(success, false);
        bro.iDontAlways('foo').butWhenIdo(fn);
        assert.equal(success, true);
    });

    it('should run the requested method if a function', function() {
        var bro = Bro(obj);
        bro.iDontAlways('foo').butWhenIdo(fn);
        assert.equal(fired, true);
    });

    it('should pass the method\'s return value as param to callback', function() {
        var bro = Bro(obj);
        bro.iDontAlways('foo').butWhenIdo(fn);
        assert.equal(param, 91);
    });

    it('should apply the object as its own context', function() {
        var bro = Bro(obj);
        bro.iDontAlways('foo').butWhenIdo(fn);
        assert.equal(context, obj);
    });
});

describe('Bro.braceYourself', function() {
    var success,
        error,
        obj = {
            "foo": function() {
                throw 'an error';
            }
        },
        fn = function(e) {
            success = true;
            error = e;
        };

    beforeEach(function() {
        success = null;
        error = null;
    });

    it('should fire the callback when an exception is thrown', function() {
        var bro = Bro(obj);
        bro.braceYourself('foo').hereComeTheErrors(fn);
        assert.equal(success, true);
    });

    it('should pass the error to the callback', function() {
        var bro = Bro(obj);
        bro.braceYourself('foo').hereComeTheErrors(fn);
        assert.equal(error, 'an error');
    });
});

describe('Bro.makeItHappen', function() {
    var expected,
        obj;

    beforeEach(function() {
        obj = { "foo": { "bar": {} } };
    });

    it('should add properties to object, in a nested fashion', function() {
        expected = { "foo": { "bar": {} }, "stuff": { "and": { "things": {} } } };
        var bro = Bro(obj);
        bro.makeItHappen('stuff.and.things');
        assert.deepEqual(expected, obj);
    });

    it('should add properties to object, extending deeper nested objects', function() {
        expected = { "foo": { "bar": { "stuff": { "and": { "things": {} } } } } };
        var bro = Bro(obj);
        bro.makeItHappen('foo.bar.stuff.and.things');
        assert.deepEqual(expected, obj);
    });

    it('should set existing deeply nested properties on an object', function() {
        expected = { "foo": { "bar": 'awesome' } };
        var bro = Bro(obj);
        bro.makeItHappen('foo.bar', 'awesome');
        assert.deepEqual(expected, obj);
    });

    it('should create new properties, then set them, as needed', function() {
        expected = { "foo": { "bar": { "stuff": { "and": { "things": 'super awesome' } } } } };
        var bro = Bro(obj);
        bro.makeItHappen('foo.bar.stuff.and.things', 'super awesome');
        assert.deepEqual(expected, obj);
    });
});

describe('Bro.pwn', function () {
    it("should delete a key", function () {
        const firstObj = { "this": { "is": { "cool": "not yet" } } };
        const expected = { "this": { "is": {} } };
        const bro = Bro(firstObj);
        bro.pwn('this.is.cool');
        assert.deepEqual(firstObj, expected);
    });
});

describe('brototype alias', function(){
  it('kind of basically works', function(){
    assert.notEqual(Bro.brototype.doYouEven, undefined);
  });
});
