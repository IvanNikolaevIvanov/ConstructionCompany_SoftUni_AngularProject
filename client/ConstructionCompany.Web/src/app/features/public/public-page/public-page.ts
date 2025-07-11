import { Component } from '@angular/core';
import { Header, Footer } from '../../../shared/components';
import { AppServices } from '../app-services/app-services';
import { AppAbout } from '../app-about/app-about';
import { AppWhyUs } from '../app-why-us/app-why-us';
import { AppOurWork } from '../app-our-work/app-our-work';
import { AppContacts } from '../app-contacts/app-contacts';

@Component({
  selector: 'app-public-page',
  imports: [
    Header,
    Footer,
    AppAbout,
    AppServices,
    AppWhyUs,
    AppOurWork,
    AppContacts,
  ],
  templateUrl: './public-page.html',
  styleUrl: './public-page.scss',
})
export class PublicPage {}
