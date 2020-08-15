(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common')) :
    typeof define === 'function' && define.amd ? define('primeng/gmap', ['exports', '@angular/core', '@angular/common'], factory) :
    (global = global || self, factory((global.primeng = global.primeng || {}, global.primeng.gmap = {}), global.ng.core, global.ng.common));
}(this, (function (exports, core, common) { 'use strict';

    var __values = (this && this.__values) || function(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    };
    var GMap = /** @class */ (function () {
        function GMap(el, differs, cd, zone) {
            this.el = el;
            this.cd = cd;
            this.zone = zone;
            this.onMapClick = new core.EventEmitter();
            this.onOverlayClick = new core.EventEmitter();
            this.onOverlayDblClick = new core.EventEmitter();
            this.onOverlayDragStart = new core.EventEmitter();
            this.onOverlayDrag = new core.EventEmitter();
            this.onOverlayDragEnd = new core.EventEmitter();
            this.onMapReady = new core.EventEmitter();
            this.onMapDragEnd = new core.EventEmitter();
            this.onZoomChanged = new core.EventEmitter();
            this.differ = differs.find([]).create(null);
        }
        GMap.prototype.ngAfterViewChecked = function () {
            if (!this.map && this.el.nativeElement.offsetParent) {
                this.initialize();
            }
        };
        GMap.prototype.initialize = function () {
            var e_1, _a;
            var _this = this;
            this.map = new google.maps.Map(this.el.nativeElement.children[0], this.options);
            this.onMapReady.emit({
                map: this.map
            });
            if (this.overlays) {
                try {
                    for (var _b = __values(this.overlays), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var overlay = _c.value;
                        overlay.setMap(this.map);
                        this.bindOverlayEvents(overlay);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            this.map.addListener('click', function (event) {
                _this.zone.run(function () {
                    _this.onMapClick.emit(event);
                });
            });
            this.map.addListener('dragend', function (event) {
                _this.zone.run(function () {
                    _this.onMapDragEnd.emit(event);
                });
            });
            this.map.addListener('zoom_changed', function (event) {
                _this.zone.run(function () {
                    _this.onZoomChanged.emit(event);
                });
            });
        };
        GMap.prototype.bindOverlayEvents = function (overlay) {
            var _this = this;
            overlay.addListener('click', function (event) {
                _this.zone.run(function () {
                    _this.onOverlayClick.emit({
                        originalEvent: event,
                        'overlay': overlay,
                        map: _this.map
                    });
                });
            });
            overlay.addListener('dblclick', function (event) {
                _this.zone.run(function () {
                    _this.onOverlayDblClick.emit({
                        originalEvent: event,
                        'overlay': overlay,
                        map: _this.map
                    });
                });
            });
            if (overlay.getDraggable()) {
                this.bindDragEvents(overlay);
            }
        };
        GMap.prototype.ngDoCheck = function () {
            var _this = this;
            var changes = this.differ.diff(this.overlays);
            if (changes && this.map) {
                changes.forEachRemovedItem(function (record) {
                    google.maps.event.clearInstanceListeners(record.item);
                    record.item.setMap(null);
                });
                changes.forEachAddedItem(function (record) {
                    record.item.setMap(_this.map);
                    record.item.addListener('click', function (event) {
                        _this.zone.run(function () {
                            _this.onOverlayClick.emit({
                                originalEvent: event,
                                overlay: record.item,
                                map: _this.map
                            });
                        });
                    });
                    if (record.item.getDraggable()) {
                        _this.bindDragEvents(record.item);
                    }
                });
            }
        };
        GMap.prototype.bindDragEvents = function (overlay) {
            var _this = this;
            overlay.addListener('dragstart', function (event) {
                _this.zone.run(function () {
                    _this.onOverlayDragStart.emit({
                        originalEvent: event,
                        overlay: overlay,
                        map: _this.map
                    });
                });
            });
            overlay.addListener('drag', function (event) {
                _this.zone.run(function () {
                    _this.onOverlayDrag.emit({
                        originalEvent: event,
                        overlay: overlay,
                        map: _this.map
                    });
                });
            });
            overlay.addListener('dragend', function (event) {
                _this.zone.run(function () {
                    _this.onOverlayDragEnd.emit({
                        originalEvent: event,
                        overlay: overlay,
                        map: _this.map
                    });
                });
            });
        };
        GMap.prototype.getMap = function () {
            return this.map;
        };
        GMap.ctorParameters = function () { return [
            { type: core.ElementRef },
            { type: core.IterableDiffers },
            { type: core.ChangeDetectorRef },
            { type: core.NgZone }
        ]; };
        GMap.decorators = [
            { type: core.Component, args: [{
                        selector: 'p-gmap',
                        template: "<div [ngStyle]=\"style\" [class]=\"styleClass\"></div>",
                        changeDetection: core.ChangeDetectionStrategy.OnPush,
                        encapsulation: core.ViewEncapsulation.None
                    },] }
        ];
        GMap.ctorParameters = function () { return [
            { type: core.ElementRef },
            { type: core.IterableDiffers },
            { type: core.ChangeDetectorRef },
            { type: core.NgZone }
        ]; };
        GMap.propDecorators = {
            style: [{ type: core.Input }],
            styleClass: [{ type: core.Input }],
            options: [{ type: core.Input }],
            overlays: [{ type: core.Input }],
            onMapClick: [{ type: core.Output }],
            onOverlayClick: [{ type: core.Output }],
            onOverlayDblClick: [{ type: core.Output }],
            onOverlayDragStart: [{ type: core.Output }],
            onOverlayDrag: [{ type: core.Output }],
            onOverlayDragEnd: [{ type: core.Output }],
            onMapReady: [{ type: core.Output }],
            onMapDragEnd: [{ type: core.Output }],
            onZoomChanged: [{ type: core.Output }]
        };
        return GMap;
    }());
    var GMapModule = /** @class */ (function () {
        function GMapModule() {
        }
        GMapModule.decorators = [
            { type: core.NgModule, args: [{
                        imports: [common.CommonModule],
                        exports: [GMap],
                        declarations: [GMap]
                    },] }
        ];
        return GMapModule;
    }());

    exports.GMap = GMap;
    exports.GMapModule = GMapModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=primeng-gmap.umd.js.map
