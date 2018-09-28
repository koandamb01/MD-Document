import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../http.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FilterPipe } from 'ngx-filter-pipe';
import 'hammerjs';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(
    private _httpService: HttpService,
    private _route: ActivatedRoute,
    private _router: Router,
    private filterPipe: FilterPipe) { }

  showFiller = false;
  // variables
  user: any;
  user_id: any;
  messages: any;
  passwordInfo: any;
  documentList = [];
  recentList = [];
  notifications = [];
  filter: any;
  hasNot: boolean;  //has Notification false at start

  ngOnInit() {
    this.user = { first_name: "", last_name: "", user_name: "", email: "" };
    this.passwordInfo = { old_password: "", password: "", confirm_password: "" };
    this.messages = { success: "", first_name: "", last_name: "", email: "", user_name: "", password: "", confirm_password: "" };
    this.filter = { title: '' };
    this.hasNot = false; //has Notification false at start
    this.getUserID();
    this.getUserInfo();
    this.grabDocument();
    this.getRecent();
    this.getNotifications();
  }

  logout() {
    localStorage.removeItem('access_token');
    let obs = this._httpService.logout();

    obs.subscribe(response => {
      this.messages = response['messages'];
      this._router.navigate(['/']);
    });
  }

  goLogin() {
    this._router.navigate(['/']);
  }

  getUserID() {
    this.user_id = localStorage.getItem('access_token');
  }

  // get the user information
  getUserInfo() {
    let obs = this._httpService.getOne(this.user_id);
    obs.subscribe(response => {
      if (response['status'] == false) {
        this.messages = response['messages'];
      }
      else {
        this.user = response['user'];
      }
    });
  }

  // updated personal info
  UpdatePersonalInfo() {
    let obs = this._httpService.updatePersonalInfo(this.user_id, this.user);
    obs.subscribe(response => {
      if (response['status'] == false) {
        this.messages = response['messages'];
      }
      else {
        this.messages = response['messages'];
        setTimeout(() => { this.ngOnInit() }, 2000);
      }
    })
  }

  // updated password
  updatePassword() {
    console.log("userID: ", this.user_id);
    if (this.passwordInfo.new_password != this.passwordInfo.confirm_password) {
      this.messages['status'] = false;
      this.messages['confirm_password'] = "Missmatch password";
    }
    else {
      let obs = this._httpService.updatePassword(this.user_id, { old_password: this.passwordInfo.old_password, new_password: this.passwordInfo.new_password });
      obs.subscribe(response => {
        if (response['status'] == false) {
          this.messages = response['messages'];
        }
        else {
          this.messages = response['messages'];
          setTimeout(() => { this.ngOnInit() }, 2000);
        }
      })
    }
  }

  // create a new document
  newDocument() {
    let obs = this._httpService.createDocument(this.user_id);
    obs.subscribe(response => {
      if (response['status'] == false) {
        this.messages = response['messages'];
      }
      else {
        localStorage.setItem('document_id_token', response['document_id']);
        this._router.navigate(['/document/' + response['document_id'] + '/edit']);
      }
    });
  }

  grabDocument() {
    let obs = this._httpService.getDocument();
    obs.subscribe(response => {
      if (response['status'] == false) {
        this.messages = response['messages'];
      }
      else if (response["messages"] == "No documents") {
      }
      else {
        this.documentList = response["documents"];
      }
    });
  }

  getRecent() {
    let obs = this._httpService.getRecent();
    obs.subscribe(response => {
      if (response['status'] == false) {
        this.messages = response['messages'];
      }
      else if (response["messages"] == "No documents") {
      }
      else {
        this.recentList = response["documents"];
      }
    });
  }

  getNotifications() {
    let obs = this._httpService.getNotifications();
    obs.subscribe(response => {
      if (response['status'] == false) {
        this.messages = response['messages'];
        console.log("Error notification")
      }
      else if (response["messages"] == "No notifications") {
        this.hasNot = false;
        console.log("No notification")
      }
      else {
        this.notifications = response["notifications"];
        this.hasNot = true;
        console.log("Got notification", this.notifications)
      }
    });
  }

  editDocument(id) {
    localStorage.setItem('document_id_token', id);
    this._router.navigate(['/document/' + id + '/edit']);
  }

  deleteNotifications(notID) {
    //Please pass in notification.ID as a parameter
    let obs = this._httpService.deleteNotifications(notID);
    obs.subscribe(response => {
      if (response['status'] == false) {
      }
      else {
        this.getNotifications();
      }
    });
  }
}
