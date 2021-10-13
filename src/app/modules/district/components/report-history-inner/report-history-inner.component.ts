import { Component, OnInit } from '@angular/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DistrictService } from '@modules/district/services/district.service';
import { ToasterService } from '@appcore/services/toaster.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-report-history-inner',
  templateUrl: './report-history-inner.component.html',
  styleUrls: ['./report-history-inner.component.scss']
})
export class ReportHistoryInnerComponent implements OnInit {


  reportHistoryId: string;
  currentuser:any;
  reportHistory:any
  
  constructor(
    private modalService: NgbModal, private actRoute: ActivatedRoute, private districtService: DistrictService, private toast: ToasterService
  ) {

    this.reportHistoryId = this.actRoute.snapshot.queryParams.id;

  }
  ngOnInit(): void {
    this.getReportHistoryById();
    this.currentuser = JSON.parse(window.sessionStorage.getItem("currentUser"))

  }

  getReportHistoryById()
  {
    this.districtService.getReportHistoryById(this.reportHistoryId).subscribe(
      (response) => {
        if (response) {
        this.reportHistory=response["data"];
        this.getReply(this.reportHistory.id)
      }
    })
  }

  getReply(reportHistoryId)
  {
    this.districtService.getReportReplies(reportHistoryId).subscribe( (response) => {
      if (response) {
        this.reportHistory.reportReply=response["data"].comment;
      }
      });
  }


 





}
