"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.curry = curry;
// The curry function
function curry(fn) {
    function curried(...args) {
        // If enough arguments have been supplied, call the original function.
        if (args.length >= fn.length) {
            return fn(...args);
        }
        // Otherwise, return a new function that accepts additional arguments.
        return (...next) => curried(...args, ...next);
    }
    return curried;
}
