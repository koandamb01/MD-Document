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
  }

  register(newUser) {
    return this._http.post('/register', newUser);
  }

  login(user) {
    return this._http.post('/login', user);
  }

  checkStatus() {
    return this._http.get('/checkStatus');
  }

  getOne(userID) {
    return this._http.get('/getOne/' + userID);
  }

  updatePersonalInfo(userID, userInfo) {
    return this._http.post('/updatePersonalInfo/' + userID, userInfo);
  }

  updatePassword(userID, userInfo) {
    return this._http.post('/updatePassword/' + userID, userInfo);
  }

  isAuthenticated() {
    let token = localStorage.getItem('access_token');
    if (token) { return true; } else { return false; }
  }
}
