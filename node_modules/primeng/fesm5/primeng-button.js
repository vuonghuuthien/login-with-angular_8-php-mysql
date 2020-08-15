import { ElementRef, Directive, Input, EventEmitter, Component, ChangeDetectionStrategy, ViewEncapsulation, ContentChildren, Output, NgModule } from '@angular/core';
import { DomHandler } from 'primeng/dom';
import { CommonModule } from '@angular/common';
import { RippleModule } from 'primeng/ripple';
import { PrimeTemplate } from 'primeng/api';

var ButtonDirective = /** @class */ (function () {
    function ButtonDirective(el) {
        this.el = el;
        this.iconPos = 'left';
    }
    ButtonDirective.prototype.ngAfterViewInit = function () {
        this._initialStyleClass = this.el.nativeElement.className;
        DomHandler.addMultipleClasses(this.el.nativeElement, this.getStyleClass());
        if (this.icon) {
            var iconElement = document.createElement("span");
            iconElement.className = 'p-button-icon';
            iconElement.setAttribute("aria-hidden", "true");
            var iconPosClass = this.label ? 'p-button-icon-' + this.iconPos : null;
            if (iconPosClass) {
                DomHandler.addClass(iconElement, iconPosClass);
            }
            DomHandler.addMultipleClasses(iconElement, this.icon);
            this.el.nativeElement.appendChild(iconElement);
        }
        var labelElement = document.createElement("span");
        if (this.icon && !this.label) {
            labelElement.setAttribute('aria-hidden', 'true');
        }
        labelElement.className = 'p-button-label';
        labelElement.appendChild(document.createTextNode(this.label || '&nbsp;'));
        this.el.nativeElement.appendChild(labelElement);
        this.initialized = true;
    };
    ButtonDirective.prototype.getStyleClass = function () {
        var styleClass = 'p-button p-component';
        if (this.icon && !this.label) {
            styleClass = styleClass + ' p-button-icon-only';
        }
        return styleClass;
    };
    ButtonDirective.prototype.setStyleClass = function () {
        var styleClass = this.getStyleClass();
        this.el.nativeElement.className = styleClass + ' ' + this._initialStyleClass;
    };
    Object.defineProperty(ButtonDirective.prototype, "label", {
        get: function () {
            return this._label;
        },
        set: function (val) {
            this._label = val;
            if (this.initialized) {
                DomHandler.findSingle(this.el.nativeElement, '.p-button-label').textContent = this._label || '&nbsp;';
                this.setStyleClass();
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ButtonDirective.prototype, "icon", {
        get: function () {
            return this._icon;
        },
        set: function (val) {
            this._icon = val;
            if (this.initialized) {
                if (this.iconPos)
                    DomHandler.findSingle(this.el.nativeElement, '.p-button-icon').className = 'p-button-icon p-button-icon-' + this.iconPos + ' ' + this._icon;
                else
                    DomHandler.findSingle(this.el.nativeElement, '.p-button-icon').className = 'p-button-icon ' + this._icon;
                this.setStyleClass();
            }
        },
        enumerable: false,
        configurable: true
    });
    ButtonDirective.prototype.ngOnDestroy = function () {
        while (this.el.nativeElement.hasChildNodes()) {
            this.el.nativeElement.removeChild(this.el.nativeElement.lastChild);
        }
        this.initialized = false;
    };
    ButtonDirective.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    ButtonDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[pButton]'
                },] }
    ];
    ButtonDirective.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    ButtonDirective.propDecorators = {
        iconPos: [{ type: Input }],
        label: [{ type: Input }],
        icon: [{ type: Input }]
    };
    return ButtonDirective;
}());
var Button = /** @class */ (function () {
    function Button() {
        this.type = "button";
        this.iconPos = 'left';
        this.onClick = new EventEmitter();
        this.onFocus = new EventEmitter();
        this.onBlur = new EventEmitter();
    }
    Button.prototype.ngAfterContentInit = function () {
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
    Button.decorators = [
        { type: Component, args: [{
                    selector: 'p-button',
                    template: "\n        <button [attr.type]=\"type\" [class]=\"styleClass\" [ngStyle]=\"style\" [disabled]=\"disabled\"\n            [ngClass]=\"{'p-button p-component':true,\n                        'p-button-icon-only': (icon && !label),\n                        'p-button-vertical': (iconPos === 'top' || iconPos === 'bottom') && label}\"\n                        (click)=\"onClick.emit($event)\" (focus)=\"onFocus.emit($event)\" (blur)=\"onBlur.emit($event)\" pRipple>\n            <ng-content></ng-content>\n            <ng-container *ngTemplateOutlet=\"contentTemplate\"></ng-container>\n            <span [ngClass]=\"{'p-button-icon': true,\n                        'p-button-icon-left': iconPos === 'left' && label,\n                        'p-button-icon-right': iconPos === 'right' && label,\n                        'p-button-icon-top': iconPos === 'top' && label,\n                        'p-button-icon-bottom': iconPos === 'bottom' && label}\"\n                        [class]=\"icon\" *ngIf=\"icon\" [attr.aria-hidden]=\"true\"></span>\n            <span class=\"p-button-label\" [attr.aria-hidden]=\"icon && !label\">{{label||'&nbsp;'}}</span>\n            <span [ngClass]=\"'p-badge'\" *ngIf=\"badge\" [class]=\"badgeClass\">{{badge}}</span>\n        </button>\n    ",
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None
                },] }
    ];
    Button.propDecorators = {
        type: [{ type: Input }],
        iconPos: [{ type: Input }],
        icon: [{ type: Input }],
        badge: [{ type: Input }],
        label: [{ type: Input }],
        disabled: [{ type: Input }],
        style: [{ type: Input }],
        styleClass: [{ type: Input }],
        badgeClass: [{ type: Input }],
        templates: [{ type: ContentChildren, args: [PrimeTemplate,] }],
        onClick: [{ type: Output }],
        onFocus: [{ type: Output }],
        onBlur: [{ type: Output }]
    };
    return Button;
}());
var ButtonModule = /** @class */ (function () {
    function ButtonModule() {
    }
    ButtonModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule, RippleModule],
                    exports: [ButtonDirective, Button],
                    declarations: [ButtonDirective, Button]
                },] }
    ];
    return ButtonModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { Button, ButtonDirective, ButtonModule };
//# sourceMappingURL=primeng-button.js.map
