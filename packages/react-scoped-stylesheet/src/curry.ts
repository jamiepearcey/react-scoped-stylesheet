// Helper type that transforms a function type into its curried version.
type Curry<F extends (...args: any[]) => any> =
  F extends (...args: infer P) => infer R
    ? Curried<P, R>
    : never;

type Curried<Args extends any[], R> =
  // If there’s at least one argument, return a function that takes the first argument
  // and then returns a curried function for the rest.
  Args extends [infer A, ...infer Rest]
    ? (arg: A) => Curried<Rest, R>
    : R;

// The curry function
export function curry<F extends (...args: any[]) => any>(fn: F): Curry<F> {
  function curried(...args: any[]): any {
    // If enough arguments have been supplied, call the original function.
    if (args.length >= fn.length) {
      return fn(...args);
    }
    // Otherwise, return a new function that accepts additional arguments.
    return (...next: any[]) => curried(...args, ...next);
  }
  return curried as Curry<F>;
}