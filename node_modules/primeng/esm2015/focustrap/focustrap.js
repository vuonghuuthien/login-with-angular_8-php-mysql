import { NgModule, Directive, ElementRef, HostListener, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomHandler } from 'primeng/dom';
export class FocusTrap {
    constructor(el) {
        this.el = el;
    }
    onkeydown(e) {
        if (this.pFocusTrapDisabled !== true) {
            e.preventDefault();
            let focusableElements = DomHandler.getFocusableElements(this.el.nativeElement);
            if (focusableElements && focusableElements.length > 0) {
                if (!document.activeElement) {
                    focusableElements[0].focus();
                }
                else {
                    let focusedIndex = focusableElements.indexOf(document.activeElement);
                    if (e.shiftKey) {
                        if (focusedIndex == -1 || focusedIndex === 0)
                            focusableElements[focusableElements.length - 1].focus();
                        else
                            focusableElements[focusedIndex - 1].focus();
                    }
                    else {
                        if (focusedIndex == -1 || focusedIndex === (focusableElements.length - 1))
                            focusableElements[0].focus();
                        else
                            focusableElements[focusedIndex + 1].focus();
                    }
                }
            }
        }
    }
}
FocusTrap.ctorParameters = () => [
    { type: ElementRef }
];
FocusTrap.decorators = [
    { type: Directive, args: [{
                selector: '[pFocusTrap]',
            },] }
];
FocusTrap.ctorParameters = () => [
    { type: ElementRef }
];
FocusTrap.propDecorators = {
    pFocusTrapDisabled: [{ type: Input }],
    onkeydown: [{ type: HostListener, args: ['keydown.tab', ['$event'],] }, { type: HostListener, args: ['keydown.shift.tab', ['$event'],] }]
};
export class FocusTrapModule {
}
FocusTrapModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule],
                exports: [FocusTrap],
                declarations: [FocusTrap]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9jdXN0cmFwLmpzIiwic291cmNlUm9vdCI6Im5nOi8vcHJpbWVuZy9mb2N1c3RyYXAvIiwic291cmNlcyI6WyJmb2N1c3RyYXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFFBQVEsRUFBQyxTQUFTLEVBQUMsVUFBVSxFQUFDLFlBQVksRUFBRSxLQUFLLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDaEYsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQzdDLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFLdkMsTUFBTSxPQUFPLFNBQVM7SUFJbEIsWUFBbUIsRUFBYztRQUFkLE9BQUUsR0FBRixFQUFFLENBQVk7SUFBRyxDQUFDO0lBSXJDLFNBQVMsQ0FBQyxDQUFDO1FBQ1AsSUFBSSxJQUFJLENBQUMsa0JBQWtCLEtBQUssSUFBSSxFQUFFO1lBQ2xDLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUNuQixJQUFJLGlCQUFpQixHQUFHLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQy9FLElBQUksaUJBQWlCLElBQUksaUJBQWlCLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQkFDbkQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLEVBQUU7b0JBQ3pCLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO2lCQUNoQztxQkFDSTtvQkFDRCxJQUFJLFlBQVksR0FBRyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDO29CQUVyRSxJQUFJLENBQUMsQ0FBQyxRQUFRLEVBQUU7d0JBQ1osSUFBSSxZQUFZLElBQUksQ0FBQyxDQUFDLElBQUksWUFBWSxLQUFLLENBQUM7NEJBQ3hDLGlCQUFpQixDQUFDLGlCQUFpQixDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQzs7NEJBRXhELGlCQUFpQixDQUFDLFlBQVksR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztxQkFDbkQ7eUJBQ0k7d0JBQ0QsSUFBSSxZQUFZLElBQUksQ0FBQyxDQUFDLElBQUksWUFBWSxLQUFLLENBQUMsaUJBQWlCLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQzs0QkFDckUsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7OzRCQUU3QixpQkFBaUIsQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7cUJBQ25EO2lCQUNKO2FBQ0o7U0FDSjtJQUNMLENBQUM7OztZQTlCc0IsVUFBVTs7O1lBUHBDLFNBQVMsU0FBQztnQkFDUCxRQUFRLEVBQUUsY0FBYzthQUMzQjs7O1lBTjBCLFVBQVU7OztpQ0FTaEMsS0FBSzt3QkFJTCxZQUFZLFNBQUMsYUFBYSxFQUFFLENBQUMsUUFBUSxDQUFDLGNBQ3RDLFlBQVksU0FBQyxtQkFBbUIsRUFBRSxDQUFDLFFBQVEsQ0FBQzs7QUFtQ2pELE1BQU0sT0FBTyxlQUFlOzs7WUFMM0IsUUFBUSxTQUFDO2dCQUNOLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQztnQkFDdkIsT0FBTyxFQUFFLENBQUMsU0FBUyxDQUFDO2dCQUNwQixZQUFZLEVBQUUsQ0FBQyxTQUFTLENBQUM7YUFDNUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge05nTW9kdWxlLERpcmVjdGl2ZSxFbGVtZW50UmVmLEhvc3RMaXN0ZW5lciwgSW5wdXR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge0RvbUhhbmRsZXJ9IGZyb20gJ3ByaW1lbmcvZG9tJztcblxuQERpcmVjdGl2ZSh7XG4gICAgc2VsZWN0b3I6ICdbcEZvY3VzVHJhcF0nLFxufSlcbmV4cG9ydCBjbGFzcyBGb2N1c1RyYXAge1xuXG4gICAgQElucHV0KCkgcEZvY3VzVHJhcERpc2FibGVkOiBib29sZWFuO1xuXG4gICAgY29uc3RydWN0b3IocHVibGljIGVsOiBFbGVtZW50UmVmKSB7fVxuXG4gICAgQEhvc3RMaXN0ZW5lcigna2V5ZG93bi50YWInLCBbJyRldmVudCddKVxuICAgIEBIb3N0TGlzdGVuZXIoJ2tleWRvd24uc2hpZnQudGFiJywgWyckZXZlbnQnXSlcbiAgICBvbmtleWRvd24oZSkge1xuICAgICAgICBpZiAodGhpcy5wRm9jdXNUcmFwRGlzYWJsZWQgIT09IHRydWUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGxldCBmb2N1c2FibGVFbGVtZW50cyA9IERvbUhhbmRsZXIuZ2V0Rm9jdXNhYmxlRWxlbWVudHModGhpcy5lbC5uYXRpdmVFbGVtZW50KTtcbiAgICAgICAgICAgIGlmIChmb2N1c2FibGVFbGVtZW50cyAmJiBmb2N1c2FibGVFbGVtZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFkb2N1bWVudC5hY3RpdmVFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGZvY3VzYWJsZUVsZW1lbnRzWzBdLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZm9jdXNlZEluZGV4ID0gZm9jdXNhYmxlRWxlbWVudHMuaW5kZXhPZihkb2N1bWVudC5hY3RpdmVFbGVtZW50KTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoZS5zaGlmdEtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZvY3VzZWRJbmRleCA9PSAtMSB8fCBmb2N1c2VkSW5kZXggPT09IDApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9jdXNhYmxlRWxlbWVudHNbZm9jdXNhYmxlRWxlbWVudHMubGVuZ3RoIC0gMV0uZm9jdXMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb2N1c2FibGVFbGVtZW50c1tmb2N1c2VkSW5kZXggLSAxXS5mb2N1cygpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZvY3VzZWRJbmRleCA9PSAtMSB8fCBmb2N1c2VkSW5kZXggPT09IChmb2N1c2FibGVFbGVtZW50cy5sZW5ndGggLSAxKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb2N1c2FibGVFbGVtZW50c1swXS5mb2N1cygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvY3VzYWJsZUVsZW1lbnRzW2ZvY3VzZWRJbmRleCArIDFdLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbkBOZ01vZHVsZSh7XG4gICAgaW1wb3J0czogW0NvbW1vbk1vZHVsZV0sXG4gICAgZXhwb3J0czogW0ZvY3VzVHJhcF0sXG4gICAgZGVjbGFyYXRpb25zOiBbRm9jdXNUcmFwXVxufSlcbmV4cG9ydCBjbGFzcyBGb2N1c1RyYXBNb2R1bGUgeyB9Il19