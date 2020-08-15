import { ElementRef, Component, ChangeDetectionStrategy, ViewEncapsulation, Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Calendar } from '@fullcalendar/core';

var FullCalendar = /** @class */ (function () {
    function FullCalendar(el) {
        this.el = el;
    }
    FullCalendar.prototype.ngOnInit = function () {
        this.config = {
            theme: true
        };
        if (this.options) {
            for (var prop in this.options) {
                this.config[prop] = this.options[prop];
            }
        }
    };
    FullCalendar.prototype.ngAfterViewChecked = function () {
        if (!this.initialized && this.el.nativeElement.offsetParent) {
            this.initialize();
        }
    };
    Object.defineProperty(FullCalendar.prototype, "events", {
        get: function () {
            return this._events;
        },
        set: function (value) {
            this._events = value;
            if (this._events && this.calendar) {
                this.calendar.removeAllEventSources();
                this.calendar.addEventSource(this._events);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FullCalendar.prototype, "options", {
        get: function () {
            return this._options;
        },
        set: function (value) {
            this._options = value;
            if (this._options && this.calendar) {
                for (var prop in this._options) {
                    var optionValue = this._options[prop];
                    this.config[prop] = optionValue;
                    this.calendar.setOption(prop, optionValue);
                }
            }
        },
        enumerable: false,
        configurable: true
    });
    FullCalendar.prototype.initialize = function () {
        this.calendar = new Calendar(this.el.nativeElement.children[0], this.config);
        this.calendar.render();
        this.initialized = true;
        if (this.events) {
            this.calendar.removeAllEventSources();
            this.calendar.addEventSource(this.events);
        }
    };
    FullCalendar.prototype.getCalendar = function () {
        return this.calendar;
    };
    FullCalendar.prototype.ngOnDestroy = function () {
        if (this.calendar) {
            this.calendar.destroy();
            this.initialized = false;
            this.calendar = null;
        }
    };
    FullCalendar.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    FullCalendar.decorators = [
        { type: Component, args: [{
                    selector: 'p-fullCalendar',
                    template: '<div [ngStyle]="style" [class]="styleClass"></div>',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None
                },] }
    ];
    FullCalendar.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    FullCalendar.propDecorators = {
        style: [{ type: Input }],
        styleClass: [{ type: Input }],
        events: [{ type: Input }],
        options: [{ type: Input }]
    };
    return FullCalendar;
}());
var FullCalendarModule = /** @class */ (function () {
    function FullCalendarModule() {
    }
    FullCalendarModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule],
                    exports: [FullCalendar],
                    declarations: [FullCalendar]
                },] }
    ];
    return FullCalendarModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { FullCalendar, FullCalendarModule };
//# sourceMappingURL=primeng-fullcalendar.js.map
