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
  displayedColumns: String[] = ["position", "requestId",'createdOn','lastUpdatedOn','assetType',"securityType" ,'securityName','status','from', 'to', 'amt_to_receive'];

  constructor(public commonService: CommonServiceService, private dialog: MatDialog, private apiService: ApiService, private cookieService: CookieService) {
    this.userId = this.cookieService.get('UserId');
    this.orgName = this.cookieService.get('OrgName');

  }

  ngOnInit(): void {
      this.commonService.tab = 'trade';
  }

  getAllTokens() {
    this.apiService.getAllTokens(this.userId).subscribe((response: any) => {
      response.forEach((tokenDetails:any) => {
      console.log("Get All Tokens ", response);

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
      let payload = {
        orgName: this.orgName,
      }
/*       this.dataSource.data.push({
        requestId: 'REQ_TRA_GB_001',
        createdOn: 'October 06, 2023',
        lastUpdatedOn: 'October 06, 2023',
        assetType: 'Green Bond',
        securityType: 'Green Bond',
        securityName: 'Green Bond 31-10-2023',
        quantity: 1,
        status: 'Processed',
        isin: 'INGB001',
        to: 'Adani',
        from: 'Reliance',
        amt_to_receive: 100
      }) */
      this.dataSource._updateChangeSubscription();
    });
   }
}
