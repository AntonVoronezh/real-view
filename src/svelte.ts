import { realViewEngine, type realViewOptions } from './core/engine';

type Params = {
    onVisible: (v: boolean) => void;
    options?: realViewOptions;
};

export function realView(node: HTMLElement, params: Params) {
    const stop = realViewEngine.get().observe(node, params.onVisible, params.options);

    return {
        destroy() {
            stop();
        }
    };
}
