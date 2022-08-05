"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Response {
    constructor(id, params) {
        this.id = id;
        this.params = params;
    }
    toString() {
        return JSON.stringify({
            id: this.id,
            params: this.params,
        });
    }
}
exports.default = Response;
