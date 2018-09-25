import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../http.service';
import { ActivatedRoute, Params, Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
message: string;
newUser: any;
confirmPassword: string;
  constructor(
    private _httpService: HttpService,
    private _route: ActivatedRoute,
    private _router: Router
  ) { }

  ngOnInit() {
    this.newUser = {
      first_name: "",
      last_name: "",
      email: "",
      user_name: "",
      password: "",
    }
  }
  register(){
    if(this.newUser.password == this.confirmPassword){
      console.log (this.newUser)
      let observable = this._httpService.register(this.newUser);
      observable.subscribe(data =>{    
        console.log(data)
      })
    }
    else{
      this.message = "Password does not match with confirmation";
      console.log(this.message)
    }
  }
}
