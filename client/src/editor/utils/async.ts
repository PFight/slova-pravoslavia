export type AsyncReturnType<T> = 
  T extends (...args: infer P) => infer R ? 
  (...args : P) => Promise<R> 
    : 
  never;

export type Async<T> = {
  [P in keyof T]: AsyncReturnType<T[P]>;
};