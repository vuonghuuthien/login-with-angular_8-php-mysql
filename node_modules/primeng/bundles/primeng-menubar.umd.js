(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('primeng/dom'), require('primeng/api'), require('@angular/router'), require('primeng/ripple')) :
    typeof define === 'function' && define.amd ? define('primeng/menubar', ['exports', '@angular/core', '@angular/common', 'primeng/dom', 'primeng/api', '@angular/router', 'primeng/ripple'], factory) :
    (global = global || self, factory((global.primeng = global.primeng || {}, global.primeng.menubar = {}), global.ng.core, global.ng.common, global.primeng.dom, global.primeng.api, global.ng.router, global.primeng.ripple));
}(this, (function (exports, core, common, dom, api, router, ripple) { 'use strict';

    var MenubarSub = /** @class */ (function () {
        function MenubarSub(renderer, cd) {
            this.renderer = renderer;
            this.cd = cd;
            this.autoZIndex = true;
            this.baseZIndex = 0;
            this.menuHoverActive = false;
        }
        Object.defineProperty(MenubarSub.prototype, "parentActive", {
            get: function () {
                return this._parentActive;
            },
            set: function (value) {
                if (!this.root) {
                    this._parentActive = value;
                    if (!value)
                        this.activeItem = null;
                }
            },
            enumerable: false,
            configurable: true
        });
        MenubarSub.prototype.onItemMenuClick = function (event, item, menuitem) {
            this.menuClick = true;
            if (!this.autoDisplay) {
                if (menuitem.disabled) {
                    return;
                }
                this.activeItem = this.activeMenu ? (this.activeMenu.isEqualNode(item) ? null : item) : item;
                var nextElement = item.children[0].nextElementSibling;
                if (nextElement) {
                    var sublist = nextElement.children[0];
                    if (this.autoZIndex) {
                        sublist.style.zIndex = String(this.baseZIndex + (++dom.DomHandler.zindex));
                    }
                    if (this.root) {
                        sublist.style.top = dom.DomHandler.getOuterHeight(item.children[0]) + 'px';
                        sublist.style.left = '0px';
                    }
                    else {
                        sublist.style.top = '0px';
                        sublist.style.left = dom.DomHandler.getOuterWidth(item.children[0]) + 'px';
                    }
                }
                this.menuHoverActive = this.activeMenu ? (!this.activeMenu.isEqualNode(item)) : true;
                this.activeMenu = this.activeMenu ? (this.activeMenu.isEqualNode(item) ? null : item) : item;
                this.bindEventListener();
            }
        };
        MenubarSub.prototype.bindEventListener = function () {
            var _this = this;
            if (!this.documentClickListener) {
                this.documentClickListener = this.renderer.listen('document', 'click', function (event) {
                    if (!_this.menuClick) {
                        _this.activeItem = null;
                        _this.menuHoverActive = false;
                        _this.activeMenu = false;
                        _this.cd.markForCheck();
                    }
                    _this.menuClick = false;
                });
            }
        };
        MenubarSub.prototype.onItemMouseEnter = function (event, item, menuitem) {
            if (this.autoDisplay || (!this.autoDisplay && this.root && this.menuHoverActive)) {
                if (menuitem.disabled) {
                    return;
                }
                if ((this.activeItem && !this.activeItem.isEqualNode(item) || !this.activeItem)) {
                    this.activeItem = item;
                    var nextElement = item.children[0].nextElementSibling;
                    if (nextElement) {
                        var sublist = nextElement.children[0];
                        sublist.style.zIndex = String(++dom.DomHandler.zindex);
                        if (this.root) {
                            sublist.style.top = dom.DomHandler.getOuterHeight(item.children[0]) + 'px';
                            sublist.style.left = '0px';
                        }
                        else {
                            sublist.style.top = '0px';
                            sublist.style.left = dom.DomHandler.getOuterWidth(item.children[0]) + 'px';
                        }
                    }
                    this.activeMenu = item;
                }
            }
        };
        MenubarSub.prototype.itemClick = function (event, item) {
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
            this.activeItem = null;
        };
        MenubarSub.prototype.listClick = function (event) {
            if (this.autoDisplay) {
                this.activeItem = null;
            }
        };
        MenubarSub.prototype.ngOnDestroy = function () {
            if (this.documentClickListener) {
                this.documentClickListener();
                this.documentClickListener = null;
            }
        };
        MenubarSub.ctorParameters = function () { return [
            { type: core.Renderer2 },
            { type: core.ChangeDetectorRef }
        ]; };
        MenubarSub.decorators = [
            { type: core.Component, args: [{
                        selector: 'p-menubarSub',
                        template: "\n        <ul [ngClass]=\"{'p-submenu-list': !root, 'p-menubar-root-list': root}\"\n            (click)=\"listClick($event)\">\n            <ng-template ngFor let-child [ngForOf]=\"(root ? item : item.items)\">\n                <li *ngIf=\"child.separator\" class=\"p-menu-separator\" [ngClass]=\"{'p-hidden': child.visible === false}\">\n                <li *ngIf=\"!child.separator\" #listItem [ngClass]=\"{'p-menuitem':true, 'p-menuitem-active':listItem==activeItem, 'p-hidden': child.visible === false}\"\n                        (mouseenter)=\"onItemMouseEnter($event,listItem,child)\" (click)=\"onItemMenuClick($event, listItem, child)\">\n                    <a *ngIf=\"!child.routerLink\" [attr.href]=\"child.url\" [attr.data-automationid]=\"child.automationId\" [attr.target]=\"child.target\" [attr.title]=\"child.title\" [attr.id]=\"child.id\" (click)=\"itemClick($event, child)\"\n                         [ngClass]=\"{'p-menuitem-link':true,'p-disabled':child.disabled}\" [ngStyle]=\"child.style\" [class]=\"child.styleClass\" \n                         [attr.tabindex]=\"child.disabled ? null : '0'\" [attr.aria-haspopup]=\"item.items != null\" [attr.aria-expanded]=\"item === activeItem\" pRipple>\n                        <span class=\"p-menuitem-icon\" *ngIf=\"child.icon\" [ngClass]=\"child.icon\"></span>\n                        <span class=\"p-menuitem-text\">{{child.label}}</span>\n                        <span class=\"p-submenu-icon pi\" *ngIf=\"child.items\" [ngClass]=\"{'pi-angle-down':root,'pi-angle-right':!root}\"></span>\n                    </a>\n                    <a *ngIf=\"child.routerLink\" [routerLink]=\"child.routerLink\" [attr.data-automationid]=\"child.automationId\" [queryParams]=\"child.queryParams\" [routerLinkActive]=\"'p-menuitem-link-active'\" [routerLinkActiveOptions]=\"child.routerLinkActiveOptions||{exact:false}\"\n                        [attr.target]=\"child.target\" [attr.title]=\"child.title\" [attr.id]=\"child.id\" [attr.tabindex]=\"child.disabled ? null : '0'\" role=\"menuitem\"\n                        (click)=\"itemClick($event, child)\" [ngClass]=\"{'p-menuitem-link':true,'p-disabled':child.disabled}\" [ngStyle]=\"child.style\" [class]=\"child.styleClass\"\n                        [fragment]=\"child.fragment\" [queryParamsHandling]=\"child.queryParamsHandling\" [preserveFragment]=\"child.preserveFragment\" [skipLocationChange]=\"child.skipLocationChange\" [replaceUrl]=\"child.replaceUrl\" [state]=\"child.state\" pRipple>\n                        <span class=\"p-menuitem-icon\" *ngIf=\"child.icon\" [ngClass]=\"child.icon\"></span>\n                        <span class=\"p-menuitem-text\">{{child.label}}</span>\n                        <span class=\"p-submenu-icon pi\" *ngIf=\"child.items\" [ngClass]=\"{'pi-angle-down':root,'pi-angle-right':!root}\"></span>\n                    </a>\n                    <p-menubarSub [parentActive]=\"listItem==activeItem\" [item]=\"child\" *ngIf=\"child.items\" [autoDisplay]=\"true\"></p-menubarSub>\n                </li>\n            </ng-template>\n        </ul>\n    ",
                        encapsulation: core.ViewEncapsulation.None
                    },] }
        ];
        MenubarSub.ctorParameters = function () { return [
            { type: core.Renderer2 },
            { type: core.ChangeDetectorRef }
        ]; };
        MenubarSub.propDecorators = {
            item: [{ type: core.Input }],
            root: [{ type: core.Input }],
            autoDisplay: [{ type: core.Input }],
            autoZIndex: [{ type: core.Input }],
            baseZIndex: [{ type: core.Input }],
            parentActive: [{ type: core.Input }]
        };
        return MenubarSub;
    }());
    var Menubar = /** @class */ (function () {
        function Menubar(el, renderer) {
            this.el = el;
            this.renderer = renderer;
            this.autoZIndex = true;
            this.baseZIndex = 0;
        }
        Object.defineProperty(Menubar.prototype, "autoDisplay", {
            get: function () {
                return this._autoDisplay;
            },
            set: function (_autoDisplay) {
                console.log("AutoDisplay property is deprecated and functionality is not available.");
            },
            enumerable: false,
            configurable: true
        });
        Menubar.prototype.ngAfterContentInit = function () {
            var _this = this;
            this.templates.forEach(function (item) {
                switch (item.getType()) {
                    case 'start':
                        _this.startTemplate = item.template;
                        break;
                    case 'end':
                        _this.endTemplate = item.template;
                        break;
                }
            });
        };
        Menubar.ctorParameters = function () { return [
            { type: core.ElementRef },
            { type: core.Renderer2 }
        ]; };
        Menubar.decorators = [
            { type: core.Component, args: [{
                        selector: 'p-menubar',
                        template: "\n        <div [ngClass]=\"{'p-menubar p-component':true}\" [class]=\"styleClass\" [ngStyle]=\"style\">\n            <div class=\"p-menubar-start\" *ngIf=\"startTemplate\">\n                <ng-container *ngTemplateOutlet=\"startTemplate\"></ng-container>\n            </div>\n            <p-menubarSub [item]=\"model\" root=\"root\" [baseZIndex]=\"baseZIndex\" [autoZIndex]=\"autoZIndex\"></p-menubarSub>\n            <div class=\"p-menubar-end\" *ngIf=\"endTemplate; else legacy\">\n                <ng-container *ngTemplateOutlet=\"endTemplate\"></ng-container>\n            </div>\n            <ng-template #legacy>\n                <div class=\"p-menubar-end\">\n                    <ng-content></ng-content>\n                </div>\n            </ng-template>\n        </div>\n    ",
                        changeDetection: core.ChangeDetectionStrategy.OnPush,
                        encapsulation: core.ViewEncapsulation.None,
                        styles: [".p-menubar{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center}.p-menubar ul{margin:0;padding:0;list-style:none}.p-menubar .p-menuitem-link{cursor:pointer;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;text-decoration:none;overflow:hidden;position:relative}.p-menubar .p-menuitem-text{line-height:1}.p-menubar .p-menuitem{position:relative}.p-menubar-root-list{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center}.p-menubar-root-list>li ul{display:none;z-index:1}.p-menubar-root-list>.p-menuitem-active>p-menubarsub>.p-submenu-list{display:block}.p-menubar .p-submenu-list{display:none;position:absolute;z-index:1}.p-menubar .p-submenu-list>.p-menuitem-active>p-menubarsub>.p-submenu-list{display:block;left:100%;top:0}.p-menubar .p-submenu-list .p-menuitem-link .p-submenu-icon{margin-left:auto}.p-menubar .p-menubar-custom,.p-menubar .p-menubar-end{margin-left:auto;-ms-flex-item-align:center;-ms-grid-row-align:center;align-self:center}.p-menubar-button{display:none;cursor:pointer;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center}"]
                    },] }
        ];
        Menubar.ctorParameters = function () { return [
            { type: core.ElementRef },
            { type: core.Renderer2 }
        ]; };
        Menubar.propDecorators = {
            model: [{ type: core.Input }],
            style: [{ type: core.Input }],
            styleClass: [{ type: core.Input }],
            autoZIndex: [{ type: core.Input }],
            baseZIndex: [{ type: core.Input }],
            templates: [{ type: core.ContentChildren, args: [api.PrimeTemplate,] }],
            autoDisplay: [{ type: core.Input }]
        };
        return Menubar;
    }());
    var MenubarModule = /** @class */ (function () {
        function MenubarModule() {
        }
        MenubarModule.decorators = [
            { type: core.NgModule, args: [{
                        imports: [common.CommonModule, router.RouterModule, ripple.RippleModule],
                        exports: [Menubar, router.RouterModule],
                        declarations: [Menubar, MenubarSub]
                    },] }
        ];
        return MenubarModule;
    }());

    exports.Menubar = Menubar;
    exports.MenubarModule = MenubarModule;
    exports.MenubarSub = MenubarSub;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=primeng-menubar.umd.js.map
