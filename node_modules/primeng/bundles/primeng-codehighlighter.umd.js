(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common')) :
    typeof define === 'function' && define.amd ? define('primeng/codehighlighter', ['exports', '@angular/core', '@angular/common'], factory) :
    (global = global || self, factory((global.primeng = global.primeng || {}, global.primeng.codehighlighter = {}), global.ng.core, global.ng.common));
}(this, (function (exports, core, common) { 'use strict';

    var CodeHighlighter = /** @class */ (function () {
        function CodeHighlighter(el) {
            this.el = el;
        }
        CodeHighlighter.prototype.ngAfterViewInit = function () {
            if (window['Prism']) {
                window['Prism'].highlightElement(this.el.nativeElement);
            }
        };
        CodeHighlighter.ctorParameters = function () { return [
            { type: core.ElementRef }
        ]; };
        CodeHighlighter.decorators = [
            { type: core.Directive, args: [{
                        selector: '[pCode]'
                    },] }
        ];
        CodeHighlighter.ctorParameters = function () { return [
            { type: core.ElementRef }
        ]; };
        return CodeHighlighter;
    }());
    var CodeHighlighterModule = /** @class */ (function () {
        function CodeHighlighterModule() {
        }
        CodeHighlighterModule.decorators = [
            { type: core.NgModule, args: [{
                        imports: [common.CommonModule],
                        exports: [CodeHighlighter],
                        declarations: [CodeHighlighter]
                    },] }
        ];
        return CodeHighlighterModule;
    }());

    exports.CodeHighlighter = CodeHighlighter;
    exports.CodeHighlighterModule = CodeHighlighterModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=primeng-codehighlighter.umd.js.map
