import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import { StudentService } from '@modules/student/services/student.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import * as _ from 'lodash';
import { faCalendar, faSearch } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-journal',
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.scss']
})
export class JournalComponent implements OnInit {
  closeModal;
  listModal;
  SearchIcon = faSearch;
  Calendar = faCalendar;
  allJournalList = [];
  selectedSearchValue;
  isLoad = false;
  public Editor = ClassicEditor;
  editorsData;
  // data: any = `<p>Hello, world!</p>`;
  editorConfig = {
    // plugins: [ Autosave ],
    toolbar: ['bold', 'strikethrough', 'italic', '|', 'bulletedList'],
    language: 'id',
    viewportTopOffset: 400,
    autosave: {
      save(editor) {
        this.editorsData = editor.getData();
        // The saveData() function must return a promise
        // which should be resolved when the data is successfully saved.
        return this.saveData();
      }
    }
  };

  constructor(public activeModal: NgbActiveModal, private modalService: NgbModal, private toast: ToasterService, private studentService: StudentService) {
  }
  ngOnInit(): void {
    if (this.Editor && this.Editor.config) {
      this.Editor.config.height = "500rem";
    }
    this.getJournal();
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
              createdAt: nt.createdAt,
              note: nt.note.replace(/&nbsp;|<[^>]+>/g, '')
            }
            return ob;
          });
          if (modal) {
            this.openJournalEditor(modal);
          }
        }
        this.isLoad = true;
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
