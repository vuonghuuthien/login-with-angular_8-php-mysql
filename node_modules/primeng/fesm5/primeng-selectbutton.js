import { forwardRef, EventEmitter, ChangeDetectorRef, Component, ChangeDetectionStrategy, ViewEncapsulation, Input, Output, ContentChild, TemplateRef, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ObjectUtils } from 'primeng/utils';
import { RippleModule } from 'primeng/ripple';
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
var SELECTBUTTON_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(function () { return SelectButton; }),
    multi: true
};
var SelectButton = /** @class */ (function () {
    function SelectButton(cd) {
        this.cd = cd;
        this.tabindex = 0;
        this.onOptionClick = new EventEmitter();
        this.onChange = new EventEmitter();
        this.onModelChange = function () { };
        this.onModelTouched = function () { };
    }
    Object.defineProperty(SelectButton.prototype, "options", {
        get: function () {
            return this._options;
        },
        set: function (val) {
            //NoOp
        },
        enumerable: false,
        configurable: true
    });
    SelectButton.prototype.ngOnChanges = function (simpleChange) {
        if (simpleChange.options) {
            this._options = this.optionLabel ? ObjectUtils.generateSelectItems(simpleChange.options.currentValue, this.optionLabel) : simpleChange.options.currentValue;
        }
    };
    SelectButton.prototype.writeValue = function (value) {
        this.value = value;
        this.cd.markForCheck();
    };
    SelectButton.prototype.registerOnChange = function (fn) {
        this.onModelChange = fn;
    };
    SelectButton.prototype.registerOnTouched = function (fn) {
        this.onModelTouched = fn;
    };
    SelectButton.prototype.setDisabledState = function (val) {
        this.disabled = val;
    };
    SelectButton.prototype.onItemClick = function (event, option, index) {
        if (this.disabled || option.disabled) {
            return;
        }
        if (this.multiple) {
            var itemIndex_1 = this.findItemIndex(option);
            if (itemIndex_1 != -1)
                this.value = this.value.filter(function (val, i) { return i != itemIndex_1; });
            else
                this.value = __spread(this.value || [], [option.value]);
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
    };
    SelectButton.prototype.onBlur = function (event) {
        this.onModelTouched();
    };
    SelectButton.prototype.isSelected = function (option) {
        if (this.multiple)
            return this.findItemIndex(option) != -1;
        else
            return ObjectUtils.equals(option.value, this.value, this.dataKey);
    };
    SelectButton.prototype.findItemIndex = function (option) {
        var index = -1;
        if (this.value) {
            for (var i = 0; i < this.value.length; i++) {
                if (this.value[i] == option.value) {
                    index = i;
                    break;
                }
            }
        }
        return index;
    };
    SelectButton.ctorParameters = function () { return [
        { type: ChangeDetectorRef }
    ]; };
    SelectButton.decorators = [
        { type: Component, args: [{
                    selector: 'p-selectButton',
                    template: "\n        <div [ngClass]=\"'p-selectbutton p-buttonset p-component'\" [ngStyle]=\"style\" [class]=\"styleClass\"  role=\"group\">\n            <div *ngFor=\"let option of options; let i = index\" #btn class=\"p-button p-component\" [class]=\"option.styleClass\" role=\"button\" [attr.aria-pressed]=\"isSelected(option)\"\n                [ngClass]=\"{'p-highlight':isSelected(option), 'p-disabled': disabled || option.disabled, \n                'p-button-icon-only': (option.icon && !option.label)}\" (click)=\"onItemClick($event,option,i)\" (keydown.enter)=\"onItemClick($event,option,i)\"\n                [attr.title]=\"option.title\" [attr.aria-label]=\"option.label\" (blur)=\"onBlur($event)\" [attr.tabindex]=\"tabindex\" [attr.aria-labelledby]=\"ariaLabelledBy\" pRipple>\n                <ng-container *ngIf=\"!itemTemplate else customcontent\">\n                    <span [ngClass]=\"'p-button-icon p-button-icon-left'\" [class]=\"option.icon\" *ngIf=\"option.icon\"></span>\n                    <span class=\"p-button-label\">{{option.label}}</span>\n                </ng-container>\n                <ng-template #customcontent>\n                    <ng-container *ngTemplateOutlet=\"itemTemplate; context: {$implicit: option, index: i}\"></ng-container>\n                </ng-template>\n            </div>\n        </div>\n    ",
                    providers: [SELECTBUTTON_VALUE_ACCESSOR],
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    styles: [".ui-selectbutton{display:inline-block}.ui-selectbutton.ui-state-error{padding:0}.ui-selectbutton .ui-button.ui-state-focus{outline:0}", ".p-button{margin:0;display:-ms-inline-flexbox;display:inline-flex;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-ms-flex-align:center;align-items:center;vertical-align:bottom;text-align:center;overflow:hidden;position:relative}.p-button-label{-ms-flex:1 1 auto;flex:1 1 auto}.p-button-icon-right{-ms-flex-order:1;order:1}.p-button:disabled{cursor:default}.p-button-icon-only{-ms-flex-pack:center;justify-content:center}.p-button-icon-only .p-button-label{visibility:hidden;width:0;-ms-flex:0 0 auto;flex:0 0 auto}.p-button-vertical{-ms-flex-direction:column;flex-direction:column}.p-button-icon-bottom{-ms-flex-order:2;order:2}.p-buttonset .p-button{margin:0}.p-buttonset .p-button:not(:last-child){border-right:0}.p-buttonset .p-button:not(:first-of-type):not(:last-of-type){border-radius:0}.p-buttonset .p-button:first-of-type{border-top-right-radius:0;border-bottom-right-radius:0}.p-buttonset .p-button:last-of-type{border-top-left-radius:0;border-bottom-left-radius:0}.p-buttonset .p-button:focus{position:relative;z-index:1}"]
                },] }
    ];
    SelectButton.ctorParameters = function () { return [
        { type: ChangeDetectorRef }
    ]; };
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
    return SelectButton;
}());
var SelectButtonModule = /** @class */ (function () {
    function SelectButtonModule() {
    }
    SelectButtonModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule, RippleModule],
                    exports: [SelectButton],
                    declarations: [SelectButton]
                },] }
    ];
    return SelectButtonModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { SELECTBUTTON_VALUE_ACCESSOR, SelectButton, SelectButtonModule };
//# sourceMappingURL=primeng-selectbutton.js.map
