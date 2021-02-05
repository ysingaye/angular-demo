import {Component, OnInit} from '@angular/core';
import {Globals} from '../../globals';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css']
})
export class GamesComponent implements OnInit {
  globals = Globals;

  constructor() { }

  ngOnInit(): void {
  }

}
