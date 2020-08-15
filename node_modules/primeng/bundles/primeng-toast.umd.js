(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('primeng/dom'), require('primeng/api'), require('primeng/ripple'), require('@angular/animations')) :
    typeof define === 'function' && define.amd ? define('primeng/toast', ['exports', '@angular/core', '@angular/common', 'primeng/dom', 'primeng/api', 'primeng/ripple', '@angular/animations'], factory) :
    (global = global || self, factory((global.primeng = global.primeng || {}, global.primeng.toast = {}), global.ng.core, global.ng.common, global.primeng.dom, global.primeng.api, global.primeng.ripple, global.ng.animations));
}(this, (function (exports, core, common, dom, api, ripple, animations) { 'use strict';

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
    var ToastItem = /** @class */ (function () {
        function ToastItem(zone) {
            this.zone = zone;
            this.onClose = new core.EventEmitter();
        }
        ToastItem.prototype.ngAfterViewInit = function () {
            this.initTimeout();
        };
        ToastItem.prototype.initTimeout = function () {
            var _this = this;
            if (!this.message.sticky) {
                this.zone.runOutsideAngular(function () {
                    _this.timeout = setTimeout(function () {
                        _this.onClose.emit({
                            index: _this.index,
                            message: _this.message
                        });
                    }, _this.message.life || 3000);
                });
            }
        };
        ToastItem.prototype.clearTimeout = function () {
            if (this.timeout) {
                clearTimeout(this.timeout);
                this.timeout = null;
            }
        };
        ToastItem.prototype.onMouseEnter = function () {
            this.clearTimeout();
        };
        ToastItem.prototype.onMouseLeave = function () {
            this.initTimeout();
        };
        ToastItem.prototype.onCloseIconClick = function (event) {
            this.clearTimeout();
            this.onClose.emit({
                index: this.index,
                message: this.message
            });
            event.preventDefault();
        };
        ToastItem.prototype.ngOnDestroy = function () {
            this.clearTimeout();
        };
        ToastItem.ctorParameters = function () { return [
            { type: core.NgZone }
        ]; };
        ToastItem.decorators = [
            { type: core.Component, args: [{
                        selector: 'p-toastItem',
                        template: "\n        <div #container [attr.id]=\"message.id\" class=\"p-toast-message\" [ngClass]=\"'p-toast-message-' + message.severity\" [@messageState]=\"{value: 'visible', params: {showTransformParams: showTransformOptions, hideTransformParams: hideTransformOptions, showTransitionParams: showTransitionOptions, hideTransitionParams: hideTransitionOptions}}\"\n                (mouseenter)=\"onMouseEnter()\" (mouseleave)=\"onMouseLeave()\">\n            <div class=\"p-toast-message-content\" role=\"alert\" aria-live=\"assertive\" aria-atomic=\"true\">\n                <ng-container *ngIf=\"!template\">\n                    <span class=\"p-toast-message-icon pi\" [ngClass]=\"{'pi-info-circle': message.severity == 'info', 'pi-exclamation-triangle': message.severity == 'warn',\n                        'pi-times-circle': message.severity == 'error', 'pi-check' :message.severity == 'success'}\"></span>\n                    <div class=\"p-toast-message-text\">\n                        <div class=\"p-toast-summary\">{{message.summary}}</div>\n                        <div class=\"p-toast-detail\">{{message.detail}}</div>\n                    </div>\n                </ng-container>\n                <button type=\"button\" class=\"p-toast-icon-close p-link\" (click)=\"onCloseIconClick($event)\" (keydown.enter)=\"onCloseIconClick($event)\" *ngIf=\"message.closable !== false\" pRipple>\n                    <span class=\"p-toast-icon-close-icon pi pi-times\"></span>\n                </button>\n                <ng-container *ngTemplateOutlet=\"template; context: {$implicit: message}\"></ng-container>\n            </div>\n        </div>\n    ",
                        animations: [
                            animations.trigger('messageState', [
                                animations.state('visible', animations.style({
                                    transform: 'translateY(0)',
                                    opacity: 1
                                })),
                                animations.transition('void => *', [
                                    animations.style({ transform: '{{showTransformParams}}', opacity: 0 }),
                                    animations.animate('{{showTransitionParams}}')
                                ]),
                                animations.transition('* => void', [
                                    animations.animate(('{{hideTransitionParams}}'), animations.style({
                                        height: 0,
                                        opacity: 0,
                                        transform: '{{hideTransformParams}}'
                                    }))
                                ])
                            ])
                        ],
                        encapsulation: core.ViewEncapsulation.None,
                        changeDetection: core.ChangeDetectionStrategy.OnPush
                    },] }
        ];
        ToastItem.ctorParameters = function () { return [
            { type: core.NgZone }
        ]; };
        ToastItem.propDecorators = {
            message: [{ type: core.Input }],
            index: [{ type: core.Input }],
            template: [{ type: core.Input }],
            showTransformOptions: [{ type: core.Input }],
            hideTransformOptions: [{ type: core.Input }],
            showTransitionOptions: [{ type: core.Input }],
            hideTransitionOptions: [{ type: core.Input }],
            onClose: [{ type: core.Output }],
            containerViewChild: [{ type: core.ViewChild, args: ['container',] }]
        };
        return ToastItem;
    }());
    var Toast = /** @class */ (function () {
        function Toast(messageService, cd) {
            this.messageService = messageService;
            this.cd = cd;
            this.autoZIndex = true;
            this.baseZIndex = 0;
            this.position = 'top-right';
            this.preventOpenDuplicates = false;
            this.preventDuplicates = false;
            this.showTransformOptions = 'translateY(100%)';
            this.hideTransformOptions = 'translateY(-100%)';
            this.showTransitionOptions = '300ms ease-out';
            this.hideTransitionOptions = '250ms ease-in';
            this.onClose = new core.EventEmitter();
        }
        Toast.prototype.ngOnInit = function () {
            var _this = this;
            this.messageSubscription = this.messageService.messageObserver.subscribe(function (messages) {
                if (messages) {
                    if (messages instanceof Array) {
                        var filteredMessages = messages.filter(function (m) { return _this.canAdd(m); });
                        _this.add(filteredMessages);
                    }
                    else if (_this.canAdd(messages)) {
                        _this.add([messages]);
                    }
                }
            });
            this.clearSubscription = this.messageService.clearObserver.subscribe(function (key) {
                if (key) {
                    if (_this.key === key) {
                        _this.messages = null;
                    }
                }
                else {
                    _this.messages = null;
                }
                _this.cd.markForCheck();
            });
        };
        Toast.prototype.add = function (messages) {
            this.messages = this.messages ? __spread(this.messages, messages) : __spread(messages);
            if (this.preventDuplicates) {
                this.messagesArchieve = this.messagesArchieve ? __spread(this.messagesArchieve, messages) : __spread(messages);
            }
            this.cd.markForCheck();
        };
        Toast.prototype.canAdd = function (message) {
            var allow = this.key === message.key;
            if (allow && this.preventOpenDuplicates) {
                allow = !this.containsMessage(this.messages, message);
            }
            if (allow && this.preventDuplicates) {
                allow = !this.containsMessage(this.messagesArchieve, message);
            }
            return allow;
        };
        Toast.prototype.containsMessage = function (collection, message) {
            if (!collection) {
                return false;
            }
            return collection.find(function (m) {
                return ((m.summary === message.summary) && (m.detail == message.detail) && (m.severity === message.severity));
            }) != null;
        };
        Toast.prototype.ngAfterContentInit = function () {
            var _this = this;
            this.templates.forEach(function (item) {
                switch (item.getType()) {
                    case 'message':
                        _this.template = item.template;
                        break;
                    default:
                        _this.template = item.template;
                        break;
                }
            });
        };
        Toast.prototype.onMessageClose = function (event) {
            this.messages.splice(event.index, 1);
            this.onClose.emit({
                message: event.message
            });
            this.cd.detectChanges();
        };
        Toast.prototype.onAnimationStart = function (event) {
            if (event.fromState === 'void' && this.autoZIndex) {
                this.containerViewChild.nativeElement.style.zIndex = String(this.baseZIndex + (++dom.DomHandler.zindex));
            }
        };
        Toast.prototype.ngOnDestroy = function () {
            if (this.messageSubscription) {
                this.messageSubscription.unsubscribe();
            }
            if (this.clearSubscription) {
                this.clearSubscription.unsubscribe();
            }
        };
        Toast.ctorParameters = function () { return [
            { type: api.MessageService },
            { type: core.ChangeDetectorRef }
        ]; };
        Toast.decorators = [
            { type: core.Component, args: [{
                        selector: 'p-toast',
                        template: "\n        <div #container [ngClass]=\"'p-toast p-component p-toast-' + position\" [ngStyle]=\"style\" [class]=\"styleClass\">\n            <p-toastItem *ngFor=\"let msg of messages; let i=index\" [message]=\"msg\" [index]=\"i\" (onClose)=\"onMessageClose($event)\"\n                    [template]=\"template\" @toastAnimation (@toastAnimation.start)=\"onAnimationStart($event)\" \n                    [showTransformOptions]=\"showTransformOptions\" [hideTransformOptions]=\"hideTransformOptions\" \n                    [showTransitionOptions]=\"showTransitionOptions\" [hideTransitionOptions]=\"hideTransitionOptions\"></p-toastItem>\n        </div>\n    ",
                        animations: [
                            animations.trigger('toastAnimation', [
                                animations.transition(':enter, :leave', [
                                    animations.query('@*', animations.animateChild())
                                ])
                            ])
                        ],
                        changeDetection: core.ChangeDetectionStrategy.OnPush,
                        encapsulation: core.ViewEncapsulation.None,
                        styles: [".p-toast{position:fixed;width:25rem}.p-toast-message{overflow:hidden}.p-toast-message-content{display:-ms-flexbox;display:flex;-ms-flex-align:start;align-items:flex-start}.p-toast-message-text{-ms-flex:1 1 auto;flex:1 1 auto}.p-toast-top-right{top:20px;right:20px}.p-toast-top-left{top:20px;left:20px}.p-toast-bottom-left{bottom:20px;left:20px}.p-toast-bottom-right{bottom:20px;right:20px}.p-toast-top-center{top:20px;left:50%;margin-left:-10em}.p-toast-bottom-center{bottom:20px;left:50%;margin-left:-10em}.p-toast-center{left:50%;top:50%;min-width:20vw;-ms-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}.p-toast-icon-close{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;overflow:hidden;position:relative}.p-toast-icon-close.p-link{cursor:pointer}"]
                    },] }
        ];
        Toast.ctorParameters = function () { return [
            { type: api.MessageService },
            { type: core.ChangeDetectorRef }
        ]; };
        Toast.propDecorators = {
            key: [{ type: core.Input }],
            autoZIndex: [{ type: core.Input }],
            baseZIndex: [{ type: core.Input }],
            style: [{ type: core.Input }],
            styleClass: [{ type: core.Input }],
            position: [{ type: core.Input }],
            preventOpenDuplicates: [{ type: core.Input }],
            preventDuplicates: [{ type: core.Input }],
            showTransformOptions: [{ type: core.Input }],
            hideTransformOptions: [{ type: core.Input }],
            showTransitionOptions: [{ type: core.Input }],
            hideTransitionOptions: [{ type: core.Input }],
            onClose: [{ type: core.Output }],
            containerViewChild: [{ type: core.ViewChild, args: ['container',] }],
            templates: [{ type: core.ContentChildren, args: [api.PrimeTemplate,] }]
        };
        return Toast;
    }());
    var ToastModule = /** @class */ (function () {
        function ToastModule() {
        }
        ToastModule.decorators = [
            { type: core.NgModule, args: [{
                        imports: [common.CommonModule, ripple.RippleModule],
                        exports: [Toast, api.SharedModule],
                        declarations: [Toast, ToastItem]
                    },] }
        ];
        return ToastModule;
    }());

    exports.Toast = Toast;
    exports.ToastItem = ToastItem;
    exports.ToastModule = ToastModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=primeng-toast.umd.js.map
