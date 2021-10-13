import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistrictProfileComponent } from './district-profile.component';

describe('DistrictProfileComponent', () => {
  let component: DistrictProfileComponent;
  let fixture: ComponentFixture<DistrictProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistrictProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistrictProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
