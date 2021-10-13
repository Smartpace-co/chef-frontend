import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportIssueHistoryComponent } from './report-issue-history.component';

describe('ReportIssueHistoryComponent', () => {
  let component: ReportIssueHistoryComponent;
  let fixture: ComponentFixture<ReportIssueHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportIssueHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportIssueHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
