import { ElementRef, ChangeDetectorRef, Component, ChangeDetectionStrategy, ViewEncapsulation, Input, ContentChildren, ViewChild, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomHandler } from 'primeng/dom';
import { PrimeTemplate } from 'primeng/api';

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
            this.mask.nativeElement.style.zIndex = String(this.baseZIndex + (++DomHandler.zindex));
        }
    };
    BlockUI.prototype.unblock = function () {
        this.el.nativeElement.appendChild(this.mask.nativeElement);
    };
    BlockUI.prototype.ngOnDestroy = function () {
        this.unblock();
    };
    BlockUI.ctorParameters = function () { return [
        { type: ElementRef },
        { type: ChangeDetectorRef }
    ]; };
    BlockUI.decorators = [
        { type: Component, args: [{
                    selector: 'p-blockUI',
                    template: "\n        <div #mask [class]=\"styleClass\" [ngClass]=\"{'p-blockui-document':!target, 'p-blockui p-component-overlay': true}\" [ngStyle]=\"{display: blocked ? 'flex' : 'none'}\">\n            <ng-content></ng-content>\n            <ng-container *ngTemplateOutlet=\"contentTemplate\"></ng-container>\n        </div>\n    ",
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    styles: [".p-blockui{position:absolute;top:0;left:0;width:100%;height:100%;background-color:transparent;transition-property:background-color;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center}.p-blockui.p-component-overlay{position:absolute}.p-blockui-document.p-component-overlay{position:fixed}.p-blockui-leave.p-component-overlay{background-color:transparent}"]
                },] }
    ];
    BlockUI.ctorParameters = function () { return [
        { type: ElementRef },
        { type: ChangeDetectorRef }
    ]; };
    BlockUI.propDecorators = {
        target: [{ type: Input }],
        autoZIndex: [{ type: Input }],
        baseZIndex: [{ type: Input }],
        styleClass: [{ type: Input }],
        templates: [{ type: ContentChildren, args: [PrimeTemplate,] }],
        mask: [{ type: ViewChild, args: ['mask',] }],
        blocked: [{ type: Input }]
    };
    return BlockUI;
}());
var BlockUIModule = /** @class */ (function () {
    function BlockUIModule() {
    }
    BlockUIModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule],
                    exports: [BlockUI],
                    declarations: [BlockUI]
                },] }
    ];
    return BlockUIModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { BlockUI, BlockUIModule };
//# sourceMappingURL=primeng-blockui.js.map
