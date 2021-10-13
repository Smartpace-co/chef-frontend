import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationalSentenceComponent } from './conversational-sentence.component';

describe('ConversationalSentenceComponent', () => {
  let component: ConversationalSentenceComponent;
  let fixture: ComponentFixture<ConversationalSentenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConversationalSentenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversationalSentenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
