import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupervisorDashboard } from './supervisor-dashboard';

describe('SupervisorDashboard', () => {
  let component: SupervisorDashboard;
  let fixture: ComponentFixture<SupervisorDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupervisorDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupervisorDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
