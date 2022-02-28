import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import { UtilityService } from '@appcore/services/utility.service';
import { StudentService } from '@modules/student/services/student.service';
import { TeacherService } from '@modules/teacher/services/teacher.service';

@Component({
  selector: 'app-start-experiment',
  templateUrl: './start-experiment.component.html',
  styleUrls: ['./start-experiment.component.scss']
})
 

export class StartExperimentComponent implements OnInit {
  currentAssignedLesson;
  isButtonSection = {};
  assignmentId: string;
  lessonData : any;
  constructor(private router: Router, private studentService: StudentService, 
    private utilityService: UtilityService, private toast: ToasterService,
    private teacherService : TeacherService) {
  }
  ngOnInit(): void {
    this.assignmentId = localStorage.getItem('assignmentId');
    this.lessonData = this.teacherService.getAssignLessonData();
    // this.getLessonData(this.lessonData);
    this.isButtonSection = {
      title: this.lessonData.lesson.experiment.experimentTitle ? this.lessonData.lesson.experiment.experimentTitle : undefined
    };
  
  }

  onExperiment(): void {
    this.router.navigate(['teacher/experiment']);
  }
  onPrevious(): void {
    this.router.navigate(['teacher/experiment-description']);
  }


  /**
   * on Next click event
  */
  onNext(): void {
    this.router.navigate(['teacher/experiment-question']);
  }
}
