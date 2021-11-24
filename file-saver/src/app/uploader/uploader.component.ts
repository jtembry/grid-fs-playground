import { Component } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { UploaderService } from './uploader.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.css'],
  providers: [ UploaderService ]
})
export class UploaderComponent {
  message = '';

  myForm = new FormGroup({
    tags: new FormControl(''),
    file: new FormControl('', [Validators.required]),
    fileSource: new FormControl('', [Validators.required]),
  });

  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  tagList: string[] = ['Lease', 'Work-Order', 'Lead'];

  constructor(
    private uploaderService: UploaderService) { }

  get f(){
    return this.myForm.controls;
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.myForm.patchValue({
        fileSource: file
      });
    }
  }

  submit(){
    const file = this.myForm.get('fileSource')?.value
    this.uploaderService.upload(file, this.tagList)
    .subscribe(
      msg => {
        console.log('submit', msg)
      }
    );
  }



  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    // Add our tag
    if (value) {
      this.tagList.push(value);
    }
    // Clear the input value
    event.chipInput!.clear();
  }

  remove(tag: string): void {
    const index = this.tagList.indexOf(tag);
    if (index >= 0) {
      this.tagList.splice(index, 1);
    }
  }
}
