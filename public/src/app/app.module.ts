import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpService } from './http.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import { NgxEditorModule } from 'ngx-editor';
import { FilterPipeModule } from 'ngx-filter-pipe';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatBadgeModule } from '@angular/material/badge';
import { Ng2OrderModule } from 'ng2-order-pipe';
import { MatMenuModule } from '@angular/material/menu';


import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AppRoutingModule } from './/app-routing.module';
import { LogregComponent } from './components/logreg/logreg.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { DocumentComponent } from './components/document/document.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ChatComponent } from './components/chat/chat.component';

const config: SocketIoConfig = { url: 'http://localhost:8000', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    LogregComponent,
    NotfoundComponent,
    DocumentComponent,
    ChatComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    SocketIoModule.forRoot(config),
    TooltipModule.forRoot(),
    NgxEditorModule,
    FilterPipeModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    Ng2OrderModule,
    MatBadgeModule,
    MatMenuModule,
  ],
  providers: [HttpService],
  bootstrap: [AppComponent]
})
export class AppModule { }
