import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { HttpClientModule } from '@angular/common/http';
import { UploaderComponent } from './uploader/uploader.component';
import { MessagesComponent } from './messages/messages.component'
import { MessageService } from './message.service';
import { MaterialExampleModule } from './material.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    UploaderComponent,
    MessagesComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MaterialExampleModule,
    NoopAnimationsModule
  ],
  providers: [AppService, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
