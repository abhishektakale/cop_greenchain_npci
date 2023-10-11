import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AssetDialogComponent } from '../asset-dialog/asset-dialog.component';
import { URLS } from '../urls';
import { Router } from '@angular/router';
import { CommonServiceService } from '../service/common-service.service';
import { ApiService } from '../service/api.service';
import { WalletBalanceDialogComponent } from '../wallet-balance-dialog/wallet-balance-dialog.component';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [CookieService],
})
export class HomeComponent {
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  dataSource = new MatTableDataSource();
  httpOptions;
  title = 'frontend';
  assets = [];
  dummyData = [];
  userId: string;
  orgName: string;
  displayedColumns: String[] = [
    'position',
    'requestId',
    'createdOn',
    'lastUpdatedOn',
    'assetType',
    'securityType',
    'securityName',
    'quantity',
    'status',
    'isin',
  ];
  users: any = [];
  allUsers: any;
  constructor(
    private _http: HttpClient,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    public commonService: CommonServiceService,
    private apiService: ApiService,
    private cookieService: CookieService
  ) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }),
    };

    this.userId = this.cookieService.get('UserId');
    this.orgName = this.cookieService.get('OrgName');
  }
  ngOnInit() {
    this.commonService.tab = 'issuer';
    // this.getAsset();
    this.getAllTokens();
    this.getAllUsers();
  }

  getAllTokens() {
    this.dataSource.data = [];
    this.apiService.getAllTokens(this.userId).subscribe((response: any) => {
      this.commonService.allTokens = response;
      response.forEach((tokenDetails: any) => {

        this.dataSource.data.push({
          requestId: tokenDetails.TokenId,
          createdOn: tokenDetails.CreateTimestamp,
          lastUpdatedOn: tokenDetails.UpdatedTimestamp,
          assetType: 'Green Bond',
          securityType: tokenDetails.SecurityType,
          securityName: tokenDetails.SecurityName,
          quantity: 1,
          status: tokenDetails.Status,
          isin: tokenDetails.Isin,
        })
        this.dataSource._updateChangeSubscription();
      })
    }, (error) => {
      console.log("Error in Get All Tokens ", error);
    })
  }

  addNewAsset() {
    const dialogRef = this.dialog.open(AssetDialogComponent, {
      width: '500px',
      height: '100vh',
      position: { right: '0' },
    });
    console.log(this.dataSource.data);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // this.dataSource.data.push(result)
        this.dataSource._updateChangeSubscription();
      }
      this.getAllTokens();
      this.dataSource._updateChangeSubscription();
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  ngAfterViewInit() {
    console.log('after ininti');
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  navigateToIssuance() {
    this.commonService.tab = 'issuance';
    let index = this.displayedColumns.indexOf('issuedTo');
    if (index === -1) this.displayedColumns.push('issuedTo');

    let reqTypeIndex = this.displayedColumns.indexOf('requestType');
    if (index > -1) this.displayedColumns[reqTypeIndex] = 'quantity';
    //this.router.navigate(['/issuance'])

    this.getAllTokens();

    // this.dataSource.data = [];
  }

  createNewAsset() {
    this.commonService.tab = 'issuer';
    let index = this.displayedColumns.indexOf('issuedTo');
    if (index > -1) this.displayedColumns.splice(index, 1);

    let reqTypeIndex = this.displayedColumns.indexOf('requestType');
    if (index > -1) this.displayedColumns[reqTypeIndex] = 'quantity';
  }

  onTransactionHistoryClick() {
    this.commonService.tab = 'transaction';
    let index = this.displayedColumns.indexOf('quantity');
    if (index > -1) this.displayedColumns[index] = 'requestType';
  }

  getAsset() {
    let tokenId = 'T001';
    this.apiService.getAsset(this.orgName, tokenId).subscribe(
      (response) => {
        console.log('Get Asset ===> ', response);
      },
      (error) => {
        console.log('Error in Get Asset API ', error);
      }
    );
  }

  showWalletBalanceDialog() {
    this.apiService.getUser(this.orgName, this.userId).subscribe((response) => {
      this.commonService.userWalletDetails = response;
      console.log(response);
      const dialogRef = this.dialog.open(WalletBalanceDialogComponent, {
        width: '500px',
        height: '50vh',
        position: { top: '150px' },
      });
    }, (error) => {
      console.log("Error in fetching user info ", error);
    });
  }

  getAllUsers() {
    this.apiService.getAllUsers().subscribe((response: any) => {
      this.users = response;
      this.commonService.allUsers = this.users.filter((user: any) => user.UserName != this.userId);
      console.log(this.allUsers)
    })
  }
}
