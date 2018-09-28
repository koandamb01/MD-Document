import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { Socket } from 'ng-socket-io';

@Injectable()
export class ChatService {

  constructor(private socket: Socket) { }
  // document id
  // docID
  onConnect() {
    const obs = new Observable<{ response: String }>(observer => {
      this.socket.on('connected', (data) => {
        observer.next(data);
      })
    })
    return obs;
  }



  saveDocument(document) {
    this.socket.emit("saveDocument", document);
  }


  saveDocumentDone() {
    const obs = new Observable<{ response: String }>(observer => {
      this.socket.on('saveDocumentDone', (data) => {
        observer.next(data);
      })
    })
    return obs;
  }


  // ############### MESSAGES LOGIC BELOW ##################

  // on connected send document data
  sendDocumentID() {
    let docID = localStorage.getItem('document_id_token');
    this.socket.emit('document_id', docID);
  }
  sendMessage(messageInfo) {
    this.socket.emit('send_message', messageInfo);
  }

  receivedMessages() {
    let docID = localStorage.getItem('document_id_token');
    const obs = new Observable<{ response: String }>(observer => {
      this.socket.on('documentMessages_' + docID, (data) => {
        observer.next(data);
      })
    })
    return obs;
  }

}