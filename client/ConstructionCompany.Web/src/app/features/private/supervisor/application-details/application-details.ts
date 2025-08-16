import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ApplicationService } from 'app/core/services';
import { ApplicationFileModel, ProjectApplicationModel } from 'app/models';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ApplicationStatus } from 'app/enums/enums';

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

  pageIndex!: number;
  pageSize!: number;
  status!: ApplicationStatus;
  fromPage!: string;

  constructor(
    private router: Router,
    private location: Location,
  ) {}

  ngOnInit(): void {
    // const state = this.router.getCurrentNavigation()?.extras.state;
    // if (state) {
    //   this.fromPage = state['from'] || 'allApplications';
    //   this.application = state['application'];
    //   this.pageIndex = state['pageIndex'];
    //   this.pageSize = state['pageSize'];
    //   this.status = state['status'];
    // }

    // console.log(`From Page: ${this.fromPage}`);

    // const navigation = window.history.state;
    // if (navigation && navigation.application && navigation.fromPage) {
    //   this.application = navigation.application;
    //   this.fromPage = navigation.fromPage;
    // }

    // console.log(`Application: ${this.application?.title}`);

    let state = this.router.getCurrentNavigation()?.extras.state;

    // If that's not available (e.g., after refresh), fall back to history.state
    if (!state || Object.keys(state).length === 0) {
      state = window.history.state;
    }

    if (state) {
      this.fromPage = state['from'] || state['fromPage'] || 'allApplications';
      this.application = state['application'];
      this.pageIndex = state['pageIndex'];
      this.pageSize = state['pageSize'];
      this.status = state['status'];
    }

    console.log(`From Page: ${this.fromPage}`);
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

  backClick() {
    //this.location.back();
    console.log(`From Page in backClick() is ${this.fromPage}`);
    if (this.fromPage === 'dashboard') {
      this.router.navigate(['/supervisor/dashboard'], {
        state: {
          application: this.application,
        },
      });
    } else {
      this.router.navigate(['/supervisor/all-applications'], {
        state: {
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          status: this.status,
          application: this.application,
        },
      });
    }
  }
}
