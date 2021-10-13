import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IngreditentNavComponent } from './ingreditent-nav.component';

describe('IngreditentNavComponent', () => {
  let component: IngreditentNavComponent;
  let fixture: ComponentFixture<IngreditentNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IngreditentNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngreditentNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
