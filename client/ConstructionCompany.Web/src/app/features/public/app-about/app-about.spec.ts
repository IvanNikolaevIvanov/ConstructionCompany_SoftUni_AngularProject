import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppAbout } from './app-about';

describe('AppAbout', () => {
  let component: AppAbout;
  let fixture: ComponentFixture<AppAbout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppAbout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppAbout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
