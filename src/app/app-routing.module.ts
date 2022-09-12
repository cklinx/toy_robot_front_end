import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChessBoardComponent } from './components/chess-board/chess-board.component';

const routes: Routes = [
  {path: 'chess-board', component: ChessBoardComponent},
  {path: '', redirectTo: '/chess-board', pathMatch: 'full'},
  {path: '**', redirectTo: '/chess-board', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
