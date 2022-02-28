import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import { StudentService } from '@modules/student/services/student.service';

@Component({
  selector: 'app-reference',
  templateUrl: './reference.component.html',
  styleUrls: ['./reference.component.scss']
})
export class ReferenceComponent implements OnInit {
  lesson;
  showNext = false;
  assignmentId;
  referenceLinks = [];
  constructor(private toast: ToasterService, private router: Router, private studentService: StudentService) { }

  ngOnInit(): void {
    this.lesson = localStorage.getItem('lessonType');
    this.assignmentId = localStorage.getItem('assignmentId');
    this.getStudentData();
  }

  getStudentData() {
    this.studentService.getAssignedLessonById(parseInt(this.assignmentId)).subscribe(
      (response) => {
        if (response && response.data && response.data.lesson && response.data.lesson.links) {
          this.referenceLinks = response.data.lesson.links;
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }

  goToAssignedLessonList(): void {
    if (this.lesson === 'Explore') {
      this.router.navigate(['/student/explore-lesson']);
    } else {
      this.router.navigate(['/student/assignment']);
    }
  }
}
