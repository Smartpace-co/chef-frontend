import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlipGamesComponent } from './flip-games.component';

describe('FlipGamesComponent', () => {
  let component: FlipGamesComponent;
  let fixture: ComponentFixture<FlipGamesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlipGamesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlipGamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
