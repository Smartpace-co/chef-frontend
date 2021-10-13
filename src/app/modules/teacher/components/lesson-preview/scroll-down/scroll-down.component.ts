import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-scroll-down',
  templateUrl: './scroll-down.component.html',
  styleUrls: ['./scroll-down.component.scss']
})
export class ScrollDownComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  scrollDown() {
    window.scrollTo(0,document.body.scrollHeight);
  }
}
