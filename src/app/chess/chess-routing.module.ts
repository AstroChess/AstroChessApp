import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ChessComponent } from './chess.component';

const routes: Routes = [
  {
    path: '',
    component: ChessComponent,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChessRoutingModule {}
