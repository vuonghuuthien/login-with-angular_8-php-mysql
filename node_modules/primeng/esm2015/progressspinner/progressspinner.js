import { NgModule, Component, Input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
export class ProgressSpinner {
    constructor() {
        this.strokeWidth = "2";
        this.fill = "none";
        this.animationDuration = "2s";
    }
}
ProgressSpinner.decorators = [
    { type: Component, args: [{
                selector: 'p-progressSpinner',
                template: `
        <div class="p-progress-spinner" [ngStyle]="style" [ngClass]="styleClass"  role="alert" aria-busy="true">
            <svg class="p-progress-spinner-svg" viewBox="25 25 50 50" [style.animation-duration]="animationDuration">
                <circle class="p-progress-spinner-circle" cx="50" cy="50" r="20" [attr.fill]="fill" [attr.stroke-width]="strokeWidth" stroke-miterlimit="10"/>
            </svg>
        </div>
    `,
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                styles: [".p-progress-spinner{position:relative;margin:0 auto;width:100px;height:100px;display:inline-block}.p-progress-spinner::before{content:'';display:block;padding-top:100%}.p-progress-spinner-svg{-webkit-animation:2s linear infinite p-progress-spinner-rotate;animation:2s linear infinite p-progress-spinner-rotate;height:100%;-ms-transform-origin:center center;transform-origin:center center;width:100%;position:absolute;top:0;bottom:0;left:0;right:0;margin:auto}.p-progress-spinner-circle{stroke-dasharray:89,200;stroke-dashoffset:0;stroke:#d62d20;-webkit-animation:1.5s ease-in-out infinite p-progress-spinner-dash,6s ease-in-out infinite p-progress-spinner-color;animation:1.5s ease-in-out infinite p-progress-spinner-dash,6s ease-in-out infinite p-progress-spinner-color;stroke-linecap:round}@-webkit-keyframes p-progress-spinner-rotate{100%{transform:rotate(360deg)}}@keyframes p-progress-spinner-rotate{100%{transform:rotate(360deg)}}@-webkit-keyframes p-progress-spinner-dash{0%{stroke-dasharray:1,200;stroke-dashoffset:0}50%{stroke-dasharray:89,200;stroke-dashoffset:-35px}100%{stroke-dasharray:89,200;stroke-dashoffset:-124px}}@keyframes p-progress-spinner-dash{0%{stroke-dasharray:1,200;stroke-dashoffset:0}50%{stroke-dasharray:89,200;stroke-dashoffset:-35px}100%{stroke-dasharray:89,200;stroke-dashoffset:-124px}}@-webkit-keyframes p-progress-spinner-color{0%,100%{stroke:#d62d20}40%{stroke:#0057e7}66%{stroke:#008744}80%,90%{stroke:#ffa700}}@keyframes p-progress-spinner-color{0%,100%{stroke:#d62d20}40%{stroke:#0057e7}66%{stroke:#008744}80%,90%{stroke:#ffa700}}"]
            },] }
];
ProgressSpinner.propDecorators = {
    style: [{ type: Input }],
    styleClass: [{ type: Input }],
    strokeWidth: [{ type: Input }],
    fill: [{ type: Input }],
    animationDuration: [{ type: Input }]
};
export class ProgressSpinnerModule {
}
ProgressSpinnerModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule],
                exports: [ProgressSpinner],
                declarations: [ProgressSpinner]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZ3Jlc3NzcGlubmVyLmpzIiwic291cmNlUm9vdCI6Im5nOi8vcHJpbWVuZy9wcm9ncmVzc3NwaW5uZXIvIiwic291cmNlcyI6WyJwcm9ncmVzc3NwaW5uZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFFBQVEsRUFBQyxTQUFTLEVBQUMsS0FBSyxFQUFDLHVCQUF1QixFQUFFLGlCQUFpQixFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ2xHLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQWU3QyxNQUFNLE9BQU8sZUFBZTtJQWI1QjtRQW1CYSxnQkFBVyxHQUFXLEdBQUcsQ0FBQztRQUUxQixTQUFJLEdBQVcsTUFBTSxDQUFDO1FBRXRCLHNCQUFpQixHQUFXLElBQUksQ0FBQztJQUU5QyxDQUFDOzs7WUF6QkEsU0FBUyxTQUFDO2dCQUNQLFFBQVEsRUFBRSxtQkFBbUI7Z0JBQzdCLFFBQVEsRUFBRTs7Ozs7O0tBTVQ7Z0JBQ0QsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07Z0JBQy9DLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJOzthQUV4Qzs7O29CQUdJLEtBQUs7eUJBRUwsS0FBSzswQkFFTCxLQUFLO21CQUVMLEtBQUs7Z0NBRUwsS0FBSzs7QUFTVixNQUFNLE9BQU8scUJBQXFCOzs7WUFMakMsUUFBUSxTQUFDO2dCQUNOLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQztnQkFDdkIsT0FBTyxFQUFFLENBQUMsZUFBZSxDQUFDO2dCQUMxQixZQUFZLEVBQUUsQ0FBQyxlQUFlLENBQUM7YUFDbEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge05nTW9kdWxlLENvbXBvbmVudCxJbnB1dCxDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgVmlld0VuY2Fwc3VsYXRpb259IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAncC1wcm9ncmVzc1NwaW5uZXInLFxuICAgIHRlbXBsYXRlOiBgXG4gICAgICAgIDxkaXYgY2xhc3M9XCJwLXByb2dyZXNzLXNwaW5uZXJcIiBbbmdTdHlsZV09XCJzdHlsZVwiIFtuZ0NsYXNzXT1cInN0eWxlQ2xhc3NcIiAgcm9sZT1cImFsZXJ0XCIgYXJpYS1idXN5PVwidHJ1ZVwiPlxuICAgICAgICAgICAgPHN2ZyBjbGFzcz1cInAtcHJvZ3Jlc3Mtc3Bpbm5lci1zdmdcIiB2aWV3Qm94PVwiMjUgMjUgNTAgNTBcIiBbc3R5bGUuYW5pbWF0aW9uLWR1cmF0aW9uXT1cImFuaW1hdGlvbkR1cmF0aW9uXCI+XG4gICAgICAgICAgICAgICAgPGNpcmNsZSBjbGFzcz1cInAtcHJvZ3Jlc3Mtc3Bpbm5lci1jaXJjbGVcIiBjeD1cIjUwXCIgY3k9XCI1MFwiIHI9XCIyMFwiIFthdHRyLmZpbGxdPVwiZmlsbFwiIFthdHRyLnN0cm9rZS13aWR0aF09XCJzdHJva2VXaWR0aFwiIHN0cm9rZS1taXRlcmxpbWl0PVwiMTBcIi8+XG4gICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgPC9kaXY+XG4gICAgYCxcbiAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICAgIHN0eWxlVXJsczogWycuL3Byb2dyZXNzc3Bpbm5lci5jc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBQcm9ncmVzc1NwaW5uZXIge1xuXG4gICAgQElucHV0KCkgc3R5bGU6IGFueTtcbiAgICBcbiAgICBASW5wdXQoKSBzdHlsZUNsYXNzOiBzdHJpbmc7XG4gICAgXG4gICAgQElucHV0KCkgc3Ryb2tlV2lkdGg6IHN0cmluZyA9IFwiMlwiO1xuICAgIFxuICAgIEBJbnB1dCgpIGZpbGw6IHN0cmluZyA9IFwibm9uZVwiO1xuICAgIFxuICAgIEBJbnB1dCgpIGFuaW1hdGlvbkR1cmF0aW9uOiBzdHJpbmcgPSBcIjJzXCI7XG4gICAgXG59XG5cbkBOZ01vZHVsZSh7XG4gICAgaW1wb3J0czogW0NvbW1vbk1vZHVsZV0sXG4gICAgZXhwb3J0czogW1Byb2dyZXNzU3Bpbm5lcl0sXG4gICAgZGVjbGFyYXRpb25zOiBbUHJvZ3Jlc3NTcGlubmVyXVxufSlcbmV4cG9ydCBjbGFzcyBQcm9ncmVzc1NwaW5uZXJNb2R1bGUgeyB9Il19