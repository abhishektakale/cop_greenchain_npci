import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../service/api.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [CookieService]
})
export class LoginComponent {

  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private router: Router, private apiService: ApiService, private cookieService: CookieService) {
    this.loginForm = this.formBuilder.group({
      userId: [''],
      organization: ['']
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
        let payload = {
          userId: this.loginForm.controls['userId'].value,
          orgName: this.loginForm.controls['organization'].value
        }

        // Remove after API integration
        this.cookieService.set('UserId', this.loginForm.controls['userId'].value);
        this.cookieService.set('OrgName', this.loginForm.controls['organization'].value);


       this.apiService.createUser(payload).subscribe(response => {
        console.log('User Created Successfully',response);
        this.cookieService.set('UserId', this.loginForm.controls['userId'].value);
        this.cookieService.set('OrgName', this.loginForm.controls['organization'].value);
        this.router.navigate(['/home']);
      }, (error) => {
        console.log('Error in Creating User', error);
      });
    } else {
      return;
    }
  }

}
