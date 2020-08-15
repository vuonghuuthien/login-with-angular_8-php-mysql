(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('@angular/forms'), require('primeng/dropdown'), require('primeng/ripple'), require('primeng/api')) :
    typeof define === 'function' && define.amd ? define('primeng/paginator', ['exports', '@angular/core', '@angular/common', '@angular/forms', 'primeng/dropdown', 'primeng/ripple', 'primeng/api'], factory) :
    (global = global || self, factory((global.primeng = global.primeng || {}, global.primeng.paginator = {}), global.ng.core, global.ng.common, global.ng.forms, global.primeng.dropdown, global.primeng.ripple, global.primeng.api));
}(this, (function (exports, core, common, forms, dropdown, ripple, api) { 'use strict';

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
    var Paginator = /** @class */ (function () {
        function Paginator(cd) {
            this.cd = cd;
            this.pageLinkSize = 5;
            this.onPageChange = new core.EventEmitter();
            this.alwaysShow = true;
            this.dropdownScrollHeight = '200px';
            this.currentPageReportTemplate = '{currentPage} of {totalPages}';
            this.totalRecords = 0;
            this.rows = 0;
            this._first = 0;
        }
        Paginator.prototype.ngOnInit = function () {
            this.updatePaginatorState();
        };
        Paginator.prototype.ngOnChanges = function (simpleChange) {
            if (simpleChange.totalRecords) {
                this.updatePageLinks();
                this.updatePaginatorState();
                this.updateFirst();
                this.updateRowsPerPageOptions();
            }
            if (simpleChange.first) {
                this._first = simpleChange.first.currentValue;
                this.updatePageLinks();
                this.updatePaginatorState();
            }
            if (simpleChange.rows) {
                this.updatePageLinks();
                this.updatePaginatorState();
            }
            if (simpleChange.rowsPerPageOptions) {
                this.updateRowsPerPageOptions();
            }
        };
        Object.defineProperty(Paginator.prototype, "first", {
            get: function () {
                return this._first;
            },
            set: function (val) {
                this._first = val;
            },
            enumerable: false,
            configurable: true
        });
        Paginator.prototype.updateRowsPerPageOptions = function () {
            var e_1, _a;
            if (this.rowsPerPageOptions) {
                this.rowsPerPageItems = [];
                try {
                    for (var _b = __values(this.rowsPerPageOptions), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var opt = _c.value;
                        if (typeof opt == 'object' && opt['showAll']) {
                            this.rowsPerPageItems.unshift({ label: opt['showAll'], value: this.totalRecords });
                        }
                        else {
                            this.rowsPerPageItems.push({ label: String(opt), value: opt });
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
            }
        };
        Paginator.prototype.isFirstPage = function () {
            return this.getPage() === 0;
        };
        Paginator.prototype.isLastPage = function () {
            return this.getPage() === this.getPageCount() - 1;
        };
        Paginator.prototype.getPageCount = function () {
            return Math.ceil(this.totalRecords / this.rows) || 1;
        };
        Paginator.prototype.calculatePageLinkBoundaries = function () {
            var numberOfPages = this.getPageCount(), visiblePages = Math.min(this.pageLinkSize, numberOfPages);
            //calculate range, keep current in middle if necessary
            var start = Math.max(0, Math.ceil(this.getPage() - ((visiblePages) / 2))), end = Math.min(numberOfPages - 1, start + visiblePages - 1);
            //check when approaching to last page
            var delta = this.pageLinkSize - (end - start + 1);
            start = Math.max(0, start - delta);
            return [start, end];
        };
        Paginator.prototype.updatePageLinks = function () {
            this.pageLinks = [];
            var boundaries = this.calculatePageLinkBoundaries(), start = boundaries[0], end = boundaries[1];
            for (var i = start; i <= end; i++) {
                this.pageLinks.push(i + 1);
            }
        };
        Paginator.prototype.changePage = function (p) {
            var pc = this.getPageCount();
            if (p >= 0 && p < pc) {
                this._first = this.rows * p;
                var state = {
                    page: p,
                    first: this.first,
                    rows: this.rows,
                    pageCount: pc
                };
                this.updatePageLinks();
                this.onPageChange.emit(state);
                this.updatePaginatorState();
            }
        };
        Paginator.prototype.updateFirst = function () {
            var _this = this;
            var page = this.getPage();
            if (page > 0 && this.totalRecords && (this.first >= this.totalRecords)) {
                Promise.resolve(null).then(function () { return _this.changePage(page - 1); });
            }
        };
        Paginator.prototype.getPage = function () {
            return Math.floor(this.first / this.rows);
        };
        Paginator.prototype.changePageToFirst = function (event) {
            if (!this.isFirstPage()) {
                this.changePage(0);
            }
            event.preventDefault();
        };
        Paginator.prototype.changePageToPrev = function (event) {
            this.changePage(this.getPage() - 1);
            event.preventDefault();
        };
        Paginator.prototype.changePageToNext = function (event) {
            this.changePage(this.getPage() + 1);
            event.preventDefault();
        };
        Paginator.prototype.changePageToLast = function (event) {
            if (!this.isLastPage()) {
                this.changePage(this.getPageCount() - 1);
            }
            event.preventDefault();
        };
        Paginator.prototype.onPageLinkClick = function (event, page) {
            this.changePage(page);
            event.preventDefault();
        };
        Paginator.prototype.onRppChange = function (event) {
            this.changePage(this.getPage());
        };
        Paginator.prototype.updatePaginatorState = function () {
            this.paginatorState = {
                page: this.getPage(),
                pageCount: this.getPageCount(),
                rows: this.rows,
                first: this.first,
                totalRecords: this.totalRecords
            };
        };
        Object.defineProperty(Paginator.prototype, "currentPageReport", {
            get: function () {
                return this.currentPageReportTemplate
                    .replace("{currentPage}", String(this.getPage() + 1))
                    .replace("{totalPages}", String(this.getPageCount()))
                    .replace("{first}", String(this._first + 1))
                    .replace("{last}", String(Math.min(this._first + this.rows, this.totalRecords)))
                    .replace("{rows}", String(this.rows))
                    .replace("{totalRecords}", String(this.totalRecords));
            },
            enumerable: false,
            configurable: true
        });
        Paginator.ctorParameters = function () { return [
            { type: core.ChangeDetectorRef }
        ]; };
        Paginator.decorators = [
            { type: core.Component, args: [{
                        selector: 'p-paginator',
                        template: "\n        <div [class]=\"styleClass\" [ngStyle]=\"style\" [ngClass]=\"'p-paginator p-component'\" *ngIf=\"alwaysShow ? true : (pageLinks && pageLinks.length > 1)\">\n            <div class=\"p-paginator-left-content\" *ngIf=\"templateLeft\">\n                <ng-container *ngTemplateOutlet=\"templateLeft; context: {$implicit: paginatorState}\"></ng-container>\n            </div>\n            <span class=\"p-paginator-current\" *ngIf=\"showCurrentPageReport\">{{currentPageReport}}</span>\n            <button type=\"button\" [disabled]=\"isFirstPage()\" (click)=\"changePageToFirst($event)\" pRipple\n                    class=\"p-paginator-first p-paginator-element p-link\" [ngClass]=\"{'p-disabled':isFirstPage()}\">\n                <span class=\"p-paginator-icon pi pi-angle-double-left\"></span>\n            </button>\n            <button type=\"button\" [disabled]=\"isFirstPage()\" (click)=\"changePageToPrev($event)\" pRipple\n                    class=\"p-paginator-prev p-paginator-element p-link\" [ngClass]=\"{'p-disabled':isFirstPage()}\">\n                <span class=\"p-paginator-icon pi pi-angle-left\"></span>\n            </button>\n            <span class=\"p-paginator-pages\">\n                <button type=\"button\" *ngFor=\"let pageLink of pageLinks\" class=\"p-paginator-page p-paginator-element p-link\" [ngClass]=\"{'p-highlight': (pageLink-1 == getPage())}\"\n                    (click)=\"onPageLinkClick($event, pageLink - 1)\" pRipple>{{pageLink}}</button>\n            </span>\n            <button type=\"button\" [disabled]=\"isLastPage()\" (click)=\"changePageToNext($event)\" pRipple\n                    class=\"p-paginator-next p-paginator-element p-link\" [ngClass]=\"{'p-disabled':isLastPage()}\">\n                <span class=\"p-paginator-icon pi pi-angle-right\"></span>\n            </button>\n            <button type=\"button\" [disabled]=\"isLastPage()\" (click)=\"changePageToLast($event)\" pRipple\n                    class=\"p-paginator-last p-paginator-element p-link\" [ngClass]=\"{'p-disabled':isLastPage()}\">\n                <span class=\"p-paginator-icon pi pi-angle-double-right\"></span>\n            </button>\n            <p-dropdown [options]=\"rowsPerPageItems\" [(ngModel)]=\"rows\" *ngIf=\"rowsPerPageOptions\"\n                (onChange)=\"onRppChange($event)\" [appendTo]=\"dropdownAppendTo\" [scrollHeight]=\"dropdownScrollHeight\"></p-dropdown>\n            <div class=\"p-paginator-right-content\" *ngIf=\"templateRight\">\n                <ng-container *ngTemplateOutlet=\"templateRight; context: {$implicit: paginatorState}\"></ng-container>\n            </div>\n        </div>\n    ",
                        changeDetection: core.ChangeDetectionStrategy.OnPush,
                        encapsulation: core.ViewEncapsulation.None,
                        styles: [".p-paginator{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;-ms-flex-wrap:wrap;flex-wrap:wrap}.p-paginator-left-content{margin-right:auto}.p-paginator-right-content{margin-left:auto}.p-paginator-current,.p-paginator-first,.p-paginator-last,.p-paginator-next,.p-paginator-page,.p-paginator-prev{cursor:pointer;display:-ms-inline-flexbox;display:inline-flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;line-height:1;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;overflow:hidden;position:relative}.p-paginator-element:focus{z-index:1;position:relative}"]
                    },] }
        ];
        Paginator.ctorParameters = function () { return [
            { type: core.ChangeDetectorRef }
        ]; };
        Paginator.propDecorators = {
            pageLinkSize: [{ type: core.Input }],
            onPageChange: [{ type: core.Output }],
            style: [{ type: core.Input }],
            styleClass: [{ type: core.Input }],
            alwaysShow: [{ type: core.Input }],
            templateLeft: [{ type: core.Input }],
            templateRight: [{ type: core.Input }],
            dropdownAppendTo: [{ type: core.Input }],
            dropdownScrollHeight: [{ type: core.Input }],
            currentPageReportTemplate: [{ type: core.Input }],
            showCurrentPageReport: [{ type: core.Input }],
            totalRecords: [{ type: core.Input }],
            rows: [{ type: core.Input }],
            rowsPerPageOptions: [{ type: core.Input }],
            first: [{ type: core.Input }]
        };
        return Paginator;
    }());
    var PaginatorModule = /** @class */ (function () {
        function PaginatorModule() {
        }
        PaginatorModule.decorators = [
            { type: core.NgModule, args: [{
                        imports: [common.CommonModule, dropdown.DropdownModule, forms.FormsModule, api.SharedModule, ripple.RippleModule],
                        exports: [Paginator, dropdown.DropdownModule, forms.FormsModule, api.SharedModule],
                        declarations: [Paginator]
                    },] }
        ];
        return PaginatorModule;
    }());

    exports.Paginator = Paginator;
    exports.PaginatorModule = PaginatorModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=primeng-paginator.umd.js.map
