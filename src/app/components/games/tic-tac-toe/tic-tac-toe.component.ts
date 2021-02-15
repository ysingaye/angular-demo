import { Component, OnInit } from '@angular/core';
import {Globals} from 'src/app/globals';
import {TicTacToeService} from 'src/app/services/tic-tac-toe.service';
import {FormBuilder} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';


@Component({
  selector: 'app-tic-tac-toe',
  templateUrl: './tic-tac-toe.component.html',
  styleUrls: ['./tic-tac-toe.component.css']
})
export class TicTacToeComponent implements OnInit {
  globals = Globals;
  room: string;
  hideFullRoom: boolean;

  createRoom = this.formBuilder.group({
    name: ''
  });

  get ticTacToeService(): TicTacToeService {
    return this._ticTacToeService;
  }

  constructor(
    private _ticTacToeService: TicTacToeService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.route.fragment.subscribe(fragment => {
      this.room = fragment;
      setTimeout(() => {
        this.ticTacToeService.joinRoom(this.room).then(player => {
        });
      }, 500);
    });
  }

  getBoard(line = null): {} {
    const board = this.ticTacToeService.board;
    if (line === null) {
      return board;
    }
    const boardLine = {};
    boardLine[line + '0'] = board[line + '0'];
    boardLine[line + '1'] = board[line + '1'];
    boardLine[line + '2'] = board[line + '2'];
    return boardLine;
  }

  onSubmit(): void {
    if (!this.createRoom.value.name) {
      alert('You must enter a room name');
    }
    else {
      this.router.navigate(['/games/tic-tac-toe'], { fragment: this.createRoom.value.name });
    }
  }
}
