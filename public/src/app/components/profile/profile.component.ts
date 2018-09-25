import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../http.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private _httpService: HttpService,
    private _route: ActivatedRoute,
    private _router: Router) { }

  ngOnInit() {
<<<<<<< HEAD
    // this.checkStatus();
  }

  // checkStatus() {
  //   console.log("Im here");
  //   let observable = this._httpService.checkStatus();
  //   observable.subscribe(response => {
  //     if (response["status"] == false) {
  //       this.goLogin();
  //     }
  //   })
  // }
  // goLogin() {
  //   this._router.navigate(['/']);
  // }

  logout() {
    localStorage.removeItem('access_token');
=======
    this.checkStatus();
    this.editProfile = {
      first_name: "",
      last_name: "",
      user_name:"",
      email:""
    }
  }

  editProfile: any;

  checkStatus(){
    let observable = this._httpService.checkStatus();
      observable.subscribe(data =>{ 
        if(data["status"]){
          console.log("Good")
        }
        else{
          this.goLogin();
        }
      })
  }

  updateProfie(){
    console.log(this.editProfile)
  }

  goLogin(){
>>>>>>> 11d19d57faddb05cfdd065c3a17c32170318b861
    this._router.navigate(['/']);
  }
}
