import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../http.service';
import { AuthGuard } from '../../guards/auth.guard';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  messages: any;
  logUser: any;

  constructor(private _httpService: HttpService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _authGuard: AuthGuard) { }

  ngOnInit() {
    this.logUser = { email: "", password: "" };
    this.messages = { success: "", login: "" };
  }

  login() {
    let obs = this._httpService.login(this.logUser);
    obs.subscribe(response => {
      if (response['status'] == false) {
        this.messages = response['messages'];
      }
      else {
        // set token
        this.messages = response['messages'];
        localStorage.setItem('access_token', response['user_id']);
        setTimeout(() => { this.goProfile(); }, 1000);
      }
    });
  }

  goProfile() {
    this._router.navigate(['/profile']);
  }
}
