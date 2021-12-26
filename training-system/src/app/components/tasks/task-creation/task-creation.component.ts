import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {FieldSettingsDialogComponent} from "../../dialog/field-settings-dialog/field-settings-dialog.component";
import {Field} from "../../../models/field";
import {CONSTANTS} from "../../../constants/utils";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UtilsService} from "../../../services/utils.service";
import {Task} from "../../../models/task";
import {TaskService} from "../../../services/task.service";
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {TaskDto} from "../../../models/taskDto";
import {MatSnackBar} from "@angular/material/snack-bar";
import {StudentSnackBarComponent} from "../../snack-bar/student-snack-bar/student-snack-bar.component";
import {StatsDialogComponent} from "../../dialog/stats-dialog/stats.dialog.component";
import {DialogComponent} from "../../dialog/add-delete-students-dialog/dialog.component";
import {DialogValidateComponent} from "../../dialog/validate-dialog/dialog.validate.component";
import {FieldGenerateDialogComponent} from "../../dialog/generate-field-dialog/field-generate-dialog.component";


@Component({
  selector: 'app-task-creation',
  templateUrl: './task-creation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./task-creation.component.less']
})
export class TaskCreationComponent implements OnInit, OnDestroy{

  @ViewChild('doneList') doneList: any;
  //@ts-ignore
  public field: Field = new Field([]);
  private backendMessage: string = '';

  public sourceFieldsList: object[] = [
    {data: CONSTANTS.FIELD_TYPES.liana, id: '1'},
    {data: CONSTANTS.FIELD_TYPES.monkey, id: '2'},
    {data: CONSTANTS.FIELD_TYPES.banana, id: '4'},
    {data: CONSTANTS.FIELD_TYPES.basket, id: '5'},
    {data: CONSTANTS.FIELD_TYPES.empty, id: '3'},];

  public _taskForm: FormGroup = new FormGroup({
    "name": new FormControl("",
      [Validators.required]),
    "description": new FormControl("",
      [Validators.required]),
  });

  public cellItem: any;
  private cellItemColumnId: number;
  private cellItemCellId: number;
  public dimension: number = 4;
  public isCellItemFromSourceList: boolean = false;
  private subs: Subscription[] = [];
  private task: TaskDto;
  public isUpdate: boolean = false;
  private taskId: number = -1;

  constructor(public dialog: MatDialog,
              public cdr: ChangeDetectorRef,
              private utilsService: UtilsService,
              private taskService: TaskService,
              private router: Router,
              private route: ActivatedRoute,
              private snackBar: MatSnackBar) {
  }

  ngOnDestroy(): void {
        this.subs.forEach(sub => sub.unsubscribe());
    }

  ngOnInit(): void {
    this.subs.push(this.route.params.subscribe(params => {
      this.taskId = Number.parseInt(params['id']);
      this.subs.push(this.taskService.getTaskByTeacher().subscribe(tasks => {
        this.task = tasks.find(task => task.id === this.taskId);
        if (this.task) {
          this.isUpdate = true;
          this.field = this.utilsService.mapToField(this.task.map);
          this.dimension = Math.sqrt(this.task.map.length);
          this._taskForm.patchValue({
            name: this.task.title,
            description: this.task.description,
          });
          this.cdr.detectChanges();
        } else {
          this.isUpdate = false;
          this.buildField(this.dimension);
        }
      }));
    }));
  }

  // public generate() {
  //   this.field.setNewCellType(0, 0, 'm');
  // }


  public buildField(dimension: number) {
    this.field = new Field([]);
    this.field.initEmptyField(dimension);
    this.cdr.detectChanges();
  }

  public clearField() {
    this.field = new Field([]);
    this.field.initEmptyField(this.dimension);
    this.cdr.detectChanges();
  }

  public setCellItem(item: any): void {
    this.cellItem = item.target;
    this.cellItemColumnId = item.idColumn;
    this.cellItemCellId = item.idCell;
    this.isCellItemFromSourceList = false;
  }

  public setCellItemFromSourceList(item: any): void {
    this.isCellItemFromSourceList = true;
    this.cellItemColumnId = item.idColumn;
    this.cellItemCellId = item.idCell;
    this.cellItem = item.target;
  }

