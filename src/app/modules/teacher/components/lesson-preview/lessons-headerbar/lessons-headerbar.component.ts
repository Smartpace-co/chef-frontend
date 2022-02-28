import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { UtilityService } from '@appcore/services/utility.service';
import { ActivatedRoute, Router } from '@angular/router';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import Autosave from '@ckeditor/ckeditor5-autosave/src/autosave';

import {
  faAngleLeft, faCalendar, faCartPlus, faEye, faInfoCircle, faSearch, faStickyNote
} from '@fortawesome/free-solid-svg-icons';
import { TeacherModule } from '@modules/teacher/teacher.module';
import { StudentService } from '@modules/student/services/student.service';
import { ToasterService } from '@appcore/services/toaster.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { TeacherService } from '@modules/teacher/services/teacher.service';
@Component({
  selector: 'app-lessons-headerbar',
  templateUrl: './lessons-headerbar.component.html',
  styleUrls: ['./lessons-headerbar.component.scss']
})
export class LessonsHeaderbarComponent implements OnInit {
  @ViewChild('printBox', { read: ElementRef, static: false }) printBox: ElementRef
  @Input() lessonHederConfig;
  @Input() isButtonSection;
  @Input() showBackBtn = true;
  public isCollapsed = true;
  LeftArrow = faAngleLeft;
  story: any = 0
  sessionData: any;
  SearchIcon = faSearch;
  Calendar = faCalendar;
  assignmentList: any;
  assignmentTitle: any;
  assignmentId: string;
  stepNumber: number;
  reciepe_icon: any;
  closeModal;
  listModal;
  selectedSearchValue;
  defaultRecipeImg: string;
  lessonData :any;
  allJournalList = [];
  public Editor = ClassicEditor;
  editorsData;
  stickyNote = faStickyNote;
  eye = faEye;
  cart = faCartPlus;
  info = faInfoCircle;
  leftArrow = faAngleLeft;
  viewFrom :any;
  // data: any = `<p>Hello, world!</p>`;
  // editorConfig = {
  //   // plugins: [ Autosave ],
  //   toolbar: ['bold', 'strikethrough', 'italic', '|', 'bulletedList'],
  //   language: 'id',
  //   viewportTopOffset: 400,
  //   autosave: {
  //     save(editor) {
  //       this.editorsData = editor.getData();
  //       // The saveData() function must return a promise
  //       // which should be resolved when the data is successfully saved.
  //       return this.saveData();
  //     }
  //   }
  // };
  constructor(private router: Router, private modalService: NgbModal, 
              private toast: ToasterService, private studentService: StudentService, 
              private utilityService: UtilityService, private activatedroute: ActivatedRoute,
              private teacherService : TeacherService) {
    this.defaultRecipeImg = './assets/images/nsima-bent-icon.png';
  }

  ngOnInit(): void {
    //  this.Editor.config.height = "500rem";

    //console.log(this.lessonHederConfig.stepBoard.stepNumber);
    //  if (this.lessonHederConfig.stepBoard === null){
    //    this.stepNumber = 1
    //  }
    //  else {
    //  this.stepNumber =  this.lessonHederConfig.stepBoard.stepNumber.split('').pop();
    //  }
    // this.utilityService.documentClickedTarget
    //   .subscribe(target => this.outsideClickListner(target));
    this.viewFrom = this.teacherService.getViewFrom();
    this.assignmentId = localStorage.getItem('assignmentId')
    this.sessionData = JSON.parse(window.sessionStorage.getItem('currentUser'));
    this.lessonData = this.teacherService.getAssignLessonData();
    this.assignmentTitle = this.lessonData.recipe.recipeTitle;
    this.reciepe_icon = this.lessonData.recipe.recipeImage ? this.lessonData.recipe.recipeImage : this.defaultRecipeImg;

    // this.getStudentData()
    // this.getLessonInfo();
  }

  /**
   collpase the print menus when click outside
   */
  outsideClickListner(target: any): void {
    if (!this.printBox.nativeElement.contains(target)) {
      this.isCollapsed = true;
    }
  }

  getStudentData() {
    // this.studentsService.getStudentData().subscribe((response: []) => {
    //   response.forEach((element: any) => {
    //     if (this.utilityService.strictCompare(element.email, this.sessionData.email)) {
    //       this.assignmentList = element.assignmentList;
    //       if (this.assignmentList.length > 0) {
    //         this.assignmentList.forEach(ele => {
    //           if (this.utilityService.strictCompare(ele.id, this.assignmentId)) {
    //             this.assignmentTitle = ele.menu;
    //             this.reciepe_icon=ele.icon
    //           }
    //         });
    //       }
    //     }
    //   });
    // });    
  }

  getLessonInfo(): void {
    this.studentService.getAssignedLessonById(parseInt(this.assignmentId)).subscribe(
      (response) => {
        if (response && response.data) {
          this.assignmentTitle = response.data.assignmentTitle;
          this.reciepe_icon = response.data.recipe.recipeImage ? response.data.recipe.recipeImage : this.defaultRecipeImg;
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }

  onClose(viewFrom) {
    if(viewFrom === "Setting"){
      this.router.navigate(['/teacher/explore-lessons-setting', this.lessonData.lesson.id]);
    }else{
      this.router.navigate(['/teacher/upcoming-assignment']);
    }
    // localStorage.setItem('stepNumber', this.stepNumber.toString());
    //localStorage.setItem('stepNumber', this.stepNumber.toString());
    //console.log(this.stepNumber);
   
  }

  openJournalList(content: any): void {
    this.listModal = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true, windowClass: 'feedback-popup' });
  }

  openJournalEditor(modal: any): void {
    this.closeModal = this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title', centered: true, windowClass: 'feedback-popup' });
  }
  closeJournalEditorModal() {
    this.closeModal.close();
  }
  saveData() {
    this.studentService.addNoteInJournal(this.editorsData).subscribe(
      (response) => {
        if (response && response.data) {
          this.toast.showToast('Note added successful', '', 'success');
          this.closeJournalEditorModal();
          this.getJournal();
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }

  getJournal(modal?: any, isSearch?: boolean): void {
    let text;
    let date;
    if (isSearch) {
      let str = Date.parse(this.selectedSearchValue);
      if (str) {
        date = this.selectedSearchValue;
      } else {
        text = this.selectedSearchValue;
      }
    }
    this.studentService.getJournalDetails(text, date).subscribe(
      (response) => {
        if (response && response.data) {
          this.allJournalList = _.map(response.data, nt => {
            let ob = {
              dateField: this.utilityService.formatDate(nt.createdAt),
              note: nt.note.replace(/&nbsp;|<[^>]+>/g, '')
            }
            return ob;
          });
          if (modal) {
            this.openJournalEditor(modal);
          }
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }

  onDateSelection(): void {
    this.getJournal(undefined, true);
  }

  onChange(): void {
    this.getJournal(undefined, true);
  }
}