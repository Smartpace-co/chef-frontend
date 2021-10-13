import { Component, OnInit } from '@angular/core';
import { StudentService } from '@modules/student/services/student.service';
import { Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';

@Component({
  selector: 'app-health-hygiene-water-question',
  templateUrl: './health-hygiene-water-question.component.html',
  styleUrls: ['./health-hygiene-water-question.component.scss']
})
export class HealthHygieneWaterQuestionComponent implements OnInit {
  isButtonSection={}
  measurementUnitList = [
    {
      "id": "1",
      "icon": "./assets/images/glass-of-water-uncheked.png",
      "check": false
    },
    {
      "id": "2",
      "icon": "./assets/images/glass-of-water-uncheked.png",
      "check": false
    },
    {
      "id": "3",
      "icon": "./assets/images/glass-of-water-uncheked.png",
      "check": false
    },
    {
      "id": "4",
      "icon": "./assets/images/glass-of-water-uncheked.png",
      "check": false
    },
    {
      "id": "5",
      "icon": "./assets/images/glass-of-water-uncheked.png",
      "check": false
    },
    {
      "id": "6",
      "icon": "./assets/images/glass-of-water-uncheked.png",
      "check": false
    },
    {
      "id": "7",
      "icon": "./assets/images/glass-of-water-uncheked.png",
      "check": false
    },
    {
      "id": "8",
      "icon": "./assets/images/glass-of-water-uncheked.png",
      "check": false
    },
    {
      "id": "9",
      "icon": "./assets/images/glass-of-water-uncheked.png",
      "check": false
    },
    {
      "id": "10",
      "icon": "./assets/images/glass-of-water-uncheked.png",
      "check": false
    },
    {
      "id": "11",
      "icon": "./assets/images/glass-of-water-uncheked.png",
      "check": false
    },
    {
      "id": "12",
      "icon": "./assets/images/glass-of-water-uncheked.png",
      "check": false
    },
    {
      "id": "13",
      "icon": "./assets/images/glass-of-water-uncheked.png",
      "check": false
    },
    {
      "id": "14",
      "icon": "./assets/images/glass-of-water-uncheked.png",
      "check": false
    },
    {
      "id": "15",
      "icon": "./assets/images/glass-of-water-uncheked.png",
      "check": false
    },
  ]
  questionData: any;
  isDoneDisable: boolean = false;
  constructor(private studentsService: StudentService,private router:Router, private toast: ToasterService,) { }

  ngOnInit(): void {
    this.getQuestion();
    this.getAnswer();
  }

  getQuestion() {
    this.studentsService.getHealthAndHygieneQuestion().subscribe((res: any) => {
      this.questionData = res.data[0];
    });
  }

  getAnswer() {
    let id = 2;
    this.studentsService.getHealthAndHygieneData(id).subscribe((res: any) => {
      if (res.data.answer) {
        this.isDoneDisable = true;
        this.glassCounter(res.data.answer)
      }
    });
  }

  glassCounter(id) {
    for (let i = 0; i < id; i++) {
      this.measurementUnitList[i].icon = "./assets/images/glass-of-water-cheked.png";
      this.measurementUnitList[i].check = true;
      for (let j = id; j < 15; j++) {
        this.measurementUnitList[j].icon = "./assets/images/glass-of-water-uncheked.png";
        this.measurementUnitList[j].check = false;
      }
    }
  }

  saveWaterIntake(): void {
    let tempArray= this.measurementUnitList.filter((res)=> res.check==true);
    if (tempArray.length && this.isDoneDisable===false) {
     let data= {
      healthHygieneId: 2,
      answer:tempArray.length
    }
    
      this.studentsService.saveHealthAndHygieneData(data).subscribe((res)=>{
        this.toast.showToast(res.message, '', 'success');
        this.router.navigate(['student/games-listing']);
      },(err)=>{
        console.log(err)
      })
    } 
  }

}
