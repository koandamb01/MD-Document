import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../http.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css'],
  providers: [ChatService]
})
export class DocumentComponent implements OnInit {

  constructor(
    private _httpService: HttpService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _chatService: ChatService) {

    this._chatService.onConnect().subscribe(data => { console.log(data); });
    this._chatService.saveDocumentDone().subscribe(response => {
      this.messages = response['messages'];
      this.document.content = response['document']['content'];
    });
  }

  // variable
  user: any;
  user_id: any;
  docID: any
  document = { title: "", content: "" };
  messages: any;
  addingParticipants: any;
  errorMessage1: any;
  successMessage: any;
  participants = [];
  msg: any;
  htmlContent: any;

  ngOnInit() {
    this.addingParticipants = { email: "" }
    this.user = { first_name: "", last_name: "", user_name: "", email: "" };
    this.messages = { title: "" };

    this.getDocID();
    this.getUserID();
    this.getDocument();
    this.getUserInfo();

  }
  removeParticipants(userId) {
    let obs = this._httpService.removeParticipants({ target: userId, killer: this.user_id, document: this.docID });
    obs.subscribe(response => {
      if (response["status"]) {
        this.getParticipants();
      }
      else {
        this.errorMessage1 = response["messages"];
      }
    })
  }

  getParticipants() {
    let obs = this._httpService.getParticipants(this.docID);
    obs.subscribe(response => {
      if (response["status"]) {
        this.participants = response["messages"];
      }
      else {
        this.errorMessage1 = response["messages"];
      }
    })
  }

  // addParticipants(){
  //   let obs = this._httpService.addParticipants({email: this.addingParticipants, docID:  this.docID});
  //   obs.subscribe(response =>{
  //     console.log( response )
  //     if(response["status"]){
  //       this.successMessage = response["messages"];
  //       this.getParticipants();
  //     }
  //     else{
  //       this.errorMessage1 = response["messages"];
  //     }
  //   })
  // }

  inviteParticipants() {
    let obs = this._httpService.inviteParticipants({ email: this.addingParticipants, docID: this.docID, documentTitle: document.title, user_name: this.user["user_name"] });
    obs.subscribe(response => {
      if (response["status"]) {
        this.successMessage = response["messages"];
      }
      else {
        this.errorMessage1 = response["messages"];
      }
    })
  }


  // get document ID
  getUserID() {
    this.user_id = localStorage.getItem('access_token');
  }

  // save document content
  onTyping(e) {
    this._chatService.saveDocument({ document_id: this.docID, content: this.document.content });
    setTimeout(() => { this.resetMessages() }, 3000);
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

  // logout
  logout() {
    localStorage.removeItem('access_token');
    let obs = this._httpService.logout();

    obs.subscribe(response => {
      this.messages = response['messages'];
      this._router.navigate(['/']);
    });
  }
}
