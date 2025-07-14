import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthenticationBar } from './authentication-bar';

describe('AuthenticationBar', () => {
  let component: AuthenticationBar;
  let fixture: ComponentFixture<AuthenticationBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthenticationBar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthenticationBar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
