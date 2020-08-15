import { NgModule, Directive, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
export class CodeHighlighter {
    constructor(el) {
        this.el = el;
    }
    ngAfterViewInit() {
        if (window['Prism']) {
            window['Prism'].highlightElement(this.el.nativeElement);
        }
    }
}
CodeHighlighter.ctorParameters = () => [
    { type: ElementRef }
];
CodeHighlighter.decorators = [
    { type: Directive, args: [{
                selector: '[pCode]'
            },] }
];
CodeHighlighter.ctorParameters = () => [
    { type: ElementRef }
];
export class CodeHighlighterModule {
}
CodeHighlighterModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule],
                exports: [CodeHighlighter],
                declarations: [CodeHighlighter]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZWhpZ2hsaWdodGVyLmpzIiwic291cmNlUm9vdCI6Im5nOi8vcHJpbWVuZy9jb2RlaGlnaGxpZ2h0ZXIvIiwic291cmNlcyI6WyJjb2RlaGlnaGxpZ2h0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLGFBQWEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMvRSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFLL0MsTUFBTSxPQUFPLGVBQWU7SUFFeEIsWUFBbUIsRUFBYztRQUFkLE9BQUUsR0FBRixFQUFFLENBQVk7SUFBSSxDQUFDO0lBRXRDLGVBQWU7UUFDWCxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUNqQixNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsQ0FBQztTQUMzRDtJQUNMLENBQUM7OztZQU5zQixVQUFVOzs7WUFMcEMsU0FBUyxTQUFDO2dCQUNQLFFBQVEsRUFBRSxTQUFTO2FBQ3RCOzs7WUFMNkIsVUFBVTs7QUFzQnhDLE1BQU0sT0FBTyxxQkFBcUI7OztZQUxqQyxRQUFRLFNBQUM7Z0JBQ04sT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDO2dCQUN2QixPQUFPLEVBQUUsQ0FBQyxlQUFlLENBQUM7Z0JBQzFCLFlBQVksRUFBRSxDQUFDLGVBQWUsQ0FBQzthQUNsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlLCBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIEFmdGVyVmlld0luaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbkBEaXJlY3RpdmUoe1xuICAgIHNlbGVjdG9yOiAnW3BDb2RlXSdcbn0pXG5leHBvcnQgY2xhc3MgQ29kZUhpZ2hsaWdodGVyIGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCB7XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgZWw6IEVsZW1lbnRSZWYpIHsgfVxuXG4gICAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgICAgICBpZiAod2luZG93WydQcmlzbSddKSB7XG4gICAgICAgICAgICB3aW5kb3dbJ1ByaXNtJ10uaGlnaGxpZ2h0RWxlbWVudCh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5ATmdNb2R1bGUoe1xuICAgIGltcG9ydHM6IFtDb21tb25Nb2R1bGVdLFxuICAgIGV4cG9ydHM6IFtDb2RlSGlnaGxpZ2h0ZXJdLFxuICAgIGRlY2xhcmF0aW9uczogW0NvZGVIaWdobGlnaHRlcl1cbn0pXG5leHBvcnQgY2xhc3MgQ29kZUhpZ2hsaWdodGVyTW9kdWxlIHsgfVxuXG5cbiJdfQ==