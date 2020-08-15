import { ViewContainerRef, ChangeDetectorRef, Component, Input, ContentChildren, EventEmitter, ElementRef, ChangeDetectionStrategy, ViewEncapsulation, ViewChild, Output, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';
import { PrimeTemplate, SharedModule } from 'primeng/api';
import { DomHandler } from 'primeng/dom';

var idx = 0;
var TabPanel = /** @class */ (function () {
    function TabPanel(viewContainer, cd) {
        this.viewContainer = viewContainer;
        this.cd = cd;
        this.cache = true;
        this.tooltipPosition = 'top';
        this.tooltipPositionStyle = 'absolute';
        this.id = "p-tabpanel-" + idx++;
    }
    TabPanel.prototype.ngAfterContentInit = function () {
        var _this = this;
        this.templates.forEach(function (item) {
            switch (item.getType()) {
                case 'header':
                    _this.headerTemplate = item.template;
                    break;
                case 'content':
                    _this.contentTemplate = item.template;
                    break;
                default:
                    _this.contentTemplate = item.template;
                    break;
            }
        });
    };
    Object.defineProperty(TabPanel.prototype, "selected", {
        get: function () {
            return this._selected;
        },
        set: function (val) {
            this._selected = val;
            if (!this.loaded) {
                this.cd.detectChanges();
            }
            this.loaded = true;
        },
        enumerable: false,
        configurable: true
    });
    TabPanel.prototype.ngOnDestroy = function () {
        this.view = null;
    };
    TabPanel.ctorParameters = function () { return [
        { type: ViewContainerRef },
        { type: ChangeDetectorRef }
    ]; };
    TabPanel.decorators = [
        { type: Component, args: [{
                    selector: 'p-tabPanel',
                    template: "\n        <div [attr.id]=\"id\" class=\"p-tabview-panel\" [hidden]=\"!selected\"\n            role=\"tabpanel\" [attr.aria-hidden]=\"!selected\" [attr.aria-labelledby]=\"id + '-label'\" *ngIf=\"!closed\">\n            <ng-content></ng-content>\n            <ng-container *ngIf=\"contentTemplate && (cache ? loaded : selected)\">\n                <ng-container *ngTemplateOutlet=\"contentTemplate\"></ng-container>\n            </ng-container>\n        </div>\n    "
                },] }
    ];
    TabPanel.ctorParameters = function () { return [
        { type: ViewContainerRef },
        { type: ChangeDetectorRef }
    ]; };
    TabPanel.propDecorators = {
        header: [{ type: Input }],
        disabled: [{ type: Input }],
        closable: [{ type: Input }],
        headerStyle: [{ type: Input }],
        headerStyleClass: [{ type: Input }],
        leftIcon: [{ type: Input }],
        rightIcon: [{ type: Input }],
        cache: [{ type: Input }],
        tooltip: [{ type: Input }],
        tooltipPosition: [{ type: Input }],
        tooltipPositionStyle: [{ type: Input }],
        tooltipStyleClass: [{ type: Input }],
        templates: [{ type: ContentChildren, args: [PrimeTemplate,] }],
        selected: [{ type: Input }]
    };
    return TabPanel;
}());
var TabView = /** @class */ (function () {
    function TabView(el) {
        this.el = el;
        this.orientation = 'top';
        this.onChange = new EventEmitter();
        this.onClose = new EventEmitter();
        this.activeIndexChange = new EventEmitter();
    }
    TabView.prototype.ngAfterContentInit = function () {
        var _this = this;
        this.initTabs();
        this.tabPanels.changes.subscribe(function (_) {
            _this.initTabs();
        });
    };
    TabView.prototype.ngAfterViewChecked = function () {
        if (this.tabChanged) {
            this.updateInkBar();
            this.tabChanged = false;
        }
    };
    TabView.prototype.initTabs = function () {
        this.tabs = this.tabPanels.toArray();
        var selectedTab = this.findSelectedTab();
        if (!selectedTab && this.tabs.length) {
            if (this.activeIndex != null && this.tabs.length > this.activeIndex)
                this.tabs[this.activeIndex].selected = true;
            else
                this.tabs[0].selected = true;
            this.tabChanged = true;
        }
    };
    TabView.prototype.open = function (event, tab) {
        if (tab.disabled) {
            if (event) {
                event.preventDefault();
            }
            return;
        }
        if (!tab.selected) {
            var selectedTab = this.findSelectedTab();
            if (selectedTab) {
                selectedTab.selected = false;
            }
            this.tabChanged = true;
            tab.selected = true;
            var selectedTabIndex = this.findTabIndex(tab);
            this.preventActiveIndexPropagation = true;
            this.activeIndexChange.emit(selectedTabIndex);
            this.onChange.emit({ originalEvent: event, index: selectedTabIndex });
        }
        if (event) {
            event.preventDefault();
        }
    };
    TabView.prototype.close = function (event, tab) {
        var _this = this;
        if (this.controlClose) {
            this.onClose.emit({
                originalEvent: event,
                index: this.findTabIndex(tab),
                close: function () {
                    _this.closeTab(tab);
                }
            });
        }
        else {
            this.closeTab(tab);
            this.onClose.emit({
                originalEvent: event,
                index: this.findTabIndex(tab)
            });
        }
        event.stopPropagation();
    };
    TabView.prototype.closeTab = function (tab) {
        if (tab.disabled) {
            return;
        }
        if (tab.selected) {
            this.tabChanged = true;
            tab.selected = false;
            for (var i = 0; i < this.tabs.length; i++) {
                var tabPanel = this.tabs[i];
                if (!tabPanel.closed && !tab.disabled) {
                    tabPanel.selected = true;
                    break;
                }
            }
        }
        tab.closed = true;
    };
    TabView.prototype.findSelectedTab = function () {
        for (var i = 0; i < this.tabs.length; i++) {
            if (this.tabs[i].selected) {
                return this.tabs[i];
            }
        }
        return null;
    };
    TabView.prototype.findTabIndex = function (tab) {
        var index = -1;
        for (var i = 0; i < this.tabs.length; i++) {
            if (this.tabs[i] == tab) {
                index = i;
                break;
            }
        }
        return index;
    };
    TabView.prototype.getBlockableElement = function () {
        return this.el.nativeElement.children[0];
    };
    Object.defineProperty(TabView.prototype, "activeIndex", {
        get: function () {
            return this._activeIndex;
        },
        set: function (val) {
            this._activeIndex = val;
            if (this.preventActiveIndexPropagation) {
                this.preventActiveIndexPropagation = false;
                return;
            }
            if (this.tabs && this.tabs.length && this._activeIndex != null && this.tabs.length > this._activeIndex) {
                this.findSelectedTab().selected = false;
                this.tabs[this._activeIndex].selected = true;
            }
        },
        enumerable: false,
        configurable: true
    });
    TabView.prototype.updateInkBar = function () {
        var tabHeader = DomHandler.findSingle(this.navbar.nativeElement, 'li.p-highlight');
        this.inkbar.nativeElement.style.width = DomHandler.getWidth(tabHeader) + 'px';
        this.inkbar.nativeElement.style.left = DomHandler.getOffset(tabHeader).left - DomHandler.getOffset(this.navbar.nativeElement).left + 'px';
    };
    TabView.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    TabView.decorators = [
        { type: Component, args: [{
                    selector: 'p-tabView',
                    template: "\n        <div [ngClass]=\"'p-tabview p-component'\" [ngStyle]=\"style\" [class]=\"styleClass\">\n            <ul #navbar class=\"p-tabview-nav\" role=\"tablist\">\n                <ng-template ngFor let-tab [ngForOf]=\"tabs\">\n                    <li role=\"presentation\" [ngClass]=\"{'p-highlight': tab.selected, 'p-disabled': tab.disabled}\" [ngStyle]=\"tab.headerStyle\" [class]=\"tab.headerStyleClass\" *ngIf=\"!tab.closed\">\n                        <a role=\"tab\" class=\"p-tabview-nav-link\" [attr.id]=\"tab.id + '-label'\" [attr.aria-selected]=\"tab.selected\" [attr.aria-controls]=\"tab.id\" [pTooltip]=\"tab.tooltip\" [tooltipPosition]=\"tab.tooltipPosition\"\n                            [attr.aria-selected]=\"tab.selected\" [positionStyle]=\"tab.tooltipPositionStyle\" [tooltipStyleClass]=\"tab.tooltipStyleClass\"\n                            (click)=\"open($event,tab)\" (keydown.enter)=\"open($event,tab)\" pRipple [attr.tabindex]=\"tab.disabled ? null : '0'\">\n                            <ng-container *ngIf=\"!tab.headerTemplate\">\n                                <span class=\"p-tabview-left-icon\" [ngClass]=\"tab.leftIcon\" *ngIf=\"tab.leftIcon\"></span>\n                                <span class=\"p-tabview-title\">{{tab.header}}</span>\n                                <span class=\"p-tabview-right-icon\" [ngClass]=\"tab.rightIcon\" *ngIf=\"tab.rightIcon\"></span>\n                            </ng-container>\n                            <ng-container *ngTemplateOutlet=\"tab.headerTemplate\"></ng-container>\n                            <span *ngIf=\"tab.closable\" class=\"p-tabview-close pi pi-times\" (click)=\"close($event,tab)\"></span>\n                        </a>\n                    </li>\n                </ng-template>\n                <li #inkbar class=\"p-tabview-ink-bar\"></li>\n            </ul>\n            <div class=\"p-tabview-panels\">\n                <ng-content></ng-content>\n            </div>\n        </div>\n    ",
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    styles: [".p-tabview-nav{display:-ms-flexbox;display:flex;margin:0;padding:0;list-style-type:none;-ms-flex-wrap:wrap;flex-wrap:wrap}.p-tabview-nav-link{cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;position:relative;text-decoration:none;overflow:hidden}.p-tabview-ink-bar{display:none;z-index:1}.p-tabview-nav-link:focus{z-index:1}.p-tabview-title{line-height:1}"]
                },] }
    ];
    TabView.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    TabView.propDecorators = {
        orientation: [{ type: Input }],
        style: [{ type: Input }],
        styleClass: [{ type: Input }],
        controlClose: [{ type: Input }],
        navbar: [{ type: ViewChild, args: ['navbar',] }],
        inkbar: [{ type: ViewChild, args: ['inkbar',] }],
        tabPanels: [{ type: ContentChildren, args: [TabPanel,] }],
        onChange: [{ type: Output }],
        onClose: [{ type: Output }],
        activeIndexChange: [{ type: Output }],
        activeIndex: [{ type: Input }]
    };
    return TabView;
}());
var TabViewModule = /** @class */ (function () {
    function TabViewModule() {
    }
    TabViewModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule, SharedModule, TooltipModule, RippleModule],
                    exports: [TabView, TabPanel, SharedModule],
                    declarations: [TabView, TabPanel]
                },] }
    ];
    return TabViewModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { TabPanel, TabView, TabViewModule };
//# sourceMappingURL=primeng-tabview.js.map
