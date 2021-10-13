import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToasterService } from '@appcore/services/toaster.service';
import {
  faSearch,
  faPlus,
  faMinus
} from '@fortawesome/free-solid-svg-icons';
import { of } from "rxjs";
import {
  debounceTime,
  map,
  distinctUntilChanged,
  filter
} from "rxjs/operators";
import { fromEvent } from 'rxjs';
import { SchoolService } from '@modules/school/services/school.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-common-questions',
  templateUrl: './common-questions.component.html',
  styleUrls: ['./common-questions.component.scss']
})
export class CommonQuestionsComponent implements OnInit {
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;

  SearchIcon = faSearch;
  PlusIcon = faPlus;
  MinusIcon = faMinus;
  faqsList = [];
  constructor(private schoolService: SchoolService, private toast: ToasterService) {
  }
  ngOnInit(): void {
    this.getFaqList();
    this.getAllFaqs();
  }
  getFaqList() {
    fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
      // get value
      map((event: any) => {
        return event.target.value;
      })
      // if character length greater then 2
      , filter(res => res.length > 1)

      // Time in milliseconds between key events
      , debounceTime(1000)

      // If previous query is diffent from current   
      , distinctUntilChanged()

      // subscription for response
    ).subscribe((text: string) => {
      this.getAllFaqs(text);
    });
  }

  getAllFaqs(text?: string): void {
    this.schoolService.getFaqList(text).subscribe((response) => {
      if (response && response.data && response.data.rows) {
        this.faqsList = _.map(response.data.rows, item => {
          let ob = {
            title: item.question,
            description: item.answer,
            id: `q${item.id}`
          }
          return ob;
        });
      }
    }, (error) => {
      console.log('error', error);
      this.toast.showToast(error.error.message, '', 'error');
    });
  }
}
