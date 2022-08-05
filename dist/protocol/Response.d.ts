export default class Response {
    readonly id: number;
    readonly params?: unknown;
    constructor(id: number, params?: unknown);
    toString(): string;
}
