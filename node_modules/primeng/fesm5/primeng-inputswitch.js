import { forwardRef, EventEmitter, ChangeDetectorRef, Component, ChangeDetectionStrategy, ViewEncapsulation, Input, Output, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

var INPUTSWITCH_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(function () { return InputSwitch; }),
    multi: true
};
var InputSwitch = /** @class */ (function () {
    function InputSwitch(cd) {
        this.cd = cd;
        this.onChange = new EventEmitter();
        this.checked = false;
        this.focused = false;
        this.onModelChange = function () { };
        this.onModelTouched = function () { };
    }
    InputSwitch.prototype.onClick = function (event, cb) {
        if (!this.disabled && !this.readonly) {
            event.preventDefault();
            this.toggle(event);
            cb.focus();
        }
    };
    InputSwitch.prototype.onInputChange = function (event) {
        if (!this.readonly) {
            var inputChecked = event.target.checked;
            this.updateModel(event, inputChecked);
        }
    };
    InputSwitch.prototype.toggle = function (event) {
        this.updateModel(event, !this.checked);
    };
    InputSwitch.prototype.updateModel = function (event, value) {
        this.checked = value;
        this.onModelChange(this.checked);
        this.onChange.emit({
            originalEvent: event,
            checked: this.checked
        });
    };
    InputSwitch.prototype.onFocus = function (event) {
        this.focused = true;
    };
    InputSwitch.prototype.onBlur = function (event) {
        this.focused = false;
        this.onModelTouched();
    };
    InputSwitch.prototype.writeValue = function (checked) {
        this.checked = checked;
        this.cd.markForCheck();
    };
    InputSwitch.prototype.registerOnChange = function (fn) {
        this.onModelChange = fn;
    };
    InputSwitch.prototype.registerOnTouched = function (fn) {
        this.onModelTouched = fn;
    };
    InputSwitch.prototype.setDisabledState = function (val) {
        this.disabled = val;
    };
    InputSwitch.ctorParameters = function () { return [
        { type: ChangeDetectorRef }
    ]; };
    InputSwitch.decorators = [
        { type: Component, args: [{
                    selector: 'p-inputSwitch',
                    template: "\n        <div [ngClass]=\"{'p-inputswitch p-component': true, 'p-inputswitch-checked': checked, 'p-disabled': disabled, 'p-focus': focused}\" \n            [ngStyle]=\"style\" [class]=\"styleClass\" (click)=\"onClick($event, cb)\">\n            <div class=\"p-hidden-accessible\">\n                <input #cb type=\"checkbox\" [attr.id]=\"inputId\" [attr.name]=\"name\" [attr.tabindex]=\"tabindex\" [checked]=\"checked\" (change)=\"onInputChange($event)\"\n                    (focus)=\"onFocus($event)\" (blur)=\"onBlur($event)\" [disabled]=\"disabled\" role=\"switch\" [attr.aria-checked]=\"checked\" [attr.aria-labelledby]=\"ariaLabelledBy\"/>\n            </div>\n            <span class=\"p-inputswitch-slider\"></span>\n        </div>\n    ",
                    providers: [INPUTSWITCH_VALUE_ACCESSOR],
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    styles: [".p-inputswitch{position:relative;display:inline-block}.p-inputswitch-slider{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0}.p-inputswitch-slider:before{position:absolute;content:\"\";top:50%}"]
                },] }
    ];
    InputSwitch.ctorParameters = function () { return [
        { type: ChangeDetectorRef }
    ]; };
    InputSwitch.propDecorators = {
        style: [{ type: Input }],
        styleClass: [{ type: Input }],
        tabindex: [{ type: Input }],
        inputId: [{ type: Input }],
        name: [{ type: Input }],
        disabled: [{ type: Input }],
        readonly: [{ type: Input }],
        ariaLabelledBy: [{ type: Input }],
        onChange: [{ type: Output }]
    };
    return InputSwitch;
}());
var InputSwitchModule = /** @class */ (function () {
    function InputSwitchModule() {
    }
    InputSwitchModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule],
                    exports: [InputSwitch],
                    declarations: [InputSwitch]
                },] }
    ];
    return InputSwitchModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { INPUTSWITCH_VALUE_ACCESSOR, InputSwitch, InputSwitchModule };
//# sourceMappingURL=primeng-inputswitch.js.map
