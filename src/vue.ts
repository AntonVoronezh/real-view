import { ref, onMounted, onUnmounted, type Ref } from 'vue';
import { realViewEngine, type realViewOptions } from './core/engine';

export function userealView(target: Ref<HTMLElement | null>, options?: realViewOptions) {
    const isVisible = ref(false);
    let stop: () => void;

    onMounted(() => {
        if (target.value) {
            stop = realViewEngine.get().observe(target.value, (v) => isVisible.value = v, options);
        }
    });

    onUnmounted(() => stop?.());

    return isVisible;
}
