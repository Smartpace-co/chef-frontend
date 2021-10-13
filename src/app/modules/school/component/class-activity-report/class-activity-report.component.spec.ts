import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassActivityReportComponent } from './class-activity-report.component';

describe('ClassActivityReportComponent', () => {
  let component: ClassActivityReportComponent;
  let fixture: ComponentFixture<ClassActivityReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassActivityReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassActivityReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
