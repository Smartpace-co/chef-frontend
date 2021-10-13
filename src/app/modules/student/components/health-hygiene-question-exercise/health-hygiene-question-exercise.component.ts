import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UtilityService } from '@appcore/services/utility.service';
import { StudentService } from '@modules/student/services/student.service';
import { ToasterService } from '@appcore/services/toaster.service';

@Component({
  selector: 'app-health-hygiene-question-exercise',
  templateUrl: './health-hygiene-question-exercise.component.html',
  styleUrls: ['./health-hygiene-question-exercise.component.scss']
})
export class HealthHygieneQuestionExerciseComponent implements OnInit {

  isButtonSection = {};
  exerciseTime: string;
  isDoneDisable=false;
  isVisibleNext = true;
  assignmentId: string;
  sessionData: any;
  assignmentData: any;
  questionData: any;

  constructor(private router: Router,private utilityService:UtilityService, private toast: ToasterService, private studentsService:StudentService) {
    this.isButtonSection = {
      title: 'Exercise'
    };
  }

  ngOnInit(): void {
    window.scroll(0, 0);
    this.assignmentId = localStorage.getItem('assignmentId')
    this.sessionData = JSON.parse(window.sessionStorage.getItem('currentUser'));
    this.getQuestion();
    this.getAnswer()
  }

  getQuestion() {
    this.studentsService.getHealthAndHygieneQuestion().subscribe((res: any) => {
      this.questionData= res.data[1];
    },(err)=>{
      console.log(err)
    }); 
  }

  getAnswer(){
    let id=1;
    this.studentsService.getHealthAndHygieneData(id).subscribe((res: any) => {
      if(res.data.answer){
        this.isDoneDisable=true;
      }
      this.exerciseTime= res.data.answer;
    }); 
  }

  ngAfterContentChecked(): void {
    this.isVisibleNext = this.exerciseTime ? false : true;
  }

  saveExercisetime(): void {
    let data= {
      healthHygieneId: 1,
      answer:this.exerciseTime
    }
    if (this.exerciseTime && this.isDoneDisable===false) {
      this.studentsService.saveHealthAndHygieneData(data).subscribe((res)=>{
        this.toast.showToast(res.message, '', 'success');
        this.router.navigate(['student/games-listing']);
      },(err)=>{
        console.log(err)
      })
    }
  }

  onPrevious(): void {
    this.router.navigate(['student/serving']);
  }

  onNext(): void {
    this.router.navigate(['student/assessment-question']);
  }
  

}
