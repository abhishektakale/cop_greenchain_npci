import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Data } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URLS } from '../urls';
import { CommonServiceService } from '../service/common-service.service';
import { ApiService } from '../service/api.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-asset-dialog',
  templateUrl: './asset-dialog.component.html',
  styleUrls: ['./asset-dialog.component.scss'],
  providers: [CookieService]
})
export class AssetDialogComponent implements OnInit {
  stores = [];
  isEdit: Boolean = false;
  aseet= { "Expiry": "", "SecurityType": "", "ID": "", "SecurityName": "", "FaceValue": "", "ISIN": "", "Entity": "" };
  buttonText = "Save";
  orgName: string;
  form = new FormGroup({
    SecurityType: new FormControl(''),
    Expiry: new FormControl(''),
    SecurityName: new FormControl(''),
    ISIN: new FormControl(''),
    FaceValue: new FormControl(0),
    Entity: new FormControl(''),
    MarketValue: new FormControl(100)
  });
  httpOptions: any;
  data:any;
  constructor(public dialogRef: MatDialogRef<any, any>,
    @Inject(MAT_DIALOG_DATA) public dialogdata: Data, private snackBar: MatSnackBar, private _http: HttpClient, public commonService: CommonServiceService, private apiService: ApiService, private cookieService: CookieService) {
    console.log(dialogdata);
    this.data=dialogdata;
    if (dialogdata) {
      var data = dialogdata;
      this.aseet.SecurityType = data['SecurityType'];
      this.aseet.Expiry = data['Expiry'];
      this.aseet.SecurityName = data['SecurityName'];
      this.aseet.ID = data['Id'];
      this.aseet.FaceValue = data['FaceValue'];
      this.aseet.ISIN = data['ISIN'];
      this.aseet.Entity = data['Entity']
    }
    this.orgName = this.cookieService.get('OrgName');
    console.log(this.aseet)
  }
  ngOnInit() {

  }

  onSubmit() {
    console.log(this.form.value);
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'

      })
    }

    if(this.commonService.tab === 'issuer') {
      let payload = {
        orgName: this.orgName,
        tokenDetails: {
          ISIN: this.form.controls['ISIN'].value,
          ExpiryTime: this.form.controls['Expiry'].value,
          SecurityType: this.form.controls['SecurityType'].value,
          SecurityName: this.form.controls['SecurityName'].value,
          CreatedTime: new Date().toString(),
          UpdatedTime: new Date().toString(),
          FaceValue: this.form.controls['FaceValue'].value,
          Status: "Active"
        }
      }
      this.apiService.createIssuerAsset(payload).subscribe(response => {
        console.log("Create Issuer Asset ==> ", response);
      }, (error) => {
        console.log("Error in create issuer asset API ", error);
      })
    }
    else if (this.commonService.tab === 'issuance') {
      let payload = {
        orgName : this.orgName,
        tokenDetails: {
          TokenId: this.form.controls['SecurityName'].value,
          ReceiverAddress: this.form.controls['Entity'].value
        }
      }
      this.apiService.issueAsset(this.form.value).subscribe(response => {
        console.log("Issue Token ", response);
      }, (error) => {
        console.log("Error in Issuing Token ", error);
      })
    }
    else {
      let payload = {
        orgName : this.orgName,
        tokenDetails: {
          TokenId: this.form.controls['SecurityName'].value,
          ReceiverAddress: this.form.controls['Entity'].value
        }
      }
      this.apiService.tradeAsset(payload).subscribe(response => {
        console.log("Trade Asset Successful ", response);
      }, (error) => {
        console.log("Error in Trade Asset ", error);
      })
    }
   
  }
  close() {
    this.dialogRef.close();
  }
}