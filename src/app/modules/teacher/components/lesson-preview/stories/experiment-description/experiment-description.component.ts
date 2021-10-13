import { Component, OnInit,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import { UtilityService } from '@appcore/services/utility.service';
import { StudentService } from '@modules/student/services/student.service';
import { TeacherService } from '@modules/teacher/services/teacher.service';

@Component({
  selector: 'app-experiment-description',
  templateUrl: './experiment-description.component.html',
  styleUrls: ['./experiment-description.component.scss']
})
export class ExperimentDescriptionComponent implements OnInit ,OnDestroy{
  isButtonSection = {};
  assignmentId: string;
  experimentData;
  experimentFacts = [];
  isVisibleNext = true;
  lessonData : any;
  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: '<div class=\'nav-btn next-slide\'></div>',
    prevArrow: '<div class=\'nav-btn prev-slide\'></div>',
    dots: true,
    infinite: false,
  };
  constructor(private router: Router, private utilityService: UtilityService, 
    private studentService: StudentService, private toast: ToasterService,
    private teacherService : TeacherService) {
  }

  ngOnInit(): void {
    this.teacherService.setTeachersHeader(true);
    this.assignmentId = localStorage.getItem('assignmentId');
    this.lessonData = this.teacherService.getAssignLessonData();
    this.getExperimentDescription(this.lessonData);
  }
 
  ngOnDestroy(){
    this.teacherService.setTeachersHeader(false);
  }
 

  getExperimentDescription(data): void {

    this.experimentData = data.lesson.experiment;
    this.isButtonSection = {
      title: this.experimentData.experimentTitle ? this.experimentData.experimentTitle : undefined
    };
    // this.experimentFacts = this.experimentData.fact.match(/.{1,100}/g);
    this.experimentFacts = this.experimentData.fact.split(".");
    this.isVisibleNext = false;
  }

  tryAgain(): void {
    this.router.navigate(['/teacher/experiment']);
  }
  onPrevious(): void {
    this.router.navigate(['/teacher/experiment-steps'])
  }
  /**
   * on Next click event
  */
  onNext(): void {
    this.router.navigate(['/teacher/experiment-question']);
  }
}
