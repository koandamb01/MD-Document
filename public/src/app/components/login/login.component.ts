import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../http.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

message:string;
logUser:any;

  constructor(private _httpService: HttpService,
    private _route: ActivatedRoute,
    private _router: Router) { }

  ngOnInit() {
    this.logUser = {
      email: "",
      password: "",
    }
  }

  login(){
      let observable = this._httpService.login(this.logUser);
      observable.subscribe(data =>{    
        console.log(data)
        if(data["status"]){
          this.goProfile()
        }
        else{

        }
      })
    
  }

  goProfile(){
    this._router.navigate(['/profile']);
  }

}
