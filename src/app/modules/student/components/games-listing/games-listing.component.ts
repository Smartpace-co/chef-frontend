import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  faChevronRight,
  faAngleLeft,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-games-listing',
  templateUrl: './games-listing.component.html',
  styleUrls: ['./games-listing.component.scss']
})
export class GamesListingComponent implements OnInit {
  RightArrow = faChevronRight;
  LeftArrow = faAngleLeft;
  closeModal;
  constructor(private router: Router, private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  open(content) {
    this.closeModal = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true ,windowClass: 'passport-profile'});
  }
  closeOpenModal() {
    this.closeModal.close();
  }

}
