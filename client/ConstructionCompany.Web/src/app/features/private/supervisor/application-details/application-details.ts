import { Component, inject, OnInit } from '@angular/core';
import { ApplicationService } from 'app/core/services';
import { ProjectApplicationModel } from 'app/models';

@Component({
  selector: 'application-details',
  imports: [],
  templateUrl: './application-details.html',
  styleUrl: './application-details.scss',
})
export class ApplicationDetails implements OnInit {
  application?: ProjectApplicationModel;
  appService = inject(ApplicationService);

  ngOnInit(): void {
    const navigation = window.history.state;
    if (navigation && navigation.application) {
      this.application = navigation.application;
    }
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
