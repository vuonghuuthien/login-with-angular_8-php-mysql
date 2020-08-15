(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/animations'), require('@angular/common'), require('primeng/api'), require('rxjs')) :
    typeof define === 'function' && define.amd ? define('primeng/organizationchart', ['exports', '@angular/core', '@angular/animations', '@angular/common', 'primeng/api', 'rxjs'], factory) :
    (global = global || self, factory((global.primeng = global.primeng || {}, global.primeng.organizationchart = {}), global.ng.core, global.ng.animations, global.ng.common, global.primeng.api, global.rxjs));
}(this, (function (exports, core, animations, common, api, rxjs) { 'use strict';

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
    var OrganizationChartNode = /** @class */ (function () {
        function OrganizationChartNode(chart, cd) {
            var _this = this;
            this.cd = cd;
            this.chart = chart;
            this.subscription = this.chart.selectionSource$.subscribe(function () {
                _this.cd.markForCheck();
            });
        }
        Object.defineProperty(OrganizationChartNode.prototype, "leaf", {
            get: function () {
                return this.node.leaf == false ? false : !(this.node.children && this.node.children.length);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(OrganizationChartNode.prototype, "colspan", {
            get: function () {
                return (this.node.children && this.node.children.length) ? this.node.children.length * 2 : null;
            },
            enumerable: false,
            configurable: true
        });
        OrganizationChartNode.prototype.onNodeClick = function (event, node) {
            this.chart.onNodeClick(event, node);
        };
        OrganizationChartNode.prototype.toggleNode = function (event, node) {
            node.expanded = !node.expanded;
            if (node.expanded)
                this.chart.onNodeExpand.emit({ originalEvent: event, node: this.node });
            else
                this.chart.onNodeCollapse.emit({ originalEvent: event, node: this.node });
            event.preventDefault();
        };
        OrganizationChartNode.prototype.isSelected = function () {
            return this.chart.isSelected(this.node);
        };
        OrganizationChartNode.prototype.ngOnDestroy = function () {
            this.subscription.unsubscribe();
        };
        OrganizationChartNode.ctorParameters = function () { return [
            { type: undefined, decorators: [{ type: core.Inject, args: [core.forwardRef(function () { return OrganizationChart; }),] }] },
            { type: core.ChangeDetectorRef }
        ]; };
        OrganizationChartNode.decorators = [
            { type: core.Component, args: [{
                        selector: '[pOrganizationChartNode]',
                        template: "\n        <tbody *ngIf=\"node\">\n            <tr>\n                <td [attr.colspan]=\"colspan\">\n                    <div [class]=\"node.styleClass\" [ngClass]=\"{'p-organizationchart-node-content': true, 'p-organizationchart-selectable-node': chart.selectionMode && node.selectable !== false,'p-highlight':isSelected()}\"\n                        (click)=\"onNodeClick($event,node)\">\n                        <div *ngIf=\"!chart.getTemplateForNode(node)\">{{node.label}}</div>\n                        <div *ngIf=\"chart.getTemplateForNode(node)\">\n                            <ng-container *ngTemplateOutlet=\"chart.getTemplateForNode(node); context: {$implicit: node}\"></ng-container>\n                        </div>\n                        <a *ngIf=\"!leaf\" tabindex=\"0\" class=\"p-node-toggler\" (click)=\"toggleNode($event, node)\" (keydown.enter)=\"toggleNode($event, node)\">\n                            <i class=\"p-node-toggler-icon pi\" [ngClass]=\"{'pi-chevron-down': node.expanded, 'pi-chevron-up': !node.expanded}\"></i>\n                        </a>\n                    </div>\n                </td>\n            </tr>\n            <tr [ngClass]=\"!leaf&&node.expanded ? 'p-organizationchart-node-visible' : 'p-organizationchart-node-hidden'\" class=\"p-organizationchart-lines\" [@childState]=\"'in'\">\n                <td [attr.colspan]=\"colspan\">\n                    <div class=\"p-organizationchart-line-down\"></div>\n                </td>\n            </tr>\n            <tr [ngClass]=\"!leaf&&node.expanded ? 'p-organizationchart-node-visible' : 'p-organizationchart-node-hidden'\" class=\"p-organizationchart-lines\" [@childState]=\"'in'\">\n                <ng-container *ngIf=\"node.children && node.children.length === 1\">\n                    <td [attr.colspan]=\"colspan\">\n                        <div class=\"p-organizationchart-line-down\"></div>\n                    </td>\n                </ng-container>\n                <ng-container *ngIf=\"node.children && node.children.length > 1\">\n                    <ng-template ngFor let-child [ngForOf]=\"node.children\" let-first=\"first\" let-last=\"last\">\n                        <td class=\"p-organizationchart-line-left\" [ngClass]=\"{'p-organizationchart-line-top':!first}\">&nbsp;</td>\n                        <td class=\"p-organizationchart-line-right\" [ngClass]=\"{'p-organizationchart-line-top':!last}\">&nbsp;</td>\n                    </ng-template>\n                </ng-container>\n            </tr>\n            <tr [ngClass]=\"!leaf&&node.expanded ? 'p-organizationchart-node-visible' : 'p-organizationchart-node-hidden'\" class=\"p-organizationchart-nodes\" [@childState]=\"'in'\">\n                <td *ngFor=\"let child of node.children\" colspan=\"2\">\n                    <table class=\"p-organizationchart-table\" pOrganizationChartNode [node]=\"child\"></table>\n                </td>\n            </tr>\n        </tbody>\n    ",
                        animations: [
                            animations.trigger('childState', [
                                animations.state('in', animations.style({ opacity: 1 })),
                                animations.transition('void => *', [
                                    animations.style({ opacity: 0 }),
                                    animations.animate(150)
                                ]),
                                animations.transition('* => void', [
                                    animations.animate(150, animations.style({ opacity: 0 }))
                                ])
                            ])
                        ],
                        encapsulation: core.ViewEncapsulation.None,
                        changeDetection: core.ChangeDetectionStrategy.OnPush,
                        styles: [".p-organizationchart-table{border-spacing:0;border-collapse:separate;margin:0 auto}.p-organizationchart-table>tbody>tr>td{text-align:center;vertical-align:top;padding:0 .75rem}.p-organizationchart-node-content{display:inline-block;position:relative}.p-organizationchart-node-content .p-node-toggler{position:absolute;bottom:-.75rem;margin-left:-.75rem;z-index:2;left:50%;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:pointer;width:1.5rem;height:1.5rem}.p-organizationchart-node-content .p-node-toggler .p-node-toggler-icon{position:relative;top:.25rem}.p-organizationchart-line-down{margin:0 auto;height:20px;width:1px}.p-organizationchart-line-left,.p-organizationchart-line-right{border-radius:0}.p-organizationchart-selectable-node{cursor:pointer}.p-organizationchart .p-organizationchart-node-hidden{display:none}.p-organizationchart-preservespace .p-organizationchart-node-hidden{visibility:hidden;display:inherit}"]
                    },] }
        ];
        OrganizationChartNode.ctorParameters = function () { return [
            { type: undefined, decorators: [{ type: core.Inject, args: [core.forwardRef(function () { return OrganizationChart; }),] }] },
            { type: core.ChangeDetectorRef }
        ]; };
        OrganizationChartNode.propDecorators = {
            node: [{ type: core.Input }],
            root: [{ type: core.Input }],
            first: [{ type: core.Input }],
            last: [{ type: core.Input }]
        };
        return OrganizationChartNode;
    }());
    var OrganizationChart = /** @class */ (function () {
        function OrganizationChart(el, cd) {
            this.el = el;
            this.cd = cd;
            this.preserveSpace = true;
            this.selectionChange = new core.EventEmitter();
            this.onNodeSelect = new core.EventEmitter();
            this.onNodeUnselect = new core.EventEmitter();
            this.onNodeExpand = new core.EventEmitter();
            this.onNodeCollapse = new core.EventEmitter();
            this.selectionSource = new rxjs.Subject();
            this.selectionSource$ = this.selectionSource.asObservable();
        }
        Object.defineProperty(OrganizationChart.prototype, "selection", {
            get: function () {
                return this._selection;
            },
            set: function (val) {
                this._selection = val;
                if (this.initialized)
                    this.selectionSource.next();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(OrganizationChart.prototype, "root", {
            get: function () {
                return this.value && this.value.length ? this.value[0] : null;
            },
            enumerable: false,
            configurable: true
        });
        OrganizationChart.prototype.ngAfterContentInit = function () {
            var _this = this;
            if (this.templates.length) {
                this.templateMap = {};
            }
            this.templates.forEach(function (item) {
                _this.templateMap[item.getType()] = item.template;
            });
            this.initialized = true;
        };
        OrganizationChart.prototype.getTemplateForNode = function (node) {
            if (this.templateMap)
                return node.type ? this.templateMap[node.type] : this.templateMap['default'];
            else
                return null;
        };
        OrganizationChart.prototype.onNodeClick = function (event, node) {
            var eventTarget = event.target;
            if (eventTarget.className && (eventTarget.className.indexOf('p-node-toggler') !== -1 || eventTarget.className.indexOf('p-node-toggler-icon') !== -1)) {
                return;
            }
            else if (this.selectionMode) {
                if (node.selectable === false) {
                    return;
                }
                var index_1 = this.findIndexInSelection(node);
                var selected = (index_1 >= 0);
                if (this.selectionMode === 'single') {
                    if (selected) {
                        this.selection = null;
                        this.onNodeUnselect.emit({ originalEvent: event, node: node });
                    }
                    else {
                        this.selection = node;
                        this.onNodeSelect.emit({ originalEvent: event, node: node });
                    }
                }
                else if (this.selectionMode === 'multiple') {
                    if (selected) {
                        this.selection = this.selection.filter(function (val, i) { return i != index_1; });
                        this.onNodeUnselect.emit({ originalEvent: event, node: node });
                    }
                    else {
                        this.selection = __spread(this.selection || [], [node]);
                        this.onNodeSelect.emit({ originalEvent: event, node: node });
                    }
                }
                this.selectionChange.emit(this.selection);
                this.selectionSource.next();
            }
        };
        OrganizationChart.prototype.findIndexInSelection = function (node) {
            var index = -1;
            if (this.selectionMode && this.selection) {
                if (this.selectionMode === 'single') {
                    index = (this.selection == node) ? 0 : -1;
                }
                else if (this.selectionMode === 'multiple') {
                    for (var i = 0; i < this.selection.length; i++) {
                        if (this.selection[i] == node) {
                            index = i;
                            break;
                        }
                    }
                }
            }
            return index;
        };
        OrganizationChart.prototype.isSelected = function (node) {
            return this.findIndexInSelection(node) != -1;
        };
        OrganizationChart.ctorParameters = function () { return [
            { type: core.ElementRef },
            { type: core.ChangeDetectorRef }
        ]; };
        OrganizationChart.decorators = [
            { type: core.Component, args: [{
                        selector: 'p-organizationChart',
                        template: "\n        <div [ngStyle]=\"style\" [class]=\"styleClass\" [ngClass]=\"{'p-organizationchart p-component': true, 'p-organizationchart-preservespace': preserveSpace}\">\n            <table class=\"p-organizationchart-table\" pOrganizationChartNode [node]=\"root\" *ngIf=\"root\"></table>\n        </div>\n    ",
                        changeDetection: core.ChangeDetectionStrategy.OnPush
                    },] }
        ];
        OrganizationChart.ctorParameters = function () { return [
            { type: core.ElementRef },
            { type: core.ChangeDetectorRef }
        ]; };
        OrganizationChart.propDecorators = {
            value: [{ type: core.Input }],
            style: [{ type: core.Input }],
            styleClass: [{ type: core.Input }],
            selectionMode: [{ type: core.Input }],
            preserveSpace: [{ type: core.Input }],
            selection: [{ type: core.Input }],
            selectionChange: [{ type: core.Output }],
            onNodeSelect: [{ type: core.Output }],
            onNodeUnselect: [{ type: core.Output }],
            onNodeExpand: [{ type: core.Output }],
            onNodeCollapse: [{ type: core.Output }],
            templates: [{ type: core.ContentChildren, args: [api.PrimeTemplate,] }]
        };
        return OrganizationChart;
    }());
    var OrganizationChartModule = /** @class */ (function () {
        function OrganizationChartModule() {
        }
        OrganizationChartModule.decorators = [
            { type: core.NgModule, args: [{
                        imports: [common.CommonModule],
                        exports: [OrganizationChart, api.SharedModule],
                        declarations: [OrganizationChart, OrganizationChartNode]
                    },] }
        ];
        return OrganizationChartModule;
    }());

    exports.OrganizationChart = OrganizationChart;
    exports.OrganizationChartModule = OrganizationChartModule;
    exports.OrganizationChartNode = OrganizationChartNode;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=primeng-organizationchart.umd.js.map
