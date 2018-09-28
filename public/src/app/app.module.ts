import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpService } from './http.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import { NgxEditorModule } from 'ngx-editor';
import { FilterPipeModule } from 'ngx-filter-pipe';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AppRoutingModule } from './/app-routing.module';
import { LogregComponent } from './components/logreg/logreg.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { DocumentComponent } from './components/document/document.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

const config: SocketIoConfig = { url: 'http://localhost:8000', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    LogregComponent,
    NotfoundComponent,
    DocumentComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    SocketIoModule.forRoot(config),
    NgxEditorModule,
    TooltipModule.forRoot(),
    FilterPipeModule
  ],
  providers: [HttpService],
  bootstrap: [AppComponent]
})
export class AppModule { }
