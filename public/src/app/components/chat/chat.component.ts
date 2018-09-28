import { Component, OnInit, Input, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { HttpService } from '../../http.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { pipes, HumanizePipe } from 'angular2-humanize';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  @Input() docID: any;
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  constructor(
    private _httpService: HttpService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _chatService: ChatService
  ) {
    this._chatService.onConnect().subscribe(data => {
      this._chatService.sendDocumentID();
    });

    this._chatService.receivedMessages().subscribe(response => {
      this.chats = response['chats'];
      this.myMessage = "";
    });
  }

  // variables
  myMessage: any;
  user_id: any;
  chats: any;
  ngOnInit() {
    this.getUserID()
    this._chatService.receivedMessages();
    this.scrollToBottom();
  }

  ngOnDestroy(): void {
    localStorage.removeItem('document_id_token');
  }

  // get User ID
  getUserID() {
    this.user_id = localStorage.getItem('access_token');
  }

  // get document ID
  getDocumentID() {
    return this.docID;
  }
  sendMessage() {
    this._chatService.sendMessage({ user_id: this.user_id, document_id: this.docID, message: this.myMessage });
  }

  // ######### LOGIC FOR SCROLL
  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

}

