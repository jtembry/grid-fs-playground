import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AppService } from './app.service';
import { MessageService } from './message.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(
    private service: AppService,
    private messageService: MessageService
    ){

  }
  public file$ = this.service.files
  title = 'file-saver';
  fileList: any;
  contents: any;

  ngOnInit() {
    this.service.getAllFiles()
  }

  clear() {
    this.contents = undefined;
  }

  download(fileName: string) {
    this.service.getFile(fileName).subscribe(response => this.downLoadFile(response));
  }


  /**
   * Method is use to download file.
   * @param data - Array Buffer data
   * @param type - type of the document.
   */
  downLoadFile(data: any) {
      let url = window.URL.createObjectURL(new Blob([data.fileData]));
      let pwa = window.open(url);
      if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
          alert( 'Please disable your Pop-up blocker and try again.');
      }
    }
  }
