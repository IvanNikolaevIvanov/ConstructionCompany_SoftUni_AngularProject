import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppOurWork } from './app-our-work';

describe('AppOurWork', () => {
  let component: AppOurWork;
  let fixture: ComponentFixture<AppOurWork>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppOurWork]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppOurWork);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
