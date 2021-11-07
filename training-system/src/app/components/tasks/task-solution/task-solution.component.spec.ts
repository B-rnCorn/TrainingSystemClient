import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskSolutionComponent } from './task-solution.component';

describe('TaskSolutionComponent', () => {
  let component: TaskSolutionComponent;
  let fixture: ComponentFixture<TaskSolutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskSolutionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskSolutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
