import { Component, OnInit,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { UtilityService } from '@appcore/services/utility.service';
import { StudentsService } from '@modules/teacher/services/students.service';
import { TeacherService } from '@modules/teacher/services/teacher.service';

@Component({
  selector: 'app-linguistic-details',
  templateUrl: './linguistic-details.component.html',
  styleUrls: ['./linguistic-details.component.scss']
})
export class LinguisticDetailsComponent implements OnInit,OnDestroy {
  lessonHederConfig = {};
  assignmentId: string;
  sessionData: any;
  textOne: any;
  textTwo: any;
  lessonData:any;
  isVisibleNext = false;
  showNext =false;
  constructor(private router: Router, private utilityService: UtilityService, 
    private studentsService: StudentsService,
    private teacherService:TeacherService) {
    this.lessonHederConfig['stepBoard'] = null;
  }

  ngOnInit(): void {
    this.teacherService.setTeachersHeader(true);
    window.scroll(0, 0);
    this.assignmentId = localStorage.getItem('assignmentId')
    this.sessionData = JSON.parse(window.sessionStorage.getItem('currentUser'));
    this.lessonData = this.teacherService.getAssignLessonData();
    
    // this.getStudentData();
  }

  ngOnDestroy(){
    this.teacherService.setTeachersHeader(false);
  }
  /**
   * on Previous click event
  */
  onPrevious(): void {
    this.router.navigate(['teacher/assessment-question']);
  }
}
