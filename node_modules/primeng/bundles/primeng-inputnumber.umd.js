(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('primeng/inputtext'), require('primeng/button'), require('@angular/forms')) :
    typeof define === 'function' && define.amd ? define('primeng/inputnumber', ['exports', '@angular/core', '@angular/common', 'primeng/inputtext', 'primeng/button', '@angular/forms'], factory) :
    (global = global || self, factory((global.primeng = global.primeng || {}, global.primeng.inputnumber = {}), global.ng.core, global.ng.common, global.primeng.inputtext, global.primeng.button, global.ng.forms));
}(this, (function (exports, core, common, inputtext, button, forms) { 'use strict';

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
    var INPUTNUMBER_VALUE_ACCESSOR = {
        provide: forms.NG_VALUE_ACCESSOR,
        useExisting: core.forwardRef(function () { return InputNumber; }),
        multi: true
    };
    var InputNumber = /** @class */ (function () {
        function InputNumber(el, cd) {
            this.el = el;
            this.cd = cd;
            this.showButtons = false;
            this.format = true;
            this.buttonLayout = "stacked";
            this.useGrouping = true;
            this.incrementButtonIcon = 'pi pi-angle-up';
            this.decrementButtonIcon = 'pi pi-angle-down';
            this.mode = "decimal";
            this.step = 1;
            this.onFocus = new core.EventEmitter();
            this.onBlur = new core.EventEmitter();
            this.onModelChange = function () { };
            this.onModelTouched = function () { };
        }
        InputNumber.prototype.ngOnInit = function () {
            this.numberFormat = new Intl.NumberFormat(this.locale, this.getOptions());
            var numerals = __spread(new Intl.NumberFormat(this.locale, { useGrouping: false }).format(9876543210)).reverse();
            var index = new Map(numerals.map(function (d, i) { return [d, i]; }));
            this._numeral = new RegExp("[" + numerals.join('') + "]", 'g');
            this._decimal = this.getDecimalExpression();
            this._group = this.getGroupingExpression();
            this._minusSign = this.getMinusSignExpression();
            this._currency = this.getCurrencyExpression();
            this._suffix = new RegExp("[" + (this.suffix || '') + "]", 'g');
            this._prefix = new RegExp("[" + (this.prefix || '') + "]", 'g');
            this._index = function (d) { return index.get(d); };
        };
        InputNumber.prototype.formatValue = function (value) {
            if (value != null) {
                if (this.format) {
                    var formatter = new Intl.NumberFormat(this.locale, this.getOptions());
                    var formattedValue = formatter.format(value);
                    if (this.prefix) {
                        formattedValue = this.prefix + formattedValue;
                    }
                    if (this.suffix) {
                        formattedValue = formattedValue + this.suffix;
                    }
                    return formattedValue;
                }
                return value;
            }
            return '';
        };
        InputNumber.prototype.formattedValue = function () {
            return this.formatValue(this.value);
        };
        InputNumber.prototype.onInput = function (event) {
            if (this.isSpecialChar) {
                event.target.value = this.lastValue;
            }
            this.isSpecialChar = false;
        };
        InputNumber.prototype.onInputKeyDown = function (event) {
            this.lastValue = event.target.value;
            if (event.shiftKey || event.altKey) {
                this.isSpecialChar = true;
                return;
            }
            var selectionStart = event.target.selectionStart;
            var selectionEnd = event.target.selectionEnd;
            var inputValue = event.target.value;
            if (event.altKey) {
                event.preventDefault();
            }
            switch (event.which) {
                //up
                case 38:
                    this.spin(event, 1);
                    event.preventDefault();
                    break;
                //down
                case 40:
                    this.spin(event, -1);
                    event.preventDefault();
                    break;
                //left
                case 37:
                    if (!this.isNumeralChar(inputValue.charAt(selectionStart - 1))) {
                        event.preventDefault();
                    }
                    break;
                //right
                case 39:
                    if (!this.isNumeralChar(inputValue.charAt(selectionStart))) {
                        event.preventDefault();
                    }
                    break;
                //backspace
                case 8: {
                    event.preventDefault();
                    var newValueStr = null;
                    if (selectionStart === selectionEnd) {
                        var deleteChar = inputValue.charAt(selectionStart - 1);
                        var decimalCharIndex = inputValue.search(this._decimal);
                        this._decimal.lastIndex = 0;
                        if (this.isNumeralChar(deleteChar)) {
                            if (this._group.test(deleteChar)) {
                                this._group.lastIndex = 0;
                                newValueStr = inputValue.slice(0, selectionStart - 2) + inputValue.slice(selectionStart - 1);
                            }
                            else if (this._decimal.test(deleteChar)) {
                                this._decimal.lastIndex = 0;
                                this.input.nativeElement.setSelectionRange(selectionStart - 1, selectionStart - 1);
                            }
                            else if (decimalCharIndex > 0 && selectionStart > decimalCharIndex) {
                                newValueStr = inputValue.slice(0, selectionStart - 1) + '0' + inputValue.slice(selectionStart);
                            }
                            else {
                                newValueStr = inputValue.slice(0, selectionStart - 1) + inputValue.slice(selectionStart);
                            }
                        }
                        if (newValueStr != null) {
                            this.updateValue(event, newValueStr, 'delete-single');
                        }
                    }
                    else {
                        newValueStr = this.deleteRange(inputValue, selectionStart, selectionEnd);
                        this.updateValue(event, newValueStr, 'delete-range');
                    }
                    break;
                }
                default:
                    break;
            }
        };
        InputNumber.prototype.onInputKeyPress = function (event) {
            event.preventDefault();
            var code = event.which || event.keyCode;
            var char = String.fromCharCode(code);
            if ((48 <= code && code <= 57) || this.isMinusSign(char)) {
                this.insert(event, char);
            }
        };
        InputNumber.prototype.onPaste = function (event) {
            event.preventDefault();
            var data = (event.clipboardData || window['clipboardData']).getData('Text');
            if (data) {
                var filteredData = this.parseValue(data);
                if (filteredData != null) {
                    this.insert(event, filteredData.toString());
                }
            }
        };
        InputNumber.prototype.onInputClick = function () {
            this.initCursor();
        };
        InputNumber.prototype.onInputFocus = function (event) {
            this.focused = true;
            this.onFocus.emit(event);
        };
        InputNumber.prototype.onInputBlur = function (event) {
            this.focused = false;
            var newValue = this.validateValue(this.parseValue(this.input.nativeElement.value));
            this.input.nativeElement.value = this.formatValue(newValue);
            this.input.nativeElement.setAttribute('aria-valuenow', newValue);
            this.updateModel(event, newValue);
            this.onBlur.emit(event);
        };
        InputNumber.prototype.onUpButtonMouseDown = function (event) {
            this.input.nativeElement.focus();
            this.repeat(event, null, 1);
            event.preventDefault();
        };
        InputNumber.prototype.onUpButtonMouseUp = function () {
            this.clearTimer();
        };
        InputNumber.prototype.onUpButtonMouseLeave = function () {
            this.clearTimer();
        };
        InputNumber.prototype.onUpButtonKeyDown = function (event) {
            if (event.keyCode === 32 || event.keyCode === 13) {
                this.repeat(event, null, 1);
            }
        };
        InputNumber.prototype.onUpButtonKeyUp = function () {
            this.clearTimer();
        };
        InputNumber.prototype.onDownButtonMouseDown = function (event) {
            this.input.nativeElement.focus();
            this.repeat(event, null, -1);
            event.preventDefault();
        };
        InputNumber.prototype.onDownButtonMouseUp = function () {
            this.clearTimer();
        };
        InputNumber.prototype.onDownButtonMouseLeave = function () {
            this.clearTimer();
        };
        InputNumber.prototype.onDownButtonKeyUp = function () {
            this.clearTimer();
        };
        InputNumber.prototype.onDownButtonKeyDown = function (event) {
            if (event.keyCode === 32 || event.keyCode === 13) {
                this.repeat(event, null, -1);
            }
        };
        InputNumber.prototype.spin = function (event, dir) {
            var step = this.step * dir;
            var currentValue = this.parseValue(this.input.nativeElement.value) || 0;
            var newValue = this.validateValue(currentValue + step);
            if (this.maxlength && this.maxlength < this.formatValue(newValue).length) {
                return;
            }
            this.updateInput(newValue, 'spin');
            this.updateModel(event, newValue);
        };
        InputNumber.prototype.repeat = function (event, interval, dir) {
            var _this = this;
            var i = interval || 500;
            this.clearTimer();
            this.timer = setTimeout(function () {
                _this.repeat(event, 40, dir);
            }, i);
            this.spin(event, dir);
        };
        InputNumber.prototype.clearTimer = function () {
            if (this.timer) {
                clearInterval(this.timer);
            }
        };
        InputNumber.prototype.insert = function (event, text) {
            var selectionStart = this.input.nativeElement.selectionStart;
            var selectionEnd = this.input.nativeElement.selectionEnd;
            var inputValue = this.input.nativeElement.value.trim();
            var maxFractionDigits = this.numberFormat.resolvedOptions().maximumFractionDigits;
            var newValueStr;
            var decimalCharIndex = inputValue.search(this._decimal);
            this._decimal.lastIndex = 0;
            if (decimalCharIndex > 0 && selectionStart > decimalCharIndex) {
                if ((selectionStart + text.length - (decimalCharIndex + 1)) <= maxFractionDigits) {
                    newValueStr = inputValue.slice(0, selectionStart) + text + inputValue.slice(selectionStart + text.length);
                    this.updateValue(event, newValueStr, 'insert');
                }
            }
            else {
                newValueStr = this.insertText(inputValue, text, selectionStart, selectionEnd);
                this.updateValue(event, newValueStr, 'insert');
            }
        };
        InputNumber.prototype.insertText = function (value, text, start, end) {
            var newValueStr;
            if ((end - start) === value.length)
                newValueStr = text;
            else if (start === 0)
                newValueStr = text + value.slice(end);
            else if (end === value.length)
                newValueStr = value.slice(0, start) + text;
            else
                newValueStr = value.slice(0, start) + text + value.slice(end);
            return newValueStr;
        };
        InputNumber.prototype.initCursor = function () {
            var selectionStart = this.input.nativeElement.selectionStart;
            var inputValue = this.input.nativeElement.value;
            var valueLength = inputValue.length;
            var index = null;
            var char = inputValue.charAt(selectionStart);
            if (this.isNumeralChar(char)) {
                return;
            }
            //left
            var i = selectionStart - 1;
            while (i >= 0) {
                char = inputValue.charAt(i);
                if (this.isNumeralChar(char)) {
                    index = i;
                    break;
                }
                else {
                    i--;
                }
            }
            if (index !== null) {
                this.input.nativeElement.setSelectionRange(index + 1, index + 1);
            }
            else {
                i = selectionStart + 1;
                while (i < valueLength) {
                    char = inputValue.charAt(i);
                    if (this.isNumeralChar(char)) {
                        index = i;
                        break;
                    }
                    else {
                        i++;
                    }
                }
                if (index !== null) {
                    this.input.nativeElement.setSelectionRange(index, index);
                }
            }
        };
        InputNumber.prototype.updateInput = function (value, operation) {
            var currentLength = this.input.nativeElement.value.length;
            if (currentLength === 0) {
                this.input.nativeElement.value = this.formatValue(value);
                this.input.nativeElement.setSelectionRange(0, 0);
                this.initCursor();
                this.input.nativeElement.setSelectionRange(this.input.nativeElement.selectionStart + 1, this.input.nativeElement.selectionStart + 1);
            }
            else {
                var selectionStart = this.input.nativeElement.selectionEnd;
                var selectionEnd = this.input.nativeElement.selectionEnd;
                var formattedValue = this.formatValue(value);
                if (this.maxlength && this.maxlength < formattedValue.length) {
                    return;
                }
                this.input.nativeElement.value = this.formatValue(value);
                var newLength = this.input.nativeElement.value.length;
                if (newLength === currentLength) {
                    if (operation === 'insert')
                        this.input.nativeElement.setSelectionRange(selectionEnd + 1, selectionEnd + 1);
                    else if (operation === 'delete-single')
                        this.input.nativeElement.setSelectionRange(selectionEnd - 1, selectionEnd - 1);
                    else if (operation === 'delete-range')
                        this.input.nativeElement.setSelectionRange(selectionStart, selectionStart);
                    else if (operation === 'spin')
                        this.input.nativeElement.setSelectionRange(selectionStart, selectionEnd);
                }
                else {
                    selectionEnd = selectionEnd + (newLength - currentLength);
                    this.input.nativeElement.setSelectionRange(selectionEnd, selectionEnd);
                }
            }
            this.input.nativeElement.setAttribute('aria-valuenow', value);
        };
        InputNumber.prototype.updateModel = function (event, value) {
            this.value = value;
            this.onModelChange(value);
        };
        InputNumber.prototype.updateValue = function (event, valueStr, operation) {
            if (valueStr != null) {
                var newValue = this.parseValue(valueStr);
                this.updateInput(newValue, operation);
            }
        };
        InputNumber.prototype.validateValue = function (value) {
            if (this.min !== null && value < this.min) {
                return this.min;
            }
            if (this.max !== null && value > this.max) {
                return this.max;
            }
            return value;
        };
        InputNumber.prototype.deleteRange = function (value, start, end) {
            var newValueStr;
            if ((end - start) === value.length)
                newValueStr = '';
            else if (start === 0)
                newValueStr = value.slice(end);
            else if (end === value.length)
                newValueStr = value.slice(0, start);
            else
                newValueStr = value.slice(0, start) + value.slice(end);
            return newValueStr;
        };
        InputNumber.prototype.isNumeralChar = function (char) {
            if (char.length === 1 && (this._numeral.test(char) || this._decimal.test(char) || this._group.test(char) || this._minusSign.test(char))) {
                this.resetRegex();
                return true;
            }
            return false;
        };
        InputNumber.prototype.isMinusSign = function (char) {
            if (this._minusSign.test(char)) {
                this._minusSign.lastIndex = 0;
                return true;
            }
            return false;
        };
        InputNumber.prototype.parseValue = function (text) {
            var filteredText = text.trim()
                .replace(/\s/g, '')
                .replace(this._currency, '')
                .replace(this._group, '')
                .replace(this._suffix, '')
                .replace(this._prefix, '')
                .replace(this._minusSign, '-')
                .replace(this._decimal, '.')
                .replace(this._numeral, this._index);
            if (filteredText) {
                var parsedValue = +filteredText;
                return isNaN(parsedValue) ? null : parsedValue;
            }
            return null;
        };
        InputNumber.prototype.writeValue = function (value) {
            this.value = value;
            this.cd.markForCheck();
        };
        InputNumber.prototype.registerOnChange = function (fn) {
            this.onModelChange = fn;
        };
        InputNumber.prototype.registerOnTouched = function (fn) {
            this.onModelTouched = fn;
        };
        InputNumber.prototype.setDisabledState = function (val) {
            this.disabled = val;
        };
        InputNumber.prototype.getOptions = function () {
            return {
                localeMatcher: this.localeMatcher,
                style: this.mode,
                currency: this.currency,
                currencyDisplay: this.currencyDisplay,
                useGrouping: this.useGrouping,
                minimumFractionDigits: this.minFractionDigits,
                maximumFractionDigits: this.maxFractionDigits
            };
        };
        InputNumber.prototype.getDecimalExpression = function () {
            var formatter = new Intl.NumberFormat(this.locale, { useGrouping: false });
            return new RegExp("[" + formatter.format(1.1).trim().replace(this._numeral, '') + "]", 'g');
        };
        InputNumber.prototype.getGroupingExpression = function () {
            var formatter = new Intl.NumberFormat(this.locale, { useGrouping: true });
            return new RegExp("[" + formatter.format(1000).trim().replace(this._numeral, '') + "]", 'g');
        };
        InputNumber.prototype.getMinusSignExpression = function () {
            var formatter = new Intl.NumberFormat(this.locale, { useGrouping: false });
            return new RegExp("[" + formatter.format(-1).trim().replace(this._numeral, '') + "]", 'g');
        };
        InputNumber.prototype.getCurrencyExpression = function () {
            if (this.currency) {
                var formatter = new Intl.NumberFormat(this.locale, { style: 'currency', currency: this.currency, currencyDisplay: this.currencyDisplay });
                return new RegExp("[" + formatter.format(1).replace(/\s/g, '').replace(this._numeral, '').replace(this._decimal, '').replace(this._group, '') + "]", 'g');
            }
            return new RegExp("[]", 'g');
        };
        Object.defineProperty(InputNumber.prototype, "filled", {
            get: function () {
                return (this.value != null && this.value.toString().length > 0);
            },
            enumerable: false,
            configurable: true
        });
        InputNumber.prototype.resetRegex = function () {
            this._numeral.lastIndex = 0;
            this._decimal.lastIndex = 0;
            this._group.lastIndex = 0;
            this._minusSign.lastIndex = 0;
        };
        InputNumber.ctorParameters = function () { return [
            { type: core.ElementRef },
            { type: core.ChangeDetectorRef }
        ]; };
        InputNumber.decorators = [
            { type: core.Component, args: [{
                        selector: 'p-inputNumber',
                        template: "\n        <span [ngClass]=\"{'p-inputnumber p-component': true,'p-inputnumber-buttons-stacked': this.showButtons && this.buttonLayout === 'stacked',\n                'p-inputnumber-buttons-horizontal': this.showButtons && this.buttonLayout === 'horizontal', 'p-inputnumber-buttons-vertical': this.showButtons && this.buttonLayout === 'vertical'}\" \n                [ngStyle]=\"style\" [class]=\"styleClass\">\n            <input #input [ngClass]=\"'p-inputnumber-input'\" [ngStyle]=\"inputStyle\" [class]=\"inputStyleClass\" pInputText [value]=\"formattedValue()\" [attr.placeholder]=\"placeholder\" [attr.title]=\"title\" [attr.id]=\"inputId\"\n                [attr.size]=\"size\" [attr.name]=\"name\" [attr.autocomplete]=\"autocomplete\" [attr.maxlength]=\"maxlength\" [attr.tabindex]=\"tabindex\" [attr.aria-label]=\"ariaLabel\"\n                [attr.aria-required]=\"ariaRequired\" [disabled]=\"disabled\" [attr.required]=\"required\" [attr.aria-valumin]=\"min\" [attr.aria-valuemax]=\"max\"\n                (input)=\"onInput($event)\" (keydown)=\"onInputKeyDown($event)\" (keypress)=\"onInputKeyPress($event)\" (paste)=\"onPaste($event)\" (click)=\"onInputClick()\"\n                (focus)=\"onInputFocus($event)\" (blur)=\"onInputBlur($event)\">\n            <span class=\"p-inputnumber-button-group\" *ngIf=\"showButtons && buttonLayout === 'stacked'\">\n                <button type=\"button\" pButton [ngClass]=\"{'p-inputnumber-button p-inputnumber-button-up': true}\" [class]=\"incrementButtonClass\" [icon]=\"incrementButtonIcon\" [disabled]=\"disabled\"\n                    (mousedown)=\"this.onUpButtonMouseDown($event)\" (mouseup)=\"onUpButtonMouseUp()\" (mouseleave)=\"onUpButtonMouseLeave()\" (keydown)=\"onUpButtonKeyDown($event)\" (keyup)=\"onUpButtonKeyUp()\"></button>\n                <button type=\"button\" pButton [ngClass]=\"{'p-inputnumber-button p-inputnumber-button-down': true}\" [class]=\"decrementButtonClass\" [icon]=\"decrementButtonIcon\" [disabled]=\"disabled\"\n                    (mousedown)=\"this.onDownButtonMouseDown($event)\" (mouseup)=\"onDownButtonMouseUp()\" (mouseleave)=\"onDownButtonMouseLeave()\" (keydown)=\"onDownButtonKeyDown($event)\" (keyup)=\"onDownButtonKeyUp()\"></button>\n            </span>\n            <button type=\"button\" pButton [ngClass]=\"{'p-inputnumber-button p-inputnumber-button-up': true}\" [class]=\"incrementButtonClass\" [icon]=\"incrementButtonIcon\" *ngIf=\"showButtons && buttonLayout !== 'stacked'\" [disabled]=\"disabled\"\n                (mousedown)=\"this.onUpButtonMouseDown($event)\" (mouseup)=\"onUpButtonMouseUp()\" (mouseleave)=\"onUpButtonMouseLeave()\" (keydown)=\"onUpButtonKeyDown($event)\" (keyup)=\"onUpButtonKeyUp()\"></button>\n            <button type=\"button\" pButton [ngClass]=\"{'p-inputnumber-button p-inputnumber-button-down': true}\" [class]=\"decrementButtonClass\" [icon]=\"decrementButtonIcon\" *ngIf=\"showButtons && buttonLayout !== 'stacked'\" [disabled]=\"disabled\"\n                (mousedown)=\"this.onDownButtonMouseDown($event)\" (mouseup)=\"onDownButtonMouseUp()\" (mouseleave)=\"onDownButtonMouseLeave()\" (keydown)=\"onDownButtonKeyDown($event)\" (keyup)=\"onDownButtonKeyUp()\"></button>\n        </span>\n    ",
                        changeDetection: core.ChangeDetectionStrategy.OnPush,
                        providers: [INPUTNUMBER_VALUE_ACCESSOR],
                        encapsulation: core.ViewEncapsulation.None,
                        host: {
                            '[class.p-inputwrapper-filled]': 'filled',
                            '[class.p-inputwrapper-focus]': 'focused'
                        },
                        styles: [".p-inputnumber{display:-ms-inline-flexbox;display:inline-flex}.p-inputnumber-button{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;-ms-flex:0 0 auto;flex:0 0 auto}.p-inputnumber-buttons-horizontal .p-button.p-inputnumber-button .p-button-label,.p-inputnumber-buttons-stacked .p-button.p-inputnumber-button .p-button-label{display:none}.p-inputnumber-buttons-stacked .p-button.p-inputnumber-button-up{border-top-left-radius:0;border-bottom-left-radius:0;border-bottom-right-radius:0;padding:0}.p-inputnumber-buttons-stacked .p-inputnumber-input{border-top-right-radius:0;border-bottom-right-radius:0}.p-inputnumber-buttons-stacked .p-button.p-inputnumber-button-down{border-top-left-radius:0;border-top-right-radius:0;border-bottom-left-radius:0;padding:0}.p-inputnumber-buttons-stacked .p-inputnumber-button-group{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column}.p-inputnumber-buttons-stacked .p-inputnumber-button-group .p-button.p-inputnumber-button{-ms-flex:1 1 auto;flex:1 1 auto}.p-inputnumber-buttons-horizontal .p-button.p-inputnumber-button-up{-ms-flex-order:3;order:3;border-top-left-radius:0;border-bottom-left-radius:0}.p-inputnumber-buttons-horizontal .p-inputnumber-input{-ms-flex-order:2;order:2;border-radius:0}.p-inputnumber-buttons-horizontal .p-button.p-inputnumber-button-down{-ms-flex-order:1;order:1;border-top-right-radius:0;border-bottom-right-radius:0}.p-inputnumber-buttons-vertical{-ms-flex-direction:column;flex-direction:column}.p-inputnumber-buttons-vertical .p-button.p-inputnumber-button-up{-ms-flex-order:1;order:1;border-bottom-left-radius:0;border-bottom-right-radius:0;width:100%}.p-inputnumber-buttons-vertical .p-inputnumber-input{-ms-flex-order:2;order:2;border-radius:0;text-align:center}.p-inputnumber-buttons-vertical .p-button.p-inputnumber-button-down{-ms-flex-order:3;order:3;border-top-left-radius:0;border-top-right-radius:0;width:100%}.p-inputnumber-input{-ms-flex:1 1 auto;flex:1 1 auto}.p-fluid .p-inputnumber{width:100%}.p-fluid .p-inputnumber .p-inputnumber-input{width:1%}.p-fluid .p-inputnumber-buttons-vertical .p-inputnumber-input{width:100%}"]
                    },] }
        ];
        InputNumber.ctorParameters = function () { return [
            { type: core.ElementRef },
            { type: core.ChangeDetectorRef }
        ]; };
        InputNumber.propDecorators = {
            showButtons: [{ type: core.Input }],
            format: [{ type: core.Input }],
            buttonLayout: [{ type: core.Input }],
            prefix: [{ type: core.Input }],
            locale: [{ type: core.Input }],
            suffix: [{ type: core.Input }],
            localeMatcher: [{ type: core.Input }],
            currency: [{ type: core.Input }],
            currencyDisplay: [{ type: core.Input }],
            useGrouping: [{ type: core.Input }],
            disabled: [{ type: core.Input }],
            inputId: [{ type: core.Input }],
            styleClass: [{ type: core.Input }],
            style: [{ type: core.Input }],
            placeholder: [{ type: core.Input }],
            size: [{ type: core.Input }],
            maxlength: [{ type: core.Input }],
            tabindex: [{ type: core.Input }],
            title: [{ type: core.Input }],
            ariaLabel: [{ type: core.Input }],
            ariaRequired: [{ type: core.Input }],
            name: [{ type: core.Input }],
            required: [{ type: core.Input }],
            autocomplete: [{ type: core.Input }],
            min: [{ type: core.Input }],
            max: [{ type: core.Input }],
            minFractionDigits: [{ type: core.Input }],
            maxFractionDigits: [{ type: core.Input }],
            incrementButtonClass: [{ type: core.Input }],
            decrementButtonClass: [{ type: core.Input }],
            incrementButtonIcon: [{ type: core.Input }],
            decrementButtonIcon: [{ type: core.Input }],
            mode: [{ type: core.Input }],
            step: [{ type: core.Input }],
            inputStyle: [{ type: core.Input }],
            inputStyleClass: [{ type: core.Input }],
            input: [{ type: core.ViewChild, args: ['input',] }],
            onFocus: [{ type: core.Output }],
            onBlur: [{ type: core.Output }]
        };
        return InputNumber;
    }());
    var InputNumberModule = /** @class */ (function () {
        function InputNumberModule() {
        }
        InputNumberModule.decorators = [
            { type: core.NgModule, args: [{
                        imports: [common.CommonModule, inputtext.InputTextModule, button.ButtonModule],
                        exports: [InputNumber],
                        declarations: [InputNumber]
                    },] }
        ];
        return InputNumberModule;
    }());

    exports.INPUTNUMBER_VALUE_ACCESSOR = INPUTNUMBER_VALUE_ACCESSOR;
    exports.InputNumber = InputNumber;
    exports.InputNumberModule = InputNumberModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=primeng-inputnumber.umd.js.map
