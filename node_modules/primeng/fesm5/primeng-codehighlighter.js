import { ElementRef, Directive, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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
        { type: ElementRef }
    ]; };
    CodeHighlighter.decorators = [
        { type: Directive, args: [{
                    selector: '[pCode]'
                },] }
    ];
    CodeHighlighter.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    return CodeHighlighter;
}());
var CodeHighlighterModule = /** @class */ (function () {
    function CodeHighlighterModule() {
    }
    CodeHighlighterModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule],
                    exports: [CodeHighlighter],
                    declarations: [CodeHighlighter]
                },] }
    ];
    return CodeHighlighterModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { CodeHighlighter, CodeHighlighterModule };
//# sourceMappingURL=primeng-codehighlighter.js.map
