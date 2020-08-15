import { EventEmitter, Component, ChangeDetectionStrategy, ViewEncapsulation, Input, Output, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

var Breadcrumb = /** @class */ (function () {
    function Breadcrumb() {
        this.onItemClick = new EventEmitter();
    }
    Breadcrumb.prototype.itemClick = function (event, item) {
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
        this.onItemClick.emit({
            originalEvent: event,
            item: item
        });
    };
    Breadcrumb.prototype.onHomeClick = function (event) {
        if (this.home) {
            this.itemClick(event, this.home);
        }
    };
    Breadcrumb.decorators = [
        { type: Component, args: [{
                    selector: 'p-breadcrumb',
                    template: "\n        <div [class]=\"styleClass\" [ngStyle]=\"style\" [ngClass]=\"'p-breadcrumb p-component'\">\n            <ul>\n                <li [class]=\"home.styleClass\" [ngClass]=\"{'p-breadcrumb-home': true, 'p-disabled':home.disabled}\" [ngStyle]=\"home.style\" *ngIf=\"home\">\n                    <a *ngIf=\"!home.routerLink\" [href]=\"home.url ? home.url : null\" class=\"p-menuitem-link\" (click)=\"itemClick($event, home)\" \n                        [attr.target]=\"home.target\" [attr.title]=\"home.title\" [attr.id]=\"home.id\" [attr.tabindex]=\"home.disabled ? null : '0'\">\n                        <span *ngIf=\"home.icon\" class=\"p-menuitem-icon\" [ngClass]=\"home.icon||'pi pi-home'\"></span>\n                        <span *ngIf=\"home.label\" class=\"p-menuitem-text\">{{home.label}}</span>\n                    </a>\n                    <a *ngIf=\"home.routerLink\" [routerLink]=\"home.routerLink\" [queryParams]=\"home.queryParams\" [routerLinkActive]=\"'p-menuitem-link-active'\" [routerLinkActiveOptions]=\"home.routerLinkActiveOptions||{exact:false}\" class=\"p-menuitem-link\" (click)=\"itemClick($event, home)\" \n                        [attr.target]=\"home.target\" [attr.title]=\"home.title\" [attr.id]=\"home.id\" [attr.tabindex]=\"home.disabled ? null : '0'\"\n                        [fragment]=\"home.fragment\" [queryParamsHandling]=\"home.queryParamsHandling\" [preserveFragment]=\"home.preserveFragment\" [skipLocationChange]=\"home.skipLocationChange\" [replaceUrl]=\"home.replaceUrl\" [state]=\"home.state\">\n                        <span *ngIf=\"home.icon\" class=\"p-menuitem-icon\" [ngClass]=\"home.icon||'pi pi-home'\"></span>\n                        <span *ngIf=\"home.label\" class=\"p-menuitem-text\">{{home.label}}</span>\n                    </a>\n                </li>\n                <li class=\"p-breadcrumb-chevron pi pi-chevron-right\" *ngIf=\"model&&home\"></li>\n                <ng-template ngFor let-item let-end=\"last\" [ngForOf]=\"model\">\n                    <li [class]=\"item.styleClass\" [ngStyle]=\"item.style\">\n                        <a *ngIf=\"!item.routerLink\" [attr.href]=\"item.url ? item.url : null\" class=\"p-menuitem-link\" (click)=\"itemClick($event, item)\" \n                            [attr.target]=\"item.target\" [attr.title]=\"item.title\" [attr.id]=\"item.id\" [attr.tabindex]=\"item.disabled ? null : '0'\">\n                            <span *ngIf=\"item.icon\" class=\"p-menuitem-icon\" [ngClass]=\"item.icon\"></span>\n                            <span *ngIf=\"item.label\" class=\"p-menuitem-text\">{{item.label}}</span>\n                        </a>\n                        <a *ngIf=\"item.routerLink\" [routerLink]=\"item.routerLink\" [queryParams]=\"item.queryParams\" [routerLinkActive]=\"'p-menuitem-link-active'\"  [routerLinkActiveOptions]=\"item.routerLinkActiveOptions||{exact:false}\" class=\"p-menuitem-link\" (click)=\"itemClick($event, item)\" \n                            [attr.target]=\"item.target\" [attr.title]=\"item.title\" [attr.id]=\"item.id\" [attr.tabindex]=\"item.disabled ? null : '0'\"\n                            [fragment]=\"item.fragment\" [queryParamsHandling]=\"item.queryParamsHandling\" [preserveFragment]=\"item.preserveFragment\" [skipLocationChange]=\"item.skipLocationChange\" [replaceUrl]=\"item.replaceUrl\" [state]=\"item.state\">\n                            <span *ngIf=\"item.icon\" class=\"p-menuitem-icon\" [ngClass]=\"item.icon\"></span>\n                            <span *ngIf=\"item.label\" class=\"p-menuitem-text\" >{{item.label}}</span>\n                        </a>\n                    </li>\n                    <li class=\"p-breadcrumb-chevron pi pi-chevron-right\" *ngIf=\"!end\"></li>\n                </ng-template>\n            </ul>\n        </div>\n    ",
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    styles: [".p-breadcrumb ul{margin:0;padding:0;list-style-type:none;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-wrap:wrap;flex-wrap:wrap}.p-breadcrumb .p-menuitem-text{line-height:1}.p-breadcrumb .p-menuitem-link{text-decoration:none}"]
                },] }
    ];
    Breadcrumb.propDecorators = {
        model: [{ type: Input }],
        style: [{ type: Input }],
        styleClass: [{ type: Input }],
        home: [{ type: Input }],
        onItemClick: [{ type: Output }]
    };
    return Breadcrumb;
}());
var BreadcrumbModule = /** @class */ (function () {
    function BreadcrumbModule() {
    }
    BreadcrumbModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule, RouterModule],
                    exports: [Breadcrumb, RouterModule],
                    declarations: [Breadcrumb]
                },] }
    ];
    return BreadcrumbModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { Breadcrumb, BreadcrumbModule };
//# sourceMappingURL=primeng-breadcrumb.js.map
