import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFeedback } from './create-feedback';

describe('CreateFeedback', () => {
  let component: CreateFeedback;
  let fixture: ComponentFixture<CreateFeedback>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateFeedback]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateFeedback);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
