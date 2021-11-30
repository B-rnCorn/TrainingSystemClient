import {Component, OnInit, ViewChild} from '@angular/core';
import {CdkDragDrop, CdkDragExit, copyArrayItem, moveItemInArray} from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-task-solution',
  templateUrl: './task-solution.component.html',
  styleUrls: ['./task-solution.component.less']
})
export class TaskSolutionComponent implements OnInit {

  @ViewChild('doneList') doneList: any;
  //@ts-ignore
  public matrix = [[1,2,3,4,5,6,7,8,9,0],[1,2,3,4,5,6,7,8,9,0],[1,2,3,4,5,6,7,8,9,0],[1,2,3,4,5,6,7,8,9,0],[1,2,3,4,5,6,7,8,9,0],
    [1,2,3,4,5,6,7,8,9,0],[1,2,3,4,5,6,7,8,9,0],[1,2,3,4,5,6,7,8,9,0],[1,2,3,4,5,6,7,8,9,0],[1,2,3,4,5,6,7,8,9,0]]

  public todo = ['ВПЕРЕД', 'НАЗАД', 'ПОВОРОТ НАЛЕВО', 'ПОВОРОТ НАПРАВО', 'ПРЫЖОК', 'ЦИКЛ'];

  public done = ['ЦИКЛ'];

  constructor() {
  }

  ngOnInit(): void {
  }

  public dropCommandToCommandsList(event: CdkDragDrop<string[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      this.done = event.previousContainer.data.filter(item => item !== event.previousContainer.data[event.previousIndex]);
      console.log('done',this.done);
    }
  }

  public dropOutside(event: CdkDragExit<string[]>): void {
    console.log('event',event);
    /*if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      this.done = event.previousContainer.data.filter(item => item !== event.previousContainer.data[event.previousIndex]);
      console.log('done',this.done);
    }*/
  }

  public drop(event: CdkDragDrop<string[]>): void {
    console.log('event',event);
    if (event.previousContainer === event.container) {
      if (event.isPointerOverContainer) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      } else {
        this.done = event.previousContainer.data.filter(item => item !== event.previousContainer.data[event.previousIndex]);
        console.log('done',this.done);
      }
    } else {
      copyArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      console.log('done',this.done);
    }
  }

}
