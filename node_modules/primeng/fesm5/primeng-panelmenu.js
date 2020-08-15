import { ChangeDetectorRef, Component, ViewEncapsulation, Input, ChangeDetectionStrategy, NgModule } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var BasePanelMenuItem = /** @class */ (function () {
    function BasePanelMenuItem(ref) {
        this.ref = ref;
    }
    BasePanelMenuItem.prototype.handleClick = function (event, item) {
        if (item.disabled) {
            event.preventDefault();
            return;
        }
        item.expanded = !item.expanded;
        this.ref.detectChanges();
        if (!item.url) {
            event.preventDefault();
        }
        if (item.command) {
            item.command({
                originalEvent: event,
                item: item
            });
        }
    };
    return BasePanelMenuItem;
}());
var PanelMenuSub = /** @class */ (function (_super) {
    __extends(PanelMenuSub, _super);
    function PanelMenuSub(ref) {
        return _super.call(this, ref) || this;
    }
    PanelMenuSub.ctorParameters = function () { return [
        { type: ChangeDetectorRef }
    ]; };
    PanelMenuSub.decorators = [
        { type: Component, args: [{
                    selector: 'p-panelMenuSub',
                    template: "\n        <ul [ngClass]=\"{'p-submenu-list': true, 'p-panelmenu-root-submenu': root}\" [@submenu]=\"expanded ? {value: 'visible', params: {transitionParams: transitionOptions, height: '*'}} : {value: 'hidden', params: {transitionParams: transitionOptions, height: '0'}}\" role=\"tree\">\n            <ng-template ngFor let-child [ngForOf]=\"item.items\">\n                <li *ngIf=\"child.separator\" class=\"p-menu-separator\" role=\"separator\">\n                <li *ngIf=\"!child.separator\" class=\"p-menuitem\" [ngClass]=\"child.styleClass\" [class.p-hidden]=\"child.visible === false\" [ngStyle]=\"child.style\">\n                    <a *ngIf=\"!child.routerLink\" [attr.href]=\"child.url\" class=\"p-menuitem-link\" [attr.tabindex]=\"!item.expanded ? null : child.disabled ? null : '0'\" [attr.id]=\"child.id\"\n                        [ngClass]=\"{'p-disabled':child.disabled}\" role=\"treeitem\" [attr.aria-expanded]=\"child.expanded\"\n                        (click)=\"handleClick($event,child)\" [attr.target]=\"child.target\" [attr.title]=\"child.title\">\n                        <span class=\"p-panelmenu-icon pi pi-fw\" [ngClass]=\"{'pi-angle-right':!child.expanded,'pi-angle-down':child.expanded}\" *ngIf=\"child.items\"></span\n                        ><span class=\"p-menuitem-icon\" [ngClass]=\"child.icon\" *ngIf=\"child.icon\"></span\n                        ><span class=\"p-menuitem-text\">{{child.label}}</span>\n                    </a>\n                    <a *ngIf=\"child.routerLink\" [routerLink]=\"child.routerLink\" [queryParams]=\"child.queryParams\" [routerLinkActive]=\"'p-menuitem-link-active'\" [routerLinkActiveOptions]=\"child.routerLinkActiveOptions||{exact:false}\" class=\"p-menuitem-link\" \n                        [ngClass]=\"{'p-disabled':child.disabled}\" [attr.tabindex]=\"!item.expanded ? null : child.disabled ? null : '0'\" [attr.id]=\"child.id\" role=\"treeitem\" [attr.aria-expanded]=\"child.expanded\"\n                        (click)=\"handleClick($event,child)\" [attr.target]=\"child.target\" [attr.title]=\"child.title\"\n                        [fragment]=\"child.fragment\" [queryParamsHandling]=\"child.queryParamsHandling\" [preserveFragment]=\"child.preserveFragment\" [skipLocationChange]=\"child.skipLocationChange\" [replaceUrl]=\"child.replaceUrl\" [state]=\"child.state\">\n                        <span class=\"p-panelmenu-icon pi pi-fw\" [ngClass]=\"{'pi-angle-right':!child.expanded,'pi-angle-down':child.expanded}\" *ngIf=\"child.items\"></span\n                        ><span class=\"p-menuitem-icon\" [ngClass]=\"child.icon\" *ngIf=\"child.icon\"></span\n                        ><span class=\"p-menuitem-text\">{{child.label}}</span>\n                    </a>\n                    <p-panelMenuSub [item]=\"child\" [expanded]=\"child.expanded\" [transitionOptions]=\"transitionOptions\" *ngIf=\"child.items\"></p-panelMenuSub>\n                </li>\n            </ng-template>\n        </ul>\n    ",
                    animations: [
                        trigger('submenu', [
                            state('hidden', style({
                                height: '0',
                                overflow: 'hidden'
                            })),
                            state('visible', style({
                                height: '*'
                            })),
                            transition('visible <=> hidden', [style({ overflow: 'hidden' }), animate('{{transitionParams}}')]),
                            transition('void => *', animate(0))
                        ])
                    ],
                    encapsulation: ViewEncapsulation.None
                },] }
    ];
    PanelMenuSub.ctorParameters = function () { return [
        { type: ChangeDetectorRef }
    ]; };
    PanelMenuSub.propDecorators = {
        item: [{ type: Input }],
        expanded: [{ type: Input }],
        transitionOptions: [{ type: Input }],
        root: [{ type: Input }]
    };
    return PanelMenuSub;
}(BasePanelMenuItem));
var PanelMenu = /** @class */ (function (_super) {
    __extends(PanelMenu, _super);
    function PanelMenu(ref) {
        var _this = _super.call(this, ref) || this;
        _this.multiple = true;
        _this.transitionOptions = '400ms cubic-bezier(0.86, 0, 0.07, 1)';
        return _this;
    }
    PanelMenu.prototype.collapseAll = function () {
        var e_1, _a;
        try {
            for (var _b = __values(this.model), _c = _b.next(); !_c.done; _c = _b.next()) {
                var item = _c.value;
                if (item.expanded) {
                    item.expanded = false;
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
    };
    PanelMenu.prototype.handleClick = function (event, item) {
        var e_2, _a;
        if (!this.multiple) {
            try {
                for (var _b = __values(this.model), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var modelItem = _c.value;
                    if (item !== modelItem && modelItem.expanded) {
                        modelItem.expanded = false;
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
        this.animating = true;
        _super.prototype.handleClick.call(this, event, item);
    };
    PanelMenu.prototype.onToggleDone = function () {
        this.animating = false;
    };
    PanelMenu.ctorParameters = function () { return [
        { type: ChangeDetectorRef }
    ]; };
    PanelMenu.decorators = [
        { type: Component, args: [{
                    selector: 'p-panelMenu',
                    template: "\n        <div [class]=\"styleClass\" [ngStyle]=\"style\" [ngClass]=\"'p-panelmenu p-component'\">\n            <ng-container *ngFor=\"let item of model;let f=first;let l=last;\">\n                <div class=\"p-panelmenu-panel\" [ngClass]=\"{'p-hidden': item.visible === false}\">\n                    <div [ngClass]=\"{'p-component p-panelmenu-header':true, 'p-highlight':item.expanded,'p-disabled':item.disabled}\" [class]=\"item.styleClass\" [ngStyle]=\"item.style\">\n                        <a *ngIf=\"!item.routerLink\" [attr.href]=\"item.url\" (click)=\"handleClick($event,item)\" [attr.tabindex]=\"item.disabled ? null : '0'\" [attr.id]=\"item.id\"\n                           [attr.target]=\"item.target\" [attr.title]=\"item.title\" class=\"p-panelmenu-header-link\" [attr.aria-expanded]=\"item.expanded\" [attr.id]=\"item.id + '_header'\" [attr.aria-controls]=\"item.id +'_content'\">\n                        <span *ngIf=\"item.items\" class=\"p-panelmenu-icon pi\" [ngClass]=\"{'pi-chevron-right':!item.expanded,'pi-chevron-down':item.expanded}\"></span\n                        ><span class=\"p-menuitem-icon\" [ngClass]=\"item.icon\" *ngIf=\"item.icon\"></span\n                        ><span class=\"p-menuitem-text\">{{item.label}}</span>\n                        </a>\n                        <a *ngIf=\"item.routerLink\" [routerLink]=\"item.routerLink\" [queryParams]=\"item.queryParams\" [routerLinkActive]=\"'p-menuitem-link-active'\" [routerLinkActiveOptions]=\"item.routerLinkActiveOptions||{exact:false}\"\n                           (click)=\"handleClick($event,item)\" [attr.target]=\"item.target\" [attr.title]=\"item.title\" class=\"p-panelmenu-header-link\" [attr.id]=\"item.id\" [attr.tabindex]=\"item.disabled ? null : '0'\"\n                           [fragment]=\"item.fragment\" [queryParamsHandling]=\"item.queryParamsHandling\" [preserveFragment]=\"item.preserveFragment\" [skipLocationChange]=\"item.skipLocationChange\" [replaceUrl]=\"item.replaceUrl\" [state]=\"item.state\">\n                        <span *ngIf=\"item.items\" class=\"p-panelmenu-icon pi\" [ngClass]=\"{'pi-chevron-right':!item.expanded,'pi-chevron-down':item.expanded}\"></span\n                        ><span class=\"p-menuitem-icon\" [ngClass]=\"item.icon\" *ngIf=\"item.icon\"></span\n                        ><span class=\"p-menuitem-text\">{{item.label}}</span>\n                        </a>\n                    </div>\n                    <div *ngIf=\"item.items\" class=\"p-toggleable-content\" [@rootItem]=\"item.expanded ? {value: 'visible', params: {transitionParams: animating ? transitionOptions : '0ms', height: '*'}} : {value: 'hidden', params: {transitionParams: transitionOptions, height: '0'}}\"  (@rootItem.done)=\"onToggleDone()\">\n                        <div class=\"p-panelmenu-content\" role=\"region\" [attr.id]=\"item.id +'_content' \" [attr.aria-labelledby]=\"item.id +'_header'\">\n                            <p-panelMenuSub [item]=\"item\" [expanded]=\"true\" [transitionOptions]=\"transitionOptions\" [root]=\"true\"></p-panelMenuSub>\n                        </div>\n                    </div>\n                </div>\n            </ng-container>\n        </div>\n    ",
                    animations: [
                        trigger('rootItem', [
                            state('hidden', style({
                                height: '0',
                                overflow: 'hidden'
                            })),
                            state('visible', style({
                                height: '*'
                            })),
                            transition('visible <=> hidden', [style({ overflow: 'hidden' }), animate('{{transitionParams}}')]),
                            transition('void => *', animate(0))
                        ])
                    ],
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    styles: [".p-panelmenu .p-panelmenu-header-link{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:pointer;position:relative;text-decoration:none}.p-panelmenu .p-panelmenu-header-link:focus{z-index:1}.p-panelmenu .p-submenu-list{margin:0;padding:0;list-style:none}.p-panelmenu .p-menuitem-link{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:pointer;text-decoration:none}.p-panelmenu .p-menuitem-text{line-height:1}"]
                },] }
    ];
    PanelMenu.ctorParameters = function () { return [
        { type: ChangeDetectorRef }
    ]; };
    PanelMenu.propDecorators = {
        model: [{ type: Input }],
        style: [{ type: Input }],
        styleClass: [{ type: Input }],
        multiple: [{ type: Input }],
        transitionOptions: [{ type: Input }]
    };
    return PanelMenu;
}(BasePanelMenuItem));
var PanelMenuModule = /** @class */ (function () {
    function PanelMenuModule() {
    }
    PanelMenuModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule, RouterModule],
                    exports: [PanelMenu, RouterModule],
                    declarations: [PanelMenu, PanelMenuSub]
                },] }
    ];
    return PanelMenuModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { BasePanelMenuItem, PanelMenu, PanelMenuModule, PanelMenuSub };
//# sourceMappingURL=primeng-panelmenu.js.map
