import { Component, OnInit, PipeTransform } from '@angular/core';
import { KeyValue } from '@angular/common';
import { AppService } from './app.service';
import { MessageService } from './message.service';
import {} from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';


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
  displayedColumns: string[] = ['filename','filetype','tags','uploadDate'];
  title = 'file-saver';
  contents: any;
  mimeTypes = {
    "None": "",
    "aac": "audio/aac",
    "abw": "application/x-abiword",
    "ai": "application/postscript",
    "arc": "application/octet-stream",
    "avi": "video/x-msvideo",
    "azw": "application/vnd.amazon.ebook",
    "bin": "application/octet-stream",
    "bz": "application/x-bzip",
    "bz2": "application/x-bzip2",
    "csh": "application/x-csh",
    "css": "text/css",
    "csv": "text/csv",
    "doc": "application/msword",
    "dll": "application/octet-stream",
    "eot": "application/vnd.ms-fontobject",
    "epub": "application/epub+zip",
    "gif": "image/gif",
    "htm": "text/html",
    "html": "text/html",
    "ico": "image/x-icon",
    "ics": "text/calendar",
    "jar": "application/java-archive",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "js": "application/javascript",
    "json": "application/json",
    "mid": "audio/midi",
    "midi": "audio/midi",
    "mp2": "audio/mpeg",
    "mp3": "audio/mpeg",
    "mp4": "video/mp4",
    "mpa": "video/mpeg",
    "mpe": "video/mpeg",
    "mpeg": "video/mpeg",
    "mpkg": "application/vnd.apple.installer+xml",
    "odp": "application/vnd.oasis.opendocument.presentation",
    "ods": "application/vnd.oasis.opendocument.spreadsheet",
    "odt": "application/vnd.oasis.opendocument.text",
    "oga": "audio/ogg",
    "ogv": "video/ogg",
    "ogx": "application/ogg",
    "otf": "font/otf",
    "png": "image/png",
    "pdf": "application/pdf",
    "ppt": "application/vnd.ms-powerpoint",
    "rar": "application/x-rar-compressed",
    "rtf": "application/rtf",
    "sh": "application/x-sh",
    "svg": "image/svg+xml",
    "swf": "application/x-shockwave-flash",
    "tar": "application/x-tar",
    "tif": "image/tiff",
    "tiff": "image/tiff",
    "ts": "application/typescript",
    "ttf": "font/ttf",
    "txt": "text/plain",
    "vsd": "application/vnd.visio",
    "wav": "audio/x-wav",
    "weba": "audio/webm",
    "webm": "video/webm",
    "webp": "image/webp",
    "woff": "font/woff",
    "woff2": "font/woff2",
    "xhtml": "application/xhtml+xml",
    "xls": "application/vnd.ms-excel",
    "xlsx": "application/vnd.ms-excel",
    "xlsx_OLD": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "xml": "application/xml",
    "xul": "application/vnd.mozilla.xul+xml",
    "zip": "application/zip",
    "3gp": "video/3gpp",
    "3gp_DOES_NOT_CONTAIN_VIDEO": "audio/3gpp",
    "3gp2": "video/3gpp2",
    "3gp2_DOES_NOT_CONTAIN_VIDEO": "audio/3gpp2",
    "7z": "application/x-7z-compressed"
  }

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
              uploadDate: f.uploadDate ??= ''
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
    this.service.getFile(filename, uploadDate).subscribe(response => this.downLoadFile(response));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /**
   * Method is use to download file.
   * @param data - Array Buffer data
   * @param type - type of the document.
   */
  downLoadFile(data: any) {
    const b64toBlob = (b64Data: string, contentType='', sliceSize=512) => {
      const byteCharacters = atob(b64Data);
      const byteArrays = [];

      for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      const blob = new Blob(byteArrays, {type: contentType});
      return blob;
    }

    const blob = b64toBlob(data.fileData, data.metaData.mimeType)
      let url = window.URL.createObjectURL(blob);
      let pwa = window.open(url);
      if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
          alert( 'Please disable your Pop-up blocker and try again.');
      }
    }
  }
