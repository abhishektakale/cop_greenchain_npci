import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuanceComponent } from './issuance.component';

describe('IssuanceComponent', () => {
  let component: IssuanceComponent;
  let fixture: ComponentFixture<IssuanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IssuanceComponent]
    });
    fixture = TestBed.createComponent(IssuanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
