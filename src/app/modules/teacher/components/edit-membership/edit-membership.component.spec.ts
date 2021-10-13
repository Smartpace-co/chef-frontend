import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMemberShipComponent } from './edit-membership.component';

describe('EditMemberShipComponent', () => {
  let component: EditMemberShipComponent;
  let fixture: ComponentFixture<EditMemberShipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMemberShipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMemberShipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
