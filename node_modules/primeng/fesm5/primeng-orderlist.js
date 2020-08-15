import { EventEmitter, ElementRef, Component, ChangeDetectionStrategy, ViewEncapsulation, Input, Output, ViewChild, ContentChildren, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PrimeTemplate, SharedModule } from 'primeng/api';
import { DomHandler } from 'primeng/dom';
import { ObjectUtils, FilterUtils } from 'primeng/utils';
import { RippleModule } from 'primeng/ripple';

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
var OrderList = /** @class */ (function () {
    function OrderList(el) {
        this.el = el;
        this.metaKeySelection = true;
        this.controlsPosition = 'left';
        this.filterMatchMode = "contains";
        this.selectionChange = new EventEmitter();
        this.trackBy = function (index, item) { return item; };
        this.onReorder = new EventEmitter();
        this.onSelectionChange = new EventEmitter();
        this.onFilterEvent = new EventEmitter();
    }
    Object.defineProperty(OrderList.prototype, "selection", {
        get: function () {
            return this._selection;
        },
        set: function (val) {
            this._selection = val;
        },
        enumerable: false,
        configurable: true
    });
    OrderList.prototype.ngAfterContentInit = function () {
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
    OrderList.prototype.ngAfterViewChecked = function () {
        if (this.movedUp || this.movedDown) {
            var listItems = DomHandler.find(this.listViewChild.nativeElement, 'li.p-highlight');
            var listItem = void 0;
            if (listItems.length > 0) {
                if (this.movedUp)
                    listItem = listItems[0];
                else
                    listItem = listItems[listItems.length - 1];
                DomHandler.scrollInView(this.listViewChild.nativeElement, listItem);
            }
            this.movedUp = false;
            this.movedDown = false;
        }
    };
    Object.defineProperty(OrderList.prototype, "value", {
        get: function () {
            return this._value;
        },
        set: function (val) {
            this._value = val;
            if (this.filterValue) {
                this.filter();
            }
        },
        enumerable: false,
        configurable: true
    });
    OrderList.prototype.onItemClick = function (event, item, index) {
        this.itemTouched = false;
        var selectedIndex = ObjectUtils.findIndexInList(item, this.selection);
        var selected = (selectedIndex != -1);
        var metaSelection = this.itemTouched ? false : this.metaKeySelection;
        if (metaSelection) {
            var metaKey = (event.metaKey || event.ctrlKey || event.shiftKey);
            if (selected && metaKey) {
                this._selection = this._selection.filter(function (val, index) { return index !== selectedIndex; });
            }
            else {
                this._selection = (metaKey) ? this._selection ? __spread(this._selection) : [] : [];
                ObjectUtils.insertIntoOrderedArray(item, index, this._selection, this.value);
            }
        }
        else {
            if (selected) {
                this._selection = this._selection.filter(function (val, index) { return index !== selectedIndex; });
            }
            else {
                this._selection = this._selection ? __spread(this._selection) : [];
                ObjectUtils.insertIntoOrderedArray(item, index, this._selection, this.value);
            }
        }
        //binding
        this.selectionChange.emit(this._selection);
        //event
        this.onSelectionChange.emit({ originalEvent: event, value: this._selection });
    };
    OrderList.prototype.onFilterKeyup = function (event) {
        this.filterValue = event.target.value.trim().toLocaleLowerCase(this.filterLocale);
        this.filter();
        this.onFilterEvent.emit({
            originalEvent: event,
            value: this.visibleOptions
        });
    };
    OrderList.prototype.filter = function () {
        var searchFields = this.filterBy.split(',');
        this.visibleOptions = FilterUtils.filter(this.value, searchFields, this.filterValue, this.filterMatchMode, this.filterLocale);
    };
    OrderList.prototype.isItemVisible = function (item) {
        if (this.filterValue && this.filterValue.trim().length) {
            for (var i = 0; i < this.visibleOptions.length; i++) {
                if (item == this.visibleOptions[i]) {
                    return true;
                }
            }
        }
        else {
            return true;
        }
    };
    OrderList.prototype.onItemTouchEnd = function (event) {
        this.itemTouched = true;
    };
    OrderList.prototype.isSelected = function (item) {
        return ObjectUtils.findIndexInList(item, this.selection) != -1;
    };
    OrderList.prototype.moveUp = function (event) {
        if (this.selection) {
            for (var i = 0; i < this.selection.length; i++) {
                var selectedItem = this.selection[i];
                var selectedItemIndex = ObjectUtils.findIndexInList(selectedItem, this.value);
                if (selectedItemIndex != 0) {
                    var movedItem = this.value[selectedItemIndex];
                    var temp = this.value[selectedItemIndex - 1];
                    this.value[selectedItemIndex - 1] = movedItem;
                    this.value[selectedItemIndex] = temp;
                }
                else {
                    break;
                }
            }
            this.movedUp = true;
            this.onReorder.emit(event);
        }
    };
    OrderList.prototype.moveTop = function (event) {
        if (this.selection) {
            for (var i = this.selection.length - 1; i >= 0; i--) {
                var selectedItem = this.selection[i];
                var selectedItemIndex = ObjectUtils.findIndexInList(selectedItem, this.value);
                if (selectedItemIndex != 0) {
                    var movedItem = this.value.splice(selectedItemIndex, 1)[0];
                    this.value.unshift(movedItem);
                }
                else {
                    break;
                }
            }
            this.onReorder.emit(event);
            this.listViewChild.nativeElement.scrollTop = 0;
        }
    };
    OrderList.prototype.moveDown = function (event) {
        if (this.selection) {
            for (var i = this.selection.length - 1; i >= 0; i--) {
                var selectedItem = this.selection[i];
                var selectedItemIndex = ObjectUtils.findIndexInList(selectedItem, this.value);
                if (selectedItemIndex != (this.value.length - 1)) {
                    var movedItem = this.value[selectedItemIndex];
                    var temp = this.value[selectedItemIndex + 1];
                    this.value[selectedItemIndex + 1] = movedItem;
                    this.value[selectedItemIndex] = temp;
                }
                else {
                    break;
                }
            }
            this.movedDown = true;
            this.onReorder.emit(event);
        }
    };
    OrderList.prototype.moveBottom = function (event) {
        if (this.selection) {
            for (var i = 0; i < this.selection.length; i++) {
                var selectedItem = this.selection[i];
                var selectedItemIndex = ObjectUtils.findIndexInList(selectedItem, this.value);
                if (selectedItemIndex != (this.value.length - 1)) {
                    var movedItem = this.value.splice(selectedItemIndex, 1)[0];
                    this.value.push(movedItem);
                }
                else {
                    break;
                }
            }
            this.onReorder.emit(event);
            this.listViewChild.nativeElement.scrollTop = this.listViewChild.nativeElement.scrollHeight;
        }
    };
    OrderList.prototype.onDragStart = function (event, index) {
        event.dataTransfer.setData('text', 'b'); // For firefox
        event.target.blur();
        this.dragging = true;
        this.draggedItemIndex = index;
    };
    OrderList.prototype.onDragOver = function (event, index) {
        if (this.dragging && this.draggedItemIndex !== index && this.draggedItemIndex + 1 !== index) {
            this.dragOverItemIndex = index;
            event.preventDefault();
        }
    };
    OrderList.prototype.onDragLeave = function (event) {
        this.dragOverItemIndex = null;
    };
    OrderList.prototype.onDrop = function (event, index) {
        var dropIndex = (this.draggedItemIndex > index) ? index : (index === 0) ? 0 : index - 1;
        ObjectUtils.reorderArray(this.value, this.draggedItemIndex, dropIndex);
        this.dragOverItemIndex = null;
        this.onReorder.emit(event);
        event.preventDefault();
    };
    OrderList.prototype.onDragEnd = function (event) {
        this.dragging = false;
    };
    OrderList.prototype.onListMouseMove = function (event) {
        if (this.dragging) {
            var offsetY = this.listViewChild.nativeElement.getBoundingClientRect().top + document.body.scrollTop;
            var bottomDiff = (offsetY + this.listViewChild.nativeElement.clientHeight) - event.pageY;
            var topDiff = (event.pageY - offsetY);
            if (bottomDiff < 25 && bottomDiff > 0)
                this.listViewChild.nativeElement.scrollTop += 15;
            else if (topDiff < 25 && topDiff > 0)
                this.listViewChild.nativeElement.scrollTop -= 15;
        }
    };
    OrderList.prototype.onItemKeydown = function (event, item, index) {
        var listItem = event.currentTarget;
        switch (event.which) {
            //down
            case 40:
                var nextItem = this.findNextItem(listItem);
                if (nextItem) {
                    nextItem.focus();
                }
                event.preventDefault();
                break;
            //up
            case 38:
                var prevItem = this.findPrevItem(listItem);
                if (prevItem) {
                    prevItem.focus();
                }
                event.preventDefault();
                break;
            //enter
            case 13:
                this.onItemClick(event, item, index);
                event.preventDefault();
                break;
        }
    };
    OrderList.prototype.findNextItem = function (item) {
        var nextItem = item.nextElementSibling;
        if (nextItem)
            return !DomHandler.hasClass(nextItem, 'p-orderlist-item') || DomHandler.isHidden(nextItem) ? this.findNextItem(nextItem) : nextItem;
        else
            return null;
    };
    OrderList.prototype.findPrevItem = function (item) {
        var prevItem = item.previousElementSibling;
        if (prevItem)
            return !DomHandler.hasClass(prevItem, 'p-orderlist-item') || DomHandler.isHidden(prevItem) ? this.findPrevItem(prevItem) : prevItem;
        else
            return null;
    };
    OrderList.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    OrderList.decorators = [
        { type: Component, args: [{
                    selector: 'p-orderList',
                    template: "\n        <div [ngClass]=\"{'p-orderlist p-component': true, 'p-orderlist-controls-left': controlsPosition === 'left',\n                    'p-orderlist-controls-right': controlsPosition === 'right'}\" [ngStyle]=\"style\" [class]=\"styleClass\">\n            <div class=\"p-orderlist-controls\">\n                <button type=\"button\" pButton pRipple icon=\"pi pi-angle-up\" (click)=\"moveUp($event)\"></button>\n                <button type=\"button\" pButton pRipple icon=\"pi pi-angle-double-up\" (click)=\"moveTop($event)\"></button>\n                <button type=\"button\" pButton pRipple icon=\"pi pi-angle-down\" (click)=\"moveDown($event)\"></button>\n                <button type=\"button\" pButton pRipple icon=\"pi pi-angle-double-down\" (click)=\"moveBottom($event)\"></button>\n            </div>\n            <div class=\"p-orderlist-list-container\">\n                <div class=\"p-orderlist-header\" *ngIf=\"header\">\n                    <div class=\"p-orderlist-title\">{{header}}</div>\n                </div>\n                <div class=\"p-orderlist-filter-container\" *ngIf=\"filterBy\">\n                    <div class=\"p-orderlist-filter\">\n                        <input type=\"text\" role=\"textbox\" (keyup)=\"onFilterKeyup($event)\" class=\"p-orderlist-filter-input p-inputtext p-component\" [attr.placeholder]=\"filterPlaceholder\" [attr.aria-label]=\"ariaFilterLabel\">\n                        <span class=\"p-orderlist-filter-icon pi pi-search\"></span>\n                    </div>\n                </div>\n                <ul #listelement class=\"p-orderlist-list\" [ngStyle]=\"listStyle\" (dragover)=\"onListMouseMove($event)\">\n                    <ng-template ngFor [ngForTrackBy]=\"trackBy\" let-item [ngForOf]=\"value\" let-i=\"index\" let-l=\"last\">\n                        <li class=\"p-orderlist-droppoint\" *ngIf=\"dragdrop && isItemVisible(item)\" (dragover)=\"onDragOver($event, i)\" (drop)=\"onDrop($event, i)\" (dragleave)=\"onDragLeave($event)\"\n                            [ngClass]=\"{'p-orderlist-droppoint-highlight': (i === dragOverItemIndex)}\"></li>\n                        <li class=\"p-orderlist-item\" tabindex=\"0\" [ngClass]=\"{'p-highlight':isSelected(item)}\" pRipple\n                            (click)=\"onItemClick($event,item,i)\" (touchend)=\"onItemTouchEnd($event)\" (keydown)=\"onItemKeydown($event,item,i)\"\n                            [style.display]=\"isItemVisible(item) ? 'block' : 'none'\" role=\"option\" [attr.aria-selected]=\"isSelected(item)\"\n                            [attr.draggable]=\"dragdrop\" (dragstart)=\"onDragStart($event, i)\" (dragend)=\"onDragEnd($event)\">\n                            <ng-container *ngTemplateOutlet=\"itemTemplate; context: {$implicit: item, index: i}\"></ng-container>\n                        </li>\n                        <li class=\"p-orderlist-droppoint\" *ngIf=\"dragdrop && l\" (dragover)=\"onDragOver($event, i + 1)\" (drop)=\"onDrop($event, i + 1)\" (dragleave)=\"onDragLeave($event)\"\n                            [ngClass]=\"{'p-orderlist-droppoint-highlight': (i + 1 === dragOverItemIndex)}\"></li>\n                    </ng-template>\n                </ul>\n            </div>\n        </div>\n    ",
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    styles: [".p-orderlist{display:-ms-flexbox;display:flex}.p-orderlist-controls{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;-ms-flex-pack:center;justify-content:center}.p-orderlist-list-container{-ms-flex:1 1 auto;flex:1 1 auto}.p-orderlist-list{list-style-type:none;margin:0;padding:0;overflow:auto;min-height:12rem;max-height:24rem}.p-orderlist-item{cursor:pointer;overflow:hidden;position:relative}.p-orderlist.p-state-disabled .p-button,.p-orderlist.p-state-disabled .p-orderlist-item{cursor:default}.p-orderlist.p-state-disabled .p-orderlist-list{overflow:hidden}.p-orderlist-filter{position:relative}.p-orderlist-filter-icon{position:absolute;top:50%;margin-top:-.5rem}.p-orderlist-filter-input{width:100%}.p-orderlist-controls-right .p-orderlist-controls{-ms-flex-order:2;order:2}.p-orderlist-controls-right .p-orderlist-list-container{-ms-flex-order:1;order:1}.p-orderlist-droppoint{height:6px}"]
                },] }
    ];
    OrderList.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    OrderList.propDecorators = {
        header: [{ type: Input }],
        style: [{ type: Input }],
        styleClass: [{ type: Input }],
        listStyle: [{ type: Input }],
        responsive: [{ type: Input }],
        filterBy: [{ type: Input }],
        filterPlaceholder: [{ type: Input }],
        filterLocale: [{ type: Input }],
        metaKeySelection: [{ type: Input }],
        dragdrop: [{ type: Input }],
        controlsPosition: [{ type: Input }],
        ariaFilterLabel: [{ type: Input }],
        filterMatchMode: [{ type: Input }],
        selectionChange: [{ type: Output }],
        trackBy: [{ type: Input }],
        onReorder: [{ type: Output }],
        onSelectionChange: [{ type: Output }],
        onFilterEvent: [{ type: Output }],
        listViewChild: [{ type: ViewChild, args: ['listelement',] }],
        templates: [{ type: ContentChildren, args: [PrimeTemplate,] }],
        selection: [{ type: Input }],
        value: [{ type: Input }]
    };
    return OrderList;
}());
var OrderListModule = /** @class */ (function () {
    function OrderListModule() {
    }
    OrderListModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule, ButtonModule, SharedModule, RippleModule],
                    exports: [OrderList, SharedModule],
                    declarations: [OrderList]
                },] }
    ];
    return OrderListModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { OrderList, OrderListModule };
//# sourceMappingURL=primeng-orderlist.js.map
