import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { HttpClientModule } from '@angular/common/http';
import { UploaderComponent } from './uploader/uploader.component';
import { MessagesComponent } from './messages/messages.component'
import { MessageService } from './message.service';

@NgModule({
  declarations: [
    AppComponent,
    UploaderComponent,
    MessagesComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
  ],
  providers: [AppService, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
