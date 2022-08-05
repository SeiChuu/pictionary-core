export interface MessageEvent {
    data: string;
}
export interface CloseEvent {
    reason: string;
}
interface EventListenerOptions {
    once?: boolean;
}
interface Socket {
    close(): void;
    send(message: string): void;
    addEventListener(event: 'open', cb: () => void, options?: EventListenerOptions): void;
    addEventListener(event: 'message', cb: (e: MessageEvent) => void, options?: EventListenerOptions): void;
    addEventListener(event: 'close', cb: (e: CloseEvent) => void, options?: EventListenerOptions): void;
    readyState: number;
}
export declare const enum SocketState {
    CONNECTING = 0,
    OPEN = 1,
    CLOSING = 2,
    CLOSED = 3
}
export default Socket;
