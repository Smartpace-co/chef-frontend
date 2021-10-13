import { Component, OnInit } from '@angular/core';
import { DistrictService } from '../../services/district.service'
import {
  faEdit,
  faDownload
} from '@fortawesome/free-solid-svg-icons';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';

@Component({
  selector: 'app-admin-billing',
  templateUrl: './admin-billing.component.html',
  styleUrls: ['./admin-billing.component.scss']
})
export class AdminBillingComponent implements OnInit {
  faEdit = faEdit;
  currentUser: any
  id: any;
  roleId:any
  faDownload = faDownload;
  constructor(private districtService: DistrictService) { }
  billingList = [];

  ngOnInit(): void {
    this.getBillingHistory()
  }


  getBillingHistory() {
    this.districtService.getDistrictProfile().subscribe(res => {
      this.id = res.data.id
      if (this.id) {
        this.districtService.getBillingDetails(this.id).subscribe(res => {
          if (res && res.data) {
          this.billingList = res.data
          }
        })
      }
    })
    
  }

  generatePDF() {
    var data = document.getElementById('generatePdf');
    html2canvas(data).then((canvas) => {
      var imgWidth = 208;
      var imgHeight = (canvas.height * imgWidth) / canvas.width;
      const contentDataURL = canvas.toDataURL('image/png');
      let pdf = new jspdf('p', 'mm', 'a4');
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);

      pdf.save('billing.pdf');
    });
  }
}