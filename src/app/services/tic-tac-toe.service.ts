import { Injectable } from '@angular/core';
import {Globals} from '../globals';
import {TicTacToeGame} from '../models/tic-tac-toe.model';
import {AngularFireDatabase, AngularFireObject} from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class TicTacToeService {
  public playerText = '';
  public serverOnOff = 'on';
  public hideNewGame = 'd-none';
  public allRooms = null;

  private _room = '';
  private _board = {};
  private _game: TicTacToeGame;
  private _text = '';
  private _roomRef: AngularFireObject<any> = null;
  private _gameRef: AngularFireObject<any> = null;

  get room(): string {
    return this._room;
  }
  get board(): {} {
    return this._board;
  }
  get text(): {} {
    return this._text;
  }

  constructor(private db: AngularFireDatabase) {
    this._board = TicTacToeGame.getDefaultBoard();
    const ticTacToeRoomsRef = this.db.object('tic-tac-toe/rooms');
    ticTacToeRoomsRef.valueChanges().subscribe(rooms => {
      if (rooms) {
        this.allRooms = rooms;
        for (const [room, values] of Object.entries(rooms)) {
          // @ts-ignore
          const players = values.players;
          if (players[Globals.uid] === Globals.uid) {
            this._room = room;
            this._roomRef = this.db.object('tic-tac-toe/rooms/' + room);
            this.addGameListener().then(() => { });
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

  async sendMove(position): Promise<void> {
    if (this._game) {
      const index = ((this._game.playerTurn === 'X') ? 0 : 1);
      if (!this._game.winner && this._game.players[index] === Globals.uid && this._game.board[position] === '') {
        this._game.board[position] = this._game.playerTurn;

        if (this._game.testVictory(position)) {
          this._game.winner = 'Player ' + this._game.playerTurn + ' win';
        } else if (this._game.testNul()) {
          this._game.winner = 'DRAW';
        } else {
          this._game.playerTurn = ((this._game.playerTurn === 'X') ? 'O' : 'X');
        }
        await this._gameRef.set(this._game);
      }
    }
  }

  async joinRoom(roomName): Promise<void> {
    if (roomName) {
      roomName = roomName.trim();
    }
    if (roomName !== this._room) {
      if (this._roomRef) {
        await this.db.object('tic-tac-toe/rooms/' + this._room + '/players/' + Globals.uid).remove();
        await this._gameRef.set(null);
      }
      this._room = roomName;
      this._roomRef = null;
      this._game = null;
      if (roomName) {
        this._roomRef = this.db.object('tic-tac-toe/rooms/' + roomName);
        const sub = await this.db.object('tic-tac-toe/rooms/' + this._room + '/players').valueChanges().subscribe(async (objPlayers) => {
          let players = [];

          if (objPlayers) {
            players = Object.keys(objPlayers);
          }

          if (!players.includes(Globals.uid)) {
            let nbrPlayer = players.length;
            if (nbrPlayer < 2) {
              const datas = {};
              datas[Globals.uid] = Globals.uid;
              await this.db.object('tic-tac-toe/rooms/' + this._room + '/players').update(datas);
              players.push(Globals.uid);
              nbrPlayer++;
              if (nbrPlayer === 1) {
                this.playerText = 'You are player X';
                this._text = 'Wait for players';
              } else {
                this.playerText = 'You are player O';
                const game = new TicTacToeGame(roomName);
                game.players = players;
                game.playerTurn = 'X';
                this._gameRef = this.db.object('tic-tac-toe/games/' + this.room);
                await this._gameRef.set(game);
              }
              await this.addGameListener();
            } else {
              this.playerText = '';
              this._text = 'Room full';
            }
            sub.unsubscribe();
          }
        });
      }
    }
  }

  private async addGameListener(): Promise<void> {
    if (this._roomRef) {
      this._gameRef = this.db.object('tic-tac-toe/games/' + this.room);
      await this._gameRef.valueChanges().subscribe(game => {
        if (game) {
          this._game = new TicTacToeGame(this.room);
          Object.assign(this._game, game);
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
      });
    }
  }

  async newGame(): Promise<void> {
    if (this._game && this._game.winner) {
      this._game.resetGame();
      await this._gameRef.set(this._game);
    }
  }
}
