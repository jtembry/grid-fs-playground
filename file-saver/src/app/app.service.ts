import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';

import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { MessageService } from './message.service';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class AppService {
  private _files = new Subject<any>();
  public readonly files = this._files.asObservable();

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  getFile(filename: any) {
    // console.log('test', filename)
    return this.http.get(`${environment.apiUrl}/${filename}`)
      .pipe(
        tap( // Log the result or error
          data => this.log(filename, data),
          error => this.logError(filename, error)
        )
      );
  }


  getAllFiles(selected: any) {
    const params = new HttpParams({ fromObject: { 'fileType': selected}});
    console.log('params', params)
    return this.http.get(`${environment.apiUrl}/files`, {params: params})
    .subscribe(c => this._files.next(c))
  }



  private log(filename: string, data: any) {
    const message = `DownloaderService downloaded "${filename}" and got "${data}".`;
    this.messageService.add(message);
  }

  private logError(filename: string, error: any) {
    const message = `DownloaderService failed to download "${filename}"; got error "${error.message}".`;
    console.error(message);
    this.messageService.add(message);
  }
}
