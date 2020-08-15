import { ElementRef, Directive, Input, HostListener, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomHandler } from 'primeng/dom';

var FocusTrap = /** @class */ (function () {
    function FocusTrap(el) {
        this.el = el;
    }
    FocusTrap.prototype.onkeydown = function (e) {
        if (this.pFocusTrapDisabled !== true) {
            e.preventDefault();
            var focusableElements = DomHandler.getFocusableElements(this.el.nativeElement);
            if (focusableElements && focusableElements.length > 0) {
                if (!document.activeElement) {
                    focusableElements[0].focus();
                }
                else {
                    var focusedIndex = focusableElements.indexOf(document.activeElement);
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
    };
    FocusTrap.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    FocusTrap.decorators = [
        { type: Directive, args: [{
                    selector: '[pFocusTrap]',
                },] }
    ];
    FocusTrap.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    FocusTrap.propDecorators = {
        pFocusTrapDisabled: [{ type: Input }],
        onkeydown: [{ type: HostListener, args: ['keydown.tab', ['$event'],] }, { type: HostListener, args: ['keydown.shift.tab', ['$event'],] }]
    };
    return FocusTrap;
}());
var FocusTrapModule = /** @class */ (function () {
    function FocusTrapModule() {
    }
    FocusTrapModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule],
                    exports: [FocusTrap],
                    declarations: [FocusTrap]
                },] }
    ];
    return FocusTrapModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { FocusTrap, FocusTrapModule };
//# sourceMappingURL=primeng-focustrap.js.map
