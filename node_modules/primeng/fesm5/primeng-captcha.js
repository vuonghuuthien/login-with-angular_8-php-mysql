import { EventEmitter, ElementRef, NgZone, ChangeDetectorRef, Component, ChangeDetectionStrategy, ViewEncapsulation, Input, Output, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

var Captcha = /** @class */ (function () {
    function Captcha(el, _zone, cd) {
        this.el = el;
        this._zone = _zone;
        this.cd = cd;
        this.siteKey = null;
        this.theme = 'light';
        this.type = 'image';
        this.size = 'normal';
        this.tabindex = 0;
        this.language = null;
        this.initCallback = "initRecaptcha";
        this.onResponse = new EventEmitter();
        this.onExpire = new EventEmitter();
        this._instance = null;
    }
    Captcha.prototype.ngAfterViewInit = function () {
        var _this = this;
        if (window.grecaptcha) {
            if (!window.grecaptcha.render) {
                setTimeout(function () {
                    _this.init();
                }, 100);
            }
            else {
                this.init();
            }
        }
        else {
            window[this.initCallback] = function () {
                _this.init();
            };
        }
    };
    Captcha.prototype.init = function () {
        var _this = this;
        this._instance = window.grecaptcha.render(this.el.nativeElement.children[0], {
            'sitekey': this.siteKey,
            'theme': this.theme,
            'type': this.type,
            'size': this.size,
            'tabindex': this.tabindex,
            'hl': this.language,
            'callback': function (response) { _this._zone.run(function () { return _this.recaptchaCallback(response); }); },
            'expired-callback': function () { _this._zone.run(function () { return _this.recaptchaExpiredCallback(); }); }
        });
    };
    Captcha.prototype.reset = function () {
        if (this._instance === null)
            return;
        window.grecaptcha.reset(this._instance);
        this.cd.markForCheck();
    };
    Captcha.prototype.getResponse = function () {
        if (this._instance === null)
            return null;
        return window.grecaptcha.getResponse(this._instance);
    };
    Captcha.prototype.recaptchaCallback = function (response) {
        this.onResponse.emit({
            response: response
        });
    };
    Captcha.prototype.recaptchaExpiredCallback = function () {
        this.onExpire.emit();
    };
    Captcha.prototype.ngOnDestroy = function () {
        if (this._instance != null) {
            window.grecaptcha.reset(this._instance);
        }
    };
    Captcha.ctorParameters = function () { return [
        { type: ElementRef },
        { type: NgZone },
        { type: ChangeDetectorRef }
    ]; };
    Captcha.decorators = [
        { type: Component, args: [{
                    selector: 'p-captcha',
                    template: "<div></div>",
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None
                },] }
    ];
    Captcha.ctorParameters = function () { return [
        { type: ElementRef },
        { type: NgZone },
        { type: ChangeDetectorRef }
    ]; };
    Captcha.propDecorators = {
        siteKey: [{ type: Input }],
        theme: [{ type: Input }],
        type: [{ type: Input }],
        size: [{ type: Input }],
        tabindex: [{ type: Input }],
        language: [{ type: Input }],
        initCallback: [{ type: Input }],
        onResponse: [{ type: Output }],
        onExpire: [{ type: Output }]
    };
    return Captcha;
}());
var CaptchaModule = /** @class */ (function () {
    function CaptchaModule() {
    }
    CaptchaModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule],
                    exports: [Captcha],
                    declarations: [Captcha]
                },] }
    ];
    return CaptchaModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { Captcha, CaptchaModule };
//# sourceMappingURL=primeng-captcha.js.map
