import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private router: Router, private apiService: ApiService) {
    this.loginForm = this.formBuilder.group({
      userId: [''],
      organization: ['']
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.apiService.createUser(this.loginForm.value).subscribe(response => {
        console.log('User Created Successfully',response);
        this.router.navigate(['/home']);
      }, (error) => {
        console.log('Error in Creating User', error);
      });
    } else {
      return;
    }
  }

}
