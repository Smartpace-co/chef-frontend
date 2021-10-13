import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  faChevronRight,
  faPlus,
  faList,
  faTh,
  faSearch,
  faSort,
  faAngleDoubleRight,
  faExclamationTriangle,
  faThLarge,
  faEllipsisV
} from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { SchoolService } from '@modules/school/services/school.service';
import { ToasterService } from '@appcore/services/toaster.service';
import { CustomRegex } from '@appcore/validators/custom-regex';

@Component({
  selector: 'app-report-issue-history',
  templateUrl: './report-issue-history.component.html',
  styleUrls: ['./report-issue-history.component.scss']
})
export class ReportIssueHistoryComponent implements OnInit {
  closeModal;
  closeResult = '';
  PlusIcon = faPlus;
  comment:any
  reportHistoryDetails: any;
  description: any;
  activateUserData: any;
  reportHistoryList = [];
  replies=[]
  newTopicForm: FormGroup;
  constructor(
    private router: Router,
    private toast: ToasterService,
    private schoolService: SchoolService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.getAllReportHistoryDetails();

    this.newTopicForm = new FormGroup({
      topic: new FormControl('', [Validators.required]),
      description: new FormControl('')
    });
  }
  get formControl() {
    return this.newTopicForm.controls;
  }
  open(content) {
    this.closeModal = this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
      windowClass: 'create-class-modal'
    });
  }
  closeOpenModal() {
    this.closeModal.close();
    this.description = '';
    this.resetForm();
  }
  resetForm() {
    this.newTopicForm.reset();
  }
  getAllReportHistoryDetails() {
    this.activateUserData = JSON.parse(window.sessionStorage.getItem('currentUser'));

    this.schoolService.getAllReportHistories(this.activateUserData.id).subscribe((response) => {
      this.reportHistoryList = _.map(response.data, (item) => {
        let obj = {
          id:item.id,
          type: item.type,
          description: item.description
        };
        return obj;
      });
    });
  }

  onSave(): void {
    if (this.newTopicForm.invalid) {
      // return;
      this.toast.showToast('Please enter information for required fields', '', 'error');
    } else {
      let formData = this.newTopicForm.value;
      let submission = {
        topic: formData.topic,
        description: this.description
      };
      this.schoolService.addDiscussionForumDetails(submission).subscribe(
        (data) => {
          if (data) {
            this.toast.showToast(`${formData.topic} : Discussion forum added successfully.`, '', 'success');
            this.closeOpenModal();
            this.getAllReportHistoryDetails();
          }
        },
        (error) => {
          console.log(error);
          this.toast.showToast(error.error.message, '', 'error');
        }
      );
    }
  }

  getReportReplies(reportReplies) {
   /* this.getAllReportHistoryDetails();
   this.schoolService.getReportReplies(reportReplies.id).subscribe((res)=>{
    this.replies.push(res.data.comment);
   })*/
   this.router.navigate(['/school/report-history-inner'], { queryParams: { id: reportReplies.id } });

  }

  // DiscussionForumDetail(item: any): void {
  //   this.router.navigate(['/school/discussion-forum-inner'], { queryParams: { id: item.discussionForumId } });
  // }
}
