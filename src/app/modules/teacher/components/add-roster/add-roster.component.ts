import { Component, OnInit } from '@angular/core';
import { faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-roster',
  templateUrl: './add-roster.component.html',
  styleUrls: ['./add-roster.component.scss']
})
export class AddRosterComponent implements OnInit {

  closeModal;
  trash = faTrashAlt;
  pencil = faPencilAlt;

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  classList= [
    {
        "id": 1,
        "menu": "Red",
    },
    {
        "id": 2,
        "menu": "Green",
    }
  ];

  managePopup = [
    {
      Id: 1,
      name: 'Aaron, Tena, Dean, Han, Aurore',
      groupColor: "Red",
    },
    {
      Id: 2,
      name: 'Kevin, Exie, Adelaida, Renay, Catherin',
      groupColor: "Green",
    },
    {
      Id: 3,
      name: 'Terrance, Cari, Mikel, Felix, Ebony',
      groupColor: "Blue",
    },
    {
      Id: 4,
      name: 'Kevin, Exie, Adelaida, Renay, Catherin',
      groupColor: "Yellow",
    },
  ];

  studentPopup = [
    {
      Id: '1',
      name: 'Samuel, Aaron',
    },
    {
      Id: '2',
      name: 'Ruaz, Kevin',
    },
    {
      Id: '3',
      name: 'Keil, Exie',
    },
    {
      Id: '4',
      name: 'Mintz, Terrance',
    },
    {
      Id: '5',
      name: 'Kimmell, Cari',
    }
  ];

  open(content) {
    this.closeModal = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true ,windowClass: 'createGroup'});
  }
  closeOpenModal(){
    
  }

}
