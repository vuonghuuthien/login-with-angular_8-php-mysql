import { EventEmitter, ElementRef, Renderer2, ChangeDetectorRef, NgZone, Component, ChangeDetectionStrategy, ViewEncapsulation, Input, Output, ContentChildren, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomHandler } from 'primeng/dom';
import { PrimeTemplate } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';
import { trigger, state, style, transition, animate } from '@angular/animations';

var OverlayPanel = /** @class */ (function () {
    function OverlayPanel(el, renderer, cd, zone) {
        this.el = el;
        this.renderer = renderer;
        this.cd = cd;
        this.zone = zone;
        this.dismissable = true;
        this.autoZIndex = true;
        this.baseZIndex = 0;
        this.focusOnShow = true;
        this.showTransitionOptions = '.12s cubic-bezier(0, 0, 0.2, 1)';
        this.hideTransitionOptions = '.1s linear';
        this.onShow = new EventEmitter();
        this.onHide = new EventEmitter();
        this.overlayVisible = false;
        this.render = false;
        this.isContainerClicked = true;
    }
    OverlayPanel.prototype.ngAfterContentInit = function () {
        var _this = this;
        this.templates.forEach(function (item) {
            switch (item.getType()) {
                case 'content':
                    _this.contentTemplate = item.template;
                    break;
                default:
                    _this.contentTemplate = item.template;
                    break;
            }
            _this.cd.markForCheck();
        });
    };
    OverlayPanel.prototype.onContainerClick = function () {
        this.isContainerClicked = true;
    };
    OverlayPanel.prototype.bindDocumentClickListener = function () {
        var _this = this;
        if (!this.documentClickListener && this.dismissable) {
            this.zone.runOutsideAngular(function () {
                var documentEvent = DomHandler.isIOS() ? 'touchstart' : 'click';
                _this.documentClickListener = _this.renderer.listen('document', documentEvent, function (event) {
                    if (!_this.container.contains(event.target) && _this.target !== event.target && !_this.target.contains(event.target) && !_this.isContainerClicked) {
                        _this.zone.run(function () {
                            _this.hide();
                        });
                    }
                    _this.isContainerClicked = false;
                    _this.cd.markForCheck();
                });
            });
        }
    };
    OverlayPanel.prototype.unbindDocumentClickListener = function () {
        if (this.documentClickListener) {
            this.documentClickListener();
            this.documentClickListener = null;
        }
    };
    OverlayPanel.prototype.toggle = function (event, target) {
        var _this = this;
        if (this.overlayVisible) {
            if (this.hasTargetChanged(event, target)) {
                this.destroyCallback = function () {
                    _this.show(null, (target || event.currentTarget || event.target));
                };
            }
            this.hide();
        }
        else {
            this.show(event, target);
        }
    };
    OverlayPanel.prototype.show = function (event, target) {
        this.target = target || event.currentTarget || event.target;
        this.overlayVisible = true;
        this.render = true;
        this.cd.markForCheck();
    };
    OverlayPanel.prototype.hasTargetChanged = function (event, target) {
        return this.target != null && this.target !== (target || event.currentTarget || event.target);
    };
    OverlayPanel.prototype.appendContainer = function () {
        if (this.appendTo) {
            if (this.appendTo === 'body')
                document.body.appendChild(this.container);
            else
                DomHandler.appendChild(this.container, this.appendTo);
        }
    };
    OverlayPanel.prototype.restoreAppend = function () {
        if (this.container && this.appendTo) {
            this.el.nativeElement.appendChild(this.container);
        }
    };
    OverlayPanel.prototype.align = function () {
        if (this.autoZIndex) {
            this.container.style.zIndex = String(this.baseZIndex + (++DomHandler.zindex));
        }
        DomHandler.absolutePosition(this.container, this.target);
        if (DomHandler.getOffset(this.container).top < DomHandler.getOffset(this.target).top) {
            DomHandler.addClass(this.container, 'p-overlaypanel-flipped');
        }
        if (Math.floor(DomHandler.getOffset(this.container).left) < Math.floor(DomHandler.getOffset(this.target).left) &&
            DomHandler.getOffset(this.container).left > 0) {
            DomHandler.addClass(this.container, 'p-overlaypanel-shifted');
        }
    };
    OverlayPanel.prototype.onAnimationStart = function (event) {
        if (event.toState === 'open') {
            this.container = event.element;
            this.onShow.emit(null);
            this.appendContainer();
            this.align();
            this.bindDocumentClickListener();
            this.bindDocumentResizeListener();
            if (this.focusOnShow) {
                this.focus();
            }
        }
    };
    OverlayPanel.prototype.onAnimationEnd = function (event) {
        switch (event.toState) {
            case 'void':
                if (this.destroyCallback) {
                    this.destroyCallback();
                    this.destroyCallback = null;
                }
                break;
            case 'close':
                this.onContainerDestroy();
                this.onHide.emit({});
                this.render = false;
                break;
        }
    };
    OverlayPanel.prototype.focus = function () {
        var focusable = DomHandler.findSingle(this.container, '[autofocus]');
        if (focusable) {
            this.zone.runOutsideAngular(function () {
                setTimeout(function () { return focusable.focus(); }, 5);
            });
        }
    };
    OverlayPanel.prototype.hide = function () {
        this.overlayVisible = false;
        this.cd.markForCheck();
    };
    OverlayPanel.prototype.onCloseClick = function (event) {
        this.hide();
        event.preventDefault();
    };
    OverlayPanel.prototype.onWindowResize = function (event) {
        this.hide();
    };
    OverlayPanel.prototype.bindDocumentResizeListener = function () {
        this.documentResizeListener = this.onWindowResize.bind(this);
        window.addEventListener('resize', this.documentResizeListener);
    };
    OverlayPanel.prototype.unbindDocumentResizeListener = function () {
        if (this.documentResizeListener) {
            window.removeEventListener('resize', this.documentResizeListener);
            this.documentResizeListener = null;
        }
    };
    OverlayPanel.prototype.onContainerDestroy = function () {
        this.target = null;
        this.unbindDocumentClickListener();
        this.unbindDocumentResizeListener();
    };
    OverlayPanel.prototype.ngOnDestroy = function () {
        this.target = null;
        this.destroyCallback = null;
        if (this.container) {
            this.restoreAppend();
            this.onContainerDestroy();
        }
    };
    OverlayPanel.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 },
        { type: ChangeDetectorRef },
        { type: NgZone }
    ]; };
    OverlayPanel.decorators = [
        { type: Component, args: [{
                    selector: 'p-overlayPanel',
                    template: "\n        <div *ngIf=\"render\" [ngClass]=\"'p-overlaypanel p-component'\" [ngStyle]=\"style\" [class]=\"styleClass\" (click)=\"onContainerClick()\"\n            [@animation]=\"{value: (overlayVisible ? 'open': 'close'), params: {showTransitionParams: showTransitionOptions, hideTransitionParams: hideTransitionOptions}}\" \n                (@animation.start)=\"onAnimationStart($event)\" (@animation.done)=\"onAnimationEnd($event)\">\n            <div class=\"p-overlaypanel-content\">\n                <ng-content></ng-content>\n                <ng-container *ngTemplateOutlet=\"contentTemplate\"></ng-container>\n            </div>\n            <button *ngIf=\"showCloseIcon\" type=\"button\" class=\"p-overlaypanel-close p-link\" (click)=\"onCloseClick($event)\" (keydown.enter)=\"hide()\" [attr.aria-label]=\"ariaCloseLabel\" pRipple>\n                <span class=\"p-overlaypanel-close-icon pi pi-times\"></span>\n            </button>\n        </div>\n    ",
                    animations: [
                        trigger('animation', [
                            state('void', style({
                                transform: 'scaleY(0.8)',
                                opacity: 0
                            })),
                            state('close', style({
                                opacity: 0
                            })),
                            state('open', style({
                                transform: 'translateY(0)',
                                opacity: 1
                            })),
                            transition('void => open', animate('{{showTransitionParams}}')),
                            transition('open => close', animate('{{hideTransitionParams}}')),
                        ])
                    ],
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    styles: [".p-overlaypanel{position:absolute;margin-top:10px}.p-overlaypanel-flipped{margin-top:0;margin-bottom:10px}.p-overlaypanel-close{display:-ms-flexbox;display:flex;-ms-flex-pack:center;justify-content:center;-ms-flex-align:center;align-items:center;overflow:hidden;position:relative}.p-overlaypanel:after,.p-overlaypanel:before{bottom:100%;left:1.25rem;content:\" \";height:0;width:0;position:absolute;pointer-events:none}.p-overlaypanel:after{border-width:8px;margin-left:-8px}.p-overlaypanel:before{border-width:10px;margin-left:-10px}.p-overlaypanel-flipped:after,.p-overlaypanel-flipped:before{bottom:auto;top:100%}.p-overlaypanel.p-overlaypanel-flipped:after,.p-overlaypanel.p-overlaypanel-flipped:before{border-bottom-color:transparent}"]
                },] }
    ];
    OverlayPanel.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 },
        { type: ChangeDetectorRef },
        { type: NgZone }
    ]; };
    OverlayPanel.propDecorators = {
        dismissable: [{ type: Input }],
        showCloseIcon: [{ type: Input }],
        style: [{ type: Input }],
        styleClass: [{ type: Input }],
        appendTo: [{ type: Input }],
        autoZIndex: [{ type: Input }],
        ariaCloseLabel: [{ type: Input }],
        baseZIndex: [{ type: Input }],
        focusOnShow: [{ type: Input }],
        showTransitionOptions: [{ type: Input }],
        hideTransitionOptions: [{ type: Input }],
        onShow: [{ type: Output }],
        onHide: [{ type: Output }],
        templates: [{ type: ContentChildren, args: [PrimeTemplate,] }]
    };
    return OverlayPanel;
}());
var OverlayPanelModule = /** @class */ (function () {
    function OverlayPanelModule() {
    }
    OverlayPanelModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule, RippleModule],
                    exports: [OverlayPanel],
                    declarations: [OverlayPanel]
                },] }
    ];
    return OverlayPanelModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { OverlayPanel, OverlayPanelModule };
//# sourceMappingURL=primeng-overlaypanel.js.map
