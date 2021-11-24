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
import { ReactiveFormsModule } from '@angular/forms';
import { ParsePipe } from './parse.pipe';

@NgModule({
  declarations: [
    AppComponent,
    UploaderComponent,
    MessagesComponent,
    ParsePipe,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MaterialExampleModule,
    NoopAnimationsModule,
    ReactiveFormsModule
  ],
  providers: [AppService, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
