export class TicTacToeGame {
  private _room: string;
  private _players: any[];
  private _playerTurn: string;
  private _board: {};
  private _winner: string;

  constructor(room: string) {
    this._room = room;
    this.setDefaultBoard();
    this._winner = null;
  }

  get room(): string {
    return this._room;
  }

  set room(value: string) {
    this._room = value;
  }

  get players(): any[] {
    return this._players;
  }

  set players(value: any[]) {
    this._players = value;
  }

  get playerTurn(): string {
    return this._playerTurn;
  }

  set playerTurn(value: string) {
    this._playerTurn = value;
  }

  get board(): {} {
    return this._board;
  }

  set board(value: {}) {
    this._board = value;
  }

  setDefaultBoard(): void {
    this._board = {
      '00': '',
      '01': '',
      '02': '',
      10: '',
      11: '',
      12: '',
      20: '',
      21: '',
      22: '',
    };
  }

  get winner(): string {
    return this._winner;
  }

  set winner(value: string) {
    this._winner = value;
  }

  testVictory(position): boolean {
    if (this.testCol(position)) {
      return true;
    }
    if (this.testLine(position)) {
      return true;
    }
    if (this.testAllDiag()) {
      return true;
    }
    return false;
  }

  testCol(position): boolean {
    const col = position.charAt(1);
    for (let i = 0; i < 3; i++) {
      if (this.board[i + col] !== this.playerTurn) {
        return false;
      }
    }
    return true;
  }
  testLine(position): boolean {
    const line = position.charAt(0);
    for (let i = 0; i < 3; i++) {
      if (this.board[line + i] !== this.playerTurn) {
        return false;
      }
    }
    return true;
  }
  testAllDiag(): boolean {
    const leftRight = ['00', '11', '22'];
    const rightLeft = ['02', '11', '20'];

    if (this.testDiag(leftRight)) {
      return true;
    }
    if (this.testDiag(rightLeft)) {
      return true;
    }
    return false;
  }
  testDiag(diag: string[]): boolean {
    const board = this.board;
    const player = this.playerTurn;
    let result = true;

    diag.forEach(position => {
      if (board[position] !== player) {
        result = false;
      }
    });
    return result;
  }

  testNul(): boolean {
    for (const [key, value] of Object.entries(this.board)) {
      if (value === '') {
        return false;
      }
    }
    return true;
  }

  resetGame(): void {
    this._playerTurn = 'X';
    this.setDefaultBoard();
    this._winner = null;
  }
}
