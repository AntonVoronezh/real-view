import { Directive, ElementRef, Output, EventEmitter, OnInit, OnDestroy, Input } from '@angular/core';
import { realViewEngine, type realViewOptions } from './core/engine';

@Directive({
    selector: '[realView]',
    standalone: true
})
export class realViewDirective implements OnInit, OnDestroy {
    @Input() options?: realViewOptions;
    @Output() visibleChange = new EventEmitter<boolean>();

    private stop: (() => void) | null = null;

    constructor(private el: ElementRef) {}

    ngOnInit() {
        this.stop = realViewEngine.get().observe(this.el.nativeElement, (v) => {
            this.visibleChange.emit(v);
        }, this.options);
    }

    ngOnDestroy() {
        this.stop?.();
    }
}
