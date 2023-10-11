import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CommonServiceService } from '../service/common-service.service';
import { MatDialog } from '@angular/material/dialog';
import { AssetDialogComponent } from '../asset-dialog/asset-dialog.component';
import { ApiService } from '../service/api.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.scss'],
  providers: [CookieService]
})
export class TradeComponent implements OnInit {
  @ViewChild(MatSort, { static: false }) sort!: MatSort ;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  dataSource = new MatTableDataSource();
  assets = [];
  dummyData = [];
  userId: string;
  orgName: string;
  allUsers: Array<any> = [];
  allTokens: Array<any> = [];
  users: any = [];
  displayedColumns: String[] = ["position", "requestId",'createdOn','lastUpdatedOn','assetType',"securityType" ,'securityName','status','from', 'to', 'amt_to_receive'];

  constructor(public commonService: CommonServiceService, private dialog: MatDialog, private apiService: ApiService, private cookieService: CookieService) {
    this.userId = this.cookieService.get('UserId');
    this.orgName = this.cookieService.get('OrgName');
    this.allUsers = this.commonService.allUsers;
    this.allTokens = this.commonService.allTokens;

  }

  ngOnInit(): void {
      this.commonService.tab = 'trade';
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
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
   }

   tradeAsset() {
    const dialogRef = this.dialog.open(AssetDialogComponent, {
      width: '500px', height: '100vh',position:{right:'0'},

    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataSource.data.push(result)
        this.dataSource._updateChangeSubscription();
      }
      this.getAllTokens();
      this.dataSource._updateChangeSubscription();
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
