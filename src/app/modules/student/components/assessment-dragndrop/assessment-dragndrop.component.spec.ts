import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentDragndropComponent } from './assessment-dragndrop.component';

describe('AssessmentDragndropComponent', () => {
  let component: AssessmentDragndropComponent;
  let fixture: ComponentFixture<AssessmentDragndropComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssessmentDragndropComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentDragndropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
