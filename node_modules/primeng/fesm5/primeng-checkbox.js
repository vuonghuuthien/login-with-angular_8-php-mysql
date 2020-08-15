import { forwardRef, EventEmitter, ChangeDetectorRef, Component, ChangeDetectionStrategy, ViewEncapsulation, Input, ViewChild, Output, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var CHECKBOX_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(function () { return Checkbox; }),
    multi: true
};
var Checkbox = /** @class */ (function () {
    function Checkbox(cd) {
        this.cd = cd;
        this.checkboxIcon = 'pi pi-check';
        this.onChange = new EventEmitter();
        this.onModelChange = function () { };
        this.onModelTouched = function () { };
        this.focused = false;
        this.checked = false;
    }
    Checkbox.prototype.onClick = function (event, checkbox, focus) {
        event.preventDefault();
        if (this.disabled || this.readonly) {
            return;
        }
        this.checked = !this.checked;
        this.updateModel(event);
        if (focus) {
            checkbox.focus();
        }
    };
    Checkbox.prototype.updateModel = function (event) {
        if (!this.binary) {
            if (this.checked)
                this.addValue();
            else
                this.removeValue();
            this.onModelChange(this.model);
            if (this.formControl) {
                this.formControl.setValue(this.model);
            }
        }
        else {
            this.onModelChange(this.checked);
        }
        this.onChange.emit({ checked: this.checked, originalEvent: event });
    };
    Checkbox.prototype.handleChange = function (event) {
        if (!this.readonly) {
            this.checked = event.target.checked;
            this.updateModel(event);
        }
    };
    Checkbox.prototype.isChecked = function () {
        if (this.binary)
            return this.model;
        else
            return this.model && this.model.indexOf(this.value) > -1;
    };
    Checkbox.prototype.removeValue = function () {
        var _this = this;
        this.model = this.model.filter(function (val) { return val !== _this.value; });
    };
    Checkbox.prototype.addValue = function () {
        if (this.model)
            this.model = __spread(this.model, [this.value]);
        else
            this.model = [this.value];
    };
    Checkbox.prototype.onFocus = function () {
        this.focused = true;
    };
    Checkbox.prototype.onBlur = function () {
        this.focused = false;
        this.onModelTouched();
    };
    Checkbox.prototype.focus = function () {
        this.inputViewChild.nativeElement.focus();
    };
    Checkbox.prototype.writeValue = function (model) {
        this.model = model;
        this.checked = this.isChecked();
        this.cd.markForCheck();
    };
    Checkbox.prototype.registerOnChange = function (fn) {
        this.onModelChange = fn;
    };
    Checkbox.prototype.registerOnTouched = function (fn) {
        this.onModelTouched = fn;
    };
    Checkbox.prototype.setDisabledState = function (val) {
        this.disabled = val;
    };
    Checkbox.ctorParameters = function () { return [
        { type: ChangeDetectorRef }
    ]; };
    Checkbox.decorators = [
        { type: Component, args: [{
                    selector: 'p-checkbox',
                    template: "\n        <div [ngStyle]=\"style\" [ngClass]=\"{'p-checkbox p-component': true, 'p-checkbox-checked': checked, 'p-checkbox-disabled': disabled, 'p-checkbox-focused': focused}\" [class]=\"styleClass\">\n            <div class=\"p-hidden-accessible\">\n                <input #cb type=\"checkbox\" [attr.id]=\"inputId\" [attr.name]=\"name\" [readonly]=\"readonly\" [value]=\"value\" [checked]=\"checked\" (focus)=\"onFocus()\" (blur)=\"onBlur()\"\n                (change)=\"handleChange($event)\" [disabled]=\"disabled\" [attr.tabindex]=\"tabindex\" [attr.aria-labelledby]=\"ariaLabelledBy\" [attr.required]=\"required\">\n            </div>\n            <div class=\"p-checkbox-box\" (click)=\"onClick($event,cb,true)\"\n                        [ngClass]=\"{'p-highlight': checked, 'p-disabled': disabled, 'p-focus': focused}\" role=\"checkbox\" [attr.aria-checked]=\"checked\">\n                <span class=\"p-checkbox-icon\" [ngClass]=\"checked ? checkboxIcon : null\"></span>\n            </div>\n        </div>\n        <label (click)=\"onClick($event,cb,true)\" [class]=\"labelStyleClass\"\n                [ngClass]=\"{'p-checkbox-label': true, 'p-checkbox-label-active':checked, 'p-disabled':disabled, 'p-checkbox-label-focus':focused}\"\n                *ngIf=\"label\" [attr.for]=\"inputId\">{{label}}</label>\n    ",
                    providers: [CHECKBOX_VALUE_ACCESSOR],
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    styles: [".p-checkbox{display:-ms-inline-flexbox;display:inline-flex;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;vertical-align:bottom}.p-checkbox-box{display:-ms-flexbox;display:flex;-ms-flex-pack:center;justify-content:center;-ms-flex-align:center;align-items:center}p-checkbox{display:-ms-inline-flexbox;display:inline-flex;vertical-align:bottom;-ms-flex-align:center;align-items:center}.p-checkbox-label{line-height:1}"]
                },] }
    ];
    Checkbox.ctorParameters = function () { return [
        { type: ChangeDetectorRef }
    ]; };
    Checkbox.propDecorators = {
        value: [{ type: Input }],
        name: [{ type: Input }],
        disabled: [{ type: Input }],
        binary: [{ type: Input }],
        label: [{ type: Input }],
        ariaLabelledBy: [{ type: Input }],
        tabindex: [{ type: Input }],
        inputId: [{ type: Input }],
        style: [{ type: Input }],
        styleClass: [{ type: Input }],
        labelStyleClass: [{ type: Input }],
        formControl: [{ type: Input }],
        checkboxIcon: [{ type: Input }],
        readonly: [{ type: Input }],
        required: [{ type: Input }],
        inputViewChild: [{ type: ViewChild, args: ['cb',] }],
        onChange: [{ type: Output }]
    };
    return Checkbox;
}());
var CheckboxModule = /** @class */ (function () {
    function CheckboxModule() {
    }
    CheckboxModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule],
                    exports: [Checkbox],
                    declarations: [Checkbox]
                },] }
    ];
    return CheckboxModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { CHECKBOX_VALUE_ACCESSOR, Checkbox, CheckboxModule };
//# sourceMappingURL=primeng-checkbox.js.map
