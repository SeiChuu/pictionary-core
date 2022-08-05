"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Request {
    constructor(id, method, context, options) {
        this.id = id;
        this.method = method;
        this.context = context;
        if (options) {
            this.params = options.params;
            this.timeout = options.timeout;
        }
    }
    toString() {
        return JSON.stringify({
            id: this.id,
            method: this.method,
            context: this.context,
            params: this.params,
            timeout: this.timeout,
        });
    }
}
exports.default = Request;
