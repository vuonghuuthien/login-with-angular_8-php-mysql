import { NgModule, Component, Input, Output, OnInit, AfterViewInit, AfterContentInit, OnDestroy, ElementRef, ViewChild, EventEmitter, ContentChildren, QueryList, TemplateRef, ChangeDetectionStrategy, NgZone, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomHandler } from 'primeng/dom';
import { PrimeTemplate, SharedModule } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';
import { trigger, state, style, transition, animate, query, animateChild } from '@angular/animations';
export class ToastItem {
    constructor(zone) {
        this.zone = zone;
        this.onClose = new EventEmitter();
    }
    ngAfterViewInit() {
        this.initTimeout();
    }
    initTimeout() {
        if (!this.message.sticky) {
            this.zone.runOutsideAngular(() => {
                this.timeout = setTimeout(() => {
                    this.onClose.emit({
                        index: this.index,
                        message: this.message
                    });
                }, this.message.life || 3000);
            });
        }
    }
    clearTimeout() {
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
    }
    onMouseEnter() {
        this.clearTimeout();
    }
    onMouseLeave() {
        this.initTimeout();
    }
    onCloseIconClick(event) {
        this.clearTimeout();
        this.onClose.emit({
            index: this.index,
            message: this.message
        });
        event.preventDefault();
    }
    ngOnDestroy() {
        this.clearTimeout();
    }
}
ToastItem.ctorParameters = () => [
    { type: NgZone }
];
ToastItem.decorators = [
    { type: Component, args: [{
                selector: 'p-toastItem',
                template: `
        <div #container [attr.id]="message.id" class="p-toast-message" [ngClass]="'p-toast-message-' + message.severity" [@messageState]="{value: 'visible', params: {showTransformParams: showTransformOptions, hideTransformParams: hideTransformOptions, showTransitionParams: showTransitionOptions, hideTransitionParams: hideTransitionOptions}}"
                (mouseenter)="onMouseEnter()" (mouseleave)="onMouseLeave()">
            <div class="p-toast-message-content" role="alert" aria-live="assertive" aria-atomic="true">
                <ng-container *ngIf="!template">
                    <span class="p-toast-message-icon pi" [ngClass]="{'pi-info-circle': message.severity == 'info', 'pi-exclamation-triangle': message.severity == 'warn',
                        'pi-times-circle': message.severity == 'error', 'pi-check' :message.severity == 'success'}"></span>
                    <div class="p-toast-message-text">
                        <div class="p-toast-summary">{{message.summary}}</div>
                        <div class="p-toast-detail">{{message.detail}}</div>
                    </div>
                </ng-container>
                <button type="button" class="p-toast-icon-close p-link" (click)="onCloseIconClick($event)" (keydown.enter)="onCloseIconClick($event)" *ngIf="message.closable !== false" pRipple>
                    <span class="p-toast-icon-close-icon pi pi-times"></span>
                </button>
                <ng-container *ngTemplateOutlet="template; context: {$implicit: message}"></ng-container>
            </div>
        </div>
    `,
                animations: [
                    trigger('messageState', [
                        state('visible', style({
                            transform: 'translateY(0)',
                            opacity: 1
                        })),
                        transition('void => *', [
                            style({ transform: '{{showTransformParams}}', opacity: 0 }),
                            animate('{{showTransitionParams}}')
                        ]),
                        transition('* => void', [
                            animate(('{{hideTransitionParams}}'), style({
                                height: 0,
                                opacity: 0,
                                transform: '{{hideTransformParams}}'
                            }))
                        ])
                    ])
                ],
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush
            },] }
];
ToastItem.ctorParameters = () => [
    { type: NgZone }
];
ToastItem.propDecorators = {
    message: [{ type: Input }],
    index: [{ type: Input }],
    template: [{ type: Input }],
    showTransformOptions: [{ type: Input }],
    hideTransformOptions: [{ type: Input }],
    showTransitionOptions: [{ type: Input }],
    hideTransitionOptions: [{ type: Input }],
    onClose: [{ type: Output }],
    containerViewChild: [{ type: ViewChild, args: ['container',] }]
};
export class Toast {
    constructor(messageService, cd) {
        this.messageService = messageService;
        this.cd = cd;
        this.autoZIndex = true;
        this.baseZIndex = 0;
        this.position = 'top-right';
        this.preventOpenDuplicates = false;
        this.preventDuplicates = false;
        this.showTransformOptions = 'translateY(100%)';
        this.hideTransformOptions = 'translateY(-100%)';
        this.showTransitionOptions = '300ms ease-out';
        this.hideTransitionOptions = '250ms ease-in';
        this.onClose = new EventEmitter();
    }
    ngOnInit() {
        this.messageSubscription = this.messageService.messageObserver.subscribe(messages => {
            if (messages) {
                if (messages instanceof Array) {
                    const filteredMessages = messages.filter(m => this.canAdd(m));
                    this.add(filteredMessages);
                }
                else if (this.canAdd(messages)) {
                    this.add([messages]);
                }
            }
        });
        this.clearSubscription = this.messageService.clearObserver.subscribe(key => {
            if (key) {
                if (this.key === key) {
                    this.messages = null;
                }
            }
            else {
                this.messages = null;
            }
            this.cd.markForCheck();
        });
    }
    add(messages) {
        this.messages = this.messages ? [...this.messages, ...messages] : [...messages];
        if (this.preventDuplicates) {
            this.messagesArchieve = this.messagesArchieve ? [...this.messagesArchieve, ...messages] : [...messages];
        }
        this.cd.markForCheck();
    }
    canAdd(message) {
        let allow = this.key === message.key;
        if (allow && this.preventOpenDuplicates) {
            allow = !this.containsMessage(this.messages, message);
        }
        if (allow && this.preventDuplicates) {
            allow = !this.containsMessage(this.messagesArchieve, message);
        }
        return allow;
    }
    containsMessage(collection, message) {
        if (!collection) {
            return false;
        }
        return collection.find(m => {
            return ((m.summary === message.summary) && (m.detail == message.detail) && (m.severity === message.severity));
        }) != null;
    }
    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'message':
                    this.template = item.template;
                    break;
                default:
                    this.template = item.template;
                    break;
            }
        });
    }
    onMessageClose(event) {
        this.messages.splice(event.index, 1);
        this.onClose.emit({
            message: event.message
        });
        this.cd.detectChanges();
    }
    onAnimationStart(event) {
        if (event.fromState === 'void' && this.autoZIndex) {
            this.containerViewChild.nativeElement.style.zIndex = String(this.baseZIndex + (++DomHandler.zindex));
        }
    }
    ngOnDestroy() {
        if (this.messageSubscription) {
            this.messageSubscription.unsubscribe();
        }
        if (this.clearSubscription) {
            this.clearSubscription.unsubscribe();
        }
    }
}
Toast.ctorParameters = () => [
    { type: MessageService },
    { type: ChangeDetectorRef }
];
Toast.decorators = [
    { type: Component, args: [{
                selector: 'p-toast',
                template: `
        <div #container [ngClass]="'p-toast p-component p-toast-' + position" [ngStyle]="style" [class]="styleClass">
            <p-toastItem *ngFor="let msg of messages; let i=index" [message]="msg" [index]="i" (onClose)="onMessageClose($event)"
                    [template]="template" @toastAnimation (@toastAnimation.start)="onAnimationStart($event)" 
                    [showTransformOptions]="showTransformOptions" [hideTransformOptions]="hideTransformOptions" 
                    [showTransitionOptions]="showTransitionOptions" [hideTransitionOptions]="hideTransitionOptions"></p-toastItem>
        </div>
    `,
                animations: [
                    trigger('toastAnimation', [
                        transition(':enter, :leave', [
                            query('@*', animateChild())
                        ])
                    ])
                ],
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                styles: [".p-toast{position:fixed;width:25rem}.p-toast-message{overflow:hidden}.p-toast-message-content{display:-ms-flexbox;display:flex;-ms-flex-align:start;align-items:flex-start}.p-toast-message-text{-ms-flex:1 1 auto;flex:1 1 auto}.p-toast-top-right{top:20px;right:20px}.p-toast-top-left{top:20px;left:20px}.p-toast-bottom-left{bottom:20px;left:20px}.p-toast-bottom-right{bottom:20px;right:20px}.p-toast-top-center{top:20px;left:50%;margin-left:-10em}.p-toast-bottom-center{bottom:20px;left:50%;margin-left:-10em}.p-toast-center{left:50%;top:50%;min-width:20vw;-ms-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}.p-toast-icon-close{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;overflow:hidden;position:relative}.p-toast-icon-close.p-link{cursor:pointer}"]
            },] }
];
Toast.ctorParameters = () => [
    { type: MessageService },
    { type: ChangeDetectorRef }
];
Toast.propDecorators = {
    key: [{ type: Input }],
    autoZIndex: [{ type: Input }],
    baseZIndex: [{ type: Input }],
    style: [{ type: Input }],
    styleClass: [{ type: Input }],
    position: [{ type: Input }],
    preventOpenDuplicates: [{ type: Input }],
    preventDuplicates: [{ type: Input }],
    showTransformOptions: [{ type: Input }],
    hideTransformOptions: [{ type: Input }],
    showTransitionOptions: [{ type: Input }],
    hideTransitionOptions: [{ type: Input }],
    onClose: [{ type: Output }],
    containerViewChild: [{ type: ViewChild, args: ['container',] }],
    templates: [{ type: ContentChildren, args: [PrimeTemplate,] }]
};
export class ToastModule {
}
ToastModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule, RippleModule],
                exports: [Toast, SharedModule],
                declarations: [Toast, ToastItem]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9hc3QuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9wcmltZW5nL3RvYXN0LyIsInNvdXJjZXMiOlsidG9hc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFFBQVEsRUFBQyxTQUFTLEVBQUMsS0FBSyxFQUFDLE1BQU0sRUFBQyxNQUFNLEVBQUMsYUFBYSxFQUFDLGdCQUFnQixFQUFDLFNBQVMsRUFBQyxVQUFVLEVBQUMsU0FBUyxFQUFDLFlBQVksRUFBQyxlQUFlLEVBQUMsU0FBUyxFQUFDLFdBQVcsRUFBQyx1QkFBdUIsRUFBRSxNQUFNLEVBQUUsaUJBQWlCLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDNVAsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBRTdDLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDdkMsT0FBTyxFQUFDLGFBQWEsRUFBQyxZQUFZLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDdkQsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUMzQyxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFNUMsT0FBTyxFQUFDLE9BQU8sRUFBQyxLQUFLLEVBQUMsS0FBSyxFQUFDLFVBQVUsRUFBQyxPQUFPLEVBQUMsS0FBSyxFQUFDLFlBQVksRUFBZ0IsTUFBTSxxQkFBcUIsQ0FBQztBQTZDN0csTUFBTSxPQUFPLFNBQVM7SUFzQmxCLFlBQW9CLElBQVk7UUFBWixTQUFJLEdBQUosSUFBSSxDQUFRO1FBTnRCLFlBQU8sR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztJQU12QixDQUFDO0lBRXBDLGVBQWU7UUFDWCxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDdkIsQ0FBQztJQUVELFdBQVc7UUFDUCxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUU7WUFDdEIsSUFBSSxDQUFDLElBQUksQ0FBQyxp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Y2VzQ29udGVudCI6WyJpbXBvcnQge05nTW9kdWxlLENvbXBvbmVudCxJbnB1dCxPdXRwdXQsT25Jbml0LEFmdGVyVmlld0luaXQsQWZ0ZXJDb250ZW50SW5pdCxPbkRlc3Ryb3ksRWxlbWVudFJlZixWaWV3Q2hpbGQsRXZlbnRFbWl0dGVyLENvbnRlbnRDaGlsZHJlbixRdWVyeUxpc3QsVGVtcGxhdGVSZWYsQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIE5nWm9uZSwgQ2hhbmdlRGV0ZWN0b3JSZWYsIFZpZXdFbmNhcHN1bGF0aW9ufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtNZXNzYWdlfSBmcm9tICdwcmltZW5nL2FwaSc7XG5pbXBvcnQge0RvbUhhbmRsZXJ9IGZyb20gJ3ByaW1lbmcvZG9tJztcbmltcG9ydCB7UHJpbWVUZW1wbGF0ZSxTaGFyZWRNb2R1bGV9IGZyb20gJ3ByaW1lbmcvYXBpJztcbmltcG9ydCB7TWVzc2FnZVNlcnZpY2V9IGZyb20gJ3ByaW1lbmcvYXBpJztcbmltcG9ydCB7UmlwcGxlTW9kdWxlfSBmcm9tICdwcmltZW5nL3JpcHBsZSc7XG5pbXBvcnQge1N1YnNjcmlwdGlvbn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge3RyaWdnZXIsc3RhdGUsc3R5bGUsdHJhbnNpdGlvbixhbmltYXRlLHF1ZXJ5LGFuaW1hdGVDaGlsZCxBbmltYXRpb25FdmVudH0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAncC10b2FzdEl0ZW0nLFxuICAgIHRlbXBsYXRlOiBgXG4gICAgICAgIDxkaXYgI2NvbnRhaW5lciBbYXR0ci5pZF09XCJtZXNzYWdlLmlkXCIgY2xhc3M9XCJwLXRvYXN0LW1lc3NhZ2VcIiBbbmdDbGFzc109XCIncC10b2FzdC1tZXNzYWdlLScgKyBtZXNzYWdlLnNldmVyaXR5XCIgW0BtZXNzYWdlU3RhdGVdPVwie3ZhbHVlOiAndmlzaWJsZScsIHBhcmFtczoge3Nob3dUcmFuc2Zvcm1QYXJhbXM6IHNob3dUcmFuc2Zvcm1PcHRpb25zLCBoaWRlVHJhbnNmb3JtUGFyYW1zOiBoaWRlVHJhbnNmb3JtT3B0aW9ucywgc2hvd1RyYW5zaXRpb25QYXJhbXM6IHNob3dUcmFuc2l0aW9uT3B0aW9ucywgaGlkZVRyYW5zaXRpb25QYXJhbXM6IGhpZGVUcmFuc2l0aW9uT3B0aW9uc319XCJcbiAgICAgICAgICAgICAgICAobW91c2VlbnRlcik9XCJvbk1vdXNlRW50ZXIoKVwiIChtb3VzZWxlYXZlKT1cIm9uTW91c2VMZWF2ZSgpXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicC10b2FzdC1tZXNzYWdlLWNvbnRlbnRcIiByb2xlPVwiYWxlcnRcIiBhcmlhLWxpdmU9XCJhc3NlcnRpdmVcIiBhcmlhLWF0b21pYz1cInRydWVcIj5cbiAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiIXRlbXBsYXRlXCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicC10b2FzdC1tZXNzYWdlLWljb24gcGlcIiBbbmdDbGFzc109XCJ7J3BpLWluZm8tY2lyY2xlJzogbWVzc2FnZS5zZXZlcml0eSA9PSAnaW5mbycsICdwaS1leGNsYW1hdGlvbi10cmlhbmdsZSc6IG1lc3NhZ2Uuc2V2ZXJpdHkgPT0gJ3dhcm4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3BpLXRpbWVzLWNpcmNsZSc6IG1lc3NhZ2Uuc2V2ZXJpdHkgPT0gJ2Vycm9yJywgJ3BpLWNoZWNrJyA6bWVzc2FnZS5zZXZlcml0eSA9PSAnc3VjY2Vzcyd9XCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicC10b2FzdC1tZXNzYWdlLXRleHRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwLXRvYXN0LXN1bW1hcnlcIj57e21lc3NhZ2Uuc3VtbWFyeX19PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicC10b2FzdC1kZXRhaWxcIj57e21lc3NhZ2UuZGV0YWlsfX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJwLXRvYXN0LWljb24tY2xvc2UgcC1saW5rXCIgKGNsaWNrKT1cIm9uQ2xvc2VJY29uQ2xpY2soJGV2ZW50KVwiIChrZXlkb3duLmVudGVyKT1cIm9uQ2xvc2VJY29uQ2xpY2soJGV2ZW50KVwiICpuZ0lmPVwibWVzc2FnZS5jbG9zYWJsZSAhPT0gZmFsc2VcIiBwUmlwcGxlPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInAtdG9hc3QtaWNvbi1jbG9zZS1pY29uIHBpIHBpLXRpbWVzXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJ0ZW1wbGF0ZTsgY29udGV4dDogeyRpbXBsaWNpdDogbWVzc2FnZX1cIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICBgLFxuICAgIGFuaW1hdGlvbnM6IFtcbiAgICAgICAgdHJpZ2dlcignbWVzc2FnZVN0YXRlJywgW1xuICAgICAgICAgICAgc3RhdGUoJ3Zpc2libGUnLCBzdHlsZSh7XG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlWSgwKScsXG4gICAgICAgICAgICAgICAgb3BhY2l0eTogMVxuICAgICAgICAgICAgfSkpLFxuICAgICAgICAgICAgdHJhbnNpdGlvbigndm9pZCA9PiAqJywgW1xuICAgICAgICAgICAgICAgIHN0eWxlKHt0cmFuc2Zvcm06ICd7e3Nob3dUcmFuc2Zvcm1QYXJhbXN9fScsIG9wYWNpdHk6IDB9KSxcbiAgICAgICAgICAgICAgICBhbmltYXRlKCd7e3Nob3dUcmFuc2l0aW9uUGFyYW1zfX0nKVxuICAgICAgICAgICAgXSksXG4gICAgICAgICAgICB0cmFuc2l0aW9uKCcqID0+IHZvaWQnLCBbXG4gICAgICAgICAgICAgICAgYW5pbWF0ZSgoJ3t7aGlkZVRyYW5zaXRpb25QYXJhbXN9fScpLCBzdHlsZSh7XG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogMCxcbiAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogMCxcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtOiAne3toaWRlVHJhbnNmb3JtUGFyYW1zfX0nXG4gICAgICAgICAgICAgICAgfSkpXG4gICAgICAgICAgICBdKVxuICAgICAgICBdKVxuICAgIF0sXG4gICAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxufSlcbmV4cG9ydCBjbGFzcyBUb2FzdEl0ZW0gaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3kge1xuXG4gICAgQElucHV0KCkgbWVzc2FnZTogTWVzc2FnZTtcblxuICAgIEBJbnB1dCgpIGluZGV4OiBudW1iZXI7XG5cbiAgICBASW5wdXQoKSB0ZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIEBJbnB1dCgpIHNob3dUcmFuc2Zvcm1PcHRpb25zOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBoaWRlVHJhbnNmb3JtT3B0aW9uczogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgc2hvd1RyYW5zaXRpb25PcHRpb25zOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBoaWRlVHJhbnNpdGlvbk9wdGlvbnM6IHN0cmluZztcblxuICAgIEBPdXRwdXQoKSBvbkNsb3NlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBWaWV3Q2hpbGQoJ2NvbnRhaW5lcicpIGNvbnRhaW5lclZpZXdDaGlsZDogRWxlbWVudFJlZjtcblxuICAgIHRpbWVvdXQ6IGFueTtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgem9uZTogTmdab25lKSB7fVxuICAgIFxuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAgICAgdGhpcy5pbml0VGltZW91dCgpO1xuICAgIH1cblxuICAgIGluaXRUaW1lb3V0KCkge1xuICAgICAgICBpZiAoIXRoaXMubWVzc2FnZS5zdGlja3kpIHtcbiAgICAgICAgICAgIHRoaXMuem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy50aW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25DbG9zZS5lbWl0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4OiB0aGlzLmluZGV4LFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogdGhpcy5tZXNzYWdlXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sIHRoaXMubWVzc2FnZS5saWZlIHx8IDMwMDApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjbGVhclRpbWVvdXQoKSB7XG4gICAgICAgIGlmICh0aGlzLnRpbWVvdXQpIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXQpO1xuICAgICAgICAgICAgdGhpcy50aW1lb3V0ID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBvbk1vdXNlRW50ZXIoKSB7XG4gICAgICAgIHRoaXMuY2xlYXJUaW1lb3V0KCk7XG4gICAgfVxuXG4gICAgb25Nb3VzZUxlYXZlKCkge1xuICAgICAgICB0aGlzLmluaXRUaW1lb3V0KCk7XG4gICAgfVxuIFxuICAgIG9uQ2xvc2VJY29uQ2xpY2soZXZlbnQpIHtcbiAgICAgICAgdGhpcy5jbGVhclRpbWVvdXQoKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMub25DbG9zZS5lbWl0KHtcbiAgICAgICAgICAgIGluZGV4OiB0aGlzLmluZGV4LFxuICAgICAgICAgICAgbWVzc2FnZTogdGhpcy5tZXNzYWdlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMuY2xlYXJUaW1lb3V0KCk7XG4gICAgfVxufVxuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3AtdG9hc3QnLFxuICAgIHRlbXBsYXRlOiBgXG4gICAgICAgIDxkaXYgI2NvbnRhaW5lciBbbmdDbGFzc109XCIncC10b2FzdCBwLWNvbXBvbmVudCBwLXRvYXN0LScgKyBwb3NpdGlvblwiIFtuZ1N0eWxlXT1cInN0eWxlXCIgW2NsYXNzXT1cInN0eWxlQ2xhc3NcIj5cbiAgICAgICAgICAgIDxwLXRvYXN0SXRlbSAqbmdGb3I9XCJsZXQgbXNnIG9mIG1lc3NhZ2VzOyBsZXQgaT1pbmRleFwiIFttZXNzYWdlXT1cIm1zZ1wiIFtpbmRleF09XCJpXCIgKG9uQ2xvc2UpPVwib25NZXNzYWdlQ2xvc2UoJGV2ZW50KVwiXG4gICAgICAgICAgICAgICAgICAgIFt0ZW1wbGF0ZV09XCJ0ZW1wbGF0ZVwiIEB0b2FzdEFuaW1hdGlvbiAoQHRvYXN0QW5pbWF0aW9uLnN0YXJ0KT1cIm9uQW5pbWF0aW9uU3RhcnQoJGV2ZW50KVwiIFxuICAgICAgICAgICAgICAgICAgICBbc2hvd1RyYW5zZm9ybU9wdGlvbnNdPVwic2hvd1RyYW5zZm9ybU9wdGlvbnNcIiBbaGlkZVRyYW5zZm9ybU9wdGlvbnNdPVwiaGlkZVRyYW5zZm9ybU9wdGlvbnNcIiBcbiAgICAgICAgICAgICAgICAgICAgW3Nob3dUcmFuc2l0aW9uT3B0aW9uc109XCJzaG93VHJhbnNpdGlvbk9wdGlvbnNcIiBbaGlkZVRyYW5zaXRpb25PcHRpb25zXT1cImhpZGVUcmFuc2l0aW9uT3B0aW9uc1wiPjwvcC10b2FzdEl0ZW0+XG4gICAgICAgIDwvZGl2PlxuICAgIGAsXG4gICAgYW5pbWF0aW9uczogW1xuICAgICAgICB0cmlnZ2VyKCd0b2FzdEFuaW1hdGlvbicsIFtcbiAgICAgICAgICAgIHRyYW5zaXRpb24oJzplbnRlciwgOmxlYXZlJywgW1xuICAgICAgICAgICAgICAgIHF1ZXJ5KCdAKicsIGFuaW1hdGVDaGlsZCgpKVxuICAgICAgICAgICAgXSlcbiAgICAgICAgXSlcbiAgICBdLFxuICAgIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICAgIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gICAgc3R5bGVVcmxzOiBbJy4vdG9hc3QuY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgVG9hc3QgaW1wbGVtZW50cyBPbkluaXQsQWZ0ZXJDb250ZW50SW5pdCxPbkRlc3Ryb3kge1xuXG4gICAgQElucHV0KCkga2V5OiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBhdXRvWkluZGV4OiBib29sZWFuID0gdHJ1ZTtcbiAgICBcbiAgICBASW5wdXQoKSBiYXNlWkluZGV4OiBudW1iZXIgPSAwO1xuXG4gICAgQElucHV0KCkgc3R5bGU6IGFueTtcbiAgICAgICAgXG4gICAgQElucHV0KCkgc3R5bGVDbGFzczogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgcG9zaXRpb246IHN0cmluZyA9ICd0b3AtcmlnaHQnO1xuXG4gICAgQElucHV0KCkgcHJldmVudE9wZW5EdXBsaWNhdGVzOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBASW5wdXQoKSBwcmV2ZW50RHVwbGljYXRlczogYm9vbGVhbiA9IGZhbHNlO1xuICAgIFxuICAgIEBJbnB1dCgpIHNob3dUcmFuc2Zvcm1PcHRpb25zOiBzdHJpbmcgPSAndHJhbnNsYXRlWSgxMDAlKSc7XG5cbiAgICBASW5wdXQoKSBoaWRlVHJhbnNmb3JtT3B0aW9uczogc3RyaW5nID0gJ3RyYW5zbGF0ZVkoLTEwMCUpJztcblxuICAgIEBJbnB1dCgpIHNob3dUcmFuc2l0aW9uT3B0aW9uczogc3RyaW5nID0gJzMwMG1zIGVhc2Utb3V0JztcblxuICAgIEBJbnB1dCgpIGhpZGVUcmFuc2l0aW9uT3B0aW9uczogc3RyaW5nID0gJzI1MG1zIGVhc2UtaW4nO1xuXG4gICAgQE91dHB1dCgpIG9uQ2xvc2U6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQFZpZXdDaGlsZCgnY29udGFpbmVyJykgY29udGFpbmVyVmlld0NoaWxkOiBFbGVtZW50UmVmO1xuXG4gICAgQENvbnRlbnRDaGlsZHJlbihQcmltZVRlbXBsYXRlKSB0ZW1wbGF0ZXM6IFF1ZXJ5TGlzdDxhbnk+O1xuXG4gICAgbWVzc2FnZVN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gICAgY2xlYXJTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICAgIG1lc3NhZ2VzOiBNZXNzYWdlW107XG5cbiAgICBtZXNzYWdlc0FyY2hpZXZlOiBNZXNzYWdlW107XG5cbiAgICB0ZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcbiAgICBcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbWVzc2FnZVNlcnZpY2U6IE1lc3NhZ2VTZXJ2aWNlLCBwcml2YXRlIGNkOiBDaGFuZ2VEZXRlY3RvclJlZikge31cblxuICAgIG5nT25Jbml0KCkge1xuICAgICAgICB0aGlzLm1lc3NhZ2VTdWJzY3JpcHRpb24gPSB0aGlzLm1lc3NhZ2VTZXJ2aWNlLm1lc3NhZ2VPYnNlcnZlci5zdWJzY3JpYmUobWVzc2FnZXMgPT4ge1xuICAgICAgICAgICAgaWYgKG1lc3NhZ2VzKSB7XG4gICAgICAgICAgICAgICAgaWYgKG1lc3NhZ2VzIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZmlsdGVyZWRNZXNzYWdlcyA9IG1lc3NhZ2VzLmZpbHRlcihtID0+IHRoaXMuY2FuQWRkKG0pKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGQoZmlsdGVyZWRNZXNzYWdlcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuY2FuQWRkKG1lc3NhZ2VzKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZChbbWVzc2FnZXNdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuY2xlYXJTdWJzY3JpcHRpb24gPSB0aGlzLm1lc3NhZ2VTZXJ2aWNlLmNsZWFyT2JzZXJ2ZXIuc3Vic2NyaWJlKGtleSA9PiB7XG4gICAgICAgICAgICBpZiAoa2V5KSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMua2V5ID09PSBrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tZXNzYWdlcyA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5tZXNzYWdlcyA9IG51bGw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gICAgICAgIH0pOyAgICAgICBcbiAgICB9XG5cbiAgICBhZGQobWVzc2FnZXM6IE1lc3NhZ2VbXSk6IHZvaWQge1xuICAgICAgICB0aGlzLm1lc3NhZ2VzID0gdGhpcy5tZXNzYWdlcyA/IFsuLi50aGlzLm1lc3NhZ2VzLCAuLi5tZXNzYWdlc10gOiBbLi4ubWVzc2FnZXNdO1xuXG4gICAgICAgIGlmICh0aGlzLnByZXZlbnREdXBsaWNhdGVzKSB7XG4gICAgICAgICAgICB0aGlzLm1lc3NhZ2VzQXJjaGlldmUgPSB0aGlzLm1lc3NhZ2VzQXJjaGlldmUgPyBbLi4udGhpcy5tZXNzYWdlc0FyY2hpZXZlLCAuLi5tZXNzYWdlc10gOiBbLi4ubWVzc2FnZXNdO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG5cbiAgICBjYW5BZGQobWVzc2FnZTogTWVzc2FnZSk6IGJvb2xlYW4ge1xuICAgICAgICBsZXQgYWxsb3cgPSB0aGlzLmtleSA9PT0gbWVzc2FnZS5rZXk7XG5cbiAgICAgICAgaWYgKGFsbG93ICYmIHRoaXMucHJldmVudE9wZW5EdXBsaWNhdGVzKSB7XG4gICAgICAgICAgICBhbGxvdyA9ICF0aGlzLmNvbnRhaW5zTWVzc2FnZSh0aGlzLm1lc3NhZ2VzLCBtZXNzYWdlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhbGxvdyAmJiB0aGlzLnByZXZlbnREdXBsaWNhdGVzKSB7XG4gICAgICAgICAgICBhbGxvdyA9ICF0aGlzLmNvbnRhaW5zTWVzc2FnZSh0aGlzLm1lc3NhZ2VzQXJjaGlldmUsIG1lc3NhZ2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGFsbG93O1xuICAgIH1cblxuICAgIGNvbnRhaW5zTWVzc2FnZShjb2xsZWN0aW9uOiBNZXNzYWdlW10sIG1lc3NhZ2U6IE1lc3NhZ2UpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKCFjb2xsZWN0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY29sbGVjdGlvbi5maW5kKG0gPT4ge1xuICAgICAgICAgICByZXR1cm4gKChtLnN1bW1hcnkgPT09IG1lc3NhZ2Uuc3VtbWFyeSkgJiYgKG0uZGV0YWlsID09IG1lc3NhZ2UuZGV0YWlsKSAmJiAobS5zZXZlcml0eSA9PT0gbWVzc2FnZS5zZXZlcml0eSkpO1xuICAgICAgICB9KSAhPSBudWxsO1xuICAgIH1cblxuICAgIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICAgICAgc3dpdGNoKGl0ZW0uZ2V0VHlwZSgpKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnbWVzc2FnZSc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50ZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG9uTWVzc2FnZUNsb3NlKGV2ZW50KSB7XG4gICAgICAgIHRoaXMubWVzc2FnZXMuc3BsaWNlKGV2ZW50LmluZGV4LCAxKTtcblxuICAgICAgICB0aGlzLm9uQ2xvc2UuZW1pdCh7XG4gICAgICAgICAgICBtZXNzYWdlOiBldmVudC5tZXNzYWdlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuY2QuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIH1cblxuICAgIG9uQW5pbWF0aW9uU3RhcnQoZXZlbnQ6IEFuaW1hdGlvbkV2ZW50KSB7XG4gICAgICAgIGlmIChldmVudC5mcm9tU3RhdGUgPT09ICd2b2lkJyAmJiB0aGlzLmF1dG9aSW5kZXgpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQuc3R5bGUuekluZGV4ID0gU3RyaW5nKHRoaXMuYmFzZVpJbmRleCArICgrK0RvbUhhbmRsZXIuemluZGV4KSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHsgICAgICAgIFxuICAgICAgICBpZiAodGhpcy5tZXNzYWdlU3Vic2NyaXB0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLm1lc3NhZ2VTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYgKHRoaXMuY2xlYXJTdWJzY3JpcHRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuY2xlYXJTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuQE5nTW9kdWxlKHtcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLFJpcHBsZU1vZHVsZV0sXG4gICAgZXhwb3J0czogW1RvYXN0LFNoYXJlZE1vZHVsZV0sXG4gICAgZGVjbGFyYXRpb25zOiBbVG9hc3QsVG9hc3RJdGVtXVxufSlcbmV4cG9ydCBjbGFzcyBUb2FzdE1vZHVsZSB7IH1cbiJdfQ==