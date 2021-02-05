import { Component, OnInit } from '@angular/core';
import {Globals} from 'src/app/globals';
import {TicTacToeService} from 'src/app/services/tic-tac-toe.service';
import {FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-tic-tac-toe',
  templateUrl: './tic-tac-toe.component.html',
  styleUrls: ['./tic-tac-toe.component.css']
})
export class TicTacToeComponent implements OnInit {
  globals = Globals;

  createRoom = this.formBuilder.group({
    name: ''
  });

  get ticTacToeService(): TicTacToeService {
    return this._ticTacToeService;
  }

  constructor(
    private _ticTacToeService: TicTacToeService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (!this.createRoom.value) {
      alert('You must enter a room name');
    }
    else {
      this.ticTacToeService.joinRoom(this.createRoom.value.name);
      this.createRoom.reset();
    }
  }
}