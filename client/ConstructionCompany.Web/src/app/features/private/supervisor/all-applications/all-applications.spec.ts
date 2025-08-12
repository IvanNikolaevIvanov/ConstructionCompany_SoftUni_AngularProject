import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllApplications } from './all-applications';

describe('AllApplications', () => {
  let component: AllApplications;
  let fixture: ComponentFixture<AllApplications>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllApplications]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllApplications);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
