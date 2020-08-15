import { NgModule, Component, OnInit, Input, Output, ChangeDetectorRef, EventEmitter, TemplateRef, OnChanges, SimpleChanges, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { RippleModule } from 'primeng/ripple';
import { SharedModule } from 'primeng/api';
export class Paginator {
    constructor(cd) {
        this.cd = cd;
        this.pageLinkSize = 5;
        this.onPageChange = new EventEmitter();
        this.alwaysShow = true;
        this.dropdownScrollHeight = '200px';
        this.currentPageReportTemplate = '{currentPage} of {totalPages}';
        this.totalRecords = 0;
        this.rows = 0;
        this._first = 0;
    }
    ngOnInit() {
        this.updatePaginatorState();
    }
    ngOnChanges(simpleChange) {
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
    }
    get first() {
        return this._first;
    }
    set first(val) {
        this._first = val;
    }
    updateRowsPerPageOptions() {
        if (this.rowsPerPageOptions) {
            this.rowsPerPageItems = [];
            for (let opt of this.rowsPerPageOptions) {
                if (typeof opt == 'object' && opt['showAll']) {
                    this.rowsPerPageItems.unshift({ label: opt['showAll'], value: this.totalRecords });
                }
                else {
                    this.rowsPerPageItems.push({ label: String(opt), value: opt });
                }
            }
        }
    }
    isFirstPage() {
        return this.getPage() === 0;
    }
    isLastPage() {
        return this.getPage() === this.getPageCount() - 1;
    }
    getPageCount() {
        return Math.ceil(this.totalRecords / this.rows) || 1;
    }
    calculatePageLinkBoundaries() {
        let numberOfPages = this.getPageCount(), visiblePages = Math.min(this.pageLinkSize, numberOfPages);
        //calculate range, keep current in middle if necessary
        let start = Math.max(0, Math.ceil(this.getPage() - ((visiblePages) / 2))), end = Math.min(numberOfPages - 1, start + visiblePages - 1);
        //check when approaching to last page
        var delta = this.pageLinkSize - (end - start + 1);
        start = Math.max(0, start - delta);
        return [start, end];
    }
    updatePageLinks() {
        this.pageLinks = [];
        let boundaries = this.calculatePageLinkBoundaries(), start = boundaries[0], end = boundaries[1];
        for (let i = start; i <= end; i++) {
            this.pageLinks.push(i + 1);
        }
    }
    changePage(p) {
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
    }
    updateFirst() {
        const page = this.getPage();
        if (page > 0 && this.totalRecords && (this.first >= this.totalRecords)) {
            Promise.resolve(null).then(() => this.changePage(page - 1));
        }
    }
    getPage() {
        return Math.floor(this.first / this.rows);
    }
    changePageToFirst(event) {
        if (!this.isFirstPage()) {
            this.changePage(0);
        }
        event.preventDefault();
    }
    changePageToPrev(event) {
        this.changePage(this.getPage() - 1);
        event.preventDefault();
    }
    changePageToNext(event) {
        this.changePage(this.getPage() + 1);
        event.preventDefault();
    }
    changePageToLast(event) {
        if (!this.isLastPage()) {
            this.changePage(this.getPageCount() - 1);
        }
        event.preventDefault();
    }
    onPageLinkClick(event, page) {
        this.changePage(page);
        event.preventDefault();
    }
    onRppChange(event) {
        this.changePage(this.getPage());
    }
    updatePaginatorState() {
        this.paginatorState = {
            page: this.getPage(),
            pageCount: this.getPageCount(),
            rows: this.rows,
            first: this.first,
            totalRecords: this.totalRecords
        };
    }
    get currentPageReport() {
        return this.currentPageReportTemplate
            .replace("{currentPage}", String(this.getPage() + 1))
            .replace("{totalPages}", String(this.getPageCount()))
            .replace("{first}", String(this._first + 1))
            .replace("{last}", String(Math.min(this._first + this.rows, this.totalRecords)))
            .replace("{rows}", String(this.rows))
            .replace("{totalRecords}", String(this.totalRecords));
    }
}
Paginator.ctorParameters = () => [
    { type: ChangeDetectorRef }
];
Paginator.decorators = [
    { type: Component, args: [{
                selector: 'p-paginator',
                template: `
        <div [class]="styleClass" [ngStyle]="style" [ngClass]="'p-paginator p-component'" *ngIf="alwaysShow ? true : (pageLinks && pageLinks.length > 1)">
            <div class="p-paginator-left-content" *ngIf="templateLeft">
                <ng-container *ngTemplateOutlet="templateLeft; context: {$implicit: paginatorState}"></ng-container>
            </div>
            <span class="p-paginator-current" *ngIf="showCurrentPageReport">{{currentPageReport}}</span>
            <button type="button" [disabled]="isFirstPage()" (click)="changePageToFirst($event)" pRipple
                    class="p-paginator-first p-paginator-element p-link" [ngClass]="{'p-disabled':isFirstPage()}">
                <span class="p-paginator-icon pi pi-angle-double-left"></span>
            </button>
            <button type="button" [disabled]="isFirstPage()" (click)="changePageToPrev($event)" pRipple
                    class="p-paginator-prev p-paginator-element p-link" [ngClass]="{'p-disabled':isFirstPage()}">
                <span class="p-paginator-icon pi pi-angle-left"></span>
            </button>
            <span class="p-paginator-pages">
                <button type="button" *ngFor="let pageLink of pageLinks" class="p-paginator-page p-paginator-element p-link" [ngClass]="{'p-highlight': (pageLink-1 == getPage())}"
                    (click)="onPageLinkClick($event, pageLink - 1)" pRipple>{{pageLink}}</button>
            </span>
            <button type="button" [disabled]="isLastPage()" (click)="changePageToNext($event)" pRipple
                    class="p-paginator-next p-paginator-element p-link" [ngClass]="{'p-disabled':isLastPage()}">
                <span class="p-paginator-icon pi pi-angle-right"></span>
            </button>
            <button type="button" [disabled]="isLastPage()" (click)="changePageToLast($event)" pRipple
                    class="p-paginator-last p-paginator-element p-link" [ngClass]="{'p-disabled':isLastPage()}">
                <span class="p-paginator-icon pi pi-angle-double-right"></span>
            </button>
            <p-dropdown [options]="rowsPerPageItems" [(ngModel)]="rows" *ngIf="rowsPerPageOptions"
                (onChange)="onRppChange($event)" [appendTo]="dropdownAppendTo" [scrollHeight]="dropdownScrollHeight"></p-dropdown>
            <div class="p-paginator-right-content" *ngIf="templateRight">
                <ng-container *ngTemplateOutlet="templateRight; context: {$implicit: paginatorState}"></ng-container>
            </div>
        </div>
    `,
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                styles: [".p-paginator{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;-ms-flex-wrap:wrap;flex-wrap:wrap}.p-paginator-left-content{margin-right:auto}.p-paginator-right-content{margin-left:auto}.p-paginator-current,.p-paginator-first,.p-paginator-last,.p-paginator-next,.p-paginator-page,.p-paginator-prev{cursor:pointer;display:-ms-inline-flexbox;display:inline-flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;line-height:1;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;overflow:hidden;position:relative}.p-paginator-element:focus{z-index:1;position:relative}"]
            },] }
];
Paginator.ctorParameters = () => [
    { type: ChangeDetectorRef }
];
Paginator.propDecorators = {
    pageLinkSize: [{ type: Input }],
    onPageChange: [{ type: Output }],
    style: [{ type: Input }],
    styleClass: [{ type: Input }],
    alwaysShow: [{ type: Input }],
    templateLeft: [{ type: Input }],
    templateRight: [{ type: Input }],
    dropdownAppendTo: [{ type: Input }],
    dropdownScrollHeight: [{ type: Input }],
    currentPageReportTemplate: [{ type: Input }],
    showCurrentPageReport: [{ type: Input }],
    totalRecords: [{ type: Input }],
    rows: [{ type: Input }],
    rowsPerPageOptions: [{ type: Input }],
    first: [{ type: Input }]
};
export class PaginatorModule {
}
PaginatorModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule, DropdownModule, FormsModule, SharedModule, RippleModule],
                exports: [Paginator, DropdownModule, FormsModule, SharedModule],
                declarations: [Paginator]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnaW5hdG9yLmpzIiwic291cmNlUm9vdCI6Im5nOi8vcHJpbWVuZy9wYWdpbmF0b3IvIiwic291cmNlcyI6WyJwYWdpbmF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFFBQVEsRUFBQyxTQUFTLEVBQUMsTUFBTSxFQUFDLEtBQUssRUFBQyxNQUFNLEVBQUMsaUJBQWlCLEVBQUMsWUFBWSxFQUFDLFdBQVcsRUFBQyxTQUFTLEVBQUMsYUFBYSxFQUFDLHVCQUF1QixFQUFFLGlCQUFpQixFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ25MLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUM3QyxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDM0MsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLGtCQUFrQixDQUFDO0FBRWhELE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUM1QyxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBeUN6QyxNQUFNLE9BQU8sU0FBUztJQXNDbEIsWUFBb0IsRUFBcUI7UUFBckIsT0FBRSxHQUFGLEVBQUUsQ0FBbUI7UUFwQ2hDLGlCQUFZLEdBQVcsQ0FBQyxDQUFDO1FBRXhCLGlCQUFZLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFNdEQsZUFBVSxHQUFZLElBQUksQ0FBQztRQVEzQix5QkFBb0IsR0FBVyxPQUFPLENBQUM7UUFFdkMsOEJBQXlCLEdBQVcsK0JBQStCLENBQUM7UUFJcEUsaUJBQVksR0FBVyxDQUFDLENBQUM7UUFFekIsU0FBSSxHQUFXLENBQUMsQ0FBQztRQVUxQixXQUFNLEdBQVcsQ0FBQyxDQUFDO0lBRXlCLENBQUM7SUFFN0MsUUFBUTtRQUNKLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO0lBQ2hDLENBQUM7SUFFRCxXQUFXLENBQUMsWUFBMkI7UUFDbkMsSUFBSSxZQUFZLENBQUMsWUFBWSxFQUFFO1lBQzNCLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUN2QixJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztZQUM1QixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDbkIsSUFBSSxDQUFDLHdCQUF3QixFQUFFLENBQUM7U0FDbkM7UUFFRCxJQUFJLFlBQVksQ0FBQyxLQUFLLEVBQUU7WUFDcEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxZQUFZLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQztZQUM5QyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDdkIsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7U0FDL0I7UUFFRCxJQUFJLFlBQVksQ0FBQyxJQUFJLEVBQUU7WUFDbkIsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1NBQy9CO1FBRUQsSUFBSSxZQUFZLENBQUMsa0JBQWtCLEVBQUU7WUFDakMsSUFBSSxDQUFDLHdCQUF3QixFQUFFLENBQUM7U0FDbkM7SUFDTCxDQUFDO0lBRUQsSUFBYSxLQUFLO1FBQ2QsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3ZCLENBQUM7SUFDRCxJQUFJLEtBQUssQ0FBQyxHQUFVO1FBQ2hCLElBQUksQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO0lBQ3RCLENBQUM7SUFFRCx3QkFBd0I7UUFDcEIsSUFBSSxJQUFJLENBQUMsa0JBQWtCLEVBQUU7WUFDekIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEVBQUUsQ0FBQztZQUMzQixLQUFLLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxrQkFBa0IsRUFBRTtnQkFDckMsSUFBSSxPQUFPLEdBQUcsSUFBSSxRQUFRLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxFQUFFO29CQUMxQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLEVBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxTQUFTLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLFlBQVksRUFBQyxDQUFDLENBQUM7aUJBQ3BGO3FCQUNJO29CQUNELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsRUFBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUMsQ0FBQyxDQUFDO2lCQUNoRTthQUNKO1NBQ0o7SUFDTCxDQUFDO0lBRUQsV0FBVztRQUNQLE9BQU8sSUFBSSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBRUQsVUFBVTtRQUNOLE9BQU8sSUFBSSxDQUFDLE9BQU8sRUFBRSxLQUFLLElBQUksQ0FBQyxZQUFZLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDdEQsQ0FBQztJQUVELFlBQVk7UUFDUixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksR0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUUsQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFFRCwyQkFBMkI7UUFDdkIsSUFBSSxhQUFhLEdBQUcsSUFBSSxDQUFDLFlBQVksRUFBRSxFQUN2QyxZQUFZLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBRTFELHNEQUFzRDtRQUN0RCxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUN6RSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxZQUFZLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFFNUQscUNBQXFDO1FBQ3JDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ2xELEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUM7UUFFbkMsT0FBTyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztJQUN4QixDQUFDO0lBRUQsZUFBZTtRQUNYLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO1FBQ3BCLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQywyQkFBMkIsRUFBRSxFQUNuRCxLQUFLLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUNyQixHQUFHLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXBCLEtBQUksSUFBSSxDQUFDLEdBQUcsS0FBSyxFQUFFLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDOUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1NBQzlCO0lBQ0wsQ0FBQztJQUVELFVBQVUsQ0FBQyxDQUFTO1FBQ2hCLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUU3QixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsRUFBRTtZQUNsQixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO1lBQzVCLElBQUksS0FBSyxHQUFHO2dCQUNSLElBQUksRUFBRSxDQUFDO2dCQUNQLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztnQkFDakIsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO2dCQUNmLFNBQVMsRUFBRSxFQUFFO2FBQ2hCLENBQUM7WUFDRixJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7WUFFdkIsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDOUIsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7U0FDL0I7SUFDTCxDQUFDO0lBRUQsV0FBVztRQUNQLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUM1QixJQUFJLElBQUksR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLFlBQVksSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFO1lBQ3BFLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDL0Q7SUFDTCxDQUFDO0lBRUQsT0FBTztRQUNILE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBRUQsaUJBQWlCLENBQUMsS0FBSztRQUNyQixJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxFQUFDO1lBQ3BCLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDdEI7UUFFRCxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDekIsQ0FBQztJQUVELGdCQUFnQixDQUFDLEtBQUs7UUFDbEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDcEMsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQzNCLENBQUM7SUFFRCxnQkFBZ0IsQ0FBQyxLQUFLO1FBQ2xCLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxHQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3JDLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUMzQixDQUFDO0lBRUQsZ0JBQWdCLENBQUMsS0FBSztRQUNwQixJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxFQUFDO1lBQ25CLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1NBQzVDO1FBRUQsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQ3pCLENBQUM7SUFFRCxlQUFlLENBQUMsS0FBSyxFQUFFLElBQUk7UUFDdkIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN0QixLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDM0IsQ0FBQztJQUVELFdBQVcsQ0FBQyxLQUFLO1FBQ2IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztJQUNwQyxDQUFDO0lBRUQsb0JBQW9CO1FBQ2hCLElBQUksQ0FBQyxjQUFjLEdBQUc7WUFDbEIsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDcEIsU0FBUyxFQUFFLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDOUIsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO1lBQ2YsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO1lBQ2pCLFlBQVksRUFBRSxJQUFJLENBQUMsWUFBWTtTQUNsQyxDQUFBO0lBQ0wsQ0FBQztJQUVELElBQUksaUJBQWlCO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLHlCQUF5QjthQUM1QixPQUFPLENBQUMsZUFBZSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7YUFDcEQsT0FBTyxDQUFDLGNBQWMsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUM7YUFDcEQsT0FBTyxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQzthQUMzQyxPQUFPLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQzthQUMvRSxPQUFPLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDcEMsT0FBTyxDQUFDLGdCQUFnQixFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztJQUNsRSxDQUFDOzs7WUEzS3VCLGlCQUFpQjs7O1lBN0U1QyxTQUFTLFNBQUM7Z0JBQ1AsUUFBUSxFQUFFLGFBQWE7Z0JBQ3ZCLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7S0FnQ1Q7Z0JBQ0QsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07Z0JBQy9DLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJOzthQUV4Qzs7O1lBOUM4QyxpQkFBaUI7OzsyQkFpRDNELEtBQUs7MkJBRUwsTUFBTTtvQkFFTixLQUFLO3lCQUVMLEtBQUs7eUJBRUwsS0FBSzsyQkFFTCxLQUFLOzRCQUVMLEtBQUs7K0JBRUwsS0FBSzttQ0FFTCxLQUFLO3dDQUVMLEtBQUs7b0NBRUwsS0FBSzsyQkFFTCxLQUFLO21CQUVMLEtBQUs7aUNBRUwsS0FBSztvQkF3Q0wsS0FBSzs7QUFxSlYsTUFBTSxPQUFPLGVBQWU7OztZQUwzQixRQUFRLFNBQUM7Z0JBQ04sT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFDLGNBQWMsRUFBQyxXQUFXLEVBQUMsWUFBWSxFQUFDLFlBQVksQ0FBQztnQkFDNUUsT0FBTyxFQUFFLENBQUMsU0FBUyxFQUFDLGNBQWMsRUFBQyxXQUFXLEVBQUMsWUFBWSxDQUFDO2dCQUM1RCxZQUFZLEVBQUUsQ0FBQyxTQUFTLENBQUM7YUFDNUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge05nTW9kdWxlLENvbXBvbmVudCxPbkluaXQsSW5wdXQsT3V0cHV0LENoYW5nZURldGVjdG9yUmVmLEV2ZW50RW1pdHRlcixUZW1wbGF0ZVJlZixPbkNoYW5nZXMsU2ltcGxlQ2hhbmdlcyxDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgVmlld0VuY2Fwc3VsYXRpb259IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge0Zvcm1zTW9kdWxlfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge0Ryb3Bkb3duTW9kdWxlfSBmcm9tICdwcmltZW5nL2Ryb3Bkb3duJztcbmltcG9ydCB7U2VsZWN0SXRlbX0gZnJvbSAncHJpbWVuZy9hcGknO1xuaW1wb3J0IHtSaXBwbGVNb2R1bGV9IGZyb20gJ3ByaW1lbmcvcmlwcGxlJztcbmltcG9ydCB7U2hhcmVkTW9kdWxlfSBmcm9tICdwcmltZW5nL2FwaSc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAncC1wYWdpbmF0b3InLFxuICAgIHRlbXBsYXRlOiBgXG4gICAgICAgIDxkaXYgW2NsYXNzXT1cInN0eWxlQ2xhc3NcIiBbbmdTdHlsZV09XCJzdHlsZVwiIFtuZ0NsYXNzXT1cIidwLXBhZ2luYXRvciBwLWNvbXBvbmVudCdcIiAqbmdJZj1cImFsd2F5c1Nob3cgPyB0cnVlIDogKHBhZ2VMaW5rcyAmJiBwYWdlTGlua3MubGVuZ3RoID4gMSlcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwLXBhZ2luYXRvci1sZWZ0LWNvbnRlbnRcIiAqbmdJZj1cInRlbXBsYXRlTGVmdFwiPlxuICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJ0ZW1wbGF0ZUxlZnQ7IGNvbnRleHQ6IHskaW1wbGljaXQ6IHBhZ2luYXRvclN0YXRlfVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cInAtcGFnaW5hdG9yLWN1cnJlbnRcIiAqbmdJZj1cInNob3dDdXJyZW50UGFnZVJlcG9ydFwiPnt7Y3VycmVudFBhZ2VSZXBvcnR9fTwvc3Bhbj5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIFtkaXNhYmxlZF09XCJpc0ZpcnN0UGFnZSgpXCIgKGNsaWNrKT1cImNoYW5nZVBhZ2VUb0ZpcnN0KCRldmVudClcIiBwUmlwcGxlXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzPVwicC1wYWdpbmF0b3ItZmlyc3QgcC1wYWdpbmF0b3ItZWxlbWVudCBwLWxpbmtcIiBbbmdDbGFzc109XCJ7J3AtZGlzYWJsZWQnOmlzRmlyc3RQYWdlKCl9XCI+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwLXBhZ2luYXRvci1pY29uIHBpIHBpLWFuZ2xlLWRvdWJsZS1sZWZ0XCI+PC9zcGFuPlxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBbZGlzYWJsZWRdPVwiaXNGaXJzdFBhZ2UoKVwiIChjbGljayk9XCJjaGFuZ2VQYWdlVG9QcmV2KCRldmVudClcIiBwUmlwcGxlXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzPVwicC1wYWdpbmF0b3ItcHJldiBwLXBhZ2luYXRvci1lbGVtZW50IHAtbGlua1wiIFtuZ0NsYXNzXT1cInsncC1kaXNhYmxlZCc6aXNGaXJzdFBhZ2UoKX1cIj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInAtcGFnaW5hdG9yLWljb24gcGkgcGktYW5nbGUtbGVmdFwiPjwvc3Bhbj5cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwLXBhZ2luYXRvci1wYWdlc1wiPlxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiICpuZ0Zvcj1cImxldCBwYWdlTGluayBvZiBwYWdlTGlua3NcIiBjbGFzcz1cInAtcGFnaW5hdG9yLXBhZ2UgcC1wYWdpbmF0b3ItZWxlbWVudCBwLWxpbmtcIiBbbmdDbGFzc109XCJ7J3AtaGlnaGxpZ2h0JzogKHBhZ2VMaW5rLTEgPT0gZ2V0UGFnZSgpKX1cIlxuICAgICAgICAgICAgICAgICAgICAoY2xpY2spPVwib25QYWdlTGlua0NsaWNrKCRldmVudCwgcGFnZUxpbmsgLSAxKVwiIHBSaXBwbGU+e3twYWdlTGlua319PC9idXR0b24+XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBbZGlzYWJsZWRdPVwiaXNMYXN0UGFnZSgpXCIgKGNsaWNrKT1cImNoYW5nZVBhZ2VUb05leHQoJGV2ZW50KVwiIHBSaXBwbGVcbiAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJwLXBhZ2luYXRvci1uZXh0IHAtcGFnaW5hdG9yLWVsZW1lbnQgcC1saW5rXCIgW25nQ2xhc3NdPVwieydwLWRpc2FibGVkJzppc0xhc3RQYWdlKCl9XCI+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwLXBhZ2luYXRvci1pY29uIHBpIHBpLWFuZ2xlLXJpZ2h0XCI+PC9zcGFuPlxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBbZGlzYWJsZWRdPVwiaXNMYXN0UGFnZSgpXCIgKGNsaWNrKT1cImNoYW5nZVBhZ2VUb0xhc3QoJGV2ZW50KVwiIHBSaXBwbGVcbiAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJwLXBhZ2luYXRvci1sYXN0IHAtcGFnaW5hdG9yLWVsZW1lbnQgcC1saW5rXCIgW25nQ2xhc3NdPVwieydwLWRpc2FibGVkJzppc0xhc3RQYWdlKCl9XCI+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwLXBhZ2luYXRvci1pY29uIHBpIHBpLWFuZ2xlLWRvdWJsZS1yaWdodFwiPjwvc3Bhbj5cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPHAtZHJvcGRvd24gW29wdGlvbnNdPVwicm93c1BlclBhZ2VJdGVtc1wiIFsobmdNb2RlbCldPVwicm93c1wiICpuZ0lmPVwicm93c1BlclBhZ2VPcHRpb25zXCJcbiAgICAgICAgICAgICAgICAob25DaGFuZ2UpPVwib25ScHBDaGFuZ2UoJGV2ZW50KVwiIFthcHBlbmRUb109XCJkcm9wZG93bkFwcGVuZFRvXCIgW3Njcm9sbEhlaWdodF09XCJkcm9wZG93blNjcm9sbEhlaWdodFwiPjwvcC1kcm9wZG93bj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwLXBhZ2luYXRvci1yaWdodC1jb250ZW50XCIgKm5nSWY9XCJ0ZW1wbGF0ZVJpZ2h0XCI+XG4gICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cInRlbXBsYXRlUmlnaHQ7IGNvbnRleHQ6IHskaW1wbGljaXQ6IHBhZ2luYXRvclN0YXRlfVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIGAsXG4gICAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gICAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgICBzdHlsZVVybHM6IFsnLi9wYWdpbmF0b3IuY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgUGFnaW5hdG9yIGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMge1xuXG4gICAgQElucHV0KCkgcGFnZUxpbmtTaXplOiBudW1iZXIgPSA1O1xuXG4gICAgQE91dHB1dCgpIG9uUGFnZUNoYW5nZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBASW5wdXQoKSBzdHlsZTogYW55O1xuXG4gICAgQElucHV0KCkgc3R5bGVDbGFzczogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgYWx3YXlzU2hvdzogYm9vbGVhbiA9IHRydWU7XG4gICAgXG4gICAgQElucHV0KCkgdGVtcGxhdGVMZWZ0OiBUZW1wbGF0ZVJlZjxhbnk+O1xuICAgIFxuICAgIEBJbnB1dCgpIHRlbXBsYXRlUmlnaHQ6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICBASW5wdXQoKSBkcm9wZG93bkFwcGVuZFRvOiBhbnk7XG5cbiAgICBASW5wdXQoKSBkcm9wZG93blNjcm9sbEhlaWdodDogc3RyaW5nID0gJzIwMHB4JztcblxuICAgIEBJbnB1dCgpIGN1cnJlbnRQYWdlUmVwb3J0VGVtcGxhdGU6IHN0cmluZyA9ICd7Y3VycmVudFBhZ2V9IG9mIHt0b3RhbFBhZ2VzfSc7XG5cbiAgICBASW5wdXQoKSBzaG93Q3VycmVudFBhZ2VSZXBvcnQ6IGJvb2xlYW47XG5cbiAgICBASW5wdXQoKSB0b3RhbFJlY29yZHM6IG51bWJlciA9IDA7XG5cbiAgICBASW5wdXQoKSByb3dzOiBudW1iZXIgPSAwO1xuICAgIFxuICAgIEBJbnB1dCgpIHJvd3NQZXJQYWdlT3B0aW9uczogYW55W107XG5cbiAgICBwYWdlTGlua3M6IG51bWJlcltdO1xuXG4gICAgcm93c1BlclBhZ2VJdGVtczogU2VsZWN0SXRlbVtdO1xuICAgIFxuICAgIHBhZ2luYXRvclN0YXRlOiBhbnk7XG5cbiAgICBfZmlyc3Q6IG51bWJlciA9IDA7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNkOiBDaGFuZ2VEZXRlY3RvclJlZikge31cbiAgICBcbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgdGhpcy51cGRhdGVQYWdpbmF0b3JTdGF0ZSgpO1xuICAgIH1cblxuICAgIG5nT25DaGFuZ2VzKHNpbXBsZUNoYW5nZTogU2ltcGxlQ2hhbmdlcykge1xuICAgICAgICBpZiAoc2ltcGxlQ2hhbmdlLnRvdGFsUmVjb3Jkcykge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVQYWdlTGlua3MoKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUGFnaW5hdG9yU3RhdGUoKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlRmlyc3QoKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUm93c1BlclBhZ2VPcHRpb25zKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2ltcGxlQ2hhbmdlLmZpcnN0KSB7XG4gICAgICAgICAgICB0aGlzLl9maXJzdCA9IHNpbXBsZUNoYW5nZS5maXJzdC5jdXJyZW50VmFsdWU7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVBhZ2VMaW5rcygpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVQYWdpbmF0b3JTdGF0ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNpbXBsZUNoYW5nZS5yb3dzKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVBhZ2VMaW5rcygpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVQYWdpbmF0b3JTdGF0ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNpbXBsZUNoYW5nZS5yb3dzUGVyUGFnZU9wdGlvbnMpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUm93c1BlclBhZ2VPcHRpb25zKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBASW5wdXQoKSBnZXQgZmlyc3QoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZpcnN0O1xuICAgIH1cbiAgICBzZXQgZmlyc3QodmFsOm51bWJlcikge1xuICAgICAgICB0aGlzLl9maXJzdCA9IHZhbDtcbiAgICB9XG5cbiAgICB1cGRhdGVSb3dzUGVyUGFnZU9wdGlvbnMoKSB7XG4gICAgICAgIGlmICh0aGlzLnJvd3NQZXJQYWdlT3B0aW9ucykge1xuICAgICAgICAgICAgdGhpcy5yb3dzUGVyUGFnZUl0ZW1zID0gW107XG4gICAgICAgICAgICBmb3IgKGxldCBvcHQgb2YgdGhpcy5yb3dzUGVyUGFnZU9wdGlvbnMpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG9wdCA9PSAnb2JqZWN0JyAmJiBvcHRbJ3Nob3dBbGwnXSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJvd3NQZXJQYWdlSXRlbXMudW5zaGlmdCh7bGFiZWw6IG9wdFsnc2hvd0FsbCddLCB2YWx1ZTogdGhpcy50b3RhbFJlY29yZHN9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucm93c1BlclBhZ2VJdGVtcy5wdXNoKHtsYWJlbDogU3RyaW5nKG9wdCksIHZhbHVlOiBvcHR9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpc0ZpcnN0UGFnZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0UGFnZSgpID09PSAwO1xuICAgIH1cblxuICAgIGlzTGFzdFBhZ2UoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldFBhZ2UoKSA9PT0gdGhpcy5nZXRQYWdlQ291bnQoKSAtIDE7XG4gICAgfVxuXG4gICAgZ2V0UGFnZUNvdW50KCkge1xuICAgICAgICByZXR1cm4gTWF0aC5jZWlsKHRoaXMudG90YWxSZWNvcmRzL3RoaXMucm93cyl8fDE7XG4gICAgfVxuXG4gICAgY2FsY3VsYXRlUGFnZUxpbmtCb3VuZGFyaWVzKCkge1xuICAgICAgICBsZXQgbnVtYmVyT2ZQYWdlcyA9IHRoaXMuZ2V0UGFnZUNvdW50KCksXG4gICAgICAgIHZpc2libGVQYWdlcyA9IE1hdGgubWluKHRoaXMucGFnZUxpbmtTaXplLCBudW1iZXJPZlBhZ2VzKTtcblxuICAgICAgICAvL2NhbGN1bGF0ZSByYW5nZSwga2VlcCBjdXJyZW50IGluIG1pZGRsZSBpZiBuZWNlc3NhcnlcbiAgICAgICAgbGV0IHN0YXJ0ID0gTWF0aC5tYXgoMCwgTWF0aC5jZWlsKHRoaXMuZ2V0UGFnZSgpIC0gKCh2aXNpYmxlUGFnZXMpIC8gMikpKSxcbiAgICAgICAgZW5kID0gTWF0aC5taW4obnVtYmVyT2ZQYWdlcyAtIDEsIHN0YXJ0ICsgdmlzaWJsZVBhZ2VzIC0gMSk7XG5cbiAgICAgICAgLy9jaGVjayB3aGVuIGFwcHJvYWNoaW5nIHRvIGxhc3QgcGFnZVxuICAgICAgICB2YXIgZGVsdGEgPSB0aGlzLnBhZ2VMaW5rU2l6ZSAtIChlbmQgLSBzdGFydCArIDEpO1xuICAgICAgICBzdGFydCA9IE1hdGgubWF4KDAsIHN0YXJ0IC0gZGVsdGEpO1xuXG4gICAgICAgIHJldHVybiBbc3RhcnQsIGVuZF07XG4gICAgfVxuXG4gICAgdXBkYXRlUGFnZUxpbmtzKCkge1xuICAgICAgICB0aGlzLnBhZ2VMaW5rcyA9IFtdO1xuICAgICAgICBsZXQgYm91bmRhcmllcyA9IHRoaXMuY2FsY3VsYXRlUGFnZUxpbmtCb3VuZGFyaWVzKCksXG4gICAgICAgIHN0YXJ0ID0gYm91bmRhcmllc1swXSxcbiAgICAgICAgZW5kID0gYm91bmRhcmllc1sxXTtcblxuICAgICAgICBmb3IobGV0IGkgPSBzdGFydDsgaSA8PSBlbmQ7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5wYWdlTGlua3MucHVzaChpICsgMSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjaGFuZ2VQYWdlKHAgOm51bWJlcikge1xuICAgICAgICB2YXIgcGMgPSB0aGlzLmdldFBhZ2VDb3VudCgpO1xuXG4gICAgICAgIGlmIChwID49IDAgJiYgcCA8IHBjKSB7XG4gICAgICAgICAgICB0aGlzLl9maXJzdCA9IHRoaXMucm93cyAqIHA7XG4gICAgICAgICAgICB2YXIgc3RhdGUgPSB7XG4gICAgICAgICAgICAgICAgcGFnZTogcCxcbiAgICAgICAgICAgICAgICBmaXJzdDogdGhpcy5maXJzdCxcbiAgICAgICAgICAgICAgICByb3dzOiB0aGlzLnJvd3MsXG4gICAgICAgICAgICAgICAgcGFnZUNvdW50OiBwY1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUGFnZUxpbmtzKCk7XG5cbiAgICAgICAgICAgIHRoaXMub25QYWdlQ2hhbmdlLmVtaXQoc3RhdGUpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVQYWdpbmF0b3JTdGF0ZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXBkYXRlRmlyc3QoKSB7XG4gICAgICAgIGNvbnN0IHBhZ2UgPSB0aGlzLmdldFBhZ2UoKTtcbiAgICAgICAgaWYgKHBhZ2UgPiAwICYmIHRoaXMudG90YWxSZWNvcmRzICYmICh0aGlzLmZpcnN0ID49IHRoaXMudG90YWxSZWNvcmRzKSkge1xuICAgICAgICAgICAgUHJvbWlzZS5yZXNvbHZlKG51bGwpLnRoZW4oKCkgPT4gdGhpcy5jaGFuZ2VQYWdlKHBhZ2UgLSAxKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRQYWdlKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKHRoaXMuZmlyc3QgLyB0aGlzLnJvd3MpO1xuICAgIH1cblxuICAgIGNoYW5nZVBhZ2VUb0ZpcnN0KGV2ZW50KSB7XG4gICAgICBpZiAoIXRoaXMuaXNGaXJzdFBhZ2UoKSl7XG4gICAgICAgICAgdGhpcy5jaGFuZ2VQYWdlKDApO1xuICAgICAgfVxuXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cblxuICAgIGNoYW5nZVBhZ2VUb1ByZXYoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5jaGFuZ2VQYWdlKHRoaXMuZ2V0UGFnZSgpIC0gMSk7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuXG4gICAgY2hhbmdlUGFnZVRvTmV4dChldmVudCkge1xuICAgICAgICB0aGlzLmNoYW5nZVBhZ2UodGhpcy5nZXRQYWdlKCkgICsgMSk7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuXG4gICAgY2hhbmdlUGFnZVRvTGFzdChldmVudCkge1xuICAgICAgaWYgKCF0aGlzLmlzTGFzdFBhZ2UoKSl7XG4gICAgICAgICAgdGhpcy5jaGFuZ2VQYWdlKHRoaXMuZ2V0UGFnZUNvdW50KCkgLSAxKTtcbiAgICAgIH1cblxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG5cbiAgICBvblBhZ2VMaW5rQ2xpY2soZXZlbnQsIHBhZ2UpIHtcbiAgICAgICAgdGhpcy5jaGFuZ2VQYWdlKHBhZ2UpO1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cblxuICAgIG9uUnBwQ2hhbmdlKGV2ZW50KSB7XG4gICAgICAgIHRoaXMuY2hhbmdlUGFnZSh0aGlzLmdldFBhZ2UoKSk7XG4gICAgfVxuICAgIFxuICAgIHVwZGF0ZVBhZ2luYXRvclN0YXRlKCkge1xuICAgICAgICB0aGlzLnBhZ2luYXRvclN0YXRlID0ge1xuICAgICAgICAgICAgcGFnZTogdGhpcy5nZXRQYWdlKCksXG4gICAgICAgICAgICBwYWdlQ291bnQ6IHRoaXMuZ2V0UGFnZUNvdW50KCksXG4gICAgICAgICAgICByb3dzOiB0aGlzLnJvd3MsXG4gICAgICAgICAgICBmaXJzdDogdGhpcy5maXJzdCxcbiAgICAgICAgICAgIHRvdGFsUmVjb3JkczogdGhpcy50b3RhbFJlY29yZHNcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldCBjdXJyZW50UGFnZVJlcG9ydCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudFBhZ2VSZXBvcnRUZW1wbGF0ZVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKFwie2N1cnJlbnRQYWdlfVwiLCBTdHJpbmcodGhpcy5nZXRQYWdlKCkgKyAxKSlcbiAgICAgICAgICAgICAgICAucmVwbGFjZShcInt0b3RhbFBhZ2VzfVwiLCBTdHJpbmcodGhpcy5nZXRQYWdlQ291bnQoKSkpXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoXCJ7Zmlyc3R9XCIsIFN0cmluZyh0aGlzLl9maXJzdCArIDEpKVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKFwie2xhc3R9XCIsIFN0cmluZyhNYXRoLm1pbih0aGlzLl9maXJzdCArIHRoaXMucm93cywgdGhpcy50b3RhbFJlY29yZHMpKSlcbiAgICAgICAgICAgICAgICAucmVwbGFjZShcIntyb3dzfVwiLCBTdHJpbmcodGhpcy5yb3dzKSlcbiAgICAgICAgICAgICAgICAucmVwbGFjZShcInt0b3RhbFJlY29yZHN9XCIsIFN0cmluZyh0aGlzLnRvdGFsUmVjb3JkcykpO1xuICAgIH1cbn1cblxuQE5nTW9kdWxlKHtcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLERyb3Bkb3duTW9kdWxlLEZvcm1zTW9kdWxlLFNoYXJlZE1vZHVsZSxSaXBwbGVNb2R1bGVdLFxuICAgIGV4cG9ydHM6IFtQYWdpbmF0b3IsRHJvcGRvd25Nb2R1bGUsRm9ybXNNb2R1bGUsU2hhcmVkTW9kdWxlXSxcbiAgICBkZWNsYXJhdGlvbnM6IFtQYWdpbmF0b3JdXG59KVxuZXhwb3J0IGNsYXNzIFBhZ2luYXRvck1vZHVsZSB7IH1cbiJdfQ==