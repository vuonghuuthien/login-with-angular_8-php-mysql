import { ElementRef, Optional, Directive, HostListener, NgModule } from '@angular/core';
import { NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';

var InputText = /** @class */ (function () {
    function InputText(el, ngModel) {
        this.el = el;
        this.ngModel = ngModel;
    }
    InputText.prototype.ngDoCheck = function () {
        this.updateFilledState();
    };
    InputText.prototype.onInput = function (e) {
        this.updateFilledState();
    };
    InputText.prototype.updateFilledState = function () {
        this.filled = (this.el.nativeElement.value && this.el.nativeElement.value.length) ||
            (this.ngModel && this.ngModel.model);
    };
    InputText.ctorParameters = function () { return [
        { type: ElementRef },
        { type: NgModel, decorators: [{ type: Optional }] }
    ]; };
    InputText.decorators = [
        { type: Directive, args: [{
                    selector: '[pInputText]',
                    host: {
                        '[class.p-inputtext]': 'true',
                        '[class.p-component]': 'true',
                        '[class.p-filled]': 'filled'
                    }
                },] }
    ];
    InputText.ctorParameters = function () { return [
        { type: ElementRef },
        { type: NgModel, decorators: [{ type: Optional }] }
    ]; };
    InputText.propDecorators = {
        onInput: [{ type: HostListener, args: ['input', ['$event'],] }]
    };
    return InputText;
}());
var InputTextModule = /** @class */ (function () {
    function InputTextModule() {
    }
    InputTextModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule],
                    exports: [InputText],
                    declarations: [InputText]
                },] }
    ];
    return InputTextModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { InputText, InputTextModule };
//# sourceMappingURL=primeng-inputtext.js.map
