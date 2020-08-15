import { NgModule, Directive, ElementRef, HostListener, DoCheck, Optional } from '@angular/core';
import { NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';
export class InputText {
    constructor(el, ngModel) {
        this.el = el;
        this.ngModel = ngModel;
    }
    ngDoCheck() {
        this.updateFilledState();
    }
    onInput(e) {
        this.updateFilledState();
    }
    updateFilledState() {
        this.filled = (this.el.nativeElement.value && this.el.nativeElement.value.length) ||
            (this.ngModel && this.ngModel.model);
    }
}
InputText.ctorParameters = () => [
    { type: ElementRef },
    { type: NgModel, decorators: [{ type: Optional }] }
];
InputText.decorators = [
    { type: Directive, args: [{
                selector: '[pInputText]',
                host: {
                    '[class.p-inputtext]': 'true',
                    '[class.p-component]': 'true',
                    '[class.p-filled]': 'filled'
                }
            },] }
];
InputText.ctorParameters = () => [
    { type: ElementRef },
    { type: NgModel, decorators: [{ type: Optional }] }
];
InputText.propDecorators = {
    onInput: [{ type: HostListener, args: ['input', ['$event'],] }]
};
export class InputTextModule {
}
InputTextModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule],
                exports: [InputText],
                declarations: [InputText]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXR0ZXh0LmpzIiwic291cmNlUm9vdCI6Im5nOi8vcHJpbWVuZy9pbnB1dHRleHQvIiwic291cmNlcyI6WyJpbnB1dHRleHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFFBQVEsRUFBQyxTQUFTLEVBQUMsVUFBVSxFQUFDLFlBQVksRUFBQyxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzFGLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUN2QyxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFVN0MsTUFBTSxPQUFPLFNBQVM7SUFJbEIsWUFBbUIsRUFBYyxFQUFxQixPQUFnQjtRQUFuRCxPQUFFLEdBQUYsRUFBRSxDQUFZO1FBQXFCLFlBQU8sR0FBUCxPQUFPLENBQVM7SUFBRyxDQUFDO0lBRTFFLFNBQVM7UUFDTCxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztJQUM3QixDQUFDO0lBR0QsT0FBTyxDQUFDLENBQUM7UUFDTCxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztJQUM3QixDQUFDO0lBRUQsaUJBQWlCO1FBQ2IsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO1lBQ2pFLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3pELENBQUM7OztZQWRzQixVQUFVO1lBQThCLE9BQU8sdUJBQWxDLFFBQVE7OztZQVovQyxTQUFTLFNBQUM7Z0JBQ1AsUUFBUSxFQUFFLGNBQWM7Z0JBQ3hCLElBQUksRUFBRTtvQkFDRixxQkFBcUIsRUFBRSxNQUFNO29CQUM3QixxQkFBcUIsRUFBRSxNQUFNO29CQUM3QixrQkFBa0IsRUFBRSxRQUFRO2lCQUMvQjthQUNKOzs7WUFYMEIsVUFBVTtZQUM3QixPQUFPLHVCQWV5QixRQUFROzs7c0JBTTNDLFlBQVksU0FBQyxPQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUM7O0FBZ0JyQyxNQUFNLE9BQU8sZUFBZTs7O1lBTDNCLFFBQVEsU0FBQztnQkFDTixPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7Z0JBQ3ZCLE9BQU8sRUFBRSxDQUFDLFNBQVMsQ0FBQztnQkFDcEIsWUFBWSxFQUFFLENBQUMsU0FBUyxDQUFDO2FBQzVCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtOZ01vZHVsZSxEaXJlY3RpdmUsRWxlbWVudFJlZixIb3N0TGlzdGVuZXIsRG9DaGVjayxPcHRpb25hbH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge05nTW9kZWx9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG5ARGlyZWN0aXZlKHtcbiAgICBzZWxlY3RvcjogJ1twSW5wdXRUZXh0XScsXG4gICAgaG9zdDoge1xuICAgICAgICAnW2NsYXNzLnAtaW5wdXR0ZXh0XSc6ICd0cnVlJyxcbiAgICAgICAgJ1tjbGFzcy5wLWNvbXBvbmVudF0nOiAndHJ1ZScsXG4gICAgICAgICdbY2xhc3MucC1maWxsZWRdJzogJ2ZpbGxlZCdcbiAgICB9XG59KVxuZXhwb3J0IGNsYXNzIElucHV0VGV4dCBpbXBsZW1lbnRzIERvQ2hlY2sge1xuXG4gICAgZmlsbGVkOiBib29sZWFuO1xuXG4gICAgY29uc3RydWN0b3IocHVibGljIGVsOiBFbGVtZW50UmVmLCBAT3B0aW9uYWwoKSBwdWJsaWMgbmdNb2RlbDogTmdNb2RlbCkge31cbiAgICAgICAgXG4gICAgbmdEb0NoZWNrKCkge1xuICAgICAgICB0aGlzLnVwZGF0ZUZpbGxlZFN0YXRlKCk7XG4gICAgfVxuICAgIFxuICAgIEBIb3N0TGlzdGVuZXIoJ2lucHV0JywgWyckZXZlbnQnXSkgXG4gICAgb25JbnB1dChlKSB7XG4gICAgICAgIHRoaXMudXBkYXRlRmlsbGVkU3RhdGUoKTtcbiAgICB9XG4gICAgXG4gICAgdXBkYXRlRmlsbGVkU3RhdGUoKSB7XG4gICAgICAgIHRoaXMuZmlsbGVkID0gKHRoaXMuZWwubmF0aXZlRWxlbWVudC52YWx1ZSAmJiB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQudmFsdWUubGVuZ3RoKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgKHRoaXMubmdNb2RlbCAmJiB0aGlzLm5nTW9kZWwubW9kZWwpO1xuICAgIH1cbn1cblxuQE5nTW9kdWxlKHtcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlXSxcbiAgICBleHBvcnRzOiBbSW5wdXRUZXh0XSxcbiAgICBkZWNsYXJhdGlvbnM6IFtJbnB1dFRleHRdXG59KVxuZXhwb3J0IGNsYXNzIElucHV0VGV4dE1vZHVsZSB7IH0iXX0=