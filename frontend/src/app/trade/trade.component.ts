import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CommonServiceService } from '../service/common-service.service';
import { MatDialog } from '@angular/material/dialog';
import { AssetDialogComponent } from '../asset-dialog/asset-dialog.component';

@Component({
  selector: 'app-trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.scss']
})
export class TradeComponent implements OnInit {
  @ViewChild(MatSort, { static: false }) sort!: MatSort ;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  dataSource = new MatTableDataSource();
  assets = [];
  dummyData = [];
  displayedColumns: String[] = ["position", "requestId",'createdOn','lastUpdatedOn','assetType',"securityType" ,'securityName','status','from', 'to', 'amt_to_receive'];

  constructor(public commonService: CommonServiceService, private dialog: MatDialog) {}

  ngOnInit(): void {
      this.commonService.tab = 'trade';
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
      this.dataSource.data.push({
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
      })
      this.dataSource._updateChangeSubscription();
    });
   }
}
