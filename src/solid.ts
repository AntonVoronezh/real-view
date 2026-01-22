import { createSignal, onCleanup, onMount } from 'solid-js';
import { realViewEngine, type realViewOptions } from './core/engine';

export function createrealView(el: () => HTMLElement | null, options?: realViewOptions) {
    const [isVisible, setIsVisible] = createSignal(false);

    onMount(() => {
        const node = el();
        if (node) {
            const stop = realViewEngine.get().observe(node, setIsVisible, options);
            onCleanup(stop);
        }
    });

    return isVisible;
}
