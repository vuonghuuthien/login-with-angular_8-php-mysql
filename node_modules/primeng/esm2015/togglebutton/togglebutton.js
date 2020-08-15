import { NgModule, Component, Input, Output, EventEmitter, forwardRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RippleModule } from 'primeng/ripple';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
export const TOGGLEBUTTON_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ToggleButton),
    multi: true
};
export class ToggleButton {
    constructor(cd) {
        this.cd = cd;
        this.iconPos = 'left';
        this.onChange = new EventEmitter();
        this.checked = false;
        this.onModelChange = () => { };
        this.onModelTouched = () => { };
    }
    toggle(event) {
        if (!this.disabled) {
            this.checked = !this.checked;
            this.onModelChange(this.checked);
            this.onModelTouched();
            this.onChange.emit({
                originalEvent: event,
                checked: this.checked
            });
            this.cd.markForCheck();
        }
    }
    onBlur() {
        this.onModelTouched();
    }
    writeValue(value) {
        this.checked = value;
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
    get hasOnLabel() {
        return this.onLabel && this.onLabel.length > 0;
    }
    get hasOffLabel() {
        return this.onLabel && this.onLabel.length > 0;
    }
}
ToggleButton.ctorParameters = () => [
    { type: ChangeDetectorRef }
];
ToggleButton.decorators = [
    { type: Component, args: [{
                selector: 'p-toggleButton',
                template: `
        <div [ngClass]="{'p-button p-togglebutton p-component': true, 'p-button-icon-only': (onIcon && offIcon && !hasOnLabel && !hasOffLabel),'p-highlight': checked,'p-disabled':disabled}" 
                        [ngStyle]="style" [class]="styleClass" (click)="toggle($event)" (keydown.enter)="toggle($event)"
                        [attr.tabindex]="disabled ? null : '0'" role="checkbox" [attr.aria-checked]="checked" pRipple>
            <span *ngIf="onIcon||offIcon" [class]="checked ? this.onIcon : this.offIcon" 
                [ngClass]="{'p-button-icon': true, 'p-button-icon-left': (iconPos === 'left'), 'p-button-icon-right': (iconPos === 'right')}"></span>
            <span class="p-button-label">{{checked ? hasOnLabel ? onLabel : '' : hasOffLabel ? offLabel : ''}}</span>
        </div>
    `,
                providers: [TOGGLEBUTTON_VALUE_ACCESSOR],
                changeDetection: ChangeDetectionStrategy.OnPush,
                styles: [".p-button{margin:0;display:-ms-inline-flexbox;display:inline-flex;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-ms-flex-align:center;align-items:center;vertical-align:bottom;text-align:center;overflow:hidden;position:relative}.p-button-label{-ms-flex:1 1 auto;flex:1 1 auto}.p-button-icon-right{-ms-flex-order:1;order:1}.p-button:disabled{cursor:default}.p-button-icon-only{-ms-flex-pack:center;justify-content:center}.p-button-icon-only .p-button-label{visibility:hidden;width:0;-ms-flex:0 0 auto;flex:0 0 auto}.p-button-vertical{-ms-flex-direction:column;flex-direction:column}.p-button-icon-bottom{-ms-flex-order:2;order:2}.p-buttonset .p-button{margin:0}.p-buttonset .p-button:not(:last-child){border-right:0}.p-buttonset .p-button:not(:first-of-type):not(:last-of-type){border-radius:0}.p-buttonset .p-button:first-of-type{border-top-right-radius:0;border-bottom-right-radius:0}.p-buttonset .p-button:last-of-type{border-top-left-radius:0;border-bottom-left-radius:0}.p-buttonset .p-button:focus{position:relative;z-index:1}"]
            },] }
];
ToggleButton.ctorParameters = () => [
    { type: ChangeDetectorRef }
];
ToggleButton.propDecorators = {
    onLabel: [{ type: Input }],
    offLabel: [{ type: Input }],
    onIcon: [{ type: Input }],
    offIcon: [{ type: Input }],
    ariaLabelledBy: [{ type: Input }],
    disabled: [{ type: Input }],
    style: [{ type: Input }],
    styleClass: [{ type: Input }],
    inputId: [{ type: Input }],
    tabindex: [{ type: Input }],
    iconPos: [{ type: Input }],
    onChange: [{ type: Output }]
};
export class ToggleButtonModule {
}
ToggleButtonModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule, RippleModule],
                exports: [ToggleButton],
                declarations: [ToggleButton]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9nZ2xlYnV0dG9uLmpzIiwic291cmNlUm9vdCI6Im5nOi8vcHJpbWVuZy90b2dnbGVidXR0b24vIiwic291cmNlcyI6WyJ0b2dnbGVidXR0b24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFFBQVEsRUFBQyxTQUFTLEVBQUMsS0FBSyxFQUFDLE1BQU0sRUFBQyxZQUFZLEVBQUMsVUFBVSxFQUFDLHVCQUF1QixFQUFDLGlCQUFpQixFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ2hJLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUM3QyxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDNUMsT0FBTyxFQUFDLGlCQUFpQixFQUF1QixNQUFNLGdCQUFnQixDQUFDO0FBRXZFLE1BQU0sQ0FBQyxNQUFNLDJCQUEyQixHQUFRO0lBQzlDLE9BQU8sRUFBRSxpQkFBaUI7SUFDMUIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUM7SUFDM0MsS0FBSyxFQUFFLElBQUk7Q0FDWixDQUFDO0FBaUJGLE1BQU0sT0FBTyxZQUFZO0lBZ0NyQixZQUFvQixFQUFxQjtRQUFyQixPQUFFLEdBQUYsRUFBRSxDQUFtQjtRQVZoQyxZQUFPLEdBQVcsTUFBTSxDQUFDO1FBRXhCLGFBQVEsR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUUzRCxZQUFPLEdBQVksS0FBSyxDQUFDO1FBRXpCLGtCQUFhLEdBQWEsR0FBRyxFQUFFLEdBQUUsQ0FBQyxDQUFDO1FBRW5DLG1CQUFjLEdBQWEsR0FBRyxFQUFFLEdBQUUsQ0FBQyxDQUFDO0lBRVMsQ0FBQztJQUU5QyxNQUFNLENBQUMsS0FBWTtRQUNmLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2hCLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO1lBQzdCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ2pDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUN0QixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztnQkFDZixhQUFhLEVBQUUsS0FBSztnQkFDcEIsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPO2FBQ3hCLENBQUMsQ0FBQztZQUVILElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLENBQUM7U0FDMUI7SUFDTCxDQUFDO0lBRUQsTUFBTTtRQUNGLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUMxQixDQUFDO0lBRUQsVUFBVSxDQUFDLEtBQVU7UUFDakIsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7UUFDckIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUMzQixDQUFDO0lBRUQsZ0JBQWdCLENBQUMsRUFBWTtRQUN6QixJQUFJLENBQUMsYUFBYSxHQUFHLEVBQUUsQ0FBQztJQUM1QixDQUFDO0lBRUQsaUJBQWlCLENBQUMsRUFBWTtRQUMxQixJQUFJLENBQUMsY0FBYyxHQUFHLEVBQUUsQ0FBQztJQUM3QixDQUFDO0lBRUQsZ0JBQWdCLENBQUMsR0FBWTtRQUN6QixJQUFJLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQztJQUN4QixDQUFDO0lBRUQsSUFBSSxVQUFVO1FBQ1YsT0FBTyxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztJQUNuRCxDQUFDO0lBRUQsSUFBSSxXQUFXO1FBQ1gsT0FBTyxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztJQUNuRCxDQUFDOzs7WUEzQ3VCLGlCQUFpQjs7O1lBL0M1QyxTQUFTLFNBQUM7Z0JBQ1AsUUFBUSxFQUFFLGdCQUFnQjtnQkFDMUIsUUFBUSxFQUFFOzs7Ozs7OztLQVFUO2dCQUNELFNBQVMsRUFBRSxDQUFDLDJCQUEyQixDQUFDO2dCQUN4QyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTs7YUFFbEQ7OztZQXpCdUYsaUJBQWlCOzs7c0JBNEJwRyxLQUFLO3VCQUVMLEtBQUs7cUJBRUwsS0FBSztzQkFFTCxLQUFLOzZCQUVMLEtBQUs7dUJBRUwsS0FBSztvQkFFTCxLQUFLO3lCQUVMLEtBQUs7c0JBRUwsS0FBSzt1QkFFTCxLQUFLO3NCQUVMLEtBQUs7dUJBRUwsTUFBTTs7QUEyRFgsTUFBTSxPQUFPLGtCQUFrQjs7O1lBTDlCLFFBQVEsU0FBQztnQkFDTixPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUMsWUFBWSxDQUFDO2dCQUNwQyxPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7Z0JBQ3ZCLFlBQVksRUFBRSxDQUFDLFlBQVksQ0FBQzthQUMvQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7TmdNb2R1bGUsQ29tcG9uZW50LElucHV0LE91dHB1dCxFdmVudEVtaXR0ZXIsZm9yd2FyZFJlZixDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxDaGFuZ2VEZXRlY3RvclJlZn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7UmlwcGxlTW9kdWxlfSBmcm9tICdwcmltZW5nL3JpcHBsZSc7XG5pbXBvcnQge05HX1ZBTFVFX0FDQ0VTU09SLCBDb250cm9sVmFsdWVBY2Nlc3Nvcn0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG5leHBvcnQgY29uc3QgVE9HR0xFQlVUVE9OX1ZBTFVFX0FDQ0VTU09SOiBhbnkgPSB7XG4gIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBUb2dnbGVCdXR0b24pLFxuICBtdWx0aTogdHJ1ZVxufTtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdwLXRvZ2dsZUJ1dHRvbicsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPGRpdiBbbmdDbGFzc109XCJ7J3AtYnV0dG9uIHAtdG9nZ2xlYnV0dG9uIHAtY29tcG9uZW50JzogdHJ1ZSwgJ3AtYnV0dG9uLWljb24tb25seSc6IChvbkljb24gJiYgb2ZmSWNvbiAmJiAhaGFzT25MYWJlbCAmJiAhaGFzT2ZmTGFiZWwpLCdwLWhpZ2hsaWdodCc6IGNoZWNrZWQsJ3AtZGlzYWJsZWQnOmRpc2FibGVkfVwiIFxuICAgICAgICAgICAgICAgICAgICAgICAgW25nU3R5bGVdPVwic3R5bGVcIiBbY2xhc3NdPVwic3R5bGVDbGFzc1wiIChjbGljayk9XCJ0b2dnbGUoJGV2ZW50KVwiIChrZXlkb3duLmVudGVyKT1cInRvZ2dsZSgkZXZlbnQpXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIFthdHRyLnRhYmluZGV4XT1cImRpc2FibGVkID8gbnVsbCA6ICcwJ1wiIHJvbGU9XCJjaGVja2JveFwiIFthdHRyLmFyaWEtY2hlY2tlZF09XCJjaGVja2VkXCIgcFJpcHBsZT5cbiAgICAgICAgICAgIDxzcGFuICpuZ0lmPVwib25JY29ufHxvZmZJY29uXCIgW2NsYXNzXT1cImNoZWNrZWQgPyB0aGlzLm9uSWNvbiA6IHRoaXMub2ZmSWNvblwiIFxuICAgICAgICAgICAgICAgIFtuZ0NsYXNzXT1cInsncC1idXR0b24taWNvbic6IHRydWUsICdwLWJ1dHRvbi1pY29uLWxlZnQnOiAoaWNvblBvcyA9PT0gJ2xlZnQnKSwgJ3AtYnV0dG9uLWljb24tcmlnaHQnOiAoaWNvblBvcyA9PT0gJ3JpZ2h0Jyl9XCI+PC9zcGFuPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwLWJ1dHRvbi1sYWJlbFwiPnt7Y2hlY2tlZCA/IGhhc09uTGFiZWwgPyBvbkxhYmVsIDogJycgOiBoYXNPZmZMYWJlbCA/IG9mZkxhYmVsIDogJyd9fTwvc3Bhbj5cbiAgICAgICAgPC9kaXY+XG4gICAgYCxcbiAgICBwcm92aWRlcnM6IFtUT0dHTEVCVVRUT05fVkFMVUVfQUNDRVNTT1JdLFxuICAgIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICAgIHN0eWxlVXJsczogWycuLi9idXR0b24vYnV0dG9uLmNzcyddXG59KVxuZXhwb3J0IGNsYXNzIFRvZ2dsZUJ1dHRvbiBpbXBsZW1lbnRzIENvbnRyb2xWYWx1ZUFjY2Vzc29yIHtcblxuICAgIEBJbnB1dCgpIG9uTGFiZWw6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIG9mZkxhYmVsOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBvbkljb246IHN0cmluZztcblxuICAgIEBJbnB1dCgpIG9mZkljb246IHN0cmluZztcblxuICAgIEBJbnB1dCgpIGFyaWFMYWJlbGxlZEJ5OiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBkaXNhYmxlZDogYm9vbGVhbjtcblxuICAgIEBJbnB1dCgpIHN0eWxlOiBhbnk7XG5cbiAgICBASW5wdXQoKSBzdHlsZUNsYXNzOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBpbnB1dElkOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSB0YWJpbmRleDogbnVtYmVyO1xuXG4gICAgQElucHV0KCkgaWNvblBvczogc3RyaW5nID0gJ2xlZnQnO1xuXG4gICAgQE91dHB1dCgpIG9uQ2hhbmdlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICAgICAgICAgXG4gICAgY2hlY2tlZDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIFxuICAgIG9uTW9kZWxDaGFuZ2U6IEZ1bmN0aW9uID0gKCkgPT4ge307XG4gICAgXG4gICAgb25Nb2RlbFRvdWNoZWQ6IEZ1bmN0aW9uID0gKCkgPT4ge307XG4gICAgXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBjZDogQ2hhbmdlRGV0ZWN0b3JSZWYpIHsgfVxuICAgIFxuICAgIHRvZ2dsZShldmVudDogRXZlbnQpIHtcbiAgICAgICAgaWYgKCF0aGlzLmRpc2FibGVkKSB7XG4gICAgICAgICAgICB0aGlzLmNoZWNrZWQgPSAhdGhpcy5jaGVja2VkO1xuICAgICAgICAgICAgdGhpcy5vbk1vZGVsQ2hhbmdlKHRoaXMuY2hlY2tlZCk7XG4gICAgICAgICAgICB0aGlzLm9uTW9kZWxUb3VjaGVkKCk7XG4gICAgICAgICAgICB0aGlzLm9uQ2hhbmdlLmVtaXQoe1xuICAgICAgICAgICAgICAgIG9yaWdpbmFsRXZlbnQ6IGV2ZW50LFxuICAgICAgICAgICAgICAgIGNoZWNrZWQ6IHRoaXMuY2hlY2tlZFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgb25CbHVyKCkge1xuICAgICAgICB0aGlzLm9uTW9kZWxUb3VjaGVkKCk7XG4gICAgfVxuICAgIFxuICAgIHdyaXRlVmFsdWUodmFsdWU6IGFueSkgOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jaGVja2VkID0gdmFsdWU7XG4gICAgICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuICAgIFxuICAgIHJlZ2lzdGVyT25DaGFuZ2UoZm46IEZ1bmN0aW9uKTogdm9pZCB7XG4gICAgICAgIHRoaXMub25Nb2RlbENoYW5nZSA9IGZuO1xuICAgIH1cblxuICAgIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiBGdW5jdGlvbik6IHZvaWQge1xuICAgICAgICB0aGlzLm9uTW9kZWxUb3VjaGVkID0gZm47XG4gICAgfVxuICAgIFxuICAgIHNldERpc2FibGVkU3RhdGUodmFsOiBib29sZWFuKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZGlzYWJsZWQgPSB2YWw7XG4gICAgfVxuICAgIFxuICAgIGdldCBoYXNPbkxhYmVsKCk6Ym9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLm9uTGFiZWwgJiYgdGhpcy5vbkxhYmVsLmxlbmd0aCA+IDA7XG4gICAgfVxuICAgIFxuICAgIGdldCBoYXNPZmZMYWJlbCgpOmJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5vbkxhYmVsICYmIHRoaXMub25MYWJlbC5sZW5ndGggPiAwO1xuICAgIH1cbn1cblxuQE5nTW9kdWxlKHtcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLFJpcHBsZU1vZHVsZV0sXG4gICAgZXhwb3J0czogW1RvZ2dsZUJ1dHRvbl0sXG4gICAgZGVjbGFyYXRpb25zOiBbVG9nZ2xlQnV0dG9uXVxufSlcbmV4cG9ydCBjbGFzcyBUb2dnbGVCdXR0b25Nb2R1bGUgeyB9XG4iXX0=