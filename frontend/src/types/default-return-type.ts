// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DefaultReturnType<R> = R extends Array<any> ? R[0] : R
