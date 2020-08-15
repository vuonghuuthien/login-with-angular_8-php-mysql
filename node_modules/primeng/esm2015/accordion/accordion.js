import { NgModule, Component, ElementRef, AfterContentInit, OnDestroy, Input, Output, EventEmitter, ContentChildren, QueryList, ChangeDetectorRef, Inject, forwardRef, TemplateRef, ViewRef, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { SharedModule, Header, PrimeTemplate } from 'primeng/api';
let idx = 0;
export class AccordionTab {
    constructor(accordion, changeDetector) {
        this.changeDetector = changeDetector;
        this.cache = true;
        this.selectedChange = new EventEmitter();
        this.transitionOptions = '400ms cubic-bezier(0.86, 0, 0.07, 1)';
        this.id = `p-accordiontab-${idx++}`;
        this.accordion = accordion;
    }
    get selected() {
        return this._selected;
    }
    set selected(val) {
        this._selected = val;
        if (!this.loaded) {
            this.changeDetector.markForCheck();
        }
    }
    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'content':
                    this.contentTemplate = item.template;
                    break;
                case 'header':
                    this.header = item.template;
                    break;
                default:
                    this.contentTemplate = item.template;
                    break;
            }
        });
    }
    toggle(event) {
        if (this.disabled) {
            return false;
        }
        let index = this.findTabIndex();
        if (this.selected) {
            this.selected = false;
            this.accordion.onClose.emit({ originalEvent: event, index: index });
        }
        else {
            if (!this.accordion.multiple) {
                for (var i = 0; i < this.accordion.tabs.length; i++) {
                    this.accordion.tabs[i].selected = false;
                    this.accordion.tabs[i].selectedChange.emit(false);
                    this.accordion.tabs[i].changeDetector.markForCheck();
                }
            }
            this.selected = true;
            this.loaded = true;
            this.accordion.onOpen.emit({ originalEvent: event, index: index });
        }
        this.selectedChange.emit(this.selected);
        this.accordion.updateActiveIndex();
        this.changeDetector.markForCheck();
        event.preventDefault();
    }
    findTabIndex() {
        let index = -1;
        for (var i = 0; i < this.accordion.tabs.length; i++) {
            if (this.accordion.tabs[i] == this) {
                index = i;
                break;
            }
        }
        return index;
    }
    get hasHeaderFacet() {
        return this.headerFacet && this.headerFacet.length > 0;
    }
    onKeydown(event) {
        if (event.which === 32 || event.which === 13) {
            this.toggle(event);
            event.preventDefault();
        }
    }
    ngOnDestroy() {
        this.accordion.tabs.splice(this.findTabIndex(), 1);
    }
}
AccordionTab.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [forwardRef(() => Accordion),] }] },
    { type: ChangeDetectorRef }
];
AccordionTab.decorators = [
    { type: Component, args: [{
                selector: 'p-accordionTab',
                template: `
        <div class="p-accordion-tab" [ngClass]="{'p-accordion-tab-active': selected}">
            <div class="p-accordion-header" [ngClass]="{'p-highlight': selected, 'p-disabled': disabled}">
                <a role="tab" class="p-accordion-header-link" (click)="toggle($event)" (keydown)="onKeydown($event)" [attr.tabindex]="disabled ? null : 0"
                    [attr.id]="id" [attr.aria-controls]="id + '-content'" [attr.aria-expanded]="selected">
                    <span class="p-accordion-toggle-icon" [ngClass]="selected ? accordion.collapseIcon : accordion.expandIcon"></span>
                    <span class="p-accordion-header-text" *ngIf="!hasHeaderFacet">
                        {{header}}
                    </span>
                    <ng-container *ngTemplateOutlet="headerTemplate"></ng-container>
                    <ng-content select="p-header" *ngIf="hasHeaderFacet"></ng-content>
                </a>
            </div>
            <div [attr.id]="id + '-content'" class="p-toggleable-content" [@tabContent]="selected ? {value: 'visible', params: {transitionParams: transitionOptions}} : {value: 'hidden', params: {transitionParams: transitionOptions}}"
                role="region" [attr.aria-hidden]="!selected" [attr.aria-labelledby]="id">
                <div class="p-accordion-content">
                    <ng-content></ng-content>
                    <ng-container *ngIf="contentTemplate && (cache ? loaded : selected)">
                        <ng-container *ngTemplateOutlet="contentTemplate"></ng-container>
                    </ng-container>
                </div>
            </div>
        </div>
    `,
                animations: [
                    trigger('tabContent', [
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
                styles: [".p-accordion-header-link{cursor:pointer;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;position:relative;text-decoration:none}.p-accordion-header-link:focus{z-index:1}.p-accordion-header-text{line-height:1}"]
            },] }
];
AccordionTab.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [forwardRef(() => Accordion),] }] },
    { type: ChangeDetectorRef }
];
AccordionTab.propDecorators = {
    header: [{ type: Input }],
    disabled: [{ type: Input }],
    cache: [{ type: Input }],
    selectedChange: [{ type: Output }],
    transitionOptions: [{ type: Input }],
    headerFacet: [{ type: ContentChildren, args: [Header,] }],
    templates: [{ type: ContentChildren, args: [PrimeTemplate,] }],
    selected: [{ type: Input }]
};
export class Accordion {
    constructor(el, changeDetector) {
        this.el = el;
        this.changeDetector = changeDetector;
        this.onClose = new EventEmitter();
        this.onOpen = new EventEmitter();
        this.expandIcon = 'pi pi-fw pi-chevron-right';
        this.collapseIcon = 'pi pi-fw pi-chevron-down';
        this.activeIndexChange = new EventEmitter();
        this.tabs = [];
    }
    ngAfterContentInit() {
        this.initTabs();
        this.tabListSubscription = this.tabList.changes.subscribe(_ => {
            this.initTabs();
            this.changeDetector.markForCheck();
        });
    }
    initTabs() {
        this.tabs = this.tabList.toArray();
        this.updateSelectionState();
    }
    getBlockableElement() {
        return this.el.nativeElement.children[0];
    }
    get activeIndex() {
        return this._activeIndex;
    }
    set activeIndex(val) {
        this._activeIndex = val;
        if (this.preventActiveIndexPropagation) {
            this.preventActiveIndexPropagation = false;
            return;
        }
        this.updateSelectionState();
    }
    updateSelectionState() {
        if (this.tabs && this.tabs.length && this._activeIndex != null) {
            for (let i = 0; i < this.tabs.length; i++) {
                let selected = this.multiple ? this._activeIndex.includes(i) : (i === this._activeIndex);
                let changed = selected !== this.tabs[i].selected;
                if (changed) {
                    this.tabs[i].selected = selected;
                    this.tabs[i].selectedChange.emit(selected);
                }
            }
        }
    }
    updateActiveIndex() {
        let index = this.multiple ? [] : null;
        this.tabs.forEach((tab, i) => {
            if (tab.selected) {
                if (this.multiple) {
                    index.push(i);
                }
                else {
                    index = i;
                    return;
                }
            }
        });
        this.preventActiveIndexPropagation = true;
        this.activeIndexChange.emit(index);
    }
    ngOnDestroy() {
        if (this.tabListSubscription) {
            this.tabListSubscription.unsubscribe();
        }
    }
}
Accordion.ctorParameters = () => [
    { type: ElementRef },
    { type: ChangeDetectorRef }
];
Accordion.decorators = [
    { type: Component, args: [{
                selector: 'p-accordion',
                template: `
        <div [ngClass]="'p-accordion p-component'" [ngStyle]="style" [class]="styleClass" role="tablist">
            <ng-content></ng-content>
        </div>
    `,
                changeDetection: ChangeDetectionStrategy.OnPush
            },] }
];
Accordion.ctorParameters = () => [
    { type: ElementRef },
    { type: ChangeDetectorRef }
];
Accordion.propDecorators = {
    multiple: [{ type: Input }],
    onClose: [{ type: Output }],
    onOpen: [{ type: Output }],
    style: [{ type: Input }],
    styleClass: [{ type: Input }],
    expandIcon: [{ type: Input }],
    collapseIcon: [{ type: Input }],
    activeIndexChange: [{ type: Output }],
    tabList: [{ type: ContentChildren, args: [AccordionTab,] }],
    activeIndex: [{ type: Input }]
};
export class AccordionModule {
}
AccordionModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule],
                exports: [Accordion, AccordionTab, SharedModule],
                declarations: [Accordion, AccordionTab]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjb3JkaW9uLmpzIiwic291cmNlUm9vdCI6Im5nOi8vcHJpbWVuZy9hY2NvcmRpb24vIiwic291cmNlcyI6WyJhY2NvcmRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLGdCQUFnQixFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFDOUYsZUFBZSxFQUFFLFNBQVMsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDOUosT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUNqRixPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUUsYUFBYSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBSWxFLElBQUksR0FBRyxHQUFXLENBQUMsQ0FBQztBQTZDcEIsTUFBTSxPQUFPLFlBQVk7SUF3Q3JCLFlBQWlELFNBQVMsRUFBUyxjQUFpQztRQUFqQyxtQkFBYyxHQUFkLGNBQWMsQ0FBbUI7UUFsQzNGLFVBQUssR0FBWSxJQUFJLENBQUM7UUFFckIsbUJBQWMsR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUV4RCxzQkFBaUIsR0FBVyxzQ0FBc0MsQ0FBQztRQXdCNUUsT0FBRSxHQUFXLGtCQUFrQixHQUFHLEVBQUUsRUFBRSxDQUFDO1FBT25DLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBc0IsQ0FBQztJQUM1QyxDQUFDO0lBeEJELElBQWEsUUFBUTtRQUNqQixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7SUFDMUIsQ0FBQztJQUVELElBQUksUUFBUSxDQUFDLEdBQVE7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QUFNO3NCQUVOLGVBQWUsU0FBQyxZQUFZOzBCQThCNUIsS0FBSzs7QUEwRFYsTUFBTSxPQUFPLGVBQWU7OztZQUwzQixRQUFRLFNBQUM7Z0JBQ04sT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDO2dCQUN2QixPQUFPLEVBQUUsQ0FBQyxTQUFTLEVBQUMsWUFBWSxFQUFDLFlBQVksQ0FBQztnQkFDOUMsWUFBWSxFQUFFLENBQUMsU0FBUyxFQUFDLFlBQVksQ0FBQzthQUN6QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlLCBDb21wb25lbnQsIEVsZW1lbnRSZWYsIEFmdGVyQ29udGVudEluaXQsIE9uRGVzdHJveSwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBcbiAgICBDb250ZW50Q2hpbGRyZW4sIFF1ZXJ5TGlzdCwgQ2hhbmdlRGV0ZWN0b3JSZWYsIEluamVjdCwgZm9yd2FyZFJlZiwgVGVtcGxhdGVSZWYsIFZpZXdSZWYsIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBWaWV3RW5jYXBzdWxhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyB0cmlnZ2VyLCBzdGF0ZSwgc3R5bGUsIHRyYW5zaXRpb24sIGFuaW1hdGUgfSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBTaGFyZWRNb2R1bGUsIEhlYWRlciwgUHJpbWVUZW1wbGF0ZSB9IGZyb20gJ3ByaW1lbmcvYXBpJztcbmltcG9ydCB7IEJsb2NrYWJsZVVJIH0gZnJvbSAncHJpbWVuZy9hcGknO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbmxldCBpZHg6IG51bWJlciA9IDA7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAncC1hY2NvcmRpb25UYWInLFxuICAgIHRlbXBsYXRlOiBgXG4gICAgICAgIDxkaXYgY2xhc3M9XCJwLWFjY29yZGlvbi10YWJcIiBbbmdDbGFzc109XCJ7J3AtYWNjb3JkaW9uLXRhYi1hY3RpdmUnOiBzZWxlY3RlZH1cIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwLWFjY29yZGlvbi1oZWFkZXJcIiBbbmdDbGFzc109XCJ7J3AtaGlnaGxpZ2h0Jzogc2VsZWN0ZWQsICdwLWRpc2FibGVkJzogZGlzYWJsZWR9XCI+XG4gICAgICAgICAgICAgICAgPGEgcm9sZT1cInRhYlwiIGNsYXNzPVwicC1hY2NvcmRpb24taGVhZGVyLWxpbmtcIiAoY2xpY2spPVwidG9nZ2xlKCRldmVudClcIiAoa2V5ZG93bik9XCJvbktleWRvd24oJGV2ZW50KVwiIFthdHRyLnRhYmluZGV4XT1cImRpc2FibGVkID8gbnVsbCA6IDBcIlxuICAgICAgICAgICAgICAgICAgICBbYXR0ci5pZF09XCJpZFwiIFthdHRyLmFyaWEtY29udHJvbHNdPVwiaWQgKyAnLWNvbnRlbnQnXCIgW2F0dHIuYXJpYS1leHBhbmRlZF09XCJzZWxlY3RlZFwiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInAtYWNjb3JkaW9uLXRvZ2dsZS1pY29uXCIgW25nQ2xhc3NdPVwic2VsZWN0ZWQgPyBhY2NvcmRpb24uY29sbGFwc2VJY29uIDogYWNjb3JkaW9uLmV4cGFuZEljb25cIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicC1hY2NvcmRpb24taGVhZGVyLXRleHRcIiAqbmdJZj1cIiFoYXNIZWFkZXJGYWNldFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAge3toZWFkZXJ9fVxuICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJoZWFkZXJUZW1wbGF0ZVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJwLWhlYWRlclwiICpuZ0lmPVwiaGFzSGVhZGVyRmFjZXRcIj48L25nLWNvbnRlbnQ+XG4gICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IFthdHRyLmlkXT1cImlkICsgJy1jb250ZW50J1wiIGNsYXNzPVwicC10b2dnbGVhYmxlLWNvbnRlbnRcIiBbQHRhYkNvbnRlbnRdPVwic2VsZWN0ZWQgPyB7dmFsdWU6ICd2aXNpYmxlJywgcGFyYW1zOiB7dHJhbnNpdGlvblBhcmFtczogdHJhbnNpdGlvbk9wdGlvbnN9fSA6IHt2YWx1ZTogJ2hpZGRlbicsIHBhcmFtczoge3RyYW5zaXRpb25QYXJhbXM6IHRyYW5zaXRpb25PcHRpb25zfX1cIlxuICAgICAgICAgICAgICAgIHJvbGU9XCJyZWdpb25cIiBbYXR0ci5hcmlhLWhpZGRlbl09XCIhc2VsZWN0ZWRcIiBbYXR0ci5hcmlhLWxhYmVsbGVkYnldPVwiaWRcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicC1hY2NvcmRpb24tY29udGVudFwiPlxuICAgICAgICAgICAgICAgICAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJjb250ZW50VGVtcGxhdGUgJiYgKGNhY2hlID8gbG9hZGVkIDogc2VsZWN0ZWQpXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiY29udGVudFRlbXBsYXRlXCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIGAsXG4gICAgYW5pbWF0aW9uczogW1xuICAgICAgICB0cmlnZ2VyKCd0YWJDb250ZW50JywgW1xuICAgICAgICAgICAgc3RhdGUoJ2hpZGRlbicsIHN0eWxlKHtcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcwJyxcbiAgICAgICAgICAgICAgICBvdmVyZmxvdzogJ2hpZGRlbidcbiAgICAgICAgICAgIH0pKSxcbiAgICAgICAgICAgIHN0YXRlKCd2aXNpYmxlJywgc3R5bGUoe1xuICAgICAgICAgICAgICAgIGhlaWdodDogJyonXG4gICAgICAgICAgICB9KSksXG4gICAgICAgICAgICB0cmFuc2l0aW9uKCd2aXNpYmxlIDw9PiBoaWRkZW4nLCBbc3R5bGUoe292ZXJmbG93OiAnaGlkZGVuJ30pLCBhbmltYXRlKCd7e3RyYW5zaXRpb25QYXJhbXN9fScpXSksXG4gICAgICAgICAgICB0cmFuc2l0aW9uKCd2b2lkID0+IConLCBhbmltYXRlKDApKVxuICAgICAgICBdKVxuICAgIF0sXG4gICAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gICAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgICBzdHlsZVVybHM6IFsnLi9hY2NvcmRpb24uY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgQWNjb3JkaW9uVGFiIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCxPbkRlc3Ryb3kge1xuXG4gICAgQElucHV0KCkgaGVhZGVyOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBkaXNhYmxlZDogYm9vbGVhbjtcblxuICAgIEBJbnB1dCgpIGNhY2hlOiBib29sZWFuID0gdHJ1ZTtcblxuICAgIEBPdXRwdXQoKSBzZWxlY3RlZENoYW5nZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBASW5wdXQoKSB0cmFuc2l0aW9uT3B0aW9uczogc3RyaW5nID0gJzQwMG1zIGN1YmljLWJlemllcigwLjg2LCAwLCAwLjA3LCAxKSc7XG5cbiAgICBAQ29udGVudENoaWxkcmVuKEhlYWRlcikgaGVhZGVyRmFjZXQ6IFF1ZXJ5TGlzdDxIZWFkZXI+O1xuXG4gICAgQENvbnRlbnRDaGlsZHJlbihQcmltZVRlbXBsYXRlKSB0ZW1wbGF0ZXM6IFF1ZXJ5TGlzdDxhbnk+O1xuXG4gICAgcHJpdmF0ZSBfc2VsZWN0ZWQ6IGJvb2xlYW47XG5cbiAgICBASW5wdXQoKSBnZXQgc2VsZWN0ZWQoKTogYW55IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NlbGVjdGVkO1xuICAgIH1cblxuICAgIHNldCBzZWxlY3RlZCh2YWw6IGFueSkge1xuICAgICAgICB0aGlzLl9zZWxlY3RlZCA9IHZhbDtcbiAgICAgICAgXG4gICAgICAgIGlmICghdGhpcy5sb2FkZWQpIHtcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlRGV0ZWN0b3IubWFya0ZvckNoZWNrKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb250ZW50VGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICBoZWFkZXJUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIGlkOiBzdHJpbmcgPSBgcC1hY2NvcmRpb250YWItJHtpZHgrK31gO1xuXG4gICAgbG9hZGVkOiBib29sZWFuO1xuXG4gICAgYWNjb3JkaW9uOiBBY2NvcmRpb247XG5cbiAgICBjb25zdHJ1Y3RvcihASW5qZWN0KGZvcndhcmRSZWYoKCkgPT4gQWNjb3JkaW9uKSkgYWNjb3JkaW9uLCBwdWJsaWMgY2hhbmdlRGV0ZWN0b3I6IENoYW5nZURldGVjdG9yUmVmKSB7XG4gICAgICAgIHRoaXMuYWNjb3JkaW9uID0gYWNjb3JkaW9uIGFzIEFjY29yZGlvbjtcbiAgICB9XG5cbiAgICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgICAgIHRoaXMudGVtcGxhdGVzLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgICAgIHN3aXRjaChpdGVtLmdldFR5cGUoKSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ2NvbnRlbnQnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnRUZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdoZWFkZXInOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmhlYWRlciA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZW50VGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICB0b2dnbGUoZXZlbnQpIHtcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBpbmRleCA9IHRoaXMuZmluZFRhYkluZGV4KCk7XG5cbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWQpIHtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuYWNjb3JkaW9uLm9uQ2xvc2UuZW1pdCh7IG9yaWdpbmFsRXZlbnQ6IGV2ZW50LCBpbmRleDogaW5kZXggfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuYWNjb3JkaW9uLm11bHRpcGxlKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmFjY29yZGlvbi50YWJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWNjb3JkaW9uLnRhYnNbaV0uc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hY2NvcmRpb24udGFic1tpXS5zZWxlY3RlZENoYW5nZS5lbWl0KGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hY2NvcmRpb24udGFic1tpXS5jaGFuZ2VEZXRlY3Rvci5tYXJrRm9yQ2hlY2soKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5sb2FkZWQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5hY2NvcmRpb24ub25PcGVuLmVtaXQoeyBvcmlnaW5hbEV2ZW50OiBldmVudCwgaW5kZXg6IGluZGV4IH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZWxlY3RlZENoYW5nZS5lbWl0KHRoaXMuc2VsZWN0ZWQpO1xuICAgICAgICB0aGlzLmFjY29yZGlvbi51cGRhdGVBY3RpdmVJbmRleCgpO1xuICAgICAgICB0aGlzLmNoYW5nZURldGVjdG9yLm1hcmtGb3JDaGVjaygpO1xuXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuXG5cblxuICAgIGZpbmRUYWJJbmRleCgpIHtcbiAgICAgICAgbGV0IGluZGV4ID0gLTE7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5hY2NvcmRpb24udGFicy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuYWNjb3JkaW9uLnRhYnNbaV0gPT0gdGhpcykge1xuICAgICAgICAgICAgICAgIGluZGV4ID0gaTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaW5kZXg7XG4gICAgfVxuXG4gICAgZ2V0IGhhc0hlYWRlckZhY2V0KCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5oZWFkZXJGYWNldCAmJiB0aGlzLmhlYWRlckZhY2V0Lmxlbmd0aCA+IDA7XG4gICAgfVxuXG4gICAgb25LZXlkb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgICAgIGlmIChldmVudC53aGljaCA9PT0gMzIgfHwgZXZlbnQud2hpY2ggPT09IDEzKSB7XG4gICAgICAgICAgICB0aGlzLnRvZ2dsZShldmVudCk7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMuYWNjb3JkaW9uLnRhYnMuc3BsaWNlKHRoaXMuZmluZFRhYkluZGV4KCksIDEpO1xuICAgIH1cbn1cblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdwLWFjY29yZGlvbicsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPGRpdiBbbmdDbGFzc109XCIncC1hY2NvcmRpb24gcC1jb21wb25lbnQnXCIgW25nU3R5bGVdPVwic3R5bGVcIiBbY2xhc3NdPVwic3R5bGVDbGFzc1wiIHJvbGU9XCJ0YWJsaXN0XCI+XG4gICAgICAgICAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gICAgICAgIDwvZGl2PlxuICAgIGAsXG4gICAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIEFjY29yZGlvbiBpbXBsZW1lbnRzIEJsb2NrYWJsZVVJLCBBZnRlckNvbnRlbnRJbml0LCBPbkRlc3Ryb3kge1xuICAgIFxuICAgIEBJbnB1dCgpIG11bHRpcGxlOiBib29sZWFuO1xuICAgIFxuICAgIEBPdXRwdXQoKSBvbkNsb3NlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKSBvbk9wZW46IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQElucHV0KCkgc3R5bGU6IGFueTtcbiAgICBcbiAgICBASW5wdXQoKSBzdHlsZUNsYXNzOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBleHBhbmRJY29uOiBzdHJpbmcgPSAncGkgcGktZncgcGktY2hldnJvbi1yaWdodCc7XG5cbiAgICBASW5wdXQoKSBjb2xsYXBzZUljb246IHN0cmluZyA9ICdwaSBwaS1mdyBwaS1jaGV2cm9uLWRvd24nO1xuXG4gICAgQE91dHB1dCgpIGFjdGl2ZUluZGV4Q2hhbmdlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICBcbiAgICBAQ29udGVudENoaWxkcmVuKEFjY29yZGlvblRhYikgdGFiTGlzdDogUXVlcnlMaXN0PEFjY29yZGlvblRhYj47XG5cbiAgICB0YWJMaXN0U3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gICAgXG4gICAgcHJpdmF0ZSBfYWN0aXZlSW5kZXg6IGFueTtcblxuICAgIHByZXZlbnRBY3RpdmVJbmRleFByb3BhZ2F0aW9uOiBib29sZWFuO1xuICAgIFxuICAgIHB1YmxpYyB0YWJzOiBBY2NvcmRpb25UYWJbXSA9IFtdO1xuXG4gICAgY29uc3RydWN0b3IocHVibGljIGVsOiBFbGVtZW50UmVmLCBwdWJsaWMgY2hhbmdlRGV0ZWN0b3I6IENoYW5nZURldGVjdG9yUmVmKSB7fVxuXG4gICAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgICAgICB0aGlzLmluaXRUYWJzKCk7XG5cbiAgICAgICAgdGhpcy50YWJMaXN0U3Vic2NyaXB0aW9uID0gdGhpcy50YWJMaXN0LmNoYW5nZXMuc3Vic2NyaWJlKF8gPT4ge1xuICAgICAgICAgICAgdGhpcy5pbml0VGFicygpO1xuICAgICAgICAgICAgdGhpcy5jaGFuZ2VEZXRlY3Rvci5tYXJrRm9yQ2hlY2soKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaW5pdFRhYnMoKTogYW55IHtcbiAgICAgICAgdGhpcy50YWJzID0gdGhpcy50YWJMaXN0LnRvQXJyYXkoKTtcbiAgICAgICAgdGhpcy51cGRhdGVTZWxlY3Rpb25TdGF0ZSgpO1xuICAgIH1cbiAgICAgIFxuICAgIGdldEJsb2NrYWJsZUVsZW1lbnQoKTogSFRNTEVsZW1lbnTCoHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWwubmF0aXZlRWxlbWVudC5jaGlsZHJlblswXTtcbiAgICB9IFxuICAgIFxuICAgIEBJbnB1dCgpIGdldCBhY3RpdmVJbmRleCgpOiBhbnkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYWN0aXZlSW5kZXg7XG4gICAgfVxuXG4gICAgc2V0IGFjdGl2ZUluZGV4KHZhbDogYW55KSB7XG4gICAgICAgIHRoaXMuX2FjdGl2ZUluZGV4ID0gdmFsO1xuICAgICAgICBpZiAodGhpcy5wcmV2ZW50QWN0aXZlSW5kZXhQcm9wYWdhdGlvbikge1xuICAgICAgICAgICAgdGhpcy5wcmV2ZW50QWN0aXZlSW5kZXhQcm9wYWdhdGlvbiA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy51cGRhdGVTZWxlY3Rpb25TdGF0ZSgpO1xuICAgIH1cblxuICAgIHVwZGF0ZVNlbGVjdGlvblN0YXRlKCkge1xuICAgICAgICBpZiAodGhpcy50YWJzICYmIHRoaXMudGFicy5sZW5ndGggJiYgdGhpcy5fYWN0aXZlSW5kZXggIT0gbnVsbCkge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnRhYnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgc2VsZWN0ZWQgPSB0aGlzLm11bHRpcGxlID8gdGhpcy5fYWN0aXZlSW5kZXguaW5jbHVkZXMoaSkgOiAoaSA9PT0gdGhpcy5fYWN0aXZlSW5kZXgpO1xuICAgICAgICAgICAgICAgIGxldCBjaGFuZ2VkID0gc2VsZWN0ZWQgIT09IHRoaXMudGFic1tpXS5zZWxlY3RlZDtcblxuICAgICAgICAgICAgICAgIGlmIChjaGFuZ2VkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGFic1tpXS5zZWxlY3RlZCA9IHNlbGVjdGVkO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRhYnNbaV0uc2VsZWN0ZWRDaGFuZ2UuZW1pdChzZWxlY3RlZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXBkYXRlQWN0aXZlSW5kZXgoKSB7XG4gICAgICAgIGxldCBpbmRleDogYW55ID0gdGhpcy5tdWx0aXBsZSA/IFtdIDogbnVsbDtcbiAgICAgICAgdGhpcy50YWJzLmZvckVhY2goKHRhYiwgaSkgPT4ge1xuICAgICAgICAgICAgaWYgKHRhYi5zZWxlY3RlZCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLm11bHRpcGxlKSB7XG4gICAgICAgICAgICAgICAgICAgIGluZGV4LnB1c2goaSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpbmRleCA9IGk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMucHJldmVudEFjdGl2ZUluZGV4UHJvcGFnYXRpb24gPSB0cnVlO1xuICAgICAgICB0aGlzLmFjdGl2ZUluZGV4Q2hhbmdlLmVtaXQoaW5kZXgpO1xuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCkge1xuICAgICAgICBpZiAodGhpcy50YWJMaXN0U3Vic2NyaXB0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLnRhYkxpc3RTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuQE5nTW9kdWxlKHtcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlXSxcbiAgICBleHBvcnRzOiBbQWNjb3JkaW9uLEFjY29yZGlvblRhYixTaGFyZWRNb2R1bGVdLFxuICAgIGRlY2xhcmF0aW9uczogW0FjY29yZGlvbixBY2NvcmRpb25UYWJdXG59KVxuZXhwb3J0IGNsYXNzIEFjY29yZGlvbk1vZHVsZSB7IH1cbiJdfQ==