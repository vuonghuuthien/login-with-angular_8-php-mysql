import { Inject, forwardRef, Component, ViewEncapsulation, Input, EventEmitter, ElementRef, Renderer2, NgZone, ChangeDetectionStrategy, Output, ViewChild, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomHandler } from 'primeng/dom';
import { RippleModule } from 'primeng/ripple';
import { RouterModule } from '@angular/router';

var ContextMenuSub = /** @class */ (function () {
    function ContextMenuSub(contextMenu) {
        this.contextMenu = contextMenu;
    }
    Object.defineProperty(ContextMenuSub.prototype, "parentActive", {
        get: function () {
            return this._parentActive;
        },
        set: function (value) {
            this._parentActive = value;
            if (!value) {
                this.activeItem = null;
            }
        },
        enumerable: false,
        configurable: true
    });
    ContextMenuSub.prototype.onItemMouseEnter = function (event, item, menuitem) {
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
            this.hideTimeout = null;
        }
        if (menuitem.disabled) {
            return;
        }
        this.activeItem = item;
        var nextElement = item.children[0].nextElementSibling;
        if (nextElement) {
            var sublist = nextElement.children[0];
            sublist.style.zIndex = ++DomHandler.zindex;
            this.position(sublist, item);
        }
    };
    ContextMenuSub.prototype.itemClick = function (event, item) {
        if (item.disabled) {
            event.preventDefault();
            return;
        }
        if (item.command) {
            item.command({
                originalEvent: event,
                item: item
            });
            event.preventDefault();
        }
        if (item.items)
            event.preventDefault();
        else
            this.contextMenu.hide();
    };
    ContextMenuSub.prototype.listClick = function (event) {
        this.activeItem = null;
    };
    ContextMenuSub.prototype.position = function (sublist, item) {
        this.containerOffset = DomHandler.getOffset(item.parentElement);
        var viewport = DomHandler.getViewport();
        var sublistWidth = sublist.offsetParent ? sublist.offsetWidth : DomHandler.getHiddenElementOuterWidth(sublist);
        var itemOuterWidth = DomHandler.getOuterWidth(item.children[0]);
        var itemOuterHeight = DomHandler.getOuterHeight(item.children[0]);
        var sublistHeight = sublist.offsetHeight ? sublist.offsetHeight : DomHandler.getHiddenElementOuterHeight(sublist);
        if ((parseInt(this.containerOffset.top) + itemOuterHeight + sublistHeight) > (viewport.height - DomHandler.calculateScrollbarHeight())) {
            sublist.style.bottom = '0px';
        }
        else {
            sublist.style.top = '0px';
        }
        if ((parseInt(this.containerOffset.left) + itemOuterWidth + sublistWidth) > (viewport.width - DomHandler.calculateScrollbarWidth())) {
            sublist.style.left = -sublistWidth + 'px';
        }
        else {
            sublist.style.left = itemOuterWidth + 'px';
        }
    };
    ContextMenuSub.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: Inject, args: [forwardRef(function () { return ContextMenu; }),] }] }
    ]; };
    ContextMenuSub.decorators = [
        { type: Component, args: [{
                    selector: 'p-contextMenuSub',
                    template: "\n        <ul [ngClass]=\"{'p-submenu-list':!root}\">\n            <ng-template ngFor let-child [ngForOf]=\"(root ? item : item.items)\">\n                <li *ngIf=\"child.separator\" class=\"p-menu-separator\" [ngClass]=\"{'p-hidden': child.visible === false}\" role=\"separator\">\n                <li *ngIf=\"!child.separator\" #item [ngClass]=\"{'p-menuitem':true,'p-menuitem-active':item==activeItem,'p-hidden': child.visible === false}\"\n                    (mouseenter)=\"onItemMouseEnter($event,item,child)\" role=\"none\">\n                    <a *ngIf=\"!child.routerLink\" [attr.href]=\"child.url ? child.url : null\" [attr.target]=\"child.target\" [attr.title]=\"child.title\" [attr.id]=\"child.id\" [attr.tabindex]=\"child.disabled ? null : '0'\" (click)=\"itemClick($event, child)\"\n                        [ngClass]=\"{'p-menuitem-link':true,'p-disabled':child.disabled}\" [ngStyle]=\"child.style\" [class]=\"child.styleClass\" pRipple\n                        [attr.aria-haspopup]=\"item.items != null\" [attr.aria-expanded]=\"item === activeItem\">\n                        <span class=\"p-menuitem-icon\" *ngIf=\"child.icon\" [ngClass]=\"child.icon\"></span>\n                        <span class=\"p-menuitem-text\">{{child.label}}</span>\n                        <span class=\"p-submenu-icon pi pi-angle-right\" *ngIf=\"child.items\"></span>\n                    </a>\n                    <a *ngIf=\"child.routerLink\" [routerLink]=\"child.routerLink\" [queryParams]=\"child.queryParams\" [routerLinkActive]=\"'p-menuitem-link-active'\" role=\"menuitem\"\n                        [routerLinkActiveOptions]=\"child.routerLinkActiveOptions||{exact:false}\" [attr.target]=\"child.target\" [attr.title]=\"child.title\" [attr.id]=\"child.id\" [attr.tabindex]=\"child.disabled ? null : '0'\"\n                        (click)=\"itemClick($event, child)\" [ngClass]=\"{'p-menuitem-link':true,'p-disabled':child.disabled}\"\n                        [ngStyle]=\"child.style\" [class]=\"child.styleClass\" pRipple\n                        [fragment]=\"child.fragment\" [queryParamsHandling]=\"child.queryParamsHandling\" [preserveFragment]=\"child.preserveFragment\" [skipLocationChange]=\"child.skipLocationChange\" [replaceUrl]=\"child.replaceUrl\" [state]=\"child.state\">\n                        <span class=\"p-menuitem-icon\" *ngIf=\"child.icon\" [ngClass]=\"child.icon\"></span>\n                        <span class=\"p-menuitem-text\">{{child.label}}</span>\n                        <span class=\"p-submenu-icon pi pi-angle-right\" *ngIf=\"child.items\"></span>\n                    </a>\n                    <p-contextMenuSub [parentActive]=\"item==activeItem\" [item]=\"child\" *ngIf=\"child.items\"></p-contextMenuSub>\n                </li>\n            </ng-template>\n        </ul>\n    ",
                    encapsulation: ViewEncapsulation.None
                },] }
    ];
    ContextMenuSub.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: Inject, args: [forwardRef(function () { return ContextMenu; }),] }] }
    ]; };
    ContextMenuSub.propDecorators = {
        item: [{ type: Input }],
        root: [{ type: Input }],
        parentActive: [{ type: Input }]
    };
    return ContextMenuSub;
}());
var ContextMenu = /** @class */ (function () {
    function ContextMenu(el, renderer, zone) {
        this.el = el;
        this.renderer = renderer;
        this.zone = zone;
        this.autoZIndex = true;
        this.baseZIndex = 0;
        this.triggerEvent = 'contextmenu';
        this.onShow = new EventEmitter();
        this.onHide = new EventEmitter();
    }
    ContextMenu.prototype.ngAfterViewInit = function () {
        var _this = this;
        if (this.global) {
            this.triggerEventListener = this.renderer.listen('document', this.triggerEvent, function (event) {
                _this.show(event);
                event.preventDefault();
            });
        }
        else if (this.target) {
            this.triggerEventListener = this.renderer.listen(this.target, this.triggerEvent, function (event) {
                _this.show(event);
                event.preventDefault();
                event.stopPropagation();
            });
        }
        if (this.appendTo) {
            if (this.appendTo === 'body')
                document.body.appendChild(this.containerViewChild.nativeElement);
            else
                DomHandler.appendChild(this.containerViewChild.nativeElement, this.appendTo);
        }
    };
    ContextMenu.prototype.show = function (event) {
        this.position(event);
        this.moveOnTop();
        this.containerViewChild.nativeElement.style.display = 'block';
        this.parentActive = true;
        DomHandler.fadeIn(this.containerViewChild.nativeElement, 250);
        this.bindGlobalListeners();
        if (event) {
            event.preventDefault();
        }
        this.onShow.emit();
    };
    ContextMenu.prototype.hide = function () {
        this.containerViewChild.nativeElement.style.display = 'none';
        this.parentActive = false;
        this.unbindGlobalListeners();
        this.onHide.emit();
    };
    ContextMenu.prototype.moveOnTop = function () {
        if (this.autoZIndex) {
            this.containerViewChild.nativeElement.style.zIndex = String(this.baseZIndex + (++DomHandler.zindex));
        }
    };
    ContextMenu.prototype.toggle = function (event) {
        if (this.containerViewChild.nativeElement.offsetParent)
            this.hide();
        else
            this.show(event);
    };
    ContextMenu.prototype.position = function (event) {
        if (event) {
            var left = event.pageX + 1;
            var top_1 = event.pageY + 1;
            var width = this.containerViewChild.nativeElement.offsetParent ? this.containerViewChild.nativeElement.offsetWidth : DomHandler.getHiddenElementOuterWidth(this.containerViewChild.nativeElement);
            var height = this.containerViewChild.nativeElement.offsetParent ? this.containerViewChild.nativeElement.offsetHeight : DomHandler.getHiddenElementOuterHeight(this.containerViewChild.nativeElement);
            var viewport = DomHandler.getViewport();
            //flip
            if (left + width - document.body.scrollLeft > viewport.width) {
                left -= width;
            }
            //flip
            if (top_1 + height - document.body.scrollTop > viewport.height) {
                top_1 -= height;
            }
            //fit
            if (left < document.body.scrollLeft) {
                left = document.body.scrollLeft;
            }
            //fit
            if (top_1 < document.body.scrollTop) {
                top_1 = document.body.scrollTop;
            }
            this.containerViewChild.nativeElement.style.left = left + 'px';
            this.containerViewChild.nativeElement.style.top = top_1 + 'px';
        }
    };
    ContextMenu.prototype.bindGlobalListeners = function () {
        var _this = this;
        if (!this.documentClickListener) {
            this.documentClickListener = this.renderer.listen('document', 'click', function (event) {
                if (_this.containerViewChild.nativeElement.offsetParent && _this.isOutsideClicked(event) && event.button !== 2) {
                    _this.hide();
                }
            });
        }
        this.zone.runOutsideAngular(function () {
            if (!_this.windowResizeListener) {
                _this.windowResizeListener = _this.onWindowResize.bind(_this);
                window.addEventListener('resize', _this.windowResizeListener);
            }
        });
    };
    ContextMenu.prototype.unbindGlobalListeners = function () {
        if (this.documentClickListener) {
            this.documentClickListener();
            this.documentClickListener = null;
        }
        if (this.windowResizeListener) {
            window.removeEventListener('resize', this.windowResizeListener);
            this.windowResizeListener = null;
        }
    };
    ContextMenu.prototype.onWindowResize = function (event) {
        if (this.containerViewChild.nativeElement.offsetParent) {
            this.hide();
        }
    };
    ContextMenu.prototype.isOutsideClicked = function (event) {
        return !(this.containerViewChild.nativeElement.isSameNode(event.target) || this.containerViewChild.nativeElement.contains(event.target));
    };
    ContextMenu.prototype.ngOnDestroy = function () {
        this.unbindGlobalListeners();
        if (this.triggerEventListener) {
            this.triggerEventListener();
        }
        if (this.appendTo) {
            this.el.nativeElement.appendChild(this.containerViewChild.nativeElement);
        }
    };
    ContextMenu.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 },
        { type: NgZone }
    ]; };
    ContextMenu.decorators = [
        { type: Component, args: [{
                    selector: 'p-contextMenu',
                    template: "\n        <div #container [ngClass]=\"'p-contextmenu p-component'\"\n            [class]=\"styleClass\" [ngStyle]=\"style\">\n            <p-contextMenuSub [item]=\"model\" [parentActive]=\"parentActive\" root=\"root\"></p-contextMenuSub>\n        </div>\n    ",
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    styles: [".p-contextmenu{position:absolute;display:none}.p-contextmenu ul{margin:0;padding:0;list-style:none}.p-contextmenu .p-submenu-list{position:absolute;min-width:100%;z-index:1;display:none}.p-contextmenu .p-menuitem-link{cursor:pointer;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;text-decoration:none;overflow:hidden;position:relative}.p-contextmenu .p-menuitem-text{line-height:1}.p-contextmenu .p-menuitem{position:relative}.p-contextmenu .p-menuitem-link .p-submenu-icon{margin-left:auto}.p-contextmenu .p-menuitem-active>p-contextmenusub>.p-submenu-list{display:block!important}"]
                },] }
    ];
    ContextMenu.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 },
        { type: NgZone }
    ]; };
    ContextMenu.propDecorators = {
        model: [{ type: Input }],
        global: [{ type: Input }],
        target: [{ type: Input }],
        style: [{ type: Input }],
        styleClass: [{ type: Input }],
        appendTo: [{ type: Input }],
        autoZIndex: [{ type: Input }],
        baseZIndex: [{ type: Input }],
        triggerEvent: [{ type: Input }],
        onShow: [{ type: Output }],
        onHide: [{ type: Output }],
        containerViewChild: [{ type: ViewChild, args: ['container',] }]
    };
    return ContextMenu;
}());
var ContextMenuModule = /** @class */ (function () {
    function ContextMenuModule() {
    }
    ContextMenuModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule, RouterModule, RippleModule],
                    exports: [ContextMenu, RouterModule],
                    declarations: [ContextMenu, ContextMenuSub]
                },] }
    ];
    return ContextMenuModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { ContextMenu, ContextMenuModule, ContextMenuSub };
//# sourceMappingURL=primeng-contextmenu.js.map
