import { NgModule, Component, ElementRef, OnInit, Input, Output, EventEmitter, forwardRef, ViewChild, ChangeDetectorRef, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
export const SPINNER_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => Spinner),
    multi: true
};
export class Spinner {
    constructor(el, cd) {
        this.el = el;
        this.cd = cd;
        this.onChange = new EventEmitter();
        this.onFocus = new EventEmitter();
        this.onBlur = new EventEmitter();
        this._step = 1;
        this.onModelChange = () => { };
        this.onModelTouched = () => { };
        this.keyPattern = /[0-9\+\-]/;
        this.negativeSeparator = '-';
    }
    get step() {
        return this._step;
    }
    set step(val) {
        this._step = val;
        if (this._step != null) {
            let tokens = this.step.toString().split(/[,]|[.]/);
            this.calculatedPrecision = tokens[1] ? tokens[1].length : undefined;
        }
    }
    ngOnInit() {
        if (this.formatInput) {
            this.localeDecimalSeparator = (1.1).toLocaleString().substring(1, 2);
            this.localeThousandSeparator = (1000).toLocaleString().substring(1, 2);
            this.thousandRegExp = new RegExp(`[${this.thousandSeparator || this.localeThousandSeparator}]`, 'gim');
            if (this.decimalSeparator && this.thousandSeparator && this.decimalSeparator === this.thousandSeparator) {
                console.warn("thousandSeparator and decimalSeparator cannot have the same value.");
            }
        }
    }
    repeat(event, interval, dir) {
        let i = interval || 500;
        this.clearTimer();
        this.timer = setTimeout(() => {
            this.repeat(event, 40, dir);
        }, i);
        this.spin(event, dir);
    }
    spin(event, dir) {
        let step = this.step * dir;
        let currentValue;
        let precision = this.getPrecision();
        if (this.value)
            currentValue = (typeof this.value === 'string') ? this.parseValue(this.value) : this.value;
        else
            currentValue = 0;
        if (precision)
            this.value = parseFloat(this.toFixed(currentValue + step, precision));
        else
            this.value = currentValue + step;
        if (this.maxlength !== undefined && this.value.toString().length > this.maxlength) {
            this.value = currentValue;
        }
        if (this.min !== undefined && this.value < this.min) {
            this.value = this.min;
        }
        if (this.max !== undefined && this.value > this.max) {
            this.value = this.max;
        }
        this.formatValue();
        this.onModelChange(this.value);
        this.onChange.emit(event);
    }
    getPrecision() {
        return this.precision === undefined ? this.calculatedPrecision : this.precision;
    }
    toFixed(value, precision) {
        let power = Math.pow(10, precision || 0);
        return String(Math.round(value * power) / power);
    }
    onUpButtonMousedown(event) {
        if (!this.disabled) {
            this.inputfieldViewChild.nativeElement.focus();
            this.repeat(event, null, 1);
            this.updateFilledState();
            event.preventDefault();
        }
    }
    onUpButtonMouseup(event) {
        if (!this.disabled) {
            this.clearTimer();
        }
    }
    onUpButtonMouseleave(event) {
        if (!this.disabled) {
            this.clearTimer();
        }
    }
    onDownButtonMousedown(event) {
        if (!this.disabled) {
            this.inputfieldViewChild.nativeElement.focus();
            this.repeat(event, null, -1);
            this.updateFilledState();
            event.preventDefault();
        }
    }
    onDownButtonMouseup(event) {
        if (!this.disabled) {
            this.clearTimer();
        }
    }
    onDownButtonMouseleave(event) {
        if (!this.disabled) {
            this.clearTimer();
        }
    }
    onInputKeydown(event) {
        if (event.which == 38) {
            this.spin(event, 1);
            event.preventDefault();
        }
        else if (event.which == 40) {
            this.spin(event, -1);
            event.preventDefault();
        }
    }
    onInputChange(event) {
        this.onChange.emit(event);
    }
    onInput(event) {
        this.value = this.parseValue(event.target.value);
        this.onModelChange(this.value);
        this.updateFilledState();
    }
    onInputBlur(event) {
        this.focus = false;
        this.formatValue();
        this.onModelTouched();
        this.onBlur.emit(event);
    }
    onInputFocus(event) {
        this.focus = true;
        this.onFocus.emit(event);
    }
    parseValue(val) {
        let value;
        let precision = this.getPrecision();
        if (val.trim() === '') {
            value = null;
        }
        else {
            if (this.formatInput) {
                val = val.replace(this.thousandRegExp, '');
            }
            if (precision) {
                val = this.formatInput ? val.replace(this.decimalSeparator || this.localeDecimalSeparator, '.') : val.replace(',', '.');
                value = parseFloat(val);
            }
            else {
                value = parseInt(val, 10);
            }
            if (!isNaN(value)) {
                if (this.max !== null && value > this.max) {
                    value = this.max;
                }
                if (this.min !== null && value < this.min) {
                    value = this.min;
                }
            }
            else {
                value = null;
            }
        }
        return value;
    }
    formatValue() {
        let value = this.value;
        let precision = this.getPrecision();
        if (value != null) {
            if (this.formatInput) {
                value = value.toLocaleString(undefined, { maximumFractionDigits: 20 });
                if (this.decimalSeparator && this.thousandSeparator) {
                    value = value.split(this.localeDecimalSeparator);
                    if (precision && value[1]) {
                        value[1] = (this.decimalSeparator || this.localeDecimalSeparator) + value[1];
                    }
                    if (this.thousandSeparator && value[0].length > 3) {
                        value[0] = value[0].replace(new RegExp(`[${this.localeThousandSeparator}]`, 'gim'), this.thousandSeparator);
                    }
                    value = value.join('');
                }
            }
            this.formattedValue = value.toString();
        }
        else {
            this.formattedValue = null;
        }
        if (this.inputfieldViewChild && this.inputfieldViewChild.nativeElement) {
            this.inputfieldViewChild.nativeElement.value = this.formattedValue;
        }
    }
    clearTimer() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }
    writeValue(value) {
        this.value = value;
        this.formatValue();
        this.updateFilledState();
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
    updateFilledState() {
        this.filled = (this.value !== undefined && this.value != null);
    }
}
Spinner.ctorParameters = () => [
    { type: ElementRef },
    { type: ChangeDetectorRef }
];
Spinner.decorators = [
    { type: Component, args: [{
                selector: 'p-spinner',
                template: `
        <span class="ui-spinner ui-widget ui-corner-all">
            <input #inputfield type="text" [attr.id]="inputId" [value]="formattedValue||null" [attr.name]="name" [attr.aria-valumin]="min" [attr.aria-valuemax]="max" [attr.aria-valuenow]="value" [attr.aria-labelledby]="ariaLabelledBy"
            [attr.size]="size" [attr.maxlength]="maxlength" [attr.tabindex]="tabindex" [attr.placeholder]="placeholder" [disabled]="disabled" [readonly]="readonly" [attr.required]="required"
            (keydown)="onInputKeydown($event)" (blur)="onInputBlur($event)" (input)="onInput($event)" (change)="onInputChange($event)" (focus)="onInputFocus($event)"
            [ngStyle]="inputStyle" [class]="inputStyleClass" [ngClass]="'ui-spinner-input ui-inputtext ui-widget ui-state-default ui-corner-all'">
            <button type="button" [ngClass]="{'ui-spinner-button ui-spinner-up ui-corner-tr ui-button ui-widget ui-state-default':true,'ui-state-disabled':disabled}" [disabled]="disabled||readonly" tabindex="-1" [attr.readonly]="readonly"
                (mouseleave)="onUpButtonMouseleave($event)" (mousedown)="onUpButtonMousedown($event)" (mouseup)="onUpButtonMouseup($event)">
                <span class="ui-spinner-button-icon pi pi-caret-up ui-clickable"></span>
            </button>
            <button type="button" [ngClass]="{'ui-spinner-button ui-spinner-down ui-corner-br ui-button ui-widget ui-state-default':true,'ui-state-disabled':disabled}" [disabled]="disabled||readonly" tabindex="-1" [attr.readonly]="readonly"
                (mouseleave)="onDownButtonMouseleave($event)" (mousedown)="onDownButtonMousedown($event)" (mouseup)="onDownButtonMouseup($event)">
                <span class="ui-spinner-button-icon pi pi-caret-down ui-clickable"></span>
            </button>
        </span>
    `,
                host: {
                    '[class.ui-inputwrapper-filled]': 'filled',
                    '[class.ui-inputwrapper-focus]': 'focus'
                },
                providers: [SPINNER_VALUE_ACCESSOR],
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                styles: [".ui-spinner{display:inline-block;overflow:visible;padding:0;position:relative;vertical-align:middle}.ui-spinner-input{vertical-align:middle;padding-right:1.5em}.ui-spinner-button{cursor:default;display:block;height:50%;margin:0;overflow:hidden;padding:0;position:absolute;right:0;text-align:center;vertical-align:middle;width:1.5em}.ui-spinner .ui-spinner-button-icon{position:absolute;top:50%;left:50%;margin-top:-.5em;margin-left:-.5em;width:1em}.ui-spinner-up{top:0}.ui-spinner-down{bottom:0}.ui-fluid .ui-spinner{width:100%}.ui-fluid .ui-spinner .ui-spinner-input{padding-right:2em;width:100%}.ui-fluid .ui-spinner .ui-spinner-button{width:1.5em}.ui-fluid .ui-spinner .ui-spinner-button .ui-spinner-button-icon{left:.7em}"]
            },] }
];
Spinner.ctorParameters = () => [
    { type: ElementRef },
    { type: ChangeDetectorRef }
];
Spinner.propDecorators = {
    onChange: [{ type: Output }],
    onFocus: [{ type: Output }],
    onBlur: [{ type: Output }],
    min: [{ type: Input }],
    max: [{ type: Input }],
    maxlength: [{ type: Input }],
    size: [{ type: Input }],
    placeholder: [{ type: Input }],
    inputId: [{ type: Input }],
    disabled: [{ type: Input }],
    readonly: [{ type: Input }],
    tabindex: [{ type: Input }],
    required: [{ type: Input }],
    name: [{ type: Input }],
    ariaLabelledBy: [{ type: Input }],
    inputStyle: [{ type: Input }],
    inputStyleClass: [{ type: Input }],
    formatInput: [{ type: Input }],
    decimalSeparator: [{ type: Input }],
    thousandSeparator: [{ type: Input }],
    precision: [{ type: Input }],
    inputfieldViewChild: [{ type: ViewChild, args: ['inputfield',] }],
    step: [{ type: Input }]
};
export class SpinnerModule {
}
SpinnerModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule, InputTextModule],
                exports: [Spinner],
                declarations: [Spinner]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3Bpbm5lci5qcyIsInNvdXJjZVJvb3QiOiJuZzovL3ByaW1lbmcvc3Bpbm5lci8iLCJzb3VyY2VzIjpbInNwaW5uZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFFBQVEsRUFBQyxTQUFTLEVBQUMsVUFBVSxFQUFDLE1BQU0sRUFBQyxLQUFLLEVBQUMsTUFBTSxFQUFDLFlBQVksRUFBQyxVQUFVLEVBQUMsU0FBUyxFQUFDLGlCQUFpQixFQUFDLHVCQUF1QixFQUFFLGlCQUFpQixFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQy9LLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUM3QyxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDbEQsT0FBTyxFQUFDLGlCQUFpQixFQUF1QixNQUFNLGdCQUFnQixDQUFDO0FBRXZFLE1BQU0sQ0FBQyxNQUFNLHNCQUFzQixHQUFRO0lBQ3ZDLE9BQU8sRUFBRSxpQkFBaUI7SUFDMUIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUM7SUFDdEMsS0FBSyxFQUFFLElBQUk7Q0FDZCxDQUFDO0FBNkJGLE1BQU0sT0FBTyxPQUFPO0lBc0ZoQixZQUFtQixFQUFjLEVBQVMsRUFBcUI7UUFBNUMsT0FBRSxHQUFGLEVBQUUsQ0FBWTtRQUFTLE9BQUUsR0FBRixFQUFFLENBQW1CO1FBcEZyRCxhQUFRLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFFakQsWUFBTyxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBRWhELFdBQU0sR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQXdDekQsVUFBSyxHQUFXLENBQUMsQ0FBQztRQUlsQixrQkFBYSxHQUFhLEdBQUcsRUFBRSxHQUFFLENBQUMsQ0FBQztRQUVuQyxtQkFBYyxHQUFhLEdBQUcsRUFBRSxHQUFFLENBQUMsQ0FBQztRQUVwQyxlQUFVLEdBQVcsV0FBVyxDQUFDO1FBUTFC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QUFTLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQztnQkFDbkMsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07Z0JBQy9DLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJOzthQUV4Qzs7O1lBckMwQixVQUFVO1lBQXVELGlCQUFpQjs7O3VCQXdDeEcsTUFBTTtzQkFFTixNQUFNO3FCQUVOLE1BQU07a0JBRU4sS0FBSztrQkFFTCxLQUFLO3dCQUVMLEtBQUs7bUJBRUwsS0FBSzswQkFFTCxLQUFLO3NCQUVMLEtBQUs7dUJBRUwsS0FBSzt1QkFFTCxLQUFLO3VCQUVMLEtBQUs7dUJBRUwsS0FBSzttQkFFTCxLQUFLOzZCQUVMLEtBQUs7eUJBRUwsS0FBSzs4QkFFTCxLQUFLOzBCQUVMLEtBQUs7K0JBRUwsS0FBSztnQ0FFTCxLQUFLO3dCQUVMLEtBQUs7a0NBOEJMLFNBQVMsU0FBQyxZQUFZO21CQUV0QixLQUFLOztBQW9RVixNQUFNLE9BQU8sYUFBYTs7O1lBTHpCLFFBQVEsU0FBQztnQkFDTixPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUMsZUFBZSxDQUFDO2dCQUN2QyxPQUFPLEVBQUUsQ0FBQyxPQUFPLENBQUM7Z0JBQ2xCLFlBQVksRUFBRSxDQUFDLE9BQU8sQ0FBQzthQUMxQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7TmdNb2R1bGUsQ29tcG9uZW50LEVsZW1lbnRSZWYsT25Jbml0LElucHV0LE91dHB1dCxFdmVudEVtaXR0ZXIsZm9yd2FyZFJlZixWaWV3Q2hpbGQsQ2hhbmdlRGV0ZWN0b3JSZWYsQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIFZpZXdFbmNhcHN1bGF0aW9ufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtJbnB1dFRleHRNb2R1bGV9IGZyb20gJ3ByaW1lbmcvaW5wdXR0ZXh0JztcbmltcG9ydCB7TkdfVkFMVUVfQUNDRVNTT1IsIENvbnRyb2xWYWx1ZUFjY2Vzc29yfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbmV4cG9ydCBjb25zdCBTUElOTkVSX1ZBTFVFX0FDQ0VTU09SOiBhbnkgPSB7XG4gICAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gU3Bpbm5lciksXG4gICAgbXVsdGk6IHRydWVcbn07XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAncC1zcGlubmVyJyxcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgICA8c3BhbiBjbGFzcz1cInVpLXNwaW5uZXIgdWktd2lkZ2V0IHVpLWNvcm5lci1hbGxcIj5cbiAgICAgICAgICAgIDxpbnB1dCAjaW5wdXRmaWVsZCB0eXBlPVwidGV4dFwiIFthdHRyLmlkXT1cImlucHV0SWRcIiBbdmFsdWVdPVwiZm9ybWF0dGVkVmFsdWV8fG51bGxcIiBbYXR0ci5uYW1lXT1cIm5hbWVcIiBbYXR0ci5hcmlhLXZhbHVtaW5dPVwibWluXCIgW2F0dHIuYXJpYS12YWx1ZW1heF09XCJtYXhcIiBbYXR0ci5hcmlhLXZhbHVlbm93XT1cInZhbHVlXCIgW2F0dHIuYXJpYS1sYWJlbGxlZGJ5XT1cImFyaWFMYWJlbGxlZEJ5XCJcbiAgICAgICAgICAgIFthdHRyLnNpemVdPVwic2l6ZVwiIFthdHRyLm1heGxlbmd0aF09XCJtYXhsZW5ndGhcIiBbYXR0ci50YWJpbmRleF09XCJ0YWJpbmRleFwiIFthdHRyLnBsYWNlaG9sZGVyXT1cInBsYWNlaG9sZGVyXCIgW2Rpc2FibGVkXT1cImRpc2FibGVkXCIgW3JlYWRvbmx5XT1cInJlYWRvbmx5XCIgW2F0dHIucmVxdWlyZWRdPVwicmVxdWlyZWRcIlxuICAgICAgICAgICAgKGtleWRvd24pPVwib25JbnB1dEtleWRvd24oJGV2ZW50KVwiIChibHVyKT1cIm9uSW5wdXRCbHVyKCRldmVudClcIiAoaW5wdXQpPVwib25JbnB1dCgkZXZlbnQpXCIgKGNoYW5nZSk9XCJvbklucHV0Q2hhbmdlKCRldmVudClcIiAoZm9jdXMpPVwib25JbnB1dEZvY3VzKCRldmVudClcIlxuICAgICAgICAgICAgW25nU3R5bGVdPVwiaW5wdXRTdHlsZVwiIFtjbGFzc109XCJpbnB1dFN0eWxlQ2xhc3NcIiBbbmdDbGFzc109XCIndWktc3Bpbm5lci1pbnB1dCB1aS1pbnB1dHRleHQgdWktd2lkZ2V0IHVpLXN0YXRlLWRlZmF1bHQgdWktY29ybmVyLWFsbCdcIj5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIFtuZ0NsYXNzXT1cInsndWktc3Bpbm5lci1idXR0b24gdWktc3Bpbm5lci11cCB1aS1jb3JuZXItdHIgdWktYnV0dG9uIHVpLXdpZGdldCB1aS1zdGF0ZS1kZWZhdWx0Jzp0cnVlLCd1aS1zdGF0ZS1kaXNhYmxlZCc6ZGlzYWJsZWR9XCIgW2Rpc2FibGVkXT1cImRpc2FibGVkfHxyZWFkb25seVwiIHRhYmluZGV4PVwiLTFcIiBbYXR0ci5yZWFkb25seV09XCJyZWFkb25seVwiXG4gICAgICAgICAgICAgICAgKG1vdXNlbGVhdmUpPVwib25VcEJ1dHRvbk1vdXNlbGVhdmUoJGV2ZW50KVwiIChtb3VzZWRvd24pPVwib25VcEJ1dHRvbk1vdXNlZG93bigkZXZlbnQpXCIgKG1vdXNldXApPVwib25VcEJ1dHRvbk1vdXNldXAoJGV2ZW50KVwiPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidWktc3Bpbm5lci1idXR0b24taWNvbiBwaSBwaS1jYXJldC11cCB1aS1jbGlja2FibGVcIj48L3NwYW4+XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIFtuZ0NsYXNzXT1cInsndWktc3Bpbm5lci1idXR0b24gdWktc3Bpbm5lci1kb3duIHVpLWNvcm5lci1iciB1aS1idXR0b24gdWktd2lkZ2V0IHVpLXN0YXRlLWRlZmF1bHQnOnRydWUsJ3VpLXN0YXRlLWRpc2FibGVkJzpkaXNhYmxlZH1cIiBbZGlzYWJsZWRdPVwiZGlzYWJsZWR8fHJlYWRvbmx5XCIgdGFiaW5kZXg9XCItMVwiIFthdHRyLnJlYWRvbmx5XT1cInJlYWRvbmx5XCJcbiAgICAgICAgICAgICAgICAobW91c2VsZWF2ZSk9XCJvbkRvd25CdXR0b25Nb3VzZWxlYXZlKCRldmVudClcIiAobW91c2Vkb3duKT1cIm9uRG93bkJ1dHRvbk1vdXNlZG93bigkZXZlbnQpXCIgKG1vdXNldXApPVwib25Eb3duQnV0dG9uTW91c2V1cCgkZXZlbnQpXCI+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ1aS1zcGlubmVyLWJ1dHRvbi1pY29uIHBpIHBpLWNhcmV0LWRvd24gdWktY2xpY2thYmxlXCI+PC9zcGFuPlxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvc3Bhbj5cbiAgICBgLFxuICAgIGhvc3Q6IHtcbiAgICAgICAgJ1tjbGFzcy51aS1pbnB1dHdyYXBwZXItZmlsbGVkXSc6ICdmaWxsZWQnLFxuICAgICAgICAnW2NsYXNzLnVpLWlucHV0d3JhcHBlci1mb2N1c10nOiAnZm9jdXMnXG4gICAgfSxcbiAgICBwcm92aWRlcnM6IFtTUElOTkVSX1ZBTFVFX0FDQ0VTU09SXSxcbiAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICAgIHN0eWxlVXJsczogWycuL3NwaW5uZXIuY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgU3Bpbm5lciBpbXBsZW1lbnRzIE9uSW5pdCxDb250cm9sVmFsdWVBY2Nlc3NvciB7XG4gICAgXG4gICAgQE91dHB1dCgpIG9uQ2hhbmdlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICBcbiAgICBAT3V0cHV0KCkgb25Gb2N1czogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgb25CbHVyOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBJbnB1dCgpIG1pbjogbnVtYmVyO1xuXG4gICAgQElucHV0KCkgbWF4OiBudW1iZXI7XG4gICAgXG4gICAgQElucHV0KCkgbWF4bGVuZ3RoOiBudW1iZXI7XG4gICAgXG4gICAgQElucHV0KCkgc2l6ZTogbnVtYmVyO1xuXG4gICAgQElucHV0KCkgcGxhY2Vob2xkZXI6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIGlucHV0SWQ6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIGRpc2FibGVkOiBib29sZWFuO1xuICAgIFxuICAgIEBJbnB1dCgpIHJlYWRvbmx5OiBib29sZWFuO1xuXG4gICAgQElucHV0KCkgdGFiaW5kZXg6IG51bWJlcjtcbiAgICAgICAgICAgIFxuICAgIEBJbnB1dCgpIHJlcXVpcmVkOiBib29sZWFuO1xuXG4gICAgQElucHV0KCkgbmFtZTogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgYXJpYUxhYmVsbGVkQnk6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIGlucHV0U3R5bGU6IGFueTtcblxuICAgIEBJbnB1dCgpIGlucHV0U3R5bGVDbGFzczogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgZm9ybWF0SW5wdXQ6IGJvb2xlYW47XG5cbiAgICBASW5wdXQoKSBkZWNpbWFsU2VwYXJhdG9yOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSB0aG91c2FuZFNlcGFyYXRvcjogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgcHJlY2lzaW9uOiBudW1iZXI7XG4gICAgXG4gICAgdmFsdWU6IGFueTtcblxuICAgIF9zdGVwOiBudW1iZXIgPSAxO1xuXG4gICAgZm9ybWF0dGVkVmFsdWU6IHN0cmluZztcbiAgICAgICAgXG4gICAgb25Nb2RlbENoYW5nZTogRnVuY3Rpb24gPSAoKSA9PiB7fTtcbiAgICBcbiAgICBvbk1vZGVsVG91Y2hlZDogRnVuY3Rpb24gPSAoKSA9PiB7fTtcbiAgICBcbiAgICBrZXlQYXR0ZXJuOiBSZWdFeHAgPSAvWzAtOVxcK1xcLV0vO1xuICAgICAgICBcbiAgICBwdWJsaWMgdGltZXI6IGFueTtcbiAgICBcbiAgICBwdWJsaWMgZm9jdXM6IGJvb2xlYW47XG4gICAgXG4gICAgcHVibGljIGZpbGxlZDogYm9vbGVhbjtcbiAgICBcbiAgICBwdWJsaWMgbmVnYXRpdmVTZXBhcmF0b3IgPSAnLSc7XG5cbiAgICBsb2NhbGVEZWNpbWFsU2VwYXJhdG9yOiBzdHJpbmc7XG5cbiAgICBsb2NhbGVUaG91c2FuZFNlcGFyYXRvcjogc3RyaW5nO1xuXG4gICAgdGhvdXNhbmRSZWdFeHA6IFJlZ0V4cDtcblxuICAgIGNhbGN1bGF0ZWRQcmVjaXNpb246IG51bWJlcjtcbiAgICBcbiAgICBAVmlld0NoaWxkKCdpbnB1dGZpZWxkJykgaW5wdXRmaWVsZFZpZXdDaGlsZDogRWxlbWVudFJlZjtcblxuICAgIEBJbnB1dCgpIGdldCBzdGVwKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zdGVwO1xuICAgIH1cbiAgICBzZXQgc3RlcCh2YWw6bnVtYmVyKSB7XG4gICAgICAgIHRoaXMuX3N0ZXAgPSB2YWw7XG5cbiAgICAgICAgaWYgKHRoaXMuX3N0ZXAgIT0gbnVsbCkge1xuICAgICAgICAgICAgbGV0IHRva2VucyA9IHRoaXMuc3RlcC50b1N0cmluZygpLnNwbGl0KC9bLF18Wy5dLyk7XG4gICAgICAgICAgICB0aGlzLmNhbGN1bGF0ZWRQcmVjaXNpb24gPSB0b2tlbnNbMV0gPyB0b2tlbnNbMV0ubGVuZ3RoIDogdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBlbDogRWxlbWVudFJlZiwgcHVibGljIGNkOiBDaGFuZ2VEZXRlY3RvclJlZikge31cblxuICAgIG5nT25Jbml0KCkge1xuICAgICAgICBpZiAodGhpcy5mb3JtYXRJbnB1dCkge1xuICAgICAgICAgICAgdGhpcy5sb2NhbGVEZWNpbWFsU2VwYXJhdG9yID0gKDEuMSkudG9Mb2NhbGVTdHJpbmcoKS5zdWJzdHJpbmcoMSwgMik7XG4gICAgICAgICAgICB0aGlzLmxvY2FsZVRob3VzYW5kU2VwYXJhdG9yID0gKDEwMDApLnRvTG9jYWxlU3RyaW5nKCkuc3Vic3RyaW5nKDEsIDIpO1xuICAgICAgICAgICAgdGhpcy50aG91c2FuZFJlZ0V4cCA9IG5ldyBSZWdFeHAoYFske3RoaXMudGhvdXNhbmRTZXBhcmF0b3IgfHwgdGhpcy5sb2NhbGVUaG91c2FuZFNlcGFyYXRvcn1dYCwgJ2dpbScpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5kZWNpbWFsU2VwYXJhdG9yICYmIHRoaXMudGhvdXNhbmRTZXBhcmF0b3IgJiYgdGhpcy5kZWNpbWFsU2VwYXJhdG9yID09PSB0aGlzLnRob3VzYW5kU2VwYXJhdG9yKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwidGhvdXNhbmRTZXBhcmF0b3IgYW5kIGRlY2ltYWxTZXBhcmF0b3IgY2Fubm90IGhhdmUgdGhlIHNhbWUgdmFsdWUuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVwZWF0KGV2ZW50OiBFdmVudCwgaW50ZXJ2YWw6IG51bWJlciwgZGlyOiBudW1iZXIpIHtcbiAgICAgICAgbGV0IGkgPSBpbnRlcnZhbHx8NTAwO1xuXG4gICAgICAgIHRoaXMuY2xlYXJUaW1lcigpO1xuICAgICAgICB0aGlzLnRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnJlcGVhdChldmVudCwgNDAsIGRpcik7XG4gICAgICAgIH0sIGkpO1xuXG4gICAgICAgIHRoaXMuc3BpbihldmVudCwgZGlyKTtcbiAgICB9XG4gICAgXG4gICAgc3BpbihldmVudDogRXZlbnQsIGRpcjogbnVtYmVyKSB7XG4gICAgICAgIGxldCBzdGVwID0gdGhpcy5zdGVwICogZGlyO1xuICAgICAgICBsZXQgY3VycmVudFZhbHVlOiBudW1iZXI7XG4gICAgICAgIGxldCBwcmVjaXNpb24gPSB0aGlzLmdldFByZWNpc2lvbigpO1xuXG4gICAgICAgIGlmICh0aGlzLnZhbHVlKVxuICAgICAgICAgICAgY3VycmVudFZhbHVlID0gKHR5cGVvZiB0aGlzLnZhbHVlID09PSAnc3RyaW5nJykgPyB0aGlzLnBhcnNlVmFsdWUodGhpcy52YWx1ZSkgOiB0aGlzLnZhbHVlO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICBjdXJyZW50VmFsdWUgPSAwO1xuICAgICAgICBcbiAgICAgICAgaWYgKHByZWNpc2lvbilcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSBwYXJzZUZsb2F0KHRoaXMudG9GaXhlZChjdXJyZW50VmFsdWUgKyBzdGVwLCBwcmVjaXNpb24pKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IGN1cnJlbnRWYWx1ZSArIHN0ZXA7XG4gICAgXG4gICAgICAgIGlmICh0aGlzLm1heGxlbmd0aCAhPT0gdW5kZWZpbmVkICYmIHRoaXMudmFsdWUudG9TdHJpbmcoKS5sZW5ndGggPiB0aGlzLm1heGxlbmd0aCkge1xuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IGN1cnJlbnRWYWx1ZTtcbiAgICAgICAgfVxuICAgIFxuICAgICAgICBpZiAodGhpcy5taW4gIT09IHVuZGVmaW5lZCAmJiB0aGlzLnZhbHVlIDwgdGhpcy5taW4pIHtcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSB0aGlzLm1pbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm1heCAhPT0gdW5kZWZpbmVkICYmIHRoaXMudmFsdWUgPiB0aGlzLm1heCkge1xuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHRoaXMubWF4O1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB0aGlzLmZvcm1hdFZhbHVlKCk7XG4gICAgICAgIHRoaXMub25Nb2RlbENoYW5nZSh0aGlzLnZhbHVlKTtcbiAgICAgICAgdGhpcy5vbkNoYW5nZS5lbWl0KGV2ZW50KTtcbiAgICB9XG5cbiAgICBnZXRQcmVjaXNpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByZWNpc2lvbiA9PT0gdW5kZWZpbmVkID8gdGhpcy5jYWxjdWxhdGVkUHJlY2lzaW9uIDogdGhpcy5wcmVjaXNpb247XG4gICAgfVxuICAgIFxuICAgIHRvRml4ZWQodmFsdWU6IG51bWJlciwgcHJlY2lzaW9uOiBudW1iZXIpIHtcbiAgICAgICAgbGV0IHBvd2VyID0gTWF0aC5wb3coMTAsIHByZWNpc2lvbnx8MCk7XG4gICAgICAgIHJldHVybiBTdHJpbmcoTWF0aC5yb3VuZCh2YWx1ZSAqIHBvd2VyKSAvIHBvd2VyKTtcbiAgICB9XG4gICAgXG4gICAgb25VcEJ1dHRvbk1vdXNlZG93bihldmVudDogRXZlbnQpIHtcbiAgICAgICAgaWYgKCF0aGlzLmRpc2FibGVkKSB7XG4gICAgICAgICAgICB0aGlzLmlucHV0ZmllbGRWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgICAgICAgICAgdGhpcy5yZXBlYXQoZXZlbnQsIG51bGwsIDEpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVGaWxsZWRTdGF0ZSgpO1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBvblVwQnV0dG9uTW91c2V1cChldmVudDogRXZlbnQpIHtcbiAgICAgICAgaWYgKCF0aGlzLmRpc2FibGVkKSB7XG4gICAgICAgICAgICB0aGlzLmNsZWFyVGltZXIoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBvblVwQnV0dG9uTW91c2VsZWF2ZShldmVudDogRXZlbnQpIHtcbiAgICAgICAgaWYgKCF0aGlzLmRpc2FibGVkKSB7XG4gICAgICAgICAgICB0aGlzLmNsZWFyVGltZXIoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBvbkRvd25CdXR0b25Nb3VzZWRvd24oZXZlbnQ6IEV2ZW50KSB7XG4gICAgICAgIGlmICghdGhpcy5kaXNhYmxlZCkge1xuICAgICAgICAgICAgdGhpcy5pbnB1dGZpZWxkVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgICAgIHRoaXMucmVwZWF0KGV2ZW50LCBudWxsLCAtMSk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUZpbGxlZFN0YXRlKCk7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIG9uRG93bkJ1dHRvbk1vdXNldXAoZXZlbnQ6IEV2ZW50KSB7XG4gICAgICAgIGlmICghdGhpcy5kaXNhYmxlZCkge1xuICAgICAgICAgICAgdGhpcy5jbGVhclRpbWVyKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgb25Eb3duQnV0dG9uTW91c2VsZWF2ZShldmVudDogRXZlbnQpIHtcbiAgICAgICAgaWYgKCF0aGlzLmRpc2FibGVkKSB7XG4gICAgICAgICAgICB0aGlzLmNsZWFyVGltZXIoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBvbklucHV0S2V5ZG93bihldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgICAgICBpZiAoZXZlbnQud2hpY2ggPT0gMzgpIHtcbiAgICAgICAgICAgIHRoaXMuc3BpbihldmVudCwgMSk7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGV2ZW50LndoaWNoID09IDQwKSB7XG4gICAgICAgICAgICB0aGlzLnNwaW4oZXZlbnQsIC0xKTtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbklucHV0Q2hhbmdlKGV2ZW50OiBFdmVudCkge1xuICAgICAgICB0aGlzLm9uQ2hhbmdlLmVtaXQoZXZlbnQpO1xuICAgIH1cblxuICAgIG9uSW5wdXQoZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHRoaXMucGFyc2VWYWx1ZSgoPEhUTUxJbnB1dEVsZW1lbnQ+IGV2ZW50LnRhcmdldCkudmFsdWUpO1xuICAgICAgICB0aGlzLm9uTW9kZWxDaGFuZ2UodGhpcy52YWx1ZSk7XG4gICAgICAgIHRoaXMudXBkYXRlRmlsbGVkU3RhdGUoKTtcbiAgICB9XG4gICAgICAgIFxuICAgIG9uSW5wdXRCbHVyKGV2ZW50KSB7XG4gICAgICAgIHRoaXMuZm9jdXMgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5mb3JtYXRWYWx1ZSgpO1xuICAgICAgICB0aGlzLm9uTW9kZWxUb3VjaGVkKCk7XG4gICAgICAgIHRoaXMub25CbHVyLmVtaXQoZXZlbnQpO1xuICAgIH1cbiAgICBcbiAgICBvbklucHV0Rm9jdXMoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5mb2N1cyA9IHRydWU7XG4gICAgICAgIHRoaXMub25Gb2N1cy5lbWl0KGV2ZW50KTtcbiAgICB9XG4gICAgXG4gICAgcGFyc2VWYWx1ZSh2YWw6IHN0cmluZyk6IG51bWJlciB7XG4gICAgICAgIGxldCB2YWx1ZTogbnVtYmVyO1xuICAgICAgICBsZXQgcHJlY2lzaW9uID0gdGhpcy5nZXRQcmVjaXNpb24oKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgaWYgKHZhbC50cmltKCkgPT09ICcnKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAodGhpcy5mb3JtYXRJbnB1dCkge1xuICAgICAgICAgICAgICAgIHZhbCA9IHZhbC5yZXBsYWNlKHRoaXMudGhvdXNhbmRSZWdFeHAsICcnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHByZWNpc2lvbikge1xuICAgICAgICAgICAgICAgIHZhbCA9IHRoaXMuZm9ybWF0SW5wdXQgPyB2YWwucmVwbGFjZSh0aGlzLmRlY2ltYWxTZXBhcmF0b3IgfHwgdGhpcy5sb2NhbGVEZWNpbWFsU2VwYXJhdG9yLCAnLicpIDogdmFsLnJlcGxhY2UoJywnLCAnLicpO1xuICAgICAgICAgICAgICAgIHZhbHVlID0gcGFyc2VGbG9hdCh2YWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBwYXJzZUludCh2YWwsIDEwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKCFpc05hTih2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5tYXggIT09IG51bGwgJiYgdmFsdWUgPiB0aGlzLm1heCkge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHRoaXMubWF4O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm1pbiAhPT0gbnVsbCAmJiB2YWx1ZSA8IHRoaXMubWluKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdGhpcy5taW47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgZm9ybWF0VmFsdWUoKSB7XG4gICAgICAgIGxldCB2YWx1ZSA9IHRoaXMudmFsdWU7XG4gICAgICAgIGxldCBwcmVjaXNpb24gPSB0aGlzLmdldFByZWNpc2lvbigpO1xuXG4gICAgICAgIGlmICh2YWx1ZSAhPSBudWxsKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5mb3JtYXRJbnB1dCkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUudG9Mb2NhbGVTdHJpbmcodW5kZWZpbmVkLCB7bWF4aW11bUZyYWN0aW9uRGlnaXRzOiAyMH0pO1xuICAgIFxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmRlY2ltYWxTZXBhcmF0b3IgJiYgdGhpcy50aG91c2FuZFNlcGFyYXRvcikge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnNwbGl0KHRoaXMubG9jYWxlRGVjaW1hbFNlcGFyYXRvcik7XG4gICAgXG4gICAgICAgICAgICAgICAgICAgIGlmIChwcmVjaXNpb24gJiYgdmFsdWVbMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlWzFdID0gKHRoaXMuZGVjaW1hbFNlcGFyYXRvciB8fCB0aGlzLmxvY2FsZURlY2ltYWxTZXBhcmF0b3IpICsgdmFsdWVbMV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMudGhvdXNhbmRTZXBhcmF0b3IgJiYgdmFsdWVbMF0ubGVuZ3RoID4gMykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVbMF0gPSB2YWx1ZVswXS5yZXBsYWNlKG5ldyBSZWdFeHAoYFske3RoaXMubG9jYWxlVGhvdXNhbmRTZXBhcmF0b3J9XWAsICdnaW0nKSwgdGhpcy50aG91c2FuZFNlcGFyYXRvcik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS5qb2luKCcnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgXG4gICAgICAgICAgICB0aGlzLmZvcm1hdHRlZFZhbHVlID0gdmFsdWUudG9TdHJpbmcoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZm9ybWF0dGVkVmFsdWUgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuaW5wdXRmaWVsZFZpZXdDaGlsZCAmJiB0aGlzLmlucHV0ZmllbGRWaWV3Q2hpbGQubmF0aXZlRWxlbWVudCkge1xuICAgICAgICAgICAgdGhpcy5pbnB1dGZpZWxkVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQudmFsdWUgPSB0aGlzLmZvcm1hdHRlZFZhbHVlO1xuICAgICAgICB9XG4gICAgfVxuICAgICAgICAgICAgXG4gICAgY2xlYXJUaW1lcigpIHtcbiAgICAgICAgaWYgKHRoaXMudGltZXIpIHtcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy50aW1lcik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgd3JpdGVWYWx1ZSh2YWx1ZTogYW55KSA6IHZvaWQge1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMuZm9ybWF0VmFsdWUoKTtcbiAgICAgICAgdGhpcy51cGRhdGVGaWxsZWRTdGF0ZSgpO1xuICAgICAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cbiAgICBcbiAgICByZWdpc3Rlck9uQ2hhbmdlKGZuOiBGdW5jdGlvbik6IHZvaWQge1xuICAgICAgICB0aGlzLm9uTW9kZWxDaGFuZ2UgPSBmbjtcbiAgICB9XG5cbiAgICByZWdpc3Rlck9uVG91Y2hlZChmbjogRnVuY3Rpb24pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5vbk1vZGVsVG91Y2hlZCA9IGZuO1xuICAgIH1cbiAgICBcbiAgICBzZXREaXNhYmxlZFN0YXRlKHZhbDogYm9vbGVhbik6IHZvaWQge1xuICAgICAgICB0aGlzLmRpc2FibGVkID0gdmFsO1xuICAgIH1cbiAgICBcbiAgICB1cGRhdGVGaWxsZWRTdGF0ZSgpIHtcbiAgICAgICAgdGhpcy5maWxsZWQgPSAodGhpcy52YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHRoaXMudmFsdWUgIT0gbnVsbCk7XG4gICAgfVxufVxuXG5cbkBOZ01vZHVsZSh7XG4gICAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSxJbnB1dFRleHRNb2R1bGVdLFxuICAgIGV4cG9ydHM6IFtTcGlubmVyXSxcbiAgICBkZWNsYXJhdGlvbnM6IFtTcGlubmVyXVxufSlcbmV4cG9ydCBjbGFzcyBTcGlubmVyTW9kdWxlIHsgfVxuIl19