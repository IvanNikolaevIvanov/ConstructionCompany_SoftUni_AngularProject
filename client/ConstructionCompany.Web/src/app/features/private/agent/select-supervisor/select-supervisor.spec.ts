import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectSupervisor } from './select-supervisor';

describe('SelectSupervisor', () => {
  let component: SelectSupervisor;
  let fixture: ComponentFixture<SelectSupervisor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectSupervisor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectSupervisor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
