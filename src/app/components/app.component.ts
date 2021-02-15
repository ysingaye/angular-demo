import {Component} from '@angular/core';
import {faBars, faToggleOff, faToggleOn} from '@fortawesome/free-solid-svg-icons';
import { Globals } from '../globals';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  globals = Globals;
  title = 'Angular demo';
  faToggleOn = faToggleOn;
  faToggleOff = faToggleOff;
  faBars = faBars;
  menuVisibleClass = '';

  constructor() { }

  toggleDarkMode(): void {
    Globals.isDark = !Globals.isDark;
  }

  toggleMenu(): void {
    if (this.menuVisibleClass === 'visible') {
      this.menuVisibleClass = '';
    }
    else {
      this.menuVisibleClass = 'visible';
    }
  }
}
