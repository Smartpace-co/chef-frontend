import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {
  faAngleLeft,
  faPrint
} from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-performance',
  templateUrl: './performance.component.html',
  styleUrls: ['./performance.component.scss']
})
export class PerformanceComponent implements OnInit {
  LeftArrow=faAngleLeft;
  printIcon = faPrint;
  reportModal;
  reportList=[
    {
      Standards :"Operations and Algebraic Thinking",
      Proficiency :"Proficient",
      Accuracy : "01",
      Outof : "30",
      Growth : "xx"
    },
    {
      Standards :"Number & Operations in Base 101",
      Proficiency :"Emerging",
      Accuracy : "03",
      Outof : "24",
      Growth:"No Change"
    },
    {
      Standards :"Number & Operations - Fractions1",
      Proficiency :"Proficient",
      Accuracy : "05",
      Outof : "28",
      Growth:"xx"
    },
    {
      Standards :"Measurements & Data",
      Proficiency :"Proficient",
      Accuracy : "03",
      Outof : "23",
      Growth : "No Change"
    },
    {
      Standards :"Geometry",
      Proficiency :"Emerging",
      Accuracy : "01",
      Outof : "30",
      Growth : "xx"
    }
    
  ];
  reportHeadersList =[
    {
      title: "Standards",
      data: "Standards"
    },
    {
      title: "Proficiency",
      data: "Proficiency"
    }
    ,
    {
      title: "Accuracy",
      data: "Accuracy"
    },
    {
      title: "Out of",
      data: "Outof"
    },
    {
      title: "Growth",
      data: "Growth"
    }
  ];
  constructor( private modalService: NgbModal) { }

  ngOnInit(): void {
  }
  open(content) {
    this.reportModal = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true ,windowClass: 'report-modal'});
  }
  closeReportModal(): void {
    this.reportModal.close();
  }
}
