import { Injectable } from '@angular/core';
import firebase from 'firebase';
import Reference = firebase.database.Reference;
import {Globals} from '../globals';
import {TicTacToeGame} from '../models/tic-tac-toe.model';

@Injectable({
  providedIn: 'root'
})
export class TicTacToeService {
  public playerText = '';
  public serverOnOff = 'on';
  public hideNewGame = 'd-none';

  private _room = '';
  private _board = {};
  private _game: TicTacToeGame;
  private _text = '';
  private _ticTacToeRef: Reference;
  private _roomRef: Reference = null;


  get room(): string {
    return this._room;
  }
  get board(): {} {
    return this._board;
  }
  get text(): {} {
    return this._text;
  }

  constructor() {
    const db = firebase.database();
    this._ticTacToeRef = db.ref('tic-tac-toe');

    this._ticTacToeRef.once('value').then((snapshot) => {
      const rooms = snapshot.val();
      if (rooms) {
        for (const [room, values] of Object.entries(rooms)) {
          // @ts-ignore
          const players = values.players;
          if (players[Globals.uid] === Globals.uid) {
            this._room = room;
            this._roomRef = this._ticTacToeRef.child(room);
            this.addGameListener();
            break;
          }
        }
      }
    }, (error) => {
      if (error) {
        this.serverOnOff = 'off';
      }
    });
  }

  sendMove(position): void {
    if (this._game) {
      const index = ((this._game.playerTurn === 'X') ? 0 : 1);
      if (!this._game.winner && this._game.players[index] === Globals.uid && this._game.board[position] === '') {
        this._game.board[position] = this._game.playerTurn;

        if (this._game.testVictory(position)) {
          this._game.winner = 'Player ' + this._game.playerTurn + ' win';
        }
        else if (this._game.testNul()) {
          this._game.winner = 'DRAW';
        }
        else {
          this._game.playerTurn = ((this._game.playerTurn === 'X') ? 'O' : 'X');
        }
        this._roomRef.child('game').set(this._game);
      }
    }
  }

  async joinRoom(roomName): Promise<void> {
    if (roomName) {
      roomName = roomName.trim();
    }
    if (roomName !== this._room) {
      if (this._roomRef) {
        this._roomRef.child('game').off();
        this._roomRef.child('players/' + Globals.uid).remove();
        this._roomRef.child('game').set(null);
      }
      this._room = roomName;
      this._roomRef = null;
      this._game = null;
      if (roomName) {
        this._roomRef = this._ticTacToeRef.child(roomName);

        let players = [];
        await this._roomRef.child('players').once('value').then((snapshot) => {
          if (snapshot.val()) {
            players = Object.keys(snapshot.val());
          }
        });
        let nbrPlayer = players.length;

        if (nbrPlayer < 2) {
          const datas = {};
          datas[Globals.uid] = Globals.uid;
          this._roomRef.child('players').update(datas);
          players.push(Globals.uid);
          nbrPlayer++;
          if (nbrPlayer === 1){
            this.playerText = 'You are player X';
            this._text = 'Wait for players';
          }
          else {
            this.playerText = 'You are player O';
            const game = new TicTacToeGame(roomName);
            game.players = players;
            game.playerTurn = 'X';
            this._roomRef.child('game').set(game);
          }
          this.addGameListener();
        }
        else {
          this.playerText = '';
          this._text = 'Room full';
        }
      }
    }
  }

  private addGameListener(): void {
    if (this._roomRef) {
      this._roomRef.child('game').on('value', (snapshot) => {
        console.log('GAME CHANGE');
        if (snapshot.val()) {
          this._game = new TicTacToeGame(this.room);
          Object.assign(this._game, snapshot.val());
          if (this._game.winner) {
            this.hideNewGame = '';
            this._text = this._game.winner;
          }
          else {
            this.hideNewGame = 'd-none';
            this._text = 'Player turn: ' + this._game.playerTurn;
          }
          this.playerText = 'You are player ' + ((this._game.players[0] === Globals.uid) ? 'X' : 'O');
          this._board = this._game.board;
        }
        else {
          this._game = null;
          this.playerText = 'You are player X';
          this._text = 'Wait for players';
        }
        console.log('GAME CHANGE FINISH');
      });
    }
  }

  newGame(): void {
    if (this._game && this._game.winner) {
      this._game.resetGame();
      this._roomRef.child('game').set(this._game);
    }
  }
}
