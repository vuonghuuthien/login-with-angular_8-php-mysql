import { NgModule, Directive, ElementRef, AfterViewInit, OnDestroy, TemplateRef, EmbeddedViewRef, ViewContainerRef, Renderer2, EventEmitter, Output, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
export class DeferredLoader {
    constructor(el, renderer, viewContainer) {
        this.el = el;
        this.renderer = renderer;
        this.viewContainer = viewContainer;
        this.onLoad = new EventEmitter();
    }
    ngAfterViewInit() {
        if (this.shouldLoad()) {
            this.load();
        }
        if (!this.isLoaded()) {
            this.documentScrollListener = this.renderer.listen('window', 'scroll', () => {
                if (this.shouldLoad()) {
                    this.load();
                    this.documentScrollListener();
                    this.documentScrollListener = null;
                }
            });
        }
    }
    shouldLoad() {
        if (this.isLoaded()) {
            return false;
        }
        else {
            let rect = this.el.nativeElement.getBoundingClientRect();
            let docElement = document.documentElement;
            let winHeight = docElement.clientHeight;
            return (winHeight >= rect.top);
        }
    }
    load() {
        this.view = this.viewContainer.createEmbeddedView(this.template);
        this.onLoad.emit();
    }
    isLoaded() {
        return this.view != null;
    }
    ngOnDestroy() {
        this.view = null;
        if (this.documentScrollListener) {
            this.documentScrollListener();
        }
    }
}
DeferredLoader.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: ViewContainerRef }
];
DeferredLoader.decorators = [
    { type: Directive, args: [{
                selector: '[pDefer]'
            },] }
];
DeferredLoader.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: ViewContainerRef }
];
DeferredLoader.propDecorators = {
    onLoad: [{ type: Output }],
    template: [{ type: ContentChild, args: [TemplateRef,] }]
};
export class DeferModule {
}
DeferModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule],
                exports: [DeferredLoader],
                declarations: [DeferredLoader]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmZXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9wcmltZW5nL2RlZmVyLyIsInNvdXJjZXMiOlsiZGVmZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFFBQVEsRUFBQyxTQUFTLEVBQUMsVUFBVSxFQUFDLGFBQWEsRUFBQyxTQUFTLEVBQUMsV0FBVyxFQUFDLGVBQWUsRUFDakYsZ0JBQWdCLEVBQUMsU0FBUyxFQUFDLFlBQVksRUFBQyxNQUFNLEVBQUMsWUFBWSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzFGLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUs3QyxNQUFNLE9BQU8sY0FBYztJQVV2QixZQUFtQixFQUFjLEVBQVMsUUFBbUIsRUFBUyxhQUErQjtRQUFsRixPQUFFLEdBQUYsRUFBRSxDQUFZO1FBQVMsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQUFTLGtCQUFhLEdBQWIsYUFBYSxDQUFrQjtRQVIzRixXQUFNLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7SUFRK0MsQ0FBQztJQUV6RyxlQUFlO1FBQ1gsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFLEVBQUU7WUFDbkIsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ2Y7UUFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFFO1lBQ2xCLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRTtnQkFDeEUsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFLEVBQUU7b0JBQ25CLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDWixJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztvQkFDOUIsSUFBSSxDQUFDLHNCQUFzQixHQUFHLElBQUksQ0FBQztpQkFDdEM7WUFDTCxDQUFDLENBQUMsQ0FBQztTQUNOO0lBQ0wsQ0FBQztJQUVELFVBQVU7UUFDTixJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRTtZQUNqQixPQUFPLEtBQUssQ0FBQztTQUNoQjthQUNJO1lBQ0QsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMscUJBQXFCLEVBQUUsQ0FBQztZQUN6RCxJQUFJLFVBQVUsR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDO1lBQzFDLElBQUksU0FBUyxHQUFHLFVBQVUsQ0FBQyxZQUFZLENBQUM7WUFFeEMsT0FBTyxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDbEM7SUFDTCxDQUFDO0lBRUQsSUFBSTtRQUNBLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDakUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUN2QixDQUFDO0lBRUQsUUFBUTtRQUNKLE9BQU8sSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUM7SUFDN0IsQ0FBQztJQUVELFdBQVc7UUFDUCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUVqQixJQUFJLElBQUksQ0FBQyxzQkFBc0IsRUFBRTtZQUM3QixJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztTQUNqQztJQUNMLENBQUM7OztZQTlDc0IsVUFBVTtZQUFtQixTQUFTO1lBQXdCLGdCQUFnQjs7O1lBYnhHLFNBQVMsU0FBQztnQkFDUCxRQUFRLEVBQUUsVUFBVTthQUN2Qjs7O1lBTjBCLFVBQVU7WUFDWixTQUFTO1lBQTFCLGdCQUFnQjs7O3FCQVFuQixNQUFNO3VCQUVOLFlBQVksU0FBQyxXQUFXOztBQTREN0IsTUFBTSxPQUFPLFdBQVc7OztZQUx2QixRQUFRLFNBQUM7Z0JBQ04sT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDO2dCQUN2QixPQUFPLEVBQUUsQ0FBQyxjQUFjLENBQUM7Z0JBQ3pCLFlBQVksRUFBRSxDQUFDLGNBQWMsQ0FBQzthQUNqQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7TmdNb2R1bGUsRGlyZWN0aXZlLEVsZW1lbnRSZWYsQWZ0ZXJWaWV3SW5pdCxPbkRlc3Ryb3ksVGVtcGxhdGVSZWYsRW1iZWRkZWRWaWV3UmVmLFxuICAgICAgICBWaWV3Q29udGFpbmVyUmVmLFJlbmRlcmVyMixFdmVudEVtaXR0ZXIsT3V0cHV0LENvbnRlbnRDaGlsZH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuQERpcmVjdGl2ZSh7XG4gICAgc2VsZWN0b3I6ICdbcERlZmVyXSdcbn0pXG5leHBvcnQgY2xhc3MgRGVmZXJyZWRMb2FkZXIgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LE9uRGVzdHJveSB7XG4gICAgICAgIFxuICAgIEBPdXRwdXQoKSBvbkxvYWQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgIFxuICAgIEBDb250ZW50Q2hpbGQoVGVtcGxhdGVSZWYpIHRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuICAgICAgICBcbiAgICBkb2N1bWVudFNjcm9sbExpc3RlbmVyOiBGdW5jdGlvbjtcbiAgICBcbiAgICB2aWV3OiBFbWJlZGRlZFZpZXdSZWY8YW55PjtcbiAgICAgICAgICAgIFxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBlbDogRWxlbWVudFJlZiwgcHVibGljIHJlbmRlcmVyOiBSZW5kZXJlcjIsIHB1YmxpYyB2aWV3Q29udGFpbmVyOiBWaWV3Q29udGFpbmVyUmVmKSB7fVxuICAgIFxuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAgICAgaWYgKHRoaXMuc2hvdWxkTG9hZCgpKSB7XG4gICAgICAgICAgICB0aGlzLmxvYWQoKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYgKCF0aGlzLmlzTG9hZGVkKCkpIHtcbiAgICAgICAgICAgIHRoaXMuZG9jdW1lbnRTY3JvbGxMaXN0ZW5lciA9IHRoaXMucmVuZGVyZXIubGlzdGVuKCd3aW5kb3cnLCAnc2Nyb2xsJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnNob3VsZExvYWQoKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWQoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kb2N1bWVudFNjcm9sbExpc3RlbmVyKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZG9jdW1lbnRTY3JvbGxMaXN0ZW5lciA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgc2hvdWxkTG9hZCgpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHRoaXMuaXNMb2FkZWQoKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbGV0IHJlY3QgPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICBsZXQgZG9jRWxlbWVudCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgICAgICAgICAgIGxldCB3aW5IZWlnaHQgPSBkb2NFbGVtZW50LmNsaWVudEhlaWdodDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuICh3aW5IZWlnaHQgPj0gcmVjdC50b3ApO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIGxvYWQoKTogdm9pZCB7IFxuICAgICAgICB0aGlzLnZpZXcgPSB0aGlzLnZpZXdDb250YWluZXIuY3JlYXRlRW1iZWRkZWRWaWV3KHRoaXMudGVtcGxhdGUpO1xuICAgICAgICB0aGlzLm9uTG9hZC5lbWl0KCk7XG4gICAgfVxuICAgIFxuICAgIGlzTG9hZGVkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy52aWV3ICE9IG51bGw7XG4gICAgfVxuICAgICAgICAgICAgXG4gICAgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMudmlldyA9IG51bGw7XG4gICAgICAgIFxuICAgICAgICBpZiAodGhpcy5kb2N1bWVudFNjcm9sbExpc3RlbmVyKSB7XG4gICAgICAgICAgICB0aGlzLmRvY3VtZW50U2Nyb2xsTGlzdGVuZXIoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuQE5nTW9kdWxlKHtcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlXSxcbiAgICBleHBvcnRzOiBbRGVmZXJyZWRMb2FkZXJdLFxuICAgIGRlY2xhcmF0aW9uczogW0RlZmVycmVkTG9hZGVyXVxufSlcbmV4cG9ydCBjbGFzcyBEZWZlck1vZHVsZSB7IH0iXX0=