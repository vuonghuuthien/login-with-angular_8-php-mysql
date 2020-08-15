import { NgModule, Component, Input, AfterViewInit, OnDestroy, ElementRef, ViewChild, ChangeDetectionStrategy, ViewEncapsulation, ChangeDetectorRef, ContentChildren, QueryList, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomHandler } from 'primeng/dom';
import { PrimeTemplate } from 'primeng/api';
export class BlockUI {
    constructor(el, cd) {
        this.el = el;
        this.cd = cd;
        this.autoZIndex = true;
        this.baseZIndex = 0;
    }
    get blocked() {
        return this._blocked;
    }
    set blocked(val) {
        this._blocked = val;
        if (this.mask && this.mask.nativeElement) {
            if (this._blocked)
                this.block();
            else
                this.unblock();
        }
    }
    ngAfterViewInit() {
        if (this.target && !this.target.getBlockableElement) {
            throw 'Target of BlockUI must implement BlockableUI interface';
        }
    }
    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'content':
                    this.contentTemplate = item.template;
                    break;
                default:
                    this.contentTemplate = item.template;
                    break;
            }
        });
    }
    block() {
        if (this.target) {
            this.target.getBlockableElement().appendChild(this.mask.nativeElement);
            this.target.getBlockableElement().style.position = 'relative';
        }
        else {
            document.body.appendChild(this.mask.nativeElement);
        }
        if (this.autoZIndex) {
            this.mask.nativeElement.style.zIndex = String(this.baseZIndex + (++DomHandler.zindex));
        }
    }
    unblock() {
        this.el.nativeElement.appendChild(this.mask.nativeElement);
    }
    ngOnDestroy() {
        this.unblock();
    }
}
BlockUI.ctorParameters = () => [
    { type: ElementRef },
    { type: ChangeDetectorRef }
];
BlockUI.decorators = [
    { type: Component, args: [{
                selector: 'p-blockUI',
                template: `
        <div #mask [class]="styleClass" [ngClass]="{'p-blockui-document':!target, 'p-blockui p-component-overlay': true}" [ngStyle]="{display: blocked ? 'flex' : 'none'}">
            <ng-content></ng-content>
            <ng-container *ngTemplateOutlet="contentTemplate"></ng-container>
        </div>
    `,
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                styles: [".p-blockui{position:absolute;top:0;left:0;width:100%;height:100%;background-color:transparent;transition-property:background-color;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center}.p-blockui.p-component-overlay{position:absolute}.p-blockui-document.p-component-overlay{position:fixed}.p-blockui-leave.p-component-overlay{background-color:transparent}"]
            },] }
];
BlockUI.ctorParameters = () => [
    { type: ElementRef },
    { type: ChangeDetectorRef }
];
BlockUI.propDecorators = {
    target: [{ type: Input }],
    autoZIndex: [{ type: Input }],
    baseZIndex: [{ type: Input }],
    styleClass: [{ type: Input }],
    templates: [{ type: ContentChildren, args: [PrimeTemplate,] }],
    mask: [{ type: ViewChild, args: ['mask',] }],
    blocked: [{ type: Input }]
};
export class BlockUIModule {
}
BlockUIModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule],
                exports: [BlockUI],
                declarations: [BlockUI]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmxvY2t1aS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL3ByaW1lbmcvYmxvY2t1aS8iLCJzb3VyY2VzIjpbImJsb2NrdWkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFFBQVEsRUFBQyxTQUFTLEVBQUMsS0FBSyxFQUFDLGFBQWEsRUFBQyxTQUFTLEVBQUMsVUFBVSxFQUFDLFNBQVMsRUFBQyx1QkFBdUIsRUFBRSxpQkFBaUIsRUFBRSxpQkFBaUIsRUFBRSxlQUFlLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUMzTSxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDN0MsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUN2QyxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBYzFDLE1BQU0sT0FBTyxPQUFPO0lBa0JoQixZQUFtQixFQUFjLEVBQVMsRUFBcUI7UUFBNUMsT0FBRSxHQUFGLEVBQUUsQ0FBWTtRQUFTLE9BQUUsR0FBRixFQUFFLENBQW1CO1FBZHRELGVBQVUsR0FBWSxJQUFJLENBQUM7UUFFM0IsZUFBVSxHQUFXLENBQUMsQ0FBQztJQVlrQyxDQUFDO0lBRW5FLElBQWEsT0FBTztRQUNoQixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDekIsQ0FBQztJQUVELElBQUksT0FBTyxDQUFDLEdBQVk7UUFDcEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUM7UUFFcEIsSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFO1lBQ3RDLElBQUksSUFBSSxDQUFDLFFBQVE7Z0JBQ2IsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDOztnQkFFYixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7U0FDdEI7SUFDTCxDQUFDO0lBRUQsZUFBZTtRQUNYLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsbUJBQW1CLEVBQUU7WUFDakQsTUFBTSx3REFBd0QsQ0FBQztTQUNsRTtJQUNMLENBQUM7SUFFRCxrQkFBa0I7UUFDZCxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO1lBQzVCLFFBQU8sSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFO2dCQUNuQixLQUFLLFNBQVM7b0JBQ1YsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO29CQUN6QyxNQUFNO2dCQUVOO29CQUNJLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztvQkFDekMsTUFBTTthQUNUO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsS0FBSztRQUNELElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNiLElBQUksQ0FBQyxNQUFNLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUN2RSxJQUFJLENBQUMsTUFBTSxDQUFDLG1CQUFtQixFQUFFLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxVQUFVLENBQUM7U0FDakU7YUFDSTtZQUNELFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7U0FDdEQ7UUFFRCxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDakIsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLEVBQUUsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7U0FDMUY7SUFDTCxDQUFDO0lBRUQsT0FBTztRQUNILElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQy9ELENBQUM7SUFFRCxXQUFXO1FBQ1AsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ25CLENBQUM7OztZQXpEc0IsVUFBVTtZQUFhLGlCQUFpQjs7O1lBOUJsRSxTQUFTLFNBQUM7Z0JBQ1AsUUFBUSxFQUFFLFdBQVc7Z0JBQ3JCLFFBQVEsRUFBRTs7Ozs7S0FLVDtnQkFDRCxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtnQkFDL0MsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7O2FBRXhDOzs7WUFoQndELFVBQVU7WUFBdUQsaUJBQWlCOzs7cUJBbUJ0SSxLQUFLO3lCQUVMLEtBQUs7eUJBRUwsS0FBSzt5QkFFTCxLQUFLO3dCQUVMLGVBQWUsU0FBQyxhQUFhO21CQUU3QixTQUFTLFNBQUMsTUFBTTtzQkFRaEIsS0FBSzs7QUErRFYsTUFBTSxPQUFPLGFBQWE7OztZQUx6QixRQUFRLFNBQUM7Z0JBQ04sT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDO2dCQUN2QixPQUFPLEVBQUUsQ0FBQyxPQUFPLENBQUM7Z0JBQ2xCLFlBQVksRUFBRSxDQUFDLE9BQU8sQ0FBQzthQUMxQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7TmdNb2R1bGUsQ29tcG9uZW50LElucHV0LEFmdGVyVmlld0luaXQsT25EZXN0cm95LEVsZW1lbnRSZWYsVmlld0NoaWxkLENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBWaWV3RW5jYXBzdWxhdGlvbiwgQ2hhbmdlRGV0ZWN0b3JSZWYsIENvbnRlbnRDaGlsZHJlbiwgUXVlcnlMaXN0LCBUZW1wbGF0ZVJlZn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7RG9tSGFuZGxlcn0gZnJvbSAncHJpbWVuZy9kb20nO1xuaW1wb3J0IHtQcmltZVRlbXBsYXRlfSBmcm9tICdwcmltZW5nL2FwaSc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAncC1ibG9ja1VJJyxcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgICA8ZGl2ICNtYXNrIFtjbGFzc109XCJzdHlsZUNsYXNzXCIgW25nQ2xhc3NdPVwieydwLWJsb2NrdWktZG9jdW1lbnQnOiF0YXJnZXQsICdwLWJsb2NrdWkgcC1jb21wb25lbnQtb3ZlcmxheSc6IHRydWV9XCIgW25nU3R5bGVdPVwie2Rpc3BsYXk6IGJsb2NrZWQgPyAnZmxleCcgOiAnbm9uZSd9XCI+XG4gICAgICAgICAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiY29udGVudFRlbXBsYXRlXCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgIDwvZGl2PlxuICAgIGAsXG4gICAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gICAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgICBzdHlsZVVybHM6IFsnLi9ibG9ja3VpLmNzcyddXG59KVxuZXhwb3J0IGNsYXNzIEJsb2NrVUkgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LE9uRGVzdHJveSB7XG5cbiAgICBASW5wdXQoKSB0YXJnZXQ6IGFueTtcbiAgICBcbiAgICBASW5wdXQoKSBhdXRvWkluZGV4OiBib29sZWFuID0gdHJ1ZTtcbiAgICBcbiAgICBASW5wdXQoKSBiYXNlWkluZGV4OiBudW1iZXIgPSAwO1xuICAgIFxuICAgIEBJbnB1dCgpIHN0eWxlQ2xhc3M6IHN0cmluZztcbiAgICBcbiAgICBAQ29udGVudENoaWxkcmVuKFByaW1lVGVtcGxhdGUpIHRlbXBsYXRlczogUXVlcnlMaXN0PGFueT47XG5cbiAgICBAVmlld0NoaWxkKCdtYXNrJykgbWFzazogRWxlbWVudFJlZjtcbiAgICBcbiAgICBfYmxvY2tlZDogYm9vbGVhbjtcblxuICAgIGNvbnRlbnRUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcbiAgICAgICAgXG4gICAgY29uc3RydWN0b3IocHVibGljIGVsOiBFbGVtZW50UmVmLCBwdWJsaWMgY2Q6IENoYW5nZURldGVjdG9yUmVmKSB7fVxuICAgIFxuICAgIEBJbnB1dCgpIGdldCBibG9ja2VkKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fYmxvY2tlZDtcbiAgICB9XG4gICAgXG4gICAgc2V0IGJsb2NrZWQodmFsOiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuX2Jsb2NrZWQgPSB2YWw7XG4gICAgICAgIFxuICAgICAgICBpZiAodGhpcy5tYXNrICYmIHRoaXMubWFzay5uYXRpdmVFbGVtZW50KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fYmxvY2tlZClcbiAgICAgICAgICAgICAgICB0aGlzLmJsb2NrKCk7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgdGhpcy51bmJsb2NrKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgICAgICBpZiAodGhpcy50YXJnZXQgJiYgIXRoaXMudGFyZ2V0LmdldEJsb2NrYWJsZUVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRocm93ICdUYXJnZXQgb2YgQmxvY2tVSSBtdXN0IGltcGxlbWVudCBCbG9ja2FibGVVSSBpbnRlcmZhY2UnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgICAgICB0aGlzLnRlbXBsYXRlcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgICBzd2l0Y2goaXRlbS5nZXRUeXBlKCkpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdjb250ZW50JzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZW50VGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudFRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgICAgICBcbiAgICBibG9jaygpIHtcbiAgICAgICAgaWYgKHRoaXMudGFyZ2V0KSB7XG4gICAgICAgICAgICB0aGlzLnRhcmdldC5nZXRCbG9ja2FibGVFbGVtZW50KCkuYXBwZW5kQ2hpbGQodGhpcy5tYXNrLm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgICAgICAgdGhpcy50YXJnZXQuZ2V0QmxvY2thYmxlRWxlbWVudCgpLnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5tYXNrLm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpZiAodGhpcy5hdXRvWkluZGV4KSB7XG4gICAgICAgICAgICB0aGlzLm1hc2submF0aXZlRWxlbWVudC5zdHlsZS56SW5kZXggPSBTdHJpbmcodGhpcy5iYXNlWkluZGV4ICsgKCsrRG9tSGFuZGxlci56aW5kZXgpKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICB1bmJsb2NrKCkge1xuICAgICAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5tYXNrLm5hdGl2ZUVsZW1lbnQpO1xuICAgIH1cbiAgICBcbiAgICBuZ09uRGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy51bmJsb2NrKCk7XG4gICAgfVxufVxuXG5ATmdNb2R1bGUoe1xuICAgIGltcG9ydHM6IFtDb21tb25Nb2R1bGVdLFxuICAgIGV4cG9ydHM6IFtCbG9ja1VJXSxcbiAgICBkZWNsYXJhdGlvbnM6IFtCbG9ja1VJXVxufSlcbmV4cG9ydCBjbGFzcyBCbG9ja1VJTW9kdWxlIHsgfSJdfQ==