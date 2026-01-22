import { useEffect, useRef, useState } from 'react';
import { realViewEngine, type realViewOptions } from './core/engine';

export function userealView(options?: realViewOptions) {
    const ref = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!ref.current) return;
        const cleanup = realViewEngine.get().observe(ref.current, setIsVisible, options);
        return cleanup;
    }, [options?.pollInterval, options?.trackTab]);

    return [ref, isVisible] as const;
}
