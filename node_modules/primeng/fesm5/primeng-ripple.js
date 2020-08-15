import { ElementRef, NgZone, Optional, Directive, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomHandler } from 'primeng/dom';
import { PrimeNGConfig } from 'primeng/api';

var Ripple = /** @class */ (function () {
    function Ripple(el, zone, config) {
        this.el = el;
        this.zone = zone;
        this.config = config;
    }
    Ripple.prototype.ngAfterViewInit = function () {
        var _this = this;
        if (this.config && this.config.ripple) {
            this.zone.runOutsideAngular(function () {
                _this.create();
                _this.mouseDownListener = _this.onMouseDown.bind(_this);
                _this.el.nativeElement.addEventListener('mousedown', _this.mouseDownListener);
            });
        }
    };
    Ripple.prototype.onMouseDown = function (event) {
        var ink = this.getInk();
        if (!ink || getComputedStyle(ink, null).display === 'none') {
            return;
        }
        DomHandler.removeClass(ink, 'p-ink-active');
        if (!DomHandler.getHeight(ink) && !DomHandler.getWidth(ink)) {
            var d = Math.max(DomHandler.getOuterWidth(this.el.nativeElement), DomHandler.getOuterHeight(this.el.nativeElement));
            ink.style.height = d + 'px';
            ink.style.width = d + 'px';
        }
        var offset = DomHandler.getOffset(this.el.nativeElement);
        var x = event.pageX - offset.left + document.body.scrollTop - DomHandler.getWidth(ink) / 2;
        var y = event.pageY - offset.top + document.body.scrollLeft - DomHandler.getHeight(ink) / 2;
        ink.style.top = y + 'px';
        ink.style.left = x + 'px';
        DomHandler.addClass(ink, 'p-ink-active');
    };
    Ripple.prototype.getInk = function () {
        for (var i = 0; i < this.el.nativeElement.children.length; i++) {
            if (this.el.nativeElement.children[i].className.indexOf('p-ink') !== -1) {
                return this.el.nativeElement.children[i];
            }
        }
        return null;
    };
    Ripple.prototype.resetInk = function () {
        var ink = this.getInk();
        if (ink) {
            DomHandler.removeClass(ink, 'p-ink-active');
        }
    };
    Ripple.prototype.onAnimationEnd = function (event) {
        DomHandler.removeClass(event.currentTarget, 'p-ink-active');
    };
    Ripple.prototype.create = function () {
        var ink = document.createElement('span');
        ink.className = 'p-ink';
        this.el.nativeElement.appendChild(ink);
        this.animationListener = this.onAnimationEnd.bind(this);
        ink.addEventListener('animationend', this.animationListener);
    };
    Ripple.prototype.remove = function () {
        var ink = this.getInk();
        if (ink) {
            this.el.nativeElement.removeEventListener('mousedown', this.mouseDownListener);
            ink.removeEventListener('animationend', this.animationListener);
            ink.remove();
        }
    };
    Ripple.prototype.ngOnDestroy = function () {
        if (this.config && this.config.ripple) {
            this.remove();
        }
    };
    Ripple.ctorParameters = function () { return [
        { type: ElementRef },
        { type: NgZone },
        { type: PrimeNGConfig, decorators: [{ type: Optional }] }
    ]; };
    Ripple.decorators = [
        { type: Directive, args: [{
                    selector: '[pRipple]',
                    host: {
                        '[class.p-ripple]': 'true'
                    }
                },] }
    ];
    Ripple.ctorParameters = function () { return [
        { type: ElementRef },
        { type: NgZone },
        { type: PrimeNGConfig, decorators: [{ type: Optional }] }
    ]; };
    return Ripple;
}());
var RippleModule = /** @class */ (function () {
    function RippleModule() {
    }
    RippleModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule],
                    exports: [Ripple],
                    declarations: [Ripple]
                },] }
    ];
    return RippleModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { Ripple, RippleModule };
//# sourceMappingURL=primeng-ripple.js.map
