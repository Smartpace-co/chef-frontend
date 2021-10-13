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
import { DistrictService } from '@modules/district/services/district.service';
import { ToasterService } from '@appcore/services/toaster.service';
import { CustomRegex } from '@appcore/validators/custom-regex';
import { Console } from 'console';

@Component({
  selector: 'app-discussion-forum',
  templateUrl: './discussion-forum.component.html',
  styleUrls: ['./discussion-forum.component.scss']
})
export class DiscussionForumComponent implements OnInit {
  closeModal;
  closeResult = '';
  PlusIcon = faPlus;
  discussionForumDetails: any;
  description: any;
  activateUserData: any;

  discussionList = [];
  newTopicForm: FormGroup;
  constructor(
    private router: Router,
    private toast: ToasterService,
    private districtService: DistrictService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.getAllDiscussionForumTopics();

    this.newTopicForm = new FormGroup({
      topic: new FormControl('', [Validators.required]),
      description: new FormControl(''),

    });
  }
  get formControl() {
    return this.newTopicForm.controls;
  }
  open(content) {
    this.closeModal = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true, windowClass: 'create-class-modal' });

  }
  closeOpenModal() {
    this.closeModal.close();
    this.description = "";
    this.resetForm();
  }
  resetForm() {
    this.newTopicForm.reset();
  }
  getAllDiscussionForumTopics() {
    this.districtService.getAllDiscussionForumTopics().subscribe(
      (response) => {
        this.discussionList = _.map(response.data, item => {
          let obj = {
            discussionForumId: item.id,
            topic: item.topic,
            description: item.description,
            upVote: item.upVote,
            downVote: item.downVote,
            isPinned: item.isPinned ? item.isPinned : 0
          }
          return obj;
        });
        
        // make pinned fileds on top 
        this.discussionList.sort(function (a, b) {
          return (b.isPinned === true ? 1 : 0) - (a.isPinned === true ? 1 : 0);
        });
      });
  }

  onSave(): void {
    this.activateUserData = JSON.parse(window.sessionStorage.getItem('currentUser'));

    if (this.newTopicForm.invalid) {
      // return;
      this.toast.showToast('Please enter information for required fields', '', 'error');
    } else {
      this.districtService.getDistrictProfile().subscribe(
        (response) => {
          if (response && response.data) {
            let formData = this.newTopicForm.value;
            let submission = {
              districtId: response.data.district_admin.id,
              userId: this.activateUserData.id,
              topic: formData.topic,
              description: this.description
            };
            this.districtService.addDiscussionForumDetails(submission).subscribe(
              (data) => {
                if (data) {
                  this.toast.showToast(`${formData.topic} : Discussion forum added successfully.`, '', 'success');
                  this.closeOpenModal();
                  this.getAllDiscussionForumTopics();
                }
              },
              (error) => {
                console.log(error);
                this.toast.showToast(error.error.message, '', 'error');
              }
            );
          }
        });
    }
  }

  DiscussionForumDetail(item: any): void {
    this.router.navigate(['/district/discussion-forum-inner'], { queryParams: { id: item.discussionForumId } });
  }
}
