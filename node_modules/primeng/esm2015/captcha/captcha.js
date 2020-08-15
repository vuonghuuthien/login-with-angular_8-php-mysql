import { NgModule, AfterViewInit, Component, EventEmitter, Input, NgZone, OnDestroy, Output, ElementRef, ChangeDetectionStrategy, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
export class Captcha {
    constructor(el, _zone, cd) {
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
    ngAfterViewInit() {
        if (window.grecaptcha) {
            if (!window.grecaptcha.render) {
                setTimeout(() => {
                    this.init();
                }, 100);
            }
            else {
                this.init();
            }
        }
        else {
            window[this.initCallback] = () => {
                this.init();
            };
        }
    }
    init() {
        this._instance = window.grecaptcha.render(this.el.nativeElement.children[0], {
            'sitekey': this.siteKey,
            'theme': this.theme,
            'type': this.type,
            'size': this.size,
            'tabindex': this.tabindex,
            'hl': this.language,
            'callback': (response) => { this._zone.run(() => this.recaptchaCallback(response)); },
            'expired-callback': () => { this._zone.run(() => this.recaptchaExpiredCallback()); }
        });
    }
    reset() {
        if (this._instance === null)
            return;
        window.grecaptcha.reset(this._instance);
        this.cd.markForCheck();
    }
    getResponse() {
        if (this._instance === null)
            return null;
        return window.grecaptcha.getResponse(this._instance);
    }
    recaptchaCallback(response) {
        this.onResponse.emit({
            response: response
        });
    }
    recaptchaExpiredCallback() {
        this.onExpire.emit();
    }
    ngOnDestroy() {
        if (this._instance != null) {
            window.grecaptcha.reset(this._instance);
        }
    }
}
Captcha.ctorParameters = () => [
    { type: ElementRef },
    { type: NgZone },
    { type: ChangeDetectorRef }
];
Captcha.decorators = [
    { type: Component, args: [{
                selector: 'p-captcha',
                template: `<div></div>`,
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None
            },] }
];
Captcha.ctorParameters = () => [
    { type: ElementRef },
    { type: NgZone },
    { type: ChangeDetectorRef }
];
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
export class CaptchaModule {
}
CaptchaModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule],
                exports: [Captcha],
                declarations: [Captcha]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FwdGNoYS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL3ByaW1lbmcvY2FwdGNoYS8iLCJzb3VyY2VzIjpbImNhcHRjaGEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFFBQVEsRUFBQyxhQUFhLEVBQUMsU0FBUyxFQUFDLFlBQVksRUFBQyxLQUFLLEVBQUMsTUFBTSxFQUFDLFNBQVMsRUFBQyxNQUFNLEVBQUMsVUFBVSxFQUFDLHVCQUF1QixFQUFFLGlCQUFpQixFQUFFLGlCQUFpQixFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ25MLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQVE3QyxNQUFNLE9BQU8sT0FBTztJQXNCaEIsWUFBbUIsRUFBYyxFQUFTLEtBQWEsRUFBUyxFQUFxQjtRQUFsRSxPQUFFLEdBQUYsRUFBRSxDQUFZO1FBQVMsVUFBSyxHQUFMLEtBQUssQ0FBUTtRQUFTLE9BQUUsR0FBRixFQUFFLENBQW1CO1FBcEI1RSxZQUFPLEdBQVcsSUFBSSxDQUFDO1FBRXZCLFVBQUssR0FBRyxPQUFPLENBQUM7UUFFaEIsU0FBSSxHQUFHLE9BQU8sQ0FBQztRQUVmLFNBQUksR0FBRyxRQUFRLENBQUM7UUFFaEIsYUFBUSxHQUFHLENBQUMsQ0FBQztRQUViLGFBQVEsR0FBVyxJQUFJLENBQUM7UUFFeEIsaUJBQVksR0FBRyxlQUFlLENBQUM7UUFFOUIsZUFBVSxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBRW5ELGFBQVEsR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUVuRCxjQUFTLEdBQVEsSUFBSSxDQUFDO0lBRTBELENBQUM7SUFFekYsZUFBZTtRQUNYLElBQVUsTUFBTyxDQUFDLFVBQVUsRUFBRTtZQUMxQixJQUFJLENBQU8sTUFBTyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUM7Z0JBQ2pDLFVBQVUsQ0FBQyxHQUFHLEVBQUU7b0JBQ1osSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNoQixDQUFDLEVBQUMsR0FBRyxDQUFDLENBQUE7YUFDVDtpQkFDSTtnQkFDRCxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7YUFDZjtTQUNKO2FBQ0k7WUFDSyxNQUFPLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLEdBQUcsRUFBRTtnQkFDdEMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2QsQ0FBQyxDQUFBO1NBQ0o7SUFDTCxDQUFDO0lBRUQsSUFBSTtRQUNBLElBQUksQ0FBQyxTQUFTLEdBQVMsTUFBTyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ2hGLFNBQVMsRUFBRSxJQUFJLENBQUMsT0FBTztZQUN2QixPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUs7WUFDbkIsTUFBTSxFQUFFLElBQUksQ0FBQyxJQUFJO1lBQ2pCLE1BQU0sRUFBRSxJQUFJLENBQUMsSUFBSTtZQUNqQixVQUFVLEVBQUUsSUFBSSxDQUFDLFFBQVE7WUFDekIsSUFBSSxFQUFFLElBQUksQ0FBQyxRQUFRO1lBQ25CLFVBQVUsRUFBRSxDQUFDLFFBQWdCLEVBQUUsRUFBRSxHQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFBLENBQUEsQ0FBQztZQUMxRixrQkFBa0IsRUFBRSxHQUFHLEVBQUUsR0FBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsd0JBQXdCLEVBQUUsQ0FBQyxDQUFBLENBQUEsQ0FBQztTQUNwRixDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsS0FBSztRQUNELElBQUksSUFBSSxDQUFDLFNBQVMsS0FBSyxJQUFJO1lBQ3ZCLE9BQU87UUFFTCxNQUFPLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDL0MsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUMzQixDQUFDO0lBRUQsV0FBVztRQUNQLElBQUksSUFBSSxDQUFDLFNBQVMsS0FBSyxJQUFJO1lBQ3ZCLE9BQU8sSUFBSSxDQUFDO1FBRWhCLE9BQWEsTUFBTyxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ2hFLENBQUM7SUFFRCxpQkFBaUIsQ0FBQyxRQUFnQjtRQUM5QixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQztZQUNqQixRQUFRLEVBQUUsUUFBUTtTQUNyQixDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsd0JBQXdCO1FBQ3BCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDekIsQ0FBQztJQUVELFdBQVc7UUFDUCxJQUFJLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxFQUFFO1lBQ3BCLE1BQU8sQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUNoRDtJQUNMLENBQUM7OztZQTlEc0IsVUFBVTtZQUFnQixNQUFNO1lBQWEsaUJBQWlCOzs7WUE1QnhGLFNBQVMsU0FBQztnQkFDUCxRQUFRLEVBQUUsV0FBVztnQkFDckIsUUFBUSxFQUFFLGFBQWE7Z0JBQ3ZCLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2dCQUMvQyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTthQUN4Qzs7O1lBUm1GLFVBQVU7WUFBbEMsTUFBTTtZQUF5RSxpQkFBaUI7OztzQkFXdkosS0FBSztvQkFFTCxLQUFLO21CQUVMLEtBQUs7bUJBRUwsS0FBSzt1QkFFTCxLQUFLO3VCQUVMLEtBQUs7MkJBRUwsS0FBSzt5QkFFTCxNQUFNO3VCQUVOLE1BQU07O0FBMEVYLE1BQU0sT0FBTyxhQUFhOzs7WUFMekIsUUFBUSxTQUFDO2dCQUNOLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQztnQkFDdkIsT0FBTyxFQUFFLENBQUMsT0FBTyxDQUFDO2dCQUNsQixZQUFZLEVBQUUsQ0FBQyxPQUFPLENBQUM7YUFDMUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge05nTW9kdWxlLEFmdGVyVmlld0luaXQsQ29tcG9uZW50LEV2ZW50RW1pdHRlcixJbnB1dCxOZ1pvbmUsT25EZXN0cm95LE91dHB1dCxFbGVtZW50UmVmLENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBWaWV3RW5jYXBzdWxhdGlvbiwgQ2hhbmdlRGV0ZWN0b3JSZWZ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAncC1jYXB0Y2hhJyxcbiAgICB0ZW1wbGF0ZTogYDxkaXY+PC9kaXY+YCxcbiAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lXG59KVxuZXhwb3J0IGNsYXNzIENhcHRjaGEgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LE9uRGVzdHJveSB7XG5cbiAgICBASW5wdXQoKSBzaXRlS2V5OiBzdHJpbmcgPSBudWxsO1xuICAgICAgICBcbiAgICBASW5wdXQoKSB0aGVtZSA9ICdsaWdodCc7XG4gICAgXG4gICAgQElucHV0KCkgdHlwZSA9ICdpbWFnZSc7XG4gICAgXG4gICAgQElucHV0KCkgc2l6ZSA9ICdub3JtYWwnO1xuICAgIFxuICAgIEBJbnB1dCgpIHRhYmluZGV4ID0gMDtcbiAgICBcbiAgICBASW5wdXQoKSBsYW5ndWFnZTogc3RyaW5nID0gbnVsbDtcbiAgICAgXG4gICAgQElucHV0KCkgaW5pdENhbGxiYWNrID0gXCJpbml0UmVjYXB0Y2hhXCI7XG4gICAgXG4gICAgQE91dHB1dCgpIG9uUmVzcG9uc2U6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgIFxuICAgIEBPdXRwdXQoKSBvbkV4cGlyZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgXG4gICAgcHJpdmF0ZSBfaW5zdGFuY2U6IGFueSA9IG51bGw7XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgZWw6IEVsZW1lbnRSZWYsIHB1YmxpYyBfem9uZTogTmdab25lLCBwdWJsaWMgY2Q6IENoYW5nZURldGVjdG9yUmVmKSB7fVxuICAgIFxuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAgICAgaWYgKCg8YW55PndpbmRvdykuZ3JlY2FwdGNoYSkge1xuICAgICAgICAgICAgaWYgKCEoPGFueT53aW5kb3cpLmdyZWNhcHRjaGEucmVuZGVyKXtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+e1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmluaXQoKTtcbiAgICAgICAgICAgICAgICB9LDEwMClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5pdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgKDxhbnk+d2luZG93KVt0aGlzLmluaXRDYWxsYmFja10gPSAoKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMuaW5pdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IFxuICAgIH1cbiAgICBcbiAgICBpbml0KCnCoHtcbiAgICAgICAgdGhpcy5faW5zdGFuY2UgPSAoPGFueT53aW5kb3cpLmdyZWNhcHRjaGEucmVuZGVyKHRoaXMuZWwubmF0aXZlRWxlbWVudC5jaGlsZHJlblswXSwge1xuICAgICAgICAgICAgJ3NpdGVrZXknOiB0aGlzLnNpdGVLZXksXG4gICAgICAgICAgICAndGhlbWUnOiB0aGlzLnRoZW1lLFxuICAgICAgICAgICAgJ3R5cGUnOiB0aGlzLnR5cGUsXG4gICAgICAgICAgICAnc2l6ZSc6IHRoaXMuc2l6ZSxcbiAgICAgICAgICAgICd0YWJpbmRleCc6IHRoaXMudGFiaW5kZXgsXG4gICAgICAgICAgICAnaGwnOiB0aGlzLmxhbmd1YWdlLFxuICAgICAgICAgICAgJ2NhbGxiYWNrJzogKHJlc3BvbnNlOiBzdHJpbmcpID0+IHt0aGlzLl96b25lLnJ1bigoKSA9PiB0aGlzLnJlY2FwdGNoYUNhbGxiYWNrKHJlc3BvbnNlKSl9LFxuICAgICAgICAgICAgJ2V4cGlyZWQtY2FsbGJhY2snOiAoKSA9PiB7dGhpcy5fem9uZS5ydW4oKCkgPT4gdGhpcy5yZWNhcHRjaGFFeHBpcmVkQ2FsbGJhY2soKSl9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBcbiAgICByZXNldCgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2luc3RhbmNlID09PSBudWxsKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBcbiAgICAgICAgKDxhbnk+d2luZG93KS5ncmVjYXB0Y2hhLnJlc2V0KHRoaXMuX2luc3RhbmNlKTtcbiAgICAgICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG4gICAgXG4gICAgZ2V0UmVzcG9uc2UoKTogU3RyaW5nIHtcbiAgICAgICAgaWYgKHRoaXMuX2luc3RhbmNlID09PSBudWxsKVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gKDxhbnk+d2luZG93KS5ncmVjYXB0Y2hhLmdldFJlc3BvbnNlKHRoaXMuX2luc3RhbmNlKTtcbiAgICB9XG4gICAgXG4gICAgcmVjYXB0Y2hhQ2FsbGJhY2socmVzcG9uc2U6IHN0cmluZykge1xuICAgICAgICB0aGlzLm9uUmVzcG9uc2UuZW1pdCh7XG4gICAgICAgICAgICByZXNwb25zZTogcmVzcG9uc2VcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmVjYXB0Y2hhRXhwaXJlZENhbGxiYWNrKCkge1xuICAgICAgICB0aGlzLm9uRXhwaXJlLmVtaXQoKTtcbiAgICB9XG4gICAgXG4gICAgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIGlmICh0aGlzLl9pbnN0YW5jZSAhPSBudWxsKSB7XG4gICAgICAgICAgKDxhbnk+d2luZG93KS5ncmVjYXB0Y2hhLnJlc2V0KHRoaXMuX2luc3RhbmNlKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuQE5nTW9kdWxlKHtcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlXSxcbiAgICBleHBvcnRzOiBbQ2FwdGNoYV0sXG4gICAgZGVjbGFyYXRpb25zOiBbQ2FwdGNoYV1cbn0pXG5leHBvcnQgY2xhc3MgQ2FwdGNoYU1vZHVsZSB7IH1cbiJdfQ==