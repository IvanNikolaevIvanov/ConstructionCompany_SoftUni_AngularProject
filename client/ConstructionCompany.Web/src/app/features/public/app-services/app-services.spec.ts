import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppServices } from './app-services';

describe('AppServices', () => {
  let component: AppServices;
  let fixture: ComponentFixture<AppServices>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppServices]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppServices);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
