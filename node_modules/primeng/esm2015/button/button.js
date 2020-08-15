import { NgModule, Directive, Component, ElementRef, EventEmitter, AfterViewInit, Output, OnDestroy, Input, ChangeDetectionStrategy, ViewEncapsulation, ContentChildren, AfterContentInit, TemplateRef, QueryList } from '@angular/core';
import { DomHandler } from 'primeng/dom';
import { CommonModule } from '@angular/common';
import { RippleModule } from 'primeng/ripple';
import { PrimeTemplate } from 'primeng/api';
export class ButtonDirective {
    constructor(el) {
        this.el = el;
        this.iconPos = 'left';
    }
    ngAfterViewInit() {
        this._initialStyleClass = this.el.nativeElement.className;
        DomHandler.addMultipleClasses(this.el.nativeElement, this.getStyleClass());
        if (this.icon) {
            let iconElement = document.createElement("span");
            iconElement.className = 'p-button-icon';
            iconElement.setAttribute("aria-hidden", "true");
            let iconPosClass = this.label ? 'p-button-icon-' + this.iconPos : null;
            if (iconPosClass) {
                DomHandler.addClass(iconElement, iconPosClass);
            }
            DomHandler.addMultipleClasses(iconElement, this.icon);
            this.el.nativeElement.appendChild(iconElement);
        }
        let labelElement = document.createElement("span");
        if (this.icon && !this.label) {
            labelElement.setAttribute('aria-hidden', 'true');
        }
        labelElement.className = 'p-button-label';
        labelElement.appendChild(document.createTextNode(this.label || '&nbsp;'));
        this.el.nativeElement.appendChild(labelElement);
        this.initialized = true;
    }
    getStyleClass() {
        let styleClass = 'p-button p-component';
        if (this.icon && !this.label) {
            styleClass = styleClass + ' p-button-icon-only';
        }
        return styleClass;
    }
    setStyleClass() {
        let styleClass = this.getStyleClass();
        this.el.nativeElement.className = styleClass + ' ' + this._initialStyleClass;
    }
    get label() {
        return this._label;
    }
    set label(val) {
        this._label = val;
        if (this.initialized) {
            DomHandler.findSingle(this.el.nativeElement, '.p-button-label').textContent = this._label || '&nbsp;';
            this.setStyleClass();
        }
    }
    get icon() {
        return this._icon;
    }
    set icon(val) {
        this._icon = val;
        if (this.initialized) {
            if (this.iconPos)
                DomHandler.findSingle(this.el.nativeElement, '.p-button-icon').className = 'p-button-icon p-button-icon-' + this.iconPos + ' ' + this._icon;
            else
                DomHandler.findSingle(this.el.nativeElement, '.p-button-icon').className = 'p-button-icon ' + this._icon;
            this.setStyleClass();
        }
    }
    ngOnDestroy() {
        while (this.el.nativeElement.hasChildNodes()) {
            this.el.nativeElement.removeChild(this.el.nativeElement.lastChild);
        }
        this.initialized = false;
    }
}
ButtonDirective.ctorParameters = () => [
    { type: ElementRef }
];
ButtonDirective.decorators = [
    { type: Directive, args: [{
                selector: '[pButton]'
            },] }
];
ButtonDirective.ctorParameters = () => [
    { type: ElementRef }
];
ButtonDirective.propDecorators = {
    iconPos: [{ type: Input }],
    label: [{ type: Input }],
    icon: [{ type: Input }]
};
export class Button {
    constructor() {
        this.type = "button";
        this.iconPos = 'left';
        this.onClick = new EventEmitter();
        this.onFocus = new EventEmitter();
        this.onBlur = new EventEmitter();
    }
    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'content':
                    this.contentTemplate = item.template;
                    break;
                default:
                    this.contentTemplate = item.template;
                    break;
            }
        });
    }
}
Button.decorators = [
    { type: Component, args: [{
                selector: 'p-button',
                template: `
        <button [attr.type]="type" [class]="styleClass" [ngStyle]="style" [disabled]="disabled"
            [ngClass]="{'p-button p-component':true,
                        'p-button-icon-only': (icon && !label),
                        'p-button-vertical': (iconPos === 'top' || iconPos === 'bottom') && label}"
                        (click)="onClick.emit($event)" (focus)="onFocus.emit($event)" (blur)="onBlur.emit($event)" pRipple>
            <ng-content></ng-content>
            <ng-container *ngTemplateOutlet="contentTemplate"></ng-container>
            <span [ngClass]="{'p-button-icon': true,
                        'p-button-icon-left': iconPos === 'left' && label,
                        'p-button-icon-right': iconPos === 'right' && label,
                        'p-button-icon-top': iconPos === 'top' && label,
                        'p-button-icon-bottom': iconPos === 'bottom' && label}"
                        [class]="icon" *ngIf="icon" [attr.aria-hidden]="true"></span>
            <span class="p-button-label" [attr.aria-hidden]="icon && !label">{{label||'&nbsp;'}}</span>
            <span [ngClass]="'p-badge'" *ngIf="badge" [class]="badgeClass">{{badge}}</span>
        </button>
    `,
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None
            },] }
];
Button.propDecorators = {
    type: [{ type: Input }],
    iconPos: [{ type: Input }],
    icon: [{ type: Input }],
    badge: [{ type: Input }],
    label: [{ type: Input }],
    disabled: [{ type: Input }],
    style: [{ type: Input }],
    styleClass: [{ type: Input }],
    badgeClass: [{ type: Input }],
    templates: [{ type: ContentChildren, args: [PrimeTemplate,] }],
    onClick: [{ type: Output }],
    onFocus: [{ type: Output }],
    onBlur: [{ type: Output }]
};
export class ButtonModule {
}
ButtonModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule, RippleModule],
                exports: [ButtonDirective, Button],
                declarations: [ButtonDirective, Button]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnV0dG9uLmpzIiwic291cmNlUm9vdCI6Im5nOi8vcHJpbWVuZy9idXR0b24vIiwic291cmNlcyI6WyJidXR0b24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFFBQVEsRUFBQyxTQUFTLEVBQUMsU0FBUyxFQUFDLFVBQVUsRUFBQyxZQUFZLEVBQUMsYUFBYSxFQUFDLE1BQU0sRUFBQyxTQUFTLEVBQUMsS0FBSyxFQUFDLHVCQUF1QixFQUFFLGlCQUFpQixFQUFFLGVBQWUsRUFBRSxnQkFBZ0IsRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzlOLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDdkMsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQzdDLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUM1QyxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBSzFDLE1BQU0sT0FBTyxlQUFlO0lBWXhCLFlBQW1CLEVBQWM7UUFBZCxPQUFFLEdBQUYsRUFBRSxDQUFZO1FBVnhCLFlBQU8sR0FBd0MsTUFBTSxDQUFDO0lBVTNCLENBQUM7SUFFckMsZUFBZTtRQUNYLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUM7UUFDMUQsVUFBVSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDO1FBRTNFLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtZQUNYLElBQUksV0FBVyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDakQsV0FBVyxDQUFDLFNBQVMsR0FBRyxlQUFlLENBQUM7WUFDeEMsV0FBVyxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsTUFBTSxD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Ozs7Ozs7S0FpQlQ7Z0JBQ0QsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07Z0JBQy9DLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO2FBQ3hDOzs7bUJBR0ksS0FBSztzQkFFTCxLQUFLO21CQUVMLEtBQUs7b0JBRUwsS0FBSztvQkFFTCxLQUFLO3VCQUVMLEtBQUs7b0JBRUwsS0FBSzt5QkFFTCxLQUFLO3lCQUVMLEtBQUs7d0JBSUwsZUFBZSxTQUFDLGFBQWE7c0JBRTdCLE1BQU07c0JBRU4sTUFBTTtxQkFFTixNQUFNOztBQXNCWCxNQUFNLE9BQU8sWUFBWTs7O1lBTHhCLFFBQVEsU0FBQztnQkFDTixPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUMsWUFBWSxDQUFDO2dCQUNwQyxPQUFPLEVBQUUsQ0FBQyxlQUFlLEVBQUMsTUFBTSxDQUFDO2dCQUNqQyxZQUFZLEVBQUUsQ0FBQyxlQUFlLEVBQUMsTUFBTSxDQUFDO2FBQ3pDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtOZ01vZHVsZSxEaXJlY3RpdmUsQ29tcG9uZW50LEVsZW1lbnRSZWYsRXZlbnRFbWl0dGVyLEFmdGVyVmlld0luaXQsT3V0cHV0LE9uRGVzdHJveSxJbnB1dCxDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgVmlld0VuY2Fwc3VsYXRpb24sIENvbnRlbnRDaGlsZHJlbiwgQWZ0ZXJDb250ZW50SW5pdCwgVGVtcGxhdGVSZWYsIFF1ZXJ5TGlzdH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0RvbUhhbmRsZXJ9IGZyb20gJ3ByaW1lbmcvZG9tJztcbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtSaXBwbGVNb2R1bGV9IGZyb20gJ3ByaW1lbmcvcmlwcGxlJzsgXG5pbXBvcnQge1ByaW1lVGVtcGxhdGV9IGZyb20gJ3ByaW1lbmcvYXBpJzsgXG5cbkBEaXJlY3RpdmUoe1xuICAgIHNlbGVjdG9yOiAnW3BCdXR0b25dJ1xufSlcbmV4cG9ydCBjbGFzcyBCdXR0b25EaXJlY3RpdmUgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3kge1xuXG4gICAgQElucHV0KCkgaWNvblBvczogJ2xlZnQnIHwgJ3JpZ2h0JyB8ICd0b3AnIHwgJ2JvdHRvbScgPSAnbGVmdCc7XG4gICAgICAgICAgICBcbiAgICBwdWJsaWMgX2xhYmVsOiBzdHJpbmc7XG4gICAgXG4gICAgcHVibGljIF9pY29uOiBzdHJpbmc7XG4gICAgICAgICAgICBcbiAgICBwdWJsaWMgaW5pdGlhbGl6ZWQ6IGJvb2xlYW47XG4gICAgXG4gICAgcHVibGljIF9pbml0aWFsU3R5bGVDbGFzczogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IocHVibGljIGVsOiBFbGVtZW50UmVmKSB7fVxuICAgIFxuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAgICAgdGhpcy5faW5pdGlhbFN0eWxlQ2xhc3MgPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuY2xhc3NOYW1lO1xuICAgICAgICBEb21IYW5kbGVyLmFkZE11bHRpcGxlQ2xhc3Nlcyh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsIHRoaXMuZ2V0U3R5bGVDbGFzcygpKTtcblxuICAgICAgICBpZiAodGhpcy5pY29uKSB7XG4gICAgICAgICAgICBsZXQgaWNvbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICAgICAgICAgIGljb25FbGVtZW50LmNsYXNzTmFtZSA9ICdwLWJ1dHRvbi1pY29uJztcbiAgICAgICAgICAgIGljb25FbGVtZW50LnNldEF0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIsIFwidHJ1ZVwiKTtcbiAgICAgICAgICAgIGxldCBpY29uUG9zQ2xhc3MgPSB0aGlzLmxhYmVsID8gJ3AtYnV0dG9uLWljb24tJyArIHRoaXMuaWNvblBvcyA6IG51bGw7XG4gICAgICAgICAgICBpZiAoaWNvblBvc0NsYXNzKSB7XG4gICAgICAgICAgICAgICAgRG9tSGFuZGxlci5hZGRDbGFzcyhpY29uRWxlbWVudCwgaWNvblBvc0NsYXNzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIERvbUhhbmRsZXIuYWRkTXVsdGlwbGVDbGFzc2VzKGljb25FbGVtZW50LCB0aGlzLmljb24pO1xuICAgICAgICAgICAgdGhpcy5lbC5uYXRpdmVFbGVtZW50LmFwcGVuZENoaWxkKGljb25FbGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgbGV0IGxhYmVsRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgICAgICBpZiAodGhpcy5pY29uICYmICF0aGlzLmxhYmVsKSB7XG4gICAgICAgICAgICBsYWJlbEVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG4gICAgICAgIH1cbiAgICAgICAgbGFiZWxFbGVtZW50LmNsYXNzTmFtZSA9ICdwLWJ1dHRvbi1sYWJlbCc7XG4gICAgICAgIGxhYmVsRWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0aGlzLmxhYmVsfHwnJm5ic3A7JykpO1xuICAgICAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuYXBwZW5kQ2hpbGQobGFiZWxFbGVtZW50KTtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XG4gICAgfVxuICAgICAgICBcbiAgICBnZXRTdHlsZUNsYXNzKCk6IHN0cmluZyB7XG4gICAgICAgIGxldCBzdHlsZUNsYXNzID0gJ3AtYnV0dG9uIHAtY29tcG9uZW50JztcbiAgICAgICAgaWYgKHRoaXMuaWNvbiAmJiAhdGhpcy5sYWJlbCkge1xuICAgICAgICAgICAgc3R5bGVDbGFzcyA9IHN0eWxlQ2xhc3MgKyAnIHAtYnV0dG9uLWljb24tb25seSc7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJldHVybiBzdHlsZUNsYXNzO1xuICAgIH1cblxuICAgIHNldFN0eWxlQ2xhc3MoKSB7XG4gICAgICAgIGxldCBzdHlsZUNsYXNzID0gdGhpcy5nZXRTdHlsZUNsYXNzKCk7XG4gICAgICAgIHRoaXMuZWwubmF0aXZlRWxlbWVudC5jbGFzc05hbWUgPSBzdHlsZUNsYXNzICsgJyAnICsgdGhpcy5faW5pdGlhbFN0eWxlQ2xhc3M7XG4gICAgfVxuICAgIFxuICAgIEBJbnB1dCgpIGdldCBsYWJlbCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5fbGFiZWw7XG4gICAgfVxuXG4gICAgc2V0IGxhYmVsKHZhbDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuX2xhYmVsID0gdmFsO1xuICAgICAgICBcbiAgICAgICAgaWYgKHRoaXMuaW5pdGlhbGl6ZWQpIHtcbiAgICAgICAgICAgIERvbUhhbmRsZXIuZmluZFNpbmdsZSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICcucC1idXR0b24tbGFiZWwnKS50ZXh0Q29udGVudCA9IHRoaXMuX2xhYmVsIHx8ICcmbmJzcDsnO1xuICAgICAgICAgICAgdGhpcy5zZXRTdHlsZUNsYXNzKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgQElucHV0KCkgZ2V0IGljb24oKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ljb247XG4gICAgfVxuXG4gICAgc2V0IGljb24odmFsOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5faWNvbiA9IHZhbDtcbiAgICAgICAgXG4gICAgICAgIGlmICh0aGlzLmluaXRpYWxpemVkKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pY29uUG9zKVxuICAgICAgICAgICAgICAgIERvbUhhbmRsZXIuZmluZFNpbmdsZSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICcucC1idXR0b24taWNvbicpLmNsYXNzTmFtZSA9ICdwLWJ1dHRvbi1pY29uIHAtYnV0dG9uLWljb24tJyArIHRoaXMuaWNvblBvcyArICcgJyArIHRoaXMuX2ljb247XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgRG9tSGFuZGxlci5maW5kU2luZ2xlKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgJy5wLWJ1dHRvbi1pY29uJykuY2xhc3NOYW1lID0gJ3AtYnV0dG9uLWljb24gJyArIHRoaXMuX2ljb247XG5cbiAgICAgICAgICAgIHRoaXMuc2V0U3R5bGVDbGFzcygpO1xuICAgICAgICB9XG4gICAgfVxuICAgICAgICBcbiAgICBuZ09uRGVzdHJveSgpIHtcbiAgICAgICAgd2hpbGUodGhpcy5lbC5uYXRpdmVFbGVtZW50Lmhhc0NoaWxkTm9kZXMoKSkge1xuICAgICAgICAgICAgdGhpcy5lbC5uYXRpdmVFbGVtZW50LnJlbW92ZUNoaWxkKHRoaXMuZWwubmF0aXZlRWxlbWVudC5sYXN0Q2hpbGQpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB0aGlzLmluaXRpYWxpemVkID0gZmFsc2U7XG4gICAgfVxufVxuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3AtYnV0dG9uJyxcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgICA8YnV0dG9uIFthdHRyLnR5cGVdPVwidHlwZVwiIFtjbGFzc109XCJzdHlsZUNsYXNzXCIgW25nU3R5bGVdPVwic3R5bGVcIiBbZGlzYWJsZWRdPVwiZGlzYWJsZWRcIlxuICAgICAgICAgICAgW25nQ2xhc3NdPVwieydwLWJ1dHRvbiBwLWNvbXBvbmVudCc6dHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICdwLWJ1dHRvbi1pY29uLW9ubHknOiAoaWNvbiAmJiAhbGFiZWwpLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3AtYnV0dG9uLXZlcnRpY2FsJzogKGljb25Qb3MgPT09ICd0b3AnIHx8IGljb25Qb3MgPT09ICdib3R0b20nKSAmJiBsYWJlbH1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgKGNsaWNrKT1cIm9uQ2xpY2suZW1pdCgkZXZlbnQpXCIgKGZvY3VzKT1cIm9uRm9jdXMuZW1pdCgkZXZlbnQpXCIgKGJsdXIpPVwib25CbHVyLmVtaXQoJGV2ZW50KVwiIHBSaXBwbGU+XG4gICAgICAgICAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiY29udGVudFRlbXBsYXRlXCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICA8c3BhbiBbbmdDbGFzc109XCJ7J3AtYnV0dG9uLWljb24nOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3AtYnV0dG9uLWljb24tbGVmdCc6IGljb25Qb3MgPT09ICdsZWZ0JyAmJiBsYWJlbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICdwLWJ1dHRvbi1pY29uLXJpZ2h0JzogaWNvblBvcyA9PT0gJ3JpZ2h0JyAmJiBsYWJlbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICdwLWJ1dHRvbi1pY29uLXRvcCc6IGljb25Qb3MgPT09ICd0b3AnICYmIGxhYmVsLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3AtYnV0dG9uLWljb24tYm90dG9tJzogaWNvblBvcyA9PT0gJ2JvdHRvbScgJiYgbGFiZWx9XCJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtjbGFzc109XCJpY29uXCIgKm5nSWY9XCJpY29uXCIgW2F0dHIuYXJpYS1oaWRkZW5dPVwidHJ1ZVwiPjwvc3Bhbj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicC1idXR0b24tbGFiZWxcIiBbYXR0ci5hcmlhLWhpZGRlbl09XCJpY29uICYmICFsYWJlbFwiPnt7bGFiZWx8fCcmbmJzcDsnfX08L3NwYW4+XG4gICAgICAgICAgICA8c3BhbiBbbmdDbGFzc109XCIncC1iYWRnZSdcIiAqbmdJZj1cImJhZGdlXCIgW2NsYXNzXT1cImJhZGdlQ2xhc3NcIj57e2JhZGdlfX08L3NwYW4+XG4gICAgICAgIDwvYnV0dG9uPlxuICAgIGAsXG4gICAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gICAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZVxufSlcbmV4cG9ydCBjbGFzcyBCdXR0b24gaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0IHtcblxuICAgIEBJbnB1dCgpIHR5cGU6IHN0cmluZyA9IFwiYnV0dG9uXCI7XG5cbiAgICBASW5wdXQoKSBpY29uUG9zOiBzdHJpbmcgPSAnbGVmdCc7XG5cbiAgICBASW5wdXQoKSBpY29uOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBiYWRnZTogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgbGFiZWw6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIGRpc2FibGVkOiBib29sZWFuO1xuXG4gICAgQElucHV0KCkgc3R5bGU6IGFueTtcblxuICAgIEBJbnB1dCgpIHN0eWxlQ2xhc3M6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIGJhZGdlQ2xhc3M6IHN0cmluZztcblxuICAgIGNvbnRlbnRUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIEBDb250ZW50Q2hpbGRyZW4oUHJpbWVUZW1wbGF0ZSkgdGVtcGxhdGVzOiBRdWVyeUxpc3Q8YW55PjtcblxuICAgIEBPdXRwdXQoKSBvbkNsaWNrOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKSBvbkZvY3VzOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKSBvbkJsdXI6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgICAgICB0aGlzLnRlbXBsYXRlcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgICBzd2l0Y2goaXRlbS5nZXRUeXBlKCkpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdjb250ZW50JzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZW50VGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudFRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5ATmdNb2R1bGUoe1xuICAgIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsUmlwcGxlTW9kdWxlXSxcbiAgICBleHBvcnRzOiBbQnV0dG9uRGlyZWN0aXZlLEJ1dHRvbl0sXG4gICAgZGVjbGFyYXRpb25zOiBbQnV0dG9uRGlyZWN0aXZlLEJ1dHRvbl1cbn0pXG5leHBvcnQgY2xhc3MgQnV0dG9uTW9kdWxlIHsgfVxuIl19