import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { PokeballsComponent } from './pokeballs.component';



@NgModule({
  declarations: [
    PokeballsComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {path: 'pokeballs', component: PokeballsComponent}
    ])
  ]
})
export class PokeballsModule { }
