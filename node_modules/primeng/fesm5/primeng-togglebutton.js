import { forwardRef, EventEmitter, ChangeDetectorRef, Component, ChangeDetectionStrategy, Input, Output, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RippleModule } from 'primeng/ripple';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

var TOGGLEBUTTON_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(function () { return ToggleButton; }),
    multi: true
};
var ToggleButton = /** @class */ (function () {
    function ToggleButton(cd) {
        this.cd = cd;
        this.iconPos = 'left';
        this.onChange = new EventEmitter();
        this.checked = false;
        this.onModelChange = function () { };
        this.onModelTouched = function () { };
    }
    ToggleButton.prototype.toggle = function (event) {
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
    };
    ToggleButton.prototype.onBlur = function () {
        this.onModelTouched();
    };
    ToggleButton.prototype.writeValue = function (value) {
        this.checked = value;
        this.cd.markForCheck();
    };
    ToggleButton.prototype.registerOnChange = function (fn) {
        this.onModelChange = fn;
    };
    ToggleButton.prototype.registerOnTouched = function (fn) {
        this.onModelTouched = fn;
    };
    ToggleButton.prototype.setDisabledState = function (val) {
        this.disabled = val;
    };
    Object.defineProperty(ToggleButton.prototype, "hasOnLabel", {
        get: function () {
            return this.onLabel && this.onLabel.length > 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ToggleButton.prototype, "hasOffLabel", {
        get: function () {
            return this.onLabel && this.onLabel.length > 0;
        },
        enumerable: false,
        configurable: true
    });
    ToggleButton.ctorParameters = function () { return [
        { type: ChangeDetectorRef }
    ]; };
    ToggleButton.decorators = [
        { type: Component, args: [{
                    selector: 'p-toggleButton',
                    template: "\n        <div [ngClass]=\"{'p-button p-togglebutton p-component': true, 'p-button-icon-only': (onIcon && offIcon && !hasOnLabel && !hasOffLabel),'p-highlight': checked,'p-disabled':disabled}\" \n                        [ngStyle]=\"style\" [class]=\"styleClass\" (click)=\"toggle($event)\" (keydown.enter)=\"toggle($event)\"\n                        [attr.tabindex]=\"disabled ? null : '0'\" role=\"checkbox\" [attr.aria-checked]=\"checked\" pRipple>\n            <span *ngIf=\"onIcon||offIcon\" [class]=\"checked ? this.onIcon : this.offIcon\" \n                [ngClass]=\"{'p-button-icon': true, 'p-button-icon-left': (iconPos === 'left'), 'p-button-icon-right': (iconPos === 'right')}\"></span>\n            <span class=\"p-button-label\">{{checked ? hasOnLabel ? onLabel : '' : hasOffLabel ? offLabel : ''}}</span>\n        </div>\n    ",
                    providers: [TOGGLEBUTTON_VALUE_ACCESSOR],
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    styles: [".p-button{margin:0;display:-ms-inline-flexbox;display:inline-flex;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-ms-flex-align:center;align-items:center;vertical-align:bottom;text-align:center;overflow:hidden;position:relative}.p-button-label{-ms-flex:1 1 auto;flex:1 1 auto}.p-button-icon-right{-ms-flex-order:1;order:1}.p-button:disabled{cursor:default}.p-button-icon-only{-ms-flex-pack:center;justify-content:center}.p-button-icon-only .p-button-label{visibility:hidden;width:0;-ms-flex:0 0 auto;flex:0 0 auto}.p-button-vertical{-ms-flex-direction:column;flex-direction:column}.p-button-icon-bottom{-ms-flex-order:2;order:2}.p-buttonset .p-button{margin:0}.p-buttonset .p-button:not(:last-child){border-right:0}.p-buttonset .p-button:not(:first-of-type):not(:last-of-type){border-radius:0}.p-buttonset .p-button:first-of-type{border-top-right-radius:0;border-bottom-right-radius:0}.p-buttonset .p-button:last-of-type{border-top-left-radius:0;border-bottom-left-radius:0}.p-buttonset .p-button:focus{position:relative;z-index:1}"]
                },] }
    ];
    ToggleButton.ctorParameters = function () { return [
        { type: ChangeDetectorRef }
    ]; };
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
    return ToggleButton;
}());
var ToggleButtonModule = /** @class */ (function () {
    function ToggleButtonModule() {
    }
    ToggleButtonModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule, RippleModule],
                    exports: [ToggleButton],
                    declarations: [ToggleButton]
                },] }
    ];
    return ToggleButtonModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { TOGGLEBUTTON_VALUE_ACCESSOR, ToggleButton, ToggleButtonModule };
//# sourceMappingURL=primeng-togglebutton.js.map
