import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminContentReportComponent } from './admin-content-report.component';

describe('AdminContentReportComponent', () => {
  let component: AdminContentReportComponent;
  let fixture: ComponentFixture<AdminContentReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminContentReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminContentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
