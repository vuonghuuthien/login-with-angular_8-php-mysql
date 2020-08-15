import { ɵɵdefineInjectable, Injectable, Component, TemplateRef, Directive, Input, NgModule } from '@angular/core';
import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';

var PrimeNGConfig = /** @class */ (function () {
    function PrimeNGConfig() {
        this.ripple = false;
    }
    PrimeNGConfig.ɵprov = ɵɵdefineInjectable({ factory: function PrimeNGConfig_Factory() { return new PrimeNGConfig(); }, token: PrimeNGConfig, providedIn: "root" });
    PrimeNGConfig.decorators = [
        { type: Injectable, args: [{ providedIn: 'root' },] }
    ];
    return PrimeNGConfig;
}());

var ConfirmationService = /** @class */ (function () {
    function ConfirmationService() {
        this.requireConfirmationSource = new Subject();
        this.acceptConfirmationSource = new Subject();
        this.requireConfirmation$ = this.requireConfirmationSource.asObservable();
        this.accept = this.acceptConfirmationSource.asObservable();
    }
    ConfirmationService.prototype.confirm = function (confirmation) {
        this.requireConfirmationSource.next(confirmation);
        return this;
    };
    ConfirmationService.prototype.close = function () {
        this.requireConfirmationSource.next(null);
        return this;
    };
    ConfirmationService.prototype.onAccept = function () {
        this.acceptConfirmationSource.next();
    };
    ConfirmationService.decorators = [
        { type: Injectable }
    ];
    return ConfirmationService;
}());

var MessageService = /** @class */ (function () {
    function MessageService() {
        this.messageSource = new Subject();
        this.clearSource = new Subject();
        this.messageObserver = this.messageSource.asObservable();
        this.clearObserver = this.clearSource.asObservable();
    }
    MessageService.prototype.add = function (message) {
        if (message) {
            this.messageSource.next(message);
        }
    };
    MessageService.prototype.addAll = function (messages) {
        if (messages && messages.length) {
            this.messageSource.next(messages);
        }
    };
    MessageService.prototype.clear = function (key) {
        this.clearSource.next(key || null);
    };
    MessageService.decorators = [
        { type: Injectable }
    ];
    return MessageService;
}());

var Header = /** @class */ (function () {
    function Header() {
    }
    Header.decorators = [
        { type: Component, args: [{
                    selector: 'p-header',
                    template: '<ng-content></ng-content>'
                },] }
    ];
    return Header;
}());
var Footer = /** @class */ (function () {
    function Footer() {
    }
    Footer.decorators = [
        { type: Component, args: [{
                    selector: 'p-footer',
                    template: '<ng-content></ng-content>'
                },] }
    ];
    return Footer;
}());
var PrimeTemplate = /** @class */ (function () {
    function PrimeTemplate(template) {
        this.template = template;
    }
    PrimeTemplate.prototype.getType = function () {
        return this.name;
    };
    PrimeTemplate.ctorParameters = function () { return [
        { type: TemplateRef }
    ]; };
    PrimeTemplate.decorators = [
        { type: Directive, args: [{
                    selector: '[pTemplate]',
                    host: {}
                },] }
    ];
    PrimeTemplate.ctorParameters = function () { return [
        { type: TemplateRef }
    ]; };
    PrimeTemplate.propDecorators = {
        type: [{ type: Input }],
        name: [{ type: Input, args: ['pTemplate',] }]
    };
    return PrimeTemplate;
}());
var SharedModule = /** @class */ (function () {
    function SharedModule() {
    }
    SharedModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule],
                    exports: [Header, Footer, PrimeTemplate],
                    declarations: [Header, Footer, PrimeTemplate]
                },] }
    ];
    return SharedModule;
}());

var TreeDragDropService = /** @class */ (function () {
    function TreeDragDropService() {
        this.dragStartSource = new Subject();
        this.dragStopSource = new Subject();
        this.dragStart$ = this.dragStartSource.asObservable();
        this.dragStop$ = this.dragStopSource.asObservable();
    }
    TreeDragDropService.prototype.startDrag = function (event) {
        this.dragStartSource.next(event);
    };
    TreeDragDropService.prototype.stopDrag = function (event) {
        this.dragStopSource.next(event);
    };
    TreeDragDropService.decorators = [
        { type: Injectable }
    ];
    return TreeDragDropService;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { ConfirmationService, Footer, Header, MessageService, PrimeNGConfig, PrimeTemplate, SharedModule, TreeDragDropService };
//# sourceMappingURL=primeng-api.js.map
