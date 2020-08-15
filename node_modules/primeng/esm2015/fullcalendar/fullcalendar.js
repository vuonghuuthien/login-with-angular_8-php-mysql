import { NgModule, Component, ElementRef, OnDestroy, Input, OnInit, AfterViewChecked, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Calendar } from '@fullcalendar/core';
export class FullCalendar {
    constructor(el) {
        this.el = el;
    }
    ngOnInit() {
        this.config = {
            theme: true
        };
        if (this.options) {
            for (let prop in this.options) {
                this.config[prop] = this.options[prop];
            }
        }
    }
    ngAfterViewChecked() {
        if (!this.initialized && this.el.nativeElement.offsetParent) {
            this.initialize();
        }
    }
    get events() {
        return this._events;
    }
    set events(value) {
        this._events = value;
        if (this._events && this.calendar) {
            this.calendar.removeAllEventSources();
            this.calendar.addEventSource(this._events);
        }
    }
    get options() {
        return this._options;
    }
    set options(value) {
        this._options = value;
        if (this._options && this.calendar) {
            for (let prop in this._options) {
                let optionValue = this._options[prop];
                this.config[prop] = optionValue;
                this.calendar.setOption(prop, optionValue);
            }
        }
    }
    initialize() {
        this.calendar = new Calendar(this.el.nativeElement.children[0], this.config);
        this.calendar.render();
        this.initialized = true;
        if (this.events) {
            this.calendar.removeAllEventSources();
            this.calendar.addEventSource(this.events);
        }
    }
    getCalendar() {
        return this.calendar;
    }
    ngOnDestroy() {
        if (this.calendar) {
            this.calendar.destroy();
            this.initialized = false;
            this.calendar = null;
        }
    }
}
FullCalendar.ctorParameters = () => [
    { type: ElementRef }
];
FullCalendar.decorators = [
    { type: Component, args: [{
                selector: 'p-fullCalendar',
                template: '<div [ngStyle]="style" [class]="styleClass"></div>',
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None
            },] }
];
FullCalendar.ctorParameters = () => [
    { type: ElementRef }
];
FullCalendar.propDecorators = {
    style: [{ type: Input }],
    styleClass: [{ type: Input }],
    events: [{ type: Input }],
    options: [{ type: Input }]
};
export class FullCalendarModule {
}
FullCalendarModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule],
                exports: [FullCalendar],
                declarations: [FullCalendar]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVsbGNhbGVuZGFyLmpzIiwic291cmNlUm9vdCI6Im5nOi8vcHJpbWVuZy9mdWxsY2FsZW5kYXIvIiwic291cmNlcyI6WyJmdWxsY2FsZW5kYXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFFBQVEsRUFBQyxTQUFTLEVBQUMsVUFBVSxFQUFDLFNBQVMsRUFBQyxLQUFLLEVBQUMsTUFBTSxFQUFDLGdCQUFnQixFQUFDLHVCQUF1QixFQUFFLGlCQUFpQixFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQy9JLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUM3QyxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFRNUMsTUFBTSxPQUFPLFlBQVk7SUFnQnJCLFlBQW1CLEVBQWM7UUFBZCxPQUFFLEdBQUYsRUFBRSxDQUFZO0lBQUcsQ0FBQztJQUVyQyxRQUFRO1FBQ0osSUFBSSxDQUFDLE1BQU0sR0FBRztZQUNWLEtBQUssRUFBRSxJQUFJO1NBQ2QsQ0FBQztRQUVGLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNkLEtBQUssSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtnQkFDM0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQzFDO1NBQ0o7SUFDTCxDQUFDO0lBRUQsa0JBQWtCO1FBQ2QsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsWUFBWSxFQUFFO1lBQ3pELElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztTQUNyQjtJQUNMLENBQUM7SUFFRCxJQUFhLE1BQU07UUFDZixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7SUFDeEIsQ0FBQztJQUVELElBQUksTUFBTSxDQUFDLEtBQVU7UUFDakIsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7UUFFckIsSUFBSSxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDL0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1lBQ3RDLElBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUM5QztJQUNMLENBQUM7SUFFRCxJQUFhLE9BQU87UUFDaEIsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3pCLENBQUM7SUFFRCxJQUFJLE9BQU8sQ0FBQyxLQUFVO1FBQ2xCLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO1FBRXRCLElBQUksSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2hDLEtBQUssSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDNUIsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDdEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxXQUFXLENBQUM7Z0JBQ2hDLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsQ0FBQzthQUM5QztTQUNKO0lBQ0wsQ0FBQztJQUVELFVBQVU7UUFDTixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDN0UsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUN2QixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztRQUV4QixJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDYixJQUFJLENBQUMsUUFBUSxDQUFDLHFCQUFxQixFQUFFLENBQUM7WUFDdEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQzdDO0lBQ0wsQ0FBQztJQUVELFdBQVc7UUFDUCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDekIsQ0FBQztJQUVELFdBQVc7UUFDUCxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDZixJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ3hCLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO1lBQ3pCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1NBQ3hCO0lBQ0wsQ0FBQzs7O1lBdEVzQixVQUFVOzs7WUF0QnBDLFNBQVMsU0FBQztnQkFDUCxRQUFRLEVBQUUsZ0JBQWdCO2dCQUMxQixRQUFRLEVBQUUsb0RBQW9EO2dCQUM5RCxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtnQkFDL0MsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7YUFDeEM7OztZQVQwQixVQUFVOzs7b0JBWWhDLEtBQUs7eUJBRUwsS0FBSztxQkFnQ0wsS0FBSztzQkFhTCxLQUFLOztBQTZDVixNQUFNLE9BQU8sa0JBQWtCOzs7WUFMOUIsUUFBUSxTQUFDO2dCQUNOLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQztnQkFDdkIsT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDO2dCQUN2QixZQUFZLEVBQUUsQ0FBQyxZQUFZLENBQUM7YUFDL0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge05nTW9kdWxlLENvbXBvbmVudCxFbGVtZW50UmVmLE9uRGVzdHJveSxJbnB1dCxPbkluaXQsQWZ0ZXJWaWV3Q2hlY2tlZCxDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgVmlld0VuY2Fwc3VsYXRpb259IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge0NhbGVuZGFyfSBmcm9tICdAZnVsbGNhbGVuZGFyL2NvcmUnO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3AtZnVsbENhbGVuZGFyJyxcbiAgICB0ZW1wbGF0ZTogJzxkaXYgW25nU3R5bGVdPVwic3R5bGVcIiBbY2xhc3NdPVwic3R5bGVDbGFzc1wiPjwvZGl2PicsXG4gICAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gICAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZVxufSlcbmV4cG9ydCBjbGFzcyBGdWxsQ2FsZW5kYXIgaW1wbGVtZW50cyBPbkRlc3Ryb3ksT25Jbml0LEFmdGVyVmlld0NoZWNrZWQge1xuICAgICAgICBcbiAgICBASW5wdXQoKSBzdHlsZTogYW55O1xuXG4gICAgQElucHV0KCkgc3R5bGVDbGFzczogc3RyaW5nO1xuICAgICAgICAgICAgIFxuICAgIGluaXRpYWxpemVkOiBib29sZWFuO1xuICAgICAgICAgICAgXG4gICAgY2FsZW5kYXI6IGFueTtcbiAgICBcbiAgICBjb25maWc6IGFueTtcblxuICAgIF9vcHRpb25zOiBhbnk7XG5cbiAgICBfZXZlbnRzOiBhbnlbXTtcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBlbDogRWxlbWVudFJlZikge31cbiAgICBcbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgdGhpcy5jb25maWcgPSB7XG4gICAgICAgICAgICB0aGVtZTogdHJ1ZVxuICAgICAgICB9O1xuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMpIHtcbiAgICAgICAgICAgIGZvciAobGV0IHByb3AgaW4gdGhpcy5vcHRpb25zKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb25maWdbcHJvcF0gPSB0aGlzLm9wdGlvbnNbcHJvcF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgbmdBZnRlclZpZXdDaGVja2VkKCkge1xuICAgICAgICBpZiAoIXRoaXMuaW5pdGlhbGl6ZWQgJiYgdGhpcy5lbC5uYXRpdmVFbGVtZW50Lm9mZnNldFBhcmVudCkge1xuICAgICAgICAgICAgdGhpcy5pbml0aWFsaXplKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgQElucHV0KCkgZ2V0IGV2ZW50cygpOiBhbnkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZXZlbnRzO1xuICAgIH1cblxuICAgIHNldCBldmVudHModmFsdWU6IGFueSkge1xuICAgICAgICB0aGlzLl9ldmVudHMgPSB2YWx1ZTtcblxuICAgICAgICBpZiAodGhpcy5fZXZlbnRzICYmIHRoaXMuY2FsZW5kYXIpIHtcbiAgICAgICAgICAgIHRoaXMuY2FsZW5kYXIucmVtb3ZlQWxsRXZlbnRTb3VyY2VzKCk7XG4gICAgICAgICAgICB0aGlzLmNhbGVuZGFyLmFkZEV2ZW50U291cmNlKHRoaXMuX2V2ZW50cyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBASW5wdXQoKSBnZXQgb3B0aW9ucygpOiBhbnkge1xuICAgICAgICByZXR1cm4gdGhpcy5fb3B0aW9ucztcbiAgICB9XG5cbiAgICBzZXQgb3B0aW9ucyh2YWx1ZTogYW55KSB7XG4gICAgICAgIHRoaXMuX29wdGlvbnMgPSB2YWx1ZTtcblxuICAgICAgICBpZiAodGhpcy5fb3B0aW9ucyAmJiB0aGlzLmNhbGVuZGFyKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBwcm9wIGluIHRoaXMuX29wdGlvbnMpIHtcbiAgICAgICAgICAgICAgICBsZXQgb3B0aW9uVmFsdWUgPSB0aGlzLl9vcHRpb25zW3Byb3BdO1xuICAgICAgICAgICAgICAgIHRoaXMuY29uZmlnW3Byb3BdID0gb3B0aW9uVmFsdWU7XG4gICAgICAgICAgICAgICAgdGhpcy5jYWxlbmRhci5zZXRPcHRpb24ocHJvcCwgb3B0aW9uVmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZSgpIHtcbiAgICAgICAgdGhpcy5jYWxlbmRhciA9IG5ldyBDYWxlbmRhcih0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuY2hpbGRyZW5bMF0sIHRoaXMuY29uZmlnKTtcbiAgICAgICAgdGhpcy5jYWxlbmRhci5yZW5kZXIoKTtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XG4gICAgICAgIFxuICAgICAgICBpZiAodGhpcy5ldmVudHMpIHtcbiAgICAgICAgICAgIHRoaXMuY2FsZW5kYXIucmVtb3ZlQWxsRXZlbnRTb3VyY2VzKCk7XG4gICAgICAgICAgICB0aGlzLmNhbGVuZGFyLmFkZEV2ZW50U291cmNlKHRoaXMuZXZlbnRzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldENhbGVuZGFyKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jYWxlbmRhcjtcbiAgICB9XG4gICAgIFxuICAgIG5nT25EZXN0cm95KCkge1xuICAgICAgICBpZiAodGhpcy5jYWxlbmRhcikge1xuICAgICAgICAgICAgdGhpcy5jYWxlbmRhci5kZXN0cm95KCk7XG4gICAgICAgICAgICB0aGlzLmluaXRpYWxpemVkID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmNhbGVuZGFyID0gbnVsbDtcbiAgICAgICAgfSAgICAgICAgXG4gICAgfVxufVxuXG5ATmdNb2R1bGUoe1xuICAgIGltcG9ydHM6IFtDb21tb25Nb2R1bGVdLFxuICAgIGV4cG9ydHM6IFtGdWxsQ2FsZW5kYXJdLFxuICAgIGRlY2xhcmF0aW9uczogW0Z1bGxDYWxlbmRhcl1cbn0pXG5leHBvcnQgY2xhc3MgRnVsbENhbGVuZGFyTW9kdWxlIHsgfVxuIl19