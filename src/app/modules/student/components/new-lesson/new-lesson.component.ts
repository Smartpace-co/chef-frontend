import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-new-lesson',
  templateUrl: './new-lesson.component.html',
  styleUrls: ['./new-lesson.component.scss']
})
export class NewLessonComponent implements OnInit {
  // @Input() idxfooter : number;
  isButtonSection = {};
  constructor(private router: Router) {
    this.isButtonSection = {
      title: 'New Lesson'
    };
   }

  ngOnInit(): void {
  }
  onNext(): void {
    window.scroll(0,0);
    this.router.navigate(['student/cooking-preparation']);
  }
  onPrevious(): void {
    window.scroll(0,0);
    this.router.navigate(['student/hygiene']);
  }
}
