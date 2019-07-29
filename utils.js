// --------------
// is-*
// --------------
const toString = {}.toString;
const isType = (value, type) => toString.call(value) === '[object ' + type + ']';
const isUndefined = function(value) {
  return value === undefined;
}
const isNull = function(value) {
  return value === null;
}
const isObject = function(value) {
  const type = typeof value;
  return value !== null && (type === 'object' || type === 'function');
}
const isObjectLike = function(value) {
  return typeof value === 'object' && value !== null;
}
const isFunction = function(value) {
  return isType(value, 'Function');
}
const isStream = function(value) {
  return isObjectLike(value) && isFunction(value.pipe);
}
const isPromise = function(value) {
  return value instanceof Promise ||
    (isObject(value) && isFunction(value.then) && isFunction(value.catch));
}
var kCustomPromisifiedSymbol = typeof Symbol !== 'undefined' ? Symbol('util.promisify.custom') : undefined;
const promisify = function(original) {
  if (typeof original !== 'function')
    throw new TypeError('The "original" argument must be of type Function');

  if (kCustomPromisifiedSymbol && original[kCustomPromisifiedSymbol]) {
    var fn = original[kCustomPromisifiedSymbol];
    if (typeof fn !== 'function') {
      throw new TypeError('The "util.promisify.custom" argument must be of type Function');
    }
    Object.defineProperty(fn, kCustomPromisifiedSymbol, {
      value: fn, enumerable: false, writable: false, configurable: true
    });
    return fn;
  }

  function fn() {
    var promiseResolve, promiseReject;
    var promise = new Promise(function (resolve, reject) {
      promiseResolve = resolve;
      promiseReject = reject;
    });

    var args = [];
    for (var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }
    args.push(function (err, value) {
      if (err) {
        promiseReject(err);
      } else {
        promiseResolve(value);
      }
    });

    try {
      original.apply(this, args);
    } catch (err) {
      promiseReject(err);
    }

    return promise;
  }

  Object.setPrototypeOf(fn, Object.getPrototypeOf(original));

  if (kCustomPromisifiedSymbol) Object.defineProperty(fn, kCustomPromisifiedSymbol, {
    value: fn, enumerable: false, writable: false, configurable: true
  });
  return Object.defineProperties(
    fn,
    getOwnPropertyDescriptors(original)
  );
}

module.exports = {
  isUndefined,
  isNull,
  isObject,
  isObjectLike,
  isFunction,
  isStream,
  isPromise,
  promisify,
};