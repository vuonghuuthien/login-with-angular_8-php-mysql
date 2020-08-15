(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('primeng/api'), require('primeng/inputtext'), require('@angular/forms')) :
    typeof define === 'function' && define.amd ? define('primeng/chips', ['exports', '@angular/core', '@angular/common', 'primeng/api', 'primeng/inputtext', '@angular/forms'], factory) :
    (global = global || self, factory((global.primeng = global.primeng || {}, global.primeng.chips = {}), global.ng.core, global.ng.common, global.primeng.api, global.primeng.inputtext, global.ng.forms));
}(this, (function (exports, core, common, api, inputtext, forms) { 'use strict';

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
    var CHIPS_VALUE_ACCESSOR = {
        provide: forms.NG_VALUE_ACCESSOR,
        useExisting: core.forwardRef(function () { return Chips; }),
        multi: true
    };
    var Chips = /** @class */ (function () {
        function Chips(el, cd) {
            this.el = el;
            this.cd = cd;
            this.allowDuplicate = true;
            this.onAdd = new core.EventEmitter();
            this.onRemove = new core.EventEmitter();
            this.onFocus = new core.EventEmitter();
            this.onBlur = new core.EventEmitter();
            this.onChipClick = new core.EventEmitter();
            this.onModelChange = function () { };
            this.onModelTouched = function () { };
        }
        Chips.prototype.ngAfterContentInit = function () {
            var _this = this;
            this.templates.forEach(function (item) {
                switch (item.getType()) {
                    case 'item':
                        _this.itemTemplate = item.template;
                        break;
                    default:
                        _this.itemTemplate = item.template;
                        break;
                }
            });
        };
        Chips.prototype.onClick = function () {
            this.inputViewChild.nativeElement.focus();
        };
        Chips.prototype.onInput = function () {
            this.updateFilledState();
        };
        Chips.prototype.onPaste = function (event) {
            var _this = this;
            if (this.separator) {
                var pastedData = (event.clipboardData || window['clipboardData']).getData('Text');
                pastedData.split(this.separator).forEach(function (val) {
                    _this.addItem(event, val, true);
                });
                this.inputViewChild.nativeElement.value = '';
            }
            this.updateFilledState();
        };
        Chips.prototype.updateFilledState = function () {
            if (!this.value || this.value.length === 0) {
                this.filled = (this.inputViewChild.nativeElement && this.inputViewChild.nativeElement.value != '');
            }
            else {
                this.filled = true;
            }
        };
        Chips.prototype.onItemClick = function (event, item) {
            this.onChipClick.emit({
                originalEvent: event,
                value: item
            });
        };
        Chips.prototype.writeValue = function (value) {
            this.value = value;
            this.updateMaxedOut();
            this.cd.markForCheck();
        };
        Chips.prototype.registerOnChange = function (fn) {
            this.onModelChange = fn;
        };
        Chips.prototype.registerOnTouched = function (fn) {
            this.onModelTouched = fn;
        };
        Chips.prototype.setDisabledState = function (val) {
            this.disabled = val;
        };
        Chips.prototype.resolveFieldData = function (data, field) {
            if (data && field) {
                if (field.indexOf('.') == -1) {
                    return data[field];
                }
                else {
                    var fields = field.split('.');
                    var value = data;
                    for (var i = 0, len = fields.length; i < len; ++i) {
                        value = value[fields[i]];
                    }
                    return value;
                }
            }
            else {
                return null;
            }
        };
        Chips.prototype.onInputFocus = function (event) {
            this.focus = true;
            this.onFocus.emit(event);
        };
        Chips.prototype.onInputBlur = function (event) {
            this.focus = false;
            if (this.addOnBlur && this.inputViewChild.nativeElement.value) {
                this.addItem(event, this.inputViewChild.nativeElement.value, false);
            }
            this.onModelTouched();
            this.onBlur.emit(event);
        };
        Chips.prototype.removeItem = function (event, index) {
            if (this.disabled) {
                return;
            }
            var removedItem = this.value[index];
            this.value = this.value.filter(function (val, i) { return i != index; });
            this.onModelChange(this.value);
            this.onRemove.emit({
                originalEvent: event,
                value: removedItem
            });
            this.updateFilledState();
            this.updateMaxedOut();
        };
        Chips.prototype.addItem = function (event, item, preventDefault) {
            this.value = this.value || [];
            if (item && item.trim().length) {
                if (this.allowDuplicate || this.value.indexOf(item) === -1) {
                    this.value = __spread(this.value, [item]);
                    this.onModelChange(this.value);
                    this.onAdd.emit({
                        originalEvent: event,
                        value: item
                    });
                }
            }
            this.updateFilledState();
            this.updateMaxedOut();
            this.inputViewChild.nativeElement.value = '';
            if (preventDefault) {
                event.preventDefault();
            }
        };
        Chips.prototype.onKeydown = function (event) {
            switch (event.which) {
                //backspace
                case 8:
                    if (this.inputViewChild.nativeElement.value.length === 0 && this.value && this.value.length > 0) {
                        this.value = __spread(this.value);
                        var removedItem = this.value.pop();
                        this.onModelChange(this.value);
                        this.onRemove.emit({
                            originalEvent: event,
                            value: removedItem
                        });
                        this.updateFilledState();
                    }
                    break;
                //enter
                case 13:
                    this.addItem(event, this.inputViewChild.nativeElement.value, true);
                    break;
                case 9:
                    if (this.addOnTab && this.inputViewChild.nativeElement.value !== '') {
                        this.addItem(event, this.inputViewChild.nativeElement.value, true);
                    }
                    break;
                default:
                    if (this.max && this.value && this.max === this.value.length) {
                        event.preventDefault();
                    }
                    else if (this.separator) {
                        if (this.separator === ',' && event.which === 188) {
                            this.addItem(event, this.inputViewChild.nativeElement.value, true);
                        }
                    }
                    break;
            }
        };
        Chips.prototype.updateMaxedOut = function () {
            if (this.inputViewChild && this.inputViewChild.nativeElement) {
                if (this.max && this.value && this.max === this.value.length)
                    this.inputViewChild.nativeElement.disabled = true;
                else
                    this.inputViewChild.nativeElement.disabled = this.disabled || false;
            }
        };
        Chips.ctorParameters = function () { return [
            { type: core.ElementRef },
            { type: core.ChangeDetectorRef }
        ]; };
        Chips.decorators = [
            { type: core.Component, args: [{
                        selector: 'p-chips',
                        template: "\n        <div [ngClass]=\"'p-chips p-component'\" [ngStyle]=\"style\" [class]=\"styleClass\" (click)=\"onClick()\">\n            <ul [ngClass]=\"{'p-inputtext p-chips-multiple-container':true,'p-focus':focus,'p-disabled':disabled}\">\n                <li #token *ngFor=\"let item of value; let i = index;\" class=\"p-chips-token\" (click)=\"onItemClick($event, item)\">\n                    <ng-container *ngTemplateOutlet=\"itemTemplate; context: {$implicit: item}\"></ng-container>\n                    <span *ngIf=\"!itemTemplate\" class=\"p-chips-token-label\">{{field ? resolveFieldData(item,field) : item}}</span>\n                    <span *ngIf=\"!disabled\" class=\"p-chips-token-icon pi pi-times-circle\" (click)=\"removeItem($event,i)\"></span>\n                </li>\n                <li class=\"p-chips-input-token\">\n                    <input #inputtext type=\"text\" [attr.id]=\"inputId\" [attr.placeholder]=\"(value && value.length ? null : placeholder)\" [attr.tabindex]=\"tabindex\" (keydown)=\"onKeydown($event)\"\n                    (input)=\"onInput()\" (paste)=\"onPaste($event)\" [attr.aria-labelledby]=\"ariaLabelledBy\" (focus)=\"onInputFocus($event)\" (blur)=\"onInputBlur($event)\" [disabled]=\"disabled\" [ngStyle]=\"inputStyle\" [class]=\"inputStyleClass\">\n                </li>\n            </ul>\n        </div>\n    ",
                        host: {
                            '[class.p-inputwrapper-filled]': 'filled',
                            '[class.p-inputwrapper-focus]': 'focus'
                        },
                        providers: [CHIPS_VALUE_ACCESSOR],
                        changeDetection: core.ChangeDetectionStrategy.OnPush,
                        encapsulation: core.ViewEncapsulation.None,
                        styles: [".p-chips{display:-ms-inline-flexbox;display:inline-flex}.p-chips-multiple-container{margin:0;padding:0;list-style-type:none;cursor:text;overflow:hidden;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center}.p-chips-token{cursor:default;display:-ms-inline-flexbox;display:inline-flex;-ms-flex-align:center;align-items:center;-ms-flex:0 0 auto;flex:0 0 auto}.p-chips-input-token{-ms-flex:1 1 auto;flex:1 1 auto;display:-ms-inline-flexbox;display:inline-flex}.p-chips-token-icon{cursor:pointer}.p-chips-input-token input{border:0;outline:0;background-color:transparent;margin:0;padding:0;box-shadow:none;border-radius:0;width:100%}.p-fluid .p-chips{display:-ms-flexbox;display:flex}"]
                    },] }
        ];
        Chips.ctorParameters = function () { return [
            { type: core.ElementRef },
            { type: core.ChangeDetectorRef }
        ]; };
        Chips.propDecorators = {
            style: [{ type: core.Input }],
            styleClass: [{ type: core.Input }],
            disabled: [{ type: core.Input }],
            field: [{ type: core.Input }],
            placeholder: [{ type: core.Input }],
            max: [{ type: core.Input }],
            ariaLabelledBy: [{ type: core.Input }],
            tabindex: [{ type: core.Input }],
            inputId: [{ type: core.Input }],
            allowDuplicate: [{ type: core.Input }],
            inputStyle: [{ type: core.Input }],
            inputStyleClass: [{ type: core.Input }],
            addOnTab: [{ type: core.Input }],
            addOnBlur: [{ type: core.Input }],
            separator: [{ type: core.Input }],
            onAdd: [{ type: core.Output }],
            onRemove: [{ type: core.Output }],
            onFocus: [{ type: core.Output }],
            onBlur: [{ type: core.Output }],
            onChipClick: [{ type: core.Output }],
            inputViewChild: [{ type: core.ViewChild, args: ['inputtext',] }],
            templates: [{ type: core.ContentChildren, args: [api.PrimeTemplate,] }]
        };
        return Chips;
    }());
    var ChipsModule = /** @class */ (function () {
        function ChipsModule() {
        }
        ChipsModule.decorators = [
            { type: core.NgModule, args: [{
                        imports: [common.CommonModule, inputtext.InputTextModule, api.SharedModule],
                        exports: [Chips, inputtext.InputTextModule, api.SharedModule],
                        declarations: [Chips]
                    },] }
        ];
        return ChipsModule;
    }());

    exports.CHIPS_VALUE_ACCESSOR = CHIPS_VALUE_ACCESSOR;
    exports.Chips = Chips;
    exports.ChipsModule = ChipsModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=primeng-chips.umd.js.map
