import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GamesComponent } from './components/games/games.component';
import { HomeComponent } from './components/home/home.component';
import { TicTacToeComponent } from './components/games/tic-tac-toe/tic-tac-toe.component';

const routes: Routes = [
  { path: 'games', component: GamesComponent },
  { path: 'games/tic-tac-toe', component: TicTacToeComponent },
  { path: '', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
