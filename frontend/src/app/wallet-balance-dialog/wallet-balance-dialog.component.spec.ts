import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletBalanceDialogComponent } from './wallet-balance-dialog.component';

describe('WalletBalanceDialogComponent', () => {
  let component: WalletBalanceDialogComponent;
  let fixture: ComponentFixture<WalletBalanceDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WalletBalanceDialogComponent]
    });
    fixture = TestBed.createComponent(WalletBalanceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
