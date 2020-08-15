import { EventEmitter, ElementRef, Renderer2, ViewContainerRef, Directive, Output, ContentChild, TemplateRef, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

var DeferredLoader = /** @class */ (function () {
    function DeferredLoader(el, renderer, viewContainer) {
        this.el = el;
        this.renderer = renderer;
        this.viewContainer = viewContainer;
        this.onLoad = new EventEmitter();
    }
    DeferredLoader.prototype.ngAfterViewInit = function () {
        var _this = this;
        if (this.shouldLoad()) {
            this.load();
        }
        if (!this.isLoaded()) {
            this.documentScrollListener = this.renderer.listen('window', 'scroll', function () {
                if (_this.shouldLoad()) {
                    _this.load();
                    _this.documentScrollListener();
                    _this.documentScrollListener = null;
                }
            });
        }
    };
    DeferredLoader.prototype.shouldLoad = function () {
        if (this.isLoaded()) {
            return false;
        }
        else {
            var rect = this.el.nativeElement.getBoundingClientRect();
            var docElement = document.documentElement;
            var winHeight = docElement.clientHeight;
            return (winHeight >= rect.top);
        }
    };
    DeferredLoader.prototype.load = function () {
        this.view = this.viewContainer.createEmbeddedView(this.template);
        this.onLoad.emit();
    };
    DeferredLoader.prototype.isLoaded = function () {
        return this.view != null;
    };
    DeferredLoader.prototype.ngOnDestroy = function () {
        this.view = null;
        if (this.documentScrollListener) {
            this.documentScrollListener();
        }
    };
    DeferredLoader.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 },
        { type: ViewContainerRef }
    ]; };
    DeferredLoader.decorators = [
        { type: Directive, args: [{
                    selector: '[pDefer]'
                },] }
    ];
    DeferredLoader.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 },
        { type: ViewContainerRef }
    ]; };
    DeferredLoader.propDecorators = {
        onLoad: [{ type: Output }],
        template: [{ type: ContentChild, args: [TemplateRef,] }]
    };
    return DeferredLoader;
}());
var DeferModule = /** @class */ (function () {
    function DeferModule() {
    }
    DeferModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule],
                    exports: [DeferredLoader],
                    declarations: [DeferredLoader]
                },] }
    ];
    return DeferModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { DeferModule, DeferredLoader };
//# sourceMappingURL=primeng-defer.js.map
