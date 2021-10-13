import { Component, OnInit } from '@angular/core';
import { SchoolService } from '../../services/school.service';
import { faEdit, faDownload } from '@fortawesome/free-solid-svg-icons';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';

@Component({
  selector: 'app-admin-billing',
  templateUrl: './admin-billing.component.html',
  styleUrls: ['./admin-billing.component.scss']
})
export class AdminBillingComponent implements OnInit {
  faEdit = faEdit;
  currentUser: any;
  id: any;
  roleId: any;
  faDownload = faDownload;
  constructor(private schoolService: SchoolService) {}
  billingList = [];

  ngOnInit(): void {
    this.getBillingHistory();
  }

  getBillingHistory() {
    this.currentUser = JSON.parse(window.sessionStorage.getItem('currentUser'));
    if (this.currentUser && this.currentUser.parentId) {
      this.id = this.currentUser.parentId;
    } else {
      this.id = this.currentUser.id;
    }

    if (this.id) {
      this.schoolService.getBillingDetails(this.id).subscribe((res) => {
        if (res && res.data) {
          this.billingList = res.data;
        }
      });
    }
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
