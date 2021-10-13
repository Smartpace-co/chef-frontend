import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinguisticDetailsComponent } from './linguistic-details.component';

describe('LinguisticDetailsComponent', () => {
  let component: LinguisticDetailsComponent;
  let fixture: ComponentFixture<LinguisticDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinguisticDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinguisticDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
