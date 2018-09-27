import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../http.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css']
})
export class DocumentComponent implements OnInit {

  constructor(
    private _httpService: HttpService,
    private _route: ActivatedRoute,
    private _router: Router) { }

  // variable
  user: any;
  user_id: any;
  docID: any
  document: any;
  messages: any;
  addingParticipants: any;
  errorMessage1 : any;
  successMessage: any;
  participants= [];

  ngOnInit() {
    this.addingParticipants = { email: "" }
    this.user = { first_name: "", last_name: "", user_name: "", email: "" };
    this.document = { title: "", content: "" };
    this.messages = { title: "" };
    this.getDocID();
    this.getUserID();
    this.getDocument();
    this.getUserInfo();
  }
  removeParticipants(userId){
    let obs = this._httpService.removeParticipants({ target: userId , killer : this.user_id, document: this.docID });
    obs.subscribe(response =>{
      console.log( response )
      if(response["status"]){
        console.log("Removed")
        this.getParticipants();
      }
      else{
        this.errorMessage1 = response["messages"];
      }
    })
  }

  getParticipants(){
    let obs = this._httpService.getParticipants(this.docID);
    obs.subscribe(response =>{
      if(response["status"]){
        this.participants = response["messages"];
        console.log(this.participants);
      }
      else{
        this.errorMessage1 = response["messages"];
      }
    })
  }

  addParticipants(){
    let obs = this._httpService.addParticipants({email: this.addingParticipants, docID:  this.docID});
    obs.subscribe(response =>{
      console.log( response )
      if(response["status"]){
        this.successMessage = response["messages"];
        this.getParticipants();
      }
      else{
        this.errorMessage1 = response["messages"];
      }
    })
  }

  getUserID() {
    this.user_id = localStorage.getItem('access_token');
  }

  test(e) {
    console.log("changing...: ", e);
  }
  // get the user information
  getUserInfo() {
    console.log("user id: ", this.user_id);
    let obs = this._httpService.getOne(this.user_id);
    obs.subscribe(response => {
      if (response['status'] == false) {
        this.messages = response['messages'];
      }
      else {
        this.user = response['user'];
        console.log("user: ", this.user);
      }
    });
  }

  // reset all messages
  resetMessages() { this.messages = { title: "" }; }

  // get the document id from the URL ROUTE
  getDocID() {
    this._route.params.subscribe((params: Params) => {
      this.docID = params['id'];
    });
  }

  // get the document
  getDocument() {
    let obs = this._httpService.getOneDocument(this.docID);
    obs.subscribe(response => {
      if (response['status'] == true) {
        this.document = response['document'];
        this.getParticipants();
      }
    });
  }



  updateTitle() {
    let obs = this._httpService.updateDocumentTitle(this.docID, { title: this.document.title });
    obs.subscribe(response => {
      if (response['status'] == false) {
        this.messages = response['messages'];
      }
      else {
        this.messages = response['messages'];
        setTimeout(() => { this.resetMessages() }, 2000);
      }
    });
  }

}
