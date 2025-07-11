import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppContacts } from './app-contacts';

describe('AppContacts', () => {
  let component: AppContacts;
  let fixture: ComponentFixture<AppContacts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppContacts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppContacts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
