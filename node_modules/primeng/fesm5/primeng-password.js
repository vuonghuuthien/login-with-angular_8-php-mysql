import { ElementRef, NgZone, Directive, Input, HostListener, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomHandler } from 'primeng/dom';

var Password = /** @class */ (function () {
    function Password(el, zone) {
        this.el = el;
        this.zone = zone;
        this.promptLabel = 'Enter a password';
        this.weakLabel = 'Weak';
        this.mediumLabel = 'Medium';
        this.strongLabel = 'Strong';
        this.feedback = true;
    }
    Object.defineProperty(Password.prototype, "showPassword", {
        set: function (show) {
            this.el.nativeElement.type = show ? 'text' : 'password';
        },
        enumerable: false,
        configurable: true
    });
    Password.prototype.ngDoCheck = function () {
        this.updateFilledState();
    };
    Password.prototype.onInput = function (e) {
        this.updateFilledState();
    };
    Password.prototype.updateFilledState = function () {
        this.filled = this.el.nativeElement.value && this.el.nativeElement.value.length;
    };
    Password.prototype.createPanel = function () {
        this.panel = document.createElement('div');
        this.panel.className = 'p-password-panel p-component p-password-panel-overlay p-connected-overlay';
        this.meter = document.createElement('div');
        this.meter.className = 'p-password-meter';
        this.info = document.createElement('div');
        this.info.className = 'p-password-info';
        this.info.textContent = this.promptLabel;
        this.panel.appendChild(this.meter);
        this.panel.appendChild(this.info);
        this.panel.style.minWidth = DomHandler.getOuterWidth(this.el.nativeElement) + 'px';
        document.body.appendChild(this.panel);
    };
    Password.prototype.onFocus = function () {
        var _this = this;
        if (this.feedback) {
            if (!this.panel) {
                this.createPanel();
            }
            this.panel.style.zIndex = String(++DomHandler.zindex);
            this.panel.style.display = 'block';
            this.zone.runOutsideAngular(function () {
                setTimeout(function () {
                    DomHandler.addClass(_this.panel, 'p-connected-overlay-visible');
                }, 1);
            });
            DomHandler.absolutePosition(this.panel, this.el.nativeElement);
        }
    };
    Password.prototype.onBlur = function () {
        var _this = this;
        if (this.feedback) {
            DomHandler.addClass(this.panel, 'p-connected-overlay-hidden');
            DomHandler.removeClass(this.panel, 'p-connected-overlay-visible');
            this.zone.runOutsideAngular(function () {
                setTimeout(function () {
                    _this.ngOnDestroy();
                }, 150);
            });
        }
    };
    Password.prototype.onKeyup = function (e) {
        if (this.feedback) {
            var value = e.target.value, label = null, meterPos = null;
            if (value.length === 0) {
                label = this.promptLabel;
                meterPos = '0px 0px';
            }
            else {
                var score = this.testStrength(value);
                if (score < 30) {
                    label = this.weakLabel;
                    meterPos = '0px -10px';
                }
                else if (score >= 30 && score < 80) {
                    label = this.mediumLabel;
                    meterPos = '0px -20px';
                }
                else if (score >= 80) {
                    label = this.strongLabel;
                    meterPos = '0px -30px';
                }
            }
            this.meter.style.backgroundPosition = meterPos;
            this.info.textContent = label;
        }
    };
    Password.prototype.testStrength = function (str) {
        var grade = 0;
        var val;
        val = str.match('[0-9]');
        grade += this.normalize(val ? val.length : 1 / 4, 1) * 25;
        val = str.match('[a-zA-Z]');
        grade += this.normalize(val ? val.length : 1 / 2, 3) * 10;
        val = str.match('[!@#$%^&*?_~.,;=]');
        grade += this.normalize(val ? val.length : 1 / 6, 1) * 35;
        val = str.match('[A-Z]');
        grade += this.normalize(val ? val.length : 1 / 6, 1) * 30;
        grade *= str.length / 8;
        return grade > 100 ? 100 : grade;
    };
    Password.prototype.normalize = function (x, y) {
        var diff = x - y;
        if (diff <= 0)
            return x / y;
        else
            return 1 + 0.5 * (x / (x + y / 4));
    };
    Object.defineProperty(Password.prototype, "disabled", {
        get: function () {
            return this.el.nativeElement.disabled;
        },
        enumerable: false,
        configurable: true
    });
    Password.prototype.ngOnDestroy = function () {
        if (this.panel) {
            document.body.removeChild(this.panel);
            this.panel = null;
            this.meter = null;
            this.info = null;
        }
    };
    Password.ctorParameters = function () { return [
        { type: ElementRef },
        { type: NgZone }
    ]; };
    Password.decorators = [
        { type: Directive, args: [{
                    selector: '[pPassword]',
                    host: {
                        '[class.p-inputtext]': 'true',
                        '[class.p-component]': 'true',
                        '[class.p-filled]': 'filled'
                    }
                },] }
    ];
    Password.ctorParameters = function () { return [
        { type: ElementRef },
        { type: NgZone }
    ]; };
    Password.propDecorators = {
        promptLabel: [{ type: Input }],
        weakLabel: [{ type: Input }],
        mediumLabel: [{ type: Input }],
        strongLabel: [{ type: Input }],
        feedback: [{ type: Input }],
        showPassword: [{ type: Input }],
        onInput: [{ type: HostListener, args: ['input', ['$event'],] }],
        onFocus: [{ type: HostListener, args: ['focus',] }],
        onBlur: [{ type: HostListener, args: ['blur',] }],
        onKeyup: [{ type: HostListener, args: ['keyup', ['$event'],] }]
    };
    return Password;
}());
var PasswordModule = /** @class */ (function () {
    function PasswordModule() {
    }
    PasswordModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule],
                    exports: [Password],
                    declarations: [Password]
                },] }
    ];
    return PasswordModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { Password, PasswordModule };
//# sourceMappingURL=primeng-password.js.map
