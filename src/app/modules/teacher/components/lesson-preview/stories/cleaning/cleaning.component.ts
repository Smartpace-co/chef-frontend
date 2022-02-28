import { Component, OnInit, Input, HostListener,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import { UtilityService } from '@appcore/services/utility.service';
import { StudentService } from '@modules/student/services/student.service';
import { TeacherService } from '@modules/teacher/services/teacher.service';
@Component({
  selector: 'app-cleaning',
  templateUrl: './cleaning.component.html',
  styleUrls: ['./cleaning.component.scss']
})
export class CleaningComponent implements OnInit,OnDestroy {
 
  scrollTop = 0;
  isChecked: boolean;
  lessonHederConfig = {};
  index: number;
  cleaningStepList: any;
  assignmentList: any;
  assignmentId: string;
  sessionData: any;
  isVisibleNext: boolean;
  lessonData : any;
  defaultLessonImage: string;
  constructor(private router: Router, private toast: ToasterService,
     private studentService: StudentService, private utilityService: UtilityService,
     private teacherService : TeacherService) {
    this.lessonHederConfig['stepBoard'] = {
      stepNumber: 'Step 7',
      stepTitle: 'Cleaning',
      stepLogo: './assets/images/wash-your-hands.png'
    }
    this.defaultLessonImage = './assets/images/default-lesson.png';
  }

  ngOnInit(): void {
    this.teacherService.setTeachersHeader(true);
    window.scroll(0,0);
    this.isVisibleNext = true;
    this.assignmentId = localStorage.getItem('assignmentId')
    this.sessionData = JSON.parse(window.sessionStorage.getItem('currentUser'));
    this.lessonData = this.teacherService.getAssignLessonData();
    this.cleaningStepList = this.lessonData.lesson.cleanupSteps;
    
  }

  ngOnDestroy(){
    this.teacherService.setTeachersHeader(false);
  }

  @HostListener("window:scroll", [])
  onScroll(): void {
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      this.isVisibleNext = false;
    }
  }
  

  onPrevious(): void {
    this.router.navigate(['teacher/experiment-question']);
  }

  onNext(): void {
    this.router.navigate(['teacher/serving']);
  }
}