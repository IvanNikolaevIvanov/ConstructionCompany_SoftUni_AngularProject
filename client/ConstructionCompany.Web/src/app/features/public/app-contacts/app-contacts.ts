import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';

@Component({
  selector: 'app-contacts',
  imports: [CommonModule, FormsModule],
  templateUrl: './app-contacts.html',
  styleUrl: './app-contacts.scss',
})
export class AppContacts {
  sendEmail(e: Event) {
    e.preventDefault();

    emailjs
      .sendForm(
        'service_v8ivcfh',
        'template_egpfg1c',
        e.target as HTMLFormElement,
        '6WRKoRcnSieEohhU3'
      )
      .then(
        (response: EmailJSResponseStatus) => {
          console.log('SUCCESS!', response.status, response.text);
          alert('Message sent successfully!');
        },
        (error) => {
          console.error('FAILED...', error);
          alert('Oops — something went wrong. Please try again later.');
        }
      );
  }
}
