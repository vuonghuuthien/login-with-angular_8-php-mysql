(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/forms'), require('@angular/common')) :
    typeof define === 'function' && define.amd ? define('primeng/inputtext', ['exports', '@angular/core', '@angular/forms', '@angular/common'], factory) :
    (global = global || self, factory((global.primeng = global.primeng || {}, global.primeng.inputtext = {}), global.ng.core, global.ng.forms, global.ng.common));
}(this, (function (exports, core, forms, common) { 'use strict';

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
            { type: core.ElementRef },
            { type: forms.NgModel, decorators: [{ type: core.Optional }] }
        ]; };
        InputText.decorators = [
            { type: core.Directive, args: [{
                        selector: '[pInputText]',
                        host: {
                            '[class.p-inputtext]': 'true',
                            '[class.p-component]': 'true',
                            '[class.p-filled]': 'filled'
                        }
                    },] }
        ];
        InputText.ctorParameters = function () { return [
            { type: core.ElementRef },
            { type: forms.NgModel, decorators: [{ type: core.Optional }] }
        ]; };
        InputText.propDecorators = {
            onInput: [{ type: core.HostListener, args: ['input', ['$event'],] }]
        };
        return InputText;
    }());
    var InputTextModule = /** @class */ (function () {
        function InputTextModule() {
        }
        InputTextModule.decorators = [
            { type: core.NgModule, args: [{
                        imports: [common.CommonModule],
                        exports: [InputText],
                        declarations: [InputText]
                    },] }
        ];
        return InputTextModule;
    }());

    exports.InputText = InputText;
    exports.InputTextModule = InputTextModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=primeng-inputtext.umd.js.map
