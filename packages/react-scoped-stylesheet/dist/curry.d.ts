type Curry<F extends (...args: any[]) => any> = F extends (...args: infer P) => infer R ? Curried<P, R> : never;
type Curried<Args extends any[], R> = Args extends [infer A, ...infer Rest] ? (arg: A) => Curried<Rest, R> : R;
export declare function curry<F extends (...args: any[]) => any>(fn: F): Curry<F>;
export {};
