import { Component, OnInit } from '@angular/core';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { ClassesService } from '@modules/teacher/services/classes.service';
@Component({
  selector: 'app-individual-student-assignment-details',
  templateUrl: './individual-student-assignment-details.component.html',
  styleUrls: ['./individual-student-assignment-details.component.scss']
})
export class IndividualStudentAssignmentDetailsComponent implements OnInit {
  backArrow = faChevronLeft;
  questionsList: any = [];
  experiments: any = [];

  constructor(
    private router: Router,
    private classService: ClassesService
  ) { }

  ngOnInit(): void {
    this.getQuestionsList();
    this.getExperiments();
  }

  getQuestionsList() {
    this.classService.getData().subscribe((data: any) => {
      this.questionsList = data[0].questionsList;
      console.log(this.questionsList);
    });
  }

  getExperiments(){
    this.classService.getData().subscribe((data: any) => {
      this.experiments = data[0].experiments;
      console.log(this.experiments);
    })
  }

  backToExploreList(){
    this.router.navigate(['teacher/explore-lessons-list']);
  }
}
