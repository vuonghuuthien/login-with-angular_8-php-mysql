import { ElementRef, Component, ChangeDetectionStrategy, ViewEncapsulation, Input, ContentChild, ContentChildren, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header, Footer, PrimeTemplate, SharedModule } from 'primeng/api';

var Card = /** @class */ (function () {
    function Card(el) {
        this.el = el;
    }
    Card.prototype.ngAfterContentInit = function () {
        var _this = this;
        this.templates.forEach(function (item) {
            switch (item.getType()) {
                case 'header':
                    _this.headerTemplate = item.template;
                    break;
                case 'title':
                    _this.titleTemplate = item.template;
                    break;
                case 'subtitle':
                    _this.subtitleTemplate = item.template;
                    break;
                case 'content':
                    _this.contentTemplate = item.template;
                    break;
                case 'footer':
                    _this.footerTemplate = item.template;
                    break;
                default:
                    _this.contentTemplate = item.template;
                    break;
            }
        });
    };
    Card.prototype.getBlockableElement = function () {
        return this.el.nativeElement.children[0];
    };
    Card.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    Card.decorators = [
        { type: Component, args: [{
                    selector: 'p-card',
                    template: "\n        <div [ngClass]=\"'p-card p-component'\" [ngStyle]=\"style\" [class]=\"styleClass\">\n            <div class=\"p-card-header\" *ngIf=\"headerFacet || headerTemplate\">\n                <ng-content select=\"p-header\"></ng-content>\n                <ng-container *ngTemplateOutlet=\"headerTemplate\"></ng-container>\n            </div>\n            <div class=\"p-card-body\">\n                <div class=\"p-card-title\" *ngIf=\"header || titleTemplate\">\n                    {{header}}\n                    <ng-container *ngTemplateOutlet=\"titleTemplate\"></ng-container>\n                </div>\n                <div class=\"p-card-subtitle\" *ngIf=\"subheader || subtitleTemplate\">\n                    {{subheader}}\n                    <ng-container *ngTemplateOutlet=\"subtitleTemplate\"></ng-container>\n                </div>\n                <div class=\"p-card-content\">\n                    <ng-content></ng-content>\n                    <ng-container *ngTemplateOutlet=\"contentTemplate\"></ng-container>\n                </div>\n                <div class=\"p-card-footer\" *ngIf=\"footerFacet || footerTemplate\">\n                    <ng-content select=\"p-footer\"></ng-content>\n                    <ng-container *ngTemplateOutlet=\"footerTemplate\"></ng-container>\n                </div>\n            </div>\n        </div>\n    ",
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    styles: [".p-card-header img{width:100%}"]
                },] }
    ];
    Card.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    Card.propDecorators = {
        header: [{ type: Input }],
        subheader: [{ type: Input }],
        style: [{ type: Input }],
        styleClass: [{ type: Input }],
        headerFacet: [{ type: ContentChild, args: [Header,] }],
        footerFacet: [{ type: ContentChild, args: [Footer,] }],
        templates: [{ type: ContentChildren, args: [PrimeTemplate,] }]
    };
    return Card;
}());
var CardModule = /** @class */ (function () {
    function CardModule() {
    }
    CardModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule],
                    exports: [Card, SharedModule],
                    declarations: [Card]
                },] }
    ];
    return CardModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { Card, CardModule };
//# sourceMappingURL=primeng-card.js.map
