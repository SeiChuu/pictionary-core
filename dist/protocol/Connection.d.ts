import Emitter from './Emitter';
import Method from './Method';
import Socket from './Socket';
export default class Connection extends Emitter {
    private socket;
    private requestTimeout?;
    private requestId;
    private pool;
    constructor(socket: Socket);
    /**
     * Wait until the connection is opened.
     */
    open(): Promise<void>;
    /**
     * Close the connection.
     */
    close(): Promise<void>;
    /**
     * @return Whether the connection is open.
     */
    getReadyState(): number;
    /**
     * Sets maximum time limit for each request.
     * @param timeout
     */
    setRequestTimeout(timeout?: number): void;
    /**
     * @returns Maximum time limit for a request.
     */
    getRequestTimeout(): number | undefined;
    /**
     * Get something from the user.
     * @param context
     * @param params
     */
    get(context: number, params?: unknown): Promise<unknown>;
    /**
     * Get meta information of something from the user.
     * @param context
     * @param params
     */
    head(context: number, params?: unknown): Promise<unknown>;
    /**
     * Post changes to the user.
     * @param context
     * @param params
     */
    post(context: number, params?: unknown): Promise<unknown>;
    /**
     * Put something on the user.
     * @param context
     * @param params
     */
    put(context: number, params?: unknown): Promise<unknown>;
    /**
     * Patch something on the user.
     * @param context
     * @param params
     */
    patch(context: number, params?: unknown): Promise<unknown>;
    /**
     * Delete something from the user.
     * @param context
     * @param params
     */
    delete(context: number, params?: unknown): Promise<unknown>;
    /**
     * Send a request
     * @param method
     * @param context
     * @param params
     */
    request(method: Method, context: number, params?: unknown): Promise<unknown>;
    /**
     * Send a notification.
     * @param method
     * @param context
     * @param params
     */
    notify(method: Method, context: number, params?: unknown): void;
    /**
     * Send a response.
     * @param id
     * @param params
     */
    private respond;
    private handleMessage;
    private handleRequest;
    private handleResponse;
    private handleNotification;
}
