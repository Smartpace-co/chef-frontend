import { Component, OnInit ,OnDestroy} from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { UtilityService } from '@appcore/services/utility.service';
import { FormGroup } from '@angular/forms';
import { StudentService } from '@modules/student/services/student.service';
import { ToasterService } from '@appcore/services/toaster.service';
import * as _ from 'lodash';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { DomSanitizer } from '@angular/platform-browser';
import { TeacherService } from '@modules/teacher/services/teacher.service';

@Component({
  selector: 'app-experiment-steps',
  templateUrl: './experiment-steps.component.html',
  styleUrls: ['./experiment-steps.component.scss']
})
export class ExperimentStepsComponent implements OnInit,OnDestroy {
  play = faPlay;
  assignmentId: string;
  sessionData: any;
  assignmentData: any;
  isButtonSection = {};
  experimentGroup: FormGroup;
  form;
  isLoad = false;
  isVisibleNext = true;
  experimentData;
  questionIndex: number = 0;
  experimentSteps = [];
  lessonData :any;
  constructor(private toast: ToasterService, private modalService: NgbModal, 
    private studentService: StudentService,
    private sanitizer: DomSanitizer, private router: Router,
     private utilityService: UtilityService,
     private teacherService : TeacherService) {
  }

  ngOnInit(): void {
    this.teacherService.setTeachersHeader(true);
    window.scroll(0, 0);
    this.assignmentId = localStorage.getItem('assignmentId')
    this.sessionData = JSON.parse(window.sessionStorage.getItem('currentUser'));
    this.lessonData = this.teacherService.getAssignLessonData();
    this.getStudentData(this.lessonData);
  }

  ngOnDestroy(){
    this.teacherService.setTeachersHeader(false);
  }
 
  getStudentData(data) {
        let cnt = 1;
          this.experimentData = data.lesson.experiment;
          this.isButtonSection = {
            title: this.experimentData.experimentTitle ? this.experimentData.experimentTitle : undefined
          };
          this.experimentSteps = _.map(this.experimentData.experimentSteps, item => {
            let obj = {
              id: cnt,
              info: item.text,
              image: item.image,
              start: item.link,
            }
            cnt = cnt + 1;
            return obj;
          });
          this.isLoad = true;
          this.isVisibleNext = false; 
  }



  onPrevious(): void {
    this.router.navigate(['/teacher/experiment'])
  }

  /**
   * on Next click event
  */
  onNext(): void {
    this.router.navigate(['/teacher/experiment-description']);
  }

  getSanitizeUrl(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
