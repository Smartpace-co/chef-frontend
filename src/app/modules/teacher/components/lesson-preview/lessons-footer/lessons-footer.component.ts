import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit, Input, EventEmitter, Output, AfterViewInit, HostListener } from '@angular/core';

export enum KEY_CODE {
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37
}
@Component({
  selector: 'app-lessons-footer',
  templateUrl: './lessons-footer.component.html',
  styleUrls: ['./lessons-footer.component.scss']
})

export class LessonsFooterComponent implements OnInit {

  @Input() showPrevious = true; //for hide on first page.
  @Input() showNext = true; // for hide on last page.
  @Input() isVisibleNext; // for disable based on page data.
  @Input() isVisiblePrevious = false; // for disable based on assessment page.
  @Input() currentVisiblePanel;
  @Output() onNext: EventEmitter<any> = new EventEmitter();
  @Output() onPrevious: EventEmitter<any> = new EventEmitter();
  @Output() getActionVisibility: EventEmitter<any> = new EventEmitter();

  constructor() { }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {

    if (event.keyCode === KEY_CODE.RIGHT_ARROW) {
      if (!this.isVisibleNext){
        this.onNextPage();
      }
      
    }

    if (event.keyCode === KEY_CODE.LEFT_ARROW) {
      this.onPreviousPage();
    }
  }

  nfAfterViewInit(): void {

  }

  ngOnInit(): void {
    this.getActionVisibility.emit();
  }

  onPreviousPage() {
    this.onPrevious.emit();
  }

  onNextPage() {
    this.onNext.emit();
  }

}
