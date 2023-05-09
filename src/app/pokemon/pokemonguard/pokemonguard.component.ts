import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-pokemonguard',
  templateUrl: './pokemonguard.component.html',
  styleUrls: ['./pokemonguard.component.css']
})
export class PokemonguardComponent {

  constructor(private dialogRef: MatDialogRef<PokemonguardComponent>) { }


  closeDialog(): void {
    this.dialogRef.close();
  }


}
