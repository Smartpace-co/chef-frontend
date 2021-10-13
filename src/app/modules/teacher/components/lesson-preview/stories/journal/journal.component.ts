import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { faSearch,faCalendarAlt} from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-journal',
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.scss']
})
export class JournalComponent implements OnInit {
  SearchIcon = faSearch;
  Calendar = faCalendarAlt;
  closeModal;
  constructor(private modalService: NgbModal) { }
  journalList=[
    {
      id:"1",
      date:"12:54 PM,10/20/2020",
      info:"“I think when the water starts boiling… it will spill out of the pot!”"
    },
    {
      id:"1",
      date:"12:54 PM,10/20/2020",
      info:"“I really hope this dish tastes good since I am so hungry”"
    },
    {
      id:"1",
      date:"12:54 PM,10/20/2020",
      info:"“My neighbor is from the Philippines; I can’t wait to tell her I learned about this dish and how to say hello in Tagalog” "
    }
  ];
  ngOnInit(): void {
  }
  open(content) {
    this.closeModal = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true ,windowClass: 'journal-modal'});
  }
}
