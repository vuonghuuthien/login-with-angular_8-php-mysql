import { EventEmitter, ElementRef, Component, ChangeDetectionStrategy, ViewEncapsulation, Input, Output, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as Chart from 'chart.js';

var UIChart = /** @class */ (function () {
    function UIChart(el) {
        this.el = el;
        this.plugins = [];
        this.responsive = true;
        this.onDataSelect = new EventEmitter();
        this._options = {};
    }
    Object.defineProperty(UIChart.prototype, "data", {
        get: function () {
            return this._data;
        },
        set: function (val) {
            this._data = val;
            this.reinit();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UIChart.prototype, "options", {
        get: function () {
            return this._options;
        },
        set: function (val) {
            this._options = val;
            this.reinit();
        },
        enumerable: false,
        configurable: true
    });
    UIChart.prototype.ngAfterViewInit = function () {
        this.initChart();
        this.initialized = true;
    };
    UIChart.prototype.onCanvasClick = function (event) {
        if (this.chart) {
            var element = this.chart.getElementAtEvent(event);
            var dataset = this.chart.getDatasetAtEvent(event);
            if (element && element[0] && dataset) {
                this.onDataSelect.emit({ originalEvent: event, element: element[0], dataset: dataset });
            }
        }
    };
    UIChart.prototype.initChart = function () {
        var opts = this.options || {};
        opts.responsive = this.responsive;
        // allows chart to resize in responsive mode
        if (opts.responsive && (this.height || this.width)) {
            opts.maintainAspectRatio = false;
        }
        this.chart = new Chart(this.el.nativeElement.children[0].children[0], {
            type: this.type,
            data: this.data,
            options: this.options,
            plugins: this.plugins
        });
    };
    UIChart.prototype.getCanvas = function () {
        return this.el.nativeElement.children[0].children[0];
    };
    UIChart.prototype.getBase64Image = function () {
        return this.chart.toBase64Image();
    };
    UIChart.prototype.generateLegend = function () {
        if (this.chart) {
            return this.chart.generateLegend();
        }
    };
    UIChart.prototype.refresh = function () {
        if (this.chart) {
            this.chart.update();
        }
    };
    UIChart.prototype.reinit = function () {
        if (this.chart) {
            this.chart.destroy();
            this.initChart();
        }
    };
    UIChart.prototype.ngOnDestroy = function () {
        if (this.chart) {
            this.chart.destroy();
            this.initialized = false;
            this.chart = null;
        }
    };
    UIChart.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    UIChart.decorators = [
        { type: Component, args: [{
                    selector: 'p-chart',
                    template: "\n        <div style=\"position:relative\" [style.width]=\"responsive && !width ? null : width\" [style.height]=\"responsive && !height ? null : height\">\n            <canvas [attr.width]=\"responsive && !width ? null : width\" [attr.height]=\"responsive && !height ? null : height\" (click)=\"onCanvasClick($event)\"></canvas>\n        </div>\n    ",
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None
                },] }
    ];
    UIChart.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    UIChart.propDecorators = {
        type: [{ type: Input }],
        plugins: [{ type: Input }],
        width: [{ type: Input }],
        height: [{ type: Input }],
        responsive: [{ type: Input }],
        onDataSelect: [{ type: Output }],
        data: [{ type: Input }],
        options: [{ type: Input }]
    };
    return UIChart;
}());
var ChartModule = /** @class */ (function () {
    function ChartModule() {
    }
    ChartModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule],
                    exports: [UIChart],
                    declarations: [UIChart]
                },] }
    ];
    return ChartModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { ChartModule, UIChart };
//# sourceMappingURL=primeng-chart.js.map
