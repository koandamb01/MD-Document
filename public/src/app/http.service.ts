import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private _http: HttpClient) { }

  register(data) {
    return this._http.post('/register', data);
  }

  login(data) {
    console.log("form data: ", data);
    return this._http.post('/login', data);
  }
}
