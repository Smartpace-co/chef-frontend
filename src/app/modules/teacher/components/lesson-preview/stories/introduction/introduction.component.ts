import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import { UtilityService } from '@appcore/services/utility.service';
import { StudentService } from '@modules/student/services/student.service';
import { TeacherService } from '@modules/teacher/services/teacher.service';

@Component({
  selector: 'app-introduction',
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.scss']
})
export class IntroductionComponent implements OnInit {
  lessonHederConfig = {};
  assignmentId: string;
  sessionData: any;
  assignmentData: any;
  countryName: string;
  lessonData : any;
  constructor(private router: Router, private utilityService: UtilityService, 
    private toast: ToasterService, private studentService: StudentService,
    private teacherService : TeacherService) {
    this.lessonHederConfig['stepBoard'] = null;
  }

  ngOnInit(): void {
    window.scroll(0, 0);
    this.assignmentId = localStorage.getItem('assignmentId')
    this.sessionData = JSON.parse(window.sessionStorage.getItem('currentUser'));
    this.lessonData = this.teacherService.getAssignLessonData();
    this.assignmentData = this.lessonData;
    this.countryName = this.lessonData.recipe.country.countryName;
    // this.getStudentData();
    // this.updateLessonProgress();
  }

  updateLessonProgress(): void {
    let submission = {
      currentScreen: this.router.url.split('/student')[1],
    }
    this.studentService.updateLessonProgress(this.assignmentId, submission).subscribe(
      (response: any) => {
        if (response && response.data) {
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }
  getStudentData() {
    // this.studentsService.getStudentData().subscribe((response: []) => {
    //   response.forEach((element: any) => {
    //     if (this.utilityService.strictCompare(element.email, this.sessionData.email)) {
    //       if (element.assignmentList.length > 0) {
    //         element.assignmentList.forEach(ele => {
    //           if (this.utilityService.strictCompare(ele.id, this.assignmentId)) {
    //             this.assignmentData=ele;
    //           }
    //         });
    //       }
    //     }
    //   });
    // });
    this.studentService.getAssignedLessonById(parseInt(this.assignmentId)).subscribe(
      (response) => {
        if (response && response.data) {
          this.assignmentData = response.data;
          this.countryName = response.data.recipe.country.countryName;
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }

  /**
  * on Next click event
 */
  onNext(): void {
    // this.router.navigate(['teacher/find-country']);
    this.router.navigate(['teacher/recipe-fact']);
    
  }

  /**
   * on Previous click event
  */
  onPrevious(): void {
    this.router.navigate(['teacher/greeting']);
  }
}
