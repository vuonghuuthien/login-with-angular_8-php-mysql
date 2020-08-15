(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('@angular/animations'), require('primeng/inputtext'), require('primeng/button'), require('primeng/ripple'), require('primeng/api'), require('primeng/dom'), require('primeng/utils'), require('@angular/forms')) :
    typeof define === 'function' && define.amd ? define('primeng/autocomplete', ['exports', '@angular/core', '@angular/common', '@angular/animations', 'primeng/inputtext', 'primeng/button', 'primeng/ripple', 'primeng/api', 'primeng/dom', 'primeng/utils', '@angular/forms'], factory) :
    (global = global || self, factory((global.primeng = global.primeng || {}, global.primeng.autocomplete = {}), global.ng.core, global.ng.common, global.ng.animations, global.primeng.inputtext, global.primeng.button, global.primeng.ripple, global.primeng.api, global.primeng.dom, global.primeng.utils, global.ng.forms));
}(this, (function (exports, core, common, animations, inputtext, button, ripple, api, dom, utils, forms) { 'use strict';

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
    var __values = (this && this.__values) || function(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    };
    var AUTOCOMPLETE_VALUE_ACCESSOR = {
        provide: forms.NG_VALUE_ACCESSOR,
        useExisting: core.forwardRef(function () { return AutoComplete; }),
        multi: true
    };
    var AutoComplete = /** @class */ (function () {
        function AutoComplete(el, renderer, cd, differs) {
            this.el = el;
            this.renderer = renderer;
            this.cd = cd;
            this.differs = differs;
            this.minLength = 1;
            this.delay = 300;
            this.type = 'text';
            this.autoZIndex = true;
            this.baseZIndex = 0;
            this.dropdownIcon = "pi pi-chevron-down";
            this.unique = true;
            this.completeOnFocus = false;
            this.completeMethod = new core.EventEmitter();
            this.onSelect = new core.EventEmitter();
            this.onUnselect = new core.EventEmitter();
            this.onFocus = new core.EventEmitter();
            this.onBlur = new core.EventEmitter();
            this.onDropdownClick = new core.EventEmitter();
            this.onClear = new core.EventEmitter();
            this.onKeyUp = new core.EventEmitter();
            this.onShow = new core.EventEmitter();
            this.onHide = new core.EventEmitter();
            this.scrollHeight = '200px';
            this.dropdownMode = 'blank';
            this.showTransitionOptions = '.12s cubic-bezier(0, 0, 0.2, 1)';
            this.hideTransitionOptions = '.1s linear';
            this.autocomplete = 'off';
            this.onModelChange = function () { };
            this.onModelTouched = function () { };
            this.overlayVisible = false;
            this.focus = false;
            this.inputFieldValue = null;
            this.differ = differs.find([]).create(null);
            this.listId = utils.UniqueComponentId() + '_list';
        }
        Object.defineProperty(AutoComplete.prototype, "suggestions", {
            get: function () {
                return this._suggestions;
            },
            set: function (val) {
                this._suggestions = val;
                this.handleSuggestionsChange();
            },
            enumerable: false,
            configurable: true
        });
        AutoComplete.prototype.ngAfterViewChecked = function () {
            var _this = this;
            //Use timeouts as since Angular 4.2, AfterViewChecked is broken and not called after panel is updated
            if (this.suggestionsUpdated && this.overlay && this.overlay.offsetParent) {
                setTimeout(function () {
                    if (_this.overlay) {
                        _this.alignOverlay();
                    }
                }, 1);
                this.suggestionsUpdated = false;
            }
            if (this.highlightOptionChanged) {
                setTimeout(function () {
                    if (_this.overlay) {
                        var listItem = dom.DomHandler.findSingle(_this.overlay, 'li.p-highlight');
                        if (listItem) {
                            dom.DomHandler.scrollInView(_this.overlay, listItem);
                        }
                    }
                }, 1);
                this.highlightOptionChanged = false;
            }
        };
        AutoComplete.prototype.handleSuggestionsChange = function () {
            if (this._suggestions != null && this.loading) {
                this.highlightOption = null;
                if (this._suggestions.length) {
                    this.noResults = false;
                    this.show();
                    this.suggestionsUpdated = true;
                    if (this.autoHighlight) {
                        this.highlightOption = this._suggestions[0];
                    }
                }
                else {
                    this.noResults = true;
                    if (this.emptyMessage) {
                        this.show();
                        this.suggestionsUpdated = true;
                    }
                    else {
                        this.hide();
                    }
                }
                this.loading = false;
            }
        };
        AutoComplete.prototype.ngAfterContentInit = function () {
            var _this = this;
            this.templates.forEach(function (item) {
                switch (item.getType()) {
                    case 'item':
                        _this.itemTemplate = item.template;
                        break;
                    case 'selectedItem':
                        _this.selectedItemTemplate = item.template;
                        break;
                    default:
                        _this.itemTemplate = item.template;
                        break;
                }
            });
        };
        AutoComplete.prototype.writeValue = function (value) {
            this.value = value;
            this.filled = this.value && this.value != '';
            this.updateInputField();
        };
        AutoComplete.prototype.registerOnChange = function (fn) {
            this.onModelChange = fn;
        };
        AutoComplete.prototype.registerOnTouched = function (fn) {
            this.onModelTouched = fn;
        };
        AutoComplete.prototype.setDisabledState = function (val) {
            this.disabled = val;
        };
        AutoComplete.prototype.onInput = function (event) {
            var _this = this;
            // When an input element with a placeholder is clicked, the onInput event is invoked in IE.
            if (!this.inputKeyDown && dom.DomHandler.isIE()) {
                return;
            }
            if (this.timeout) {
                clearTimeout(this.timeout);
            }
            var value = event.target.value;
            if (!this.multiple && !this.forceSelection) {
                this.onModelChange(value);
            }
            if (value.length === 0 && !this.multiple) {
                this.hide();
                this.onClear.emit(event);
                this.onModelChange(value);
            }
            if (value.length >= this.minLength) {
                this.timeout = setTimeout(function () {
                    _this.search(event, value);
                }, this.delay);
            }
            else {
                this.suggestions = null;
                this.hide();
            }
            this.updateFilledState();
            this.inputKeyDown = false;
        };
        AutoComplete.prototype.onInputClick = function (event) {
            if (this.documentClickListener) {
                this.inputClick = true;
            }
        };
        AutoComplete.prototype.search = function (event, query) {
            //allow empty string but not undefined or null
            if (query === undefined || query === null) {
                return;
            }
            this.loading = true;
            this.completeMethod.emit({
                originalEvent: event,
                query: query
            });
        };
        AutoComplete.prototype.selectItem = function (option, focus) {
            if (focus === void 0) { focus = true; }
            if (this.forceSelectionUpdateModelTimeout) {
                clearTimeout(this.forceSelectionUpdateModelTimeout);
                this.forceSelectionUpdateModelTimeout = null;
            }
            if (this.multiple) {
                this.multiInputEL.nativeElement.value = '';
                this.value = this.value || [];
                if (!this.isSelected(option) || !this.unique) {
                    this.value = __spread(this.value, [option]);
                    this.onModelChange(this.value);
                }
            }
            else {
                this.inputEL.nativeElement.value = this.field ? utils.ObjectUtils.resolveFieldData(option, this.field) || '' : option;
                this.value = option;
                this.onModelChange(this.value);
            }
            this.onSelect.emit(option);
            this.updateFilledState();
            if (focus) {
                this.itemClicked = true;
                this.focusInput();
            }
        };
        AutoComplete.prototype.show = function () {
            if (this.multiInputEL || this.inputEL) {
                var hasFocus = this.multiple ? document.activeElement == this.multiInputEL.nativeElement : document.activeElement == this.inputEL.nativeElement;
                if (!this.overlayVisible && hasFocus) {
                    this.overlayVisible = true;
                }
            }
        };
        AutoComplete.prototype.onOverlayAnimationStart = function (event) {
            switch (event.toState) {
                case 'visible':
                    this.overlay = event.element;
                    this.appendOverlay();
                    if (this.autoZIndex) {
                        this.overlay.style.zIndex = String(this.baseZIndex + (++dom.DomHandler.zindex));
                    }
                    this.alignOverlay();
                    this.bindDocumentClickListener();
                    this.bindDocumentResizeListener();
                    this.onShow.emit(event);
                    break;
                case 'void':
                    this.onOverlayHide();
                    break;
            }
        };
        AutoComplete.prototype.onOverlayAnimationDone = function (event) {
            if (event.toState === 'void') {
                this._suggestions = null;
            }
        };
        AutoComplete.prototype.appendOverlay = function () {
            if (this.appendTo) {
                if (this.appendTo === 'body')
                    document.body.appendChild(this.overlay);
                else
                    dom.DomHandler.appendChild(this.overlay, this.appendTo);
                if (!this.overlay.style.minWidth) {
                    this.overlay.style.minWidth = dom.DomHandler.getWidth(this.el.nativeElement.children[0]) + 'px';
                }
            }
        };
        AutoComplete.prototype.resolveFieldData = function (value) {
            return this.field ? utils.ObjectUtils.resolveFieldData(value, this.field) : value;
        };
        AutoComplete.prototype.restoreOverlayAppend = function () {
            if (this.overlay && this.appendTo) {
                this.el.nativeElement.appendChild(this.overlay);
            }
        };
        AutoComplete.prototype.alignOverlay = function () {
            if (this.appendTo)
                dom.DomHandler.absolutePosition(this.overlay, (this.multiple ? this.multiContainerEL.nativeElement : this.inputEL.nativeElement));
            else
                dom.DomHandler.relativePosition(this.overlay, (this.multiple ? this.multiContainerEL.nativeElement : this.inputEL.nativeElement));
        };
        AutoComplete.prototype.hide = function () {
            this.overlayVisible = false;
            this.cd.markForCheck();
        };
        AutoComplete.prototype.handleDropdownClick = function (event) {
            if (!this.overlayVisible) {
                this.focusInput();
                var queryValue = this.multiple ? this.multiInputEL.nativeElement.value : this.inputEL.nativeElement.value;
                if (this.dropdownMode === 'blank')
                    this.search(event, '');
                else if (this.dropdownMode === 'current')
                    this.search(event, queryValue);
                this.onDropdownClick.emit({
                    originalEvent: event,
                    query: queryValue
                });
            }
            else {
                this.hide();
            }
        };
        AutoComplete.prototype.focusInput = function () {
            if (this.multiple)
                this.multiInputEL.nativeElement.focus();
            else
                this.inputEL.nativeElement.focus();
        };
        AutoComplete.prototype.removeItem = function (item) {
            var itemIndex = dom.DomHandler.index(item);
            var removedValue = this.value[itemIndex];
            this.value = this.value.filter(function (val, i) { return i != itemIndex; });
            this.onModelChange(this.value);
            this.updateFilledState();
            this.onUnselect.emit(removedValue);
        };
        AutoComplete.prototype.onKeydown = function (event) {
            if (this.overlayVisible) {
                var highlightItemIndex = this.findOptionIndex(this.highlightOption);
                switch (event.which) {
                    //down
                    case 40:
                        if (highlightItemIndex != -1) {
                            var nextItemIndex = highlightItemIndex + 1;
                            if (nextItemIndex != (this.suggestions.length)) {
                                this.highlightOption = this.suggestions[nextItemIndex];
                                this.highlightOptionChanged = true;
                            }
                        }
                        else {
                            this.highlightOption = this.suggestions[0];
                        }
                        event.preventDefault();
                        break;
                    //up
                    case 38:
                        if (highlightItemIndex > 0) {
                            var prevItemIndex = highlightItemIndex - 1;
                            this.highlightOption = this.suggestions[prevItemIndex];
                            this.highlightOptionChanged = true;
                        }
                        event.preventDefault();
                        break;
                    //enter
                    case 13:
                        if (this.highlightOption) {
                            this.selectItem(this.highlightOption);
                            this.hide();
                        }
                        event.preventDefault();
                        break;
                    //escape
                    case 27:
                        this.hide();
                        event.preventDefault();
                        break;
                    //tab
                    case 9:
                        if (this.highlightOption) {
                            this.selectItem(this.highlightOption);
                        }
                        this.hide();
                        break;
                }
            }
            else {
                if (event.which === 40 && this.suggestions) {
                    this.search(event, event.target.value);
                }
            }
            if (this.multiple) {
                switch (event.which) {
                    //backspace
                    case 8:
                        if (this.value && this.value.length && !this.multiInputEL.nativeElement.value) {
                            this.value = __spread(this.value);
                            var removedValue = this.value.pop();
                            this.onModelChange(this.value);
                            this.updateFilledState();
                            this.onUnselect.emit(removedValue);
                        }
                        break;
                }
            }
            this.inputKeyDown = true;
        };
        AutoComplete.prototype.onKeyup = function (event) {
            this.onKeyUp.emit(event);
        };
        AutoComplete.prototype.onInputFocus = function (event) {
            if (!this.itemClicked && this.completeOnFocus) {
                var queryValue = this.multiple ? this.multiInputEL.nativeElement.value : this.inputEL.nativeElement.value;
                this.search(event, queryValue);
            }
            this.focus = true;
            this.onFocus.emit(event);
            this.itemClicked = false;
        };
        AutoComplete.prototype.onInputBlur = function (event) {
            this.focus = false;
            this.onModelTouched();
            this.onBlur.emit(event);
        };
        AutoComplete.prototype.onInputChange = function (event) {
            var e_1, _a;
            var _this = this;
            if (this.forceSelection) {
                var valid = false;
                var inputValue = event.target.value.trim();
                if (this.suggestions) {
                    var _loop_1 = function (suggestion) {
                        var itemValue = this_1.field ? utils.ObjectUtils.resolveFieldData(suggestion, this_1.field) : suggestion;
                        if (itemValue && inputValue === itemValue.trim()) {
                            valid = true;
                            this_1.forceSelectionUpdateModelTimeout = setTimeout(function () {
                                _this.selectItem(suggestion, false);
                            }, 250);
                            return "break";
                        }
                    };
                    var this_1 = this;
                    try {
                        for (var _b = __values(this.suggestions), _c = _b.next(); !_c.done; _c = _b.next()) {
                            var suggestion = _c.value;
                            var state_1 = _loop_1(suggestion);
                            if (state_1 === "break")
                                break;
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                }
                if (!valid) {
                    if (this.multiple) {
                        this.multiInputEL.nativeElement.value = '';
                    }
                    else {
                        this.value = null;
                        this.inputEL.nativeElement.value = '';
                    }
                    this.onClear.emit(event);
                    this.onModelChange(this.value);
                }
            }
        };
        AutoComplete.prototype.onInputPaste = function (event) {
            this.onKeydown(event);
        };
        AutoComplete.prototype.isSelected = function (val) {
            var selected = false;
            if (this.value && this.value.length) {
                for (var i = 0; i < this.value.length; i++) {
                    if (utils.ObjectUtils.equals(this.value[i], val, this.dataKey)) {
                        selected = true;
                        break;
                    }
                }
            }
            return selected;
        };
        AutoComplete.prototype.findOptionIndex = function (option) {
            var index = -1;
            if (this.suggestions) {
                for (var i = 0; i < this.suggestions.length; i++) {
                    if (utils.ObjectUtils.equals(option, this.suggestions[i])) {
                        index = i;
                        break;
                    }
                }
            }
            return index;
        };
        AutoComplete.prototype.updateFilledState = function () {
            if (this.multiple)
                this.filled = (this.value && this.value.length) || (this.multiInputEL && this.multiInputEL.nativeElement && this.multiInputEL.nativeElement.value != '');
            else
                this.filled = (this.inputFieldValue && this.inputFieldValue != '') || (this.inputEL && this.inputEL.nativeElement && this.inputEL.nativeElement.value != '');
            ;
        };
        AutoComplete.prototype.updateInputField = function () {
            var formattedValue = this.value ? (this.field ? utils.ObjectUtils.resolveFieldData(this.value, this.field) || '' : this.value) : '';
            this.inputFieldValue = formattedValue;
            if (this.inputEL && this.inputEL.nativeElement) {
                this.inputEL.nativeElement.value = formattedValue;
            }
            this.updateFilledState();
        };
        AutoComplete.prototype.bindDocumentClickListener = function () {
            var _this = this;
            if (!this.documentClickListener) {
                this.documentClickListener = this.renderer.listen('document', 'click', function (event) {
                    if (event.which === 3) {
                        return;
                    }
                    if (!_this.inputClick && !_this.isDropdownClick(event)) {
                        _this.hide();
                    }
                    _this.inputClick = false;
                    _this.cd.markForCheck();
                });
            }
        };
        AutoComplete.prototype.isDropdownClick = function (event) {
            if (this.dropdown) {
                var target = event.target;
                return (target === this.dropdownButton.nativeElement || target.parentNode === this.dropdownButton.nativeElement);
            }
            else {
                return false;
            }
        };
        AutoComplete.prototype.unbindDocumentClickListener = function () {
            if (this.documentClickListener) {
                this.documentClickListener();
                this.documentClickListener = null;
            }
        };
        AutoComplete.prototype.bindDocumentResizeListener = function () {
            this.documentResizeListener = this.onWindowResize.bind(this);
            window.addEventListener('resize', this.documentResizeListener);
        };
        AutoComplete.prototype.unbindDocumentResizeListener = function () {
            if (this.documentResizeListener) {
                window.removeEventListener('resize', this.documentResizeListener);
                this.documentResizeListener = null;
            }
        };
        AutoComplete.prototype.onWindowResize = function () {
            this.hide();
        };
        AutoComplete.prototype.onOverlayHide = function () {
            this.unbindDocumentClickListener();
            this.unbindDocumentResizeListener();
            this.overlay = null;
            this.onHide.emit();
        };
        AutoComplete.prototype.ngOnDestroy = function () {
            if (this.forceSelectionUpdateModelTimeout) {
                clearTimeout(this.forceSelectionUpdateModelTimeout);
                this.forceSelectionUpdateModelTimeout = null;
            }
            this.restoreOverlayAppend();
            this.onOverlayHide();
        };
        AutoComplete.ctorParameters = function () { return [
            { type: core.ElementRef },
            { type: core.Renderer2 },
            { type: core.ChangeDetectorRef },
            { type: core.IterableDiffers }
        ]; };
        AutoComplete.decorators = [
            { type: core.Component, args: [{
                        selector: 'p-autoComplete',
                        template: "\n        <span [ngClass]=\"{'p-autocomplete p-component':true,'p-autocomplete-dd':dropdown,'p-autocomplete-multiple':multiple}\" [ngStyle]=\"style\" [class]=\"styleClass\">\n            <input *ngIf=\"!multiple\" #in [attr.type]=\"type\" [attr.id]=\"inputId\" [ngStyle]=\"inputStyle\" [class]=\"inputStyleClass\" [autocomplete]=\"autocomplete\" [attr.required]=\"required\" [attr.name]=\"name\"\n            class=\"p-autocomplete-input p-inputtext p-component\" [ngClass]=\"{'p-autocomplete-dd-input':dropdown,'p-disabled': disabled}\" [value]=\"inputFieldValue\" aria-autocomplete=\"list\" [attr.aria-controls]=\"listId\" role=\"searchbox\" [attr.aria-expanded]=\"overlayVisible\" aria-haspopup=\"true\" [attr.aria-activedescendant]=\"'p-highlighted-option'\"\n            (click)=\"onInputClick($event)\" (input)=\"onInput($event)\" (keydown)=\"onKeydown($event)\" (keyup)=\"onKeyup($event)\" [attr.autofocus]=\"autofocus\" (focus)=\"onInputFocus($event)\" (blur)=\"onInputBlur($event)\" (change)=\"onInputChange($event)\" (paste)=\"onInputPaste($event)\"\n            [attr.placeholder]=\"placeholder\" [attr.size]=\"size\" [attr.maxlength]=\"maxlength\" [attr.tabindex]=\"tabindex\" [readonly]=\"readonly\" [disabled]=\"disabled\" [attr.aria-label]=\"ariaLabel\" [attr.aria-labelledby]=\"ariaLabelledBy\" [attr.aria-required]=\"required\"\n            ><ul *ngIf=\"multiple\" #multiContainer class=\"p-autocomplete-multiple-container p-component p-inputtext\" [ngClass]=\"{'p-disabled':disabled,'p-focus':focus}\" (click)=\"multiIn.focus()\">\n                <li #token *ngFor=\"let val of value\" class=\"p-autocomplete-token\">\n                    <ng-container *ngTemplateOutlet=\"selectedItemTemplate; context: {$implicit: val}\"></ng-container>\n                    <span *ngIf=\"!selectedItemTemplate\" class=\"p-autocomplete-token-label\">{{resolveFieldData(val)}}</span>\n                    <span class=\"p-autocomplete-token-icon pi pi-times-circle\" (click)=\"removeItem(token)\" *ngIf=\"!disabled\"></span>\n                </li>\n                <li class=\"p-autocomplete-input-token\">\n                    <input #multiIn [attr.type]=\"type\" [attr.id]=\"inputId\" [disabled]=\"disabled\" [attr.placeholder]=\"(value&&value.length ? null : placeholder)\" [attr.tabindex]=\"tabindex\" [attr.maxlength]=\"maxlength\" (input)=\"onInput($event)\"  (click)=\"onInputClick($event)\"\n                            (keydown)=\"onKeydown($event)\" [readonly]=\"readonly\" (keyup)=\"onKeyup($event)\" [attr.autofocus]=\"autofocus\" (focus)=\"onInputFocus($event)\" (blur)=\"onInputBlur($event)\" (change)=\"onInputChange($event)\" (paste)=\"onInputPaste($event)\" [autocomplete]=\"autocomplete\"\n                            [ngStyle]=\"inputStyle\" [class]=\"inputStyleClass\" [attr.aria-label]=\"ariaLabel\" [attr.aria-labelledby]=\"ariaLabelledBy\" [attr.aria-required]=\"required\"\n                            aria-autocomplete=\"list\" [attr.aria-controls]=\"listId\" role=\"searchbox\" [attr.aria-expanded]=\"overlayVisible\" aria-haspopup=\"true\" [attr.aria-activedescendant]=\"'p-highlighted-option'\">\n                </li>\n            </ul>\n            <i *ngIf=\"loading\" class=\"p-autocomplete-loader pi pi-spinner pi-spin\"></i><button #ddBtn type=\"button\" pButton [icon]=\"dropdownIcon\" class=\"p-autocomplete-dropdown\" [disabled]=\"disabled\" pRipple\n                (click)=\"handleDropdownClick($event)\" *ngIf=\"dropdown\" [attr.tabindex]=\"tabindex\"></button>\n            <div #panel *ngIf=\"overlayVisible\" [ngClass]=\"['p-autocomplete-panel p-component']\" [style.max-height]=\"scrollHeight\" [ngStyle]=\"panelStyle\" [class]=\"panelStyleClass\"\n                [@overlayAnimation]=\"{value: 'visible', params: {showTransitionParams: showTransitionOptions, hideTransitionParams: hideTransitionOptions}}\" (@overlayAnimation.start)=\"onOverlayAnimationStart($event)\" (@overlayAnimation.done)=\"onOverlayAnimationDone($event)\" >\n                <ul role=\"listbox\" [attr.id]=\"listId\" class=\"p-autocomplete-items\">\n                    <li role=\"option\" *ngFor=\"let option of suggestions; let idx = index\" class=\"p-autocomplete-item\" pRipple [ngClass]=\"{'p-highlight': (option === highlightOption)}\" [id]=\"highlightOption == option ? 'p-highlighted-option':''\" (click)=\"selectItem(option)\">\n                        <span *ngIf=\"!itemTemplate\">{{resolveFieldData(option)}}</span>\n                        <ng-container *ngTemplateOutlet=\"itemTemplate; context: {$implicit: option, index: idx}\"></ng-container>\n                    </li>\n                    <li *ngIf=\"noResults && emptyMessage\" class=\"p-autocomplete-emptymessage p-autocomplete-item\">{{emptyMessage}}</li>\n                </ul>\n            </div>\n        </span>\n    ",
                        animations: [
                            animations.trigger('overlayAnimation', [
                                animations.transition(':enter', [
                                    animations.style({ opacity: 0, transform: 'scaleY(0.8)' }),
                                    animations.animate('{{showTransitionParams}}')
                                ]),
                                animations.transition(':leave', [
                                    animations.animate('{{hideTransitionParams}}', animations.style({ opacity: 0 }))
                                ])
                            ])
                        ],
                        host: {
                            '[class.p-inputwrapper-filled]': 'filled',
                            '[class.p-inputwrapper-focus]': 'focus && !disabled'
                        },
                        providers: [AUTOCOMPLETE_VALUE_ACCESSOR],
                        changeDetection: core.ChangeDetectionStrategy.OnPush,
                        encapsulation: core.ViewEncapsulation.None,
                        styles: [".p-autocomplete{display:-ms-inline-flexbox;display:inline-flex;position:relative}.p-autocomplete-loader{position:absolute;top:50%;margin-top:-.5rem}.p-autocomplete-dd .p-autocomplete-input{-ms-flex:1 1 auto;flex:1 1 auto;width:1%}.p-autocomplete-dd .p-autocomplete-input,.p-autocomplete-dd .p-autocomplete-multiple-container{border-top-right-radius:0;border-bottom-right-radius:0}.p-autocomplete-dd .p-autocomplete-dropdown{border-top-left-radius:0;border-bottom-left-radius:0}.p-autocomplete .p-autocomplete-panel{min-width:100%}.p-autocomplete-panel{position:absolute;overflow:auto}.p-autocomplete-items{margin:0;padding:0;list-style-type:none}.p-autocomplete-item{cursor:pointer;white-space:nowrap;position:relative;overflow:hidden}.p-autocomplete-multiple-container{margin:0;padding:0;list-style-type:none;cursor:text;overflow:hidden;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center}.p-autocomplete-token{cursor:default;display:-ms-inline-flexbox;display:inline-flex;-ms-flex-align:center;align-items:center;-ms-flex:0 0 auto;flex:0 0 auto}.p-autocomplete-token-icon{cursor:pointer}.p-autocomplete-input-token{-ms-flex:1 1 auto;flex:1 1 auto;display:-ms-inline-flexbox;display:inline-flex}.p-autocomplete-input-token input{border:0;outline:0;background-color:transparent;margin:0;padding:0;box-shadow:none;border-radius:0;width:100%}.p-fluid .p-autocomplete{display:-ms-flexbox;display:flex}.p-fluid .p-autocomplete-dd .p-autocomplete-input{width:1%}"]
                    },] }
        ];
        AutoComplete.ctorParameters = function () { return [
            { type: core.ElementRef },
            { type: core.Renderer2 },
            { type: core.ChangeDetectorRef },
            { type: core.IterableDiffers }
        ]; };
        AutoComplete.propDecorators = {
            minLength: [{ type: core.Input }],
            delay: [{ type: core.Input }],
            style: [{ type: core.Input }],
            panelStyle: [{ type: core.Input }],
            styleClass: [{ type: core.Input }],
            panelStyleClass: [{ type: core.Input }],
            inputStyle: [{ type: core.Input }],
            inputId: [{ type: core.Input }],
            inputStyleClass: [{ type: core.Input }],
            placeholder: [{ type: core.Input }],
            readonly: [{ type: core.Input }],
            disabled: [{ type: core.Input }],
            maxlength: [{ type: core.Input }],
            name: [{ type: core.Input }],
            required: [{ type: core.Input }],
            size: [{ type: core.Input }],
            appendTo: [{ type: core.Input }],
            autoHighlight: [{ type: core.Input }],
            forceSelection: [{ type: core.Input }],
            type: [{ type: core.Input }],
            autoZIndex: [{ type: core.Input }],
            baseZIndex: [{ type: core.Input }],
            ariaLabel: [{ type: core.Input }],
            ariaLabelledBy: [{ type: core.Input }],
            dropdownIcon: [{ type: core.Input }],
            unique: [{ type: core.Input }],
            completeOnFocus: [{ type: core.Input }],
            completeMethod: [{ type: core.Output }],
            onSelect: [{ type: core.Output }],
            onUnselect: [{ type: core.Output }],
            onFocus: [{ type: core.Output }],
            onBlur: [{ type: core.Output }],
            onDropdownClick: [{ type: core.Output }],
            onClear: [{ type: core.Output }],
            onKeyUp: [{ type: core.Output }],
            onShow: [{ type: core.Output }],
            onHide: [{ type: core.Output }],
            field: [{ type: core.Input }],
            scrollHeight: [{ type: core.Input }],
            dropdown: [{ type: core.Input }],
            dropdownMode: [{ type: core.Input }],
            multiple: [{ type: core.Input }],
            tabindex: [{ type: core.Input }],
            dataKey: [{ type: core.Input }],
            emptyMessage: [{ type: core.Input }],
            showTransitionOptions: [{ type: core.Input }],
            hideTransitionOptions: [{ type: core.Input }],
            autofocus: [{ type: core.Input }],
            autocomplete: [{ type: core.Input }],
            inputEL: [{ type: core.ViewChild, args: ['in',] }],
            multiInputEL: [{ type: core.ViewChild, args: ['multiIn',] }],
            multiContainerEL: [{ type: core.ViewChild, args: ['multiContainer',] }],
            dropdownButton: [{ type: core.ViewChild, args: ['ddBtn',] }],
            templates: [{ type: core.ContentChildren, args: [api.PrimeTemplate,] }],
            suggestions: [{ type: core.Input }]
        };
        return AutoComplete;
    }());
    var AutoCompleteModule = /** @class */ (function () {
        function AutoCompleteModule() {
        }
        AutoCompleteModule.decorators = [
            { type: core.NgModule, args: [{
                        imports: [common.CommonModule, inputtext.InputTextModule, button.ButtonModule, api.SharedModule, ripple.RippleModule],
                        exports: [AutoComplete, api.SharedModule],
                        declarations: [AutoComplete]
                    },] }
        ];
        return AutoCompleteModule;
    }());

    exports.AUTOCOMPLETE_VALUE_ACCESSOR = AUTOCOMPLETE_VALUE_ACCESSOR;
    exports.AutoComplete = AutoComplete;
    exports.AutoCompleteModule = AutoCompleteModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=primeng-autocomplete.umd.js.map
