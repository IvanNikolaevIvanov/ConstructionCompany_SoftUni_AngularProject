import { Component, inject } from '@angular/core';
import { ErrorService } from 'app/core/services';

@Component({
  selector: 'app-error-notification',
  imports: [],
  templateUrl: './error-notification.html',
  styleUrl: './error-notification.scss',
})
export class ErrorNotification {
  private errorService = inject(ErrorService);

  readonly error = this.errorService.error;
}
