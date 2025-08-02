import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewApplication } from './create-new-application';

describe('CreateNewApplication', () => {
  let component: CreateNewApplication;
  let fixture: ComponentFixture<CreateNewApplication>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateNewApplication]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateNewApplication);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
