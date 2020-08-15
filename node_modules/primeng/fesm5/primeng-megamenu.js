import { ElementRef, Renderer2, ChangeDetectorRef, Component, ChangeDetectionStrategy, ViewEncapsulation, Input, ContentChildren, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeTemplate } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';

var MegaMenu = /** @class */ (function () {
    function MegaMenu(el, renderer, cd) {
        this.el = el;
        this.renderer = renderer;
        this.cd = cd;
        this.orientation = 'horizontal';
        this.autoZIndex = true;
        this.baseZIndex = 0;
    }
    MegaMenu.prototype.ngAfterContentInit = function () {
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
    MegaMenu.prototype.onCategoryMouseEnter = function (event, menuitem) {
        if (menuitem.disabled) {
            event.preventDefault();
            return;
        }
        if (this.activeItem) {
            this.activeItem = menuitem;
        }
    };
    MegaMenu.prototype.onCategoryClick = function (event, item) {
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
        if (item.items) {
            if (this.activeItem && this.activeItem === item) {
                this.activeItem = null;
                this.unbindDocumentClickListener();
            }
            else {
                this.activeItem = item;
                this.bindDocumentClickListener();
            }
        }
    };
    MegaMenu.prototype.itemClick = function (event, item) {
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
    MegaMenu.prototype.getColumnClass = function (menuitem) {
        var length = menuitem.items ? menuitem.items.length : 0;
        var columnClass;
        switch (length) {
            case 2:
                columnClass = 'p-megamenu-col-6';
                break;
            case 3:
                columnClass = 'p-megamenu-col-4';
                break;
            case 4:
                columnClass = 'p-megamenu-col-3';
                break;
            case 6:
                columnClass = 'p-megamenu-col-2';
                break;
            default:
                columnClass = 'p-megamenu-col-12';
                break;
        }
        return columnClass;
    };
    MegaMenu.prototype.bindDocumentClickListener = function () {
        var _this = this;
        if (!this.documentClickListener) {
            this.documentClickListener = function (event) {
                if (_this.el && !_this.el.nativeElement.contains(event.target)) {
                    _this.activeItem = null;
                    _this.unbindDocumentClickListener();
                    _this.cd.markForCheck();
                }
            };
            document.addEventListener('click', this.documentClickListener);
        }
    };
    MegaMenu.prototype.unbindDocumentClickListener = function () {
        if (this.documentClickListener) {
            document.removeEventListener('click', this.documentClickListener);
            this.documentClickListener = null;
        }
    };
    MegaMenu.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 },
        { type: ChangeDetectorRef }
    ]; };
    MegaMenu.decorators = [
        { type: Component, args: [{
                    selector: 'p-megaMenu',
                    template: "\n        <div [class]=\"styleClass\" [ngStyle]=\"style\"\n            [ngClass]=\"{'p-megamenu p-component':true,'p-megamenu-horizontal': orientation == 'horizontal','p-megamenu-vertical': orientation == 'vertical'}\">\n            <div class=\"p-megamenu-start\" *ngIf=\"startTemplate\">\n                <ng-container *ngTemplateOutlet=\"startTemplate\"></ng-container>\n            </div>\n            <ul class=\"p-megamenu-root-list\" role=\"menubar\">\n                <ng-template ngFor let-category [ngForOf]=\"model\">\n                    <li *ngIf=\"category.separator\" class=\"p-menu-separator\" [ngClass]=\"{'p-hidden': category.visible === false}\">\n                    <li *ngIf=\"!category.separator\" [ngClass]=\"{'p-menuitem':true,'p-menuitem-active':category==activeItem, 'p-hidden': category.visible === false}\"\n                        (mouseenter)=\"onCategoryMouseEnter($event, category)\">\n                        <a *ngIf=\"!category.routerLink\" [href]=\"category.url||'#'\" [attr.target]=\"category.target\" [attr.title]=\"category.title\" [attr.id]=\"category.id\" (click)=\"onCategoryClick($event, category)\" [attr.tabindex]=\"category.tabindex ? category.tabindex : '0'\"\n                            [ngClass]=\"{'p-menuitem-link':true,'p-disabled':category.disabled}\" [ngStyle]=\"category.style\" [class]=\"category.styleClass\" pRipple>\n                            <span class=\"p-menuitem-icon\" *ngIf=\"category.icon\" [ngClass]=\"category.icon\"></span>\n                            <span class=\"p-menuitem-text\">{{category.label}}</span>\n                            <span *ngIf=\"category.items\" class=\"p-submenu-icon pi\" [ngClass]=\"{'pi-angle-down':orientation=='horizontal','pi-angle-right':orientation=='vertical'}\"></span>\n                        </a>\n                        <a *ngIf=\"category.routerLink\" [routerLink]=\"category.routerLink\" [queryParams]=\"category.queryParams\" [routerLinkActive]=\"'p-menuitem-link-active'\" [routerLinkActiveOptions]=\"category.routerLinkActiveOptions||{exact:false}\" [attr.tabindex]=\"category.tabindex ? category.tabindex : '0'\" \n                            [attr.target]=\"category.target\" [attr.title]=\"category.title\" [attr.id]=\"category.id\"\n                            (click)=\"onCategoryClick($event, category)\" [ngClass]=\"{'p-menuitem-link':true,'p-disabled':category.disabled}\" [ngStyle]=\"category.style\" [class]=\"category.styleClass\"\n                            [fragment]=\"category.fragment\" [queryParamsHandling]=\"category.queryParamsHandling\" [preserveFragment]=\"category.preserveFragment\" [skipLocationChange]=\"category.skipLocationChange\" [replaceUrl]=\"category.replaceUrl\" [state]=\"category.state\" pRipple>\n                            <span class=\"p-menuitem-icon\" *ngIf=\"category.icon\" [ngClass]=\"category.icon\"></span>\n                            <span class=\"p-menuitem-text\">{{category.label}}</span>\n                        </a>\n                        <div class=\"p-megamenu-panel\" *ngIf=\"category.items\">\n                            <div class=\"p-megamenu-grid\">\n                                <ng-template ngFor let-column [ngForOf]=\"category.items\">\n                                    <div [class]=\"getColumnClass(category)\">\n                                        <ng-template ngFor let-submenu [ngForOf]=\"column\">\n                                            <ul class=\"p-megamenu-submenu\" role=\"menu\">\n                                                <li class=\"p-megamenu-submenu-header\">{{submenu.label}}</li>\n                                                <ng-template ngFor let-item [ngForOf]=\"submenu.items\">\n                                                    <li *ngIf=\"item.separator\" class=\"p-menu-separator\" [ngClass]=\"{'p-hidden': item.visible === false}\" role=\"separator\">\n                                                    <li *ngIf=\"!item.separator\" class=\"p-menuitem\" [ngClass]=\"{'p-hidden': item.visible === false}\" role=\"none\">\n                                                        <a *ngIf=\"!item.routerLink\" role=\"menuitem\" [href]=\"item.url||'#'\" class=\"p-menuitem-link\" [attr.target]=\"item.target\" [attr.title]=\"item.title\" [attr.id]=\"item.id\" [attr.tabindex]=\"item.tabindex ? item.tabindex : '0'\"\n                                                            [ngClass]=\"{'p-disabled':item.disabled}\" (click)=\"itemClick($event, item)\" pRipple>\n                                                            <span class=\"p-menuitem-icon\" *ngIf=\"item.icon\" [ngClass]=\"item.icon\"></span>\n                                                            <span class=\"p-menuitem-text\">{{item.label}}</span>\n                                                        </a>\n                                                        <a *ngIf=\"item.routerLink\" role=\"menuitem\" [routerLink]=\"item.routerLink\" [queryParams]=\"item.queryParams\" [routerLinkActive]=\"'p-menuitem-link-active'\" [attr.tabindex]=\"item.tabindex ? item.tabindex : '0'\"\n                                                            [routerLinkActiveOptions]=\"item.routerLinkActiveOptions||{exact:false}\" class=\"p-menuitem-link\" \n                                                             [attr.target]=\"item.target\" [attr.title]=\"item.title\" [attr.id]=\"item.id\"\n                                                            [ngClass]=\"{'p-disabled':item.disabled}\" (click)=\"itemClick($event, item)\"\n                                                            [fragment]=\"item.fragment\" [queryParamsHandling]=\"item.queryParamsHandling\" [preserveFragment]=\"item.preserveFragment\" [skipLocationChange]=\"item.skipLocationChange\" [replaceUrl]=\"item.replaceUrl\" [state]=\"item.state\" pRipple>\n                                                            <span class=\"p-menuitem-icon\" *ngIf=\"item.icon\" [ngClass]=\"item.icon\"></span>\n                                                            <span class=\"p-menuitem-text\">{{item.label}}</span>\n                                                        </a>\n                                                    </li>\n                                                </ng-template>\n                                            </ul>\n                                        </ng-template>\n                                    </div>\n                                </ng-template>\n                            </div>\n                        </div>\n                    </li>\n                </ng-template>\n                <div class=\"p-megamenu-end\" *ngIf=\"endTemplate; else legacy\">\n                    <ng-container *ngTemplateOutlet=\"endTemplate\"></ng-container>\n                </div>\n                <ng-template #legacy>\n                    <div class=\"p-megamenu-end\">\n                        <ng-content></ng-content>\n                    </div>\n                </ng-template>\n            </ul>\n        </div>\n    ",
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    styles: [".p-megamenu-root-list{margin:0;padding:0;list-style:none}.p-megamenu-root-list>.p-menuitem{position:relative}.p-megamenu .p-menuitem-link{cursor:pointer;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;text-decoration:none;overflow:hidden;position:relative}.p-megamenu .p-menuitem-text{line-height:1}.p-megamenu-panel{display:none;position:absolute;width:auto;z-index:1}.p-megamenu-root-list>.p-menuitem-active>.p-megamenu-panel{display:block}.p-megamenu-submenu{margin:0;padding:0;list-style:none}.p-megamenu-horizontal .p-megamenu-root-list{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-wrap:wrap;flex-wrap:wrap}.p-megamenu-vertical .p-megamenu-root-list{-ms-flex-direction:column;flex-direction:column}.p-megamenu-vertical .p-megamenu-root-list>.p-menuitem-active>.p-megamenu-panel{left:100%;top:0}.p-megamenu-vertical .p-megamenu-root-list>.p-menuitem>.p-menuitem-link>.p-submenu-icon{margin-left:auto}.p-megamenu-grid{display:-ms-flexbox;display:flex}.p-megamenu-col-12,.p-megamenu-col-2,.p-megamenu-col-3,.p-megamenu-col-4,.p-megamenu-col-6{-ms-flex:0 0 auto;flex:0 0 auto;padding:.5rem}.p-megamenu-col-2{width:16.6667%}.p-megamenu-col-3{width:25%}.p-megamenu-col-4{width:33.3333%}.p-megamenu-col-6{width:50%}.p-megamenu-col-12{width:100%}"]
                },] }
    ];
    MegaMenu.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 },
        { type: ChangeDetectorRef }
    ]; };
    MegaMenu.propDecorators = {
        model: [{ type: Input }],
        style: [{ type: Input }],
        styleClass: [{ type: Input }],
        orientation: [{ type: Input }],
        autoZIndex: [{ type: Input }],
        baseZIndex: [{ type: Input }],
        templates: [{ type: ContentChildren, args: [PrimeTemplate,] }]
    };
    return MegaMenu;
}());
var MegaMenuModule = /** @class */ (function () {
    function MegaMenuModule() {
    }
    MegaMenuModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule, RouterModule, RippleModule],
                    exports: [MegaMenu, RouterModule],
                    declarations: [MegaMenu]
                },] }
    ];
    return MegaMenuModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { MegaMenu, MegaMenuModule };
//# sourceMappingURL=primeng-megamenu.js.map
