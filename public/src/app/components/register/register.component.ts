import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../http.service';
import { ActivatedRoute, Params, Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  messages: any;
  newUser: any;
  confirm_password: string;
  constructor(
    private _httpService: HttpService,
    private _route: ActivatedRoute,
    private _router: Router
  ) { }

  goProfile() {
    this._router.navigate(['/profile']);
  }
  ngOnInit() {
    this.confirm_password = "";
    this.newUser = { first_name: "", last_name: "", email: "", user_name: "", password: "" };
    this.messages = { success: "", first_name: "", last_name: "", email: "", user_name: "", password: "", confirm_password: "" };
  }

  register() {
    if (this.newUser.password == this.confirm_password) {
      let observable = this._httpService.register(this.newUser);
      observable.subscribe(response => {
        if (response['status'] == false) {
          this.messages = response['messages'];
        }
        else {
          this.messages = response['messages'];
          localStorage.setItem('access_token', response['user_id']);
          setTimeout(() => { this.goProfile() }, 2000);
        }
      });
    }
    else {
      this.messages['status'] = false;
      this.messages['confirm_password'] = "Missmatch password";
    }
  }
}
