import { Inject, forwardRef, Component, ViewEncapsulation, Input, EventEmitter, ElementRef, Renderer2, ChangeDetectorRef, ChangeDetectionStrategy, ViewChild, Output, NgModule } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { DomHandler } from 'primeng/dom';
import { RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';

var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var MenuItemContent = /** @class */ (function () {
    function MenuItemContent(menu) {
        this.menu = menu;
    }
    MenuItemContent.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: Inject, args: [forwardRef(function () { return Menu; }),] }] }
    ]; };
    MenuItemContent.decorators = [
        { type: Component, args: [{
                    selector: '[pMenuItemContent]',
                    template: "\n        <a *ngIf=\"!item.routerLink\" [attr.href]=\"item.url||null\" class=\"p-menuitem-link\" [attr.tabindex]=\"item.disabled ? null : '0'\" [attr.data-automationid]=\"item.automationId\" [attr.target]=\"item.target\" [attr.title]=\"item.title\" [attr.id]=\"item.id\"\n            [ngClass]=\"{'p-disabled':item.disabled}\" (click)=\"menu.itemClick($event, item)\" role=\"menuitem\">\n            <span class=\"p-menuitem-icon\" *ngIf=\"item.icon\" [ngClass]=\"item.icon\"></span>\n            <span class=\"p-menuitem-text\">{{item.label}}</span>\n        </a>\n        <a *ngIf=\"item.routerLink\" [routerLink]=\"item.routerLink\" [attr.data-automationid]=\"item.automationId\" [queryParams]=\"item.queryParams\" [routerLinkActive]=\"'p-menuitem-link-active'\"\n            [routerLinkActiveOptions]=\"item.routerLinkActiveOptions||{exact:false}\" class=\"p-menuitem-link\" [attr.target]=\"item.target\" [attr.id]=\"item.id\" [attr.tabindex]=\"item.disabled ? null : '0'\" \n            [attr.title]=\"item.title\" [ngClass]=\"{'p-disabled':item.disabled}\" (click)=\"menu.itemClick($event, item)\" role=\"menuitem\" pRipple\n            [fragment]=\"item.fragment\" [queryParamsHandling]=\"item.queryParamsHandling\" [preserveFragment]=\"item.preserveFragment\" [skipLocationChange]=\"item.skipLocationChange\" [replaceUrl]=\"item.replaceUrl\" [state]=\"item.state\">\n            <span class=\"p-menuitem-icon\" *ngIf=\"item.icon\" [ngClass]=\"item.icon\"></span>\n            <span class=\"p-menuitem-text\">{{item.label}}</span>\n        </a>\n    ",
                    encapsulation: ViewEncapsulation.None
                },] }
    ];
    MenuItemContent.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: Inject, args: [forwardRef(function () { return Menu; }),] }] }
    ]; };
    MenuItemContent.propDecorators = {
        item: [{ type: Input, args: ["pMenuItemContent",] }]
    };
    return MenuItemContent;
}());
var Menu = /** @class */ (function () {
    function Menu(el, renderer, cd) {
        this.el = el;
        this.renderer = renderer;
        this.cd = cd;
        this.autoZIndex = true;
        this.baseZIndex = 0;
        this.showTransitionOptions = '.12s cubic-bezier(0, 0, 0.2, 1)';
        this.hideTransitionOptions = '.1s linear';
        this.onShow = new EventEmitter();
        this.onHide = new EventEmitter();
    }
    Menu.prototype.toggle = function (event) {
        if (this.visible)
            this.hide();
        else
            this.show(event);
        this.preventDocumentDefault = true;
    };
    Menu.prototype.show = function (event) {
        this.target = event.currentTarget;
        this.relativeAlign = event.relativeAlign;
        this.visible = true;
        this.preventDocumentDefault = true;
        this.cd.markForCheck();
    };
    Menu.prototype.onOverlayAnimationStart = function (event) {
        switch (event.toState) {
            case 'visible':
                if (this.popup) {
                    this.container = event.element;
                    this.moveOnTop();
                    this.onShow.emit({});
                    this.appendOverlay();
                    this.alignOverlay();
                    this.bindDocumentClickListener();
                    this.bindDocumentResizeListener();
                }
                break;
            case 'void':
                this.onOverlayHide();
                this.onHide.emit({});
                break;
        }
    };
    Menu.prototype.alignOverlay = function () {
        if (this.relativeAlign)
            DomHandler.relativePosition(this.container, this.target);
        else
            DomHandler.absolutePosition(this.container, this.target);
    };
    Menu.prototype.appendOverlay = function () {
        if (this.appendTo) {
            if (this.appendTo === 'body')
                document.body.appendChild(this.container);
            else
                DomHandler.appendChild(this.container, this.appendTo);
        }
    };
    Menu.prototype.restoreOverlayAppend = function () {
        if (this.container && this.appendTo) {
            this.el.nativeElement.appendChild(this.container);
        }
    };
    Menu.prototype.moveOnTop = function () {
        if (this.autoZIndex) {
            this.container.style.zIndex = String(this.baseZIndex + (++DomHandler.zindex));
        }
    };
    Menu.prototype.hide = function () {
        this.visible = false;
        this.relativeAlign = false;
        this.cd.markForCheck();
    };
    Menu.prototype.onWindowResize = function () {
        this.hide();
    };
    Menu.prototype.itemClick = function (event, item) {
        if (item.disabled) {
            event.preventDefault();
            return;
        }
        if (!item.url) {
            event.preventDefault();
        }
        if (item.command) {
            item.command({
                originalEvent: event,
                item: item
            });
        }
        if (this.popup) {
            this.hide();
        }
    };
    Menu.prototype.bindDocumentClickListener = function () {
        var _this = this;
        if (!this.documentClickListener) {
            this.documentClickListener = this.renderer.listen('document', 'click', function () {
                if (!_this.preventDocumentDefault) {
                    _this.hide();
                }
                _this.preventDocumentDefault = false;
            });
        }
    };
    Menu.prototype.unbindDocumentClickListener = function () {
        if (this.documentClickListener) {
            this.documentClickListener();
            this.documentClickListener = null;
        }
    };
    Menu.prototype.bindDocumentResizeListener = function () {
        this.documentResizeListener = this.onWindowResize.bind(this);
        window.addEventListener('resize', this.documentResizeListener);
    };
    Menu.prototype.unbindDocumentResizeListener = function () {
        if (this.documentResizeListener) {
            window.removeEventListener('resize', this.documentResizeListener);
            this.documentResizeListener = null;
        }
    };
    Menu.prototype.onOverlayHide = function () {
        this.unbindDocumentClickListener();
        this.unbindDocumentResizeListener();
        this.preventDocumentDefault = false;
        this.target = null;
    };
    Menu.prototype.ngOnDestroy = function () {
        if (this.popup) {
            this.restoreOverlayAppend();
            this.onOverlayHide();
        }
    };
    Menu.prototype.hasSubMenu = function () {
        var e_1, _a;
        if (this.model) {
            try {
                for (var _b = __values(this.model), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var item = _c.value;
                    if (item.items) {
                        return true;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        return false;
    };
    Menu.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 },
        { type: ChangeDetectorRef }
    ]; };
    Menu.decorators = [
        { type: Component, args: [{
                    selector: 'p-menu',
                    template: "\n        <div #container [ngClass]=\"{'p-menu p-component': true, 'p-menu-overlay': popup}\"\n            [class]=\"styleClass\" [ngStyle]=\"style\" (click)=\"preventDocumentDefault=true\" *ngIf=\"!popup || visible\"\n            [@overlayAnimation]=\"{value: 'visible', params: {showTransitionParams: showTransitionOptions, hideTransitionParams: hideTransitionOptions}}\" [@.disabled]=\"popup !== true\" (@overlayAnimation.start)=\"onOverlayAnimationStart($event)\">\n            <ul class=\"p-menu-list p-reset\">\n                <ng-template ngFor let-submenu [ngForOf]=\"model\" *ngIf=\"hasSubMenu()\">\n                    <li class=\"p-menu-separator\" *ngIf=\"submenu.separator\" [ngClass]=\"{'p-hidden': submenu.visible === false}\"></li>\n                    <li class=\"p-submenu-header\" [attr.data-automationid]=\"submenu.automationId\" *ngIf=\"!submenu.separator\" [ngClass]=\"{'p-hidden': submenu.visible === false}\">{{submenu.label}}</li>\n                    <ng-template ngFor let-item [ngForOf]=\"submenu.items\">\n                        <li class=\"p-menu-separator\" *ngIf=\"item.separator\" [ngClass]=\"{'p-hidden': (item.visible === false ||\u00A0submenu.visible === false)}\"></li>\n                        <li class=\"p-menuitem\" *ngIf=\"!item.separator\" [pMenuItemContent]=\"item\" [ngClass]=\"{'p-hidden': (item.visible === false || submenu.visible === false)}\" [ngStyle]=\"item.style\" [class]=\"item.styleClass\"></li>\n                    </ng-template>\n                </ng-template>\n                <ng-template ngFor let-item [ngForOf]=\"model\" *ngIf=\"!hasSubMenu()\">\n                    <li class=\"p-menu-separator\" *ngIf=\"item.separator\" [ngClass]=\"{'p-hidden': item.visible === false}\"></li>\n                    <li class=\"p-menuitem\" *ngIf=\"!item.separator\" [pMenuItemContent]=\"item\" [ngClass]=\"{'p-hidden': item.visible === false}\" [ngStyle]=\"item.style\" [class]=\"item.styleClass\"></li>\n                </ng-template>\n            </ul>\n        </div>\n    ",
                    animations: [
                        trigger('overlayAnimation', [
                            transition(':enter', [
                                style({ opacity: 0, transform: 'scaleY(0.8)' }),
                                animate('{{showTransitionParams}}')
                            ]),
                            transition(':leave', [
                                animate('{{hideTransitionParams}}', style({ opacity: 0 }))
                            ])
                        ])
                    ],
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    styles: [".p-menu-overlay{position:absolute}.p-menu ul{margin:0;padding:0;list-style:none}.p-menu .p-menuitem-link{cursor:pointer;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;text-decoration:none;overflow:hidden;position:relative}.p-menu .p-menuitem-text{line-height:1}"]
                },] }
    ];
    Menu.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 },
        { type: ChangeDetectorRef }
    ]; };
    Menu.propDecorators = {
        model: [{ type: Input }],
        popup: [{ type: Input }],
        style: [{ type: Input }],
        styleClass: [{ type: Input }],
        appendTo: [{ type: Input }],
        autoZIndex: [{ type: Input }],
        baseZIndex: [{ type: Input }],
        showTransitionOptions: [{ type: Input }],
        hideTransitionOptions: [{ type: Input }],
        containerViewChild: [{ type: ViewChild, args: ['container',] }],
        onShow: [{ type: Output }],
        onHide: [{ type: Output }]
    };
    return Menu;
}());
var MenuModule = /** @class */ (function () {
    function MenuModule() {
    }
    MenuModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule, RouterModule, RippleModule],
                    exports: [Menu, RouterModule],
                    declarations: [Menu, MenuItemContent]
                },] }
    ];
    return MenuModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { Menu, MenuItemContent, MenuModule };
//# sourceMappingURL=primeng-menu.js.map
