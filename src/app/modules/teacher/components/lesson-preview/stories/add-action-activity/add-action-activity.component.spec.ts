import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionActivityComponent } from './add-action-activity.component';

describe('ActionActivityComponent', () => {
  let component: ActionActivityComponent;
  let fixture: ComponentFixture<ActionActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
