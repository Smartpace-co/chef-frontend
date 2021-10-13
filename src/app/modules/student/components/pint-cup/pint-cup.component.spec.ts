import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PintCupComponent } from './pint-cup.component';

describe('PintCupComponent', () => {
  let component: PintCupComponent;
  let fixture: ComponentFixture<PintCupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PintCupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PintCupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
