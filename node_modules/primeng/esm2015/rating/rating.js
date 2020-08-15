import { NgModule, Component, OnInit, Input, Output, EventEmitter, forwardRef, ChangeDetectorRef, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
export const RATING_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => Rating),
    multi: true
};
export class Rating {
    constructor(cd) {
        this.cd = cd;
        this.stars = 5;
        this.cancel = true;
        this.iconOnClass = 'pi pi-star';
        this.iconOffClass = 'pi pi-star-o';
        this.iconCancelClass = 'pi pi-ban';
        this.onRate = new EventEmitter();
        this.onCancel = new EventEmitter();
        this.onModelChange = () => { };
        this.onModelTouched = () => { };
    }
    ngOnInit() {
        this.starsArray = [];
        for (let i = 0; i < this.stars; i++) {
            this.starsArray[i] = i;
        }
    }
    rate(event, i) {
        if (!this.readonly && !this.disabled) {
            this.value = (i + 1);
            this.onModelChange(this.value);
            this.onModelTouched();
            this.onRate.emit({
                originalEvent: event,
                value: (i + 1)
            });
        }
        event.preventDefault();
    }
    clear(event) {
        if (!this.readonly && !this.disabled) {
            this.value = null;
            this.onModelChange(this.value);
            this.onModelTouched();
            this.onCancel.emit(event);
        }
        event.preventDefault();
    }
    writeValue(value) {
        this.value = value;
        this.cd.detectChanges();
    }
    registerOnChange(fn) {
        this.onModelChange = fn;
    }
    registerOnTouched(fn) {
        this.onModelTouched = fn;
    }
    setDisabledState(val) {
        this.disabled = val;
    }
}
Rating.ctorParameters = () => [
    { type: ChangeDetectorRef }
];
Rating.decorators = [
    { type: Component, args: [{
                selector: 'p-rating',
                template: `
        <div class="p-rating" [ngClass]="{'p-readonly': readonly, 'p-disabled': disabled}">
            <span [attr.tabindex]="(disabled || readonly) ? null : '0'" *ngIf="cancel" (click)="clear($event)" (keydown.enter)="clear($event)" class="p-rating-icon p-rating-cancel" [ngClass]="iconCancelClass" [ngStyle]="iconCancelStyle"></span>
            <span *ngFor="let star of starsArray;let i=index" class="p-rating-icon" [attr.tabindex]="(disabled || readonly) ? null : '0'"  (click)="rate($event,i)" (keydown.enter)="rate($event,i)"
                [ngClass]="(!value || i >= value) ? iconOffClass : iconOnClass"
                [ngStyle]="(!value || i >= value) ? iconOffStyle : iconOnStyle"></span>
        </div>
    `,
                providers: [RATING_VALUE_ACCESSOR],
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                styles: [".p-rating-icon{cursor:pointer}.p-rating.p-rating-readonly .p-rating-icon{cursor:default}"]
            },] }
];
Rating.ctorParameters = () => [
    { type: ChangeDetectorRef }
];
Rating.propDecorators = {
    disabled: [{ type: Input }],
    readonly: [{ type: Input }],
    stars: [{ type: Input }],
    cancel: [{ type: Input }],
    iconOnClass: [{ type: Input }],
    iconOnStyle: [{ type: Input }],
    iconOffClass: [{ type: Input }],
    iconOffStyle: [{ type: Input }],
    iconCancelClass: [{ type: Input }],
    iconCancelStyle: [{ type: Input }],
    onRate: [{ type: Output }],
    onCancel: [{ type: Output }]
};
export class RatingModule {
}
RatingModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule],
                exports: [Rating],
                declarations: [Rating]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmF0aW5nLmpzIiwic291cmNlUm9vdCI6Im5nOi8vcHJpbWVuZy9yYXRpbmcvIiwic291cmNlcyI6WyJyYXRpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFFBQVEsRUFBQyxTQUFTLEVBQUMsTUFBTSxFQUFDLEtBQUssRUFBQyxNQUFNLEVBQUMsWUFBWSxFQUFDLFVBQVUsRUFBQyxpQkFBaUIsRUFBQyx1QkFBdUIsRUFBRSxpQkFBaUIsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUMxSixPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDN0MsT0FBTyxFQUFDLGlCQUFpQixFQUF1QixNQUFNLGdCQUFnQixDQUFDO0FBRXZFLE1BQU0sQ0FBQyxNQUFNLHFCQUFxQixHQUFRO0lBQ3hDLE9BQU8sRUFBRSxpQkFBaUI7SUFDMUIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUM7SUFDckMsS0FBSyxFQUFFLElBQUk7Q0FDWixDQUFDO0FBaUJGLE1BQU0sT0FBTyxNQUFNO0lBMEJmLFlBQW9CLEVBQXFCO1FBQXJCLE9BQUUsR0FBRixFQUFFLENBQW1CO1FBcEJoQyxVQUFLLEdBQVcsQ0FBQyxDQUFDO1FBRWxCLFdBQU0sR0FBWSxJQUFJLENBQUM7UUFFdkIsZ0JBQVcsR0FBVyxZQUFZLENBQUM7UUFJbkMsaUJBQVksR0FBVyxjQUFjLENBQUM7UUFJdEMsb0JBQWUsR0FBVyxXQUFXLENBQUM7UUFJckMsV0FBTSxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBRS9DLGFBQVEsR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQU0zRCxrQkFBYSxHQUFhLEdBQUcsRUFBRSxHQUFFLENBQUMsQ0FBQztRQUVuQyxtQkFBYyxHQUFhLEdBQUcsRUFBRSxHQUFFLENBQUMsQ0FBQztJQU5RLENBQUM7SUFVN0MsUUFBUTtRQUNKLElBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDO1FBQ3JCLEtBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ2hDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQzFCO0lBQ0wsQ0FBQztJQUVELElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBUztRQUNqQixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDaEMsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNyQixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMvQixJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDdEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7Z0JBQ2IsYUFBYSxFQUFFLEtBQUs7Z0JBQ3BCLEtBQUssRUFBRSxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUM7YUFDZixDQUFDLENBQUM7U0FDTjtRQUNELEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUMzQixDQUFDO0lBRUQsS0FBSyxDQUFDLEtBQUs7UUFDUCxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDaEMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7WUFDbEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDL0IsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ3RCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzdCO1FBQ0QsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQzNCLENBQUM7SUFFRCxVQUFVLENBQUMsS0FBVTtRQUNqQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQzVCLENBQUM7SUFFRCxnQkFBZ0IsQ0FBQyxFQUFZO1FBQ3pCLElBQUksQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDO0lBQzVCLENBQUM7SUFFRCxpQkFBaUIsQ0FBQyxFQUFZO1FBQzFCLElBQUksQ0FBQyxjQUFjLEdBQUcsRUFBRSxDQUFDO0lBQzdCLENBQUM7SUFFRCxnQkFBZ0IsQ0FBQyxHQUFZO1FBQ3pCLElBQUksQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDO0lBQ3hCLENBQUM7OztZQXZEdUIsaUJBQWlCOzs7WUF6QzVDLFNBQVMsU0FBQztnQkFDUCxRQUFRLEVBQUUsVUFBVTtnQkFDcEIsUUFBUSxFQUFFOzs7Ozs7O0tBT1Q7Z0JBQ0QsU0FBUyxFQUFFLENBQUMscUJBQXFCLENBQUM7Z0JBQ2xDLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2dCQUMvQyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTs7YUFFeEM7OztZQXhCc0UsaUJBQWlCOzs7dUJBMkJuRixLQUFLO3VCQUVMLEtBQUs7b0JBRUwsS0FBSztxQkFFTCxLQUFLOzBCQUVMLEtBQUs7MEJBRUwsS0FBSzsyQkFFTCxLQUFLOzJCQUVMLEtBQUs7OEJBRUwsS0FBSzs4QkFFTCxLQUFLO3FCQUVMLE1BQU07dUJBRU4sTUFBTTs7QUFpRVgsTUFBTSxPQUFPLFlBQVk7OztZQUx4QixRQUFRLFNBQUM7Z0JBQ04sT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDO2dCQUN2QixPQUFPLEVBQUUsQ0FBQyxNQUFNLENBQUM7Z0JBQ2pCLFlBQVksRUFBRSxDQUFDLE1BQU0sQ0FBQzthQUN6QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7TmdNb2R1bGUsQ29tcG9uZW50LE9uSW5pdCxJbnB1dCxPdXRwdXQsRXZlbnRFbWl0dGVyLGZvcndhcmRSZWYsQ2hhbmdlRGV0ZWN0b3JSZWYsQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIFZpZXdFbmNhcHN1bGF0aW9ufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtOR19WQUxVRV9BQ0NFU1NPUiwgQ29udHJvbFZhbHVlQWNjZXNzb3J9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuZXhwb3J0IGNvbnN0IFJBVElOR19WQUxVRV9BQ0NFU1NPUjogYW55ID0ge1xuICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gUmF0aW5nKSxcbiAgbXVsdGk6IHRydWVcbn07XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAncC1yYXRpbmcnLFxuICAgIHRlbXBsYXRlOiBgXG4gICAgICAgIDxkaXYgY2xhc3M9XCJwLXJhdGluZ1wiIFtuZ0NsYXNzXT1cInsncC1yZWFkb25seSc6IHJlYWRvbmx5LCAncC1kaXNhYmxlZCc6IGRpc2FibGVkfVwiPlxuICAgICAgICAgICAgPHNwYW4gW2F0dHIudGFiaW5kZXhdPVwiKGRpc2FibGVkIHx8IHJlYWRvbmx5KSA/IG51bGwgOiAnMCdcIiAqbmdJZj1cImNhbmNlbFwiIChjbGljayk9XCJjbGVhcigkZXZlbnQpXCIgKGtleWRvd24uZW50ZXIpPVwiY2xlYXIoJGV2ZW50KVwiIGNsYXNzPVwicC1yYXRpbmctaWNvbiBwLXJhdGluZy1jYW5jZWxcIiBbbmdDbGFzc109XCJpY29uQ2FuY2VsQ2xhc3NcIiBbbmdTdHlsZV09XCJpY29uQ2FuY2VsU3R5bGVcIj48L3NwYW4+XG4gICAgICAgICAgICA8c3BhbiAqbmdGb3I9XCJsZXQgc3RhciBvZiBzdGFyc0FycmF5O2xldCBpPWluZGV4XCIgY2xhc3M9XCJwLXJhdGluZy1pY29uXCIgW2F0dHIudGFiaW5kZXhdPVwiKGRpc2FibGVkIHx8IHJlYWRvbmx5KSA/IG51bGwgOiAnMCdcIiAgKGNsaWNrKT1cInJhdGUoJGV2ZW50LGkpXCIgKGtleWRvd24uZW50ZXIpPVwicmF0ZSgkZXZlbnQsaSlcIlxuICAgICAgICAgICAgICAgIFtuZ0NsYXNzXT1cIighdmFsdWUgfHwgaSA+PSB2YWx1ZSkgPyBpY29uT2ZmQ2xhc3MgOiBpY29uT25DbGFzc1wiXG4gICAgICAgICAgICAgICAgW25nU3R5bGVdPVwiKCF2YWx1ZSB8fCBpID49IHZhbHVlKSA/IGljb25PZmZTdHlsZSA6IGljb25PblN0eWxlXCI+PC9zcGFuPlxuICAgICAgICA8L2Rpdj5cbiAgICBgLFxuICAgIHByb3ZpZGVyczogW1JBVElOR19WQUxVRV9BQ0NFU1NPUl0sXG4gICAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gICAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgICBzdHlsZVVybHM6IFsnLi9yYXRpbmcuY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgUmF0aW5nIGltcGxlbWVudHMgT25Jbml0LENvbnRyb2xWYWx1ZUFjY2Vzc29yIHtcblxuICAgIEBJbnB1dCgpIGRpc2FibGVkOiBib29sZWFuO1xuXG4gICAgQElucHV0KCkgcmVhZG9ubHk6IGJvb2xlYW47XG5cbiAgICBASW5wdXQoKSBzdGFyczogbnVtYmVyID0gNTtcblxuICAgIEBJbnB1dCgpIGNhbmNlbDogYm9vbGVhbiA9IHRydWU7XG5cbiAgICBASW5wdXQoKSBpY29uT25DbGFzczogc3RyaW5nID0gJ3BpIHBpLXN0YXInO1xuXG4gICAgQElucHV0KCkgaWNvbk9uU3R5bGU6IGFueTtcblxuICAgIEBJbnB1dCgpIGljb25PZmZDbGFzczogc3RyaW5nID0gJ3BpIHBpLXN0YXItbyc7XG5cbiAgICBASW5wdXQoKSBpY29uT2ZmU3R5bGU6IGFueTtcblxuICAgIEBJbnB1dCgpIGljb25DYW5jZWxDbGFzczogc3RyaW5nID0gJ3BpIHBpLWJhbic7XG5cbiAgICBASW5wdXQoKSBpY29uQ2FuY2VsU3R5bGU6IGFueTtcblxuICAgIEBPdXRwdXQoKSBvblJhdGU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpIG9uQ2FuY2VsOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgY2Q6IENoYW5nZURldGVjdG9yUmVmKSB7fSBcbiAgICBcbiAgICB2YWx1ZTogbnVtYmVyO1xuICAgIFxuICAgIG9uTW9kZWxDaGFuZ2U6IEZ1bmN0aW9uID0gKCkgPT4ge307XG4gICAgXG4gICAgb25Nb2RlbFRvdWNoZWQ6IEZ1bmN0aW9uID0gKCkgPT4ge307XG4gICAgXG4gICAgcHVibGljIHN0YXJzQXJyYXk6IG51bWJlcltdO1xuICAgIFxuICAgIG5nT25Jbml0KCkge1xuICAgICAgICB0aGlzLnN0YXJzQXJyYXkgPSBbXTtcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMuc3RhcnM7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5zdGFyc0FycmF5W2ldID0gaTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICByYXRlKGV2ZW50LCBpOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLnJlYWRvbmx5JiYhdGhpcy5kaXNhYmxlZCkge1xuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IChpICsgMSk7XG4gICAgICAgICAgICB0aGlzLm9uTW9kZWxDaGFuZ2UodGhpcy52YWx1ZSk7XG4gICAgICAgICAgICB0aGlzLm9uTW9kZWxUb3VjaGVkKCk7XG4gICAgICAgICAgICB0aGlzLm9uUmF0ZS5lbWl0KHtcbiAgICAgICAgICAgICAgICBvcmlnaW5hbEV2ZW50OiBldmVudCxcbiAgICAgICAgICAgICAgICB2YWx1ZTogKGkrMSlcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7ICAgICAgICBcbiAgICB9XG4gICAgXG4gICAgY2xlYXIoZXZlbnQpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLnJlYWRvbmx5JiYhdGhpcy5kaXNhYmxlZCkge1xuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLm9uTW9kZWxDaGFuZ2UodGhpcy52YWx1ZSk7XG4gICAgICAgICAgICB0aGlzLm9uTW9kZWxUb3VjaGVkKCk7XG4gICAgICAgICAgICB0aGlzLm9uQ2FuY2VsLmVtaXQoZXZlbnQpO1xuICAgICAgICB9XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuICAgIFxuICAgIHdyaXRlVmFsdWUodmFsdWU6IGFueSkgOiB2b2lkIHtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmNkLmRldGVjdENoYW5nZXMoKTtcbiAgICB9XG4gICAgXG4gICAgcmVnaXN0ZXJPbkNoYW5nZShmbjogRnVuY3Rpb24pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5vbk1vZGVsQ2hhbmdlID0gZm47XG4gICAgfVxuXG4gICAgcmVnaXN0ZXJPblRvdWNoZWQoZm46IEZ1bmN0aW9uKTogdm9pZCB7XG4gICAgICAgIHRoaXMub25Nb2RlbFRvdWNoZWQgPSBmbjtcbiAgICB9XG4gICAgXG4gICAgc2V0RGlzYWJsZWRTdGF0ZSh2YWw6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5kaXNhYmxlZCA9IHZhbDtcbiAgICB9XG59XG5cbkBOZ01vZHVsZSh7XG4gICAgaW1wb3J0czogW0NvbW1vbk1vZHVsZV0sXG4gICAgZXhwb3J0czogW1JhdGluZ10sXG4gICAgZGVjbGFyYXRpb25zOiBbUmF0aW5nXVxufSlcbmV4cG9ydCBjbGFzcyBSYXRpbmdNb2R1bGUgeyB9Il19