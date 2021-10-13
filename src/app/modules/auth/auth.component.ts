import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  constructor(private elementRef: ElementRef) { }

  ngOnInit(): void {
    this.init();
  }
  init() {
    if (this.elementRef && this.elementRef.nativeElement && this.elementRef.nativeElement.closest('body')) {
      this.elementRef.nativeElement.closest('body').className = 'default-bg-color';
    }
  }
}
