import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AssetDialogComponent } from './asset-dialog/asset-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatNativeDateModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { IssuanceComponent } from './issuance/issuance.component';
import {MatSelectModule} from '@angular/material/select';
import { TradeComponent } from './trade/trade.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MatCardModule } from '@angular/material/card';
import { WalletBalanceDialogComponent } from './wallet-balance-dialog/wallet-balance-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    AssetDialogComponent,
    IssuanceComponent,
    TradeComponent,
    HomeComponent,
    LoginComponent,
    WalletBalanceDialogComponent
  ],
  imports: [
    BrowserModule, MatDatepickerModule, MatNativeDateModule, MatSelectModule,
    AppRoutingModule, HttpClientModule, BrowserAnimationsModule, MatTableModule,MatInputModule,MatButtonModule,MatPaginatorModule,
    MatDialogModule,FormsModule, ReactiveFormsModule,MatSnackBarModule,MatIconModule,MatToolbarModule, MatCardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
