import ContextListener from './ContextListener';
import Method from './Method';
export default class Emitter {
    private listeners;
    /**
     * Register a context listener.
     * @param listener
     */
    on(listener: ContextListener): void;
    /**
     * Unregister a context listener.
     * @param context
     */
    off(context: number): void;
    /**
     * @return All existing listeners.
     */
    getListeners(): ContextListener[];
    emit(method: Method, context: number, params?: unknown): Promise<unknown>;
}
