import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'cd-error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.scss']
})
export class ErrorDialogComponent {

  title: string;
  body: string;
  constructor(protected dialogRef: NbDialogRef<ErrorDialogComponent>) {
  }

  close() {
    console.log('Closing dialog');
    this.dialogRef.close();
  }

}
