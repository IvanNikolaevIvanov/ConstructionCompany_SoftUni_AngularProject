import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppHome } from './app-home';

describe('AppHome', () => {
  let component: AppHome;
  let fixture: ComponentFixture<AppHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppHome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
