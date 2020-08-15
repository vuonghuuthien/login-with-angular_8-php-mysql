import { Component, EventEmitter, ChangeDetectorRef, ChangeDetectionStrategy, ViewEncapsulation, Input, ContentChildren, Output, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PrimeTemplate } from 'primeng/api';

var InplaceDisplay = /** @class */ (function () {
    function InplaceDisplay() {
    }
    InplaceDisplay.decorators = [
        { type: Component, args: [{
                    selector: 'p-inplaceDisplay',
                    template: '<ng-content></ng-content>'
                },] }
    ];
    return InplaceDisplay;
}());
var InplaceContent = /** @class */ (function () {
    function InplaceContent() {
    }
    InplaceContent.decorators = [
        { type: Component, args: [{
                    selector: 'p-inplaceContent',
                    template: '<ng-content></ng-content>'
                },] }
    ];
    return InplaceContent;
}());
var Inplace = /** @class */ (function () {
    function Inplace(cd) {
        this.cd = cd;
        this.closeIcon = 'pi pi-times';
        this.onActivate = new EventEmitter();
        this.onDeactivate = new EventEmitter();
    }
    Inplace.prototype.ngAfterContentInit = function () {
        var _this = this;
        this.templates.forEach(function (item) {
            switch (item.getType()) {
                case 'display':
                    _this.displayTemplate = item.template;
                    break;
                case 'content':
                    _this.contentTemplate = item.template;
                    break;
            }
        });
    };
    Inplace.prototype.onActivateClick = function (event) {
        if (!this.preventClick)
            this.activate(event);
    };
    Inplace.prototype.onDeactivateClick = function (event) {
        if (!this.preventClick)
            this.deactivate(event);
    };
    Inplace.prototype.activate = function (event) {
        if (!this.disabled) {
            this.active = true;
            this.onActivate.emit(event);
            this.cd.markForCheck();
        }
    };
    Inplace.prototype.deactivate = function (event) {
        if (!this.disabled) {
            this.active = false;
            this.hover = false;
            this.onDeactivate.emit(event);
            this.cd.markForCheck();
        }
    };
    Inplace.prototype.onKeydown = function (event) {
        if (event.which === 13) {
            this.activate(event);
            event.preventDefault();
        }
    };
    Inplace.ctorParameters = function () { return [
        { type: ChangeDetectorRef }
    ]; };
    Inplace.decorators = [
        { type: Component, args: [{
                    selector: 'p-inplace',
                    template: "\n        <div [ngClass]=\"{'p-inplace p-component': true, 'p-inplace-closable': closable}\" [ngStyle]=\"style\" [class]=\"styleClass\">\n            <div class=\"p-inplace-display\" (click)=\"onActivateClick($event)\" tabindex=\"0\" (keydown)=\"onKeydown($event)\"   \n                [ngClass]=\"{'p-disabled':disabled}\" *ngIf=\"!active\">\n                <ng-content select=\"[pInplaceDisplay]\"></ng-content>\n                <ng-container *ngTemplateOutlet=\"displayTemplate\"></ng-container>\n            </div>\n            <div class=\"p-inplace-content\" *ngIf=\"active\">\n                <ng-content select=\"[pInplaceContent]\"></ng-content>\n                <ng-container *ngTemplateOutlet=\"contentTemplate\"></ng-container>\n                <button type=\"button\" [icon]=\"closeIcon\" pButton (click)=\"onDeactivateClick($event)\" *ngIf=\"closable\"></button>\n            </div>\n        </div>\n    ",
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    styles: [".p-inplace .p-inplace-display{display:inline;cursor:pointer}.p-inplace .p-inplace-content{display:inline}.p-fluid .p-inplace.p-inplace-closable .p-inplace-content{display:-ms-flexbox;display:flex}.p-fluid .p-inplace.p-inplace-closable .p-inplace-content>.p-inputtext{-ms-flex:1 1 auto;flex:1 1 auto;width:1%}"]
                },] }
    ];
    Inplace.ctorParameters = function () { return [
        { type: ChangeDetectorRef }
    ]; };
    Inplace.propDecorators = {
        active: [{ type: Input }],
        closable: [{ type: Input }],
        disabled: [{ type: Input }],
        preventClick: [{ type: Input }],
        style: [{ type: Input }],
        styleClass: [{ type: Input }],
        closeIcon: [{ type: Input }],
        templates: [{ type: ContentChildren, args: [PrimeTemplate,] }],
        onActivate: [{ type: Output }],
        onDeactivate: [{ type: Output }]
    };
    return Inplace;
}());
var InplaceModule = /** @class */ (function () {
    function InplaceModule() {
    }
    InplaceModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule, ButtonModule],
                    exports: [Inplace, InplaceDisplay, InplaceContent, ButtonModule],
                    declarations: [Inplace, InplaceDisplay, InplaceContent]
                },] }
    ];
    return InplaceModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { Inplace, InplaceContent, InplaceDisplay, InplaceModule };
//# sourceMappingURL=primeng-inplace.js.map
