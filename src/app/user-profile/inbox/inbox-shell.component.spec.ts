import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InboxShellComponent } from './inbox-shell.component';

describe('InboxShellComponent', () => {
  let component: InboxShellComponent;
  let fixture: ComponentFixture<InboxShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InboxShellComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InboxShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
