import { NgModule, Component, AfterViewInit, AfterViewChecked, OnDestroy, Input, ElementRef, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DomHandler } from 'primeng/dom';
import { TerminalService } from './terminalservice';
export class Terminal {
    constructor(el, terminalService) {
        this.el = el;
        this.terminalService = terminalService;
        this.commands = [];
        this.subscription = terminalService.responseHandler.subscribe(response => {
            this.commands[this.commands.length - 1].response = response;
            this.commandProcessed = true;
        });
    }
    ngAfterViewInit() {
        this.container = DomHandler.find(this.el.nativeElement, '.p-terminal')[0];
    }
    ngAfterViewChecked() {
        if (this.commandProcessed) {
            this.container.scrollTop = this.container.scrollHeight;
            this.commandProcessed = false;
        }
    }
    set response(value) {
        if (value) {
            this.commands[this.commands.length - 1].response = value;
            this.commandProcessed = true;
        }
    }
    handleCommand(event) {
        if (event.keyCode == 13) {
            this.commands.push({ text: this.command });
            this.terminalService.sendCommand(this.command);
            this.command = '';
        }
    }
    focus(element) {
        element.focus();
    }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
Terminal.ctorParameters = () => [
    { type: ElementRef },
    { type: TerminalService }
];
Terminal.decorators = [
    { type: Component, args: [{
                selector: 'p-terminal',
                template: `
        <div [ngClass]="'p-terminal p-component'" [ngStyle]="style" [class]="styleClass" (click)="focus(in)">
            <div *ngIf="welcomeMessage">{{welcomeMessage}}</div>
            <div class="p-terminal-content">
                <div *ngFor="let command of commands">
                    <span class="p-terminal-prompt">{{prompt}}</span>
                    <span class="p-terminal-command">{{command.text}}</span>
                    <div class="p-terminal-response">{{command.response}}</div>
                </div>
            </div>
            <div class="p-terminal-prompt-container">
                <span class="p-terminal-content-prompt">{{prompt}}</span>
                <input #in type="text" [(ngModel)]="command" class="p-terminal-input" autocomplete="off" (keydown)="handleCommand($event)" autofocus>
            </div>
        </div>
    `,
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                styles: [".p-terminal{height:18rem;overflow:auto}.p-terminal-prompt-container{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center}.p-terminal-input{-ms-flex:1 1 auto;flex:1 1 auto;border:0;background-color:transparent;color:inherit;padding:0;outline:0}.p-terminal-input::-ms-clear{display:none}"]
            },] }
];
Terminal.ctorParameters = () => [
    { type: ElementRef },
    { type: TerminalService }
];
Terminal.propDecorators = {
    welcomeMessage: [{ type: Input }],
    prompt: [{ type: Input }],
    style: [{ type: Input }],
    styleClass: [{ type: Input }],
    response: [{ type: Input }]
};
export class TerminalModule {
}
TerminalModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule, FormsModule],
                exports: [Terminal],
                declarations: [Terminal]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVybWluYWwuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9wcmltZW5nL3Rlcm1pbmFsLyIsInNvdXJjZXMiOlsidGVybWluYWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFFBQVEsRUFBQyxTQUFTLEVBQUMsYUFBYSxFQUFDLGdCQUFnQixFQUFDLFNBQVMsRUFBQyxLQUFLLEVBQUMsVUFBVSxFQUFDLHVCQUF1QixFQUFFLGlCQUFpQixFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3RKLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUMzQyxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDN0MsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUN2QyxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUF5QmxELE1BQU0sT0FBTyxRQUFRO0lBb0JqQixZQUFtQixFQUFjLEVBQVMsZUFBZ0M7UUFBdkQsT0FBRSxHQUFGLEVBQUUsQ0FBWTtRQUFTLG9CQUFlLEdBQWYsZUFBZSxDQUFpQjtRQVYxRSxhQUFRLEdBQVUsRUFBRSxDQUFDO1FBV2pCLElBQUksQ0FBQyxZQUFZLEdBQUcsZUFBZSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDckUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1lBQzVELElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7UUFDakMsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsZUFBZTtRQUNYLElBQUksQ0FBQyxTQUFTLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM5RSxDQUFDO0lBRUQsa0JBQWtCO1FBQ2QsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7WUFDdkIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUM7WUFDdkQsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEtBQUssQ0FBQztTQUNqQztJQUNMLENBQUM7SUFFRCxJQUNJLFFBQVEsQ0FBQyxLQUFhO1FBQ3RCLElBQUksS0FBSyxFQUFFO1lBQ1AsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO1lBQ3pELElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7U0FDaEM7SUFDTCxDQUFDO0lBRUQsYUFBYSxDQUFDLEtBQW9CO1FBQzlCLElBQUksS0FBSyxDQUFDLE9BQU8sSUFBSSxFQUFFLEVBQUU7WUFDckIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBQyxDQUFDLENBQUM7WUFDekMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQy9DLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO1NBQ3JCO0lBQ0wsQ0FBQztJQUVELEtBQUssQ0FBQyxPQUFvQjtRQUN0QixPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDcEIsQ0FBQztJQUVELFdBQVc7UUFDUCxJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDbkIsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUNuQztJQUNMLENBQUM7OztZQTFDc0IsVUFBVTtZQUEwQixlQUFlOzs7WUExQzdFLFNBQVMsU0FBQztnQkFDUCxRQUFRLEVBQUUsWUFBWTtnQkFDdEIsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7S0FlVDtnQkFDRCxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtnQkFDL0MsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7O2FBRXhDOzs7WUE1QnlFLFVBQVU7WUFJNUUsZUFBZTs7OzZCQTJCbEIsS0FBSztxQkFFTCxLQUFLO29CQUVMLEtBQUs7eUJBRUwsS0FBSzt1QkE4QkwsS0FBSzs7QUFpQ1YsTUFBTSxPQUFPLGNBQWM7OztZQUwxQixRQUFRLFNBQUM7Z0JBQ04sT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFDLFdBQVcsQ0FBQztnQkFDbkMsT0FBTyxFQUFFLENBQUMsUUFBUSxDQUFDO2dCQUNuQixZQUFZLEVBQUUsQ0FBQyxRQUFRLENBQUM7YUFDM0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge05nTW9kdWxlLENvbXBvbmVudCxBZnRlclZpZXdJbml0LEFmdGVyVmlld0NoZWNrZWQsT25EZXN0cm95LElucHV0LEVsZW1lbnRSZWYsQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIFZpZXdFbmNhcHN1bGF0aW9ufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Rm9ybXNNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtEb21IYW5kbGVyfSBmcm9tICdwcmltZW5nL2RvbSc7XG5pbXBvcnQge1Rlcm1pbmFsU2VydmljZX0gZnJvbSAnLi90ZXJtaW5hbHNlcnZpY2UnO1xuaW1wb3J0IHtTdWJzY3JpcHRpb259ICAgZnJvbSAncnhqcyc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAncC10ZXJtaW5hbCcsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPGRpdiBbbmdDbGFzc109XCIncC10ZXJtaW5hbCBwLWNvbXBvbmVudCdcIiBbbmdTdHlsZV09XCJzdHlsZVwiIFtjbGFzc109XCJzdHlsZUNsYXNzXCIgKGNsaWNrKT1cImZvY3VzKGluKVwiPlxuICAgICAgICAgICAgPGRpdiAqbmdJZj1cIndlbGNvbWVNZXNzYWdlXCI+e3t3ZWxjb21lTWVzc2FnZX19PC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicC10ZXJtaW5hbC1jb250ZW50XCI+XG4gICAgICAgICAgICAgICAgPGRpdiAqbmdGb3I9XCJsZXQgY29tbWFuZCBvZiBjb21tYW5kc1wiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInAtdGVybWluYWwtcHJvbXB0XCI+e3twcm9tcHR9fTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwLXRlcm1pbmFsLWNvbW1hbmRcIj57e2NvbW1hbmQudGV4dH19PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicC10ZXJtaW5hbC1yZXNwb25zZVwiPnt7Y29tbWFuZC5yZXNwb25zZX19PC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwLXRlcm1pbmFsLXByb21wdC1jb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInAtdGVybWluYWwtY29udGVudC1wcm9tcHRcIj57e3Byb21wdH19PC9zcGFuPlxuICAgICAgICAgICAgICAgIDxpbnB1dCAjaW4gdHlwZT1cInRleHRcIiBbKG5nTW9kZWwpXT1cImNvbW1hbmRcIiBjbGFzcz1cInAtdGVybWluYWwtaW5wdXRcIiBhdXRvY29tcGxldGU9XCJvZmZcIiAoa2V5ZG93bik9XCJoYW5kbGVDb21tYW5kKCRldmVudClcIiBhdXRvZm9jdXM+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgYCxcbiAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICAgIHN0eWxlVXJsczogWycuL3Rlcm1pbmFsLmNzcyddXG59KVxuZXhwb3J0IGNsYXNzIFRlcm1pbmFsIGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCxBZnRlclZpZXdDaGVja2VkLE9uRGVzdHJveSB7XG5cbiAgICBASW5wdXQoKSB3ZWxjb21lTWVzc2FnZTogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgcHJvbXB0OiBzdHJpbmc7XG4gICAgICAgIFxuICAgIEBJbnB1dCgpIHN0eWxlOiBhbnk7XG4gICAgICAgIFxuICAgIEBJbnB1dCgpIHN0eWxlQ2xhc3M6IHN0cmluZztcbiAgICAgICAgICAgIFxuICAgIGNvbW1hbmRzOiBhbnlbXSA9IFtdO1xuICAgIFxuICAgIGNvbW1hbmQ6IHN0cmluZztcbiAgICBcbiAgICBjb250YWluZXI6IEVsZW1lbnQ7XG4gICAgXG4gICAgY29tbWFuZFByb2Nlc3NlZDogYm9vbGVhbjtcbiAgICBcbiAgICBzdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbiAgICBcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgZWw6IEVsZW1lbnRSZWYsIHB1YmxpYyB0ZXJtaW5hbFNlcnZpY2U6IFRlcm1pbmFsU2VydmljZSkge1xuICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbiA9IHRlcm1pbmFsU2VydmljZS5yZXNwb25zZUhhbmRsZXIuc3Vic2NyaWJlKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgIHRoaXMuY29tbWFuZHNbdGhpcy5jb21tYW5kcy5sZW5ndGggLSAxXS5yZXNwb25zZSA9IHJlc3BvbnNlO1xuICAgICAgICAgICAgdGhpcy5jb21tYW5kUHJvY2Vzc2VkID0gdHJ1ZTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIFxuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAgICAgdGhpcy5jb250YWluZXIgPSBEb21IYW5kbGVyLmZpbmQodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAnLnAtdGVybWluYWwnKVswXTtcbiAgICB9XG4gICAgXG4gICAgbmdBZnRlclZpZXdDaGVja2VkKCkge1xuICAgICAgICBpZiAodGhpcy5jb21tYW5kUHJvY2Vzc2VkKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5zY3JvbGxUb3AgPSB0aGlzLmNvbnRhaW5lci5zY3JvbGxIZWlnaHQ7XG4gICAgICAgICAgICB0aGlzLmNvbW1hbmRQcm9jZXNzZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICBASW5wdXQoKVxuICAgIHNldCByZXNwb25zZSh2YWx1ZTogc3RyaW5nKSB7XG4gICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5jb21tYW5kc1t0aGlzLmNvbW1hbmRzLmxlbmd0aCAtIDFdLnJlc3BvbnNlID0gdmFsdWU7XG4gICAgICAgICAgICB0aGlzLmNvbW1hbmRQcm9jZXNzZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIGhhbmRsZUNvbW1hbmQoZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICAgICAgaWYgKGV2ZW50LmtleUNvZGUgPT0gMTMpIHtcbiAgICAgICAgICAgIHRoaXMuY29tbWFuZHMucHVzaCh7dGV4dDogdGhpcy5jb21tYW5kfSk7XG4gICAgICAgICAgICB0aGlzLnRlcm1pbmFsU2VydmljZS5zZW5kQ29tbWFuZCh0aGlzLmNvbW1hbmQpO1xuICAgICAgICAgICAgdGhpcy5jb21tYW5kID0gJyc7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgZm9jdXMoZWxlbWVudDogSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgZWxlbWVudC5mb2N1cygpO1xuICAgIH1cbiAgICBcbiAgICBuZ09uRGVzdHJveSgpIHtcbiAgICAgICAgaWYgKHRoaXMuc3Vic2NyaXB0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxufVxuXG5ATmdNb2R1bGUoe1xuICAgIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsRm9ybXNNb2R1bGVdLFxuICAgIGV4cG9ydHM6IFtUZXJtaW5hbF0sXG4gICAgZGVjbGFyYXRpb25zOiBbVGVybWluYWxdXG59KVxuZXhwb3J0IGNsYXNzIFRlcm1pbmFsTW9kdWxlIHsgfSJdfQ==