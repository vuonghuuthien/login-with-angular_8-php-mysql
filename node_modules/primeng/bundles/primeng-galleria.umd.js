(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('primeng/api'), require('primeng/utils'), require('primeng/dom'), require('primeng/ripple')) :
    typeof define === 'function' && define.amd ? define('primeng/galleria', ['exports', '@angular/core', '@angular/common', 'primeng/api', 'primeng/utils', 'primeng/dom', 'primeng/ripple'], factory) :
    (global = global || self, factory((global.primeng = global.primeng || {}, global.primeng.galleria = {}), global.ng.core, global.ng.common, global.primeng.api, global.primeng.utils, global.primeng.dom, global.primeng.ripple));
}(this, (function (exports, core, common, api, utils, dom, ripple) { 'use strict';

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
    var Galleria = /** @class */ (function () {
        function Galleria(element, cd) {
            this.element = element;
            this.cd = cd;
            this.fullScreen = false;
            this.numVisible = 3;
            this.showItemNavigators = false;
            this.showThumbnailNavigators = true;
            this.showItemNavigatorsOnHover = false;
            this.changeItemOnIndicatorHover = false;
            this.circular = false;
            this.autoPlay = false;
            this.transitionInterval = 4000;
            this.showThumbnails = true;
            this.thumbnailsPosition = "bottom";
            this.verticalThumbnailViewPortHeight = "300px";
            this.showIndicators = false;
            this.showIndicatorsOnItem = false;
            this.indicatorsPosition = "bottom";
            this.baseZIndex = 0;
            this.activeIndexChange = new core.EventEmitter();
            this.visibleChange = new core.EventEmitter();
            this._visible = false;
            this._activeIndex = 0;
        }
        Object.defineProperty(Galleria.prototype, "activeIndex", {
            get: function () {
                return this._activeIndex;
            },
            set: function (activeIndex) {
                this._activeIndex = activeIndex;
            },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(Galleria.prototype, "visible", {
            get: function () {
                return this._visible;
            },
            set: function (visible) {
                this._visible = visible;
            },
            enumerable: false,
            configurable: true
        });
        ;
        Galleria.prototype.ngAfterContentInit = function () {
            var _this = this;
            this.templates.forEach(function (item) {
                switch (item.getType()) {
                    case 'header':
                        _this.headerFacet = item.template;
                        break;
                    case 'footer':
                        _this.footerFacet = item.template;
                        break;
                    case 'indicator':
                        _this.indicatorFacet = item.template;
                        break;
                    case 'caption':
                        _this.captionFacet = item.template;
                        break;
                }
            });
        };
        Galleria.prototype.ngOnChanges = function (simpleChanges) {
            if (this.fullScreen && simpleChanges.visible) {
                if (simpleChanges.visible.currentValue) {
                    dom.DomHandler.addClass(document.body, 'p-overflow-hidden');
                    this.zIndex = String(this.baseZIndex + ++dom.DomHandler.zindex);
                }
                else {
                    dom.DomHandler.removeClass(document.body, 'p-overflow-hidden');
                }
            }
        };
        Galleria.prototype.onMaskHide = function () {
            this.visible = false;
            this.visibleChange.emit(false);
        };
        Galleria.prototype.onActiveItemChange = function (index) {
            if (this.activeIndex !== index) {
                this.activeIndex = index;
                this.activeIndexChange.emit(index);
            }
        };
        Galleria.prototype.ngOnDestroy = function () {
            if (this.fullScreen) {
                dom.DomHandler.removeClass(document.body, 'p-overflow-hidden');
            }
        };
        Galleria.ctorParameters = function () { return [
            { type: core.ElementRef },
            { type: core.ChangeDetectorRef }
        ]; };
        Galleria.decorators = [
            { type: core.Component, args: [{
                        selector: 'p-galleria',
                        template: "\n        <div *ngIf=\"fullScreen;else windowed\">\n            <div *ngIf=\"visible\" #mask [ngClass]=\"{'p-galleria-mask p-component-overlay':true, 'p-galleria-visible': this.visible}\" [class]=\"maskClass\" [ngStyle]=\"{'zIndex':zIndex}\">\n                <p-galleriaContent [value]=\"value\" [activeIndex]=\"activeIndex\" (maskHide)=\"onMaskHide()\" (activeItemChange)=\"onActiveItemChange($event)\" [ngStyle]=\"containerStyle\"></p-galleriaContent>\n            </div>\n        </div>\n\n        <ng-template #windowed>\n            <p-galleriaContent [value]=\"value\" [activeIndex]=\"activeIndex\" (activeItemChange)=\"onActiveItemChange($event)\"></p-galleriaContent>\n        </ng-template>\n    ",
                        changeDetection: core.ChangeDetectionStrategy.OnPush,
                        encapsulation: core.ViewEncapsulation.None,
                        styles: [".p-galleria-content{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column}.p-galleria-item-wrapper{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;position:relative}.p-galleria-item-container{position:relative;display:-ms-flexbox;display:flex;height:100%}.p-galleria-item-nav{position:absolute;top:50%;margin-top:-.5rem;display:-ms-inline-flexbox;display:inline-flex;-ms-flex-pack:center;justify-content:center;-ms-flex-align:center;align-items:center;overflow:hidden}.p-galleria-item-prev{left:0;border-top-left-radius:0;border-bottom-left-radius:0}.p-galleria-item-next{right:0;border-top-right-radius:0;border-bottom-right-radius:0}.p-galleria-item{display:-ms-flexbox;display:flex;-ms-flex-pack:center;justify-content:center;-ms-flex-align:center;align-items:center;height:100%;width:100%}.p-galleria-item-nav-onhover .p-galleria-item-nav{pointer-events:none;opacity:0;transition:opacity .2s ease-in-out}.p-galleria-item-nav-onhover .p-galleria-item-wrapper:hover .p-galleria-item-nav{pointer-events:all;opacity:1}.p-galleria-item-nav-onhover .p-galleria-item-wrapper:hover .p-galleria-item-nav.p-disabled{pointer-events:none}.p-galleria-caption{position:absolute;bottom:0;left:0;width:100%}.p-galleria-thumbnail-wrapper{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;overflow:auto;-ms-flex-negative:0;flex-shrink:0}.p-galleria-thumbnail-next,.p-galleria-thumbnail-prev{-ms-flex-item-align:center;align-self:center;-ms-flex:0 0 auto;flex:0 0 auto;display:-ms-flexbox;display:flex;-ms-flex-pack:center;justify-content:center;-ms-flex-align:center;align-items:center;overflow:hidden;position:relative}.p-galleria-thumbnail-next span,.p-galleria-thumbnail-prev span{display:-ms-flexbox;display:flex;-ms-flex-pack:center;justify-content:center;-ms-flex-align:center;align-items:center}.p-galleria-thumbnail-container{display:-ms-flexbox;display:flex;-ms-flex-direction:row;flex-direction:row}.p-galleria-thumbnail-items-container{overflow:hidden}.p-galleria-thumbnail-items{display:-ms-flexbox;display:flex}.p-galleria-thumbnail-item{overflow:auto;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;cursor:pointer;opacity:.5}.p-galleria-thumbnail-item:hover{opacity:1;transition:opacity .3s}.p-galleria-thumbnail-item-current{opacity:1}.p-galleria-thumbnails-left .p-galleria-content,.p-galleria-thumbnails-left .p-galleria-item-wrapper,.p-galleria-thumbnails-right .p-galleria-content,.p-galleria-thumbnails-right .p-galleria-item-wrapper{-ms-flex-direction:row;flex-direction:row}.p-galleria-thumbnails-left .p-galleria-item-wrapper,.p-galleria-thumbnails-top .p-galleria-item-wrapper{-ms-flex-order:2;order:2}.p-galleria-thumbnails-left .p-galleria-thumbnail-wrapper,.p-galleria-thumbnails-top .p-galleria-thumbnail-wrapper{-ms-flex-order:1;order:1}.p-galleria-thumbnails-left .p-galleria-thumbnail-container,.p-galleria-thumbnails-right .p-galleria-thumbnail-container{-ms-flex-direction:column;flex-direction:column;-ms-flex-positive:1;flex-grow:1}.p-galleria-thumbnails-left .p-galleria-thumbnail-items,.p-galleria-thumbnails-right .p-galleria-thumbnail-items{-ms-flex-direction:column;flex-direction:column;height:100%}.p-galleria-thumbnails-left .p-galleria-thumbnail-wrapper,.p-galleria-thumbnails-right .p-galleria-thumbnail-wrapper{height:100%}.p-galleria-indicators{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center}.p-galleria-indicator>button{display:-ms-inline-flexbox;display:inline-flex;-ms-flex-align:center;align-items:center}.p-galleria-indicators-left .p-galleria-item-wrapper,.p-galleria-indicators-right .p-galleria-item-wrapper{-ms-flex-direction:row;flex-direction:row;-ms-flex-align:center;align-items:center}.p-galleria-indicators-left .p-galleria-item-container,.p-galleria-indicators-top .p-galleria-item-container{-ms-flex-order:2;order:2}.p-galleria-indicators-left .p-galleria-indicators,.p-galleria-indicators-top .p-galleria-indicators{-ms-flex-order:1;order:1}.p-galleria-indicators-left .p-galleria-indicators,.p-galleria-indicators-right .p-galleria-indicators{-ms-flex-direction:column;flex-direction:column}.p-galleria-indicator-onitem .p-galleria-indicators{position:absolute;display:-ms-flexbox;display:flex}.p-galleria-indicator-onitem.p-galleria-indicators-top .p-galleria-indicators{top:0;left:0;width:100%;-ms-flex-align:start;align-items:flex-start}.p-galleria-indicator-onitem.p-galleria-indicators-right .p-galleria-indicators{right:0;top:0;height:100%;-ms-flex-align:end;align-items:flex-end}.p-galleria-indicator-onitem.p-galleria-indicators-bottom .p-galleria-indicators{bottom:0;left:0;width:100%;-ms-flex-align:end;align-items:flex-end}.p-galleria-indicator-onitem.p-galleria-indicators-left .p-galleria-indicators{left:0;top:0;height:100%;-ms-flex-align:start;align-items:flex-start}.p-galleria-mask{position:fixed;top:0;left:0;width:100%;height:100%;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;background-color:transparent;transition-property:background-color}.p-galleria-close{position:absolute;top:0;right:0;display:-ms-flexbox;display:flex;-ms-flex-pack:center;justify-content:center;-ms-flex-align:center;align-items:center;overflow:hidden}.p-galleria-mask .p-galleria-item-nav{position:fixed;top:50%;margin-top:-.5rem}.p-galleria-mask.p-galleria-mask-leave{background-color:transparent}.p-items-hidden .p-galleria-thumbnail-item{visibility:hidden}.p-items-hidden .p-galleria-thumbnail-item.p-galleria-thumbnail-item-active{visibility:visible}"]
                    },] }
        ];
        Galleria.ctorParameters = function () { return [
            { type: core.ElementRef },
            { type: core.ChangeDetectorRef }
        ]; };
        Galleria.propDecorators = {
            activeIndex: [{ type: core.Input }],
            fullScreen: [{ type: core.Input }],
            id: [{ type: core.Input }],
            value: [{ type: core.Input }],
            numVisible: [{ type: core.Input }],
            responsiveOptions: [{ type: core.Input }],
            showItemNavigators: [{ type: core.Input }],
            showThumbnailNavigators: [{ type: core.Input }],
            showItemNavigatorsOnHover: [{ type: core.Input }],
            changeItemOnIndicatorHover: [{ type: core.Input }],
            circular: [{ type: core.Input }],
            autoPlay: [{ type: core.Input }],
            transitionInterval: [{ type: core.Input }],
            showThumbnails: [{ type: core.Input }],
            thumbnailsPosition: [{ type: core.Input }],
            verticalThumbnailViewPortHeight: [{ type: core.Input }],
            showIndicators: [{ type: core.Input }],
            showIndicatorsOnItem: [{ type: core.Input }],
            indicatorsPosition: [{ type: core.Input }],
            baseZIndex: [{ type: core.Input }],
            maskClass: [{ type: core.Input }],
            containerClass: [{ type: core.Input }],
            containerStyle: [{ type: core.Input }],
            mask: [{ type: core.ViewChild, args: ['mask', { static: false },] }],
            visible: [{ type: core.Input }],
            activeIndexChange: [{ type: core.Output }],
            visibleChange: [{ type: core.Output }],
            templates: [{ type: core.ContentChildren, args: [api.PrimeTemplate,] }]
        };
        return Galleria;
    }());
    var GalleriaContent = /** @class */ (function () {
        function GalleriaContent(galleria, cd) {
            this.galleria = galleria;
            this.cd = cd;
            this.value = [];
            this.maskHide = new core.EventEmitter();
            this.activeItemChange = new core.EventEmitter();
            this.id = this.galleria.id || utils.UniqueComponentId();
            this.slideShowActicve = false;
            this._activeIndex = 0;
            this.slideShowActive = true;
        }
        Object.defineProperty(GalleriaContent.prototype, "activeIndex", {
            get: function () {
                return this._activeIndex;
            },
            set: function (activeIndex) {
                this._activeIndex = activeIndex;
            },
            enumerable: false,
            configurable: true
        });
        ;
        GalleriaContent.prototype.galleriaClass = function () {
            var thumbnailsPosClass = this.galleria.showThumbnails && this.getPositionClass('p-galleria-thumbnails', this.galleria.thumbnailsPosition);
            var indicatorPosClass = this.galleria.showIndicators && this.getPositionClass('p-galleria-indicators', this.galleria.indicatorsPosition);
            return (this.galleria.containerClass ? this.galleria.containerClass + " " : '') + (thumbnailsPosClass ? thumbnailsPosClass + " " : '') + (indicatorPosClass ? indicatorPosClass + " " : '');
        };
        GalleriaContent.prototype.startSlideShow = function () {
            var _this = this;
            this.interval = setInterval(function () {
                var activeIndex = (_this.galleria.circular && (_this.value.length - 1) === _this.activeIndex) ? 0 : (_this.activeIndex + 1);
                _this.onActiveIndexChange(activeIndex);
                _this.activeIndex = activeIndex;
            }, this.galleria.transitionInterval);
            this.slideShowActive = true;
        };
        GalleriaContent.prototype.stopSlideShow = function () {
            if (this.interval) {
                clearInterval(this.interval);
            }
            this.slideShowActive = false;
        };
        GalleriaContent.prototype.getPositionClass = function (preClassName, position) {
            var positions = ['top', 'left', 'bottom', 'right'];
            var pos = positions.find(function (item) { return item === position; });
            return pos ? preClassName + "-" + pos : '';
        };
        GalleriaContent.prototype.isVertical = function () {
            return this.galleria.thumbnailsPosition === 'left' || this.galleria.thumbnailsPosition === 'right';
        };
        GalleriaContent.prototype.onActiveIndexChange = function (index) {
            if (this.activeIndex !== index) {
                this.activeIndex = index;
                this.activeItemChange.emit(this.activeIndex);
            }
        };
        GalleriaContent.ctorParameters = function () { return [
            { type: Galleria },
            { type: core.ChangeDetectorRef }
        ]; };
        GalleriaContent.decorators = [
            { type: core.Component, args: [{
                        selector: 'p-galleriaContent',
                        template: "\n        <div [attr.id]=\"id\" *ngIf=\"value && value.length > 0\" [ngClass]=\"{'p-galleria p-component': true, 'p-galleria-fullscreen': this.galleria.fullScreen, \n            'p-galleria-indicator-onitem': this.galleria.showIndicatorsOnItem, 'p-galleria-item-nav-onhover': this.galleria.showItemNavigatorsOnHover && !this.galleria.fullScreen}\"\n            [ngStyle]=\"!galleria.fullScreen ? galleria.containerStyle : {}\" [class]=\"galleriaClass()\">\n            <button *ngIf=\"galleria.fullScreen\" type=\"button\" class=\"p-galleria-close p-link\" (click)=\"maskHide.emit()\" pRipple>\n                <span class=\"p-galleria-close-icon pi pi-times\"></span>\n            </button>\n            <div *ngIf=\"galleria.templates && galleria.headerFacet\" class=\"p-galleria-header\">\n                <p-galleriaItemSlot type=\"header\" [templates]=\"galleria.templates\"></p-galleriaItemSlot>\n            </div>\n            <div class=\"p-galleria-content\">\n                <p-galleriaItem [value]=\"value\" [activeIndex]=\"activeIndex\" [circular]=\"galleria.circular\" [templates]=\"galleria.templates\" (onActiveIndexChange)=\"onActiveIndexChange($event)\" \n                    [showIndicators]=\"galleria.showIndicators\" [changeItemOnIndicatorHover]=\"galleria.changeItemOnIndicatorHover\" [indicatorFacet]=\"galleria.indicatorFacet\"\n                    [captionFacet]=\"galleria.captionFacet\" [showItemNavigators]=\"galleria.showItemNavigators\" [autoPlay]=\"galleria.autoPlay\" [slideShowActive]=\"slideShowActive\"\n                    (startSlideShow)=\"startSlideShow()\" (stopSlideShow)=\"stopSlideShow()\"></p-galleriaItem>\n\n                <p-galleriaThumbnails *ngIf=\"galleria.showThumbnails\" [containerId]=\"id\" [value]=\"value\" (onActiveIndexChange)=\"onActiveIndexChange($event)\" [activeIndex]=\"activeIndex\" [templates]=\"galleria.templates\"\n                    [numVisible]=\"galleria.numVisible\" [responsiveOptions]=\"galleria.responsiveOptions\" [circular]=\"galleria.circular\"\n                    [isVertical]=\"isVertical()\" [contentHeight]=\"galleria.verticalThumbnailViewPortHeight\" [showThumbnailNavigators]=\"galleria.showThumbnailNavigators\"\n                    [slideShowActive]=\"slideShowActive\" (stopSlideShow)=\"stopSlideShow()\"></p-galleriaThumbnails>\n            </div>\n            <div *ngIf=\"galleria.templates && galleria.footerFacet\" class=\"p-galleria-footer\">\n                <p-galleriaItemSlot type=\"footer\" [templates]=\"galleria.templates\"></p-galleriaItemSlot>\n            </div>\n        </div>\n    ",
                        changeDetection: core.ChangeDetectionStrategy.OnPush
                    },] }
        ];
        GalleriaContent.ctorParameters = function () { return [
            { type: Galleria },
            { type: core.ChangeDetectorRef }
        ]; };
        GalleriaContent.propDecorators = {
            activeIndex: [{ type: core.Input }],
            value: [{ type: core.Input }],
            maskHide: [{ type: core.Output }],
            activeItemChange: [{ type: core.Output }]
        };
        return GalleriaContent;
    }());
    var GalleriaItemSlot = /** @class */ (function () {
        function GalleriaItemSlot() {
        }
        Object.defineProperty(GalleriaItemSlot.prototype, "item", {
            get: function () {
                return this._item;
            },
            set: function (item) {
                var _this = this;
                this._item = item;
                if (this.templates) {
                    this.templates.forEach(function (item) {
                        if (item.getType() === _this.type) {
                            switch (_this.type) {
                                case 'item':
                                case 'caption':
                                case 'thumbnail':
                                    _this.context = { $implicit: _this.item };
                                    _this.contentTemplate = item.template;
                                    break;
                            }
                        }
                    });
                }
            },
            enumerable: false,
            configurable: true
        });
        ;
        GalleriaItemSlot.prototype.ngAfterContentInit = function () {
            var _this = this;
            this.templates.forEach(function (item) {
                if (item.getType() === _this.type) {
                    switch (_this.type) {
                        case 'item':
                        case 'caption':
                        case 'thumbnail':
                            _this.context = { $implicit: _this.item };
                            _this.contentTemplate = item.template;
                            break;
                        case 'indicator':
                            _this.context = { $implicit: _this.index };
                            _this.contentTemplate = item.template;
                            break;
                        default:
                            _this.context = {};
                            _this.contentTemplate = item.template;
                            break;
                    }
                }
            });
        };
        GalleriaItemSlot.decorators = [
            { type: core.Component, args: [{
                        selector: 'p-galleriaItemSlot',
                        template: "\n        <ng-container *ngIf=\"contentTemplate\">\n            <ng-container *ngTemplateOutlet=\"contentTemplate; context: context\"></ng-container>\n        </ng-container>\n    ",
                        changeDetection: core.ChangeDetectionStrategy.OnPush
                    },] }
        ];
        GalleriaItemSlot.propDecorators = {
            templates: [{ type: core.Input }],
            index: [{ type: core.Input }],
            item: [{ type: core.Input }],
            type: [{ type: core.Input }]
        };
        return GalleriaItemSlot;
    }());
    var GalleriaItem = /** @class */ (function () {
        function GalleriaItem() {
            this.circular = false;
            this.showItemNavigators = false;
            this.showIndicators = true;
            this.slideShowActive = true;
            this.changeItemOnIndicatorHover = true;
            this.autoPlay = false;
            this.startSlideShow = new core.EventEmitter();
            this.stopSlideShow = new core.EventEmitter();
            this.onActiveIndexChange = new core.EventEmitter();
            this._activeIndex = 0;
        }
        Object.defineProperty(GalleriaItem.prototype, "activeIndex", {
            get: function () {
                return this._activeIndex;
            },
            set: function (activeIndex) {
                this._activeIndex = activeIndex;
                this.activeItem = this.value[this._activeIndex];
            },
            enumerable: false,
            configurable: true
        });
        ;
        GalleriaItem.prototype.ngOnInit = function () {
            if (this.autoPlay) {
                this.startSlideShow.emit();
            }
        };
        GalleriaItem.prototype.next = function () {
            var nextItemIndex = this.activeIndex + 1;
            var activeIndex = this.circular && this.value.length - 1 === this.activeIndex
                ? 0
                : nextItemIndex;
            this.onActiveIndexChange.emit(activeIndex);
        };
        GalleriaItem.prototype.prev = function () {
            var prevItemIndex = this.activeIndex !== 0 ? this.activeIndex - 1 : 0;
            var activeIndex = this.circular && this.activeIndex === 0
                ? this.value.length - 1
                : prevItemIndex;
            this.onActiveIndexChange.emit(activeIndex);
        };
        GalleriaItem.prototype.stopTheSlideShow = function () {
            if (this.slideShowActive && this.stopSlideShow) {
                this.stopSlideShow.emit();
            }
        };
        GalleriaItem.prototype.navForward = function (e) {
            this.stopTheSlideShow();
            this.next();
            if (e && e.cancelable) {
                e.preventDefault();
            }
        };
        GalleriaItem.prototype.navBackward = function (e) {
            this.stopTheSlideShow();
            this.prev();
            if (e && e.cancelable) {
                e.preventDefault();
            }
        };
        GalleriaItem.prototype.onIndicatorClick = function (index) {
            this.stopTheSlideShow();
            this.onActiveIndexChange.emit(index);
        };
        GalleriaItem.prototype.onIndicatorMouseEnter = function (index) {
            if (this.changeItemOnIndicatorHover) {
                this.stopTheSlideShow();
                this.onActiveIndexChange.emit(index);
            }
        };
        GalleriaItem.prototype.onIndicatorKeyDown = function (index) {
            this.stopTheSlideShow();
            this.onActiveIndexChange.emit(index);
        };
        GalleriaItem.prototype.isNavForwardDisabled = function () {
            return !this.circular && this.activeIndex === (this.value.length - 1);
        };
        GalleriaItem.prototype.isNavBackwardDisabled = function () {
            return !this.circular && this.activeIndex === 0;
        };
        GalleriaItem.prototype.isIndicatorItemActive = function (index) {
            return this.activeIndex === index;
        };
        GalleriaItem.decorators = [
            { type: core.Component, args: [{
                        selector: 'p-galleriaItem',
                        template: "\n        <div class=\"p-galleria-item-wrapper\">\n            <div class=\"p-galleria-item-container\">\n                <button *ngIf=\"showItemNavigators\" type=\"button\" [ngClass]=\"{'p-galleria-item-prev p-galleria-item-nav p-link': true, 'p-disabled': this.isNavBackwardDisabled()}\" (click)=\"navBackward($event)\" [disabled]=\"isNavBackwardDisabled()\" pRipple>\n                    <span class=\"p-galleria-item-prev-icon pi pi-chevron-left\"></span>\n                </button>\n                <p-galleriaItemSlot type=\"item\" [item]=\"activeItem\" [templates]=\"templates\" class=\"p-galleria-item\"></p-galleriaItemSlot>\n                <button *ngIf=\"showItemNavigators\" type=\"button\" [ngClass]=\"{'p-galleria-item-next p-galleria-item-nav p-link': true,'p-disabled': this.isNavForwardDisabled()}\" (click)=\"navForward($event)\"  [disabled]=\"isNavForwardDisabled()\" pRipple>\n                    <span class=\"p-galleria-item-next-icon pi pi-chevron-right\"></span>\n                </button>\n                <div class=\"p-galleria-caption\" *ngIf=\"captionFacet\">\n                    <p-galleriaItemSlot type=\"caption\" [item]=\"activeItem\" [templates]=\"templates\"></p-galleriaItemSlot>\n                </div>\n            </div>\n            <ul *ngIf=\"showIndicators\" class=\"p-galleria-indicators p-reset\">\n                <li *ngFor=\"let item of value; let index = index;\" tabindex=\"0\"\n                    (click)=\"onIndicatorClick(index)\" (mouseenter)=\"onIndicatorMouseEnter(index)\" (keydown.enter)=\"onIndicatorKeyDown(index)\"\n                    [ngClass]=\"{'p-galleria-indicator': true,'p-highlight': isIndicatorItemActive(index)}\">\n                    <button type=\"button\" tabIndex=\"-1\" class=\"p-link\" *ngIf=\"!indicatorFacet\">\n                    </button>\n                    <p-galleriaItemSlot type=\"indicator\" [index]=\"index\" [templates]=\"templates\"></p-galleriaItemSlot>\n                </li>\n            </ul>\n        </div>\n    ",
                        changeDetection: core.ChangeDetectionStrategy.OnPush
                    },] }
        ];
        GalleriaItem.propDecorators = {
            circular: [{ type: core.Input }],
            value: [{ type: core.Input }],
            showItemNavigators: [{ type: core.Input }],
            showIndicators: [{ type: core.Input }],
            slideShowActive: [{ type: core.Input }],
            changeItemOnIndicatorHover: [{ type: core.Input }],
            autoPlay: [{ type: core.Input }],
            templates: [{ type: core.Input }],
            indicatorFacet: [{ type: core.Input }],
            captionFacet: [{ type: core.Input }],
            startSlideShow: [{ type: core.Output }],
            stopSlideShow: [{ type: core.Output }],
            onActiveIndexChange: [{ type: core.Output }],
            activeIndex: [{ type: core.Input }]
        };
        return GalleriaItem;
    }());
    var GalleriaThumbnails = /** @class */ (function () {
        function GalleriaThumbnails() {
            this.isVertical = false;
            this.slideShowActive = false;
            this.circular = false;
            this.contentHeight = "300px";
            this.showThumbnailNavigators = true;
            this.onActiveIndexChange = new core.EventEmitter();
            this.stopSlideShow = new core.EventEmitter();
            this.startPos = null;
            this.thumbnailsStyle = null;
            this.sortedResponsiveOptions = null;
            this.totalShiftedItems = 0;
            this.page = 0;
            this._numVisible = 0;
            this.d_numVisible = 0;
            this._oldNumVisible = 0;
            this._activeIndex = 0;
            this._oldactiveIndex = 0;
        }
        Object.defineProperty(GalleriaThumbnails.prototype, "numVisible", {
            get: function () {
                return this._numVisible;
            },
            set: function (numVisible) {
                this._numVisible = numVisible;
                this._oldNumVisible = this.d_numVisible;
                this.d_numVisible = numVisible;
            },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(GalleriaThumbnails.prototype, "activeIndex", {
            get: function () {
                return this._activeIndex;
            },
            set: function (activeIndex) {
                this._oldactiveIndex = this._activeIndex;
                this._activeIndex = activeIndex;
            },
            enumerable: false,
            configurable: true
        });
        ;
        GalleriaThumbnails.prototype.ngOnInit = function () {
            this.createStyle();
            this.calculatePosition();
            if (this.responsiveOptions) {
                this.bindDocumentListeners();
            }
        };
        GalleriaThumbnails.prototype.ngAfterContentChecked = function () {
            var totalShiftedItems = this.totalShiftedItems;
            if ((this._oldNumVisible !== this.d_numVisible || this._oldactiveIndex !== this._activeIndex) && this.itemsContainer) {
                if (this._activeIndex <= this.getMedianItemIndex()) {
                    totalShiftedItems = 0;
                }
                else if (this.value.length - this.d_numVisible + this.getMedianItemIndex() < this._activeIndex) {
                    totalShiftedItems = this.d_numVisible - this.value.length;
                }
                else if (this.value.length - this.d_numVisible < this._activeIndex && this.d_numVisible % 2 === 0) {
                    totalShiftedItems = (this._activeIndex * -1) + this.getMedianItemIndex() + 1;
                }
                else {
                    totalShiftedItems = (this._activeIndex * -1) + this.getMedianItemIndex();
                }
                if (totalShiftedItems !== this.totalShiftedItems) {
                    this.totalShiftedItems = totalShiftedItems;
                }
                if (this.itemsContainer && this.itemsContainer.nativeElement) {
                    this.itemsContainer.nativeElement.style.transform = this.isVertical ? "translate3d(0, " + totalShiftedItems * (100 / this.d_numVisible) + "%, 0)" : "translate3d(" + totalShiftedItems * (100 / this.d_numVisible) + "%, 0, 0)";
                }
                if (this._oldactiveIndex !== this._activeIndex) {
                    dom.DomHandler.removeClass(this.itemsContainer.nativeElement, 'p-items-hidden');
                    this.itemsContainer.nativeElement.style.transition = 'transform 500ms ease 0s';
                }
                this._oldactiveIndex = this._activeIndex;
                this._oldNumVisible = this.d_numVisible;
            }
        };
        GalleriaThumbnails.prototype.createStyle = function () {
            if (!this.thumbnailsStyle) {
                this.thumbnailsStyle = document.createElement('style');
                this.thumbnailsStyle.type = 'text/css';
                document.body.appendChild(this.thumbnailsStyle);
            }
            var innerHTML = "\n            #" + this.containerId + " .p-galleria-thumbnail-item {\n                flex: 1 0 " + (100 / this.d_numVisible) + "%\n            }\n        ";
            if (this.responsiveOptions) {
                this.sortedResponsiveOptions = __spread(this.responsiveOptions);
                this.sortedResponsiveOptions.sort(function (data1, data2) {
                    var value1 = data1.breakpoint;
                    var value2 = data2.breakpoint;
                    var result = null;
                    if (value1 == null && value2 != null)
                        result = -1;
                    else if (value1 != null && value2 == null)
                        result = 1;
                    else if (value1 == null && value2 == null)
                        result = 0;
                    else if (typeof value1 === 'string' && typeof value2 === 'string')
                        result = value1.localeCompare(value2, undefined, { numeric: true });
                    else
                        result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;
                    return -1 * result;
                });
                for (var i = 0; i < this.sortedResponsiveOptions.length; i++) {
                    var res = this.sortedResponsiveOptions[i];
                    innerHTML += "\n                    @media screen and (max-width: " + res.breakpoint + ") {\n                        #" + this.containerId + " .p-galleria-thumbnail-item {\n                            flex: 1 0 " + (100 / res.numVisible) + "%\n                        }\n                    }\n                ";
                }
            }
            this.thumbnailsStyle.innerHTML = innerHTML;
        };
        GalleriaThumbnails.prototype.calculatePosition = function () {
            if (this.itemsContainer && this.sortedResponsiveOptions) {
                var windowWidth = window.innerWidth;
                var matchedResponsiveData = {
                    numVisible: this._numVisible
                };
                for (var i = 0; i < this.sortedResponsiveOptions.length; i++) {
                    var res = this.sortedResponsiveOptions[i];
                    if (parseInt(res.breakpoint, 10) >= windowWidth) {
                        matchedResponsiveData = res;
                    }
                }
                if (this.d_numVisible !== matchedResponsiveData.numVisible) {
                    this.d_numVisible = matchedResponsiveData.numVisible;
                }
            }
        };
        GalleriaThumbnails.prototype.getTabIndex = function (index) {
            return this.isItemActive(index) ? 0 : null;
        };
        GalleriaThumbnails.prototype.navForward = function (e) {
            this.stopTheSlideShow();
            var nextItemIndex = this._activeIndex + 1;
            if (nextItemIndex + this.totalShiftedItems > this.getMedianItemIndex() && ((-1 * this.totalShiftedItems) < this.getTotalPageNumber() - 1 || this.circular)) {
                this.step(-1);
            }
            var activeIndex = this.circular && (this.value.length - 1) === this._activeIndex ? 0 : nextItemIndex;
            this.onActiveIndexChange.emit(activeIndex);
            if (e.cancelable) {
                e.preventDefault();
            }
        };
        GalleriaThumbnails.prototype.navBackward = function (e) {
            this.stopTheSlideShow();
            var prevItemIndex = this._activeIndex !== 0 ? this._activeIndex - 1 : 0;
            var diff = prevItemIndex + this.totalShiftedItems;
            if ((this.d_numVisible - diff - 1) > this.getMedianItemIndex() && ((-1 * this.totalShiftedItems) !== 0 || this.circular)) {
                this.step(1);
            }
            var activeIndex = this.circular && this._activeIndex === 0 ? this.value.length - 1 : prevItemIndex;
            this.onActiveIndexChange.emit(activeIndex);
            if (e.cancelable) {
                e.preventDefault();
            }
        };
        GalleriaThumbnails.prototype.onItemClick = function (index) {
            this.stopTheSlideShow();
            var selectedItemIndex = index;
            if (selectedItemIndex !== this._activeIndex) {
                var diff = selectedItemIndex + this.totalShiftedItems;
                var dir = 0;
                if (selectedItemIndex < this._activeIndex) {
                    dir = (this.d_numVisible - diff - 1) - this.getMedianItemIndex();
                    if (dir > 0 && (-1 * this.totalShiftedItems) !== 0) {
                        this.step(dir);
                    }
                }
                else {
                    dir = this.getMedianItemIndex() - diff;
                    if (dir < 0 && (-1 * this.totalShiftedItems) < this.getTotalPageNumber() - 1) {
                        this.step(dir);
                    }
                }
                this.activeIndex = selectedItemIndex;
                this.onActiveIndexChange.emit(this.activeIndex);
            }
        };
        GalleriaThumbnails.prototype.step = function (dir) {
            var totalShiftedItems = this.totalShiftedItems + dir;
            if (dir < 0 && (-1 * totalShiftedItems) + this.d_numVisible > (this.value.length - 1)) {
                totalShiftedItems = this.d_numVisible - this.value.length;
            }
            else if (dir > 0 && totalShiftedItems > 0) {
                totalShiftedItems = 0;
            }
            if (this.circular) {
                if (dir < 0 && this.value.length - 1 === this._activeIndex) {
                    totalShiftedItems = 0;
                }
                else if (dir > 0 && this._activeIndex === 0) {
                    totalShiftedItems = this.d_numVisible - this.value.length;
                }
            }
            if (this.itemsContainer) {
                dom.DomHandler.removeClass(this.itemsContainer.nativeElement, 'p-items-hidden');
                this.itemsContainer.nativeElement.style.transform = this.isVertical ? "translate3d(0, " + totalShiftedItems * (100 / this.d_numVisible) + "%, 0)" : "translate3d(" + totalShiftedItems * (100 / this.d_numVisible) + "%, 0, 0)";
                this.itemsContainer.nativeElement.style.transition = 'transform 500ms ease 0s';
            }
            this.totalShiftedItems = totalShiftedItems;
        };
        GalleriaThumbnails.prototype.stopTheSlideShow = function () {
            if (this.slideShowActive && this.stopSlideShow) {
                this.stopSlideShow.emit();
            }
        };
        GalleriaThumbnails.prototype.changePageOnTouch = function (e, diff) {
            if (diff < 0) { // left
                this.navForward(e);
            }
            else { // right
                this.navBackward(e);
            }
        };
        GalleriaThumbnails.prototype.getTotalPageNumber = function () {
            return this.value.length > this.d_numVisible ? (this.value.length - this.d_numVisible) + 1 : 0;
        };
        GalleriaThumbnails.prototype.getMedianItemIndex = function () {
            var index = Math.floor(this.d_numVisible / 2);
            return (this.d_numVisible % 2) ? index : index - 1;
        };
        GalleriaThumbnails.prototype.onTransitionEnd = function () {
            if (this.itemsContainer && this.itemsContainer.nativeElement) {
                dom.DomHandler.addClass(this.itemsContainer.nativeElement, 'p-items-hidden');
                this.itemsContainer.nativeElement.style.transition = '';
            }
        };
        GalleriaThumbnails.prototype.onTouchEnd = function (e) {
            var touchobj = e.changedTouches[0];
            if (this.isVertical) {
                this.changePageOnTouch(e, (touchobj.pageY - this.startPos.y));
            }
            else {
                this.changePageOnTouch(e, (touchobj.pageX - this.startPos.x));
            }
        };
        GalleriaThumbnails.prototype.onTouchMove = function (e) {
            if (e.cancelable) {
                e.preventDefault();
            }
        };
        GalleriaThumbnails.prototype.onTouchStart = function (e) {
            var touchobj = e.changedTouches[0];
            this.startPos = {
                x: touchobj.pageX,
                y: touchobj.pageY
            };
        };
        GalleriaThumbnails.prototype.isNavBackwardDisabled = function () {
            return (!this.circular && this._activeIndex === 0) || (this.value.length <= this.d_numVisible);
        };
        GalleriaThumbnails.prototype.isNavForwardDisabled = function () {
            return (!this.circular && this._activeIndex === (this.value.length - 1)) || (this.value.length <= this.d_numVisible);
        };
        GalleriaThumbnails.prototype.firstItemAciveIndex = function () {
            return this.totalShiftedItems * -1;
        };
        GalleriaThumbnails.prototype.lastItemActiveIndex = function () {
            return this.firstItemAciveIndex() + this.d_numVisible - 1;
        };
        GalleriaThumbnails.prototype.isItemActive = function (index) {
            return this.firstItemAciveIndex() <= index && this.lastItemActiveIndex() >= index;
        };
        GalleriaThumbnails.prototype.bindDocumentListeners = function () {
            var _this = this;
            if (!this.documentResizeListener) {
                this.documentResizeListener = function () {
                    _this.calculatePosition();
                };
                window.addEventListener('resize', this.documentResizeListener);
            }
        };
        GalleriaThumbnails.prototype.unbindDocumentListeners = function () {
            if (this.documentResizeListener) {
                window.removeEventListener('resize', this.documentResizeListener);
                this.documentResizeListener = null;
            }
        };
        GalleriaThumbnails.prototype.ngOnDestroy = function () {
            if (this.responsiveOptions) {
                this.unbindDocumentListeners();
            }
            if (this.thumbnailsStyle) {
                this.thumbnailsStyle.parentNode.removeChild(this.thumbnailsStyle);
            }
        };
        GalleriaThumbnails.decorators = [
            { type: core.Component, args: [{
                        selector: 'p-galleriaThumbnails',
                        template: "\n        <div class=\"p-galleria-thumbnail-wrapper\">\n            <div class=\"p-galleria-thumbnail-container\">\n                <button *ngIf=\"showThumbnailNavigators\" type=\"button\" [ngClass]=\"{'p-galleria-thumbnail-prev p-link': true, 'p-disabled': this.isNavBackwardDisabled()}\" (click)=\"navBackward($event)\" [disabled]=\"isNavBackwardDisabled()\" pRipple>\n                    <span [ngClass]=\"{'p-galleria-thumbnail-prev-icon pi': true, 'pi-chevron-left': !this.isVertical, 'pi-chevron-up': this.isVertical}\"></span>\n                </button>\n                <div class=\"p-galleria-thumbnail-items-container\" [ngStyle]=\"{'height': isVertical ? contentHeight : ''}\">\n                    <div #itemsContainer class=\"p-galleria-thumbnail-items\" (transitionend)=\"onTransitionEnd()\"\n                        (touchstart)=\"onTouchStart($event)\" (touchmove)=\"onTouchMove($event)\" (touchend)=\"onTouchEnd($event)\">\n                        <div *ngFor=\"let item of value; let index = index;\" [ngClass]=\"{'p-galleria-thumbnail-item': true, 'p-galleria-thumbnail-item-current': activeIndex === index, 'p-galleria-thumbnail-item-active': isItemActive(index),\n                            'p-galleria-thumbnail-item-start': firstItemAciveIndex() === index, 'p-galleria-thumbnail-item-end': lastItemActiveIndex() === index }\">\n                            <div class=\"p-galleria-thumbnail-item-content\" [attr.tabindex]=\"getTabIndex(index)\" (click)=\"onItemClick(index)\" (keydown.enter)=\"onItemClick(index)\">\n                                <p-galleriaItemSlot type=\"thumbnail\" [item]=\"item\" [templates]=\"templates\"></p-galleriaItemSlot>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n                <button *ngIf=\"showThumbnailNavigators\" type=\"button\" [ngClass]=\"{'p-galleria-thumbnail-next p-link': true, 'p-disabled': this.isNavForwardDisabled()}\" (click)=\"navForward($event)\" [disabled]=\"isNavForwardDisabled()\" pRipple>\n                    <span [ngClass]=\"{'p-galleria-thumbnail-next-icon pi': true, 'pi-chevron-right': !this.isVertical, 'pi-chevron-down': this.isVertical}\"></span>\n                </button>\n            </div>\n        </div>\n    ",
                        changeDetection: core.ChangeDetectionStrategy.OnPush
                    },] }
        ];
        GalleriaThumbnails.propDecorators = {
            containerId: [{ type: core.Input }],
            value: [{ type: core.Input }],
            isVertical: [{ type: core.Input }],
            slideShowActive: [{ type: core.Input }],
            circular: [{ type: core.Input }],
            responsiveOptions: [{ type: core.Input }],
            contentHeight: [{ type: core.Input }],
            showThumbnailNavigators: [{ type: core.Input }],
            templates: [{ type: core.Input }],
            onActiveIndexChange: [{ type: core.Output }],
            stopSlideShow: [{ type: core.Output }],
            itemsContainer: [{ type: core.ViewChild, args: ['itemsContainer',] }],
            numVisible: [{ type: core.Input }],
            activeIndex: [{ type: core.Input }]
        };
        return GalleriaThumbnails;
    }());
    var GalleriaModule = /** @class */ (function () {
        function GalleriaModule() {
        }
        GalleriaModule.decorators = [
            { type: core.NgModule, args: [{
                        imports: [common.CommonModule, api.SharedModule, ripple.RippleModule],
                        exports: [common.CommonModule, Galleria, GalleriaContent, GalleriaItemSlot, GalleriaItem, GalleriaThumbnails, api.SharedModule],
                        declarations: [Galleria, GalleriaContent, GalleriaItemSlot, GalleriaItem, GalleriaThumbnails]
                    },] }
        ];
        return GalleriaModule;
    }());

    exports.Galleria = Galleria;
    exports.GalleriaContent = GalleriaContent;
    exports.GalleriaItem = GalleriaItem;
    exports.GalleriaItemSlot = GalleriaItemSlot;
    exports.GalleriaModule = GalleriaModule;
    exports.GalleriaThumbnails = GalleriaThumbnails;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=primeng-galleria.umd.js.map
