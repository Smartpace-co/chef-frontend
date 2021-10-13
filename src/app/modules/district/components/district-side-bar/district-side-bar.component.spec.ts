import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistrictSideBarComponent } from './district-side-bar.component';

describe('DistrictSideBarComponent', () => {
  let component: DistrictSideBarComponent;
  let fixture: ComponentFixture<DistrictSideBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistrictSideBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistrictSideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
