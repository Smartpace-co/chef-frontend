import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryImageComponent } from './country-image.component';

describe('CountryImageComponent', () => {
  let component: CountryImageComponent;
  let fixture: ComponentFixture<CountryImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountryImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountryImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
