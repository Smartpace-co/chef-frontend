import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StudentService } from '@modules/student/services/student.service';

@Component({
  selector: 'app-health-hygiene-fruit-and-veggies',
  templateUrl: './health-hygiene-fruit-and-veggies.component.html',
  styleUrls: ['./health-hygiene-fruit-and-veggies.component.scss']
})
export class HealthHygieneFruitAndVeggiesComponent implements OnInit {

  
  isButtonSection = {};
  isDoneDisable = false;
  isVisibleNext = true;
  assignmentId: string;
  sessionData: any;
  assignmentData: any;
  questionData: any;
  title = "Select number of fruits and veggies";
  fruitAndVeggies = [
    { id: 1, menu: "1" },
    { id: 2, menu: "2" },
    { id: 3, menu: "3" },
    { id: 4, menu: "4" },
    { id: 5, menu: "5" },
    { id: 6, menu: "6" },
    { id: 7, menu: "7" },
    { id: 8, menu: "8" },
    { id: 9, menu: "9" },
    { id: 10, menu: "10" },
    { id: 11, menu: "11" },
    { id: 12, menu: "12" },
    { id: 13, menu: "13" },
    { id: 14, menu: "14" },
    { id: 15, menu: "15" },
    { id: 16, menu: "16" }
  ];
  fruitAndVeggieCount = 0;

  constructor(private router: Router, private studentsService: StudentService) {

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
      this.questionData = res.data[2];
    },(err) => {
      console.log(err)
    });
  }

  getAnswer() {
    let id = 3;
    this.studentsService.getHealthAndHygieneData(id).subscribe((res: any) => {
      if (res.data.answer) {
        this.isDoneDisable = true;
      }
      this.title = res.data.answer;
    });
  }

  fruitAndVeggieCountChange(event) {
    this.title = event.menu;
  }

  ngAfterContentChecked(): void {
    this.isVisibleNext = this.title ? false : true;
  }

  saveExercisetime(): void {
    let data = {
      healthHygieneId: 3,
      answer: this.title
    }
    if (this.title && this.isDoneDisable === false) {
      this.studentsService.saveHealthAndHygieneData(data).subscribe((res) => {
        this.router.navigate(['student/games-listing']);
      }, (err) => {
        console.log(err)
      })
    }
  }

  



}