  openSettingsDialog() {
    const dialogRef = this.dialog.open(FieldSettingsDialogComponent, {
      data: {dimension: 0},
    });
    let sub = dialogRef.afterClosed().subscribe(data => {
      this.dimension = data.dimension;
      this.buildField(this.dimension);
      console.log('data', data);
      sub.unsubscribe();
    })
  }
  openGenerateDialog() {
    const fieldLength = this.utilsService.parseField(this.field).length;
    const validCountMonkeys = 1;
    const validCountBaskets = Math.floor(fieldLength * 0.1);
    const validCountBananas = Math.floor(fieldLength * 0.3);
    const validCountLianas = Math.floor(fieldLength * 0.2);
    const dialogRef = this.dialog.open(FieldGenerateDialogComponent, {
      data: {
        maxCountBananas: validCountBananas,
        maxCountLianas: validCountLianas,
        maxCountBaskets: validCountBaskets,
        },
    });
    let sub = dialogRef.afterClosed().subscribe(data => {
      this.generateField(data.countBananas, data.countLianas, data.countBaskets, fieldLength);
      this.cdr.detectChanges();
    });
  }

  generateField(countBananas: number, countLianas: number, countBaskets: number, fieldLength: number) {
    this.clearField();
    const sideSize = Math.sqrt(fieldLength);
    let indexes = [...Array(fieldLength).keys()];
    const monkeyIndex = indexes[Math.floor(Math.random() * indexes.length)];
    indexes.splice(indexes.indexOf(monkeyIndex), 1);
    let bananasIndexes = [];
    let lianasIndexes = [];
    let basketsIndexes = [];
    for (let i = 0; i < countBananas; i++) {
      let index = indexes[Math.floor(Math.random() * indexes.length)];
      indexes.splice(indexes.indexOf(index), 1);
      bananasIndexes.push(index);
    }
    for (let i = 0; i < countLianas; i++) {
      let index = indexes[Math.floor(Math.random() * indexes.length)];
      indexes.splice(indexes.indexOf(index), 1);
      lianasIndexes.push(index);
    }
    for (let i = 0; i < countBaskets; i++) {
      let index = indexes[Math.floor(Math.random() * indexes.length)];
      indexes.splice(indexes.indexOf(index), 1);
      basketsIndexes.push(index);
    }
    this.field.setNewCellType(Math.floor(monkeyIndex / sideSize), monkeyIndex % sideSize, CONSTANTS.FIELD_TYPES.monkey);
    bananasIndexes.forEach(index => this.field.setNewCellType(Math.floor(index / sideSize), index % sideSize, CONSTANTS.FIELD_TYPES.banana));
    lianasIndexes.forEach(index => this.field.setNewCellType(Math.floor(index / sideSize), index % sideSize, CONSTANTS.FIELD_TYPES.liana));
    basketsIndexes.forEach(index => this.field.setNewCellType(Math.floor(index / sideSize), index % sideSize, CONSTANTS.FIELD_TYPES.basket));
  }

  public dropItemToAnotherItem(event: any, columnId: number, cellId: number): void {
    console.log(event, this.cellItem);
    if (event.target.classList.contains("cell-content")) {
      let sourceType = TaskCreationComponent.spotCellType(this.cellItem.classList);
      if (!this.isCellItemFromSourceList) {
        this.field.setNewCellType(this.cellItemColumnId, this.cellItemCellId, TaskCreationComponent.spotCellType(event.target.classList));
        this.cellItem.classList.remove(TaskCreationComponent.spotCellType(this.cellItem.classList));
        this.cellItem.classList.add(TaskCreationComponent.spotCellType(event.target.classList));
      }
      this.field.setNewCellType(columnId, cellId, sourceType);
      event.target.classList.remove(TaskCreationComponent.spotCellType(event.target.classList));
      event.target.classList.add(sourceType);
      console.log('ЯЧЕЙКА', event.target.children);
      console.log('Matrix', this.field);
    }
  }

  /*
  * Функция определения типа клетки
  * принимает список классов ноды-ячейки, возвращает ее тип
  * */

  private static spotCellType(classList: any): string {
    switch (true) {
      case classList.contains(CONSTANTS.FIELD_TYPES.monkey):
        return CONSTANTS.FIELD_TYPES.monkey
      case classList.contains(CONSTANTS.FIELD_TYPES.banana):
        return CONSTANTS.FIELD_TYPES.banana
      case classList.contains(CONSTANTS.FIELD_TYPES.liana):
        return CONSTANTS.FIELD_TYPES.liana
      case classList.contains(CONSTANTS.FIELD_TYPES.basket):
        return CONSTANTS.FIELD_TYPES.basket
      default:
        return CONSTANTS.FIELD_TYPES.empty
    }
  }

