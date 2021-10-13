import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivedClassesComponent } from './archived-classes.component';

describe('ArchivedClassesComponent', () => {
  let component: ArchivedClassesComponent;
  let fixture: ComponentFixture<ArchivedClassesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchivedClassesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivedClassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
