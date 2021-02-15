import { Component, OnInit } from '@angular/core';
import { faHome, faGamepad } from '@fortawesome/free-solid-svg-icons';
import {Globals} from '../../globals';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  globals = Globals;
  faHome = faHome;
  faGamepad = faGamepad;

  constructor() { }

  ngOnInit(): void {
  }

}
