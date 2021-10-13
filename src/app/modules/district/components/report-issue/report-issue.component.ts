import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToasterService } from '@appcore/services/toaster.service';
import { DistrictService } from '@modules/district/services/district.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-report-issue',
  templateUrl: './report-issue.component.html',
  styleUrls: ['./report-issue.component.scss']
})
export class ReportIssueComponent implements OnInit {

  selectedFile: string;
  reportForm: FormGroup;
  activateUserData: any;
  description: any;
  schoolDetails: any;
  attachment:any;

  constructor(private toast: ToasterService,    
    private router: Router,
  private districtService: DistrictService) { }

  ngOnInit(): void {

    this.reportForm = new FormGroup({
      description: new FormControl("", [Validators.required]),
      type: new FormControl('issue', [Validators.required]),
      attachment: new FormControl("")
    });
  }

  onFileSelected(event) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0].name;
      this.districtService.uploadProfileImg(event.target.files).subscribe(
        (response) => {
          if (response && response.data[0]) {
            this.attachment = response.data[0].mediaPath;
            if (this.attachment) {
              this.toast.showToast('Attachment uploaded successfully.', '', 'success');
            }
          }
        },
        (error) => {
          console.log(error);
          this.toast.showToast(error.error.message, '', 'error');
        });
    }
  }

  onSave(): void {
    this.activateUserData = JSON.parse(window.sessionStorage.getItem('currentUser'));

    this.districtService.getDistrictProfile().subscribe(
      (response) => {
        if (response && response.data) {
          const submission = {
            districtId: response.data.district_admin.id,
            userId: this.activateUserData.id,
            description: this.description,
            type: this.reportForm.value.type,
            attachment: this.attachment
          }

          this.districtService.addReport(submission).subscribe(
            (data) => {
              if (data) {
                this.toast.showToast(`Report added successfully`, '', 'success');
                this.router.navigate(['/district/report-issue-history']);

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

  reportIssueHistory(): void{
    this.router.navigate(['/district/report-issue-history']);

  }
}
