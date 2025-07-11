import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppWhyUs } from './app-why-us';

describe('AppWhyUs', () => {
  let component: AppWhyUs;
  let fixture: ComponentFixture<AppWhyUs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppWhyUs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppWhyUs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
