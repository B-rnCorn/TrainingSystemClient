import {ChangeDetectionStrategy, Component, OnInit, ViewChild} from '@angular/core';
import {CdkDragDrop, CdkDragExit, copyArrayItem, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {removeElementFromArrayExpression} from "@angular/material/schematics/ng-update/migrations/hammer-gestures-v9/remove-array-element";

@Component({
  selector: 'app-task-creation',
  templateUrl: './task-creation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./task-creation.component.less']
})
export class TaskCreationComponent implements OnInit {

  @ViewChild('doneList') doneList: any;
  //@ts-ignore
  public matrix: any[[]] = [[{data:'1', id:'11'},{data:'2', id:'12'},{data:'3', id:'13'},{data:'4', id:'14'},{data:'5', id:'15'}],
    [{data:'1', id:'21'},{data:'2', id:'22'},{data:'3', id:'23'},{data:'4', id:'24'},{data:'5', id:'25'}],
    [{data:'1', id:'31'},{data:'2', id:'32'},{data:'3', id:'33'},{data:'4', id:'34'},{data:'5', id:'35'}],
    [{data:'1', id:'41'},{data:'2', id:'42'},{data:'3', id:'43'},{data:'4', id:'44'},{data:'5', id:'45'}],
    [{data:'1', id:'51'},{data:'2', id:'52'},{data:'3', id:'53'},{data:'4', id:'54'},{data:'5', id:'55'}],
  ]

  public todo = ['monkey', 'banana', 'basket', 'liana'];

  public done = ['ЦИКЛ'];

  constructor() {
  }

  ngOnInit(): void {
  }

  /*public dropItemToAnotherItem(event: CdkDragDrop<string[]>): void {
    console.log(event);
    if (event.previousContainer === event.container) {
      console.log('deb',event.container.data, event.previousIndex, event.currentIndex);
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      console.log('drop');
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }*/
  cellItem: any;

  public dropItemToAnotherItem(event: any): void {
    console.log(event);
    if ( event.target.className == "field-cell" ) {
      this.cellItem.parentNode.removeChild(this.cellItem);
      event.target.appendChild(this.cellItem);
    }
  }

  public dragStart(event: any){
    this.cellItem = event.target;
  }

  public dragOver(event: any){
    event.preventDefault();
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
