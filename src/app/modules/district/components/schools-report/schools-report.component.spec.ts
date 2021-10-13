import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolsReportComponent } from './schools-report.component';

describe('SchoolsReportComponent', () => {
  let component: SchoolsReportComponent;
  let fixture: ComponentFixture<SchoolsReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchoolsReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
