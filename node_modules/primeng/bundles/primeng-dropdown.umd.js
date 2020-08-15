(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/cdk/scrolling'), require('@angular/core'), require('@angular/animations'), require('@angular/common'), require('primeng/api'), require('primeng/dom'), require('primeng/utils'), require('@angular/forms'), require('primeng/tooltip'), require('primeng/ripple')) :
    typeof define === 'function' && define.amd ? define('primeng/dropdown', ['exports', '@angular/cdk/scrolling', '@angular/core', '@angular/animations', '@angular/common', 'primeng/api', 'primeng/dom', 'primeng/utils', '@angular/forms', 'primeng/tooltip', 'primeng/ripple'], factory) :
    (global = global || self, factory((global.primeng = global.primeng || {}, global.primeng.dropdown = {}), global.ng.cdk.scrolling, global.ng.core, global.ng.animations, global.ng.common, global.primeng.api, global.primeng.dom, global.primeng.utils, global.ng.forms, global.primeng.tooltip, global.primeng.ripple));
}(this, (function (exports, scrolling, core, animations, common, api, dom, utils, forms, tooltip, ripple) { 'use strict';

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
    var DROPDOWN_VALUE_ACCESSOR = {
        provide: forms.NG_VALUE_ACCESSOR,
        useExisting: core.forwardRef(function () { return Dropdown; }),
        multi: true
    };
    var DropdownItem = /** @class */ (function () {
        function DropdownItem() {
            this.onClick = new core.EventEmitter();
        }
        DropdownItem.prototype.onOptionClick = function (event) {
            this.onClick.emit({
                originalEvent: event,
                option: this.option
            });
        };
        DropdownItem.decorators = [
            { type: core.Component, args: [{
                        selector: 'p-dropdownItem',
                        template: "\n        <li (click)=\"onOptionClick($event)\" role=\"option\" pRipple\n            [attr.aria-label]=\"option.label\" [attr.aria-selected]=\"selected\"\n            [ngStyle]=\"{'height': itemSize + 'px'}\"\n            [ngClass]=\"{'p-dropdown-item':true, 'p-highlight': selected, 'p-disabled':(option.disabled)}\">\n            <span *ngIf=\"!template\">{{option.label||'empty'}}</span>\n            <ng-container *ngTemplateOutlet=\"template; context: {$implicit: option}\"></ng-container>\n        </li>\n    "
                    },] }
        ];
        DropdownItem.propDecorators = {
            option: [{ type: core.Input }],
            selected: [{ type: core.Input }],
            disabled: [{ type: core.Input }],
            visible: [{ type: core.Input }],
            itemSize: [{ type: core.Input }],
            template: [{ type: core.Input }],
            onClick: [{ type: core.Output }]
        };
        return DropdownItem;
    }());
    var Dropdown = /** @class */ (function () {
        function Dropdown(el, renderer, cd, zone) {
            this.el = el;
            this.renderer = renderer;
            this.cd = cd;
            this.zone = zone;
            this.scrollHeight = '200px';
            this.filterBy = 'label';
            this.resetFilterOnHide = false;
            this.dropdownIcon = 'pi pi-chevron-down';
            this.autoDisplayFirst = true;
            this.emptyFilterMessage = 'No results found';
            this.autoZIndex = true;
            this.baseZIndex = 0;
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
            this.onShow = new core.EventEmitter();
            this.onHide = new core.EventEmitter();
            this.onModelChange = function () { };
            this.onModelTouched = function () { };
            this.viewPortOffsetTop = 0;
        }
        Object.defineProperty(Dropdown.prototype, "disabled", {
            get: function () {
                return this._disabled;
            },
            set: function (_disabled) {
                if (_disabled)
                    this.focused = false;
                this._disabled = _disabled;
                if (!this.cd.destroyed) {
                    this.cd.detectChanges();
                }
            },
            enumerable: false,
            configurable: true
        });
        ;
        Dropdown.prototype.ngAfterContentInit = function () {
            var _this = this;
            this.templates.forEach(function (item) {
                switch (item.getType()) {
                    case 'item':
                        _this.itemTemplate = item.template;
                        break;
                    case 'selectedItem':
                        _this.selectedItemTemplate = item.template;
                        break;
                    case 'group':
                        _this.groupTemplate = item.template;
                        break;
                    default:
                        _this.itemTemplate = item.template;
                        break;
                }
            });
        };
        Dropdown.prototype.ngOnInit = function () {
            this.optionsToDisplay = this.options;
            this.updateSelectedOption(null);
        };
        Object.defineProperty(Dropdown.prototype, "options", {
            get: function () {
                return this._options;
            },
            set: function (val) {
                var opts = this.optionLabel ? utils.ObjectUtils.generateSelectItems(val, this.optionLabel) : val;
                this._options = opts;
                this.optionsToDisplay = this._options;
                this.updateSelectedOption(this.value);
                this.optionsChanged = true;
                this.updateFilledState();
                if (this.filterValue && this.filterValue.length) {
                    this.activateFilter();
                }
            },
            enumerable: false,
            configurable: true
        });
        Dropdown.prototype.ngAfterViewInit = function () {
            if (this.editable) {
                this.updateEditableLabel();
            }
        };
        Object.defineProperty(Dropdown.prototype, "label", {
            get: function () {
                return (this.selectedOption ? this.selectedOption.label : null);
            },
            enumerable: false,
            configurable: true
        });
        Dropdown.prototype.updateEditableLabel = function () {
            if (this.editableInputViewChild && this.editableInputViewChild.nativeElement) {
                this.editableInputViewChild.nativeElement.value = (this.selectedOption ? this.selectedOption.label : this.value || '');
            }
        };
        Dropdown.prototype.onItemClick = function (event) {
            var _this = this;
            var option = event.option;
            if (!option.disabled) {
                this.selectItem(event, option);
                this.accessibleViewChild.nativeElement.focus();
            }
            setTimeout(function () {
                _this.hide(event);
            }, 150);
        };
        Dropdown.prototype.selectItem = function (event, option) {
            var _this = this;
            if (this.selectedOption != option) {
                this.selectedOption = option;
                this.value = option.value;
                this.filled = true;
                this.onModelChange(this.value);
                this.updateEditableLabel();
                this.onChange.emit({
                    originalEvent: event.originalEvent,
                    value: this.value
                });
                if (this.virtualScroll) {
                    setTimeout(function () {
                        _this.viewPortOffsetTop = _this.viewPort ? _this.viewPort.measureScrollOffset() : 0;
                    }, 1);
                }
            }
        };
        Dropdown.prototype.ngAfterViewChecked = function () {
            var _this = this;
            if (this.optionsChanged && this.overlayVisible) {
                this.optionsChanged = false;
                if (this.virtualScroll) {
                    this.updateVirtualScrollSelectedIndex(true);
                }
                this.zone.runOutsideAngular(function () {
                    setTimeout(function () {
                        _this.alignOverlay();
                    }, 1);
                });
            }
            if (this.selectedOptionUpdated && this.itemsWrapper) {
                if (this.virtualScroll && this.viewPort) {
                    var range = this.viewPort.getRenderedRange();
                    this.updateVirtualScrollSelectedIndex(false);
                    if (range.start > this.virtualScrollSelectedIndex || range.end < this.virtualScrollSelectedIndex) {
                        this.viewPort.scrollToIndex(this.virtualScrollSelectedIndex);
                    }
                }
                var selectedItem = dom.DomHandler.findSingle(this.overlay, 'li.p-highlight');
                if (selectedItem) {
                    dom.DomHandler.scrollInView(this.itemsWrapper, dom.DomHandler.findSingle(this.overlay, 'li.p-highlight'));
                }
                this.selectedOptionUpdated = false;
            }
        };
        Dropdown.prototype.writeValue = function (value) {
            if (this.filter) {
                this.resetFilter();
            }
            this.value = value;
            this.updateSelectedOption(value);
            this.updateEditableLabel();
            this.updateFilledState();
            this.cd.markForCheck();
        };
        Dropdown.prototype.resetFilter = function () {
            this.filterValue = null;
            if (this.filterViewChild && this.filterViewChild.nativeElement) {
                this.filterViewChild.nativeElement.value = '';
            }
            this.optionsToDisplay = this.options;
        };
        Dropdown.prototype.updateSelectedOption = function (val) {
            this.selectedOption = this.findOption(val, this.optionsToDisplay);
            if (this.autoDisplayFirst && !this.placeholder && !this.selectedOption && this.optionsToDisplay && this.optionsToDisplay.length && !this.editable) {
                this.selectedOption = this.optionsToDisplay[0];
            }
            this.selectedOptionUpdated = true;
        };
        Dropdown.prototype.registerOnChange = function (fn) {
            this.onModelChange = fn;
        };
        Dropdown.prototype.registerOnTouched = function (fn) {
            this.onModelTouched = fn;
        };
        Dropdown.prototype.setDisabledState = function (val) {
            this.disabled = val;
        };
        Dropdown.prototype.onMouseclick = function (event) {
            if (this.disabled || this.readonly || this.isInputClick(event)) {
                return;
            }
            this.onClick.emit(event);
            this.accessibleViewChild.nativeElement.focus();
            if (this.overlayVisible)
                this.hide(event);
            else
                this.show();
            this.cd.detectChanges();
        };
        Dropdown.prototype.isInputClick = function (event) {
            return dom.DomHandler.hasClass(event.target, 'p-dropdown-clear-icon') ||
                event.target.isSameNode(this.accessibleViewChild.nativeElement) ||
                (this.editableInputViewChild && event.target.isSameNode(this.editableInputViewChild.nativeElement));
        };
        Dropdown.prototype.isOutsideClicked = function (event) {
            return !(this.el.nativeElement.isSameNode(event.target) || this.el.nativeElement.contains(event.target) || (this.overlay && this.overlay.contains(event.target)));
        };
        Dropdown.prototype.onEditableInputClick = function () {
            this.bindDocumentClickListener();
        };
        Dropdown.prototype.onEditableInputFocus = function (event) {
            this.focused = true;
            this.hide(event);
            this.onFocus.emit(event);
        };
        Dropdown.prototype.onEditableInputChange = function (event) {
            this.value = event.target.value;
            this.updateSelectedOption(this.value);
            this.onModelChange(this.value);
            this.onChange.emit({
                originalEvent: event,
                value: this.value
            });
        };
        Dropdown.prototype.show = function () {
            this.overlayVisible = true;
        };
        Dropdown.prototype.onOverlayAnimationStart = function (event) {
            switch (event.toState) {
                case 'visible':
                    this.overlay = event.element;
                    var itemsWrapperSelector = this.virtualScroll ? '.cdk-virtual-scroll-viewport' : '.p-dropdown-items-wrapper';
                    this.itemsWrapper = dom.DomHandler.findSingle(this.overlay, itemsWrapperSelector);
                    this.appendOverlay();
                    if (this.autoZIndex) {
                        this.overlay.style.zIndex = String(this.baseZIndex + (++dom.DomHandler.zindex));
                    }
                    this.alignOverlay();
                    this.bindDocumentClickListener();
                    this.bindDocumentResizeListener();
                    if (this.options && this.options.length) {
                        if (!this.virtualScroll) {
                            var selectedListItem = dom.DomHandler.findSingle(this.itemsWrapper, '.p-dropdown-item.p-highlight');
                            if (selectedListItem) {
                                dom.DomHandler.scrollInView(this.itemsWrapper, selectedListItem);
                            }
                        }
                    }
                    if (this.filterViewChild && this.filterViewChild.nativeElement) {
                        this.preventModelTouched = true;
                        if (this.autofocusFilter) {
                            this.filterViewChild.nativeElement.focus();
                        }
                    }
                    this.onShow.emit(event);
                    break;
                case 'void':
                    this.onOverlayHide();
                    break;
            }
        };
        Dropdown.prototype.scrollToSelectedVirtualScrollElement = function () {
            if (!this.virtualAutoScrolled) {
                if (this.viewPortOffsetTop) {
                    this.viewPort.scrollToOffset(this.viewPortOffsetTop);
                }
                else if (this.virtualScrollSelectedIndex > -1) {
                    this.viewPort.scrollToIndex(this.virtualScrollSelectedIndex);
                }
            }
            this.virtualAutoScrolled = true;
        };
        Dropdown.prototype.updateVirtualScrollSelectedIndex = function (resetOffset) {
            if (this.selectedOption && this.optionsToDisplay && this.optionsToDisplay.length) {
                if (resetOffset) {
                    this.viewPortOffsetTop = 0;
                }
                this.virtualScrollSelectedIndex = this.findOptionIndex(this.selectedOption.value, this.optionsToDisplay);
            }
        };
        Dropdown.prototype.appendOverlay = function () {
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
        Dropdown.prototype.restoreOverlayAppend = function () {
            if (this.overlay && this.appendTo) {
                this.el.nativeElement.appendChild(this.overlay);
            }
        };
        Dropdown.prototype.hide = function (event) {
            this.overlayVisible = false;
            if (this.filter && this.resetFilterOnHide) {
                this.resetFilter();
            }
            if (this.virtualScroll) {
                this.virtualAutoScrolled = false;
            }
            this.cd.markForCheck();
            this.onHide.emit(event);
        };
        Dropdown.prototype.alignOverlay = function () {
            if (this.overlay) {
                if (this.appendTo)
                    dom.DomHandler.absolutePosition(this.overlay, this.containerViewChild.nativeElement);
                else
                    dom.DomHandler.relativePosition(this.overlay, this.containerViewChild.nativeElement);
            }
        };
        Dropdown.prototype.onInputFocus = function (event) {
            this.focused = true;
            this.onFocus.emit(event);
        };
        Dropdown.prototype.onInputBlur = function (event) {
            this.focused = false;
            this.onBlur.emit(event);
            if (!this.preventModelTouched) {
                this.onModelTouched();
            }
            this.preventModelTouched = false;
        };
        Dropdown.prototype.findPrevEnabledOption = function (index) {
            var prevEnabledOption;
            if (this.optionsToDisplay && this.optionsToDisplay.length) {
                for (var i = (index - 1); 0 <= i; i--) {
                    var option = this.optionsToDisplay[i];
                    if (option.disabled) {
                        continue;
                    }
                    else {
                        prevEnabledOption = option;
                        break;
                    }
                }
                if (!prevEnabledOption) {
                    for (var i = this.optionsToDisplay.length - 1; i >= index; i--) {
                        var option = this.optionsToDisplay[i];
                        if (option.disabled) {
                            continue;
                        }
                        else {
                            prevEnabledOption = option;
                            break;
                        }
                    }
                }
            }
            return prevEnabledOption;
        };
        Dropdown.prototype.findNextEnabledOption = function (index) {
            var nextEnabledOption;
            if (this.optionsToDisplay && this.optionsToDisplay.length) {
                for (var i = (index + 1); index < (this.optionsToDisplay.length - 1); i++) {
                    var option = this.optionsToDisplay[i];
                    if (option.disabled) {
                        continue;
                    }
                    else {
                        nextEnabledOption = option;
                        break;
                    }
                }
                if (!nextEnabledOption) {
                    for (var i = 0; i < index; i++) {
                        var option = this.optionsToDisplay[i];
                        if (option.disabled) {
                            continue;
                        }
                        else {
                            nextEnabledOption = option;
                            break;
                        }
                    }
                }
            }
            return nextEnabledOption;
        };
        Dropdown.prototype.onKeydown = function (event, search) {
            if (this.readonly || !this.optionsToDisplay || this.optionsToDisplay.length === null) {
                return;
            }
            switch (event.which) {
                //down
                case 40:
                    if (!this.overlayVisible && event.altKey) {
                        this.show();
                    }
                    else {
                        if (this.group) {
                            var selectedItemIndex = this.selectedOption ? this.findOptionGroupIndex(this.selectedOption.value, this.optionsToDisplay) : -1;
                            if (selectedItemIndex !== -1) {
                                var nextItemIndex = selectedItemIndex.itemIndex + 1;
                                if (nextItemIndex < (this.optionsToDisplay[selectedItemIndex.groupIndex].items.length)) {
                                    this.selectItem(event, this.optionsToDisplay[selectedItemIndex.groupIndex].items[nextItemIndex]);
                                    this.selectedOptionUpdated = true;
                                }
                                else if (this.optionsToDisplay[selectedItemIndex.groupIndex + 1]) {
                                    this.selectItem(event, this.optionsToDisplay[selectedItemIndex.groupIndex + 1].items[0]);
                                    this.selectedOptionUpdated = true;
                                }
                            }
                            else {
                                this.selectItem(event, this.optionsToDisplay[0].items[0]);
                            }
                        }
                        else {
                            var selectedItemIndex = this.selectedOption ? this.findOptionIndex(this.selectedOption.value, this.optionsToDisplay) : -1;
                            var nextEnabledOption = this.findNextEnabledOption(selectedItemIndex);
                            if (nextEnabledOption) {
                                this.selectItem(event, nextEnabledOption);
                                this.selectedOptionUpdated = true;
                            }
                        }
                    }
                    event.preventDefault();
                    break;
                //up
                case 38:
                    if (this.group) {
                        var selectedItemIndex = this.selectedOption ? this.findOptionGroupIndex(this.selectedOption.value, this.optionsToDisplay) : -1;
                        if (selectedItemIndex !== -1) {
                            var prevItemIndex = selectedItemIndex.itemIndex - 1;
                            if (prevItemIndex >= 0) {
                                this.selectItem(event, this.optionsToDisplay[selectedItemIndex.groupIndex].items[prevItemIndex]);
                                this.selectedOptionUpdated = true;
                            }
                            else if (prevItemIndex < 0) {
                                var prevGroup = this.optionsToDisplay[selectedItemIndex.groupIndex - 1];
                                if (prevGroup) {
                                    this.selectItem(event, prevGroup.items[prevGroup.items.length - 1]);
                                    this.selectedOptionUpdated = true;
                                }
                            }
                        }
                    }
                    else {
                        var selectedItemIndex = this.selectedOption ? this.findOptionIndex(this.selectedOption.value, this.optionsToDisplay) : -1;
                        var prevEnabledOption = this.findPrevEnabledOption(selectedItemIndex);
                        if (prevEnabledOption) {
                            this.selectItem(event, prevEnabledOption);
                            this.selectedOptionUpdated = true;
                        }
                    }
                    event.preventDefault();
                    break;
                //space
                case 32:
                case 32:
                    if (!this.overlayVisible) {
                        this.show();
                        event.preventDefault();
                    }
                    break;
                //enter
                case 13:
                    if (!this.filter || (this.optionsToDisplay && this.optionsToDisplay.length > 0)) {
                        this.hide(event);
                    }
                    event.preventDefault();
                    break;
                //escape and tab
                case 27:
                case 9:
                    this.hide(event);
                    break;
                //search item based on keyboard input
                default:
                    if (search) {
                        this.search(event);
                    }
                    break;
            }
        };
        Dropdown.prototype.search = function (event) {
            var _this = this;
            if (this.searchTimeout) {
                clearTimeout(this.searchTimeout);
            }
            var char = event.key;
            this.previousSearchChar = this.currentSearchChar;
            this.currentSearchChar = char;
            if (this.previousSearchChar === this.currentSearchChar)
                this.searchValue = this.currentSearchChar;
            else
                this.searchValue = this.searchValue ? this.searchValue + char : char;
            var newOption;
            if (this.group) {
                var searchIndex = this.selectedOption ? this.findOptionGroupIndex(this.selectedOption.value, this.optionsToDisplay) : { groupIndex: 0, itemIndex: 0 };
                newOption = this.searchOptionWithinGroup(searchIndex);
            }
            else {
                var searchIndex = this.selectedOption ? this.findOptionIndex(this.selectedOption.value, this.optionsToDisplay) : -1;
                newOption = this.searchOption(++searchIndex);
            }
            if (newOption && !newOption.disabled) {
                this.selectItem(event, newOption);
                this.selectedOptionUpdated = true;
            }
            this.searchTimeout = setTimeout(function () {
                _this.searchValue = null;
            }, 250);
        };
        Dropdown.prototype.searchOption = function (index) {
            var option;
            if (this.searchValue) {
                option = this.searchOptionInRange(index, this.optionsToDisplay.length);
                if (!option) {
                    option = this.searchOptionInRange(0, index);
                }
            }
            return option;
        };
        Dropdown.prototype.searchOptionInRange = function (start, end) {
            for (var i = start; i < end; i++) {
                var opt = this.optionsToDisplay[i];
                if (opt.label.toLocaleLowerCase(this.filterLocale).startsWith(this.searchValue.toLocaleLowerCase(this.filterLocale)) && !opt.disabled) {
                    return opt;
                }
            }
            return null;
        };
        Dropdown.prototype.searchOptionWithinGroup = function (index) {
            var option;
            if (this.searchValue) {
                for (var i = index.groupIndex; i < this.optionsToDisplay.length; i++) {
                    for (var j = (index.groupIndex === i) ? (index.itemIndex + 1) : 0; j < this.optionsToDisplay[i].items.length; j++) {
                        var opt = this.optionsToDisplay[i].items[j];
                        if (opt.label.toLocaleLowerCase(this.filterLocale).startsWith(this.searchValue.toLocaleLowerCase(this.filterLocale)) && !opt.disabled) {
                            return opt;
                        }
                    }
                }
                if (!option) {
                    for (var i = 0; i <= index.groupIndex; i++) {
                        for (var j = 0; j < ((index.groupIndex === i) ? index.itemIndex : this.optionsToDisplay[i].items.length); j++) {
                            var opt = this.optionsToDisplay[i].items[j];
                            if (opt.label.toLocaleLowerCase(this.filterLocale).startsWith(this.searchValue.toLocaleLowerCase(this.filterLocale)) && !opt.disabled) {
                                return opt;
                            }
                        }
                    }
                }
            }
            return null;
        };
        Dropdown.prototype.findOptionIndex = function (val, opts) {
            var index = -1;
            if (opts) {
                for (var i = 0; i < opts.length; i++) {
                    if ((val == null && opts[i].value == null) || utils.ObjectUtils.equals(val, opts[i].value, this.dataKey)) {
                        index = i;
                        break;
                    }
                }
            }
            return index;
        };
        Dropdown.prototype.findOptionGroupIndex = function (val, opts) {
            var groupIndex, itemIndex;
            if (opts) {
                for (var i = 0; i < opts.length; i++) {
                    groupIndex = i;
                    itemIndex = this.findOptionIndex(val, opts[i].items);
                    if (itemIndex !== -1) {
                        break;
                    }
                }
            }
            if (itemIndex !== -1) {
                return { groupIndex: groupIndex, itemIndex: itemIndex };
            }
            else {
                return -1;
            }
        };
        Dropdown.prototype.findOption = function (val, opts, inGroup) {
            var e_1, _a;
            if (this.group && !inGroup) {
                var opt = void 0;
                if (opts && opts.length) {
                    try {
                        for (var opts_1 = __values(opts), opts_1_1 = opts_1.next(); !opts_1_1.done; opts_1_1 = opts_1.next()) {
                            var optgroup = opts_1_1.value;
                            opt = this.findOption(val, optgroup.items, true);
                            if (opt) {
                                break;
                            }
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (opts_1_1 && !opts_1_1.done && (_a = opts_1.return)) _a.call(opts_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                }
                return opt;
            }
            else {
                var index = this.findOptionIndex(val, opts);
                return (index != -1) ? opts[index] : null;
            }
        };
        Dropdown.prototype.onFilter = function (event) {
            var inputValue = event.target.value;
            if (inputValue && inputValue.length) {
                this.filterValue = inputValue;
                this.activateFilter();
            }
            else {
                this.filterValue = null;
                this.optionsToDisplay = this.options;
            }
            this.optionsChanged = true;
        };
        Dropdown.prototype.activateFilter = function () {
            var e_2, _a;
            var searchFields = this.filterBy.split(',');
            if (this.options && this.options.length) {
                if (this.group) {
                    var filteredGroups = [];
                    try {
                        for (var _b = __values(this.options), _c = _b.next(); !_c.done; _c = _b.next()) {
                            var optgroup = _c.value;
                            var filteredSubOptions = utils.FilterUtils.filter(optgroup.items, searchFields, this.filterValue, this.filterMatchMode, this.filterLocale);
                            if (filteredSubOptions && filteredSubOptions.length) {
                                filteredGroups.push({
                                    label: optgroup.label,
                                    value: optgroup.value,
                                    items: filteredSubOptions
                                });
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
                    this.optionsToDisplay = filteredGroups;
                }
                else {
                    this.optionsToDisplay = utils.FilterUtils.filter(this.options, searchFields, this.filterValue, this.filterMatchMode, this.filterLocale);
                }
                this.optionsChanged = true;
            }
        };
        Dropdown.prototype.applyFocus = function () {
            if (this.editable)
                dom.DomHandler.findSingle(this.el.nativeElement, '.p-dropdown-label.p-inputtext').focus();
            else
                dom.DomHandler.findSingle(this.el.nativeElement, 'input[readonly]').focus();
        };
        Dropdown.prototype.focus = function () {
            this.applyFocus();
        };
        Dropdown.prototype.bindDocumentClickListener = function () {
            var _this = this;
            if (!this.documentClickListener) {
                this.documentClickListener = this.renderer.listen('document', 'click', function (event) {
                    if (_this.isOutsideClicked(event)) {
                        _this.hide(event);
                        _this.unbindDocumentClickListener();
                    }
                    _this.cd.markForCheck();
                });
            }
        };
        Dropdown.prototype.unbindDocumentClickListener = function () {
            if (this.documentClickListener) {
                this.documentClickListener();
                this.documentClickListener = null;
            }
        };
        Dropdown.prototype.bindDocumentResizeListener = function () {
            this.documentResizeListener = this.onWindowResize.bind(this);
            window.addEventListener('resize', this.documentResizeListener);
        };
        Dropdown.prototype.unbindDocumentResizeListener = function () {
            if (this.documentResizeListener) {
                window.removeEventListener('resize', this.documentResizeListener);
                this.documentResizeListener = null;
            }
        };
        Dropdown.prototype.onWindowResize = function () {
            if (!dom.DomHandler.isAndroid()) {
                this.hide(event);
            }
        };
        Dropdown.prototype.updateFilledState = function () {
            this.filled = (this.selectedOption != null);
        };
        Dropdown.prototype.clear = function (event) {
            this.value = null;
            this.onModelChange(this.value);
            this.onChange.emit({
                originalEvent: event,
                value: this.value
            });
            this.updateSelectedOption(this.value);
            this.updateEditableLabel();
            this.updateFilledState();
        };
        Dropdown.prototype.onOverlayHide = function () {
            this.unbindDocumentClickListener();
            this.unbindDocumentResizeListener();
            this.overlay = null;
            this.itemsWrapper = null;
            this.onModelTouched();
        };
        Dropdown.prototype.ngOnDestroy = function () {
            this.restoreOverlayAppend();
            this.onOverlayHide();
        };
        Dropdown.ctorParameters = function () { return [
            { type: core.ElementRef },
            { type: core.Renderer2 },
            { type: core.ChangeDetectorRef },
            { type: core.NgZone }
        ]; };
        Dropdown.decorators = [
            { type: core.Component, args: [{
                        selector: 'p-dropdown',
                        template: "\n         <div #container [ngClass]=\"{'p-dropdown p-component':true,\n            'p-disabled':disabled, 'p-dropdown-open':overlayVisible, 'p-focus':focused, 'p-dropdown-clearable': showClear && !disabled}\"\n            (click)=\"onMouseclick($event)\" [ngStyle]=\"style\" [class]=\"styleClass\">\n            <div class=\"p-hidden-accessible\">\n                <input #in [attr.id]=\"inputId\" type=\"text\" [attr.aria-label]=\"selectedOption ? selectedOption.label : ' '\" readonly (focus)=\"onInputFocus($event)\" aria-haspopup=\"listbox\"\n                    aria-haspopup=\"listbox\" [attr.aria-expanded]=\"overlayVisible\" [attr.aria-labelledby]=\"ariaLabelledBy\" (blur)=\"onInputBlur($event)\" (keydown)=\"onKeydown($event, true)\"\n                    [disabled]=\"disabled\" [attr.tabindex]=\"tabindex\" [attr.autofocus]=\"autofocus\" role=\"listbox\">\n            </div>\n            <span [ngClass]=\"{'p-dropdown-label p-inputtext':true,'p-dropdown-label-empty':(label == null || label.length === 0)}\" *ngIf=\"!editable && (label != null)\" [pTooltip]=\"tooltip\" [tooltipPosition]=\"tooltipPosition\" [positionStyle]=\"tooltipPositionStyle\" [tooltipStyleClass]=\"tooltipStyleClass\">\n                <ng-container *ngIf=\"!selectedItemTemplate\">{{label||'empty'}}</ng-container>\n                <ng-container *ngTemplateOutlet=\"selectedItemTemplate; context: {$implicit: selectedOption}\"></ng-container>\n            </span>\n            <span [ngClass]=\"{'p-dropdown-label p-inputtext p-placeholder':true,'p-dropdown-label-empty': (placeholder == null || placeholder.length === 0)}\" *ngIf=\"!editable && (label == null)\">{{placeholder||'empty'}}</span>\n            <input #editableInput type=\"text\" [attr.maxlength]=\"maxlength\" [attr.aria-label]=\"selectedOption ? selectedOption.label : ' '\" class=\"p-dropdown-label p-inputtext\" *ngIf=\"editable\" [disabled]=\"disabled\" [attr.placeholder]=\"placeholder\"\n                aria-haspopup=\"listbox\" [attr.aria-expanded]=\"overlayVisible\" (click)=\"onEditableInputClick()\" (input)=\"onEditableInputChange($event)\" (focus)=\"onEditableInputFocus($event)\" (blur)=\"onInputBlur($event)\">\n            <i class=\"p-dropdown-clear-icon pi pi-times\" (click)=\"clear($event)\" *ngIf=\"value != null && showClear && !disabled\"></i>\n            <div class=\"p-dropdown-trigger\" role=\"button\" aria-haspopup=\"listbox\" [attr.aria-expanded]=\"overlayVisible\">\n                <span class=\"p-dropdown-trigger-icon\" [ngClass]=\"dropdownIcon\"></span>\n            </div>\n            <div *ngIf=\"overlayVisible\" [ngClass]=\"'p-dropdown-panel p-component'\" [@overlayAnimation]=\"{value: 'visible', params: {showTransitionParams: showTransitionOptions, hideTransitionParams: hideTransitionOptions}}\" (@overlayAnimation.start)=\"onOverlayAnimationStart($event)\" [ngStyle]=\"panelStyle\" [class]=\"panelStyleClass\">\n                <div class=\"p-dropdown-header\" *ngIf=\"filter\" >\n                    <div class=\"p-dropdown-filter-container\" (click)=\"$event.stopPropagation()\">\n                        <input #filter type=\"text\" autocomplete=\"off\" [value]=\"filterValue||''\" class=\"p-dropdown-filter p-inputtext p-component\" [attr.placeholder]=\"filterPlaceholder\"\n                        (keydown.enter)=\"$event.preventDefault()\" (keydown)=\"onKeydown($event, false)\" (input)=\"onFilter($event)\" [attr.aria-label]=\"ariaFilterLabel\">\n                        <span class=\"p-dropdown-filter-icon pi pi-search\"></span>\n                    </div>\n                </div>\n                <div class=\"p-dropdown-items-wrapper\" [style.max-height]=\"virtualScroll ? 'auto' : (scrollHeight||'auto')\">\n                    <ul class=\"p-dropdown-items\" role=\"listbox\">\n                        <ng-container *ngIf=\"group\">\n                            <ng-template ngFor let-optgroup [ngForOf]=\"optionsToDisplay\">\n                                <li class=\"p-dropdown-item-group\">\n                                    <span *ngIf=\"!groupTemplate\">{{optgroup.label||'empty'}}</span>\n                                    <ng-container *ngTemplateOutlet=\"groupTemplate; context: {$implicit: optgroup}\"></ng-container>\n                                </li>\n                                <ng-container *ngTemplateOutlet=\"itemslist; context: {$implicit: optgroup.items, selectedOption: selectedOption}\"></ng-container>\n                            </ng-template>\n                        </ng-container>\n                        <ng-container *ngIf=\"!group\">\n                            <ng-container *ngTemplateOutlet=\"itemslist; context: {$implicit: optionsToDisplay, selectedOption: selectedOption}\"></ng-container>\n                        </ng-container>\n                        <ng-template #itemslist let-options let-selectedOption=\"selectedOption\">\n                            <ng-container *ngIf=\"!virtualScroll; else virtualScrollList\">\n                                <ng-template ngFor let-option let-i=\"index\" [ngForOf]=\"options\">\n                                    <p-dropdownItem [option]=\"option\" [selected]=\"selectedOption == option\"\n                                                    (onClick)=\"onItemClick($event)\"\n                                                    [template]=\"itemTemplate\"></p-dropdownItem>\n                                </ng-template>\n                            </ng-container>\n                            <ng-template #virtualScrollList>\n                                <cdk-virtual-scroll-viewport (scrolledIndexChange)=\"scrollToSelectedVirtualScrollElement()\" #viewport [ngStyle]=\"{'height': scrollHeight}\" [itemSize]=\"itemSize\" *ngIf=\"virtualScroll && optionsToDisplay && optionsToDisplay.length\">\n                                    <ng-container *cdkVirtualFor=\"let option of options; let i = index; let c = count; let f = first; let l = last; let e = even; let o = odd\">\n                                        <p-dropdownItem [option]=\"option\" [selected]=\"selectedOption == option\"\n                                                                   (onClick)=\"onItemClick($event)\"\n                                                                   [template]=\"itemTemplate\"></p-dropdownItem>\n                                    </ng-container>\n                                </cdk-virtual-scroll-viewport>\n                            </ng-template>\n                        </ng-template>\n                        <li *ngIf=\"filter && (!optionsToDisplay || (optionsToDisplay && optionsToDisplay.length === 0))\" class=\"p-dropdown-empty-message\">{{emptyFilterMessage}}</li>\n                    </ul>\n                </div>\n            </div>\n        </div>\n    ",
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
                            '[class.p-inputwrapper-focus]': 'focused'
                        },
                        providers: [DROPDOWN_VALUE_ACCESSOR],
                        changeDetection: core.ChangeDetectionStrategy.OnPush,
                        encapsulation: core.ViewEncapsulation.None,
                        styles: [".p-dropdown{display:-ms-inline-flexbox;display:inline-flex;cursor:pointer;position:relative;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.p-dropdown-clear-icon{position:absolute;top:50%;margin-top:-.5rem}.p-dropdown-trigger{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;-ms-flex-negative:0;flex-shrink:0}.p-dropdown-label{display:block;white-space:nowrap;overflow:hidden;-ms-flex:1 1 auto;flex:1 1 auto;width:1%;text-overflow:ellipsis;cursor:pointer}.p-dropdown-label-empty{overflow:hidden;visibility:hidden}input.p-dropdown-label{cursor:default}.p-dropdown .p-dropdown-panel{min-width:100%}.p-dropdown-panel{position:absolute}.p-dropdown-items-wrapper{overflow:auto}.p-dropdown-item{cursor:pointer;font-weight:400;white-space:nowrap;position:relative;overflow:hidden}.p-dropdown-items{margin:0;padding:0;list-style-type:none}.p-dropdown-filter{width:100%}.p-dropdown-filter-container{position:relative}.p-dropdown-filter-icon{position:absolute;top:50%;margin-top:-.5rem}.p-fluid .p-dropdown{display:-ms-flexbox;display:flex}.p-fluid .p-dropdown .p-dropdown-label{width:1%}"]
                    },] }
        ];
        Dropdown.ctorParameters = function () { return [
            { type: core.ElementRef },
            { type: core.Renderer2 },
            { type: core.ChangeDetectorRef },
            { type: core.NgZone }
        ]; };
        Dropdown.propDecorators = {
            scrollHeight: [{ type: core.Input }],
            filter: [{ type: core.Input }],
            name: [{ type: core.Input }],
            style: [{ type: core.Input }],
            panelStyle: [{ type: core.Input }],
            styleClass: [{ type: core.Input }],
            panelStyleClass: [{ type: core.Input }],
            readonly: [{ type: core.Input }],
            required: [{ type: core.Input }],
            editable: [{ type: core.Input }],
            appendTo: [{ type: core.Input }],
            tabindex: [{ type: core.Input }],
            placeholder: [{ type: core.Input }],
            filterPlaceholder: [{ type: core.Input }],
            filterLocale: [{ type: core.Input }],
            inputId: [{ type: core.Input }],
            selectId: [{ type: core.Input }],
            dataKey: [{ type: core.Input }],
            filterBy: [{ type: core.Input }],
            autofocus: [{ type: core.Input }],
            resetFilterOnHide: [{ type: core.Input }],
            dropdownIcon: [{ type: core.Input }],
            optionLabel: [{ type: core.Input }],
            autoDisplayFirst: [{ type: core.Input }],
            group: [{ type: core.Input }],
            showClear: [{ type: core.Input }],
            emptyFilterMessage: [{ type: core.Input }],
            virtualScroll: [{ type: core.Input }],
            itemSize: [{ type: core.Input }],
            autoZIndex: [{ type: core.Input }],
            baseZIndex: [{ type: core.Input }],
            showTransitionOptions: [{ type: core.Input }],
            hideTransitionOptions: [{ type: core.Input }],
            ariaFilterLabel: [{ type: core.Input }],
            ariaLabelledBy: [{ type: core.Input }],
            filterMatchMode: [{ type: core.Input }],
            maxlength: [{ type: core.Input }],
            tooltip: [{ type: core.Input }],
            tooltipPosition: [{ type: core.Input }],
            tooltipPositionStyle: [{ type: core.Input }],
            tooltipStyleClass: [{ type: core.Input }],
            autofocusFilter: [{ type: core.Input }],
            onChange: [{ type: core.Output }],
            onFocus: [{ type: core.Output }],
            onBlur: [{ type: core.Output }],
            onClick: [{ type: core.Output }],
            onShow: [{ type: core.Output }],
            onHide: [{ type: core.Output }],
            containerViewChild: [{ type: core.ViewChild, args: ['container',] }],
            filterViewChild: [{ type: core.ViewChild, args: ['filter',] }],
            accessibleViewChild: [{ type: core.ViewChild, args: ['in',] }],
            viewPort: [{ type: core.ViewChild, args: [scrolling.CdkVirtualScrollViewport,] }],
            editableInputViewChild: [{ type: core.ViewChild, args: ['editableInput',] }],
            templates: [{ type: core.ContentChildren, args: [api.PrimeTemplate,] }],
            disabled: [{ type: core.Input }],
            options: [{ type: core.Input }]
        };
        return Dropdown;
    }());
    var DropdownModule = /** @class */ (function () {
        function DropdownModule() {
        }
        DropdownModule.decorators = [
            { type: core.NgModule, args: [{
                        imports: [common.CommonModule, api.SharedModule, scrolling.ScrollingModule, tooltip.TooltipModule, ripple.RippleModule],
                        exports: [Dropdown, api.SharedModule, scrolling.ScrollingModule],
                        declarations: [Dropdown, DropdownItem]
                    },] }
        ];
        return DropdownModule;
    }());

    exports.DROPDOWN_VALUE_ACCESSOR = DROPDOWN_VALUE_ACCESSOR;
    exports.Dropdown = Dropdown;
    exports.DropdownItem = DropdownItem;
    exports.DropdownModule = DropdownModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=primeng-dropdown.umd.js.map
