"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Emitter_1 = __importDefault(require("./Emitter"));
const Request_1 = __importDefault(require("./Request"));
const Response_1 = __importDefault(require("./Response"));
class Connection extends Emitter_1.default {
    constructor(socket) {
        super();
        this.requestId = 1;
        this.pool = new Map();
        this.socket = socket;
        this.socket.addEventListener('message', (e) => this.handleMessage(e));
    }
    /**
     * Wait until the connection is opened.
     */
    open() {
        if (this.socket.readyState === 1 /* SocketState.OPEN */) {
            return Promise.resolve();
        }
        return new Promise((resolve) => {
            this.socket.addEventListener('open', resolve, { once: true });
        });
    }
    /**
     * Close the connection.
     */
    close() {
        if (this.socket.readyState === 3 /* SocketState.CLOSED */) {
            return Promise.resolve();
        }
        const closed = new Promise((resolve) => {
            this.socket.addEventListener('close', () => resolve(), { once: true });
        });
        this.socket.close();
        return closed;
    }
    /**
     * @return Whether the connection is open.
     */
    getReadyState() {
        return this.socket.readyState;
    }
    /**
     * Sets maximum time limit for each request.
     * @param timeout
     */
    setRequestTimeout(timeout) {
        this.requestTimeout = timeout;
    }
    /**
     * @returns Maximum time limit for a request.
     */
    getRequestTimeout() {
        return this.requestTimeout;
    }
    /**
     * Get something from the user.
     * @param context
     * @param params
     */
    get(context, params) {
        return this.request(1 /* Method.Get */, context, params);
    }
    /**
     * Get meta information of something from the user.
     * @param context
     * @param params
     */
    head(context, params) {
        return this.request(2 /* Method.Head */, context, params);
    }
    /**
     * Post changes to the user.
     * @param context
     * @param params
     */
    post(context, params) {
        return this.request(3 /* Method.Post */, context, params);
    }
    /**
     * Put something on the user.
     * @param context
     * @param params
     */
    put(context, params) {
        return this.request(4 /* Method.Put */, context, params);
    }
    /**
     * Patch something on the user.
     * @param context
     * @param params
     */
    patch(context, params) {
        return this.request(5 /* Method.Patch */, context, params);
    }
    /**
     * Delete something from the user.
     * @param context
     * @param params
     */
    delete(context, params) {
        return this.request(6 /* Method.Delete */, context, params);
    }
    /**
     * Send a request
     * @param method
     * @param context
     * @param params
     */
    request(method, context, params) {
        const id = this.requestId++;
        const timeout = this.requestTimeout;
        const req = new Request_1.default(id, method, context, {
            params,
            timeout,
        });
        this.socket.send(req.toString());
        return new Promise((resolve, reject) => {
            let timer;
            this.pool.set(req.id, (res) => {
                if (timer) {
                    clearTimeout(timer);
                }
                resolve(res);
            });
            if (timeout && timeout > 0) {
                timer = setTimeout(() => {
                    this.pool.delete(req.id);
                    reject(new Error(`Time limit exceeded: ${context} is not responded in ${timeout}ms`));
                }, timeout);
            }
        });
    }
    /**
     * Send a notification.
     * @param method
     * @param context
     * @param params
     */
    notify(method, context, params) {
        const req = new Request_1.default(0, method, context, {
            params,
        });
        this.socket.send(req.toString());
    }
    /**
     * Send a response.
     * @param id
     * @param params
     */
    respond(id, params) {
        const res = new Response_1.default(id, params);
        this.socket.send(res.toString());
    }
    handleMessage(e) {
        try {
            const packet = JSON.parse(e.data);
            if (packet.context && packet.method) {
                if (packet.id) {
                    this.handleRequest(packet.id, packet.method, packet.context, packet.params);
                }
                else {
                    this.handleNotification(packet.method, packet.context, packet.params);
                }
            }
            else if (packet.id) {
                this.handleResponse(packet.id, packet.params);
            }
        }
        catch (error) {
            // Ignore
        }
    }
    async handleRequest(id, method, context, params) {
        try {
            const res = await this.emit(method, context, params);
            this.respond(id, res);
        }
        catch (error) {
            this.respond(id, {
                error: String(error),
            });
        }
    }
    handleResponse(id, params) {
        const callback = this.pool.get(id);
        if (!callback) {
            return;
        }
        this.pool.delete(id);
        setTimeout(callback, 0, params);
    }
    async handleNotification(method, context, params) {
        try {
            await this.emit(method, context, params);
        }
        catch (error) {
            // Ignore
        }
    }
}
exports.default = Connection;
