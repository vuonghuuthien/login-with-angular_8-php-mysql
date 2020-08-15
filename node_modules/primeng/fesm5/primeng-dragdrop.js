import { EventEmitter, ElementRef, NgZone, Directive, Input, Output, HostListener, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomHandler } from 'primeng/dom';

var Draggable = /** @class */ (function () {
    function Draggable(el, zone) {
        this.el = el;
        this.zone = zone;
        this.onDragStart = new EventEmitter();
        this.onDragEnd = new EventEmitter();
        this.onDrag = new EventEmitter();
    }
    Object.defineProperty(Draggable.prototype, "pDraggableDisabled", {
        get: function () {
            return this._pDraggableDisabled;
        },
        set: function (_pDraggableDisabled) {
            this._pDraggableDisabled = _pDraggableDisabled;
            if (this._pDraggableDisabled) {
                this.unbindMouseListeners();
            }
            else {
                this.el.nativeElement.draggable = true;
                this.bindMouseListeners();
            }
        },
        enumerable: false,
        configurable: true
    });
    Draggable.prototype.ngAfterViewInit = function () {
        if (!this.pDraggableDisabled) {
            this.el.nativeElement.draggable = true;
            this.bindMouseListeners();
        }
    };
    Draggable.prototype.bindDragListener = function () {
        var _this = this;
        if (!this.dragListener) {
            this.zone.runOutsideAngular(function () {
                _this.dragListener = _this.drag.bind(_this);
                _this.el.nativeElement.addEventListener('drag', _this.dragListener);
            });
        }
    };
    Draggable.prototype.unbindDragListener = function () {
        var _this = this;
        if (this.dragListener) {
            this.zone.runOutsideAngular(function () {
                _this.el.nativeElement.removeEventListener('drag', _this.dragListener);
                _this.dragListener = null;
            });
        }
    };
    Draggable.prototype.bindMouseListeners = function () {
        var _this = this;
        if (!this.mouseDownListener && !this.mouseUpListener) {
            this.zone.runOutsideAngular(function () {
                _this.mouseDownListener = _this.mousedown.bind(_this);
                _this.mouseUpListener = _this.mouseup.bind(_this);
                _this.el.nativeElement.addEventListener('mousedown', _this.mouseDownListener);
                _this.el.nativeElement.addEventListener('mouseup', _this.mouseUpListener);
            });
        }
    };
    Draggable.prototype.unbindMouseListeners = function () {
        var _this = this;
        if (this.mouseDownListener && this.mouseUpListener) {
            this.zone.runOutsideAngular(function () {
                _this.el.nativeElement.removeEventListener('mousedown', _this.mouseDownListener);
                _this.el.nativeElement.removeEventListener('mouseup', _this.mouseUpListener);
                _this.mouseDownListener = null;
                _this.mouseUpListener = null;
            });
        }
    };
    Draggable.prototype.drag = function (event) {
        this.onDrag.emit(event);
    };
    Draggable.prototype.dragStart = function (event) {
        if (this.allowDrag() && !this.pDraggableDisabled) {
            if (this.dragEffect) {
                event.dataTransfer.effectAllowed = this.dragEffect;
            }
            event.dataTransfer.setData('text', this.scope);
            this.onDragStart.emit(event);
            this.bindDragListener();
        }
        else {
            event.preventDefault();
        }
    };
    Draggable.prototype.dragEnd = function (event) {
        this.onDragEnd.emit(event);
        this.unbindDragListener();
    };
    Draggable.prototype.mousedown = function (event) {
        this.handle = event.target;
    };
    Draggable.prototype.mouseup = function (event) {
        this.handle = null;
    };
    Draggable.prototype.allowDrag = function () {
        if (this.dragHandle && this.handle)
            return DomHandler.matches(this.handle, this.dragHandle);
        else
            return true;
    };
    Draggable.prototype.ngOnDestroy = function () {
        this.unbindDragListener();
        this.unbindMouseListeners();
    };
    Draggable.ctorParameters = function () { return [
        { type: ElementRef },
        { type: NgZone }
    ]; };
    Draggable.decorators = [
        { type: Directive, args: [{
                    selector: '[pDraggable]'
                },] }
    ];
    Draggable.ctorParameters = function () { return [
        { type: ElementRef },
        { type: NgZone }
    ]; };
    Draggable.propDecorators = {
        scope: [{ type: Input, args: ['pDraggable',] }],
        dragEffect: [{ type: Input }],
        dragHandle: [{ type: Input }],
        onDragStart: [{ type: Output }],
        onDragEnd: [{ type: Output }],
        onDrag: [{ type: Output }],
        pDraggableDisabled: [{ type: Input }],
        dragStart: [{ type: HostListener, args: ['dragstart', ['$event'],] }],
        dragEnd: [{ type: HostListener, args: ['dragend', ['$event'],] }]
    };
    return Draggable;
}());
var Droppable = /** @class */ (function () {
    function Droppable(el, zone) {
        this.el = el;
        this.zone = zone;
        this.onDragEnter = new EventEmitter();
        this.onDragLeave = new EventEmitter();
        this.onDrop = new EventEmitter();
    }
    Droppable.prototype.ngAfterViewInit = function () {
        if (!this.pDroppableDisabled) {
            this.bindDragOverListener();
        }
    };
    Droppable.prototype.bindDragOverListener = function () {
        var _this = this;
        if (!this.dragOverListener) {
            this.zone.runOutsideAngular(function () {
                _this.dragOverListener = _this.dragOver.bind(_this);
                _this.el.nativeElement.addEventListener('dragover', _this.dragOverListener);
            });
        }
    };
    Droppable.prototype.unbindDragOverListener = function () {
        var _this = this;
        if (this.dragOverListener) {
            this.zone.runOutsideAngular(function () {
                _this.el.nativeElement.removeEventListener('dragover', _this.dragOverListener);
                _this.dragOverListener = null;
            });
        }
    };
    Droppable.prototype.dragOver = function (event) {
        event.preventDefault();
    };
    Droppable.prototype.drop = function (event) {
        if (this.allowDrop(event)) {
            DomHandler.removeClass(this.el.nativeElement, 'p-draggable-enter');
            event.preventDefault();
            this.onDrop.emit(event);
        }
    };
    Droppable.prototype.dragEnter = function (event) {
        event.preventDefault();
        if (this.dropEffect) {
            event.dataTransfer.dropEffect = this.dropEffect;
        }
        DomHandler.addClass(this.el.nativeElement, 'p-draggable-enter');
        this.onDragEnter.emit(event);
    };
    Droppable.prototype.dragLeave = function (event) {
        event.preventDefault();
        DomHandler.removeClass(this.el.nativeElement, 'p-draggable-enter');
        this.onDragLeave.emit(event);
    };
    Droppable.prototype.allowDrop = function (event) {
        var dragScope = event.dataTransfer.getData('text');
        if (typeof (this.scope) == "string" && dragScope == this.scope) {
            return true;
        }
        else if (this.scope instanceof Array) {
            for (var j = 0; j < this.scope.length; j++) {
                if (dragScope == this.scope[j]) {
                    return true;
                }
            }
        }
        return false;
    };
    Droppable.prototype.ngOnDestroy = function () {
        this.unbindDragOverListener();
    };
    Droppable.ctorParameters = function () { return [
        { type: ElementRef },
        { type: NgZone }
    ]; };
    Droppable.decorators = [
        { type: Directive, args: [{
                    selector: '[pDroppable]'
                },] }
    ];
    Droppable.ctorParameters = function () { return [
        { type: ElementRef },
        { type: NgZone }
    ]; };
    Droppable.propDecorators = {
        scope: [{ type: Input, args: ['pDroppable',] }],
        pDroppableDisabled: [{ type: Input }],
        dropEffect: [{ type: Input }],
        onDragEnter: [{ type: Output }],
        onDragLeave: [{ type: Output }],
        onDrop: [{ type: Output }],
        drop: [{ type: HostListener, args: ['drop', ['$event'],] }],
        dragEnter: [{ type: HostListener, args: ['dragenter', ['$event'],] }],
        dragLeave: [{ type: HostListener, args: ['dragleave', ['$event'],] }]
    };
    return Droppable;
}());
var DragDropModule = /** @class */ (function () {
    function DragDropModule() {
    }
    DragDropModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule],
                    exports: [Draggable, Droppable],
                    declarations: [Draggable, Droppable]
                },] }
    ];
    return DragDropModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { DragDropModule, Draggable, Droppable };
//# sourceMappingURL=primeng-dragdrop.js.map
