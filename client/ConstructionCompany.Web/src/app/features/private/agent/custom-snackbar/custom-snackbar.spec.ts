import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomSnackbar } from './custom-snackbar';

describe('CustomSnackbar', () => {
  let component: CustomSnackbar;
  let fixture: ComponentFixture<CustomSnackbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomSnackbar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomSnackbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
