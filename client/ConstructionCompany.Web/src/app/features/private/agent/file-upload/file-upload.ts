import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ApplicationFileModel } from 'app/models';

@Component({
  selector: 'file-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-upload.html',
  styleUrl: './file-upload.scss',
})
export class FileUpload {
  @Input() files: ApplicationFileModel[] = [];
  @Output() filesChange = new EventEmitter<ApplicationFileModel[]>();

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    Array.from(input.files).forEach((file) => {
      const newFile: ApplicationFileModel = {
        fileName: file.name,
        file: file,
      };

      this.files = [...this.files, newFile];
      this.filesChange.emit(this.files);
    });
  }

  removeFile(index: number) {
    this.files.splice(index, 1);
    this.filesChange.emit(this.files);
  }
}
