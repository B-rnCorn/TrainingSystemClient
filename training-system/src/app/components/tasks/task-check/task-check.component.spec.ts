import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskCheckComponent } from './task-check.component';

describe('TaskCheckComponent', () => {
  let component: TaskCheckComponent;
  let fixture: ComponentFixture<TaskCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskCheckComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
