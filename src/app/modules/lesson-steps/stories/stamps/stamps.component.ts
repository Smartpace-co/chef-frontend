import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import { StudentService } from '@modules/student/services/student.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-stamps',
  templateUrl: './stamps.component.html',
  styleUrls: ['./stamps.component.scss']
})
export class StampsComponent implements OnInit {
  showNext = false;
  closeResult = '';
  closeModal;
  allStampDetails = [];
  currentLevel;
  stampItems;
  // loadItems = false;
  currentStamp;
  constructor(private router: Router, private modalService: NgbModal, private toast: ToasterService,
    private studentService: StudentService) { }

  ngOnInit(): void {
    this.getAllStamps();
  }
  // onSelectStamps(item: any): void {
  //   this.currentStamp = item;
  //   if (item.items) {
  //     this.loadItems = true;
  //     this.stampItems = item.items;
  //   } else {
  //     this.loadItems = false;
  //     this.toast.showToast('There are no items to be selected.', '', 'warning');
  //   }
  // }

  onSelectItem(content: any, item: any): void {
    this.currentLevel = item;
    this.closeModal = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true })
    // .result.then((result) => {
    //   this.closeResult = `Closed with: ${result}`;

    // }, (reason) => {
    //   this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    // });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  getAllStamps(): void {
    this.studentService.getEarnedStamps()
      .subscribe((response) => {
        let allStampList = [];
        if (response && response.data) {
          this.allStampDetails = allStampList.concat(response.data.countryStampsEarned, response.data.levelStampsEarned, response.data.learningStampsEarned);
          if (response.data.levelStampsEarned && response.data.levelStampsEarned.length > 0) {
            this.stampItems = response.data.levelStampsEarned.find(o => o.isCurrentLevel === 1);
          }
        }
      },
        (error) => {
          console.log(error);
          this.toast.showToast(error.error.message, '', 'error');
        }
      );
  }
  onPrevious(): void {
    this.router.navigate(['student/ratings']);
  }
  closeModalPopup(): void {
    this.closeModal.close();
  }
  onSave(): void {
    this.studentService.addStampDetails(this.currentLevel.id)
      .subscribe((response) => {
        if (response && response.data) {
          this.toast.showToast('Stamp saved successfully', '', 'success');
          // let element = <HTMLInputElement>document.getElementById(this.currentStamp.id);
          // element.disabled = true;
          this.closeModalPopup();
        }
      },
        (error) => {
          console.log(error);
          this.toast.showToast(error.error.message, '', 'error');
        }
      );
  }

  goToAssignedLessonList(): void {
    this.router.navigate(['/student/assignment']);
  }
}
