import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { Socket } from 'ng-socket-io';

@Injectable()
export class ChatService {

  constructor(private socket: Socket) { }

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
}