import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportHistoryInnerComponent } from './report-history-inner.component';

describe('ReportHistoryInnerComponent', () => {
  let component: ReportHistoryInnerComponent;
  let fixture: ComponentFixture<ReportHistoryInnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportHistoryInnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportHistoryInnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
