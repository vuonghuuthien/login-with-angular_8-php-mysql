import { Injectable, ElementRef, Component, ChangeDetectionStrategy, ViewEncapsulation, Input, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DomHandler } from 'primeng/dom';
import { Subject } from 'rxjs';

var TerminalService = /** @class */ (function () {
    function TerminalService() {
        this.commandSource = new Subject();
        this.responseSource = new Subject();
        this.commandHandler = this.commandSource.asObservable();
        this.responseHandler = this.responseSource.asObservable();
    }
    TerminalService.prototype.sendCommand = function (command) {
        if (command) {
            this.commandSource.next(command);
        }
    };
    TerminalService.prototype.sendResponse = function (response) {
        if (response) {
            this.responseSource.next(response);
        }
    };
    TerminalService.decorators = [
        { type: Injectable }
    ];
    return TerminalService;
}());

var Terminal = /** @class */ (function () {
    function Terminal(el, terminalService) {
        var _this = this;
        this.el = el;
        this.terminalService = terminalService;
        this.commands = [];
        this.subscription = terminalService.responseHandler.subscribe(function (response) {
            _this.commands[_this.commands.length - 1].response = response;
            _this.commandProcessed = true;
        });
    }
    Terminal.prototype.ngAfterViewInit = function () {
        this.container = DomHandler.find(this.el.nativeElement, '.p-terminal')[0];
    };
    Terminal.prototype.ngAfterViewChecked = function () {
        if (this.commandProcessed) {
            this.container.scrollTop = this.container.scrollHeight;
            this.commandProcessed = false;
        }
    };
    Object.defineProperty(Terminal.prototype, "response", {
        set: function (value) {
            if (value) {
                this.commands[this.commands.length - 1].response = value;
                this.commandProcessed = true;
            }
        },
        enumerable: false,
        configurable: true
    });
    Terminal.prototype.handleCommand = function (event) {
        if (event.keyCode == 13) {
            this.commands.push({ text: this.command });
            this.terminalService.sendCommand(this.command);
            this.command = '';
        }
    };
    Terminal.prototype.focus = function (element) {
        element.focus();
    };
    Terminal.prototype.ngOnDestroy = function () {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    };
    Terminal.ctorParameters = function () { return [
        { type: ElementRef },
        { type: TerminalService }
    ]; };
    Terminal.decorators = [
        { type: Component, args: [{
                    selector: 'p-terminal',
                    template: "\n        <div [ngClass]=\"'p-terminal p-component'\" [ngStyle]=\"style\" [class]=\"styleClass\" (click)=\"focus(in)\">\n            <div *ngIf=\"welcomeMessage\">{{welcomeMessage}}</div>\n            <div class=\"p-terminal-content\">\n                <div *ngFor=\"let command of commands\">\n                    <span class=\"p-terminal-prompt\">{{prompt}}</span>\n                    <span class=\"p-terminal-command\">{{command.text}}</span>\n                    <div class=\"p-terminal-response\">{{command.response}}</div>\n                </div>\n            </div>\n            <div class=\"p-terminal-prompt-container\">\n                <span class=\"p-terminal-content-prompt\">{{prompt}}</span>\n                <input #in type=\"text\" [(ngModel)]=\"command\" class=\"p-terminal-input\" autocomplete=\"off\" (keydown)=\"handleCommand($event)\" autofocus>\n            </div>\n        </div>\n    ",
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    styles: [".p-terminal{height:18rem;overflow:auto}.p-terminal-prompt-container{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center}.p-terminal-input{-ms-flex:1 1 auto;flex:1 1 auto;border:0;background-color:transparent;color:inherit;padding:0;outline:0}.p-terminal-input::-ms-clear{display:none}"]
                },] }
    ];
    Terminal.ctorParameters = function () { return [
        { type: ElementRef },
        { type: TerminalService }
    ]; };
    Terminal.propDecorators = {
        welcomeMessage: [{ type: Input }],
        prompt: [{ type: Input }],
        style: [{ type: Input }],
        styleClass: [{ type: Input }],
        response: [{ type: Input }]
    };
    return Terminal;
}());
var TerminalModule = /** @class */ (function () {
    function TerminalModule() {
    }
    TerminalModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule, FormsModule],
                    exports: [Terminal],
                    declarations: [Terminal]
                },] }
    ];
    return TerminalModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { Terminal, TerminalModule, TerminalService };
//# sourceMappingURL=primeng-terminal.js.map
