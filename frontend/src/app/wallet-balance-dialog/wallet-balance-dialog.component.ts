import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonServiceService } from '../service/common-service.service';

@Component({
  selector: 'app-wallet-balance-dialog',
  templateUrl: './wallet-balance-dialog.component.html',
  styleUrls: ['./wallet-balance-dialog.component.scss']
})
export class WalletBalanceDialogComponent {
  userWalletDetails;
  constructor(public dialogRef: MatDialogRef<any, any>, private commonService: CommonServiceService) {
    this.userWalletDetails = this.commonService.userWalletDetails;
  }

  close() {
    this.dialogRef.close();
  }
}
