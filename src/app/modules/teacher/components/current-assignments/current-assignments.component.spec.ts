import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentAssignmentsComponent } from './current-assignments.component';

describe('CurrentAssignmentsComponent', () => {
  let component: CurrentAssignmentsComponent;
  let fixture: ComponentFixture<CurrentAssignmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentAssignmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentAssignmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
