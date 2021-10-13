import { Component, Input, OnInit ,OnDestroy} from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import { UtilityService } from '@appcore/services/utility.service';
import { StudentService } from '@modules/student/services/student.service';
import { TeacherService } from '@modules/teacher/services/teacher.service';

@Component({
  selector: 'app-learning-objective',
  templateUrl: './learning-objective.component.html',
  styleUrls: ['./learning-objective.component.scss']
})
export class LearningObjectiveComponent implements OnInit,OnDestroy {
  lessonHederConfig = {};
  isVisibleNext = false;
  showPrevious = false; // To hide previous button
  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: false,
    nextArrow: false,
    // nextArrow: '<div class=\'nav-btn next-slide\'>>></div>',
    // prevArrow: '<div class=\'nav-btn prev-slide\'><<</div>',
    dots: true,
    infinite: false,
  };
  assignmentTitle: any;
  sessionData: any;
  assignmentList: any;
  assignmentId: string;
  isLoad = false;
  learningObjective = [];
  learnObjString: string;
  lessonData :any;
  countryBgImg;
  constructor(private router: Router, private toast: ToasterService, 
    private studentService: StudentService, 
    private utilityService: UtilityService,
    private teacherService:TeacherService) {
    this.lessonHederConfig['stepBoard'] = null;
  }

  ngOnInit(): void {
    window.scroll(0, 0);
    this.assignmentId = localStorage.getItem('assignmentId');
    this.sessionData = JSON.parse(window.sessionStorage.getItem('currentUser'));
    this.lessonData = this.teacherService.getAssignLessonData();
    this.assignmentTitle =  this.lessonData.assignmentTitle;
    this.learnObjString =  this.lessonData.lesson.learningObjectivesForStudent.replace(/&nbsp;|<[^>]+>/g, '');    
    this.learningObjective = this.learnObjString.match(/.{1,220}/g);
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
    this.router.navigate(['teacher/greeting']);
  }
}
