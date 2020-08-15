import { NgModule, Component, HostListener, OnInit, OnDestroy, AfterViewInit, AfterViewChecked, Directive, Optional, AfterContentInit, Input, Output, EventEmitter, ElementRef, ContentChildren, TemplateRef, QueryList, ViewChild, NgZone, ChangeDetectorRef, OnChanges, SimpleChanges, ChangeDetectionStrategy, Query, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeTemplate, SharedModule } from 'primeng/api';
import { PaginatorModule } from 'primeng/paginator';
import { DomHandler } from 'primeng/dom';
import { ObjectUtils } from 'primeng/utils';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { FilterUtils } from 'primeng/utils';
import { ScrollingModule, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
export class TableService {
    constructor() {
        this.sortSource = new Subject();
        this.selectionSource = new Subject();
        this.contextMenuSource = new Subject();
        this.valueSource = new Subject();
        this.totalRecordsSource = new Subject();
        this.columnsSource = new Subject();
        this.sortSource$ = this.sortSource.asObservable();
        this.selectionSource$ = this.selectionSource.asObservable();
        this.contextMenuSource$ = this.contextMenuSource.asObservable();
        this.valueSource$ = this.valueSource.asObservable();
        this.totalRecordsSource$ = this.totalRecordsSource.asObservable();
        this.columnsSource$ = this.columnsSource.asObservable();
    }
    onSort(sortMeta) {
        this.sortSource.next(sortMeta);
    }
    onSelectionChange() {
        this.selectionSource.next();
    }
    onContextMenu(data) {
        this.contextMenuSource.next(data);
    }
    onValueChange(value) {
        this.valueSource.next(value);
    }
    onTotalRecordsChange(value) {
        this.totalRecordsSource.next(value);
    }
    onColumnsChange(columns) {
        this.columnsSource.next(columns);
    }
}
TableService.decorators = [
    { type: Injectable }
];
export class Table {
    constructor(el, zone, tableService, cd) {
        this.el = el;
        this.zone = zone;
        this.tableService = tableService;
        this.cd = cd;
        this.pageLinks = 5;
        this.alwaysShowPaginator = true;
        this.paginatorPosition = 'bottom';
        this.paginatorDropdownScrollHeight = '200px';
        this.currentPageReportTemplate = '{currentPage} of {totalPages}';
        this.defaultSortOrder = 1;
        this.sortMode = 'single';
        this.resetPageOnSort = true;
        this.selectionChange = new EventEmitter();
        this.contextMenuSelectionChange = new EventEmitter();
        this.contextMenuSelectionMode = "separate";
        this.rowTrackBy = (index, item) => item;
        this.lazy = false;
        this.lazyLoadOnInit = true;
        this.compareSelectionBy = 'deepEquals';
        this.csvSeparator = ',';
        this.exportFilename = 'download';
        this.filters = {};
        this.filterDelay = 300;
        this.expandedRowKeys = {};
        this.editingRowKeys = {};
        this.rowExpandMode = 'multiple';
        this.virtualScrollDelay = 150;
        this.virtualRowHeight = 28;
        this.columnResizeMode = 'fit';
        this.loadingIcon = 'pi pi-spinner';
        this.showLoader = true;
        this.stateStorage = 'session';
        this.editMode = 'cell';
        this.onRowSelect = new EventEmitter();
        this.onRowUnselect = new EventEmitter();
        this.onPage = new EventEmitter();
        this.onSort = new EventEmitter();
        this.onFilter = new EventEmitter();
        this.onLazyLoad = new EventEmitter();
        this.onRowExpand = new EventEmitter();
        this.onRowCollapse = new EventEmitter();
        this.onContextMenuSelect = new EventEmitter();
        this.onColResize = new EventEmitter();
        this.onColReorder = new EventEmitter();
        this.onRowReorder = new EventEmitter();
        this.onEditInit = new EventEmitter();
        this.onEditComplete = new EventEmitter();
        this.onEditCancel = new EventEmitter();
        this.onHeaderCheckboxToggle = new EventEmitter();
        this.sortFunction = new EventEmitter();
        this.firstChange = new EventEmitter();
        this.rowsChange = new EventEmitter();
        this.onStateSave = new EventEmitter();
        this.onStateRestore = new EventEmitter();
        this._value = [];
        this._totalRecords = 0;
        this._first = 0;
        this.selectionKeys = {};
        this._sortOrder = 1;
    }
    ngOnInit() {
        if (this.lazy && this.lazyLoadOnInit) {
            if (!this.virtualScroll) {
                this.onLazyLoad.emit(this.createLazyLoadMetadata());
            }
            if (this.restoringFilter) {
                this.restoringFilter = false;
            }
        }
        this.initialized = true;
    }
    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'caption':
                    this.captionTemplate = item.template;
                    break;
                case 'header':
                    this.headerTemplate = item.template;
                    break;
                case 'body':
                    this.bodyTemplate = item.template;
                    break;
                case 'loadingbody':
                    this.loadingBodyTemplate = item.template;
                    break;
                case 'footer':
                    this.footerTemplate = item.template;
                    break;
                case 'summary':
                    this.summaryTemplate = item.template;
                    break;
                case 'colgroup':
                    this.colGroupTemplate = item.template;
                    break;
                case 'rowexpansion':
                    this.expandedRowTemplate = item.template;
                    break;
                case 'frozenrows':
                    this.frozenRowsTemplate = item.template;
                    break;
                case 'frozenheader':
                    this.frozenHeaderTemplate = item.template;
                    break;
                case 'frozenbody':
                    this.frozenBodyTemplate = item.template;
                    break;
                case 'frozenfooter':
                    this.frozenFooterTemplate = item.template;
                    break;
                case 'frozencolgroup':
                    this.frozenColGroupTemplate = item.template;
                    break;
                case 'emptymessage':
                    this.emptyMessageTemplate = item.template;
                    break;
                case 'paginatorleft':
                    this.paginatorLeftTemplate = item.template;
                    break;
                case 'paginatorright':
                    this.paginatorRightTemplate = item.template;
                    break;
            }
        });
    }
    ngAfterViewInit() {
        if (this.isStateful() && this.resizableColumns) {
            this.restoreColumnWidths();
        }
    }
    clearCache() {
        if (this.scrollable) {
            if (this.scrollableViewChild) {
                this.scrollableViewChild.clearCache();
            }
            if (this.scrollableFrozenViewChild) {
                this.scrollableViewChild.clearCache();
            }
        }
    }
    ngOnChanges(simpleChange) {
        if (simpleChange.value) {
            if (this.isStateful() && !this.stateRestored) {
                this.restoreState();
            }
            this._value = simpleChange.value.currentValue;
            if (!this.lazy) {
                this.clearCache();
                this.totalRecords = (this._value ? this._value.length : 0);
                if (this.sortMode == 'single' && this.sortField)
                    this.sortSingle();
                else if (this.sortMode == 'multiple' && this.multiSortMeta)
                    this.sortMultiple();
                else if (this.hasFilter()) //sort already filters
                    this._filter();
            }
            this.tableService.onValueChange(simpleChange.value.currentValue);
        }
        if (simpleChange.columns) {
            this._columns = simpleChange.columns.currentValue;
            this.tableService.onColumnsChange(simpleChange.columns.currentValue);
            if (this._columns && this.isStateful() && this.reorderableColumns && !this.columnOrderStateRestored) {
                this.restoreColumnOrder();
            }
        }
        if (simpleChange.sortField) {
            this._sortField = simpleChange.sortField.currentValue;
            //avoid triggering lazy load prior to lazy initialization at onInit
            if (!this.lazy || this.initialized) {
                if (this.sortMode === 'single') {
                    this.sortSingle();
                }
            }
        }
        if (simpleChange.sortOrder) {
            this._sortOrder = simpleChange.sortOrder.currentValue;
            //avoid triggering lazy load prior to lazy initialization at onInit
            if (!this.lazy || this.initialized) {
                if (this.sortMode === 'single') {
                    this.sortSingle();
                }
            }
        }
        if (simpleChange.multiSortMeta) {
            this._multiSortMeta = simpleChange.multiSortMeta.currentValue;
            if (this.sortMode === 'multiple') {
                this.sortMultiple();
            }
        }
        if (simpleChange.selection) {
            this._selection = simpleChange.selection.currentValue;
            if (!this.preventSelectionSetterPropagation) {
                this.updateSelectionKeys();
                this.tableService.onSelectionChange();
            }
            this.preventSelectionSetterPropagation = false;
        }
    }
    get value() {
        return this._value;
    }
    set value(val) {
        this._value = val;
    }
    get columns() {
        return this._columns;
    }
    set columns(cols) {
        this._columns = cols;
    }
    get first() {
        return this._first;
    }
    set first(val) {
        this._first = val;
    }
    get rows() {
        return this._rows;
    }
    set rows(val) {
        this._rows = val;
    }
    get totalRecords() {
        return this._totalRecords;
    }
    set totalRecords(val) {
        this._totalRecords = val;
        this.tableService.onTotalRecordsChange(this._totalRecords);
    }
    get sortField() {
        return this._sortField;
    }
    set sortField(val) {
        this._sortField = val;
    }
    get sortOrder() {
        return this._sortOrder;
    }
    set sortOrder(val) {
        this._sortOrder = val;
    }
    get multiSortMeta() {
        return this._multiSortMeta;
    }
    set multiSortMeta(val) {
        this._multiSortMeta = val;
    }
    get selection() {
        return this._selection;
    }
    set selection(val) {
        this._selection = val;
    }
    updateSelectionKeys() {
        if (this.dataKey && this._selection) {
            this.selectionKeys = {};
            if (Array.isArray(this._selection)) {
                for (let data of this._selection) {
                    this.selectionKeys[String(ObjectUtils.resolveFieldData(data, this.dataKey))] = 1;
                }
            }
            else {
                this.selectionKeys[String(ObjectUtils.resolveFieldData(this._selection, this.dataKey))] = 1;
            }
        }
    }
    onPageChange(event) {
        this.first = event.first;
        this.rows = event.rows;
        if (this.lazy) {
            this.onLazyLoad.emit(this.createLazyLoadMetadata());
        }
        this.onPage.emit({
            first: this.first,
            rows: this.rows
        });
        this.firstChange.emit(this.first);
        this.rowsChange.emit(this.rows);
        this.tableService.onValueChange(this.value);
        if (this.isStateful()) {
            this.saveState();
        }
        this.anchorRowIndex = null;
        if (this.scrollable) {
            this.resetScrollTop();
        }
    }
    sort(event) {
        let originalEvent = event.originalEvent;
        if (this.sortMode === 'single') {
            this._sortOrder = (this.sortField === event.field) ? this.sortOrder * -1 : this.defaultSortOrder;
            this._sortField = event.field;
            this.sortSingle();
            if (this.resetPageOnSort) {
                this._first = 0;
                this.firstChange.emit(this._first);
                if (this.scrollable) {
                    this.resetScrollTop();
                }
            }
        }
        if (this.sortMode === 'multiple') {
            let metaKey = originalEvent.metaKey || originalEvent.ctrlKey;
            let sortMeta = this.getSortMeta(event.field);
            if (sortMeta) {
                if (!metaKey) {
                    this._multiSortMeta = [{ field: event.field, order: sortMeta.order * -1 }];
                    if (this.resetPageOnSort) {
                        this._first = 0;
                        this.firstChange.emit(this._first);
                        if (this.scrollable) {
                            this.resetScrollTop();
                        }
                    }
                }
                else {
                    sortMeta.order = sortMeta.order * -1;
                }
            }
            else {
                if (!metaKey || !this.multiSortMeta) {
                    this._multiSortMeta = [];
                    if (this.resetPageOnSort) {
                        this._first = 0;
                        this.firstChange.emit(this._first);
                    }
                }
                this._multiSortMeta.push({ field: event.field, order: this.defaultSortOrder });
            }
            this.sortMultiple();
        }
        if (this.isStateful()) {
            this.saveState();
        }
        this.anchorRowIndex = null;
    }
    sortSingle() {
        if (this.sortField && this.sortOrder) {
            if (this.restoringSort) {
                this.restoringSort = false;
            }
            if (this.lazy) {
                this.onLazyLoad.emit(this.createLazyLoadMetadata());
            }
            else if (this.value) {
                if (this.customSort) {
                    this.sortFunction.emit({
                        data: this.value,
                        mode: this.sortMode,
                        field: this.sortField,
                        order: this.sortOrder
                    });
                }
                else {
                    this.value.sort((data1, data2) => {
                        let value1 = ObjectUtils.resolveFieldData(data1, this.sortField);
                        let value2 = ObjectUtils.resolveFieldData(data2, this.sortField);
                        let result = null;
                        if (value1 == null && value2 != null)
                            result = -1;
                        else if (value1 != null && value2 == null)
                            result = 1;
                        else if (value1 == null && value2 == null)
                            result = 0;
                        else if (typeof value1 === 'string' && typeof value2 === 'string')
                            result = value1.localeCompare(value2);
                        else
                            result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;
                        return (this.sortOrder * result);
                    });
                }
                if (this.hasFilter()) {
                    this._filter();
                }
            }
            let sortMeta = {
                field: this.sortField,
                order: this.sortOrder
            };
            this.onSort.emit(sortMeta);
            this.tableService.onSort(sortMeta);
        }
    }
    sortMultiple() {
        if (this.multiSortMeta) {
            if (this.lazy) {
                this.onLazyLoad.emit(this.createLazyLoadMetadata());
            }
            else if (this.value) {
                if (this.customSort) {
                    this.sortFunction.emit({
                        data: this.value,
                        mode: this.sortMode,
                        multiSortMeta: this.multiSortMeta
                    });
                }
                else {
                    this.value.sort((data1, data2) => {
                        return this.multisortField(data1, data2, this.multiSortMeta, 0);
                    });
                }
                if (this.hasFilter()) {
                    this._filter();
                }
            }
            this.onSort.emit({
                multisortmeta: this.multiSortMeta
            });
            this.tableService.onSort(this.multiSortMeta);
        }
    }
    multisortField(data1, data2, multiSortMeta, index) {
        let value1 = ObjectUtils.resolveFieldData(data1, multiSortMeta[index].field);
        let value2 = ObjectUtils.resolveFieldData(data2, multiSortMeta[index].field);
        let result = null;
        if (value1 == null && value2 != null)
            result = -1;
        else if (value1 != null && value2 == null)
            result = 1;
        else if (value1 == null && value2 == null)
            result = 0;
        else if (typeof value1 == 'string' || value1 instanceof String) {
            if (value1.localeCompare && (value1 != value2)) {
                return (multiSortMeta[index].order * value1.localeCompare(value2));
            }
        }
        else {
            result = (value1 < value2) ? -1 : 1;
        }
        if (value1 == value2) {
            return (multiSortMeta.length - 1) > (index) ? (this.multisortField(data1, data2, multiSortMeta, index + 1)) : 0;
        }
        return (multiSortMeta[index].order * result);
    }
    getSortMeta(field) {
        if (this.multiSortMeta && this.multiSortMeta.length) {
            for (let i = 0; i < this.multiSortMeta.length; i++) {
                if (this.multiSortMeta[i].field === field) {
                    return this.multiSortMeta[i];
                }
            }
        }
        return null;
    }
    isSorted(field) {
        if (this.sortMode === 'single') {
            return (this.sortField && this.sortField === field);
        }
        else if (this.sortMode === 'multiple') {
            let sorted = false;
            if (this.multiSortMeta) {
                for (let i = 0; i < this.multiSortMeta.length; i++) {
                    if (this.multiSortMeta[i].field == field) {
                        sorted = true;
                        break;
                    }
                }
            }
            return sorted;
        }
    }
    handleRowClick(event) {
        let target = event.originalEvent.target;
        let targetNode = target.nodeName;
        let parentNode = target.parentElement && target.parentElement.nodeName;
        if (targetNode == 'INPUT' || targetNode == 'BUTTON' || targetNode == 'A' ||
            parentNode == 'INPUT' || parentNode == 'BUTTON' || parentNode == 'A' ||
            (DomHandler.hasClass(event.originalEvent.target, 'p-clickable'))) {
            return;
        }
        if (this.selectionMode) {
            this.preventSelectionSetterPropagation = true;
            if (this.isMultipleSelectionMode() && event.originalEvent.shiftKey && this.anchorRowIndex != null) {
                DomHandler.clearSelection();
                if (this.rangeRowIndex != null) {
                    this.clearSelectionRange(event.originalEvent);
                }
                this.rangeRowIndex = event.rowIndex;
                this.selectRange(event.originalEvent, event.rowIndex);
            }
            else {
                let rowData = event.rowData;
                let selected = this.isSelected(rowData);
                let metaSelection = this.rowTouched ? false : this.metaKeySelection;
                let dataKeyValue = this.dataKey ? String(ObjectUtils.resolveFieldData(rowData, this.dataKey)) : null;
                this.anchorRowIndex = event.rowIndex;
                this.rangeRowIndex = event.rowIndex;
                if (metaSelection) {
                    let metaKey = event.originalEvent.metaKey || event.originalEvent.ctrlKey;
                    if (selected && metaKey) {
                        if (this.isSingleSelectionMode()) {
                            this._selection = null;
                            this.selectionKeys = {};
                            this.selectionChange.emit(null);
                        }
                        else {
                            let selectionIndex = this.findIndexInSelection(rowData);
                            this._selection = this.selection.filter((val, i) => i != selectionIndex);
                            this.selectionChange.emit(this.selection);
                            if (dataKeyValue) {
                                delete this.selectionKeys[dataKeyValue];
                            }
                        }
                        this.onRowUnselect.emit({ originalEvent: event.originalEvent, data: rowData, type: 'row' });
                    }
                    else {
                        if (this.isSingleSelectionMode()) {
                            this._selection = rowData;
                            this.selectionChange.emit(rowData);
                            if (dataKeyValue) {
                                this.selectionKeys = {};
                                this.selectionKeys[dataKeyValue] = 1;
                            }
                        }
                        else if (this.isMultipleSelectionMode()) {
                            if (metaKey) {
                                this._selection = this.selection || [];
                            }
                            else {
                                this._selection = [];
                                this.selectionKeys = {};
                            }
                            this._selection = [...this.selection, rowData];
                            this.selectionChange.emit(this.selection);
                            if (dataKeyValue) {
                                this.selectionKeys[dataKeyValue] = 1;
                            }
                        }
                        this.onRowSelect.emit({ originalEvent: event.originalEvent, data: rowData, type: 'row', index: event.rowIndex });
                    }
                }
                else {
                    if (this.selectionMode === 'single') {
                        if (selected) {
                            this._selection = null;
                            this.selectionKeys = {};
                            this.selectionChange.emit(this.selection);
                            this.onRowUnselect.emit({ originalEvent: event.originalEvent, data: rowData, type: 'row' });
                        }
                        else {
                            this._selection = rowData;
                            this.selectionChange.emit(this.selection);
                            this.onRowSelect.emit({ originalEvent: event.originalEvent, data: rowData, type: 'row', index: event.rowIndex });
                            if (dataKeyValue) {
                                this.selectionKeys = {};
                                this.selectionKeys[dataKeyValue] = 1;
                            }
                        }
                    }
                    else if (this.selectionMode === 'multiple') {
                        if (selected) {
                            let selectionIndex = this.findIndexInSelection(rowData);
                            this._selection = this.selection.filter((val, i) => i != selectionIndex);
                            this.selectionChange.emit(this.selection);
                            this.onRowUnselect.emit({ originalEvent: event.originalEvent, data: rowData, type: 'row' });
                            if (dataKeyValue) {
                                delete this.selectionKeys[dataKeyValue];
                            }
                        }
                        else {
                            this._selection = this.selection ? [...this.selection, rowData] : [rowData];
                            this.selectionChange.emit(this.selection);
                            this.onRowSelect.emit({ originalEvent: event.originalEvent, data: rowData, type: 'row', index: event.rowIndex });
                            if (dataKeyValue) {
                                this.selectionKeys[dataKeyValue] = 1;
                            }
                        }
                    }
                }
            }
            this.tableService.onSelectionChange();
            if (this.isStateful()) {
                this.saveState();
            }
        }
        this.rowTouched = false;
    }
    handleRowTouchEnd(event) {
        this.rowTouched = true;
    }
    handleRowRightClick(event) {
        if (this.contextMenu) {
            const rowData = event.rowData;
            if (this.contextMenuSelectionMode === 'separate') {
                this.contextMenuSelection = rowData;
                this.contextMenuSelectionChange.emit(rowData);
                this.onContextMenuSelect.emit({ originalEvent: event.originalEvent, data: rowData, index: event.rowIndex });
                this.contextMenu.show(event.originalEvent);
                this.tableService.onContextMenu(rowData);
            }
            else if (this.contextMenuSelectionMode === 'joint') {
                this.preventSelectionSetterPropagation = true;
                let selected = this.isSelected(rowData);
                let dataKeyValue = this.dataKey ? String(ObjectUtils.resolveFieldData(rowData, this.dataKey)) : null;
                if (!selected) {
                    if (this.isSingleSelectionMode()) {
                        this.selection = rowData;
                        this.selectionChange.emit(rowData);
                    }
                    else if (this.isMultipleSelectionMode()) {
                        this.selection = [rowData];
                        this.selectionChange.emit(this.selection);
                    }
                    if (dataKeyValue) {
                        this.selectionKeys[dataKeyValue] = 1;
                    }
                }
                this.contextMenu.show(event.originalEvent);
                this.onContextMenuSelect.emit({ originalEvent: event, data: rowData, index: event.rowIndex });
            }
        }
    }
    selectRange(event, rowIndex) {
        let rangeStart, rangeEnd;
        if (this.anchorRowIndex > rowIndex) {
            rangeStart = rowIndex;
            rangeEnd = this.anchorRowIndex;
        }
        else if (this.anchorRowIndex < rowIndex) {
            rangeStart = this.anchorRowIndex;
            rangeEnd = rowIndex;
        }
        else {
            rangeStart = rowIndex;
            rangeEnd = rowIndex;
        }
        if (this.lazy && this.paginator) {
            rangeStart -= this.first;
            rangeEnd -= this.first;
        }
        for (let i = rangeStart; i <= rangeEnd; i++) {
            let rangeRowData = this.filteredValue ? this.filteredValue[i] : this.value[i];
            if (!this.isSelected(rangeRowData)) {
                this._selection = [...this.selection, rangeRowData];
                let dataKeyValue = this.dataKey ? String(ObjectUtils.resolveFieldData(rangeRowData, this.dataKey)) : null;
                if (dataKeyValue) {
                    this.selectionKeys[dataKeyValue] = 1;
                }
                this.onRowSelect.emit({ originalEvent: event, data: rangeRowData, type: 'row' });
            }
        }
        this.selectionChange.emit(this.selection);
    }
    clearSelectionRange(event) {
        let rangeStart, rangeEnd;
        if (this.rangeRowIndex > this.anchorRowIndex) {
            rangeStart = this.anchorRowIndex;
            rangeEnd = this.rangeRowIndex;
        }
        else if (this.rangeRowIndex < this.anchorRowIndex) {
            rangeStart = this.rangeRowIndex;
            rangeEnd = this.anchorRowIndex;
        }
        else {
            rangeStart = this.rangeRowIndex;
            rangeEnd = this.rangeRowIndex;
        }
        for (let i = rangeStart; i <= rangeEnd; i++) {
            let rangeRowData = this.value[i];
            let selectionIndex = this.findIndexInSelection(rangeRowData);
            this._selection = this.selection.filter((val, i) => i != selectionIndex);
            let dataKeyValue = this.dataKey ? String(ObjectUtils.resolveFieldData(rangeRowData, this.dataKey)) : null;
            if (dataKeyValue) {
                delete this.selectionKeys[dataKeyValue];
            }
            this.onRowUnselect.emit({ originalEvent: event, data: rangeRowData, type: 'row' });
        }
    }
    isSelected(rowData) {
        if (rowData && this.selection) {
            if (this.dataKey) {
                return this.selectionKeys[ObjectUtils.resolveFieldData(rowData, this.dataKey)] !== undefined;
            }
            else {
                if (this.selection instanceof Array)
                    return this.findIndexInSelection(rowData) > -1;
                else
                    return this.equals(rowData, this.selection);
            }
        }
        return false;
    }
    findIndexInSelection(rowData) {
        let index = -1;
        if (this.selection && this.selection.length) {
            for (let i = 0; i < this.selection.length; i++) {
                if (this.equals(rowData, this.selection[i])) {
                    index = i;
                    break;
                }
            }
        }
        return index;
    }
    toggleRowWithRadio(event, rowData) {
        this.preventSelectionSetterPropagation = true;
        if (this.selection != rowData) {
            this._selection = rowData;
            this.selectionChange.emit(this.selection);
            this.onRowSelect.emit({ originalEvent: event.originalEvent, index: event.rowIndex, data: rowData, type: 'radiobutton' });
            if (this.dataKey) {
                this.selectionKeys = {};
                this.selectionKeys[String(ObjectUtils.resolveFieldData(rowData, this.dataKey))] = 1;
            }
        }
        else {
            this._selection = null;
            this.selectionChange.emit(this.selection);
            this.onRowUnselect.emit({ originalEvent: event.originalEvent, index: event.rowIndex, data: rowData, type: 'radiobutton' });
        }
        this.tableService.onSelectionChange();
        if (this.isStateful()) {
            this.saveState();
        }
    }
    toggleRowWithCheckbox(event, rowData) {
        this.selection = this.selection || [];
        let selected = this.isSelected(rowData);
        let dataKeyValue = this.dataKey ? String(ObjectUtils.resolveFieldData(rowData, this.dataKey)) : null;
        this.preventSelectionSetterPropagation = true;
        if (selected) {
            let selectionIndex = this.findIndexInSelection(rowData);
            this._selection = this.selection.filter((val, i) => i != selectionIndex);
            this.selectionChange.emit(this.selection);
            this.onRowUnselect.emit({ originalEvent: event.originalEvent, index: event.rowIndex, data: rowData, type: 'checkbox' });
            if (dataKeyValue) {
                delete this.selectionKeys[dataKeyValue];
            }
        }
        else {
            this._selection = this.selection ? [...this.selection, rowData] : [rowData];
            this.selectionChange.emit(this.selection);
            this.onRowSelect.emit({ originalEvent: event.originalEvent, index: event.rowIndex, data: rowData, type: 'checkbox' });
            if (dataKeyValue) {
                this.selectionKeys[dataKeyValue] = 1;
            }
        }
        this.tableService.onSelectionChange();
        if (this.isStateful()) {
            this.saveState();
        }
    }
    toggleRowsWithCheckbox(event, check) {
        this._selection = check ? this.filteredValue ? this.filteredValue.slice() : this.value.slice() : [];
        this.preventSelectionSetterPropagation = true;
        this.updateSelectionKeys();
        this.selectionChange.emit(this._selection);
        this.tableService.onSelectionChange();
        this.onHeaderCheckboxToggle.emit({ originalEvent: event, checked: check });
        if (this.isStateful()) {
            this.saveState();
        }
    }
    equals(data1, data2) {
        return this.compareSelectionBy === 'equals' ? (data1 === data2) : ObjectUtils.equals(data1, data2, this.dataKey);
    }
    filter(value, field, matchMode) {
        if (this.filterTimeout) {
            clearTimeout(this.filterTimeout);
        }
        if (!this.isFilterBlank(value)) {
            this.filters[field] = { value: value, matchMode: matchMode };
        }
        else if (this.filters[field]) {
            delete this.filters[field];
        }
        this.filterTimeout = setTimeout(() => {
            this._filter();
            this.filterTimeout = null;
        }, this.filterDelay);
        this.anchorRowIndex = null;
    }
    filterGlobal(value, matchMode) {
        this.filter(value, 'global', matchMode);
    }
    isFilterBlank(filter) {
        if (filter !== null && filter !== undefined) {
            if ((typeof filter === 'string' && filter.trim().length == 0) || (filter instanceof Array && filter.length == 0))
                return true;
            else
                return false;
        }
        return true;
    }
    _filter() {
        if (!this.restoringFilter) {
            this.first = 0;
            this.firstChange.emit(this.first);
        }
        if (this.lazy) {
            this.onLazyLoad.emit(this.createLazyLoadMetadata());
        }
        else {
            if (!this.value) {
                return;
            }
            if (!this.hasFilter()) {
                this.filteredValue = null;
                if (this.paginator) {
                    this.totalRecords = this.value ? this.value.length : 0;
                }
            }
            else {
                let globalFilterFieldsArray;
                if (this.filters['global']) {
                    if (!this.columns && !this.globalFilterFields)
                        throw new Error('Global filtering requires dynamic columns or globalFilterFields to be defined.');
                    else
                        globalFilterFieldsArray = this.globalFilterFields || this.columns;
                }
                this.filteredValue = [];
                for (let i = 0; i < this.value.length; i++) {
                    let localMatch = true;
                    let globalMatch = false;
                    let localFiltered = false;
                    for (let prop in this.filters) {
                        if (this.filters.hasOwnProperty(prop) && prop !== 'global') {
                            localFiltered = true;
                            let filterMeta = this.filters[prop];
                            let filterField = prop;
                            let filterValue = filterMeta.value;
                            let filterMatchMode = filterMeta.matchMode || 'startsWith';
                            let dataFieldValue = ObjectUtils.resolveFieldData(this.value[i], filterField);
                            let filterConstraint = FilterUtils[filterMatchMode];
                            if (!filterConstraint(dataFieldValue, filterValue, this.filterLocale)) {
                                localMatch = false;
                            }
                            if (!localMatch) {
                                break;
                            }
                        }
                    }
                    if (this.filters['global'] && !globalMatch && globalFilterFieldsArray) {
                        for (let j = 0; j < globalFilterFieldsArray.length; j++) {
                            let globalFilterField = globalFilterFieldsArray[j].field || globalFilterFieldsArray[j];
                            globalMatch = FilterUtils[this.filters['global'].matchMode](ObjectUtils.resolveFieldData(this.value[i], globalFilterField), this.filters['global'].value, this.filterLocale);
                            if (globalMatch) {
                                break;
                            }
                        }
                    }
                    let matches;
                    if (this.filters['global']) {
                        matches = localFiltered ? (localFiltered && localMatch && globalMatch) : globalMatch;
                    }
                    else {
                        matches = localFiltered && localMatch;
                    }
                    if (matches) {
                        this.filteredValue.push(this.value[i]);
                    }
                }
                if (this.filteredValue.length === this.value.length) {
                    this.filteredValue = null;
                }
                if (this.paginator) {
                    this.totalRecords = this.filteredValue ? this.filteredValue.length : this.value ? this.value.length : 0;
                }
            }
        }
        this.onFilter.emit({
            filters: this.filters,
            filteredValue: this.filteredValue || this.value
        });
        this.tableService.onValueChange(this.value);
        if (this.isStateful() && !this.restoringFilter) {
            this.saveState();
        }
        if (this.restoringFilter) {
            this.restoringFilter = false;
        }
        this.cd.markForCheck();
        if (this.scrollable) {
            this.resetScrollTop();
        }
    }
    hasFilter() {
        let empty = true;
        for (let prop in this.filters) {
            if (this.filters.hasOwnProperty(prop)) {
                empty = false;
                break;
            }
        }
        return !empty;
    }
    createLazyLoadMetadata() {
        return {
            first: this.first,
            rows: this.rows,
            sortField: this.sortField,
            sortOrder: this.sortOrder,
            filters: this.filters,
            globalFilter: this.filters && this.filters['global'] ? this.filters['global'].value : null,
            multiSortMeta: this.multiSortMeta
        };
    }
    reset() {
        this._sortField = null;
        this._sortOrder = this.defaultSortOrder;
        this._multiSortMeta = null;
        this.tableService.onSort(null);
        this.filteredValue = null;
        this.filters = {};
        this.first = 0;
        this.firstChange.emit(this.first);
        if (this.lazy) {
            this.onLazyLoad.emit(this.createLazyLoadMetadata());
        }
        else {
            this.totalRecords = (this._value ? this._value.length : 0);
        }
    }
    exportCSV(options) {
        let data = this.filteredValue || this.value;
        let csv = '';
        if (options && options.selectionOnly) {
            data = this.selection || [];
        }
        //headers
        for (let i = 0; i < this.columns.length; i++) {
            let column = this.columns[i];
            if (column.exportable !== false && column.field) {
                csv += '"' + (column.header || column.field) + '"';
                if (i < (this.columns.length - 1)) {
                    csv += this.csvSeparator;
                }
            }
        }
        //body
        data.forEach((record, i) => {
            csv += '\n';
            for (let i = 0; i < this.columns.length; i++) {
                let column = this.columns[i];
                if (column.exportable !== false && column.field) {
                    let cellData = ObjectUtils.resolveFieldData(record, column.field);
                    if (cellData != null) {
                        if (this.exportFunction) {
                            cellData = this.exportFunction({
                                data: cellData,
                                field: column.field
                            });
                        }
                        else
                            cellData = String(cellData).replace(/"/g, '""');
                    }
                    else
                        cellData = '';
                    csv += '"' + cellData + '"';
                    if (i < (this.columns.length - 1)) {
                        csv += this.csvSeparator;
                    }
                }
            }
        });
        let blob = new Blob([csv], {
            type: 'text/csv;charset=utf-8;'
        });
        if (window.navigator.msSaveOrOpenBlob) {
            navigator.msSaveOrOpenBlob(blob, this.exportFilename + '.csv');
        }
        else {
            let link = document.createElement("a");
            link.style.display = 'none';
            document.body.appendChild(link);
            if (link.download !== undefined) {
                link.setAttribute('href', URL.createObjectURL(blob));
                link.setAttribute('download', this.exportFilename + '.csv');
                link.click();
            }
            else {
                csv = 'data:text/csv;charset=utf-8,' + csv;
                window.open(encodeURI(csv));
            }
            document.body.removeChild(link);
        }
    }
    resetScrollTop() {
        if (this.virtualScroll)
            this.scrollToVirtualIndex(0);
        else
            this.scrollTo({ top: 0 });
    }
    scrollToVirtualIndex(index) {
        if (this.scrollableViewChild) {
            this.scrollableViewChild.scrollToVirtualIndex(index);
        }
        if (this.scrollableFrozenViewChild) {
            this.scrollableFrozenViewChild.scrollToVirtualIndex(index);
        }
    }
    scrollTo(options) {
        if (this.scrollableViewChild) {
            this.scrollableViewChild.scrollTo(options);
        }
        if (this.scrollableFrozenViewChild) {
            this.scrollableFrozenViewChild.scrollTo(options);
        }
    }
    updateEditingCell(cell, data, field, index) {
        this.editingCell = cell;
        this.editingCellData = data;
        this.editingCellField = field;
        this.editingCellRowIndex = index;
        this.bindDocumentEditListener();
    }
    isEditingCellValid() {
        return (this.editingCell && DomHandler.find(this.editingCell, '.ng-invalid.ng-dirty').length === 0);
    }
    bindDocumentEditListener() {
        if (!this.documentEditListener) {
            this.documentEditListener = (event) => {
                if (this.editingCell && !this.editingCellClick && this.isEditingCellValid()) {
                    DomHandler.removeClass(this.editingCell, 'p-cell-editing');
                    this.editingCell = null;
                    this.onEditComplete.emit({ field: this.editingCellField, data: this.editingCellData, originalEvent: event, index: this.editingCellRowIndex });
                    this.editingCellField = null;
                    this.editingCellData = null;
                    this.editingCellRowIndex = null;
                    this.unbindDocumentEditListener();
                }
                this.editingCellClick = false;
            };
            document.addEventListener('click', this.documentEditListener);
        }
    }
    unbindDocumentEditListener() {
        if (this.documentEditListener) {
            document.removeEventListener('click', this.documentEditListener);
            this.documentEditListener = null;
        }
    }
    initRowEdit(rowData) {
        let dataKeyValue = String(ObjectUtils.resolveFieldData(rowData, this.dataKey));
        this.editingRowKeys[dataKeyValue] = true;
    }
    saveRowEdit(rowData, rowElement) {
        if (DomHandler.find(rowElement, '.ng-invalid.ng-dirty').length === 0) {
            let dataKeyValue = String(ObjectUtils.resolveFieldData(rowData, this.dataKey));
            delete this.editingRowKeys[dataKeyValue];
        }
    }
    cancelRowEdit(rowData) {
        let dataKeyValue = String(ObjectUtils.resolveFieldData(rowData, this.dataKey));
        delete this.editingRowKeys[dataKeyValue];
    }
    toggleRow(rowData, event) {
        if (!this.dataKey) {
            throw new Error('dataKey must be defined to use row expansion');
        }
        let dataKeyValue = String(ObjectUtils.resolveFieldData(rowData, this.dataKey));
        if (this.expandedRowKeys[dataKeyValue] != null) {
            delete this.expandedRowKeys[dataKeyValue];
            this.onRowCollapse.emit({
                originalEvent: event,
                data: rowData
            });
        }
        else {
            if (this.rowExpandMode === 'single') {
                this.expandedRowKeys = {};
            }
            this.expandedRowKeys[dataKeyValue] = true;
            this.onRowExpand.emit({
                originalEvent: event,
                data: rowData
            });
        }
        if (event) {
            event.preventDefault();
        }
        if (this.isStateful()) {
            this.saveState();
        }
    }
    isRowExpanded(rowData) {
        return this.expandedRowKeys[String(ObjectUtils.resolveFieldData(rowData, this.dataKey))] === true;
    }
    isRowEditing(rowData) {
        return this.editingRowKeys[String(ObjectUtils.resolveFieldData(rowData, this.dataKey))] === true;
    }
    isSingleSelectionMode() {
        return this.selectionMode === 'single';
    }
    isMultipleSelectionMode() {
        return this.selectionMode === 'multiple';
    }
    onColumnResizeBegin(event) {
        let containerLeft = DomHandler.getOffset(this.containerViewChild.nativeElement).left;
        this.lastResizerHelperX = (event.pageX - containerLeft + this.containerViewChild.nativeElement.scrollLeft);
        this.onColumnResize(event);
        event.preventDefault();
    }
    onColumnResize(event) {
        let containerLeft = DomHandler.getOffset(this.containerViewChild.nativeElement).left;
        DomHandler.addClass(this.containerViewChild.nativeElement, 'p-unselectable-text');
        this.resizeHelperViewChild.nativeElement.style.height = this.containerViewChild.nativeElement.offsetHeight + 'px';
        this.resizeHelperViewChild.nativeElement.style.top = 0 + 'px';
        this.resizeHelperViewChild.nativeElement.style.left = (event.pageX - containerLeft + this.containerViewChild.nativeElement.scrollLeft) + 'px';
        this.resizeHelperViewChild.nativeElement.style.display = 'block';
    }
    onColumnResizeEnd(event, column) {
        let delta = this.resizeHelperViewChild.nativeElement.offsetLeft - this.lastResizerHelperX;
        let columnWidth = column.offsetWidth;
        let minWidth = parseInt(column.style.minWidth || 15);
        if (columnWidth + delta < minWidth) {
            delta = minWidth - columnWidth;
        }
        const newColumnWidth = columnWidth + delta;
        if (newColumnWidth >= minWidth) {
            if (this.columnResizeMode === 'fit') {
                let nextColumn = column.nextElementSibling;
                while (!nextColumn.offsetParent) {
                    nextColumn = nextColumn.nextElementSibling;
                }
                if (nextColumn) {
                    let nextColumnWidth = nextColumn.offsetWidth - delta;
                    let nextColumnMinWidth = nextColumn.style.minWidth || 15;
                    if (newColumnWidth > 15 && nextColumnWidth > parseInt(nextColumnMinWidth)) {
                        if (this.scrollable) {
                            let scrollableView = this.findParentScrollableView(column);
                            let scrollableBodyTable = DomHandler.findSingle(scrollableView, '.p-datatable-scrollable-body table');
                            let scrollableHeaderTable = DomHandler.findSingle(scrollableView, 'table.p-datatable-scrollable-header-table');
                            let scrollableFooterTable = DomHandler.findSingle(scrollableView, 'table.p-datatable-scrollable-footer-table');
                            let resizeColumnIndex = DomHandler.index(column);
                            this.resizeColGroup(scrollableHeaderTable, resizeColumnIndex, newColumnWidth, nextColumnWidth);
                            this.resizeColGroup(scrollableBodyTable, resizeColumnIndex, newColumnWidth, nextColumnWidth);
                            this.resizeColGroup(scrollableFooterTable, resizeColumnIndex, newColumnWidth, nextColumnWidth);
                        }
                        else {
                            column.style.width = newColumnWidth + 'px';
                            if (nextColumn) {
                                nextColumn.style.width = nextColumnWidth + 'px';
                            }
                        }
                    }
                }
            }
            else if (this.columnResizeMode === 'expand') {
                if (newColumnWidth > minWidth) {
                    if (this.scrollable) {
                        this.setScrollableItemsWidthOnExpandResize(column, newColumnWidth, delta);
                    }
                    else {
                        this.tableViewChild.nativeElement.style.width = this.tableViewChild.nativeElement.offsetWidth + delta + 'px';
                        column.style.width = newColumnWidth + 'px';
                        let containerWidth = this.tableViewChild.nativeElement.style.width;
                        this.containerViewChild.nativeElement.style.width = containerWidth + 'px';
                    }
                }
            }
            this.onColResize.emit({
                element: column,
                delta: delta
            });
            if (this.isStateful()) {
                this.saveState();
            }
        }
        this.resizeHelperViewChild.nativeElement.style.display = 'none';
        DomHandler.removeClass(this.containerViewChild.nativeElement, 'p-unselectable-text');
    }
    setScrollableItemsWidthOnExpandResize(column, newColumnWidth, delta) {
        let scrollableView = column ? this.findParentScrollableView(column) : this.containerViewChild.nativeElement;
        let scrollableBody = DomHandler.findSingle(scrollableView, '.p-datatable-scrollable-body');
        let scrollableHeader = DomHandler.findSingle(scrollableView, '.p-datatable-scrollable-header');
        let scrollableFooter = DomHandler.findSingle(scrollableView, '.p-datatable-scrollable-footer');
        let scrollableBodyTable = DomHandler.findSingle(scrollableBody, '.p-datatable-scrollable-body table');
        let scrollableHeaderTable = DomHandler.findSingle(scrollableHeader, 'table.p-datatable-scrollable-header-table');
        let scrollableFooterTable = DomHandler.findSingle(scrollableFooter, 'table.p-datatable-scrollable-footer-table');
        const scrollableBodyTableWidth = column ? scrollableBodyTable.offsetWidth + delta : newColumnWidth;
        const scrollableHeaderTableWidth = column ? scrollableHeaderTable.offsetWidth + delta : newColumnWidth;
        const isContainerInViewport = this.containerViewChild.nativeElement.offsetWidth >= scrollableBodyTableWidth;
        let setWidth = (container, table, width, isContainerInViewport) => {
            if (container && table) {
                container.style.width = isContainerInViewport ? width + DomHandler.calculateScrollbarWidth(scrollableBody) + 'px' : 'auto';
                table.style.width = width + 'px';
            }
        };
        setWidth(scrollableBody, scrollableBodyTable, scrollableBodyTableWidth, isContainerInViewport);
        setWidth(scrollableHeader, scrollableHeaderTable, scrollableHeaderTableWidth, isContainerInViewport);
        setWidth(scrollableFooter, scrollableFooterTable, scrollableHeaderTableWidth, isContainerInViewport);
        if (column) {
            let resizeColumnIndex = DomHandler.index(column);
            this.resizeColGroup(scrollableHeaderTable, resizeColumnIndex, newColumnWidth, null);
            this.resizeColGroup(scrollableBodyTable, resizeColumnIndex, newColumnWidth, null);
            this.resizeColGroup(scrollableFooterTable, resizeColumnIndex, newColumnWidth, null);
        }
    }
    findParentScrollableView(column) {
        if (column) {
            let parent = column.parentElement;
            while (parent && !DomHandler.hasClass(parent, 'p-datatable-scrollable-view')) {
                parent = parent.parentElement;
            }
            return parent;
        }
        else {
            return null;
        }
    }
    resizeColGroup(table, resizeColumnIndex, newColumnWidth, nextColumnWidth) {
        if (table) {
            let colGroup = table.children[0].nodeName === 'COLGROUP' ? table.children[0] : null;
            if (colGroup) {
                let col = colGroup.children[resizeColumnIndex];
                let nextCol = col.nextElementSibling;
                col.style.width = newColumnWidth + 'px';
                if (nextCol && nextColumnWidth) {
                    nextCol.style.width = nextColumnWidth + 'px';
                }
            }
            else {
                throw "Scrollable tables require a colgroup to support resizable columns";
            }
        }
    }
    onColumnDragStart(event, columnElement) {
        this.reorderIconWidth = DomHandler.getHiddenElementOuterWidth(this.reorderIndicatorUpViewChild.nativeElement);
        this.reorderIconHeight = DomHandler.getHiddenElementOuterHeight(this.reorderIndicatorDownViewChild.nativeElement);
        this.draggedColumn = columnElement;
        event.dataTransfer.setData('text', 'b'); // For firefox
    }
    onColumnDragEnter(event, dropHeader) {
        if (this.reorderableColumns && this.draggedColumn && dropHeader) {
            event.preventDefault();
            let containerOffset = DomHandler.getOffset(this.containerViewChild.nativeElement);
            let dropHeaderOffset = DomHandler.getOffset(dropHeader);
            if (this.draggedColumn != dropHeader) {
                let dragIndex = DomHandler.indexWithinGroup(this.draggedColumn, 'preorderablecolumn');
                let dropIndex = DomHandler.indexWithinGroup(dropHeader, 'preorderablecolumn');
                let targetLeft = dropHeaderOffset.left - containerOffset.left;
                let targetTop = containerOffset.top - dropHeaderOffset.top;
                let columnCenter = dropHeaderOffset.left + dropHeader.offsetWidth / 2;
                this.reorderIndicatorUpViewChild.nativeElement.style.top = dropHeaderOffset.top - containerOffset.top - (this.reorderIconHeight - 1) + 'px';
                this.reorderIndicatorDownViewChild.nativeElement.style.top = dropHeaderOffset.top - containerOffset.top + dropHeader.offsetHeight + 'px';
                if (event.pageX > columnCenter) {
                    this.reorderIndicatorUpViewChild.nativeElement.style.left = (targetLeft + dropHeader.offsetWidth - Math.ceil(this.reorderIconWidth / 2)) + 'px';
                    this.reorderIndicatorDownViewChild.nativeElement.style.left = (targetLeft + dropHeader.offsetWidth - Math.ceil(this.reorderIconWidth / 2)) + 'px';
                    this.dropPosition = 1;
                }
                else {
                    this.reorderIndicatorUpViewChild.nativeElement.style.left = (targetLeft - Math.ceil(this.reorderIconWidth / 2)) + 'px';
                    this.reorderIndicatorDownViewChild.nativeElement.style.left = (targetLeft - Math.ceil(this.reorderIconWidth / 2)) + 'px';
                    this.dropPosition = -1;
                }
                if ((dropIndex - dragIndex === 1 && this.dropPosition === -1) || (dropIndex - dragIndex === -1 && this.dropPosition === 1)) {
                    this.reorderIndicatorUpViewChild.nativeElement.style.display = 'none';
                    this.reorderIndicatorDownViewChild.nativeElement.style.display = 'none';
                }
                else {
                    this.reorderIndicatorUpViewChild.nativeElement.style.display = 'block';
                    this.reorderIndicatorDownViewChild.nativeElement.style.display = 'block';
                }
            }
            else {
                event.dataTransfer.dropEffect = 'none';
            }
        }
    }
    onColumnDragLeave(event) {
        if (this.reorderableColumns && this.draggedColumn) {
            event.preventDefault();
            this.reorderIndicatorUpViewChild.nativeElement.style.display = 'none';
            this.reorderIndicatorDownViewChild.nativeElement.style.display = 'none';
        }
    }
    onColumnDrop(event, dropColumn) {
        event.preventDefault();
        if (this.draggedColumn) {
            let dragIndex = DomHandler.indexWithinGroup(this.draggedColumn, 'preorderablecolumn');
            let dropIndex = DomHandler.indexWithinGroup(dropColumn, 'preorderablecolumn');
            let allowDrop = (dragIndex != dropIndex);
            if (allowDrop && ((dropIndex - dragIndex == 1 && this.dropPosition === -1) || (dragIndex - dropIndex == 1 && this.dropPosition === 1))) {
                allowDrop = false;
            }
            if (allowDrop && ((dropIndex < dragIndex && this.dropPosition === 1))) {
                dropIndex = dropIndex + 1;
            }
            if (allowDrop && ((dropIndex > dragIndex && this.dropPosition === -1))) {
                dropIndex = dropIndex - 1;
            }
            if (allowDrop) {
                ObjectUtils.reorderArray(this.columns, dragIndex, dropIndex);
                this.onColReorder.emit({
                    dragIndex: dragIndex,
                    dropIndex: dropIndex,
                    columns: this.columns
                });
                if (this.isStateful()) {
                    this.zone.runOutsideAngular(() => {
                        setTimeout(() => {
                            this.saveState();
                        });
                    });
                }
            }
            this.reorderIndicatorUpViewChild.nativeElement.style.display = 'none';
            this.reorderIndicatorDownViewChild.nativeElement.style.display = 'none';
            this.draggedColumn.draggable = false;
            this.draggedColumn = null;
            this.dropPosition = null;
        }
    }
    onRowDragStart(event, index) {
        this.rowDragging = true;
        this.draggedRowIndex = index;
        event.dataTransfer.setData('text', 'b'); // For firefox
    }
    onRowDragOver(event, index, rowElement) {
        if (this.rowDragging && this.draggedRowIndex !== index) {
            let rowY = DomHandler.getOffset(rowElement).top + DomHandler.getWindowScrollTop();
            let pageY = event.pageY;
            let rowMidY = rowY + DomHandler.getOuterHeight(rowElement) / 2;
            let prevRowElement = rowElement.previousElementSibling;
            if (pageY < rowMidY) {
                DomHandler.removeClass(rowElement, 'p-datatable-dragpoint-bottom');
                this.droppedRowIndex = index;
                if (prevRowElement)
                    DomHandler.addClass(prevRowElement, 'p-datatable-dragpoint-bottom');
                else
                    DomHandler.addClass(rowElement, 'p-datatable-dragpoint-top');
            }
            else {
                if (prevRowElement)
                    DomHandler.removeClass(prevRowElement, 'p-datatable-dragpoint-bottom');
                else
                    DomHandler.addClass(rowElement, 'p-datatable-dragpoint-top');
                this.droppedRowIndex = index + 1;
                DomHandler.addClass(rowElement, 'p-datatable-dragpoint-bottom');
            }
        }
    }
    onRowDragLeave(event, rowElement) {
        let prevRowElement = rowElement.previousElementSibling;
        if (prevRowElement) {
            DomHandler.removeClass(prevRowElement, 'p-datatable-dragpoint-bottom');
        }
        DomHandler.removeClass(rowElement, 'p-datatable-dragpoint-bottom');
        DomHandler.removeClass(rowElement, 'p-datatable-dragpoint-top');
    }
    onRowDragEnd(event) {
        this.rowDragging = false;
        this.draggedRowIndex = null;
        this.droppedRowIndex = null;
    }
    onRowDrop(event, rowElement) {
        if (this.droppedRowIndex != null) {
            let dropIndex = (this.draggedRowIndex > this.droppedRowIndex) ? this.droppedRowIndex : (this.droppedRowIndex === 0) ? 0 : this.droppedRowIndex - 1;
            ObjectUtils.reorderArray(this.value, this.draggedRowIndex, dropIndex);
            this.onRowReorder.emit({
                dragIndex: this.draggedRowIndex,
                dropIndex: dropIndex
            });
        }
        //cleanup
        this.onRowDragLeave(event, rowElement);
        this.onRowDragEnd(event);
    }
    isEmpty() {
        let data = this.filteredValue || this.value;
        return data == null || data.length == 0;
    }
    getBlockableElement() {
        return this.el.nativeElement.children[0];
    }
    getStorage() {
        switch (this.stateStorage) {
            case 'local':
                return window.localStorage;
            case 'session':
                return window.sessionStorage;
            default:
                throw new Error(this.stateStorage + ' is not a valid value for the state storage, supported values are "local" and "session".');
        }
    }
    isStateful() {
        return this.stateKey != null;
    }
    saveState() {
        const storage = this.getStorage();
        let state = {};
        if (this.paginator) {
            state.first = this.first;
            state.rows = this.rows;
        }
        if (this.sortField) {
            state.sortField = this.sortField;
            state.sortOrder = this.sortOrder;
        }
        if (this.multiSortMeta) {
            state.multiSortMeta = this.multiSortMeta;
        }
        if (this.hasFilter()) {
            state.filters = this.filters;
        }
        if (this.resizableColumns) {
            this.saveColumnWidths(state);
        }
        if (this.reorderableColumns) {
            this.saveColumnOrder(state);
        }
        if (this.selection) {
            state.selection = this.selection;
        }
        if (Object.keys(this.expandedRowKeys).length) {
            state.expandedRowKeys = this.expandedRowKeys;
        }
        if (Object.keys(state).length) {
            storage.setItem(this.stateKey, JSON.stringify(state));
        }
        this.onStateSave.emit(state);
    }
    clearState() {
        const storage = this.getStorage();
        if (this.stateKey) {
            storage.removeItem(this.stateKey);
        }
    }
    restoreState() {
        const storage = this.getStorage();
        const stateString = storage.getItem(this.stateKey);
        if (stateString) {
            let state = JSON.parse(stateString);
            if (this.paginator) {
                this.first = state.first;
                this.rows = state.rows;
                this.firstChange.emit(this.first);
                this.rowsChange.emit(this.rows);
            }
            if (state.sortField) {
                this.restoringSort = true;
                this._sortField = state.sortField;
                this._sortOrder = state.sortOrder;
            }
            if (state.multiSortMeta) {
                this.restoringSort = true;
                this._multiSortMeta = state.multiSortMeta;
            }
            if (state.filters) {
                this.restoringFilter = true;
                this.filters = state.filters;
            }
            if (this.resizableColumns) {
                this.columnWidthsState = state.columnWidths;
                this.tableWidthState = state.tableWidth;
            }
            if (state.expandedRowKeys) {
                this.expandedRowKeys = state.expandedRowKeys;
            }
            if (state.selection) {
                Promise.resolve(null).then(() => this.selectionChange.emit(state.selection));
            }
            this.stateRestored = true;
            this.onStateRestore.emit(state);
        }
    }
    saveColumnWidths(state) {
        let widths = [];
        let headers = DomHandler.find(this.containerViewChild.nativeElement, '.p-datatable-thead > tr:first-child > th');
        headers.map(header => widths.push(DomHandler.getOuterWidth(header)));
        state.columnWidths = widths.join(',');
        if (this.columnResizeMode === 'expand') {
            state.tableWidth = this.scrollable ? DomHandler.findSingle(this.containerViewChild.nativeElement, '.p-datatable-scrollable-header-table').style.width :
                DomHandler.getOuterWidth(this.tableViewChild.nativeElement) + 'px';
        }
    }
    restoreColumnWidths() {
        if (this.columnWidthsState) {
            let widths = this.columnWidthsState.split(',');
            if (this.columnResizeMode === 'expand' && this.tableWidthState) {
                if (this.scrollable) {
                    this.setScrollableItemsWidthOnExpandResize(null, this.tableWidthState, 0);
                }
                else {
                    this.tableViewChild.nativeElement.style.width = this.tableWidthState;
                    this.containerViewChild.nativeElement.style.width = this.tableWidthState;
                }
            }
            if (this.scrollable) {
                let headerCols = DomHandler.find(this.containerViewChild.nativeElement, '.p-datatable-scrollable-header-table > colgroup > col');
                let bodyCols = DomHandler.find(this.containerViewChild.nativeElement, '.p-datatable-scrollable-body table > colgroup > col');
                headerCols.map((col, index) => col.style.width = widths[index] + 'px');
                bodyCols.map((col, index) => col.style.width = widths[index] + 'px');
            }
            else {
                let headers = DomHandler.find(this.tableViewChild.nativeElement, '.p-datatable-thead > tr:first-child > th');
                headers.map((header, index) => header.style.width = widths[index] + 'px');
            }
        }
    }
    saveColumnOrder(state) {
        if (this.columns) {
            let columnOrder = [];
            this.columns.map(column => {
                columnOrder.push(column.field || column.key);
            });
            state.columnOrder = columnOrder;
        }
    }
    restoreColumnOrder() {
        const storage = this.getStorage();
        const stateString = storage.getItem(this.stateKey);
        if (stateString) {
            let state = JSON.parse(stateString);
            let columnOrder = state.columnOrder;
            if (columnOrder) {
                let reorderedColumns = [];
                columnOrder.map(key => reorderedColumns.push(this.findColumnByKey(key)));
                this.columnOrderStateRestored = true;
                this.columns = reorderedColumns;
            }
        }
    }
    findColumnByKey(key) {
        if (this.columns) {
            for (let col of this.columns) {
                if (col.key === key || col.field === key)
                    return col;
                else
                    continue;
            }
        }
        else {
            return null;
        }
    }
    ngOnDestroy() {
        this.unbindDocumentEditListener();
        this.editingCell = null;
        this.initialized = null;
    }
}
Table.ctorParameters = () => [
    { type: ElementRef },
    { type: NgZone },
    { type: TableService },
    { type: ChangeDetectorRef }
];
Table.decorators = [
    { type: Component, args: [{
                selector: 'p-table',
                template: `
        <div #container [ngStyle]="style" [class]="styleClass"
            [ngClass]="{'p-datatable p-component': true, 
                'p-datatable-hoverable-rows': (rowHover||selectionMode),
                'p-datatable-auto-layout': autoLayout,
                'p-datatable-resizable': resizableColumns,
                'p-datatable-resizable-fit': (resizableColumns && columnResizeMode === 'fit'),
                'p-datatable-scrollable': scrollable,
                'p-datatable-flex-scrollable': (scrollable && scrollHeight === 'flex'),
                'p-datatable-responsive': responsive}">
            <div class="p-datatable-loading-overlay p-component-overlay" *ngIf="loading && showLoader">
                <i [class]="'p-datatable-loading-icon pi-spin ' + loadingIcon"></i>
            </div>
            <div *ngIf="captionTemplate" class="p-datatable-header">
                <ng-container *ngTemplateOutlet="captionTemplate"></ng-container>
            </div>
            <p-paginator [rows]="rows" [first]="first" [totalRecords]="totalRecords" [pageLinkSize]="pageLinks" styleClass="p-paginator-top" [alwaysShow]="alwaysShowPaginator"
                (onPageChange)="onPageChange($event)" [rowsPerPageOptions]="rowsPerPageOptions" *ngIf="paginator && (paginatorPosition === 'top' || paginatorPosition =='both')"
                [templateLeft]="paginatorLeftTemplate" [templateRight]="paginatorRightTemplate" [dropdownAppendTo]="paginatorDropdownAppendTo" [dropdownScrollHeight]="paginatorDropdownScrollHeight"
                [currentPageReportTemplate]="currentPageReportTemplate" [showCurrentPageReport]="showCurrentPageReport"></p-paginator>

            <div class="p-datatable-wrapper" *ngIf="!scrollable">
                <table role="grid" #table [ngClass]="tableStyleClass" [ngStyle]="tableStyle">
                    <ng-container *ngTemplateOutlet="colGroupTemplate; context {$implicit: columns}"></ng-container>
                    <thead class="p-datatable-thead">
                        <ng-container *ngTemplateOutlet="headerTemplate; context: {$implicit: columns}"></ng-container>
                    </thead>
                    <tbody class="p-datatable-tbody" [pTableBody]="columns" [pTableBodyTemplate]="bodyTemplate"></tbody>
                    <tfoot *ngIf="footerTemplate" class="p-datatable-tfoot">
                        <ng-container *ngTemplateOutlet="footerTemplate; context {$implicit: columns}"></ng-container>
                    </tfoot>
                </table>
            </div>

            <div class="p-datatable-scrollable-wrapper" *ngIf="scrollable">
               <div class="p-datatable-scrollable-view p-datatable-frozen-view" *ngIf="frozenColumns||frozenBodyTemplate" #scrollableFrozenView [pScrollableView]="frozenColumns" [frozen]="true" [ngStyle]="{width: frozenWidth}" [scrollHeight]="scrollHeight"></div>
               <div class="p-datatable-scrollable-view" #scrollableView [pScrollableView]="columns" [frozen]="false" [scrollHeight]="scrollHeight" [ngStyle]="{left: frozenWidth, width: 'calc(100% - '+frozenWidth+')'}"></div>
            </div>

            <p-paginator [rows]="rows" [first]="first" [totalRecords]="totalRecords" [pageLinkSize]="pageLinks" styleClass="p-paginator-bottom" [alwaysShow]="alwaysShowPaginator"
                (onPageChange)="onPageChange($event)" [rowsPerPageOptions]="rowsPerPageOptions" *ngIf="paginator && (paginatorPosition === 'bottom' || paginatorPosition =='both')"
                [templateLeft]="paginatorLeftTemplate" [templateRight]="paginatorRightTemplate" [dropdownAppendTo]="paginatorDropdownAppendTo" [dropdownScrollHeight]="paginatorDropdownScrollHeight"
                [currentPageReportTemplate]="currentPageReportTemplate" [showCurrentPageReport]="showCurrentPageReport"></p-paginator>

            <div *ngIf="summaryTemplate" class="p-datatable-footer">
                <ng-container *ngTemplateOutlet="summaryTemplate"></ng-container>
            </div>

            <div #resizeHelper class="p-column-resizer-helper" style="display:none" *ngIf="resizableColumns"></div>
            <span #reorderIndicatorUp class="pi pi-arrow-down p-datatable-reorder-indicator-up" style="display:none" *ngIf="reorderableColumns"></span>
            <span #reorderIndicatorDown class="pi pi-arrow-up p-datatable-reorder-indicator-down" style="display:none" *ngIf="reorderableColumns"></span>
        </div>
    `,
                providers: [TableService],
                changeDetection: ChangeDetectionStrategy.Default,
                encapsulation: ViewEncapsulation.None,
                styles: [".p-datatable{position:relative}.p-datatable table{border-collapse:collapse;width:100%;table-layout:fixed}.p-datatable .p-sortable-column{cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.p-datatable .p-sortable-column .p-column-title,.p-datatable .p-sortable-column .p-sortable-column-badge,.p-datatable .p-sortable-column .p-sortable-column-icon{vertical-align:middle}.p-datatable .p-sortable-column .p-sortable-column-badge{display:-ms-inline-flexbox;display:inline-flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center}.p-datatable-auto-layout>.p-datatable-wrapper{overflow-x:auto}.p-datatable-auto-layout>.p-datatable-wrapper>table{table-layout:auto}.p-datatable-hoverable-rows .p-selectable-row{cursor:pointer}.p-datatable-scrollable-wrapper{position:relative}.p-datatable-scrollable-footer,.p-datatable-scrollable-header{overflow:hidden}.p-datatable-scrollable-body{overflow:auto;position:relative}.p-datatable-scrollable-body>table>.p-datatable-tbody>tr:first-child>td{border-top:0}.p-datatable-virtual-table{position:absolute}.p-datatable-frozen-view .p-datatable-scrollable-body{overflow:hidden}.p-datatable-frozen-view>.p-datatable-scrollable-body>table>.p-datatable-tbody>tr>td:last-child{border-right:0}.p-datatable-unfrozen-view{position:absolute;top:0}.p-datatable-flex-scrollable,.p-datatable-flex-scrollable .p-datatable-scrollable-view,.p-datatable-flex-scrollable .p-datatable-scrollable-wrapper{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;-ms-flex:1;flex:1;height:100%}.p-datatable-flex-scrollable .p-datatable-scrollable-body,.p-datatable-flex-scrollable .p-datatable-virtual-scrollable-body{-ms-flex:1;flex:1}.p-datatable-resizable>.p-datatable-wrapper{overflow-x:auto}.p-datatable-resizable .p-datatable-tbody>tr>td,.p-datatable-resizable .p-datatable-tfoot>tr>td,.p-datatable-resizable .p-datatable-thead>tr>th{overflow:hidden;white-space:nowrap}.p-datatable-resizable .p-resizable-column{background-clip:padding-box;position:relative}.p-datatable-resizable-fit .p-resizable-column:last-child .p-column-resizer{display:none}.p-datatable .p-column-resizer{display:block;position:absolute!important;top:0;right:0;margin:0;width:.5rem;height:100%;padding:0;cursor:col-resize;border:1px solid transparent}.p-datatable .p-column-resizer-helper{width:1px;position:absolute;z-index:10;display:none}.p-datatable .p-row-editor-cancel,.p-datatable .p-row-editor-init,.p-datatable .p-row-editor-save,.p-datatable .p-row-toggler{display:-ms-inline-flexbox;display:inline-flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;overflow:hidden;position:relative}.p-datatable-reorder-indicator-down,.p-datatable-reorder-indicator-up{position:absolute;display:none}.p-datatable .p-datatable-loading-overlay{position:absolute;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;z-index:2}.p-datatable.p-datatable-responsive .p-datatable-tbody>tr>td .p-column-title{display:none}@media screen and (max-width:40em){.p-datatable.p-datatable-responsive .p-datatable-tfoot>tr>td,.p-datatable.p-datatable-responsive .p-datatable-thead>tr>th{display:none!important}.p-datatable.p-datatable-responsive .p-datatable-tbody>tr>td{text-align:left;display:block;width:100%;float:left;clear:left;border:0}.p-datatable.p-datatable-responsive .p-datatable-tbody>tr>td .p-column-title{padding:.4rem;min-width:30%;display:inline-block;margin:-.4em 1em -.4em -.4rem;font-weight:700}}"]
            },] }
];
Table.ctorParameters = () => [
    { type: ElementRef },
    { type: NgZone },
    { type: TableService },
    { type: ChangeDetectorRef }
];
Table.propDecorators = {
    frozenColumns: [{ type: Input }],
    frozenValue: [{ type: Input }],
    style: [{ type: Input }],
    styleClass: [{ type: Input }],
    tableStyle: [{ type: Input }],
    tableStyleClass: [{ type: Input }],
    paginator: [{ type: Input }],
    pageLinks: [{ type: Input }],
    rowsPerPageOptions: [{ type: Input }],
    alwaysShowPaginator: [{ type: Input }],
    paginatorPosition: [{ type: Input }],
    paginatorDropdownAppendTo: [{ type: Input }],
    paginatorDropdownScrollHeight: [{ type: Input }],
    currentPageReportTemplate: [{ type: Input }],
    showCurrentPageReport: [{ type: Input }],
    defaultSortOrder: [{ type: Input }],
    sortMode: [{ type: Input }],
    resetPageOnSort: [{ type: Input }],
    selectionMode: [{ type: Input }],
    selectionChange: [{ type: Output }],
    contextMenuSelection: [{ type: Input }],
    contextMenuSelectionChange: [{ type: Output }],
    contextMenuSelectionMode: [{ type: Input }],
    dataKey: [{ type: Input }],
    metaKeySelection: [{ type: Input }],
    rowTrackBy: [{ type: Input }],
    lazy: [{ type: Input }],
    lazyLoadOnInit: [{ type: Input }],
    compareSelectionBy: [{ type: Input }],
    csvSeparator: [{ type: Input }],
    exportFilename: [{ type: Input }],
    filters: [{ type: Input }],
    globalFilterFields: [{ type: Input }],
    filterDelay: [{ type: Input }],
    filterLocale: [{ type: Input }],
    expandedRowKeys: [{ type: Input }],
    editingRowKeys: [{ type: Input }],
    rowExpandMode: [{ type: Input }],
    scrollable: [{ type: Input }],
    scrollHeight: [{ type: Input }],
    virtualScroll: [{ type: Input }],
    virtualScrollDelay: [{ type: Input }],
    virtualRowHeight: [{ type: Input }],
    frozenWidth: [{ type: Input }],
    responsive: [{ type: Input }],
    contextMenu: [{ type: Input }],
    resizableColumns: [{ type: Input }],
    columnResizeMode: [{ type: Input }],
    reorderableColumns: [{ type: Input }],
    loading: [{ type: Input }],
    loadingIcon: [{ type: Input }],
    showLoader: [{ type: Input }],
    rowHover: [{ type: Input }],
    customSort: [{ type: Input }],
    autoLayout: [{ type: Input }],
    exportFunction: [{ type: Input }],
    stateKey: [{ type: Input }],
    stateStorage: [{ type: Input }],
    editMode: [{ type: Input }],
    minBufferPx: [{ type: Input }],
    maxBufferPx: [{ type: Input }],
    onRowSelect: [{ type: Output }],
    onRowUnselect: [{ type: Output }],
    onPage: [{ type: Output }],
    onSort: [{ type: Output }],
    onFilter: [{ type: Output }],
    onLazyLoad: [{ type: Output }],
    onRowExpand: [{ type: Output }],
    onRowCollapse: [{ type: Output }],
    onContextMenuSelect: [{ type: Output }],
    onColResize: [{ type: Output }],
    onColReorder: [{ type: Output }],
    onRowReorder: [{ type: Output }],
    onEditInit: [{ type: Output }],
    onEditComplete: [{ type: Output }],
    onEditCancel: [{ type: Output }],
    onHeaderCheckboxToggle: [{ type: Output }],
    sortFunction: [{ type: Output }],
    firstChange: [{ type: Output }],
    rowsChange: [{ type: Output }],
    onStateSave: [{ type: Output }],
    onStateRestore: [{ type: Output }],
    containerViewChild: [{ type: ViewChild, args: ['container',] }],
    resizeHelperViewChild: [{ type: ViewChild, args: ['resizeHelper',] }],
    reorderIndicatorUpViewChild: [{ type: ViewChild, args: ['reorderIndicatorUp',] }],
    reorderIndicatorDownViewChild: [{ type: ViewChild, args: ['reorderIndicatorDown',] }],
    tableViewChild: [{ type: ViewChild, args: ['table',] }],
    scrollableViewChild: [{ type: ViewChild, args: ['scrollableView',] }],
    scrollableFrozenViewChild: [{ type: ViewChild, args: ['scrollableFrozenView',] }],
    templates: [{ type: ContentChildren, args: [PrimeTemplate,] }],
    value: [{ type: Input }],
    columns: [{ type: Input }],
    first: [{ type: Input }],
    rows: [{ type: Input }],
    totalRecords: [{ type: Input }],
    sortField: [{ type: Input }],
    sortOrder: [{ type: Input }],
    multiSortMeta: [{ type: Input }],
    selection: [{ type: Input }]
};
export class TableBody {
    constructor(dt) {
        this.dt = dt;
    }
}
TableBody.ctorParameters = () => [
    { type: Table }
];
TableBody.decorators = [
    { type: Component, args: [{
                selector: '[pTableBody]',
                template: `
        <ng-container *ngIf="!dt.expandedRowTemplate && !dt.virtualScroll">
            <ng-template ngFor let-rowData let-rowIndex="index" [ngForOf]="(dt.paginator && !dt.lazy) ? ((dt.filteredValue||dt.value) | slice:dt.first:(dt.first + dt.rows)) : (dt.filteredValue||dt.value)" [ngForTrackBy]="dt.rowTrackBy">
                <ng-container *ngTemplateOutlet="template; context: {$implicit: rowData, rowIndex: dt.paginator ? (dt.first + rowIndex) : rowIndex, columns: columns, editing: (dt.editMode === 'row' && dt.isRowEditing(rowData))}"></ng-container>
            </ng-template>
        </ng-container>
        <ng-container *ngIf="!dt.expandedRowTemplate && dt.virtualScroll">
            <ng-template cdkVirtualFor let-rowData let-rowIndex="index" [cdkVirtualForOf]="dt.value" [cdkVirtualForTrackBy]="dt.rowTrackBy">
                <ng-container *ngTemplateOutlet="rowData ? template: dt.loadingBodyTemplate; context: {$implicit: rowData, rowIndex: dt.paginator ? (dt.first + rowIndex) : rowIndex, columns: columns, editing: (dt.editMode === 'row' && dt.isRowEditing(rowData))}"></ng-container>
            </ng-template>
        </ng-container>
        <ng-container *ngIf="dt.expandedRowTemplate">
            <ng-template ngFor let-rowData let-rowIndex="index" [ngForOf]="(dt.paginator && !dt.lazy) ? ((dt.filteredValue||dt.value) | slice:dt.first:(dt.first + dt.rows)) : (dt.filteredValue||dt.value)" [ngForTrackBy]="dt.rowTrackBy">
                <ng-container *ngTemplateOutlet="template; context: {$implicit: rowData, rowIndex: dt.paginator ? (dt.first + rowIndex) : rowIndex, columns: columns, expanded: dt.isRowExpanded(rowData), editing: (dt.editMode === 'row' && dt.isRowEditing(rowData))}"></ng-container>
                <ng-container *ngIf="dt.isRowExpanded(rowData)">
                    <ng-container *ngTemplateOutlet="dt.expandedRowTemplate; context: {$implicit: rowData, rowIndex: dt.paginator ? (dt.first + rowIndex) : rowIndex, columns: columns}"></ng-container>
                </ng-container>
            </ng-template>
        </ng-container>
        <ng-container *ngIf="dt.loading">
            <ng-container *ngTemplateOutlet="dt.loadingBodyTemplate; context: {$implicit: columns, frozen: frozen}"></ng-container>
        </ng-container>
        <ng-container *ngIf="dt.isEmpty() && !dt.loading">
            <ng-container *ngTemplateOutlet="dt.emptyMessageTemplate; context: {$implicit: columns, frozen: frozen}"></ng-container>
        </ng-container>
    `,
                changeDetection: ChangeDetectionStrategy.Default,
                encapsulation: ViewEncapsulation.None
            },] }
];
TableBody.ctorParameters = () => [
    { type: Table }
];
TableBody.propDecorators = {
    columns: [{ type: Input, args: ["pTableBody",] }],
    template: [{ type: Input, args: ["pTableBodyTemplate",] }],
    frozen: [{ type: Input }]
};
export class ScrollableView {
    constructor(dt, el, zone) {
        this.dt = dt;
        this.el = el;
        this.zone = zone;
        this.loadedPages = [];
        this.subscription = this.dt.tableService.valueSource$.subscribe(() => {
            this.zone.runOutsideAngular(() => {
                setTimeout(() => {
                    this.alignScrollBar();
                }, 50);
            });
        });
        this.initialized = false;
    }
    get scrollHeight() {
        return this._scrollHeight;
    }
    set scrollHeight(val) {
        this._scrollHeight = val;
        if (val != null && (val.includes('%') || val.includes('calc'))) {
            console.log('Percentage scroll height calculation is removed in favor of the more performant CSS based flex mode, use scrollHeight="flex" instead.');
        }
    }
    ngAfterViewChecked() {
        if (!this.initialized && this.el.nativeElement.offsetParent) {
            this.alignScrollBar();
            this.initialized = true;
        }
    }
    ngAfterViewInit() {
        if (!this.frozen) {
            if (this.dt.frozenColumns || this.dt.frozenBodyTemplate) {
                DomHandler.addClass(this.el.nativeElement, 'p-datatable-unfrozen-view');
            }
            let frozenView = this.el.nativeElement.previousElementSibling;
            if (frozenView) {
                if (this.dt.virtualScroll)
                    this.frozenSiblingBody = DomHandler.findSingle(frozenView, '.p-datatabe-virtual-scrollable-body');
                else
                    this.frozenSiblingBody = DomHandler.findSingle(frozenView, '.p-datatable-scrollable-body');
            }
        }
        else {
            if (this.scrollableAlignerViewChild && this.scrollableAlignerViewChild.nativeElement) {
                this.scrollableAlignerViewChild.nativeElement.style.height = DomHandler.calculateScrollbarHeight() + 'px';
            }
        }
        this.bindEvents();
        this.alignScrollBar();
    }
    bindEvents() {
        this.zone.runOutsideAngular(() => {
            if (this.scrollHeaderViewChild && this.scrollHeaderViewChild.nativeElement) {
                this.headerScrollListener = this.onHeaderScroll.bind(this);
                this.scrollHeaderViewChild.nativeElement.addEventListener('scroll', this.headerScrollListener);
            }
            if (this.scrollFooterViewChild && this.scrollFooterViewChild.nativeElement) {
                this.footerScrollListener = this.onFooterScroll.bind(this);
                this.scrollFooterViewChild.nativeElement.addEventListener('scroll', this.footerScrollListener);
            }
            if (!this.frozen) {
                this.bodyScrollListener = this.onBodyScroll.bind(this);
                if (this.dt.virtualScroll)
                    this.virtualScrollBody.getElementRef().nativeElement.addEventListener('scroll', this.bodyScrollListener);
                else
                    this.scrollBodyViewChild.nativeElement.addEventListener('scroll', this.bodyScrollListener);
            }
        });
    }
    unbindEvents() {
        if (this.scrollHeaderViewChild && this.scrollHeaderViewChild.nativeElement) {
            this.scrollHeaderViewChild.nativeElement.removeEventListener('scroll', this.headerScrollListener);
        }
        if (this.scrollFooterViewChild && this.scrollFooterViewChild.nativeElement) {
            this.scrollFooterViewChild.nativeElement.removeEventListener('scroll', this.footerScrollListener);
        }
        if (this.scrollBodyViewChild && this.scrollBodyViewChild.nativeElement) {
            this.scrollBodyViewChild.nativeElement.removeEventListener('scroll', this.bodyScrollListener);
        }
        if (this.virtualScrollBody && this.virtualScrollBody.getElementRef()) {
            this.virtualScrollBody.getElementRef().nativeElement.removeEventListener('scroll', this.bodyScrollListener);
        }
    }
    onHeaderScroll() {
        const scrollLeft = this.scrollHeaderViewChild.nativeElement.scrollLeft;
        this.scrollBodyViewChild.nativeElement.scrollLeft = scrollLeft;
        if (this.scrollFooterViewChild && this.scrollFooterViewChild.nativeElement) {
            this.scrollFooterViewChild.nativeElement.scrollLeft = scrollLeft;
        }
        this.preventBodyScrollPropagation = true;
    }
    onFooterScroll() {
        const scrollLeft = this.scrollFooterViewChild.nativeElement.scrollLeft;
        this.scrollBodyViewChild.nativeElement.scrollLeft = scrollLeft;
        if (this.scrollHeaderViewChild && this.scrollHeaderViewChild.nativeElement) {
            this.scrollHeaderViewChild.nativeElement.scrollLeft = scrollLeft;
        }
        this.preventBodyScrollPropagation = true;
    }
    onBodyScroll(event) {
        if (this.preventBodyScrollPropagation) {
            this.preventBodyScrollPropagation = false;
            return;
        }
        if (this.scrollHeaderViewChild && this.scrollHeaderViewChild.nativeElement) {
            this.scrollHeaderBoxViewChild.nativeElement.style.marginLeft = -1 * event.target.scrollLeft + 'px';
        }
        if (this.scrollFooterViewChild && this.scrollFooterViewChild.nativeElement) {
            this.scrollFooterBoxViewChild.nativeElement.style.marginLeft = -1 * event.target.scrollLeft + 'px';
        }
        if (this.frozenSiblingBody) {
            this.frozenSiblingBody.scrollTop = event.target.scrollTop;
        }
    }
    onScrollIndexChange(index) {
        if (this.dt.lazy) {
            let pageRange = this.createPageRange(Math.floor(index / this.dt.rows));
            pageRange.forEach(page => this.loadPage(page));
        }
    }
    createPageRange(page) {
        let range = [];
        if (page !== 0) {
            range.push(page - 1);
        }
        range.push(page);
        if (page !== (this.getPageCount() - 1)) {
            range.push(page + 1);
        }
        return range;
    }
    loadPage(page) {
        if (!this.loadedPages.includes(page)) {
            this.dt.onLazyLoad.emit({
                first: this.dt.rows * page,
                rows: this.dt.rows,
                sortField: this.dt.sortField,
                sortOrder: this.dt.sortOrder,
                filters: this.dt.filters,
                globalFilter: this.dt.filters && this.dt.filters['global'] ? this.dt.filters['global'].value : null,
                multiSortMeta: this.dt.multiSortMeta
            });
            this.loadedPages.push(page);
        }
    }
    clearCache() {
        this.loadedPages = [];
    }
    getPageCount() {
        let dataToRender = this.dt.filteredValue || this.dt.value;
        let dataLength = dataToRender ? dataToRender.length : 0;
        return Math.ceil(dataLength / this.dt.rows);
    }
    scrollToVirtualIndex(index) {
        if (this.virtualScrollBody) {
            this.virtualScrollBody.scrollToIndex(index);
        }
    }
    scrollTo(options) {
        if (this.virtualScrollBody) {
            this.virtualScrollBody.scrollTo(options);
        }
        else {
            if (this.scrollBodyViewChild.nativeElement.scrollTo) {
                this.scrollBodyViewChild.nativeElement.scrollTo(options);
            }
            else {
                this.scrollBodyViewChild.nativeElement.scrollLeft = options.left;
                this.scrollBodyViewChild.nativeElement.scrollTop = options.top;
            }
        }
    }
    hasVerticalOverflow() {
        if (this.dt.virtualScroll)
            return (this.virtualScrollBody.getDataLength() * this.dt.virtualRowHeight) > this.virtualScrollBody.getViewportSize();
        else
            return DomHandler.getOuterHeight(this.scrollTableViewChild.nativeElement) > DomHandler.getOuterHeight(this.scrollBodyViewChild.nativeElement);
    }
    alignScrollBar() {
        if (!this.frozen) {
            let scrollBarWidth = this.hasVerticalOverflow() ? DomHandler.calculateScrollbarWidth() : 0;
            this.scrollHeaderBoxViewChild.nativeElement.style.paddingRight = scrollBarWidth + 'px';
            if (this.scrollFooterBoxViewChild && this.scrollFooterBoxViewChild.nativeElement) {
                this.scrollFooterBoxViewChild.nativeElement.style.paddingRight = scrollBarWidth + 'px';
            }
        }
        this.initialized = false;
    }
    ngOnDestroy() {
        this.unbindEvents();
        this.frozenSiblingBody = null;
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        this.initialized = false;
    }
}
ScrollableView.ctorParameters = () => [
    { type: Table },
    { type: ElementRef },
    { type: NgZone }
];
ScrollableView.decorators = [
    { type: Component, args: [{
                selector: '[pScrollableView]',
                template: `
        <div #scrollHeader class="p-datatable-scrollable-header">
            <div #scrollHeaderBox class="p-datatable-scrollable-header-box">
                <table class="p-datatable-scrollable-header-table" [ngClass]="dt.tableStyleClass" [ngStyle]="dt.tableStyle">
                    <ng-container *ngTemplateOutlet="frozen ? dt.frozenColGroupTemplate||dt.colGroupTemplate : dt.colGroupTemplate; context {$implicit: columns}"></ng-container>
                    <thead class="p-datatable-thead">
                        <ng-container *ngTemplateOutlet="frozen ? dt.frozenHeaderTemplate||dt.headerTemplate : dt.headerTemplate; context {$implicit: columns}"></ng-container>
                    </thead>
                    <tbody class="p-datatable-tbody">
                        <ng-template ngFor let-rowData let-rowIndex="index" [ngForOf]="dt.frozenValue" [ngForTrackBy]="dt.rowTrackBy">
                            <ng-container *ngTemplateOutlet="dt.frozenRowsTemplate; context: {$implicit: rowData, rowIndex: rowIndex, columns: columns}"></ng-container>
                        </ng-template>
                    </tbody>
                </table>
            </div>
        </div>
        <ng-container *ngIf="!dt.virtualScroll; else virtualScrollTemplate">
            <div #scrollBody class="p-datatable-scrollable-body" [ngStyle]="{'max-height': dt.scrollHeight !== 'flex' ? scrollHeight : undefined}">
                <table #scrollTable [class]="dt.tableStyleClass" [ngStyle]="dt.tableStyle">
                    <ng-container *ngTemplateOutlet="frozen ? dt.frozenColGroupTemplate||dt.colGroupTemplate : dt.colGroupTemplate; context {$implicit: columns}"></ng-container>
                    <tbody class="p-datatable-tbody" [pTableBody]="columns" [pTableBodyTemplate]="frozen ? dt.frozenBodyTemplate||dt.bodyTemplate : dt.bodyTemplate" [frozen]="frozen"></tbody>
                </table>
                <div #scrollableAligner style="background-color:transparent" *ngIf="frozen"></div>
            </div>
        </ng-container>
        <ng-template #virtualScrollTemplate>
            <cdk-virtual-scroll-viewport [itemSize]="dt.virtualRowHeight" [style.height]="dt.scrollHeight !== 'flex' ? scrollHeight : undefined" 
                    [minBufferPx]="dt.minBufferPx" [maxBufferPx]="dt.maxBufferPx" (scrolledIndexChange)="onScrollIndexChange($event)" class="p-datatable-virtual-scrollable-body">
                <table #scrollTable [class]="dt.tableStyleClass" [ngStyle]="dt.tableStyle">
                    <ng-container *ngTemplateOutlet="frozen ? dt.frozenColGroupTemplate||dt.colGroupTemplate : dt.colGroupTemplate; context {$implicit: columns}"></ng-container>
                    <tbody class="p-datatable-tbody" [pTableBody]="columns" [pTableBodyTemplate]="frozen ? dt.frozenBodyTemplate||dt.bodyTemplate : dt.bodyTemplate" [frozen]="frozen"></tbody>
                </table>
                <div #scrollableAligner style="background-color:transparent" *ngIf="frozen"></div>
            </cdk-virtual-scroll-viewport>
        </ng-template>
        <div #scrollFooter class="p-datatable-scrollable-footer">
            <div #scrollFooterBox class="p-datatable-scrollable-footer-box">
                <table class="p-datatable-scrollable-footer-table" [ngClass]="dt.tableStyleClass" [ngStyle]="dt.tableStyle">
                    <ng-container *ngTemplateOutlet="frozen ? dt.frozenColGroupTemplate||dt.colGroupTemplate : dt.colGroupTemplate; context {$implicit: columns}"></ng-container>
                    <tfoot class="p-datatable-tfoot">
                        <ng-container *ngTemplateOutlet="frozen ? dt.frozenFooterTemplate||dt.footerTemplate : dt.footerTemplate; context {$implicit: columns}"></ng-container>
                    </tfoot>
                </table>
            </div>
        </div>
    `,
                changeDetection: ChangeDetectionStrategy.Default,
                encapsulation: ViewEncapsulation.None
            },] }
];
ScrollableView.ctorParameters = () => [
    { type: Table },
    { type: ElementRef },
    { type: NgZone }
];
ScrollableView.propDecorators = {
    columns: [{ type: Input, args: ["pScrollableView",] }],
    frozen: [{ type: Input }],
    scrollHeaderViewChild: [{ type: ViewChild, args: ['scrollHeader',] }],
    scrollHeaderBoxViewChild: [{ type: ViewChild, args: ['scrollHeaderBox',] }],
    scrollBodyViewChild: [{ type: ViewChild, args: ['scrollBody',] }],
    scrollTableViewChild: [{ type: ViewChild, args: ['scrollTable',] }],
    scrollFooterViewChild: [{ type: ViewChild, args: ['scrollFooter',] }],
    scrollFooterBoxViewChild: [{ type: ViewChild, args: ['scrollFooterBox',] }],
    scrollableAlignerViewChild: [{ type: ViewChild, args: ['scrollableAligner',] }],
    virtualScrollBody: [{ type: ViewChild, args: [CdkVirtualScrollViewport,] }],
    scrollHeight: [{ type: Input }]
};
export class SortableColumn {
    constructor(dt) {
        this.dt = dt;
        if (this.isEnabled()) {
            this.subscription = this.dt.tableService.sortSource$.subscribe(sortMeta => {
                this.updateSortState();
            });
        }
    }
    ngOnInit() {
        if (this.isEnabled()) {
            this.updateSortState();
        }
    }
    updateSortState() {
        this.sorted = this.dt.isSorted(this.field);
        this.sortOrder = this.sorted ? (this.dt.sortOrder === 1 ? 'ascending' : 'descending') : 'none';
    }
    onClick(event) {
        if (this.isEnabled()) {
            this.updateSortState();
            this.dt.sort({
                originalEvent: event,
                field: this.field
            });
            DomHandler.clearSelection();
        }
    }
    onEnterKey(event) {
        this.onClick(event);
    }
    isEnabled() {
        return this.pSortableColumnDisabled !== true;
    }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
SortableColumn.ctorParameters = () => [
    { type: Table }
];
SortableColumn.decorators = [
    { type: Directive, args: [{
                selector: '[pSortableColumn]',
                host: {
                    '[class.p-sortable-column]': 'isEnabled()',
                    '[class.p-highlight]': 'sorted',
                    '[attr.tabindex]': 'isEnabled() ? "0" : null',
                    '[attr.role]': '"columnheader"',
                    '[attr.aria-sort]': 'sortOrder'
                }
            },] }
];
SortableColumn.ctorParameters = () => [
    { type: Table }
];
SortableColumn.propDecorators = {
    field: [{ type: Input, args: ["pSortableColumn",] }],
    pSortableColumnDisabled: [{ type: Input }],
    onClick: [{ type: HostListener, args: ['click', ['$event'],] }],
    onEnterKey: [{ type: HostListener, args: ['keydown.enter', ['$event'],] }]
};
export class SortIcon {
    constructor(dt, cd) {
        this.dt = dt;
        this.cd = cd;
        this.subscription = this.dt.tableService.sortSource$.subscribe(sortMeta => {
            this.updateSortState();
        });
    }
    ngOnInit() {
        this.updateSortState();
    }
    onClick(event) {
        event.preventDefault();
    }
    updateSortState() {
        if (this.dt.sortMode === 'single') {
            this.sortOrder = this.dt.isSorted(this.field) ? this.dt.sortOrder : 0;
        }
        else if (this.dt.sortMode === 'multiple') {
            let sortMeta = this.dt.getSortMeta(this.field);
            this.sortOrder = sortMeta ? sortMeta.order : 0;
        }
        this.cd.markForCheck();
    }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
SortIcon.ctorParameters = () => [
    { type: Table },
    { type: ChangeDetectorRef }
];
SortIcon.decorators = [
    { type: Component, args: [{
                selector: 'p-sortIcon',
                template: `
        <i class="p-sortable-column-icon pi pi-fw" [ngClass]="{'pi-sort-amount-up-alt': sortOrder === 1, 'pi-sort-amount-down': sortOrder === -1, 'pi-sort-alt': sortOrder === 0}"></i>
    `,
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None
            },] }
];
SortIcon.ctorParameters = () => [
    { type: Table },
    { type: ChangeDetectorRef }
];
SortIcon.propDecorators = {
    field: [{ type: Input }]
};
export class SelectableRow {
    constructor(dt, tableService) {
        this.dt = dt;
        this.tableService = tableService;
        if (this.isEnabled()) {
            this.subscription = this.dt.tableService.selectionSource$.subscribe(() => {
                this.selected = this.dt.isSelected(this.data);
            });
        }
    }
    ngOnInit() {
        if (this.isEnabled()) {
            this.selected = this.dt.isSelected(this.data);
        }
    }
    onClick(event) {
        if (this.isEnabled()) {
            this.dt.handleRowClick({
                originalEvent: event,
                rowData: this.data,
                rowIndex: this.index
            });
        }
    }
    onTouchEnd(event) {
        if (this.isEnabled()) {
            this.dt.handleRowTouchEnd(event);
        }
    }
    onArrowDownKeyDown(event) {
        if (!this.isEnabled()) {
            return;
        }
        const row = event.currentTarget;
        const nextRow = this.findNextSelectableRow(row);
        if (nextRow) {
            nextRow.focus();
        }
        event.preventDefault();
    }
    onArrowUpKeyDown(event) {
        if (!this.isEnabled()) {
            return;
        }
        const row = event.currentTarget;
        const prevRow = this.findPrevSelectableRow(row);
        if (prevRow) {
            prevRow.focus();
        }
        event.preventDefault();
    }
    onEnterKeyDown(event) {
        if (!this.isEnabled()) {
            return;
        }
        this.dt.handleRowClick({
            originalEvent: event,
            rowData: this.data,
            rowIndex: this.index
        });
    }
    findNextSelectableRow(row) {
        let nextRow = row.nextElementSibling;
        if (nextRow) {
            if (DomHandler.hasClass(nextRow, 'p-datatable-selectable-row'))
                return nextRow;
            else
                return this.findNextSelectableRow(nextRow);
        }
        else {
            return null;
        }
    }
    findPrevSelectableRow(row) {
        let prevRow = row.previousElementSibling;
        if (prevRow) {
            if (DomHandler.hasClass(prevRow, 'p-datatable-selectable-row'))
                return prevRow;
            else
                return this.findPrevSelectableRow(prevRow);
        }
        else {
            return null;
        }
    }
    isEnabled() {
        return this.pSelectableRowDisabled !== true;
    }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
SelectableRow.ctorParameters = () => [
    { type: Table },
    { type: TableService }
];
SelectableRow.decorators = [
    { type: Directive, args: [{
                selector: '[pSelectableRow]',
                host: {
                    '[class.p-selectable-row]': 'isEnabled()',
                    '[class.p-highlight]': 'selected',
                    '[attr.tabindex]': 'isEnabled() ? 0 : undefined'
                }
            },] }
];
SelectableRow.ctorParameters = () => [
    { type: Table },
    { type: TableService }
];
SelectableRow.propDecorators = {
    data: [{ type: Input, args: ["pSelectableRow",] }],
    index: [{ type: Input, args: ["pSelectableRowIndex",] }],
    pSelectableRowDisabled: [{ type: Input }],
    onClick: [{ type: HostListener, args: ['click', ['$event'],] }],
    onTouchEnd: [{ type: HostListener, args: ['touchend', ['$event'],] }],
    onArrowDownKeyDown: [{ type: HostListener, args: ['keydown.arrowdown', ['$event'],] }],
    onArrowUpKeyDown: [{ type: HostListener, args: ['keydown.arrowup', ['$event'],] }],
    onEnterKeyDown: [{ type: HostListener, args: ['keydown.enter', ['$event'],] }]
};
export class SelectableRowDblClick {
    constructor(dt, tableService) {
        this.dt = dt;
        this.tableService = tableService;
        if (this.isEnabled()) {
            this.subscription = this.dt.tableService.selectionSource$.subscribe(() => {
                this.selected = this.dt.isSelected(this.data);
            });
        }
    }
    ngOnInit() {
        if (this.isEnabled()) {
            this.selected = this.dt.isSelected(this.data);
        }
    }
    onClick(event) {
        if (this.isEnabled()) {
            this.dt.handleRowClick({
                originalEvent: event,
                rowData: this.data,
                rowIndex: this.index
            });
        }
    }
    isEnabled() {
        return this.pSelectableRowDisabled !== true;
    }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
SelectableRowDblClick.ctorParameters = () => [
    { type: Table },
    { type: TableService }
];
SelectableRowDblClick.decorators = [
    { type: Directive, args: [{
                selector: '[pSelectableRowDblClick]',
                host: {
                    '[class.p-datatable-selectable-row]': 'isEnabled()',
                    '[class.p-highlight]': 'selected'
                }
            },] }
];
SelectableRowDblClick.ctorParameters = () => [
    { type: Table },
    { type: TableService }
];
SelectableRowDblClick.propDecorators = {
    data: [{ type: Input, args: ["pSelectableRowDblClick",] }],
    index: [{ type: Input, args: ["pSelectableRowIndex",] }],
    pSelectableRowDisabled: [{ type: Input }],
    onClick: [{ type: HostListener, args: ['dblclick', ['$event'],] }]
};
export class ContextMenuRow {
    constructor(dt, tableService, el) {
        this.dt = dt;
        this.tableService = tableService;
        this.el = el;
        if (this.isEnabled()) {
            this.subscription = this.dt.tableService.contextMenuSource$.subscribe((data) => {
                this.selected = this.dt.equals(this.data, data);
            });
        }
    }
    onContextMenu(event) {
        if (this.isEnabled()) {
            this.dt.handleRowRightClick({
                originalEvent: event,
                rowData: this.data,
                rowIndex: this.index
            });
            this.el.nativeElement.focus();
            event.preventDefault();
        }
    }
    isEnabled() {
        return this.pContextMenuRowDisabled !== true;
    }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
ContextMenuRow.ctorParameters = () => [
    { type: Table },
    { type: TableService },
    { type: ElementRef }
];
ContextMenuRow.decorators = [
    { type: Directive, args: [{
                selector: '[pContextMenuRow]',
                host: {
                    '[class.p-highlight-contextmenu]': 'selected',
                    '[attr.tabindex]': 'isEnabled() ? 0 : undefined'
                }
            },] }
];
ContextMenuRow.ctorParameters = () => [
    { type: Table },
    { type: TableService },
    { type: ElementRef }
];
ContextMenuRow.propDecorators = {
    data: [{ type: Input, args: ["pContextMenuRow",] }],
    index: [{ type: Input, args: ["pContextMenuRowIndex",] }],
    pContextMenuRowDisabled: [{ type: Input }],
    onContextMenu: [{ type: HostListener, args: ['contextmenu', ['$event'],] }]
};
export class RowToggler {
    constructor(dt) {
        this.dt = dt;
    }
    onClick(event) {
        if (this.isEnabled()) {
            this.dt.toggleRow(this.data, event);
            event.preventDefault();
        }
    }
    isEnabled() {
        return this.pRowTogglerDisabled !== true;
    }
}
RowToggler.ctorParameters = () => [
    { type: Table }
];
RowToggler.decorators = [
    { type: Directive, args: [{
                selector: '[pRowToggler]'
            },] }
];
RowToggler.ctorParameters = () => [
    { type: Table }
];
RowToggler.propDecorators = {
    data: [{ type: Input, args: ['pRowToggler',] }],
    pRowTogglerDisabled: [{ type: Input }],
    onClick: [{ type: HostListener, args: ['click', ['$event'],] }]
};
export class ResizableColumn {
    constructor(dt, el, zone) {
        this.dt = dt;
        this.el = el;
        this.zone = zone;
    }
    ngAfterViewInit() {
        if (this.isEnabled()) {
            DomHandler.addClass(this.el.nativeElement, 'p-resizable-column');
            this.resizer = document.createElement('span');
            this.resizer.className = 'p-column-resizer';
            this.el.nativeElement.appendChild(this.resizer);
            this.zone.runOutsideAngular(() => {
                this.resizerMouseDownListener = this.onMouseDown.bind(this);
                this.resizer.addEventListener('mousedown', this.resizerMouseDownListener);
            });
        }
    }
    bindDocumentEvents() {
        this.zone.runOutsideAngular(() => {
            this.documentMouseMoveListener = this.onDocumentMouseMove.bind(this);
            document.addEventListener('mousemove', this.documentMouseMoveListener);
            this.documentMouseUpListener = this.onDocumentMouseUp.bind(this);
            document.addEventListener('mouseup', this.documentMouseUpListener);
        });
    }
    unbindDocumentEvents() {
        if (this.documentMouseMoveListener) {
            document.removeEventListener('mousemove', this.documentMouseMoveListener);
            this.documentMouseMoveListener = null;
        }
        if (this.documentMouseUpListener) {
            document.removeEventListener('mouseup', this.documentMouseUpListener);
            this.documentMouseUpListener = null;
        }
    }
    onMouseDown(event) {
        if (event.which === 1) {
            this.dt.onColumnResizeBegin(event);
            this.bindDocumentEvents();
        }
    }
    onDocumentMouseMove(event) {
        this.dt.onColumnResize(event);
    }
    onDocumentMouseUp(event) {
        this.dt.onColumnResizeEnd(event, this.el.nativeElement);
        this.unbindDocumentEvents();
    }
    isEnabled() {
        return this.pResizableColumnDisabled !== true;
    }
    ngOnDestroy() {
        if (this.resizerMouseDownListener) {
            this.resizer.removeEventListener('mousedown', this.resizerMouseDownListener);
        }
        this.unbindDocumentEvents();
    }
}
ResizableColumn.ctorParameters = () => [
    { type: Table },
    { type: ElementRef },
    { type: NgZone }
];
ResizableColumn.decorators = [
    { type: Directive, args: [{
                selector: '[pResizableColumn]'
            },] }
];
ResizableColumn.ctorParameters = () => [
    { type: Table },
    { type: ElementRef },
    { type: NgZone }
];
ResizableColumn.propDecorators = {
    pResizableColumnDisabled: [{ type: Input }]
};
export class ReorderableColumn {
    constructor(dt, el, zone) {
        this.dt = dt;
        this.el = el;
        this.zone = zone;
    }
    ngAfterViewInit() {
        if (this.isEnabled()) {
            this.bindEvents();
        }
    }
    bindEvents() {
        this.zone.runOutsideAngular(() => {
            this.mouseDownListener = this.onMouseDown.bind(this);
            this.el.nativeElement.addEventListener('mousedown', this.mouseDownListener);
            this.dragStartListener = this.onDragStart.bind(this);
            this.el.nativeElement.addEventListener('dragstart', this.dragStartListener);
            this.dragOverListener = this.onDragEnter.bind(this);
            this.el.nativeElement.addEventListener('dragover', this.dragOverListener);
            this.dragEnterListener = this.onDragEnter.bind(this);
            this.el.nativeElement.addEventListener('dragenter', this.dragEnterListener);
            this.dragLeaveListener = this.onDragLeave.bind(this);
            this.el.nativeElement.addEventListener('dragleave', this.dragLeaveListener);
        });
    }
    unbindEvents() {
        if (this.mouseDownListener) {
            document.removeEventListener('mousedown', this.mouseDownListener);
            this.mouseDownListener = null;
        }
        if (this.dragOverListener) {
            document.removeEventListener('dragover', this.dragOverListener);
            this.dragOverListener = null;
        }
        if (this.dragEnterListener) {
            document.removeEventListener('dragenter', this.dragEnterListener);
            this.dragEnterListener = null;
        }
        if (this.dragEnterListener) {
            document.removeEventListener('dragenter', this.dragEnterListener);
            this.dragEnterListener = null;
        }
        if (this.dragLeaveListener) {
            document.removeEventListener('dragleave', this.dragLeaveListener);
            this.dragLeaveListener = null;
        }
    }
    onMouseDown(event) {
        if (event.target.nodeName === 'INPUT' || event.target.nodeName === 'TEXTAREA' || DomHandler.hasClass(event.target, 'p-column-resizer'))
            this.el.nativeElement.draggable = false;
        else
            this.el.nativeElement.draggable = true;
    }
    onDragStart(event) {
        this.dt.onColumnDragStart(event, this.el.nativeElement);
    }
    onDragOver(event) {
        event.preventDefault();
    }
    onDragEnter(event) {
        this.dt.onColumnDragEnter(event, this.el.nativeElement);
    }
    onDragLeave(event) {
        this.dt.onColumnDragLeave(event);
    }
    onDrop(event) {
        if (this.isEnabled()) {
            this.dt.onColumnDrop(event, this.el.nativeElement);
        }
    }
    isEnabled() {
        return this.pReorderableColumnDisabled !== true;
    }
    ngOnDestroy() {
        this.unbindEvents();
    }
}
ReorderableColumn.ctorParameters = () => [
    { type: Table },
    { type: ElementRef },
    { type: NgZone }
];
ReorderableColumn.decorators = [
    { type: Directive, args: [{
                selector: '[pReorderableColumn]'
            },] }
];
ReorderableColumn.ctorParameters = () => [
    { type: Table },
    { type: ElementRef },
    { type: NgZone }
];
ReorderableColumn.propDecorators = {
    pReorderableColumnDisabled: [{ type: Input }],
    onDrop: [{ type: HostListener, args: ['drop', ['$event'],] }]
};
export class EditableColumn {
    constructor(dt, el, zone) {
        this.dt = dt;
        this.el = el;
        this.zone = zone;
    }
    ngAfterViewInit() {
        if (this.isEnabled()) {
            DomHandler.addClass(this.el.nativeElement, 'p-editable-column');
        }
    }
    onClick(event) {
        if (this.isEnabled()) {
            this.dt.editingCellClick = true;
            if (this.dt.editingCell) {
                if (this.dt.editingCell !== this.el.nativeElement) {
                    if (!this.dt.isEditingCellValid()) {
                        return;
                    }
                    this.closeEditingCell(true, event);
                    this.openCell();
                }
            }
            else {
                this.openCell();
            }
        }
    }
    openCell() {
        this.dt.updateEditingCell(this.el.nativeElement, this.data, this.field, this.rowIndex);
        DomHandler.addClass(this.el.nativeElement, 'p-cell-editing');
        this.dt.onEditInit.emit({ field: this.field, data: this.data, index: this.rowIndex });
        this.zone.runOutsideAngular(() => {
            setTimeout(() => {
                let focusCellSelector = this.pFocusCellSelector || 'input, textarea, select';
                let focusableElement = DomHandler.findSingle(this.el.nativeElement, focusCellSelector);
                if (focusableElement) {
                    focusableElement.focus();
                }
            }, 50);
        });
    }
    closeEditingCell(completed, event) {
        if (completed)
            this.dt.onEditComplete.emit({ field: this.dt.editingCellField, data: this.dt.editingCellData, originalEvent: event, index: this.rowIndex });
        else
            this.dt.onEditCancel.emit({ field: this.dt.editingCellField, data: this.dt.editingCellData, originalEvent: event, index: this.rowIndex });
        DomHandler.removeClass(this.dt.editingCell, 'p-cell-editing');
        this.dt.editingCell = null;
        this.dt.editingCellData = null;
        this.dt.editingCellField = null;
        this.dt.unbindDocumentEditListener();
    }
    onEnterKeyDown(event) {
        if (this.isEnabled()) {
            if (this.dt.isEditingCellValid()) {
                this.closeEditingCell(true, event);
            }
            event.preventDefault();
        }
    }
    onEscapeKeyDown(event) {
        if (this.isEnabled()) {
            if (this.dt.isEditingCellValid()) {
                this.closeEditingCell(false, event);
            }
            event.preventDefault();
        }
    }
    onShiftKeyDown(event) {
        if (this.isEnabled()) {
            if (event.shiftKey)
                this.moveToPreviousCell(event);
            else {
                this.moveToNextCell(event);
            }
        }
    }
    findCell(element) {
        if (element) {
            let cell = element;
            while (cell && !DomHandler.hasClass(cell, 'p-cell-editing')) {
                cell = cell.parentElement;
            }
            return cell;
        }
        else {
            return null;
        }
    }
    moveToPreviousCell(event) {
        let currentCell = this.findCell(event.target);
        if (currentCell) {
            let targetCell = this.findPreviousEditableColumn(currentCell);
            if (targetCell) {
                if (this.dt.isEditingCellValid()) {
                    this.closeEditingCell(true, event);
                }
                DomHandler.invokeElementMethod(event.target, 'blur');
                DomHandler.invokeElementMethod(targetCell, 'click');
                event.preventDefault();
            }
        }
    }
    moveToNextCell(event) {
        let currentCell = this.findCell(event.target);
        if (currentCell) {
            let targetCell = this.findNextEditableColumn(currentCell);
            if (targetCell) {
                if (this.dt.isEditingCellValid()) {
                    this.closeEditingCell(true, event);
                }
                DomHandler.invokeElementMethod(event.target, 'blur');
                DomHandler.invokeElementMethod(targetCell, 'click');
                event.preventDefault();
            }
        }
    }
    findPreviousEditableColumn(cell) {
        let prevCell = cell.previousElementSibling;
        if (!prevCell) {
            let previousRow = cell.parentElement.previousElementSibling;
            if (previousRow) {
                prevCell = previousRow.lastElementChild;
            }
        }
        if (prevCell) {
            if (DomHandler.hasClass(prevCell, 'p-editable-column'))
                return prevCell;
            else
                return this.findPreviousEditableColumn(prevCell);
        }
        else {
            return null;
        }
    }
    findNextEditableColumn(cell) {
        let nextCell = cell.nextElementSibling;
        if (!nextCell) {
            let nextRow = cell.parentElement.nextElementSibling;
            if (nextRow) {
                nextCell = nextRow.firstElementChild;
            }
        }
        if (nextCell) {
            if (DomHandler.hasClass(nextCell, 'p-editable-column'))
                return nextCell;
            else
                return this.findNextEditableColumn(nextCell);
        }
        else {
            return null;
        }
    }
    isEnabled() {
        return this.pEditableColumnDisabled !== true;
    }
}
EditableColumn.ctorParameters = () => [
    { type: Table },
    { type: ElementRef },
    { type: NgZone }
];
EditableColumn.decorators = [
    { type: Directive, args: [{
                selector: '[pEditableColumn]'
            },] }
];
EditableColumn.ctorParameters = () => [
    { type: Table },
    { type: ElementRef },
    { type: NgZone }
];
EditableColumn.propDecorators = {
    data: [{ type: Input, args: ["pEditableColumn",] }],
    field: [{ type: Input, args: ["pEditableColumnField",] }],
    rowIndex: [{ type: Input, args: ["pEditableColumnRowIndex",] }],
    pEditableColumnDisabled: [{ type: Input }],
    pFocusCellSelector: [{ type: Input }],
    onClick: [{ type: HostListener, args: ['click', ['$event'],] }],
    onEnterKeyDown: [{ type: HostListener, args: ['keydown.enter', ['$event'],] }],
    onEscapeKeyDown: [{ type: HostListener, args: ['keydown.escape', ['$event'],] }],
    onShiftKeyDown: [{ type: HostListener, args: ['keydown.tab', ['$event'],] }, { type: HostListener, args: ['keydown.shift.tab', ['$event'],] }, { type: HostListener, args: ['keydown.meta.tab', ['$event'],] }]
};
export class EditableRow {
    constructor(el) {
        this.el = el;
    }
    isEnabled() {
        return this.pEditableRowDisabled !== true;
    }
}
EditableRow.ctorParameters = () => [
    { type: ElementRef }
];
EditableRow.decorators = [
    { type: Directive, args: [{
                selector: '[pEditableRow]'
            },] }
];
EditableRow.ctorParameters = () => [
    { type: ElementRef }
];
EditableRow.propDecorators = {
    data: [{ type: Input, args: ["pEditableRow",] }],
    pEditableRowDisabled: [{ type: Input }]
};
export class InitEditableRow {
    constructor(dt, editableRow) {
        this.dt = dt;
        this.editableRow = editableRow;
    }
    onClick(event) {
        this.dt.initRowEdit(this.editableRow.data);
        event.preventDefault();
    }
}
InitEditableRow.ctorParameters = () => [
    { type: Table },
    { type: EditableRow }
];
InitEditableRow.decorators = [
    { type: Directive, args: [{
                selector: '[pInitEditableRow]'
            },] }
];
InitEditableRow.ctorParameters = () => [
    { type: Table },
    { type: EditableRow }
];
InitEditableRow.propDecorators = {
    onClick: [{ type: HostListener, args: ['click', ['$event'],] }]
};
export class SaveEditableRow {
    constructor(dt, editableRow) {
        this.dt = dt;
        this.editableRow = editableRow;
    }
    onClick(event) {
        this.dt.saveRowEdit(this.editableRow.data, this.editableRow.el.nativeElement);
        event.preventDefault();
    }
}
SaveEditableRow.ctorParameters = () => [
    { type: Table },
    { type: EditableRow }
];
SaveEditableRow.decorators = [
    { type: Directive, args: [{
                selector: '[pSaveEditableRow]'
            },] }
];
SaveEditableRow.ctorParameters = () => [
    { type: Table },
    { type: EditableRow }
];
SaveEditableRow.propDecorators = {
    onClick: [{ type: HostListener, args: ['click', ['$event'],] }]
};
export class CancelEditableRow {
    constructor(dt, editableRow) {
        this.dt = dt;
        this.editableRow = editableRow;
    }
    onClick(event) {
        this.dt.cancelRowEdit(this.editableRow.data);
        event.preventDefault();
    }
}
CancelEditableRow.ctorParameters = () => [
    { type: Table },
    { type: EditableRow }
];
CancelEditableRow.decorators = [
    { type: Directive, args: [{
                selector: '[pCancelEditableRow]'
            },] }
];
CancelEditableRow.ctorParameters = () => [
    { type: Table },
    { type: EditableRow }
];
CancelEditableRow.propDecorators = {
    onClick: [{ type: HostListener, args: ['click', ['$event'],] }]
};
export class CellEditor {
    constructor(dt, editableColumn, editableRow) {
        this.dt = dt;
        this.editableColumn = editableColumn;
        this.editableRow = editableRow;
    }
    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'input':
                    this.inputTemplate = item.template;
                    break;
                case 'output':
                    this.outputTemplate = item.template;
                    break;
            }
        });
    }
    get editing() {
        return (this.dt.editingCell && this.editableColumn && this.dt.editingCell === this.editableColumn.el.nativeElement) ||
            (this.editableRow && this.dt.editMode === 'row' && this.dt.isRowEditing(this.editableRow.data));
    }
}
CellEditor.ctorParameters = () => [
    { type: Table },
    { type: EditableColumn, decorators: [{ type: Optional }] },
    { type: EditableRow, decorators: [{ type: Optional }] }
];
CellEditor.decorators = [
    { type: Component, args: [{
                selector: 'p-cellEditor',
                template: `
        <ng-container *ngIf="editing">
            <ng-container *ngTemplateOutlet="inputTemplate"></ng-container>
        </ng-container>
        <ng-container *ngIf="!editing">
            <ng-container *ngTemplateOutlet="outputTemplate"></ng-container>
        </ng-container>
    `,
                encapsulation: ViewEncapsulation.None
            },] }
];
CellEditor.ctorParameters = () => [
    { type: Table },
    { type: EditableColumn, decorators: [{ type: Optional }] },
    { type: EditableRow, decorators: [{ type: Optional }] }
];
CellEditor.propDecorators = {
    templates: [{ type: ContentChildren, args: [PrimeTemplate,] }]
};
export class TableRadioButton {
    constructor(dt, tableService, cd) {
        this.dt = dt;
        this.tableService = tableService;
        this.cd = cd;
        this.subscription = this.dt.tableService.selectionSource$.subscribe(() => {
            this.checked = this.dt.isSelected(this.value);
            this.cd.markForCheck();
        });
    }
    ngOnInit() {
        this.checked = this.dt.isSelected(this.value);
    }
    onClick(event) {
        if (!this.disabled) {
            this.dt.toggleRowWithRadio({
                originalEvent: event,
                rowIndex: this.index
            }, this.value);
        }
        DomHandler.clearSelection();
    }
    onFocus() {
        DomHandler.addClass(this.boxViewChild.nativeElement, 'p-focus');
    }
    onBlur() {
        DomHandler.removeClass(this.boxViewChild.nativeElement, 'p-focus');
    }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
TableRadioButton.ctorParameters = () => [
    { type: Table },
    { type: TableService },
    { type: ChangeDetectorRef }
];
TableRadioButton.decorators = [
    { type: Component, args: [{
                selector: 'p-tableRadioButton',
                template: `
        <div class="p-radiobutton p-component" (click)="onClick($event)">
            <div class="p-hidden-accessible">
                <input type="radio" [attr.id]="inputId" [attr.name]="name" [checked]="checked" (focus)="onFocus()" (blur)="onBlur()"
                [disabled]="disabled" [attr.aria-label]="ariaLabel">
            </div>
            <div #box [ngClass]="{'p-radiobutton-box p-component':true,
                'p-highlight':checked, 'p-disabled':disabled}" role="radio" [attr.aria-checked]="checked">
                <div class="p-radiobutton-icon"></div>
            </div>
        </div>
    `,
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None
            },] }
];
TableRadioButton.ctorParameters = () => [
    { type: Table },
    { type: TableService },
    { type: ChangeDetectorRef }
];
TableRadioButton.propDecorators = {
    disabled: [{ type: Input }],
    value: [{ type: Input }],
    index: [{ type: Input }],
    inputId: [{ type: Input }],
    name: [{ type: Input }],
    ariaLabel: [{ type: Input }],
    boxViewChild: [{ type: ViewChild, args: ['box',] }]
};
export class TableCheckbox {
    constructor(dt, tableService, cd) {
        this.dt = dt;
        this.tableService = tableService;
        this.cd = cd;
        this.subscription = this.dt.tableService.selectionSource$.subscribe(() => {
            this.checked = this.dt.isSelected(this.value);
            this.cd.markForCheck();
        });
    }
    ngOnInit() {
        this.checked = this.dt.isSelected(this.value);
    }
    onClick(event) {
        if (!this.disabled) {
            this.dt.toggleRowWithCheckbox({
                originalEvent: event,
                rowIndex: this.index
            }, this.value);
        }
        DomHandler.clearSelection();
    }
    onFocus() {
        DomHandler.addClass(this.boxViewChild.nativeElement, 'p-focus');
    }
    onBlur() {
        DomHandler.removeClass(this.boxViewChild.nativeElement, 'p-focus');
    }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
TableCheckbox.ctorParameters = () => [
    { type: Table },
    { type: TableService },
    { type: ChangeDetectorRef }
];
TableCheckbox.decorators = [
    { type: Component, args: [{
                selector: 'p-tableCheckbox',
                template: `
        <div class="p-checkbox p-component" (click)="onClick($event)">
            <div class="p-hidden-accessible">
                <input type="checkbox" [attr.id]="inputId" [attr.name]="name" [checked]="checked" (focus)="onFocus()" (blur)="onBlur()" [disabled]="disabled"
                [attr.required]="required" [attr.aria-label]="ariaLabel">
            </div>
            <div #box [ngClass]="{'p-checkbox-box p-component':true,
                'p-highlight':checked, 'p-disabled':disabled}" role="checkbox" [attr.aria-checked]="checked">
                <span class="p-checkbox-icon" [ngClass]="{'pi pi-check':checked}"></span>
            </div>
        </div>
    `,
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None
            },] }
];
TableCheckbox.ctorParameters = () => [
    { type: Table },
    { type: TableService },
    { type: ChangeDetectorRef }
];
TableCheckbox.propDecorators = {
    disabled: [{ type: Input }],
    value: [{ type: Input }],
    index: [{ type: Input }],
    inputId: [{ type: Input }],
    name: [{ type: Input }],
    required: [{ type: Input }],
    ariaLabel: [{ type: Input }],
    boxViewChild: [{ type: ViewChild, args: ['box',] }]
};
export class TableHeaderCheckbox {
    constructor(dt, tableService, cd) {
        this.dt = dt;
        this.tableService = tableService;
        this.cd = cd;
        this.valueChangeSubscription = this.dt.tableService.valueSource$.subscribe(() => {
            this.checked = this.updateCheckedState();
        });
        this.selectionChangeSubscription = this.dt.tableService.selectionSource$.subscribe(() => {
            this.checked = this.updateCheckedState();
        });
    }
    ngOnInit() {
        this.checked = this.updateCheckedState();
    }
    onClick(event) {
        if (!this.disabled) {
            if (this.dt.value && this.dt.value.length > 0) {
                this.dt.toggleRowsWithCheckbox(event, !this.checked);
            }
        }
        DomHandler.clearSelection();
    }
    onFocus() {
        DomHandler.addClass(this.boxViewChild.nativeElement, 'p-focus');
    }
    onBlur() {
        DomHandler.removeClass(this.boxViewChild.nativeElement, 'p-focus');
    }
    isDisabled() {
        return this.disabled || !this.dt.value || !this.dt.value.length;
    }
    ngOnDestroy() {
        if (this.selectionChangeSubscription) {
            this.selectionChangeSubscription.unsubscribe();
        }
        if (this.valueChangeSubscription) {
            this.valueChangeSubscription.unsubscribe();
        }
    }
    updateCheckedState() {
        this.cd.markForCheck();
        if (this.dt.filteredValue) {
            const val = this.dt.filteredValue;
            return (val && val.length > 0 && this.dt.selection && this.dt.selection.length > 0 && this.isAllFilteredValuesChecked());
        }
        else {
            const val = this.dt.value;
            return (val && val.length > 0 && this.dt.selection && this.dt.selection.length > 0 && this.dt.selection.length === val.length);
        }
    }
    isAllFilteredValuesChecked() {
        if (!this.dt.filteredValue) {
            return false;
        }
        else {
            for (let rowData of this.dt.filteredValue) {
                if (!this.dt.isSelected(rowData)) {
                    return false;
                }
            }
            return true;
        }
    }
}
TableHeaderCheckbox.ctorParameters = () => [
    { type: Table },
    { type: TableService },
    { type: ChangeDetectorRef }
];
TableHeaderCheckbox.decorators = [
    { type: Component, args: [{
                selector: 'p-tableHeaderCheckbox',
                template: `
        <div class="p-checkbox p-component" (click)="onClick($event)">
            <div class="p-hidden-accessible">
                <input #cb type="checkbox" [attr.id]="inputId" [attr.name]="name" [checked]="checked" (focus)="onFocus()" (blur)="onBlur()"
                [disabled]="isDisabled()" [attr.aria-label]="ariaLabel">
            </div>
            <div #box [ngClass]="{'p-checkbox-box':true,
                'p-highlight':checked, 'p-disabled': isDisabled()}" role="checkbox" [attr.aria-checked]="checked">
                <span class="p-checkbox-icon" [ngClass]="{'pi pi-check':checked}"></span>
            </div>
        </div>
    `,
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None
            },] }
];
TableHeaderCheckbox.ctorParameters = () => [
    { type: Table },
    { type: TableService },
    { type: ChangeDetectorRef }
];
TableHeaderCheckbox.propDecorators = {
    boxViewChild: [{ type: ViewChild, args: ['box',] }],
    disabled: [{ type: Input }],
    inputId: [{ type: Input }],
    name: [{ type: Input }],
    ariaLabel: [{ type: Input }]
};
export class ReorderableRowHandle {
    constructor(el) {
        this.el = el;
    }
    ngAfterViewInit() {
        DomHandler.addClass(this.el.nativeElement, 'p-datatable-reorderablerow-handle');
    }
}
ReorderableRowHandle.ctorParameters = () => [
    { type: ElementRef }
];
ReorderableRowHandle.decorators = [
    { type: Directive, args: [{
                selector: '[pReorderableRowHandle]'
            },] }
];
ReorderableRowHandle.ctorParameters = () => [
    { type: ElementRef }
];
ReorderableRowHandle.propDecorators = {
    index: [{ type: Input, args: ["pReorderableRowHandle",] }]
};
export class ReorderableRow {
    constructor(dt, el, zone) {
        this.dt = dt;
        this.el = el;
        this.zone = zone;
    }
    ngAfterViewInit() {
        if (this.isEnabled()) {
            this.el.nativeElement.droppable = true;
            this.bindEvents();
        }
    }
    bindEvents() {
        this.zone.runOutsideAngular(() => {
            this.mouseDownListener = this.onMouseDown.bind(this);
            this.el.nativeElement.addEventListener('mousedown', this.mouseDownListener);
            this.dragStartListener = this.onDragStart.bind(this);
            this.el.nativeElement.addEventListener('dragstart', this.dragStartListener);
            this.dragEndListener = this.onDragEnd.bind(this);
            this.el.nativeElement.addEventListener('dragend', this.dragEndListener);
            this.dragOverListener = this.onDragOver.bind(this);
            this.el.nativeElement.addEventListener('dragover', this.dragOverListener);
            this.dragLeaveListener = this.onDragLeave.bind(this);
            this.el.nativeElement.addEventListener('dragleave', this.dragLeaveListener);
        });
    }
    unbindEvents() {
        if (this.mouseDownListener) {
            document.removeEventListener('mousedown', this.mouseDownListener);
            this.mouseDownListener = null;
        }
        if (this.dragStartListener) {
            document.removeEventListener('dragstart', this.dragStartListener);
            this.dragStartListener = null;
        }
        if (this.dragEndListener) {
            document.removeEventListener('dragend', this.dragEndListener);
            this.dragEndListener = null;
        }
        if (this.dragOverListener) {
            document.removeEventListener('dragover', this.dragOverListener);
            this.dragOverListener = null;
        }
        if (this.dragLeaveListener) {
            document.removeEventListener('dragleave', this.dragLeaveListener);
            this.dragLeaveListener = null;
        }
    }
    onMouseDown(event) {
        if (DomHandler.hasClass(event.target, 'p-datatable-reorderablerow-handle'))
            this.el.nativeElement.draggable = true;
        else
            this.el.nativeElement.draggable = false;
    }
    onDragStart(event) {
        this.dt.onRowDragStart(event, this.index);
    }
    onDragEnd(event) {
        this.dt.onRowDragEnd(event);
        this.el.nativeElement.draggable = false;
    }
    onDragOver(event) {
        this.dt.onRowDragOver(event, this.index, this.el.nativeElement);
        event.preventDefault();
    }
    onDragLeave(event) {
        this.dt.onRowDragLeave(event, this.el.nativeElement);
    }
    isEnabled() {
        return this.pReorderableRowDisabled !== true;
    }
    onDrop(event) {
        if (this.isEnabled() && this.dt.rowDragging) {
            this.dt.onRowDrop(event, this.el.nativeElement);
        }
        event.preventDefault();
    }
}
ReorderableRow.ctorParameters = () => [
    { type: Table },
    { type: ElementRef },
    { type: NgZone }
];
ReorderableRow.decorators = [
    { type: Directive, args: [{
                selector: '[pReorderableRow]'
            },] }
];
ReorderableRow.ctorParameters = () => [
    { type: Table },
    { type: ElementRef },
    { type: NgZone }
];
ReorderableRow.propDecorators = {
    index: [{ type: Input, args: ["pReorderableRow",] }],
    pReorderableRowDisabled: [{ type: Input }],
    onDrop: [{ type: HostListener, args: ['drop', ['$event'],] }]
};
export class TableModule {
}
TableModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule, PaginatorModule, ScrollingModule],
                exports: [Table, SharedModule, SortableColumn, SelectableRow, RowToggler, ContextMenuRow, ResizableColumn, ReorderableColumn, EditableColumn, CellEditor, SortIcon, TableRadioButton, TableCheckbox, TableHeaderCheckbox, ReorderableRowHandle, ReorderableRow, SelectableRowDblClick, EditableRow, InitEditableRow, SaveEditableRow, CancelEditableRow, ScrollingModule],
                declarations: [Table, SortableColumn, SelectableRow, RowToggler, ContextMenuRow, ResizableColumn, ReorderableColumn, EditableColumn, CellEditor, TableBody, ScrollableView, SortIcon, TableRadioButton, TableCheckbox, TableHeaderCheckbox, ReorderableRowHandle, ReorderableRow, SelectableRowDblClick, EditableRow, InitEditableRow, SaveEditableRow, CancelEditableRow]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9wcmltZW5nL3RhYmxlLyIsInNvdXJjZXMiOlsidGFibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsYUFBYSxFQUFFLGdCQUFnQixFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsZ0JBQWdCLEVBQ2pJLEtBQUssRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxlQUFlLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLGlCQUFpQixFQUFFLFNBQVMsRUFBRSxhQUFhLEVBQUUsdUJBQXVCLEVBQUUsS0FBSyxFQUFFLGlCQUFpQixFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzlOLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsYUFBYSxFQUFFLFlBQVksRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUMxRCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDcEQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUN6QyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBSTVDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUFFLE9BQU8sRUFBZ0IsTUFBTSxNQUFNLENBQUM7QUFDN0MsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM1QyxPQUFPLEVBQUUsZUFBZSxFQUFFLHdCQUF3QixFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFHbkYsTUFBTSxPQUFPLFlBQVk7SUFEekI7UUFHWSxlQUFVLEdBQUcsSUFBSSxPQUFPLEVBQXVCLENBQUM7UUFDaEQsb0JBQWUsR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDO1FBQ2hDLHNCQUFpQixHQUFHLElBQUksT0FBTyxFQUFPLENBQUM7UUFDdkMsZ0JBQVcsR0FBRyxJQUFJLE9BQU8sRUFBTyxDQUFDO1FBQ2pDLHVCQUFrQixHQUFHLElBQUksT0FBTyxFQUFPLENBQUM7UUFDeEMsa0JBQWEsR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDO1FBRXRDLGdCQUFXLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUM3QyxxQkFBZ0IsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3ZELHVCQUFrQixHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUMzRCxpQkFBWSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDL0Msd0JBQW1CLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFlBQVksRUFBRSxDQUFDO1FBQzdELG1CQUFjLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQXlCdkQsQ0FBQztJQXZCRyxNQUFNLENBQUMsUUFBNkI7UUFDaEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQUVELGlCQUFpQjtRQUNiLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDaEMsQ0FBQztJQUVELGFBQWEsQ0FBQyxJQUFTO1FBQ25CLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdEMsQ0FBQztJQUVELGFBQWEsQ0FBQyxLQUFVO1FBQ3BCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFFRCxvQkFBb0IsQ0FBQyxLQUFhO1FBQzlCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUVELGVBQWUsQ0FBQyxPQUFjO1FBQzFCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3JDLENBQUM7OztZQXZDSixVQUFVOztBQXNHWCxNQUFNLE9BQU8sS0FBSztJQWdTZCxZQUFtQixFQUFjLEVBQVMsSUFBWSxFQUFTLFlBQTBCLEVBQVMsRUFBcUI7UUFBcEcsT0FBRSxHQUFGLEVBQUUsQ0FBWTtRQUFTLFNBQUksR0FBSixJQUFJLENBQVE7UUFBUyxpQkFBWSxHQUFaLFlBQVksQ0FBYztRQUFTLE9BQUUsR0FBRixFQUFFLENBQW1CO1FBaFI5RyxjQUFTLEdBQVcsQ0FBQyxDQUFDO1FBSXRCLHdCQUFtQixHQUFZLElBQUksQ0FBQztRQUVwQyxzQkFBaUIsR0FBVyxRQUFRLENBQUM7UUFJckMsa0NBQTZCLEdBQVcsT0FBTyxDQUFDO1FBRWhELDhCQUF5QixHQUFXLCtCQUErQixDQUFDO1FBSXBFLHFCQUFnQixHQUFXLENBQUMsQ0FBQztRQUU3QixhQUFRLEdBQVcsUUFBUSxDQUFDO1FBRTVCLG9CQUFlLEdBQVksSUFBSSxDQUFDO1FBSS9CLG9CQUFlLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFJeEQsK0JBQTBCLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFFcEUsNkJBQXdCLEdBQVcsVUFBVSxDQUFDO1FBTTlDLGVBQVUsR0FBYSxDQUFDLEtBQWEsRUFBRSxJQUFTLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQztRQUUxRCxTQUFJLEdBQVksS0FBSyxDQUFDO1FBRXRCLG1CQUFjLEdBQVksSUFBSSxDQUFDO1FBRS9CLHVCQUFrQixHQUFXLFlBQVksQ0FBQztRQUUxQyxpQkFBWSxHQUFXLEdBQUcsQ0FBQztRQUUzQixtQkFBYyxHQUFXLFVBQVUsQ0FBQztRQUVwQyxZQUFPLEdBQXFDLEVBQUUsQ0FBQztRQUkvQyxnQkFBVyxHQUFXLEdBQUcsQ0FBQztRQUkxQixvQkFBZSxHQUE4QixFQUFFLENBQUM7UUFFaEQsbUJBQWMsR0FBOEIsRUFBRSxDQUFDO1FBRS9DLGtCQUFhLEdBQVcsVUFBVSxDQUFDO1FBUW5DLHVCQUFrQixHQUFXLEdBQUcsQ0FBQztRQUVqQyxxQkFBZ0IsR0FBVyxFQUFFLENBQUM7UUFVOUIscUJBQWdCLEdBQVcsS0FBSyxDQUFDO1FBTWpDLGdCQUFXLEdBQVcsZUFBZSxDQUFDO1FBRXRDLGVBQVUsR0FBWSxJQUFJLENBQUM7UUFZM0IsaUJBQVksR0FBVyxTQUFTLENBQUM7UUFFakMsYUFBUSxHQUFXLE1BQU0sQ0FBQztRQU16QixnQkFBVyxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBRXBELGtCQUFhLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFFdEQsV0FBTSxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBRS9DLFdBQU0sR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUUvQyxhQUFRLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFFakQsZUFBVSxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBRW5ELGdCQUFXLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFFcEQsa0JBQWEsR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUV0RCx3QkFBbUIsR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUU1RCxnQkFBVyxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBRXBELGlCQUFZLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFFckQsaUJBQVksR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUVyRCxlQUFVLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFFbkQsbUJBQWMsR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUV2RCxpQkFBWSxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBRXJELDJCQUFzQixHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBRS9ELGlCQUFZLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFFckQsZ0JBQVcsR0FBeUIsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUV2RCxlQUFVLEdBQXlCLElBQUksWUFBWSxFQUFFLENBQUM7UUFFdEQsZ0JBQVcsR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUVwRCxtQkFBYyxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBa0JqRSxXQUFNLEdBQVUsRUFBRSxDQUFDO1FBSW5CLGtCQUFhLEdBQVcsQ0FBQyxDQUFDO1FBRTFCLFdBQU0sR0FBVyxDQUFDLENBQUM7UUFzQ25CLGtCQUFhLEdBQVEsRUFBRSxDQUFDO1FBa0N4QixlQUFVLEdBQVcsQ0FBQyxDQUFDO0lBNEJtRyxDQUFDO0lBRTNILFFBQVE7UUFDSixJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRTtZQUNsQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRTtnQkFDckIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLHNCQUFzQixFQUFFLENBQUMsQ0FBQzthQUN2RDtZQUVELElBQUksSUFBSSxDQUFDLGVBQWUsRUFBRTtnQkFDdEIsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUM7YUFDaEM7U0FDSjtRQUVELElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO0lBQzVCLENBQUM7SUFFRCxrQkFBa0I7UUFDZCxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO1lBQzVCLFFBQVEsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFO2dCQUNwQixLQUFLLFNBQVM7b0JBQ1YsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO29CQUN6QyxNQUFNO2dCQUVOLEtBQUssUUFBUTtvQkFDVCxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7b0JBQ3hDLE1BQU07Z0JBRU4sS0FBSyxNQUFNO29CQUNQLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztvQkFDdEMsTUFBTTtnQkFFTixLQUFLLGFBQWE7b0JBQ2QsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7b0JBQzdDLE1BQU07Z0JBRU4sS0FBSyxRQUFRO29CQUNULElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztvQkFDeEMsTUFBTTtnQkFFTixLQUFLLFNBQVM7b0JBQ1YsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO29CQUN6QyxNQUFNO2dCQUVOLEtBQUssVUFBVTtvQkFDWCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztvQkFDMUMsTUFBTTtnQkFFTixLQUFLLGNBQWM7b0JBQ2YsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7b0JBQzdDLE1BQU07Z0JBRU4sS0FBSyxZQUFZO29CQUNiLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO29CQUM1QyxNQUFNO2dCQUVOLEtBQUssY0FBYztvQkFDZixJQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztvQkFDOUMsTUFBTTtnQkFFTixLQUFLLFlBQVk7b0JBQ2IsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7b0JBQzVDLE1BQU07Z0JBRU4sS0FBSyxjQUFjO29CQUNmLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO29CQUM5QyxNQUFNO2dCQUVOLEtBQUssZ0JBQWdCO29CQUNqQixJQUFJLENBQUMsc0JBQXNCLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztvQkFDaEQsTUFBTTtnQkFFTixLQUFLLGNBQWM7b0JBQ2YsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7b0JBQzlDLE1BQU07Z0JBRU4sS0FBSyxlQUFlO29CQUNoQixJQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztvQkFDL0MsTUFBTTtnQkFFTixLQUFLLGdCQUFnQjtvQkFDakIsSUFBSSxDQUFDLHNCQUFzQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7b0JBQ2hELE1BQU07YUFDVDtRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELGVBQWU7UUFDWCxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7WUFDNUMsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7U0FDOUI7SUFDTCxDQUFDO0lBRUQsVUFBVTtRQUNOLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNqQixJQUFJLElBQUksQ0FBQyxtQkFBbUIsRUFBRTtnQkFDMUIsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFVBQVUsRUFBRSxDQUFDO2FBQ3pDO1lBRUQsSUFBSSxJQUFJLENBQUMseUJBQXlCLEVBQUU7Z0JBQ2hDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxVQUFVLEVBQUUsQ0FBQzthQUN6QztTQUNKO0lBQ0wsQ0FBQztJQUVELFdBQVcsQ0FBQyxZQUEyQjtRQUNuQyxJQUFJLFlBQVksQ0FBQyxLQUFLLEVBQUU7WUFDcEIsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFO2dCQUMxQyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7YUFDdkI7WUFFRCxJQUFJLENBQUMsTUFBTSxHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDO1lBRTlDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFO2dCQUNaLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztnQkFDbEIsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFFM0QsSUFBSSxJQUFJLENBQUMsUUFBUSxJQUFJLFFBQVEsSUFBSSxJQUFJLENBQUMsU0FBUztvQkFDM0MsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO3FCQUNqQixJQUFJLElBQUksQ0FBQyxRQUFRLElBQUksVUFBVSxJQUFJLElBQUksQ0FBQyxhQUFhO29CQUN0RCxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7cUJBQ25CLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFRLHNCQUFzQjtvQkFDbkQsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO2FBQ3RCO1lBRUQsSUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztTQUNwRTtRQUVELElBQUksWUFBWSxDQUFDLE9BQU8sRUFBRTtZQUN0QixJQUFJLENBQUMsUUFBUSxHQUFHLFlBQVksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDO1lBQ2xELElBQUksQ0FBQyxZQUFZLENBQUMsZUFBZSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7WUFFckUsSUFBSSxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxJQUFJLENBQUMsa0JBQWtCLElBQUksQ0FBQyxJQUFJLENBQUMsd0JBQXdCLEVBQUc7Z0JBQ2xHLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO2FBQzdCO1NBQ0o7UUFFRCxJQUFJLFlBQVksQ0FBQyxTQUFTLEVBQUU7WUFDeEIsSUFBSSxDQUFDLFVBQVUsR0FBRyxZQUFZLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQztZQUV0RCxtRUFBbUU7WUFDbkUsSUFBSyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRztnQkFDbEMsSUFBSSxJQUFJLENBQUMsUUFBUSxLQUFLLFFBQVEsRUFBRTtvQkFDNUIsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO2lCQUNyQjthQUNKO1NBQ0o7UUFFRCxJQUFJLFlBQVksQ0FBQyxTQUFTLEVBQUU7WUFDeEIsSUFBSSxDQUFDLFVBQVUsR0FBRyxZQUFZLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQztZQUV0RCxtRUFBbUU7WUFDbkUsSUFBSyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRztnQkFDbEMsSUFBSSxJQUFJLENBQUMsUUFBUSxLQUFLLFFBQVEsRUFBRTtvQkFDNUIsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO2lCQUNyQjthQUNKO1NBQ0o7UUFFRCxJQUFJLFlBQVksQ0FBQyxhQUFhLEVBQUU7WUFDNUIsSUFBSSxDQUFDLGNBQWMsR0FBRyxZQUFZLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQztZQUM5RCxJQUFJLElBQUksQ0FBQyxRQUFRLEtBQUssVUFBVSxFQUFFO2dCQUM5QixJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7YUFDdkI7U0FDSjtRQUVELElBQUksWUFBWSxDQUFDLFNBQVMsRUFBRTtZQUN4QixJQUFJLENBQUMsVUFBVSxHQUFHLFlBQVksQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDO1lBRXRELElBQUksQ0FBQyxJQUFJLENBQUMsaUNBQWlDLEVBQUU7Z0JBQ3pDLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO2dCQUMzQixJQUFJLENBQUMsWUFBWSxDQUFDLGlCQUFpQixFQUFFLENBQUM7YUFDekM7WUFDRCxJQUFJLENBQUMsaUNBQWlDLEdBQUcsS0FBSyxDQUFDO1NBQ2xEO0lBQ0wsQ0FBQztJQUVELElBQWEsS0FBSztRQUNkLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUN2QixDQUFDO0lBQ0QsSUFBSSxLQUFLLENBQUMsR0FBVTtRQUNoQixJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztJQUN0QixDQUFDO0lBRUQsSUFBYSxPQUFPO1FBQ2hCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUN6QixDQUFDO0lBQ0QsSUFBSSxPQUFPLENBQUMsSUFBVztRQUNuQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztJQUN6QixDQUFDO0lBRUQsSUFBYSxLQUFLO1FBQ2QsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3ZCLENBQUM7SUFDRCxJQUFJLEtBQUssQ0FBQyxHQUFXO1FBQ2pCLElBQUksQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO0lBQ3RCLENBQUM7SUFFRCxJQUFhLElBQUk7UUFDYixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDdEIsQ0FBQztJQUNELElBQUksSUFBSSxDQUFDLEdBQVc7UUFDaEIsSUFBSSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7SUFDckIsQ0FBQztJQUVELElBQWEsWUFBWTtRQUNyQixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUM7SUFDOUIsQ0FBQztJQUNELElBQUksWUFBWSxDQUFDLEdBQVc7UUFDeEIsSUFBSSxDQUFDLGFBQWEsR0FBRyxHQUFHLENBQUM7UUFDekIsSUFBSSxDQUFDLFlBQVksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDL0QsQ0FBQztJQUVELElBQWEsU0FBUztRQUNsQixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDM0IsQ0FBQztJQUVELElBQUksU0FBUyxDQUFDLEdBQVc7UUFDckIsSUFBSSxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUM7SUFDMUIsQ0FBQztJQUVELElBQWEsU0FBUztRQUNsQixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDM0IsQ0FBQztJQUNELElBQUksU0FBUyxDQUFDLEdBQVc7UUFDckIsSUFBSSxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUM7SUFDMUIsQ0FBQztJQUVELElBQWEsYUFBYTtRQUN0QixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUM7SUFDL0IsQ0FBQztJQUVELElBQUksYUFBYSxDQUFDLEdBQWU7UUFDN0IsSUFBSSxDQUFDLGNBQWMsR0FBRyxHQUFHLENBQUM7SUFDOUIsQ0FBQztJQUVELElBQWEsU0FBUztRQUNsQixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDM0IsQ0FBQztJQUVELElBQUksU0FBUyxDQUFDLEdBQVE7UUFDbEIsSUFBSSxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUM7SUFDMUIsQ0FBQztJQUVELG1CQUFtQjtRQUNmLElBQUksSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ2pDLElBQUksQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDO1lBQ3hCLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUU7Z0JBQ2hDLEtBQUksSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtvQkFDN0IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztpQkFDcEY7YUFDSjtpQkFDSTtnQkFDRCxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUMvRjtTQUNKO0lBQ0wsQ0FBQztJQUVELFlBQVksQ0FBQyxLQUFLO1FBQ2QsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQztRQUV2QixJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDWCxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQyxDQUFDO1NBQ3ZEO1FBRUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDYixLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUs7WUFDakIsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO1NBQ2xCLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNsQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDaEMsSUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRTVDLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRSxFQUFFO1lBQ25CLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztTQUNwQjtRQUVELElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO1FBRTNCLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNqQixJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7U0FDekI7SUFDTCxDQUFDO0lBRUQsSUFBSSxDQUFDLEtBQUs7UUFDTixJQUFJLGFBQWEsR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDO1FBRXhDLElBQUksSUFBSSxDQUFDLFFBQVEsS0FBSyxRQUFRLEVBQUU7WUFDNUIsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLEtBQUssS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7WUFDakcsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO1lBQzlCLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUVsQixJQUFJLElBQUksQ0FBQyxlQUFlLEVBQUU7Z0JBQ3RCLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO2dCQUNoQixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBRW5DLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtvQkFDakIsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO2lCQUN6QjthQUNKO1NBQ0o7UUFDRCxJQUFJLElBQUksQ0FBQyxRQUFRLEtBQUssVUFBVSxFQUFFO1lBQzlCLElBQUksT0FBTyxHQUFHLGFBQWEsQ0FBQyxPQUFPLElBQUksYUFBYSxDQUFDLE9BQU8sQ0FBQztZQUM3RCxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUU3QyxJQUFJLFFBQVEsRUFBRTtnQkFDVixJQUFJLENBQUMsT0FBTyxFQUFFO29CQUNWLElBQUksQ0FBQyxjQUFjLEdBQUcsQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFFM0UsSUFBSSxJQUFJLENBQUMsZUFBZSxFQUFFO3dCQUN0QixJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQzt3QkFDaEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO3dCQUVuQyxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7NEJBQ2pCLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQzt5QkFDekI7cUJBQ0o7aUJBQ0o7cUJBQ0k7b0JBQ0QsUUFBUSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO2lCQUN4QzthQUNKO2lCQUNJO2dCQUNELElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFO29CQUNqQyxJQUFJLENBQUMsY0FBYyxHQUFHLEVBQUUsQ0FBQztvQkFFekIsSUFBSSxJQUFJLENBQUMsZUFBZSxFQUFFO3dCQUN0QixJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQzt3QkFDaEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO3FCQUN0QztpQkFDSjtnQkFDRCxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDO2FBQ2xGO1lBRUQsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1NBQ3ZCO1FBRUQsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFLEVBQUU7WUFDbkIsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1NBQ3BCO1FBRUQsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7SUFDL0IsQ0FBQztJQUVELFVBQVU7UUFDTixJQUFJLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNsQyxJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7Z0JBQ3BCLElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDO2FBQzlCO1lBRUQsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO2dCQUNYLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxDQUFDLENBQUM7YUFDdkQ7aUJBQ0ksSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO2dCQUNqQixJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7b0JBQ2pCLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDO3dCQUNuQixJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUs7d0JBQ2hCLElBQUksRUFBRSxJQUFJLENBQUMsUUFBUTt3QkFDbkIsS0FBSyxFQUFFLElBQUksQ0FBQyxTQUFTO3dCQUNyQixLQUFLLEVBQUUsSUFBSSxDQUFDLFNBQVM7cUJBQ3hCLENBQUMsQ0FBQztpQkFDTjtxQkFDSTtvQkFDRCxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRTt3QkFDN0IsSUFBSSxNQUFNLEdBQUcsV0FBVyxDQUFDLGdCQUFnQixDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7d0JBQ2pFLElBQUksTUFBTSxHQUFHLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO3dCQUNqRSxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUM7d0JBRWxCLElBQUksTUFBTSxJQUFJLElBQUksSUFBSSxNQUFNLElBQUksSUFBSTs0QkFDaEMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDOzZCQUNYLElBQUksTUFBTSxJQUFJLElBQUksSUFBSSxNQUFNLElBQUksSUFBSTs0QkFDckMsTUFBTSxHQUFHLENBQUMsQ0FBQzs2QkFDVixJQUFJLE1BQU0sSUFBSSxJQUFJLElBQUksTUFBTSxJQUFJLElBQUk7NEJBQ3JDLE1BQU0sR0FBRyxDQUFDLENBQUM7NkJBQ1YsSUFBSSxPQUFPLE1BQU0sS0FBSyxRQUFRLElBQUksT0FBTyxNQUFNLEtBQUssUUFBUTs0QkFDN0QsTUFBTSxHQUFHLE1BQU0sQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7OzRCQUV0QyxNQUFNLEdBQUcsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBRWhFLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxDQUFDO29CQUNyQyxDQUFDLENBQUMsQ0FBQztpQkFDTjtnQkFFRCxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBRTtvQkFDbEIsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO2lCQUNsQjthQUNKO1lBRUQsSUFBSSxRQUFRLEdBQWE7Z0JBQ3JCLEtBQUssRUFBRSxJQUFJLENBQUMsU0FBUztnQkFDckIsS0FBSyxFQUFFLElBQUksQ0FBQyxTQUFTO2FBQ3hCLENBQUM7WUFFRixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUMzQixJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUN0QztJQUNMLENBQUM7SUFFRCxZQUFZO1FBQ1IsSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO1lBQ3BCLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtnQkFDWCxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQyxDQUFDO2FBQ3ZEO2lCQUNJLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtnQkFDakIsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO29CQUNqQixJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQzt3QkFDbkIsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLO3dCQUNoQixJQUFJLEVBQUUsSUFBSSxDQUFDLFFBQVE7d0JBQ25CLGFBQWEsRUFBRSxJQUFJLENBQUMsYUFBYTtxQkFDcEMsQ0FBQyxDQUFDO2lCQUNOO3FCQUNJO29CQUNELElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFO3dCQUM3QixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUNwRSxDQUFDLENBQUMsQ0FBQztpQkFDTjtnQkFFRCxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBRTtvQkFDbEIsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO2lCQUNsQjthQUNKO1lBRUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7Z0JBQ2IsYUFBYSxFQUFFLElBQUksQ0FBQyxhQUFhO2FBQ3BDLENBQUMsQ0FBQztZQUNILElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztTQUNoRDtJQUNMLENBQUM7SUFFRCxjQUFjLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxhQUFhLEVBQUUsS0FBSztRQUM3QyxJQUFJLE1BQU0sR0FBRyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM3RSxJQUFJLE1BQU0sR0FBRyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM3RSxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFFbEIsSUFBSSxNQUFNLElBQUksSUFBSSxJQUFJLE1BQU0sSUFBSSxJQUFJO1lBQ2hDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQzthQUNYLElBQUksTUFBTSxJQUFJLElBQUksSUFBSSxNQUFNLElBQUksSUFBSTtZQUNyQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO2FBQ1YsSUFBSSxNQUFNLElBQUksSUFBSSxJQUFJLE1BQU0sSUFBSSxJQUFJO1lBQ3JDLE1BQU0sR0FBRyxDQUFDLENBQUM7YUFDVixJQUFJLE9BQU8sTUFBTSxJQUFJLFFBQVEsSUFBSSxNQUFNLFlBQVksTUFBTSxFQUFFO1lBQzVELElBQUksTUFBTSxDQUFDLGFBQWEsSUFBSSxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsRUFBRTtnQkFDNUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2FBQ3RFO1NBQ0o7YUFDSTtZQUNELE1BQU0sR0FBRyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUN2QztRQUVELElBQUksTUFBTSxJQUFJLE1BQU0sRUFBRTtZQUNsQixPQUFPLENBQUMsYUFBYSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxhQUFhLEVBQUUsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNuSDtRQUVELE9BQU8sQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFFRCxXQUFXLENBQUMsS0FBYTtRQUNyQixJQUFJLElBQUksQ0FBQyxhQUFhLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUU7WUFDakQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNoRCxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxLQUFLLEtBQUssRUFBRTtvQkFDdkMsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUNoQzthQUNKO1NBQ0o7UUFFRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQsUUFBUSxDQUFDLEtBQWE7UUFDbEIsSUFBSSxJQUFJLENBQUMsUUFBUSxLQUFLLFFBQVEsRUFBRTtZQUM1QixPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLEtBQUssQ0FBQyxDQUFDO1NBQ3ZEO2FBQ0ksSUFBSSxJQUFJLENBQUMsUUFBUSxLQUFLLFVBQVUsRUFBRTtZQUNuQyxJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUM7WUFDbkIsSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO2dCQUNwQixLQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBQy9DLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksS0FBSyxFQUFFO3dCQUN0QyxNQUFNLEdBQUcsSUFBSSxDQUFDO3dCQUNkLE1BQU07cUJBQ1Q7aUJBQ0o7YUFDSjtZQUNELE9BQU8sTUFBTSxDQUFDO1NBQ2pCO0lBQ0wsQ0FBQztJQUVELGNBQWMsQ0FBQyxLQUFLO1FBQ2hCLElBQUksTUFBTSxHQUFrQixLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU8sQ0FBQztRQUN4RCxJQUFJLFVBQVUsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQ2pDLElBQUksVUFBVSxHQUFHLE1BQU0sQ0FBQyxhQUFhLElBQUksTUFBTSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUM7UUFDdkUsSUFBSSxVQUFVLElBQUksT0FBTyxJQUFJLFVBQVUsSUFBSSxRQUFRLElBQUksVUFBVSxJQUFJLEdBQUc7WUFDcEUsVUFBVSxJQUFJLE9BQU8sSUFBSSxVQUFVLElBQUksUUFBUSxJQUFJLFVBQVUsSUFBSSxHQUFHO1lBQ3BFLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxhQUFhLENBQUMsQ0FBQyxFQUFFO1lBQ2xFLE9BQU87U0FDVjtRQUVELElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUNwQixJQUFJLENBQUMsaUNBQWlDLEdBQUcsSUFBSSxDQUFDO1lBQzlDLElBQUksSUFBSSxDQUFDLHVCQUF1QixFQUFFLElBQUksS0FBSyxDQUFDLGFBQWEsQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLGNBQWMsSUFBSSxJQUFJLEVBQUU7Z0JBQy9GLFVBQVUsQ0FBQyxjQUFjLEVBQUUsQ0FBQztnQkFDNUIsSUFBSSxJQUFJLENBQUMsYUFBYSxJQUFJLElBQUksRUFBRTtvQkFDNUIsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQztpQkFDakQ7Z0JBRUQsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDO2dCQUNwQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2FBQ3pEO2lCQUNJO2dCQUNELElBQUksT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7Z0JBQzVCLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ3hDLElBQUksYUFBYSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDO2dCQUNwRSxJQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUNyRyxJQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUM7Z0JBQ3JDLElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQztnQkFFcEMsSUFBSSxhQUFhLEVBQUU7b0JBQ2YsSUFBSSxPQUFPLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQyxPQUFPLElBQUUsS0FBSyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUM7b0JBRXZFLElBQUksUUFBUSxJQUFJLE9BQU8sRUFBRTt3QkFDckIsSUFBSSxJQUFJLENBQUMscUJBQXFCLEVBQUUsRUFBRTs0QkFDOUIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7NEJBQ3ZCLElBQUksQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDOzRCQUN4QixJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzt5QkFDbkM7NkJBQ0k7NEJBQ0QsSUFBSSxjQUFjLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLE9BQU8sQ0FBQyxDQUFDOzRCQUN4RCxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxJQUFFLGNBQWMsQ0FBQyxDQUFDOzRCQUN0RSxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7NEJBQzFDLElBQUksWUFBWSxFQUFFO2dDQUNkLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQzs2QkFDM0M7eUJBQ0o7d0JBRUQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBQyxhQUFhLEVBQUUsS0FBSyxDQUFDLGFBQWEsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO3FCQUM3Rjt5QkFDSTt3QkFDRCxJQUFJLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxFQUFFOzRCQUM5QixJQUFJLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQzs0QkFDMUIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7NEJBQ25DLElBQUksWUFBWSxFQUFFO2dDQUNkLElBQUksQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDO2dDQUN4QixJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQzs2QkFDeEM7eUJBQ0o7NkJBQ0ksSUFBSSxJQUFJLENBQUMsdUJBQXVCLEVBQUUsRUFBRTs0QkFDckMsSUFBSSxPQUFPLEVBQUU7Z0NBQ1QsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsU0FBUyxJQUFFLEVBQUUsQ0FBQzs2QkFDeEM7aUNBQ0k7Z0NBQ0QsSUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7Z0NBQ3JCLElBQUksQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDOzZCQUMzQjs0QkFFRCxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFDLE9BQU8sQ0FBQyxDQUFDOzRCQUM5QyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7NEJBQzFDLElBQUksWUFBWSxFQUFFO2dDQUNkLElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDOzZCQUN4Qzt5QkFDSjt3QkFFRCxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxFQUFDLGFBQWEsRUFBRSxLQUFLLENBQUMsYUFBYSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLFFBQVEsRUFBQyxDQUFDLENBQUM7cUJBQ2xIO2lCQUNKO3FCQUNJO29CQUNELElBQUksSUFBSSxDQUFDLGFBQWEsS0FBSyxRQUFRLEVBQUU7d0JBQ2pDLElBQUksUUFBUSxFQUFFOzRCQUNWLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDOzRCQUN2QixJQUFJLENBQUMsYUFBYSxHQUFHLEVBQUUsQ0FBQzs0QkFDeEIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDOzRCQUMxQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxFQUFFLGFBQWEsRUFBRSxLQUFLLENBQUMsYUFBYSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7eUJBQy9GOzZCQUNJOzRCQUNELElBQUksQ0FBQyxVQUFVLEdBQUcsT0FBTyxDQUFDOzRCQUMxQixJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7NEJBQzFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUUsYUFBYSxFQUFFLEtBQUssQ0FBQyxhQUFhLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQzs0QkFDakgsSUFBSSxZQUFZLEVBQUU7Z0NBQ2QsSUFBSSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7Z0NBQ3hCLElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDOzZCQUN4Qzt5QkFDSjtxQkFDSjt5QkFDSSxJQUFJLElBQUksQ0FBQyxhQUFhLEtBQUssVUFBVSxFQUFFO3dCQUN4QyxJQUFJLFFBQVEsRUFBRTs0QkFDVixJQUFJLGNBQWMsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsT0FBTyxDQUFDLENBQUM7NEJBQ3hELElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksY0FBYyxDQUFDLENBQUM7NEJBQ3pFLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQzs0QkFDMUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBRSxhQUFhLEVBQUUsS0FBSyxDQUFDLGFBQWEsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDOzRCQUM1RixJQUFJLFlBQVksRUFBRTtnQ0FDZCxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUM7NkJBQzNDO3lCQUNKOzZCQUNJOzRCQUNELElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7NEJBQzVFLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQzs0QkFDMUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRSxhQUFhLEVBQUUsS0FBSyxDQUFDLGFBQWEsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDOzRCQUNqSCxJQUFJLFlBQVksRUFBRTtnQ0FDZCxJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQzs2QkFDeEM7eUJBQ0o7cUJBQ0o7aUJBQ0o7YUFDSjtZQUVELElBQUksQ0FBQyxZQUFZLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztZQUV0QyxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFBRTtnQkFDbkIsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO2FBQ3BCO1NBQ0o7UUFFRCxJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztJQUM1QixDQUFDO0lBRUQsaUJBQWlCLENBQUMsS0FBSztRQUNuQixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztJQUMzQixDQUFDO0lBRUQsbUJBQW1CLENBQUMsS0FBSztRQUNyQixJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDbEIsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztZQUU5QixJQUFJLElBQUksQ0FBQyx3QkFBd0IsS0FBSyxVQUFVLEVBQUU7Z0JBQzlDLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxPQUFPLENBQUM7Z0JBQ3BDLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQzlDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsRUFBQyxhQUFhLEVBQUUsS0FBSyxDQUFDLGFBQWEsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsUUFBUSxFQUFDLENBQUMsQ0FBQztnQkFDMUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUMzQyxJQUFJLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQzthQUM1QztpQkFDSSxJQUFJLElBQUksQ0FBQyx3QkFBd0IsS0FBSyxPQUFPLEVBQUU7Z0JBQ2hELElBQUksQ0FBQyxpQ0FBaUMsR0FBRyxJQUFJLENBQUM7Z0JBQzlDLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ3hDLElBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBRXJHLElBQUksQ0FBQyxRQUFRLEVBQUU7b0JBQ1gsSUFBSSxJQUFJLENBQUMscUJBQXFCLEVBQUUsRUFBRTt3QkFDOUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUM7d0JBQ3pCLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO3FCQUN0Qzt5QkFDSSxJQUFJLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxFQUFFO3dCQUNyQyxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7d0JBQzNCLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztxQkFDN0M7b0JBRUQsSUFBSSxZQUFZLEVBQUU7d0JBQ2QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7cUJBQ3hDO2lCQUNKO2dCQUVELElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQztnQkFDM0MsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxFQUFDLGFBQWEsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLFFBQVEsRUFBQyxDQUFDLENBQUM7YUFDL0Y7U0FDSjtJQUNMLENBQUM7SUFFRCxXQUFXLENBQUMsS0FBaUIsRUFBRSxRQUFnQjtRQUMzQyxJQUFJLFVBQVUsRUFBRSxRQUFRLENBQUM7UUFFekIsSUFBSSxJQUFJLENBQUMsY0FBYyxHQUFHLFFBQVEsRUFBRTtZQUNoQyxVQUFVLEdBQUcsUUFBUSxDQUFDO1lBQ3RCLFFBQVEsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDO1NBQ2xDO2FBQ0ksSUFBSSxJQUFJLENBQUMsY0FBYyxHQUFHLFFBQVEsRUFBRTtZQUNyQyxVQUFVLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQztZQUNqQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1NBQ3ZCO2FBQ0k7WUFDRCxVQUFVLEdBQUcsUUFBUSxDQUFDO1lBQ3RCLFFBQVEsR0FBRyxRQUFRLENBQUM7U0FDdkI7UUFFRCxJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUM3QixVQUFVLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQztZQUN6QixRQUFRLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQztTQUMxQjtRQUVELEtBQUksSUFBSSxDQUFDLEdBQUcsVUFBVSxFQUFFLENBQUMsSUFBSSxRQUFRLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDeEMsSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM5RSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsRUFBRTtnQkFDaEMsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRSxZQUFZLENBQUMsQ0FBQztnQkFDcEQsSUFBSSxZQUFZLEdBQVcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDbEgsSUFBSSxZQUFZLEVBQUU7b0JBQ2QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBQ3hDO2dCQUNELElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUMsYUFBYSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO2FBQ2xGO1NBQ0o7UUFFRCxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUVELG1CQUFtQixDQUFDLEtBQWlCO1FBQ2pDLElBQUksVUFBVSxFQUFFLFFBQVEsQ0FBQztRQUV6QixJQUFJLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLGNBQWMsRUFBRTtZQUMxQyxVQUFVLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQztZQUNqQyxRQUFRLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQztTQUNqQzthQUNJLElBQUksSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsY0FBYyxFQUFFO1lBQy9DLFVBQVUsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDO1lBQ2hDLFFBQVEsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDO1NBQ2xDO2FBQ0k7WUFDRCxVQUFVLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQztZQUNoQyxRQUFRLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQztTQUNqQztRQUVELEtBQUksSUFBSSxDQUFDLEdBQUcsVUFBVSxFQUFFLENBQUMsSUFBSSxRQUFRLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDeEMsSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNqQyxJQUFJLGNBQWMsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDN0QsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsSUFBRSxjQUFjLENBQUMsQ0FBQztZQUN0RSxJQUFJLFlBQVksR0FBVyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQ2xILElBQUksWUFBWSxFQUFFO2dCQUNkLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQzthQUMzQztZQUNELElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUMsYUFBYSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO1NBQ3BGO0lBQ0wsQ0FBQztJQUVELFVBQVUsQ0FBQyxPQUFPO1FBQ2QsSUFBSSxPQUFPLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUMzQixJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7Z0JBQ2QsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssU0FBUyxDQUFDO2FBQ2hHO2lCQUNJO2dCQUNELElBQUksSUFBSSxDQUFDLFNBQVMsWUFBWSxLQUFLO29CQUMvQixPQUFPLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzs7b0JBRS9DLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2FBQ25EO1NBQ0o7UUFFRCxPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBRUQsb0JBQW9CLENBQUMsT0FBWTtRQUM3QixJQUFJLEtBQUssR0FBVyxDQUFDLENBQUMsQ0FBQztRQUN2QixJQUFJLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUU7WUFDekMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUM1QyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtvQkFDekMsS0FBSyxHQUFHLENBQUMsQ0FBQztvQkFDVixNQUFNO2lCQUNUO2FBQ0o7U0FDSjtRQUVELE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFFRCxrQkFBa0IsQ0FBQyxLQUFVLEVBQUUsT0FBVztRQUN0QyxJQUFJLENBQUMsaUNBQWlDLEdBQUcsSUFBSSxDQUFDO1FBRTlDLElBQUksSUFBSSxDQUFDLFNBQVMsSUFBSSxPQUFPLEVBQUU7WUFDM0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUM7WUFDMUIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUMsYUFBYSxFQUFFLEtBQUssQ0FBQyxhQUFhLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFDLENBQUMsQ0FBQztZQUV2SCxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7Z0JBQ2QsSUFBSSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7Z0JBQ3hCLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDdkY7U0FDSjthQUNJO1lBQ0QsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7WUFDdkIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzFDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUMsYUFBYSxFQUFFLEtBQUssQ0FBQyxhQUFhLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFDLENBQUMsQ0FBQztTQUM1SDtRQUVELElBQUksQ0FBQyxZQUFZLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztRQUV0QyxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFBRTtZQUNuQixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7U0FDcEI7SUFDTCxDQUFDO0lBRUQscUJBQXFCLENBQUMsS0FBSyxFQUFFLE9BQVk7UUFDckMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxJQUFFLEVBQUUsQ0FBQztRQUNwQyxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3hDLElBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDckcsSUFBSSxDQUFDLGlDQUFpQyxHQUFHLElBQUksQ0FBQztRQUU5QyxJQUFJLFFBQVEsRUFBRTtZQUNWLElBQUksY0FBYyxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN4RCxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxJQUFJLGNBQWMsQ0FBQyxDQUFDO1lBQ3pFLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUMxQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxFQUFFLGFBQWEsRUFBRSxLQUFLLENBQUMsYUFBYSxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUM7WUFDeEgsSUFBSSxZQUFZLEVBQUU7Z0JBQ2QsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDO2FBQzNDO1NBQ0o7YUFDSTtZQUNELElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDNUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUUsYUFBYSxFQUFFLEtBQUssQ0FBQyxhQUFhLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQztZQUN0SCxJQUFJLFlBQVksRUFBRTtnQkFDZCxJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUN4QztTQUNKO1FBRUQsSUFBSSxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1FBRXRDLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRSxFQUFFO1lBQ25CLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztTQUNwQjtJQUNMLENBQUM7SUFFRCxzQkFBc0IsQ0FBQyxLQUFZLEVBQUUsS0FBYztRQUMvQyxJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsQ0FBQSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQ25HLElBQUksQ0FBQyxpQ0FBaUMsR0FBRyxJQUFJLENBQUM7UUFDOUMsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7UUFDM0IsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzNDLElBQUksQ0FBQyxZQUFZLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztRQUN0QyxJQUFJLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLEVBQUMsYUFBYSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztRQUV6RSxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFBRTtZQUNuQixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7U0FDcEI7SUFDTCxDQUFDO0lBRUQsTUFBTSxDQUFDLEtBQUssRUFBRSxLQUFLO1FBQ2YsT0FBTyxJQUFJLENBQUMsa0JBQWtCLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNySCxDQUFDO0lBRUQsTUFBTSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsU0FBUztRQUMxQixJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDcEIsWUFBWSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztTQUNwQztRQUVELElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQzVCLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsQ0FBQztTQUNoRTthQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUM1QixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDOUI7UUFFRCxJQUFJLENBQUMsYUFBYSxHQUFHLFVBQVUsQ0FBQyxHQUFHLEVBQUU7WUFDakMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ2YsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7UUFDOUIsQ0FBQyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUVyQixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztJQUMvQixDQUFDO0lBRUQsWUFBWSxDQUFDLEtBQUssRUFBRSxTQUFTO1FBQ3pCLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBRUQsYUFBYSxDQUFDLE1BQVc7UUFDckIsSUFBSSxNQUFNLEtBQUssSUFBSSxJQUFJLE1BQU0sS0FBSyxTQUFTLEVBQUU7WUFDekMsSUFBSSxDQUFDLE9BQU8sTUFBTSxLQUFLLFFBQVEsSUFBSSxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxZQUFZLEtBQUssSUFBSSxNQUFNLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQztnQkFDNUcsT0FBTyxJQUFJLENBQUM7O2dCQUVaLE9BQU8sS0FBSyxDQUFDO1NBQ3BCO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVELE9BQU87UUFDSCxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRTtZQUN2QixJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztZQUNmLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUNyQztRQUVELElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtZQUNYLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxDQUFDLENBQUM7U0FDdkQ7YUFDSTtZQUNELElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO2dCQUNiLE9BQU87YUFDVjtZQUVELElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUU7Z0JBQ25CLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO2dCQUMxQixJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7b0JBQ2hCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDMUQ7YUFDSjtpQkFDSTtnQkFDRCxJQUFJLHVCQUF1QixDQUFDO2dCQUM1QixJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUU7b0JBQ3hCLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLGtCQUFrQjt3QkFDekMsTUFBTSxJQUFJLEtBQUssQ0FBQyxnRkFBZ0YsQ0FBQyxDQUFDOzt3QkFFbEcsdUJBQXVCLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixJQUFFLElBQUksQ0FBQyxPQUFPLENBQUM7aUJBQ3ZFO2dCQUVELElBQUksQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDO2dCQUV4QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBQ3hDLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQztvQkFDdEIsSUFBSSxXQUFXLEdBQUcsS0FBSyxDQUFDO29CQUN4QixJQUFJLGFBQWEsR0FBRyxLQUFLLENBQUM7b0JBRTFCLEtBQUssSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTt3QkFDM0IsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLEtBQUssUUFBUSxFQUFFOzRCQUN4RCxhQUFhLEdBQUcsSUFBSSxDQUFDOzRCQUNyQixJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDOzRCQUNwQyxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUM7NEJBQ3ZCLElBQUksV0FBVyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUM7NEJBQ25DLElBQUksZUFBZSxHQUFHLFVBQVUsQ0FBQyxTQUFTLElBQUksWUFBWSxDQUFDOzRCQUMzRCxJQUFJLGNBQWMsR0FBRyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQzs0QkFDOUUsSUFBSSxnQkFBZ0IsR0FBRyxXQUFXLENBQUMsZUFBZSxDQUFDLENBQUM7NEJBRXBELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRTtnQ0FDbkUsVUFBVSxHQUFHLEtBQUssQ0FBQzs2QkFDdEI7NEJBRUQsSUFBSSxDQUFDLFVBQVUsRUFBRTtnQ0FDYixNQUFNOzZCQUNUO3lCQUNKO3FCQUNKO29CQUVELElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsSUFBSSx1QkFBdUIsRUFBRTt3QkFDbkUsS0FBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLHVCQUF1QixDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTs0QkFDcEQsSUFBSSxpQkFBaUIsR0FBRyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUUsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQ3JGLFdBQVcsR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxpQkFBaUIsQ0FBQyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQzs0QkFFN0ssSUFBSSxXQUFXLEVBQUU7Z0NBQ2IsTUFBTTs2QkFDVDt5QkFDSjtxQkFDSjtvQkFFRCxJQUFJLE9BQWdCLENBQUM7b0JBQ3JCLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBRTt3QkFDeEIsT0FBTyxHQUFHLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLElBQUksVUFBVSxJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUM7cUJBQ3hGO3lCQUNJO3dCQUNELE9BQU8sR0FBRyxhQUFhLElBQUksVUFBVSxDQUFDO3FCQUN6QztvQkFFRCxJQUFJLE9BQU8sRUFBRTt3QkFDVCxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQzFDO2lCQUNKO2dCQUVELElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUU7b0JBQ2pELElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO2lCQUM3QjtnQkFFRCxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7b0JBQ2hCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQzNHO2FBQ0o7U0FDSjtRQUVELElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO1lBQ2YsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPO1lBQ3JCLGFBQWEsRUFBRSxJQUFJLENBQUMsYUFBYSxJQUFJLElBQUksQ0FBQyxLQUFLO1NBQ2xELENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUU1QyxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUU7WUFDNUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1NBQ3BCO1FBRUQsSUFBSSxJQUFJLENBQUMsZUFBZSxFQUFFO1lBQ3RCLElBQUksQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDO1NBQ2hDO1FBRUQsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUV2QixJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDakIsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1NBQ3pCO0lBQ0wsQ0FBQztJQUVELFNBQVM7UUFDTCxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDakIsS0FBSyxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQzNCLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ25DLEtBQUssR0FBRyxLQUFLLENBQUM7Z0JBQ2QsTUFBTTthQUNUO1NBQ0o7UUFFRCxPQUFPLENBQUMsS0FBSyxDQUFDO0lBQ2xCLENBQUM7SUFFRCxzQkFBc0I7UUFDbEIsT0FBTztZQUNILEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztZQUNqQixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7WUFDZixTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVM7WUFDekIsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTO1lBQ3pCLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTztZQUNyQixZQUFZLEVBQUUsSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSTtZQUMxRixhQUFhLEVBQUUsSUFBSSxDQUFDLGFBQWE7U0FDcEMsQ0FBQztJQUNOLENBQUM7SUFFTSxLQUFLO1FBQ1IsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7UUFDdkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7UUFDeEMsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7UUFDM0IsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFL0IsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7UUFDMUIsSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7UUFFbEIsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7UUFDZixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFbEMsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ1gsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLHNCQUFzQixFQUFFLENBQUMsQ0FBQztTQUN2RDthQUNJO1lBQ0QsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUM5RDtJQUNMLENBQUM7SUFFTSxTQUFTLENBQUMsT0FBYTtRQUMxQixJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsYUFBYSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDNUMsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO1FBRWIsSUFBSSxPQUFPLElBQUksT0FBTyxDQUFDLGFBQWEsRUFBRTtZQUNsQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsSUFBSSxFQUFFLENBQUM7U0FDL0I7UUFFRCxTQUFTO1FBQ1QsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzFDLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0IsSUFBSSxNQUFNLENBQUMsVUFBVSxLQUFLLEtBQUssSUFBSSxNQUFNLENBQUMsS0FBSyxFQUFFO2dCQUM3QyxHQUFHLElBQUksR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFDO2dCQUVuRCxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxFQUFFO29CQUMvQixHQUFHLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQztpQkFDNUI7YUFDSjtTQUNKO1FBRUQsTUFBTTtRQUNOLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDdkIsR0FBRyxJQUFJLElBQUksQ0FBQztZQUNaLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDMUMsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDN0IsSUFBSSxNQUFNLENBQUMsVUFBVSxLQUFLLEtBQUssSUFBSSxNQUFNLENBQUMsS0FBSyxFQUFFO29CQUM3QyxJQUFJLFFBQVEsR0FBRyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFFbEUsSUFBSSxRQUFRLElBQUksSUFBSSxFQUFFO3dCQUNsQixJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7NEJBQ3JCLFFBQVEsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDO2dDQUMzQixJQUFJLEVBQUUsUUFBUTtnQ0FDZCxLQUFLLEVBQUUsTUFBTSxDQUFDLEtBQUs7NkJBQ3RCLENBQUMsQ0FBQzt5QkFDTjs7NEJBRUcsUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO3FCQUN2RDs7d0JBRUcsUUFBUSxHQUFHLEVBQUUsQ0FBQztvQkFHbEIsR0FBRyxJQUFJLEdBQUcsR0FBRyxRQUFRLEdBQUcsR0FBRyxDQUFDO29CQUU1QixJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxFQUFFO3dCQUMvQixHQUFHLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQztxQkFDNUI7aUJBQ0o7YUFDSjtRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUN2QixJQUFJLEVBQUUseUJBQXlCO1NBQ2xDLENBQUMsQ0FBQztRQUVILElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsRUFBRTtZQUNuQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxjQUFjLEdBQUcsTUFBTSxDQUFDLENBQUM7U0FDbEU7YUFDSTtZQUNELElBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDdkMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1lBQzVCLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2hDLElBQUksSUFBSSxDQUFDLFFBQVEsS0FBSyxTQUFTLEVBQUU7Z0JBQzdCLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDckQsSUFBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLGNBQWMsR0FBRyxNQUFNLENBQUMsQ0FBQztnQkFDNUQsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO2FBQ2hCO2lCQUNJO2dCQUNELEdBQUcsR0FBRyw4QkFBOEIsR0FBRyxHQUFHLENBQUM7Z0JBQzNDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7YUFDL0I7WUFDRCxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNuQztJQUNMLENBQUM7SUFFTSxjQUFjO1FBQ2pCLElBQUksSUFBSSxDQUFDLGFBQWE7WUFDbEIsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDOztZQUU3QixJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUMsR0FBRyxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUVNLG9CQUFvQixDQUFDLEtBQWE7UUFDckMsSUFBSSxJQUFJLENBQUMsbUJBQW1CLEVBQUU7WUFDMUIsSUFBSSxDQUFDLG1CQUFtQixDQUFDLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ3hEO1FBRUQsSUFBSSxJQUFJLENBQUMseUJBQXlCLEVBQUU7WUFDaEMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzlEO0lBQ0wsQ0FBQztJQUVNLFFBQVEsQ0FBQyxPQUFPO1FBQ25CLElBQUksSUFBSSxDQUFDLG1CQUFtQixFQUFFO1lBQzFCLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDOUM7UUFFRCxJQUFJLElBQUksQ0FBQyx5QkFBeUIsRUFBRTtZQUNoQyxJQUFJLENBQUMseUJBQXlCLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ3BEO0lBQ0wsQ0FBQztJQUVELGlCQUFpQixDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUs7UUFDdEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7UUFDeEIsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7UUFDNUIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEtBQUssQ0FBQztRQUM5QixJQUFJLENBQUMsbUJBQW1CLEdBQUcsS0FBSyxDQUFDO1FBQ2pDLElBQUksQ0FBQyx3QkFBd0IsRUFBRSxDQUFDO0lBQ3BDLENBQUM7SUFFRCxrQkFBa0I7UUFDZCxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsc0JBQXNCLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDeEcsQ0FBQztJQUVELHdCQUF3QjtRQUNwQixJQUFJLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFO1lBQzVCLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxDQUFDLEtBQUssRUFBRSxFQUFFO2dCQUNsQyxJQUFJLElBQUksQ0FBQyxXQUFXLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLElBQUksSUFBSSxDQUFDLGtCQUFrQixFQUFFLEVBQUU7b0JBQ3pFLFVBQVUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO29CQUMzRCxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztvQkFDeEIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsZUFBZSxFQUFFLGFBQWEsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLENBQUM7b0JBQzlJLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7b0JBQzdCLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO29CQUM1QixJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDO29CQUNoQyxJQUFJLENBQUMsMEJBQTBCLEVBQUUsQ0FBQztpQkFDckM7Z0JBRUQsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEtBQUssQ0FBQztZQUNsQyxDQUFDLENBQUM7WUFFRixRQUFRLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1NBQ2pFO0lBQ0wsQ0FBQztJQUVELDBCQUEwQjtRQUN0QixJQUFJLElBQUksQ0FBQyxvQkFBb0IsRUFBRTtZQUMzQixRQUFRLENBQUMsbUJBQW1CLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1lBQ2pFLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUM7U0FDcEM7SUFDTCxDQUFDO0lBRUQsV0FBVyxDQUFDLE9BQVk7UUFDcEIsSUFBSSxZQUFZLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDL0UsSUFBSSxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsR0FBRyxJQUFJLENBQUM7SUFDN0MsQ0FBQztJQUVELFdBQVcsQ0FBQyxPQUFZLEVBQUUsVUFBK0I7UUFDckQsSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxzQkFBc0IsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDbEUsSUFBSSxZQUFZLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDL0UsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxDQUFDO1NBQzVDO0lBQ0wsQ0FBQztJQUVELGFBQWEsQ0FBQyxPQUFZO1FBQ3RCLElBQUksWUFBWSxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQy9FLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBRUQsU0FBUyxDQUFDLE9BQVksRUFBRSxLQUFhO1FBQ2pDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2YsTUFBTSxJQUFJLEtBQUssQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFDO1NBQ25FO1FBRUQsSUFBSSxZQUFZLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFFL0UsSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLFlBQVksQ0FBQyxJQUFJLElBQUksRUFBRTtZQUM1QyxPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDMUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUM7Z0JBQ3BCLGFBQWEsRUFBRSxLQUFLO2dCQUNwQixJQUFJLEVBQUUsT0FBTzthQUNoQixDQUFDLENBQUM7U0FDTjthQUNJO1lBQ0QsSUFBSSxJQUFJLENBQUMsYUFBYSxLQUFLLFFBQVEsRUFBRTtnQkFDakMsSUFBSSxDQUFDLGVBQWUsR0FBRyxFQUFFLENBQUM7YUFDN0I7WUFFRCxJQUFJLENBQUMsZUFBZSxDQUFDLFlBQVksQ0FBQyxHQUFHLElBQUksQ0FBQztZQUMxQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQztnQkFDbEIsYUFBYSxFQUFFLEtBQUs7Z0JBQ3BCLElBQUksRUFBRSxPQUFPO2FBQ2hCLENBQUMsQ0FBQztTQUNOO1FBRUQsSUFBSSxLQUFLLEVBQUU7WUFDUCxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7U0FDMUI7UUFFRCxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFBRTtZQUNuQixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7U0FDcEI7SUFDTCxDQUFDO0lBRUQsYUFBYSxDQUFDLE9BQVk7UUFDdEIsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDO0lBQ3RHLENBQUM7SUFFRCxZQUFZLENBQUMsT0FBWTtRQUNyQixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUM7SUFDckcsQ0FBQztJQUVELHFCQUFxQjtRQUNqQixPQUFPLElBQUksQ0FBQyxhQUFhLEtBQUssUUFBUSxDQUFDO0lBQzNDLENBQUM7SUFFRCx1QkFBdUI7UUFDbkIsT0FBTyxJQUFJLENBQUMsYUFBYSxLQUFLLFVBQVUsQ0FBQztJQUM3QyxDQUFDO0lBRUQsbUJBQW1CLENBQUMsS0FBSztRQUNyQixJQUFJLGFBQWEsR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxhQUFhLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDckYsSUFBSSxDQUFDLGtCQUFrQixHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxhQUFhLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUMzRyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzNCLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUMzQixDQUFDO0lBRUQsY0FBYyxDQUFDLEtBQUs7UUFDaEIsSUFBSSxhQUFhLEdBQUcsVUFBVSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsYUFBYSxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQ3JGLFVBQVUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLGFBQWEsRUFBRSxxQkFBcUIsQ0FBQyxDQUFDO1FBQ2xGLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsYUFBYSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7UUFDbEgsSUFBSSxDQUFDLHFCQUFxQixDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDOUQsSUFBSSxDQUFDLHFCQUFxQixDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxhQUFhLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsR0FBRyxJQUFJLENBQUM7UUFFOUksSUFBSSxDQUFDLHFCQUFxQixDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztJQUNyRSxDQUFDO0lBRUQsaUJBQWlCLENBQUMsS0FBSyxFQUFFLE1BQU07UUFDM0IsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLGFBQWEsQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDO1FBQzFGLElBQUksV0FBVyxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUM7UUFDckMsSUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBRXJELElBQUksV0FBVyxHQUFHLEtBQUssR0FBRyxRQUFRLEVBQUU7WUFDaEMsS0FBSyxHQUFHLFFBQVEsR0FBRyxXQUFXLENBQUM7U0FDbEM7UUFFRCxNQUFNLGNBQWMsR0FBRyxXQUFXLEdBQUcsS0FBSyxDQUFDO1FBRTNDLElBQUksY0FBYyxJQUFJLFFBQVEsRUFBRTtZQUM1QixJQUFJLElBQUksQ0FBQyxnQkFBZ0IsS0FBSyxLQUFLLEVBQUU7Z0JBQ2pDLElBQUksVUFBVSxHQUFHLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQztnQkFDM0MsT0FBTyxDQUFDLFVBQVUsQ0FBQyxZQUFZLEVBQUU7b0JBQzdCLFVBQVUsR0FBRyxVQUFVLENBQUMsa0JBQWtCLENBQUM7aUJBQzlDO2dCQUVELElBQUksVUFBVSxFQUFFO29CQUNaLElBQUksZUFBZSxHQUFHLFVBQVUsQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO29CQUNyRCxJQUFJLGtCQUFrQixHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsUUFBUSxJQUFJLEVBQUUsQ0FBQztvQkFFekQsSUFBSSxjQUFjLEdBQUcsRUFBRSxJQUFJLGVBQWUsR0FBRyxRQUFRLENBQUMsa0JBQWtCLENBQUMsRUFBRTt3QkFDdkUsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFOzRCQUNqQixJQUFJLGNBQWMsR0FBRyxJQUFJLENBQUMsd0JBQXdCLENBQUMsTUFBTSxDQUFDLENBQUM7NEJBQzNELElBQUksbUJBQW1CLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FBQyxjQUFjLEVBQUUsb0NBQW9DLENBQUMsQ0FBQzs0QkFDdEcsSUFBSSxxQkFBcUIsR0FBRyxVQUFVLENBQUMsVUFBVSxDQUFDLGNBQWMsRUFBRSwyQ0FBMkMsQ0FBQyxDQUFDOzRCQUMvRyxJQUFJLHFCQUFxQixHQUFHLFVBQVUsQ0FBQyxVQUFVLENBQUMsY0FBYyxFQUFFLDJDQUEyQyxDQUFDLENBQUM7NEJBQy9HLElBQUksaUJBQWlCLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQzs0QkFFakQsSUFBSSxDQUFDLGNBQWMsQ0FBQyxxQkFBcUIsRUFBRSxpQkFBaUIsRUFBRSxjQUFjLEVBQUUsZUFBZSxDQUFDLENBQUM7NEJBQy9GLElBQUksQ0FBQyxjQUFjLENBQUMsbUJBQW1CLEVBQUUsaUJBQWlCLEVBQUUsY0FBYyxFQUFFLGVBQWUsQ0FBQyxDQUFDOzRCQUM3RixJQUFJLENBQUMsY0FBYyxDQUFDLHFCQUFxQixFQUFFLGlCQUFpQixFQUFFLGNBQWMsRUFBRSxlQUFlLENBQUMsQ0FBQzt5QkFDbEc7NkJBQ0k7NEJBQ0QsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsY0FBYyxHQUFHLElBQUksQ0FBQzs0QkFDM0MsSUFBSSxVQUFVLEVBQUU7Z0NBQ1osVUFBVSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsZUFBZSxHQUFHLElBQUksQ0FBQzs2QkFDbkQ7eUJBQ0o7cUJBQ0o7aUJBQ0o7YUFDSjtpQkFDSSxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsS0FBSyxRQUFRLEVBQUU7Z0JBQ3pDLElBQUksY0FBYyxHQUFHLFFBQVEsRUFBRTtvQkFDM0IsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO3dCQUNqQixJQUFJLENBQUMscUNBQXFDLENBQUMsTUFBTSxFQUFFLGNBQWMsRUFBRSxLQUFLLENBQUMsQ0FBQztxQkFDN0U7eUJBQ0k7d0JBQ0QsSUFBSSxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQyxXQUFXLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQzt3QkFDN0csTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsY0FBYyxHQUFHLElBQUksQ0FBQzt3QkFDM0MsSUFBSSxjQUFjLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQzt3QkFDbkUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLGNBQWMsR0FBRyxJQUFJLENBQUM7cUJBQzdFO2lCQUNKO2FBQ0o7WUFFRCxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQztnQkFDbEIsT0FBTyxFQUFFLE1BQU07Z0JBQ2YsS0FBSyxFQUFFLEtBQUs7YUFDZixDQUFDLENBQUM7WUFFSCxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFBRTtnQkFDbkIsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO2FBQ3BCO1NBQ0o7UUFFRCxJQUFJLENBQUMscUJBQXFCLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQ2hFLFVBQVUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLGFBQWEsRUFBRSxxQkFBcUIsQ0FBQyxDQUFDO0lBQ3pGLENBQUM7SUFFRCxxQ0FBcUMsQ0FBQyxNQUFNLEVBQUUsY0FBYyxFQUFFLEtBQUs7UUFDL0QsSUFBSSxjQUFjLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsd0JBQXdCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxhQUFhLENBQUM7UUFDNUcsSUFBSSxjQUFjLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FBQyxjQUFjLEVBQUUsOEJBQThCLENBQUMsQ0FBQztRQUMzRixJQUFJLGdCQUFnQixHQUFHLFVBQVUsQ0FBQyxVQUFVLENBQUMsY0FBYyxFQUFFLGdDQUFnQyxDQUFDLENBQUM7UUFDL0YsSUFBSSxnQkFBZ0IsR0FBRyxVQUFVLENBQUMsVUFBVSxDQUFDLGNBQWMsRUFBRSxnQ0FBZ0MsQ0FBQyxDQUFDO1FBQy9GLElBQUksbUJBQW1CLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FBQyxjQUFjLEVBQUUsb0NBQW9DLENBQUMsQ0FBQztRQUN0RyxJQUFJLHFCQUFxQixHQUFHLFVBQVUsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLEVBQUUsMkNBQTJDLENBQUMsQ0FBQztRQUNqSCxJQUFJLHFCQUFxQixHQUFHLFVBQVUsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLEVBQUUsMkNBQTJDLENBQUMsQ0FBQztRQUVqSCxNQUFNLHdCQUF3QixHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsbUJBQW1CLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDO1FBQ25HLE1BQU0sMEJBQTBCLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUM7UUFDdkcsTUFBTSxxQkFBcUIsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsYUFBYSxDQUFDLFdBQVcsSUFBSSx3QkFBd0IsQ0FBQztRQUU1RyxJQUFJLFFBQVEsR0FBRyxDQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLHFCQUFxQixFQUFFLEVBQUU7WUFDOUQsSUFBSSxTQUFTLElBQUksS0FBSyxFQUFFO2dCQUNwQixTQUFTLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQyx1QkFBdUIsQ0FBQyxjQUFjLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQTtnQkFDMUgsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQzthQUNwQztRQUNMLENBQUMsQ0FBQztRQUVGLFFBQVEsQ0FBQyxjQUFjLEVBQUUsbUJBQW1CLEVBQUUsd0JBQXdCLEVBQUUscUJBQXFCLENBQUMsQ0FBQztRQUMvRixRQUFRLENBQUMsZ0JBQWdCLEVBQUUscUJBQXFCLEVBQUUsMEJBQTBCLEVBQUUscUJBQXFCLENBQUMsQ0FBQztRQUNyRyxRQUFRLENBQUMsZ0JBQWdCLEVBQUUscUJBQXFCLEVBQUUsMEJBQTBCLEVBQUUscUJBQXFCLENBQUMsQ0FBQztRQUVyRyxJQUFJLE1BQU0sRUFBRTtZQUNSLElBQUksaUJBQWlCLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUVqRCxJQUFJLENBQUMsY0FBYyxDQUFDLHFCQUFxQixFQUFFLGlCQUFpQixFQUFFLGNBQWMsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNwRixJQUFJLENBQUMsY0FBYyxDQUFDLG1CQUFtQixFQUFFLGlCQUFpQixFQUFFLGNBQWMsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNsRixJQUFJLENBQUMsY0FBYyxDQUFDLHFCQUFxQixFQUFFLGlCQUFpQixFQUFFLGNBQWMsRUFBRSxJQUFJLENBQUMsQ0FBQztTQUN2RjtJQUNMLENBQUM7SUFFRCx3QkFBd0IsQ0FBQyxNQUFNO1FBQzNCLElBQUksTUFBTSxFQUFFO1lBQ1IsSUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQztZQUNsQyxPQUFPLE1BQU0sSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLDZCQUE2QixDQUFDLEVBQUU7Z0JBQzFFLE1BQU0sR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDO2FBQ2pDO1lBRUQsT0FBTyxNQUFNLENBQUM7U0FDakI7YUFDSTtZQUNELE9BQU8sSUFBSSxDQUFDO1NBQ2Y7SUFDTCxDQUFDO0lBRUQsY0FBYyxDQUFDLEtBQUssRUFBRSxpQkFBaUIsRUFBRSxjQUFjLEVBQUUsZUFBZTtRQUNwRSxJQUFJLEtBQUssRUFBRTtZQUNQLElBQUksUUFBUSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBRXBGLElBQUksUUFBUSxFQUFFO2dCQUNWLElBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsaUJBQWlCLENBQUMsQ0FBQztnQkFDL0MsSUFBSSxPQUFPLEdBQUcsR0FBRyxDQUFDLGtCQUFrQixDQUFDO2dCQUNyQyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxjQUFjLEdBQUcsSUFBSSxDQUFDO2dCQUV4QyxJQUFJLE9BQU8sSUFBSSxlQUFlLEVBQUU7b0JBQzVCLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLGVBQWUsR0FBRyxJQUFJLENBQUM7aUJBQ2hEO2FBQ0o7aUJBQ0k7Z0JBQ0QsTUFBTSxtRUFBbUUsQ0FBQzthQUM3RTtTQUNKO0lBQ0wsQ0FBQztJQUVELGlCQUFpQixDQUFDLEtBQUssRUFBRSxhQUFhO1FBQ2xDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxVQUFVLENBQUMsMEJBQTBCLENBQUMsSUFBSSxDQUFDLDJCQUEyQixDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQzlHLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxVQUFVLENBQUMsMkJBQTJCLENBQUMsSUFBSSxDQUFDLDZCQUE2QixDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ2xILElBQUksQ0FBQyxhQUFhLEdBQUcsYUFBYSxDQUFDO1FBQ25DLEtBQUssQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFJLGNBQWM7SUFDOUQsQ0FBQztJQUVELGlCQUFpQixDQUFDLEtBQUssRUFBRSxVQUFVO1FBQy9CLElBQUksSUFBSSxDQUFDLGtCQUFrQixJQUFJLElBQUksQ0FBQyxhQUFhLElBQUksVUFBVSxFQUFFO1lBQzdELEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUN2QixJQUFJLGVBQWUsR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUNsRixJQUFJLGdCQUFnQixHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUM7WUFFeEQsSUFBSSxJQUFJLENBQUMsYUFBYSxJQUFJLFVBQVUsRUFBRTtnQkFDbEMsSUFBSSxTQUFTLEdBQUcsVUFBVSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztnQkFDdEYsSUFBSSxTQUFTLEdBQUcsVUFBVSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO2dCQUM5RSxJQUFJLFVBQVUsR0FBRyxnQkFBZ0IsQ0FBQyxJQUFJLEdBQUcsZUFBZSxDQUFDLElBQUksQ0FBQztnQkFDOUQsSUFBSSxTQUFTLEdBQUcsZUFBZSxDQUFDLEdBQUcsR0FBRyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUM7Z0JBQzNELElBQUksWUFBWSxHQUFHLGdCQUFnQixDQUFDLElBQUksR0FBRyxVQUFVLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQztnQkFFdEUsSUFBSSxDQUFDLDJCQUEyQixDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLGdCQUFnQixDQUFDLEdBQUcsR0FBRyxlQUFlLENBQUMsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztnQkFDNUksSUFBSSxDQUFDLDZCQUE2QixDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLGdCQUFnQixDQUFDLEdBQUcsR0FBRyxlQUFlLENBQUMsR0FBRyxHQUFHLFVBQVUsQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO2dCQUV6SSxJQUFJLEtBQUssQ0FBQyxLQUFLLEdBQUcsWUFBWSxFQUFFO29CQUM1QixJQUFJLENBQUMsMkJBQTJCLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztvQkFDaEosSUFBSSxDQUFDLDZCQUE2QixDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7b0JBQ2xKLElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDO2lCQUN6QjtxQkFDSTtvQkFDRCxJQUFJLENBQUMsMkJBQTJCLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7b0JBQ3ZILElBQUksQ0FBQyw2QkFBNkIsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztvQkFDekgsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUMsQ0FBQztpQkFDMUI7Z0JBRUQsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxZQUFZLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLEtBQUssQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLFlBQVksS0FBSyxDQUFDLENBQUMsRUFBRTtvQkFDeEgsSUFBSSxDQUFDLDJCQUEyQixDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztvQkFDdEUsSUFBSSxDQUFDLDZCQUE2QixDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztpQkFDM0U7cUJBQ0k7b0JBQ0QsSUFBSSxDQUFDLDJCQUEyQixDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztvQkFDdkUsSUFBSSxDQUFDLDZCQUE2QixDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztpQkFDNUU7YUFDSjtpQkFDSTtnQkFDRCxLQUFLLENBQUMsWUFBWSxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUM7YUFDMUM7U0FDSjtJQUNMLENBQUM7SUFFRCxpQkFBaUIsQ0FBQyxLQUFLO1FBQ25CLElBQUksSUFBSSxDQUFDLGtCQUFrQixJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDL0MsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ3ZCLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7WUFDdEUsSUFBSSxDQUFDLDZCQUE2QixDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztTQUMzRTtJQUNMLENBQUM7SUFFRCxZQUFZLENBQUMsS0FBSyxFQUFFLFVBQVU7UUFDMUIsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3ZCLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUNwQixJQUFJLFNBQVMsR0FBRyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO1lBQ3RGLElBQUksU0FBUyxHQUFHLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztZQUM5RSxJQUFJLFNBQVMsR0FBRyxDQUFDLFNBQVMsSUFBSSxTQUFTLENBQUMsQ0FBQztZQUN6QyxJQUFJLFNBQVMsSUFBSSxDQUFDLENBQUMsU0FBUyxHQUFHLFNBQVMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLFlBQVksS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLFlBQVksS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUNwSSxTQUFTLEdBQUcsS0FBSyxDQUFDO2FBQ3JCO1lBRUQsSUFBSSxTQUFTLElBQUksQ0FBQyxDQUFDLFNBQVMsR0FBRyxTQUFTLElBQUksSUFBSSxDQUFDLFlBQVksS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUNuRSxTQUFTLEdBQUcsU0FBUyxHQUFHLENBQUMsQ0FBQzthQUM3QjtZQUVELElBQUksU0FBUyxJQUFJLENBQUMsQ0FBQyxTQUFTLEdBQUcsU0FBUyxJQUFJLElBQUksQ0FBQyxZQUFZLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUNwRSxTQUFTLEdBQUcsU0FBUyxHQUFHLENBQUMsQ0FBQzthQUM3QjtZQUVELElBQUksU0FBUyxFQUFFO2dCQUNYLFdBQVcsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7Z0JBRTdELElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDO29CQUNuQixTQUFTLEVBQUUsU0FBUztvQkFDcEIsU0FBUyxFQUFFLFNBQVM7b0JBQ3BCLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTztpQkFDeEIsQ0FBQyxDQUFDO2dCQUVILElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRSxFQUFFO29CQUNuQixJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRTt3QkFDN0IsVUFBVSxDQUFDLEdBQUcsRUFBRTs0QkFDWixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7d0JBQ3JCLENBQUMsQ0FBQyxDQUFDO29CQUNQLENBQUMsQ0FBQyxDQUFDO2lCQUNOO2FBQ0o7WUFFRCxJQUFJLENBQUMsMkJBQTJCLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1lBQ3RFLElBQUksQ0FBQyw2QkFBNkIsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7WUFDeEUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1lBQ3JDLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO1lBQzFCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO1NBQzVCO0lBQ0wsQ0FBQztJQUVELGNBQWMsQ0FBQyxLQUFLLEVBQUUsS0FBSztRQUN2QixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztRQUN4QixJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQztRQUM3QixLQUFLLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBSSxjQUFjO0lBQzlELENBQUM7SUFFRCxhQUFhLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxVQUFVO1FBQ2xDLElBQUksSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsZUFBZSxLQUFLLEtBQUssRUFBRTtZQUNwRCxJQUFJLElBQUksR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxVQUFVLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztZQUNsRixJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO1lBQ3hCLElBQUksT0FBTyxHQUFHLElBQUksR0FBRyxVQUFVLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMvRCxJQUFJLGNBQWMsR0FBRyxVQUFVLENBQUMsc0JBQXNCLENBQUM7WUFFdkQsSUFBSSxLQUFLLEdBQUcsT0FBTyxFQUFFO2dCQUNqQixVQUFVLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRSw4QkFBOEIsQ0FBQyxDQUFDO2dCQUVuRSxJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQztnQkFDN0IsSUFBSSxjQUFjO29CQUNkLFVBQVUsQ0FBQyxRQUFRLENBQUMsY0FBYyxFQUFFLDhCQUE4QixDQUFDLENBQUM7O29CQUVwRSxVQUFVLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSwyQkFBMkIsQ0FBQyxDQUFDO2FBQ3BFO2lCQUNJO2dCQUNELElBQUksY0FBYztvQkFDZCxVQUFVLENBQUMsV0FBVyxDQUFDLGNBQWMsRUFBRSw4QkFBOEIsQ0FBQyxDQUFDOztvQkFFdkUsVUFBVSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsMkJBQTJCLENBQUMsQ0FBQztnQkFFakUsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFDO2dCQUNqQyxVQUFVLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSw4QkFBOEIsQ0FBQyxDQUFDO2FBQ25FO1NBQ0o7SUFDTCxDQUFDO0lBRUQsY0FBYyxDQUFDLEtBQUssRUFBRSxVQUFVO1FBQzVCLElBQUksY0FBYyxHQUFHLFVBQVUsQ0FBQyxzQkFBc0IsQ0FBQztRQUN2RCxJQUFJLGNBQWMsRUFBRTtZQUNoQixVQUFVLENBQUMsV0FBVyxDQUFDLGNBQWMsRUFBRSw4QkFBOEIsQ0FBQyxDQUFDO1NBQzFFO1FBRUQsVUFBVSxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsOEJBQThCLENBQUMsQ0FBQztRQUNuRSxVQUFVLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRSwyQkFBMkIsQ0FBQyxDQUFDO0lBQ3BFLENBQUM7SUFFRCxZQUFZLENBQUMsS0FBSztRQUNkLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO1FBQzVCLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO0lBQ2hDLENBQUM7SUFFRCxTQUFTLENBQUMsS0FBSyxFQUFFLFVBQVU7UUFDdkIsSUFBSSxJQUFJLENBQUMsZUFBZSxJQUFJLElBQUksRUFBRTtZQUM5QixJQUFJLFNBQVMsR0FBRyxDQUFDLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsR0FBRyxDQUFDLENBQUM7WUFDbkosV0FBVyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxlQUFlLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFFdEUsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUM7Z0JBQ25CLFNBQVMsRUFBRSxJQUFJLENBQUMsZUFBZTtnQkFDL0IsU0FBUyxFQUFFLFNBQVM7YUFDdkIsQ0FBQyxDQUFDO1NBQ047UUFDRCxTQUFTO1FBQ1QsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDdkMsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBRUQsT0FBTztRQUNILElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxhQUFhLElBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUMxQyxPQUFPLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUVELG1CQUFtQjtRQUNmLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFFRCxVQUFVO1FBQ04sUUFBTyxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ3RCLEtBQUssT0FBTztnQkFDUixPQUFPLE1BQU0sQ0FBQyxZQUFZLENBQUM7WUFFL0IsS0FBSyxTQUFTO2dCQUNWLE9BQU8sTUFBTSxDQUFDLGNBQWMsQ0FBQztZQUVqQztnQkFDSSxNQUFNLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxZQUFZLEdBQUcsMEZBQTBGLENBQUMsQ0FBQztTQUN2STtJQUNMLENBQUM7SUFFRCxVQUFVO1FBQ04sT0FBTyxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQztJQUNqQyxDQUFDO0lBRUQsU0FBUztRQUNMLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUNsQyxJQUFJLEtBQUssR0FBZSxFQUFFLENBQUM7UUFFM0IsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2hCLEtBQUssQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztZQUN6QixLQUFLLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7U0FDMUI7UUFFRCxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDaEIsS0FBSyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1lBQ2pDLEtBQUssQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztTQUNwQztRQUVELElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUNwQixLQUFLLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUM7U0FDNUM7UUFFRCxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBRTtZQUNsQixLQUFLLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7U0FDaEM7UUFFRCxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtZQUN2QixJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDaEM7UUFFRCxJQUFJLElBQUksQ0FBQyxrQkFBa0IsRUFBRTtZQUN6QixJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQy9CO1FBRUQsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2hCLEtBQUssQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztTQUNwQztRQUVELElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsTUFBTSxFQUFFO1lBQzFDLEtBQUssQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQztTQUNoRDtRQUVELElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLEVBQUU7WUFDM0IsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztTQUN6RDtRQUVELElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFFRCxVQUFVO1FBQ04sTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBRWxDLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNmLE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQ3JDO0lBQ0wsQ0FBQztJQUVELFlBQVk7UUFDUixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDbEMsTUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFbkQsSUFBSSxXQUFXLEVBQUU7WUFDYixJQUFJLEtBQUssR0FBZSxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBRWhELElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtnQkFDaEIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO2dCQUN6QixJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7Z0JBQ3ZCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDbEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ25DO1lBRUQsSUFBSSxLQUFLLENBQUMsU0FBUyxFQUFFO2dCQUNqQixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztnQkFDMUIsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDO2dCQUNsQyxJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUM7YUFDckM7WUFFRCxJQUFJLEtBQUssQ0FBQyxhQUFhLEVBQUU7Z0JBQ3JCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO2dCQUMxQixJQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUM7YUFDN0M7WUFFRCxJQUFJLEtBQUssQ0FBQyxPQUFPLEVBQUU7Z0JBQ2YsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7Z0JBQzVCLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQzthQUNoQztZQUVELElBQUksSUFBSSxDQUFDLGdCQUFnQixFQUFFO2dCQUN2QixJQUFJLENBQUMsaUJBQWlCLEdBQUcsS0FBSyxDQUFDLFlBQVksQ0FBQztnQkFDNUMsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDO2FBQzNDO1lBRUQsSUFBSSxLQUFLLENBQUMsZUFBZSxFQUFFO2dCQUN2QixJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQyxlQUFlLENBQUM7YUFDaEQ7WUFFRCxJQUFJLEtBQUssQ0FBQyxTQUFTLEVBQUU7Z0JBQ2pCLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2FBQ2hGO1lBRUQsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7WUFFMUIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDbkM7SUFDTCxDQUFDO0lBRUQsZ0JBQWdCLENBQUMsS0FBSztRQUNsQixJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFDaEIsSUFBSSxPQUFPLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsYUFBYSxFQUFFLDBDQUEwQyxDQUFDLENBQUM7UUFDakgsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckUsS0FBSyxDQUFDLFlBQVksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRXRDLElBQUksSUFBSSxDQUFDLGdCQUFnQixLQUFLLFFBQVEsRUFBRTtZQUNwQyxLQUFLLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLGFBQWEsRUFBRSxzQ0FBc0MsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDbkgsVUFBVSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQyxHQUFHLElBQUksQ0FBQztTQUMxRztJQUNMLENBQUM7SUFFRCxtQkFBbUI7UUFDZixJQUFJLElBQUksQ0FBQyxpQkFBaUIsRUFBRTtZQUN4QixJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRS9DLElBQUksSUFBSSxDQUFDLGdCQUFnQixLQUFLLFFBQVEsSUFBSSxJQUFJLENBQUMsZUFBZSxFQUFFO2dCQUM1RCxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7b0JBQ2pCLElBQUksQ0FBQyxxQ0FBcUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUMsQ0FBQztpQkFDN0U7cUJBQ0k7b0JBQ0QsSUFBSSxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDO29CQUNyRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQztpQkFDNUU7YUFDSjtZQUVELElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtnQkFDakIsSUFBSSxVQUFVLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsYUFBYSxFQUFFLHVEQUF1RCxDQUFDLENBQUM7Z0JBQ2pJLElBQUksUUFBUSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLGFBQWEsRUFBRSxxREFBcUQsQ0FBQyxDQUFDO2dCQUU3SCxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO2dCQUN2RSxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO2FBQ3hFO2lCQUNJO2dCQUNELElBQUksT0FBTyxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxhQUFhLEVBQUUsMENBQTBDLENBQUMsQ0FBQztnQkFDN0csT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQzthQUM3RTtTQUNKO0lBQ0wsQ0FBQztJQUVELGVBQWUsQ0FBQyxLQUFLO1FBQ2pCLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNkLElBQUksV0FBVyxHQUFhLEVBQUUsQ0FBQztZQUMvQixJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRTtnQkFDdEIsV0FBVyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxJQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQTtZQUM5QyxDQUFDLENBQUMsQ0FBQztZQUVILEtBQUssQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO1NBQ25DO0lBQ0wsQ0FBQztJQUVELGtCQUFrQjtRQUNkLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUNsQyxNQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNuRCxJQUFJLFdBQVcsRUFBRTtZQUNiLElBQUksS0FBSyxHQUFlLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDaEQsSUFBSSxXQUFXLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQztZQUNwQyxJQUFJLFdBQVcsRUFBRTtnQkFDYixJQUFJLGdCQUFnQixHQUFHLEVBQUUsQ0FBQztnQkFDMUIsV0FBVyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDekUsSUFBSSxDQUFDLHdCQUF3QixHQUFHLElBQUksQ0FBQztnQkFDckMsSUFBSSxDQUFDLE9BQU8sR0FBRyxnQkFBZ0IsQ0FBQzthQUNuQztTQUNKO0lBQ0wsQ0FBQztJQUVELGVBQWUsQ0FBQyxHQUFHO1FBQ2YsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2QsS0FBSyxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO2dCQUMxQixJQUFJLEdBQUcsQ0FBQyxHQUFHLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEtBQUssR0FBRztvQkFDcEMsT0FBTyxHQUFHLENBQUM7O29CQUVYLFNBQVM7YUFDaEI7U0FDSjthQUNJO1lBQ0QsT0FBTyxJQUFJLENBQUM7U0FDZjtJQUNMLENBQUM7SUFFRCxXQUFXO1FBQ1AsSUFBSSxDQUFDLDBCQUEwQixFQUFFLENBQUM7UUFDbEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7UUFDeEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7SUFDNUIsQ0FBQzs7O1lBenREc0IsVUFBVTtZQUFlLE1BQU07WUFBdUIsWUFBWTtZQUFhLGlCQUFpQjs7O1lBNVYxSCxTQUFTLFNBQUM7Z0JBQ1AsUUFBUSxFQUFFLFNBQVM7Z0JBQ25CLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztLQW9EVDtnQkFDRCxTQUFTLEVBQUUsQ0FBQyxZQUFZLENBQUM7Z0JBQ3pCLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxPQUFPO2dCQUNoRCxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTs7YUFFeEM7OztZQXBIZ0MsVUFBVTtZQUFzRCxNQUFNO1lBcVp0QixZQUFZO1lBclpZLGlCQUFpQjs7OzRCQXVIckgsS0FBSzswQkFFTCxLQUFLO29CQUVMLEtBQUs7eUJBRUwsS0FBSzt5QkFFTCxLQUFLOzhCQUVMLEtBQUs7d0JBRUwsS0FBSzt3QkFFTCxLQUFLO2lDQUVMLEtBQUs7a0NBRUwsS0FBSztnQ0FFTCxLQUFLO3dDQUVMLEtBQUs7NENBRUwsS0FBSzt3Q0FFTCxLQUFLO29DQUVMLEtBQUs7K0JBRUwsS0FBSzt1QkFFTCxLQUFLOzhCQUVMLEtBQUs7NEJBRUwsS0FBSzs4QkFFTCxNQUFNO21DQUVOLEtBQUs7eUNBRUwsTUFBTTt1Q0FFTixLQUFLO3NCQUVMLEtBQUs7K0JBRUwsS0FBSzt5QkFFTCxLQUFLO21CQUVMLEtBQUs7NkJBRUwsS0FBSztpQ0FFTCxLQUFLOzJCQUVMLEtBQUs7NkJBRUwsS0FBSztzQkFFTCxLQUFLO2lDQUVMLEtBQUs7MEJBRUwsS0FBSzsyQkFFTCxLQUFLOzhCQUVMLEtBQUs7NkJBRUwsS0FBSzs0QkFFTCxLQUFLO3lCQUVMLEtBQUs7MkJBRUwsS0FBSzs0QkFFTCxLQUFLO2lDQUVMLEtBQUs7K0JBRUwsS0FBSzswQkFFTCxLQUFLO3lCQUVMLEtBQUs7MEJBRUwsS0FBSzsrQkFFTCxLQUFLOytCQUVMLEtBQUs7aUNBRUwsS0FBSztzQkFFTCxLQUFLOzBCQUVMLEtBQUs7eUJBRUwsS0FBSzt1QkFFTCxLQUFLO3lCQUVMLEtBQUs7eUJBRUwsS0FBSzs2QkFFTCxLQUFLO3VCQUVMLEtBQUs7MkJBRUwsS0FBSzt1QkFFTCxLQUFLOzBCQUVMLEtBQUs7MEJBRUwsS0FBSzswQkFFTCxNQUFNOzRCQUVOLE1BQU07cUJBRU4sTUFBTTtxQkFFTixNQUFNO3VCQUVOLE1BQU07eUJBRU4sTUFBTTswQkFFTixNQUFNOzRCQUVOLE1BQU07a0NBRU4sTUFBTTswQkFFTixNQUFNOzJCQUVOLE1BQU07MkJBRU4sTUFBTTt5QkFFTixNQUFNOzZCQUVOLE1BQU07MkJBRU4sTUFBTTtxQ0FFTixNQUFNOzJCQUVOLE1BQU07MEJBRU4sTUFBTTt5QkFFTixNQUFNOzBCQUVOLE1BQU07NkJBRU4sTUFBTTtpQ0FFTixTQUFTLFNBQUMsV0FBVztvQ0FFckIsU0FBUyxTQUFDLGNBQWM7MENBRXhCLFNBQVMsU0FBQyxvQkFBb0I7NENBRTlCLFNBQVMsU0FBQyxzQkFBc0I7NkJBRWhDLFNBQVMsU0FBQyxPQUFPO2tDQUVqQixTQUFTLFNBQUMsZ0JBQWdCO3dDQUUxQixTQUFTLFNBQUMsc0JBQXNCO3dCQUVoQyxlQUFlLFNBQUMsYUFBYTtvQkE0UjdCLEtBQUs7c0JBT0wsS0FBSztvQkFPTCxLQUFLO21CQU9MLEtBQUs7MkJBT0wsS0FBSzt3QkFRTCxLQUFLO3dCQVFMLEtBQUs7NEJBT0wsS0FBSzt3QkFRTCxLQUFLOztBQWdoRFYsTUFBTSxPQUFPLFNBQVM7SUFRbEIsWUFBbUIsRUFBUztRQUFULE9BQUUsR0FBRixFQUFFLENBQU87SUFBRyxDQUFDOzs7WUFBVCxLQUFLOzs7WUF2Qy9CLFNBQVMsU0FBQztnQkFDUCxRQUFRLEVBQUUsY0FBYztnQkFDeEIsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0tBeUJUO2dCQUNELGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxPQUFPO2dCQUNoRCxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTthQUN4Qzs7O1lBUzBCLEtBQUs7OztzQkFOM0IsS0FBSyxTQUFDLFlBQVk7dUJBRWxCLEtBQUssU0FBQyxvQkFBb0I7cUJBRTFCLEtBQUs7O0FBd0RWLE1BQU0sT0FBTyxjQUFjO0lBa0R2QixZQUFtQixFQUFTLEVBQVMsRUFBYyxFQUFTLElBQVk7UUFBckQsT0FBRSxHQUFGLEVBQUUsQ0FBTztRQUFTLE9BQUUsR0FBRixFQUFFLENBQVk7UUFBUyxTQUFJLEdBQUosSUFBSSxDQUFRO1FBZHhFLGdCQUFXLEdBQWEsRUFBRSxDQUFDO1FBZXZCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUU7WUFDakUsSUFBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUU7Z0JBQzdCLFVBQVUsQ0FBQyxHQUFHLEVBQUU7b0JBQ1osSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO2dCQUMxQixDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDWCxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7SUFDNUIsQ0FBQztJQXBCRixJQUFhLFlBQVk7UUFDckIsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDO0lBQzlCLENBQUM7SUFDRCxJQUFJLFlBQVksQ0FBQyxHQUFXO1FBQ3hCLElBQUksQ0FBQyxhQUFhLEdBQUcsR0FBRyxDQUFDO1FBQ3pCLElBQUksR0FBRyxJQUFJLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFO1lBQzVELE9BQU8sQ0FBQyxHQUFHLENBQUMsdUlBQXVJLENBQUMsQ0FBQTtTQUN2SjtJQUNMLENBQUM7SUFjRCxrQkFBa0I7UUFDZCxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxZQUFZLEVBQUU7WUFDekQsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ3RCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO1NBQzNCO0lBQ0wsQ0FBQztJQUVELGVBQWU7UUFDWCxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNkLElBQUksSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLElBQUksSUFBSSxDQUFDLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRTtnQkFDckQsVUFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSwyQkFBMkIsQ0FBQyxDQUFDO2FBQzNFO1lBRUQsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsc0JBQXNCLENBQUM7WUFDOUQsSUFBSSxVQUFVLEVBQUU7Z0JBQ1osSUFBSSxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWE7b0JBQ3JCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxVQUFVLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBRSxxQ0FBcUMsQ0FBQyxDQUFDOztvQkFFbEcsSUFBSSxDQUFDLGlCQUFpQixHQUFHLFVBQVUsQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFLDhCQUE4QixDQUFDLENBQUM7YUFDbEc7U0FDSjthQUNJO1lBQ0QsSUFBSSxJQUFJLENBQUMsMEJBQTBCLElBQUksSUFBSSxDQUFDLDBCQUEwQixDQUFDLGFBQWEsRUFBRTtnQkFDbEYsSUFBSSxDQUFDLDBCQUEwQixDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQyx3QkFBd0IsRUFBRSxHQUFHLElBQUksQ0FBQzthQUM3RztTQUNKO1FBRUQsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUMxQixDQUFDO0lBRUQsVUFBVTtRQUNOLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFO1lBQzdCLElBQUksSUFBSSxDQUFDLHFCQUFxQixJQUFJLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxhQUFhLEVBQUU7Z0JBQ3hFLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDM0QsSUFBSSxDQUFDLHFCQUFxQixDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUM7YUFDbEc7WUFFRCxJQUFJLElBQUksQ0FBQyxxQkFBcUIsSUFBSSxJQUFJLENBQUMscUJBQXFCLENBQUMsYUFBYSxFQUFFO2dCQUN4RSxJQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQzNELElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO2FBQ2xHO1lBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUU7Z0JBQ2QsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUV2RCxJQUFJLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYTtvQkFDckIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGFBQWEsRUFBRSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7O29CQUV6RyxJQUFJLENBQUMsbUJBQW1CLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQzthQUNsRztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELFlBQVk7UUFDUixJQUFJLElBQUksQ0FBQyxxQkFBcUIsSUFBSSxJQUFJLENBQUMscUJBQXFCLENBQUMsYUFBYSxFQUFFO1lBQ3hFLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxhQUFhLENBQUMsbUJBQW1CLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1NBQ3JHO1FBRUQsSUFBSSxJQUFJLENBQUMscUJBQXFCLElBQUksSUFBSSxDQUFDLHFCQUFxQixDQUFDLGFBQWEsRUFBRTtZQUN4RSxJQUFJLENBQUMscUJBQXFCLENBQUMsYUFBYSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQztTQUNyRztRQUVELElBQUksSUFBSSxDQUFDLG1CQUFtQixJQUFJLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxhQUFhLEVBQUU7WUFDcEUsSUFBSSxDQUFDLG1CQUFtQixDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7U0FDakc7UUFFRCxJQUFJLElBQUksQ0FBQyxpQkFBaUIsSUFBSSxJQUFJLENBQUMsaUJBQWlCLENBQUMsYUFBYSxFQUFFLEVBQUU7WUFDbEUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGFBQWEsRUFBRSxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7U0FDL0c7SUFDTCxDQUFDO0lBRUQsY0FBYztRQUNWLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDO1FBRXZFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxhQUFhLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztRQUUvRCxJQUFJLElBQUksQ0FBQyxxQkFBcUIsSUFBSSxJQUFJLENBQUMscUJBQXFCLENBQUMsYUFBYSxFQUFFO1lBQ3hFLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxhQUFhLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztTQUNwRTtRQUVELElBQUksQ0FBQyw0QkFBNEIsR0FBRyxJQUFJLENBQUM7SUFDN0MsQ0FBQztJQUVELGNBQWM7UUFDVixNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQztRQUN2RSxJQUFJLENBQUMsbUJBQW1CLENBQUMsYUFBYSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7UUFFL0QsSUFBSSxJQUFJLENBQUMscUJBQXFCLElBQUksSUFBSSxDQUFDLHFCQUFxQixDQUFDLGFBQWEsRUFBRTtZQUN4RSxJQUFJLENBQUMscUJBQXFCLENBQUMsYUFBYSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7U0FDcEU7UUFFRCxJQUFJLENBQUMsNEJBQTRCLEdBQUcsSUFBSSxDQUFDO0lBQzdDLENBQUM7SUFFRCxZQUFZLENBQUMsS0FBSztRQUNkLElBQUksSUFBSSxDQUFDLDRCQUE0QixFQUFFO1lBQ25DLElBQUksQ0FBQyw0QkFBNEIsR0FBRyxLQUFLLENBQUM7WUFDMUMsT0FBTztTQUNWO1FBRUQsSUFBSSxJQUFJLENBQUMscUJBQXFCLElBQUksSUFBSSxDQUFDLHFCQUFxQixDQUFDLGFBQWEsRUFBRTtZQUN4RSxJQUFJLENBQUMsd0JBQXdCLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1NBQ3RHO1FBRUQsSUFBSSxJQUFJLENBQUMscUJBQXFCLElBQUksSUFBSSxDQUFDLHFCQUFxQixDQUFDLGFBQWEsRUFBRTtZQUN4RSxJQUFJLENBQUMsd0JBQXdCLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1NBQ3RHO1FBRUQsSUFBSSxJQUFJLENBQUMsaUJBQWlCLEVBQUU7WUFDeEIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQztTQUM3RDtJQUNMLENBQUM7SUFFRCxtQkFBbUIsQ0FBQyxLQUFhO1FBQzdCLElBQUksSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUU7WUFDZCxJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUN2RSxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1NBQ2xEO0lBQ0wsQ0FBQztJQUVELGVBQWUsQ0FBQyxJQUFZO1FBQ3hCLElBQUksS0FBSyxHQUFhLEVBQUUsQ0FBQztRQUV6QixJQUFJLElBQUksS0FBSyxDQUFDLEVBQUU7WUFDWixLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQztTQUN4QjtRQUNELEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDakIsSUFBSSxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUU7WUFDcEMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FDeEI7UUFFRCxPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBRUQsUUFBUSxDQUFDLElBQVk7UUFDakIsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ2xDLElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQztnQkFDcEIsS0FBSyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxHQUFHLElBQUk7Z0JBQzFCLElBQUksRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUk7Z0JBQ2xCLFNBQVMsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLFNBQVM7Z0JBQzVCLFNBQVMsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLFNBQVM7Z0JBQzVCLE9BQU8sRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLE9BQU87Z0JBQ3hCLFlBQVksRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJO2dCQUNuRyxhQUFhLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhO2FBQ3ZDLENBQUMsQ0FBQztZQUNILElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQy9CO0lBQ0wsQ0FBQztJQUVELFVBQVU7UUFDTixJQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztJQUMxQixDQUFDO0lBRUQsWUFBWTtRQUNSLElBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxJQUFJLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDO1FBQzFELElBQUksVUFBVSxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZELE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBRUQsb0JBQW9CLENBQUMsS0FBYTtRQUM5QixJQUFJLElBQUksQ0FBQyxpQkFBaUIsRUFBRTtZQUN4QixJQUFJLENBQUMsaUJBQWlCLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQy9DO0lBQ0wsQ0FBQztJQUVELFFBQVEsQ0FBQyxPQUFPO1FBQ1osSUFBSSxJQUFJLENBQUMsaUJBQWlCLEVBQUU7WUFDeEIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUM1QzthQUNJO1lBQ0QsSUFBSSxJQUFJLENBQUMsbUJBQW1CLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRTtnQkFDakQsSUFBSSxDQUFDLG1CQUFtQixDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7YUFDNUQ7aUJBQ0k7Z0JBQ0QsSUFBSSxDQUFDLG1CQUFtQixDQUFDLGFBQWEsQ0FBQyxVQUFVLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQztnQkFDakUsSUFBSSxDQUFDLG1CQUFtQixDQUFDLGFBQWEsQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQzthQUNsRTtTQUNKO0lBQ0wsQ0FBQztJQUVELG1CQUFtQjtRQUNmLElBQUksSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhO1lBQ3JCLE9BQU8sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsYUFBYSxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxlQUFlLEVBQUUsQ0FBQzs7WUFFdEgsT0FBTyxVQUFVLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxhQUFhLENBQUMsR0FBRyxVQUFVLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUN0SixDQUFDO0lBRUQsY0FBYztRQUNWLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ2QsSUFBSSxjQUFjLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyx1QkFBdUIsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDM0YsSUFBSSxDQUFDLHdCQUF3QixDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsWUFBWSxHQUFHLGNBQWMsR0FBRyxJQUFJLENBQUM7WUFFdkYsSUFBSSxJQUFJLENBQUMsd0JBQXdCLElBQUksSUFBSSxDQUFDLHdCQUF3QixDQUFDLGFBQWEsRUFBRTtnQkFDOUUsSUFBSSxDQUFDLHdCQUF3QixDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsWUFBWSxHQUFHLGNBQWMsR0FBRyxJQUFJLENBQUM7YUFDMUY7U0FDSjtRQUNELElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO0lBQzdCLENBQUM7SUFFRCxXQUFXO1FBQ1AsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBRXBCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUM7UUFFOUIsSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ25CLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDbkM7UUFFRCxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztJQUM3QixDQUFDOzs7WUE5TnNCLEtBQUs7WUFBYSxVQUFVO1lBQWUsTUFBTTs7O1lBckczRSxTQUFTLFNBQUM7Z0JBQ1AsUUFBUSxFQUFFLG1CQUFtQjtnQkFDN0IsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7S0E2Q1Q7Z0JBQ0QsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE9BQU87Z0JBQ2hELGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO2FBQ3hDOzs7WUFtRDBCLEtBQUs7WUFod0VDLFVBQVU7WUFBc0QsTUFBTTs7O3NCQWd0RWxHLEtBQUssU0FBQyxpQkFBaUI7cUJBRXZCLEtBQUs7b0NBRUwsU0FBUyxTQUFDLGNBQWM7dUNBRXhCLFNBQVMsU0FBQyxpQkFBaUI7a0NBRTNCLFNBQVMsU0FBQyxZQUFZO21DQUV0QixTQUFTLFNBQUMsYUFBYTtvQ0FFdkIsU0FBUyxTQUFDLGNBQWM7dUNBRXhCLFNBQVMsU0FBQyxpQkFBaUI7eUNBRTNCLFNBQVMsU0FBQyxtQkFBbUI7Z0NBRTdCLFNBQVMsU0FBQyx3QkFBd0I7MkJBb0JsQyxLQUFLOztBQXFQVixNQUFNLE9BQU8sY0FBYztJQVl2QixZQUFtQixFQUFTO1FBQVQsT0FBRSxHQUFGLEVBQUUsQ0FBTztRQUN4QixJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBRTtZQUNsQixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEVBQUU7Z0JBQ3RFLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUMzQixDQUFDLENBQUMsQ0FBQztTQUNOO0lBQ0wsQ0FBQztJQUVELFFBQVE7UUFDSixJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBRTtZQUNsQixJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7U0FDMUI7SUFDTCxDQUFDO0lBRUQsZUFBZTtRQUNYLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzNDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztJQUNuRyxDQUFDO0lBR0QsT0FBTyxDQUFDLEtBQWlCO1FBQ3JCLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFFO1lBQ2xCLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUN2QixJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQztnQkFDVCxhQUFhLEVBQUUsS0FBSztnQkFDcEIsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO2FBQ3BCLENBQUMsQ0FBQztZQUVILFVBQVUsQ0FBQyxjQUFjLEVBQUUsQ0FBQztTQUMvQjtJQUNMLENBQUM7SUFHRCxVQUFVLENBQUMsS0FBaUI7UUFDeEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN4QixDQUFDO0lBRUQsU0FBUztRQUNMLE9BQU8sSUFBSSxDQUFDLHVCQUF1QixLQUFLLElBQUksQ0FBQztJQUNqRCxDQUFDO0lBRUQsV0FBVztRQUNQLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRTtZQUNuQixJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQ25DO0lBQ0wsQ0FBQzs7O1lBN0NzQixLQUFLOzs7WUF0Qi9CLFNBQVMsU0FBQztnQkFDUCxRQUFRLEVBQUUsbUJBQW1CO2dCQUM3QixJQUFJLEVBQUU7b0JBQ0YsMkJBQTJCLEVBQUUsYUFBYTtvQkFDMUMscUJBQXFCLEVBQUUsUUFBUTtvQkFDL0IsaUJBQWlCLEVBQUUsMEJBQTBCO29CQUM3QyxhQUFhLEVBQUUsZ0JBQWdCO29CQUMvQixrQkFBa0IsRUFBRSxXQUFXO2lCQUNsQzthQUNKOzs7WUFhMEIsS0FBSzs7O29CQVYzQixLQUFLLFNBQUMsaUJBQWlCO3NDQUV2QixLQUFLO3NCQTJCTCxZQUFZLFNBQUMsT0FBTyxFQUFFLENBQUMsUUFBUSxDQUFDO3lCQWFoQyxZQUFZLFNBQUMsZUFBZSxFQUFFLENBQUMsUUFBUSxDQUFDOztBQTBCN0MsTUFBTSxPQUFPLFFBQVE7SUFRakIsWUFBbUIsRUFBUyxFQUFTLEVBQXFCO1FBQXZDLE9BQUUsR0FBRixFQUFFLENBQU87UUFBUyxPQUFFLEdBQUYsRUFBRSxDQUFtQjtRQUN0RCxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDdEUsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQzNCLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELFFBQVE7UUFDSixJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7SUFDM0IsQ0FBQztJQUVELE9BQU8sQ0FBQyxLQUFLO1FBQ1QsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQzNCLENBQUM7SUFFRCxlQUFlO1FBQ1gsSUFBSSxJQUFJLENBQUMsRUFBRSxDQUFDLFFBQVEsS0FBSyxRQUFRLEVBQUU7WUFDL0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDekU7YUFDSSxJQUFJLElBQUksQ0FBQyxFQUFFLENBQUMsUUFBUSxLQUFLLFVBQVUsRUFBRTtZQUN0QyxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDL0MsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNqRDtRQUVELElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDM0IsQ0FBQztJQUVELFdBQVc7UUFDUCxJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDbkIsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUNuQztJQUNMLENBQUM7OztZQTlCc0IsS0FBSztZQUFhLGlCQUFpQjs7O1lBaEI3RCxTQUFTLFNBQUM7Z0JBQ1AsUUFBUSxFQUFFLFlBQVk7Z0JBQ3RCLFFBQVEsRUFBRTs7S0FFVDtnQkFDRCxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtnQkFDL0MsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7YUFDeEM7OztZQVMwQixLQUFLO1lBempGeUUsaUJBQWlCOzs7b0JBbWpGckgsS0FBSzs7QUErQ1YsTUFBTSxPQUFPLGFBQWE7SUFZdEIsWUFBbUIsRUFBUyxFQUFTLFlBQTBCO1FBQTVDLE9BQUUsR0FBRixFQUFFLENBQU87UUFBUyxpQkFBWSxHQUFaLFlBQVksQ0FBYztRQUMzRCxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBRTtZQUNsQixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUU7Z0JBQ3JFLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2xELENBQUMsQ0FBQyxDQUFDO1NBQ047SUFDTCxDQUFDO0lBRUQsUUFBUTtRQUNKLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFFO1lBQ2xCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ2pEO0lBQ0wsQ0FBQztJQUdELE9BQU8sQ0FBQyxLQUFZO1FBQ2hCLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFFO1lBQ2xCLElBQUksQ0FBQyxFQUFFLENBQUMsY0FBYyxDQUFDO2dCQUNuQixhQUFhLEVBQUUsS0FBSztnQkFDcEIsT0FBTyxFQUFFLElBQUksQ0FBQyxJQUFJO2dCQUNsQixRQUFRLEVBQUUsSUFBSSxDQUFDLEtBQUs7YUFDdkIsQ0FBQyxDQUFDO1NBQ047SUFDTCxDQUFDO0lBR0QsVUFBVSxDQUFDLEtBQVk7UUFDbkIsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUU7WUFDbEIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUNwQztJQUNMLENBQUM7SUFHRCxrQkFBa0IsQ0FBQyxLQUFvQjtRQUNuQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFFO1lBQ25CLE9BQU87U0FDVjtRQUVELE1BQU0sR0FBRyxHQUF3QixLQUFLLENBQUMsYUFBYSxDQUFDO1FBQ3JELE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVoRCxJQUFJLE9BQU8sRUFBRTtZQUNULE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztTQUNuQjtRQUVELEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUMzQixDQUFDO0lBR0QsZ0JBQWdCLENBQUMsS0FBb0I7UUFDakMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBRTtZQUNuQixPQUFPO1NBQ1Y7UUFFRCxNQUFNLEdBQUcsR0FBd0IsS0FBSyxDQUFDLGFBQWEsQ0FBQztRQUNyRCxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFaEQsSUFBSSxPQUFPLEVBQUU7WUFDVCxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7U0FDbkI7UUFFRCxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDM0IsQ0FBQztJQUdELGNBQWMsQ0FBQyxLQUFvQjtRQUMvQixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFFO1lBQ25CLE9BQU87U0FDVjtRQUVELElBQUksQ0FBQyxFQUFFLENBQUMsY0FBYyxDQUFDO1lBQ25CLGFBQWEsRUFBRSxLQUFLO1lBQ3BCLE9BQU8sRUFBRSxJQUFJLENBQUMsSUFBSTtZQUNsQixRQUFRLEVBQUUsSUFBSSxDQUFDLEtBQUs7U0FDdkIsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELHFCQUFxQixDQUFDLEdBQXdCO1FBQzFDLElBQUksT0FBTyxHQUF5QixHQUFHLENBQUMsa0JBQWtCLENBQUM7UUFDM0QsSUFBSSxPQUFPLEVBQUU7WUFDVCxJQUFJLFVBQVUsQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLDRCQUE0QixDQUFDO2dCQUMxRCxPQUFPLE9BQU8sQ0FBQzs7Z0JBRWYsT0FBTyxJQUFJLENBQUMscUJBQXFCLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDbEQ7YUFDSTtZQUNELE9BQU8sSUFBSSxDQUFDO1NBQ2Y7SUFDTCxDQUFDO0lBRUQscUJBQXFCLENBQUMsR0FBd0I7UUFDMUMsSUFBSSxPQUFPLEdBQXlCLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQztRQUMvRCxJQUFJLE9BQU8sRUFBRTtZQUNULElBQUksVUFBVSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsNEJBQTRCLENBQUM7Z0JBQzFELE9BQU8sT0FBTyxDQUFDOztnQkFFZixPQUFPLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUNsRDthQUNJO1lBQ0QsT0FBTyxJQUFJLENBQUM7U0FDZjtJQUNMLENBQUM7SUFFRCxTQUFTO1FBQ0wsT0FBTyxJQUFJLENBQUMsc0JBQXNCLEtBQUssSUFBSSxDQUFDO0lBQ2hELENBQUM7SUFFRCxXQUFXO1FBQ1AsSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ25CLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDbkM7SUFDTCxDQUFDOzs7WUEvR3NCLEtBQUs7WUFBdUIsWUFBWTs7O1lBcEJsRSxTQUFTLFNBQUM7Z0JBQ1AsUUFBUSxFQUFFLGtCQUFrQjtnQkFDNUIsSUFBSSxFQUFFO29CQUNGLDBCQUEwQixFQUFFLGFBQWE7b0JBQ3pDLHFCQUFxQixFQUFFLFVBQVU7b0JBQ2pDLGlCQUFpQixFQUFFLDZCQUE2QjtpQkFDbkQ7YUFDSjs7O1lBYTBCLEtBQUs7WUFBdUIsWUFBWTs7O21CQVY5RCxLQUFLLFNBQUMsZ0JBQWdCO29CQUV0QixLQUFLLFNBQUMscUJBQXFCO3FDQUUzQixLQUFLO3NCQW9CTCxZQUFZLFNBQUMsT0FBTyxFQUFFLENBQUMsUUFBUSxDQUFDO3lCQVdoQyxZQUFZLFNBQUMsVUFBVSxFQUFFLENBQUMsUUFBUSxDQUFDO2lDQU9uQyxZQUFZLFNBQUMsbUJBQW1CLEVBQUUsQ0FBQyxRQUFRLENBQUM7K0JBZ0I1QyxZQUFZLFNBQUMsaUJBQWlCLEVBQUUsQ0FBQyxRQUFRLENBQUM7NkJBZ0IxQyxZQUFZLFNBQUMsZUFBZSxFQUFFLENBQUMsUUFBUSxDQUFDOztBQTBEN0MsTUFBTSxPQUFPLHFCQUFxQjtJQVk5QixZQUFtQixFQUFTLEVBQVMsWUFBMEI7UUFBNUMsT0FBRSxHQUFGLEVBQUUsQ0FBTztRQUFTLGlCQUFZLEdBQVosWUFBWSxDQUFjO1FBQzNELElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFFO1lBQ2xCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRTtnQkFDckUsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbEQsQ0FBQyxDQUFDLENBQUM7U0FDTjtJQUNMLENBQUM7SUFFRCxRQUFRO1FBQ0osSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUU7WUFDbEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDakQ7SUFDTCxDQUFDO0lBR0QsT0FBTyxDQUFDLEtBQVk7UUFDaEIsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUU7WUFDbEIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxjQUFjLENBQUM7Z0JBQ25CLGFBQWEsRUFBRSxLQUFLO2dCQUNwQixPQUFPLEVBQUUsSUFBSSxDQUFDLElBQUk7Z0JBQ2xCLFFBQVEsRUFBRSxJQUFJLENBQUMsS0FBSzthQUN2QixDQUFDLENBQUM7U0FDTjtJQUNMLENBQUM7SUFFRCxTQUFTO1FBQ0wsT0FBTyxJQUFJLENBQUMsc0JBQXNCLEtBQUssSUFBSSxDQUFDO0lBQ2hELENBQUM7SUFFRCxXQUFXO1FBQ1AsSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ25CLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDbkM7SUFDTCxDQUFDOzs7WUFqQ3NCLEtBQUs7WUFBdUIsWUFBWTs7O1lBbkJsRSxTQUFTLFNBQUM7Z0JBQ1AsUUFBUSxFQUFFLDBCQUEwQjtnQkFDcEMsSUFBSSxFQUFFO29CQUNGLG9DQUFvQyxFQUFFLGFBQWE7b0JBQ25ELHFCQUFxQixFQUFFLFVBQVU7aUJBQ3BDO2FBQ0o7OztZQWEwQixLQUFLO1lBQXVCLFlBQVk7OzttQkFWOUQsS0FBSyxTQUFDLHdCQUF3QjtvQkFFOUIsS0FBSyxTQUFDLHFCQUFxQjtxQ0FFM0IsS0FBSztzQkFvQkwsWUFBWSxTQUFDLFVBQVUsRUFBRSxDQUFDLFFBQVEsQ0FBQzs7QUE4QnhDLE1BQU0sT0FBTyxjQUFjO0lBWXZCLFlBQW1CLEVBQVMsRUFBUyxZQUEwQixFQUFVLEVBQWM7UUFBcEUsT0FBRSxHQUFGLEVBQUUsQ0FBTztRQUFTLGlCQUFZLEdBQVosWUFBWSxDQUFjO1FBQVUsT0FBRSxHQUFGLEVBQUUsQ0FBWTtRQUNuRixJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBRTtZQUNsQixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO2dCQUMzRSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDcEQsQ0FBQyxDQUFDLENBQUM7U0FDTjtJQUNMLENBQUM7SUFHRCxhQUFhLENBQUMsS0FBWTtRQUN0QixJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBRTtZQUNsQixJQUFJLENBQUMsRUFBRSxDQUFDLG1CQUFtQixDQUFDO2dCQUN4QixhQUFhLEVBQUUsS0FBSztnQkFDcEIsT0FBTyxFQUFFLElBQUksQ0FBQyxJQUFJO2dCQUNsQixRQUFRLEVBQUUsSUFBSSxDQUFDLEtBQUs7YUFDdkIsQ0FBQyxDQUFDO1lBRUgsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDOUIsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO1NBQzFCO0lBQ0wsQ0FBQztJQUVELFNBQVM7UUFDTCxPQUFPLElBQUksQ0FBQyx1QkFBdUIsS0FBSyxJQUFJLENBQUM7SUFDakQsQ0FBQztJQUVELFdBQVc7UUFDUCxJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDbkIsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUNuQztJQUNMLENBQUM7OztZQTlCc0IsS0FBSztZQUF1QixZQUFZO1lBQWMsVUFBVTs7O1lBbkIxRixTQUFTLFNBQUM7Z0JBQ1AsUUFBUSxFQUFFLG1CQUFtQjtnQkFDN0IsSUFBSSxFQUFFO29CQUNGLGlDQUFpQyxFQUFFLFVBQVU7b0JBQzdDLGlCQUFpQixFQUFFLDZCQUE2QjtpQkFDbkQ7YUFDSjs7O1lBYTBCLEtBQUs7WUFBdUIsWUFBWTtZQTV5RmxDLFVBQVU7OzttQkFreUZ0QyxLQUFLLFNBQUMsaUJBQWlCO29CQUV2QixLQUFLLFNBQUMsc0JBQXNCO3NDQUU1QixLQUFLOzRCQWNMLFlBQVksU0FBQyxhQUFhLEVBQUUsQ0FBQyxRQUFRLENBQUM7O0FBNkIzQyxNQUFNLE9BQU8sVUFBVTtJQU1uQixZQUFtQixFQUFTO1FBQVQsT0FBRSxHQUFGLEVBQUUsQ0FBTztJQUFJLENBQUM7SUFHakMsT0FBTyxDQUFDLEtBQVk7UUFDaEIsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUU7WUFDbEIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNwQyxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7U0FDMUI7SUFDTCxDQUFDO0lBRUQsU0FBUztRQUNMLE9BQU8sSUFBSSxDQUFDLG1CQUFtQixLQUFLLElBQUksQ0FBQztJQUM3QyxDQUFDOzs7WUFac0IsS0FBSzs7O1lBVC9CLFNBQVMsU0FBQztnQkFDUCxRQUFRLEVBQUUsZUFBZTthQUM1Qjs7O1lBTzBCLEtBQUs7OzttQkFKM0IsS0FBSyxTQUFDLGFBQWE7a0NBRW5CLEtBQUs7c0JBSUwsWUFBWSxTQUFDLE9BQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQzs7QUFnQnJDLE1BQU0sT0FBTyxlQUFlO0lBWXhCLFlBQW1CLEVBQVMsRUFBUyxFQUFjLEVBQVMsSUFBWTtRQUFyRCxPQUFFLEdBQUYsRUFBRSxDQUFPO1FBQVMsT0FBRSxHQUFGLEVBQUUsQ0FBWTtRQUFTLFNBQUksR0FBSixJQUFJLENBQVE7SUFBSSxDQUFDO0lBRTdFLGVBQWU7UUFDWCxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBRTtZQUNsQixVQUFVLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLG9CQUFvQixDQUFDLENBQUM7WUFDakUsSUFBSSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzlDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLGtCQUFrQixDQUFDO1lBQzVDLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFaEQsSUFBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUU7Z0JBQzdCLElBQUksQ0FBQyx3QkFBd0IsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDNUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLHdCQUF3QixDQUFDLENBQUM7WUFDOUUsQ0FBQyxDQUFDLENBQUM7U0FDTjtJQUNMLENBQUM7SUFFRCxrQkFBa0I7UUFDZCxJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRTtZQUM3QixJQUFJLENBQUMseUJBQXlCLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNyRSxRQUFRLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1lBRXZFLElBQUksQ0FBQyx1QkFBdUIsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2pFLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLHVCQUF1QixDQUFDLENBQUM7UUFDdkUsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsb0JBQW9CO1FBQ2hCLElBQUksSUFBSSxDQUFDLHlCQUF5QixFQUFFO1lBQ2hDLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLHlCQUF5QixDQUFDLENBQUM7WUFDMUUsSUFBSSxDQUFDLHlCQUF5QixHQUFHLElBQUksQ0FBQztTQUN6QztRQUVELElBQUksSUFBSSxDQUFDLHVCQUF1QixFQUFFO1lBQzlCLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLHVCQUF1QixDQUFDLENBQUM7WUFDdEUsSUFBSSxDQUFDLHVCQUF1QixHQUFHLElBQUksQ0FBQztTQUN2QztJQUNMLENBQUM7SUFFRCxXQUFXLENBQUMsS0FBaUI7UUFDekIsSUFBSSxLQUFLLENBQUMsS0FBSyxLQUFLLENBQUMsRUFBRTtZQUNuQixJQUFJLENBQUMsRUFBRSxDQUFDLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ25DLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1NBQzdCO0lBQ0wsQ0FBQztJQUVELG1CQUFtQixDQUFDLEtBQWlCO1FBQ2pDLElBQUksQ0FBQyxFQUFFLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFFRCxpQkFBaUIsQ0FBQyxLQUFpQjtRQUMvQixJQUFJLENBQUMsRUFBRSxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3hELElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO0lBQ2hDLENBQUM7SUFFRCxTQUFTO1FBQ0wsT0FBTyxJQUFJLENBQUMsd0JBQXdCLEtBQUssSUFBSSxDQUFDO0lBQ2xELENBQUM7SUFFRCxXQUFXO1FBQ1AsSUFBSSxJQUFJLENBQUMsd0JBQXdCLEVBQUU7WUFDL0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLHdCQUF3QixDQUFDLENBQUM7U0FDaEY7UUFFRCxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztJQUNoQyxDQUFDOzs7WUFoRXNCLEtBQUs7WUFBYSxVQUFVO1lBQWUsTUFBTTs7O1lBZjNFLFNBQVMsU0FBQztnQkFDUCxRQUFRLEVBQUUsb0JBQW9CO2FBQ2pDOzs7WUFhMEIsS0FBSztZQXIzRkMsVUFBVTtZQUFzRCxNQUFNOzs7dUNBMjJGbEcsS0FBSzs7QUFnRlYsTUFBTSxPQUFPLGlCQUFpQjtJQWMxQixZQUFtQixFQUFTLEVBQVMsRUFBYyxFQUFTLElBQVk7UUFBckQsT0FBRSxHQUFGLEVBQUUsQ0FBTztRQUFTLE9BQUUsR0FBRixFQUFFLENBQVk7UUFBUyxTQUFJLEdBQUosSUFBSSxDQUFRO0lBQUksQ0FBQztJQUU3RSxlQUFlO1FBQ1gsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUU7WUFDbEIsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1NBQ3JCO0lBQ0wsQ0FBQztJQUVELFVBQVU7UUFDTixJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRTtZQUM3QixJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDckQsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1lBRTVFLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNyRCxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7WUFFNUUsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3BELElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUUxRSxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDckQsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1lBRTVFLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNyRCxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDaEYsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsWUFBWTtRQUNSLElBQUksSUFBSSxDQUFDLGlCQUFpQixFQUFFO1lBQ3hCLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7WUFDbEUsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQztTQUNqQztRQUVELElBQUksSUFBSSxDQUFDLGdCQUFnQixFQUFFO1lBQ3ZCLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDaEUsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQztTQUNoQztRQUVELElBQUksSUFBSSxDQUFDLGlCQUFpQixFQUFFO1lBQ3hCLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7WUFDbEUsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQztTQUNqQztRQUVELElBQUksSUFBSSxDQUFDLGlCQUFpQixFQUFFO1lBQ3hCLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7WUFDbEUsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQztTQUNqQztRQUVELElBQUksSUFBSSxDQUFDLGlCQUFpQixFQUFFO1lBQ3hCLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7WUFDbEUsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQztTQUNqQztJQUNMLENBQUM7SUFFRCxXQUFXLENBQUMsS0FBSztRQUNiLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEtBQUssT0FBTyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxLQUFLLFVBQVUsSUFBSSxVQUFVLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsa0JBQWtCLENBQUM7WUFDbEksSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQzs7WUFFeEMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztJQUMvQyxDQUFDO0lBRUQsV0FBVyxDQUFDLEtBQUs7UUFDYixJQUFJLENBQUMsRUFBRSxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQzVELENBQUM7SUFFRCxVQUFVLENBQUMsS0FBSztRQUNaLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUMzQixDQUFDO0lBRUQsV0FBVyxDQUFDLEtBQUs7UUFDYixJQUFJLENBQUMsRUFBRSxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQzVELENBQUM7SUFFRCxXQUFXLENBQUMsS0FBSztRQUNiLElBQUksQ0FBQyxFQUFFLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUdELE1BQU0sQ0FBQyxLQUFLO1FBQ1IsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUU7WUFDbEIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLENBQUM7U0FDdEQ7SUFDTCxDQUFDO0lBRUQsU0FBUztRQUNMLE9BQU8sSUFBSSxDQUFDLDBCQUEwQixLQUFLLElBQUksQ0FBQztJQUNwRCxDQUFDO0lBRUQsV0FBVztRQUNQLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUN4QixDQUFDOzs7WUExRnNCLEtBQUs7WUFBYSxVQUFVO1lBQWUsTUFBTTs7O1lBakIzRSxTQUFTLFNBQUM7Z0JBQ1AsUUFBUSxFQUFFLHNCQUFzQjthQUNuQzs7O1lBZTBCLEtBQUs7WUF6OEZDLFVBQVU7WUFBc0QsTUFBTTs7O3lDQTY3RmxHLEtBQUs7cUJBeUZMLFlBQVksU0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUM7O0FBb0JwQyxNQUFNLE9BQU8sY0FBYztJQVl2QixZQUFtQixFQUFTLEVBQVMsRUFBYyxFQUFTLElBQVk7UUFBckQsT0FBRSxHQUFGLEVBQUUsQ0FBTztRQUFTLE9BQUUsR0FBRixFQUFFLENBQVk7UUFBUyxTQUFJLEdBQUosSUFBSSxDQUFRO0lBQUcsQ0FBQztJQUU1RSxlQUFlO1FBQ1gsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUU7WUFDbEIsVUFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO1NBQ25FO0lBQ0wsQ0FBQztJQUdELE9BQU8sQ0FBQyxLQUFpQjtRQUNyQixJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBRTtZQUNsQixJQUFJLENBQUMsRUFBRSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQztZQUVoQyxJQUFJLElBQUksQ0FBQyxFQUFFLENBQUMsV0FBVyxFQUFFO2dCQUNyQixJQUFJLElBQUksQ0FBQyxFQUFFLENBQUMsV0FBVyxLQUFLLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFO29CQUMvQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSxFQUFFO3dCQUMvQixPQUFPO3FCQUNWO29CQUVELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7b0JBQ25DLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztpQkFDbkI7YUFDSjtpQkFDSTtnQkFDRCxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7YUFDbkI7U0FDSjtJQUNMLENBQUM7SUFFRCxRQUFRO1FBQ0osSUFBSSxDQUFDLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3ZGLFVBQVUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztRQUM3RCxJQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBQyxDQUFDLENBQUM7UUFDcEYsSUFBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUU7WUFDN0IsVUFBVSxDQUFDLEdBQUcsRUFBRTtnQkFDWixJQUFJLGlCQUFpQixHQUFHLElBQUksQ0FBQyxrQkFBa0IsSUFBSSx5QkFBeUIsQ0FBQztnQkFDN0UsSUFBSSxnQkFBZ0IsR0FBRyxVQUFVLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLGlCQUFpQixDQUFDLENBQUM7Z0JBRXZGLElBQUksZ0JBQWdCLEVBQUU7b0JBQ2xCLGdCQUFnQixDQUFDLEtBQUssRUFBRSxDQUFDO2lCQUM1QjtZQUNMLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNYLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELGdCQUFnQixDQUFDLFNBQVMsRUFBRSxLQUFLO1FBQzdCLElBQUksU0FBUztZQUNULElBQUksQ0FBQyxFQUFFLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxFQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLGdCQUFnQixFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLGVBQWUsRUFBRSxhQUFhLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFDLENBQUMsQ0FBQzs7WUFFMUksSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsZUFBZSxFQUFFLGFBQWEsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUMsQ0FBQyxDQUFDO1FBRTVJLFVBQVUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxXQUFXLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztRQUM5RCxJQUFJLENBQUMsRUFBRSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7UUFDM0IsSUFBSSxDQUFDLEVBQUUsQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO1FBQy9CLElBQUksQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxFQUFFLENBQUMsMEJBQTBCLEVBQUUsQ0FBQztJQUN6QyxDQUFDO0lBR0QsY0FBYyxDQUFDLEtBQW9CO1FBQy9CLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFFO1lBQ2xCLElBQUksSUFBSSxDQUFDLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSxFQUFFO2dCQUM5QixJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO2FBQ3RDO1lBRUQsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO1NBQzFCO0lBQ0wsQ0FBQztJQUdELGVBQWUsQ0FBQyxLQUFvQjtRQUNoQyxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBRTtZQUNsQixJQUFJLElBQUksQ0FBQyxFQUFFLENBQUMsa0JBQWtCLEVBQUUsRUFBRTtnQkFDOUIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQzthQUN2QztZQUVELEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztTQUMxQjtJQUNMLENBQUM7SUFLRCxjQUFjLENBQUMsS0FBb0I7UUFDL0IsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUU7WUFDbEIsSUFBSSxLQUFLLENBQUMsUUFBUTtnQkFDZCxJQUFJLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLENBQUM7aUJBQy9CO2dCQUNBLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDOUI7U0FDSjtJQUNMLENBQUM7SUFFRCxRQUFRLENBQUMsT0FBTztRQUNaLElBQUksT0FBTyxFQUFFO1lBQ1QsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDO1lBQ25CLE9BQU8sSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLENBQUMsRUFBRTtnQkFDekQsSUFBSSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUM7YUFDN0I7WUFFRCxPQUFPLElBQUksQ0FBQztTQUNmO2FBQ0k7WUFDRCxPQUFPLElBQUksQ0FBQztTQUNmO0lBQ0wsQ0FBQztJQUVELGtCQUFrQixDQUFDLEtBQW9CO1FBQ25DLElBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzlDLElBQUksV0FBVyxFQUFFO1lBQ2IsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLDBCQUEwQixDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBRTlELElBQUksVUFBVSxFQUFFO2dCQUNaLElBQUksSUFBSSxDQUFDLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSxFQUFFO29CQUM5QixJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO2lCQUN0QztnQkFFRCxVQUFVLENBQUMsbUJBQW1CLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFDckQsVUFBVSxDQUFDLG1CQUFtQixDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDcEQsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO2FBQzFCO1NBQ0o7SUFDTCxDQUFDO0lBRUQsY0FBYyxDQUFDLEtBQW9CO1FBQy9CLElBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzlDLElBQUksV0FBVyxFQUFFO1lBQ2IsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLHNCQUFzQixDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBRTFELElBQUksVUFBVSxFQUFFO2dCQUNaLElBQUksSUFBSSxDQUFDLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSxFQUFFO29CQUM5QixJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO2lCQUN0QztnQkFFRCxVQUFVLENBQUMsbUJBQW1CLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFDckQsVUFBVSxDQUFDLG1CQUFtQixDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDcEQsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO2FBQzFCO1NBQ0o7SUFDTCxDQUFDO0lBRUQsMEJBQTBCLENBQUMsSUFBYTtRQUNwQyxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsc0JBQXNCLENBQUM7UUFFM0MsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNYLElBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsc0JBQXNCLENBQUM7WUFDNUQsSUFBSSxXQUFXLEVBQUU7Z0JBQ2IsUUFBUSxHQUFHLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQzthQUMzQztTQUNKO1FBRUQsSUFBSSxRQUFRLEVBQUU7WUFDVixJQUFJLFVBQVUsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLG1CQUFtQixDQUFDO2dCQUNsRCxPQUFPLFFBQVEsQ0FBQzs7Z0JBRWhCLE9BQU8sSUFBSSxDQUFDLDBCQUEwQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQ3hEO2FBQ0k7WUFDRCxPQUFPLElBQUksQ0FBQztTQUNmO0lBQ0wsQ0FBQztJQUVELHNCQUFzQixDQUFDLElBQWE7UUFDaEMsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDO1FBRXZDLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDWCxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLGtCQUFrQixDQUFDO1lBQ3BELElBQUksT0FBTyxFQUFFO2dCQUNULFFBQVEsR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUM7YUFDeEM7U0FDSjtRQUVELElBQUksUUFBUSxFQUFFO1lBQ1YsSUFBSSxVQUFVLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxtQkFBbUIsQ0FBQztnQkFDbEQsT0FBTyxRQUFRLENBQUM7O2dCQUVoQixPQUFPLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUNwRDthQUNJO1lBQ0QsT0FBTyxJQUFJLENBQUM7U0FDZjtJQUNMLENBQUM7SUFFRCxTQUFTO1FBQ0wsT0FBTyxJQUFJLENBQUMsdUJBQXVCLEtBQUssSUFBSSxDQUFDO0lBQ2pELENBQUM7OztZQXpMc0IsS0FBSztZQUFhLFVBQVU7WUFBZSxNQUFNOzs7WUFmM0UsU0FBUyxTQUFDO2dCQUNQLFFBQVEsRUFBRSxtQkFBbUI7YUFDaEM7OztZQWEwQixLQUFLO1lBdGpHQyxVQUFVO1lBQXNELE1BQU07OzttQkE0aUdsRyxLQUFLLFNBQUMsaUJBQWlCO29CQUV2QixLQUFLLFNBQUMsc0JBQXNCO3VCQUU1QixLQUFLLFNBQUMseUJBQXlCO3NDQUUvQixLQUFLO2lDQUVMLEtBQUs7c0JBVUwsWUFBWSxTQUFDLE9BQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQzs2QkFrRGhDLFlBQVksU0FBQyxlQUFlLEVBQUUsQ0FBQyxRQUFRLENBQUM7OEJBV3hDLFlBQVksU0FBQyxnQkFBZ0IsRUFBRSxDQUFDLFFBQVEsQ0FBQzs2QkFXekMsWUFBWSxTQUFDLGFBQWEsRUFBRSxDQUFDLFFBQVEsQ0FBQyxjQUN0QyxZQUFZLFNBQUMsbUJBQW1CLEVBQUUsQ0FBQyxRQUFRLENBQUMsY0FDNUMsWUFBWSxTQUFDLGtCQUFrQixFQUFFLENBQUMsUUFBUSxDQUFDOztBQThHaEQsTUFBTSxPQUFPLFdBQVc7SUFNcEIsWUFBbUIsRUFBYztRQUFkLE9BQUUsR0FBRixFQUFFLENBQVk7SUFBRyxDQUFDO0lBRXJDLFNBQVM7UUFDTCxPQUFPLElBQUksQ0FBQyxvQkFBb0IsS0FBSyxJQUFJLENBQUM7SUFDOUMsQ0FBQzs7O1lBSnNCLFVBQVU7OztZQVRwQyxTQUFTLFNBQUM7Z0JBQ1AsUUFBUSxFQUFFLGdCQUFnQjthQUM3Qjs7O1lBcnZHZ0MsVUFBVTs7O21CQXd2R3RDLEtBQUssU0FBQyxjQUFjO21DQUVwQixLQUFLOztBQWFWLE1BQU0sT0FBTyxlQUFlO0lBRXhCLFlBQW1CLEVBQVMsRUFBUyxXQUF3QjtRQUExQyxPQUFFLEdBQUYsRUFBRSxDQUFPO1FBQVMsZ0JBQVcsR0FBWCxXQUFXLENBQWE7SUFBRyxDQUFDO0lBR2pFLE9BQU8sQ0FBQyxLQUFZO1FBQ2hCLElBQUksQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDM0MsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQzNCLENBQUM7OztZQU5zQixLQUFLO1lBQXNCLFdBQVc7OztZQUxoRSxTQUFTLFNBQUM7Z0JBQ1AsUUFBUSxFQUFFLG9CQUFvQjthQUNqQzs7O1lBRzBCLEtBQUs7WUFBc0IsV0FBVzs7O3NCQUU1RCxZQUFZLFNBQUMsT0FBTyxFQUFFLENBQUMsUUFBUSxDQUFDOztBQVdyQyxNQUFNLE9BQU8sZUFBZTtJQUV4QixZQUFtQixFQUFTLEVBQVMsV0FBd0I7UUFBMUMsT0FBRSxHQUFGLEVBQUUsQ0FBTztRQUFTLGdCQUFXLEdBQVgsV0FBVyxDQUFhO0lBQUcsQ0FBQztJQUdqRSxPQUFPLENBQUMsS0FBWTtRQUNoQixJQUFJLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUM5RSxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDM0IsQ0FBQzs7O1lBTnNCLEtBQUs7WUFBc0IsV0FBVzs7O1lBTGhFLFNBQVMsU0FBQztnQkFDUCxRQUFRLEVBQUUsb0JBQW9CO2FBQ2pDOzs7WUFHMEIsS0FBSztZQUFzQixXQUFXOzs7c0JBRTVELFlBQVksU0FBQyxPQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUM7O0FBVXJDLE1BQU0sT0FBTyxpQkFBaUI7SUFFMUIsWUFBbUIsRUFBUyxFQUFTLFdBQXdCO1FBQTFDLE9BQUUsR0FBRixFQUFFLENBQU87UUFBUyxnQkFBVyxHQUFYLFdBQVcsQ0FBYTtJQUFHLENBQUM7SUFHakUsT0FBTyxDQUFDLEtBQVk7UUFDaEIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM3QyxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDM0IsQ0FBQzs7O1lBTnNCLEtBQUs7WUFBc0IsV0FBVzs7O1lBTGhFLFNBQVMsU0FBQztnQkFDUCxRQUFRLEVBQUUsc0JBQXNCO2FBQ25DOzs7WUFHMEIsS0FBSztZQUFzQixXQUFXOzs7c0JBRTVELFlBQVksU0FBQyxPQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUM7O0FBbUJyQyxNQUFNLE9BQU8sVUFBVTtJQVFuQixZQUFtQixFQUFTLEVBQXFCLGNBQThCLEVBQXFCLFdBQXdCO1FBQXpHLE9BQUUsR0FBRixFQUFFLENBQU87UUFBcUIsbUJBQWMsR0FBZCxjQUFjLENBQWdCO1FBQXFCLGdCQUFXLEdBQVgsV0FBVyxDQUFhO0lBQUksQ0FBQztJQUVqSSxrQkFBa0I7UUFDZCxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO1lBQzVCLFFBQVEsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFO2dCQUNwQixLQUFLLE9BQU87b0JBQ1IsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO29CQUNuQyxNQUFNO2dCQUVWLEtBQUssUUFBUTtvQkFDVCxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7b0JBQ3BDLE1BQU07YUFDYjtRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELElBQUksT0FBTztRQUNQLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsY0FBYyxJQUFJLElBQUksQ0FBQyxFQUFFLENBQUMsV0FBVyxLQUFLLElBQUksQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQztZQUMzRyxDQUFDLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLEtBQUssS0FBSyxJQUFJLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUM1RyxDQUFDOzs7WUFuQnNCLEtBQUs7WUFBcUMsY0FBYyx1QkFBaEQsUUFBUTtZQUEwRSxXQUFXLHVCQUExQyxRQUFROzs7WUFwQjdGLFNBQVMsU0FBQztnQkFDUCxRQUFRLEVBQUUsY0FBYztnQkFDeEIsUUFBUSxFQUFFOzs7Ozs7O0tBT1Q7Z0JBQ0QsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7YUFDeEM7OztZQVMwQixLQUFLO1lBQXFDLGNBQWMsdUJBQWhELFFBQVE7WUFBMEUsV0FBVyx1QkFBMUMsUUFBUTs7O3dCQU56RixlQUFlLFNBQUMsYUFBYTs7QUE4Q2xDLE1BQU0sT0FBTyxnQkFBZ0I7SUFvQnpCLFlBQW1CLEVBQVMsRUFBUyxZQUEwQixFQUFTLEVBQXFCO1FBQTFFLE9BQUUsR0FBRixFQUFFLENBQU87UUFBUyxpQkFBWSxHQUFaLFlBQVksQ0FBYztRQUFTLE9BQUUsR0FBRixFQUFFLENBQW1CO1FBQ3pGLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRTtZQUNyRSxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM5QyxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQzNCLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELFFBQVE7UUFDSixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRUQsT0FBTyxDQUFDLEtBQVk7UUFDaEIsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDaEIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQztnQkFDdkIsYUFBYSxFQUFFLEtBQUs7Z0JBQ3BCLFFBQVEsRUFBRSxJQUFJLENBQUMsS0FBSzthQUN2QixFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUNsQjtRQUNELFVBQVUsQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUNoQyxDQUFDO0lBRUQsT0FBTztRQUNILFVBQVUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDcEUsQ0FBQztJQUVELE1BQU07UUFDRixVQUFVLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ3ZFLENBQUM7SUFFRCxXQUFXO1FBQ1AsSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ25CLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDbkM7SUFDTCxDQUFDOzs7WUFqQ3NCLEtBQUs7WUFBdUIsWUFBWTtZQUFhLGlCQUFpQjs7O1lBckNoRyxTQUFTLFNBQUM7Z0JBQ1AsUUFBUSxFQUFFLG9CQUFvQjtnQkFDOUIsUUFBUSxFQUFFOzs7Ozs7Ozs7OztLQVdUO2dCQUNELGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2dCQUMvQyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTthQUN4Qzs7O1lBcUIwQixLQUFLO1lBQXVCLFlBQVk7WUEvM0dzQyxpQkFBaUI7Ozt1QkE2MkdySCxLQUFLO29CQUVMLEtBQUs7b0JBRUwsS0FBSztzQkFFTCxLQUFLO21CQUVMLEtBQUs7d0JBRUwsS0FBSzsyQkFFTCxTQUFTLFNBQUMsS0FBSzs7QUE0RHBCLE1BQU0sT0FBTyxhQUFhO0lBc0J0QixZQUFtQixFQUFTLEVBQVMsWUFBMEIsRUFBUyxFQUFxQjtRQUExRSxPQUFFLEdBQUYsRUFBRSxDQUFPO1FBQVMsaUJBQVksR0FBWixZQUFZLENBQWM7UUFBUyxPQUFFLEdBQUYsRUFBRSxDQUFtQjtRQUN6RixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUU7WUFDckUsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDOUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUMzQixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxRQUFRO1FBQ0osSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUVELE9BQU8sQ0FBQyxLQUFZO1FBQ2hCLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2hCLElBQUksQ0FBQyxFQUFFLENBQUMscUJBQXFCLENBQUM7Z0JBQzFCLGFBQWEsRUFBRSxLQUFLO2dCQUNwQixRQUFRLEVBQUUsSUFBSSxDQUFDLEtBQUs7YUFDdkIsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDbEI7UUFDRCxVQUFVLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDaEMsQ0FBQztJQUVELE9BQU87UUFDSCxVQUFVLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ3BFLENBQUM7SUFFRCxNQUFNO1FBQ0YsVUFBVSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLGFBQWEsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUN2RSxDQUFDO0lBRUQsV0FBVztRQUNQLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRTtZQUNuQixJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQ25DO0lBQ0wsQ0FBQzs7O1lBakNzQixLQUFLO1lBQXVCLFlBQVk7WUFBYSxpQkFBaUI7OztZQXZDaEcsU0FBUyxTQUFDO2dCQUNQLFFBQVEsRUFBRSxpQkFBaUI7Z0JBQzNCLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7S0FXVDtnQkFDRCxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtnQkFDL0MsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7YUFDeEM7OztZQXVCMEIsS0FBSztZQUF1QixZQUFZO1lBMzhHc0MsaUJBQWlCOzs7dUJBdTdHckgsS0FBSztvQkFFTCxLQUFLO29CQUVMLEtBQUs7c0JBRUwsS0FBSzttQkFFTCxLQUFLO3VCQUVMLEtBQUs7d0JBRUwsS0FBSzsyQkFFTCxTQUFTLFNBQUMsS0FBSzs7QUE0RHBCLE1BQU0sT0FBTyxtQkFBbUI7SUFrQjVCLFlBQW1CLEVBQVMsRUFBUyxZQUEwQixFQUFTLEVBQXFCO1FBQTFFLE9BQUUsR0FBRixFQUFFLENBQU87UUFBUyxpQkFBWSxHQUFaLFlBQVksQ0FBYztRQUFTLE9BQUUsR0FBRixFQUFFLENBQW1CO1FBQ3pGLElBQUksQ0FBQyx1QkFBdUIsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRTtZQUM1RSxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1FBQzdDLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLDJCQUEyQixHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUU7WUFDcEYsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUM3QyxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxRQUFRO1FBQ0osSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztJQUM3QyxDQUFDO0lBRUQsT0FBTyxDQUFDLEtBQVk7UUFDaEIsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDaEIsSUFBSSxJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dCQUMzQyxJQUFJLENBQUMsRUFBRSxDQUFDLHNCQUFzQixDQUFDLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQzthQUN4RDtTQUNKO1FBRUQsVUFBVSxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQ2hDLENBQUM7SUFFRCxPQUFPO1FBQ0gsVUFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLGFBQWEsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUNwRSxDQUFDO0lBRUQsTUFBTTtRQUNGLFVBQVUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDdkUsQ0FBQztJQUVELFVBQVU7UUFDTixPQUFPLElBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztJQUNwRSxDQUFDO0lBRUQsV0FBVztRQUNQLElBQUksSUFBSSxDQUFDLDJCQUEyQixFQUFFO1lBQ2xDLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUNsRDtRQUVELElBQUksSUFBSSxDQUFDLHVCQUF1QixFQUFFO1lBQzlCLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUM5QztJQUNMLENBQUM7SUFFRCxrQkFBa0I7UUFDZCxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBRXZCLElBQUksSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUU7WUFDdkIsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUM7WUFDbEMsT0FBTyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQywwQkFBMEIsRUFBRSxDQUFDLENBQUM7U0FDNUg7YUFDSTtZQUNELE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDO1lBQzFCLE9BQU8sQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEtBQUssR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ2xJO0lBQ0wsQ0FBQztJQUVELDBCQUEwQjtRQUN0QixJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUU7WUFDeEIsT0FBTyxLQUFLLENBQUM7U0FDaEI7YUFDSTtZQUNELEtBQUssSUFBSSxPQUFPLElBQUksSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUU7Z0JBQ3ZDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsRUFBRTtvQkFDOUIsT0FBTyxLQUFLLENBQUM7aUJBQ2hCO2FBQ0o7WUFDRCxPQUFPLElBQUksQ0FBQztTQUNmO0lBQ0wsQ0FBQzs7O1lBdkVzQixLQUFLO1lBQXVCLFlBQVk7WUFBYSxpQkFBaUI7OztZQW5DaEcsU0FBUyxTQUFDO2dCQUNQLFFBQVEsRUFBRSx1QkFBdUI7Z0JBQ2pDLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7S0FXVDtnQkFDRCxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtnQkFDL0MsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7YUFDeEM7OztZQW1CMEIsS0FBSztZQUF1QixZQUFZO1lBbmhIc0MsaUJBQWlCOzs7MkJBbWdIckgsU0FBUyxTQUFDLEtBQUs7dUJBRWYsS0FBSztzQkFFTCxLQUFLO21CQUVMLEtBQUs7d0JBRUwsS0FBSzs7QUFzRlYsTUFBTSxPQUFPLG9CQUFvQjtJQUk3QixZQUFtQixFQUFjO1FBQWQsT0FBRSxHQUFGLEVBQUUsQ0FBWTtJQUFHLENBQUM7SUFFckMsZUFBZTtRQUNYLFVBQVUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsbUNBQW1DLENBQUMsQ0FBQztJQUNwRixDQUFDOzs7WUFKc0IsVUFBVTs7O1lBUHBDLFNBQVMsU0FBQztnQkFDUCxRQUFRLEVBQUUseUJBQXlCO2FBQ3RDOzs7WUFobUhnQyxVQUFVOzs7b0JBbW1IdEMsS0FBSyxTQUFDLHVCQUF1Qjs7QUFZbEMsTUFBTSxPQUFPLGNBQWM7SUFrQnZCLFlBQW1CLEVBQVMsRUFBUyxFQUFjLEVBQVMsSUFBWTtRQUFyRCxPQUFFLEdBQUYsRUFBRSxDQUFPO1FBQVMsT0FBRSxHQUFGLEVBQUUsQ0FBWTtRQUFTLFNBQUksR0FBSixJQUFJLENBQVE7SUFBRyxDQUFDO0lBRTVFLGVBQWU7UUFDWCxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBRTtZQUNsQixJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1lBQ3ZDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztTQUNyQjtJQUNMLENBQUM7SUFFRCxVQUFVO1FBQ04sSUFBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUU7WUFDN0IsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3JELElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUU1RSxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDckQsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1lBRTVFLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDakQsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUV4RSxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbkQsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBRTFFLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNyRCxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDaEYsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsWUFBWTtRQUNSLElBQUksSUFBSSxDQUFDLGlCQUFpQixFQUFFO1lBQ3hCLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7WUFDbEUsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQztTQUNqQztRQUVELElBQUksSUFBSSxDQUFDLGlCQUFpQixFQUFFO1lBQ3hCLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7WUFDbEUsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQztTQUNqQztRQUVELElBQUksSUFBSSxDQUFDLGVBQWUsRUFBRTtZQUN0QixRQUFRLENBQUMsbUJBQW1CLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUM5RCxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztTQUMvQjtRQUVELElBQUksSUFBSSxDQUFDLGdCQUFnQixFQUFFO1lBQ3ZCLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDaEUsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQztTQUNoQztRQUVELElBQUksSUFBSSxDQUFDLGlCQUFpQixFQUFFO1lBQ3hCLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7WUFDbEUsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQztTQUNqQztJQUNMLENBQUM7SUFFRCxXQUFXLENBQUMsS0FBSztRQUNiLElBQUksVUFBVSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLG1DQUFtQyxDQUFDO1lBQ3RFLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7O1lBRXZDLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7SUFDaEQsQ0FBQztJQUVELFdBQVcsQ0FBQyxLQUFLO1FBQ2IsSUFBSSxDQUFDLEVBQUUsQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBRUQsU0FBUyxDQUFDLEtBQUs7UUFDWCxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM1QixJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0lBQzVDLENBQUM7SUFFRCxVQUFVLENBQUMsS0FBSztRQUNaLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDaEUsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQzNCLENBQUM7SUFFRCxXQUFXLENBQUMsS0FBSztRQUNiLElBQUksQ0FBQyxFQUFFLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFFRCxTQUFTO1FBQ0wsT0FBTyxJQUFJLENBQUMsdUJBQXVCLEtBQUssSUFBSSxDQUFDO0lBQ2pELENBQUM7SUFHRCxNQUFNLENBQUMsS0FBSztRQUNSLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLElBQUksQ0FBQyxFQUFFLENBQUMsV0FBVyxFQUFFO1lBQ3pDLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1NBQ25EO1FBRUQsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFBO0lBQzFCLENBQUM7OztZQTNGc0IsS0FBSztZQUFhLFVBQVU7WUFBZSxNQUFNOzs7WUFyQjNFLFNBQVMsU0FBQztnQkFDUCxRQUFRLEVBQUUsbUJBQW1CO2FBQ2hDOzs7WUFtQjBCLEtBQUs7WUFqb0hDLFVBQVU7WUFBc0QsTUFBTTs7O29CQWluSGxHLEtBQUssU0FBQyxpQkFBaUI7c0NBRXZCLEtBQUs7cUJBa0dMLFlBQVksU0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUM7O0FBZXBDLE1BQU0sT0FBTyxXQUFXOzs7WUFMdkIsUUFBUSxTQUFDO2dCQUNOLE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBQyxlQUFlLEVBQUMsZUFBZSxDQUFDO2dCQUN2RCxPQUFPLEVBQUUsQ0FBQyxLQUFLLEVBQUMsWUFBWSxFQUFDLGNBQWMsRUFBQyxhQUFhLEVBQUMsVUFBVSxFQUFDLGNBQWMsRUFBQyxlQUFlLEVBQUMsaUJBQWlCLEVBQUMsY0FBYyxFQUFDLFVBQVUsRUFBQyxRQUFRLEVBQUMsZ0JBQWdCLEVBQUMsYUFBYSxFQUFDLG1CQUFtQixFQUFDLG9CQUFvQixFQUFDLGNBQWMsRUFBQyxxQkFBcUIsRUFBQyxXQUFXLEVBQUMsZUFBZSxFQUFDLGVBQWUsRUFBQyxpQkFBaUIsRUFBQyxlQUFlLENBQUM7Z0JBQ3BWLFlBQVksRUFBRSxDQUFDLEtBQUssRUFBQyxjQUFjLEVBQUMsYUFBYSxFQUFDLFVBQVUsRUFBQyxjQUFjLEVBQUMsZUFBZSxFQUFDLGlCQUFpQixFQUFDLGNBQWMsRUFBQyxVQUFVLEVBQUMsU0FBUyxFQUFDLGNBQWMsRUFBQyxRQUFRLEVBQUMsZ0JBQWdCLEVBQUMsYUFBYSxFQUFDLG1CQUFtQixFQUFDLG9CQUFvQixFQUFDLGNBQWMsRUFBQyxxQkFBcUIsRUFBQyxXQUFXLEVBQUMsZUFBZSxFQUFDLGVBQWUsRUFBQyxpQkFBaUIsQ0FBQzthQUN4ViIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlLCBDb21wb25lbnQsIEhvc3RMaXN0ZW5lciwgT25Jbml0LCBPbkRlc3Ryb3ksIEFmdGVyVmlld0luaXQsIEFmdGVyVmlld0NoZWNrZWQsIERpcmVjdGl2ZSwgT3B0aW9uYWwsIEFmdGVyQ29udGVudEluaXQsXG4gICAgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBFbGVtZW50UmVmLCBDb250ZW50Q2hpbGRyZW4sIFRlbXBsYXRlUmVmLCBRdWVyeUxpc3QsIFZpZXdDaGlsZCwgTmdab25lLCBDaGFuZ2VEZXRlY3RvclJlZiwgT25DaGFuZ2VzLCBTaW1wbGVDaGFuZ2VzLCBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgUXVlcnksIFZpZXdFbmNhcHN1bGF0aW9ufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBQcmltZVRlbXBsYXRlLCBTaGFyZWRNb2R1bGUgfSBmcm9tICdwcmltZW5nL2FwaSc7XG5pbXBvcnQgeyBQYWdpbmF0b3JNb2R1bGUgfSBmcm9tICdwcmltZW5nL3BhZ2luYXRvcic7XG5pbXBvcnQgeyBEb21IYW5kbGVyIH0gZnJvbSAncHJpbWVuZy9kb20nO1xuaW1wb3J0IHsgT2JqZWN0VXRpbHMgfSBmcm9tICdwcmltZW5nL3V0aWxzJztcbmltcG9ydCB7IFNvcnRNZXRhIH0gZnJvbSAncHJpbWVuZy9hcGknO1xuaW1wb3J0IHsgVGFibGVTdGF0ZSB9IGZyb20gJ3ByaW1lbmcvYXBpJztcbmltcG9ydCB7IEZpbHRlck1ldGFkYXRhIH0gZnJvbSAncHJpbWVuZy9hcGknO1xuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQmxvY2thYmxlVUkgfSBmcm9tICdwcmltZW5nL2FwaSc7XG5pbXBvcnQgeyBTdWJqZWN0LCBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IEZpbHRlclV0aWxzIH0gZnJvbSAncHJpbWVuZy91dGlscyc7XG5pbXBvcnQgeyBTY3JvbGxpbmdNb2R1bGUsIENka1ZpcnR1YWxTY3JvbGxWaWV3cG9ydCB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY3JvbGxpbmcnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgVGFibGVTZXJ2aWNlIHtcblxuICAgIHByaXZhdGUgc29ydFNvdXJjZSA9IG5ldyBTdWJqZWN0PFNvcnRNZXRhfFNvcnRNZXRhW10+KCk7XG4gICAgcHJpdmF0ZSBzZWxlY3Rpb25Tb3VyY2UgPSBuZXcgU3ViamVjdCgpO1xuICAgIHByaXZhdGUgY29udGV4dE1lbnVTb3VyY2UgPSBuZXcgU3ViamVjdDxhbnk+KCk7XG4gICAgcHJpdmF0ZSB2YWx1ZVNvdXJjZSA9IG5ldyBTdWJqZWN0PGFueT4oKTtcbiAgICBwcml2YXRlIHRvdGFsUmVjb3Jkc1NvdXJjZSA9IG5ldyBTdWJqZWN0PGFueT4oKTtcbiAgICBwcml2YXRlIGNvbHVtbnNTb3VyY2UgPSBuZXcgU3ViamVjdCgpO1xuXG4gICAgc29ydFNvdXJjZSQgPSB0aGlzLnNvcnRTb3VyY2UuYXNPYnNlcnZhYmxlKCk7XG4gICAgc2VsZWN0aW9uU291cmNlJCA9IHRoaXMuc2VsZWN0aW9uU291cmNlLmFzT2JzZXJ2YWJsZSgpO1xuICAgIGNvbnRleHRNZW51U291cmNlJCA9IHRoaXMuY29udGV4dE1lbnVTb3VyY2UuYXNPYnNlcnZhYmxlKCk7XG4gICAgdmFsdWVTb3VyY2UkID0gdGhpcy52YWx1ZVNvdXJjZS5hc09ic2VydmFibGUoKTtcbiAgICB0b3RhbFJlY29yZHNTb3VyY2UkID0gdGhpcy50b3RhbFJlY29yZHNTb3VyY2UuYXNPYnNlcnZhYmxlKCk7XG4gICAgY29sdW1uc1NvdXJjZSQgPSB0aGlzLmNvbHVtbnNTb3VyY2UuYXNPYnNlcnZhYmxlKCk7XG5cbiAgICBvblNvcnQoc29ydE1ldGE6IFNvcnRNZXRhfFNvcnRNZXRhW10pIHtcbiAgICAgICAgdGhpcy5zb3J0U291cmNlLm5leHQoc29ydE1ldGEpO1xuICAgIH1cblxuICAgIG9uU2VsZWN0aW9uQ2hhbmdlKCkge1xuICAgICAgICB0aGlzLnNlbGVjdGlvblNvdXJjZS5uZXh0KCk7XG4gICAgfVxuXG4gICAgb25Db250ZXh0TWVudShkYXRhOiBhbnkpIHtcbiAgICAgICAgdGhpcy5jb250ZXh0TWVudVNvdXJjZS5uZXh0KGRhdGEpO1xuICAgIH1cblxuICAgIG9uVmFsdWVDaGFuZ2UodmFsdWU6IGFueSkge1xuICAgICAgICB0aGlzLnZhbHVlU291cmNlLm5leHQodmFsdWUpO1xuICAgIH1cblxuICAgIG9uVG90YWxSZWNvcmRzQ2hhbmdlKHZhbHVlOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy50b3RhbFJlY29yZHNTb3VyY2UubmV4dCh2YWx1ZSk7XG4gICAgfVxuXG4gICAgb25Db2x1bW5zQ2hhbmdlKGNvbHVtbnM6IGFueVtdKSB7XG4gICAgICAgIHRoaXMuY29sdW1uc1NvdXJjZS5uZXh0KGNvbHVtbnMpO1xuICAgIH1cbn1cblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdwLXRhYmxlJyxcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgICA8ZGl2ICNjb250YWluZXIgW25nU3R5bGVdPVwic3R5bGVcIiBbY2xhc3NdPVwic3R5bGVDbGFzc1wiXG4gICAgICAgICAgICBbbmdDbGFzc109XCJ7J3AtZGF0YXRhYmxlIHAtY29tcG9uZW50JzogdHJ1ZSwgXG4gICAgICAgICAgICAgICAgJ3AtZGF0YXRhYmxlLWhvdmVyYWJsZS1yb3dzJzogKHJvd0hvdmVyfHxzZWxlY3Rpb25Nb2RlKSxcbiAgICAgICAgICAgICAgICAncC1kYXRhdGFibGUtYXV0by1sYXlvdXQnOiBhdXRvTGF5b3V0LFxuICAgICAgICAgICAgICAgICdwLWRhdGF0YWJsZS1yZXNpemFibGUnOiByZXNpemFibGVDb2x1bW5zLFxuICAgICAgICAgICAgICAgICdwLWRhdGF0YWJsZS1yZXNpemFibGUtZml0JzogKHJlc2l6YWJsZUNvbHVtbnMgJiYgY29sdW1uUmVzaXplTW9kZSA9PT0gJ2ZpdCcpLFxuICAgICAgICAgICAgICAgICdwLWRhdGF0YWJsZS1zY3JvbGxhYmxlJzogc2Nyb2xsYWJsZSxcbiAgICAgICAgICAgICAgICAncC1kYXRhdGFibGUtZmxleC1zY3JvbGxhYmxlJzogKHNjcm9sbGFibGUgJiYgc2Nyb2xsSGVpZ2h0ID09PSAnZmxleCcpLFxuICAgICAgICAgICAgICAgICdwLWRhdGF0YWJsZS1yZXNwb25zaXZlJzogcmVzcG9uc2l2ZX1cIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwLWRhdGF0YWJsZS1sb2FkaW5nLW92ZXJsYXkgcC1jb21wb25lbnQtb3ZlcmxheVwiICpuZ0lmPVwibG9hZGluZyAmJiBzaG93TG9hZGVyXCI+XG4gICAgICAgICAgICAgICAgPGkgW2NsYXNzXT1cIidwLWRhdGF0YWJsZS1sb2FkaW5nLWljb24gcGktc3BpbiAnICsgbG9hZGluZ0ljb25cIj48L2k+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgKm5nSWY9XCJjYXB0aW9uVGVtcGxhdGVcIiBjbGFzcz1cInAtZGF0YXRhYmxlLWhlYWRlclwiPlxuICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJjYXB0aW9uVGVtcGxhdGVcIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPHAtcGFnaW5hdG9yIFtyb3dzXT1cInJvd3NcIiBbZmlyc3RdPVwiZmlyc3RcIiBbdG90YWxSZWNvcmRzXT1cInRvdGFsUmVjb3Jkc1wiIFtwYWdlTGlua1NpemVdPVwicGFnZUxpbmtzXCIgc3R5bGVDbGFzcz1cInAtcGFnaW5hdG9yLXRvcFwiIFthbHdheXNTaG93XT1cImFsd2F5c1Nob3dQYWdpbmF0b3JcIlxuICAgICAgICAgICAgICAgIChvblBhZ2VDaGFuZ2UpPVwib25QYWdlQ2hhbmdlKCRldmVudClcIiBbcm93c1BlclBhZ2VPcHRpb25zXT1cInJvd3NQZXJQYWdlT3B0aW9uc1wiICpuZ0lmPVwicGFnaW5hdG9yICYmIChwYWdpbmF0b3JQb3NpdGlvbiA9PT0gJ3RvcCcgfHwgcGFnaW5hdG9yUG9zaXRpb24gPT0nYm90aCcpXCJcbiAgICAgICAgICAgICAgICBbdGVtcGxhdGVMZWZ0XT1cInBhZ2luYXRvckxlZnRUZW1wbGF0ZVwiIFt0ZW1wbGF0ZVJpZ2h0XT1cInBhZ2luYXRvclJpZ2h0VGVtcGxhdGVcIiBbZHJvcGRvd25BcHBlbmRUb109XCJwYWdpbmF0b3JEcm9wZG93bkFwcGVuZFRvXCIgW2Ryb3Bkb3duU2Nyb2xsSGVpZ2h0XT1cInBhZ2luYXRvckRyb3Bkb3duU2Nyb2xsSGVpZ2h0XCJcbiAgICAgICAgICAgICAgICBbY3VycmVudFBhZ2VSZXBvcnRUZW1wbGF0ZV09XCJjdXJyZW50UGFnZVJlcG9ydFRlbXBsYXRlXCIgW3Nob3dDdXJyZW50UGFnZVJlcG9ydF09XCJzaG93Q3VycmVudFBhZ2VSZXBvcnRcIj48L3AtcGFnaW5hdG9yPlxuXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicC1kYXRhdGFibGUtd3JhcHBlclwiICpuZ0lmPVwiIXNjcm9sbGFibGVcIj5cbiAgICAgICAgICAgICAgICA8dGFibGUgcm9sZT1cImdyaWRcIiAjdGFibGUgW25nQ2xhc3NdPVwidGFibGVTdHlsZUNsYXNzXCIgW25nU3R5bGVdPVwidGFibGVTdHlsZVwiPlxuICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiY29sR3JvdXBUZW1wbGF0ZTsgY29udGV4dCB7JGltcGxpY2l0OiBjb2x1bW5zfVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgICAgICA8dGhlYWQgY2xhc3M9XCJwLWRhdGF0YWJsZS10aGVhZFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImhlYWRlclRlbXBsYXRlOyBjb250ZXh0OiB7JGltcGxpY2l0OiBjb2x1bW5zfVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgICAgICA8L3RoZWFkPlxuICAgICAgICAgICAgICAgICAgICA8dGJvZHkgY2xhc3M9XCJwLWRhdGF0YWJsZS10Ym9keVwiIFtwVGFibGVCb2R5XT1cImNvbHVtbnNcIiBbcFRhYmxlQm9keVRlbXBsYXRlXT1cImJvZHlUZW1wbGF0ZVwiPjwvdGJvZHk+XG4gICAgICAgICAgICAgICAgICAgIDx0Zm9vdCAqbmdJZj1cImZvb3RlclRlbXBsYXRlXCIgY2xhc3M9XCJwLWRhdGF0YWJsZS10Zm9vdFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImZvb3RlclRlbXBsYXRlOyBjb250ZXh0IHskaW1wbGljaXQ6IGNvbHVtbnN9XCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgICAgIDwvdGZvb3Q+XG4gICAgICAgICAgICAgICAgPC90YWJsZT5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicC1kYXRhdGFibGUtc2Nyb2xsYWJsZS13cmFwcGVyXCIgKm5nSWY9XCJzY3JvbGxhYmxlXCI+XG4gICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicC1kYXRhdGFibGUtc2Nyb2xsYWJsZS12aWV3IHAtZGF0YXRhYmxlLWZyb3plbi12aWV3XCIgKm5nSWY9XCJmcm96ZW5Db2x1bW5zfHxmcm96ZW5Cb2R5VGVtcGxhdGVcIiAjc2Nyb2xsYWJsZUZyb3plblZpZXcgW3BTY3JvbGxhYmxlVmlld109XCJmcm96ZW5Db2x1bW5zXCIgW2Zyb3plbl09XCJ0cnVlXCIgW25nU3R5bGVdPVwie3dpZHRoOiBmcm96ZW5XaWR0aH1cIiBbc2Nyb2xsSGVpZ2h0XT1cInNjcm9sbEhlaWdodFwiPjwvZGl2PlxuICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInAtZGF0YXRhYmxlLXNjcm9sbGFibGUtdmlld1wiICNzY3JvbGxhYmxlVmlldyBbcFNjcm9sbGFibGVWaWV3XT1cImNvbHVtbnNcIiBbZnJvemVuXT1cImZhbHNlXCIgW3Njcm9sbEhlaWdodF09XCJzY3JvbGxIZWlnaHRcIiBbbmdTdHlsZV09XCJ7bGVmdDogZnJvemVuV2lkdGgsIHdpZHRoOiAnY2FsYygxMDAlIC0gJytmcm96ZW5XaWR0aCsnKSd9XCI+PC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgPHAtcGFnaW5hdG9yIFtyb3dzXT1cInJvd3NcIiBbZmlyc3RdPVwiZmlyc3RcIiBbdG90YWxSZWNvcmRzXT1cInRvdGFsUmVjb3Jkc1wiIFtwYWdlTGlua1NpemVdPVwicGFnZUxpbmtzXCIgc3R5bGVDbGFzcz1cInAtcGFnaW5hdG9yLWJvdHRvbVwiIFthbHdheXNTaG93XT1cImFsd2F5c1Nob3dQYWdpbmF0b3JcIlxuICAgICAgICAgICAgICAgIChvblBhZ2VDaGFuZ2UpPVwib25QYWdlQ2hhbmdlKCRldmVudClcIiBbcm93c1BlclBhZ2VPcHRpb25zXT1cInJvd3NQZXJQYWdlT3B0aW9uc1wiICpuZ0lmPVwicGFnaW5hdG9yICYmIChwYWdpbmF0b3JQb3NpdGlvbiA9PT0gJ2JvdHRvbScgfHwgcGFnaW5hdG9yUG9zaXRpb24gPT0nYm90aCcpXCJcbiAgICAgICAgICAgICAgICBbdGVtcGxhdGVMZWZ0XT1cInBhZ2luYXRvckxlZnRUZW1wbGF0ZVwiIFt0ZW1wbGF0ZVJpZ2h0XT1cInBhZ2luYXRvclJpZ2h0VGVtcGxhdGVcIiBbZHJvcGRvd25BcHBlbmRUb109XCJwYWdpbmF0b3JEcm9wZG93bkFwcGVuZFRvXCIgW2Ryb3Bkb3duU2Nyb2xsSGVpZ2h0XT1cInBhZ2luYXRvckRyb3Bkb3duU2Nyb2xsSGVpZ2h0XCJcbiAgICAgICAgICAgICAgICBbY3VycmVudFBhZ2VSZXBvcnRUZW1wbGF0ZV09XCJjdXJyZW50UGFnZVJlcG9ydFRlbXBsYXRlXCIgW3Nob3dDdXJyZW50UGFnZVJlcG9ydF09XCJzaG93Q3VycmVudFBhZ2VSZXBvcnRcIj48L3AtcGFnaW5hdG9yPlxuXG4gICAgICAgICAgICA8ZGl2ICpuZ0lmPVwic3VtbWFyeVRlbXBsYXRlXCIgY2xhc3M9XCJwLWRhdGF0YWJsZS1mb290ZXJcIj5cbiAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwic3VtbWFyeVRlbXBsYXRlXCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgPGRpdiAjcmVzaXplSGVscGVyIGNsYXNzPVwicC1jb2x1bW4tcmVzaXplci1oZWxwZXJcIiBzdHlsZT1cImRpc3BsYXk6bm9uZVwiICpuZ0lmPVwicmVzaXphYmxlQ29sdW1uc1wiPjwvZGl2PlxuICAgICAgICAgICAgPHNwYW4gI3Jlb3JkZXJJbmRpY2F0b3JVcCBjbGFzcz1cInBpIHBpLWFycm93LWRvd24gcC1kYXRhdGFibGUtcmVvcmRlci1pbmRpY2F0b3ItdXBcIiBzdHlsZT1cImRpc3BsYXk6bm9uZVwiICpuZ0lmPVwicmVvcmRlcmFibGVDb2x1bW5zXCI+PC9zcGFuPlxuICAgICAgICAgICAgPHNwYW4gI3Jlb3JkZXJJbmRpY2F0b3JEb3duIGNsYXNzPVwicGkgcGktYXJyb3ctdXAgcC1kYXRhdGFibGUtcmVvcmRlci1pbmRpY2F0b3ItZG93blwiIHN0eWxlPVwiZGlzcGxheTpub25lXCIgKm5nSWY9XCJyZW9yZGVyYWJsZUNvbHVtbnNcIj48L3NwYW4+XG4gICAgICAgIDwvZGl2PlxuICAgIGAsXG4gICAgcHJvdmlkZXJzOiBbVGFibGVTZXJ2aWNlXSxcbiAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LkRlZmF1bHQsXG4gICAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgICBzdHlsZVVybHM6IFsnLi90YWJsZS5jc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBUYWJsZSBpbXBsZW1lbnRzIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCwgQWZ0ZXJDb250ZW50SW5pdCwgQmxvY2thYmxlVUksIE9uQ2hhbmdlcyB7XG5cbiAgICBASW5wdXQoKSBmcm96ZW5Db2x1bW5zOiBhbnlbXTtcblxuICAgIEBJbnB1dCgpIGZyb3plblZhbHVlOiBhbnlbXTtcblxuICAgIEBJbnB1dCgpIHN0eWxlOiBhbnk7XG5cbiAgICBASW5wdXQoKSBzdHlsZUNsYXNzOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSB0YWJsZVN0eWxlOiBhbnk7XG5cbiAgICBASW5wdXQoKSB0YWJsZVN0eWxlQ2xhc3M6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIHBhZ2luYXRvcjogYm9vbGVhbjtcblxuICAgIEBJbnB1dCgpIHBhZ2VMaW5rczogbnVtYmVyID0gNTtcblxuICAgIEBJbnB1dCgpIHJvd3NQZXJQYWdlT3B0aW9uczogYW55W107XG5cbiAgICBASW5wdXQoKSBhbHdheXNTaG93UGFnaW5hdG9yOiBib29sZWFuID0gdHJ1ZTtcblxuICAgIEBJbnB1dCgpIHBhZ2luYXRvclBvc2l0aW9uOiBzdHJpbmcgPSAnYm90dG9tJztcblxuICAgIEBJbnB1dCgpIHBhZ2luYXRvckRyb3Bkb3duQXBwZW5kVG86IGFueTtcblxuICAgIEBJbnB1dCgpIHBhZ2luYXRvckRyb3Bkb3duU2Nyb2xsSGVpZ2h0OiBzdHJpbmcgPSAnMjAwcHgnO1xuXG4gICAgQElucHV0KCkgY3VycmVudFBhZ2VSZXBvcnRUZW1wbGF0ZTogc3RyaW5nID0gJ3tjdXJyZW50UGFnZX0gb2Yge3RvdGFsUGFnZXN9JztcblxuICAgIEBJbnB1dCgpIHNob3dDdXJyZW50UGFnZVJlcG9ydDogYm9vbGVhbjtcblxuICAgIEBJbnB1dCgpIGRlZmF1bHRTb3J0T3JkZXI6IG51bWJlciA9IDE7XG5cbiAgICBASW5wdXQoKSBzb3J0TW9kZTogc3RyaW5nID0gJ3NpbmdsZSc7XG5cbiAgICBASW5wdXQoKSByZXNldFBhZ2VPblNvcnQ6IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgQElucHV0KCkgc2VsZWN0aW9uTW9kZTogc3RyaW5nO1xuXG4gICAgQE91dHB1dCgpIHNlbGVjdGlvbkNoYW5nZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBASW5wdXQoKSBjb250ZXh0TWVudVNlbGVjdGlvbjogYW55O1xuXG4gICAgQE91dHB1dCgpIGNvbnRleHRNZW51U2VsZWN0aW9uQ2hhbmdlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBJbnB1dCgpIGNvbnRleHRNZW51U2VsZWN0aW9uTW9kZTogc3RyaW5nID0gXCJzZXBhcmF0ZVwiO1xuXG4gICAgQElucHV0KCkgZGF0YUtleTogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgbWV0YUtleVNlbGVjdGlvbjogYm9vbGVhbjtcblxuICAgIEBJbnB1dCgpIHJvd1RyYWNrQnk6IEZ1bmN0aW9uID0gKGluZGV4OiBudW1iZXIsIGl0ZW06IGFueSkgPT4gaXRlbTtcblxuICAgIEBJbnB1dCgpIGxhenk6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIEBJbnB1dCgpIGxhenlMb2FkT25Jbml0OiBib29sZWFuID0gdHJ1ZTtcblxuICAgIEBJbnB1dCgpIGNvbXBhcmVTZWxlY3Rpb25CeTogc3RyaW5nID0gJ2RlZXBFcXVhbHMnO1xuXG4gICAgQElucHV0KCkgY3N2U2VwYXJhdG9yOiBzdHJpbmcgPSAnLCc7XG5cbiAgICBASW5wdXQoKSBleHBvcnRGaWxlbmFtZTogc3RyaW5nID0gJ2Rvd25sb2FkJztcblxuICAgIEBJbnB1dCgpIGZpbHRlcnM6IHsgW3M6IHN0cmluZ106IEZpbHRlck1ldGFkYXRhOyB9ID0ge307XG5cbiAgICBASW5wdXQoKSBnbG9iYWxGaWx0ZXJGaWVsZHM6IHN0cmluZ1tdO1xuXG4gICAgQElucHV0KCkgZmlsdGVyRGVsYXk6IG51bWJlciA9IDMwMDtcblxuICAgIEBJbnB1dCgpIGZpbHRlckxvY2FsZTogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgZXhwYW5kZWRSb3dLZXlzOiB7IFtzOiBzdHJpbmddOiBib29sZWFuOyB9ID0ge307XG5cbiAgICBASW5wdXQoKSBlZGl0aW5nUm93S2V5czogeyBbczogc3RyaW5nXTogYm9vbGVhbjsgfSA9IHt9O1xuXG4gICAgQElucHV0KCkgcm93RXhwYW5kTW9kZTogc3RyaW5nID0gJ211bHRpcGxlJztcblxuICAgIEBJbnB1dCgpIHNjcm9sbGFibGU6IGJvb2xlYW47XG5cbiAgICBASW5wdXQoKSBzY3JvbGxIZWlnaHQ6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIHZpcnR1YWxTY3JvbGw6IGJvb2xlYW47XG5cbiAgICBASW5wdXQoKSB2aXJ0dWFsU2Nyb2xsRGVsYXk6IG51bWJlciA9IDE1MDtcblxuICAgIEBJbnB1dCgpIHZpcnR1YWxSb3dIZWlnaHQ6IG51bWJlciA9IDI4O1xuXG4gICAgQElucHV0KCkgZnJvemVuV2lkdGg6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIHJlc3BvbnNpdmU6IGJvb2xlYW47XG5cbiAgICBASW5wdXQoKSBjb250ZXh0TWVudTogYW55O1xuXG4gICAgQElucHV0KCkgcmVzaXphYmxlQ29sdW1uczogYm9vbGVhbjtcblxuICAgIEBJbnB1dCgpIGNvbHVtblJlc2l6ZU1vZGU6IHN0cmluZyA9ICdmaXQnO1xuXG4gICAgQElucHV0KCkgcmVvcmRlcmFibGVDb2x1bW5zOiBib29sZWFuO1xuXG4gICAgQElucHV0KCkgbG9hZGluZzogYm9vbGVhbjtcblxuICAgIEBJbnB1dCgpIGxvYWRpbmdJY29uOiBzdHJpbmcgPSAncGkgcGktc3Bpbm5lcic7XG5cbiAgICBASW5wdXQoKSBzaG93TG9hZGVyOiBib29sZWFuID0gdHJ1ZTtcblxuICAgIEBJbnB1dCgpIHJvd0hvdmVyOiBib29sZWFuO1xuXG4gICAgQElucHV0KCkgY3VzdG9tU29ydDogYm9vbGVhbjtcblxuICAgIEBJbnB1dCgpIGF1dG9MYXlvdXQ6IGJvb2xlYW47XG5cbiAgICBASW5wdXQoKSBleHBvcnRGdW5jdGlvbjtcblxuICAgIEBJbnB1dCgpIHN0YXRlS2V5OiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBzdGF0ZVN0b3JhZ2U6IHN0cmluZyA9ICdzZXNzaW9uJztcblxuICAgIEBJbnB1dCgpIGVkaXRNb2RlOiBzdHJpbmcgPSAnY2VsbCc7XG5cbiAgICBASW5wdXQoKSBtaW5CdWZmZXJQeDogbnVtYmVyO1xuXG4gICAgQElucHV0KCkgbWF4QnVmZmVyUHg6IG51bWJlcjtcblxuICAgIEBPdXRwdXQoKSBvblJvd1NlbGVjdDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgb25Sb3dVbnNlbGVjdDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgb25QYWdlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKSBvblNvcnQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpIG9uRmlsdGVyOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKSBvbkxhenlMb2FkOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKSBvblJvd0V4cGFuZDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgb25Sb3dDb2xsYXBzZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgb25Db250ZXh0TWVudVNlbGVjdDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgb25Db2xSZXNpemU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpIG9uQ29sUmVvcmRlcjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgb25Sb3dSZW9yZGVyOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKSBvbkVkaXRJbml0OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKSBvbkVkaXRDb21wbGV0ZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgb25FZGl0Q2FuY2VsOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKSBvbkhlYWRlckNoZWNrYm94VG9nZ2xlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKSBzb3J0RnVuY3Rpb246IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpIGZpcnN0Q2hhbmdlOiBFdmVudEVtaXR0ZXI8bnVtYmVyPiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKSByb3dzQ2hhbmdlOiBFdmVudEVtaXR0ZXI8bnVtYmVyPiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKSBvblN0YXRlU2F2ZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgb25TdGF0ZVJlc3RvcmU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQFZpZXdDaGlsZCgnY29udGFpbmVyJykgY29udGFpbmVyVmlld0NoaWxkOiBFbGVtZW50UmVmO1xuXG4gICAgQFZpZXdDaGlsZCgncmVzaXplSGVscGVyJykgcmVzaXplSGVscGVyVmlld0NoaWxkOiBFbGVtZW50UmVmO1xuXG4gICAgQFZpZXdDaGlsZCgncmVvcmRlckluZGljYXRvclVwJykgcmVvcmRlckluZGljYXRvclVwVmlld0NoaWxkOiBFbGVtZW50UmVmO1xuXG4gICAgQFZpZXdDaGlsZCgncmVvcmRlckluZGljYXRvckRvd24nKSByZW9yZGVySW5kaWNhdG9yRG93blZpZXdDaGlsZDogRWxlbWVudFJlZjtcblxuICAgIEBWaWV3Q2hpbGQoJ3RhYmxlJykgdGFibGVWaWV3Q2hpbGQ6IEVsZW1lbnRSZWY7XG5cbiAgICBAVmlld0NoaWxkKCdzY3JvbGxhYmxlVmlldycpIHNjcm9sbGFibGVWaWV3Q2hpbGQ7XG5cbiAgICBAVmlld0NoaWxkKCdzY3JvbGxhYmxlRnJvemVuVmlldycpIHNjcm9sbGFibGVGcm96ZW5WaWV3Q2hpbGQ7XG5cbiAgICBAQ29udGVudENoaWxkcmVuKFByaW1lVGVtcGxhdGUpIHRlbXBsYXRlczogUXVlcnlMaXN0PFByaW1lVGVtcGxhdGU+O1xuXG4gICAgX3ZhbHVlOiBhbnlbXSA9IFtdO1xuXG4gICAgX2NvbHVtbnM6IGFueVtdO1xuXG4gICAgX3RvdGFsUmVjb3JkczogbnVtYmVyID0gMDtcblxuICAgIF9maXJzdDogbnVtYmVyID0gMDtcblxuICAgIF9yb3dzOiBudW1iZXI7XG5cbiAgICBmaWx0ZXJlZFZhbHVlOiBhbnlbXTtcblxuICAgIGhlYWRlclRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgYm9keVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgbG9hZGluZ0JvZHlUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIGNhcHRpb25UZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIGZyb3plblJvd3NUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIGZvb3RlclRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgc3VtbWFyeVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgY29sR3JvdXBUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIGV4cGFuZGVkUm93VGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICBmcm96ZW5IZWFkZXJUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIGZyb3plbkJvZHlUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIGZyb3plbkZvb3RlclRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgZnJvemVuQ29sR3JvdXBUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIGVtcHR5TWVzc2FnZVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgcGFnaW5hdG9yTGVmdFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgcGFnaW5hdG9yUmlnaHRUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIHNlbGVjdGlvbktleXM6IGFueSA9IHt9O1xuXG4gICAgbGFzdFJlc2l6ZXJIZWxwZXJYOiBudW1iZXI7XG5cbiAgICByZW9yZGVySWNvbldpZHRoOiBudW1iZXI7XG5cbiAgICByZW9yZGVySWNvbkhlaWdodDogbnVtYmVyO1xuXG4gICAgZHJhZ2dlZENvbHVtbjogYW55O1xuXG4gICAgZHJhZ2dlZFJvd0luZGV4OiBudW1iZXI7XG5cbiAgICBkcm9wcGVkUm93SW5kZXg6IG51bWJlcjtcblxuICAgIHJvd0RyYWdnaW5nOiBib29sZWFuO1xuXG4gICAgZHJvcFBvc2l0aW9uOiBudW1iZXI7XG5cbiAgICBlZGl0aW5nQ2VsbDogRWxlbWVudDtcblxuICAgIGVkaXRpbmdDZWxsRGF0YTogYW55O1xuXG4gICAgZWRpdGluZ0NlbGxGaWVsZDogYW55O1xuXG4gICAgZWRpdGluZ0NlbGxSb3dJbmRleDogbnVtYmVyO1xuXG4gICAgZWRpdGluZ0NlbGxDbGljazogYm9vbGVhbjtcblxuICAgIGRvY3VtZW50RWRpdExpc3RlbmVyOiBhbnk7XG5cbiAgICBfbXVsdGlTb3J0TWV0YTogU29ydE1ldGFbXTtcblxuICAgIF9zb3J0RmllbGQ6IHN0cmluZztcblxuICAgIF9zb3J0T3JkZXI6IG51bWJlciA9IDE7XG5cbiAgICBwcmV2ZW50U2VsZWN0aW9uU2V0dGVyUHJvcGFnYXRpb246IGJvb2xlYW47XG5cbiAgICBfc2VsZWN0aW9uOiBhbnk7XG5cbiAgICBhbmNob3JSb3dJbmRleDogbnVtYmVyO1xuXG4gICAgcmFuZ2VSb3dJbmRleDogbnVtYmVyO1xuXG4gICAgZmlsdGVyVGltZW91dDogYW55O1xuXG4gICAgaW5pdGlhbGl6ZWQ6IGJvb2xlYW47XG5cbiAgICByb3dUb3VjaGVkOiBib29sZWFuO1xuXG4gICAgcmVzdG9yaW5nU29ydDogYm9vbGVhbjtcblxuICAgIHJlc3RvcmluZ0ZpbHRlcjogYm9vbGVhbjtcblxuICAgIHN0YXRlUmVzdG9yZWQ6IGJvb2xlYW47XG5cbiAgICBjb2x1bW5PcmRlclN0YXRlUmVzdG9yZWQ6IGJvb2xlYW47XG5cbiAgICBjb2x1bW5XaWR0aHNTdGF0ZTogc3RyaW5nO1xuXG4gICAgdGFibGVXaWR0aFN0YXRlOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgZWw6IEVsZW1lbnRSZWYsIHB1YmxpYyB6b25lOiBOZ1pvbmUsIHB1YmxpYyB0YWJsZVNlcnZpY2U6IFRhYmxlU2VydmljZSwgcHVibGljIGNkOiBDaGFuZ2VEZXRlY3RvclJlZikge31cblxuICAgIG5nT25Jbml0KCkge1xuICAgICAgICBpZiAodGhpcy5sYXp5ICYmIHRoaXMubGF6eUxvYWRPbkluaXQpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy52aXJ0dWFsU2Nyb2xsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vbkxhenlMb2FkLmVtaXQodGhpcy5jcmVhdGVMYXp5TG9hZE1ldGFkYXRhKCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAodGhpcy5yZXN0b3JpbmdGaWx0ZXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlc3RvcmluZ0ZpbHRlciA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XG4gICAgfVxuXG4gICAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgICAgICB0aGlzLnRlbXBsYXRlcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgICBzd2l0Y2ggKGl0ZW0uZ2V0VHlwZSgpKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnY2FwdGlvbic6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2FwdGlvblRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ2hlYWRlcic6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGVhZGVyVGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnYm9keSc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYm9keVRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ2xvYWRpbmdib2R5JzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkaW5nQm9keVRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ2Zvb3Rlcic6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZm9vdGVyVGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnc3VtbWFyeSc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3VtbWFyeVRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ2NvbGdyb3VwJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb2xHcm91cFRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ3Jvd2V4cGFuc2lvbic6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXhwYW5kZWRSb3dUZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdmcm96ZW5yb3dzJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mcm96ZW5Sb3dzVGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnZnJvemVuaGVhZGVyJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mcm96ZW5IZWFkZXJUZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdmcm96ZW5ib2R5JzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mcm96ZW5Cb2R5VGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnZnJvemVuZm9vdGVyJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mcm96ZW5Gb290ZXJUZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdmcm96ZW5jb2xncm91cCc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZnJvemVuQ29sR3JvdXBUZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdlbXB0eW1lc3NhZ2UnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmVtcHR5TWVzc2FnZVRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ3BhZ2luYXRvcmxlZnQnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBhZ2luYXRvckxlZnRUZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdwYWdpbmF0b3JyaWdodCc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFnaW5hdG9yUmlnaHRUZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNTdGF0ZWZ1bCgpICYmIHRoaXMucmVzaXphYmxlQ29sdW1ucykge1xuICAgICAgICAgICAgdGhpcy5yZXN0b3JlQ29sdW1uV2lkdGhzKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjbGVhckNhY2hlKCkge1xuICAgICAgICBpZiAodGhpcy5zY3JvbGxhYmxlKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5zY3JvbGxhYmxlVmlld0NoaWxkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zY3JvbGxhYmxlVmlld0NoaWxkLmNsZWFyQ2FjaGUoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuc2Nyb2xsYWJsZUZyb3plblZpZXdDaGlsZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2Nyb2xsYWJsZVZpZXdDaGlsZC5jbGVhckNhY2hlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBuZ09uQ2hhbmdlcyhzaW1wbGVDaGFuZ2U6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICAgICAgaWYgKHNpbXBsZUNoYW5nZS52YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNTdGF0ZWZ1bCgpICYmICF0aGlzLnN0YXRlUmVzdG9yZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlc3RvcmVTdGF0ZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl92YWx1ZSA9IHNpbXBsZUNoYW5nZS52YWx1ZS5jdXJyZW50VmFsdWU7XG5cbiAgICAgICAgICAgIGlmICghdGhpcy5sYXp5KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jbGVhckNhY2hlKCk7XG4gICAgICAgICAgICAgICAgdGhpcy50b3RhbFJlY29yZHMgPSAodGhpcy5fdmFsdWUgPyB0aGlzLl92YWx1ZS5sZW5ndGggOiAwKTtcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnNvcnRNb2RlID09ICdzaW5nbGUnICYmIHRoaXMuc29ydEZpZWxkKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNvcnRTaW5nbGUoKTtcbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0aGlzLnNvcnRNb2RlID09ICdtdWx0aXBsZScgJiYgdGhpcy5tdWx0aVNvcnRNZXRhKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNvcnRNdWx0aXBsZSgpO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuaGFzRmlsdGVyKCkpICAgICAgIC8vc29ydCBhbHJlYWR5IGZpbHRlcnNcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZmlsdGVyKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMudGFibGVTZXJ2aWNlLm9uVmFsdWVDaGFuZ2Uoc2ltcGxlQ2hhbmdlLnZhbHVlLmN1cnJlbnRWYWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2ltcGxlQ2hhbmdlLmNvbHVtbnMpIHtcbiAgICAgICAgICAgIHRoaXMuX2NvbHVtbnMgPSBzaW1wbGVDaGFuZ2UuY29sdW1ucy5jdXJyZW50VmFsdWU7XG4gICAgICAgICAgICB0aGlzLnRhYmxlU2VydmljZS5vbkNvbHVtbnNDaGFuZ2Uoc2ltcGxlQ2hhbmdlLmNvbHVtbnMuY3VycmVudFZhbHVlKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuX2NvbHVtbnMgJiYgdGhpcy5pc1N0YXRlZnVsKCkgJiYgdGhpcy5yZW9yZGVyYWJsZUNvbHVtbnMgJiYgIXRoaXMuY29sdW1uT3JkZXJTdGF0ZVJlc3RvcmVkICkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVzdG9yZUNvbHVtbk9yZGVyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2ltcGxlQ2hhbmdlLnNvcnRGaWVsZCkge1xuICAgICAgICAgICAgdGhpcy5fc29ydEZpZWxkID0gc2ltcGxlQ2hhbmdlLnNvcnRGaWVsZC5jdXJyZW50VmFsdWU7XG5cbiAgICAgICAgICAgIC8vYXZvaWQgdHJpZ2dlcmluZyBsYXp5IGxvYWQgcHJpb3IgdG8gbGF6eSBpbml0aWFsaXphdGlvbiBhdCBvbkluaXRcbiAgICAgICAgICAgIGlmICggIXRoaXMubGF6eSB8fCB0aGlzLmluaXRpYWxpemVkICkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnNvcnRNb2RlID09PSAnc2luZ2xlJykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNvcnRTaW5nbGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2ltcGxlQ2hhbmdlLnNvcnRPcmRlcikge1xuICAgICAgICAgICAgdGhpcy5fc29ydE9yZGVyID0gc2ltcGxlQ2hhbmdlLnNvcnRPcmRlci5jdXJyZW50VmFsdWU7XG5cbiAgICAgICAgICAgIC8vYXZvaWQgdHJpZ2dlcmluZyBsYXp5IGxvYWQgcHJpb3IgdG8gbGF6eSBpbml0aWFsaXphdGlvbiBhdCBvbkluaXRcbiAgICAgICAgICAgIGlmICggIXRoaXMubGF6eSB8fCB0aGlzLmluaXRpYWxpemVkICkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnNvcnRNb2RlID09PSAnc2luZ2xlJykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNvcnRTaW5nbGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2ltcGxlQ2hhbmdlLm11bHRpU29ydE1ldGEpIHtcbiAgICAgICAgICAgIHRoaXMuX211bHRpU29ydE1ldGEgPSBzaW1wbGVDaGFuZ2UubXVsdGlTb3J0TWV0YS5jdXJyZW50VmFsdWU7XG4gICAgICAgICAgICBpZiAodGhpcy5zb3J0TW9kZSA9PT0gJ211bHRpcGxlJykge1xuICAgICAgICAgICAgICAgIHRoaXMuc29ydE11bHRpcGxlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2ltcGxlQ2hhbmdlLnNlbGVjdGlvbikge1xuICAgICAgICAgICAgdGhpcy5fc2VsZWN0aW9uID0gc2ltcGxlQ2hhbmdlLnNlbGVjdGlvbi5jdXJyZW50VmFsdWU7XG5cbiAgICAgICAgICAgIGlmICghdGhpcy5wcmV2ZW50U2VsZWN0aW9uU2V0dGVyUHJvcGFnYXRpb24pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVNlbGVjdGlvbktleXMoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnRhYmxlU2VydmljZS5vblNlbGVjdGlvbkNoYW5nZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5wcmV2ZW50U2VsZWN0aW9uU2V0dGVyUHJvcGFnYXRpb24gPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIEBJbnB1dCgpIGdldCB2YWx1ZSgpOiBhbnlbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgICB9XG4gICAgc2V0IHZhbHVlKHZhbDogYW55W10pIHtcbiAgICAgICAgdGhpcy5fdmFsdWUgPSB2YWw7XG4gICAgfVxuXG4gICAgQElucHV0KCkgZ2V0IGNvbHVtbnMoKTogYW55W10ge1xuICAgICAgICByZXR1cm4gdGhpcy5fY29sdW1ucztcbiAgICB9XG4gICAgc2V0IGNvbHVtbnMoY29sczogYW55W10pIHtcbiAgICAgICAgdGhpcy5fY29sdW1ucyA9IGNvbHM7XG4gICAgfVxuXG4gICAgQElucHV0KCkgZ2V0IGZpcnN0KCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLl9maXJzdDtcbiAgICB9XG4gICAgc2V0IGZpcnN0KHZhbDogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuX2ZpcnN0ID0gdmFsO1xuICAgIH1cblxuICAgIEBJbnB1dCgpIGdldCByb3dzKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLl9yb3dzO1xuICAgIH1cbiAgICBzZXQgcm93cyh2YWw6IG51bWJlcikge1xuICAgICAgICB0aGlzLl9yb3dzID0gdmFsO1xuICAgIH1cblxuICAgIEBJbnB1dCgpIGdldCB0b3RhbFJlY29yZHMoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RvdGFsUmVjb3JkcztcbiAgICB9XG4gICAgc2V0IHRvdGFsUmVjb3Jkcyh2YWw6IG51bWJlcikge1xuICAgICAgICB0aGlzLl90b3RhbFJlY29yZHMgPSB2YWw7XG4gICAgICAgIHRoaXMudGFibGVTZXJ2aWNlLm9uVG90YWxSZWNvcmRzQ2hhbmdlKHRoaXMuX3RvdGFsUmVjb3Jkcyk7XG4gICAgfVxuXG4gICAgQElucHV0KCkgZ2V0IHNvcnRGaWVsZCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5fc29ydEZpZWxkO1xuICAgIH1cblxuICAgIHNldCBzb3J0RmllbGQodmFsOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5fc29ydEZpZWxkID0gdmFsO1xuICAgIH1cblxuICAgIEBJbnB1dCgpIGdldCBzb3J0T3JkZXIoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NvcnRPcmRlcjtcbiAgICB9XG4gICAgc2V0IHNvcnRPcmRlcih2YWw6IG51bWJlcikge1xuICAgICAgICB0aGlzLl9zb3J0T3JkZXIgPSB2YWw7XG4gICAgfVxuXG4gICAgQElucHV0KCkgZ2V0IG11bHRpU29ydE1ldGEoKTogU29ydE1ldGFbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9tdWx0aVNvcnRNZXRhO1xuICAgIH1cblxuICAgIHNldCBtdWx0aVNvcnRNZXRhKHZhbDogU29ydE1ldGFbXSkge1xuICAgICAgICB0aGlzLl9tdWx0aVNvcnRNZXRhID0gdmFsO1xuICAgIH1cblxuICAgIEBJbnB1dCgpIGdldCBzZWxlY3Rpb24oKTogYW55IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NlbGVjdGlvbjtcbiAgICB9XG5cbiAgICBzZXQgc2VsZWN0aW9uKHZhbDogYW55KSB7XG4gICAgICAgIHRoaXMuX3NlbGVjdGlvbiA9IHZhbDtcbiAgICB9XG5cbiAgICB1cGRhdGVTZWxlY3Rpb25LZXlzKCkge1xuICAgICAgICBpZiAodGhpcy5kYXRhS2V5ICYmIHRoaXMuX3NlbGVjdGlvbikge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25LZXlzID0ge307XG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh0aGlzLl9zZWxlY3Rpb24pKSB7XG4gICAgICAgICAgICAgICAgZm9yKGxldCBkYXRhIG9mIHRoaXMuX3NlbGVjdGlvbikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGlvbktleXNbU3RyaW5nKE9iamVjdFV0aWxzLnJlc29sdmVGaWVsZERhdGEoZGF0YSwgdGhpcy5kYXRhS2V5KSldID0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGlvbktleXNbU3RyaW5nKE9iamVjdFV0aWxzLnJlc29sdmVGaWVsZERhdGEodGhpcy5fc2VsZWN0aW9uLCB0aGlzLmRhdGFLZXkpKV0gPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25QYWdlQ2hhbmdlKGV2ZW50KSB7XG4gICAgICAgIHRoaXMuZmlyc3QgPSBldmVudC5maXJzdDtcbiAgICAgICAgdGhpcy5yb3dzID0gZXZlbnQucm93cztcblxuICAgICAgICBpZiAodGhpcy5sYXp5KSB7XG4gICAgICAgICAgICB0aGlzLm9uTGF6eUxvYWQuZW1pdCh0aGlzLmNyZWF0ZUxhenlMb2FkTWV0YWRhdGEoKSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm9uUGFnZS5lbWl0KHtcbiAgICAgICAgICAgIGZpcnN0OiB0aGlzLmZpcnN0LFxuICAgICAgICAgICAgcm93czogdGhpcy5yb3dzXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuZmlyc3RDaGFuZ2UuZW1pdCh0aGlzLmZpcnN0KTtcbiAgICAgICAgdGhpcy5yb3dzQ2hhbmdlLmVtaXQodGhpcy5yb3dzKTtcbiAgICAgICAgdGhpcy50YWJsZVNlcnZpY2Uub25WYWx1ZUNoYW5nZSh0aGlzLnZhbHVlKTtcblxuICAgICAgICBpZiAodGhpcy5pc1N0YXRlZnVsKCkpIHtcbiAgICAgICAgICAgIHRoaXMuc2F2ZVN0YXRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmFuY2hvclJvd0luZGV4ID0gbnVsbDtcblxuICAgICAgICBpZiAodGhpcy5zY3JvbGxhYmxlKSB7XG4gICAgICAgICAgICB0aGlzLnJlc2V0U2Nyb2xsVG9wKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzb3J0KGV2ZW50KSB7XG4gICAgICAgIGxldCBvcmlnaW5hbEV2ZW50ID0gZXZlbnQub3JpZ2luYWxFdmVudDtcblxuICAgICAgICBpZiAodGhpcy5zb3J0TW9kZSA9PT0gJ3NpbmdsZScpIHtcbiAgICAgICAgICAgIHRoaXMuX3NvcnRPcmRlciA9ICh0aGlzLnNvcnRGaWVsZCA9PT0gZXZlbnQuZmllbGQpID8gdGhpcy5zb3J0T3JkZXIgKiAtMSA6IHRoaXMuZGVmYXVsdFNvcnRPcmRlcjtcbiAgICAgICAgICAgIHRoaXMuX3NvcnRGaWVsZCA9IGV2ZW50LmZpZWxkO1xuICAgICAgICAgICAgdGhpcy5zb3J0U2luZ2xlKCk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnJlc2V0UGFnZU9uU29ydCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZpcnN0ID0gMDtcbiAgICAgICAgICAgICAgICB0aGlzLmZpcnN0Q2hhbmdlLmVtaXQodGhpcy5fZmlyc3QpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc2Nyb2xsYWJsZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc2V0U2Nyb2xsVG9wKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnNvcnRNb2RlID09PSAnbXVsdGlwbGUnKSB7XG4gICAgICAgICAgICBsZXQgbWV0YUtleSA9IG9yaWdpbmFsRXZlbnQubWV0YUtleSB8fCBvcmlnaW5hbEV2ZW50LmN0cmxLZXk7XG4gICAgICAgICAgICBsZXQgc29ydE1ldGEgPSB0aGlzLmdldFNvcnRNZXRhKGV2ZW50LmZpZWxkKTtcblxuICAgICAgICAgICAgaWYgKHNvcnRNZXRhKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFtZXRhS2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX211bHRpU29ydE1ldGEgPSBbeyBmaWVsZDogZXZlbnQuZmllbGQsIG9yZGVyOiBzb3J0TWV0YS5vcmRlciAqIC0xIH1dO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnJlc2V0UGFnZU9uU29ydCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZmlyc3QgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5maXJzdENoYW5nZS5lbWl0KHRoaXMuX2ZpcnN0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc2Nyb2xsYWJsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVzZXRTY3JvbGxUb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc29ydE1ldGEub3JkZXIgPSBzb3J0TWV0YS5vcmRlciAqIC0xO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICghbWV0YUtleSB8fCAhdGhpcy5tdWx0aVNvcnRNZXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX211bHRpU29ydE1ldGEgPSBbXTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5yZXNldFBhZ2VPblNvcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZpcnN0ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmlyc3RDaGFuZ2UuZW1pdCh0aGlzLl9maXJzdCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5fbXVsdGlTb3J0TWV0YS5wdXNoKHsgZmllbGQ6IGV2ZW50LmZpZWxkLCBvcmRlcjogdGhpcy5kZWZhdWx0U29ydE9yZGVyIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnNvcnRNdWx0aXBsZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuaXNTdGF0ZWZ1bCgpKSB7XG4gICAgICAgICAgICB0aGlzLnNhdmVTdGF0ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5hbmNob3JSb3dJbmRleCA9IG51bGw7XG4gICAgfVxuXG4gICAgc29ydFNpbmdsZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuc29ydEZpZWxkICYmIHRoaXMuc29ydE9yZGVyKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5yZXN0b3JpbmdTb3J0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXN0b3JpbmdTb3J0ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmxhenkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9uTGF6eUxvYWQuZW1pdCh0aGlzLmNyZWF0ZUxhenlMb2FkTWV0YWRhdGEoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY3VzdG9tU29ydCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNvcnRGdW5jdGlvbi5lbWl0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHRoaXMudmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBtb2RlOiB0aGlzLnNvcnRNb2RlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZmllbGQ6IHRoaXMuc29ydEZpZWxkLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3JkZXI6IHRoaXMuc29ydE9yZGVyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52YWx1ZS5zb3J0KChkYXRhMSwgZGF0YTIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB2YWx1ZTEgPSBPYmplY3RVdGlscy5yZXNvbHZlRmllbGREYXRhKGRhdGExLCB0aGlzLnNvcnRGaWVsZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdmFsdWUyID0gT2JqZWN0VXRpbHMucmVzb2x2ZUZpZWxkRGF0YShkYXRhMiwgdGhpcy5zb3J0RmllbGQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlc3VsdCA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZTEgPT0gbnVsbCAmJiB2YWx1ZTIgIT0gbnVsbClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSAtMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHZhbHVlMSAhPSBudWxsICYmIHZhbHVlMiA9PSBudWxsKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh2YWx1ZTEgPT0gbnVsbCAmJiB2YWx1ZTIgPT0gbnVsbClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIHZhbHVlMSA9PT0gJ3N0cmluZycgJiYgdHlwZW9mIHZhbHVlMiA9PT0gJ3N0cmluZycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gdmFsdWUxLmxvY2FsZUNvbXBhcmUodmFsdWUyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSAodmFsdWUxIDwgdmFsdWUyKSA/IC0xIDogKHZhbHVlMSA+IHZhbHVlMikgPyAxIDogMDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICh0aGlzLnNvcnRPcmRlciAqIHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmhhc0ZpbHRlcigpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZpbHRlcigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IHNvcnRNZXRhOiBTb3J0TWV0YSA9IHtcbiAgICAgICAgICAgICAgICBmaWVsZDogdGhpcy5zb3J0RmllbGQsXG4gICAgICAgICAgICAgICAgb3JkZXI6IHRoaXMuc29ydE9yZGVyXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLm9uU29ydC5lbWl0KHNvcnRNZXRhKTtcbiAgICAgICAgICAgIHRoaXMudGFibGVTZXJ2aWNlLm9uU29ydChzb3J0TWV0YSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzb3J0TXVsdGlwbGUoKSB7XG4gICAgICAgIGlmICh0aGlzLm11bHRpU29ydE1ldGEpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmxhenkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9uTGF6eUxvYWQuZW1pdCh0aGlzLmNyZWF0ZUxhenlMb2FkTWV0YWRhdGEoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY3VzdG9tU29ydCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNvcnRGdW5jdGlvbi5lbWl0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHRoaXMudmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBtb2RlOiB0aGlzLnNvcnRNb2RlLFxuICAgICAgICAgICAgICAgICAgICAgICAgbXVsdGlTb3J0TWV0YTogdGhpcy5tdWx0aVNvcnRNZXRhXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52YWx1ZS5zb3J0KChkYXRhMSwgZGF0YTIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm11bHRpc29ydEZpZWxkKGRhdGExLCBkYXRhMiwgdGhpcy5tdWx0aVNvcnRNZXRhLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaGFzRmlsdGVyKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZmlsdGVyKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLm9uU29ydC5lbWl0KHtcbiAgICAgICAgICAgICAgICBtdWx0aXNvcnRtZXRhOiB0aGlzLm11bHRpU29ydE1ldGFcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy50YWJsZVNlcnZpY2Uub25Tb3J0KHRoaXMubXVsdGlTb3J0TWV0YSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtdWx0aXNvcnRGaWVsZChkYXRhMSwgZGF0YTIsIG11bHRpU29ydE1ldGEsIGluZGV4KSB7XG4gICAgICAgIGxldCB2YWx1ZTEgPSBPYmplY3RVdGlscy5yZXNvbHZlRmllbGREYXRhKGRhdGExLCBtdWx0aVNvcnRNZXRhW2luZGV4XS5maWVsZCk7XG4gICAgICAgIGxldCB2YWx1ZTIgPSBPYmplY3RVdGlscy5yZXNvbHZlRmllbGREYXRhKGRhdGEyLCBtdWx0aVNvcnRNZXRhW2luZGV4XS5maWVsZCk7XG4gICAgICAgIGxldCByZXN1bHQgPSBudWxsO1xuXG4gICAgICAgIGlmICh2YWx1ZTEgPT0gbnVsbCAmJiB2YWx1ZTIgIT0gbnVsbClcbiAgICAgICAgICAgIHJlc3VsdCA9IC0xO1xuICAgICAgICBlbHNlIGlmICh2YWx1ZTEgIT0gbnVsbCAmJiB2YWx1ZTIgPT0gbnVsbClcbiAgICAgICAgICAgIHJlc3VsdCA9IDE7XG4gICAgICAgIGVsc2UgaWYgKHZhbHVlMSA9PSBudWxsICYmIHZhbHVlMiA9PSBudWxsKVxuICAgICAgICAgICAgcmVzdWx0ID0gMDtcbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIHZhbHVlMSA9PSAnc3RyaW5nJyB8fCB2YWx1ZTEgaW5zdGFuY2VvZiBTdHJpbmcpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZTEubG9jYWxlQ29tcGFyZSAmJiAodmFsdWUxICE9IHZhbHVlMikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKG11bHRpU29ydE1ldGFbaW5kZXhdLm9yZGVyICogdmFsdWUxLmxvY2FsZUNvbXBhcmUodmFsdWUyKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQgPSAodmFsdWUxIDwgdmFsdWUyKSA/IC0xIDogMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh2YWx1ZTEgPT0gdmFsdWUyKSB7XG4gICAgICAgICAgICByZXR1cm4gKG11bHRpU29ydE1ldGEubGVuZ3RoIC0gMSkgPiAoaW5kZXgpID8gKHRoaXMubXVsdGlzb3J0RmllbGQoZGF0YTEsIGRhdGEyLCBtdWx0aVNvcnRNZXRhLCBpbmRleCArIDEpKSA6IDA7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gKG11bHRpU29ydE1ldGFbaW5kZXhdLm9yZGVyICogcmVzdWx0KTtcbiAgICB9XG5cbiAgICBnZXRTb3J0TWV0YShmaWVsZDogc3RyaW5nKSB7XG4gICAgICAgIGlmICh0aGlzLm11bHRpU29ydE1ldGEgJiYgdGhpcy5tdWx0aVNvcnRNZXRhLmxlbmd0aCkge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm11bHRpU29ydE1ldGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5tdWx0aVNvcnRNZXRhW2ldLmZpZWxkID09PSBmaWVsZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5tdWx0aVNvcnRNZXRhW2ldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGlzU29ydGVkKGZpZWxkOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKHRoaXMuc29ydE1vZGUgPT09ICdzaW5nbGUnKSB7XG4gICAgICAgICAgICByZXR1cm4gKHRoaXMuc29ydEZpZWxkICYmIHRoaXMuc29ydEZpZWxkID09PSBmaWVsZCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5zb3J0TW9kZSA9PT0gJ211bHRpcGxlJykge1xuICAgICAgICAgICAgbGV0IHNvcnRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgaWYgKHRoaXMubXVsdGlTb3J0TWV0YSnCoHtcbiAgICAgICAgICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy5tdWx0aVNvcnRNZXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm11bHRpU29ydE1ldGFbaV0uZmllbGQgPT0gZmllbGQpwqB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzb3J0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc29ydGVkO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaGFuZGxlUm93Q2xpY2soZXZlbnQpIHtcbiAgICAgICAgbGV0IHRhcmdldCA9ICg8SFRNTEVsZW1lbnQ+IGV2ZW50Lm9yaWdpbmFsRXZlbnQudGFyZ2V0KTtcbiAgICAgICAgbGV0IHRhcmdldE5vZGUgPSB0YXJnZXQubm9kZU5hbWU7XG4gICAgICAgIGxldCBwYXJlbnROb2RlID0gdGFyZ2V0LnBhcmVudEVsZW1lbnQgJiYgdGFyZ2V0LnBhcmVudEVsZW1lbnQubm9kZU5hbWU7XG4gICAgICAgIGlmICh0YXJnZXROb2RlID09ICdJTlBVVCcgfHwgdGFyZ2V0Tm9kZSA9PSAnQlVUVE9OJyB8fCB0YXJnZXROb2RlID09ICdBJyB8fFxuICAgICAgICAgICAgcGFyZW50Tm9kZSA9PSAnSU5QVVQnIHx8IHBhcmVudE5vZGUgPT0gJ0JVVFRPTicgfHwgcGFyZW50Tm9kZSA9PSAnQScgfHxcbiAgICAgICAgICAgIChEb21IYW5kbGVyLmhhc0NsYXNzKGV2ZW50Lm9yaWdpbmFsRXZlbnQudGFyZ2V0LCAncC1jbGlja2FibGUnKSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGlvbk1vZGUpIHtcbiAgICAgICAgICAgIHRoaXMucHJldmVudFNlbGVjdGlvblNldHRlclByb3BhZ2F0aW9uID0gdHJ1ZTtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzTXVsdGlwbGVTZWxlY3Rpb25Nb2RlKCkgJiYgZXZlbnQub3JpZ2luYWxFdmVudC5zaGlmdEtleSAmJiB0aGlzLmFuY2hvclJvd0luZGV4ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBEb21IYW5kbGVyLmNsZWFyU2VsZWN0aW9uKCk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucmFuZ2VSb3dJbmRleCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xlYXJTZWxlY3Rpb25SYW5nZShldmVudC5vcmlnaW5hbEV2ZW50KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLnJhbmdlUm93SW5kZXggPSBldmVudC5yb3dJbmRleDtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdFJhbmdlKGV2ZW50Lm9yaWdpbmFsRXZlbnQsIGV2ZW50LnJvd0luZGV4KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCByb3dEYXRhID0gZXZlbnQucm93RGF0YTtcbiAgICAgICAgICAgICAgICBsZXQgc2VsZWN0ZWQgPSB0aGlzLmlzU2VsZWN0ZWQocm93RGF0YSk7XG4gICAgICAgICAgICAgICAgbGV0IG1ldGFTZWxlY3Rpb24gPSB0aGlzLnJvd1RvdWNoZWQgPyBmYWxzZSA6IHRoaXMubWV0YUtleVNlbGVjdGlvbjtcbiAgICAgICAgICAgICAgICBsZXQgZGF0YUtleVZhbHVlID0gdGhpcy5kYXRhS2V5ID8gU3RyaW5nKE9iamVjdFV0aWxzLnJlc29sdmVGaWVsZERhdGEocm93RGF0YSwgdGhpcy5kYXRhS2V5KSkgOiBudWxsO1xuICAgICAgICAgICAgICAgIHRoaXMuYW5jaG9yUm93SW5kZXggPSBldmVudC5yb3dJbmRleDtcbiAgICAgICAgICAgICAgICB0aGlzLnJhbmdlUm93SW5kZXggPSBldmVudC5yb3dJbmRleDtcblxuICAgICAgICAgICAgICAgIGlmIChtZXRhU2VsZWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBtZXRhS2V5ID0gZXZlbnQub3JpZ2luYWxFdmVudC5tZXRhS2V5fHxldmVudC5vcmlnaW5hbEV2ZW50LmN0cmxLZXk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGVjdGVkICYmIG1ldGFLZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzU2luZ2xlU2VsZWN0aW9uTW9kZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0aW9uID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGlvbktleXMgPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGlvbkNoYW5nZS5lbWl0KG51bGwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHNlbGVjdGlvbkluZGV4ID0gdGhpcy5maW5kSW5kZXhJblNlbGVjdGlvbihyb3dEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3Rpb24gPSB0aGlzLnNlbGVjdGlvbi5maWx0ZXIoKHZhbCxpKSA9PiBpIT1zZWxlY3Rpb25JbmRleCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25DaGFuZ2UuZW1pdCh0aGlzLnNlbGVjdGlvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGFLZXlWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5zZWxlY3Rpb25LZXlzW2RhdGFLZXlWYWx1ZV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9uUm93VW5zZWxlY3QuZW1pdCh7b3JpZ2luYWxFdmVudDogZXZlbnQub3JpZ2luYWxFdmVudCwgZGF0YTogcm93RGF0YSwgdHlwZTogJ3Jvdyd9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzU2luZ2xlU2VsZWN0aW9uTW9kZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0aW9uID0gcm93RGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGlvbkNoYW5nZS5lbWl0KHJvd0RhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhS2V5VmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25LZXlzID0ge307XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uS2V5c1tkYXRhS2V5VmFsdWVdID0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh0aGlzLmlzTXVsdGlwbGVTZWxlY3Rpb25Nb2RlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobWV0YUtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3Rpb24gPSB0aGlzLnNlbGVjdGlvbnx8W107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3Rpb24gPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25LZXlzID0ge307XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0aW9uID0gWy4uLnRoaXMuc2VsZWN0aW9uLHJvd0RhdGFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uQ2hhbmdlLmVtaXQodGhpcy5zZWxlY3Rpb24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhS2V5VmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25LZXlzW2RhdGFLZXlWYWx1ZV0gPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vblJvd1NlbGVjdC5lbWl0KHtvcmlnaW5hbEV2ZW50OiBldmVudC5vcmlnaW5hbEV2ZW50LCBkYXRhOiByb3dEYXRhLCB0eXBlOiAncm93JywgaW5kZXg6IGV2ZW50LnJvd0luZGV4fSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnNlbGVjdGlvbk1vZGUgPT09ICdzaW5nbGUnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3Rpb24gPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uS2V5cyA9IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uQ2hhbmdlLmVtaXQodGhpcy5zZWxlY3Rpb24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25Sb3dVbnNlbGVjdC5lbWl0KHsgb3JpZ2luYWxFdmVudDogZXZlbnQub3JpZ2luYWxFdmVudCwgZGF0YTogcm93RGF0YSwgdHlwZTogJ3JvdycgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3Rpb24gPSByb3dEYXRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uQ2hhbmdlLmVtaXQodGhpcy5zZWxlY3Rpb24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25Sb3dTZWxlY3QuZW1pdCh7IG9yaWdpbmFsRXZlbnQ6IGV2ZW50Lm9yaWdpbmFsRXZlbnQsIGRhdGE6IHJvd0RhdGEsIHR5cGU6ICdyb3cnLCBpbmRleDogZXZlbnQucm93SW5kZXggfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGFLZXlWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGlvbktleXMgPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25LZXlzW2RhdGFLZXlWYWx1ZV0gPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh0aGlzLnNlbGVjdGlvbk1vZGUgPT09ICdtdWx0aXBsZScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzZWxlY3Rpb25JbmRleCA9IHRoaXMuZmluZEluZGV4SW5TZWxlY3Rpb24ocm93RGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0aW9uID0gdGhpcy5zZWxlY3Rpb24uZmlsdGVyKCh2YWwsIGkpID0+IGkgIT0gc2VsZWN0aW9uSW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uQ2hhbmdlLmVtaXQodGhpcy5zZWxlY3Rpb24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25Sb3dVbnNlbGVjdC5lbWl0KHsgb3JpZ2luYWxFdmVudDogZXZlbnQub3JpZ2luYWxFdmVudCwgZGF0YTogcm93RGF0YSwgdHlwZTogJ3JvdycgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGFLZXlWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5zZWxlY3Rpb25LZXlzW2RhdGFLZXlWYWx1ZV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0aW9uID0gdGhpcy5zZWxlY3Rpb24gPyBbLi4udGhpcy5zZWxlY3Rpb24sIHJvd0RhdGFdIDogW3Jvd0RhdGFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uQ2hhbmdlLmVtaXQodGhpcy5zZWxlY3Rpb24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25Sb3dTZWxlY3QuZW1pdCh7IG9yaWdpbmFsRXZlbnQ6IGV2ZW50Lm9yaWdpbmFsRXZlbnQsIGRhdGE6IHJvd0RhdGEsIHR5cGU6ICdyb3cnLCBpbmRleDogZXZlbnQucm93SW5kZXggfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGFLZXlWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGlvbktleXNbZGF0YUtleVZhbHVlXSA9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnRhYmxlU2VydmljZS5vblNlbGVjdGlvbkNoYW5nZSgpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5pc1N0YXRlZnVsKCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNhdmVTdGF0ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5yb3dUb3VjaGVkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgaGFuZGxlUm93VG91Y2hFbmQoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5yb3dUb3VjaGVkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBoYW5kbGVSb3dSaWdodENsaWNrKGV2ZW50KSB7XG4gICAgICAgIGlmICh0aGlzLmNvbnRleHRNZW51KSB7XG4gICAgICAgICAgICBjb25zdCByb3dEYXRhID0gZXZlbnQucm93RGF0YTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuY29udGV4dE1lbnVTZWxlY3Rpb25Nb2RlID09PSAnc2VwYXJhdGUnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0TWVudVNlbGVjdGlvbiA9IHJvd0RhdGE7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0TWVudVNlbGVjdGlvbkNoYW5nZS5lbWl0KHJvd0RhdGEpO1xuICAgICAgICAgICAgICAgIHRoaXMub25Db250ZXh0TWVudVNlbGVjdC5lbWl0KHtvcmlnaW5hbEV2ZW50OiBldmVudC5vcmlnaW5hbEV2ZW50LCBkYXRhOiByb3dEYXRhLCBpbmRleDogZXZlbnQucm93SW5kZXh9KTtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHRNZW51LnNob3coZXZlbnQub3JpZ2luYWxFdmVudCk7XG4gICAgICAgICAgICAgICAgdGhpcy50YWJsZVNlcnZpY2Uub25Db250ZXh0TWVudShyb3dEYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuY29udGV4dE1lbnVTZWxlY3Rpb25Nb2RlID09PSAnam9pbnQnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcmV2ZW50U2VsZWN0aW9uU2V0dGVyUHJvcGFnYXRpb24gPSB0cnVlO1xuICAgICAgICAgICAgICAgIGxldCBzZWxlY3RlZCA9IHRoaXMuaXNTZWxlY3RlZChyb3dEYXRhKTtcbiAgICAgICAgICAgICAgICBsZXQgZGF0YUtleVZhbHVlID0gdGhpcy5kYXRhS2V5ID8gU3RyaW5nKE9iamVjdFV0aWxzLnJlc29sdmVGaWVsZERhdGEocm93RGF0YSwgdGhpcy5kYXRhS2V5KSkgOiBudWxsO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFzZWxlY3RlZCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pc1NpbmdsZVNlbGVjdGlvbk1vZGUoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb24gPSByb3dEYXRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25DaGFuZ2UuZW1pdChyb3dEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh0aGlzLmlzTXVsdGlwbGVTZWxlY3Rpb25Nb2RlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uID0gW3Jvd0RhdGFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25DaGFuZ2UuZW1pdCh0aGlzLnNlbGVjdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YUtleVZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGlvbktleXNbZGF0YUtleVZhbHVlXSA9IDE7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHRNZW51LnNob3coZXZlbnQub3JpZ2luYWxFdmVudCk7XG4gICAgICAgICAgICAgICAgdGhpcy5vbkNvbnRleHRNZW51U2VsZWN0LmVtaXQoe29yaWdpbmFsRXZlbnQ6IGV2ZW50LCBkYXRhOiByb3dEYXRhLCBpbmRleDogZXZlbnQucm93SW5kZXh9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNlbGVjdFJhbmdlKGV2ZW50OiBNb3VzZUV2ZW50LCByb3dJbmRleDogbnVtYmVyKSB7XG4gICAgICAgIGxldCByYW5nZVN0YXJ0LCByYW5nZUVuZDtcblxuICAgICAgICBpZiAodGhpcy5hbmNob3JSb3dJbmRleCA+IHJvd0luZGV4KSB7XG4gICAgICAgICAgICByYW5nZVN0YXJ0ID0gcm93SW5kZXg7XG4gICAgICAgICAgICByYW5nZUVuZCA9IHRoaXMuYW5jaG9yUm93SW5kZXg7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5hbmNob3JSb3dJbmRleCA8IHJvd0luZGV4KSB7XG4gICAgICAgICAgICByYW5nZVN0YXJ0ID0gdGhpcy5hbmNob3JSb3dJbmRleDtcbiAgICAgICAgICAgIHJhbmdlRW5kID0gcm93SW5kZXg7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByYW5nZVN0YXJ0ID0gcm93SW5kZXg7XG4gICAgICAgICAgICByYW5nZUVuZCA9IHJvd0luZGV4O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMubGF6eSAmJiB0aGlzLnBhZ2luYXRvcikge1xuICAgICAgICAgICAgcmFuZ2VTdGFydCAtPSB0aGlzLmZpcnN0O1xuICAgICAgICAgICAgcmFuZ2VFbmQgLT0gdGhpcy5maXJzdDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvcihsZXQgaSA9IHJhbmdlU3RhcnQ7IGkgPD0gcmFuZ2VFbmQ7IGkrKykge1xuICAgICAgICAgICAgbGV0IHJhbmdlUm93RGF0YSA9IHRoaXMuZmlsdGVyZWRWYWx1ZSA/IHRoaXMuZmlsdGVyZWRWYWx1ZVtpXSA6IHRoaXMudmFsdWVbaV07XG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNTZWxlY3RlZChyYW5nZVJvd0RhdGEpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0aW9uID0gWy4uLnRoaXMuc2VsZWN0aW9uLCByYW5nZVJvd0RhdGFdO1xuICAgICAgICAgICAgICAgIGxldCBkYXRhS2V5VmFsdWU6IHN0cmluZyA9IHRoaXMuZGF0YUtleSA/IFN0cmluZyhPYmplY3RVdGlscy5yZXNvbHZlRmllbGREYXRhKHJhbmdlUm93RGF0YSwgdGhpcy5kYXRhS2V5KSkgOiBudWxsO1xuICAgICAgICAgICAgICAgIGlmIChkYXRhS2V5VmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25LZXlzW2RhdGFLZXlWYWx1ZV0gPSAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLm9uUm93U2VsZWN0LmVtaXQoe29yaWdpbmFsRXZlbnQ6IGV2ZW50LCBkYXRhOiByYW5nZVJvd0RhdGEsIHR5cGU6ICdyb3cnfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNlbGVjdGlvbkNoYW5nZS5lbWl0KHRoaXMuc2VsZWN0aW9uKTtcbiAgICB9XG5cbiAgICBjbGVhclNlbGVjdGlvblJhbmdlKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgICAgIGxldCByYW5nZVN0YXJ0LCByYW5nZUVuZDtcblxuICAgICAgICBpZiAodGhpcy5yYW5nZVJvd0luZGV4ID4gdGhpcy5hbmNob3JSb3dJbmRleCkge1xuICAgICAgICAgICAgcmFuZ2VTdGFydCA9IHRoaXMuYW5jaG9yUm93SW5kZXg7XG4gICAgICAgICAgICByYW5nZUVuZCA9IHRoaXMucmFuZ2VSb3dJbmRleDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLnJhbmdlUm93SW5kZXggPCB0aGlzLmFuY2hvclJvd0luZGV4KSB7XG4gICAgICAgICAgICByYW5nZVN0YXJ0ID0gdGhpcy5yYW5nZVJvd0luZGV4O1xuICAgICAgICAgICAgcmFuZ2VFbmQgPSB0aGlzLmFuY2hvclJvd0luZGV4O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmFuZ2VTdGFydCA9IHRoaXMucmFuZ2VSb3dJbmRleDtcbiAgICAgICAgICAgIHJhbmdlRW5kID0gdGhpcy5yYW5nZVJvd0luZGV4O1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yKGxldCBpID0gcmFuZ2VTdGFydDsgaSA8PSByYW5nZUVuZDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcmFuZ2VSb3dEYXRhID0gdGhpcy52YWx1ZVtpXTtcbiAgICAgICAgICAgIGxldCBzZWxlY3Rpb25JbmRleCA9IHRoaXMuZmluZEluZGV4SW5TZWxlY3Rpb24ocmFuZ2VSb3dEYXRhKTtcbiAgICAgICAgICAgIHRoaXMuX3NlbGVjdGlvbiA9IHRoaXMuc2VsZWN0aW9uLmZpbHRlcigodmFsLGkpID0+IGkhPXNlbGVjdGlvbkluZGV4KTtcbiAgICAgICAgICAgIGxldCBkYXRhS2V5VmFsdWU6IHN0cmluZyA9IHRoaXMuZGF0YUtleSA/IFN0cmluZyhPYmplY3RVdGlscy5yZXNvbHZlRmllbGREYXRhKHJhbmdlUm93RGF0YSwgdGhpcy5kYXRhS2V5KSkgOiBudWxsO1xuICAgICAgICAgICAgaWYgKGRhdGFLZXlWYWx1ZSkge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLnNlbGVjdGlvbktleXNbZGF0YUtleVZhbHVlXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMub25Sb3dVbnNlbGVjdC5lbWl0KHtvcmlnaW5hbEV2ZW50OiBldmVudCwgZGF0YTogcmFuZ2VSb3dEYXRhLCB0eXBlOiAncm93J30pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaXNTZWxlY3RlZChyb3dEYXRhKSB7XG4gICAgICAgIGlmIChyb3dEYXRhICYmIHRoaXMuc2VsZWN0aW9uKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhS2V5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0aW9uS2V5c1tPYmplY3RVdGlscy5yZXNvbHZlRmllbGREYXRhKHJvd0RhdGEsIHRoaXMuZGF0YUtleSldICE9PSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zZWxlY3Rpb24gaW5zdGFuY2VvZiBBcnJheSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmluZEluZGV4SW5TZWxlY3Rpb24ocm93RGF0YSkgPiAtMTtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmVxdWFscyhyb3dEYXRhLCB0aGlzLnNlbGVjdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZmluZEluZGV4SW5TZWxlY3Rpb24ocm93RGF0YTogYW55KSB7XG4gICAgICAgIGxldCBpbmRleDogbnVtYmVyID0gLTE7XG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGlvbiAmJiB0aGlzLnNlbGVjdGlvbi5sZW5ndGgpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zZWxlY3Rpb24ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5lcXVhbHMocm93RGF0YSwgdGhpcy5zZWxlY3Rpb25baV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIGluZGV4ID0gaTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGluZGV4O1xuICAgIH1cblxuICAgIHRvZ2dsZVJvd1dpdGhSYWRpbyhldmVudDogYW55LCByb3dEYXRhOmFueSkge1xuICAgICAgICB0aGlzLnByZXZlbnRTZWxlY3Rpb25TZXR0ZXJQcm9wYWdhdGlvbiA9IHRydWU7XG5cbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0aW9uICE9IHJvd0RhdGEpIHtcbiAgICAgICAgICAgIHRoaXMuX3NlbGVjdGlvbiA9IHJvd0RhdGE7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGlvbkNoYW5nZS5lbWl0KHRoaXMuc2VsZWN0aW9uKTtcbiAgICAgICAgICAgIHRoaXMub25Sb3dTZWxlY3QuZW1pdCh7b3JpZ2luYWxFdmVudDogZXZlbnQub3JpZ2luYWxFdmVudCwgaW5kZXg6IGV2ZW50LnJvd0luZGV4LCBkYXRhOiByb3dEYXRhLCB0eXBlOiAncmFkaW9idXR0b24nfSk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmRhdGFLZXkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGlvbktleXMgPSB7fTtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGlvbktleXNbU3RyaW5nKE9iamVjdFV0aWxzLnJlc29sdmVGaWVsZERhdGEocm93RGF0YSwgdGhpcy5kYXRhS2V5KSldID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3NlbGVjdGlvbiA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGlvbkNoYW5nZS5lbWl0KHRoaXMuc2VsZWN0aW9uKTtcbiAgICAgICAgICAgIHRoaXMub25Sb3dVbnNlbGVjdC5lbWl0KHtvcmlnaW5hbEV2ZW50OiBldmVudC5vcmlnaW5hbEV2ZW50LCBpbmRleDogZXZlbnQucm93SW5kZXgsIGRhdGE6IHJvd0RhdGEsIHR5cGU6ICdyYWRpb2J1dHRvbid9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudGFibGVTZXJ2aWNlLm9uU2VsZWN0aW9uQ2hhbmdlKCk7XG5cbiAgICAgICAgaWYgKHRoaXMuaXNTdGF0ZWZ1bCgpKSB7XG4gICAgICAgICAgICB0aGlzLnNhdmVTdGF0ZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdG9nZ2xlUm93V2l0aENoZWNrYm94KGV2ZW50LCByb3dEYXRhOiBhbnkpIHtcbiAgICAgICAgdGhpcy5zZWxlY3Rpb24gPSB0aGlzLnNlbGVjdGlvbnx8W107XG4gICAgICAgIGxldCBzZWxlY3RlZCA9IHRoaXMuaXNTZWxlY3RlZChyb3dEYXRhKTtcbiAgICAgICAgbGV0IGRhdGFLZXlWYWx1ZSA9IHRoaXMuZGF0YUtleSA/IFN0cmluZyhPYmplY3RVdGlscy5yZXNvbHZlRmllbGREYXRhKHJvd0RhdGEsIHRoaXMuZGF0YUtleSkpIDogbnVsbDtcbiAgICAgICAgdGhpcy5wcmV2ZW50U2VsZWN0aW9uU2V0dGVyUHJvcGFnYXRpb24gPSB0cnVlO1xuXG4gICAgICAgIGlmIChzZWxlY3RlZCkge1xuICAgICAgICAgICAgbGV0IHNlbGVjdGlvbkluZGV4ID0gdGhpcy5maW5kSW5kZXhJblNlbGVjdGlvbihyb3dEYXRhKTtcbiAgICAgICAgICAgIHRoaXMuX3NlbGVjdGlvbiA9IHRoaXMuc2VsZWN0aW9uLmZpbHRlcigodmFsLCBpKSA9PiBpICE9IHNlbGVjdGlvbkluZGV4KTtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uQ2hhbmdlLmVtaXQodGhpcy5zZWxlY3Rpb24pO1xuICAgICAgICAgICAgdGhpcy5vblJvd1Vuc2VsZWN0LmVtaXQoeyBvcmlnaW5hbEV2ZW50OiBldmVudC5vcmlnaW5hbEV2ZW50LCBpbmRleDogZXZlbnQucm93SW5kZXgsIGRhdGE6IHJvd0RhdGEsIHR5cGU6ICdjaGVja2JveCcgfSk7XG4gICAgICAgICAgICBpZiAoZGF0YUtleVZhbHVlKSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuc2VsZWN0aW9uS2V5c1tkYXRhS2V5VmFsdWVdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fc2VsZWN0aW9uID0gdGhpcy5zZWxlY3Rpb24gPyBbLi4udGhpcy5zZWxlY3Rpb24sIHJvd0RhdGFdIDogW3Jvd0RhdGFdO1xuICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25DaGFuZ2UuZW1pdCh0aGlzLnNlbGVjdGlvbik7XG4gICAgICAgICAgICB0aGlzLm9uUm93U2VsZWN0LmVtaXQoeyBvcmlnaW5hbEV2ZW50OiBldmVudC5vcmlnaW5hbEV2ZW50LCBpbmRleDogZXZlbnQucm93SW5kZXgsIGRhdGE6IHJvd0RhdGEsIHR5cGU6ICdjaGVja2JveCcgfSk7XG4gICAgICAgICAgICBpZiAoZGF0YUtleVZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25LZXlzW2RhdGFLZXlWYWx1ZV0gPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy50YWJsZVNlcnZpY2Uub25TZWxlY3Rpb25DaGFuZ2UoKTtcblxuICAgICAgICBpZiAodGhpcy5pc1N0YXRlZnVsKCkpIHtcbiAgICAgICAgICAgIHRoaXMuc2F2ZVN0YXRlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0b2dnbGVSb3dzV2l0aENoZWNrYm94KGV2ZW50OiBFdmVudCwgY2hlY2s6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy5fc2VsZWN0aW9uID0gY2hlY2sgPyB0aGlzLmZpbHRlcmVkVmFsdWUgPyB0aGlzLmZpbHRlcmVkVmFsdWUuc2xpY2UoKTogdGhpcy52YWx1ZS5zbGljZSgpIDogW107XG4gICAgICAgIHRoaXMucHJldmVudFNlbGVjdGlvblNldHRlclByb3BhZ2F0aW9uID0gdHJ1ZTtcbiAgICAgICAgdGhpcy51cGRhdGVTZWxlY3Rpb25LZXlzKCk7XG4gICAgICAgIHRoaXMuc2VsZWN0aW9uQ2hhbmdlLmVtaXQodGhpcy5fc2VsZWN0aW9uKTtcbiAgICAgICAgdGhpcy50YWJsZVNlcnZpY2Uub25TZWxlY3Rpb25DaGFuZ2UoKTtcbiAgICAgICAgdGhpcy5vbkhlYWRlckNoZWNrYm94VG9nZ2xlLmVtaXQoe29yaWdpbmFsRXZlbnQ6IGV2ZW50LCBjaGVja2VkOiBjaGVja30pO1xuXG4gICAgICAgIGlmICh0aGlzLmlzU3RhdGVmdWwoKSkge1xuICAgICAgICAgICAgdGhpcy5zYXZlU3RhdGUoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGVxdWFscyhkYXRhMSwgZGF0YTIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29tcGFyZVNlbGVjdGlvbkJ5ID09PSAnZXF1YWxzJyA/IChkYXRhMSA9PT0gZGF0YTIpIDogT2JqZWN0VXRpbHMuZXF1YWxzKGRhdGExLCBkYXRhMiwgdGhpcy5kYXRhS2V5KTtcbiAgICB9XG5cbiAgICBmaWx0ZXIodmFsdWUsIGZpZWxkLCBtYXRjaE1vZGUpIHtcbiAgICAgICAgaWYgKHRoaXMuZmlsdGVyVGltZW91dCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuZmlsdGVyVGltZW91dCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMuaXNGaWx0ZXJCbGFuayh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHRoaXMuZmlsdGVyc1tmaWVsZF0gPSB7IHZhbHVlOiB2YWx1ZSwgbWF0Y2hNb2RlOiBtYXRjaE1vZGUgfTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmZpbHRlcnNbZmllbGRdKSB7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5maWx0ZXJzW2ZpZWxkXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZmlsdGVyVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fZmlsdGVyKCk7XG4gICAgICAgICAgICB0aGlzLmZpbHRlclRpbWVvdXQgPSBudWxsO1xuICAgICAgICB9LCB0aGlzLmZpbHRlckRlbGF5KTtcblxuICAgICAgICB0aGlzLmFuY2hvclJvd0luZGV4ID0gbnVsbDtcbiAgICB9XG5cbiAgICBmaWx0ZXJHbG9iYWwodmFsdWUsIG1hdGNoTW9kZSkge1xuICAgICAgICB0aGlzLmZpbHRlcih2YWx1ZSwgJ2dsb2JhbCcsIG1hdGNoTW9kZSk7XG4gICAgfVxuXG4gICAgaXNGaWx0ZXJCbGFuayhmaWx0ZXI6IGFueSk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAoZmlsdGVyICE9PSBudWxsICYmIGZpbHRlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBpZiAoKHR5cGVvZiBmaWx0ZXIgPT09ICdzdHJpbmcnICYmIGZpbHRlci50cmltKCkubGVuZ3RoID09IDApIHx8IChmaWx0ZXIgaW5zdGFuY2VvZiBBcnJheSAmJiBmaWx0ZXIubGVuZ3RoID09IDApKVxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBfZmlsdGVyKCkge1xuICAgICAgICBpZiAoIXRoaXMucmVzdG9yaW5nRmlsdGVyKSB7XG4gICAgICAgICAgICB0aGlzLmZpcnN0ID0gMDtcbiAgICAgICAgICAgIHRoaXMuZmlyc3RDaGFuZ2UuZW1pdCh0aGlzLmZpcnN0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmxhenkpIHtcbiAgICAgICAgICAgIHRoaXMub25MYXp5TG9hZC5lbWl0KHRoaXMuY3JlYXRlTGF6eUxvYWRNZXRhZGF0YSgpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmICghdGhpcy52YWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCF0aGlzLmhhc0ZpbHRlcigpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5maWx0ZXJlZFZhbHVlID0gbnVsbDtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wYWdpbmF0b3IpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50b3RhbFJlY29yZHMgPSB0aGlzLnZhbHVlID8gdGhpcy52YWx1ZS5sZW5ndGggOiAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCBnbG9iYWxGaWx0ZXJGaWVsZHNBcnJheTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5maWx0ZXJzWydnbG9iYWwnXSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuY29sdW1ucyAmJiAhdGhpcy5nbG9iYWxGaWx0ZXJGaWVsZHMpXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0dsb2JhbCBmaWx0ZXJpbmcgcmVxdWlyZXMgZHluYW1pYyBjb2x1bW5zIG9yIGdsb2JhbEZpbHRlckZpZWxkcyB0byBiZSBkZWZpbmVkLicpO1xuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBnbG9iYWxGaWx0ZXJGaWVsZHNBcnJheSA9IHRoaXMuZ2xvYmFsRmlsdGVyRmllbGRzfHx0aGlzLmNvbHVtbnM7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5maWx0ZXJlZFZhbHVlID0gW107XG5cbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMudmFsdWUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGxvY2FsTWF0Y2ggPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBsZXQgZ2xvYmFsTWF0Y2ggPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGxvY2FsRmlsdGVyZWQgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBwcm9wIGluIHRoaXMuZmlsdGVycykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZmlsdGVycy5oYXNPd25Qcm9wZXJ0eShwcm9wKSAmJiBwcm9wICE9PSAnZ2xvYmFsJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsRmlsdGVyZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBmaWx0ZXJNZXRhID0gdGhpcy5maWx0ZXJzW3Byb3BdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBmaWx0ZXJGaWVsZCA9IHByb3A7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGZpbHRlclZhbHVlID0gZmlsdGVyTWV0YS52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZmlsdGVyTWF0Y2hNb2RlID0gZmlsdGVyTWV0YS5tYXRjaE1vZGUgfHwgJ3N0YXJ0c1dpdGgnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBkYXRhRmllbGRWYWx1ZSA9IE9iamVjdFV0aWxzLnJlc29sdmVGaWVsZERhdGEodGhpcy52YWx1ZVtpXSwgZmlsdGVyRmllbGQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBmaWx0ZXJDb25zdHJhaW50ID0gRmlsdGVyVXRpbHNbZmlsdGVyTWF0Y2hNb2RlXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZmlsdGVyQ29uc3RyYWludChkYXRhRmllbGRWYWx1ZSwgZmlsdGVyVmFsdWUsIHRoaXMuZmlsdGVyTG9jYWxlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhbE1hdGNoID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFsb2NhbE1hdGNoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmZpbHRlcnNbJ2dsb2JhbCddICYmICFnbG9iYWxNYXRjaCAmJiBnbG9iYWxGaWx0ZXJGaWVsZHNBcnJheSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yKGxldCBqID0gMDsgaiA8IGdsb2JhbEZpbHRlckZpZWxkc0FycmF5Lmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGdsb2JhbEZpbHRlckZpZWxkID0gZ2xvYmFsRmlsdGVyRmllbGRzQXJyYXlbal0uZmllbGR8fGdsb2JhbEZpbHRlckZpZWxkc0FycmF5W2pdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdsb2JhbE1hdGNoID0gRmlsdGVyVXRpbHNbdGhpcy5maWx0ZXJzWydnbG9iYWwnXS5tYXRjaE1vZGVdKE9iamVjdFV0aWxzLnJlc29sdmVGaWVsZERhdGEodGhpcy52YWx1ZVtpXSwgZ2xvYmFsRmlsdGVyRmllbGQpLCB0aGlzLmZpbHRlcnNbJ2dsb2JhbCddLnZhbHVlLCB0aGlzLmZpbHRlckxvY2FsZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZ2xvYmFsTWF0Y2gpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IG1hdGNoZXM6IGJvb2xlYW47XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmZpbHRlcnNbJ2dsb2JhbCddKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXRjaGVzID0gbG9jYWxGaWx0ZXJlZCA/IChsb2NhbEZpbHRlcmVkICYmIGxvY2FsTWF0Y2ggJiYgZ2xvYmFsTWF0Y2gpIDogZ2xvYmFsTWF0Y2g7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXRjaGVzID0gbG9jYWxGaWx0ZXJlZCAmJiBsb2NhbE1hdGNoO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKG1hdGNoZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmlsdGVyZWRWYWx1ZS5wdXNoKHRoaXMudmFsdWVbaV0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZmlsdGVyZWRWYWx1ZS5sZW5ndGggPT09IHRoaXMudmFsdWUubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmlsdGVyZWRWYWx1ZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucGFnaW5hdG9yKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudG90YWxSZWNvcmRzID0gdGhpcy5maWx0ZXJlZFZhbHVlID8gdGhpcy5maWx0ZXJlZFZhbHVlLmxlbmd0aCA6IHRoaXMudmFsdWUgPyB0aGlzLnZhbHVlLmxlbmd0aCA6IDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5vbkZpbHRlci5lbWl0KHtcbiAgICAgICAgICAgIGZpbHRlcnM6IHRoaXMuZmlsdGVycyxcbiAgICAgICAgICAgIGZpbHRlcmVkVmFsdWU6IHRoaXMuZmlsdGVyZWRWYWx1ZSB8fCB0aGlzLnZhbHVlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMudGFibGVTZXJ2aWNlLm9uVmFsdWVDaGFuZ2UodGhpcy52YWx1ZSk7XG5cbiAgICAgICAgaWYgKHRoaXMuaXNTdGF0ZWZ1bCgpICYmICF0aGlzLnJlc3RvcmluZ0ZpbHRlcikge1xuICAgICAgICAgICAgdGhpcy5zYXZlU3RhdGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnJlc3RvcmluZ0ZpbHRlcikge1xuICAgICAgICAgICAgdGhpcy5yZXN0b3JpbmdGaWx0ZXIgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG5cbiAgICAgICAgaWYgKHRoaXMuc2Nyb2xsYWJsZSkge1xuICAgICAgICAgICAgdGhpcy5yZXNldFNjcm9sbFRvcCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaGFzRmlsdGVyKCkge1xuICAgICAgICBsZXQgZW1wdHkgPSB0cnVlO1xuICAgICAgICBmb3IgKGxldCBwcm9wIGluIHRoaXMuZmlsdGVycykge1xuICAgICAgICAgICAgaWYgKHRoaXMuZmlsdGVycy5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xuICAgICAgICAgICAgICAgIGVtcHR5ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gIWVtcHR5O1xuICAgIH1cblxuICAgIGNyZWF0ZUxhenlMb2FkTWV0YWRhdGEoKTogYW55IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGZpcnN0OiB0aGlzLmZpcnN0LFxuICAgICAgICAgICAgcm93czogdGhpcy5yb3dzLFxuICAgICAgICAgICAgc29ydEZpZWxkOiB0aGlzLnNvcnRGaWVsZCxcbiAgICAgICAgICAgIHNvcnRPcmRlcjogdGhpcy5zb3J0T3JkZXIsXG4gICAgICAgICAgICBmaWx0ZXJzOiB0aGlzLmZpbHRlcnMsXG4gICAgICAgICAgICBnbG9iYWxGaWx0ZXI6IHRoaXMuZmlsdGVycyAmJiB0aGlzLmZpbHRlcnNbJ2dsb2JhbCddID8gdGhpcy5maWx0ZXJzWydnbG9iYWwnXS52YWx1ZSA6IG51bGwsXG4gICAgICAgICAgICBtdWx0aVNvcnRNZXRhOiB0aGlzLm11bHRpU29ydE1ldGFcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVzZXQoKSB7XG4gICAgICAgIHRoaXMuX3NvcnRGaWVsZCA9IG51bGw7XG4gICAgICAgIHRoaXMuX3NvcnRPcmRlciA9IHRoaXMuZGVmYXVsdFNvcnRPcmRlcjtcbiAgICAgICAgdGhpcy5fbXVsdGlTb3J0TWV0YSA9IG51bGw7XG4gICAgICAgIHRoaXMudGFibGVTZXJ2aWNlLm9uU29ydChudWxsKTtcblxuICAgICAgICB0aGlzLmZpbHRlcmVkVmFsdWUgPSBudWxsO1xuICAgICAgICB0aGlzLmZpbHRlcnMgPSB7fTtcblxuICAgICAgICB0aGlzLmZpcnN0ID0gMDtcbiAgICAgICAgdGhpcy5maXJzdENoYW5nZS5lbWl0KHRoaXMuZmlyc3QpO1xuXG4gICAgICAgIGlmICh0aGlzLmxhenkpIHtcbiAgICAgICAgICAgIHRoaXMub25MYXp5TG9hZC5lbWl0KHRoaXMuY3JlYXRlTGF6eUxvYWRNZXRhZGF0YSgpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudG90YWxSZWNvcmRzID0gKHRoaXMuX3ZhbHVlID8gdGhpcy5fdmFsdWUubGVuZ3RoIDogMCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgZXhwb3J0Q1NWKG9wdGlvbnM/OiBhbnkpIHtcbiAgICAgICAgbGV0IGRhdGEgPSB0aGlzLmZpbHRlcmVkVmFsdWUgfHwgdGhpcy52YWx1ZTtcbiAgICAgICAgbGV0IGNzdiA9ICcnO1xuXG4gICAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMuc2VsZWN0aW9uT25seSkge1xuICAgICAgICAgICAgZGF0YSA9IHRoaXMuc2VsZWN0aW9uIHx8IFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9oZWFkZXJzXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jb2x1bW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgY29sdW1uID0gdGhpcy5jb2x1bW5zW2ldO1xuICAgICAgICAgICAgaWYgKGNvbHVtbi5leHBvcnRhYmxlICE9PSBmYWxzZSAmJiBjb2x1bW4uZmllbGQpIHtcbiAgICAgICAgICAgICAgICBjc3YgKz0gJ1wiJyArIChjb2x1bW4uaGVhZGVyIHx8IGNvbHVtbi5maWVsZCkgKyAnXCInO1xuXG4gICAgICAgICAgICAgICAgaWYgKGkgPCAodGhpcy5jb2x1bW5zLmxlbmd0aCAtIDEpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNzdiArPSB0aGlzLmNzdlNlcGFyYXRvcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvL2JvZHlcbiAgICAgICAgZGF0YS5mb3JFYWNoKChyZWNvcmQsIGkpID0+IHtcbiAgICAgICAgICAgIGNzdiArPSAnXFxuJztcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jb2x1bW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNvbHVtbiA9IHRoaXMuY29sdW1uc1tpXTtcbiAgICAgICAgICAgICAgICBpZiAoY29sdW1uLmV4cG9ydGFibGUgIT09IGZhbHNlICYmIGNvbHVtbi5maWVsZCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY2VsbERhdGEgPSBPYmplY3RVdGlscy5yZXNvbHZlRmllbGREYXRhKHJlY29yZCwgY29sdW1uLmZpZWxkKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoY2VsbERhdGEgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZXhwb3J0RnVuY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjZWxsRGF0YSA9IHRoaXMuZXhwb3J0RnVuY3Rpb24oe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBjZWxsRGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmllbGQ6IGNvbHVtbi5maWVsZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNlbGxEYXRhID0gU3RyaW5nKGNlbGxEYXRhKS5yZXBsYWNlKC9cIi9nLCAnXCJcIicpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIGNlbGxEYXRhID0gJyc7XG5cblxuICAgICAgICAgICAgICAgICAgICBjc3YgKz0gJ1wiJyArIGNlbGxEYXRhICsgJ1wiJztcblxuICAgICAgICAgICAgICAgICAgICBpZiAoaSA8ICh0aGlzLmNvbHVtbnMubGVuZ3RoIC0gMSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNzdiArPSB0aGlzLmNzdlNlcGFyYXRvcjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgbGV0IGJsb2IgPSBuZXcgQmxvYihbY3N2XSwge1xuICAgICAgICAgICAgdHlwZTogJ3RleHQvY3N2O2NoYXJzZXQ9dXRmLTg7J1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAod2luZG93Lm5hdmlnYXRvci5tc1NhdmVPck9wZW5CbG9iKSB7XG4gICAgICAgICAgICBuYXZpZ2F0b3IubXNTYXZlT3JPcGVuQmxvYihibG9iLCB0aGlzLmV4cG9ydEZpbGVuYW1lICsgJy5jc3YnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGxldCBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XG4gICAgICAgICAgICBsaW5rLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGxpbmspO1xuICAgICAgICAgICAgaWYgKGxpbmsuZG93bmxvYWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGxpbmsuc2V0QXR0cmlidXRlKCdocmVmJywgVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKSk7XG4gICAgICAgICAgICAgICAgbGluay5zZXRBdHRyaWJ1dGUoJ2Rvd25sb2FkJywgdGhpcy5leHBvcnRGaWxlbmFtZSArICcuY3N2Jyk7XG4gICAgICAgICAgICAgICAgbGluay5jbGljaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY3N2ID0gJ2RhdGE6dGV4dC9jc3Y7Y2hhcnNldD11dGYtOCwnICsgY3N2O1xuICAgICAgICAgICAgICAgIHdpbmRvdy5vcGVuKGVuY29kZVVSSShjc3YpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQobGluayk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgcmVzZXRTY3JvbGxUb3AoKSB7XG4gICAgICAgIGlmICh0aGlzLnZpcnR1YWxTY3JvbGwpXG4gICAgICAgICAgICB0aGlzLnNjcm9sbFRvVmlydHVhbEluZGV4KDApO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICB0aGlzLnNjcm9sbFRvKHt0b3A6IDB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2Nyb2xsVG9WaXJ0dWFsSW5kZXgoaW5kZXg6IG51bWJlcikge1xuICAgICAgICBpZiAodGhpcy5zY3JvbGxhYmxlVmlld0NoaWxkKSB7XG4gICAgICAgICAgICB0aGlzLnNjcm9sbGFibGVWaWV3Q2hpbGQuc2Nyb2xsVG9WaXJ0dWFsSW5kZXgoaW5kZXgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuc2Nyb2xsYWJsZUZyb3plblZpZXdDaGlsZCkge1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxhYmxlRnJvemVuVmlld0NoaWxkLnNjcm9sbFRvVmlydHVhbEluZGV4KGluZGV4KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBzY3JvbGxUbyhvcHRpb25zKSB7XG4gICAgICAgIGlmICh0aGlzLnNjcm9sbGFibGVWaWV3Q2hpbGQpIHtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsYWJsZVZpZXdDaGlsZC5zY3JvbGxUbyhvcHRpb25zKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnNjcm9sbGFibGVGcm96ZW5WaWV3Q2hpbGQpIHtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsYWJsZUZyb3plblZpZXdDaGlsZC5zY3JvbGxUbyhvcHRpb25zKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVwZGF0ZUVkaXRpbmdDZWxsKGNlbGwsIGRhdGEsIGZpZWxkLCBpbmRleCkge1xuICAgICAgICB0aGlzLmVkaXRpbmdDZWxsID0gY2VsbDtcbiAgICAgICAgdGhpcy5lZGl0aW5nQ2VsbERhdGEgPSBkYXRhO1xuICAgICAgICB0aGlzLmVkaXRpbmdDZWxsRmllbGQgPSBmaWVsZDtcbiAgICAgICAgdGhpcy5lZGl0aW5nQ2VsbFJvd0luZGV4ID0gaW5kZXg7XG4gICAgICAgIHRoaXMuYmluZERvY3VtZW50RWRpdExpc3RlbmVyKCk7XG4gICAgfVxuXG4gICAgaXNFZGl0aW5nQ2VsbFZhbGlkKCkge1xuICAgICAgICByZXR1cm4gKHRoaXMuZWRpdGluZ0NlbGwgJiYgRG9tSGFuZGxlci5maW5kKHRoaXMuZWRpdGluZ0NlbGwsICcubmctaW52YWxpZC5uZy1kaXJ0eScpLmxlbmd0aCA9PT0gMCk7XG4gICAgfVxuXG4gICAgYmluZERvY3VtZW50RWRpdExpc3RlbmVyKCkge1xuICAgICAgICBpZiAoIXRoaXMuZG9jdW1lbnRFZGl0TGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHRoaXMuZG9jdW1lbnRFZGl0TGlzdGVuZXIgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5lZGl0aW5nQ2VsbCAmJiAhdGhpcy5lZGl0aW5nQ2VsbENsaWNrICYmIHRoaXMuaXNFZGl0aW5nQ2VsbFZhbGlkKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgRG9tSGFuZGxlci5yZW1vdmVDbGFzcyh0aGlzLmVkaXRpbmdDZWxsLCAncC1jZWxsLWVkaXRpbmcnKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lZGl0aW5nQ2VsbCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25FZGl0Q29tcGxldGUuZW1pdCh7IGZpZWxkOiB0aGlzLmVkaXRpbmdDZWxsRmllbGQsIGRhdGE6IHRoaXMuZWRpdGluZ0NlbGxEYXRhLCBvcmlnaW5hbEV2ZW50OiBldmVudCwgaW5kZXg6IHRoaXMuZWRpdGluZ0NlbGxSb3dJbmRleCB9KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lZGl0aW5nQ2VsbEZpZWxkID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lZGl0aW5nQ2VsbERhdGEgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVkaXRpbmdDZWxsUm93SW5kZXggPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVuYmluZERvY3VtZW50RWRpdExpc3RlbmVyKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5lZGl0aW5nQ2VsbENsaWNrID0gZmFsc2U7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuZG9jdW1lbnRFZGl0TGlzdGVuZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdW5iaW5kRG9jdW1lbnRFZGl0TGlzdGVuZXIoKSB7XG4gICAgICAgIGlmICh0aGlzLmRvY3VtZW50RWRpdExpc3RlbmVyKSB7XG4gICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuZG9jdW1lbnRFZGl0TGlzdGVuZXIpO1xuICAgICAgICAgICAgdGhpcy5kb2N1bWVudEVkaXRMaXN0ZW5lciA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpbml0Um93RWRpdChyb3dEYXRhOiBhbnkpIHtcbiAgICAgICAgbGV0IGRhdGFLZXlWYWx1ZSA9IFN0cmluZyhPYmplY3RVdGlscy5yZXNvbHZlRmllbGREYXRhKHJvd0RhdGEsIHRoaXMuZGF0YUtleSkpO1xuICAgICAgICB0aGlzLmVkaXRpbmdSb3dLZXlzW2RhdGFLZXlWYWx1ZV0gPSB0cnVlO1xuICAgIH1cblxuICAgIHNhdmVSb3dFZGl0KHJvd0RhdGE6IGFueSwgcm93RWxlbWVudDogSFRNTFRhYmxlUm93RWxlbWVudCkge1xuICAgICAgICBpZiAoRG9tSGFuZGxlci5maW5kKHJvd0VsZW1lbnQsICcubmctaW52YWxpZC5uZy1kaXJ0eScpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgbGV0IGRhdGFLZXlWYWx1ZSA9IFN0cmluZyhPYmplY3RVdGlscy5yZXNvbHZlRmllbGREYXRhKHJvd0RhdGEsIHRoaXMuZGF0YUtleSkpO1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMuZWRpdGluZ1Jvd0tleXNbZGF0YUtleVZhbHVlXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNhbmNlbFJvd0VkaXQocm93RGF0YTogYW55KSB7XG4gICAgICAgIGxldCBkYXRhS2V5VmFsdWUgPSBTdHJpbmcoT2JqZWN0VXRpbHMucmVzb2x2ZUZpZWxkRGF0YShyb3dEYXRhLCB0aGlzLmRhdGFLZXkpKTtcbiAgICAgICAgZGVsZXRlIHRoaXMuZWRpdGluZ1Jvd0tleXNbZGF0YUtleVZhbHVlXTtcbiAgICB9XG5cbiAgICB0b2dnbGVSb3cocm93RGF0YTogYW55LCBldmVudD86IEV2ZW50KSB7XG4gICAgICAgIGlmICghdGhpcy5kYXRhS2V5KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2RhdGFLZXkgbXVzdCBiZSBkZWZpbmVkIHRvIHVzZSByb3cgZXhwYW5zaW9uJyk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgZGF0YUtleVZhbHVlID0gU3RyaW5nKE9iamVjdFV0aWxzLnJlc29sdmVGaWVsZERhdGEocm93RGF0YSwgdGhpcy5kYXRhS2V5KSk7XG5cbiAgICAgICAgaWYgKHRoaXMuZXhwYW5kZWRSb3dLZXlzW2RhdGFLZXlWYWx1ZV0gIT0gbnVsbCkge1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMuZXhwYW5kZWRSb3dLZXlzW2RhdGFLZXlWYWx1ZV07XG4gICAgICAgICAgICB0aGlzLm9uUm93Q29sbGFwc2UuZW1pdCh7XG4gICAgICAgICAgICAgICAgb3JpZ2luYWxFdmVudDogZXZlbnQsXG4gICAgICAgICAgICAgICAgZGF0YTogcm93RGF0YVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAodGhpcy5yb3dFeHBhbmRNb2RlID09PSAnc2luZ2xlJykge1xuICAgICAgICAgICAgICAgIHRoaXMuZXhwYW5kZWRSb3dLZXlzID0ge307XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuZXhwYW5kZWRSb3dLZXlzW2RhdGFLZXlWYWx1ZV0gPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5vblJvd0V4cGFuZC5lbWl0KHtcbiAgICAgICAgICAgICAgICBvcmlnaW5hbEV2ZW50OiBldmVudCxcbiAgICAgICAgICAgICAgICBkYXRhOiByb3dEYXRhXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChldmVudCkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmlzU3RhdGVmdWwoKSkge1xuICAgICAgICAgICAgdGhpcy5zYXZlU3RhdGUoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlzUm93RXhwYW5kZWQocm93RGF0YTogYW55KTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmV4cGFuZGVkUm93S2V5c1tTdHJpbmcoT2JqZWN0VXRpbHMucmVzb2x2ZUZpZWxkRGF0YShyb3dEYXRhLCB0aGlzLmRhdGFLZXkpKV0gPT09IHRydWU7XG4gICAgfVxuXG4gICAgaXNSb3dFZGl0aW5nKHJvd0RhdGE6IGFueSk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5lZGl0aW5nUm93S2V5c1tTdHJpbmcoT2JqZWN0VXRpbHMucmVzb2x2ZUZpZWxkRGF0YShyb3dEYXRhLCB0aGlzLmRhdGFLZXkpKV0gPT09IHRydWU7XG4gICAgfVxuXG4gICAgaXNTaW5nbGVTZWxlY3Rpb25Nb2RlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zZWxlY3Rpb25Nb2RlID09PSAnc2luZ2xlJztcbiAgICB9XG5cbiAgICBpc011bHRpcGxlU2VsZWN0aW9uTW9kZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0aW9uTW9kZSA9PT0gJ211bHRpcGxlJztcbiAgICB9XG5cbiAgICBvbkNvbHVtblJlc2l6ZUJlZ2luKGV2ZW50KSB7XG4gICAgICAgIGxldCBjb250YWluZXJMZWZ0ID0gRG9tSGFuZGxlci5nZXRPZmZzZXQodGhpcy5jb250YWluZXJWaWV3Q2hpbGQubmF0aXZlRWxlbWVudCkubGVmdDtcbiAgICAgICAgdGhpcy5sYXN0UmVzaXplckhlbHBlclggPSAoZXZlbnQucGFnZVggLSBjb250YWluZXJMZWZ0ICsgdGhpcy5jb250YWluZXJWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5zY3JvbGxMZWZ0KTtcbiAgICAgICAgdGhpcy5vbkNvbHVtblJlc2l6ZShldmVudCk7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuXG4gICAgb25Db2x1bW5SZXNpemUoZXZlbnQpIHtcbiAgICAgICAgbGV0IGNvbnRhaW5lckxlZnQgPSBEb21IYW5kbGVyLmdldE9mZnNldCh0aGlzLmNvbnRhaW5lclZpZXdDaGlsZC5uYXRpdmVFbGVtZW50KS5sZWZ0O1xuICAgICAgICBEb21IYW5kbGVyLmFkZENsYXNzKHRoaXMuY29udGFpbmVyVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQsICdwLXVuc2VsZWN0YWJsZS10ZXh0Jyk7XG4gICAgICAgIHRoaXMucmVzaXplSGVscGVyVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gdGhpcy5jb250YWluZXJWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5vZmZzZXRIZWlnaHQgKyAncHgnO1xuICAgICAgICB0aGlzLnJlc2l6ZUhlbHBlclZpZXdDaGlsZC5uYXRpdmVFbGVtZW50LnN0eWxlLnRvcCA9IDAgKyAncHgnO1xuICAgICAgICB0aGlzLnJlc2l6ZUhlbHBlclZpZXdDaGlsZC5uYXRpdmVFbGVtZW50LnN0eWxlLmxlZnQgPSAoZXZlbnQucGFnZVggLSBjb250YWluZXJMZWZ0ICsgdGhpcy5jb250YWluZXJWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5zY3JvbGxMZWZ0KSArICdweCc7XG5cbiAgICAgICAgdGhpcy5yZXNpemVIZWxwZXJWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICB9XG5cbiAgICBvbkNvbHVtblJlc2l6ZUVuZChldmVudCwgY29sdW1uKSB7XG4gICAgICAgIGxldCBkZWx0YSA9IHRoaXMucmVzaXplSGVscGVyVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQub2Zmc2V0TGVmdCAtIHRoaXMubGFzdFJlc2l6ZXJIZWxwZXJYO1xuICAgICAgICBsZXQgY29sdW1uV2lkdGggPSBjb2x1bW4ub2Zmc2V0V2lkdGg7XG4gICAgICAgIGxldCBtaW5XaWR0aCA9IHBhcnNlSW50KGNvbHVtbi5zdHlsZS5taW5XaWR0aCB8fCAxNSk7XG5cbiAgICAgICAgaWYgKGNvbHVtbldpZHRoICsgZGVsdGEgPCBtaW5XaWR0aCkge1xuICAgICAgICAgICAgZGVsdGEgPSBtaW5XaWR0aCAtIGNvbHVtbldpZHRoO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbmV3Q29sdW1uV2lkdGggPSBjb2x1bW5XaWR0aCArIGRlbHRhO1xuXG4gICAgICAgIGlmIChuZXdDb2x1bW5XaWR0aCA+PSBtaW5XaWR0aCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuY29sdW1uUmVzaXplTW9kZSA9PT0gJ2ZpdCcpIHtcbiAgICAgICAgICAgICAgICBsZXQgbmV4dENvbHVtbiA9IGNvbHVtbi5uZXh0RWxlbWVudFNpYmxpbmc7XG4gICAgICAgICAgICAgICAgd2hpbGUgKCFuZXh0Q29sdW1uLm9mZnNldFBhcmVudCkge1xuICAgICAgICAgICAgICAgICAgICBuZXh0Q29sdW1uID0gbmV4dENvbHVtbi5uZXh0RWxlbWVudFNpYmxpbmc7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKG5leHRDb2x1bW4pIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5leHRDb2x1bW5XaWR0aCA9IG5leHRDb2x1bW4ub2Zmc2V0V2lkdGggLSBkZWx0YTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5leHRDb2x1bW5NaW5XaWR0aCA9IG5leHRDb2x1bW4uc3R5bGUubWluV2lkdGggfHwgMTU7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKG5ld0NvbHVtbldpZHRoID4gMTUgJiYgbmV4dENvbHVtbldpZHRoID4gcGFyc2VJbnQobmV4dENvbHVtbk1pbldpZHRoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc2Nyb2xsYWJsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzY3JvbGxhYmxlVmlldyA9IHRoaXMuZmluZFBhcmVudFNjcm9sbGFibGVWaWV3KGNvbHVtbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHNjcm9sbGFibGVCb2R5VGFibGUgPSBEb21IYW5kbGVyLmZpbmRTaW5nbGUoc2Nyb2xsYWJsZVZpZXcsICcucC1kYXRhdGFibGUtc2Nyb2xsYWJsZS1ib2R5IHRhYmxlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHNjcm9sbGFibGVIZWFkZXJUYWJsZSA9IERvbUhhbmRsZXIuZmluZFNpbmdsZShzY3JvbGxhYmxlVmlldywgJ3RhYmxlLnAtZGF0YXRhYmxlLXNjcm9sbGFibGUtaGVhZGVyLXRhYmxlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHNjcm9sbGFibGVGb290ZXJUYWJsZSA9IERvbUhhbmRsZXIuZmluZFNpbmdsZShzY3JvbGxhYmxlVmlldywgJ3RhYmxlLnAtZGF0YXRhYmxlLXNjcm9sbGFibGUtZm9vdGVyLXRhYmxlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlc2l6ZUNvbHVtbkluZGV4ID0gRG9tSGFuZGxlci5pbmRleChjb2x1bW4pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNpemVDb2xHcm91cChzY3JvbGxhYmxlSGVhZGVyVGFibGUsIHJlc2l6ZUNvbHVtbkluZGV4LCBuZXdDb2x1bW5XaWR0aCwgbmV4dENvbHVtbldpZHRoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc2l6ZUNvbEdyb3VwKHNjcm9sbGFibGVCb2R5VGFibGUsIHJlc2l6ZUNvbHVtbkluZGV4LCBuZXdDb2x1bW5XaWR0aCwgbmV4dENvbHVtbldpZHRoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc2l6ZUNvbEdyb3VwKHNjcm9sbGFibGVGb290ZXJUYWJsZSwgcmVzaXplQ29sdW1uSW5kZXgsIG5ld0NvbHVtbldpZHRoLCBuZXh0Q29sdW1uV2lkdGgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1uLnN0eWxlLndpZHRoID0gbmV3Q29sdW1uV2lkdGggKyAncHgnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuZXh0Q29sdW1uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRDb2x1bW4uc3R5bGUud2lkdGggPSBuZXh0Q29sdW1uV2lkdGggKyAncHgnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuY29sdW1uUmVzaXplTW9kZSA9PT0gJ2V4cGFuZCcpIHtcbiAgICAgICAgICAgICAgICBpZiAobmV3Q29sdW1uV2lkdGggPiBtaW5XaWR0aCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5zY3JvbGxhYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFNjcm9sbGFibGVJdGVtc1dpZHRoT25FeHBhbmRSZXNpemUoY29sdW1uLCBuZXdDb2x1bW5XaWR0aCwgZGVsdGEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50YWJsZVZpZXdDaGlsZC5uYXRpdmVFbGVtZW50LnN0eWxlLndpZHRoID0gdGhpcy50YWJsZVZpZXdDaGlsZC5uYXRpdmVFbGVtZW50Lm9mZnNldFdpZHRoICsgZGVsdGEgKyAncHgnO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1uLnN0eWxlLndpZHRoID0gbmV3Q29sdW1uV2lkdGggKyAncHgnO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNvbnRhaW5lcldpZHRoID0gdGhpcy50YWJsZVZpZXdDaGlsZC5uYXRpdmVFbGVtZW50LnN0eWxlLndpZHRoO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250YWluZXJWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5zdHlsZS53aWR0aCA9IGNvbnRhaW5lcldpZHRoICsgJ3B4JztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5vbkNvbFJlc2l6ZS5lbWl0KHtcbiAgICAgICAgICAgICAgICBlbGVtZW50OiBjb2x1bW4sXG4gICAgICAgICAgICAgICAgZGVsdGE6IGRlbHRhXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuaXNTdGF0ZWZ1bCgpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zYXZlU3RhdGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucmVzaXplSGVscGVyVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgRG9tSGFuZGxlci5yZW1vdmVDbGFzcyh0aGlzLmNvbnRhaW5lclZpZXdDaGlsZC5uYXRpdmVFbGVtZW50LCAncC11bnNlbGVjdGFibGUtdGV4dCcpO1xuICAgIH1cblxuICAgIHNldFNjcm9sbGFibGVJdGVtc1dpZHRoT25FeHBhbmRSZXNpemUoY29sdW1uLCBuZXdDb2x1bW5XaWR0aCwgZGVsdGEpIHtcbiAgICAgICAgbGV0IHNjcm9sbGFibGVWaWV3ID0gY29sdW1uID8gdGhpcy5maW5kUGFyZW50U2Nyb2xsYWJsZVZpZXcoY29sdW1uKSA6IHRoaXMuY29udGFpbmVyVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQ7XG4gICAgICAgIGxldCBzY3JvbGxhYmxlQm9keSA9IERvbUhhbmRsZXIuZmluZFNpbmdsZShzY3JvbGxhYmxlVmlldywgJy5wLWRhdGF0YWJsZS1zY3JvbGxhYmxlLWJvZHknKTtcbiAgICAgICAgbGV0IHNjcm9sbGFibGVIZWFkZXIgPSBEb21IYW5kbGVyLmZpbmRTaW5nbGUoc2Nyb2xsYWJsZVZpZXcsICcucC1kYXRhdGFibGUtc2Nyb2xsYWJsZS1oZWFkZXInKTtcbiAgICAgICAgbGV0IHNjcm9sbGFibGVGb290ZXIgPSBEb21IYW5kbGVyLmZpbmRTaW5nbGUoc2Nyb2xsYWJsZVZpZXcsICcucC1kYXRhdGFibGUtc2Nyb2xsYWJsZS1mb290ZXInKTtcbiAgICAgICAgbGV0IHNjcm9sbGFibGVCb2R5VGFibGUgPSBEb21IYW5kbGVyLmZpbmRTaW5nbGUoc2Nyb2xsYWJsZUJvZHksICcucC1kYXRhdGFibGUtc2Nyb2xsYWJsZS1ib2R5IHRhYmxlJyk7XG4gICAgICAgIGxldCBzY3JvbGxhYmxlSGVhZGVyVGFibGUgPSBEb21IYW5kbGVyLmZpbmRTaW5nbGUoc2Nyb2xsYWJsZUhlYWRlciwgJ3RhYmxlLnAtZGF0YXRhYmxlLXNjcm9sbGFibGUtaGVhZGVyLXRhYmxlJyk7XG4gICAgICAgIGxldCBzY3JvbGxhYmxlRm9vdGVyVGFibGUgPSBEb21IYW5kbGVyLmZpbmRTaW5nbGUoc2Nyb2xsYWJsZUZvb3RlciwgJ3RhYmxlLnAtZGF0YXRhYmxlLXNjcm9sbGFibGUtZm9vdGVyLXRhYmxlJyk7XG5cbiAgICAgICAgY29uc3Qgc2Nyb2xsYWJsZUJvZHlUYWJsZVdpZHRoID0gY29sdW1uID8gc2Nyb2xsYWJsZUJvZHlUYWJsZS5vZmZzZXRXaWR0aCArIGRlbHRhIDogbmV3Q29sdW1uV2lkdGg7XG4gICAgICAgIGNvbnN0IHNjcm9sbGFibGVIZWFkZXJUYWJsZVdpZHRoID0gY29sdW1uID8gc2Nyb2xsYWJsZUhlYWRlclRhYmxlLm9mZnNldFdpZHRoICsgZGVsdGEgOiBuZXdDb2x1bW5XaWR0aDtcbiAgICAgICAgY29uc3QgaXNDb250YWluZXJJblZpZXdwb3J0ID0gdGhpcy5jb250YWluZXJWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5vZmZzZXRXaWR0aCA+PSBzY3JvbGxhYmxlQm9keVRhYmxlV2lkdGg7XG5cbiAgICAgICAgbGV0IHNldFdpZHRoID0gKGNvbnRhaW5lciwgdGFibGUsIHdpZHRoLCBpc0NvbnRhaW5lckluVmlld3BvcnQpID0+IHtcbiAgICAgICAgICAgIGlmIChjb250YWluZXIgJiYgdGFibGUpIHtcbiAgICAgICAgICAgICAgICBjb250YWluZXIuc3R5bGUud2lkdGggPSBpc0NvbnRhaW5lckluVmlld3BvcnQgPyB3aWR0aCArIERvbUhhbmRsZXIuY2FsY3VsYXRlU2Nyb2xsYmFyV2lkdGgoc2Nyb2xsYWJsZUJvZHkpICsgJ3B4JyA6ICdhdXRvJ1xuICAgICAgICAgICAgICAgIHRhYmxlLnN0eWxlLndpZHRoID0gd2lkdGggKyAncHgnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHNldFdpZHRoKHNjcm9sbGFibGVCb2R5LCBzY3JvbGxhYmxlQm9keVRhYmxlLCBzY3JvbGxhYmxlQm9keVRhYmxlV2lkdGgsIGlzQ29udGFpbmVySW5WaWV3cG9ydCk7XG4gICAgICAgIHNldFdpZHRoKHNjcm9sbGFibGVIZWFkZXIsIHNjcm9sbGFibGVIZWFkZXJUYWJsZSwgc2Nyb2xsYWJsZUhlYWRlclRhYmxlV2lkdGgsIGlzQ29udGFpbmVySW5WaWV3cG9ydCk7XG4gICAgICAgIHNldFdpZHRoKHNjcm9sbGFibGVGb290ZXIsIHNjcm9sbGFibGVGb290ZXJUYWJsZSwgc2Nyb2xsYWJsZUhlYWRlclRhYmxlV2lkdGgsIGlzQ29udGFpbmVySW5WaWV3cG9ydCk7XG5cbiAgICAgICAgaWYgKGNvbHVtbikge1xuICAgICAgICAgICAgbGV0IHJlc2l6ZUNvbHVtbkluZGV4ID0gRG9tSGFuZGxlci5pbmRleChjb2x1bW4pO1xuXG4gICAgICAgICAgICB0aGlzLnJlc2l6ZUNvbEdyb3VwKHNjcm9sbGFibGVIZWFkZXJUYWJsZSwgcmVzaXplQ29sdW1uSW5kZXgsIG5ld0NvbHVtbldpZHRoLCBudWxsKTtcbiAgICAgICAgICAgIHRoaXMucmVzaXplQ29sR3JvdXAoc2Nyb2xsYWJsZUJvZHlUYWJsZSwgcmVzaXplQ29sdW1uSW5kZXgsIG5ld0NvbHVtbldpZHRoLCBudWxsKTtcbiAgICAgICAgICAgIHRoaXMucmVzaXplQ29sR3JvdXAoc2Nyb2xsYWJsZUZvb3RlclRhYmxlLCByZXNpemVDb2x1bW5JbmRleCwgbmV3Q29sdW1uV2lkdGgsIG51bGwpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZmluZFBhcmVudFNjcm9sbGFibGVWaWV3KGNvbHVtbikge1xuICAgICAgICBpZiAoY29sdW1uKSB7XG4gICAgICAgICAgICBsZXQgcGFyZW50ID0gY29sdW1uLnBhcmVudEVsZW1lbnQ7XG4gICAgICAgICAgICB3aGlsZSAocGFyZW50ICYmICFEb21IYW5kbGVyLmhhc0NsYXNzKHBhcmVudCwgJ3AtZGF0YXRhYmxlLXNjcm9sbGFibGUtdmlldycpKSB7XG4gICAgICAgICAgICAgICAgcGFyZW50ID0gcGFyZW50LnBhcmVudEVsZW1lbnQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBwYXJlbnQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlc2l6ZUNvbEdyb3VwKHRhYmxlLCByZXNpemVDb2x1bW5JbmRleCwgbmV3Q29sdW1uV2lkdGgsIG5leHRDb2x1bW5XaWR0aCkge1xuICAgICAgICBpZiAodGFibGUpIHtcbiAgICAgICAgICAgIGxldCBjb2xHcm91cCA9IHRhYmxlLmNoaWxkcmVuWzBdLm5vZGVOYW1lID09PSAnQ09MR1JPVVAnID8gdGFibGUuY2hpbGRyZW5bMF0gOiBudWxsO1xuXG4gICAgICAgICAgICBpZiAoY29sR3JvdXApIHtcbiAgICAgICAgICAgICAgICBsZXQgY29sID0gY29sR3JvdXAuY2hpbGRyZW5bcmVzaXplQ29sdW1uSW5kZXhdO1xuICAgICAgICAgICAgICAgIGxldCBuZXh0Q29sID0gY29sLm5leHRFbGVtZW50U2libGluZztcbiAgICAgICAgICAgICAgICBjb2wuc3R5bGUud2lkdGggPSBuZXdDb2x1bW5XaWR0aCArICdweCc7XG5cbiAgICAgICAgICAgICAgICBpZiAobmV4dENvbCAmJiBuZXh0Q29sdW1uV2lkdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV4dENvbC5zdHlsZS53aWR0aCA9IG5leHRDb2x1bW5XaWR0aCArICdweCc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgXCJTY3JvbGxhYmxlIHRhYmxlcyByZXF1aXJlIGEgY29sZ3JvdXAgdG8gc3VwcG9ydCByZXNpemFibGUgY29sdW1uc1wiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25Db2x1bW5EcmFnU3RhcnQoZXZlbnQsIGNvbHVtbkVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy5yZW9yZGVySWNvbldpZHRoID0gRG9tSGFuZGxlci5nZXRIaWRkZW5FbGVtZW50T3V0ZXJXaWR0aCh0aGlzLnJlb3JkZXJJbmRpY2F0b3JVcFZpZXdDaGlsZC5uYXRpdmVFbGVtZW50KTtcbiAgICAgICAgdGhpcy5yZW9yZGVySWNvbkhlaWdodCA9IERvbUhhbmRsZXIuZ2V0SGlkZGVuRWxlbWVudE91dGVySGVpZ2h0KHRoaXMucmVvcmRlckluZGljYXRvckRvd25WaWV3Q2hpbGQubmF0aXZlRWxlbWVudCk7XG4gICAgICAgIHRoaXMuZHJhZ2dlZENvbHVtbiA9IGNvbHVtbkVsZW1lbnQ7XG4gICAgICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5zZXREYXRhKCd0ZXh0JywgJ2InKTsgICAgLy8gRm9yIGZpcmVmb3hcbiAgICB9XG5cbiAgICBvbkNvbHVtbkRyYWdFbnRlcihldmVudCwgZHJvcEhlYWRlcikge1xuICAgICAgICBpZiAodGhpcy5yZW9yZGVyYWJsZUNvbHVtbnMgJiYgdGhpcy5kcmFnZ2VkQ29sdW1uICYmIGRyb3BIZWFkZXIpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBsZXQgY29udGFpbmVyT2Zmc2V0ID0gRG9tSGFuZGxlci5nZXRPZmZzZXQodGhpcy5jb250YWluZXJWaWV3Q2hpbGQubmF0aXZlRWxlbWVudCk7XG4gICAgICAgICAgICBsZXQgZHJvcEhlYWRlck9mZnNldCA9IERvbUhhbmRsZXIuZ2V0T2Zmc2V0KGRyb3BIZWFkZXIpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5kcmFnZ2VkQ29sdW1uICE9IGRyb3BIZWFkZXIpIHtcbiAgICAgICAgICAgICAgICBsZXQgZHJhZ0luZGV4ID0gRG9tSGFuZGxlci5pbmRleFdpdGhpbkdyb3VwKHRoaXMuZHJhZ2dlZENvbHVtbiwgJ3ByZW9yZGVyYWJsZWNvbHVtbicpO1xuICAgICAgICAgICAgICAgIGxldCBkcm9wSW5kZXggPSBEb21IYW5kbGVyLmluZGV4V2l0aGluR3JvdXAoZHJvcEhlYWRlciwgJ3ByZW9yZGVyYWJsZWNvbHVtbicpO1xuICAgICAgICAgICAgICAgIGxldCB0YXJnZXRMZWZ0ID0gZHJvcEhlYWRlck9mZnNldC5sZWZ0IC0gY29udGFpbmVyT2Zmc2V0LmxlZnQ7XG4gICAgICAgICAgICAgICAgbGV0IHRhcmdldFRvcCA9IGNvbnRhaW5lck9mZnNldC50b3AgLSBkcm9wSGVhZGVyT2Zmc2V0LnRvcDtcbiAgICAgICAgICAgICAgICBsZXQgY29sdW1uQ2VudGVyID0gZHJvcEhlYWRlck9mZnNldC5sZWZ0ICsgZHJvcEhlYWRlci5vZmZzZXRXaWR0aCAvIDI7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnJlb3JkZXJJbmRpY2F0b3JVcFZpZXdDaGlsZC5uYXRpdmVFbGVtZW50LnN0eWxlLnRvcCA9IGRyb3BIZWFkZXJPZmZzZXQudG9wIC0gY29udGFpbmVyT2Zmc2V0LnRvcCAtICh0aGlzLnJlb3JkZXJJY29uSGVpZ2h0IC0gMSkgKyAncHgnO1xuICAgICAgICAgICAgICAgIHRoaXMucmVvcmRlckluZGljYXRvckRvd25WaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5zdHlsZS50b3AgPSBkcm9wSGVhZGVyT2Zmc2V0LnRvcCAtIGNvbnRhaW5lck9mZnNldC50b3AgKyBkcm9wSGVhZGVyLm9mZnNldEhlaWdodCArICdweCc7XG5cbiAgICAgICAgICAgICAgICBpZiAoZXZlbnQucGFnZVggPiBjb2x1bW5DZW50ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW9yZGVySW5kaWNhdG9yVXBWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5zdHlsZS5sZWZ0ID0gKHRhcmdldExlZnQgKyBkcm9wSGVhZGVyLm9mZnNldFdpZHRoIC0gTWF0aC5jZWlsKHRoaXMucmVvcmRlckljb25XaWR0aCAvIDIpKSArICdweCc7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVvcmRlckluZGljYXRvckRvd25WaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5zdHlsZS5sZWZ0ID0gKHRhcmdldExlZnQgKyBkcm9wSGVhZGVyLm9mZnNldFdpZHRoIC0gTWF0aC5jZWlsKHRoaXMucmVvcmRlckljb25XaWR0aCAvIDIpKSArICdweCc7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZHJvcFBvc2l0aW9uID0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVvcmRlckluZGljYXRvclVwVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQuc3R5bGUubGVmdCA9ICh0YXJnZXRMZWZ0IC0gTWF0aC5jZWlsKHRoaXMucmVvcmRlckljb25XaWR0aCAvIDIpKSArICdweCc7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVvcmRlckluZGljYXRvckRvd25WaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5zdHlsZS5sZWZ0ID0gKHRhcmdldExlZnQgLSBNYXRoLmNlaWwodGhpcy5yZW9yZGVySWNvbldpZHRoIC8gMikpICsgJ3B4JztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kcm9wUG9zaXRpb24gPSAtMTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoKGRyb3BJbmRleCAtIGRyYWdJbmRleCA9PT0gMSAmJiB0aGlzLmRyb3BQb3NpdGlvbiA9PT0gLTEpIHx8IChkcm9wSW5kZXggLSBkcmFnSW5kZXggPT09IC0xICYmIHRoaXMuZHJvcFBvc2l0aW9uID09PSAxKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlb3JkZXJJbmRpY2F0b3JVcFZpZXdDaGlsZC5uYXRpdmVFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVvcmRlckluZGljYXRvckRvd25WaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW9yZGVySW5kaWNhdG9yVXBWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW9yZGVySW5kaWNhdG9yRG93blZpZXdDaGlsZC5uYXRpdmVFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gJ25vbmUnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25Db2x1bW5EcmFnTGVhdmUoZXZlbnQpIHtcbiAgICAgICAgaWYgKHRoaXMucmVvcmRlcmFibGVDb2x1bW5zICYmIHRoaXMuZHJhZ2dlZENvbHVtbikge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMucmVvcmRlckluZGljYXRvclVwVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgIHRoaXMucmVvcmRlckluZGljYXRvckRvd25WaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25Db2x1bW5Ecm9wKGV2ZW50LCBkcm9wQ29sdW1uKSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGlmICh0aGlzLmRyYWdnZWRDb2x1bW4pIHtcbiAgICAgICAgICAgIGxldCBkcmFnSW5kZXggPSBEb21IYW5kbGVyLmluZGV4V2l0aGluR3JvdXAodGhpcy5kcmFnZ2VkQ29sdW1uLCAncHJlb3JkZXJhYmxlY29sdW1uJyk7XG4gICAgICAgICAgICBsZXQgZHJvcEluZGV4ID0gRG9tSGFuZGxlci5pbmRleFdpdGhpbkdyb3VwKGRyb3BDb2x1bW4sICdwcmVvcmRlcmFibGVjb2x1bW4nKTtcbiAgICAgICAgICAgIGxldCBhbGxvd0Ryb3AgPSAoZHJhZ0luZGV4ICE9IGRyb3BJbmRleCk7XG4gICAgICAgICAgICBpZiAoYWxsb3dEcm9wICYmICgoZHJvcEluZGV4IC0gZHJhZ0luZGV4ID09IDEgJiYgdGhpcy5kcm9wUG9zaXRpb24gPT09IC0xKSB8fCAoZHJhZ0luZGV4IC0gZHJvcEluZGV4ID09IDEgJiYgdGhpcy5kcm9wUG9zaXRpb24gPT09IDEpKSkge1xuICAgICAgICAgICAgICAgIGFsbG93RHJvcCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoYWxsb3dEcm9wICYmICgoZHJvcEluZGV4IDwgZHJhZ0luZGV4ICYmIHRoaXMuZHJvcFBvc2l0aW9uID09PSAxKSkpIHtcbiAgICAgICAgICAgICAgICBkcm9wSW5kZXggPSBkcm9wSW5kZXggKyAxO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoYWxsb3dEcm9wICYmICgoZHJvcEluZGV4ID4gZHJhZ0luZGV4ICYmIHRoaXMuZHJvcFBvc2l0aW9uID09PSAtMSkpKSB7XG4gICAgICAgICAgICAgICAgZHJvcEluZGV4ID0gZHJvcEluZGV4IC0gMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGFsbG93RHJvcCkge1xuICAgICAgICAgICAgICAgIE9iamVjdFV0aWxzLnJlb3JkZXJBcnJheSh0aGlzLmNvbHVtbnMsIGRyYWdJbmRleCwgZHJvcEluZGV4KTtcblxuICAgICAgICAgICAgICAgIHRoaXMub25Db2xSZW9yZGVyLmVtaXQoe1xuICAgICAgICAgICAgICAgICAgICBkcmFnSW5kZXg6IGRyYWdJbmRleCxcbiAgICAgICAgICAgICAgICAgICAgZHJvcEluZGV4OiBkcm9wSW5kZXgsXG4gICAgICAgICAgICAgICAgICAgIGNvbHVtbnM6IHRoaXMuY29sdW1uc1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNTdGF0ZWZ1bCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNhdmVTdGF0ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5yZW9yZGVySW5kaWNhdG9yVXBWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgdGhpcy5yZW9yZGVySW5kaWNhdG9yRG93blZpZXdDaGlsZC5uYXRpdmVFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICB0aGlzLmRyYWdnZWRDb2x1bW4uZHJhZ2dhYmxlID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmRyYWdnZWRDb2x1bW4gPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5kcm9wUG9zaXRpb24gPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25Sb3dEcmFnU3RhcnQoZXZlbnQsIGluZGV4KSB7XG4gICAgICAgIHRoaXMucm93RHJhZ2dpbmcgPSB0cnVlO1xuICAgICAgICB0aGlzLmRyYWdnZWRSb3dJbmRleCA9IGluZGV4O1xuICAgICAgICBldmVudC5kYXRhVHJhbnNmZXIuc2V0RGF0YSgndGV4dCcsICdiJyk7ICAgIC8vIEZvciBmaXJlZm94XG4gICAgfVxuXG4gICAgb25Sb3dEcmFnT3ZlcihldmVudCwgaW5kZXgsIHJvd0VsZW1lbnQpIHtcbiAgICAgICAgaWYgKHRoaXMucm93RHJhZ2dpbmcgJiYgdGhpcy5kcmFnZ2VkUm93SW5kZXggIT09IGluZGV4KSB7XG4gICAgICAgICAgICBsZXQgcm93WSA9IERvbUhhbmRsZXIuZ2V0T2Zmc2V0KHJvd0VsZW1lbnQpLnRvcCArIERvbUhhbmRsZXIuZ2V0V2luZG93U2Nyb2xsVG9wKCk7XG4gICAgICAgICAgICBsZXQgcGFnZVkgPSBldmVudC5wYWdlWTtcbiAgICAgICAgICAgIGxldCByb3dNaWRZID0gcm93WSArIERvbUhhbmRsZXIuZ2V0T3V0ZXJIZWlnaHQocm93RWxlbWVudCkgLyAyO1xuICAgICAgICAgICAgbGV0IHByZXZSb3dFbGVtZW50ID0gcm93RWxlbWVudC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xuXG4gICAgICAgICAgICBpZiAocGFnZVkgPCByb3dNaWRZKSB7XG4gICAgICAgICAgICAgICAgRG9tSGFuZGxlci5yZW1vdmVDbGFzcyhyb3dFbGVtZW50LCAncC1kYXRhdGFibGUtZHJhZ3BvaW50LWJvdHRvbScpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5kcm9wcGVkUm93SW5kZXggPSBpbmRleDtcbiAgICAgICAgICAgICAgICBpZiAocHJldlJvd0VsZW1lbnQpXG4gICAgICAgICAgICAgICAgICAgIERvbUhhbmRsZXIuYWRkQ2xhc3MocHJldlJvd0VsZW1lbnQsICdwLWRhdGF0YWJsZS1kcmFncG9pbnQtYm90dG9tJyk7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBEb21IYW5kbGVyLmFkZENsYXNzKHJvd0VsZW1lbnQsICdwLWRhdGF0YWJsZS1kcmFncG9pbnQtdG9wJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAocHJldlJvd0VsZW1lbnQpXG4gICAgICAgICAgICAgICAgICAgIERvbUhhbmRsZXIucmVtb3ZlQ2xhc3MocHJldlJvd0VsZW1lbnQsICdwLWRhdGF0YWJsZS1kcmFncG9pbnQtYm90dG9tJyk7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBEb21IYW5kbGVyLmFkZENsYXNzKHJvd0VsZW1lbnQsICdwLWRhdGF0YWJsZS1kcmFncG9pbnQtdG9wJyk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmRyb3BwZWRSb3dJbmRleCA9IGluZGV4ICsgMTtcbiAgICAgICAgICAgICAgICBEb21IYW5kbGVyLmFkZENsYXNzKHJvd0VsZW1lbnQsICdwLWRhdGF0YWJsZS1kcmFncG9pbnQtYm90dG9tJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvblJvd0RyYWdMZWF2ZShldmVudCwgcm93RWxlbWVudCkge1xuICAgICAgICBsZXQgcHJldlJvd0VsZW1lbnQgPSByb3dFbGVtZW50LnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XG4gICAgICAgIGlmIChwcmV2Um93RWxlbWVudCkge1xuICAgICAgICAgICAgRG9tSGFuZGxlci5yZW1vdmVDbGFzcyhwcmV2Um93RWxlbWVudCwgJ3AtZGF0YXRhYmxlLWRyYWdwb2ludC1ib3R0b20nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIERvbUhhbmRsZXIucmVtb3ZlQ2xhc3Mocm93RWxlbWVudCwgJ3AtZGF0YXRhYmxlLWRyYWdwb2ludC1ib3R0b20nKTtcbiAgICAgICAgRG9tSGFuZGxlci5yZW1vdmVDbGFzcyhyb3dFbGVtZW50LCAncC1kYXRhdGFibGUtZHJhZ3BvaW50LXRvcCcpO1xuICAgIH1cblxuICAgIG9uUm93RHJhZ0VuZChldmVudCkge1xuICAgICAgICB0aGlzLnJvd0RyYWdnaW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZHJhZ2dlZFJvd0luZGV4ID0gbnVsbDtcbiAgICAgICAgdGhpcy5kcm9wcGVkUm93SW5kZXggPSBudWxsO1xuICAgIH1cblxuICAgIG9uUm93RHJvcChldmVudCwgcm93RWxlbWVudCkge1xuICAgICAgICBpZiAodGhpcy5kcm9wcGVkUm93SW5kZXggIT0gbnVsbCkge1xuICAgICAgICAgICAgbGV0IGRyb3BJbmRleCA9ICh0aGlzLmRyYWdnZWRSb3dJbmRleCA+IHRoaXMuZHJvcHBlZFJvd0luZGV4KSA/IHRoaXMuZHJvcHBlZFJvd0luZGV4IDogKHRoaXMuZHJvcHBlZFJvd0luZGV4ID09PSAwKSA/IDAgOiB0aGlzLmRyb3BwZWRSb3dJbmRleCAtIDE7XG4gICAgICAgICAgICBPYmplY3RVdGlscy5yZW9yZGVyQXJyYXkodGhpcy52YWx1ZSwgdGhpcy5kcmFnZ2VkUm93SW5kZXgsIGRyb3BJbmRleCk7XG5cbiAgICAgICAgICAgIHRoaXMub25Sb3dSZW9yZGVyLmVtaXQoe1xuICAgICAgICAgICAgICAgIGRyYWdJbmRleDogdGhpcy5kcmFnZ2VkUm93SW5kZXgsXG4gICAgICAgICAgICAgICAgZHJvcEluZGV4OiBkcm9wSW5kZXhcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIC8vY2xlYW51cFxuICAgICAgICB0aGlzLm9uUm93RHJhZ0xlYXZlKGV2ZW50LCByb3dFbGVtZW50KTtcbiAgICAgICAgdGhpcy5vblJvd0RyYWdFbmQoZXZlbnQpO1xuICAgIH1cblxuICAgIGlzRW1wdHkoKSB7XG4gICAgICAgIGxldCBkYXRhID0gdGhpcy5maWx0ZXJlZFZhbHVlfHx0aGlzLnZhbHVlO1xuICAgICAgICByZXR1cm4gZGF0YSA9PSBudWxsIHx8IGRhdGEubGVuZ3RoID09IDA7XG4gICAgfVxuXG4gICAgZ2V0QmxvY2thYmxlRWxlbWVudCgpOiBIVE1MRWxlbWVudMKge1xuICAgICAgICByZXR1cm4gdGhpcy5lbC5uYXRpdmVFbGVtZW50LmNoaWxkcmVuWzBdO1xuICAgIH1cblxuICAgIGdldFN0b3JhZ2UoKSB7XG4gICAgICAgIHN3aXRjaCh0aGlzLnN0YXRlU3RvcmFnZSkge1xuICAgICAgICAgICAgY2FzZSAnbG9jYWwnOlxuICAgICAgICAgICAgICAgIHJldHVybiB3aW5kb3cubG9jYWxTdG9yYWdlO1xuXG4gICAgICAgICAgICBjYXNlICdzZXNzaW9uJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gd2luZG93LnNlc3Npb25TdG9yYWdlO1xuXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcih0aGlzLnN0YXRlU3RvcmFnZSArICcgaXMgbm90IGEgdmFsaWQgdmFsdWUgZm9yIHRoZSBzdGF0ZSBzdG9yYWdlLCBzdXBwb3J0ZWQgdmFsdWVzIGFyZSBcImxvY2FsXCIgYW5kIFwic2Vzc2lvblwiLicpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaXNTdGF0ZWZ1bCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGVLZXkgIT0gbnVsbDtcbiAgICB9XG5cbiAgICBzYXZlU3RhdGUoKSB7XG4gICAgICAgIGNvbnN0IHN0b3JhZ2UgPSB0aGlzLmdldFN0b3JhZ2UoKTtcbiAgICAgICAgbGV0IHN0YXRlOiBUYWJsZVN0YXRlID0ge307XG5cbiAgICAgICAgaWYgKHRoaXMucGFnaW5hdG9yKSB7XG4gICAgICAgICAgICBzdGF0ZS5maXJzdCA9IHRoaXMuZmlyc3Q7XG4gICAgICAgICAgICBzdGF0ZS5yb3dzID0gdGhpcy5yb3dzO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuc29ydEZpZWxkKSB7XG4gICAgICAgICAgICBzdGF0ZS5zb3J0RmllbGQgPSB0aGlzLnNvcnRGaWVsZDtcbiAgICAgICAgICAgIHN0YXRlLnNvcnRPcmRlciA9IHRoaXMuc29ydE9yZGVyO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMubXVsdGlTb3J0TWV0YSkge1xuICAgICAgICAgICAgc3RhdGUubXVsdGlTb3J0TWV0YSA9IHRoaXMubXVsdGlTb3J0TWV0YTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmhhc0ZpbHRlcigpKSB7XG4gICAgICAgICAgICBzdGF0ZS5maWx0ZXJzID0gdGhpcy5maWx0ZXJzO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMucmVzaXphYmxlQ29sdW1ucykge1xuICAgICAgICAgICAgdGhpcy5zYXZlQ29sdW1uV2lkdGhzKHN0YXRlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnJlb3JkZXJhYmxlQ29sdW1ucykge1xuICAgICAgICAgICAgdGhpcy5zYXZlQ29sdW1uT3JkZXIoc3RhdGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0aW9uKSB7XG4gICAgICAgICAgICBzdGF0ZS5zZWxlY3Rpb24gPSB0aGlzLnNlbGVjdGlvbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChPYmplY3Qua2V5cyh0aGlzLmV4cGFuZGVkUm93S2V5cykubGVuZ3RoKSB7XG4gICAgICAgICAgICBzdGF0ZS5leHBhbmRlZFJvd0tleXMgPSB0aGlzLmV4cGFuZGVkUm93S2V5cztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChPYmplY3Qua2V5cyhzdGF0ZSkubGVuZ3RoKSB7XG4gICAgICAgICAgICBzdG9yYWdlLnNldEl0ZW0odGhpcy5zdGF0ZUtleSwgSlNPTi5zdHJpbmdpZnkoc3RhdGUpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMub25TdGF0ZVNhdmUuZW1pdChzdGF0ZSk7XG4gICAgfVxuXG4gICAgY2xlYXJTdGF0ZSgpIHtcbiAgICAgICAgY29uc3Qgc3RvcmFnZSA9IHRoaXMuZ2V0U3RvcmFnZSgpO1xuXG4gICAgICAgIGlmICh0aGlzLnN0YXRlS2V5KSB7XG4gICAgICAgICAgICBzdG9yYWdlLnJlbW92ZUl0ZW0odGhpcy5zdGF0ZUtleSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXN0b3JlU3RhdGUoKSB7XG4gICAgICAgIGNvbnN0IHN0b3JhZ2UgPSB0aGlzLmdldFN0b3JhZ2UoKTtcbiAgICAgICAgY29uc3Qgc3RhdGVTdHJpbmcgPSBzdG9yYWdlLmdldEl0ZW0odGhpcy5zdGF0ZUtleSk7XG5cbiAgICAgICAgaWYgKHN0YXRlU3RyaW5nKSB7XG4gICAgICAgICAgICBsZXQgc3RhdGU6IFRhYmxlU3RhdGUgPSBKU09OLnBhcnNlKHN0YXRlU3RyaW5nKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMucGFnaW5hdG9yKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5maXJzdCA9IHN0YXRlLmZpcnN0O1xuICAgICAgICAgICAgICAgIHRoaXMucm93cyA9IHN0YXRlLnJvd3M7XG4gICAgICAgICAgICAgICAgdGhpcy5maXJzdENoYW5nZS5lbWl0KHRoaXMuZmlyc3QpO1xuICAgICAgICAgICAgICAgIHRoaXMucm93c0NoYW5nZS5lbWl0KHRoaXMucm93cyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzdGF0ZS5zb3J0RmllbGQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlc3RvcmluZ1NvcnQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuX3NvcnRGaWVsZCA9IHN0YXRlLnNvcnRGaWVsZDtcbiAgICAgICAgICAgICAgICB0aGlzLl9zb3J0T3JkZXIgPSBzdGF0ZS5zb3J0T3JkZXI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzdGF0ZS5tdWx0aVNvcnRNZXRhKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXN0b3JpbmdTb3J0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLl9tdWx0aVNvcnRNZXRhID0gc3RhdGUubXVsdGlTb3J0TWV0YTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHN0YXRlLmZpbHRlcnMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlc3RvcmluZ0ZpbHRlciA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5maWx0ZXJzID0gc3RhdGUuZmlsdGVycztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMucmVzaXphYmxlQ29sdW1ucykge1xuICAgICAgICAgICAgICAgIHRoaXMuY29sdW1uV2lkdGhzU3RhdGUgPSBzdGF0ZS5jb2x1bW5XaWR0aHM7XG4gICAgICAgICAgICAgICAgdGhpcy50YWJsZVdpZHRoU3RhdGUgPSBzdGF0ZS50YWJsZVdpZHRoO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoc3RhdGUuZXhwYW5kZWRSb3dLZXlzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5leHBhbmRlZFJvd0tleXMgPSBzdGF0ZS5leHBhbmRlZFJvd0tleXM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzdGF0ZS5zZWxlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICBQcm9taXNlLnJlc29sdmUobnVsbCkudGhlbigoKSA9PiB0aGlzLnNlbGVjdGlvbkNoYW5nZS5lbWl0KHN0YXRlLnNlbGVjdGlvbikpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnN0YXRlUmVzdG9yZWQgPSB0cnVlO1xuXG4gICAgICAgICAgICB0aGlzLm9uU3RhdGVSZXN0b3JlLmVtaXQoc3RhdGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2F2ZUNvbHVtbldpZHRocyhzdGF0ZSkge1xuICAgICAgICBsZXQgd2lkdGhzID0gW107XG4gICAgICAgIGxldCBoZWFkZXJzID0gRG9tSGFuZGxlci5maW5kKHRoaXMuY29udGFpbmVyVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQsICcucC1kYXRhdGFibGUtdGhlYWQgPiB0cjpmaXJzdC1jaGlsZCA+IHRoJyk7XG4gICAgICAgIGhlYWRlcnMubWFwKGhlYWRlciA9PiB3aWR0aHMucHVzaChEb21IYW5kbGVyLmdldE91dGVyV2lkdGgoaGVhZGVyKSkpO1xuICAgICAgICBzdGF0ZS5jb2x1bW5XaWR0aHMgPSB3aWR0aHMuam9pbignLCcpO1xuXG4gICAgICAgIGlmICh0aGlzLmNvbHVtblJlc2l6ZU1vZGUgPT09ICdleHBhbmQnKSB7XG4gICAgICAgICAgICBzdGF0ZS50YWJsZVdpZHRoID0gdGhpcy5zY3JvbGxhYmxlID8gRG9tSGFuZGxlci5maW5kU2luZ2xlKHRoaXMuY29udGFpbmVyVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQsICcucC1kYXRhdGFibGUtc2Nyb2xsYWJsZS1oZWFkZXItdGFibGUnKS5zdHlsZS53aWR0aCA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBEb21IYW5kbGVyLmdldE91dGVyV2lkdGgodGhpcy50YWJsZVZpZXdDaGlsZC5uYXRpdmVFbGVtZW50KSArICdweCc7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXN0b3JlQ29sdW1uV2lkdGhzKCkge1xuICAgICAgICBpZiAodGhpcy5jb2x1bW5XaWR0aHNTdGF0ZSkge1xuICAgICAgICAgICAgbGV0IHdpZHRocyA9IHRoaXMuY29sdW1uV2lkdGhzU3RhdGUuc3BsaXQoJywnKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuY29sdW1uUmVzaXplTW9kZSA9PT0gJ2V4cGFuZCcgJiYgdGhpcy50YWJsZVdpZHRoU3RhdGUpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zY3JvbGxhYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U2Nyb2xsYWJsZUl0ZW1zV2lkdGhPbkV4cGFuZFJlc2l6ZShudWxsLCB0aGlzLnRhYmxlV2lkdGhTdGF0ZSwgMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRhYmxlVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQuc3R5bGUud2lkdGggPSB0aGlzLnRhYmxlV2lkdGhTdGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250YWluZXJWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5zdHlsZS53aWR0aCA9IHRoaXMudGFibGVXaWR0aFN0YXRlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuc2Nyb2xsYWJsZSkge1xuICAgICAgICAgICAgICAgIGxldCBoZWFkZXJDb2xzID0gRG9tSGFuZGxlci5maW5kKHRoaXMuY29udGFpbmVyVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQsICcucC1kYXRhdGFibGUtc2Nyb2xsYWJsZS1oZWFkZXItdGFibGUgPiBjb2xncm91cCA+IGNvbCcpO1xuICAgICAgICAgICAgICAgIGxldCBib2R5Q29scyA9IERvbUhhbmRsZXIuZmluZCh0aGlzLmNvbnRhaW5lclZpZXdDaGlsZC5uYXRpdmVFbGVtZW50LCAnLnAtZGF0YXRhYmxlLXNjcm9sbGFibGUtYm9keSB0YWJsZSA+IGNvbGdyb3VwID4gY29sJyk7XG5cbiAgICAgICAgICAgICAgICBoZWFkZXJDb2xzLm1hcCgoY29sLCBpbmRleCkgPT4gY29sLnN0eWxlLndpZHRoID0gd2lkdGhzW2luZGV4XSArICdweCcpO1xuICAgICAgICAgICAgICAgIGJvZHlDb2xzLm1hcCgoY29sLCBpbmRleCkgPT4gY29sLnN0eWxlLndpZHRoID0gd2lkdGhzW2luZGV4XSArICdweCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgbGV0IGhlYWRlcnMgPSBEb21IYW5kbGVyLmZpbmQodGhpcy50YWJsZVZpZXdDaGlsZC5uYXRpdmVFbGVtZW50LCAnLnAtZGF0YXRhYmxlLXRoZWFkID4gdHI6Zmlyc3QtY2hpbGQgPiB0aCcpO1xuICAgICAgICAgICAgICAgIGhlYWRlcnMubWFwKChoZWFkZXIsIGluZGV4KSA9PiBoZWFkZXIuc3R5bGUud2lkdGggPSB3aWR0aHNbaW5kZXhdICsgJ3B4Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzYXZlQ29sdW1uT3JkZXIoc3RhdGUpIHtcbiAgICAgICAgaWYgKHRoaXMuY29sdW1ucykge1xuICAgICAgICAgICAgbGV0IGNvbHVtbk9yZGVyOiBzdHJpbmdbXSA9IFtdO1xuICAgICAgICAgICAgdGhpcy5jb2x1bW5zLm1hcChjb2x1bW4gPT4ge1xuICAgICAgICAgICAgICAgIGNvbHVtbk9yZGVyLnB1c2goY29sdW1uLmZpZWxkfHxjb2x1bW4ua2V5KVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHN0YXRlLmNvbHVtbk9yZGVyID0gY29sdW1uT3JkZXI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXN0b3JlQ29sdW1uT3JkZXIoKSB7XG4gICAgICAgIGNvbnN0IHN0b3JhZ2UgPSB0aGlzLmdldFN0b3JhZ2UoKTtcbiAgICAgICAgY29uc3Qgc3RhdGVTdHJpbmcgPSBzdG9yYWdlLmdldEl0ZW0odGhpcy5zdGF0ZUtleSk7XG4gICAgICAgIGlmIChzdGF0ZVN0cmluZykge1xuICAgICAgICAgICAgbGV0IHN0YXRlOiBUYWJsZVN0YXRlID0gSlNPTi5wYXJzZShzdGF0ZVN0cmluZyk7XG4gICAgICAgICAgICBsZXQgY29sdW1uT3JkZXIgPSBzdGF0ZS5jb2x1bW5PcmRlcjtcbiAgICAgICAgICAgIGlmIChjb2x1bW5PcmRlcikge1xuICAgICAgICAgICAgICAgIGxldCByZW9yZGVyZWRDb2x1bW5zID0gW107XG4gICAgICAgICAgICAgICAgY29sdW1uT3JkZXIubWFwKGtleSA9PiByZW9yZGVyZWRDb2x1bW5zLnB1c2godGhpcy5maW5kQ29sdW1uQnlLZXkoa2V5KSkpO1xuICAgICAgICAgICAgICAgIHRoaXMuY29sdW1uT3JkZXJTdGF0ZVJlc3RvcmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbHVtbnMgPSByZW9yZGVyZWRDb2x1bW5zO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZmluZENvbHVtbkJ5S2V5KGtleSkge1xuICAgICAgICBpZiAodGhpcy5jb2x1bW5zKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBjb2wgb2YgdGhpcy5jb2x1bW5zKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNvbC5rZXkgPT09IGtleSB8fCBjb2wuZmllbGQgPT09IGtleSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbDtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy51bmJpbmREb2N1bWVudEVkaXRMaXN0ZW5lcigpO1xuICAgICAgICB0aGlzLmVkaXRpbmdDZWxsID0gbnVsbDtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplZCA9IG51bGw7XG4gICAgfVxufVxuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ1twVGFibGVCb2R5XScsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cIiFkdC5leHBhbmRlZFJvd1RlbXBsYXRlICYmICFkdC52aXJ0dWFsU2Nyb2xsXCI+XG4gICAgICAgICAgICA8bmctdGVtcGxhdGUgbmdGb3IgbGV0LXJvd0RhdGEgbGV0LXJvd0luZGV4PVwiaW5kZXhcIiBbbmdGb3JPZl09XCIoZHQucGFnaW5hdG9yICYmICFkdC5sYXp5KSA/ICgoZHQuZmlsdGVyZWRWYWx1ZXx8ZHQudmFsdWUpIHwgc2xpY2U6ZHQuZmlyc3Q6KGR0LmZpcnN0ICsgZHQucm93cykpIDogKGR0LmZpbHRlcmVkVmFsdWV8fGR0LnZhbHVlKVwiIFtuZ0ZvclRyYWNrQnldPVwiZHQucm93VHJhY2tCeVwiPlxuICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJ0ZW1wbGF0ZTsgY29udGV4dDogeyRpbXBsaWNpdDogcm93RGF0YSwgcm93SW5kZXg6IGR0LnBhZ2luYXRvciA/IChkdC5maXJzdCArIHJvd0luZGV4KSA6IHJvd0luZGV4LCBjb2x1bW5zOiBjb2x1bW5zLCBlZGl0aW5nOiAoZHQuZWRpdE1vZGUgPT09ICdyb3cnICYmIGR0LmlzUm93RWRpdGluZyhyb3dEYXRhKSl9XCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cIiFkdC5leHBhbmRlZFJvd1RlbXBsYXRlICYmIGR0LnZpcnR1YWxTY3JvbGxcIj5cbiAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSBjZGtWaXJ0dWFsRm9yIGxldC1yb3dEYXRhIGxldC1yb3dJbmRleD1cImluZGV4XCIgW2Nka1ZpcnR1YWxGb3JPZl09XCJkdC52YWx1ZVwiIFtjZGtWaXJ0dWFsRm9yVHJhY2tCeV09XCJkdC5yb3dUcmFja0J5XCI+XG4gICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cInJvd0RhdGEgPyB0ZW1wbGF0ZTogZHQubG9hZGluZ0JvZHlUZW1wbGF0ZTsgY29udGV4dDogeyRpbXBsaWNpdDogcm93RGF0YSwgcm93SW5kZXg6IGR0LnBhZ2luYXRvciA/IChkdC5maXJzdCArIHJvd0luZGV4KSA6IHJvd0luZGV4LCBjb2x1bW5zOiBjb2x1bW5zLCBlZGl0aW5nOiAoZHQuZWRpdE1vZGUgPT09ICdyb3cnICYmIGR0LmlzUm93RWRpdGluZyhyb3dEYXRhKSl9XCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cImR0LmV4cGFuZGVkUm93VGVtcGxhdGVcIj5cbiAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSBuZ0ZvciBsZXQtcm93RGF0YSBsZXQtcm93SW5kZXg9XCJpbmRleFwiIFtuZ0Zvck9mXT1cIihkdC5wYWdpbmF0b3IgJiYgIWR0LmxhenkpID8gKChkdC5maWx0ZXJlZFZhbHVlfHxkdC52YWx1ZSkgfCBzbGljZTpkdC5maXJzdDooZHQuZmlyc3QgKyBkdC5yb3dzKSkgOiAoZHQuZmlsdGVyZWRWYWx1ZXx8ZHQudmFsdWUpXCIgW25nRm9yVHJhY2tCeV09XCJkdC5yb3dUcmFja0J5XCI+XG4gICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cInRlbXBsYXRlOyBjb250ZXh0OiB7JGltcGxpY2l0OiByb3dEYXRhLCByb3dJbmRleDogZHQucGFnaW5hdG9yID8gKGR0LmZpcnN0ICsgcm93SW5kZXgpIDogcm93SW5kZXgsIGNvbHVtbnM6IGNvbHVtbnMsIGV4cGFuZGVkOiBkdC5pc1Jvd0V4cGFuZGVkKHJvd0RhdGEpLCBlZGl0aW5nOiAoZHQuZWRpdE1vZGUgPT09ICdyb3cnICYmIGR0LmlzUm93RWRpdGluZyhyb3dEYXRhKSl9XCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cImR0LmlzUm93RXhwYW5kZWQocm93RGF0YSlcIj5cbiAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImR0LmV4cGFuZGVkUm93VGVtcGxhdGU7IGNvbnRleHQ6IHskaW1wbGljaXQ6IHJvd0RhdGEsIHJvd0luZGV4OiBkdC5wYWdpbmF0b3IgPyAoZHQuZmlyc3QgKyByb3dJbmRleCkgOiByb3dJbmRleCwgY29sdW1uczogY29sdW1uc31cIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiZHQubG9hZGluZ1wiPlxuICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImR0LmxvYWRpbmdCb2R5VGVtcGxhdGU7IGNvbnRleHQ6IHskaW1wbGljaXQ6IGNvbHVtbnMsIGZyb3plbjogZnJvemVufVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cImR0LmlzRW1wdHkoKSAmJiAhZHQubG9hZGluZ1wiPlxuICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImR0LmVtcHR5TWVzc2FnZVRlbXBsYXRlOyBjb250ZXh0OiB7JGltcGxpY2l0OiBjb2x1bW5zLCBmcm96ZW46IGZyb3plbn1cIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgYCxcbiAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LkRlZmF1bHQsXG4gICAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZVxufSlcbmV4cG9ydCBjbGFzcyBUYWJsZUJvZHkge1xuXG4gICAgQElucHV0KFwicFRhYmxlQm9keVwiKSBjb2x1bW5zOiBhbnlbXTtcblxuICAgIEBJbnB1dChcInBUYWJsZUJvZHlUZW1wbGF0ZVwiKSB0ZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIEBJbnB1dCgpIGZyb3plbjogYm9vbGVhbjtcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBkdDogVGFibGUpIHt9XG59XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnW3BTY3JvbGxhYmxlVmlld10nLFxuICAgIHRlbXBsYXRlOiBgXG4gICAgICAgIDxkaXYgI3Njcm9sbEhlYWRlciBjbGFzcz1cInAtZGF0YXRhYmxlLXNjcm9sbGFibGUtaGVhZGVyXCI+XG4gICAgICAgICAgICA8ZGl2ICNzY3JvbGxIZWFkZXJCb3ggY2xhc3M9XCJwLWRhdGF0YWJsZS1zY3JvbGxhYmxlLWhlYWRlci1ib3hcIj5cbiAgICAgICAgICAgICAgICA8dGFibGUgY2xhc3M9XCJwLWRhdGF0YWJsZS1zY3JvbGxhYmxlLWhlYWRlci10YWJsZVwiIFtuZ0NsYXNzXT1cImR0LnRhYmxlU3R5bGVDbGFzc1wiIFtuZ1N0eWxlXT1cImR0LnRhYmxlU3R5bGVcIj5cbiAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImZyb3plbiA/IGR0LmZyb3plbkNvbEdyb3VwVGVtcGxhdGV8fGR0LmNvbEdyb3VwVGVtcGxhdGUgOiBkdC5jb2xHcm91cFRlbXBsYXRlOyBjb250ZXh0IHskaW1wbGljaXQ6IGNvbHVtbnN9XCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgICAgIDx0aGVhZCBjbGFzcz1cInAtZGF0YXRhYmxlLXRoZWFkXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiZnJvemVuID8gZHQuZnJvemVuSGVhZGVyVGVtcGxhdGV8fGR0LmhlYWRlclRlbXBsYXRlIDogZHQuaGVhZGVyVGVtcGxhdGU7IGNvbnRleHQgeyRpbXBsaWNpdDogY29sdW1uc31cIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICAgICAgPC90aGVhZD5cbiAgICAgICAgICAgICAgICAgICAgPHRib2R5IGNsYXNzPVwicC1kYXRhdGFibGUtdGJvZHlcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSBuZ0ZvciBsZXQtcm93RGF0YSBsZXQtcm93SW5kZXg9XCJpbmRleFwiIFtuZ0Zvck9mXT1cImR0LmZyb3plblZhbHVlXCIgW25nRm9yVHJhY2tCeV09XCJkdC5yb3dUcmFja0J5XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImR0LmZyb3plblJvd3NUZW1wbGF0ZTsgY29udGV4dDogeyRpbXBsaWNpdDogcm93RGF0YSwgcm93SW5kZXg6IHJvd0luZGV4LCBjb2x1bW5zOiBjb2x1bW5zfVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICAgICAgICAgICAgPC90Ym9keT5cbiAgICAgICAgICAgICAgICA8L3RhYmxlPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiIWR0LnZpcnR1YWxTY3JvbGw7IGVsc2UgdmlydHVhbFNjcm9sbFRlbXBsYXRlXCI+XG4gICAgICAgICAgICA8ZGl2ICNzY3JvbGxCb2R5IGNsYXNzPVwicC1kYXRhdGFibGUtc2Nyb2xsYWJsZS1ib2R5XCIgW25nU3R5bGVdPVwieydtYXgtaGVpZ2h0JzogZHQuc2Nyb2xsSGVpZ2h0ICE9PSAnZmxleCcgPyBzY3JvbGxIZWlnaHQgOiB1bmRlZmluZWR9XCI+XG4gICAgICAgICAgICAgICAgPHRhYmxlICNzY3JvbGxUYWJsZSBbY2xhc3NdPVwiZHQudGFibGVTdHlsZUNsYXNzXCIgW25nU3R5bGVdPVwiZHQudGFibGVTdHlsZVwiPlxuICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiZnJvemVuID8gZHQuZnJvemVuQ29sR3JvdXBUZW1wbGF0ZXx8ZHQuY29sR3JvdXBUZW1wbGF0ZSA6IGR0LmNvbEdyb3VwVGVtcGxhdGU7IGNvbnRleHQgeyRpbXBsaWNpdDogY29sdW1uc31cIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICAgICAgPHRib2R5IGNsYXNzPVwicC1kYXRhdGFibGUtdGJvZHlcIiBbcFRhYmxlQm9keV09XCJjb2x1bW5zXCIgW3BUYWJsZUJvZHlUZW1wbGF0ZV09XCJmcm96ZW4gPyBkdC5mcm96ZW5Cb2R5VGVtcGxhdGV8fGR0LmJvZHlUZW1wbGF0ZSA6IGR0LmJvZHlUZW1wbGF0ZVwiIFtmcm96ZW5dPVwiZnJvemVuXCI+PC90Ym9keT5cbiAgICAgICAgICAgICAgICA8L3RhYmxlPlxuICAgICAgICAgICAgICAgIDxkaXYgI3Njcm9sbGFibGVBbGlnbmVyIHN0eWxlPVwiYmFja2dyb3VuZC1jb2xvcjp0cmFuc3BhcmVudFwiICpuZ0lmPVwiZnJvemVuXCI+PC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgIDxuZy10ZW1wbGF0ZSAjdmlydHVhbFNjcm9sbFRlbXBsYXRlPlxuICAgICAgICAgICAgPGNkay12aXJ0dWFsLXNjcm9sbC12aWV3cG9ydCBbaXRlbVNpemVdPVwiZHQudmlydHVhbFJvd0hlaWdodFwiIFtzdHlsZS5oZWlnaHRdPVwiZHQuc2Nyb2xsSGVpZ2h0ICE9PSAnZmxleCcgPyBzY3JvbGxIZWlnaHQgOiB1bmRlZmluZWRcIiBcbiAgICAgICAgICAgICAgICAgICAgW21pbkJ1ZmZlclB4XT1cImR0Lm1pbkJ1ZmZlclB4XCIgW21heEJ1ZmZlclB4XT1cImR0Lm1heEJ1ZmZlclB4XCIgKHNjcm9sbGVkSW5kZXhDaGFuZ2UpPVwib25TY3JvbGxJbmRleENoYW5nZSgkZXZlbnQpXCIgY2xhc3M9XCJwLWRhdGF0YWJsZS12aXJ0dWFsLXNjcm9sbGFibGUtYm9keVwiPlxuICAgICAgICAgICAgICAgIDx0YWJsZSAjc2Nyb2xsVGFibGUgW2NsYXNzXT1cImR0LnRhYmxlU3R5bGVDbGFzc1wiIFtuZ1N0eWxlXT1cImR0LnRhYmxlU3R5bGVcIj5cbiAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImZyb3plbiA/IGR0LmZyb3plbkNvbEdyb3VwVGVtcGxhdGV8fGR0LmNvbEdyb3VwVGVtcGxhdGUgOiBkdC5jb2xHcm91cFRlbXBsYXRlOyBjb250ZXh0IHskaW1wbGljaXQ6IGNvbHVtbnN9XCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgICAgIDx0Ym9keSBjbGFzcz1cInAtZGF0YXRhYmxlLXRib2R5XCIgW3BUYWJsZUJvZHldPVwiY29sdW1uc1wiIFtwVGFibGVCb2R5VGVtcGxhdGVdPVwiZnJvemVuID8gZHQuZnJvemVuQm9keVRlbXBsYXRlfHxkdC5ib2R5VGVtcGxhdGUgOiBkdC5ib2R5VGVtcGxhdGVcIiBbZnJvemVuXT1cImZyb3plblwiPjwvdGJvZHk+XG4gICAgICAgICAgICAgICAgPC90YWJsZT5cbiAgICAgICAgICAgICAgICA8ZGl2ICNzY3JvbGxhYmxlQWxpZ25lciBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6dHJhbnNwYXJlbnRcIiAqbmdJZj1cImZyb3plblwiPjwvZGl2PlxuICAgICAgICAgICAgPC9jZGstdmlydHVhbC1zY3JvbGwtdmlld3BvcnQ+XG4gICAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICAgIDxkaXYgI3Njcm9sbEZvb3RlciBjbGFzcz1cInAtZGF0YXRhYmxlLXNjcm9sbGFibGUtZm9vdGVyXCI+XG4gICAgICAgICAgICA8ZGl2ICNzY3JvbGxGb290ZXJCb3ggY2xhc3M9XCJwLWRhdGF0YWJsZS1zY3JvbGxhYmxlLWZvb3Rlci1ib3hcIj5cbiAgICAgICAgICAgICAgICA8dGFibGUgY2xhc3M9XCJwLWRhdGF0YWJsZS1zY3JvbGxhYmxlLWZvb3Rlci10YWJsZVwiIFtuZ0NsYXNzXT1cImR0LnRhYmxlU3R5bGVDbGFzc1wiIFtuZ1N0eWxlXT1cImR0LnRhYmxlU3R5bGVcIj5cbiAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImZyb3plbiA/IGR0LmZyb3plbkNvbEdyb3VwVGVtcGxhdGV8fGR0LmNvbEdyb3VwVGVtcGxhdGUgOiBkdC5jb2xHcm91cFRlbXBsYXRlOyBjb250ZXh0IHskaW1wbGljaXQ6IGNvbHVtbnN9XCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgICAgIDx0Zm9vdCBjbGFzcz1cInAtZGF0YXRhYmxlLXRmb290XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiZnJvemVuID8gZHQuZnJvemVuRm9vdGVyVGVtcGxhdGV8fGR0LmZvb3RlclRlbXBsYXRlIDogZHQuZm9vdGVyVGVtcGxhdGU7IGNvbnRleHQgeyRpbXBsaWNpdDogY29sdW1uc31cIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICAgICAgPC90Zm9vdD5cbiAgICAgICAgICAgICAgICA8L3RhYmxlPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIGAsXG4gICAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5EZWZhdWx0LFxuICAgIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmVcbn0pXG5leHBvcnQgY2xhc3MgU2Nyb2xsYWJsZVZpZXcgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LE9uRGVzdHJveSxBZnRlclZpZXdDaGVja2VkIHtcblxuICAgIEBJbnB1dChcInBTY3JvbGxhYmxlVmlld1wiKSBjb2x1bW5zOiBhbnlbXTtcblxuICAgIEBJbnB1dCgpIGZyb3plbjogYm9vbGVhbjtcblxuICAgIEBWaWV3Q2hpbGQoJ3Njcm9sbEhlYWRlcicpIHNjcm9sbEhlYWRlclZpZXdDaGlsZDogRWxlbWVudFJlZjtcblxuICAgIEBWaWV3Q2hpbGQoJ3Njcm9sbEhlYWRlckJveCcpIHNjcm9sbEhlYWRlckJveFZpZXdDaGlsZDogRWxlbWVudFJlZjtcblxuICAgIEBWaWV3Q2hpbGQoJ3Njcm9sbEJvZHknKSBzY3JvbGxCb2R5Vmlld0NoaWxkOiBFbGVtZW50UmVmO1xuXG4gICAgQFZpZXdDaGlsZCgnc2Nyb2xsVGFibGUnKSBzY3JvbGxUYWJsZVZpZXdDaGlsZDogRWxlbWVudFJlZjtcblxuICAgIEBWaWV3Q2hpbGQoJ3Njcm9sbEZvb3RlcicpIHNjcm9sbEZvb3RlclZpZXdDaGlsZDogRWxlbWVudFJlZjtcblxuICAgIEBWaWV3Q2hpbGQoJ3Njcm9sbEZvb3RlckJveCcpIHNjcm9sbEZvb3RlckJveFZpZXdDaGlsZDogRWxlbWVudFJlZjtcblxuICAgIEBWaWV3Q2hpbGQoJ3Njcm9sbGFibGVBbGlnbmVyJykgc2Nyb2xsYWJsZUFsaWduZXJWaWV3Q2hpbGQ6IEVsZW1lbnRSZWY7XG5cbiAgICBAVmlld0NoaWxkKENka1ZpcnR1YWxTY3JvbGxWaWV3cG9ydCkgdmlydHVhbFNjcm9sbEJvZHk6IENka1ZpcnR1YWxTY3JvbGxWaWV3cG9ydDtcblxuICAgIGhlYWRlclNjcm9sbExpc3RlbmVyOiBhbnk7XG5cbiAgICBib2R5U2Nyb2xsTGlzdGVuZXI6IGFueTtcblxuICAgIGZvb3RlclNjcm9sbExpc3RlbmVyOiBhbnk7XG5cbiAgICBmcm96ZW5TaWJsaW5nQm9keTogSFRNTERpdkVsZW1lbnQ7XG5cbiAgICBzdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICAgIGluaXRpYWxpemVkOiBib29sZWFuO1xuXG4gICAgcHJldmVudEJvZHlTY3JvbGxQcm9wYWdhdGlvbjogYm9vbGVhbjtcblxuICAgIGxvYWRlZFBhZ2VzOiBudW1iZXJbXSA9IFtdO1xuXG4gICAgX3Njcm9sbEhlaWdodDogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgZ2V0IHNjcm9sbEhlaWdodCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2Nyb2xsSGVpZ2h0O1xuICAgIH1cbiAgICBzZXQgc2Nyb2xsSGVpZ2h0KHZhbDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuX3Njcm9sbEhlaWdodCA9IHZhbDtcbiAgICAgICAgaWYgKHZhbCAhPSBudWxsICYmICh2YWwuaW5jbHVkZXMoJyUnKSB8fCB2YWwuaW5jbHVkZXMoJ2NhbGMnKSkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdQZXJjZW50YWdlIHNjcm9sbCBoZWlnaHQgY2FsY3VsYXRpb24gaXMgcmVtb3ZlZCBpbiBmYXZvciBvZiB0aGUgbW9yZSBwZXJmb3JtYW50IENTUyBiYXNlZCBmbGV4IG1vZGUsIHVzZSBzY3JvbGxIZWlnaHQ9XCJmbGV4XCIgaW5zdGVhZC4nKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IocHVibGljIGR0OiBUYWJsZSwgcHVibGljIGVsOiBFbGVtZW50UmVmLCBwdWJsaWMgem9uZTogTmdab25lKSB7XG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9uID0gdGhpcy5kdC50YWJsZVNlcnZpY2UudmFsdWVTb3VyY2UkLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFsaWduU2Nyb2xsQmFyKCk7XG4gICAgICAgICAgICAgICAgfSwgNTApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgICAgfVxuXG4gICAgbmdBZnRlclZpZXdDaGVja2VkKCkge1xuICAgICAgICBpZiAoIXRoaXMuaW5pdGlhbGl6ZWQgJiYgdGhpcy5lbC5uYXRpdmVFbGVtZW50Lm9mZnNldFBhcmVudCkge1xuICAgICAgICAgICAgdGhpcy5hbGlnblNjcm9sbEJhcigpO1xuICAgICAgICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgICAgIGlmICghdGhpcy5mcm96ZW4pIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmR0LmZyb3plbkNvbHVtbnMgfHwgdGhpcy5kdC5mcm96ZW5Cb2R5VGVtcGxhdGUpIHtcbiAgICAgICAgICAgICAgICBEb21IYW5kbGVyLmFkZENsYXNzKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgJ3AtZGF0YXRhYmxlLXVuZnJvemVuLXZpZXcnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGZyb3plblZpZXcgPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQucHJldmlvdXNFbGVtZW50U2libGluZztcbiAgICAgICAgICAgIGlmIChmcm96ZW5WaWV3KSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZHQudmlydHVhbFNjcm9sbClcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mcm96ZW5TaWJsaW5nQm9keSA9IERvbUhhbmRsZXIuZmluZFNpbmdsZShmcm96ZW5WaWV3LCAnLnAtZGF0YXRhYmUtdmlydHVhbC1zY3JvbGxhYmxlLWJvZHknKTtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZnJvemVuU2libGluZ0JvZHkgPSBEb21IYW5kbGVyLmZpbmRTaW5nbGUoZnJvemVuVmlldywgJy5wLWRhdGF0YWJsZS1zY3JvbGxhYmxlLWJvZHknKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnNjcm9sbGFibGVBbGlnbmVyVmlld0NoaWxkICYmIHRoaXMuc2Nyb2xsYWJsZUFsaWduZXJWaWV3Q2hpbGQubmF0aXZlRWxlbWVudCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2Nyb2xsYWJsZUFsaWduZXJWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5zdHlsZS5oZWlnaHQgPSBEb21IYW5kbGVyLmNhbGN1bGF0ZVNjcm9sbGJhckhlaWdodCgpICsgJ3B4JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYmluZEV2ZW50cygpO1xuICAgICAgICB0aGlzLmFsaWduU2Nyb2xsQmFyKCk7XG4gICAgfVxuXG4gICAgYmluZEV2ZW50cygpIHtcbiAgICAgICAgdGhpcy56b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLnNjcm9sbEhlYWRlclZpZXdDaGlsZCAmJiB0aGlzLnNjcm9sbEhlYWRlclZpZXdDaGlsZC5uYXRpdmVFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oZWFkZXJTY3JvbGxMaXN0ZW5lciA9IHRoaXMub25IZWFkZXJTY3JvbGwuYmluZCh0aGlzKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNjcm9sbEhlYWRlclZpZXdDaGlsZC5uYXRpdmVFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHRoaXMuaGVhZGVyU2Nyb2xsTGlzdGVuZXIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5zY3JvbGxGb290ZXJWaWV3Q2hpbGQgJiYgdGhpcy5zY3JvbGxGb290ZXJWaWV3Q2hpbGQubmF0aXZlRWxlbWVudCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZm9vdGVyU2Nyb2xsTGlzdGVuZXIgPSB0aGlzLm9uRm9vdGVyU2Nyb2xsLmJpbmQodGhpcyk7XG4gICAgICAgICAgICAgICAgdGhpcy5zY3JvbGxGb290ZXJWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCB0aGlzLmZvb3RlclNjcm9sbExpc3RlbmVyKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCF0aGlzLmZyb3plbikge1xuICAgICAgICAgICAgICAgIHRoaXMuYm9keVNjcm9sbExpc3RlbmVyID0gdGhpcy5vbkJvZHlTY3JvbGwuYmluZCh0aGlzKTtcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmR0LnZpcnR1YWxTY3JvbGwpXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmlydHVhbFNjcm9sbEJvZHkuZ2V0RWxlbWVudFJlZigpLm5hdGl2ZUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdGhpcy5ib2R5U2Nyb2xsTGlzdGVuZXIpO1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zY3JvbGxCb2R5Vmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdGhpcy5ib2R5U2Nyb2xsTGlzdGVuZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICB1bmJpbmRFdmVudHMoKSB7XG4gICAgICAgIGlmICh0aGlzLnNjcm9sbEhlYWRlclZpZXdDaGlsZCAmJiB0aGlzLnNjcm9sbEhlYWRlclZpZXdDaGlsZC5uYXRpdmVFbGVtZW50KSB7XG4gICAgICAgICAgICB0aGlzLnNjcm9sbEhlYWRlclZpZXdDaGlsZC5uYXRpdmVFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHRoaXMuaGVhZGVyU2Nyb2xsTGlzdGVuZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuc2Nyb2xsRm9vdGVyVmlld0NoaWxkICYmIHRoaXMuc2Nyb2xsRm9vdGVyVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsRm9vdGVyVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdGhpcy5mb290ZXJTY3JvbGxMaXN0ZW5lcik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5zY3JvbGxCb2R5Vmlld0NoaWxkICYmIHRoaXMuc2Nyb2xsQm9keVZpZXdDaGlsZC5uYXRpdmVFbGVtZW50KSB7XG4gICAgICAgICAgICB0aGlzLnNjcm9sbEJvZHlWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdzY3JvbGwnLCB0aGlzLmJvZHlTY3JvbGxMaXN0ZW5lcik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy52aXJ0dWFsU2Nyb2xsQm9keSAmJiB0aGlzLnZpcnR1YWxTY3JvbGxCb2R5LmdldEVsZW1lbnRSZWYoKSkge1xuICAgICAgICAgICAgdGhpcy52aXJ0dWFsU2Nyb2xsQm9keS5nZXRFbGVtZW50UmVmKCkubmF0aXZlRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdzY3JvbGwnLCB0aGlzLmJvZHlTY3JvbGxMaXN0ZW5lcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbkhlYWRlclNjcm9sbCgpIHtcbiAgICAgICAgY29uc3Qgc2Nyb2xsTGVmdCA9IHRoaXMuc2Nyb2xsSGVhZGVyVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsTGVmdDtcblxuICAgICAgICB0aGlzLnNjcm9sbEJvZHlWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5zY3JvbGxMZWZ0ID0gc2Nyb2xsTGVmdDtcblxuICAgICAgICBpZiAodGhpcy5zY3JvbGxGb290ZXJWaWV3Q2hpbGQgJiYgdGhpcy5zY3JvbGxGb290ZXJWaWV3Q2hpbGQubmF0aXZlRWxlbWVudCkge1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxGb290ZXJWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5zY3JvbGxMZWZ0ID0gc2Nyb2xsTGVmdDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucHJldmVudEJvZHlTY3JvbGxQcm9wYWdhdGlvbiA9IHRydWU7XG4gICAgfVxuXG4gICAgb25Gb290ZXJTY3JvbGwoKSB7XG4gICAgICAgIGNvbnN0IHNjcm9sbExlZnQgPSB0aGlzLnNjcm9sbEZvb3RlclZpZXdDaGlsZC5uYXRpdmVFbGVtZW50LnNjcm9sbExlZnQ7XG4gICAgICAgIHRoaXMuc2Nyb2xsQm9keVZpZXdDaGlsZC5uYXRpdmVFbGVtZW50LnNjcm9sbExlZnQgPSBzY3JvbGxMZWZ0O1xuXG4gICAgICAgIGlmICh0aGlzLnNjcm9sbEhlYWRlclZpZXdDaGlsZCAmJiB0aGlzLnNjcm9sbEhlYWRlclZpZXdDaGlsZC5uYXRpdmVFbGVtZW50KSB7XG4gICAgICAgICAgICB0aGlzLnNjcm9sbEhlYWRlclZpZXdDaGlsZC5uYXRpdmVFbGVtZW50LnNjcm9sbExlZnQgPSBzY3JvbGxMZWZ0O1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5wcmV2ZW50Qm9keVNjcm9sbFByb3BhZ2F0aW9uID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBvbkJvZHlTY3JvbGwoZXZlbnQpIHtcbiAgICAgICAgaWYgKHRoaXMucHJldmVudEJvZHlTY3JvbGxQcm9wYWdhdGlvbikge1xuICAgICAgICAgICAgdGhpcy5wcmV2ZW50Qm9keVNjcm9sbFByb3BhZ2F0aW9uID0gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5zY3JvbGxIZWFkZXJWaWV3Q2hpbGQgJiYgdGhpcy5zY3JvbGxIZWFkZXJWaWV3Q2hpbGQubmF0aXZlRWxlbWVudCkge1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxIZWFkZXJCb3hWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5zdHlsZS5tYXJnaW5MZWZ0ID0gLTEgKiBldmVudC50YXJnZXQuc2Nyb2xsTGVmdCArICdweCc7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5zY3JvbGxGb290ZXJWaWV3Q2hpbGQgJiYgdGhpcy5zY3JvbGxGb290ZXJWaWV3Q2hpbGQubmF0aXZlRWxlbWVudCkge1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxGb290ZXJCb3hWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5zdHlsZS5tYXJnaW5MZWZ0ID0gLTEgKiBldmVudC50YXJnZXQuc2Nyb2xsTGVmdCArICdweCc7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5mcm96ZW5TaWJsaW5nQm9keSkge1xuICAgICAgICAgICAgdGhpcy5mcm96ZW5TaWJsaW5nQm9keS5zY3JvbGxUb3AgPSBldmVudC50YXJnZXQuc2Nyb2xsVG9wO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25TY3JvbGxJbmRleENoYW5nZShpbmRleDogbnVtYmVyKSB7XG4gICAgICAgIGlmICh0aGlzLmR0LmxhenkpIHtcbiAgICAgICAgICAgIGxldCBwYWdlUmFuZ2UgPSB0aGlzLmNyZWF0ZVBhZ2VSYW5nZShNYXRoLmZsb29yKGluZGV4IC8gdGhpcy5kdC5yb3dzKSk7XG4gICAgICAgICAgICBwYWdlUmFuZ2UuZm9yRWFjaChwYWdlID0+IHRoaXMubG9hZFBhZ2UocGFnZSkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY3JlYXRlUGFnZVJhbmdlKHBhZ2U6IG51bWJlcikge1xuICAgICAgICBsZXQgcmFuZ2U6IG51bWJlcltdID0gW107XG5cbiAgICAgICAgaWYgKHBhZ2UgIT09IDApIHtcbiAgICAgICAgICAgIHJhbmdlLnB1c2gocGFnZSAtIDEpO1xuICAgICAgICB9XG4gICAgICAgIHJhbmdlLnB1c2gocGFnZSk7XG4gICAgICAgIGlmIChwYWdlICE9PSAodGhpcy5nZXRQYWdlQ291bnQoKSAtIDEpKSB7XG4gICAgICAgICAgICByYW5nZS5wdXNoKHBhZ2UgKyAxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByYW5nZTtcbiAgICB9XG5cbiAgICBsb2FkUGFnZShwYWdlOiBudW1iZXIpIHtcbiAgICAgICAgaWYgKCF0aGlzLmxvYWRlZFBhZ2VzLmluY2x1ZGVzKHBhZ2UpKSB7XG4gICAgICAgICAgICB0aGlzLmR0Lm9uTGF6eUxvYWQuZW1pdCh7XG4gICAgICAgICAgICAgICAgZmlyc3Q6IHRoaXMuZHQucm93cyAqIHBhZ2UsIFxuICAgICAgICAgICAgICAgIHJvd3M6IHRoaXMuZHQucm93cyxcbiAgICAgICAgICAgICAgICBzb3J0RmllbGQ6IHRoaXMuZHQuc29ydEZpZWxkLFxuICAgICAgICAgICAgICAgIHNvcnRPcmRlcjogdGhpcy5kdC5zb3J0T3JkZXIsXG4gICAgICAgICAgICAgICAgZmlsdGVyczogdGhpcy5kdC5maWx0ZXJzLFxuICAgICAgICAgICAgICAgIGdsb2JhbEZpbHRlcjogdGhpcy5kdC5maWx0ZXJzICYmIHRoaXMuZHQuZmlsdGVyc1snZ2xvYmFsJ10gPyB0aGlzLmR0LmZpbHRlcnNbJ2dsb2JhbCddLnZhbHVlIDogbnVsbCxcbiAgICAgICAgICAgICAgICBtdWx0aVNvcnRNZXRhOiB0aGlzLmR0Lm11bHRpU29ydE1ldGFcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5sb2FkZWRQYWdlcy5wdXNoKHBhZ2UpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2xlYXJDYWNoZSgpIHtcbiAgICAgICAgdGhpcy5sb2FkZWRQYWdlcyA9IFtdO1xuICAgIH1cblxuICAgIGdldFBhZ2VDb3VudCgpIHtcbiAgICAgICAgbGV0IGRhdGFUb1JlbmRlciA9IHRoaXMuZHQuZmlsdGVyZWRWYWx1ZSB8fCB0aGlzLmR0LnZhbHVlO1xuICAgICAgICBsZXQgZGF0YUxlbmd0aCA9IGRhdGFUb1JlbmRlciA/IGRhdGFUb1JlbmRlci5sZW5ndGg6IDA7XG4gICAgICAgIHJldHVybiBNYXRoLmNlaWwoZGF0YUxlbmd0aCAvIHRoaXMuZHQucm93cyk7XG4gICAgfVxuXG4gICAgc2Nyb2xsVG9WaXJ0dWFsSW5kZXgoaW5kZXg6IG51bWJlcik6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy52aXJ0dWFsU2Nyb2xsQm9keSkge1xuICAgICAgICAgICAgdGhpcy52aXJ0dWFsU2Nyb2xsQm9keS5zY3JvbGxUb0luZGV4KGluZGV4KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNjcm9sbFRvKG9wdGlvbnMpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMudmlydHVhbFNjcm9sbEJvZHkpIHtcbiAgICAgICAgICAgIHRoaXMudmlydHVhbFNjcm9sbEJvZHkuc2Nyb2xsVG8ob3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAodGhpcy5zY3JvbGxCb2R5Vmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsVG8pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNjcm9sbEJvZHlWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5zY3JvbGxUbyhvcHRpb25zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuc2Nyb2xsQm9keVZpZXdDaGlsZC5uYXRpdmVFbGVtZW50LnNjcm9sbExlZnQgPSBvcHRpb25zLmxlZnQ7XG4gICAgICAgICAgICAgICAgdGhpcy5zY3JvbGxCb2R5Vmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsVG9wID0gb3B0aW9ucy50b3A7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBoYXNWZXJ0aWNhbE92ZXJmbG93KCkge1xuICAgICAgICBpZiAodGhpcy5kdC52aXJ0dWFsU2Nyb2xsKVxuICAgICAgICAgICAgcmV0dXJuICh0aGlzLnZpcnR1YWxTY3JvbGxCb2R5LmdldERhdGFMZW5ndGgoKSAqIHRoaXMuZHQudmlydHVhbFJvd0hlaWdodCkgPiB0aGlzLnZpcnR1YWxTY3JvbGxCb2R5LmdldFZpZXdwb3J0U2l6ZSgpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXR1cm4gRG9tSGFuZGxlci5nZXRPdXRlckhlaWdodCh0aGlzLnNjcm9sbFRhYmxlVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQpID4gRG9tSGFuZGxlci5nZXRPdXRlckhlaWdodCh0aGlzLnNjcm9sbEJvZHlWaWV3Q2hpbGQubmF0aXZlRWxlbWVudCk7XG4gICAgfVxuXG4gICAgYWxpZ25TY3JvbGxCYXIoKSB7XG4gICAgICAgIGlmICghdGhpcy5mcm96ZW4pIHtcbiAgICAgICAgICAgIGxldCBzY3JvbGxCYXJXaWR0aCA9IHRoaXMuaGFzVmVydGljYWxPdmVyZmxvdygpID8gRG9tSGFuZGxlci5jYWxjdWxhdGVTY3JvbGxiYXJXaWR0aCgpIDogMDtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsSGVhZGVyQm94Vmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQuc3R5bGUucGFkZGluZ1JpZ2h0ID0gc2Nyb2xsQmFyV2lkdGggKyAncHgnO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5zY3JvbGxGb290ZXJCb3hWaWV3Q2hpbGQgJiYgdGhpcy5zY3JvbGxGb290ZXJCb3hWaWV3Q2hpbGQubmF0aXZlRWxlbWVudCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2Nyb2xsRm9vdGVyQm94Vmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQuc3R5bGUucGFkZGluZ1JpZ2h0ID0gc2Nyb2xsQmFyV2lkdGggKyAncHgnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy51bmJpbmRFdmVudHMoKTtcblxuICAgICAgICB0aGlzLmZyb3plblNpYmxpbmdCb2R5ID0gbnVsbDtcblxuICAgICAgICBpZiAodGhpcy5zdWJzY3JpcHRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmluaXRpYWxpemVkID0gZmFsc2U7XG4gICAgfVxufVxuXG5ARGlyZWN0aXZlKHtcbiAgICBzZWxlY3RvcjogJ1twU29ydGFibGVDb2x1bW5dJyxcbiAgICBob3N0OiB7XG4gICAgICAgICdbY2xhc3MucC1zb3J0YWJsZS1jb2x1bW5dJzogJ2lzRW5hYmxlZCgpJyxcbiAgICAgICAgJ1tjbGFzcy5wLWhpZ2hsaWdodF0nOiAnc29ydGVkJyxcbiAgICAgICAgJ1thdHRyLnRhYmluZGV4XSc6ICdpc0VuYWJsZWQoKSA/IFwiMFwiIDogbnVsbCcsXG4gICAgICAgICdbYXR0ci5yb2xlXSc6ICdcImNvbHVtbmhlYWRlclwiJyxcbiAgICAgICAgJ1thdHRyLmFyaWEtc29ydF0nOiAnc29ydE9yZGVyJ1xuICAgIH1cbn0pXG5leHBvcnQgY2xhc3MgU29ydGFibGVDb2x1bW4gaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG5cbiAgICBASW5wdXQoXCJwU29ydGFibGVDb2x1bW5cIikgZmllbGQ6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIHBTb3J0YWJsZUNvbHVtbkRpc2FibGVkOiBib29sZWFuO1xuXG4gICAgc29ydGVkOiBib29sZWFuO1xuXG4gICAgc29ydE9yZGVyOiBzdHJpbmc7XG5cbiAgICBzdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBkdDogVGFibGUpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNFbmFibGVkKCkpIHtcbiAgICAgICAgICAgIHRoaXMuc3Vic2NyaXB0aW9uID0gdGhpcy5kdC50YWJsZVNlcnZpY2Uuc29ydFNvdXJjZSQuc3Vic2NyaWJlKHNvcnRNZXRhID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVNvcnRTdGF0ZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNFbmFibGVkKCkpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlU29ydFN0YXRlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1cGRhdGVTb3J0U3RhdGUoKSB7XG4gICAgICAgIHRoaXMuc29ydGVkID0gdGhpcy5kdC5pc1NvcnRlZCh0aGlzLmZpZWxkKTtcbiAgICAgICAgdGhpcy5zb3J0T3JkZXIgPSB0aGlzLnNvcnRlZCA/ICh0aGlzLmR0LnNvcnRPcmRlciA9PT0gMSA/ICdhc2NlbmRpbmcnIDogJ2Rlc2NlbmRpbmcnKSA6ICdub25lJztcbiAgICB9XG5cbiAgICBASG9zdExpc3RlbmVyKCdjbGljaycsIFsnJGV2ZW50J10pXG4gICAgb25DbGljayhldmVudDogTW91c2VFdmVudCkge1xuICAgICAgICBpZiAodGhpcy5pc0VuYWJsZWQoKSkge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVTb3J0U3RhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuZHQuc29ydCh7XG4gICAgICAgICAgICAgICAgb3JpZ2luYWxFdmVudDogZXZlbnQsXG4gICAgICAgICAgICAgICAgZmllbGQ6IHRoaXMuZmllbGRcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBEb21IYW5kbGVyLmNsZWFyU2VsZWN0aW9uKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBASG9zdExpc3RlbmVyKCdrZXlkb3duLmVudGVyJywgWyckZXZlbnQnXSlcbiAgICBvbkVudGVyS2V5KGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgICAgIHRoaXMub25DbGljayhldmVudCk7XG4gICAgfVxuXG4gICAgaXNFbmFibGVkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wU29ydGFibGVDb2x1bW5EaXNhYmxlZCAhPT0gdHJ1ZTtcbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHtcbiAgICAgICAgaWYgKHRoaXMuc3Vic2NyaXB0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG59XG5cblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdwLXNvcnRJY29uJyxcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgICA8aSBjbGFzcz1cInAtc29ydGFibGUtY29sdW1uLWljb24gcGkgcGktZndcIiBbbmdDbGFzc109XCJ7J3BpLXNvcnQtYW1vdW50LXVwLWFsdCc6IHNvcnRPcmRlciA9PT0gMSwgJ3BpLXNvcnQtYW1vdW50LWRvd24nOiBzb3J0T3JkZXIgPT09IC0xLCAncGktc29ydC1hbHQnOiBzb3J0T3JkZXIgPT09IDB9XCI+PC9pPlxuICAgIGAsXG4gICAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gICAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZVxufSlcbmV4cG9ydCBjbGFzcyBTb3J0SWNvbiBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcblxuICAgIEBJbnB1dCgpIGZpZWxkOiBzdHJpbmc7XG5cbiAgICBzdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICAgIHNvcnRPcmRlcjogbnVtYmVyO1xuXG4gICAgY29uc3RydWN0b3IocHVibGljIGR0OiBUYWJsZSwgcHVibGljIGNkOiBDaGFuZ2VEZXRlY3RvclJlZikge1xuICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbiA9IHRoaXMuZHQudGFibGVTZXJ2aWNlLnNvcnRTb3VyY2UkLnN1YnNjcmliZShzb3J0TWV0YSA9PiB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVNvcnRTdGF0ZSgpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgdGhpcy51cGRhdGVTb3J0U3RhdGUoKTtcbiAgICB9XG5cbiAgICBvbkNsaWNrKGV2ZW50KXtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG5cbiAgICB1cGRhdGVTb3J0U3RhdGUoKSB7XG4gICAgICAgIGlmICh0aGlzLmR0LnNvcnRNb2RlID09PSAnc2luZ2xlJykge1xuICAgICAgICAgICAgdGhpcy5zb3J0T3JkZXIgPSB0aGlzLmR0LmlzU29ydGVkKHRoaXMuZmllbGQpID8gdGhpcy5kdC5zb3J0T3JkZXIgOiAwO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMuZHQuc29ydE1vZGUgPT09ICdtdWx0aXBsZScpIHtcbiAgICAgICAgICAgIGxldCBzb3J0TWV0YSA9IHRoaXMuZHQuZ2V0U29ydE1ldGEodGhpcy5maWVsZCk7XG4gICAgICAgICAgICB0aGlzLnNvcnRPcmRlciA9IHNvcnRNZXRhID8gc29ydE1ldGEub3JkZXI6IDA7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCkge1xuICAgICAgICBpZiAodGhpcy5zdWJzY3JpcHRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbkBEaXJlY3RpdmUoe1xuICAgIHNlbGVjdG9yOiAnW3BTZWxlY3RhYmxlUm93XScsXG4gICAgaG9zdDoge1xuICAgICAgICAnW2NsYXNzLnAtc2VsZWN0YWJsZS1yb3ddJzogJ2lzRW5hYmxlZCgpJyxcbiAgICAgICAgJ1tjbGFzcy5wLWhpZ2hsaWdodF0nOiAnc2VsZWN0ZWQnLFxuICAgICAgICAnW2F0dHIudGFiaW5kZXhdJzogJ2lzRW5hYmxlZCgpID8gMCA6IHVuZGVmaW5lZCdcbiAgICB9XG59KVxuZXhwb3J0IGNsYXNzIFNlbGVjdGFibGVSb3cgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG5cbiAgICBASW5wdXQoXCJwU2VsZWN0YWJsZVJvd1wiKSBkYXRhOiBhbnk7XG5cbiAgICBASW5wdXQoXCJwU2VsZWN0YWJsZVJvd0luZGV4XCIpIGluZGV4OiBudW1iZXI7XG5cbiAgICBASW5wdXQoKSBwU2VsZWN0YWJsZVJvd0Rpc2FibGVkOiBib29sZWFuO1xuXG4gICAgc2VsZWN0ZWQ6IGJvb2xlYW47XG5cbiAgICBzdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBkdDogVGFibGUsIHB1YmxpYyB0YWJsZVNlcnZpY2U6IFRhYmxlU2VydmljZSkge1xuICAgICAgICBpZiAodGhpcy5pc0VuYWJsZWQoKSkge1xuICAgICAgICAgICAgdGhpcy5zdWJzY3JpcHRpb24gPSB0aGlzLmR0LnRhYmxlU2VydmljZS5zZWxlY3Rpb25Tb3VyY2UkLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZCA9IHRoaXMuZHQuaXNTZWxlY3RlZCh0aGlzLmRhdGEpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNFbmFibGVkKCkpIHtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWQgPSB0aGlzLmR0LmlzU2VsZWN0ZWQodGhpcy5kYXRhKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIEBIb3N0TGlzdGVuZXIoJ2NsaWNrJywgWyckZXZlbnQnXSlcbiAgICBvbkNsaWNrKGV2ZW50OiBFdmVudCkge1xuICAgICAgICBpZiAodGhpcy5pc0VuYWJsZWQoKSkge1xuICAgICAgICAgICAgdGhpcy5kdC5oYW5kbGVSb3dDbGljayh7XG4gICAgICAgICAgICAgICAgb3JpZ2luYWxFdmVudDogZXZlbnQsXG4gICAgICAgICAgICAgICAgcm93RGF0YTogdGhpcy5kYXRhLFxuICAgICAgICAgICAgICAgIHJvd0luZGV4OiB0aGlzLmluZGV4XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIEBIb3N0TGlzdGVuZXIoJ3RvdWNoZW5kJywgWyckZXZlbnQnXSlcbiAgICBvblRvdWNoRW5kKGV2ZW50OiBFdmVudCkge1xuICAgICAgICBpZiAodGhpcy5pc0VuYWJsZWQoKSkge1xuICAgICAgICAgICAgdGhpcy5kdC5oYW5kbGVSb3dUb3VjaEVuZChldmVudCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBASG9zdExpc3RlbmVyKCdrZXlkb3duLmFycm93ZG93bicsIFsnJGV2ZW50J10pXG4gICAgb25BcnJvd0Rvd25LZXlEb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgICAgIGlmICghdGhpcy5pc0VuYWJsZWQoKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgcm93ID0gPEhUTUxUYWJsZVJvd0VsZW1lbnQ+ZXZlbnQuY3VycmVudFRhcmdldDtcbiAgICAgICAgY29uc3QgbmV4dFJvdyA9IHRoaXMuZmluZE5leHRTZWxlY3RhYmxlUm93KHJvdyk7XG5cbiAgICAgICAgaWYgKG5leHRSb3cpIHtcbiAgICAgICAgICAgIG5leHRSb3cuZm9jdXMoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuXG4gICAgQEhvc3RMaXN0ZW5lcigna2V5ZG93bi5hcnJvd3VwJywgWyckZXZlbnQnXSlcbiAgICBvbkFycm93VXBLZXlEb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgICAgIGlmICghdGhpcy5pc0VuYWJsZWQoKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgcm93ID0gPEhUTUxUYWJsZVJvd0VsZW1lbnQ+ZXZlbnQuY3VycmVudFRhcmdldDtcbiAgICAgICAgY29uc3QgcHJldlJvdyA9IHRoaXMuZmluZFByZXZTZWxlY3RhYmxlUm93KHJvdyk7XG5cbiAgICAgICAgaWYgKHByZXZSb3cpIHtcbiAgICAgICAgICAgIHByZXZSb3cuZm9jdXMoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuXG4gICAgQEhvc3RMaXN0ZW5lcigna2V5ZG93bi5lbnRlcicsIFsnJGV2ZW50J10pXG4gICAgb25FbnRlcktleURvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzRW5hYmxlZCgpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmR0LmhhbmRsZVJvd0NsaWNrKHtcbiAgICAgICAgICAgIG9yaWdpbmFsRXZlbnQ6IGV2ZW50LFxuICAgICAgICAgICAgcm93RGF0YTogdGhpcy5kYXRhLFxuICAgICAgICAgICAgcm93SW5kZXg6IHRoaXMuaW5kZXhcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZmluZE5leHRTZWxlY3RhYmxlUm93KHJvdzogSFRNTFRhYmxlUm93RWxlbWVudCk6IEhUTUxUYWJsZVJvd0VsZW1lbnQge1xuICAgICAgICBsZXQgbmV4dFJvdyA9IDxIVE1MVGFibGVSb3dFbGVtZW50PiByb3cubmV4dEVsZW1lbnRTaWJsaW5nO1xuICAgICAgICBpZiAobmV4dFJvdykge1xuICAgICAgICAgICAgaWYgKERvbUhhbmRsZXIuaGFzQ2xhc3MobmV4dFJvdywgJ3AtZGF0YXRhYmxlLXNlbGVjdGFibGUtcm93JykpXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5leHRSb3c7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmluZE5leHRTZWxlY3RhYmxlUm93KG5leHRSb3cpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmaW5kUHJldlNlbGVjdGFibGVSb3cocm93OiBIVE1MVGFibGVSb3dFbGVtZW50KTogSFRNTFRhYmxlUm93RWxlbWVudCB7XG4gICAgICAgIGxldCBwcmV2Um93ID0gPEhUTUxUYWJsZVJvd0VsZW1lbnQ+IHJvdy5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xuICAgICAgICBpZiAocHJldlJvdykge1xuICAgICAgICAgICAgaWYgKERvbUhhbmRsZXIuaGFzQ2xhc3MocHJldlJvdywgJ3AtZGF0YXRhYmxlLXNlbGVjdGFibGUtcm93JykpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByZXZSb3c7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmluZFByZXZTZWxlY3RhYmxlUm93KHByZXZSb3cpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpc0VuYWJsZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBTZWxlY3RhYmxlUm93RGlzYWJsZWQgIT09IHRydWU7XG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIGlmICh0aGlzLnN1YnNjcmlwdGlvbikge1xuICAgICAgICAgICAgdGhpcy5zdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfVxuICAgIH1cblxufVxuXG5ARGlyZWN0aXZlKHtcbiAgICBzZWxlY3RvcjogJ1twU2VsZWN0YWJsZVJvd0RibENsaWNrXScsXG4gICAgaG9zdDoge1xuICAgICAgICAnW2NsYXNzLnAtZGF0YXRhYmxlLXNlbGVjdGFibGUtcm93XSc6ICdpc0VuYWJsZWQoKScsXG4gICAgICAgICdbY2xhc3MucC1oaWdobGlnaHRdJzogJ3NlbGVjdGVkJ1xuICAgIH1cbn0pXG5leHBvcnQgY2xhc3MgU2VsZWN0YWJsZVJvd0RibENsaWNrIGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuXG4gICAgQElucHV0KFwicFNlbGVjdGFibGVSb3dEYmxDbGlja1wiKSBkYXRhOiBhbnk7XG5cbiAgICBASW5wdXQoXCJwU2VsZWN0YWJsZVJvd0luZGV4XCIpIGluZGV4OiBudW1iZXI7XG5cbiAgICBASW5wdXQoKSBwU2VsZWN0YWJsZVJvd0Rpc2FibGVkOiBib29sZWFuO1xuXG4gICAgc2VsZWN0ZWQ6IGJvb2xlYW47XG5cbiAgICBzdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBkdDogVGFibGUsIHB1YmxpYyB0YWJsZVNlcnZpY2U6IFRhYmxlU2VydmljZSkge1xuICAgICAgICBpZiAodGhpcy5pc0VuYWJsZWQoKSkge1xuICAgICAgICAgICAgdGhpcy5zdWJzY3JpcHRpb24gPSB0aGlzLmR0LnRhYmxlU2VydmljZS5zZWxlY3Rpb25Tb3VyY2UkLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZCA9IHRoaXMuZHQuaXNTZWxlY3RlZCh0aGlzLmRhdGEpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNFbmFibGVkKCkpIHtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWQgPSB0aGlzLmR0LmlzU2VsZWN0ZWQodGhpcy5kYXRhKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIEBIb3N0TGlzdGVuZXIoJ2RibGNsaWNrJywgWyckZXZlbnQnXSlcbiAgICBvbkNsaWNrKGV2ZW50OiBFdmVudCkge1xuICAgICAgICBpZiAodGhpcy5pc0VuYWJsZWQoKSkge1xuICAgICAgICAgICAgdGhpcy5kdC5oYW5kbGVSb3dDbGljayh7XG4gICAgICAgICAgICAgICAgb3JpZ2luYWxFdmVudDogZXZlbnQsXG4gICAgICAgICAgICAgICAgcm93RGF0YTogdGhpcy5kYXRhLFxuICAgICAgICAgICAgICAgIHJvd0luZGV4OiB0aGlzLmluZGV4XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlzRW5hYmxlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucFNlbGVjdGFibGVSb3dEaXNhYmxlZCAhPT0gdHJ1ZTtcbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHtcbiAgICAgICAgaWYgKHRoaXMuc3Vic2NyaXB0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG59XG5cbkBEaXJlY3RpdmUoe1xuICAgIHNlbGVjdG9yOiAnW3BDb250ZXh0TWVudVJvd10nLFxuICAgIGhvc3Q6IHtcbiAgICAgICAgJ1tjbGFzcy5wLWhpZ2hsaWdodC1jb250ZXh0bWVudV0nOiAnc2VsZWN0ZWQnLFxuICAgICAgICAnW2F0dHIudGFiaW5kZXhdJzogJ2lzRW5hYmxlZCgpID8gMCA6IHVuZGVmaW5lZCdcbiAgICB9XG59KVxuZXhwb3J0IGNsYXNzIENvbnRleHRNZW51Um93IHtcblxuICAgIEBJbnB1dChcInBDb250ZXh0TWVudVJvd1wiKSBkYXRhOiBhbnk7XG5cbiAgICBASW5wdXQoXCJwQ29udGV4dE1lbnVSb3dJbmRleFwiKSBpbmRleDogbnVtYmVyO1xuXG4gICAgQElucHV0KCkgcENvbnRleHRNZW51Um93RGlzYWJsZWQ6IGJvb2xlYW47XG5cbiAgICBzZWxlY3RlZDogYm9vbGVhbjtcblxuICAgIHN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gICAgY29uc3RydWN0b3IocHVibGljIGR0OiBUYWJsZSwgcHVibGljIHRhYmxlU2VydmljZTogVGFibGVTZXJ2aWNlLCBwcml2YXRlIGVsOiBFbGVtZW50UmVmKSB7XG4gICAgICAgIGlmICh0aGlzLmlzRW5hYmxlZCgpKSB7XG4gICAgICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbiA9IHRoaXMuZHQudGFibGVTZXJ2aWNlLmNvbnRleHRNZW51U291cmNlJC5zdWJzY3JpYmUoKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkID0gdGhpcy5kdC5lcXVhbHModGhpcy5kYXRhLCBkYXRhKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgQEhvc3RMaXN0ZW5lcignY29udGV4dG1lbnUnLCBbJyRldmVudCddKVxuICAgIG9uQ29udGV4dE1lbnUoZXZlbnQ6IEV2ZW50KSB7XG4gICAgICAgIGlmICh0aGlzLmlzRW5hYmxlZCgpKSB7XG4gICAgICAgICAgICB0aGlzLmR0LmhhbmRsZVJvd1JpZ2h0Q2xpY2soe1xuICAgICAgICAgICAgICAgIG9yaWdpbmFsRXZlbnQ6IGV2ZW50LFxuICAgICAgICAgICAgICAgIHJvd0RhdGE6IHRoaXMuZGF0YSxcbiAgICAgICAgICAgICAgICByb3dJbmRleDogdGhpcy5pbmRleFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuZWwubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlzRW5hYmxlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucENvbnRleHRNZW51Um93RGlzYWJsZWQgIT09IHRydWU7XG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIGlmICh0aGlzLnN1YnNjcmlwdGlvbikge1xuICAgICAgICAgICAgdGhpcy5zdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfVxuICAgIH1cblxufVxuXG5ARGlyZWN0aXZlKHtcbiAgICBzZWxlY3RvcjogJ1twUm93VG9nZ2xlcl0nXG59KVxuZXhwb3J0IGNsYXNzIFJvd1RvZ2dsZXIge1xuXG4gICAgQElucHV0KCdwUm93VG9nZ2xlcicpIGRhdGE6IGFueTtcblxuICAgIEBJbnB1dCgpIHBSb3dUb2dnbGVyRGlzYWJsZWQ6IGJvb2xlYW47XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgZHQ6IFRhYmxlKSB7IH1cblxuICAgIEBIb3N0TGlzdGVuZXIoJ2NsaWNrJywgWyckZXZlbnQnXSlcbiAgICBvbkNsaWNrKGV2ZW50OiBFdmVudCkge1xuICAgICAgICBpZiAodGhpcy5pc0VuYWJsZWQoKSkge1xuICAgICAgICAgICAgdGhpcy5kdC50b2dnbGVSb3codGhpcy5kYXRhLCBldmVudCk7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaXNFbmFibGVkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wUm93VG9nZ2xlckRpc2FibGVkICE9PSB0cnVlO1xuICAgIH1cbn1cblxuQERpcmVjdGl2ZSh7XG4gICAgc2VsZWN0b3I6ICdbcFJlc2l6YWJsZUNvbHVtbl0nXG59KVxuZXhwb3J0IGNsYXNzIFJlc2l6YWJsZUNvbHVtbiBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG5cbiAgICBASW5wdXQoKSBwUmVzaXphYmxlQ29sdW1uRGlzYWJsZWQ6IGJvb2xlYW47XG5cbiAgICByZXNpemVyOiBIVE1MU3BhbkVsZW1lbnQ7XG5cbiAgICByZXNpemVyTW91c2VEb3duTGlzdGVuZXI6IGFueTtcblxuICAgIGRvY3VtZW50TW91c2VNb3ZlTGlzdGVuZXI6IGFueTtcblxuICAgIGRvY3VtZW50TW91c2VVcExpc3RlbmVyOiBhbnk7XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgZHQ6IFRhYmxlLCBwdWJsaWMgZWw6IEVsZW1lbnRSZWYsIHB1YmxpYyB6b25lOiBOZ1pvbmUpIHsgfVxuXG4gICAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgICAgICBpZiAodGhpcy5pc0VuYWJsZWQoKSkge1xuICAgICAgICAgICAgRG9tSGFuZGxlci5hZGRDbGFzcyh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICdwLXJlc2l6YWJsZS1jb2x1bW4nKTtcbiAgICAgICAgICAgIHRoaXMucmVzaXplciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgICAgICAgIHRoaXMucmVzaXplci5jbGFzc05hbWUgPSAncC1jb2x1bW4tcmVzaXplcic7XG4gICAgICAgICAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5yZXNpemVyKTtcblxuICAgICAgICAgICAgdGhpcy56b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlc2l6ZXJNb3VzZURvd25MaXN0ZW5lciA9IHRoaXMub25Nb3VzZURvd24uYmluZCh0aGlzKTtcbiAgICAgICAgICAgICAgICB0aGlzLnJlc2l6ZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5yZXNpemVyTW91c2VEb3duTGlzdGVuZXIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBiaW5kRG9jdW1lbnRFdmVudHMoKSB7XG4gICAgICAgIHRoaXMuem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmRvY3VtZW50TW91c2VNb3ZlTGlzdGVuZXIgPSB0aGlzLm9uRG9jdW1lbnRNb3VzZU1vdmUuYmluZCh0aGlzKTtcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMuZG9jdW1lbnRNb3VzZU1vdmVMaXN0ZW5lcik7XG5cbiAgICAgICAgICAgIHRoaXMuZG9jdW1lbnRNb3VzZVVwTGlzdGVuZXIgPSB0aGlzLm9uRG9jdW1lbnRNb3VzZVVwLmJpbmQodGhpcyk7XG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5kb2N1bWVudE1vdXNlVXBMaXN0ZW5lcik7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHVuYmluZERvY3VtZW50RXZlbnRzKCkge1xuICAgICAgICBpZiAodGhpcy5kb2N1bWVudE1vdXNlTW92ZUxpc3RlbmVyKSB7XG4gICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLmRvY3VtZW50TW91c2VNb3ZlTGlzdGVuZXIpO1xuICAgICAgICAgICAgdGhpcy5kb2N1bWVudE1vdXNlTW92ZUxpc3RlbmVyID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmRvY3VtZW50TW91c2VVcExpc3RlbmVyKSB7XG4gICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5kb2N1bWVudE1vdXNlVXBMaXN0ZW5lcik7XG4gICAgICAgICAgICB0aGlzLmRvY3VtZW50TW91c2VVcExpc3RlbmVyID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uTW91c2VEb3duKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgICAgIGlmIChldmVudC53aGljaCA9PT0gMSkge1xuICAgICAgICAgICAgdGhpcy5kdC5vbkNvbHVtblJlc2l6ZUJlZ2luKGV2ZW50KTtcbiAgICAgICAgICAgIHRoaXMuYmluZERvY3VtZW50RXZlbnRzKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbkRvY3VtZW50TW91c2VNb3ZlKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgICAgIHRoaXMuZHQub25Db2x1bW5SZXNpemUoZXZlbnQpO1xuICAgIH1cblxuICAgIG9uRG9jdW1lbnRNb3VzZVVwKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgICAgIHRoaXMuZHQub25Db2x1bW5SZXNpemVFbmQoZXZlbnQsIHRoaXMuZWwubmF0aXZlRWxlbWVudCk7XG4gICAgICAgIHRoaXMudW5iaW5kRG9jdW1lbnRFdmVudHMoKTtcbiAgICB9XG5cbiAgICBpc0VuYWJsZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBSZXNpemFibGVDb2x1bW5EaXNhYmxlZCAhPT0gdHJ1ZTtcbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHtcbiAgICAgICAgaWYgKHRoaXMucmVzaXplck1vdXNlRG93bkxpc3RlbmVyKSB7XG4gICAgICAgICAgICB0aGlzLnJlc2l6ZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5yZXNpemVyTW91c2VEb3duTGlzdGVuZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy51bmJpbmREb2N1bWVudEV2ZW50cygpO1xuICAgIH1cbn1cblxuQERpcmVjdGl2ZSh7XG4gICAgc2VsZWN0b3I6ICdbcFJlb3JkZXJhYmxlQ29sdW1uXSdcbn0pXG5leHBvcnQgY2xhc3MgUmVvcmRlcmFibGVDb2x1bW4gaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3kge1xuXG4gICAgQElucHV0KCkgcFJlb3JkZXJhYmxlQ29sdW1uRGlzYWJsZWQ6IGJvb2xlYW47XG5cbiAgICBkcmFnU3RhcnRMaXN0ZW5lcjogYW55O1xuXG4gICAgZHJhZ092ZXJMaXN0ZW5lcjogYW55O1xuXG4gICAgZHJhZ0VudGVyTGlzdGVuZXI6IGFueTtcblxuICAgIGRyYWdMZWF2ZUxpc3RlbmVyOiBhbnk7XG5cbiAgICBtb3VzZURvd25MaXN0ZW5lcjogYW55O1xuXG4gICAgY29uc3RydWN0b3IocHVibGljIGR0OiBUYWJsZSwgcHVibGljIGVsOiBFbGVtZW50UmVmLCBwdWJsaWMgem9uZTogTmdab25lKSB7IH1cblxuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNFbmFibGVkKCkpIHtcbiAgICAgICAgICAgIHRoaXMuYmluZEV2ZW50cygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYmluZEV2ZW50cygpIHtcbiAgICAgICAgdGhpcy56b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMubW91c2VEb3duTGlzdGVuZXIgPSB0aGlzLm9uTW91c2VEb3duLmJpbmQodGhpcyk7XG4gICAgICAgICAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5tb3VzZURvd25MaXN0ZW5lcik7XG5cbiAgICAgICAgICAgIHRoaXMuZHJhZ1N0YXJ0TGlzdGVuZXIgPSB0aGlzLm9uRHJhZ1N0YXJ0LmJpbmQodGhpcyk7XG4gICAgICAgICAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ3N0YXJ0JywgdGhpcy5kcmFnU3RhcnRMaXN0ZW5lcik7XG5cbiAgICAgICAgICAgIHRoaXMuZHJhZ092ZXJMaXN0ZW5lciA9IHRoaXMub25EcmFnRW50ZXIuYmluZCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuZWwubmF0aXZlRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdkcmFnb3ZlcicsIHRoaXMuZHJhZ092ZXJMaXN0ZW5lcik7XG5cbiAgICAgICAgICAgIHRoaXMuZHJhZ0VudGVyTGlzdGVuZXIgPSB0aGlzLm9uRHJhZ0VudGVyLmJpbmQodGhpcyk7XG4gICAgICAgICAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ2VudGVyJywgdGhpcy5kcmFnRW50ZXJMaXN0ZW5lcik7XG5cbiAgICAgICAgICAgIHRoaXMuZHJhZ0xlYXZlTGlzdGVuZXIgPSB0aGlzLm9uRHJhZ0xlYXZlLmJpbmQodGhpcyk7XG4gICAgICAgICAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ2xlYXZlJywgdGhpcy5kcmFnTGVhdmVMaXN0ZW5lcik7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHVuYmluZEV2ZW50cygpIHtcbiAgICAgICAgaWYgKHRoaXMubW91c2VEb3duTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMubW91c2VEb3duTGlzdGVuZXIpO1xuICAgICAgICAgICAgdGhpcy5tb3VzZURvd25MaXN0ZW5lciA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5kcmFnT3Zlckxpc3RlbmVyKSB7XG4gICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdkcmFnb3ZlcicsIHRoaXMuZHJhZ092ZXJMaXN0ZW5lcik7XG4gICAgICAgICAgICB0aGlzLmRyYWdPdmVyTGlzdGVuZXIgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZHJhZ0VudGVyTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2RyYWdlbnRlcicsIHRoaXMuZHJhZ0VudGVyTGlzdGVuZXIpO1xuICAgICAgICAgICAgdGhpcy5kcmFnRW50ZXJMaXN0ZW5lciA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5kcmFnRW50ZXJMaXN0ZW5lcikge1xuICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignZHJhZ2VudGVyJywgdGhpcy5kcmFnRW50ZXJMaXN0ZW5lcik7XG4gICAgICAgICAgICB0aGlzLmRyYWdFbnRlckxpc3RlbmVyID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmRyYWdMZWF2ZUxpc3RlbmVyKSB7XG4gICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdkcmFnbGVhdmUnLCB0aGlzLmRyYWdMZWF2ZUxpc3RlbmVyKTtcbiAgICAgICAgICAgIHRoaXMuZHJhZ0xlYXZlTGlzdGVuZXIgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25Nb3VzZURvd24oZXZlbnQpIHtcbiAgICAgICAgaWYgKGV2ZW50LnRhcmdldC5ub2RlTmFtZSA9PT0gJ0lOUFVUJyB8fCBldmVudC50YXJnZXQubm9kZU5hbWUgPT09ICdURVhUQVJFQScgfHwgRG9tSGFuZGxlci5oYXNDbGFzcyhldmVudC50YXJnZXQsICdwLWNvbHVtbi1yZXNpemVyJykpXG4gICAgICAgICAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuZHJhZ2dhYmxlID0gZmFsc2U7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHRoaXMuZWwubmF0aXZlRWxlbWVudC5kcmFnZ2FibGUgPSB0cnVlO1xuICAgIH1cblxuICAgIG9uRHJhZ1N0YXJ0KGV2ZW50KSB7XG4gICAgICAgIHRoaXMuZHQub25Db2x1bW5EcmFnU3RhcnQoZXZlbnQsIHRoaXMuZWwubmF0aXZlRWxlbWVudCk7XG4gICAgfVxuXG4gICAgb25EcmFnT3ZlcihldmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cblxuICAgIG9uRHJhZ0VudGVyKGV2ZW50KSB7XG4gICAgICAgIHRoaXMuZHQub25Db2x1bW5EcmFnRW50ZXIoZXZlbnQsIHRoaXMuZWwubmF0aXZlRWxlbWVudCk7XG4gICAgfVxuXG4gICAgb25EcmFnTGVhdmUoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5kdC5vbkNvbHVtbkRyYWdMZWF2ZShldmVudCk7XG4gICAgfVxuXG4gICAgQEhvc3RMaXN0ZW5lcignZHJvcCcsIFsnJGV2ZW50J10pXG4gICAgb25Ecm9wKGV2ZW50KSB7XG4gICAgICAgIGlmICh0aGlzLmlzRW5hYmxlZCgpKSB7XG4gICAgICAgICAgICB0aGlzLmR0Lm9uQ29sdW1uRHJvcChldmVudCwgdGhpcy5lbC5uYXRpdmVFbGVtZW50KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlzRW5hYmxlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucFJlb3JkZXJhYmxlQ29sdW1uRGlzYWJsZWQgIT09IHRydWU7XG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMudW5iaW5kRXZlbnRzKCk7XG4gICAgfVxuXG59XG5cbkBEaXJlY3RpdmUoe1xuICAgIHNlbGVjdG9yOiAnW3BFZGl0YWJsZUNvbHVtbl0nXG59KVxuZXhwb3J0IGNsYXNzIEVkaXRhYmxlQ29sdW1uIGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCB7XG5cbiAgICBASW5wdXQoXCJwRWRpdGFibGVDb2x1bW5cIikgZGF0YTogYW55O1xuXG4gICAgQElucHV0KFwicEVkaXRhYmxlQ29sdW1uRmllbGRcIikgZmllbGQ6IGFueTtcblxuICAgIEBJbnB1dChcInBFZGl0YWJsZUNvbHVtblJvd0luZGV4XCIpIHJvd0luZGV4OiBudW1iZXI7XG5cbiAgICBASW5wdXQoKSBwRWRpdGFibGVDb2x1bW5EaXNhYmxlZDogYm9vbGVhbjtcblxuICAgIEBJbnB1dCgpIHBGb2N1c0NlbGxTZWxlY3Rvcjogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IocHVibGljIGR0OiBUYWJsZSwgcHVibGljIGVsOiBFbGVtZW50UmVmLCBwdWJsaWMgem9uZTogTmdab25lKSB7fVxuXG4gICAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgICAgICBpZiAodGhpcy5pc0VuYWJsZWQoKSkge1xuICAgICAgICAgICAgRG9tSGFuZGxlci5hZGRDbGFzcyh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICdwLWVkaXRhYmxlLWNvbHVtbicpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgQEhvc3RMaXN0ZW5lcignY2xpY2snLCBbJyRldmVudCddKVxuICAgIG9uQ2xpY2soZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNFbmFibGVkKCkpIHtcbiAgICAgICAgICAgIHRoaXMuZHQuZWRpdGluZ0NlbGxDbGljayA9IHRydWU7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmR0LmVkaXRpbmdDZWxsKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZHQuZWRpdGluZ0NlbGwgIT09IHRoaXMuZWwubmF0aXZlRWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuZHQuaXNFZGl0aW5nQ2VsbFZhbGlkKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvc2VFZGl0aW5nQ2VsbCh0cnVlLCBldmVudCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3BlbkNlbGwoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9wZW5DZWxsKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvcGVuQ2VsbCgpIHtcbiAgICAgICAgdGhpcy5kdC51cGRhdGVFZGl0aW5nQ2VsbCh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsIHRoaXMuZGF0YSwgdGhpcy5maWVsZCwgdGhpcy5yb3dJbmRleCk7XG4gICAgICAgIERvbUhhbmRsZXIuYWRkQ2xhc3ModGhpcy5lbC5uYXRpdmVFbGVtZW50LCAncC1jZWxsLWVkaXRpbmcnKTtcbiAgICAgICAgdGhpcy5kdC5vbkVkaXRJbml0LmVtaXQoe2ZpZWxkOiB0aGlzLmZpZWxkLCBkYXRhOiB0aGlzLmRhdGEsIGluZGV4OiB0aGlzLnJvd0luZGV4fSk7XG4gICAgICAgIHRoaXMuem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgZm9jdXNDZWxsU2VsZWN0b3IgPSB0aGlzLnBGb2N1c0NlbGxTZWxlY3RvciB8fCAnaW5wdXQsIHRleHRhcmVhLCBzZWxlY3QnO1xuICAgICAgICAgICAgICAgIGxldCBmb2N1c2FibGVFbGVtZW50ID0gRG9tSGFuZGxlci5maW5kU2luZ2xlKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgZm9jdXNDZWxsU2VsZWN0b3IpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGZvY3VzYWJsZUVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9jdXNhYmxlRWxlbWVudC5mb2N1cygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIDUwKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgY2xvc2VFZGl0aW5nQ2VsbChjb21wbGV0ZWQsIGV2ZW50KSB7XG4gICAgICAgIGlmIChjb21wbGV0ZWQpXG4gICAgICAgICAgICB0aGlzLmR0Lm9uRWRpdENvbXBsZXRlLmVtaXQoe2ZpZWxkOiB0aGlzLmR0LmVkaXRpbmdDZWxsRmllbGQsIGRhdGE6IHRoaXMuZHQuZWRpdGluZ0NlbGxEYXRhLCBvcmlnaW5hbEV2ZW50OiBldmVudCwgaW5kZXg6IHRoaXMucm93SW5kZXh9KTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgdGhpcy5kdC5vbkVkaXRDYW5jZWwuZW1pdCh7ZmllbGQ6IHRoaXMuZHQuZWRpdGluZ0NlbGxGaWVsZCwgZGF0YTogdGhpcy5kdC5lZGl0aW5nQ2VsbERhdGEsIG9yaWdpbmFsRXZlbnQ6IGV2ZW50LCBpbmRleDogdGhpcy5yb3dJbmRleH0pO1xuXG4gICAgICAgIERvbUhhbmRsZXIucmVtb3ZlQ2xhc3ModGhpcy5kdC5lZGl0aW5nQ2VsbCwgJ3AtY2VsbC1lZGl0aW5nJyk7XG4gICAgICAgIHRoaXMuZHQuZWRpdGluZ0NlbGwgPSBudWxsO1xuICAgICAgICB0aGlzLmR0LmVkaXRpbmdDZWxsRGF0YSA9IG51bGw7XG4gICAgICAgIHRoaXMuZHQuZWRpdGluZ0NlbGxGaWVsZCA9IG51bGw7XG4gICAgICAgIHRoaXMuZHQudW5iaW5kRG9jdW1lbnRFZGl0TGlzdGVuZXIoKTtcbiAgICB9XG5cbiAgICBASG9zdExpc3RlbmVyKCdrZXlkb3duLmVudGVyJywgWyckZXZlbnQnXSlcbiAgICBvbkVudGVyS2V5RG93bihldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgICAgICBpZiAodGhpcy5pc0VuYWJsZWQoKSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuZHQuaXNFZGl0aW5nQ2VsbFZhbGlkKCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNsb3NlRWRpdGluZ0NlbGwodHJ1ZSwgZXZlbnQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgQEhvc3RMaXN0ZW5lcigna2V5ZG93bi5lc2NhcGUnLCBbJyRldmVudCddKVxuICAgIG9uRXNjYXBlS2V5RG93bihldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgICAgICBpZiAodGhpcy5pc0VuYWJsZWQoKSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuZHQuaXNFZGl0aW5nQ2VsbFZhbGlkKCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNsb3NlRWRpdGluZ0NlbGwoZmFsc2UsIGV2ZW50KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIEBIb3N0TGlzdGVuZXIoJ2tleWRvd24udGFiJywgWyckZXZlbnQnXSlcbiAgICBASG9zdExpc3RlbmVyKCdrZXlkb3duLnNoaWZ0LnRhYicsIFsnJGV2ZW50J10pXG4gICAgQEhvc3RMaXN0ZW5lcigna2V5ZG93bi5tZXRhLnRhYicsIFsnJGV2ZW50J10pXG4gICAgb25TaGlmdEtleURvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNFbmFibGVkKCkpIHtcbiAgICAgICAgICAgIGlmIChldmVudC5zaGlmdEtleSlcbiAgICAgICAgICAgICAgICB0aGlzLm1vdmVUb1ByZXZpb3VzQ2VsbChldmVudCk7XG4gICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgIHRoaXMubW92ZVRvTmV4dENlbGwoZXZlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZmluZENlbGwoZWxlbWVudCkge1xuICAgICAgICBpZiAoZWxlbWVudCkge1xuICAgICAgICAgICAgbGV0IGNlbGwgPSBlbGVtZW50O1xuICAgICAgICAgICAgd2hpbGUgKGNlbGwgJiYgIURvbUhhbmRsZXIuaGFzQ2xhc3MoY2VsbCwgJ3AtY2VsbC1lZGl0aW5nJykpIHtcbiAgICAgICAgICAgICAgICBjZWxsID0gY2VsbC5wYXJlbnRFbGVtZW50O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gY2VsbDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbW92ZVRvUHJldmlvdXNDZWxsKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgICAgIGxldCBjdXJyZW50Q2VsbCA9IHRoaXMuZmluZENlbGwoZXZlbnQudGFyZ2V0KTtcbiAgICAgICAgaWYgKGN1cnJlbnRDZWxsKSB7XG4gICAgICAgICAgICBsZXQgdGFyZ2V0Q2VsbCA9IHRoaXMuZmluZFByZXZpb3VzRWRpdGFibGVDb2x1bW4oY3VycmVudENlbGwpO1xuXG4gICAgICAgICAgICBpZiAodGFyZ2V0Q2VsbCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmR0LmlzRWRpdGluZ0NlbGxWYWxpZCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvc2VFZGl0aW5nQ2VsbCh0cnVlLCBldmVudCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgRG9tSGFuZGxlci5pbnZva2VFbGVtZW50TWV0aG9kKGV2ZW50LnRhcmdldCwgJ2JsdXInKTtcbiAgICAgICAgICAgICAgICBEb21IYW5kbGVyLmludm9rZUVsZW1lbnRNZXRob2QodGFyZ2V0Q2VsbCwgJ2NsaWNrJyk7XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIG1vdmVUb05leHRDZWxsKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgICAgIGxldCBjdXJyZW50Q2VsbCA9IHRoaXMuZmluZENlbGwoZXZlbnQudGFyZ2V0KTtcbiAgICAgICAgaWYgKGN1cnJlbnRDZWxsKSB7XG4gICAgICAgICAgICBsZXQgdGFyZ2V0Q2VsbCA9IHRoaXMuZmluZE5leHRFZGl0YWJsZUNvbHVtbihjdXJyZW50Q2VsbCk7XG5cbiAgICAgICAgICAgIGlmICh0YXJnZXRDZWxsKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZHQuaXNFZGl0aW5nQ2VsbFZhbGlkKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9zZUVkaXRpbmdDZWxsKHRydWUsIGV2ZW50KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBEb21IYW5kbGVyLmludm9rZUVsZW1lbnRNZXRob2QoZXZlbnQudGFyZ2V0LCAnYmx1cicpO1xuICAgICAgICAgICAgICAgIERvbUhhbmRsZXIuaW52b2tlRWxlbWVudE1ldGhvZCh0YXJnZXRDZWxsLCAnY2xpY2snKTtcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZmluZFByZXZpb3VzRWRpdGFibGVDb2x1bW4oY2VsbDogRWxlbWVudCkge1xuICAgICAgICBsZXQgcHJldkNlbGwgPSBjZWxsLnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XG5cbiAgICAgICAgaWYgKCFwcmV2Q2VsbCkge1xuICAgICAgICAgICAgbGV0IHByZXZpb3VzUm93ID0gY2VsbC5wYXJlbnRFbGVtZW50LnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XG4gICAgICAgICAgICBpZiAocHJldmlvdXNSb3cpIHtcbiAgICAgICAgICAgICAgICBwcmV2Q2VsbCA9IHByZXZpb3VzUm93Lmxhc3RFbGVtZW50Q2hpbGQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocHJldkNlbGwpIHtcbiAgICAgICAgICAgIGlmIChEb21IYW5kbGVyLmhhc0NsYXNzKHByZXZDZWxsLCAncC1lZGl0YWJsZS1jb2x1bW4nKSlcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJldkNlbGw7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmluZFByZXZpb3VzRWRpdGFibGVDb2x1bW4ocHJldkNlbGwpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmaW5kTmV4dEVkaXRhYmxlQ29sdW1uKGNlbGw6IEVsZW1lbnQpIHtcbiAgICAgICAgbGV0IG5leHRDZWxsID0gY2VsbC5uZXh0RWxlbWVudFNpYmxpbmc7XG5cbiAgICAgICAgaWYgKCFuZXh0Q2VsbCkge1xuICAgICAgICAgICAgbGV0IG5leHRSb3cgPSBjZWxsLnBhcmVudEVsZW1lbnQubmV4dEVsZW1lbnRTaWJsaW5nO1xuICAgICAgICAgICAgaWYgKG5leHRSb3cpIHtcbiAgICAgICAgICAgICAgICBuZXh0Q2VsbCA9IG5leHRSb3cuZmlyc3RFbGVtZW50Q2hpbGQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobmV4dENlbGwpIHtcbiAgICAgICAgICAgIGlmIChEb21IYW5kbGVyLmhhc0NsYXNzKG5leHRDZWxsLCAncC1lZGl0YWJsZS1jb2x1bW4nKSlcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV4dENlbGw7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmluZE5leHRFZGl0YWJsZUNvbHVtbihuZXh0Q2VsbCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlzRW5hYmxlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucEVkaXRhYmxlQ29sdW1uRGlzYWJsZWQgIT09IHRydWU7XG4gICAgfVxuXG59XG5cbkBEaXJlY3RpdmUoe1xuICAgIHNlbGVjdG9yOiAnW3BFZGl0YWJsZVJvd10nXG59KVxuZXhwb3J0IGNsYXNzIEVkaXRhYmxlUm93IHtcblxuICAgIEBJbnB1dChcInBFZGl0YWJsZVJvd1wiKSBkYXRhOiBhbnk7XG5cbiAgICBASW5wdXQoKSBwRWRpdGFibGVSb3dEaXNhYmxlZDogYm9vbGVhbjtcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBlbDogRWxlbWVudFJlZikge31cblxuICAgIGlzRW5hYmxlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucEVkaXRhYmxlUm93RGlzYWJsZWQgIT09IHRydWU7XG4gICAgfVxuXG59XG5cbkBEaXJlY3RpdmUoe1xuICAgIHNlbGVjdG9yOiAnW3BJbml0RWRpdGFibGVSb3ddJ1xufSlcbmV4cG9ydCBjbGFzcyBJbml0RWRpdGFibGVSb3cge1xuXG4gICAgY29uc3RydWN0b3IocHVibGljIGR0OiBUYWJsZSwgcHVibGljIGVkaXRhYmxlUm93OiBFZGl0YWJsZVJvdykge31cblxuICAgIEBIb3N0TGlzdGVuZXIoJ2NsaWNrJywgWyckZXZlbnQnXSlcbiAgICBvbkNsaWNrKGV2ZW50OiBFdmVudCkge1xuICAgICAgICB0aGlzLmR0LmluaXRSb3dFZGl0KHRoaXMuZWRpdGFibGVSb3cuZGF0YSk7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuXG59XG5cbkBEaXJlY3RpdmUoe1xuICAgIHNlbGVjdG9yOiAnW3BTYXZlRWRpdGFibGVSb3ddJ1xufSlcbmV4cG9ydCBjbGFzcyBTYXZlRWRpdGFibGVSb3cge1xuXG4gICAgY29uc3RydWN0b3IocHVibGljIGR0OiBUYWJsZSwgcHVibGljIGVkaXRhYmxlUm93OiBFZGl0YWJsZVJvdykge31cblxuICAgIEBIb3N0TGlzdGVuZXIoJ2NsaWNrJywgWyckZXZlbnQnXSlcbiAgICBvbkNsaWNrKGV2ZW50OiBFdmVudCkge1xuICAgICAgICB0aGlzLmR0LnNhdmVSb3dFZGl0KHRoaXMuZWRpdGFibGVSb3cuZGF0YSwgdGhpcy5lZGl0YWJsZVJvdy5lbC5uYXRpdmVFbGVtZW50KTtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG59XG5cbkBEaXJlY3RpdmUoe1xuICAgIHNlbGVjdG9yOiAnW3BDYW5jZWxFZGl0YWJsZVJvd10nXG59KVxuZXhwb3J0IGNsYXNzIENhbmNlbEVkaXRhYmxlUm93IHtcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBkdDogVGFibGUsIHB1YmxpYyBlZGl0YWJsZVJvdzogRWRpdGFibGVSb3cpIHt9XG5cbiAgICBASG9zdExpc3RlbmVyKCdjbGljaycsIFsnJGV2ZW50J10pXG4gICAgb25DbGljayhldmVudDogRXZlbnQpIHtcbiAgICAgICAgdGhpcy5kdC5jYW5jZWxSb3dFZGl0KHRoaXMuZWRpdGFibGVSb3cuZGF0YSk7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxufVxuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3AtY2VsbEVkaXRvcicsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cImVkaXRpbmdcIj5cbiAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJpbnB1dFRlbXBsYXRlXCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiIWVkaXRpbmdcIj5cbiAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJvdXRwdXRUZW1wbGF0ZVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICBgLFxuICAgIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmVcbn0pXG5leHBvcnQgY2xhc3MgQ2VsbEVkaXRvciBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQge1xuXG4gICAgQENvbnRlbnRDaGlsZHJlbihQcmltZVRlbXBsYXRlKSB0ZW1wbGF0ZXM6IFF1ZXJ5TGlzdDxQcmltZVRlbXBsYXRlPjtcblxuICAgIGlucHV0VGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICBvdXRwdXRUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBkdDogVGFibGUsIEBPcHRpb25hbCgpIHB1YmxpYyBlZGl0YWJsZUNvbHVtbjogRWRpdGFibGVDb2x1bW4sIEBPcHRpb25hbCgpIHB1YmxpYyBlZGl0YWJsZVJvdzogRWRpdGFibGVSb3cpIHsgfVxuXG4gICAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgICAgICB0aGlzLnRlbXBsYXRlcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgICBzd2l0Y2ggKGl0ZW0uZ2V0VHlwZSgpKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnaW5wdXQnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmlucHV0VGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ291dHB1dCc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3V0cHV0VGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZ2V0IGVkaXRpbmcoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAodGhpcy5kdC5lZGl0aW5nQ2VsbCAmJiB0aGlzLmVkaXRhYmxlQ29sdW1uICYmIHRoaXMuZHQuZWRpdGluZ0NlbGwgPT09IHRoaXMuZWRpdGFibGVDb2x1bW4uZWwubmF0aXZlRWxlbWVudCkgfHxcbiAgICAgICAgICAgICAgICAodGhpcy5lZGl0YWJsZVJvdyAmJiB0aGlzLmR0LmVkaXRNb2RlID09PSAncm93JyAmJiB0aGlzLmR0LmlzUm93RWRpdGluZyh0aGlzLmVkaXRhYmxlUm93LmRhdGEpKTtcbiAgICB9XG5cbn1cblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdwLXRhYmxlUmFkaW9CdXR0b24nLFxuICAgIHRlbXBsYXRlOiBgXG4gICAgICAgIDxkaXYgY2xhc3M9XCJwLXJhZGlvYnV0dG9uIHAtY29tcG9uZW50XCIgKGNsaWNrKT1cIm9uQ2xpY2soJGV2ZW50KVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInAtaGlkZGVuLWFjY2Vzc2libGVcIj5cbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInJhZGlvXCIgW2F0dHIuaWRdPVwiaW5wdXRJZFwiIFthdHRyLm5hbWVdPVwibmFtZVwiIFtjaGVja2VkXT1cImNoZWNrZWRcIiAoZm9jdXMpPVwib25Gb2N1cygpXCIgKGJsdXIpPVwib25CbHVyKClcIlxuICAgICAgICAgICAgICAgIFtkaXNhYmxlZF09XCJkaXNhYmxlZFwiIFthdHRyLmFyaWEtbGFiZWxdPVwiYXJpYUxhYmVsXCI+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgI2JveCBbbmdDbGFzc109XCJ7J3AtcmFkaW9idXR0b24tYm94IHAtY29tcG9uZW50Jzp0cnVlLFxuICAgICAgICAgICAgICAgICdwLWhpZ2hsaWdodCc6Y2hlY2tlZCwgJ3AtZGlzYWJsZWQnOmRpc2FibGVkfVwiIHJvbGU9XCJyYWRpb1wiIFthdHRyLmFyaWEtY2hlY2tlZF09XCJjaGVja2VkXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInAtcmFkaW9idXR0b24taWNvblwiPjwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIGAsXG4gICAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gICAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZVxufSlcbmV4cG9ydCBjbGFzcyBUYWJsZVJhZGlvQnV0dG9uICB7XG5cbiAgICBASW5wdXQoKSBkaXNhYmxlZDogYm9vbGVhbjtcblxuICAgIEBJbnB1dCgpIHZhbHVlOiBhbnk7XG5cbiAgICBASW5wdXQoKSBpbmRleDogbnVtYmVyO1xuXG4gICAgQElucHV0KCkgaW5wdXRJZDogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgbmFtZTogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgYXJpYUxhYmVsOiBzdHJpbmc7XG5cbiAgICBAVmlld0NoaWxkKCdib3gnKSBib3hWaWV3Q2hpbGQ6IEVsZW1lbnRSZWY7XG5cbiAgICBjaGVja2VkOiBib29sZWFuO1xuXG4gICAgc3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgZHQ6IFRhYmxlLCBwdWJsaWMgdGFibGVTZXJ2aWNlOiBUYWJsZVNlcnZpY2UsIHB1YmxpYyBjZDogQ2hhbmdlRGV0ZWN0b3JSZWYpIHtcbiAgICAgICAgdGhpcy5zdWJzY3JpcHRpb24gPSB0aGlzLmR0LnRhYmxlU2VydmljZS5zZWxlY3Rpb25Tb3VyY2UkLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNoZWNrZWQgPSB0aGlzLmR0LmlzU2VsZWN0ZWQodGhpcy52YWx1ZSk7XG4gICAgICAgICAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgdGhpcy5jaGVja2VkID0gdGhpcy5kdC5pc1NlbGVjdGVkKHRoaXMudmFsdWUpO1xuICAgIH1cblxuICAgIG9uQ2xpY2soZXZlbnQ6IEV2ZW50KSB7XG4gICAgICAgIGlmICghdGhpcy5kaXNhYmxlZCkge1xuICAgICAgICAgICAgdGhpcy5kdC50b2dnbGVSb3dXaXRoUmFkaW8oe1xuICAgICAgICAgICAgICAgIG9yaWdpbmFsRXZlbnQ6IGV2ZW50LFxuICAgICAgICAgICAgICAgIHJvd0luZGV4OiB0aGlzLmluZGV4XG4gICAgICAgICAgICB9LCB0aGlzLnZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICBEb21IYW5kbGVyLmNsZWFyU2VsZWN0aW9uKCk7XG4gICAgfVxuXG4gICAgb25Gb2N1cygpIHtcbiAgICAgICAgRG9tSGFuZGxlci5hZGRDbGFzcyh0aGlzLmJveFZpZXdDaGlsZC5uYXRpdmVFbGVtZW50LCAncC1mb2N1cycpO1xuICAgIH1cblxuICAgIG9uQmx1cigpIHtcbiAgICAgICAgRG9tSGFuZGxlci5yZW1vdmVDbGFzcyh0aGlzLmJveFZpZXdDaGlsZC5uYXRpdmVFbGVtZW50LCAncC1mb2N1cycpO1xuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCkge1xuICAgICAgICBpZiAodGhpcy5zdWJzY3JpcHRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbn1cblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdwLXRhYmxlQ2hlY2tib3gnLFxuICAgIHRlbXBsYXRlOiBgXG4gICAgICAgIDxkaXYgY2xhc3M9XCJwLWNoZWNrYm94IHAtY29tcG9uZW50XCIgKGNsaWNrKT1cIm9uQ2xpY2soJGV2ZW50KVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInAtaGlkZGVuLWFjY2Vzc2libGVcIj5cbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgW2F0dHIuaWRdPVwiaW5wdXRJZFwiIFthdHRyLm5hbWVdPVwibmFtZVwiIFtjaGVja2VkXT1cImNoZWNrZWRcIiAoZm9jdXMpPVwib25Gb2N1cygpXCIgKGJsdXIpPVwib25CbHVyKClcIiBbZGlzYWJsZWRdPVwiZGlzYWJsZWRcIlxuICAgICAgICAgICAgICAgIFthdHRyLnJlcXVpcmVkXT1cInJlcXVpcmVkXCIgW2F0dHIuYXJpYS1sYWJlbF09XCJhcmlhTGFiZWxcIj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiAjYm94IFtuZ0NsYXNzXT1cInsncC1jaGVja2JveC1ib3ggcC1jb21wb25lbnQnOnRydWUsXG4gICAgICAgICAgICAgICAgJ3AtaGlnaGxpZ2h0JzpjaGVja2VkLCAncC1kaXNhYmxlZCc6ZGlzYWJsZWR9XCIgcm9sZT1cImNoZWNrYm94XCIgW2F0dHIuYXJpYS1jaGVja2VkXT1cImNoZWNrZWRcIj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInAtY2hlY2tib3gtaWNvblwiIFtuZ0NsYXNzXT1cInsncGkgcGktY2hlY2snOmNoZWNrZWR9XCI+PC9zcGFuPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIGAsXG4gICAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gICAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZVxufSlcbmV4cG9ydCBjbGFzcyBUYWJsZUNoZWNrYm94ICB7XG5cbiAgICBASW5wdXQoKSBkaXNhYmxlZDogYm9vbGVhbjtcblxuICAgIEBJbnB1dCgpIHZhbHVlOiBhbnk7XG5cbiAgICBASW5wdXQoKSBpbmRleDogbnVtYmVyO1xuXG4gICAgQElucHV0KCkgaW5wdXRJZDogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgbmFtZTogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgcmVxdWlyZWQ6IGJvb2xlYW47XG5cbiAgICBASW5wdXQoKSBhcmlhTGFiZWw6IHN0cmluZztcblxuICAgIEBWaWV3Q2hpbGQoJ2JveCcpIGJveFZpZXdDaGlsZDogRWxlbWVudFJlZjtcblxuICAgIGNoZWNrZWQ6IGJvb2xlYW47XG5cbiAgICBzdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBkdDogVGFibGUsIHB1YmxpYyB0YWJsZVNlcnZpY2U6IFRhYmxlU2VydmljZSwgcHVibGljIGNkOiBDaGFuZ2VEZXRlY3RvclJlZikge1xuICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbiA9IHRoaXMuZHQudGFibGVTZXJ2aWNlLnNlbGVjdGlvblNvdXJjZSQuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2hlY2tlZCA9IHRoaXMuZHQuaXNTZWxlY3RlZCh0aGlzLnZhbHVlKTtcbiAgICAgICAgICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG5nT25Jbml0KCkge1xuICAgICAgICB0aGlzLmNoZWNrZWQgPSB0aGlzLmR0LmlzU2VsZWN0ZWQodGhpcy52YWx1ZSk7XG4gICAgfVxuXG4gICAgb25DbGljayhldmVudDogRXZlbnQpIHtcbiAgICAgICAgaWYgKCF0aGlzLmRpc2FibGVkKSB7XG4gICAgICAgICAgICB0aGlzLmR0LnRvZ2dsZVJvd1dpdGhDaGVja2JveCh7XG4gICAgICAgICAgICAgICAgb3JpZ2luYWxFdmVudDogZXZlbnQsXG4gICAgICAgICAgICAgICAgcm93SW5kZXg6IHRoaXMuaW5kZXhcbiAgICAgICAgICAgIH0sIHRoaXMudmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIERvbUhhbmRsZXIuY2xlYXJTZWxlY3Rpb24oKTtcbiAgICB9XG5cbiAgICBvbkZvY3VzKCkge1xuICAgICAgICBEb21IYW5kbGVyLmFkZENsYXNzKHRoaXMuYm94Vmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQsICdwLWZvY3VzJyk7XG4gICAgfVxuXG4gICAgb25CbHVyKCkge1xuICAgICAgICBEb21IYW5kbGVyLnJlbW92ZUNsYXNzKHRoaXMuYm94Vmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQsICdwLWZvY3VzJyk7XG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIGlmICh0aGlzLnN1YnNjcmlwdGlvbikge1xuICAgICAgICAgICAgdGhpcy5zdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfVxuICAgIH1cblxufVxuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3AtdGFibGVIZWFkZXJDaGVja2JveCcsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPGRpdiBjbGFzcz1cInAtY2hlY2tib3ggcC1jb21wb25lbnRcIiAoY2xpY2spPVwib25DbGljaygkZXZlbnQpXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicC1oaWRkZW4tYWNjZXNzaWJsZVwiPlxuICAgICAgICAgICAgICAgIDxpbnB1dCAjY2IgdHlwZT1cImNoZWNrYm94XCIgW2F0dHIuaWRdPVwiaW5wdXRJZFwiIFthdHRyLm5hbWVdPVwibmFtZVwiIFtjaGVja2VkXT1cImNoZWNrZWRcIiAoZm9jdXMpPVwib25Gb2N1cygpXCIgKGJsdXIpPVwib25CbHVyKClcIlxuICAgICAgICAgICAgICAgIFtkaXNhYmxlZF09XCJpc0Rpc2FibGVkKClcIiBbYXR0ci5hcmlhLWxhYmVsXT1cImFyaWFMYWJlbFwiPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2ICNib3ggW25nQ2xhc3NdPVwieydwLWNoZWNrYm94LWJveCc6dHJ1ZSxcbiAgICAgICAgICAgICAgICAncC1oaWdobGlnaHQnOmNoZWNrZWQsICdwLWRpc2FibGVkJzogaXNEaXNhYmxlZCgpfVwiIHJvbGU9XCJjaGVja2JveFwiIFthdHRyLmFyaWEtY2hlY2tlZF09XCJjaGVja2VkXCI+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwLWNoZWNrYm94LWljb25cIiBbbmdDbGFzc109XCJ7J3BpIHBpLWNoZWNrJzpjaGVja2VkfVwiPjwvc3Bhbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICBgLFxuICAgIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICAgIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmVcbn0pXG5leHBvcnQgY2xhc3MgVGFibGVIZWFkZXJDaGVja2JveCAge1xuXG4gICAgQFZpZXdDaGlsZCgnYm94JykgYm94Vmlld0NoaWxkOiBFbGVtZW50UmVmO1xuXG4gICAgQElucHV0KCkgZGlzYWJsZWQ6IGJvb2xlYW47XG5cbiAgICBASW5wdXQoKSBpbnB1dElkOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBuYW1lOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBhcmlhTGFiZWw6IHN0cmluZztcblxuICAgIGNoZWNrZWQ6IGJvb2xlYW47XG5cbiAgICBzZWxlY3Rpb25DaGFuZ2VTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICAgIHZhbHVlQ2hhbmdlU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgZHQ6IFRhYmxlLCBwdWJsaWMgdGFibGVTZXJ2aWNlOiBUYWJsZVNlcnZpY2UsIHB1YmxpYyBjZDogQ2hhbmdlRGV0ZWN0b3JSZWYpIHtcbiAgICAgICAgdGhpcy52YWx1ZUNoYW5nZVN1YnNjcmlwdGlvbiA9IHRoaXMuZHQudGFibGVTZXJ2aWNlLnZhbHVlU291cmNlJC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jaGVja2VkID0gdGhpcy51cGRhdGVDaGVja2VkU3RhdGUoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5zZWxlY3Rpb25DaGFuZ2VTdWJzY3JpcHRpb24gPSB0aGlzLmR0LnRhYmxlU2VydmljZS5zZWxlY3Rpb25Tb3VyY2UkLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNoZWNrZWQgPSB0aGlzLnVwZGF0ZUNoZWNrZWRTdGF0ZSgpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgdGhpcy5jaGVja2VkID0gdGhpcy51cGRhdGVDaGVja2VkU3RhdGUoKTtcbiAgICB9XG5cbiAgICBvbkNsaWNrKGV2ZW50OiBFdmVudCkge1xuICAgICAgICBpZiAoIXRoaXMuZGlzYWJsZWQpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmR0LnZhbHVlICYmIHRoaXMuZHQudmFsdWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZHQudG9nZ2xlUm93c1dpdGhDaGVja2JveChldmVudCwgIXRoaXMuY2hlY2tlZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBEb21IYW5kbGVyLmNsZWFyU2VsZWN0aW9uKCk7XG4gICAgfVxuXG4gICAgb25Gb2N1cygpIHtcbiAgICAgICAgRG9tSGFuZGxlci5hZGRDbGFzcyh0aGlzLmJveFZpZXdDaGlsZC5uYXRpdmVFbGVtZW50LCAncC1mb2N1cycpO1xuICAgIH1cblxuICAgIG9uQmx1cigpIHtcbiAgICAgICAgRG9tSGFuZGxlci5yZW1vdmVDbGFzcyh0aGlzLmJveFZpZXdDaGlsZC5uYXRpdmVFbGVtZW50LCAncC1mb2N1cycpO1xuICAgIH1cblxuICAgIGlzRGlzYWJsZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRpc2FibGVkIHx8ICF0aGlzLmR0LnZhbHVlIHx8ICF0aGlzLmR0LnZhbHVlLmxlbmd0aDtcbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHtcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0aW9uQ2hhbmdlU3Vic2NyaXB0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGlvbkNoYW5nZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMudmFsdWVDaGFuZ2VTdWJzY3JpcHRpb24pIHtcbiAgICAgICAgICAgIHRoaXMudmFsdWVDaGFuZ2VTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVwZGF0ZUNoZWNrZWRTdGF0ZSgpIHtcbiAgICAgICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcblxuICAgICAgICBpZiAodGhpcy5kdC5maWx0ZXJlZFZhbHVlKSB7XG4gICAgICAgICAgICBjb25zdCB2YWwgPSB0aGlzLmR0LmZpbHRlcmVkVmFsdWU7XG4gICAgICAgICAgICByZXR1cm4gKHZhbCAmJiB2YWwubGVuZ3RoID4gMCAmJiB0aGlzLmR0LnNlbGVjdGlvbiAmJiB0aGlzLmR0LnNlbGVjdGlvbi5sZW5ndGggPiAwICYmIHRoaXMuaXNBbGxGaWx0ZXJlZFZhbHVlc0NoZWNrZWQoKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zdCB2YWwgPSB0aGlzLmR0LnZhbHVlO1xuICAgICAgICAgICAgcmV0dXJuICh2YWwgJiYgdmFsLmxlbmd0aCA+IDAgJiYgdGhpcy5kdC5zZWxlY3Rpb24gJiYgdGhpcy5kdC5zZWxlY3Rpb24ubGVuZ3RoID4gMCAmJiB0aGlzLmR0LnNlbGVjdGlvbi5sZW5ndGggPT09IHZhbC5sZW5ndGgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaXNBbGxGaWx0ZXJlZFZhbHVlc0NoZWNrZWQoKSB7XG4gICAgICAgIGlmICghdGhpcy5kdC5maWx0ZXJlZFZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBmb3IgKGxldCByb3dEYXRhIG9mIHRoaXMuZHQuZmlsdGVyZWRWYWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5kdC5pc1NlbGVjdGVkKHJvd0RhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxufVxuXG5ARGlyZWN0aXZlKHtcbiAgICBzZWxlY3RvcjogJ1twUmVvcmRlcmFibGVSb3dIYW5kbGVdJ1xufSlcbmV4cG9ydCBjbGFzcyBSZW9yZGVyYWJsZVJvd0hhbmRsZSBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQge1xuXG4gICAgQElucHV0KFwicFJlb3JkZXJhYmxlUm93SGFuZGxlXCIpIGluZGV4OiBudW1iZXI7XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgZWw6IEVsZW1lbnRSZWYpIHt9XG5cbiAgICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgICAgIERvbUhhbmRsZXIuYWRkQ2xhc3ModGhpcy5lbC5uYXRpdmVFbGVtZW50LCAncC1kYXRhdGFibGUtcmVvcmRlcmFibGVyb3ctaGFuZGxlJyk7XG4gICAgfVxufVxuXG5ARGlyZWN0aXZlKHtcbiAgICBzZWxlY3RvcjogJ1twUmVvcmRlcmFibGVSb3ddJ1xufSlcbmV4cG9ydCBjbGFzcyBSZW9yZGVyYWJsZVJvdyBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQge1xuXG4gICAgQElucHV0KFwicFJlb3JkZXJhYmxlUm93XCIpIGluZGV4OiBudW1iZXI7XG5cbiAgICBASW5wdXQoKSBwUmVvcmRlcmFibGVSb3dEaXNhYmxlZDogYm9vbGVhbjtcblxuICAgIG1vdXNlRG93bkxpc3RlbmVyOiBhbnk7XG5cbiAgICBkcmFnU3RhcnRMaXN0ZW5lcjogYW55O1xuXG4gICAgZHJhZ0VuZExpc3RlbmVyOiBhbnk7XG5cbiAgICBkcmFnT3Zlckxpc3RlbmVyOiBhbnk7XG5cbiAgICBkcmFnTGVhdmVMaXN0ZW5lcjogYW55O1xuXG4gICAgZHJvcExpc3RlbmVyOiBhbnk7XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgZHQ6IFRhYmxlLCBwdWJsaWMgZWw6IEVsZW1lbnRSZWYsIHB1YmxpYyB6b25lOiBOZ1pvbmUpIHt9XG5cbiAgICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgICAgIGlmICh0aGlzLmlzRW5hYmxlZCgpKSB7XG4gICAgICAgICAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuZHJvcHBhYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuYmluZEV2ZW50cygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYmluZEV2ZW50cygpIHtcbiAgICAgICAgdGhpcy56b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMubW91c2VEb3duTGlzdGVuZXIgPSB0aGlzLm9uTW91c2VEb3duLmJpbmQodGhpcyk7XG4gICAgICAgICAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5tb3VzZURvd25MaXN0ZW5lcik7XG5cbiAgICAgICAgICAgIHRoaXMuZHJhZ1N0YXJ0TGlzdGVuZXIgPSB0aGlzLm9uRHJhZ1N0YXJ0LmJpbmQodGhpcyk7XG4gICAgICAgICAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ3N0YXJ0JywgdGhpcy5kcmFnU3RhcnRMaXN0ZW5lcik7XG5cbiAgICAgICAgICAgIHRoaXMuZHJhZ0VuZExpc3RlbmVyID0gdGhpcy5vbkRyYWdFbmQuYmluZCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuZWwubmF0aXZlRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdkcmFnZW5kJywgdGhpcy5kcmFnRW5kTGlzdGVuZXIpO1xuXG4gICAgICAgICAgICB0aGlzLmRyYWdPdmVyTGlzdGVuZXIgPSB0aGlzLm9uRHJhZ092ZXIuYmluZCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuZWwubmF0aXZlRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdkcmFnb3ZlcicsIHRoaXMuZHJhZ092ZXJMaXN0ZW5lcik7XG5cbiAgICAgICAgICAgIHRoaXMuZHJhZ0xlYXZlTGlzdGVuZXIgPSB0aGlzLm9uRHJhZ0xlYXZlLmJpbmQodGhpcyk7XG4gICAgICAgICAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ2xlYXZlJywgdGhpcy5kcmFnTGVhdmVMaXN0ZW5lcik7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHVuYmluZEV2ZW50cygpIHtcbiAgICAgICAgaWYgKHRoaXMubW91c2VEb3duTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMubW91c2VEb3duTGlzdGVuZXIpO1xuICAgICAgICAgICAgdGhpcy5tb3VzZURvd25MaXN0ZW5lciA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5kcmFnU3RhcnRMaXN0ZW5lcikge1xuICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignZHJhZ3N0YXJ0JywgdGhpcy5kcmFnU3RhcnRMaXN0ZW5lcik7XG4gICAgICAgICAgICB0aGlzLmRyYWdTdGFydExpc3RlbmVyID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmRyYWdFbmRMaXN0ZW5lcikge1xuICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignZHJhZ2VuZCcsIHRoaXMuZHJhZ0VuZExpc3RlbmVyKTtcbiAgICAgICAgICAgIHRoaXMuZHJhZ0VuZExpc3RlbmVyID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmRyYWdPdmVyTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2RyYWdvdmVyJywgdGhpcy5kcmFnT3Zlckxpc3RlbmVyKTtcbiAgICAgICAgICAgIHRoaXMuZHJhZ092ZXJMaXN0ZW5lciA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5kcmFnTGVhdmVMaXN0ZW5lcikge1xuICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignZHJhZ2xlYXZlJywgdGhpcy5kcmFnTGVhdmVMaXN0ZW5lcik7XG4gICAgICAgICAgICB0aGlzLmRyYWdMZWF2ZUxpc3RlbmVyID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uTW91c2VEb3duKGV2ZW50KSB7XG4gICAgICAgIGlmIChEb21IYW5kbGVyLmhhc0NsYXNzKGV2ZW50LnRhcmdldCwgJ3AtZGF0YXRhYmxlLXJlb3JkZXJhYmxlcm93LWhhbmRsZScpKVxuICAgICAgICAgICAgdGhpcy5lbC5uYXRpdmVFbGVtZW50LmRyYWdnYWJsZSA9IHRydWU7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHRoaXMuZWwubmF0aXZlRWxlbWVudC5kcmFnZ2FibGUgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBvbkRyYWdTdGFydChldmVudCkge1xuICAgICAgICB0aGlzLmR0Lm9uUm93RHJhZ1N0YXJ0KGV2ZW50LCB0aGlzLmluZGV4KTtcbiAgICB9XG5cbiAgICBvbkRyYWdFbmQoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5kdC5vblJvd0RyYWdFbmQoZXZlbnQpO1xuICAgICAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuZHJhZ2dhYmxlID0gZmFsc2U7XG4gICAgfVxuXG4gICAgb25EcmFnT3ZlcihldmVudCkge1xuICAgICAgICB0aGlzLmR0Lm9uUm93RHJhZ092ZXIoZXZlbnQsIHRoaXMuaW5kZXgsIHRoaXMuZWwubmF0aXZlRWxlbWVudCk7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuXG4gICAgb25EcmFnTGVhdmUoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5kdC5vblJvd0RyYWdMZWF2ZShldmVudCwgdGhpcy5lbC5uYXRpdmVFbGVtZW50KTtcbiAgICB9XG5cbiAgICBpc0VuYWJsZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBSZW9yZGVyYWJsZVJvd0Rpc2FibGVkICE9PSB0cnVlO1xuICAgIH1cblxuICAgIEBIb3N0TGlzdGVuZXIoJ2Ryb3AnLCBbJyRldmVudCddKVxuICAgIG9uRHJvcChldmVudCkge1xuICAgICAgICBpZiAodGhpcy5pc0VuYWJsZWQoKSAmJiB0aGlzLmR0LnJvd0RyYWdnaW5nKSB7XG4gICAgICAgICAgICB0aGlzLmR0Lm9uUm93RHJvcChldmVudCwgdGhpcy5lbC5uYXRpdmVFbGVtZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICB9XG59XG5cbkBOZ01vZHVsZSh7XG4gICAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSxQYWdpbmF0b3JNb2R1bGUsU2Nyb2xsaW5nTW9kdWxlXSxcbiAgICBleHBvcnRzOiBbVGFibGUsU2hhcmVkTW9kdWxlLFNvcnRhYmxlQ29sdW1uLFNlbGVjdGFibGVSb3csUm93VG9nZ2xlcixDb250ZXh0TWVudVJvdyxSZXNpemFibGVDb2x1bW4sUmVvcmRlcmFibGVDb2x1bW4sRWRpdGFibGVDb2x1bW4sQ2VsbEVkaXRvcixTb3J0SWNvbixUYWJsZVJhZGlvQnV0dG9uLFRhYmxlQ2hlY2tib3gsVGFibGVIZWFkZXJDaGVja2JveCxSZW9yZGVyYWJsZVJvd0hhbmRsZSxSZW9yZGVyYWJsZVJvdyxTZWxlY3RhYmxlUm93RGJsQ2xpY2ssRWRpdGFibGVSb3csSW5pdEVkaXRhYmxlUm93LFNhdmVFZGl0YWJsZVJvdyxDYW5jZWxFZGl0YWJsZVJvdyxTY3JvbGxpbmdNb2R1bGVdLFxuICAgIGRlY2xhcmF0aW9uczogW1RhYmxlLFNvcnRhYmxlQ29sdW1uLFNlbGVjdGFibGVSb3csUm93VG9nZ2xlcixDb250ZXh0TWVudVJvdyxSZXNpemFibGVDb2x1bW4sUmVvcmRlcmFibGVDb2x1bW4sRWRpdGFibGVDb2x1bW4sQ2VsbEVkaXRvcixUYWJsZUJvZHksU2Nyb2xsYWJsZVZpZXcsU29ydEljb24sVGFibGVSYWRpb0J1dHRvbixUYWJsZUNoZWNrYm94LFRhYmxlSGVhZGVyQ2hlY2tib3gsUmVvcmRlcmFibGVSb3dIYW5kbGUsUmVvcmRlcmFibGVSb3csU2VsZWN0YWJsZVJvd0RibENsaWNrLEVkaXRhYmxlUm93LEluaXRFZGl0YWJsZVJvdyxTYXZlRWRpdGFibGVSb3csQ2FuY2VsRWRpdGFibGVSb3ddXG59KVxuZXhwb3J0IGNsYXNzIFRhYmxlTW9kdWxlIHsgfVxuIl19