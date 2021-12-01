import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';

import { map, mergeMap, switchMap, tap, toArray } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { MessageService } from './message.service';
import { Subject } from 'rxjs';

@Injectable()
export class AppService {
  private _files = new Subject<any>();
  public readonly files = this._files.asObservable();

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  getFile(fileName: any, uploadDate: any) {
    const params = new HttpParams({ fromObject: { 'uploadDate': uploadDate}});
    return this.http.get(`${environment.apiUrl}/${fileName}`, {params: params})
      .pipe(
        tap( // Log the result or error
          data => this.log(fileName, data),
          error => this.logError(fileName, error)
        )
      );
  }


  getAllFiles(selected: any) {
    const params = new HttpParams({ fromObject: { 'fileType': selected}});
    return this.http.get(`${environment.apiUrl}/files`, {params: params})
    .subscribe(c => {
      this._files.next(c)})
  }

  deleteFile(file: any) {
    return this.http.delete(`${environment.apiUrl}/${file.id}`)
      .pipe(
        tap( // Log the result or error
          data => this.log(file.filename, data, true),
          error => this.logError(file.filename, error, true)
        )
      )
  }

    /**
   * Method is use to download file.
   * @param data - Array Buffer data
   * @param type - type of the document.
   */
     downloadFile(data: any) {
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
      let blobUrl = window.URL.createObjectURL(blob);
      // Create a link element
      const link = document.createElement("a");

      // Set link's href to point to the Blob URL
      link.href = blobUrl;
      link.download = data.fileName;

      // Append link to the body
      document.body.appendChild(link);

      // Dispatch click event on the link
      // This is necessary as link.click() does not work on the latest firefox
      link.dispatchEvent(
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        })
      );

      // Remove link from body
      document.body.removeChild(link);
    }

  private log(filename: string, data: any, isDelete = false) {
    const message =  !isDelete
    ? `Downloaded "${filename}".`
    : `Deleted file ${filename}`
    this.messageService.add(message);
  }

  private logError(filename: string, error: any, isDelete = false) {
    const message = !isDelete
    ? `Failed to download "${filename}"; got error "${error.message}".`
    : `Failed to delete "${filename}"; got error "${error.message}".`
    this.messageService.add(message);
  }
}
