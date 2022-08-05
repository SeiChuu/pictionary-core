"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const methodMap = new Map([
    [1 /* Method.Get */, 'get'],
    [3 /* Method.Post */, 'post'],
    [2 /* Method.Head */, 'head'],
    [4 /* Method.Put */, 'put'],
    [5 /* Method.Patch */, 'patch'],
    [6 /* Method.Delete */, 'delete'],
]);
class Emitter {
    constructor() {
        this.listeners = new Map();
    }
    /**
     * Register a context listener.
     * @param listener
     */
    on(listener) {
        this.listeners.set(listener.context, listener);
    }
    /**
     * Unregister a context listener.
     * @param context
     */
    off(context) {
        this.listeners.delete(context);
    }
    /**
     * @return All existing listeners.
     */
    getListeners() {
        return [...this.listeners.values()];
    }
    async emit(method, context, params) {
        const listener = this.listeners.get(context);
        if (!listener) {
            throw new Error('No such a context');
        }
        const func = methodMap.get(method);
        if (!func) {
            throw new Error('Invalid method');
        }
        const callback = Reflect.get(listener, func);
        if (typeof callback !== 'function') {
            throw new Error('Method not supported');
        }
        return callback.call(listener, params);
    }
}
exports.default = Emitter;
