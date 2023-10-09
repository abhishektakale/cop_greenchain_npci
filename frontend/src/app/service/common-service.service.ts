import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonServiceService {

  tab: string = 'issuer';
  user_url: string = 'http://localhost:3000/app/user';
  issuer_url: string = 'http://localhost:3000/app/issuer';

  constructor() { }
}
