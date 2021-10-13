

import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslationService } from '@appcore/services/translation.service';
import { UtilityService } from '@appcore/services/utility.service';
import { StudentService } from '@modules/student/services/student.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'chef-frontend';
  previousUrl: string = null;
  currentUrl: string = null;

  constructor(private router: Router, private modalService: NgbModal, private studentService: StudentService, private translateService: TranslationService, private utilitiesService: UtilityService) {
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.previousUrl = this.currentUrl;
      this.currentUrl = event.url;
      this.studentService.setPreviousUrl(this.previousUrl);
    });
  }

  ngOnInit() {
    this.translateService.setuserlang();
    // sessionStorage.setItem('user_role', 'District'); // for district user
    sessionStorage.setItem('user_role', 'Schools');  // for schools user

    /**
     * close popup after change route.
     */
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // close all open modals
        this.modalService.dismissAll();
      }
    });
  }

  @HostListener('document:click', ['$event'])
  documentClick(event: any): void {
    this.utilitiesService.documentClickedTarget.next(event.target)
  }  
}
