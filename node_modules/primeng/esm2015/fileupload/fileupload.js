import { NgModule, Component, OnDestroy, Input, Output, EventEmitter, TemplateRef, AfterViewInit, AfterContentInit, ContentChildren, QueryList, ViewChild, ElementRef, NgZone, ChangeDetectionStrategy, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import { ProgressBarModule } from 'primeng/progressbar';
import { DomHandler } from 'primeng/dom';
import { PrimeTemplate, SharedModule } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';
import { HttpClient, HttpEvent, HttpEventType, HttpHeaders } from "@angular/common/http";
export class FileUpload {
    constructor(el, sanitizer, zone, http, cd) {
        this.el = el;
        this.sanitizer = sanitizer;
        this.zone = zone;
        this.http = http;
        this.cd = cd;
        this.method = 'POST';
        this.invalidFileSizeMessageSummary = '{0}: Invalid file size, ';
        this.invalidFileSizeMessageDetail = 'maximum upload size is {0}.';
        this.invalidFileTypeMessageSummary = '{0}: Invalid file type, ';
        this.invalidFileTypeMessageDetail = 'allowed file types: {0}.';
        this.invalidFileLimitMessageDetail = 'limit is {0} at most.';
        this.invalidFileLimitMessageSummary = 'Maximum number of files exceeded, ';
        this.previewWidth = 50;
        this.chooseLabel = 'Choose';
        this.uploadLabel = 'Upload';
        this.cancelLabel = 'Cancel';
        this.chooseIcon = 'pi pi-plus';
        this.uploadIcon = 'pi pi-upload';
        this.cancelIcon = 'pi pi-times';
        this.showUploadButton = true;
        this.showCancelButton = true;
        this.mode = 'advanced';
        this.onBeforeUpload = new EventEmitter();
        this.onSend = new EventEmitter();
        this.onUpload = new EventEmitter();
        this.onError = new EventEmitter();
        this.onClear = new EventEmitter();
        this.onRemove = new EventEmitter();
        this.onSelect = new EventEmitter();
        this.onProgress = new EventEmitter();
        this.uploadHandler = new EventEmitter();
        this._files = [];
        this.progress = 0;
        this.uploadedFileCount = 0;
    }
    set files(files) {
        this._files = [];
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            if (this.validate(file)) {
                if (this.isImage(file)) {
                    file.objectURL = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(files[i])));
                }
                this._files.push(files[i]);
            }
        }
    }
    get files() {
        return this._files;
    }
    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'file':
                    this.fileTemplate = item.template;
                    break;
                case 'content':
                    this.contentTemplate = item.template;
                    break;
                case 'toolbar':
                    this.toolbarTemplate = item.template;
                    break;
                default:
                    this.fileTemplate = item.template;
                    break;
            }
        });
    }
    ngAfterViewInit() {
        if (this.mode === 'advanced') {
            this.zone.runOutsideAngular(() => {
                if (this.content)
                    this.content.nativeElement.addEventListener('dragover', this.onDragOver.bind(this));
            });
        }
    }
    choose() {
        this.advancedFileInput.nativeElement.click();
    }
    onFileSelect(event) {
        if (event.type !== 'drop' && this.isIE11() && this.duplicateIEEvent) {
            this.duplicateIEEvent = false;
            return;
        }
        this.msgs = [];
        if (!this.multiple) {
            this.files = [];
        }
        let files = event.dataTransfer ? event.dataTransfer.files : event.target.files;
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            if (!this.isFileSelected(file)) {
                if (this.validate(file)) {
                    if (this.isImage(file)) {
                        file.objectURL = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(files[i])));
                    }
                    this.files.push(files[i]);
                }
            }
        }
        this.onSelect.emit({ originalEvent: event, files: files, currentFiles: this.files });
        if (this.fileLimit && this.mode == "advanced") {
            this.checkFileLimit();
        }
        if (this.hasFiles() && this.auto && (!(this.mode === "advanced") || !this.isFileLimitExceeded())) {
            this.upload();
        }
        if (event.type !== 'drop' && this.isIE11()) {
            this.clearIEInput();
        }
        else {
            this.clearInputElement();
        }
    }
    isFileSelected(file) {
        for (let sFile of this.files) {
            if ((sFile.name + sFile.type + sFile.size) === (file.name + file.type + file.size)) {
                return true;
            }
        }
        return false;
    }
    isIE11() {
        return !!window['MSInputMethodContext'] && !!document['documentMode'];
    }
    validate(file) {
        if (this.accept && !this.isFileTypeValid(file)) {
            this.msgs.push({
                severity: 'error',
                summary: this.invalidFileTypeMessageSummary.replace('{0}', file.name),
                detail: this.invalidFileTypeMessageDetail.replace('{0}', this.accept)
            });
            return false;
        }
        if (this.maxFileSize && file.size > this.maxFileSize) {
            this.msgs.push({
                severity: 'error',
                summary: this.invalidFileSizeMessageSummary.replace('{0}', file.name),
                detail: this.invalidFileSizeMessageDetail.replace('{0}', this.formatSize(this.maxFileSize))
            });
            return false;
        }
        return true;
    }
    isFileTypeValid(file) {
        let acceptableTypes = this.accept.split(',').map(type => type.trim());
        for (let type of acceptableTypes) {
            let acceptable = this.isWildcard(type) ? this.getTypeClass(file.type) === this.getTypeClass(type)
                : file.type == type || this.getFileExtension(file).toLowerCase() === type.toLowerCase();
            if (acceptable) {
                return true;
            }
        }
        return false;
    }
    getTypeClass(fileType) {
        return fileType.substring(0, fileType.indexOf('/'));
    }
    isWildcard(fileType) {
        return fileType.indexOf('*') !== -1;
    }
    getFileExtension(file) {
        return '.' + file.name.split('.').pop();
    }
    isImage(file) {
        return /^image\//.test(file.type);
    }
    onImageLoad(img) {
        window.URL.revokeObjectURL(img.src);
    }
    upload() {
        if (this.customUpload) {
            if (this.fileLimit) {
                this.uploadedFileCount += this.files.length;
            }
            this.uploadHandler.emit({
                files: this.files
            });
            this.cd.markForCheck();
        }
        else {
            this.uploading = true;
            this.msgs = [];
            let formData = new FormData();
            this.onBeforeUpload.emit({
                'formData': formData
            });
            for (let i = 0; i < this.files.length; i++) {
                formData.append(this.name, this.files[i], this.files[i].name);
            }
            this.http.post(this.url, formData, {
                headers: this.headers, reportProgress: true, observe: 'events', withCredentials: this.withCredentials
            }).subscribe((event) => {
                switch (event.type) {
                    case HttpEventType.Sent:
                        this.onSend.emit({
                            originalEvent: event,
                            'formData': formData
                        });
                        break;
                    case HttpEventType.Response:
                        this.uploading = false;
                        this.progress = 0;
                        if (event['status'] >= 200 && event['status'] < 300) {
                            if (this.fileLimit) {
                                this.uploadedFileCount += this.files.length;
                            }
                            this.onUpload.emit({ originalEvent: event, files: this.files });
                        }
                        else {
                            this.onError.emit({ files: this.files });
                        }
                        this.clear();
                        break;
                    case HttpEventType.UploadProgress: {
                        if (event['loaded']) {
                            this.progress = Math.round((event['loaded'] * 100) / event['total']);
                        }
                        this.onProgress.emit({ originalEvent: event, progress: this.progress });
                        break;
                    }
                }
                this.cd.markForCheck();
            }, error => {
                this.uploading = false;
                this.onError.emit({ files: this.files, error: error });
            });
        }
    }
    clear() {
        this.files = [];
        this.onClear.emit();
        this.clearInputElement();
        this.cd.markForCheck();
    }
    remove(event, index) {
        this.clearInputElement();
        this.onRemove.emit({ originalEvent: event, file: this.files[index] });
        this.files.splice(index, 1);
    }
    isFileLimitExceeded() {
        if (this.fileLimit && this.fileLimit <= this.files.length + this.uploadedFileCount && this.focus) {
            this.focus = false;
        }
        return this.fileLimit && this.fileLimit < this.files.length + this.uploadedFileCount;
    }
    isChooseDisabled() {
        return this.fileLimit && this.fileLimit <= this.files.length + this.uploadedFileCount;
    }
    checkFileLimit() {
        if (this.isFileLimitExceeded()) {
            this.msgs.push({
                severity: 'error',
                summary: this.invalidFileLimitMessageSummary.replace('{0}', this.fileLimit.toString()),
                detail: this.invalidFileLimitMessageDetail.replace('{0}', this.fileLimit.toString())
            });
        }
    }
    clearInputElement() {
        if (this.advancedFileInput && this.advancedFileInput.nativeElement) {
            this.advancedFileInput.nativeElement.value = '';
        }
        if (this.basicFileInput && this.basicFileInput.nativeElement) {
            this.basicFileInput.nativeElement.value = '';
        }
    }
    clearIEInput() {
        if (this.advancedFileInput && this.advancedFileInput.nativeElement) {
            this.duplicateIEEvent = true; //IE11 fix to prevent onFileChange trigger again
            this.advancedFileInput.nativeElement.value = '';
        }
    }
    hasFiles() {
        return this.files && this.files.length > 0;
    }
    onDragEnter(e) {
        if (!this.disabled) {
            e.stopPropagation();
            e.preventDefault();
        }
    }
    onDragOver(e) {
        if (!this.disabled) {
            DomHandler.addClass(this.content.nativeElement, 'p-fileupload-highlight');
            this.dragHighlight = true;
            e.stopPropagation();
            e.preventDefault();
        }
    }
    onDragLeave(event) {
        if (!this.disabled) {
            DomHandler.removeClass(this.content.nativeElement, 'p-fileupload-highlight');
        }
    }
    onDrop(event) {
        if (!this.disabled) {
            DomHandler.removeClass(this.content.nativeElement, 'p-fileupload-highlight');
            event.stopPropagation();
            event.preventDefault();
            let files = event.dataTransfer ? event.dataTransfer.files : event.target.files;
            let allowDrop = this.multiple || (files && files.length === 1);
            if (allowDrop) {
                this.onFileSelect(event);
            }
        }
    }
    onFocus() {
        this.focus = true;
    }
    onBlur() {
        this.focus = false;
    }
    formatSize(bytes) {
        if (bytes == 0) {
            return '0 B';
        }
        let k = 1024, dm = 3, sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'], i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
    onBasicUploaderClick(event) {
        if (this.hasFiles())
            this.upload();
        else
            this.basicFileInput.nativeElement.click();
    }
    getBlockableElement() {
        return this.el.nativeElement.children[0];
    }
    ngOnDestroy() {
        if (this.content && this.content.nativeElement) {
            this.content.nativeElement.removeEventListener('dragover', this.onDragOver);
        }
    }
}
FileUpload.ctorParameters = () => [
    { type: ElementRef },
    { type: DomSanitizer },
    { type: NgZone },
    { type: HttpClient },
    { type: ChangeDetectorRef }
];
FileUpload.decorators = [
    { type: Component, args: [{
                selector: 'p-fileUpload',
                template: `
        <div [ngClass]="'p-fileupload p-fileupload-advanced p-component'" [ngStyle]="style" [class]="styleClass" *ngIf="mode === 'advanced'">
            <div class="p-fileupload-buttonbar">
                <span class="p-button p-component p-fileupload-choose" [ngClass]="{'p-focus': focus, 'p-disabled':disabled || isChooseDisabled()}" (focus)="onFocus()" (blur)="onBlur()" pRipple
                    (click)="choose()" (keydown.enter)="choose()" tabindex="0"> 
                    <input #advancedfileinput type="file" (change)="onFileSelect($event)" [multiple]="multiple" [accept]="accept" [disabled]="disabled || isChooseDisabled()" [attr.title]="''">
                    <span [ngClass]="'p-button-icon p-button-icon-left'" [class]="chooseIcon"></span>
                    <span class="p-button-label">{{chooseLabel}}</span>
                </span>

                <p-button *ngIf="!auto&&showUploadButton" type="button" [label]="uploadLabel" [icon]="uploadIcon" (onClick)="upload()" [disabled]="!hasFiles() || isFileLimitExceeded()"></p-button>
                <p-button *ngIf="!auto&&showCancelButton" type="button" [label]="cancelLabel" [icon]="cancelIcon" (onClick)="clear()" [disabled]="!hasFiles() || uploading"></p-button>

                <ng-container *ngTemplateOutlet="toolbarTemplate"></ng-container>
            </div>
            <div #content class="p-fileupload-content" (dragenter)="onDragEnter($event)" (dragleave)="onDragLeave($event)" (drop)="onDrop($event)">
                <p-progressBar [value]="progress" [showValue]="false" *ngIf="hasFiles()"></p-progressBar>

                <p-messages [value]="msgs" [enableService]="false"></p-messages>

                <div class="p-fileupload-files" *ngIf="hasFiles()">
                    <div *ngIf="!fileTemplate">
                        <div class="p-fileupload-row" *ngFor="let file of files; let i = index;">
                            <div><img [src]="file.objectURL" *ngIf="isImage(file)" [width]="previewWidth" /></div>
                            <div>{{file.name}}</div>
                            <div>{{formatSize(file.size)}}</div>
                            <div>
                                <button type="button" icon="pi pi-times" pButton (click)="remove($event,i)" [disabled]="uploading"></button>
                            </div>
                        </div>
                    </div>
                    <div *ngIf="fileTemplate">
                        <ng-template ngFor [ngForOf]="files" [ngForTemplate]="fileTemplate"></ng-template>
                    </div>
                </div>
                <ng-container *ngTemplateOutlet="contentTemplate"></ng-container>
            </div>
        </div>
        <div class="p-fileupload p-fileupload-basic p-component" *ngIf="mode === 'basic'">
            <p-messages [value]="msgs" [enableService]="false"></p-messages>
            <span [ngClass]="{'p-button p-component p-fileupload-choose': true, 'p-fil(eupload-choose-selected': hasFiles(),'p-focus': focus, 'p-disabled':disabled}"
                [ngStyle]="style" [class]="styleClass" (mouseup)="onBasicUploaderClick()" (keydown)="onBasicUploaderClick()" tabindex="0" pRipple>
                <span class="p-button-icon p-button-icon-left pi" [ngClass]="{'pi-plus': !hasFiles()||auto, 'pi-upload': hasFiles()&&!auto}"></span>
                <span class="p-button-label">{{auto ? chooseLabel : hasFiles() ? files[0].name : chooseLabel}}</span>
                <input #basicfileinput type="file" [accept]="accept" [multiple]="multiple" [disabled]="disabled"
                    (change)="onFileSelect($event)" *ngIf="!hasFiles()" (focus)="onFocus()" (blur)="onBlur()">
            </span>
        </div>
    `,
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                styles: [".p-fileupload-content{position:relative}.p-fileupload-row{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center}.p-fileupload-row>div{-ms-flex:1 1 auto;flex:1 1 auto;width:25%}.p-fileupload-row>div:last-child{text-align:right}.p-fileupload-content .p-progressbar{width:100%;position:absolute;top:0;left:0}.p-button.p-fileupload-choose{position:relative;overflow:hidden}.p-button.p-fileupload-choose input[type=file],.p-fileupload-choose.p-fileupload-choose-selected input[type=file]{display:none}.p-fluid .p-fileupload .p-button{width:auto}"]
            },] }
];
FileUpload.ctorParameters = () => [
    { type: ElementRef },
    { type: DomSanitizer },
    { type: NgZone },
    { type: HttpClient },
    { type: ChangeDetectorRef }
];
FileUpload.propDecorators = {
    name: [{ type: Input }],
    url: [{ type: Input }],
    method: [{ type: Input }],
    multiple: [{ type: Input }],
    accept: [{ type: Input }],
    disabled: [{ type: Input }],
    auto: [{ type: Input }],
    withCredentials: [{ type: Input }],
    maxFileSize: [{ type: Input }],
    invalidFileSizeMessageSummary: [{ type: Input }],
    invalidFileSizeMessageDetail: [{ type: Input }],
    invalidFileTypeMessageSummary: [{ type: Input }],
    invalidFileTypeMessageDetail: [{ type: Input }],
    invalidFileLimitMessageDetail: [{ type: Input }],
    invalidFileLimitMessageSummary: [{ type: Input }],
    style: [{ type: Input }],
    styleClass: [{ type: Input }],
    previewWidth: [{ type: Input }],
    chooseLabel: [{ type: Input }],
    uploadLabel: [{ type: Input }],
    cancelLabel: [{ type: Input }],
    chooseIcon: [{ type: Input }],
    uploadIcon: [{ type: Input }],
    cancelIcon: [{ type: Input }],
    showUploadButton: [{ type: Input }],
    showCancelButton: [{ type: Input }],
    mode: [{ type: Input }],
    headers: [{ type: Input }],
    customUpload: [{ type: Input }],
    fileLimit: [{ type: Input }],
    onBeforeUpload: [{ type: Output }],
    onSend: [{ type: Output }],
    onUpload: [{ type: Output }],
    onError: [{ type: Output }],
    onClear: [{ type: Output }],
    onRemove: [{ type: Output }],
    onSelect: [{ type: Output }],
    onProgress: [{ type: Output }],
    uploadHandler: [{ type: Output }],
    templates: [{ type: ContentChildren, args: [PrimeTemplate,] }],
    advancedFileInput: [{ type: ViewChild, args: ['advancedfileinput',] }],
    basicFileInput: [{ type: ViewChild, args: ['basicfileinput',] }],
    content: [{ type: ViewChild, args: ['content',] }],
    files: [{ type: Input }]
};
export class FileUploadModule {
}
FileUploadModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule, SharedModule, ButtonModule, ProgressBarModule, MessagesModule, RippleModule],
                exports: [FileUpload, SharedModule, ButtonModule, ProgressBarModule, MessagesModule],
                declarations: [FileUpload]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZXVwbG9hZC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL3ByaW1lbmcvZmlsZXVwbG9hZC8iLCJzb3VyY2VzIjpbImZpbGV1cGxvYWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFFBQVEsRUFBQyxTQUFTLEVBQUMsU0FBUyxFQUFDLEtBQUssRUFBQyxNQUFNLEVBQUMsWUFBWSxFQUFDLFdBQVcsRUFBQyxhQUFhLEVBQUMsZ0JBQWdCLEVBQzdGLGVBQWUsRUFBQyxTQUFTLEVBQUMsU0FBUyxFQUFDLFVBQVUsRUFBQyxNQUFNLEVBQUMsdUJBQXVCLEVBQUUsaUJBQWlCLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDdEosT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQzdDLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSwyQkFBMkIsQ0FBQztBQUN2RCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDNUMsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLGtCQUFrQixDQUFDO0FBQ2hELE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ3RELE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFFdkMsT0FBTyxFQUFDLGFBQWEsRUFBQyxZQUFZLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFFdkQsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQzVDLE9BQU8sRUFBQyxVQUFVLEVBQUUsU0FBUyxFQUFFLGFBQWEsRUFBRSxXQUFXLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQXlEdkYsTUFBTSxPQUFPLFVBQVU7SUFrSW5CLFlBQW9CLEVBQWMsRUFBUyxTQUF1QixFQUFTLElBQVksRUFBVSxJQUFnQixFQUFTLEVBQXFCO1FBQTNILE9BQUUsR0FBRixFQUFFLENBQVk7UUFBUyxjQUFTLEdBQVQsU0FBUyxDQUFjO1FBQVMs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RTFCLFNBQVMsU0FBQyxTQUFTO29CQUVuQixLQUFLOztBQThZVixNQUFNLE9BQU8sZ0JBQWdCOzs7WUFMNUIsUUFBUSxTQUFDO2dCQUNOLE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBQyxZQUFZLEVBQUMsWUFBWSxFQUFDLGlCQUFpQixFQUFDLGNBQWMsRUFBQyxZQUFZLENBQUM7Z0JBQy9GLE9BQU8sRUFBRSxDQUFDLFVBQVUsRUFBQyxZQUFZLEVBQUMsWUFBWSxFQUFDLGlCQUFpQixFQUFDLGNBQWMsQ0FBQztnQkFDaEYsWUFBWSxFQUFFLENBQUMsVUFBVSxDQUFDO2FBQzdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtOZ01vZHVsZSxDb21wb25lbnQsT25EZXN0cm95LElucHV0LE91dHB1dCxFdmVudEVtaXR0ZXIsVGVtcGxhdGVSZWYsQWZ0ZXJWaWV3SW5pdCxBZnRlckNvbnRlbnRJbml0LFxuICAgICAgICAgICAgQ29udGVudENoaWxkcmVuLFF1ZXJ5TGlzdCxWaWV3Q2hpbGQsRWxlbWVudFJlZixOZ1pvbmUsQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIFZpZXdFbmNhcHN1bGF0aW9uLCBDaGFuZ2VEZXRlY3RvclJlZn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7RG9tU2FuaXRpemVyfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcbmltcG9ydCB7QnV0dG9uTW9kdWxlfSBmcm9tICdwcmltZW5nL2J1dHRvbic7XG5pbXBvcnQge01lc3NhZ2VzTW9kdWxlfSBmcm9tICdwcmltZW5nL21lc3NhZ2VzJztcbmltcG9ydCB7UHJvZ3Jlc3NCYXJNb2R1bGV9IGZyb20gJ3ByaW1lbmcvcHJvZ3Jlc3NiYXInO1xuaW1wb3J0IHtEb21IYW5kbGVyfSBmcm9tICdwcmltZW5nL2RvbSc7XG5pbXBvcnQge01lc3NhZ2V9IGZyb20gJ3ByaW1lbmcvYXBpJztcbmltcG9ydCB7UHJpbWVUZW1wbGF0ZSxTaGFyZWRNb2R1bGV9IGZyb20gJ3ByaW1lbmcvYXBpJztcbmltcG9ydCB7QmxvY2thYmxlVUl9IGZyb20gJ3ByaW1lbmcvYXBpJztcbmltcG9ydCB7UmlwcGxlTW9kdWxlfSBmcm9tICdwcmltZW5nL3JpcHBsZSc7ICBcbmltcG9ydCB7SHR0cENsaWVudCwgSHR0cEV2ZW50LCBIdHRwRXZlbnRUeXBlLCBIdHRwSGVhZGVyc30gZnJvbSBcIkBhbmd1bGFyL2NvbW1vbi9odHRwXCI7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAncC1maWxlVXBsb2FkJyxcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgICA8ZGl2IFtuZ0NsYXNzXT1cIidwLWZpbGV1cGxvYWQgcC1maWxldXBsb2FkLWFkdmFuY2VkIHAtY29tcG9uZW50J1wiIFtuZ1N0eWxlXT1cInN0eWxlXCIgW2NsYXNzXT1cInN0eWxlQ2xhc3NcIiAqbmdJZj1cIm1vZGUgPT09ICdhZHZhbmNlZCdcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwLWZpbGV1cGxvYWQtYnV0dG9uYmFyXCI+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwLWJ1dHRvbiBwLWNvbXBvbmVudCBwLWZpbGV1cGxvYWQtY2hvb3NlXCIgW25nQ2xhc3NdPVwieydwLWZvY3VzJzogZm9jdXMsICdwLWRpc2FibGVkJzpkaXNhYmxlZCB8fCBpc0Nob29zZURpc2FibGVkKCl9XCIgKGZvY3VzKT1cIm9uRm9jdXMoKVwiIChibHVyKT1cIm9uQmx1cigpXCIgcFJpcHBsZVxuICAgICAgICAgICAgICAgICAgICAoY2xpY2spPVwiY2hvb3NlKClcIiAoa2V5ZG93bi5lbnRlcik9XCJjaG9vc2UoKVwiIHRhYmluZGV4PVwiMFwiPiBcbiAgICAgICAgICAgICAgICAgICAgPGlucHV0ICNhZHZhbmNlZGZpbGVpbnB1dCB0eXBlPVwiZmlsZVwiIChjaGFuZ2UpPVwib25GaWxlU2VsZWN0KCRldmVudClcIiBbbXVsdGlwbGVdPVwibXVsdGlwbGVcIiBbYWNjZXB0XT1cImFjY2VwdFwiIFtkaXNhYmxlZF09XCJkaXNhYmxlZCB8fCBpc0Nob29zZURpc2FibGVkKClcIiBbYXR0ci50aXRsZV09XCInJ1wiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBbbmdDbGFzc109XCIncC1idXR0b24taWNvbiBwLWJ1dHRvbi1pY29uLWxlZnQnXCIgW2NsYXNzXT1cImNob29zZUljb25cIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicC1idXR0b24tbGFiZWxcIj57e2Nob29zZUxhYmVsfX08L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9zcGFuPlxuXG4gICAgICAgICAgICAgICAgPHAtYnV0dG9uICpuZ0lmPVwiIWF1dG8mJnNob3dVcGxvYWRCdXR0b25cIiB0eXBlPVwiYnV0dG9uXCIgW2xhYmVsXT1cInVwbG9hZExhYmVsXCIgW2ljb25dPVwidXBsb2FkSWNvblwiIChvbkNsaWNrKT1cInVwbG9hZCgpXCIgW2Rpc2FibGVkXT1cIiFoYXNGaWxlcygpIHx8IGlzRmlsZUxpbWl0RXhjZWVkZWQoKVwiPjwvcC1idXR0b24+XG4gICAgICAgICAgICAgICAgPHAtYnV0dG9uICpuZ0lmPVwiIWF1dG8mJnNob3dDYW5jZWxCdXR0b25cIiB0eXBlPVwiYnV0dG9uXCIgW2xhYmVsXT1cImNhbmNlbExhYmVsXCIgW2ljb25dPVwiY2FuY2VsSWNvblwiIChvbkNsaWNrKT1cImNsZWFyKClcIiBbZGlzYWJsZWRdPVwiIWhhc0ZpbGVzKCkgfHzCoHVwbG9hZGluZ1wiPjwvcC1idXR0b24+XG5cbiAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwidG9vbGJhclRlbXBsYXRlXCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgI2NvbnRlbnQgY2xhc3M9XCJwLWZpbGV1cGxvYWQtY29udGVudFwiIChkcmFnZW50ZXIpPVwib25EcmFnRW50ZXIoJGV2ZW50KVwiIChkcmFnbGVhdmUpPVwib25EcmFnTGVhdmUoJGV2ZW50KVwiIChkcm9wKT1cIm9uRHJvcCgkZXZlbnQpXCI+XG4gICAgICAgICAgICAgICAgPHAtcHJvZ3Jlc3NCYXIgW3ZhbHVlXT1cInByb2dyZXNzXCIgW3Nob3dWYWx1ZV09XCJmYWxzZVwiICpuZ0lmPVwiaGFzRmlsZXMoKVwiPjwvcC1wcm9ncmVzc0Jhcj5cblxuICAgICAgICAgICAgICAgIDxwLW1lc3NhZ2VzIFt2YWx1ZV09XCJtc2dzXCIgW2VuYWJsZVNlcnZpY2VdPVwiZmFsc2VcIj48L3AtbWVzc2FnZXM+XG5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicC1maWxldXBsb2FkLWZpbGVzXCIgKm5nSWY9XCJoYXNGaWxlcygpXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgKm5nSWY9XCIhZmlsZVRlbXBsYXRlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicC1maWxldXBsb2FkLXJvd1wiICpuZ0Zvcj1cImxldCBmaWxlIG9mIGZpbGVzOyBsZXQgaSA9IGluZGV4O1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+PGltZyBbc3JjXT1cImZpbGUub2JqZWN0VVJMXCIgKm5nSWY9XCJpc0ltYWdlKGZpbGUpXCIgW3dpZHRoXT1cInByZXZpZXdXaWR0aFwiIC8+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj57e2ZpbGUubmFtZX19PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj57e2Zvcm1hdFNpemUoZmlsZS5zaXplKX19PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgaWNvbj1cInBpIHBpLXRpbWVzXCIgcEJ1dHRvbiAoY2xpY2spPVwicmVtb3ZlKCRldmVudCxpKVwiIFtkaXNhYmxlZF09XCJ1cGxvYWRpbmdcIj48L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiAqbmdJZj1cImZpbGVUZW1wbGF0ZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPG5nLXRlbXBsYXRlIG5nRm9yIFtuZ0Zvck9mXT1cImZpbGVzXCIgW25nRm9yVGVtcGxhdGVdPVwiZmlsZVRlbXBsYXRlXCI+PC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImNvbnRlbnRUZW1wbGF0ZVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwicC1maWxldXBsb2FkIHAtZmlsZXVwbG9hZC1iYXNpYyBwLWNvbXBvbmVudFwiICpuZ0lmPVwibW9kZSA9PT0gJ2Jhc2ljJ1wiPlxuICAgICAgICAgICAgPHAtbWVzc2FnZXMgW3ZhbHVlXT1cIm1zZ3NcIiBbZW5hYmxlU2VydmljZV09XCJmYWxzZVwiPjwvcC1tZXNzYWdlcz5cbiAgICAgICAgICAgIDxzcGFuIFtuZ0NsYXNzXT1cInsncC1idXR0b24gcC1jb21wb25lbnQgcC1maWxldXBsb2FkLWNob29zZSc6IHRydWUsICdwLWZpbChldXBsb2FkLWNob29zZS1zZWxlY3RlZCc6IGhhc0ZpbGVzKCksJ3AtZm9jdXMnOiBmb2N1cywgJ3AtZGlzYWJsZWQnOmRpc2FibGVkfVwiXG4gICAgICAgICAgICAgICAgW25nU3R5bGVdPVwic3R5bGVcIiBbY2xhc3NdPVwic3R5bGVDbGFzc1wiIChtb3VzZXVwKT1cIm9uQmFzaWNVcGxvYWRlckNsaWNrKClcIiAoa2V5ZG93bik9XCJvbkJhc2ljVXBsb2FkZXJDbGljaygpXCIgdGFiaW5kZXg9XCIwXCIgcFJpcHBsZT5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInAtYnV0dG9uLWljb24gcC1idXR0b24taWNvbi1sZWZ0IHBpXCIgW25nQ2xhc3NdPVwieydwaS1wbHVzJzogIWhhc0ZpbGVzKCl8fGF1dG8sICdwaS11cGxvYWQnOiBoYXNGaWxlcygpJiYhYXV0b31cIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwLWJ1dHRvbi1sYWJlbFwiPnt7YXV0byA/IGNob29zZUxhYmVsIDogaGFzRmlsZXMoKSA/IGZpbGVzWzBdLm5hbWUgOiBjaG9vc2VMYWJlbH19PC9zcGFuPlxuICAgICAgICAgICAgICAgIDxpbnB1dCAjYmFzaWNmaWxlaW5wdXQgdHlwZT1cImZpbGVcIiBbYWNjZXB0XT1cImFjY2VwdFwiIFttdWx0aXBsZV09XCJtdWx0aXBsZVwiIFtkaXNhYmxlZF09XCJkaXNhYmxlZFwiXG4gICAgICAgICAgICAgICAgICAgIChjaGFuZ2UpPVwib25GaWxlU2VsZWN0KCRldmVudClcIiAqbmdJZj1cIiFoYXNGaWxlcygpXCIgKGZvY3VzKT1cIm9uRm9jdXMoKVwiIChibHVyKT1cIm9uQmx1cigpXCI+XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgIDwvZGl2PlxuICAgIGAsXG4gICAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gICAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgICBzdHlsZVVybHM6IFsnLi9maWxldXBsb2FkLmNzcyddXG59KVxuZXhwb3J0IGNsYXNzIEZpbGVVcGxvYWQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LEFmdGVyQ29udGVudEluaXQsT25EZXN0cm95LEJsb2NrYWJsZVVJIHtcblxuICAgIEBJbnB1dCgpIG5hbWU6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIHVybDogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgbWV0aG9kOiBzdHJpbmcgPSAnUE9TVCc7XG5cbiAgICBASW5wdXQoKSBtdWx0aXBsZTogYm9vbGVhbjtcblxuICAgIEBJbnB1dCgpIGFjY2VwdDogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgZGlzYWJsZWQ6IGJvb2xlYW47XG5cbiAgICBASW5wdXQoKSBhdXRvOiBib29sZWFuO1xuXG4gICAgQElucHV0KCkgd2l0aENyZWRlbnRpYWxzOiBib29sZWFuO1xuXG4gICAgQElucHV0KCkgbWF4RmlsZVNpemU6IG51bWJlcjtcblxuICAgIEBJbnB1dCgpIGludmFsaWRGaWxlU2l6ZU1lc3NhZ2VTdW1tYXJ5OiBzdHJpbmcgPSAnezB9OiBJbnZhbGlkIGZpbGUgc2l6ZSwgJztcblxuICAgIEBJbnB1dCgpIGludmFsaWRGaWxlU2l6ZU1lc3NhZ2VEZXRhaWw6IHN0cmluZyA9ICdtYXhpbXVtIHVwbG9hZCBzaXplIGlzIHswfS4nO1xuXG4gICAgQElucHV0KCkgaW52YWxpZEZpbGVUeXBlTWVzc2FnZVN1bW1hcnk6IHN0cmluZyA9ICd7MH06IEludmFsaWQgZmlsZSB0eXBlLCAnO1xuXG4gICAgQElucHV0KCkgaW52YWxpZEZpbGVUeXBlTWVzc2FnZURldGFpbDogc3RyaW5nID0gJ2FsbG93ZWQgZmlsZSB0eXBlczogezB9Lic7XG5cbiAgICBASW5wdXQoKSBpbnZhbGlkRmlsZUxpbWl0TWVzc2FnZURldGFpbDogc3RyaW5nID0gJ2xpbWl0IGlzIHswfSBhdCBtb3N0Lic7XG5cbiAgICBASW5wdXQoKSBpbnZhbGlkRmlsZUxpbWl0TWVzc2FnZVN1bW1hcnk6IHN0cmluZyA9ICdNYXhpbXVtIG51bWJlciBvZiBmaWxlcyBleGNlZWRlZCwgJztcblxuICAgIEBJbnB1dCgpIHN0eWxlOiBhbnk7XG5cbiAgICBASW5wdXQoKSBzdHlsZUNsYXNzOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBwcmV2aWV3V2lkdGg6IG51bWJlciA9IDUwO1xuXG4gICAgQElucHV0KCkgY2hvb3NlTGFiZWw6IHN0cmluZyA9ICdDaG9vc2UnO1xuXG4gICAgQElucHV0KCkgdXBsb2FkTGFiZWw6IHN0cmluZyA9ICdVcGxvYWQnO1xuXG4gICAgQElucHV0KCkgY2FuY2VsTGFiZWw6IHN0cmluZyA9ICdDYW5jZWwnO1xuXG4gICAgQElucHV0KCkgY2hvb3NlSWNvbjogc3RyaW5nID0gJ3BpIHBpLXBsdXMnO1xuXG4gICAgQElucHV0KCkgdXBsb2FkSWNvbjogc3RyaW5nID0gJ3BpIHBpLXVwbG9hZCc7XG5cbiAgICBASW5wdXQoKSBjYW5jZWxJY29uOiBzdHJpbmcgPSAncGkgcGktdGltZXMnO1xuXG4gICAgQElucHV0KCkgc2hvd1VwbG9hZEJ1dHRvbjogYm9vbGVhbiA9IHRydWU7XG5cbiAgICBASW5wdXQoKSBzaG93Q2FuY2VsQnV0dG9uOiBib29sZWFuID0gdHJ1ZTtcblxuICAgIEBJbnB1dCgpIG1vZGU6IHN0cmluZyA9ICdhZHZhbmNlZCc7XG5cbiAgICBASW5wdXQoKSBoZWFkZXJzOiBIdHRwSGVhZGVycztcbiAgICBcbiAgICBASW5wdXQoKSBjdXN0b21VcGxvYWQ6IGJvb2xlYW47XG5cbiAgICBASW5wdXQoKSBmaWxlTGltaXQ6IG51bWJlcjtcblxuICAgIEBPdXRwdXQoKSBvbkJlZm9yZVVwbG9hZDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgb25TZW5kOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKSBvblVwbG9hZDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgb25FcnJvcjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgb25DbGVhcjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgb25SZW1vdmU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpIG9uU2VsZWN0OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKSBvblByb2dyZXNzOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKSB1cGxvYWRIYW5kbGVyOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBDb250ZW50Q2hpbGRyZW4oUHJpbWVUZW1wbGF0ZSkgdGVtcGxhdGVzOiBRdWVyeUxpc3Q8YW55PjtcblxuICAgIEBWaWV3Q2hpbGQoJ2FkdmFuY2VkZmlsZWlucHV0JykgYWR2YW5jZWRGaWxlSW5wdXQ6IEVsZW1lbnRSZWY7XG5cbiAgICBAVmlld0NoaWxkKCdiYXNpY2ZpbGVpbnB1dCcpIGJhc2ljRmlsZUlucHV0OiBFbGVtZW50UmVmO1xuXG4gICAgQFZpZXdDaGlsZCgnY29udGVudCcpIGNvbnRlbnQ6IEVsZW1lbnRSZWY7XG5cbiAgICBASW5wdXQoKSBzZXQgZmlsZXMoZmlsZXMpIHtcbiAgICAgICAgdGhpcy5fZmlsZXMgPSBbXTtcblxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgZmlsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBmaWxlID0gZmlsZXNbaV07XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnZhbGlkYXRlKGZpbGUpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNJbWFnZShmaWxlKSkge1xuICAgICAgICAgICAgICAgICAgICAoPGFueT5maWxlKS5vYmplY3RVUkwgPSB0aGlzLnNhbml0aXplci5ieXBhc3NTZWN1cml0eVRydXN0VXJsKCh3aW5kb3cuVVJMLmNyZWF0ZU9iamVjdFVSTChmaWxlc1tpXSkpKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLl9maWxlcy5wdXNoKGZpbGVzW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldCBmaWxlcygpOiBGaWxlW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5fZmlsZXM7XG4gICAgfVxuXG4gICAgcHVibGljIF9maWxlczogRmlsZVtdID0gW107XG5cbiAgICBwdWJsaWMgcHJvZ3Jlc3M6IG51bWJlciA9IDA7XG5cbiAgICBwdWJsaWMgZHJhZ0hpZ2hsaWdodDogYm9vbGVhbjtcblxuICAgIHB1YmxpYyBtc2dzOiBNZXNzYWdlW107XG5cbiAgICBwdWJsaWMgZmlsZVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgcHVibGljIGNvbnRlbnRUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIHB1YmxpYyB0b29sYmFyVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICBwdWJsaWMgdXBsb2FkZWRGaWxlQ291bnQ6IG51bWJlciA9IDA7XG5cbiAgICBmb2N1czogYm9vbGVhbjtcblxuICAgIHVwbG9hZGluZzogYm9vbGVhbjtcblxuICAgIGR1cGxpY2F0ZUlFRXZlbnQ6IGJvb2xlYW47ICAvLyBmbGFnIHRvIHJlY29nbml6ZSBkdXBsaWNhdGUgb25jaGFuZ2UgZXZlbnQgZm9yIGZpbGUgaW5wdXRcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZWw6IEVsZW1lbnRSZWYsIHB1YmxpYyBzYW5pdGl6ZXI6IERvbVNhbml0aXplciwgcHVibGljIHpvbmU6IE5nWm9uZSwgcHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50LCBwdWJsaWMgY2Q6IENoYW5nZURldGVjdG9yUmVmKXt9XG5cbiAgICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgICAgIHRoaXMudGVtcGxhdGVzLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgICAgIHN3aXRjaChpdGVtLmdldFR5cGUoKSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ2ZpbGUnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZpbGVUZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdjb250ZW50JzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZW50VGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAndG9vbGJhcic6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudG9vbGJhclRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmlsZVRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgICAgICBpZiAodGhpcy5tb2RlID09PSAnYWR2YW5jZWQnKSB7XG4gICAgICAgICAgICB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbnRlbnQpXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudC5uYXRpdmVFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdvdmVyJywgdGhpcy5vbkRyYWdPdmVyLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjaG9vc2UoKSB7XG4gICAgICAgIHRoaXMuYWR2YW5jZWRGaWxlSW5wdXQubmF0aXZlRWxlbWVudC5jbGljaygpO1xuICAgIH1cblxuICAgIG9uRmlsZVNlbGVjdChldmVudCkge1xuICAgICAgICBpZiAoZXZlbnQudHlwZSAhPT0gJ2Ryb3AnICYmIHRoaXMuaXNJRTExKCkgJiYgdGhpcy5kdXBsaWNhdGVJRUV2ZW50KSB7XG4gICAgICAgICAgICB0aGlzLmR1cGxpY2F0ZUlFRXZlbnQgPSBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubXNncyA9IFtdO1xuICAgICAgICBpZiAoIXRoaXMubXVsdGlwbGUpIHtcbiAgICAgICAgICAgIHRoaXMuZmlsZXMgPSBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBmaWxlcyA9IGV2ZW50LmRhdGFUcmFuc2ZlciA/IGV2ZW50LmRhdGFUcmFuc2Zlci5maWxlcyA6IGV2ZW50LnRhcmdldC5maWxlcztcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IGZpbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgZmlsZSA9IGZpbGVzW2ldO1xuXG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNGaWxlU2VsZWN0ZWQoZmlsZSkpe1xuICAgICAgICAgICAgICBpZiAodGhpcy52YWxpZGF0ZShmaWxlKSkge1xuICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNJbWFnZShmaWxlKSkge1xuICAgICAgICAgICAgICAgICAgICAgIGZpbGUub2JqZWN0VVJMID0gdGhpcy5zYW5pdGl6ZXIuYnlwYXNzU2VjdXJpdHlUcnVzdFVybCgod2luZG93LlVSTC5jcmVhdGVPYmplY3RVUkwoZmlsZXNbaV0pKSk7XG4gICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgIHRoaXMuZmlsZXMucHVzaChmaWxlc1tpXSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMub25TZWxlY3QuZW1pdCh7b3JpZ2luYWxFdmVudDogZXZlbnQsIGZpbGVzOiBmaWxlcywgY3VycmVudEZpbGVzOiB0aGlzLmZpbGVzfSk7XG5cbiAgICAgICAgaWYgKHRoaXMuZmlsZUxpbWl0ICYmIHRoaXMubW9kZSA9PSBcImFkdmFuY2VkXCIpIHtcbiAgICAgICAgICAgIHRoaXMuY2hlY2tGaWxlTGltaXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmhhc0ZpbGVzKCkgJiYgdGhpcy5hdXRvICYmICghKHRoaXMubW9kZSA9PT0gXCJhZHZhbmNlZFwiKSB8fCAhdGhpcy5pc0ZpbGVMaW1pdEV4Y2VlZGVkKCkpKSB7XG4gICAgICAgICAgICB0aGlzLnVwbG9hZCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGV2ZW50LnR5cGUgIT09ICdkcm9wJyAmJiB0aGlzLmlzSUUxMSgpKSB7XG4gICAgICAgICAgdGhpcy5jbGVhcklFSW5wdXQoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmNsZWFySW5wdXRFbGVtZW50KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpc0ZpbGVTZWxlY3RlZChmaWxlOiBGaWxlKTogYm9vbGVhbntcbiAgICAgICAgZm9yKGxldCBzRmlsZSBvZiB0aGlzLmZpbGVzKXtcbiAgICAgICAgICAgIGlmICgoc0ZpbGUubmFtZSArIHNGaWxlLnR5cGUgKyBzRmlsZS5zaXplKSA9PT0gKGZpbGUubmFtZSArIGZpbGUudHlwZStmaWxlLnNpemUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaXNJRTExKCkge1xuICAgICAgICByZXR1cm4gISF3aW5kb3dbJ01TSW5wdXRNZXRob2RDb250ZXh0J10gJiYgISFkb2N1bWVudFsnZG9jdW1lbnRNb2RlJ107XG4gICAgfVxuXG4gICAgdmFsaWRhdGUoZmlsZTogRmlsZSk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAodGhpcy5hY2NlcHQgJiYgIXRoaXMuaXNGaWxlVHlwZVZhbGlkKGZpbGUpKSB7XG4gICAgICAgICAgICB0aGlzLm1zZ3MucHVzaCh7XG4gICAgICAgICAgICAgICAgc2V2ZXJpdHk6ICdlcnJvcicsXG4gICAgICAgICAgICAgICAgc3VtbWFyeTogdGhpcy5pbnZhbGlkRmlsZVR5cGVNZXNzYWdlU3VtbWFyeS5yZXBsYWNlKCd7MH0nLCBmaWxlLm5hbWUpLFxuICAgICAgICAgICAgICAgIGRldGFpbDogdGhpcy5pbnZhbGlkRmlsZVR5cGVNZXNzYWdlRGV0YWlsLnJlcGxhY2UoJ3swfScsIHRoaXMuYWNjZXB0KVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5tYXhGaWxlU2l6ZSAgJiYgZmlsZS5zaXplID4gdGhpcy5tYXhGaWxlU2l6ZSkge1xuICAgICAgICAgICAgdGhpcy5tc2dzLnB1c2goe1xuICAgICAgICAgICAgICAgIHNldmVyaXR5OiAnZXJyb3InLFxuICAgICAgICAgICAgICAgIHN1bW1hcnk6IHRoaXMuaW52YWxpZEZpbGVTaXplTWVzc2FnZVN1bW1hcnkucmVwbGFjZSgnezB9JywgZmlsZS5uYW1lKSxcbiAgICAgICAgICAgICAgICBkZXRhaWw6IHRoaXMuaW52YWxpZEZpbGVTaXplTWVzc2FnZURldGFpbC5yZXBsYWNlKCd7MH0nLCB0aGlzLmZvcm1hdFNpemUodGhpcy5tYXhGaWxlU2l6ZSkpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHByaXZhdGUgaXNGaWxlVHlwZVZhbGlkKGZpbGU6IEZpbGUpOiBib29sZWFuIHtcbiAgICAgICAgbGV0IGFjY2VwdGFibGVUeXBlcyA9IHRoaXMuYWNjZXB0LnNwbGl0KCcsJykubWFwKHR5cGUgPT4gdHlwZS50cmltKCkpO1xuICAgICAgICBmb3IobGV0IHR5cGUgb2YgYWNjZXB0YWJsZVR5cGVzKSB7XG4gICAgICAgICAgICBsZXQgYWNjZXB0YWJsZSA9IHRoaXMuaXNXaWxkY2FyZCh0eXBlKSA/IHRoaXMuZ2V0VHlwZUNsYXNzKGZpbGUudHlwZSkgPT09IHRoaXMuZ2V0VHlwZUNsYXNzKHR5cGUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBmaWxlLnR5cGUgPT0gdHlwZSB8fCB0aGlzLmdldEZpbGVFeHRlbnNpb24oZmlsZSkudG9Mb3dlckNhc2UoKSA9PT0gdHlwZS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICAgICAgICBpZiAoYWNjZXB0YWJsZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGdldFR5cGVDbGFzcyhmaWxlVHlwZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIGZpbGVUeXBlLnN1YnN0cmluZygwLCBmaWxlVHlwZS5pbmRleE9mKCcvJykpO1xuICAgIH1cblxuICAgIGlzV2lsZGNhcmQoZmlsZVR5cGU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gZmlsZVR5cGUuaW5kZXhPZignKicpICE9PSAtMTtcbiAgICB9XG5cbiAgICBnZXRGaWxlRXh0ZW5zaW9uKGZpbGU6IEZpbGUpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gJy4nICsgZmlsZS5uYW1lLnNwbGl0KCcuJykucG9wKCk7XG4gICAgfVxuXG4gICAgaXNJbWFnZShmaWxlOiBGaWxlKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAvXmltYWdlXFwvLy50ZXN0KGZpbGUudHlwZSk7XG4gICAgfVxuXG4gICAgb25JbWFnZUxvYWQoaW1nOiBhbnkpIHtcbiAgICAgICAgd2luZG93LlVSTC5yZXZva2VPYmplY3RVUkwoaW1nLnNyYyk7XG4gICAgfVxuXG4gICAgdXBsb2FkKCkge1xuICAgICAgICBpZiAodGhpcy5jdXN0b21VcGxvYWQpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmZpbGVMaW1pdCkge1xuICAgICAgICAgICAgICAgIHRoaXMudXBsb2FkZWRGaWxlQ291bnQgKz0gdGhpcy5maWxlcy5sZW5ndGg7IFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLnVwbG9hZEhhbmRsZXIuZW1pdCh7XG4gICAgICAgICAgICAgICAgZmlsZXM6IHRoaXMuZmlsZXNcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy51cGxvYWRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5tc2dzID0gW107XG4gICAgICAgICAgICBsZXQgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcblxuICAgICAgICAgICAgdGhpcy5vbkJlZm9yZVVwbG9hZC5lbWl0KHtcbiAgICAgICAgICAgICAgICAnZm9ybURhdGEnOiBmb3JtRGF0YVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5maWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGZvcm1EYXRhLmFwcGVuZCh0aGlzLm5hbWUsIHRoaXMuZmlsZXNbaV0sIHRoaXMuZmlsZXNbaV0ubmFtZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuaHR0cC5wb3N0KHRoaXMudXJsLCBmb3JtRGF0YSwge1xuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHRoaXMuaGVhZGVycywgcmVwb3J0UHJvZ3Jlc3M6IHRydWUsIG9ic2VydmU6ICdldmVudHMnLCB3aXRoQ3JlZGVudGlhbHM6IHRoaXMud2l0aENyZWRlbnRpYWxzXG4gICAgICAgICAgICB9KS5zdWJzY3JpYmUoIChldmVudDogSHR0cEV2ZW50PGFueT4pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChldmVudC50eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIEh0dHBFdmVudFR5cGUuU2VudDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9uU2VuZC5lbWl0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWxFdmVudDogZXZlbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdmb3JtRGF0YSc6IGZvcm1EYXRhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIEh0dHBFdmVudFR5cGUuUmVzcG9uc2U6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cGxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2dyZXNzID0gMDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChldmVudFsnc3RhdHVzJ10gPj0gMjAwICYmIGV2ZW50WydzdGF0dXMnXSA8IDMwMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5maWxlTGltaXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBsb2FkZWRGaWxlQ291bnQgKz0gdGhpcy5maWxlcy5sZW5ndGg7IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vblVwbG9hZC5lbWl0KHtvcmlnaW5hbEV2ZW50OiBldmVudCwgZmlsZXM6IHRoaXMuZmlsZXN9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9uRXJyb3IuZW1pdCh7ZmlsZXM6IHRoaXMuZmlsZXN9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNsZWFyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIEh0dHBFdmVudFR5cGUuVXBsb2FkUHJvZ3Jlc3M6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXZlbnRbJ2xvYWRlZCddKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvZ3Jlc3MgPSBNYXRoLnJvdW5kKChldmVudFsnbG9hZGVkJ10gKiAxMDApIC8gZXZlbnRbJ3RvdGFsJ10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25Qcm9ncmVzcy5lbWl0KHtvcmlnaW5hbEV2ZW50OiBldmVudCwgcHJvZ3Jlc3M6IHRoaXMucHJvZ3Jlc3N9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBsb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25FcnJvci5lbWl0KHtmaWxlczogdGhpcy5maWxlcywgZXJyb3I6IGVycm9yfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjbGVhcigpIHtcbiAgICAgICAgdGhpcy5maWxlcyA9IFtdO1xuICAgICAgICB0aGlzLm9uQ2xlYXIuZW1pdCgpO1xuICAgICAgICB0aGlzLmNsZWFySW5wdXRFbGVtZW50KCk7XG4gICAgICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuXG4gICAgcmVtb3ZlKGV2ZW50OiBFdmVudCwgaW5kZXg6IG51bWJlcikge1xuICAgICAgICB0aGlzLmNsZWFySW5wdXRFbGVtZW50KCk7XG4gICAgICAgIHRoaXMub25SZW1vdmUuZW1pdCh7b3JpZ2luYWxFdmVudDogZXZlbnQsIGZpbGU6IHRoaXMuZmlsZXNbaW5kZXhdfSk7XG4gICAgICAgIHRoaXMuZmlsZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9XG5cbiAgICBpc0ZpbGVMaW1pdEV4Y2VlZGVkKCkge1xuICAgICAgICBpZiAodGhpcy5maWxlTGltaXQgJiYgdGhpcy5maWxlTGltaXQgPD0gdGhpcy5maWxlcy5sZW5ndGggKyB0aGlzLnVwbG9hZGVkRmlsZUNvdW50ICYmIHRoaXMuZm9jdXMpIHtcbiAgICAgICAgICAgIHRoaXMuZm9jdXMgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLmZpbGVMaW1pdCAmJiB0aGlzLmZpbGVMaW1pdCA8IHRoaXMuZmlsZXMubGVuZ3RoICsgdGhpcy51cGxvYWRlZEZpbGVDb3VudDtcbiAgICB9XG5cbiAgICBpc0Nob29zZURpc2FibGVkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5maWxlTGltaXQgJiYgdGhpcy5maWxlTGltaXQgPD0gdGhpcy5maWxlcy5sZW5ndGggKyB0aGlzLnVwbG9hZGVkRmlsZUNvdW50O1xuICAgIH1cblxuICAgIGNoZWNrRmlsZUxpbWl0KCkge1xuICAgICAgICBpZiAodGhpcy5pc0ZpbGVMaW1pdEV4Y2VlZGVkKCkpIHtcbiAgICAgICAgICAgIHRoaXMubXNncy5wdXNoKHtcbiAgICAgICAgICAgICAgICBzZXZlcml0eTogJ2Vycm9yJyxcbiAgICAgICAgICAgICAgICBzdW1tYXJ5OiB0aGlzLmludmFsaWRGaWxlTGltaXRNZXNzYWdlU3VtbWFyeS5yZXBsYWNlKCd7MH0nLCB0aGlzLmZpbGVMaW1pdC50b1N0cmluZygpKSxcbiAgICAgICAgICAgICAgICBkZXRhaWw6IHRoaXMuaW52YWxpZEZpbGVMaW1pdE1lc3NhZ2VEZXRhaWwucmVwbGFjZSgnezB9JywgdGhpcy5maWxlTGltaXQudG9TdHJpbmcoKSlcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2xlYXJJbnB1dEVsZW1lbnQoKSB7XG4gICAgICAgIGlmICh0aGlzLmFkdmFuY2VkRmlsZUlucHV0ICYmIHRoaXMuYWR2YW5jZWRGaWxlSW5wdXQubmF0aXZlRWxlbWVudCkge1xuICAgICAgICAgICAgdGhpcy5hZHZhbmNlZEZpbGVJbnB1dC5uYXRpdmVFbGVtZW50LnZhbHVlID0gJyc7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5iYXNpY0ZpbGVJbnB1dCAmJiB0aGlzLmJhc2ljRmlsZUlucHV0Lm5hdGl2ZUVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMuYmFzaWNGaWxlSW5wdXQubmF0aXZlRWxlbWVudC52YWx1ZSA9ICcnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2xlYXJJRUlucHV0KCkge1xuICAgICAgICBpZiAodGhpcy5hZHZhbmNlZEZpbGVJbnB1dCAmJiB0aGlzLmFkdmFuY2VkRmlsZUlucHV0Lm5hdGl2ZUVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMuZHVwbGljYXRlSUVFdmVudCA9IHRydWU7IC8vSUUxMSBmaXggdG8gcHJldmVudCBvbkZpbGVDaGFuZ2UgdHJpZ2dlciBhZ2FpblxuICAgICAgICAgICAgdGhpcy5hZHZhbmNlZEZpbGVJbnB1dC5uYXRpdmVFbGVtZW50LnZhbHVlID0gJyc7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBoYXNGaWxlcygpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmlsZXMgJiYgdGhpcy5maWxlcy5sZW5ndGggPiAwO1xuICAgIH1cblxuICAgIG9uRHJhZ0VudGVyKGUpIHtcbiAgICAgICAgaWYgKCF0aGlzLmRpc2FibGVkKSB7XG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25EcmFnT3ZlcihlKSB7XG4gICAgICAgIGlmICghdGhpcy5kaXNhYmxlZCkge1xuICAgICAgICAgICAgRG9tSGFuZGxlci5hZGRDbGFzcyh0aGlzLmNvbnRlbnQubmF0aXZlRWxlbWVudCwgJ3AtZmlsZXVwbG9hZC1oaWdobGlnaHQnKTtcbiAgICAgICAgICAgIHRoaXMuZHJhZ0hpZ2hsaWdodCA9IHRydWU7XG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25EcmFnTGVhdmUoZXZlbnQpIHtcbiAgICAgICAgaWYgKCF0aGlzLmRpc2FibGVkKSB7XG4gICAgICAgICAgICBEb21IYW5kbGVyLnJlbW92ZUNsYXNzKHRoaXMuY29udGVudC5uYXRpdmVFbGVtZW50LCAncC1maWxldXBsb2FkLWhpZ2hsaWdodCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25Ecm9wKGV2ZW50KSB7XG4gICAgICAgIGlmICghdGhpcy5kaXNhYmxlZCkge1xuICAgICAgICAgICAgRG9tSGFuZGxlci5yZW1vdmVDbGFzcyh0aGlzLmNvbnRlbnQubmF0aXZlRWxlbWVudCwgJ3AtZmlsZXVwbG9hZC1oaWdobGlnaHQnKTtcbiAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgbGV0IGZpbGVzID0gZXZlbnQuZGF0YVRyYW5zZmVyID8gZXZlbnQuZGF0YVRyYW5zZmVyLmZpbGVzIDogZXZlbnQudGFyZ2V0LmZpbGVzO1xuICAgICAgICAgICAgbGV0IGFsbG93RHJvcCA9IHRoaXMubXVsdGlwbGV8fChmaWxlcyAmJiBmaWxlcy5sZW5ndGggPT09IDEpO1xuXG4gICAgICAgICAgICBpZiAoYWxsb3dEcm9wKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vbkZpbGVTZWxlY3QoZXZlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25Gb2N1cygpIHtcbiAgICAgICAgdGhpcy5mb2N1cyA9IHRydWU7XG4gICAgfVxuXG4gICAgb25CbHVyKCkge1xuICAgICAgICB0aGlzLmZvY3VzID0gZmFsc2U7XG4gICAgfVxuXG4gICAgZm9ybWF0U2l6ZShieXRlcykge1xuICAgICAgICBpZiAoYnl0ZXMgPT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuICcwIEInO1xuICAgICAgICB9XG4gICAgICAgIGxldCBrID0gMTAyNCxcbiAgICAgICAgZG0gPSAzLFxuICAgICAgICBzaXplcyA9IFsnQicsICdLQicsICdNQicsICdHQicsICdUQicsICdQQicsICdFQicsICdaQicsICdZQiddLFxuICAgICAgICBpID0gTWF0aC5mbG9vcihNYXRoLmxvZyhieXRlcykgLyBNYXRoLmxvZyhrKSk7XG5cbiAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQoKGJ5dGVzIC8gTWF0aC5wb3coaywgaSkpLnRvRml4ZWQoZG0pKSArICcgJyArIHNpemVzW2ldO1xuICAgIH1cblxuICAgIG9uQmFzaWNVcGxvYWRlckNsaWNrKGV2ZW50OiBFdmVudCkge1xuICAgICAgICBpZiAodGhpcy5oYXNGaWxlcygpKVxuICAgICAgICAgICAgdGhpcy51cGxvYWQoKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgdGhpcy5iYXNpY0ZpbGVJbnB1dC5uYXRpdmVFbGVtZW50LmNsaWNrKCk7XG4gICAgfVxuXG4gICAgZ2V0QmxvY2thYmxlRWxlbWVudCgpOiBIVE1MRWxlbWVudMKge1xuICAgICAgcmV0dXJuIHRoaXMuZWwubmF0aXZlRWxlbWVudC5jaGlsZHJlblswXTtcbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHtcbiAgICAgICAgaWYgKHRoaXMuY29udGVudCAmJiB0aGlzLmNvbnRlbnQubmF0aXZlRWxlbWVudCkge1xuICAgICAgICAgICAgdGhpcy5jb250ZW50Lm5hdGl2ZUVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignZHJhZ292ZXInLCB0aGlzLm9uRHJhZ092ZXIpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5ATmdNb2R1bGUoe1xuICAgIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsU2hhcmVkTW9kdWxlLEJ1dHRvbk1vZHVsZSxQcm9ncmVzc0Jhck1vZHVsZSxNZXNzYWdlc01vZHVsZSxSaXBwbGVNb2R1bGVdLFxuICAgIGV4cG9ydHM6IFtGaWxlVXBsb2FkLFNoYXJlZE1vZHVsZSxCdXR0b25Nb2R1bGUsUHJvZ3Jlc3NCYXJNb2R1bGUsTWVzc2FnZXNNb2R1bGVdLFxuICAgIGRlY2xhcmF0aW9uczogW0ZpbGVVcGxvYWRdXG59KVxuZXhwb3J0IGNsYXNzIEZpbGVVcGxvYWRNb2R1bGUgeyB9XG4iXX0=