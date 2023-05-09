import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-tradeguard',
  templateUrl: './tradeguard.component.html',
  styleUrls: ['./tradeguard.component.css']
})
export class TradeguardComponent {

  constructor(private dialogRef: MatDialogRef<TradeguardComponent>) { }


  closeDialog(): void {
    this.dialogRef.close();
  }


}
