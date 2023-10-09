import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonServiceService } from './common-service.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  user_url: string;
  issuer_url: string;

  constructor(private http: HttpClient, private commonService: CommonServiceService) {
    this.user_url = this.commonService.user_url;
    this.issuer_url = this.commonService.issuer_url;
   }

  createUser(payload: any) {
    return this.http.post(`${this.user_url}/createUser`,payload);
  }

  getUser(organization: string, userId: string) {
    return this.http.get(`${this.user_url}/viewUser/${organization}/${userId}`);
  }

  createIssuerAsset(payload: any) {
     return this.http.post(`${this.issuer_url}/createToken`, payload);
  }

  getAsset(organization?: string, tokenId?: string) {
    return this.http.get(`${this.issuer_url}/viewToken/${organization}/${tokenId}`);
  }

  issueAsset(payload: any) {
    return this.http.post(`${this.issuer_url}/issueToken`, payload);
  }

  tradeAsset(payload: any) {
    return this.http.post(`${this.user_url}/transferToken`, payload);
  }

  getTradedAsset() {
    return this.http.get(`${this.user_url}/transferToken`);
  }
}
