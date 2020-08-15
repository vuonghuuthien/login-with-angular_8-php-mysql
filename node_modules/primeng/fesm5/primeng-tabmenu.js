import { Component, ChangeDetectionStrategy, ViewEncapsulation, Input, ViewChild, ContentChildren, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RippleModule } from 'primeng/ripple';
import { PrimeTemplate, SharedModule } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { DomHandler } from 'primeng/dom';

var TabMenu = /** @class */ (function () {
    function TabMenu() {
    }
    TabMenu.prototype.ngAfterContentInit = function () {
        var _this = this;
        this.templates.forEach(function (item) {
            switch (item.getType()) {
                case 'item':
                    _this.itemTemplate = item.template;
                    break;
                default:
                    _this.itemTemplate = item.template;
                    break;
            }
        });
    };
    TabMenu.prototype.ngAfterViewInit = function () {
        this.updateInkBar();
    };
    TabMenu.prototype.ngAfterViewChecked = function () {
        if (this.tabChanged) {
            this.updateInkBar();
            this.tabChanged = false;
        }
    };
    TabMenu.prototype.itemClick = function (event, item) {
        if (item.disabled) {
            event.preventDefault();
            return;
        }
        if (item.command) {
            item.command({
                originalEvent: event,
                item: item
            });
        }
        this.activeItem = item;
        this.tabChanged = true;
    };
    TabMenu.prototype.updateInkBar = function () {
        var tabHeader = DomHandler.findSingle(this.navbar.nativeElement, 'li.p-highlight');
        if (tabHeader) {
            this.inkbar.nativeElement.style.width = DomHandler.getWidth(tabHeader) + 'px';
            this.inkbar.nativeElement.style.left = DomHandler.getOffset(tabHeader).left - DomHandler.getOffset(this.navbar.nativeElement).left + 'px';
        }
    };
    TabMenu.decorators = [
        { type: Component, args: [{
                    selector: 'p-tabMenu',
                    template: "\n        <div [ngClass]=\"'p-tabmenu p-component'\" [ngStyle]=\"style\" [class]=\"styleClass\">\n            <ul #navbar class=\"p-tabmenu-nav p-reset\" role=\"tablist\">\n                <li *ngFor=\"let item of model; let i = index\" role=\"tab\" [attr.aria-selected]=\"activeItem==item\" [attr.aria-expanded]=\"activeItem==item\"\n                    [ngClass]=\"{'p-tabmenuitem':true,'p-disabled':item.disabled,'p-highlight':activeItem==item,'p-hidden': item.visible === false}\">\n                    <a *ngIf=\"!item.routerLink\" [attr.href]=\"item.url\" class=\"p-menuitem-link\" role=\"presentation\" (click)=\"itemClick($event,item)\" [attr.tabindex]=\"item.disabled ? null : '0'\"\n                        [attr.target]=\"item.target\" [attr.title]=\"item.title\" [attr.id]=\"item.id\" pRipple>\n                        <ng-container *ngIf=\"!itemTemplate\">\n                            <span class=\"p-menuitem-icon\" [ngClass]=\"item.icon\" *ngIf=\"item.icon\"></span>\n                            <span class=\"p-menuitem-text\">{{item.label}}</span>\n                        </ng-container>\n                        <ng-container *ngTemplateOutlet=\"itemTemplate; context: {$implicit: item, index: i}\"></ng-container>\n                    </a>\n                    <a *ngIf=\"item.routerLink\" [routerLink]=\"item.routerLink\" [queryParams]=\"item.queryParams\" [routerLinkActive]=\"'p-menuitem-link-active'\" [routerLinkActiveOptions]=\"item.routerLinkActiveOptions||{exact:false}\"\n                        role=\"presentation\" class=\"p-menuitem-link\" (click)=\"itemClick($event,item)\" [attr.tabindex]=\"item.disabled ? null : '0'\"\n                        [attr.target]=\"item.target\" [attr.title]=\"item.title\" [attr.id]=\"item.id\"\n                        [fragment]=\"item.fragment\" [queryParamsHandling]=\"item.queryParamsHandling\" [preserveFragment]=\"item.preserveFragment\" [skipLocationChange]=\"item.skipLocationChange\" [replaceUrl]=\"item.replaceUrl\" [state]=\"item.state\" pRipple>\n                        <ng-container *ngIf=\"!itemTemplate\">\n                            <span class=\"p-menuitem-icon\" [ngClass]=\"item.icon\" *ngIf=\"item.icon\"></span>\n                            <span class=\"p-menuitem-text\">{{item.label}}</span>\n                        </ng-container>\n                        <ng-container *ngTemplateOutlet=\"itemTemplate; context: {$implicit: item, index: i}\"></ng-container>\n                    </a>\n                </li>\n                <li #inkbar class=\"p-tabmenu-ink-bar\"></li>\n            </ul>\n        </div>\n    ",
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    styles: [".p-tabmenu-nav{display:-ms-flexbox;display:flex;margin:0;padding:0;list-style-type:none;-ms-flex-wrap:wrap;flex-wrap:wrap}.p-tabmenu-nav a{cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;position:relative;text-decoration:none;overflow:hidden}.p-tabmenu-nav a:focus{z-index:1}.p-tabmenu-nav .p-menuitem-text{line-height:1}.p-tabmenu-ink-bar{display:none;z-index:1}"]
                },] }
    ];
    TabMenu.propDecorators = {
        model: [{ type: Input }],
        activeItem: [{ type: Input }],
        popup: [{ type: Input }],
        style: [{ type: Input }],
        styleClass: [{ type: Input }],
        navbar: [{ type: ViewChild, args: ['navbar',] }],
        inkbar: [{ type: ViewChild, args: ['inkbar',] }],
        templates: [{ type: ContentChildren, args: [PrimeTemplate,] }]
    };
    return TabMenu;
}());
var TabMenuModule = /** @class */ (function () {
    function TabMenuModule() {
    }
    TabMenuModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule, RouterModule, SharedModule, RippleModule],
                    exports: [TabMenu, RouterModule, SharedModule],
                    declarations: [TabMenu]
                },] }
    ];
    return TabMenuModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { TabMenu, TabMenuModule };
//# sourceMappingURL=primeng-tabmenu.js.map
