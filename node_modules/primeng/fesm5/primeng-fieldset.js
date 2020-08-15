import { EventEmitter, ElementRef, Component, ChangeDetectionStrategy, ViewEncapsulation, Input, Output, ContentChildren, NgModule } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { PrimeTemplate, SharedModule } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';

var idx = 0;
var Fieldset = /** @class */ (function () {
    function Fieldset(el) {
        this.el = el;
        this.collapsed = false;
        this.collapsedChange = new EventEmitter();
        this.onBeforeToggle = new EventEmitter();
        this.onAfterToggle = new EventEmitter();
        this.transitionOptions = '400ms cubic-bezier(0.86, 0, 0.07, 1)';
        this.id = "p-fieldset-" + idx++;
    }
    Fieldset.prototype.ngAfterContentInit = function () {
        var _this = this;
        this.templates.forEach(function (item) {
            switch (item.getType()) {
                case 'header':
                    _this.headerTemplate = item.template;
                    break;
                case 'content':
                    _this.contentTemplate = item.template;
                    break;
            }
        });
    };
    Fieldset.prototype.toggle = function (event) {
        if (this.animating) {
            return false;
        }
        this.animating = true;
        this.onBeforeToggle.emit({ originalEvent: event, collapsed: this.collapsed });
        if (this.collapsed)
            this.expand(event);
        else
            this.collapse(event);
        this.onAfterToggle.emit({ originalEvent: event, collapsed: this.collapsed });
        event.preventDefault();
    };
    Fieldset.prototype.expand = function (event) {
        this.collapsed = false;
        this.collapsedChange.emit(this.collapsed);
    };
    Fieldset.prototype.collapse = function (event) {
        this.collapsed = true;
        this.collapsedChange.emit(this.collapsed);
    };
    Fieldset.prototype.getBlockableElement = function () {
        return this.el.nativeElement.children[0];
    };
    Fieldset.prototype.onToggleDone = function (event) {
        this.animating = false;
    };
    Fieldset.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    Fieldset.decorators = [
        { type: Component, args: [{
                    selector: 'p-fieldset',
                    template: "\n        <fieldset [attr.id]=\"id\" [ngClass]=\"{'p-fieldset p-component': true, 'p-fieldset-toggleable': toggleable}\" [ngStyle]=\"style\" [class]=\"styleClass\">\n            <legend class=\"p-fieldset-legend\">\n                <ng-container *ngIf=\"toggleable; else legendContent\">\n                    <a tabindex=\"0\" (click)=\"toggle($event)\" (keydown.enter)=\"toggle($event)\" [attr.aria-controls]=\"id + '-content'\" [attr.aria-expanded]=\"!collapsed\" pRipple>\n                        <span class=\"p-fieldset-toggler pi\" *ngIf=\"toggleable\" [ngClass]=\"{'pi-minus': !collapsed,'pi-plus':collapsed}\"></span>\n                        <ng-container *ngTemplateOutlet=\"legendContent\"></ng-container>\n                    </a>\n                </ng-container>\n                <ng-template #legendContent>\n                    <span class=\"p-fieldset-legend-text\">{{legend}}</span>\n                    <ng-content select=\"p-header\"></ng-content>\n                    <ng-container *ngTemplateOutlet=\"headerTemplate\"></ng-container>\n                </ng-template>\n            </legend>\n            <div [attr.id]=\"id + '-content'\" class=\"p-toggleable-content\" [@fieldsetContent]=\"collapsed ? {value: 'hidden', params: {transitionParams: transitionOptions, height: '0'}} : {value: 'visible', params: {transitionParams: animating ? transitionOptions : '0ms', height: '*'}}\" \n                        [attr.aria-labelledby]=\"id\" [attr.aria-hidden]=\"collapsed\"\n                         (@fieldsetContent.done)=\"onToggleDone($event)\" role=\"region\">\n                <div class=\"p-fieldset-content\">\n                    <ng-content></ng-content>\n                    <ng-container *ngTemplateOutlet=\"contentTemplate\"></ng-container>\n                </div>\n            </div>\n        </fieldset>\n    ",
                    animations: [
                        trigger('fieldsetContent', [
                            state('hidden', style({
                                height: '0',
                                overflow: 'hidden'
                            })),
                            state('void', style({
                                height: '{{height}}'
                            }), { params: { height: '0' } }),
                            state('visible', style({
                                height: '*'
                            })),
                            transition('visible <=> hidden', [style({ overflow: 'hidden' }), animate('{{transitionParams}}')]),
                            transition('void => hidden', animate('{{transitionParams}}')),
                            transition('void => visible', animate('{{transitionParams}}'))
                        ])
                    ],
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    styles: [".p-fieldset-legend>a,.p-fieldset-legend>span{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center}.p-fieldset-toggleable .p-fieldset-legend a{cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;overflow:hidden;position:relative}.p-fieldset-legend-text{line-height:1}"]
                },] }
    ];
    Fieldset.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    Fieldset.propDecorators = {
        legend: [{ type: Input }],
        toggleable: [{ type: Input }],
        collapsed: [{ type: Input }],
        collapsedChange: [{ type: Output }],
        onBeforeToggle: [{ type: Output }],
        onAfterToggle: [{ type: Output }],
        style: [{ type: Input }],
        styleClass: [{ type: Input }],
        transitionOptions: [{ type: Input }],
        templates: [{ type: ContentChildren, args: [PrimeTemplate,] }]
    };
    return Fieldset;
}());
var FieldsetModule = /** @class */ (function () {
    function FieldsetModule() {
    }
    FieldsetModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule, RippleModule],
                    exports: [Fieldset, SharedModule],
                    declarations: [Fieldset]
                },] }
    ];
    return FieldsetModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { Fieldset, FieldsetModule };
//# sourceMappingURL=primeng-fieldset.js.map
