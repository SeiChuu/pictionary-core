import Method from './Method';
interface RequestOptions {
    params?: unknown;
    timeout?: number;
}
export default class Request {
    readonly id: number;
    readonly method: Method;
    readonly context: number;
    readonly params?: unknown;
    readonly timeout?: number;
    constructor(id: number, method: Method, context: number, options?: RequestOptions);
    toString(): string;
}
export {};
