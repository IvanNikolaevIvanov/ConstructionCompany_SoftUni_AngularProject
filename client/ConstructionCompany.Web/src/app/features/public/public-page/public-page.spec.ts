import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicPage } from './public-page';

describe('PublicPage', () => {
  let component: PublicPage;
  let fixture: ComponentFixture<PublicPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
