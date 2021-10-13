import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import { UtilityService } from '@appcore/services/utility.service';
import { JournalComponent } from '@modules/student/components/journal/journal.component';
import { StudentService } from '@modules/student/services/student.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-experiment-observations',
  templateUrl: './experiment-observations.component.html',
  styleUrls: ['./experiment-observations.component.scss']
})
export class ExperimentObservationsComponent implements OnInit {
  isButtonSection = {};
  assignmentId: string;
  constructor(private router: Router, private modalService: NgbModal, private utilityService: UtilityService, private studentService: StudentService, private toast: ToasterService) {
  }
  ngOnInit(): void {
    this.assignmentId = localStorage.getItem('assignmentId');
    this.getLessonData();
    let previousTime = this.utilityService.calculateTimeBetweenDates();
    this.updateLessonProgress(previousTime);
    this.openJournalList();
  }

  updateLessonProgress(time: any): void {
    let submission = {
      currentScreen: this.router.url.split('/student')[1],
      timeTaken: time ? time : undefined
    }
    this.studentService.updateLessonProgress(this.assignmentId, submission).subscribe(
      (response: any) => {
        if (response && response.data) {
          window.sessionStorage.setItem('previousDate', JSON.stringify(new Date()));
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }
  getLessonData(): void {
    this.studentService.getAssignedLessonById(parseInt(this.assignmentId)).subscribe(
      (response) => {
        if (response && response.data) {
          this.isButtonSection = {
            title: response.data.lesson.experiment.experimentTitle ? response.data.lesson.experiment.experimentTitle : undefined
          };
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }

  onPrevious(): void {
    this.router.navigate(['/student/experiment-steps']);
  }
  /**
   * on Next click event
  */
  onNext(): void {
    this.router.navigate(['/student/experiment-description']);
  }

  openJournalList(): void {
    const modalRef = this.modalService.open(JournalComponent, { ariaLabelledBy: 'modal-basic-title', centered: true, windowClass: 'feedback-popup' });
    modalRef.componentInstance.name = 'Journal';
  }
}
