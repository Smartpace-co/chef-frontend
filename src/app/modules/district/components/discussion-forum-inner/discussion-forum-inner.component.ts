import { Component, OnInit } from '@angular/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DistrictService } from '@modules/district/services/district.service';
import { ToasterService } from '@appcore/services/toaster.service';
import * as _ from 'lodash';
import { toJSDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-calendar';

@Component({
  selector: 'app-discussion-forum-inner',
  templateUrl: './discussion-forum-inner.component.html',
  styleUrls: ['./discussion-forum-inner.component.scss']
})
export class DiscussionForumInnerComponent implements OnInit {

  PlusIcon = faPlus;
  selectedFile: string;
  discussionForumId: string;
  discussionForumInfo: any;
  comments: any;
  replies: any;
  deleteCommentForm: FormGroup;
  commentForm: FormGroup;
  deleteCommentId: string;
  isUpVoteEnabled = true;
  isDownVoteEnabled = true;
  userId: any;
  voteDetails: any
  activateUserData: any;
  replyForm: FormGroup;
  commentId: any;
  deleteReplyId: string;
  replyArray = [];
  currentuser:any
  closeModal;
  commentImage: string;

  constructor(
    private modalService: NgbModal, private actRoute: ActivatedRoute, private districtService: DistrictService, private toast: ToasterService
  ) {

    this.discussionForumId = this.actRoute.snapshot.queryParams.id;

  }
  ngOnInit(): void {
    this.commentForm = new FormGroup({
      comment: new FormControl('', [Validators.required]),
      commentImage:new FormControl('')
    });

    this.replyForm = new FormGroup({
      reply: new FormControl('', [Validators.required])
    });

    this.deleteCommentForm = new FormGroup({
      delete: new FormControl('', [Validators.required])
    });

    this.getDiscussionForumInfoById();
    this.getComments();
    this.currentuser = JSON.parse(window.sessionStorage.getItem("currentUser"))
  }

  onFileSelected(event) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0].name;
      this.districtService.uploadProfileImg(event.target.files).subscribe(
        (response) => {
          if (response && response.data[0]) {
            this.commentImage = response.data[0].mediaPath;
            if (this.commentImage) {
              this.toast.showToast('Image uploaded successfully.', '', 'success');
            }
          }
        },
        (error) => {
          console.log(error);
          this.toast.showToast(error.error.message, '', 'error');
        });
    }
  }
  open(content, comment) {
    this.deleteCommentId = comment.id;
    this.userId = comment.userId


      if (this.userId ==  this.currentuser.id)
      {
        this.closeModal = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true, windowClass: 'delete-modal' });

      }
      else {
        this.toast.showToast('You can not delete this comment', '', 'error');
      }

  }
  openReply(replyId,replyUserId,comment) {
    if (replyUserId ==  this.currentuser.id)
    {
      this.districtService.deleteReply(replyId).subscribe(
        (response) => {
          if (response && response.data) {
            this.getComments();
          }
        });
    }
    else
    {
       this.toast.showToast('You can not delete this reply', '', 'error');
    }
  }
  closeOpenModal() {
    this.closeModal.close();
  }
  getDiscussionForumInfoById() {
    this.districtService.getDiscussionForumInfoById(this.discussionForumId).subscribe(
      (response) => {
        if (response && response.data) {
          this.discussionForumInfo = response.data;
          this.getVote(this.discussionForumId);
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );

  }
  getComments() {
    this.districtService.getComments(this.discussionForumId).subscribe(
      (response) => {
        if (response && response.data) {
          this.comments = response.data;
          for(var comment of this.comments)
          {
            this.getReplies(comment);
          }

        }
      },
      (error) => {
        console.log(error);
        // this.toast.showToast(error.error.message, '', 'error');
      }
    );

  }
  getReplies(comment) {
    this.replyArray=[]
      this.districtService.getReplies(comment.id).subscribe(
        (response) => {
          if (response && response.data) {
            if (response.data.length != 0) {
              this.replies = response.data;
              if(this.replies)
              {
                this.replyArray.push(this.replies)
               }
            }         
          }
        },
        (error) => {
          console.log(error);
          this.toast.showToast(error.error.message, '', 'error');
        }
      );
  }

  deleteComment() {
    if (this.deleteCommentForm.invalid) {
      this.toast.showToast('Please enter information for required fields', '', 'error');

    } else {
   
        if (!_.isEmpty(this.deleteCommentForm.value.delete) && this.deleteCommentForm.value.delete === "DELETE") {
          this.districtService.deleteComment(this.deleteCommentId).subscribe(
            (response) => {
              if (response && response.data) {
                this.closeOpenModal();
                this.getComments();

              }
            });
        }
      }
  }

  submitComment(): void {
    this.activateUserData = JSON.parse(window.sessionStorage.getItem('currentUser'));

    if (this.commentForm.invalid) {
      // return;
      this.toast.showToast('Please enter information for required fields', '', 'error');
    } else {
      this.districtService.getDistrictProfile().subscribe(
        (response) => {
          if (response && response.data) {
            let formData = this.commentForm.value;
            this.commentForm = new FormGroup({
              comment: new FormControl('', [Validators.required])
            });
            let submission = {
              districtId: response.data.district_admin.id,
              userId: this.activateUserData.id,
              discussionId: this.discussionForumId,
              comment: formData.comment,
              commentImage: this.commentImage

            };
            this.districtService.addComment(submission).subscribe(
              (data) => {
                if (data) {
                  this.toast.showToast(`${formData.comment} : Comment added successfully.`, '', 'success');

                  this.getComments();
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

  addVote(vote: boolean): void {
    let upCount;
    let downCount;
    var voteSubmission;
     if (this.voteDetails != undefined) {
      if (this.voteDetails.vote) {
          if(this.voteDetails.vote===vote)
          {
            this.toast.showToast('You can do down vote only', '', 'error');
          }
          else
          {
          upCount = this.discussionForumInfo.upVote - 1;
          downCount = this.discussionForumInfo.downVote + 1;
          voteSubmission = {
            vote: 0,
           // userId: this.discussionForumInfo.userId,
            discussionId: this.discussionForumInfo.id
          }
        }
      }
      else {
        if(this.voteDetails.vote===vote) {
          this.toast.showToast('You can do up vote only', '', 'error');
        }
        else {
         upCount = this.discussionForumInfo.upVote + 1;
          downCount = this.discussionForumInfo.downVote - 1;
          voteSubmission = {
            vote: 1,
           // userId: this.discussionForumInfo.userId,
            discussionId: this.discussionForumInfo.id
          }
        }
      }
    }
    else {
      if (vote) {
         upCount = this.discussionForumInfo.upVote + 1;
        voteSubmission = {
          vote: 1,
         // userId: this.discussionForumInfo.userId,
          discussionId: this.discussionForumInfo.id
        }

      }
      else {
         downCount = this.discussionForumInfo.downVote + 1;

        voteSubmission = {
          vote: 0,
          //userId: this.discussionForumInfo.userId,
          discussionId: this.discussionForumInfo.id
        }

      }
    

    }
    this.districtService.updateVote(voteSubmission).subscribe(res => {
      if(res)
        this.getDiscussionForumInfoById();
    })
    let submission = {
      upVote: upCount,
      downVote: downCount
    };
    this.districtService.addVote(this.discussionForumId, submission).subscribe(
      (data) => {
        this.getDiscussionForumInfoById();
      });
  }


  getVote(discussionForumId): void {
    this.districtService.getVote(discussionForumId).subscribe(res => {
      if (res && res.data) {
        this.voteDetails = res.data
      }
    })
  }


  addReplyTocomment(comment): void {
    comment.isReplyEnabled = true;
  }

  submitReply(comment: any): void {

    this.activateUserData = JSON.parse(window.sessionStorage.getItem('currentUser'));

    if (this.replyForm.invalid) {
      // return;
      this.toast.showToast('Please enter information for required fields', '', 'error');
    } else {
      this.districtService.getDistrictProfile().subscribe(
        (response) => {
          if (response && response.data) {
            let formData = this.replyForm.value;
            this.replyForm = new FormGroup({
              reply: new FormControl('')
            });
            let submission = {
              districtId: response.data.district_admin.id,
              userId: this.activateUserData.id,
              commentId: comment.id,
              reply: formData.reply
            };
            this.districtService.addReply(submission).subscribe(
              (data) => {
                if (data) {
                  this.toast.showToast(`${formData.reply} : Reply added successfully.`, '', 'success');

                  this.getComments();

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



}
