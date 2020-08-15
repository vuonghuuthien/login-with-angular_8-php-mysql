(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/animations'), require('@angular/common'), require('primeng/dom'), require('primeng/api'), require('primeng/focustrap'), require('primeng/ripple')) :
    typeof define === 'function' && define.amd ? define('primeng/dialog', ['exports', '@angular/core', '@angular/animations', '@angular/common', 'primeng/dom', 'primeng/api', 'primeng/focustrap', 'primeng/ripple'], factory) :
    (global = global || self, factory((global.primeng = global.primeng || {}, global.primeng.dialog = {}), global.ng.core, global.ng.animations, global.ng.common, global.primeng.dom, global.primeng.api, global.primeng.focustrap, global.primeng.ripple));
}(this, (function (exports, core, animations, common, dom, api, focustrap, ripple) { 'use strict';

    var __assign = (this && this.__assign) || function () {
        __assign = Object.assign || function(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    var idx = 0;
    var showAnimation = animations.animation([
        animations.style({ transform: '{{transform}}', opacity: 0 }),
        animations.animate('{{transition}}')
    ]);
    var hideAnimation = animations.animation([
        animations.animate('{{transition}}', animations.style({ transform: '{{transform}}', opacity: 0 }))
    ]);
    var Dialog = /** @class */ (function () {
        function Dialog(el, renderer, zone, cd) {
            this.el = el;
            this.renderer = renderer;
            this.zone = zone;
            this.cd = cd;
            this.draggable = true;
            this.resizable = true;
            this.closeOnEscape = true;
            this.closable = true;
            this.showHeader = true;
            this.blockScroll = false;
            this.autoZIndex = true;
            this.baseZIndex = 0;
            this.minX = 0;
            this.minY = 0;
            this.focusOnShow = true;
            this.keepInViewport = true;
            this.focusTrap = true;
            this.transitionOptions = '150ms cubic-bezier(0, 0, 0.2, 1)';
            this.closeIcon = 'pi pi-times';
            this.minimizeIcon = 'pi pi-window-minimize';
            this.maximizeIcon = 'pi pi-window-maximize';
            this.onShow = new core.EventEmitter();
            this.onHide = new core.EventEmitter();
            this.visibleChange = new core.EventEmitter();
            this.onResizeInit = new core.EventEmitter();
            this.onResizeEnd = new core.EventEmitter();
            this.onDragEnd = new core.EventEmitter();
            this.id = "p-dialog-" + idx++;
            this._style = {};
            this._position = "center";
            this.transformOptions = "scale(0.7)";
        }
        Object.defineProperty(Dialog.prototype, "positionLeft", {
            get: function () {
                return 0;
            },
            set: function (_positionLeft) {
                console.log("positionLeft property is deprecated.");
            },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(Dialog.prototype, "positionTop", {
            get: function () {
                return 0;
            },
            set: function (_positionTop) {
                console.log("positionTop property is deprecated.");
            },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(Dialog.prototype, "responsive", {
            get: function () {
                return false;
            },
            set: function (_responsive) {
                console.log("Responsive property is deprecated.");
            },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(Dialog.prototype, "breakpoint", {
            get: function () {
                return 649;
            },
            set: function (_breakpoint) {
                console.log("Breakpoint property is not utilized and deprecated, use CSS media queries instead.");
            },
            enumerable: false,
            configurable: true
        });
        ;
        Dialog.prototype.ngAfterContentInit = function () {
            var _this = this;
            this.templates.forEach(function (item) {
                switch (item.getType()) {
                    case 'header':
                        _this.headerTemplate = item.template;
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
        Object.defineProperty(Dialog.prototype, "visible", {
            get: function () {
                return this._visible;
            },
            set: function (value) {
                this._visible = value;
                if (this._visible && !this.maskVisible) {
                    this.maskVisible = true;
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Dialog.prototype, "style", {
            get: function () {
                return this._style;
            },
            set: function (value) {
                if (value) {
                    this._style = __assign({}, value);
                    this.originalStyle = value;
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Dialog.prototype, "position", {
            get: function () {
                return this._position;
            },
            set: function (value) {
                this._position = value;
                switch (value) {
                    case 'topleft':
                    case 'bottomleft':
                    case 'left':
                        this.transformOptions = "translate3d(-100%, 0px, 0px)";
                        break;
                    case 'topright':
                    case 'bottomright':
                    case 'right':
                        this.transformOptions = "translate3d(100%, 0px, 0px)";
                        break;
                    case 'bottom':
                        this.transformOptions = "translate3d(0px, 100%, 0px)";
                        break;
                    case 'top':
                        this.transformOptions = "translate3d(0px, -100%, 0px)";
                        break;
                    default:
                        this.transformOptions = "scale(0.7)";
                        break;
                }
            },
            enumerable: false,
            configurable: true
        });
        ;
        Dialog.prototype.focus = function () {
            var focusable = dom.DomHandler.findSingle(this.container, '[autofocus]');
            if (focusable) {
                this.zone.runOutsideAngular(function () {
                    setTimeout(function () { return focusable.focus(); }, 5);
                });
            }
        };
        Dialog.prototype.close = function (event) {
            this.visibleChange.emit(false);
            event.preventDefault();
        };
        Dialog.prototype.enableModality = function () {
            var _this = this;
            if (this.closable && this.dismissableMask) {
                this.maskClickListener = this.renderer.listen(this.wrapper, 'click', function (event) {
                    if (_this.wrapper && _this.wrapper.isSameNode(event.target)) {
                        _this.close(event);
                    }
                });
            }
            if (this.modal) {
                dom.DomHandler.addClass(document.body, 'p-overflow-hidden');
            }
        };
        Dialog.prototype.disableModality = function () {
            if (this.wrapper) {
                if (this.dismissableMask) {
                    this.unbindMaskClickListener();
                }
                if (this.modal) {
                    dom.DomHandler.removeClass(document.body, 'p-overflow-hidden');
                }
                if (!this.cd.destroyed) {
                    this.cd.detectChanges();
                }
            }
        };
        Dialog.prototype.maximize = function () {
            this.maximized = !this.maximized;
            if (!this.modal && !this.blockScroll) {
                if (this.maximized)
                    dom.DomHandler.addClass(document.body, 'p-overflow-hidden');
                else
                    dom.DomHandler.removeClass(document.body, 'p-overflow-hidden');
            }
        };
        Dialog.prototype.unbindMaskClickListener = function () {
            if (this.maskClickListener) {
                this.maskClickListener();
                this.maskClickListener = null;
            }
        };
        Dialog.prototype.moveOnTop = function () {
            if (this.autoZIndex) {
                this.container.style.zIndex = String(this.baseZIndex + (++dom.DomHandler.zindex));
                this.wrapper.style.zIndex = String(this.baseZIndex + (dom.DomHandler.zindex - 1));
            }
        };
        Dialog.prototype.initDrag = function (event) {
            if (dom.DomHandler.hasClass(event.target, 'p-dialog-header-icon') || dom.DomHandler.hasClass(event.target.parentElement, 'p-dialog-header-icon')) {
                return;
            }
            if (this.draggable) {
                this.dragging = true;
                this.lastPageX = event.pageX;
                this.lastPageY = event.pageY;
                this.container.style.margin = '0';
                dom.DomHandler.addClass(document.body, 'p-unselectable-text');
            }
        };
        Dialog.prototype.onKeydown = function (event) {
            if (this.focusTrap) {
                if (event.which === 9) {
                    event.preventDefault();
                    var focusableElements = dom.DomHandler.getFocusableElements(this.container);
                    if (focusableElements && focusableElements.length > 0) {
                        if (!document.activeElement) {
                            focusableElements[0].focus();
                        }
                        else {
                            var focusedIndex = focusableElements.indexOf(document.activeElement);
                            if (event.shiftKey) {
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
            }
        };
        Dialog.prototype.onDrag = function (event) {
            if (this.dragging) {
                var containerWidth = dom.DomHandler.getOuterWidth(this.container);
                var containerHeight = dom.DomHandler.getOuterHeight(this.container);
                var deltaX = event.pageX - this.lastPageX;
                var deltaY = event.pageY - this.lastPageY;
                var offset = dom.DomHandler.getOffset(this.container);
                var leftPos = offset.left + deltaX;
                var topPos = offset.top + deltaY;
                var viewport = dom.DomHandler.getViewport();
                this.container.style.position = 'fixed';
                if (this.keepInViewport) {
                    if (leftPos >= this.minX && (leftPos + containerWidth) < viewport.width) {
                        this._style.left = leftPos + 'px';
                        this.lastPageX = event.pageX;
                        this.container.style.left = leftPos + 'px';
                    }
                    if (topPos >= this.minY && (topPos + containerHeight) < viewport.height) {
                        this._style.top = topPos + 'px';
                        this.lastPageY = event.pageY;
                        this.container.style.top = topPos + 'px';
                    }
                }
                else {
                    this.lastPageX = event.pageX;
                    this.container.style.left = leftPos + 'px';
                    this.lastPageY = event.pageY;
                    this.container.style.top = topPos + 'px';
                }
            }
        };
        Dialog.prototype.endDrag = function (event) {
            if (this.dragging) {
                this.dragging = false;
                dom.DomHandler.removeClass(document.body, 'p-unselectable-text');
                this.cd.detectChanges();
                this.onDragEnd.emit(event);
            }
        };
        Dialog.prototype.resetPosition = function () {
            this.container.style.position = '';
            this.container.style.left = '';
            this.container.style.top = '';
            this.container.style.margin = '';
        };
        //backward compatibility
        Dialog.prototype.center = function () {
            this.resetPosition();
        };
        Dialog.prototype.initResize = function (event) {
            if (this.resizable) {
                this.resizing = true;
                this.lastPageX = event.pageX;
                this.lastPageY = event.pageY;
                dom.DomHandler.addClass(document.body, 'p-unselectable-text');
                this.onResizeInit.emit(event);
            }
        };
        Dialog.prototype.onResize = function (event) {
            if (this.resizing) {
                var deltaX = event.pageX - this.lastPageX;
                var deltaY = event.pageY - this.lastPageY;
                var containerWidth = dom.DomHandler.getOuterWidth(this.container);
                var containerHeight = dom.DomHandler.getOuterHeight(this.container);
                var contentHeight = dom.DomHandler.getOuterHeight(this.contentViewChild.nativeElement);
                var newWidth = containerWidth + deltaX;
                var newHeight = containerHeight + deltaY;
                var minWidth = this.container.style.minWidth;
                var minHeight = this.container.style.minHeight;
                var offset = dom.DomHandler.getOffset(this.container);
                var viewport = dom.DomHandler.getViewport();
                var hasBeenDragged = !parseInt(this.container.style.top) || !parseInt(this.container.style.left);
                if (hasBeenDragged) {
                    newWidth += deltaX;
                    newHeight += deltaY;
                }
                if ((!minWidth || newWidth > parseInt(minWidth)) && (offset.left + newWidth) < viewport.width) {
                    this._style.width = newWidth + 'px';
                    this.container.style.width = this._style.width;
                }
                if ((!minHeight || newHeight > parseInt(minHeight)) && (offset.top + newHeight) < viewport.height) {
                    this.contentViewChild.nativeElement.style.height = contentHeight + newHeight - containerHeight + 'px';
                    if (this._style.height) {
                        this._style.height = newHeight + 'px';
                        this.container.style.height = this._style.height;
                    }
                }
                this.lastPageX = event.pageX;
                this.lastPageY = event.pageY;
            }
        };
        Dialog.prototype.resizeEnd = function (event) {
            if (this.resizing) {
                this.resizing = false;
                dom.DomHandler.removeClass(document.body, 'p-unselectable-text');
                this.onResizeEnd.emit(event);
            }
        };
        Dialog.prototype.bindGlobalListeners = function () {
            if (this.draggable) {
                this.bindDocumentDragListener();
                this.bindDocumentDragEndListener();
            }
            if (this.resizable) {
                this.bindDocumentResizeListeners();
            }
            if (this.closeOnEscape && this.closable) {
                this.bindDocumentEscapeListener();
            }
        };
        Dialog.prototype.unbindGlobalListeners = function () {
            this.unbindDocumentDragListener();
            this.unbindDocumentDragEndListener();
            this.unbindDocumentResizeListeners();
            this.unbindDocumentEscapeListener();
        };
        Dialog.prototype.bindDocumentDragListener = function () {
            var _this = this;
            this.zone.runOutsideAngular(function () {
                _this.documentDragListener = _this.onDrag.bind(_this);
                window.document.addEventListener('mousemove', _this.documentDragListener);
            });
        };
        Dialog.prototype.unbindDocumentDragListener = function () {
            if (this.documentDragListener) {
                window.document.removeEventListener('mousemove', this.documentDragListener);
                this.documentDragListener = null;
            }
        };
        Dialog.prototype.bindDocumentDragEndListener = function () {
            var _this = this;
            this.zone.runOutsideAngular(function () {
                _this.documentDragEndListener = _this.endDrag.bind(_this);
                window.document.addEventListener('mouseup', _this.documentDragEndListener);
            });
        };
        Dialog.prototype.unbindDocumentDragEndListener = function () {
            if (this.documentDragEndListener) {
                window.document.removeEventListener('mouseup', this.documentDragEndListener);
                this.documentDragEndListener = null;
            }
        };
        Dialog.prototype.bindDocumentResizeListeners = function () {
            var _this = this;
            this.zone.runOutsideAngular(function () {
                _this.documentResizeListener = _this.onResize.bind(_this);
                _this.documentResizeEndListener = _this.resizeEnd.bind(_this);
                window.document.addEventListener('mousemove', _this.documentResizeListener);
                window.document.addEventListener('mouseup', _this.documentResizeEndListener);
            });
        };
        Dialog.prototype.unbindDocumentResizeListeners = function () {
            if (this.documentResizeListener && this.documentResizeEndListener) {
                window.document.removeEventListener('mousemove', this.documentResizeListener);
                window.document.removeEventListener('mouseup', this.documentResizeEndListener);
                this.documentResizeListener = null;
                this.documentResizeEndListener = null;
            }
        };
        Dialog.prototype.bindDocumentEscapeListener = function () {
            var _this = this;
            this.documentEscapeListener = this.renderer.listen('document', 'keydown', function (event) {
                if (event.which == 27) {
                    if (parseInt(_this.container.style.zIndex) === (dom.DomHandler.zindex + _this.baseZIndex)) {
                        _this.close(event);
                    }
                }
            });
        };
        Dialog.prototype.unbindDocumentEscapeListener = function () {
            if (this.documentEscapeListener) {
                this.documentEscapeListener();
                this.documentEscapeListener = null;
            }
        };
        Dialog.prototype.appendContainer = function () {
            if (this.appendTo) {
                if (this.appendTo === 'body')
                    document.body.appendChild(this.wrapper);
                else
                    dom.DomHandler.appendChild(this.wrapper, this.appendTo);
            }
        };
        Dialog.prototype.restoreAppend = function () {
            if (this.container && this.appendTo) {
                this.el.nativeElement.appendChild(this.wrapper);
            }
        };
        Dialog.prototype.onAnimationStart = function (event) {
            switch (event.toState) {
                case 'visible':
                    this.container = event.element;
                    this.wrapper = this.container.parentElement;
                    this.onShow.emit({});
                    this.appendContainer();
                    this.moveOnTop();
                    this.bindGlobalListeners();
                    if (this.modal) {
                        this.enableModality();
                    }
                    if (!this.modal && this.blockScroll) {
                        dom.DomHandler.addClass(document.body, 'p-overflow-hidden');
                    }
                    if (this.focusOnShow) {
                        this.focus();
                    }
                    break;
            }
        };
        Dialog.prototype.onAnimationEnd = function (event) {
            switch (event.toState) {
                case 'void':
                    this.onContainerDestroy();
                    this.onHide.emit({});
                    break;
            }
        };
        Dialog.prototype.onContainerDestroy = function () {
            this.unbindGlobalListeners();
            this.dragging = false;
            this.maskVisible = false;
            if (this.maximized) {
                dom.DomHandler.removeClass(document.body, 'p-overflow-hidden');
                this.maximized = false;
            }
            if (this.modal) {
                this.disableModality();
            }
            if (this.blockScroll) {
                dom.DomHandler.removeClass(document.body, 'p-overflow-hidden');
            }
            this.container = null;
            this.wrapper = null;
            this._style = this.originalStyle ? __assign({}, this.originalStyle) : {};
        };
        Dialog.prototype.ngOnDestroy = function () {
            if (this.container) {
                this.restoreAppend();
                this.onContainerDestroy();
            }
        };
        Dialog.ctorParameters = function () { return [
            { type: core.ElementRef },
            { type: core.Renderer2 },
            { type: core.NgZone },
            { type: core.ChangeDetectorRef }
        ]; };
        Dialog.decorators = [
            { type: core.Component, args: [{
                        selector: 'p-dialog',
                        template: "\n        <div *ngIf=\"maskVisible\" [class]=\"maskStyleClass\" \n            [ngClass]=\"{'p-dialog-mask': true, 'p-component-overlay': this.modal, 'p-dialog-mask-scrollblocker': this.modal || this.blockScroll,\n                'p-dialog-left': position === 'left',\n                'p-dialog-right': position === 'right',\n                'p-dialog-top': position === 'top',\n                'p-dialog-topleft': position === 'topleft',\n                'p-dialog-topright': position === 'topright',\n                'p-dialog-bottom': position === 'bottom',\n                'p-dialog-bottomleft': position === 'bottomleft',\n                'p-dialog-bottomright': position === 'bottomright'}\">\n            <div #container [ngClass]=\"{'p-dialog p-component':true, 'p-dialog-rtl':rtl,'p-dialog-draggable':draggable,'p-dialog-resizable':resizable, 'p-dialog-maximized': maximized}\"\n                [ngStyle]=\"style\" [class]=\"styleClass\" *ngIf=\"visible\" pFocusTrap [pFocusTrapDisabled]=\"focusTrap === false\"\n                [@animation]=\"{value: 'visible', params: {transform: transformOptions, transition: transitionOptions}}\" (@animation.start)=\"onAnimationStart($event)\" (@animation.done)=\"onAnimationEnd($event)\" role=\"dialog\" [attr.aria-labelledby]=\"id + '-label'\">\n                <div #titlebar class=\"p-dialog-header\" (mousedown)=\"initDrag($event)\" *ngIf=\"showHeader\">\n                    <span [attr.id]=\"id + '-label'\" class=\"p-dialog-title\" *ngIf=\"header\">{{header}}</span>\n                    <span [attr.id]=\"id + '-label'\" class=\"p-dialog-title\" *ngIf=\"headerFacet\">\n                        <ng-content select=\"p-header\"></ng-content>\n                    </span>\n                    <ng-container *ngTemplateOutlet=\"headerTemplate\"></ng-container>\n                    <div class=\"p-dialog-header-icons\">\n                        <button *ngIf=\"maximizable\" type=\"button\" [ngClass]=\"{'p-dialog-header-icon p-dialog-header-maximize p-link':true}\" (click)=\"maximize()\" (keydown.enter)=\"maximize()\" tabindex=\"-1\" pRipple>\n                            <span class=\"p-dialog-header-maximize-icon\" [ngClass]=\"maximized ? minimizeIcon : maximizeIcon\"></span>\n                        </button>\n                        <button *ngIf=\"closable\" type=\"button\" [ngClass]=\"{'p-dialog-header-icon p-dialog-header-close p-link':true}\" (click)=\"close($event)\" (keydown.enter)=\"close($event)\" tabindex=\"-1\" pRipple>\n                            <span class=\"p-dialog-header-close-icon\" [ngClass]=\"closeIcon\"></span>\n                        </button>\n                    </div>\n                </div>\n                <div #content [ngClass]=\"'p-dialog-content'\" [ngStyle]=\"contentStyle\" [class]=\"contentStyleClass\">\n                    <ng-content></ng-content>\n                    <ng-container *ngTemplateOutlet=\"contentTemplate\"></ng-container>\n                </div>\n                <div #footer class=\"p-dialog-footer\" *ngIf=\"footerFacet || footerTemplate\">\n                    <ng-content select=\"p-footer\"></ng-content>\n                    <ng-container *ngTemplateOutlet=\"footerTemplate\"></ng-container>\n                </div>\n                <div *ngIf=\"resizable\" class=\"p-resizable-handle\" style=\"z-index: 90;\" (mousedown)=\"initResize($event)\"></div>\n            </div>\n        </div>\n    ",
                        animations: [
                            animations.trigger('animation', [
                                animations.transition('void => visible', [
                                    animations.useAnimation(showAnimation)
                                ]),
                                animations.transition('visible => void', [
                                    animations.useAnimation(hideAnimation)
                                ])
                            ])
                        ],
                        changeDetection: core.ChangeDetectionStrategy.OnPush,
                        encapsulation: core.ViewEncapsulation.None,
                        styles: [".p-dialog-mask{position:fixed;top:0;left:0;width:100%;height:100%;display:-ms-flexbox;display:flex;-ms-flex-pack:center;justify-content:center;-ms-flex-align:center;align-items:center;pointer-events:none;background-color:transparent;transition-property:background-color}.p-dialog-mask.p-component-overlay{pointer-events:auto}.p-dialog{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;pointer-events:auto;max-height:90%;-ms-transform:scale(1);transform:scale(1);position:relative}.p-dialog-content{overflow-y:auto}.p-dialog-header{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:justify;justify-content:space-between}.p-dialog-title{list-style:outside}.p-dialog .p-dialog-header-icons{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center}.p-dialog .p-dialog-header-icon{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;overflow:hidden;position:relative}.p-dialog-mask.p-dialog-mask-leave{background-color:transparent}.p-fluid .p-dialog-footer .p-button{width:auto}.p-dialog-bottom .p-dialog,.p-dialog-bottomleft .p-dialog,.p-dialog-bottomright .p-dialog,.p-dialog-left .p-dialog,.p-dialog-right .p-dialog,.p-dialog-top .p-dialog,.p-dialog-topleft .p-dialog,.p-dialog-topright .p-dialog{margin:.75rem;transform:translate3d(0,0,0)}.p-dialog-maximized{transition:none;-ms-transform:none;transform:none;width:100vw!important;max-height:100%;height:100%}.p-dialog-maximized .p-dialog-content{-ms-flex-positive:1;flex-grow:1}.p-dialog-left{-ms-flex-pack:start;justify-content:flex-start}.p-dialog-right{-ms-flex-pack:end;justify-content:flex-end}.p-dialog-top{-ms-flex-align:start;align-items:flex-start}.p-dialog-topleft{-ms-flex-pack:start;justify-content:flex-start;-ms-flex-align:start;align-items:flex-start}.p-dialog-topright{-ms-flex-pack:end;justify-content:flex-end;-ms-flex-align:start;align-items:flex-start}.p-dialog-bottom{-ms-flex-align:end;align-items:flex-end}.p-dialog-bottomleft{-ms-flex-pack:start;justify-content:flex-start;-ms-flex-align:end;align-items:flex-end}.p-dialog-bottomright{-ms-flex-pack:end;justify-content:flex-end;-ms-flex-align:end;align-items:flex-end}.p-dialog .p-resizable-handle{position:absolute;font-size:.1px;display:block;cursor:se-resize;width:12px;height:12px;right:1px;bottom:1px}.p-confirm-dialog .p-dialog-content{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center}"]
                    },] }
        ];
        Dialog.ctorParameters = function () { return [
            { type: core.ElementRef },
            { type: core.Renderer2 },
            { type: core.NgZone },
            { type: core.ChangeDetectorRef }
        ]; };
        Dialog.propDecorators = {
            header: [{ type: core.Input }],
            draggable: [{ type: core.Input }],
            resizable: [{ type: core.Input }],
            positionLeft: [{ type: core.Input }],
            positionTop: [{ type: core.Input }],
            contentStyle: [{ type: core.Input }],
            contentStyleClass: [{ type: core.Input }],
            modal: [{ type: core.Input }],
            closeOnEscape: [{ type: core.Input }],
            dismissableMask: [{ type: core.Input }],
            rtl: [{ type: core.Input }],
            closable: [{ type: core.Input }],
            responsive: [{ type: core.Input }],
            appendTo: [{ type: core.Input }],
            styleClass: [{ type: core.Input }],
            maskStyleClass: [{ type: core.Input }],
            showHeader: [{ type: core.Input }],
            breakpoint: [{ type: core.Input }],
            blockScroll: [{ type: core.Input }],
            autoZIndex: [{ type: core.Input }],
            baseZIndex: [{ type: core.Input }],
            minX: [{ type: core.Input }],
            minY: [{ type: core.Input }],
            focusOnShow: [{ type: core.Input }],
            maximizable: [{ type: core.Input }],
            keepInViewport: [{ type: core.Input }],
            focusTrap: [{ type: core.Input }],
            transitionOptions: [{ type: core.Input }],
            closeIcon: [{ type: core.Input }],
            minimizeIcon: [{ type: core.Input }],
            maximizeIcon: [{ type: core.Input }],
            headerFacet: [{ type: core.ContentChild, args: [api.Header,] }],
            footerFacet: [{ type: core.ContentChild, args: [api.Footer,] }],
            templates: [{ type: core.ContentChildren, args: [api.PrimeTemplate,] }],
            headerViewChild: [{ type: core.ViewChild, args: ['titlebar',] }],
            contentViewChild: [{ type: core.ViewChild, args: ['content',] }],
            footerViewChild: [{ type: core.ViewChild, args: ['footer',] }],
            onShow: [{ type: core.Output }],
            onHide: [{ type: core.Output }],
            visibleChange: [{ type: core.Output }],
            onResizeInit: [{ type: core.Output }],
            onResizeEnd: [{ type: core.Output }],
            onDragEnd: [{ type: core.Output }],
            visible: [{ type: core.Input }],
            style: [{ type: core.Input }],
            position: [{ type: core.Input }]
        };
        return Dialog;
    }());
    var DialogModule = /** @class */ (function () {
        function DialogModule() {
        }
        DialogModule.decorators = [
            { type: core.NgModule, args: [{
                        imports: [common.CommonModule, focustrap.FocusTrapModule, ripple.RippleModule],
                        exports: [Dialog, api.SharedModule],
                        declarations: [Dialog]
                    },] }
        ];
        return DialogModule;
    }());

    exports.Dialog = Dialog;
    exports.DialogModule = DialogModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=primeng-dialog.umd.js.map
