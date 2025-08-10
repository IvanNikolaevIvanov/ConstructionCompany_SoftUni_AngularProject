import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentFeedbacks } from './agent-feedbacks';

describe('AgentFeedbacks', () => {
  let component: AgentFeedbacks;
  let fixture: ComponentFixture<AgentFeedbacks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentFeedbacks]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentFeedbacks);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
