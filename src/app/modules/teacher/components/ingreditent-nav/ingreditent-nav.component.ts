import { Component, OnInit } from '@angular/core';
import { faAngleLeft, faCartPlus, faEye, faInfoCircle, faStickyNote } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-ingreditent-nav',
  templateUrl: './ingreditent-nav.component.html',
  styleUrls: ['./ingreditent-nav.component.scss']
})
export class IngreditentNavComponent implements OnInit {


   stickyNote = faStickyNote;
  eye = faEye;
  cart = faCartPlus;
  info = faInfoCircle;
  leftArrow = faAngleLeft;
  constructor() { }

  ngOnInit(): void {
  }

}
