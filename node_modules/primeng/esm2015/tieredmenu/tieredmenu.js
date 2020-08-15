import { NgModule, Component, ElementRef, OnDestroy, Input, Renderer2, Inject, forwardRef, ChangeDetectorRef, AfterViewInit, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { DomHandler } from 'primeng/dom';
import { RippleModule } from 'primeng/ripple';
import { RouterModule } from '@angular/router';
export class TieredMenuSub {
    constructor(tieredMenu, cf, renderer) {
        this.cf = cf;
        this.renderer = renderer;
        this.autoZIndex = true;
        this.baseZIndex = 0;
        this.tieredMenu = tieredMenu;
    }
    get parentActive() {
        return this._parentActive;
    }
    set parentActive(value) {
        this._parentActive = value;
        if (!value) {
            this.activeItem = null;
        }
    }
    ngAfterViewInit() {
        if (this.root && !this.tieredMenu.popup) {
            this.bindDocumentClickListener();
        }
    }
    onItemMouseEnter(event, item, menuitem) {
        if (this.tieredMenu.popup || (!this.root || this.activeItem)) {
            if (menuitem.disabled) {
                return;
            }
            this.activeItem = item;
            let nextElement = item.children[0].nextElementSibling;
            if (nextElement) {
                let sublist = nextElement.children[0];
                if (this.autoZIndex) {
                    sublist.style.zIndex = String(this.baseZIndex + (++DomHandler.zindex));
                }
                sublist.style.zIndex = String(++DomHandler.zindex);
                sublist.style.top = '0px';
                sublist.style.left = DomHandler.getOuterWidth(item.children[0]) + 'px';
            }
        }
    }
    itemClick(event, item, menuitem) {
        if (menuitem.disabled) {
            event.preventDefault();
            return true;
        }
        if (!menuitem.url) {
            event.preventDefault();
        }
        if (menuitem.command) {
            menuitem.command({
                originalEvent: event,
                item: menuitem
            });
        }
        if (this.root && !this.activeItem && !this.tieredMenu.popup) {
            this.activeItem = item;
            let nextElement = item.children[0].nextElementSibling;
            if (nextElement) {
                let sublist = nextElement.children[0];
                if (this.autoZIndex) {
                    sublist.style.zIndex = String(this.baseZIndex + (++DomHandler.zindex));
                }
                sublist.style.zIndex = String(++DomHandler.zindex);
                sublist.style.top = '0px';
                sublist.style.left = DomHandler.getOuterWidth(item.children[0]) + 'px';
                this.rootItemClick = true;
            }
        }
        if (!menuitem.items && this.tieredMenu.popup) {
            this.tieredMenu.hide();
        }
    }
    listClick(event) {
        if (!this.rootItemClick) {
            this.activeItem = null;
        }
    }
    bindDocumentClickListener() {
        if (!this.documentClickListener) {
            this.documentClickListener = this.renderer.listen('document', 'click', () => {
                if (!this.rootItemClick) {
                    this.parentActive = false;
                    this.activeItem = null;
                    this.cf.markForCheck();
                }
                this.rootItemClick = false;
            });
        }
    }
    unbindDocumentClickListener() {
        if (this.documentClickListener) {
            this.documentClickListener();
            this.documentClickListener = null;
        }
    }
    ngOnDestroy() {
        if (this.root && !this.tieredMenu.popup) {
            this.unbindDocumentClickListener();
        }
    }
}
TieredMenuSub.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [forwardRef(() => TieredMenu),] }] },
    { type: ChangeDetectorRef },
    { type: Renderer2 }
];
TieredMenuSub.decorators = [
    { type: Component, args: [{
                selector: 'p-tieredMenuSub',
                template: `
        <ul [ngClass]="{'p-submenu-list': !root}" (click)="listClick($event)" role="menubar">
            <ng-template ngFor let-child [ngForOf]="(root ? item : item.items)">
                <li *ngIf="child.separator" class="p-menu-separator" [ngClass]="{'p-hidden': child.visible === false}" role="separator">
                <li *ngIf="!child.separator" #listItem [ngClass]="{'p-menuitem':true,'p-menuitem-active':listItem==activeItem,'p-hidden': child.visible === false}"
                    [class]="child.styleClass" [ngStyle]="child.style" role="none"
                    (mouseenter)="onItemMouseEnter($event, listItem, child)">
                    <a *ngIf="!child.routerLink" [attr.href]="child.url" class="p-menuitem-link" [attr.target]="child.target" [attr.tabindex]="child.disabled ? null : '0'" [attr.title]="child.title" [attr.id]="child.id" 
                        [ngClass]="{'p-disabled':child.disabled}" (click)="itemClick($event, listItem, child)" role="menuitem" [attr.aria-haspopup]="item.items != null" [attr.aria-expanded]="item === activeItem" pRipple>
                        <span class="p-menuitem-icon" *ngIf="child.icon" [ngClass]="child.icon"></span>
                        <span class="p-menuitem-text">{{child.label}}</span>
                        <span class="p-submenu-icon pi pi-angle-right" *ngIf="child.items"></span>
                    </a>
                    <a *ngIf="child.routerLink" [routerLink]="child.routerLink" role="menuitem" [queryParams]="child.queryParams" [routerLinkActive]="'p-menuitem-link-active'" role="menuitem" [attr.tabindex]="child.disabled ? null : '0'"
                        [routerLinkActiveOptions]="child.routerLinkActiveOptions||{exact:false}"
                        class="p-menuitem-link" [attr.target]="child.target" [attr.title]="child.title" [attr.id]="child.id"
                        [ngClass]="{'p-disabled':child.disabled}" (click)="itemClick($event, listItem, child)" pRipple
                        [fragment]="child.fragment" [queryParamsHandling]="child.queryParamsHandling" [preserveFragment]="child.preserveFragment" [skipLocationChange]="child.skipLocationChange" [replaceUrl]="child.replaceUrl" [state]="child.state">
                        <span class="p-menuitem-icon" *ngIf="child.icon" [ngClass]="child.icon"></span>
                        <span class="p-menuitem-text">{{child.label}}</span>
                        <span class="p-submenu-icon pi pi-angle-right" *ngIf="child.items"></span>
                    </a>
                    <p-tieredMenuSub [item]="child" *ngIf="child.items" [baseZIndex]="baseZIndex" [parentActive]="listItem==activeItem" [autoZIndex]="autoZIndex"></p-tieredMenuSub>
                </li>
            </ng-template>
        </ul>
    `,
                encapsulation: ViewEncapsulation.None,
                styles: [".p-tieredmenu-overlay{position:absolute}.p-tieredmenu ul{margin:0;padding:0;list-style:none}.p-tieredmenu .p-submenu-list{position:absolute;min-width:100%;z-index:1;display:none}.p-tieredmenu .p-menuitem-link{cursor:pointer;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;text-decoration:none;overflow:hidden;position:relative}.p-tieredmenu .p-menuitem-text{line-height:1}.p-tieredmenu .p-menuitem{position:relative}.p-tieredmenu .p-menuitem-link .p-submenu-icon{margin-left:auto}.p-tieredmenu .p-menuitem-active>p-tieredmenusub>.p-submenu-list{display:block;left:100%;top:0}"]
            },] }
];
TieredMenuSub.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [forwardRef(() => TieredMenu),] }] },
    { type: ChangeDetectorRef },
    { type: Renderer2 }
];
TieredMenuSub.propDecorators = {
    item: [{ type: Input }],
    root: [{ type: Input }],
    autoZIndex: [{ type: Input }],
    baseZIndex: [{ type: Input }],
    parentActive: [{ type: Input }]
};
export class TieredMenu {
    constructor(el, renderer, cd) {
        this.el = el;
        this.renderer = renderer;
        this.cd = cd;
        this.autoZIndex = true;
        this.baseZIndex = 0;
        this.showTransitionOptions = '.12s cubic-bezier(0, 0, 0.2, 1)';
        this.hideTransitionOptions = '.1s linear';
    }
    toggle(event) {
        if (this.visible)
            this.hide();
        else
            this.show(event);
        this.preventDocumentDefault = true;
    }
    show(event) {
        this.target = event.currentTarget;
        this.visible = true;
        this.parentActive = true;
        this.preventDocumentDefault = true;
        this.cd.markForCheck();
    }
    onOverlayAnimationStart(event) {
        switch (event.toState) {
            case 'visible':
                if (this.popup) {
                    this.container = event.element;
                    this.moveOnTop();
                    this.appendOverlay();
                    DomHandler.absolutePosition(this.container, this.target);
                    this.bindDocumentClickListener();
                    this.bindDocumentResizeListener();
                }
                break;
            case 'void':
                this.onOverlayHide();
                break;
        }
    }
    appendOverlay() {
        if (this.appendTo) {
            if (this.appendTo === 'body')
                document.body.appendChild(this.container);
            else
                DomHandler.appendChild(this.container, this.appendTo);
        }
    }
    restoreOverlayAppend() {
        if (this.container && this.appendTo) {
            this.el.nativeElement.appendChild(this.container);
        }
    }
    moveOnTop() {
        if (this.autoZIndex) {
            this.container.style.zIndex = String(this.baseZIndex + (++DomHandler.zindex));
        }
    }
    hide() {
        this.visible = false;
        this.parentActive = false;
        this.cd.markForCheck();
    }
    onWindowResize() {
        this.hide();
    }
    bindDocumentClickListener() {
        if (!this.documentClickListener) {
            this.documentClickListener = this.renderer.listen('document', 'click', () => {
                if (!this.preventDocumentDefault && this.popup) {
                    this.hide();
                }
                this.preventDocumentDefault = false;
            });
        }
    }
    unbindDocumentClickListener() {
        if (this.documentClickListener) {
            this.documentClickListener();
            this.documentClickListener = null;
        }
    }
    bindDocumentResizeListener() {
        this.documentResizeListener = this.onWindowResize.bind(this);
        window.addEventListener('resize', this.documentResizeListener);
    }
    unbindDocumentResizeListener() {
        if (this.documentResizeListener) {
            window.removeEventListener('resize', this.documentResizeListener);
            this.documentResizeListener = null;
        }
    }
    onOverlayHide() {
        this.unbindDocumentClickListener();
        this.unbindDocumentResizeListener();
        this.preventDocumentDefault = false;
        this.target = null;
    }
    ngOnDestroy() {
        if (this.popup) {
            this.restoreOverlayAppend();
            this.onOverlayHide();
        }
    }
}
TieredMenu.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: ChangeDetectorRef }
];
TieredMenu.decorators = [
    { type: Component, args: [{
                selector: 'p-tieredMenu',
                template: `
        <div [ngClass]="{'p-tieredmenu p-component':true, 'p-tieredmenu-overlay':popup}" [class]="styleClass" [ngStyle]="style"
            [@overlayAnimation]="{value: 'visible', params: {showTransitionParams: showTransitionOptions, hideTransitionParams: hideTransitionOptions}}" [@.disabled]="popup !== true" 
            (@overlayAnimation.start)="onOverlayAnimationStart($event)" (click)="preventDocumentDefault=true" *ngIf="!popup || visible">
            <p-tieredMenuSub [item]="model" root="root" [parentActive]="parentActive" [baseZIndex]="baseZIndex" [autoZIndex]="autoZIndex"></p-tieredMenuSub>
        </div>
    `,
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
                encapsulation: ViewEncapsulation.None
            },] }
];
TieredMenu.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: ChangeDetectorRef }
];
TieredMenu.propDecorators = {
    model: [{ type: Input }],
    popup: [{ type: Input }],
    style: [{ type: Input }],
    styleClass: [{ type: Input }],
    appendTo: [{ type: Input }],
    autoZIndex: [{ type: Input }],
    baseZIndex: [{ type: Input }],
    showTransitionOptions: [{ type: Input }],
    hideTransitionOptions: [{ type: Input }]
};
export class TieredMenuModule {
}
TieredMenuModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule, RouterModule, RippleModule],
                exports: [TieredMenu, RouterModule],
                declarations: [TieredMenu, TieredMenuSub]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGllcmVkbWVudS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL3ByaW1lbmcvdGllcmVkbWVudS8iLCJzb3VyY2VzIjpbInRpZXJlZG1lbnUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFFBQVEsRUFBQyxTQUFTLEVBQUMsVUFBVSxFQUFDLFNBQVMsRUFBQyxLQUFLLEVBQUMsU0FBUyxFQUFDLE1BQU0sRUFBQyxVQUFVLEVBQUMsaUJBQWlCLEVBQUMsYUFBYSxFQUFDLHVCQUF1QixFQUFFLGlCQUFpQixFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ25MLE9BQU8sRUFBQyxPQUFPLEVBQUMsS0FBSyxFQUFDLFVBQVUsRUFBQyxPQUFPLEVBQWdCLE1BQU0scUJBQXFCLENBQUM7QUFDcEYsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQzdDLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFFdkMsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQzVDLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQWtDN0MsTUFBTSxPQUFPLGFBQWE7SUFtQ3RCLFlBQWtELFVBQVUsRUFBVSxFQUFxQixFQUFTLFFBQW1CO1FBQWpELE9BQUUsR0FBRixFQUFFLENBQW1CO1FBQVMsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQTdCOUcsZUFBVSxHQUFZLElBQUksQ0FBQztRQUUzQixlQUFVLEdBQVcsQ0FBQyxDQUFDO1FBNEI1QixJQUFJLENBQUMsVUFBVSxHQUFHLFVBQXdCLENBQUM7SUFDL0MsQ0FBQztJQTNCRCxJQUFhLFlBQVk7UUFDckIsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDO0lBQzlCLENBQUM7SUFDRCxJQUFJLFlBQVksQ0FBQyxLQUFLO1FBQ2xCLElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDO1FBRTNCLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDUixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztTQUMxQjtJQUNMLENBQUM7SUFVRCxlQUFlO1FBQ1gsSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUU7WUFDckMsSUFBSSxDQUFDLHlCQUF5QixFQUFFLENBQUM7U0FDcEM7SUFDTCxDQUFDO0lBUUQsZ0JBQWdCLENBQUMsS0FBWSxFQUFFLElBQW1CLEVBQUUsUUFBa0I7UUFDbEUsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUU7WUFDMUQsSUFBSSxRQUFRLENBQUMsUUFBUSxFQUFFO2dCQUNuQixPQUFPO2FBQ1Y7WUFFRCxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztZQUN2QixJQUFJLFdBQVcsR0FBZ0MsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQztZQUNuRixJQUFJLFdBQVcsRUFBRTtnQkFDYixJQUFJLE9BQU8sR0FBK0IsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbEUsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO29CQUNqQixPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLEVBQUUsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7aUJBQzFFO2dCQUNELE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxFQUFFLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFFbkQsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDO2dCQUMxQixPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxVQUFVLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7YUFDMUU7U0FDSjtJQUNMLENBQUM7SUFFRCxTQUFTLENBQUMsS0FBWSxFQUFFLElBQW1CLEVBQUUsUUFBa0I7UUFDM0QsSUFBSSxRQUFRLENBQUMsUUFBUSxFQUFFO1lBQ25CLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUN2QixPQUFPLElBQUksQ0FBQztTQUNmO1FBRUQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUU7WUFDZixLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7U0FDMUI7UUFFRCxJQUFJLFFBQVEsQ0FBQyxPQUFPLEVBQUU7WUFDbEIsUUFBUSxDQUFDLE9BQU8sQ0FBQztnQkFDYixhQUFhLEVBQUUsS0FBSztnQkFDcEIsSUFBSSxFQUFFLFFBQVE7YUFDakIsQ0FBQyxDQUFDO1NBQ047UUFFRCxJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUc7WUFDMUQsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7WUFDdkIsSUFBSSxXQUFXLEdBQWdDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsa0JBQWtCLENBQUM7WUFDbkYsSUFBSSxXQUFXLEVBQUU7Z0JBQ2IsSUFBSSxPQUFPLEdBQStCLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xFLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtvQkFDakIsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2lCQUMxRTtnQkFDRCxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsRUFBRSxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBRW5ELE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQztnQkFDMUIsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsVUFBVSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO2dCQUV2RSxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQzthQUM3QjtTQUNKO1FBRUQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUU7WUFDMUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUMxQjtJQUNMLENBQUM7SUFFRCxTQUFTLENBQUMsS0FBWTtRQUNsQixJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUNyQixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztTQUMxQjtJQUNMLENBQUM7SUFFRCx5QkFBeUI7UUFDckIsSUFBSSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsRUFBRTtZQUM3QixJQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUU7Z0JBQ3hFLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFO29CQUNyQixJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztvQkFDMUIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7b0JBQ3ZCLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLENBQUM7aUJBQzFCO2dCQUVELElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDO1lBQy9CLENBQUMsQ0FBQyxDQUFDO1NBQ047SUFDTCxDQUFDO0lBRUQsMkJBQTJCO1FBQ3ZCLElBQUksSUFBSSxDQUFDLHFCQUFxQixFQUFFO1lBQzVCLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1lBQzdCLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxJQUFJLENBQUM7U0FDckM7SUFDTCxDQUFDO0lBRUQsV0FBVztRQUNQLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFO1lBQ3JDLElBQUksQ0FBQywyQkFBMkIsRUFBRSxDQUFDO1NBQ3RDO0lBQ0wsQ0FBQzs7OzRDQWpHWSxNQUFNLFNBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBQztZQUEwQixpQkFBaUI7WUFBbUIsU0FBUzs7O1lBbkUxSCxTQUFTLFNBQUM7Z0JBQ1AsUUFBUSxFQUFFLGlCQUFpQjtnQkFDM0IsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztLQTBCVDtnQkFDRCxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTs7YUFFeEM7Ozs0Q0FvQ2dCLE1BQU0sU0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsVUFBVSxDQUFDO1lBM0U4QixpQkFBaUI7WUFBN0MsU0FBUzs7O21CQTBDMUQsS0FBSzttQkFFTCxLQUFLO3lCQUVMLEtBQUs7eUJBRUwsS0FBSzsyQkFFTCxLQUFLOztBQW9KVixNQUFNLE9BQU8sVUFBVTtJQWtDbkIsWUFBbUIsRUFBYyxFQUFTLFFBQW1CLEVBQVMsRUFBcUI7UUFBeEUsT0FBRSxHQUFGLEVBQUUsQ0FBWTtRQUFTLGFBQVEsR0FBUixRQUFRLENBQVc7UUFBUyxPQUFFLEdBQUYsRUFBRSxDQUFtQjtRQXRCbEYsZUFBVSxHQUFZLElBQUksQ0FBQztRQUUzQixlQUFVLEdBQVcsQ0FBQyxDQUFDO1FBRXZCLDBCQUFxQixHQUFXLGlDQUFpQyxDQUFDO1FBRWxFLDBCQUFxQixHQUFXLFlBQVksQ0FBQztJQWdCd0MsQ0FBQztJQUUvRixNQUFNLENBQUMsS0FBSztRQUNSLElBQUksSUFBSSxDQUFDLE9BQU87WUFDWixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7O1lBRVosSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUVyQixJQUFJLENBQUMsc0JBQXNCLEdBQUcsSUFBSSxDQUFDO0lBQ3ZDLENBQUM7SUFFRCxJQUFJLENBQUMsS0FBSztRQUNOLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQztRQUNsQyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztRQUNwQixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztRQUN6QixJQUFJLENBQUMsc0JBQXNCLEdBQUcsSUFBSSxDQUFDO1FBQ25DLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDM0IsQ0FBQztJQUVELHVCQUF1QixDQUFDLEtBQXFCO1FBQ3pDLFFBQU8sS0FBSyxDQUFDLE9BQU8sRUFBRTtZQUNsQixLQUFLLFNBQVM7Z0JBQ1YsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO29CQUNaLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztvQkFDL0IsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO29CQUNqQixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7b0JBQ3JCLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFDekQsSUFBSSxDQUFDLHlCQUF5QixFQUFFLENBQUM7b0JBQ2pDLElBQUksQ0FBQywwQkFBMEIsRUFBRSxDQUFDO2lCQUNyQztnQkFDTCxNQUFNO1lBRU4sS0FBSyxNQUFNO2dCQUNQLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFDekIsTUFBTTtTQUNUO0lBQ0wsQ0FBQztJQUVELGFBQWE7UUFDVCxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDZixJQUFJLElBQUksQ0FBQyxRQUFRLEtBQUssTUFBTTtnQkFDeEIsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDOztnQkFFMUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUM3RDtJQUNMLENBQUM7SUFFRCxvQkFBb0I7UUFDaEIsSUFBSSxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDakMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUNyRDtJQUNMLENBQUM7SUFFRCxTQUFTO1FBQ0wsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ2pCLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLEVBQUUsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7U0FDakY7SUFDTCxDQUFDO0lBRUQsSUFBSTtRQUNBLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO1FBQ3JCLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO1FBQzFCLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDM0IsQ0FBQztJQUVELGNBQWM7UUFDVixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDaEIsQ0FBQztJQUVELHlCQUF5QjtRQUNyQixJQUFJLENBQUMsSUFBSSxDQUFDLHFCQUFxQixFQUFFO1lBQzdCLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRTtnQkFDeEUsSUFBSSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO29CQUM1QyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7aUJBQ2Y7Z0JBRUQsSUFBSSxDQUFDLHNCQUFzQixHQUFHLEtBQUssQ0FBQztZQUN4QyxDQUFDLENBQUMsQ0FBQztTQUNOO0lBQ0wsQ0FBQztJQUVELDJCQUEyQjtRQUN2QixJQUFJLElBQUksQ0FBQyxxQkFBcUIsRUFBRTtZQUM1QixJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztZQUM3QixJQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFDO1NBQ3JDO0lBQ0wsQ0FBQztJQUVELDBCQUEwQjtRQUN0QixJQUFJLENBQUMsc0JBQXNCLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDN0QsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsc0JBQXNCLENBQUMsQ0FBQztJQUNuRSxDQUFDO0lBRUQsNEJBQTRCO1FBQ3hCLElBQUksSUFBSSxDQUFDLHNCQUFzQixFQUFFO1lBQzdCLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUM7WUFDbEUsSUFBSSxDQUFDLHNCQUFzQixHQUFHLElBQUksQ0FBQztTQUN0QztJQUNMLENBQUM7SUFFRCxhQUFhO1FBQ1QsSUFBSSxDQUFDLDJCQUEyQixFQUFFLENBQUM7UUFDbkMsSUFBSSxDQUFDLDRCQUE0QixFQUFFLENBQUM7UUFDcEMsSUFBSSxDQUFDLHNCQUFzQixHQUFHLEtBQUssQ0FBQztRQUNwQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztJQUN2QixDQUFDO0lBRUQsV0FBVztRQUNQLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNaLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1lBQzVCLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztTQUN4QjtJQUNMLENBQUM7OztZQWhIc0IsVUFBVTtZQUFtQixTQUFTO1lBQWEsaUJBQWlCOzs7WUF6RDlGLFNBQVMsU0FBQztnQkFDUCxRQUFRLEVBQUUsY0FBYztnQkFDeEIsUUFBUSxFQUFFOzs7Ozs7S0FNVDtnQkFDRCxVQUFVLEVBQUU7b0JBQ1IsT0FBTyxDQUFDLGtCQUFrQixFQUFFO3dCQUN4QixVQUFVLENBQUMsUUFBUSxFQUFFOzRCQUNqQixLQUFLLENBQUMsRUFBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxhQUFhLEVBQUMsQ0FBQzs0QkFDN0MsT0FBTyxDQUFDLDBCQUEwQixDQUFDO3lCQUNwQyxDQUFDO3dCQUNGLFVBQVUsQ0FBQyxRQUFRLEVBQUU7NEJBQ25CLE9BQU8sQ0FBQywwQkFBMEIsRUFBRSxLQUFLLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQzt5QkFDM0QsQ0FBQztxQkFDUCxDQUFDO2lCQUNMO2dCQUNELGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2dCQUMvQyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTthQUN4Qzs7O1lBck0wQixVQUFVO1lBQWlCLFNBQVM7WUFBbUIsaUJBQWlCOzs7b0JBd005RixLQUFLO29CQUVMLEtBQUs7b0JBRUwsS0FBSzt5QkFFTCxLQUFLO3VCQUVMLEtBQUs7eUJBRUwsS0FBSzt5QkFFTCxLQUFLO29DQUVMLEtBQUs7b0NBRUwsS0FBSzs7QUF5SVYsTUFBTSxPQUFPLGdCQUFnQjs7O1lBTDVCLFFBQVEsU0FBQztnQkFDTixPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUMsWUFBWSxFQUFDLFlBQVksQ0FBQztnQkFDakQsT0FBTyxFQUFFLENBQUMsVUFBVSxFQUFDLFlBQVksQ0FBQztnQkFDbEMsWUFBWSxFQUFFLENBQUMsVUFBVSxFQUFDLGFBQWEsQ0FBQzthQUMzQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7TmdNb2R1bGUsQ29tcG9uZW50LEVsZW1lbnRSZWYsT25EZXN0cm95LElucHV0LFJlbmRlcmVyMixJbmplY3QsZm9yd2FyZFJlZixDaGFuZ2VEZXRlY3RvclJlZixBZnRlclZpZXdJbml0LENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBWaWV3RW5jYXBzdWxhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge3RyaWdnZXIsc3R5bGUsdHJhbnNpdGlvbixhbmltYXRlLEFuaW1hdGlvbkV2ZW50fSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtEb21IYW5kbGVyfSBmcm9tICdwcmltZW5nL2RvbSc7XG5pbXBvcnQge01lbnVJdGVtfSBmcm9tICdwcmltZW5nL2FwaSc7XG5pbXBvcnQge1JpcHBsZU1vZHVsZX0gZnJvbSAncHJpbWVuZy9yaXBwbGUnO1xuaW1wb3J0IHtSb3V0ZXJNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAncC10aWVyZWRNZW51U3ViJyxcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgICA8dWwgW25nQ2xhc3NdPVwieydwLXN1Ym1lbnUtbGlzdCc6ICFyb290fVwiIChjbGljayk9XCJsaXN0Q2xpY2soJGV2ZW50KVwiIHJvbGU9XCJtZW51YmFyXCI+XG4gICAgICAgICAgICA8bmctdGVtcGxhdGUgbmdGb3IgbGV0LWNoaWxkIFtuZ0Zvck9mXT1cIihyb290ID8gaXRlbSA6IGl0ZW0uaXRlbXMpXCI+XG4gICAgICAgICAgICAgICAgPGxpICpuZ0lmPVwiY2hpbGQuc2VwYXJhdG9yXCIgY2xhc3M9XCJwLW1lbnUtc2VwYXJhdG9yXCIgW25nQ2xhc3NdPVwieydwLWhpZGRlbic6IGNoaWxkLnZpc2libGUgPT09IGZhbHNlfVwiIHJvbGU9XCJzZXBhcmF0b3JcIj5cbiAgICAgICAgICAgICAgICA8bGkgKm5nSWY9XCIhY2hpbGQuc2VwYXJhdG9yXCIgI2xpc3RJdGVtIFtuZ0NsYXNzXT1cInsncC1tZW51aXRlbSc6dHJ1ZSwncC1tZW51aXRlbS1hY3RpdmUnOmxpc3RJdGVtPT1hY3RpdmVJdGVtLCdwLWhpZGRlbic6IGNoaWxkLnZpc2libGUgPT09IGZhbHNlfVwiXG4gICAgICAgICAgICAgICAgICAgIFtjbGFzc109XCJjaGlsZC5zdHlsZUNsYXNzXCIgW25nU3R5bGVdPVwiY2hpbGQuc3R5bGVcIiByb2xlPVwibm9uZVwiXG4gICAgICAgICAgICAgICAgICAgIChtb3VzZWVudGVyKT1cIm9uSXRlbU1vdXNlRW50ZXIoJGV2ZW50LCBsaXN0SXRlbSwgY2hpbGQpXCI+XG4gICAgICAgICAgICAgICAgICAgIDxhICpuZ0lmPVwiIWNoaWxkLnJvdXRlckxpbmtcIiBbYXR0ci5ocmVmXT1cImNoaWxkLnVybFwiIGNsYXNzPVwicC1tZW51aXRlbS1saW5rXCIgW2F0dHIudGFyZ2V0XT1cImNoaWxkLnRhcmdldFwiIFthdHRyLnRhYmluZGV4XT1cImNoaWxkLmRpc2FibGVkID8gbnVsbCA6ICcwJ1wiIFthdHRyLnRpdGxlXT1cImNoaWxkLnRpdGxlXCIgW2F0dHIuaWRdPVwiY2hpbGQuaWRcIiBcbiAgICAgICAgICAgICAgICAgICAgICAgIFtuZ0NsYXNzXT1cInsncC1kaXNhYmxlZCc6Y2hpbGQuZGlzYWJsZWR9XCIgKGNsaWNrKT1cIml0ZW1DbGljaygkZXZlbnQsIGxpc3RJdGVtLCBjaGlsZClcIiByb2xlPVwibWVudWl0ZW1cIiBbYXR0ci5hcmlhLWhhc3BvcHVwXT1cIml0ZW0uaXRlbXMgIT0gbnVsbFwiIFthdHRyLmFyaWEtZXhwYW5kZWRdPVwiaXRlbSA9PT0gYWN0aXZlSXRlbVwiIHBSaXBwbGU+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInAtbWVudWl0ZW0taWNvblwiICpuZ0lmPVwiY2hpbGQuaWNvblwiIFtuZ0NsYXNzXT1cImNoaWxkLmljb25cIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInAtbWVudWl0ZW0tdGV4dFwiPnt7Y2hpbGQubGFiZWx9fTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicC1zdWJtZW51LWljb24gcGkgcGktYW5nbGUtcmlnaHRcIiAqbmdJZj1cImNoaWxkLml0ZW1zXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgICAgIDxhICpuZ0lmPVwiY2hpbGQucm91dGVyTGlua1wiIFtyb3V0ZXJMaW5rXT1cImNoaWxkLnJvdXRlckxpbmtcIiByb2xlPVwibWVudWl0ZW1cIiBbcXVlcnlQYXJhbXNdPVwiY2hpbGQucXVlcnlQYXJhbXNcIiBbcm91dGVyTGlua0FjdGl2ZV09XCIncC1tZW51aXRlbS1saW5rLWFjdGl2ZSdcIiByb2xlPVwibWVudWl0ZW1cIiBbYXR0ci50YWJpbmRleF09XCJjaGlsZC5kaXNhYmxlZCA/IG51bGwgOiAnMCdcIlxuICAgICAgICAgICAgICAgICAgICAgICAgW3JvdXRlckxpbmtBY3RpdmVPcHRpb25zXT1cImNoaWxkLnJvdXRlckxpbmtBY3RpdmVPcHRpb25zfHx7ZXhhY3Q6ZmFsc2V9XCJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVwicC1tZW51aXRlbS1saW5rXCIgW2F0dHIudGFyZ2V0XT1cImNoaWxkLnRhcmdldFwiIFthdHRyLnRpdGxlXT1cImNoaWxkLnRpdGxlXCIgW2F0dHIuaWRdPVwiY2hpbGQuaWRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgW25nQ2xhc3NdPVwieydwLWRpc2FibGVkJzpjaGlsZC5kaXNhYmxlZH1cIiAoY2xpY2spPVwiaXRlbUNsaWNrKCRldmVudCwgbGlzdEl0ZW0sIGNoaWxkKVwiIHBSaXBwbGVcbiAgICAgICAgICAgICAgICAgICAgICAgIFtmcmFnbWVudF09XCJjaGlsZC5mcmFnbWVudFwiIFtxdWVyeVBhcmFtc0hhbmRsaW5nXT1cImNoaWxkLnF1ZXJ5UGFyYW1zSGFuZGxpbmdcIiBbcHJlc2VydmVGcmFnbWVudF09XCJjaGlsZC5wcmVzZXJ2ZUZyYWdtZW50XCIgW3NraXBMb2NhdGlvbkNoYW5nZV09XCJjaGlsZC5za2lwTG9jYXRpb25DaGFuZ2VcIiBbcmVwbGFjZVVybF09XCJjaGlsZC5yZXBsYWNlVXJsXCIgW3N0YXRlXT1cImNoaWxkLnN0YXRlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInAtbWVudWl0ZW0taWNvblwiICpuZ0lmPVwiY2hpbGQuaWNvblwiIFtuZ0NsYXNzXT1cImNoaWxkLmljb25cIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInAtbWVudWl0ZW0tdGV4dFwiPnt7Y2hpbGQubGFiZWx9fTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicC1zdWJtZW51LWljb24gcGkgcGktYW5nbGUtcmlnaHRcIiAqbmdJZj1cImNoaWxkLml0ZW1zXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgICAgIDxwLXRpZXJlZE1lbnVTdWIgW2l0ZW1dPVwiY2hpbGRcIiAqbmdJZj1cImNoaWxkLml0ZW1zXCIgW2Jhc2VaSW5kZXhdPVwiYmFzZVpJbmRleFwiIFtwYXJlbnRBY3RpdmVdPVwibGlzdEl0ZW09PWFjdGl2ZUl0ZW1cIiBbYXV0b1pJbmRleF09XCJhdXRvWkluZGV4XCI+PC9wLXRpZXJlZE1lbnVTdWI+XG4gICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICAgIDwvdWw+XG4gICAgYCxcbiAgICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICAgIHN0eWxlVXJsczogWycuL3RpZXJlZG1lbnUuY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgVGllcmVkTWVudVN1YiBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG5cbiAgICBASW5wdXQoKSBpdGVtOiBNZW51SXRlbTtcbiAgICBcbiAgICBASW5wdXQoKSByb290OiBib29sZWFuO1xuXG4gICAgQElucHV0KCkgYXV0b1pJbmRleDogYm9vbGVhbiA9IHRydWU7XG4gICAgXG4gICAgQElucHV0KCkgYmFzZVpJbmRleDogbnVtYmVyID0gMDtcblxuICAgIEBJbnB1dCgpIGdldCBwYXJlbnRBY3RpdmUoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wYXJlbnRBY3RpdmU7XG4gICAgfVxuICAgIHNldCBwYXJlbnRBY3RpdmUodmFsdWUpIHtcbiAgICAgICAgdGhpcy5fcGFyZW50QWN0aXZlID0gdmFsdWU7XG5cbiAgICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5hY3RpdmVJdGVtID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRpZXJlZE1lbnU6IFRpZXJlZE1lbnU7XG5cbiAgICBfcGFyZW50QWN0aXZlOiBib29sZWFuO1xuXG4gICAgcm9vdEl0ZW1DbGljazogYm9vbGVhbjtcblxuICAgIGRvY3VtZW50Q2xpY2tMaXN0ZW5lcjogYW55O1xuXG4gICAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgICAgICBpZiAodGhpcy5yb290ICYmICF0aGlzLnRpZXJlZE1lbnUucG9wdXApIHtcbiAgICAgICAgICAgIHRoaXMuYmluZERvY3VtZW50Q2xpY2tMaXN0ZW5lcigpO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIGNvbnN0cnVjdG9yKEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBUaWVyZWRNZW51KSkgdGllcmVkTWVudSwgcHJpdmF0ZSBjZjogQ2hhbmdlRGV0ZWN0b3JSZWYsIHB1YmxpYyByZW5kZXJlcjogUmVuZGVyZXIyKSB7XG4gICAgICAgIHRoaXMudGllcmVkTWVudSA9IHRpZXJlZE1lbnUgYXMgVGllcmVkTWVudTtcbiAgICB9XG5cbiAgICBhY3RpdmVJdGVtOiBIVE1MTElFbGVtZW50O1xuXG4gICAgb25JdGVtTW91c2VFbnRlcihldmVudDogRXZlbnQsIGl0ZW06IEhUTUxMSUVsZW1lbnQsIG1lbnVpdGVtOiBNZW51SXRlbSkge1xuICAgICAgICBpZiAodGhpcy50aWVyZWRNZW51LnBvcHVwIHx8ICghdGhpcy5yb290IHx8IHRoaXMuYWN0aXZlSXRlbSkpIHtcbiAgICAgICAgICAgIGlmIChtZW51aXRlbS5kaXNhYmxlZCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5hY3RpdmVJdGVtID0gaXRlbTtcbiAgICAgICAgICAgIGxldCBuZXh0RWxlbWVudDogIEhUTUxFbGVtZW50ID0gIDxIVE1MRWxlbWVudD4gaXRlbS5jaGlsZHJlblswXS5uZXh0RWxlbWVudFNpYmxpbmc7XG4gICAgICAgICAgICBpZiAobmV4dEVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICBsZXQgc3VibGlzdDogIEhUTUxFbGVtZW50ID0gPEhUTUxFbGVtZW50PiBuZXh0RWxlbWVudC5jaGlsZHJlblswXTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5hdXRvWkluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgIHN1Ymxpc3Quc3R5bGUuekluZGV4ID0gU3RyaW5nKHRoaXMuYmFzZVpJbmRleCArICgrK0RvbUhhbmRsZXIuemluZGV4KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHN1Ymxpc3Quc3R5bGUuekluZGV4ID0gU3RyaW5nKCsrRG9tSGFuZGxlci56aW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHN1Ymxpc3Quc3R5bGUudG9wID0gJzBweCc7XG4gICAgICAgICAgICAgICAgc3VibGlzdC5zdHlsZS5sZWZ0ID0gRG9tSGFuZGxlci5nZXRPdXRlcldpZHRoKGl0ZW0uY2hpbGRyZW5bMF0pICsgJ3B4JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBpdGVtQ2xpY2soZXZlbnQ6IEV2ZW50LCBpdGVtOiBIVE1MTElFbGVtZW50LCBtZW51aXRlbTogTWVudUl0ZW0pwqB7XG4gICAgICAgIGlmIChtZW51aXRlbS5kaXNhYmxlZCkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpZiAoIW1lbnVpdGVtLnVybCkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYgKG1lbnVpdGVtLmNvbW1hbmQpIHsgICAgICAgICAgICBcbiAgICAgICAgICAgIG1lbnVpdGVtLmNvbW1hbmQoe1xuICAgICAgICAgICAgICAgIG9yaWdpbmFsRXZlbnQ6IGV2ZW50LFxuICAgICAgICAgICAgICAgIGl0ZW06IG1lbnVpdGVtXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnJvb3QgJiYgIXRoaXMuYWN0aXZlSXRlbSAmJiAhdGhpcy50aWVyZWRNZW51LnBvcHVwICkge1xuICAgICAgICAgICAgdGhpcy5hY3RpdmVJdGVtID0gaXRlbTtcbiAgICAgICAgICAgIGxldCBuZXh0RWxlbWVudDogIEhUTUxFbGVtZW50ID0gIDxIVE1MRWxlbWVudD4gaXRlbS5jaGlsZHJlblswXS5uZXh0RWxlbWVudFNpYmxpbmc7XG4gICAgICAgICAgICBpZiAobmV4dEVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICBsZXQgc3VibGlzdDogIEhUTUxFbGVtZW50ID0gPEhUTUxFbGVtZW50PiBuZXh0RWxlbWVudC5jaGlsZHJlblswXTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5hdXRvWkluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgIHN1Ymxpc3Quc3R5bGUuekluZGV4ID0gU3RyaW5nKHRoaXMuYmFzZVpJbmRleCArICgrK0RvbUhhbmRsZXIuemluZGV4KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHN1Ymxpc3Quc3R5bGUuekluZGV4ID0gU3RyaW5nKCsrRG9tSGFuZGxlci56aW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHN1Ymxpc3Quc3R5bGUudG9wID0gJzBweCc7XG4gICAgICAgICAgICAgICAgc3VibGlzdC5zdHlsZS5sZWZ0ID0gRG9tSGFuZGxlci5nZXRPdXRlcldpZHRoKGl0ZW0uY2hpbGRyZW5bMF0pICsgJ3B4JztcblxuICAgICAgICAgICAgICAgIHRoaXMucm9vdEl0ZW1DbGljayA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIW1lbnVpdGVtLml0ZW1zICYmIHRoaXMudGllcmVkTWVudS5wb3B1cCkge1xuICAgICAgICAgICAgdGhpcy50aWVyZWRNZW51LmhpZGUoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBsaXN0Q2xpY2soZXZlbnQ6IEV2ZW50KSB7XG4gICAgICAgIGlmICghdGhpcy5yb290SXRlbUNsaWNrKSB7XG4gICAgICAgICAgICB0aGlzLmFjdGl2ZUl0ZW0gPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYmluZERvY3VtZW50Q2xpY2tMaXN0ZW5lcigpIHtcbiAgICAgICAgaWYgKCF0aGlzLmRvY3VtZW50Q2xpY2tMaXN0ZW5lcikge1xuICAgICAgICAgICAgdGhpcy5kb2N1bWVudENsaWNrTGlzdGVuZXIgPSB0aGlzLnJlbmRlcmVyLmxpc3RlbignZG9jdW1lbnQnLCAnY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnJvb3RJdGVtQ2xpY2spIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJlbnRBY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hY3RpdmVJdGVtID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jZi5tYXJrRm9yQ2hlY2soKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLnJvb3RJdGVtQ2xpY2sgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdW5iaW5kRG9jdW1lbnRDbGlja0xpc3RlbmVyKCkge1xuICAgICAgICBpZiAodGhpcy5kb2N1bWVudENsaWNrTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHRoaXMuZG9jdW1lbnRDbGlja0xpc3RlbmVyKCk7XG4gICAgICAgICAgICB0aGlzLmRvY3VtZW50Q2xpY2tMaXN0ZW5lciA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHtcbiAgICAgICAgaWYgKHRoaXMucm9vdCAmJiAhdGhpcy50aWVyZWRNZW51LnBvcHVwKSB7XG4gICAgICAgICAgICB0aGlzLnVuYmluZERvY3VtZW50Q2xpY2tMaXN0ZW5lcigpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3AtdGllcmVkTWVudScsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPGRpdiBbbmdDbGFzc109XCJ7J3AtdGllcmVkbWVudSBwLWNvbXBvbmVudCc6dHJ1ZSwgJ3AtdGllcmVkbWVudS1vdmVybGF5Jzpwb3B1cH1cIiBbY2xhc3NdPVwic3R5bGVDbGFzc1wiIFtuZ1N0eWxlXT1cInN0eWxlXCJcbiAgICAgICAgICAgIFtAb3ZlcmxheUFuaW1hdGlvbl09XCJ7dmFsdWU6ICd2aXNpYmxlJywgcGFyYW1zOiB7c2hvd1RyYW5zaXRpb25QYXJhbXM6IHNob3dUcmFuc2l0aW9uT3B0aW9ucywgaGlkZVRyYW5zaXRpb25QYXJhbXM6IGhpZGVUcmFuc2l0aW9uT3B0aW9uc319XCIgW0AuZGlzYWJsZWRdPVwicG9wdXAgIT09IHRydWVcIiBcbiAgICAgICAgICAgIChAb3ZlcmxheUFuaW1hdGlvbi5zdGFydCk9XCJvbk92ZXJsYXlBbmltYXRpb25TdGFydCgkZXZlbnQpXCIgKGNsaWNrKT1cInByZXZlbnREb2N1bWVudERlZmF1bHQ9dHJ1ZVwiICpuZ0lmPVwiIXBvcHVwIHx8IHZpc2libGVcIj5cbiAgICAgICAgICAgIDxwLXRpZXJlZE1lbnVTdWIgW2l0ZW1dPVwibW9kZWxcIiByb290PVwicm9vdFwiIFtwYXJlbnRBY3RpdmVdPVwicGFyZW50QWN0aXZlXCIgW2Jhc2VaSW5kZXhdPVwiYmFzZVpJbmRleFwiIFthdXRvWkluZGV4XT1cImF1dG9aSW5kZXhcIj48L3AtdGllcmVkTWVudVN1Yj5cbiAgICAgICAgPC9kaXY+XG4gICAgYCxcbiAgICBhbmltYXRpb25zOiBbXG4gICAgICAgIHRyaWdnZXIoJ292ZXJsYXlBbmltYXRpb24nLCBbXG4gICAgICAgICAgICB0cmFuc2l0aW9uKCc6ZW50ZXInLCBbXG4gICAgICAgICAgICAgICAgc3R5bGUoe29wYWNpdHk6IDAsIHRyYW5zZm9ybTogJ3NjYWxlWSgwLjgpJ30pLFxuICAgICAgICAgICAgICAgIGFuaW1hdGUoJ3t7c2hvd1RyYW5zaXRpb25QYXJhbXN9fScpXG4gICAgICAgICAgICAgIF0pLFxuICAgICAgICAgICAgICB0cmFuc2l0aW9uKCc6bGVhdmUnLCBbXG4gICAgICAgICAgICAgICAgYW5pbWF0ZSgne3toaWRlVHJhbnNpdGlvblBhcmFtc319Jywgc3R5bGUoeyBvcGFjaXR5OiAwIH0pKVxuICAgICAgICAgICAgICBdKVxuICAgICAgICBdKVxuICAgIF0sXG4gICAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gICAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZVxufSlcbmV4cG9ydCBjbGFzcyBUaWVyZWRNZW51IGltcGxlbWVudHMgT25EZXN0cm95IHtcblxuICAgIEBJbnB1dCgpIG1vZGVsOiBNZW51SXRlbVtdO1xuXG4gICAgQElucHV0KCkgcG9wdXA6IGJvb2xlYW47XG5cbiAgICBASW5wdXQoKSBzdHlsZTogYW55O1xuXG4gICAgQElucHV0KCkgc3R5bGVDbGFzczogc3RyaW5nO1xuICAgIFxuICAgIEBJbnB1dCgpIGFwcGVuZFRvOiBhbnk7XG5cbiAgICBASW5wdXQoKSBhdXRvWkluZGV4OiBib29sZWFuID0gdHJ1ZTtcbiAgICBcbiAgICBASW5wdXQoKSBiYXNlWkluZGV4OiBudW1iZXIgPSAwO1xuXG4gICAgQElucHV0KCkgc2hvd1RyYW5zaXRpb25PcHRpb25zOiBzdHJpbmcgPSAnLjEycyBjdWJpYy1iZXppZXIoMCwgMCwgMC4yLCAxKSc7XG5cbiAgICBASW5wdXQoKSBoaWRlVHJhbnNpdGlvbk9wdGlvbnM6IHN0cmluZyA9ICcuMXMgbGluZWFyJztcblxuICAgIHBhcmVudEFjdGl2ZTogYm9vbGVhbjtcblxuICAgIGNvbnRhaW5lcjogSFRNTERpdkVsZW1lbnQ7XG4gICAgXG4gICAgZG9jdW1lbnRDbGlja0xpc3RlbmVyOiBhbnk7XG5cbiAgICBkb2N1bWVudFJlc2l6ZUxpc3RlbmVyOiBhbnk7XG4gICAgXG4gICAgcHJldmVudERvY3VtZW50RGVmYXVsdDogYm9vbGVhbjtcblxuICAgIHRhcmdldDogYW55O1xuXG4gICAgdmlzaWJsZTogYm9vbGVhbjtcbiAgICBcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgZWw6IEVsZW1lbnRSZWYsIHB1YmxpYyByZW5kZXJlcjogUmVuZGVyZXIyLCBwdWJsaWMgY2Q6IENoYW5nZURldGVjdG9yUmVmKSB7fVxuICAgIFxuICAgIHRvZ2dsZShldmVudCkge1xuICAgICAgICBpZiAodGhpcy52aXNpYmxlKVxuICAgICAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHRoaXMuc2hvdyhldmVudCk7XG5cbiAgICAgICAgdGhpcy5wcmV2ZW50RG9jdW1lbnREZWZhdWx0ID0gdHJ1ZTtcbiAgICB9XG4gICAgXG4gICAgc2hvdyhldmVudCkge1xuICAgICAgICB0aGlzLnRhcmdldCA9IGV2ZW50LmN1cnJlbnRUYXJnZXQ7XG4gICAgICAgIHRoaXMudmlzaWJsZSA9IHRydWU7XG4gICAgICAgIHRoaXMucGFyZW50QWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5wcmV2ZW50RG9jdW1lbnREZWZhdWx0ID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG5cbiAgICBvbk92ZXJsYXlBbmltYXRpb25TdGFydChldmVudDogQW5pbWF0aW9uRXZlbnQpIHtcbiAgICAgICAgc3dpdGNoKGV2ZW50LnRvU3RhdGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ3Zpc2libGUnOlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnBvcHVwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGFpbmVyID0gZXZlbnQuZWxlbWVudDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3ZlT25Ub3AoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcHBlbmRPdmVybGF5KCk7XG4gICAgICAgICAgICAgICAgICAgIERvbUhhbmRsZXIuYWJzb2x1dGVQb3NpdGlvbih0aGlzLmNvbnRhaW5lciwgdGhpcy50YXJnZXQpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJpbmREb2N1bWVudENsaWNrTGlzdGVuZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5iaW5kRG9jdW1lbnRSZXNpemVMaXN0ZW5lcigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICd2b2lkJzpcbiAgICAgICAgICAgICAgICB0aGlzLm9uT3ZlcmxheUhpZGUoKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIGFwcGVuZE92ZXJsYXkoKSB7XG4gICAgICAgIGlmICh0aGlzLmFwcGVuZFRvKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5hcHBlbmRUbyA9PT0gJ2JvZHknKVxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5jb250YWluZXIpO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIERvbUhhbmRsZXIuYXBwZW5kQ2hpbGQodGhpcy5jb250YWluZXIsIHRoaXMuYXBwZW5kVG8pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVzdG9yZU92ZXJsYXlBcHBlbmQoKSB7XG4gICAgICAgIGlmICh0aGlzLmNvbnRhaW5lciAmJiB0aGlzLmFwcGVuZFRvKSB7XG4gICAgICAgICAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5jb250YWluZXIpO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIG1vdmVPblRvcCgpIHtcbiAgICAgICAgaWYgKHRoaXMuYXV0b1pJbmRleCkge1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuc3R5bGUuekluZGV4ID0gU3RyaW5nKHRoaXMuYmFzZVpJbmRleCArICgrK0RvbUhhbmRsZXIuemluZGV4KSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBoaWRlKCkge1xuICAgICAgICB0aGlzLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5wYXJlbnRBY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG5cbiAgICBvbldpbmRvd1Jlc2l6ZSgpIHtcbiAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgfVxuICAgIFxuICAgIGJpbmREb2N1bWVudENsaWNrTGlzdGVuZXIoKSB7XG4gICAgICAgIGlmICghdGhpcy5kb2N1bWVudENsaWNrTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHRoaXMuZG9jdW1lbnRDbGlja0xpc3RlbmVyID0gdGhpcy5yZW5kZXJlci5saXN0ZW4oJ2RvY3VtZW50JywgJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5wcmV2ZW50RG9jdW1lbnREZWZhdWx0ICYmIHRoaXMucG9wdXApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5wcmV2ZW50RG9jdW1lbnREZWZhdWx0ID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVuYmluZERvY3VtZW50Q2xpY2tMaXN0ZW5lcigpIHtcbiAgICAgICAgaWYgKHRoaXMuZG9jdW1lbnRDbGlja0xpc3RlbmVyKSB7XG4gICAgICAgICAgICB0aGlzLmRvY3VtZW50Q2xpY2tMaXN0ZW5lcigpO1xuICAgICAgICAgICAgdGhpcy5kb2N1bWVudENsaWNrTGlzdGVuZXIgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYmluZERvY3VtZW50UmVzaXplTGlzdGVuZXIoKSB7XG4gICAgICAgIHRoaXMuZG9jdW1lbnRSZXNpemVMaXN0ZW5lciA9IHRoaXMub25XaW5kb3dSZXNpemUuYmluZCh0aGlzKTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuZG9jdW1lbnRSZXNpemVMaXN0ZW5lcik7XG4gICAgfVxuICAgIFxuICAgIHVuYmluZERvY3VtZW50UmVzaXplTGlzdGVuZXIoKSB7XG4gICAgICAgIGlmICh0aGlzLmRvY3VtZW50UmVzaXplTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLmRvY3VtZW50UmVzaXplTGlzdGVuZXIpO1xuICAgICAgICAgICAgdGhpcy5kb2N1bWVudFJlc2l6ZUxpc3RlbmVyID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uT3ZlcmxheUhpZGUoKSB7XG4gICAgICAgIHRoaXMudW5iaW5kRG9jdW1lbnRDbGlja0xpc3RlbmVyKCk7XG4gICAgICAgIHRoaXMudW5iaW5kRG9jdW1lbnRSZXNpemVMaXN0ZW5lcigpO1xuICAgICAgICB0aGlzLnByZXZlbnREb2N1bWVudERlZmF1bHQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy50YXJnZXQgPSBudWxsO1xuICAgIH1cbiAgICBcbiAgICBuZ09uRGVzdHJveSgpIHtcbiAgICAgICAgaWYgKHRoaXMucG9wdXApIHtcbiAgICAgICAgICAgIHRoaXMucmVzdG9yZU92ZXJsYXlBcHBlbmQoKTtcbiAgICAgICAgICAgIHRoaXMub25PdmVybGF5SGlkZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG59XG5cbkBOZ01vZHVsZSh7XG4gICAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSxSb3V0ZXJNb2R1bGUsUmlwcGxlTW9kdWxlXSxcbiAgICBleHBvcnRzOiBbVGllcmVkTWVudSxSb3V0ZXJNb2R1bGVdLFxuICAgIGRlY2xhcmF0aW9uczogW1RpZXJlZE1lbnUsVGllcmVkTWVudVN1Yl1cbn0pXG5leHBvcnQgY2xhc3MgVGllcmVkTWVudU1vZHVsZSB7IH1cbiJdfQ==