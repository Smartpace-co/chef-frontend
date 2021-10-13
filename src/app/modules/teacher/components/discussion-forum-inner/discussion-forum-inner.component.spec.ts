import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscussionForumInnerComponent } from './discussion-forum-inner.component';

describe('DiscussionForumInnerComponent', () => {
  let component: DiscussionForumInnerComponent;
  let fixture: ComponentFixture<DiscussionForumInnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscussionForumInnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscussionForumInnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
