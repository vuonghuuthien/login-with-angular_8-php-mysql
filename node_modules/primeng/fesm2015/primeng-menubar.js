import { Renderer2, ChangeDetectorRef, Component, ViewEncapsulation, Input, ElementRef, ChangeDetectionStrategy, ContentChildren, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomHandler } from 'primeng/dom';
import { PrimeTemplate } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';

class MenubarSub {
    constructor(renderer, cd) {
        this.renderer = renderer;
        this.cd = cd;
        this.autoZIndex = true;
        this.baseZIndex = 0;
        this.menuHoverActive = false;
    }
    get parentActive() {
        return this._parentActive;
    }
    set parentActive(value) {
        if (!this.root) {
            this._parentActive = value;
            if (!value)
                this.activeItem = null;
        }
    }
    onItemMenuClick(event, item, menuitem) {
        this.menuClick = true;
        if (!this.autoDisplay) {
            if (menuitem.disabled) {
                return;
            }
            this.activeItem = this.activeMenu ? (this.activeMenu.isEqualNode(item) ? null : item) : item;
            let nextElement = item.children[0].nextElementSibling;
            if (nextElement) {
                let sublist = nextElement.children[0];
                if (this.autoZIndex) {
                    sublist.style.zIndex = String(this.baseZIndex + (++DomHandler.zindex));
                }
                if (this.root) {
                    sublist.style.top = DomHandler.getOuterHeight(item.children[0]) + 'px';
                    sublist.style.left = '0px';
                }
                else {
                    sublist.style.top = '0px';
                    sublist.style.left = DomHandler.getOuterWidth(item.children[0]) + 'px';
                }
            }
            this.menuHoverActive = this.activeMenu ? (!this.activeMenu.isEqualNode(item)) : true;
            this.activeMenu = this.activeMenu ? (this.activeMenu.isEqualNode(item) ? null : item) : item;
            this.bindEventListener();
        }
    }
    bindEventListener() {
        if (!this.documentClickListener) {
            this.documentClickListener = this.renderer.listen('document', 'click', (event) => {
                if (!this.menuClick) {
                    this.activeItem = null;
                    this.menuHoverActive = false;
                    this.activeMenu = false;
                    this.cd.markForCheck();
                }
                this.menuClick = false;
            });
        }
    }
    onItemMouseEnter(event, item, menuitem) {
        if (this.autoDisplay || (!this.autoDisplay && this.root && this.menuHoverActive)) {
            if (menuitem.disabled) {
                return;
            }
            if ((this.activeItem && !this.activeItem.isEqualNode(item) || !this.activeItem)) {
                this.activeItem = item;
                let nextElement = item.children[0].nextElementSibling;
                if (nextElement) {
                    let sublist = nextElement.children[0];
                    sublist.style.zIndex = String(++DomHandler.zindex);
                    if (this.root) {
                        sublist.style.top = DomHandler.getOuterHeight(item.children[0]) + 'px';
                        sublist.style.left = '0px';
                    }
                    else {
                        sublist.style.top = '0px';
                        sublist.style.left = DomHandler.getOuterWidth(item.children[0]) + 'px';
                    }
                }
                this.activeMenu = item;
            }
        }
    }
    itemClick(event, item) {
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
    }
    listClick(event) {
        if (this.autoDisplay) {
            this.activeItem = null;
        }
    }
    ngOnDestroy() {
        if (this.documentClickListener) {
            this.documentClickListener();
            this.documentClickListener = null;
        }
    }
}
MenubarSub.ctorParameters = () => [
    { type: Renderer2 },
    { type: ChangeDetectorRef }
];
MenubarSub.decorators = [
    { type: Component, args: [{
                selector: 'p-menubarSub',
                template: `
        <ul [ngClass]="{'p-submenu-list': !root, 'p-menubar-root-list': root}"
            (click)="listClick($event)">
            <ng-template ngFor let-child [ngForOf]="(root ? item : item.items)">
                <li *ngIf="child.separator" class="p-menu-separator" [ngClass]="{'p-hidden': child.visible === false}">
                <li *ngIf="!child.separator" #listItem [ngClass]="{'p-menuitem':true, 'p-menuitem-active':listItem==activeItem, 'p-hidden': child.visible === false}"
                        (mouseenter)="onItemMouseEnter($event,listItem,child)" (click)="onItemMenuClick($event, listItem, child)">
                    <a *ngIf="!child.routerLink" [attr.href]="child.url" [attr.data-automationid]="child.automationId" [attr.target]="child.target" [attr.title]="child.title" [attr.id]="child.id" (click)="itemClick($event, child)"
                         [ngClass]="{'p-menuitem-link':true,'p-disabled':child.disabled}" [ngStyle]="child.style" [class]="child.styleClass" 
                         [attr.tabindex]="child.disabled ? null : '0'" [attr.aria-haspopup]="item.items != null" [attr.aria-expanded]="item === activeItem" pRipple>
                        <span class="p-menuitem-icon" *ngIf="child.icon" [ngClass]="child.icon"></span>
                        <span class="p-menuitem-text">{{child.label}}</span>
                        <span class="p-submenu-icon pi" *ngIf="child.items" [ngClass]="{'pi-angle-down':root,'pi-angle-right':!root}"></span>
                    </a>
                    <a *ngIf="child.routerLink" [routerLink]="child.routerLink" [attr.data-automationid]="child.automationId" [queryParams]="child.queryParams" [routerLinkActive]="'p-menuitem-link-active'" [routerLinkActiveOptions]="child.routerLinkActiveOptions||{exact:false}"
                        [attr.target]="child.target" [attr.title]="child.title" [attr.id]="child.id" [attr.tabindex]="child.disabled ? null : '0'" role="menuitem"
                        (click)="itemClick($event, child)" [ngClass]="{'p-menuitem-link':true,'p-disabled':child.disabled}" [ngStyle]="child.style" [class]="child.styleClass"
                        [fragment]="child.fragment" [queryParamsHandling]="child.queryParamsHandling" [preserveFragment]="child.preserveFragment" [skipLocationChange]="child.skipLocationChange" [replaceUrl]="child.replaceUrl" [state]="child.state" pRipple>
                        <span class="p-menuitem-icon" *ngIf="child.icon" [ngClass]="child.icon"></span>
                        <span class="p-menuitem-text">{{child.label}}</span>
                        <span class="p-submenu-icon pi" *ngIf="child.items" [ngClass]="{'pi-angle-down':root,'pi-angle-right':!root}"></span>
                    </a>
                    <p-menubarSub [parentActive]="listItem==activeItem" [item]="child" *ngIf="child.items" [autoDisplay]="true"></p-menubarSub>
                </li>
            </ng-template>
        </ul>
    `,
                encapsulation: ViewEncapsulation.None
            },] }
];
MenubarSub.ctorParameters = () => [
    { type: Renderer2 },
    { type: ChangeDetectorRef }
];
MenubarSub.propDecorators = {
    item: [{ type: Input }],
    root: [{ type: Input }],
    autoDisplay: [{ type: Input }],
    autoZIndex: [{ type: Input }],
    baseZIndex: [{ type: Input }],
    parentActive: [{ type: Input }]
};
class Menubar {
    constructor(el, renderer) {
        this.el = el;
        this.renderer = renderer;
        this.autoZIndex = true;
        this.baseZIndex = 0;
    }
    get autoDisplay() {
        return this._autoDisplay;
    }
    set autoDisplay(_autoDisplay) {
        console.log("AutoDisplay property is deprecated and functionality is not available.");
    }
    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'start':
                    this.startTemplate = item.template;
                    break;
                case 'end':
                    this.endTemplate = item.template;
                    break;
            }
        });
    }
}
Menubar.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 }
];
Menubar.decorators = [
    { type: Component, args: [{
                selector: 'p-menubar',
                template: `
        <div [ngClass]="{'p-menubar p-component':true}" [class]="styleClass" [ngStyle]="style">
            <div class="p-menubar-start" *ngIf="startTemplate">
                <ng-container *ngTemplateOutlet="startTemplate"></ng-container>
            </div>
            <p-menubarSub [item]="model" root="root" [baseZIndex]="baseZIndex" [autoZIndex]="autoZIndex"></p-menubarSub>
            <div class="p-menubar-end" *ngIf="endTemplate; else legacy">
                <ng-container *ngTemplateOutlet="endTemplate"></ng-container>
            </div>
            <ng-template #legacy>
                <div class="p-menubar-end">
                    <ng-content></ng-content>
                </div>
            </ng-template>
        </div>
    `,
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                styles: [".p-menubar{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center}.p-menubar ul{margin:0;padding:0;list-style:none}.p-menubar .p-menuitem-link{cursor:pointer;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;text-decoration:none;overflow:hidden;position:relative}.p-menubar .p-menuitem-text{line-height:1}.p-menubar .p-menuitem{position:relative}.p-menubar-root-list{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center}.p-menubar-root-list>li ul{display:none;z-index:1}.p-menubar-root-list>.p-menuitem-active>p-menubarsub>.p-submenu-list{display:block}.p-menubar .p-submenu-list{display:none;position:absolute;z-index:1}.p-menubar .p-submenu-list>.p-menuitem-active>p-menubarsub>.p-submenu-list{display:block;left:100%;top:0}.p-menubar .p-submenu-list .p-menuitem-link .p-submenu-icon{margin-left:auto}.p-menubar .p-menubar-custom,.p-menubar .p-menubar-end{margin-left:auto;-ms-flex-item-align:center;-ms-grid-row-align:center;align-self:center}.p-menubar-button{display:none;cursor:pointer;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center}"]
            },] }
];
Menubar.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 }
];
Menubar.propDecorators = {
    model: [{ type: Input }],
    style: [{ type: Input }],
    styleClass: [{ type: Input }],
    autoZIndex: [{ type: Input }],
    baseZIndex: [{ type: Input }],
    templates: [{ type: ContentChildren, args: [PrimeTemplate,] }],
    autoDisplay: [{ type: Input }]
};
class MenubarModule {
}
MenubarModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule, RouterModule, RippleModule],
                exports: [Menubar, RouterModule],
                declarations: [Menubar, MenubarSub]
            },] }
];

/**
 * Generated bundle index. Do not edit.
 */

export { Menubar, MenubarModule, MenubarSub };
//# sourceMappingURL=primeng-menubar.js.map
