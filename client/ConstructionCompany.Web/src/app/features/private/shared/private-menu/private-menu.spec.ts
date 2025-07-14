import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivateMenu } from './private-menu';

describe('PrivateMenu', () => {
  let component: PrivateMenu;
  let fixture: ComponentFixture<PrivateMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrivateMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrivateMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
