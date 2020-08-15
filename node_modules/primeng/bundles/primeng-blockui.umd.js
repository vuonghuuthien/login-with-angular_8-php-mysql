(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('primeng/dom'), require('primeng/api')) :
    typeof define === 'function' && define.amd ? define('primeng/blockui', ['exports', '@angular/core', '@angular/common', 'primeng/dom', 'primeng/api'], factory) :
    (global = global || self, factory((global.primeng = global.primeng || {}, global.primeng.blockui = {}), global.ng.core, global.ng.common, global.primeng.dom, global.primeng.api));
}(this, (function (exports, core, common, dom, api) { 'use strict';

    var BlockUI = /** @class */ (function () {
        function BlockUI(el, cd) {
            this.el = el;
            this.cd = cd;
            this.autoZIndex = true;
            this.baseZIndex = 0;
        }
        Object.defineProperty(BlockUI.prototype, "blocked", {
            get: function () {
                return this._blocked;
            },
            set: function (val) {
                this._blocked = val;
                if (this.mask && this.mask.nativeElement) {
                    if (this._blocked)
                        this.block();
                    else
                        this.unblock();
                }
            },
            enumerable: false,
            configurable: true
        });
        BlockUI.prototype.ngAfterViewInit = function () {
            if (this.target && !this.target.getBlockableElement) {
                throw 'Target of BlockUI must implement BlockableUI interface';
            }
        };
        BlockUI.prototype.ngAfterContentInit = function () {
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
        };
        BlockUI.prototype.block = function () {
            if (this.target) {
                this.target.getBlockableElement().appendChild(this.mask.nativeElement);
                this.target.getBlockableElement().style.position = 'relative';
            }
            else {
                document.body.appendChild(this.mask.nativeElement);
            }
            if (this.autoZIndex) {
                this.mask.nativeElement.style.zIndex = String(this.baseZIndex + (++dom.DomHandler.zindex));
            }
        };
        BlockUI.prototype.unblock = function () {
            this.el.nativeElement.appendChild(this.mask.nativeElement);
        };
        BlockUI.prototype.ngOnDestroy = function () {
            this.unblock();
        };
        BlockUI.ctorParameters = function () { return [
            { type: core.ElementRef },
            { type: core.ChangeDetectorRef }
        ]; };
        BlockUI.decorators = [
            { type: core.Component, args: [{
                        selector: 'p-blockUI',
                        template: "\n        <div #mask [class]=\"styleClass\" [ngClass]=\"{'p-blockui-document':!target, 'p-blockui p-component-overlay': true}\" [ngStyle]=\"{display: blocked ? 'flex' : 'none'}\">\n            <ng-content></ng-content>\n            <ng-container *ngTemplateOutlet=\"contentTemplate\"></ng-container>\n        </div>\n    ",
                        changeDetection: core.ChangeDetectionStrategy.OnPush,
                        encapsulation: core.ViewEncapsulation.None,
                        styles: [".p-blockui{position:absolute;top:0;left:0;width:100%;height:100%;background-color:transparent;transition-property:background-color;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center}.p-blockui.p-component-overlay{position:absolute}.p-blockui-document.p-component-overlay{position:fixed}.p-blockui-leave.p-component-overlay{background-color:transparent}"]
                    },] }
        ];
        BlockUI.ctorParameters = function () { return [
            { type: core.ElementRef },
            { type: core.ChangeDetectorRef }
        ]; };
        BlockUI.propDecorators = {
            target: [{ type: core.Input }],
            autoZIndex: [{ type: core.Input }],
            baseZIndex: [{ type: core.Input }],
            styleClass: [{ type: core.Input }],
            templates: [{ type: core.ContentChildren, args: [api.PrimeTemplate,] }],
            mask: [{ type: core.ViewChild, args: ['mask',] }],
            blocked: [{ type: core.Input }]
        };
        return BlockUI;
    }());
    var BlockUIModule = /** @class */ (function () {
        function BlockUIModule() {
        }
        BlockUIModule.decorators = [
            { type: core.NgModule, args: [{
                        imports: [common.CommonModule],
                        exports: [BlockUI],
                        declarations: [BlockUI]
                    },] }
        ];
        return BlockUIModule;
    }());

    exports.BlockUI = BlockUI;
    exports.BlockUIModule = BlockUIModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=primeng-blockui.umd.js.map
