import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistrictSchoolsComponent } from './district-schools.component';

describe('DistrictSchoolsComponent', () => {
  let component: DistrictSchoolsComponent;
  let fixture: ComponentFixture<DistrictSchoolsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistrictSchoolsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistrictSchoolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
