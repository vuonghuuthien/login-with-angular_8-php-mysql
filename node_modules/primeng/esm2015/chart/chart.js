import { NgModule, Component, ElementRef, AfterViewInit, OnDestroy, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as Chart from 'chart.js';
export class UIChart {
    constructor(el) {
        this.el = el;
        this.plugins = [];
        this.responsive = true;
        this.onDataSelect = new EventEmitter();
        this._options = {};
    }
    get data() {
        return this._data;
    }
    set data(val) {
        this._data = val;
        this.reinit();
    }
    get options() {
        return this._options;
    }
    set options(val) {
        this._options = val;
        this.reinit();
    }
    ngAfterViewInit() {
        this.initChart();
        this.initialized = true;
    }
    onCanvasClick(event) {
        if (this.chart) {
            let element = this.chart.getElementAtEvent(event);
            let dataset = this.chart.getDatasetAtEvent(event);
            if (element && element[0] && dataset) {
                this.onDataSelect.emit({ originalEvent: event, element: element[0], dataset: dataset });
            }
        }
    }
    initChart() {
        let opts = this.options || {};
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
    }
    getCanvas() {
        return this.el.nativeElement.children[0].children[0];
    }
    getBase64Image() {
        return this.chart.toBase64Image();
    }
    generateLegend() {
        if (this.chart) {
            return this.chart.generateLegend();
        }
    }
    refresh() {
        if (this.chart) {
            this.chart.update();
        }
    }
    reinit() {
        if (this.chart) {
            this.chart.destroy();
            this.initChart();
        }
    }
    ngOnDestroy() {
        if (this.chart) {
            this.chart.destroy();
            this.initialized = false;
            this.chart = null;
        }
    }
}
UIChart.ctorParameters = () => [
    { type: ElementRef }
];
UIChart.decorators = [
    { type: Component, args: [{
                selector: 'p-chart',
                template: `
        <div style="position:relative" [style.width]="responsive && !width ? null : width" [style.height]="responsive && !height ? null : height">
            <canvas [attr.width]="responsive && !width ? null : width" [attr.height]="responsive && !height ? null : height" (click)="onCanvasClick($event)"></canvas>
        </div>
    `,
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None
            },] }
];
UIChart.ctorParameters = () => [
    { type: ElementRef }
];
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
export class ChartModule {
}
ChartModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule],
                exports: [UIChart],
                declarations: [UIChart]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhcnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9wcmltZW5nL2NoYXJ0LyIsInNvdXJjZXMiOlsiY2hhcnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFFBQVEsRUFBQyxTQUFTLEVBQUMsVUFBVSxFQUFDLGFBQWEsRUFBQyxTQUFTLEVBQUMsS0FBSyxFQUFDLE1BQU0sRUFBQyxZQUFZLEVBQUMsdUJBQXVCLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekosT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQzdDLE9BQU8sS0FBSyxLQUFLLE1BQU0sVUFBVSxDQUFDO0FBWWxDLE1BQU0sT0FBTyxPQUFPO0lBc0JoQixZQUFtQixFQUFjO1FBQWQsT0FBRSxHQUFGLEVBQUUsQ0FBWTtRQWxCeEIsWUFBTyxHQUFVLEVBQUUsQ0FBQztRQU1wQixlQUFVLEdBQVksSUFBSSxDQUFDO1FBRTFCLGlCQUFZLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFNL0QsYUFBUSxHQUFRLEVBQUUsQ0FBQztJQUlpQixDQUFDO0lBRXJDLElBQWEsSUFBSTtRQUNiLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztJQUN0QixDQUFDO0lBRUQsSUFBSSxJQUFJLENBQUMsR0FBTztRQUNaLElBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO1FBQ2pCLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNsQixDQUFDO0lBRUQsSUFBYSxPQUFPO1FBQ2hCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUN6QixDQUFDO0lBRUQsSUFBSSxPQUFPLENBQUMsR0FBTztRQUNmLElBQUksQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDO1FBQ3BCLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNsQixDQUFDO0lBRUQsZUFBZTtRQUNYLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNqQixJQUFJLENBQUMsV0FBVyxHQUFH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S0FBSzt5QkFFTCxLQUFLOzJCQUVMLE1BQU07bUJBWU4sS0FBSztzQkFTTCxLQUFLOztBQWtGVixNQUFNLE9BQU8sV0FBVzs7O1lBTHZCLFFBQVEsU0FBQztnQkFDTixPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7Z0JBQ3ZCLE9BQU8sRUFBRSxDQUFDLE9BQU8sQ0FBQztnQkFDbEIsWUFBWSxFQUFFLENBQUMsT0FBTyxDQUFDO2FBQzFCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtOZ01vZHVsZSxDb21wb25lbnQsRWxlbWVudFJlZixBZnRlclZpZXdJbml0LE9uRGVzdHJveSxJbnB1dCxPdXRwdXQsRXZlbnRFbWl0dGVyLENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBWaWV3RW5jYXBzdWxhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCAqIGFzIENoYXJ0IGZyb20gJ2NoYXJ0LmpzJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdwLWNoYXJ0JyxcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgICA8ZGl2IHN0eWxlPVwicG9zaXRpb246cmVsYXRpdmVcIiBbc3R5bGUud2lkdGhdPVwicmVzcG9uc2l2ZSAmJiAhd2lkdGggPyBudWxsIDogd2lkdGhcIiBbc3R5bGUuaGVpZ2h0XT1cInJlc3BvbnNpdmUgJiYgIWhlaWdodCA/IG51bGwgOiBoZWlnaHRcIj5cbiAgICAgICAgICAgIDxjYW52YXMgW2F0dHIud2lkdGhdPVwicmVzcG9uc2l2ZSAmJiAhd2lkdGggPyBudWxsIDogd2lkdGhcIiBbYXR0ci5oZWlnaHRdPVwicmVzcG9uc2l2ZSAmJiAhaGVpZ2h0ID8gbnVsbCA6IGhlaWdodFwiIChjbGljayk9XCJvbkNhbnZhc0NsaWNrKCRldmVudClcIj48L2NhbnZhcz5cbiAgICAgICAgPC9kaXY+XG4gICAgYCxcbiAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lXG59KVxuZXhwb3J0IGNsYXNzIFVJQ2hhcnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3kge1xuXG4gICAgQElucHV0KCkgdHlwZTogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgcGx1Z2luczogYW55W10gPSBbXTtcbiAgICBcbiAgICBASW5wdXQoKSB3aWR0aDogc3RyaW5nO1xuICAgIFxuICAgIEBJbnB1dCgpIGhlaWdodDogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgcmVzcG9uc2l2ZTogYm9vbGVhbiA9IHRydWU7XG4gICAgXG4gICAgQE91dHB1dCgpIG9uRGF0YVNlbGVjdDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBpbml0aWFsaXplZDogYm9vbGVhbjtcbiAgICBcbiAgICBfZGF0YTogYW55O1xuXG4gICAgX29wdGlvbnM6IGFueSA9IHt9O1xuXG4gICAgY2hhcnQ6IGFueTtcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBlbDogRWxlbWVudFJlZikge31cbiAgICBcbiAgICBASW5wdXQoKSBnZXQgZGF0YSgpOiBhbnkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGF0YTtcbiAgICB9XG5cbiAgICBzZXQgZGF0YSh2YWw6YW55KSB7XG4gICAgICAgIHRoaXMuX2RhdGEgPSB2YWw7XG4gICAgICAgIHRoaXMucmVpbml0KCk7XG4gICAgfVxuXG4gICAgQElucHV0KCkgZ2V0IG9wdGlvbnMoKTogYW55IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX29wdGlvbnM7XG4gICAgfVxuXG4gICAgc2V0IG9wdGlvbnModmFsOmFueSkge1xuICAgICAgICB0aGlzLl9vcHRpb25zID0gdmFsO1xuICAgICAgICB0aGlzLnJlaW5pdCgpO1xuICAgIH1cblxuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAgICAgdGhpcy5pbml0Q2hhcnQoKTtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XG4gICAgfVxuXG4gICAgb25DYW52YXNDbGljayhldmVudCkge1xuICAgICAgICBpZiAodGhpcy5jaGFydCkge1xuICAgICAgICAgICAgbGV0IGVsZW1lbnQgPSB0aGlzLmNoYXJ0LmdldEVsZW1lbnRBdEV2ZW50KGV2ZW50KTtcbiAgICAgICAgICAgIGxldCBkYXRhc2V0ID0gdGhpcy5jaGFydC5nZXREYXRhc2V0QXRFdmVudChldmVudCk7XG4gICAgICAgICAgICBpZiAoZWxlbWVudCAmJiBlbGVtZW50WzBdICYmIGRhdGFzZXQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9uRGF0YVNlbGVjdC5lbWl0KHtvcmlnaW5hbEV2ZW50OiBldmVudCwgZWxlbWVudDogZWxlbWVudFswXSwgZGF0YXNldDogZGF0YXNldH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgaW5pdENoYXJ0KCkge1xuICAgICAgICBsZXQgb3B0cyA9IHRoaXMub3B0aW9uc3x8e307XG4gICAgICAgIG9wdHMucmVzcG9uc2l2ZSA9IHRoaXMucmVzcG9uc2l2ZTtcblxuICAgICAgICAvLyBhbGxvd3MgY2hhcnQgdG8gcmVzaXplIGluIHJlc3BvbnNpdmUgbW9kZVxuICAgICAgICBpZiAob3B0cy5yZXNwb25zaXZlJiYodGhpcy5oZWlnaHR8fHRoaXMud2lkdGgpKSB7XG4gICAgICAgICAgICBvcHRzLm1haW50YWluQXNwZWN0UmF0aW8gPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY2hhcnQgPSBuZXcgQ2hhcnQodGhpcy5lbC5uYXRpdmVFbGVtZW50LmNoaWxkcmVuWzBdLmNoaWxkcmVuWzBdLCB7XG4gICAgICAgICAgICB0eXBlOiB0aGlzLnR5cGUsXG4gICAgICAgICAgICBkYXRhOiB0aGlzLmRhdGEsXG4gICAgICAgICAgICBvcHRpb25zOiB0aGlzLm9wdGlvbnMsXG4gICAgICAgICAgICBwbHVnaW5zOiB0aGlzLnBsdWdpbnNcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIFxuICAgIGdldENhbnZhcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWwubmF0aXZlRWxlbWVudC5jaGlsZHJlblswXS5jaGlsZHJlblswXTtcbiAgICB9XG4gICAgXG4gICAgZ2V0QmFzZTY0SW1hZ2UoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoYXJ0LnRvQmFzZTY0SW1hZ2UoKTtcbiAgICB9XG4gICAgXG4gICAgZ2VuZXJhdGVMZWdlbmQoKSB7XG4gICAgICAgIGlmICh0aGlzLmNoYXJ0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGFydC5nZW5lcmF0ZUxlZ2VuZCgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIHJlZnJlc2goKSB7XG4gICAgICAgIGlmICh0aGlzLmNoYXJ0KSB7XG4gICAgICAgICAgICB0aGlzLmNoYXJ0LnVwZGF0ZSgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIHJlaW5pdCgpIHtcbiAgICAgICAgaWYgKHRoaXMuY2hhcnQpIHtcbiAgICAgICAgICAgIHRoaXMuY2hhcnQuZGVzdHJveSgpO1xuICAgICAgICAgICAgdGhpcy5pbml0Q2hhcnQoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBuZ09uRGVzdHJveSgpIHtcbiAgICAgICAgaWYgKHRoaXMuY2hhcnQpIHtcbiAgICAgICAgICAgIHRoaXMuY2hhcnQuZGVzdHJveSgpO1xuICAgICAgICAgICAgdGhpcy5pbml0aWFsaXplZCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5jaGFydCA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbkBOZ01vZHVsZSh7XG4gICAgaW1wb3J0czogW0NvbW1vbk1vZHVsZV0sXG4gICAgZXhwb3J0czogW1VJQ2hhcnRdLFxuICAgIGRlY2xhcmF0aW9uczogW1VJQ2hhcnRdXG59KVxuZXhwb3J0IGNsYXNzIENoYXJ0TW9kdWxlIHsgfVxuIl19