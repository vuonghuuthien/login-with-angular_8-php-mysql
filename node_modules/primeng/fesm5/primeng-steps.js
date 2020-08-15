import { EventEmitter, Component, ChangeDetectionStrategy, ViewEncapsulation, Input, Output, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

var Steps = /** @class */ (function () {
    function Steps() {
        this.activeIndex = 0;
        this.readonly = true;
        this.activeIndexChange = new EventEmitter();
    }
    Steps.prototype.itemClick = function (event, item, i) {
        if (this.readonly || item.disabled) {
            event.preventDefault();
            return;
        }
        this.activeIndexChange.emit(i);
        if (!item.url) {
            event.preventDefault();
        }
        if (item.command) {
            item.command({
                originalEvent: event,
                item: item,
                index: i
            });
        }
    };
    Steps.decorators = [
        { type: Component, args: [{
                    selector: 'p-steps',
                    template: "\n        <div [ngClass]=\"{'p-steps p-component':true,'p-readonly':readonly}\" [ngStyle]=\"style\" [class]=\"styleClass\">\n            <ul role=\"tablist\">\n                <li *ngFor=\"let item of model; let i = index\" class=\"p-steps-item\" #menuitem [ngStyle]=\"item.style\" [class]=\"item.styleClass\" role=\"tab\" [attr.aria-selected]=\"i === activeIndex\" [attr.aria-expanded]=\"i === activeIndex\"\n                    [ngClass]=\"{'p-highlight p-steps-current':(i === activeIndex), 'p-disabled':(item.disabled || (readonly && (i !== activeIndex)))}\">\n                    <a *ngIf=\"!item.routerLink\" [attr.href]=\"item.url\" class=\"p-menuitem-link\" role=\"presentation\" (click)=\"itemClick($event, item, i)\" (keydown.enter)=\"itemClick($event, item, i)\" [attr.target]=\"item.target\" [attr.id]=\"item.id\" \n                        [attr.tabindex]=\"item.disabled||(i !== activeIndex && readonly) ? null : (item.tabindex ? item.tabindex : '0')\">\n                        <span class=\"p-steps-number\">{{i + 1}}</span>\n                        <span class=\"p-steps-title\">{{item.label}}</span>\n                    </a>\n                    <a *ngIf=\"item.routerLink\" [routerLink]=\"item.routerLink\" [queryParams]=\"item.queryParams\" role=\"presentation\" [routerLinkActive]=\"'p-menuitem-link-active'\" [routerLinkActiveOptions]=\"item.routerLinkActiveOptions||{exact:false}\" class=\"p-menuitem-link\" \n                        (click)=\"itemClick($event, item, i)\" (keydown.enter)=\"itemClick($event, item, i)\" [attr.target]=\"item.target\" [attr.id]=\"item.id\" [attr.tabindex]=\"item.disabled||(i !== activeIndex && readonly) ? null : (item.tabindex ? item.tabindex : '0')\"\n                        [fragment]=\"item.fragment\" [queryParamsHandling]=\"item.queryParamsHandling\" [preserveFragment]=\"item.preserveFragment\" [skipLocationChange]=\"item.skipLocationChange\" [replaceUrl]=\"item.replaceUrl\" [state]=\"item.state\">\n                        <span class=\"p-steps-number\">{{i + 1}}</span>\n                        <span class=\"p-steps-title\">{{item.label}}</span>\n                    </a>\n                </li>\n            </ul>\n        </div>\n    ",
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    styles: [".p-steps{position:relative}.p-steps ul{padding:0;margin:0;list-style-type:none;display:-ms-flexbox;display:flex}.p-steps-item{position:relative;display:-ms-flexbox;display:flex;-ms-flex-pack:center;justify-content:center;-ms-flex:1 1 auto;flex:1 1 auto}.p-steps-item .p-menuitem-link{display:-ms-inline-flexbox;display:inline-flex;-ms-flex-direction:column;flex-direction:column;-ms-flex-align:center;align-items:center;overflow:hidden;text-decoration:none}.p-steps.p-steps-readonly .p-steps-item{cursor:auto}.p-steps-item.p-steps-current .p-menuitem-link{cursor:default}.p-steps-number{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center}.p-steps-title{white-space:nowrap;display:block}"]
                },] }
    ];
    Steps.propDecorators = {
        activeIndex: [{ type: Input }],
        model: [{ type: Input }],
        readonly: [{ type: Input }],
        style: [{ type: Input }],
        styleClass: [{ type: Input }],
        activeIndexChange: [{ type: Output }]
    };
    return Steps;
}());
var StepsModule = /** @class */ (function () {
    function StepsModule() {
    }
    StepsModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule, RouterModule],
                    exports: [Steps, RouterModule],
                    declarations: [Steps]
                },] }
    ];
    return StepsModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { Steps, StepsModule };
//# sourceMappingURL=primeng-steps.js.map