  public getSize(size: number): boolean{
    return this.dimension === size;
  }

  public dragStart(event: any) {
    this.cellItem = event.target;
  }

  public dragOver(event: any) {
    event.preventDefault();
  }

  public onPublishTask(){
    this.subs.push(this.taskService.updateTask(this.taskId, this.task, true).subscribe(() => {
      let message = 'Задание успешно опубликовано.';
      this.snackBar.openFromComponent(StudentSnackBarComponent, {
        duration: 1500,
        data: message,
      });
      this.router.navigate(['task-view']);
    }));
  }
  public validateField(field: string): string[] {
    let errors = [];
    const countAllObjects = field.length;
    const validCountMonkeys = 1;
    const validCountBaskets = Math.floor(countAllObjects * 0.1);
    const validCountBananas = Math.floor(countAllObjects * 0.3);
    const validCountLianas = Math.floor(countAllObjects * 0.2);
    const countMonkeys = field.split('m').length - 1;
    const countBaskets = field.split('u').length - 1;
    const countBananas = field.split('b').length - 1;
    const countLianas = field.split('l').length - 1;

    if (countMonkeys !== validCountMonkeys) {
      errors.push('На поле должна быть 1 обезьянка!');
    }
    if (countBananas > validCountBananas) {
      errors.push('Допустимое число бананов: ' + validCountBananas + '. Вы установили ' + countBananas + ' !');
    }
    if (countBananas < 1) {
      errors.push('На поле должен быть хотя бы 1 банан!');
    }
    if (countBaskets < 1 ) {
      errors.push('На поле должна быть хотя бы 1 корзина!');
    }
    if (countBaskets > validCountBaskets) {
      errors.push('Допустимое число корзин: ' + validCountBaskets + '. Вы установили ' + countBaskets + ' !');
    }
    if (countLianas > validCountLianas) {
      errors.push('Допустимое число лиан: ' + validCountLianas + '. Вы установили ' + countLianas + ' !');
    }
    return errors;
  }

  public checkValid() {
    const field = this.utilsService.parseField(this.field);
    const errors = this.validateField(field);
    if (errors.length !== 0) {
      this.dialog.open(DialogValidateComponent, {
        data: {errors}
      });
    } else {
      this.snackBar.openFromComponent(StudentSnackBarComponent, {
        duration: 1500,
        data: 'Поле составлено правильно!',
      });
    }
  }

  public onSaveTask(){
    if (!this._taskForm.invalid) {
        const field = this.utilsService.parseField(this.field);
        const errors = this.validateField(field);
        if (errors.length !== 0) {
          this.dialog.open(DialogValidateComponent, {
            data: {errors}
          });
          return;
      }
      let task = new Task(
        this._taskForm.value['name'],
        this._taskForm.value['description'],
        field,
      )
      if (!this.isUpdate) {
        this.subs.push(this.taskService.saveTask(task).subscribe(res => {
          this.backendMessage = res.message;
          this.snackBar.openFromComponent(StudentSnackBarComponent, {
            duration: 1500,
            data: this.backendMessage,
          });
          console.log('TASK SAVED', res);
          this.router.navigate(['task-view']);
        }));
      } else {
        this.subs.push(this.taskService.updateTask(this.taskId, task, false).subscribe(res => {
          this.backendMessage = res.message;
          this.snackBar.openFromComponent(StudentSnackBarComponent, {
            duration: 1500,
            data: this.backendMessage,
          });
          console.log('TASK UPDATED', res);
          this.router.navigate(['task-view']);
          /*this.router.navigate(['task-view']);*/
        }));
      }
    }
  }


  /*public dropCommandToCommandsList(event: CdkDragDrop<string[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      this.done = event.previousContainer.data.filter(item => item !== event.previousContainer.data[event.previousIndex]);
      console.log('done', this.done);
    }
  }

  public dropOutside(event: CdkDragExit<string[]>): void {
    console.log('event', event);
    /!*if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      this.done = event.previousContainer.data.filter(item => item !== event.previousContainer.data[event.previousIndex]);
      console.log('done',this.done);
    }*!/
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
  }*/

}
