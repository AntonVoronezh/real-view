import { isBrowser } from './utils';

export type realViewOptions = {
    threshold?: number;
    pollInterval?: number;
    trackTab?: boolean;
};

type VisibilityCallback = (isVisible: boolean) => void;

interface Watcher {
    el: Element;
    cb: VisibilityCallback;
    opts: Required<realViewOptions>;
    state: {
        inViewport: boolean;
        isOccluded: boolean;
        timer: number | null;
    };
}

export class realViewEngine {
    private static instance: realViewEngine;
    private observer: IntersectionObserver | null = null;
    private watchers = new Map<Element, Watcher>();

    static get() {
        if (!this.instance) this.instance = new realViewEngine();
        return this.instance;
    }

    private constructor() {
        if (!isBrowser()) return;
        this.initObserver();
        this.initTabListener();
    }

    private initObserver() {
        this.observer = new IntersectionObserver(this.handleIntersect.bind(this), {
            threshold: 0
        });
    }

    private initTabListener() {
        document.addEventListener('visibilitychange', () => {
            const isHidden = document.hidden;
            this.watchers.forEach(w => {
                if (w.opts.trackTab && isHidden) {
                    this.notify(w, false);
                } else if (w.state.inViewport && !isHidden) {
                    this.checkOcclusion(w);
                }
            });
        });
    }

    private handleIntersect(entries: IntersectionObserverEntry[]) {
        entries.forEach(entry => {
            const watcher = this.watchers.get(entry.target);
            if (!watcher) return;

            watcher.state.inViewport = entry.isIntersecting;

            if (entry.isIntersecting) {
                this.startPolling(watcher);
            } else {
                this.stopPolling(watcher);
                this.notify(watcher, false);
            }
        });
    }

    private checkOcclusion(w: Watcher) {
        if (w.opts.trackTab && document.hidden) return this.notify(w, false);

        const rect = w.el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return this.notify(w, false);

        const style = window.getComputedStyle(w.el);
        if (style.opacity === '0' || style.visibility === 'hidden') return this.notify(w, false);

        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        const topEl = document.elementFromPoint(x, y);

        const isVisible = topEl ? (w.el.contains(topEl) || w.el === topEl) : false;

        this.notify(w, isVisible);
    }

    private startPolling(w: Watcher) {
        if (w.state.timer) return;

        const tick = () => {
            if ('requestIdleCallback' in window) {
                window.requestIdleCallback(() => this.checkOcclusion(w));
            } else {
                this.checkOcclusion(w);
            }
        };

        tick();
        w.state.timer = window.setInterval(tick, w.opts.pollInterval);
    }

    private stopPolling(w: Watcher) {
        if (w.state.timer) {
            clearInterval(w.state.timer);
            w.state.timer = null;
        }
    }

    private notify(w: Watcher, isVisible: boolean) {
        if (w.state.isOccluded !== !isVisible) {
            w.state.isOccluded = !isVisible;
            w.cb(isVisible);
        }
    }

    public observe(el: Element, cb: VisibilityCallback, options: realViewOptions = {}) {
        if (!isBrowser()) return () => {};

        const opts = {
            threshold: 0,
            pollInterval: 1000,
            trackTab: true,
            ...options
        };

        this.watchers.set(el, {
            el, cb, opts,
            state: { inViewport: false, isOccluded: false, timer: null }
        });

        this.observer?.observe(el);

        return () => {
            this.stopPolling(this.watchers.get(el)!);
            this.observer?.unobserve(el);
            this.watchers.delete(el);
        };
    }
}
