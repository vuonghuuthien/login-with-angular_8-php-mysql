(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common')) :
    typeof define === 'function' && define.amd ? define('primeng/progressbar', ['exports', '@angular/core', '@angular/common'], factory) :
    (global = global || self, factory((global.primeng = global.primeng || {}, global.primeng.progressbar = {}), global.ng.core, global.ng.common));
}(this, (function (exports, core, common) { 'use strict';

    var ProgressBar = /** @class */ (function () {
        function ProgressBar() {
            this.showValue = true;
            this.unit = '%';
            this.mode = 'determinate';
        }
        ProgressBar.decorators = [
            { type: core.Component, args: [{
                        selector: 'p-progressBar',
                        template: "\n        <div [class]=\"styleClass\" [ngStyle]=\"style\" role=\"progressbar\" aria-valuemin=\"0\" [attr.aria-valuenow]=\"value\" aria-valuemax=\"100\"\n            [ngClass]=\"{'p-progressbar p-component': true, 'p-progressbar-determinate': (mode === 'determinate'), 'p-progressbar-indeterminate': (mode === 'indeterminate')}\">\n            <div *ngIf=\"mode === 'determinate'\" class=\"p-progressbar-value p-progressbar-value-animate\" [style.width]=\"value + '%'\" style=\"display:block\"></div>\n            <div *ngIf=\"mode === 'determinate' && showValue\" class=\"p-progressbar-label\" [style.display]=\"value != null ? 'block' : 'none'\">{{value}}{{unit}}</div>\n            <div *ngIf=\"mode === 'indeterminate'\" class=\"p-progressbar-indeterminate-container\">\n                <div class=\"p-progressbar-value p-progressbar-value-animate\"></div>\n            </div>\n        </div>\n    ",
                        changeDetection: core.ChangeDetectionStrategy.OnPush,
                        encapsulation: core.ViewEncapsulation.None,
                        styles: [".p-progressbar{position:relative;overflow:hidden}.p-progressbar-determinate .p-progressbar-value{height:100%;width:0%;position:absolute;display:none;border:0}.p-progressbar-determinate .p-progressbar-value-animate{transition:width 1s ease-in-out}.p-progressbar-determinate .p-progressbar-label{text-align:center;height:100%;width:100%;position:absolute;font-weight:700}.p-progressbar-indeterminate .p-progressbar-value::before{content:'';position:absolute;background-color:inherit;top:0;left:0;bottom:0;will-change:left,right;-webkit-animation:2.1s cubic-bezier(.65,.815,.735,.395) infinite p-progressbar-indeterminate-anim;animation:2.1s cubic-bezier(.65,.815,.735,.395) infinite p-progressbar-indeterminate-anim}.p-progressbar-indeterminate .p-progressbar-value::after{content:'';position:absolute;background-color:inherit;top:0;left:0;bottom:0;will-change:left,right;-webkit-animation:2.1s cubic-bezier(.165,.84,.44,1) infinite p-progressbar-indeterminate-anim-short;animation:2.1s cubic-bezier(.165,.84,.44,1) infinite p-progressbar-indeterminate-anim-short;-webkit-animation-delay:1.15s;animation-delay:1.15s}@-webkit-keyframes p-progressbar-indeterminate-anim{0%{left:-35%;right:100%}100%,60%{left:100%;right:-90%}}@keyframes p-progressbar-indeterminate-anim{0%{left:-35%;right:100%}100%,60%{left:100%;right:-90%}}@-webkit-keyframes p-progressbar-indeterminate-anim-short{0%{left:-200%;right:100%}100%,60%{left:107%;right:-8%}}@keyframes p-progressbar-indeterminate-anim-short{0%{left:-200%;right:100%}100%,60%{left:107%;right:-8%}}"]
                    },] }
        ];
        ProgressBar.propDecorators = {
            value: [{ type: core.Input }],
            showValue: [{ type: core.Input }],
            style: [{ type: core.Input }],
            styleClass: [{ type: core.Input }],
            unit: [{ type: core.Input }],
            mode: [{ type: core.Input }]
        };
        return ProgressBar;
    }());
    var ProgressBarModule = /** @class */ (function () {
        function ProgressBarModule() {
        }
        ProgressBarModule.decorators = [
            { type: core.NgModule, args: [{
                        imports: [common.CommonModule],
                        exports: [ProgressBar],
                        declarations: [ProgressBar]
                    },] }
        ];
        return ProgressBarModule;
    }());

    exports.ProgressBar = ProgressBar;
    exports.ProgressBarModule = ProgressBarModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=primeng-progressbar.umd.js.map
