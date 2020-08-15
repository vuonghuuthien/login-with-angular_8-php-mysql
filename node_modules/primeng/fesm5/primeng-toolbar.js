import { ElementRef, Component, ChangeDetectionStrategy, ViewEncapsulation, Input, ContentChildren, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeTemplate } from 'primeng/api';

var Toolbar = /** @class */ (function () {
    function Toolbar(el) {
        this.el = el;
    }
    Toolbar.prototype.getBlockableElement = function () {
        return this.el.nativeElement.children[0];
    };
    Toolbar.prototype.ngAfterContentInit = function () {
        var _this = this;
        this.templates.forEach(function (item) {
            switch (item.getType()) {
                case 'left':
                    _this.leftTemplate = item.template;
                    break;
                case 'right':
                    _this.rightTemplate = item.template;
                    break;
            }
        });
    };
    Toolbar.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    Toolbar.decorators = [
        { type: Component, args: [{
                    selector: 'p-toolbar',
                    template: "\n        <div [ngClass]=\"'p-toolbar p-component'\" [ngStyle]=\"style\" [class]=\"styleClass\" role=\"toolbar\">\n            <ng-content></ng-content>\n            <div class=\"p-toolbar-group-left\" *ngIf=\"leftTemplate\">\n                <ng-container *ngTemplateOutlet=\"leftTemplate\"></ng-container>\n            </div>\n            <div class=\"p-toolbar-group-right\" *ngIf=\"rightTemplate\">\n                <ng-container *ngTemplateOutlet=\"rightTemplate\"></ng-container>\n            </div>\n        </div>\n    ",
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    styles: [".p-toolbar{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:justify;justify-content:space-between;-ms-flex-wrap:wrap;flex-wrap:wrap}.p-toolbar-group-left,.p-toolbar-group-right{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center}"]
                },] }
    ];
    Toolbar.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    Toolbar.propDecorators = {
        style: [{ type: Input }],
        styleClass: [{ type: Input }],
        templates: [{ type: ContentChildren, args: [PrimeTemplate,] }]
    };
    return Toolbar;
}());
var ToolbarModule = /** @class */ (function () {
    function ToolbarModule() {
    }
    ToolbarModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule],
                    exports: [Toolbar],
                    declarations: [Toolbar]
                },] }
    ];
    return ToolbarModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { Toolbar, ToolbarModule };
//# sourceMappingURL=primeng-toolbar.js.map
