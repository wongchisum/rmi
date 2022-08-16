export type AdaptorConfig<T,R> = {
    result?:T,
    success?:boolean,
    reason?:R,
    coverService?:(data:T,reason:R) => T | R
}

export type Service<T> = (...args:unknown[]) => Promise<T>

export type Method = "GET" | "POST" | "PUT" | "DELETE" | "OPTION"

export type InterceptorRule = {
    method?:Method,
    url:string,
    cover:any
}

export type InterceptorConfig = {
    rules:InterceptorRule[]
}
