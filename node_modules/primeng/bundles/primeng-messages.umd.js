(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('@angular/animations'), require('primeng/api'), require('primeng/ripple')) :
    typeof define === 'function' && define.amd ? define('primeng/messages', ['exports', '@angular/core', '@angular/common', '@angular/animations', 'primeng/api', 'primeng/ripple'], factory) :
    (global = global || self, factory((global.primeng = global.primeng || {}, global.primeng.messages = {}), global.ng.core, global.ng.common, global.ng.animations, global.primeng.api, global.primeng.ripple));
}(this, (function (exports, core, common, animations, api, ripple) { 'use strict';

    var __read = (this && this.__read) || function (o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    };
    var __spread = (this && this.__spread) || function () {
        for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
        return ar;
    };
    var Messages = /** @class */ (function () {
        function Messages(messageService, el, cd) {
            this.messageService = messageService;
            this.el = el;
            this.cd = cd;
            this.closable = true;
            this.enableService = true;
            this.escape = true;
            this.showTransitionOptions = '300ms ease-out';
            this.hideTransitionOptions = '200ms cubic-bezier(0.86, 0, 0.07, 1)';
            this.valueChange = new core.EventEmitter();
        }
        Messages.prototype.ngAfterContentInit = function () {
            var _this = this;
            this.templates.forEach(function (item) {
                switch (item.getType()) {
                    case 'content':
                        _this.contentTemplate = item.template;
                        break;
                    default:
                        _this.contentTemplate = item.template;
                        break;
                }
            });
            if (this.messageService && this.enableService && !this.contentTemplate) {
                this.messageSubscription = this.messageService.messageObserver.subscribe(function (messages) {
                    if (messages) {
                        if (messages instanceof Array) {
                            var filteredMessages = messages.filter(function (m) { return _this.key === m.key; });
                            _this.value = _this.value ? __spread(_this.value, filteredMessages) : __spread(filteredMessages);
                        }
                        else if (_this.key === messages.key) {
                            _this.value = _this.value ? __spread(_this.value, [messages]) : [messages];
                        }
                        _this.cd.markForCheck();
                    }
                });
                this.clearSubscription = this.messageService.clearObserver.subscribe(function (key) {
                    if (key) {
                        if (_this.key === key) {
                            _this.value = null;
                        }
                    }
                    else {
                        _this.value = null;
                    }
                    _this.cd.markForCheck();
                });
            }
        };
        Messages.prototype.hasMessages = function () {
            var parentEl = this.el.nativeElement.parentElement;
            if (parentEl && parentEl.offsetParent) {
                return this.contentTemplate != null || this.value && this.value.length > 0;
            }
            return false;
        };
        Messages.prototype.clear = function () {
            this.value = [];
            this.valueChange.emit(this.value);
        };
        Messages.prototype.removeMessage = function (i) {
            this.value = this.value.filter(function (msg, index) { return index !== i; });
        };
        Object.defineProperty(Messages.prototype, "icon", {
            get: function () {
                var severity = this.severity || (this.hasMessages() ? this.value[0].severity : null);
                if (this.hasMessages()) {
                    switch (severity) {
                        case 'success':
                            return 'pi-check';
                            break;
                        case 'info':
                            return 'pi-info-circle';
                            break;
                        case 'error':
                            return 'pi-times';
                            break;
                        case 'warn':
                            return 'pi-exclamation-triangle';
                            break;
                        default:
                            return 'pi-info-circle';
                            break;
                    }
                }
                return null;
            },
            enumerable: false,
            configurable: true
        });
        Messages.prototype.ngOnDestroy = function () {
            if (this.messageSubscription) {
                this.messageSubscription.unsubscribe();
            }
            if (this.clearSubscription) {
                this.clearSubscription.unsubscribe();
            }
        };
        Messages.ctorParameters = function () { return [
            { type: api.MessageService, decorators: [{ type: core.Optional }] },
            { type: core.ElementRef },
            { type: core.ChangeDetectorRef }
        ]; };
        Messages.decorators = [
            { type: core.Component, args: [{
                        selector: 'p-messages',
                        template: "\n        <div class=\"p-messages p-component\" role=\"alert\" [ngStyle]=\"style\" [class]=\"styleClass\">\n            <ng-container *ngIf=\"!contentTemplate; else staticMessage\">\n                <div *ngFor=\"let msg of value; let i=index\" [ngClass]=\"'p-message p-message-' + msg.severity\" role=\"alert\" \n                    [@messageAnimation]=\"{value: 'visible', params: {showTransitionParams: showTransitionOptions, hideTransitionParams: hideTransitionOptions}}\">\n                    <div class=\"p-message-wrapper\">\n                        <span class=\"p-message-icon pi\" [ngClass]=\"{'pi-info-circle': msg.severity === 'info', \n                            'pi-check': msg.severity === 'success',\n                            'pi-exclamation-triangle': msg.severity === 'warn',\n                            'pi-times-circle': msg.severity === 'error'}\"></span>\n                        <ng-container *ngIf=\"!escape; else escapeOut\">\n                            <span *ngIf=\"msg.summary\" class=\"p-message-summary\" [innerHTML]=\"msg.summary\"></span>\n                            <span *ngIf=\"msg.detail\" class=\"p-message-detail\" [innerHTML]=\"msg.detail\"></span>\n                        </ng-container>\n                        <ng-template #escapeOut>\n                            <span *ngIf=\"msg.summary\" class=\"p-message-summary\">{{msg.summary}}</span>\n                            <span *ngIf=\"msg.detail\" class=\"p-message-detail\">{{msg.detail}}</span>\n                        </ng-template>\n                        <button class=\"p-message-close p-link\" (click)=\"removeMessage(i)\" *ngIf=\"closable\" type=\"button\" pRipple>\n                            <i class=\"p-message-close-icon pi pi-times\"></i>\n                        </button>\n                    </div>\n                </div>\n            </ng-container>\n            <ng-template #staticMessage>\n                <div [ngClass]=\"'p-message p-message-' + severity\" role=\"alert\">\n                    <div class=\"p-message-wrapper\">\n                        <ng-container *ngTemplateOutlet=\"contentTemplate\"></ng-container>\n                    </div>\n                </div>\n            </ng-template>\n            </div>\n    ",
                        animations: [
                            animations.trigger('messageAnimation', [
                                animations.transition(':enter', [
                                    animations.style({ opacity: 0, transform: 'translateY(-25%)' }),
                                    animations.animate('{{showTransitionParams}}')
                                ]),
                                animations.transition(':leave', [
                                    animations.animate('{{hideTransitionParams}}', animations.style({ height: 0, margin: 0, overflow: 'hidden', opacity: 0 }))
                                ])
                            ])
                        ],
                        changeDetection: core.ChangeDetectionStrategy.OnPush,
                        encapsulation: core.ViewEncapsulation.None,
                        styles: [".p-message-wrapper{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center}.p-message-close{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center}.p-message-close.p-link{margin-left:auto;overflow:hidden;position:relative}"]
                    },] }
        ];
        Messages.ctorParameters = function () { return [
            { type: api.MessageService, decorators: [{ type: core.Optional }] },
            { type: core.ElementRef },
            { type: core.ChangeDetectorRef }
        ]; };
        Messages.propDecorators = {
            value: [{ type: core.Input }],
            closable: [{ type: core.Input }],
            style: [{ type: core.Input }],
            styleClass: [{ type: core.Input }],
            enableService: [{ type: core.Input }],
            key: [{ type: core.Input }],
            escape: [{ type: core.Input }],
            severity: [{ type: core.Input }],
            showTransitionOptions: [{ type: core.Input }],
            hideTransitionOptions: [{ type: core.Input }],
            templates: [{ type: core.ContentChildren, args: [api.PrimeTemplate,] }],
            valueChange: [{ type: core.Output }]
        };
        return Messages;
    }());
    var MessagesModule = /** @class */ (function () {
        function MessagesModule() {
        }
        MessagesModule.decorators = [
            { type: core.NgModule, args: [{
                        imports: [common.CommonModule, ripple.RippleModule],
                        exports: [Messages],
                        declarations: [Messages]
                    },] }
        ];
        return MessagesModule;
    }());

    exports.Messages = Messages;
    exports.MessagesModule = MessagesModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=primeng-messages.umd.js.map
