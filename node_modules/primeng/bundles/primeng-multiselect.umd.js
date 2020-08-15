(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/animations'), require('@angular/common'), require('primeng/dom'), require('primeng/utils'), require('primeng/api'), require('@angular/forms'), require('@angular/cdk/scrolling'), require('primeng/tooltip'), require('primeng/ripple')) :
    typeof define === 'function' && define.amd ? define('primeng/multiselect', ['exports', '@angular/core', '@angular/animations', '@angular/common', 'primeng/dom', 'primeng/utils', 'primeng/api', '@angular/forms', '@angular/cdk/scrolling', 'primeng/tooltip', 'primeng/ripple'], factory) :
    (global = global || self, factory((global.primeng = global.primeng || {}, global.primeng.multiselect = {}), global.ng.core, global.ng.animations, global.ng.common, global.primeng.dom, global.primeng.utils, global.primeng.api, global.ng.forms, global.ng.cdk.scrolling, global.primeng.tooltip, global.primeng.ripple));
}(this, (function (exports, core, animations, common, dom, utils, api, forms, scrolling, tooltip, ripple) { 'use strict';

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
    var MULTISELECT_VALUE_ACCESSOR = {
        provide: forms.NG_VALUE_ACCESSOR,
        useExisting: core.forwardRef(function () { return MultiSelect; }),
        multi: true
    };
    var MultiSelectItem = /** @class */ (function () {
        function MultiSelectItem() {
            this.onClick = new core.EventEmitter();
            this.onKeydown = new core.EventEmitter();
        }
        MultiSelectItem.prototype.onOptionClick = function (event) {
            this.onClick.emit({
                originalEvent: event,
                option: this.option
            });
        };
        MultiSelectItem.prototype.onOptionKeydown = function (event) {
            this.onKeydown.emit({
                originalEvent: event,
                option: this.option
            });
        };
        MultiSelectItem.decorators = [
            { type: core.Component, args: [{
                        selector: 'p-multiSelectItem',
                        template: "\n        <li class=\"p-multiselect-item\" (click)=\"onOptionClick($event)\" (keydown)=\"onOptionKeydown($event)\" [attr.aria-label]=\"option.label\"\n            [attr.tabindex]=\"option.disabled ? null : '0'\" [ngStyle]=\"{'height': itemSize + 'px'}\"\n            [ngClass]=\"{'p-highlight': selected, 'p-disabled': (option.disabled || (maxSelectionLimitReached && !selected))}\">\n            <div class=\"p-checkbox p-component\">\n                <div class=\"p-checkbox-box\" [ngClass]=\"{'p-highlight': selected}\">\n                    <span class=\"p-checkbox-icon\" [ngClass]=\"{'pi pi-check': selected}\"></span>\n                </div>\n            </div>\n            <span *ngIf=\"!template\">{{option.label}}</span>\n            <ng-container *ngTemplateOutlet=\"template; context: {$implicit: option}\"></ng-container>\n        </li>\n    ",
                        encapsulation: core.ViewEncapsulation.None
                    },] }
        ];
        MultiSelectItem.propDecorators = {
            option: [{ type: core.Input }],
            selected: [{ type: core.Input }],
            disabled: [{ type: core.Input }],
            visible: [{ type: core.Input }],
            itemSize: [{ type: core.Input }],
            template: [{ type: core.Input }],
            maxSelectionLimitReached: [{ type: core.Input }],
            onClick: [{ type: core.Output }],
            onKeydown: [{ type: core.Output }]
        };
        return MultiSelectItem;
    }());
    var MultiSelect = /** @class */ (function () {
        function MultiSelect(el, renderer, cd) {
            this.el = el;
            this.renderer = renderer;
            this.cd = cd;
            this.scrollHeight = '200px';
            this.filter = true;
            this.displaySelectedLabel = true;
            this.maxSelectedLabels = 3;
            this.selectedItemsLabel = '{0} items selected';
            this.showToggleAll = true;
            this.emptyFilterMessage = 'No results found';
            this.resetFilterOnHide = false;
            this.dropdownIcon = 'pi pi-chevron-down';
            this.showHeader = true;
            this.autoZIndex = true;
            this.baseZIndex = 0;
            this.filterBy = 'label';
            this.showTransitionOptions = '.12s cubic-bezier(0, 0, 0.2, 1)';
            this.hideTransitionOptions = '.1s linear';
            this.filterMatchMode = "contains";
            this.tooltip = '';
            this.tooltipPosition = 'right';
            this.tooltipPositionStyle = 'absolute';
            this.autofocusFilter = true;
            this.onChange = new core.EventEmitter();
            this.onFocus = new core.EventEmitter();
            this.onBlur = new core.EventEmitter();
            this.onClick = new core.EventEmitter();
            this.onPanelShow = new core.EventEmitter();
            this.onPanelHide = new core.EventEmitter();
            this.onModelChange = function () { };
            this.onModelTouched = function () { };
            this.disabledSelectedOptions = [];
        }
        Object.defineProperty(MultiSelect.prototype, "defaultLabel", {
            get: function () {
                return this._defaultLabel;
            },
            set: function (val) {
                this._defaultLabel = val;
                this.updateLabel();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MultiSelect.prototype, "placeholder", {
            get: function () {
                return this._placeholder;
            },
            set: function (val) {
                this._placeholder = val;
                this.updateLabel();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MultiSelect.prototype, "options", {
            get: function () {
                return this._options;
            },
            set: function (val) {
                var opts = this.optionLabel ? utils.ObjectUtils.generateSelectItems(val, this.optionLabel) : val;
                this.visibleOptions = opts;
                this._options = opts;
                this.updateLabel();
                if (this.filterValue && this.filterValue.length) {
                    this.activateFilter();
                }
            },
            enumerable: false,
            configurable: true
        });
        MultiSelect.prototype.ngOnInit = function () {
            this.updateLabel();
        };
        MultiSelect.prototype.ngAfterContentInit = function () {
            var _this = this;
            this.templates.forEach(function (item) {
                switch (item.getType()) {
                    case 'item':
                        _this.itemTemplate = item.template;
                        break;
                    case 'selectedItems':
                        _this.selectedItemsTemplate = item.template;
                        break;
                    case 'header':
                        _this.headerTemplate = item.template;
                        break;
                    case 'footer':
                        _this.footerTemplate = item.template;
                        break;
                    default:
                        _this.itemTemplate = item.template;
                        break;
                }
            });
        };
        MultiSelect.prototype.ngAfterViewInit = function () {
            if (this.overlayVisible) {
                this.show();
            }
        };
        MultiSelect.prototype.ngAfterViewChecked = function () {
            if (this.filtered) {
                this.alignOverlay();
                this.filtered = false;
            }
        };
        MultiSelect.prototype.writeValue = function (value) {
            this.value = value;
            this.updateLabel();
            this.updateFilledState();
            this.setDisabledSelectedOptions();
            this.checkSelectionLimit();
            this.cd.markForCheck();
        };
        MultiSelect.prototype.checkSelectionLimit = function () {
            if (this.selectionLimit && (this.value && this.value.length === this.selectionLimit)) {
                this.maxSelectionLimitReached = true;
            }
            else {
                this.maxSelectionLimitReached = false;
            }
        };
        MultiSelect.prototype.updateFilledState = function () {
            this.filled = (this.value && this.value.length > 0);
        };
        MultiSelect.prototype.registerOnChange = function (fn) {
            this.onModelChange = fn;
        };
        MultiSelect.prototype.registerOnTouched = function (fn) {
            this.onModelTouched = fn;
        };
        MultiSelect.prototype.setDisabledState = function (val) {
            this.disabled = val;
        };
        MultiSelect.prototype.onOptionClick = function (event) {
            var option = event.option;
            if (option.disabled) {
                return;
            }
            var optionValue = option.value;
            var selectionIndex = this.findSelectionIndex(optionValue);
            if (selectionIndex != -1) {
                this.value = this.value.filter(function (val, i) { return i != selectionIndex; });
                if (this.selectionLimit) {
                    this.maxSelectionLimitReached = false;
                }
            }
            else {
                if (!this.selectionLimit || (!this.value || this.value.length < this.selectionLimit)) {
                    this.value = __spread(this.value || [], [optionValue]);
                }
                this.checkSelectionLimit();
            }
            this.onModelChange(this.value);
            this.onChange.emit({ originalEvent: event.originalEvent, value: this.value, itemValue: optionValue });
            this.updateLabel();
            this.updateFilledState();
        };
        MultiSelect.prototype.isSelected = function (value) {
            return this.findSelectionIndex(value) != -1;
        };
        MultiSelect.prototype.findSelectionIndex = function (val) {
            var index = -1;
            if (this.value) {
                for (var i = 0; i < this.value.length; i++) {
                    if (utils.ObjectUtils.equals(this.value[i], val, this.dataKey)) {
                        index = i;
                        break;
                    }
                }
            }
            return index;
        };
        MultiSelect.prototype.toggleAll = function (event) {
            if (this.isAllChecked()) {
                if (this.disabledSelectedOptions && this.disabledSelectedOptions.length > 0) {
                    var value = [];
                    value = __spread(this.disabledSelectedOptions);
                    this.value = value;
                }
                else {
                    this.value = [];
                }
            }
            else {
                var opts = this.getVisibleOptions();
                if (opts) {
                    var value = [];
                    if (this.disabledSelectedOptions && this.disabledSelectedOptions.length > 0) {
                        value = __spread(this.disabledSelectedOptions);
                    }
                    for (var i = 0; i < opts.length; i++) {
                        var option = opts[i];
                        if (!option.disabled) {
                            value.push(opts[i].value);
                        }
                    }
                    this.value = value;
                }
            }
            this.onModelChange(this.value);
            this.onChange.emit({ originalEvent: event, value: this.value });
            this.updateFilledState();
            this.updateLabel();
        };
        MultiSelect.prototype.isAllChecked = function () {
            if (this.filterValue && this.filterValue.trim().length) {
                return this.value && this.visibleOptions && this.visibleOptions.length && this.isAllVisibleOptionsChecked();
            }
            else {
                var optionCount = this.getEnabledOptionCount();
                var disabledSelectedOptionCount = this.disabledSelectedOptions.length;
                return this.value && this.options && (this.value.length > 0 && this.value.length == optionCount + disabledSelectedOptionCount);
            }
        };
        MultiSelect.prototype.isAllVisibleOptionsChecked = function () {
            var e_1, _a;
            if (!this.visibleOptions || this.visibleOptions.length === 0) {
                return false;
            }
            else {
                try {
                    for (var _b = __values(this.visibleOptions), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var option = _c.value;
                        if (!this.isSelected(option.value)) {
                            return false;
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                return true;
            }
        };
        MultiSelect.prototype.getEnabledOptionCount = function () {
            var e_2, _a;
            if (this.options) {
                var count = 0;
                try {
                    for (var _b = __values(this.options), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var opt = _c.value;
                        if (!opt.disabled) {
                            count++;
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                return count;
            }
            else {
                return 0;
            }
        };
        MultiSelect.prototype.setDisabledSelectedOptions = function () {
            var e_3, _a;
            if (this.options) {
                this.disabledSelectedOptions = [];
                if (this.value) {
                    try {
                        for (var _b = __values(this.options), _c = _b.next(); !_c.done; _c = _b.next()) {
                            var opt = _c.value;
                            if (opt.disabled && this.isSelected(opt.value)) {
                                this.disabledSelectedOptions.push(opt.value);
                            }
                        }
                    }
                    catch (e_3_1) { e_3 = { error: e_3_1 }; }
                    finally {
                        try {
                            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                        }
                        finally { if (e_3) throw e_3.error; }
                    }
                }
            }
        };
        MultiSelect.prototype.show = function () {
            if (!this.overlayVisible) {
                this.overlayVisible = true;
            }
        };
        MultiSelect.prototype.onOverlayAnimationStart = function (event) {
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
                    if (this.filterInputChild && this.filterInputChild.nativeElement) {
                        this.preventModelTouched = true;
                        if (this.autofocusFilter) {
                            this.filterInputChild.nativeElement.focus();
                        }
                    }
                    this.onPanelShow.emit();
                    break;
                case 'void':
                    this.onOverlayHide();
                    break;
            }
        };
        MultiSelect.prototype.appendOverlay = function () {
            if (this.appendTo) {
                if (this.appendTo === 'body')
                    document.body.appendChild(this.overlay);
                else
                    dom.DomHandler.appendChild(this.overlay, this.appendTo);
                if (!this.overlay.style.minWidth) {
                    this.overlay.style.minWidth = dom.DomHandler.getWidth(this.containerViewChild.nativeElement) + 'px';
                }
            }
        };
        MultiSelect.prototype.restoreOverlayAppend = function () {
            if (this.overlay && this.appendTo) {
                this.el.nativeElement.appendChild(this.overlay);
            }
        };
        MultiSelect.prototype.alignOverlay = function () {
            if (this.overlay) {
                if (this.appendTo)
                    dom.DomHandler.absolutePosition(this.overlay, this.containerViewChild.nativeElement);
                else
                    dom.DomHandler.relativePosition(this.overlay, this.containerViewChild.nativeElement);
            }
        };
        MultiSelect.prototype.hide = function () {
            this.overlayVisible = false;
            this.unbindDocumentClickListener();
            if (this.resetFilterOnHide) {
                this.filterInputChild.nativeElement.value = '';
                this.onFilter();
            }
            this.onPanelHide.emit();
            this.cd.markForCheck();
        };
        MultiSelect.prototype.close = function (event) {
            this.hide();
            event.preventDefault();
            event.stopPropagation();
        };
        MultiSelect.prototype.onMouseclick = function (event, input) {
            if (this.disabled || this.readonly || event.target.isSameNode(this.accessibleViewChild.nativeElement)) {
                return;
            }
            this.onClick.emit(event);
            if (!this.isOverlayClick(event)) {
                if (this.overlayVisible) {
                    this.hide();
                }
                else {
                    input.focus();
                    this.show();
                }
            }
        };
        MultiSelect.prototype.isOverlayClick = function (event) {
            return (this.overlay && this.overlay.contains(event.target));
        };
        MultiSelect.prototype.isOutsideClicked = function (event) {
            return !(this.el.nativeElement.isSameNode(event.target) || this.el.nativeElement.contains(event.target) || this.isOverlayClick(event));
        };
        MultiSelect.prototype.onInputFocus = function (event) {
            this.focus = true;
            this.onFocus.emit({ originalEvent: event });
        };
        MultiSelect.prototype.onInputBlur = function (event) {
            this.focus = false;
            this.onBlur.emit({ originalEvent: event });
            if (!this.preventModelTouched) {
                this.onModelTouched();
            }
            this.preventModelTouched = false;
        };
        MultiSelect.prototype.onOptionKeydown = function (event) {
            if (this.readonly) {
                return;
            }
            switch (event.originalEvent.which) {
                //down
                case 40:
                    var nextItem = this.findNextItem(event.originalEvent.target.parentElement);
                    if (nextItem) {
                        nextItem.focus();
                    }
                    event.originalEvent.preventDefault();
                    break;
                //up
                case 38:
                    var prevItem = this.findPrevItem(event.originalEvent.target.parentElement);
                    if (prevItem) {
                        prevItem.focus();
                    }
                    event.originalEvent.preventDefault();
                    break;
                //enter
                case 13:
                    this.onOptionClick(event);
                    event.originalEvent.preventDefault();
                    break;
            }
        };
        MultiSelect.prototype.findNextItem = function (item) {
            var nextItem = item.nextElementSibling;
            if (nextItem)
                return dom.DomHandler.hasClass(nextItem.children[0], 'p-disabled') || dom.DomHandler.isHidden(nextItem.children[0]) ? this.findNextItem(nextItem) : nextItem.children[0];
            else
                return null;
        };
        MultiSelect.prototype.findPrevItem = function (item) {
            var prevItem = item.previousElementSibling;
            if (prevItem)
                return dom.DomHandler.hasClass(prevItem.children[0], 'p-disabled') || dom.DomHandler.isHidden(prevItem.children[0]) ? this.findPrevItem(prevItem) : prevItem.children[0];
            else
                return null;
        };
        MultiSelect.prototype.onKeydown = function (event) {
            switch (event.which) {
                //down
                case 40:
                    if (!this.overlayVisible && event.altKey) {
                        this.show();
                        event.preventDefault();
                    }
                    break;
                //space
                case 32:
                    if (!this.overlayVisible) {
                        this.show();
                        event.preventDefault();
                    }
                    break;
                //escape
                case 27:
                    this.hide();
                    break;
            }
        };
        MultiSelect.prototype.updateLabel = function () {
            if (this.value && this.options && this.value.length && this.displaySelectedLabel) {
                var label = '';
                for (var i = 0; i < this.value.length; i++) {
                    var itemLabel = this.findLabelByValue(this.value[i]);
                    if (itemLabel) {
                        if (label.length > 0) {
                            label = label + ', ';
                        }
                        label = label + itemLabel;
                    }
                }
                if (this.value.length <= this.maxSelectedLabels) {
                    this.valuesAsString = label;
                }
                else {
                    var pattern = /{(.*?)}/;
                    if (pattern.test(this.selectedItemsLabel)) {
                        this.valuesAsString = this.selectedItemsLabel.replace(this.selectedItemsLabel.match(pattern)[0], this.value.length + '');
                    }
                    else {
                        this.valuesAsString = this.selectedItemsLabel;
                    }
                }
            }
            else {
                this.valuesAsString = this.placeholder || this.defaultLabel;
            }
        };
        MultiSelect.prototype.findLabelByValue = function (val) {
            var label = null;
            for (var i = 0; i < this.options.length; i++) {
                var option = this.options[i];
                if (val == null && option.value == null || utils.ObjectUtils.equals(val, option.value, this.dataKey)) {
                    label = option.label;
                    break;
                }
            }
            return label;
        };
        MultiSelect.prototype.onFilter = function () {
            var inputValue = this.filterInputChild.nativeElement.value;
            if (inputValue && inputValue.length) {
                this.filterValue = inputValue;
                this.activateFilter();
            }
            else {
                this.filterValue = null;
                this.visibleOptions = this.options;
                this.filtered = false;
            }
        };
        MultiSelect.prototype.activateFilter = function () {
            if (this.options && this.options.length) {
                var searchFields = this.filterBy.split(',');
                this.visibleOptions = utils.FilterUtils.filter(this.options, searchFields, this.filterValue, this.filterMatchMode, this.filterLocale);
                this.filtered = true;
            }
        };
        MultiSelect.prototype.isItemVisible = function (option) {
            if (this.filterValue && this.filterValue.trim().length) {
                for (var i = 0; i < this.visibleOptions.length; i++) {
                    if (this.visibleOptions[i].value == option.value) {
                        return true;
                    }
                }
            }
            else {
                return true;
            }
        };
        MultiSelect.prototype.getVisibleOptions = function () {
            return this.visibleOptions || this.options;
        };
        MultiSelect.prototype.onHeaderCheckboxFocus = function () {
            this.headerCheckboxFocus = true;
        };
        MultiSelect.prototype.onHeaderCheckboxBlur = function () {
            this.headerCheckboxFocus = false;
        };
        MultiSelect.prototype.bindDocumentClickListener = function () {
            var _this = this;
            if (!this.documentClickListener) {
                this.documentClickListener = this.renderer.listen('document', 'click', function (event) {
                    if (_this.isOutsideClicked(event)) {
                        _this.hide();
                    }
                });
            }
        };
        MultiSelect.prototype.unbindDocumentClickListener = function () {
            if (this.documentClickListener) {
                this.documentClickListener();
                this.documentClickListener = null;
            }
        };
        MultiSelect.prototype.bindDocumentResizeListener = function () {
            this.documentResizeListener = this.onWindowResize.bind(this);
            window.addEventListener('resize', this.documentResizeListener);
        };
        MultiSelect.prototype.unbindDocumentResizeListener = function () {
            if (this.documentResizeListener) {
                window.removeEventListener('resize', this.documentResizeListener);
                this.documentResizeListener = null;
            }
        };
        MultiSelect.prototype.onWindowResize = function () {
            if (!dom.DomHandler.isAndroid()) {
                this.hide();
            }
        };
        MultiSelect.prototype.onOverlayHide = function () {
            this.unbindDocumentClickListener();
            this.unbindDocumentResizeListener();
            this.overlay = null;
            this.onModelTouched();
        };
        MultiSelect.prototype.ngOnDestroy = function () {
            this.restoreOverlayAppend();
            this.onOverlayHide();
        };
        MultiSelect.ctorParameters = function () { return [
            { type: core.ElementRef },
            { type: core.Renderer2 },
            { type: core.ChangeDetectorRef }
        ]; };
        MultiSelect.decorators = [
            { type: core.Component, args: [{
                        selector: 'p-multiSelect',
                        template: "\n        <div #container [ngClass]=\"{'p-multiselect p-component':true,'p-multiselect-open':overlayVisible,'p-focus':focus,'p-disabled': disabled}\" [ngStyle]=\"style\" [class]=\"styleClass\"\n            (click)=\"onMouseclick($event,in)\">\n            <div class=\"p-hidden-accessible\">\n                <input #in type=\"text\" readonly=\"readonly\" [attr.id]=\"inputId\" [attr.name]=\"name\" (focus)=\"onInputFocus($event)\" (blur)=\"onInputBlur($event)\"\n                       [disabled]=\"disabled\" [attr.tabindex]=\"tabindex\" (keydown)=\"onKeydown($event)\" aria-haspopup=\"listbox\" [attr.aria-expanded]=\"overlayVisible\"\n                       [attr.aria-labelledby]=\"ariaLabelledBy\" role=\"listbox\">\n            </div>\n            <div class=\"p-multiselect-label-container\" [pTooltip]=\"tooltip\" [tooltipPosition]=\"tooltipPosition\" [positionStyle]=\"tooltipPositionStyle\" [tooltipStyleClass]=\"tooltipStyleClass\">\n                <div class=\"p-multiselect-label\" [ngClass]=\"{'p-placeholder': valuesAsString === (defaultLabel || placeholder), 'p-multiselect-label-empty': ((valuesAsString == null || valuesAsString.length === 0) && (placeholder == null || placeholder.length === 0))}\">\n                    <ng-container *ngIf=\"!selectedItemsTemplate\">{{valuesAsString || 'empty'}}</ng-container>\n                    <ng-container *ngTemplateOutlet=\"selectedItemsTemplate; context: {$implicit: value}\"></ng-container>\n                </div>\n            </div>\n            <div [ngClass]=\"{'p-multiselect-trigger':true}\">\n                <span class=\"p-multiselect-trigger-icon\" [ngClass]=\"dropdownIcon\"></span>\n            </div>\n            <div *ngIf=\"overlayVisible\" [ngClass]=\"['p-multiselect-panel p-component']\" [@overlayAnimation]=\"{value: 'visible', params: {showTransitionParams: showTransitionOptions, hideTransitionParams: hideTransitionOptions}}\" (@overlayAnimation.start)=\"onOverlayAnimationStart($event)\"\n                [ngStyle]=\"panelStyle\" [class]=\"panelStyleClass\" (keydown)=\"onKeydown($event)\">\n                <div class=\"p-multiselect-header\" *ngIf=\"showHeader\">\n                    <ng-content select=\"p-header\"></ng-content>\n                    <ng-container *ngTemplateOutlet=\"headerTemplate\"></ng-container>\n                    <div class=\"p-checkbox p-component\" *ngIf=\"showToggleAll && !selectionLimit\">\n                        <div class=\"p-hidden-accessible\">\n                            <input type=\"checkbox\" readonly=\"readonly\" [checked]=\"isAllChecked()\" (focus)=\"onHeaderCheckboxFocus()\" (blur)=\"onHeaderCheckboxBlur()\" (keydown.space)=\"toggleAll($event)\">\n                        </div>\n                        <div class=\"p-checkbox-box\" role=\"checkbox\" [attr.aria-checked]=\"isAllChecked()\" [ngClass]=\"{'p-highlight':isAllChecked(), 'p-focus': headerCheckboxFocus}\" (click)=\"toggleAll($event)\">\n                            <span class=\"p-checkbox-icon\" [ngClass]=\"{'pi pi-check':isAllChecked()}\"></span>\n                        </div>\n                    </div>\n                    <div class=\"p-multiselect-filter-container\" *ngIf=\"filter\">\n                        <input #filterInput type=\"text\" role=\"textbox\" [value]=\"filterValue||''\" (input)=\"onFilter()\" class=\"p-multiselect-filter p-inputtext p-component\" [attr.placeholder]=\"filterPlaceHolder\" [attr.aria-label]=\"ariaFilterLabel\">\n                        <span class=\"p-multiselect-filter-icon pi pi-search\"></span>\n                    </div>\n                    <button class=\"p-multiselect-close p-link\" type=\"button\" (click)=\"close($event)\" pRipple>\n                        <span class=\"p-multiselect-close-icon pi pi-times\"></span>\n                    </button>\n                </div>\n                <div class=\"p-multiselect-items-wrapper\" [style.max-height]=\"virtualScroll ? 'auto' : (scrollHeight||'auto')\">\n                    <ul class=\"p-multiselect-items p-component\" role=\"listbox\" aria-multiselectable=\"true\">\n                        <ng-container *ngIf=\"!virtualScroll; else virtualScrollList\">\n                            <ng-template ngFor let-option let-i=\"index\" [ngForOf]=\"visibleOptions\">\n                                <p-multiSelectItem [option]=\"option\" [selected]=\"isSelected(option.value)\" (onClick)=\"onOptionClick($event)\" (onKeydown)=\"onOptionKeydown($event)\"\n                                        [maxSelectionLimitReached]=\"maxSelectionLimitReached\" [visible]=\"isItemVisible(option)\" [template]=\"itemTemplate\"></p-multiSelectItem>\n                            </ng-template>\n                        </ng-container>\n                        <ng-template #virtualScrollList>\n                            <cdk-virtual-scroll-viewport #viewport [ngStyle]=\"{'height': scrollHeight}\" [itemSize]=\"itemSize\" *ngIf=\"virtualScroll && visibleOptions && visibleOptions.length\">\n                                <ng-container *cdkVirtualFor=\"let option of visibleOptions; let i = index; let c = count; let f = first; let l = last; let e = even; let o = odd\">\n                                    <p-multiSelectItem [option]=\"option\" [selected]=\"isSelected(option.value)\" (onClick)=\"onOptionClick($event)\" (onKeydown)=\"onOptionKeydown($event)\"\n                                        [maxSelectionLimitReached]=\"maxSelectionLimitReached\" [visible]=\"isItemVisible(option)\" [template]=\"itemTemplate\" [itemSize]=\"itemSize\"></p-multiSelectItem>\n                                </ng-container>\n                            </cdk-virtual-scroll-viewport>\n                        </ng-template>\n                        <li *ngIf=\"filter && visibleOptions && visibleOptions.length === 0\" class=\"p-multiselect-empty-message\">{{emptyFilterMessage}}</li>\n                    </ul>\n                </div>\n                <div class=\"p-multiselect-footer\" *ngIf=\"footerFacet || footerTemplate\">\n                    <ng-content select=\"p-footer\"></ng-content>\n                    <ng-container *ngTemplateOutlet=\"footerTemplate\"></ng-container>\n                </div>\n            </div>\n        </div>\n    ",
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
                            '[class.p-inputwrapper-focus]': 'focus'
                        },
                        providers: [MULTISELECT_VALUE_ACCESSOR],
                        changeDetection: core.ChangeDetectionStrategy.OnPush,
                        encapsulation: core.ViewEncapsulation.None,
                        styles: [".p-multiselect{display:-ms-inline-flexbox;display:inline-flex;cursor:pointer;position:relative;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.p-multiselect-trigger{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;-ms-flex-negative:0;flex-shrink:0}.p-multiselect-label-container{overflow:hidden;-ms-flex:1 1 auto;flex:1 1 auto;cursor:pointer}.p-multiselect-label{display:block;white-space:nowrap;cursor:pointer;overflow:hidden;text-overflow:ellipsis}.p-multiselect-label-empty{overflow:hidden;visibility:hidden}.p-multiselect .p-multiselect-panel{min-width:100%}.p-multiselect-panel{position:absolute}.p-multiselect-items-wrapper{overflow:auto}.p-multiselect-items{margin:0;padding:0;list-style-type:none}.p-multiselect-item{cursor:pointer;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;font-weight:400;white-space:nowrap;position:relative;overflow:hidden}.p-multiselect-header{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:justify;justify-content:space-between}.p-multiselect-filter-container{position:relative;-ms-flex:1 1 auto;flex:1 1 auto}.p-multiselect-filter-icon{position:absolute;top:50%;margin-top:-.5rem}.p-multiselect-filter-container .p-inputtext{width:100%}.p-multiselect-close{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;-ms-flex-negative:0;flex-shrink:0;overflow:hidden;position:relative}.p-fluid .p-multiselect{display:-ms-flexbox;display:flex}"]
                    },] }
        ];
        MultiSelect.ctorParameters = function () { return [
            { type: core.ElementRef },
            { type: core.Renderer2 },
            { type: core.ChangeDetectorRef }
        ]; };
        MultiSelect.propDecorators = {
            scrollHeight: [{ type: core.Input }],
            defaultLabel: [{ type: core.Input }],
            placeholder: [{ type: core.Input }],
            style: [{ type: core.Input }],
            styleClass: [{ type: core.Input }],
            panelStyle: [{ type: core.Input }],
            panelStyleClass: [{ type: core.Input }],
            inputId: [{ type: core.Input }],
            disabled: [{ type: core.Input }],
            readonly: [{ type: core.Input }],
            filter: [{ type: core.Input }],
            filterPlaceHolder: [{ type: core.Input }],
            filterLocale: [{ type: core.Input }],
            overlayVisible: [{ type: core.Input }],
            tabindex: [{ type: core.Input }],
            appendTo: [{ type: core.Input }],
            dataKey: [{ type: core.Input }],
            name: [{ type: core.Input }],
            ariaLabelledBy: [{ type: core.Input }],
            displaySelectedLabel: [{ type: core.Input }],
            maxSelectedLabels: [{ type: core.Input }],
            selectionLimit: [{ type: core.Input }],
            selectedItemsLabel: [{ type: core.Input }],
            showToggleAll: [{ type: core.Input }],
            emptyFilterMessage: [{ type: core.Input }],
            resetFilterOnHide: [{ type: core.Input }],
            dropdownIcon: [{ type: core.Input }],
            optionLabel: [{ type: core.Input }],
            showHeader: [{ type: core.Input }],
            autoZIndex: [{ type: core.Input }],
            baseZIndex: [{ type: core.Input }],
            filterBy: [{ type: core.Input }],
            virtualScroll: [{ type: core.Input }],
            itemSize: [{ type: core.Input }],
            showTransitionOptions: [{ type: core.Input }],
            hideTransitionOptions: [{ type: core.Input }],
            ariaFilterLabel: [{ type: core.Input }],
            filterMatchMode: [{ type: core.Input }],
            tooltip: [{ type: core.Input }],
            tooltipPosition: [{ type: core.Input }],
            tooltipPositionStyle: [{ type: core.Input }],
            tooltipStyleClass: [{ type: core.Input }],
            autofocusFilter: [{ type: core.Input }],
            containerViewChild: [{ type: core.ViewChild, args: ['container',] }],
            filterInputChild: [{ type: core.ViewChild, args: ['filterInput',] }],
            accessibleViewChild: [{ type: core.ViewChild, args: ['in',] }],
            footerFacet: [{ type: core.ContentChild, args: [api.Footer,] }],
            headerFacet: [{ type: core.ContentChild, args: [api.Header,] }],
            templates: [{ type: core.ContentChildren, args: [api.PrimeTemplate,] }],
            onChange: [{ type: core.Output }],
            onFocus: [{ type: core.Output }],
            onBlur: [{ type: core.Output }],
            onClick: [{ type: core.Output }],
            onPanelShow: [{ type: core.Output }],
            onPanelHide: [{ type: core.Output }],
            options: [{ type: core.Input }]
        };
        return MultiSelect;
    }());
    var MultiSelectModule = /** @class */ (function () {
        function MultiSelectModule() {
        }
        MultiSelectModule.decorators = [
            { type: core.NgModule, args: [{
                        imports: [common.CommonModule, api.SharedModule, scrolling.ScrollingModule, tooltip.TooltipModule, ripple.RippleModule],
                        exports: [MultiSelect, api.SharedModule, scrolling.ScrollingModule],
                        declarations: [MultiSelect, MultiSelectItem]
                    },] }
        ];
        return MultiSelectModule;
    }());

    exports.MULTISELECT_VALUE_ACCESSOR = MULTISELECT_VALUE_ACCESSOR;
    exports.MultiSelect = MultiSelect;
    exports.MultiSelectItem = MultiSelectItem;
    exports.MultiSelectModule = MultiSelectModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=primeng-multiselect.umd.js.map
