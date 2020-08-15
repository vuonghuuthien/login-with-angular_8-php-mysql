(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('rxjs'), require('@angular/common')) :
    typeof define === 'function' && define.amd ? define('primeng/api', ['exports', '@angular/core', 'rxjs', '@angular/common'], factory) :
    (global = global || self, factory((global.primeng = global.primeng || {}, global.primeng.api = {}), global.ng.core, global.rxjs, global.ng.common));
}(this, (function (exports, core, rxjs, common) { 'use strict';

    var PrimeNGConfig = /** @class */ (function () {
        function PrimeNGConfig() {
            this.ripple = false;
        }
        PrimeNGConfig.ɵprov = core.ɵɵdefineInjectable({ factory: function PrimeNGConfig_Factory() { return new PrimeNGConfig(); }, token: PrimeNGConfig, providedIn: "root" });
        PrimeNGConfig.decorators = [
            { type: core.Injectable, args: [{ providedIn: 'root' },] }
        ];
        return PrimeNGConfig;
    }());

    var ConfirmationService = /** @class */ (function () {
        function ConfirmationService() {
            this.requireConfirmationSource = new rxjs.Subject();
            this.acceptConfirmationSource = new rxjs.Subject();
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
            { type: core.Injectable }
        ];
        return ConfirmationService;
    }());

    var MessageService = /** @class */ (function () {
        function MessageService() {
            this.messageSource = new rxjs.Subject();
            this.clearSource = new rxjs.Subject();
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
            { type: core.Injectable }
        ];
        return MessageService;
    }());

    var Header = /** @class */ (function () {
        function Header() {
        }
        Header.decorators = [
            { type: core.Component, args: [{
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
            { type: core.Component, args: [{
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
            { type: core.TemplateRef }
        ]; };
        PrimeTemplate.decorators = [
            { type: core.Directive, args: [{
                        selector: '[pTemplate]',
                        host: {}
                    },] }
        ];
        PrimeTemplate.ctorParameters = function () { return [
            { type: core.TemplateRef }
        ]; };
        PrimeTemplate.propDecorators = {
            type: [{ type: core.Input }],
            name: [{ type: core.Input, args: ['pTemplate',] }]
        };
        return PrimeTemplate;
    }());
    var SharedModule = /** @class */ (function () {
        function SharedModule() {
        }
        SharedModule.decorators = [
            { type: core.NgModule, args: [{
                        imports: [common.CommonModule],
                        exports: [Header, Footer, PrimeTemplate],
                        declarations: [Header, Footer, PrimeTemplate]
                    },] }
        ];
        return SharedModule;
    }());

    var TreeDragDropService = /** @class */ (function () {
        function TreeDragDropService() {
            this.dragStartSource = new rxjs.Subject();
            this.dragStopSource = new rxjs.Subject();
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
            { type: core.Injectable }
        ];
        return TreeDragDropService;
    }());

    exports.ConfirmationService = ConfirmationService;
    exports.Footer = Footer;
    exports.Header = Header;
    exports.MessageService = MessageService;
    exports.PrimeNGConfig = PrimeNGConfig;
    exports.PrimeTemplate = PrimeTemplate;
    exports.SharedModule = SharedModule;
    exports.TreeDragDropService = TreeDragDropService;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=primeng-api.umd.js.map
