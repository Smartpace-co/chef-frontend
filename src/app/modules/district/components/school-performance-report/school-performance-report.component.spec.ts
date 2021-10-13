import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolPerformanceReportComponent } from './school-performance-report.component';

describe('SchoolPerformanceReportComponent', () => {
  let component: SchoolPerformanceReportComponent;
  let fixture: ComponentFixture<SchoolPerformanceReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchoolPerformanceReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolPerformanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
