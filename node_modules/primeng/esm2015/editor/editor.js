import { NgModule, Component, ElementRef, AfterViewInit, Input, Output, EventEmitter, ContentChild, forwardRef, ChangeDetectionStrategy, ViewEncapsulation, ContentChildren, QueryList, AfterContentInit, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule, Header, PrimeTemplate } from 'primeng/api';
import { DomHandler } from 'primeng/dom';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import * as Quill from "quill";
export const EDITOR_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => Editor),
    multi: true
};
export class Editor {
    constructor(el) {
        this.el = el;
        this.onTextChange = new EventEmitter();
        this.onSelectionChange = new EventEmitter();
        this.onInit = new EventEmitter();
        this.onModelChange = () => { };
        this.onModelTouched = () => { };
    }
    ngAfterViewInit() {
        let editorElement = DomHandler.findSingle(this.el.nativeElement, 'div.p-editor-content');
        let toolbarElement = DomHandler.findSingle(this.el.nativeElement, 'div.p-editor-toolbar');
        let defaultModule = { toolbar: toolbarElement };
        let modules = this.modules ? Object.assign(Object.assign({}, defaultModule), this.modules) : defaultModule;
        this.quill = new Quill(editorElement, {
            modules: modules,
            placeholder: this.placeholder,
            readOnly: this.readonly,
            theme: 'snow',
            formats: this.formats,
            bounds: this.bounds,
            debug: this.debug,
            scrollingContainer: this.scrollingContainer
        });
        if (this.value) {
            this.quill.pasteHTML(this.value);
        }
        this.quill.on('text-change', (delta, oldContents, source) => {
            if (source === 'user') {
                let html = editorElement.children[0].innerHTML;
                let text = this.quill.getText().trim();
                if (html === '<p><br></p>') {
                    html = null;
                }
                this.onTextChange.emit({
                    htmlValue: html,
                    textValue: text,
                    delta: delta,
                    source: source
                });
                this.onModelChange(html);
                this.onModelTouched();
            }
        });
        this.quill.on('selection-change', (range, oldRange, source) => {
            this.onSelectionChange.emit({
                range: range,
                oldRange: oldRange,
                source: source
            });
        });
        this.onInit.emit({
            editor: this.quill
        });
    }
    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'toolbar':
                    this.toolbarTemplate = item.template;
                    break;
            }
        });
    }
    writeValue(value) {
        this.value = value;
        if (this.quill) {
            if (value)
                this.quill.pasteHTML(value);
            else
                this.quill.setText('');
        }
    }
    registerOnChange(fn) {
        this.onModelChange = fn;
    }
    registerOnTouched(fn) {
        this.onModelTouched = fn;
    }
    getQuill() {
        return this.quill;
    }
    get readonly() {
        return this._readonly;
    }
    set readonly(val) {
        this._readonly = val;
        if (this.quill) {
            if (this._readonly)
                this.quill.disable();
            else
                this.quill.enable();
        }
    }
}
Editor.ctorParameters = () => [
    { type: ElementRef }
];
Editor.decorators = [
    { type: Component, args: [{
                selector: 'p-editor',
                template: `
        <div [ngClass]="'p-editor-container'" [class]="styleClass">
            <div class="p-editor-toolbar" *ngIf="toolbar || toolbarTemplate">
                <ng-content select="p-header"></ng-content>
                <ng-container *ngTemplateOutlet="headerTemplate"></ng-container>
            </div>
            <div class="p-editor-toolbar" *ngIf="!toolbar && !toolbarTemplate">
                <span class="ql-formats">
                    <select class="ql-header">
                      <option value="1">Heading</option>
                      <option value="2">Subheading</option>
                      <option selected>Normal</option>
                    </select>
                    <select class="ql-font">
                      <option selected>Sans Serif</option>
                      <option value="serif">Serif</option>
                      <option value="monospace">Monospace</option>
                    </select>
                </span>
                <span class="ql-formats">
                    <button class="ql-bold" aria-label="Bold" type="button"></button>
                    <button class="ql-italic" aria-label="Italic" type="button"></button>
                    <button class="ql-underline" aria-label="Underline" type="button"></button>
                </span>
                <span class="ql-formats">
                    <select class="ql-color"></select>
                    <select class="ql-background"></select>
                </span>
                <span class="ql-formats">
                    <button class="ql-list" value="ordered" aria-label="Ordered List" type="button"></button>
                    <button class="ql-list" value="bullet" aria-label="Unordered List" type="button"></button>
                    <select class="ql-align">
                        <option selected></option>
                        <option value="center"></option>
                        <option value="right"></option>
                        <option value="justify"></option>
                    </select>
                </span>
                <span class="ql-formats">
                    <button class="ql-link" aria-label="Insert Link" type="button"></button>
                    <button class="ql-image" aria-label="Insert Image" type="button"></button>
                    <button class="ql-code-block" aria-label="Insert Code Block" type="button"></button>
                </span>
                <span class="ql-formats">
                    <button class="ql-clean" aria-label="Remove Styles" type="button"></button>
                </span>
            </div>
            <div class="p-editor-content" [ngStyle]="style"></div>
        </div>
    `,
                providers: [EDITOR_VALUE_ACCESSOR],
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None
            },] }
];
Editor.ctorParameters = () => [
    { type: ElementRef }
];
Editor.propDecorators = {
    onTextChange: [{ type: Output }],
    onSelectionChange: [{ type: Output }],
    toolbar: [{ type: ContentChild, args: [Header,] }],
    style: [{ type: Input }],
    styleClass: [{ type: Input }],
    placeholder: [{ type: Input }],
    formats: [{ type: Input }],
    modules: [{ type: Input }],
    bounds: [{ type: Input }],
    scrollingContainer: [{ type: Input }],
    debug: [{ type: Input }],
    onInit: [{ type: Output }],
    templates: [{ type: ContentChildren, args: [PrimeTemplate,] }],
    readonly: [{ type: Input }]
};
export class EditorModule {
}
EditorModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule],
                exports: [Editor, SharedModule],
                declarations: [Editor]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdG9yLmpzIiwic291cmNlUm9vdCI6Im5nOi8vcHJpbWVuZy9lZGl0b3IvIiwic291cmNlcyI6WyJlZGl0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFFBQVEsRUFBQyxTQUFTLEVBQUMsVUFBVSxFQUFDLGFBQWEsRUFBQyxLQUFLLEVBQUMsTUFBTSxFQUFDLFlBQVksRUFBQyxZQUFZLEVBQUMsVUFBVSxFQUFDLHVCQUF1QixFQUFFLGlCQUFpQixFQUFFLGVBQWUsRUFBRSxTQUFTLEVBQUUsZ0JBQWdCLEVBQUUsV0FBVyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ2xPLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUM3QyxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sRUFBRSxhQUFhLEVBQUMsTUFBTSxhQUFhLENBQUE7QUFDOUQsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUN2QyxPQUFPLEVBQUMsaUJBQWlCLEVBQXVCLE1BQU0sZ0JBQWdCLENBQUM7QUFDdkUsT0FBTyxLQUFLLEtBQUssTUFBTSxPQUFPLENBQUM7QUFFL0IsTUFBTSxDQUFDLE1BQU0scUJBQXFCLEdBQVE7SUFDeEMsT0FBTyxFQUFFLGlCQUFpQjtJQUMxQixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQztJQUNyQyxLQUFLLEVBQUUsSUFBSTtDQUNaLENBQUM7QUEwREYsTUFBTSxPQUFPLE1BQU07SUF3Q2YsWUFBbUIsRUFBYztRQUFkLE9BQUUsR0FBRixFQUFFLENBQVk7UUF0Q3ZCLGlCQUFZLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFFckQsc0JBQWlCLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFvQjFELFdBQU0sR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQVF6RCxrQkFBYSxHQUFhLEdBQUcsRUFBRSxHQUFFLENBQUMsQ0FBQztRQUVuQyxtQkFBYyxHQUFhLEdBQUcsRUFBRSxHQUFFLENBQUMsQ0FBQztJQU1BLENBQUM7SUFFckMsZUFBZTtRQUNYLElBQUksYUFBYSxHQUFHLFVBQVUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsc0JBQXNCLENBQUMsQ0FBQztRQUN6RixJQUFJLGNBQWMsR0FBRyxVQUFVLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLHNCQUFzQixDQUFDLENBQUM7UUFDMUYsSUFBSSxhQUFhLEdBQUksRUFBQyxPQUFPLEVBQUUsY0FBYyxFQUFDLENBQUM7UUFDL0MsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLGlDQUFLLGFBQWEsR0FBSyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUM7UUFFakYsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxhQUFhLEVBQUU7WUFDbEMsT0FBTyxFQUFFLE9BQU87WUFDaEIsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXO1lBQzdCLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtZQUN2QixLQUFLLEVBQUUsTUFBTTtZQUNiLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTztZQUNyQixNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07WUFDbkIsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO1lBQ2pCLGtCQUFrQixFQUFFLElBQUksQ0FBQyxrQkFBa0I7U0FDOUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ1osSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ3BDO1FBRUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLENBQUMsS0FBSyxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUUsRUFBRTtZQUN4RCxJQUFJLE1BQU0sS0FBSyxNQUFNLEVBQUU7Z0JBQ25CLElBQUksSUFBSSxHQUFHLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO2dCQUMvQyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUN2QyxJQUFJLElBQUksS0FBSyxhQUFhLEVBQUU7b0JBQ3hCLElBQUksR0FBRyxJQUFJLENBQUM7aUJBQ2Y7Z0JBRUQsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUM7b0JBQ25CLFNBQVMsRUFBRSxJQUFJO29CQUNmLFNBQVMsRUFBRSxJQUFJO29CQUNmLEtBQUssRUFBRSxLQUFLO29CQUNaLE1BQU0sRUFBRSxNQUFNO2lCQUNqQixDQUFDLENBQUM7Z0JBRUgsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDekIsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO2FBQ3pCO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDMUQsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQztnQkFDeEIsS0FBSyxFQUFFLEtBQUs7Z0JBQ1osUUFBUSxFQUFFLFFBQVE7Z0JBQ2xCLE1BQU0sRUFBRSxNQUFNO2FBQ2pCLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDYixNQUFNLEVBQUUsSUFBSSxDQUFDLEtBQUs7U0FDckIsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELGtCQUFrQjtRQUNkLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7WUFDNUIsUUFBTyxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUU7Z0JBQ25CLEtBQUssU0FBUztvQkFDVixJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7b0JBQ3pDLE1BQU07YUFDVDtRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELFVBQVUsQ0FBQyxLQUFVO1FBQ2pCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBRW5CLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNaLElBQUksS0FBSztnQkFDTCxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQzs7Z0JBRTVCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQzlCO0lBQ0wsQ0FBQztJQUVELGdCQUFnQixDQUFDLEVBQVk7UUFDekIsSUFBSSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7SUFDNUIsQ0FBQztJQUVELGlCQUFpQixDQUFDLEVBQVk7UUFDMUIsSUFBSSxDQUFDLGNBQWMsR0FBRyxFQUFFLENBQUM7SUFDN0IsQ0FBQztJQUVELFFBQVE7UUFDSixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDdEIsQ0FBQztJQUVELElBQWEsUUFBUTtRQUNqQixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7SUFDMUIsQ0FBQztJQUVELElBQUksUUFBUSxDQUFDLEdBQVc7UUFDcEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUM7UUFFckIsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ1osSUFBSSxJQUFJLENBQUMsU0FBUztnQkFDZCxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDOztnQkFFckIsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUMzQjtJQUNMLENBQUM7OztZQXRHc0IsVUFBVTs7O1lBaEdwQyxTQUFTLFNBQUM7Z0JBQ1AsUUFBUSxFQUFFLFVBQVU7Z0JBQ3BCLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztLQWlEVDtnQkFDRCxTQUFTLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQztnQkFDbEMsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07Z0JBQy9DLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO2FBQ3hDOzs7WUFwRTBCLFVBQVU7OzsyQkF1RWhDLE1BQU07Z0NBRU4sTUFBTTtzQkFFTixZQUFZLFNBQUMsTUFBTTtvQkFFbkIsS0FBSzt5QkFFTCxLQUFLOzBCQUVMLEtBQUs7c0JBRUwsS0FBSztzQkFFTCxLQUFLO3FCQUVMLEtBQUs7aUNBRUwsS0FBSztvQkFFTCxLQUFLO3FCQUVMLE1BQU07d0JBRU4sZUFBZSxTQUFDLGFBQWE7dUJBdUc3QixLQUFLOztBQXFCVixNQUFNLE9BQU8sWUFBWTs7O1lBTHhCLFFBQVEsU0FBQztnQkFDTixPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7Z0JBQ3ZCLE9BQU8sRUFBRSxDQUFDLE1BQU0sRUFBQyxZQUFZLENBQUM7Z0JBQzlCLFlBQVksRUFBRSxDQUFDLE1BQU0sQ0FBQzthQUN6QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7TmdNb2R1bGUsQ29tcG9uZW50LEVsZW1lbnRSZWYsQWZ0ZXJWaWV3SW5pdCxJbnB1dCxPdXRwdXQsRXZlbnRFbWl0dGVyLENvbnRlbnRDaGlsZCxmb3J3YXJkUmVmLENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBWaWV3RW5jYXBzdWxhdGlvbiwgQ29udGVudENoaWxkcmVuLCBRdWVyeUxpc3QsIEFmdGVyQ29udGVudEluaXQsIFRlbXBsYXRlUmVmfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtTaGFyZWRNb2R1bGUsSGVhZGVyLCBQcmltZVRlbXBsYXRlfSBmcm9tICdwcmltZW5nL2FwaSdcbmltcG9ydCB7RG9tSGFuZGxlcn0gZnJvbSAncHJpbWVuZy9kb20nO1xuaW1wb3J0IHtOR19WQUxVRV9BQ0NFU1NPUiwgQ29udHJvbFZhbHVlQWNjZXNzb3J9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCAqIGFzIFF1aWxsIGZyb20gXCJxdWlsbFwiO1xuXG5leHBvcnQgY29uc3QgRURJVE9SX1ZBTFVFX0FDQ0VTU09SOiBhbnkgPSB7XG4gIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBFZGl0b3IpLFxuICBtdWx0aTogdHJ1ZVxufTtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdwLWVkaXRvcicsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPGRpdiBbbmdDbGFzc109XCIncC1lZGl0b3ItY29udGFpbmVyJ1wiIFtjbGFzc109XCJzdHlsZUNsYXNzXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicC1lZGl0b3ItdG9vbGJhclwiICpuZ0lmPVwidG9vbGJhciB8fCB0b29sYmFyVGVtcGxhdGVcIj5cbiAgICAgICAgICAgICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJwLWhlYWRlclwiPjwvbmctY29udGVudD5cbiAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiaGVhZGVyVGVtcGxhdGVcIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInAtZWRpdG9yLXRvb2xiYXJcIiAqbmdJZj1cIiF0b29sYmFyICYmICF0b29sYmFyVGVtcGxhdGVcIj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInFsLWZvcm1hdHNcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNlbGVjdCBjbGFzcz1cInFsLWhlYWRlclwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCIxXCI+SGVhZGluZzwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCIyXCI+U3ViaGVhZGluZzwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gc2VsZWN0ZWQ+Tm9ybWFsPC9vcHRpb24+XG4gICAgICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxuICAgICAgICAgICAgICAgICAgICA8c2VsZWN0IGNsYXNzPVwicWwtZm9udFwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gc2VsZWN0ZWQ+U2FucyBTZXJpZjwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJzZXJpZlwiPlNlcmlmPC9vcHRpb24+XG4gICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIm1vbm9zcGFjZVwiPk1vbm9zcGFjZTwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJxbC1mb3JtYXRzXCI+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJxbC1ib2xkXCIgYXJpYS1sYWJlbD1cIkJvbGRcIiB0eXBlPVwiYnV0dG9uXCI+PC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJxbC1pdGFsaWNcIiBhcmlhLWxhYmVsPVwiSXRhbGljXCIgdHlwZT1cImJ1dHRvblwiPjwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwicWwtdW5kZXJsaW5lXCIgYXJpYS1sYWJlbD1cIlVuZGVybGluZVwiIHR5cGU9XCJidXR0b25cIj48L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJxbC1mb3JtYXRzXCI+XG4gICAgICAgICAgICAgICAgICAgIDxzZWxlY3QgY2xhc3M9XCJxbC1jb2xvclwiPjwvc2VsZWN0PlxuICAgICAgICAgICAgICAgICAgICA8c2VsZWN0IGNsYXNzPVwicWwtYmFja2dyb3VuZFwiPjwvc2VsZWN0PlxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInFsLWZvcm1hdHNcIj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cInFsLWxpc3RcIiB2YWx1ZT1cIm9yZGVyZWRcIiBhcmlhLWxhYmVsPVwiT3JkZXJlZCBMaXN0XCIgdHlwZT1cImJ1dHRvblwiPjwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwicWwtbGlzdFwiIHZhbHVlPVwiYnVsbGV0XCIgYXJpYS1sYWJlbD1cIlVub3JkZXJlZCBMaXN0XCIgdHlwZT1cImJ1dHRvblwiPjwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8c2VsZWN0IGNsYXNzPVwicWwtYWxpZ25cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gc2VsZWN0ZWQ+PC9vcHRpb24+XG4gICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiY2VudGVyXCI+PC9vcHRpb24+XG4gICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwicmlnaHRcIj48L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJqdXN0aWZ5XCI+PC9vcHRpb24+XG4gICAgICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInFsLWZvcm1hdHNcIj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cInFsLWxpbmtcIiBhcmlhLWxhYmVsPVwiSW5zZXJ0IExpbmtcIiB0eXBlPVwiYnV0dG9uXCI+PC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJxbC1pbWFnZVwiIGFyaWEtbGFiZWw9XCJJbnNlcnQgSW1hZ2VcIiB0eXBlPVwiYnV0dG9uXCI+PC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJxbC1jb2RlLWJsb2NrXCIgYXJpYS1sYWJlbD1cIkluc2VydCBDb2RlIEJsb2NrXCIgdHlwZT1cImJ1dHRvblwiPjwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInFsLWZvcm1hdHNcIj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cInFsLWNsZWFuXCIgYXJpYS1sYWJlbD1cIlJlbW92ZSBTdHlsZXNcIiB0eXBlPVwiYnV0dG9uXCI+PC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicC1lZGl0b3ItY29udGVudFwiIFtuZ1N0eWxlXT1cInN0eWxlXCI+PC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIGAsXG4gICAgcHJvdmlkZXJzOiBbRURJVE9SX1ZBTFVFX0FDQ0VTU09SXSxcbiAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lXG59KVxuZXhwb3J0IGNsYXNzIEVkaXRvciBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsQWZ0ZXJDb250ZW50SW5pdCxDb250cm9sVmFsdWVBY2Nlc3NvciB7XG4gICAgICAgIFxuICAgIEBPdXRwdXQoKSBvblRleHRDaGFuZ2U6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgIFxuICAgIEBPdXRwdXQoKSBvblNlbGVjdGlvbkNoYW5nZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgXG4gICAgQENvbnRlbnRDaGlsZChIZWFkZXIpIHRvb2xiYXI7XG4gICAgXG4gICAgQElucHV0KCkgc3R5bGU6IGFueTtcbiAgICAgICAgXG4gICAgQElucHV0KCkgc3R5bGVDbGFzczogc3RyaW5nO1xuICAgIFxuICAgIEBJbnB1dCgpIHBsYWNlaG9sZGVyOiBzdHJpbmc7XG4gICAgXG4gICAgQElucHV0KCkgZm9ybWF0czogc3RyaW5nW107XG5cbiAgICBASW5wdXQoKSBtb2R1bGVzOiBhbnk7XG5cbiAgICBASW5wdXQoKSBib3VuZHM6IGFueTtcblxuICAgIEBJbnB1dCgpIHNjcm9sbGluZ0NvbnRhaW5lcjogYW55O1xuXG4gICAgQElucHV0KCkgZGVidWc6IHN0cmluZztcbiAgICBcbiAgICBAT3V0cHV0KCkgb25Jbml0OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBDb250ZW50Q2hpbGRyZW4oUHJpbWVUZW1wbGF0ZSkgdGVtcGxhdGVzOiBRdWVyeUxpc3Q8YW55PjtcbiAgICBcbiAgICB2YWx1ZTogc3RyaW5nO1xuICAgIFxuICAgIF9yZWFkb25seTogYm9vbGVhbjtcbiAgICBcbiAgICBvbk1vZGVsQ2hhbmdlOiBGdW5jdGlvbiA9ICgpID0+IHt9O1xuICAgIFxuICAgIG9uTW9kZWxUb3VjaGVkOiBGdW5jdGlvbiA9ICgpID0+IHt9O1xuICAgIFxuICAgIHF1aWxsOiBhbnk7XG5cbiAgICB0b29sYmFyVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG4gICAgXG4gICAgY29uc3RydWN0b3IocHVibGljIGVsOiBFbGVtZW50UmVmKSB7fVxuXG4gICAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgICAgICBsZXQgZWRpdG9yRWxlbWVudCA9IERvbUhhbmRsZXIuZmluZFNpbmdsZSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQgLCdkaXYucC1lZGl0b3ItY29udGVudCcpOyBcbiAgICAgICAgbGV0IHRvb2xiYXJFbGVtZW50ID0gRG9tSGFuZGxlci5maW5kU2luZ2xlKHRoaXMuZWwubmF0aXZlRWxlbWVudCAsJ2Rpdi5wLWVkaXRvci10b29sYmFyJyk7IFxuICAgICAgICBsZXQgZGVmYXVsdE1vZHVsZSAgPSB7dG9vbGJhcjogdG9vbGJhckVsZW1lbnR9O1xuICAgICAgICBsZXQgbW9kdWxlcyA9IHRoaXMubW9kdWxlcyA/IHsuLi5kZWZhdWx0TW9kdWxlLCAuLi50aGlzLm1vZHVsZXN9IDogZGVmYXVsdE1vZHVsZTtcblxuICAgICAgICB0aGlzLnF1aWxsID0gbmV3IFF1aWxsKGVkaXRvckVsZW1lbnQsIHtcbiAgICAgICAgICAgIG1vZHVsZXM6IG1vZHVsZXMsXG4gICAgICAgICAgICBwbGFjZWhvbGRlcjogdGhpcy5wbGFjZWhvbGRlcixcbiAgICAgICAgICAgIHJlYWRPbmx5OiB0aGlzLnJlYWRvbmx5LFxuICAgICAgICAgICAgdGhlbWU6ICdzbm93JyxcbiAgICAgICAgICAgIGZvcm1hdHM6IHRoaXMuZm9ybWF0cyxcbiAgICAgICAgICAgIGJvdW5kczogdGhpcy5ib3VuZHMsXG4gICAgICAgICAgICBkZWJ1ZzogdGhpcy5kZWJ1ZyxcbiAgICAgICAgICAgIHNjcm9sbGluZ0NvbnRhaW5lcjogdGhpcy5zY3JvbGxpbmdDb250YWluZXJcbiAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgIGlmICh0aGlzLnZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLnF1aWxsLnBhc3RlSFRNTCh0aGlzLnZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgdGhpcy5xdWlsbC5vbigndGV4dC1jaGFuZ2UnLCAoZGVsdGEsIG9sZENvbnRlbnRzLCBzb3VyY2UpID0+IHtcbiAgICAgICAgICAgIGlmIChzb3VyY2UgPT09ICd1c2VyJykge1xuICAgICAgICAgICAgICAgIGxldCBodG1sID0gZWRpdG9yRWxlbWVudC5jaGlsZHJlblswXS5pbm5lckhUTUw7XG4gICAgICAgICAgICAgICAgbGV0IHRleHQgPSB0aGlzLnF1aWxsLmdldFRleHQoKS50cmltKCk7XG4gICAgICAgICAgICAgICAgaWYgKGh0bWwgPT09ICc8cD48YnI+PC9wPicpIHtcbiAgICAgICAgICAgICAgICAgICAgaHRtbCA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5vblRleHRDaGFuZ2UuZW1pdCh7XG4gICAgICAgICAgICAgICAgICAgIGh0bWxWYWx1ZTogaHRtbCxcbiAgICAgICAgICAgICAgICAgICAgdGV4dFZhbHVlOiB0ZXh0LFxuICAgICAgICAgICAgICAgICAgICBkZWx0YTogZGVsdGEsXG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZTogc291cmNlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdGhpcy5vbk1vZGVsQ2hhbmdlKGh0bWwpO1xuICAgICAgICAgICAgICAgIHRoaXMub25Nb2RlbFRvdWNoZWQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLnF1aWxsLm9uKCdzZWxlY3Rpb24tY2hhbmdlJywgKHJhbmdlLCBvbGRSYW5nZSwgc291cmNlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLm9uU2VsZWN0aW9uQ2hhbmdlLmVtaXQoe1xuICAgICAgICAgICAgICAgIHJhbmdlOiByYW5nZSxcbiAgICAgICAgICAgICAgICBvbGRSYW5nZTogb2xkUmFuZ2UsXG4gICAgICAgICAgICAgICAgc291cmNlOiBzb3VyY2VcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMub25Jbml0LmVtaXQoe1xuICAgICAgICAgICAgZWRpdG9yOiB0aGlzLnF1aWxsXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICAgICAgc3dpdGNoKGl0ZW0uZ2V0VHlwZSgpKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAndG9vbGJhcic6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudG9vbGJhclRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgICAgICBcbiAgICB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpIDogdm9pZCB7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgaWYgKHRoaXMucXVpbGwpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSlcbiAgICAgICAgICAgICAgICB0aGlzLnF1aWxsLnBhc3RlSFRNTCh2YWx1ZSk7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgdGhpcy5xdWlsbC5zZXRUZXh0KCcnKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICByZWdpc3Rlck9uQ2hhbmdlKGZuOiBGdW5jdGlvbik6IHZvaWQge1xuICAgICAgICB0aGlzLm9uTW9kZWxDaGFuZ2UgPSBmbjtcbiAgICB9XG5cbiAgICByZWdpc3Rlck9uVG91Y2hlZChmbjogRnVuY3Rpb24pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5vbk1vZGVsVG91Y2hlZCA9IGZuO1xuICAgIH1cbiAgICBcbiAgICBnZXRRdWlsbCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucXVpbGw7XG4gICAgfVxuICAgIFxuICAgIEBJbnB1dCgpIGdldCByZWFkb25seSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlYWRvbmx5O1xuICAgIH1cblxuICAgIHNldCByZWFkb25seSh2YWw6Ym9vbGVhbikge1xuICAgICAgICB0aGlzLl9yZWFkb25seSA9IHZhbDtcbiAgICAgICAgXG4gICAgICAgIGlmICh0aGlzLnF1aWxsKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fcmVhZG9ubHkpXG4gICAgICAgICAgICAgICAgdGhpcy5xdWlsbC5kaXNhYmxlKCk7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgdGhpcy5xdWlsbC5lbmFibGUoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuQE5nTW9kdWxlKHtcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlXSxcbiAgICBleHBvcnRzOiBbRWRpdG9yLFNoYXJlZE1vZHVsZV0sXG4gICAgZGVjbGFyYXRpb25zOiBbRWRpdG9yXVxufSlcbmV4cG9ydCBjbGFzcyBFZGl0b3JNb2R1bGUgeyB9XG4iXX0=