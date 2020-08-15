import { NgModule, EventEmitter, Directive, Input, Output, ContentChildren, ContentChild, TemplateRef, AfterContentInit, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
export class Header {
}
Header.decorators = [
    { type: Component, args: [{
                selector: 'p-header',
                template: '<ng-content></ng-content>'
            },] }
];
export class Footer {
}
Footer.decorators = [
    { type: Component, args: [{
                selector: 'p-footer',
                template: '<ng-content></ng-content>'
            },] }
];
export class PrimeTemplate {
    constructor(template) {
        this.template = template;
    }
    getType() {
        return this.name;
    }
}
PrimeTemplate.ctorParameters = () => [
    { type: TemplateRef }
];
PrimeTemplate.decorators = [
    { type: Directive, args: [{
                selector: '[pTemplate]',
                host: {}
            },] }
];
PrimeTemplate.ctorParameters = () => [
    { type: TemplateRef }
];
PrimeTemplate.propDecorators = {
    type: [{ type: Input }],
    name: [{ type: Input, args: ['pTemplate',] }]
};
export class SharedModule {
}
SharedModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule],
                exports: [Header, Footer, PrimeTemplate],
                declarations: [Header, Footer, PrimeTemplate]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hhcmVkLmpzIiwic291cmNlUm9vdCI6Im5nOi8vcHJpbWVuZy9hcGkvIiwic291cmNlcyI6WyJzaGFyZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFFBQVEsRUFBQyxZQUFZLEVBQUMsU0FBUyxFQUFDLEtBQUssRUFBQyxNQUFNLEVBQUMsZUFBZSxFQUFDLFlBQVksRUFBQyxXQUFXLEVBQUMsZ0JBQWdCLEVBQUMsU0FBUyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQy9JLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUM3QyxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBTXhDLE1BQU0sT0FBTyxNQUFNOzs7WUFKbEIsU0FBUyxTQUFDO2dCQUNQLFFBQVEsRUFBRSxVQUFVO2dCQUNwQixRQUFRLEVBQUUsMkJBQTJCO2FBQ3hDOztBQU9ELE1BQU0sT0FBTyxNQUFNOzs7WUFKbEIsU0FBUyxTQUFDO2dCQUNQLFFBQVEsRUFBRSxVQUFVO2dCQUNwQixRQUFRLEVBQUUsMkJBQTJCO2FBQ3hDOztBQVFELE1BQU0sT0FBTyxhQUFhO0lBTXRCLFlBQW1CLFFBQTBCO1FBQTFCLGFBQVEsR0FBUixRQUFRLENBQWtCO0lBQUcsQ0FBQztJQUVqRCxPQUFPO1FBQ0gsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ3JCLENBQUM7OztZQUo0QixXQUFXOzs7WUFYM0MsU0FBUyxTQUFDO2dCQUNQLFFBQVEsRUFBRSxhQUFhO2dCQUN2QixJQUFJLEVBQUUsRUFDTDthQUNKOzs7WUFwQmlGLFdBQVc7OzttQkF1QnhGLEtBQUs7bUJBRUwsS0FBSyxTQUFDLFdBQVc7O0FBY3RCLE1BQU0sT0FBTyxZQUFZOzs7WUFMeEIsUUFBUSxTQUFDO2dCQUNOLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQztnQkFDdkIsT0FBTyxFQUFFLENBQUMsTUFBTSxFQUFDLE1BQU0sRUFBQyxhQUFhLENBQUM7Z0JBQ3RDLFlBQVksRUFBRSxDQUFDLE1BQU0sRUFBQyxNQUFNLEVBQUMsYUFBYSxDQUFDO2FBQzlDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtOZ01vZHVsZSxFdmVudEVtaXR0ZXIsRGlyZWN0aXZlLElucHV0LE91dHB1dCxDb250ZW50Q2hpbGRyZW4sQ29udGVudENoaWxkLFRlbXBsYXRlUmVmLEFmdGVyQ29udGVudEluaXQsUXVlcnlMaXN0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtDb21wb25lbnR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3AtaGVhZGVyJyxcbiAgICB0ZW1wbGF0ZTogJzxuZy1jb250ZW50PjwvbmctY29udGVudD4nXG59KVxuZXhwb3J0IGNsYXNzIEhlYWRlciB7fVxuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3AtZm9vdGVyJyxcbiAgICB0ZW1wbGF0ZTogJzxuZy1jb250ZW50PjwvbmctY29udGVudD4nXG59KVxuZXhwb3J0IGNsYXNzIEZvb3RlciB7fVxuXG5ARGlyZWN0aXZlKHtcbiAgICBzZWxlY3RvcjogJ1twVGVtcGxhdGVdJyxcbiAgICBob3N0OiB7XG4gICAgfVxufSlcbmV4cG9ydCBjbGFzcyBQcmltZVRlbXBsYXRlIHtcbiAgICBcbiAgICBASW5wdXQoKSB0eXBlOiBzdHJpbmc7XG4gICAgXG4gICAgQElucHV0KCdwVGVtcGxhdGUnKSBuYW1lOiBzdHJpbmc7XG4gICAgXG4gICAgY29uc3RydWN0b3IocHVibGljIHRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+KSB7fVxuICAgIFxuICAgIGdldFR5cGUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmFtZTtcbiAgICB9XG59XG5cbkBOZ01vZHVsZSh7XG4gICAgaW1wb3J0czogW0NvbW1vbk1vZHVsZV0sXG4gICAgZXhwb3J0czogW0hlYWRlcixGb290ZXIsUHJpbWVUZW1wbGF0ZV0sXG4gICAgZGVjbGFyYXRpb25zOiBbSGVhZGVyLEZvb3RlcixQcmltZVRlbXBsYXRlXVxufSlcbmV4cG9ydCBjbGFzcyBTaGFyZWRNb2R1bGUgeyB9XG4iXX0=