import { forwardRef, EventEmitter, ChangeDetectorRef, Component, ChangeDetectionStrategy, ViewEncapsulation, Input, Output, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

var TRISTATECHECKBOX_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(function () { return TriStateCheckbox; }),
    multi: true
};
var TriStateCheckbox = /** @class */ (function () {
    function TriStateCheckbox(cd) {
        this.cd = cd;
        this.onChange = new EventEmitter();
        this.onModelChange = function () { };
        this.onModelTouched = function () { };
    }
    TriStateCheckbox.prototype.onClick = function (event, input) {
        if (!this.disabled && !this.readonly) {
            this.toggle(event);
            this.focused = true;
            input.focus();
        }
    };
    TriStateCheckbox.prototype.onKeydown = function (event) {
        if (event.keyCode == 32) {
            event.preventDefault();
        }
    };
    TriStateCheckbox.prototype.onKeyup = function (event) {
        if (event.keyCode == 32 && !this.readonly) {
            this.toggle(event);
            event.preventDefault();
        }
    };
    TriStateCheckbox.prototype.toggle = function (event) {
        if (this.value == null || this.value == undefined)
            this.value = true;
        else if (this.value == true)
            this.value = false;
        else if (this.value == false)
            this.value = null;
        this.onModelChange(this.value);
        this.onChange.emit({
            originalEvent: event,
            value: this.value
        });
    };
    TriStateCheckbox.prototype.onFocus = function () {
        this.focused = true;
    };
    TriStateCheckbox.prototype.onBlur = function () {
        this.focused = false;
        this.onModelTouched();
    };
    TriStateCheckbox.prototype.registerOnChange = function (fn) {
        this.onModelChange = fn;
    };
    TriStateCheckbox.prototype.registerOnTouched = function (fn) {
        this.onModelTouched = fn;
    };
    TriStateCheckbox.prototype.writeValue = function (value) {
        this.value = value;
        this.cd.markForCheck();
    };
    TriStateCheckbox.prototype.setDisabledState = function (disabled) {
        this.disabled = disabled;
    };
    TriStateCheckbox.ctorParameters = function () { return [
        { type: ChangeDetectorRef }
    ]; };
    TriStateCheckbox.decorators = [
        { type: Component, args: [{
                    selector: 'p-triStateCheckbox',
                    template: "\n        <div [ngStyle]=\"style\" [ngClass]=\"{'p-checkbox p-component': true,'p-checkbox-disabled': disabled, 'p-checkbox-focused': focused}\" [class]=\"styleClass\">\n            <div class=\"p-hidden-accessible\">\n                <input #input type=\"text\" [attr.id]=\"inputId\" [name]=\"name\" [attr.tabindex]=\"tabindex\" [readonly]=\"readonly\" [disabled]=\"disabled\" (keyup)=\"onKeyup($event)\" (keydown)=\"onKeydown($event)\" (focus)=\"onFocus()\" (blur)=\"onBlur()\" [attr.aria-labelledby]=\"ariaLabelledBy\">\n            </div>\n            <div class=\"p-checkbox-box\" (click)=\"onClick($event,input)\"  role=\"checkbox\" [attr.aria-checked]=\"value === true\"\n                [ngClass]=\"{'p-highlight':value!=null,'p-disabled':disabled,'p-focus':focused}\">\n                <span class=\"p-checkbox-icon pi\" [ngClass]=\"{'pi-check':value==true,'pi-times':value==false}\"></span>\n            </div>\n        </div>\n        <label class=\"p-checkbox-label\" (click)=\"onClick($event,input)\"\n               [ngClass]=\"{'p-checkbox-label-active':value!=null, 'p-disabled':disabled, 'p-checkbox-label-focus':focused}\"\n               *ngIf=\"label\" [attr.for]=\"inputId\">{{label}}</label>\n    ",
                    providers: [TRISTATECHECKBOX_VALUE_ACCESSOR],
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None
                },] }
    ];
    TriStateCheckbox.ctorParameters = function () { return [
        { type: ChangeDetectorRef }
    ]; };
    TriStateCheckbox.propDecorators = {
        disabled: [{ type: Input }],
        name: [{ type: Input }],
        ariaLabelledBy: [{ type: Input }],
        tabindex: [{ type: Input }],
        inputId: [{ type: Input }],
        style: [{ type: Input }],
        styleClass: [{ type: Input }],
        label: [{ type: Input }],
        readonly: [{ type: Input }],
        onChange: [{ type: Output }]
    };
    return TriStateCheckbox;
}());
var TriStateCheckboxModule = /** @class */ (function () {
    function TriStateCheckboxModule() {
    }
    TriStateCheckboxModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule],
                    exports: [TriStateCheckbox],
                    declarations: [TriStateCheckbox]
                },] }
    ];
    return TriStateCheckboxModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { TRISTATECHECKBOX_VALUE_ACCESSOR, TriStateCheckbox, TriStateCheckboxModule };
//# sourceMappingURL=primeng-tristatecheckbox.js.map
