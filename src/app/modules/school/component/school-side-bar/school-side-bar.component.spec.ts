import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolSideBarComponent } from './school-side-bar.component';

describe('SchoolSideBarComponent', () => {
  let component: SchoolSideBarComponent;
  let fixture: ComponentFixture<SchoolSideBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchoolSideBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolSideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
