import { NgModule, Component, Input, Output, EventEmitter, forwardRef, ChangeDetectorRef, ContentChild, TemplateRef, SimpleChanges, OnChanges, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ObjectUtils } from 'primeng/utils';
import { RippleModule } from 'primeng/ripple';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
export const SELECTBUTTON_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SelectButton),
    multi: true
};
export class SelectButton {
    constructor(cd) {
        this.cd = cd;
        this.tabindex = 0;
        this.onOptionClick = new EventEmitter();
        this.onChange = new EventEmitter();
        this.onModelChange = () => { };
        this.onModelTouched = () => { };
    }
    get options() {
        return this._options;
    }
    set options(val) {
        //NoOp
    }
    ngOnChanges(simpleChange) {
        if (simpleChange.options) {
            this._options = this.optionLabel ? ObjectUtils.generateSelectItems(simpleChange.options.currentValue, this.optionLabel) : simpleChange.options.currentValue;
        }
    }
    writeValue(value) {
        this.value = value;
        this.cd.markForCheck();
    }
    registerOnChange(fn) {
        this.onModelChange = fn;
    }
    registerOnTouched(fn) {
        this.onModelTouched = fn;
    }
    setDisabledState(val) {
        this.disabled = val;
    }
    onItemClick(event, option, index) {
        if (this.disabled || option.disabled) {
            return;
        }
        if (this.multiple) {
            let itemIndex = this.findItemIndex(option);
            if (itemIndex != -1)
                this.value = this.value.filter((val, i) => i != itemIndex);
            else
                this.value = [...this.value || [], option.value];
        }
        else {
            this.value = option.value;
        }
        this.onOptionClick.emit({
            originalEvent: event,
            option: option,
            index: index
        });
        this.onModelChange(this.value);
        this.onChange.emit({
            originalEvent: event,
            value: this.value
        });
    }
    onBlur(event) {
        this.onModelTouched();
    }
    isSelected(option) {
        if (this.multiple)
            return this.findItemIndex(option) != -1;
        else
            return ObjectUtils.equals(option.value, this.value, this.dataKey);
    }
    findItemIndex(option) {
        let index = -1;
        if (this.value) {
            for (let i = 0; i < this.value.length; i++) {
                if (this.value[i] == option.value) {
                    index = i;
                    break;
                }
            }
        }
        return index;
    }
}
SelectButton.ctorParameters = () => [
    { type: ChangeDetectorRef }
];
SelectButton.decorators = [
    { type: Component, args: [{
                selector: 'p-selectButton',
                template: `
        <div [ngClass]="'p-selectbutton p-buttonset p-component'" [ngStyle]="style" [class]="styleClass"  role="group">
            <div *ngFor="let option of options; let i = index" #btn class="p-button p-component" [class]="option.styleClass" role="button" [attr.aria-pressed]="isSelected(option)"
                [ngClass]="{'p-highlight':isSelected(option), 'p-disabled': disabled || option.disabled, 
                'p-button-icon-only': (option.icon && !option.label)}" (click)="onItemClick($event,option,i)" (keydown.enter)="onItemClick($event,option,i)"
                [attr.title]="option.title" [attr.aria-label]="option.label" (blur)="onBlur($event)" [attr.tabindex]="tabindex" [attr.aria-labelledby]="ariaLabelledBy" pRipple>
                <ng-container *ngIf="!itemTemplate else customcontent">
                    <span [ngClass]="'p-button-icon p-button-icon-left'" [class]="option.icon" *ngIf="option.icon"></span>
                    <span class="p-button-label">{{option.label}}</span>
                </ng-container>
                <ng-template #customcontent>
                    <ng-container *ngTemplateOutlet="itemTemplate; context: {$implicit: option, index: i}"></ng-container>
                </ng-template>
            </div>
        </div>
    `,
                providers: [SELECTBUTTON_VALUE_ACCESSOR],
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                styles: [".ui-selectbutton{display:inline-block}.ui-selectbutton.ui-state-error{padding:0}.ui-selectbutton .ui-button.ui-state-focus{outline:0}", ".p-button{margin:0;display:-ms-inline-flexbox;display:inline-flex;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-ms-flex-align:center;align-items:center;vertical-align:bottom;text-align:center;overflow:hidden;position:relative}.p-button-label{-ms-flex:1 1 auto;flex:1 1 auto}.p-button-icon-right{-ms-flex-order:1;order:1}.p-button:disabled{cursor:default}.p-button-icon-only{-ms-flex-pack:center;justify-content:center}.p-button-icon-only .p-button-label{visibility:hidden;width:0;-ms-flex:0 0 auto;flex:0 0 auto}.p-button-vertical{-ms-flex-direction:column;flex-direction:column}.p-button-icon-bottom{-ms-flex-order:2;order:2}.p-buttonset .p-button{margin:0}.p-buttonset .p-button:not(:last-child){border-right:0}.p-buttonset .p-button:not(:first-of-type):not(:last-of-type){border-radius:0}.p-buttonset .p-button:first-of-type{border-top-right-radius:0;border-bottom-right-radius:0}.p-buttonset .p-button:last-of-type{border-top-left-radius:0;border-bottom-left-radius:0}.p-buttonset .p-button:focus{position:relative;z-index:1}"]
            },] }
];
SelectButton.ctorParameters = () => [
    { type: ChangeDetectorRef }
];
SelectButton.propDecorators = {
    tabindex: [{ type: Input }],
    multiple: [{ type: Input }],
    style: [{ type: Input }],
    styleClass: [{ type: Input }],
    ariaLabelledBy: [{ type: Input }],
    disabled: [{ type: Input }],
    dataKey: [{ type: Input }],
    optionLabel: [{ type: Input }],
    onOptionClick: [{ type: Output }],
    onChange: [{ type: Output }],
    itemTemplate: [{ type: ContentChild, args: [TemplateRef,] }],
    options: [{ type: Input }]
};
export class SelectButtonModule {
}
SelectButtonModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule, RippleModule],
                exports: [SelectButton],
                declarations: [SelectButton]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0YnV0dG9uLmpzIiwic291cmNlUm9vdCI6Im5nOi8vcHJpbWVuZy9zZWxlY3RidXR0b24vIiwic291cmNlcyI6WyJzZWxlY3RidXR0b24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFFBQVEsRUFBQyxTQUFTLEVBQUMsS0FBSyxFQUFDLE1BQU0sRUFBQyxZQUFZLEVBQUMsVUFBVSxFQUFDLGlCQUFpQixFQUFDLFlBQVksRUFBQyxXQUFXLEVBQUMsYUFBYSxFQUFDLFNBQVMsRUFBQyx1QkFBdUIsRUFBRSxpQkFBaUIsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUNwTSxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFFN0MsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUMxQyxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDNUMsT0FBTyxFQUFDLGlCQUFpQixFQUF1QixNQUFNLGdCQUFnQixDQUFDO0FBRXZFLE1BQU0sQ0FBQyxNQUFNLDJCQUEyQixHQUFRO0lBQzlDLE9BQU8sRUFBRSxpQkFBaUI7SUFDMUIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUM7SUFDM0MsS0FBSyxFQUFFLElBQUk7Q0FDWixDQUFDO0FBeUJGLE1BQU0sT0FBTyxZQUFZO0lBZ0NyQixZQUFvQixFQUFxQjtRQUFyQixPQUFFLEdBQUYsRUFBRSxDQUFtQjtRQTlCaEMsYUFBUSxHQUFXLENBQUMsQ0FBQztRQWdCcEIsa0JBQWEsR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUV0RCxhQUFRLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFRM0Qsa0JBQWEsR0FBYSxHQUFHLEVBQUUsR0FBRSxDQUFDLENBQUM7UUFFbkMsbUJBQWMsR0FBYSxHQUFHLEVBQUUsR0FBRSxDQUFDLENBQUM7SUFFUSxDQUFDO0lBRTdDLElBQWEsT0FBTztRQUNoQixPQUFP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RSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3ZDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxNQUFNLENBQUMsS0FBSyxFQUFFO29CQUMvQixLQUFLLEdBQUcsQ0FBQyxDQUFDO29CQUNWLE1BQU07aUJBQ1Q7YUFDSjtTQUNKO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQzs7O1lBckZ1QixpQkFBaUI7OztZQXZENUMsU0FBUyxTQUFDO2dCQUNQLFFBQVEsRUFBRSxnQkFBZ0I7Z0JBQzFCLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7O0tBZVQ7Z0JBQ0QsU0FBUyxFQUFFLENBQUMsMkJBQTJCLENBQUM7Z0JBQ3hDLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2dCQUMvQyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTs7YUFFeEM7OztZQW5DK0QsaUJBQWlCOzs7dUJBc0M1RSxLQUFLO3VCQUVMLEtBQUs7b0JBRUwsS0FBSzt5QkFFTCxLQUFLOzZCQUVMLEtBQUs7dUJBRUwsS0FBSztzQkFFTCxLQUFLOzBCQUVMLEtBQUs7NEJBRUwsTUFBTTt1QkFFTixNQUFNOzJCQUVOLFlBQVksU0FBQyxXQUFXO3NCQVl4QixLQUFLOztBQTJGVixNQUFNLE9BQU8sa0JBQWtCOzs7WUFMOUIsUUFBUSxTQUFDO2dCQUNOLE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBQyxZQUFZLENBQUM7Z0JBQ3BDLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQztnQkFDdkIsWUFBWSxFQUFFLENBQUMsWUFBWSxDQUFDO2FBQy9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtOZ01vZHVsZSxDb21wb25lbnQsSW5wdXQsT3V0cHV0LEV2ZW50RW1pdHRlcixmb3J3YXJkUmVmLENoYW5nZURldGVjdG9yUmVmLENvbnRlbnRDaGlsZCxUZW1wbGF0ZVJlZixTaW1wbGVDaGFuZ2VzLE9uQ2hhbmdlcyxDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgVmlld0VuY2Fwc3VsYXRpb259IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1NlbGVjdEl0ZW19IGZyb20gJ3ByaW1lbmcvYXBpJztcbmltcG9ydCB7T2JqZWN0VXRpbHN9IGZyb20gJ3ByaW1lbmcvdXRpbHMnO1xuaW1wb3J0IHtSaXBwbGVNb2R1bGV9IGZyb20gJ3ByaW1lbmcvcmlwcGxlJztcbmltcG9ydCB7TkdfVkFMVUVfQUNDRVNTT1IsIENvbnRyb2xWYWx1ZUFjY2Vzc29yfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbmV4cG9ydCBjb25zdCBTRUxFQ1RCVVRUT05fVkFMVUVfQUNDRVNTT1I6IGFueSA9IHtcbiAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IFNlbGVjdEJ1dHRvbiksXG4gIG11bHRpOiB0cnVlXG59O1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3Atc2VsZWN0QnV0dG9uJyxcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgICA8ZGl2IFtuZ0NsYXNzXT1cIidwLXNlbGVjdGJ1dHRvbiBwLWJ1dHRvbnNldCBwLWNvbXBvbmVudCdcIiBbbmdTdHlsZV09XCJzdHlsZVwiIFtjbGFzc109XCJzdHlsZUNsYXNzXCIgIHJvbGU9XCJncm91cFwiPlxuICAgICAgICAgICAgPGRpdiAqbmdGb3I9XCJsZXQgb3B0aW9uIG9mIG9wdGlvbnM7IGxldCBpID0gaW5kZXhcIiAjYnRuIGNsYXNzPVwicC1idXR0b24gcC1jb21wb25lbnRcIiBbY2xhc3NdPVwib3B0aW9uLnN0eWxlQ2xhc3NcIiByb2xlPVwiYnV0dG9uXCIgW2F0dHIuYXJpYS1wcmVzc2VkXT1cImlzU2VsZWN0ZWQob3B0aW9uKVwiXG4gICAgICAgICAgICAgICAgW25nQ2xhc3NdPVwieydwLWhpZ2hsaWdodCc6aXNTZWxlY3RlZChvcHRpb24pLCAncC1kaXNhYmxlZCc6IGRpc2FibGVkIHx8IG9wdGlvbi5kaXNhYmxlZCwgXG4gICAgICAgICAgICAgICAgJ3AtYnV0dG9uLWljb24tb25seSc6IChvcHRpb24uaWNvbiAmJiAhb3B0aW9uLmxhYmVsKX1cIiAoY2xpY2spPVwib25JdGVtQ2xpY2soJGV2ZW50LG9wdGlvbixpKVwiIChrZXlkb3duLmVudGVyKT1cIm9uSXRlbUNsaWNrKCRldmVudCxvcHRpb24saSlcIlxuICAgICAgICAgICAgICAgIFthdHRyLnRpdGxlXT1cIm9wdGlvbi50aXRsZVwiIFthdHRyLmFyaWEtbGFiZWxdPVwib3B0aW9uLmxhYmVsXCIgKGJsdXIpPVwib25CbHVyKCRldmVudClcIiBbYXR0ci50YWJpbmRleF09XCJ0YWJpbmRleFwiIFthdHRyLmFyaWEtbGFiZWxsZWRieV09XCJhcmlhTGFiZWxsZWRCeVwiIHBSaXBwbGU+XG4gICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cIiFpdGVtVGVtcGxhdGUgZWxzZSBjdXN0b21jb250ZW50XCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIFtuZ0NsYXNzXT1cIidwLWJ1dHRvbi1pY29uIHAtYnV0dG9uLWljb24tbGVmdCdcIiBbY2xhc3NdPVwib3B0aW9uLmljb25cIiAqbmdJZj1cIm9wdGlvbi5pY29uXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInAtYnV0dG9uLWxhYmVsXCI+e3tvcHRpb24ubGFiZWx9fTwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICA8bmctdGVtcGxhdGUgI2N1c3RvbWNvbnRlbnQ+XG4gICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJpdGVtVGVtcGxhdGU7IGNvbnRleHQ6IHskaW1wbGljaXQ6IG9wdGlvbiwgaW5kZXg6IGl9XCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICBgLFxuICAgIHByb3ZpZGVyczogW1NFTEVDVEJVVFRPTl9WQUxVRV9BQ0NFU1NPUl0sXG4gICAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gICAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgICBzdHlsZVVybHM6IFsnLi9zZWxlY3RidXR0b24uY3NzJywgJy4uL2J1dHRvbi9idXR0b24uY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgU2VsZWN0QnV0dG9uIGltcGxlbWVudHMgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE9uQ2hhbmdlcyB7XG5cbiAgICBASW5wdXQoKSB0YWJpbmRleDogbnVtYmVyID0gMDtcblxuICAgIEBJbnB1dCgpIG11bHRpcGxlOiBib29sZWFuO1xuICAgIFxuICAgIEBJbnB1dCgpIHN0eWxlOiBhbnk7XG4gICAgICAgIFxuICAgIEBJbnB1dCgpIHN0eWxlQ2xhc3M6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIGFyaWFMYWJlbGxlZEJ5OiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBkaXNhYmxlZDogYm9vbGVhbjtcblxuICAgIEBJbnB1dCgpIGRhdGFLZXk6IHN0cmluZ1xuICAgIFxuICAgIEBJbnB1dCgpIG9wdGlvbkxhYmVsOiBzdHJpbmc7XG4gICAgXG4gICAgQE91dHB1dCgpIG9uT3B0aW9uQ2xpY2s6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpIG9uQ2hhbmdlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBDb250ZW50Q2hpbGQoVGVtcGxhdGVSZWYpIGl0ZW1UZW1wbGF0ZTtcbiAgICBcbiAgICB2YWx1ZTogYW55O1xuICAgICAgICBcbiAgICBfb3B0aW9uczogYW55W107XG4gICAgXG4gICAgb25Nb2RlbENoYW5nZTogRnVuY3Rpb24gPSAoKSA9PiB7fTtcbiAgICBcbiAgICBvbk1vZGVsVG91Y2hlZDogRnVuY3Rpb24gPSAoKSA9PiB7fTtcbiAgICBcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNkOiBDaGFuZ2VEZXRlY3RvclJlZikge31cbiAgICBcbiAgICBASW5wdXQoKSBnZXQgb3B0aW9ucygpOiBhbnlbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9vcHRpb25zO1xuICAgIH1cblxuICAgIHNldCBvcHRpb25zKHZhbDogYW55W10pIHtcbiAgICAgICAgLy9Ob09wXG4gICAgfVxuXG4gICAgbmdPbkNoYW5nZXMoc2ltcGxlQ2hhbmdlOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgICAgIGlmIChzaW1wbGVDaGFuZ2Uub3B0aW9ucykge1xuICAgICAgICAgICAgdGhpcy5fb3B0aW9ucyA9IHRoaXMub3B0aW9uTGFiZWwgPyBPYmplY3RVdGlscy5nZW5lcmF0ZVNlbGVjdEl0ZW1zKHNpbXBsZUNoYW5nZS5vcHRpb25zLmN1cnJlbnRWYWx1ZSwgdGhpcy5vcHRpb25MYWJlbCkgOiBzaW1wbGVDaGFuZ2Uub3B0aW9ucy5jdXJyZW50VmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgd3JpdGVWYWx1ZSh2YWx1ZTogYW55KSA6IHZvaWQge1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuICAgIFxuICAgIHJlZ2lzdGVyT25DaGFuZ2UoZm46IEZ1bmN0aW9uKTogdm9pZCB7XG4gICAgICAgIHRoaXMub25Nb2RlbENoYW5nZSA9IGZuO1xuICAgIH1cblxuICAgIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiBGdW5jdGlvbik6IHZvaWQge1xuICAgICAgICB0aGlzLm9uTW9kZWxUb3VjaGVkID0gZm47XG4gICAgfVxuICAgIFxuICAgIHNldERpc2FibGVkU3RhdGUodmFsOiBib29sZWFuKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZGlzYWJsZWQgPSB2YWw7XG4gICAgfVxuICAgIFxuICAgIG9uSXRlbUNsaWNrKGV2ZW50LCBvcHRpb246IFNlbGVjdEl0ZW0sIGluZGV4OiBudW1iZXIpIHtcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQgfHwgb3B0aW9uLmRpc2FibGVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgaWYgKHRoaXMubXVsdGlwbGUpIHtcbiAgICAgICAgICAgIGxldCBpdGVtSW5kZXggPSB0aGlzLmZpbmRJdGVtSW5kZXgob3B0aW9uKTtcbiAgICAgICAgICAgIGlmIChpdGVtSW5kZXggIT0gLTEpXG4gICAgICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHRoaXMudmFsdWUuZmlsdGVyKCh2YWwsaSkgPT4gaSE9aXRlbUluZGV4KTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlID0gWy4uLnRoaXMudmFsdWV8fFtdLCBvcHRpb24udmFsdWVdO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IG9wdGlvbi52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgdGhpcy5vbk9wdGlvbkNsaWNrLmVtaXQoe1xuICAgICAgICAgICAgb3JpZ2luYWxFdmVudDogZXZlbnQsXG4gICAgICAgICAgICBvcHRpb246IG9wdGlvbixcbiAgICAgICAgICAgIGluZGV4OiBpbmRleFxuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMub25Nb2RlbENoYW5nZSh0aGlzLnZhbHVlKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMub25DaGFuZ2UuZW1pdCh7XG4gICAgICAgICAgICBvcmlnaW5hbEV2ZW50OiBldmVudCxcbiAgICAgICAgICAgIHZhbHVlOiB0aGlzLnZhbHVlXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBcbiAgICBvbkJsdXIoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5vbk1vZGVsVG91Y2hlZCgpO1xuICAgIH1cbiAgICBcbiAgICBpc1NlbGVjdGVkKG9wdGlvbjogU2VsZWN0SXRlbSkge1xuICAgICAgICBpZiAodGhpcy5tdWx0aXBsZSlcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZpbmRJdGVtSW5kZXgob3B0aW9uKSAhPSAtMTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmV0dXJuIE9iamVjdFV0aWxzLmVxdWFscyhvcHRpb24udmFsdWUsIHRoaXMudmFsdWUsIHRoaXMuZGF0YUtleSk7XG4gICAgfVxuICAgIFxuICAgIGZpbmRJdGVtSW5kZXgob3B0aW9uOiBTZWxlY3RJdGVtKSB7XG4gICAgICAgIGxldCBpbmRleCA9IC0xO1xuICAgICAgICBpZiAodGhpcy52YWx1ZSkge1xuICAgICAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMudmFsdWUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy52YWx1ZVtpXSA9PSBvcHRpb24udmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5kZXggPSBpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGluZGV4O1xuICAgIH1cbn1cblxuQE5nTW9kdWxlKHtcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLFJpcHBsZU1vZHVsZV0sXG4gICAgZXhwb3J0czogW1NlbGVjdEJ1dHRvbl0sXG4gICAgZGVjbGFyYXRpb25zOiBbU2VsZWN0QnV0dG9uXVxufSlcbmV4cG9ydCBjbGFzcyBTZWxlY3RCdXR0b25Nb2R1bGUgeyB9XG4iXX0=