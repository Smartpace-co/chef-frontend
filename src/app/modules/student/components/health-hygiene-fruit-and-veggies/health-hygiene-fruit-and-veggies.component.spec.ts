import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthHygieneFruitAndVeggiesComponent } from './health-hygiene-fruit-and-veggies.component';

describe('HealthHygieneFruitAndVeggiesComponent', () => {
  let component: HealthHygieneFruitAndVeggiesComponent;
  let fixture: ComponentFixture<HealthHygieneFruitAndVeggiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HealthHygieneFruitAndVeggiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthHygieneFruitAndVeggiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
