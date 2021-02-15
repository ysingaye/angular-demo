import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppComponent } from './components/app.component';
import { GamesComponent } from './components/games/games.component';
import { HomeComponent } from './components/home/home.component';
import { MenuComponent } from './components/menu/menu.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TicTacToeComponent } from './components/games/tic-tac-toe/tic-tac-toe.component';
import {firebaseConfig} from '../../firebaseConfig';
import {ReactiveFormsModule} from '@angular/forms';
import {Globals} from './globals';
import firebase from 'firebase/app';
import 'firebase/auth';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';

firebase.initializeApp(firebaseConfig.config);
firebase.auth().signInAnonymously();
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    Globals.uid = user.uid;
  } else {
    Globals.uid = false;
  }
});

@NgModule({
  declarations: [
    AppComponent,
    GamesComponent,
    HomeComponent,
    MenuComponent,
    TicTacToeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    NgbModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(firebaseConfig.config),
    AngularFireDatabaseModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
