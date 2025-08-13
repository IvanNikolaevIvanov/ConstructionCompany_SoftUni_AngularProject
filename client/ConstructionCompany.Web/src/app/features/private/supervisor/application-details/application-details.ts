import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ApplicationService } from 'app/core/services';
import { ApplicationFileModel, ProjectApplicationModel } from 'app/models';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'application-details',
  imports: [CommonModule, MatTabsModule, MatIconModule, MatListModule],
  templateUrl: './application-details.html',
  styleUrl: './application-details.scss',
})
export class ApplicationDetails implements OnInit, OnDestroy {
  application?: ProjectApplicationModel;
  files: ApplicationFileModel[] = [];
  appService = inject(ApplicationService);

  ngOnInit(): void {
    const navigation = window.history.state;
    if (navigation && navigation.application) {
      this.application = navigation.application;
    }

    console.log(`Application: ${this.application?.title}`);

    if (this.application?.files) {
      this.files = [];

      this.application.files.forEach((f) => {
        const byteCharacters = atob(f.base64Content!);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);

        const fileFromServer = new File([byteArray], f.fileName);
        const fileUrl = URL.createObjectURL(fileFromServer);

        this.files.push({
          fileName: f.fileName,
          file: fileFromServer,
          url: fileUrl,
        });
      });
    }
  }

  ngOnDestroy() {
    this.files.forEach((f) => {
      if (f.url) {
        URL.revokeObjectURL(f.url);
      }
    });
  }

  printApplication() {
    if (!this.application || this.application.id === undefined) {
      return;
    }

    this.appService.printApplication(this.application.id).subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Application-${this.application?.id}.pdf`;
      a.style.display = 'none';
      document.body.append(a);
      a.click();
      URL.revokeObjectURL(url);
      a.remove();
    });
  }
}
