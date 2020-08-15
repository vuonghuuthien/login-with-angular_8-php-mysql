import { EventEmitter, ElementRef, Component, ChangeDetectionStrategy, ViewEncapsulation, Input, Output, ContentChild, ContentChildren, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Footer, PrimeTemplate, SharedModule } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';
import { trigger, state, style, transition, animate } from '@angular/animations';

var idx = 0;
var Panel = /** @class */ (function () {
    function Panel(el) {
        this.el = el;
        this.collapsed = false;
        this.expandIcon = 'pi pi-plus';
        this.collapseIcon = 'pi pi-minus';
        this.showHeader = true;
        this.toggler = "icon";
        this.collapsedChange = new EventEmitter();
        this.onBeforeToggle = new EventEmitter();
        this.onAfterToggle = new EventEmitter();
        this.transitionOptions = '400ms cubic-bezier(0.86, 0, 0.07, 1)';
        this.id = "p-panel-" + idx++;
    }
    Panel.prototype.ngAfterContentInit = function () {
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
                case 'icons':
                    _this.iconTemplate = item.template;
                    break;
                default:
                    _this.contentTemplate = item.template;
                    break;
            }
        });
    };
    Panel.prototype.onHeaderClick = function (event) {
        if (this.toggler === 'header') {
            this.toggle(event);
        }
    };
    Panel.prototype.onIconClick = function (event) {
        if (this.toggler === 'icon') {
            this.toggle(event);
        }
    };
    Panel.prototype.toggle = function (event) {
        if (this.animating) {
            return false;
        }
        this.animating = true;
        this.onBeforeToggle.emit({ originalEvent: event, collapsed: this.collapsed });
        if (this.toggleable) {
            if (this.collapsed)
                this.expand(event);
            else
                this.collapse(event);
        }
        event.preventDefault();
    };
    Panel.prototype.expand = function (event) {
        this.collapsed = false;
        this.collapsedChange.emit(this.collapsed);
    };
    Panel.prototype.collapse = function (event) {
        this.collapsed = true;
        this.collapsedChange.emit(this.collapsed);
    };
    Panel.prototype.getBlockableElement = function () {
        return this.el.nativeElement.children[0];
    };
    Panel.prototype.onToggleDone = function (event) {
        this.animating = false;
        this.onAfterToggle.emit({ originalEvent: event, collapsed: this.collapsed });
    };
    Panel.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    Panel.decorators = [
        { type: Component, args: [{
                    selector: 'p-panel',
                    template: "\n        <div [attr.id]=\"id\" [ngClass]=\"{'p-panel p-component': true, 'p-panel-toggleable': toggleable}\" [ngStyle]=\"style\" [class]=\"styleClass\">\n            <div class=\"p-panel-header\" *ngIf=\"showHeader\" (click)=\"onHeaderClick($event)\" [attr.id]=\"id + '-titlebar'\">\n                <span class=\"p-panel-title\" *ngIf=\"header\" [attr.id]=\"id + '_header'\">{{header}}</span>\n                <ng-content select=\"p-header\"></ng-content>\n                <ng-container *ngTemplateOutlet=\"headerTemplate\"></ng-container>\n                <div class=\"p-panel-icons\">\n                    <ng-template *ngTemplateOutlet=\"iconTemplate\"></ng-template>\n                    <button *ngIf=\"toggleable\" type=\"button\" [attr.id]=\"id + '-label'\" class=\"p-panel-header-icon p-panel-toggler p-link\" pRipple\n                        (click)=\"onIconClick($event)\" (keydown.enter)=\"onIconClick($event)\" [attr.aria-controls]=\"id + '-content'\" role=\"tab\" [attr.aria-expanded]=\"!collapsed\">\n                        <span [class]=\"collapsed ? expandIcon : collapseIcon\"></span>\n                    </button>\n                </div>\n            </div>\n            <div [attr.id]=\"id + '-content'\" class=\"p-toggleable-content\" [@panelContent]=\"collapsed ? {value: 'hidden', params: {transitionParams: animating ? transitionOptions : '0ms', height: '0', opacity:'0'}} : {value: 'visible', params: {transitionParams: animating ? transitionOptions : '0ms', height: '*', opacity: '1'}}\" (@panelContent.done)=\"onToggleDone($event)\"\n                role=\"region\" [attr.aria-hidden]=\"collapsed\" [attr.aria-labelledby]=\"id  + '-titlebar'\">\n                <div class=\"p-panel-content\">\n                    <ng-content></ng-content>\n                    <ng-container *ngTemplateOutlet=\"contentTemplate\"></ng-container>\n                </div>\n                \n                <div class=\"p-panel-footer\" *ngIf=\"footerFacet || footerTemplate\">\n                    <ng-content select=\"p-footer\"></ng-content>\n                    <ng-container *ngTemplateOutlet=\"footerTemplate\"></ng-container>\n                </div>\n            </div>\n        </div>\n    ",
                    animations: [
                        trigger('panelContent', [
                            state('hidden', style({
                                height: '0',
                                overflow: 'hidden'
                            })),
                            state('void', style({
                                height: '{{height}}'
                            }), { params: { height: '0' } }),
                            state('visible', style({
                                height: '*'
                            })),
                            transition('visible <=> hidden', [style({ overflow: 'hidden' }), animate('{{transitionParams}}')]),
                            transition('void => hidden', animate('{{transitionParams}}')),
                            transition('void => visible', animate('{{transitionParams}}'))
                        ])
                    ],
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    styles: [".p-panel-header{display:-ms-flexbox;display:flex;-ms-flex-pack:justify;justify-content:space-between;-ms-flex-align:center;align-items:center}.p-panel-title{line-height:1}.p-panel-header-icon{display:-ms-inline-flexbox;display:inline-flex;-ms-flex-pack:center;justify-content:center;-ms-flex-align:center;align-items:center;cursor:pointer;text-decoration:none;overflow:hidden;position:relative}"]
                },] }
    ];
    Panel.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    Panel.propDecorators = {
        toggleable: [{ type: Input }],
        header: [{ type: Input }],
        collapsed: [{ type: Input }],
        style: [{ type: Input }],
        styleClass: [{ type: Input }],
        expandIcon: [{ type: Input }],
        collapseIcon: [{ type: Input }],
        showHeader: [{ type: Input }],
        toggler: [{ type: Input }],
        collapsedChange: [{ type: Output }],
        onBeforeToggle: [{ type: Output }],
        onAfterToggle: [{ type: Output }],
        transitionOptions: [{ type: Input }],
        footerFacet: [{ type: ContentChild, args: [Footer,] }],
        templates: [{ type: ContentChildren, args: [PrimeTemplate,] }]
    };
    return Panel;
}());
var PanelModule = /** @class */ (function () {
    function PanelModule() {
    }
    PanelModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule, SharedModule, RippleModule],
                    exports: [Panel, SharedModule],
                    declarations: [Panel]
                },] }
    ];
    return PanelModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { Panel, PanelModule };
//# sourceMappingURL=primeng-panel.js.map
