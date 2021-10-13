import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistrictHeaderComponent } from './district-header.component';

describe('DistrictHeaderComponent', () => {
  let component: DistrictHeaderComponent;
  let fixture: ComponentFixture<DistrictHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistrictHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistrictHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
