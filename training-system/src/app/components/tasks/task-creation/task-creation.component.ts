import {ChangeDetectionStrategy, Component, OnInit, ViewChild} from '@angular/core';
import {CdkDragDrop, CdkDragExit, copyArrayItem, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {removeElementFromArrayExpression} from "@angular/material/schematics/ng-update/migrations/hammer-gestures-v9/remove-array-element";
import {MatDialog} from "@angular/material/dialog";
import {FieldSettingsDialogComponent} from "../../dialog/field-settings-dialog/field-settings-dialog.component";

@Component({
  selector: 'app-task-creation',
  templateUrl: './task-creation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./task-creation.component.less']
})
export class TaskCreationComponent implements OnInit {

  @ViewChild('doneList') doneList: any;
  //@ts-ignore
  public matrix: object[[]] = [[{data: 'liana', id: '11'}, {data: 'monkey', id: '12'}, {data: 'empty', id: '13'}, {data: 'banana', id: '14'}, {data: 'empty', id: '15'}],
    [{data: 'empty', id: '21'}, {data: 'empty', id: '22'}, {data: 'empty', id: '23'}, {data: 'empty', id: '24'}, {data: 'empty', id: '25'}],
    [{data: 'empty', id: '31'}, {data: 'empty', id: '32'}, {data: 'empty', id: '33'}, {data: 'empty', id: '34'}, {data: 'empty', id: '35'}],
    [{data: 'empty', id: '41'}, {data: 'empty', id: '42'}, {data: 'empty', id: '43'}, {data: 'empty', id: '44'}, {data: 'empty', id: '45'}],
    [{data: 'empty', id: '51'}, {data: 'empty', id: '52'}, {data: 'empty', id: '53'}, {data: 'empty', id: '54'}, {data: 'empty', id: '55'}],
  ]

  public sourceFieldsList: object[] = [{data: 'liana', id: '1'}, {data: 'monkey', id: '2'}, {data: 'empty', id: '3'}, {data: 'banana', id: '4'}, {data: 'basket', id: '5'}];

  public todo = ['monkey', 'banana', 'basket', 'liana'];

  public done = ['ЦИКЛ'];

  public cellItem: any;
  public isCellItemFromSourceList: boolean = false;

  constructor(public dialog: MatDialog) {
  }

  ngOnInit(): void {
  }

  public setCellItem(item: any): void {
    this.cellItem = item;
    this.isCellItemFromSourceList = false;
  }

  public setCellItemFromSourceList(item: any): void {
    this.isCellItemFromSourceList = true;
    this.cellItem = item;
  }

  openSettingsDialog() {
    this.dialog.open(FieldSettingsDialogComponent, {
      /*data: {
        animal: 'panda',
      },*/
    });
  }

  public dropItemToAnotherItem(event: any): void {
    console.log(event,this.cellItem);
    if (event.target.classList.contains("cell-content")) {
      let sourceType = TaskCreationComponent.spotCellType(this.cellItem.classList);
      if (!this.isCellItemFromSourceList) {
        this.cellItem.classList.remove(TaskCreationComponent.spotCellType(this.cellItem.classList));
        this.cellItem.classList.add(TaskCreationComponent.spotCellType(event.target.classList));
      }
      event.target.classList.remove(TaskCreationComponent.spotCellType(event.target.classList));
      event.target.classList.add(sourceType);
      console.log('ЯЧЕЙКА', event.target.children);
    }
  }

  /*
  * Функция определения типа клетки
  * принимает список классов ноды-ячейки, возвращает ее тип
  * */
  //TODO: Вынести в энум
  private static spotCellType(classList: any): string{
    switch (true) {
      case classList.contains('monkey'):
        return 'monkey'
      case classList.contains('banana'):
        return 'banana'
      case classList.contains('liana'):
        return 'liana'
      case classList.contains('basket'):
        return 'basket'
      default:
        return 'empty'
    }
  }

  public dragStart(event: any) {
    this.cellItem = event.target;
  }

  public dragOver(event: any) {
    event.preventDefault();
  }

  public dropCommandToCommandsList(event: CdkDragDrop<string[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      this.done = event.previousContainer.data.filter(item => item !== event.previousContainer.data[event.previousIndex]);
      console.log('done', this.done);
    }
  }

  public dropOutside(event: CdkDragExit<string[]>): void {
    console.log('event', event);
    /*if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      this.done = event.previousContainer.data.filter(item => item !== event.previousContainer.data[event.previousIndex]);
      console.log('done',this.done);
    }*/
  }

  public drop(event: CdkDragDrop<string[]>): void {
    console.log('event', event);
    if (event.previousContainer === event.container) {
      if (event.isPointerOverContainer) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      } else {
        this.done = event.previousContainer.data.filter(item => item !== event.previousContainer.data[event.previousIndex]);
        console.log('done', this.done);
      }
    } else {
      copyArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      console.log('done', this.done);
    }
  }

}
