import { Component, OnInit, PipeTransform } from '@angular/core';
import { KeyValue } from '@angular/common';
import { AppService } from './app.service';
import { MessageService } from './message.service';
import {} from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { mimeTypes } from './mimeTypes'


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
  dataSource: any
  displayedColumns: string[] = ['filename','filetype','tags','uploadDate','deleteButton'];
  title = 'file-saver';
  contents: any;
  mimeTypes = mimeTypes;


  ngOnInit() {
    this.service.getAllFiles('')

    this.service.files.subscribe(d => {
        const data: any[] | undefined = []
        d.forEach((f: any) => {
            data.push(
            {
              filename: f.filename,
              mimeType: f.metadata.mimeType ??= '',
              tags: f.metadata.tags ??= '',
              uploadDate: f.uploadDate ??= '',
              id: f._id ??= ''
            })
        })
      this.dataSource = new MatTableDataSource(data)

    })
  }

  onSelect(selected: any) {
    this.service.getAllFiles(selected)
  }

  clear() {
    this.contents = undefined;
  }

  download(filename: string, uploadDate: string) {
    this.service.getFile(filename, uploadDate)
    .subscribe(response => this.service.downloadFile(response));
  }

  deleteFile(file: any) {
    this.service.deleteFile(file).toPromise()
    .then(() => this.service.getAllFiles(''));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  }
