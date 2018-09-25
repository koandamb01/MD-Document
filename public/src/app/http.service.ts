import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CanActivate, Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class HttpService {

  logged: any;
  constructor(private _http: HttpClient,
    private _router: Router) {
    console.log('Http Service');
    this.logged = this.checkStatus();
  }

  register(newUser) {
    return this._http.post('/register', newUser);
  }

  login(user) {
    return this._http.post('/login', user);
  }

  checkStatus() {
    let obs = this._http.get('/checkStatus');
    obs.subscribe(response => {
      console.log("http: ", response['status']);
      return response['status'];
    })
  }

  // getUser(){
  //   return this._http.get('/getUser')
  // }

  newDocument(){
    return this._http.get('/newDocument')    
  }

  isAuthenticated() {
    let token = localStorage.getItem('access_token');
    console.log("Token: ", token);

    if (token) { return true; } else { return false; }
  }
}
