import { forwardRef, EventEmitter, ChangeDetectorRef, Component, ChangeDetectionStrategy, Input, Output, ViewChild, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

var RADIO_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(function () { return RadioButton; }),
    multi: true
};
var RadioButton = /** @class */ (function () {
    function RadioButton(cd) {
        this.cd = cd;
        this.onClick = new EventEmitter();
        this.onFocus = new EventEmitter();
        this.onBlur = new EventEmitter();
        this.onModelChange = function () { };
        this.onModelTouched = function () { };
    }
    RadioButton.prototype.handleClick = function (event, radioButton, focus) {
        event.preventDefault();
        if (this.disabled) {
            return;
        }
        this.select(event);
        if (focus) {
            radioButton.focus();
        }
    };
    RadioButton.prototype.select = function (event) {
        if (!this.disabled) {
            this.inputViewChild.nativeElement.checked = true;
            this.checked = true;
            this.onModelChange(this.value);
            this.onClick.emit(event);
        }
    };
    RadioButton.prototype.writeValue = function (value) {
        this.checked = (value == this.value);
        if (this.inputViewChild && this.inputViewChild.nativeElement) {
            this.inputViewChild.nativeElement.checked = this.checked;
        }
        this.cd.markForCheck();
    };
    RadioButton.prototype.registerOnChange = function (fn) {
        this.onModelChange = fn;
    };
    RadioButton.prototype.registerOnTouched = function (fn) {
        this.onModelTouched = fn;
    };
    RadioButton.prototype.setDisabledState = function (val) {
        this.disabled = val;
    };
    RadioButton.prototype.onInputFocus = function (event) {
        this.focused = true;
        this.onFocus.emit(event);
    };
    RadioButton.prototype.onInputBlur = function (event) {
        this.focused = false;
        this.onModelTouched();
        this.onBlur.emit(event);
    };
    RadioButton.prototype.onChange = function (event) {
        this.select(event);
    };
    RadioButton.prototype.focus = function () {
        this.inputViewChild.nativeElement.focus();
    };
    RadioButton.ctorParameters = function () { return [
        { type: ChangeDetectorRef }
    ]; };
    RadioButton.decorators = [
        { type: Component, args: [{
                    selector: 'p-radioButton',
                    template: "\n        <div [ngStyle]=\"style\" [ngClass]=\"{'p-radiobutton p-component':true,'p-radiobutton-checked': checked, 'p-radiobutton-disabled': disabled, 'p-radiobutton-focused': focused}\" [class]=\"styleClass\">\n            <div class=\"p-hidden-accessible\">\n                <input #rb type=\"radio\" [attr.id]=\"inputId\" [attr.name]=\"name\" [attr.value]=\"value\" [attr.tabindex]=\"tabindex\" [attr.aria-labelledby]=\"ariaLabelledBy\"\n                    [checked]=\"checked\" (change)=\"onChange($event)\" (focus)=\"onInputFocus($event)\" (blur)=\"onInputBlur($event)\" [disabled]=\"disabled\">\n            </div>\n            <div (click)=\"handleClick($event, rb, true)\" role=\"radio\" [attr.aria-checked]=\"checked\"\n                [ngClass]=\"{'p-radiobutton-box':true,\n                'p-highlight': checked, 'p-disabled': disabled, 'p-focus': focused}\">\n                <span class=\"p-radiobutton-icon\"></span>\n            </div>\n        </div>\n        <label (click)=\"select($event)\" [class]=\"labelStyleClass\"\n            [ngClass]=\"{'p-radiobutton-label':true, 'p-radiobutton-label-active':rb.checked, 'p-disabled':disabled, 'p-radiobutton-label-focus':focused}\"\n            *ngIf=\"label\" [attr.for]=\"inputId\">{{label}}</label>\n    ",
                    providers: [RADIO_VALUE_ACCESSOR],
                    changeDetection: ChangeDetectionStrategy.OnPush
                },] }
    ];
    RadioButton.ctorParameters = function () { return [
        { type: ChangeDetectorRef }
    ]; };
    RadioButton.propDecorators = {
        value: [{ type: Input }],
        name: [{ type: Input }],
        disabled: [{ type: Input }],
        label: [{ type: Input }],
        tabindex: [{ type: Input }],
        inputId: [{ type: Input }],
        ariaLabelledBy: [{ type: Input }],
        style: [{ type: Input }],
        styleClass: [{ type: Input }],
        labelStyleClass: [{ type: Input }],
        onClick: [{ type: Output }],
        onFocus: [{ type: Output }],
        onBlur: [{ type: Output }],
        inputViewChild: [{ type: ViewChild, args: ['rb',] }]
    };
    return RadioButton;
}());
var RadioButtonModule = /** @class */ (function () {
    function RadioButtonModule() {
    }
    RadioButtonModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule],
                    exports: [RadioButton],
                    declarations: [RadioButton]
                },] }
    ];
    return RadioButtonModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { RADIO_VALUE_ACCESSOR, RadioButton, RadioButtonModule };
//# sourceMappingURL=primeng-radiobutton.js.map
