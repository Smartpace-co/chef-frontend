import { Component, Input, OnInit,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import { UtilityService } from '@appcore/services/utility.service';
import { StudentService } from '@modules/student/services/student.service';
import { TeacherService } from '@modules/teacher/services/teacher.service';

@Component({
  selector: 'app-greeting',
  templateUrl: './greeting.component.html',
  styleUrls: ['./greeting.component.scss']
})
export class GreetingComponent implements OnInit,OnDestroy {
  lessonHederConfig = {};
  assignmentId: string;
  sessionData: any;
  assignmentData: any;
  lessonData:any;
  countryBgImg;
  isLoad = false;
  constructor(private router: Router, private toast: ToasterService, 
    private utilityService: UtilityService, private studentService: StudentService,
    private teacherService : TeacherService) {
    this.lessonHederConfig['stepBoard'] = null;
  }

  ngOnInit(): void {
    window.scroll(0, 0);
    this.assignmentId = localStorage.getItem('assignmentId')
    this.sessionData = JSON.parse(window.sessionStorage.getItem('currentUser'));
    this.lessonData = this.teacherService.getAssignLessonData();
    this.assignmentData = this.lessonData.lesson;
    this.countryBgImg = this.lessonData.recipe.country.backgroundImage;
    this.isLoad = true;
    this.teacherService.setTeachersHeader(true);
    
  }
 
  ngOnDestroy(){
    this.teacherService.setTeachersHeader(false);
  }
  /**
  * on Next click event
 */
  onNext(): void {
    this.router.navigate(['teacher/recipe-fact']);
  }

  /**
   * on Previous click event
  */
  onPrevious(): void {
    this.router.navigate(['teacher/learning-objective']);
  }
}