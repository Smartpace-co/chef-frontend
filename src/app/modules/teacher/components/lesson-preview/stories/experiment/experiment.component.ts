import { Component, OnInit ,OnDestroy} from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { UtilityService } from '@appcore/services/utility.service';
import { FormGroup } from '@angular/forms';
import { StudentService } from '@modules/student/services/student.service';
import { ToasterService } from '@appcore/services/toaster.service';
import { TeacherService } from '@modules/teacher/services/teacher.service';
 
@Component({
  selector: 'app-experiment',
  templateUrl: './experiment.component.html',
  styleUrls: ['./experiment.component.scss']
})
export class ExperimentComponent implements OnInit ,OnDestroy{

  assignmentId: string;
  sessionData: any;
  assignmentData: any;
  isButtonSection = {};
  experimentGroup: FormGroup;
  form;
  // experimentData=[];
  lessonData : any;
  currentAssignedLesson;
  experimentData;
  isVisibleNext = true;
  questionIndex: number = 0;
  viewFrom :any;
  content:any;
  experimentDescList = [];
  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: '<div class=\'nav-btn next-slide\'></div>',
    prevArrow: '<div class=\'nav-btn prev-slide\'></div>',
    dots: true,
    infinite: false,
  };
  constructor(private toast:ToasterService,private modalService: NgbModal, private studentService: StudentService,
    private utilityService: UtilityService, private router: Router,
    private teacherService : TeacherService) {
    this.isButtonSection = {
      title: 'Boiling Experiment'
    };
  }

  ngOnInit(): void {
    this.teacherService.setTeachersHeader(true);
    window.scroll(0, 0);
    this.assignmentId = localStorage.getItem('assignmentId')
    this.sessionData = JSON.parse(window.sessionStorage.getItem('currentUser'));
    this.viewFrom = this.teacherService.getViewFrom();
    this.lessonData = this.teacherService.getAssignLessonData();
    if(this.viewFrom === "View"){
      this.content = this.lessonData.customSetting.content;
    }else {
      this.content = this.lessonData.activities;
    }
    this.getStudentData(this.lessonData);
  }

  ngOnDestroy(){
    this.teacherService.setTeachersHeader(false);
  }

  getStudentData(data) {
    this.currentAssignedLesson = data;
    this.experimentData = data.lesson.experiment;
    this.experimentDescList = this.experimentData.description ? this.experimentData.description.match(/.{1,165}(\s|$)/g) : undefined;
    this.isButtonSection = {
      title: this.experimentData.experimentTitle ? this.experimentData.experimentTitle : undefined
    };
    this.isVisibleNext = false;  
  }

  

  onPrevious(): void {
    if (this.content) {
      for (let ob of this.content) {
        if (ob.title === 'Cooking' && ob.status === true) {
          this.router.navigate(['/teacher/cooking-steps']);
          break;
        }
        else if (ob.title === 'Story' && ob.status === true) {
          this.router.navigate(['/teacher/conversional-sentence'])
        }
      }
    } else {
      this.router.navigate(['/teacher/cooking-steps']);
    }
  }
  /**
   * on Next click event
  */
  onNext(): void {
    
    this.router.navigate(['teacher/experiment-steps']);
  }
}
