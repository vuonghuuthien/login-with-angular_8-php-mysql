import { Component, ChangeDetectionStrategy, ViewEncapsulation, Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

var ProgressSpinner = /** @class */ (function () {
    function ProgressSpinner() {
        this.strokeWidth = "2";
        this.fill = "none";
        this.animationDuration = "2s";
    }
    ProgressSpinner.decorators = [
        { type: Component, args: [{
                    selector: 'p-progressSpinner',
                    template: "\n        <div class=\"p-progress-spinner\" [ngStyle]=\"style\" [ngClass]=\"styleClass\"  role=\"alert\" aria-busy=\"true\">\n            <svg class=\"p-progress-spinner-svg\" viewBox=\"25 25 50 50\" [style.animation-duration]=\"animationDuration\">\n                <circle class=\"p-progress-spinner-circle\" cx=\"50\" cy=\"50\" r=\"20\" [attr.fill]=\"fill\" [attr.stroke-width]=\"strokeWidth\" stroke-miterlimit=\"10\"/>\n            </svg>\n        </div>\n    ",
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
    return ProgressSpinner;
}());
var ProgressSpinnerModule = /** @class */ (function () {
    function ProgressSpinnerModule() {
    }
    ProgressSpinnerModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule],
                    exports: [ProgressSpinner],
                    declarations: [ProgressSpinner]
                },] }
    ];
    return ProgressSpinnerModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { ProgressSpinner, ProgressSpinnerModule };
//# sourceMappingURL=primeng-progressspinner.js.map
