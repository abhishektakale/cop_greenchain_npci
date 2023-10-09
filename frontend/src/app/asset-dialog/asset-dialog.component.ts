import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Data } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URLS } from '../urls';
import { CommonServiceService } from '../service/common-service.service';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-asset-dialog',
  templateUrl: './asset-dialog.component.html',
  styleUrls: ['./asset-dialog.component.scss']
})
export class AssetDialogComponent implements OnInit {
  stores = [];
  isEdit: Boolean = false;
  aseet= { "Expiry": "", "SecurityType": "", "ID": "", "SecurityName": "", "FaceValue": "", "ISIN": "", "Entity": "" };
  buttonText = "Save";
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
    @Inject(MAT_DIALOG_DATA) public dialogdata: Data, private snackBar: MatSnackBar, private _http: HttpClient, public commonService: CommonServiceService, private apiService: ApiService) {
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

    this.apiService.createIssuerAsset(this.form.value).subscribe(response => {
      console.log("Create User ==> ", response);
    }, (error) => {
      console.log("Error in create issuer asset API ", error);
    })
   
  }
  close() {
    this.dialogRef.close();
  }
}