import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {TaskStudentDto} from '../../../models/taskStudentdto';
import {TaskService} from '../../../services/task.service';
import {Subscription} from 'rxjs';
import {Field} from '../../../models/field';
import {UtilsService} from '../../../services/utils.service';
import {TaskDto} from '../../../models/taskDto';
import {DragulaService} from 'ng2-dragula';
import {CONSTANTS} from '../../../constants/utils';
import {PlayMonkey} from '../../../models/playMonkey';
import {MatSnackBar} from "@angular/material/snack-bar";
import {StudentSnackBarComponent} from "../../snack-bar/student-snack-bar/student-snack-bar.component";

@Component({
  selector: 'app-task-solution',
  templateUrl: './task-solution.component.html',
  styleUrls: ['./task-solution.component.less']
})
export class TaskSolutionComponent implements OnInit, OnDestroy {

  @ViewChild('doneList') doneList: any;
  // @ts-ignore
  public matrix = [[1, 2, 3, 4, 5, 6, 7, 8, 9, 0], [1, 2, 3, 4, 5, 6, 7, 8, 9, 0], [1, 2, 3, 4, 5, 6, 7, 8, 9, 0], [1, 2, 3, 4, 5, 6, 7, 8, 9, 0], [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 0], [1, 2, 3, 4, 5, 6, 7, 8, 9, 0], [1, 2, 3, 4, 5, 6, 7, 8, 9, 0], [1, 2, 3, 4, 5, 6, 7, 8, 9, 0], [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]];

  public todo = ['Вперед', 'Назад', 'Поворот налево', 'Поворот направо', 'Прыжок', 'Цикл'];
  public iterationsList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

  public done = ['Цикл'];


  /**/
  @Input()
  public currentTaskId: number;

  // @ts-ignore
  public field: Field = new Field([]);
  public returnField: Field = new Field([]);
  public dimension = 4;
  private subs: Subscription[] = [];
  private studentTasks: TaskStudentDto[] = [];
  private script: string;
  private el: Element;
  private endScript: string;
  public task: TaskDto;
  public playMonkey: PlayMonkey = new PlayMonkey();

  /**/

  constructor(private taskService: TaskService,
              private utilsService: UtilsService,
              private dragulaService: DragulaService,
              public cdr: ChangeDetectorRef,
              public snackBar: MatSnackBar) {
    this.subs.push(dragulaService.drop('COPYABLE')
      .subscribe(({el}) => {
        // @ts-ignore
        const level = this.checkNesting(el?.parentElement, Array.from(el?.parentNode?.children).indexOf(el));
        this.removeSpaceIfExist(el);
        el.classList.add('space-' + level);
        if (el?.firstElementChild?.className === 'for-start' && el?.parentElement?.id !== 'left') {
          const newDiv = document.createElement('div');
          newDiv.className = 'command-list__item space-' + level;
          newDiv.style.marginLeft = 20 * level + 'px';
          newDiv.style.marginBottom = '15px';
          newDiv.style.backgroundColor = 'darkorange';
          newDiv.draggable = true;
          newDiv.innerHTML = '<div class="for-end" style="height: 50px">Конец цикла</div>';
          // @ts-ignore
          el?.parentElement?.insertBefore(newDiv, el.nextSibling);
          cdr.detectChanges();
        }
        // this.parseCommandsList(el);
        this.el = el;
      })
    );
    if (!dragulaService.find('COPYABLE')) {
      dragulaService.createGroup('COPYABLE', {
        removeOnSpill: true,
        copy: (el, source) => {
          return source.id === 'left';
        },
        accepts: (el, target, source, sibling) => {
          // To avoid dragging from right to left container
          if (el?.firstElementChild?.className === 'for-start') {
            // @ts-ignore
            const level = this.checkNesting(el?.parentElement, Array.from(el?.parentNode?.children).indexOf(el));
            // @ts-ignore
            return target?.id !== 'left' && level <= 2;
          }
          return target?.id !== 'left';
        }
      });
    }
  }

  ngOnInit(): void {
    this.subs.push(this.taskService.getTaskForStudent()
      .subscribe((data) => {
        this.studentTasks = data;
        // @ts-ignore
        this.task = this.studentTasks.find(task => task.taskDto.id === this.currentTaskId).taskDto;
        this.field = this.utilsService.mapToField(this.task.map);
        this.dimension = Math.sqrt(this.task.map.length);
        this.cdr.detectChanges();
      }));
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  public getSize(size: number): boolean {
    return this.dimension === size;
  }

  /*Проверка вложенности*/
  public checkNesting(listEl: HTMLElement | null | undefined, position: number | null): number {
    let level = 0;
    if (position) {
      for (let i = 0; i < position; i++) {
        const node = listEl?.childNodes[i];
        node?.childNodes.forEach(nod => {
          if (nod.textContent?.trim() === 'Цикл') {
            level++;
          }
          if (nod.textContent?.trim() === 'Конец цикла') {
            level--;
          }
        });
        console.log('DEBUG', level);
      }
    }
    return level;
  }

  private removeSpaceIfExist(el: Element) {
    switch (true) {
      case el.classList.contains('space-0'):
        el.classList.remove('space-0');
        break;
      case el.classList.contains('space-1'):
        el.classList.remove('space-1');
        break;
      case el.classList.contains('space-2'):
        el.classList.remove('space-2');
        break;
      case el.classList.contains('space-3'):
        el.classList.remove('space-3');
        break;
    }
  }

  // public parseCommandsList(el: Element| undefined){
  //   this.script = '';
  //   // @ts-ignore
  //   Array.from(el?.parentElement?.children).forEach(node => {
  //     this.script += this.detectCommand(node.textContent, node);
  //   });
  //   console.log(this.script);
  //   this.parseToEndScript(this.script);
  // }

  public parseCommandsList() {
    this.script = '';
    // @ts-ignore
    Array.from(this.el?.parentElement?.children).forEach(node => {
      this.script += this.detectCommand(node.textContent, node);
    });
    console.log(this.script);
    const endScript = this.parseToEndScript(this.script);
    this.play(endScript);

  }

  // public jump(column: number, cell: number): boolean {
  //   if (this.field.columns[column].cells[cell].type === CONSTANTS.FIELD_TYPES.empty) {
  //     this.field.setNewCellType(column, cell, CONSTANTS.FIELD_TYPES.monkey);
  //   }
  // }

  public move(column: number, cell: number): boolean {
    if (this.field.columns[column].cells[cell].type === CONSTANTS.FIELD_TYPES.liana) {
      return false;
    }
    if (this.field.columns[column].cells[cell].type === CONSTANTS.FIELD_TYPES.empty) {
      this.field.setNewCellType(column, cell, CONSTANTS.FIELD_TYPES.monkey);
      this.field.setNewCellType(this.playMonkey.column, this.playMonkey.cell, CONSTANTS.FIELD_TYPES.empty);
      this.playMonkey.cell = cell;
      this.playMonkey.column = column;
      return true;
    }
    if (this.field.columns[column].cells[cell].type === CONSTANTS.FIELD_TYPES.banana) {
      this.field.setNewCellType(column, cell, CONSTANTS.FIELD_TYPES.monkey);
      this.field.setNewCellType(this.playMonkey.column, this.playMonkey.cell, CONSTANTS.FIELD_TYPES.empty);
      this.playMonkey.cell = cell;
      this.playMonkey.column = column;
      this.playMonkey.bananasCounter += 1;
      return true;
    }
    if (this.field.columns[column].cells[cell].type === CONSTANTS.FIELD_TYPES.basket) {
      if (this.playMonkey.bananasCounter > 0) {
        this.playMonkey.harvestedBananas += this.playMonkey.bananasCounter;
        this.playMonkey.bananasCounter = 0;
        return true;
      }
    }
    return false;
  }

  public playCommand(symbol: string): boolean {
    switch (symbol) {
      case 'f': {
        if (this.playMonkey.rotation === 'down') {
          if (this.playMonkey.cell + 1 > this.playMonkey.maxIndex) {
            return false;
          }
          return this.move(this.playMonkey.column, this.playMonkey.cell + 1);
        }
        if (this.playMonkey.rotation === 'top') {
          if (this.playMonkey.cell - 1 < this.playMonkey.minIndex) {
            return false;
          }
          return this.move(this.playMonkey.column, this.playMonkey.cell - 1 );
        }
        if (this.playMonkey.rotation === 'left') {
          if (this.playMonkey.column + 1 > this.playMonkey.maxIndex) {
            return false;
          }
          return this.move(this.playMonkey.column + 1, this.playMonkey.cell);
        }
        if (this.playMonkey.rotation === 'right') {
          if (this.playMonkey.column - 1 < this.playMonkey.minIndex) {
            return false;
          }
          return this.move(this.playMonkey.column - 1, this.playMonkey.cell);
        }
        break;
      }
      case 'b': {
        if (this.playMonkey.rotation === 'down') {
          if (this.playMonkey.cell - 1 < this.playMonkey.minIndex) {
            return false;
          }
          return this.move(this.playMonkey.column, this.playMonkey.cell - 1 );
        }
        if (this.playMonkey.rotation === 'top') {
          if (this.playMonkey.cell + 1 > this.playMonkey.maxIndex) {
            return false;
          }
          return this.move(this.playMonkey.column, this.playMonkey.cell + 1);
        }
        if (this.playMonkey.rotation === 'left') {
          if (this.playMonkey.column - 1 < this.playMonkey.minIndex) {
            return false;
          }
          return this.move(this.playMonkey.column - 1, this.playMonkey.cell);
        }
        if (this.playMonkey.rotation === 'right') {
          if (this.playMonkey.column + 1 > this.playMonkey.maxIndex) {
            return false;
          }
          return this.move(this.playMonkey.column + 1, this.playMonkey.cell);
        }
        break;
      }
      case 'l': {
        if (this.playMonkey.rotation === 'down') {
          this.playMonkey.rotation = 'left';
          return true;
        }
        else if (this.playMonkey.rotation === 'top'){
          this.playMonkey.rotation = 'right';
          return true;
        }
        else if (this.playMonkey.rotation === 'left'){
          this.playMonkey.rotation = 'top';
          return true;
        }
        else if (this.playMonkey.rotation === 'right'){
          this.playMonkey.rotation = 'down';
          return true;
        }
        break;
      }
      case 'r': {
        if (this.playMonkey.rotation === 'down') {
          this.playMonkey.rotation = 'right';
          return true;
        }
        else if (this.playMonkey.rotation === 'top'){
          this.playMonkey.rotation = 'left';
          return true;
        }
        else if (this.playMonkey.rotation === 'left'){
          this.playMonkey.rotation = 'down';
          return true;
        }
        else if (this.playMonkey.rotation === 'right'){
          this.playMonkey.rotation = 'top';
          return true;
        }
        break;
      }
      case 'j': {
        if (this.playMonkey.rotation === 'top') {
          if (this.playMonkey.cell - 2 < this.playMonkey.minIndex || this.playMonkey.cell - 1 < this.playMonkey.minIndex) {
            console.log('хдыщ0');
            return false;
          }
          if (this.field.columns[this.playMonkey.column].cells[this.playMonkey.cell - 1].type === CONSTANTS.FIELD_TYPES.liana) {
            console.log('хдыщ1');
            return this.move(this.playMonkey.column, this.playMonkey.cell - 2);
          }
        }
        if (this.playMonkey.rotation === 'down') {
          if (this.playMonkey.cell + 2 > this.playMonkey.maxIndex || this.playMonkey.cell + 1 > this.playMonkey.maxIndex) {
            console.log('хдыщ7');
            return false;
          }
          if (this.field.columns[this.playMonkey.column].cells[this.playMonkey.cell + 1].type === CONSTANTS.FIELD_TYPES.liana) {
            console.log('хдыщ8');
            return this.move(this.playMonkey.column, this.playMonkey.cell + 2);
          }
        }
        if (this.playMonkey.rotation === 'left') {
          if (this.playMonkey.column + 2 > this.playMonkey.maxIndex || this.playMonkey.column + 1 > this.playMonkey.maxIndex) {
            console.log('хдыщ3');
            return false;
          }
          if (this.field.columns[this.playMonkey.column + 1].cells[this.playMonkey.cell].type === CONSTANTS.FIELD_TYPES.liana) {
            console.log('хдыщ2');
            return this.move(this.playMonkey.column + 2, this.playMonkey.cell);
          }
        }
        if (this.playMonkey.rotation === 'right') {
          if (this.playMonkey.column - 2 < this.playMonkey.minIndex || this.playMonkey.column - 1 < this.playMonkey.minIndex) {
            console.log('хдыщ4');
            return false;
          }
          if (this.field.columns[this.playMonkey.column - 1].cells[this.playMonkey.cell].type === CONSTANTS.FIELD_TYPES.liana) {
            console.log('хдыщ5');
            return this.move(this.playMonkey.column - 2, this.playMonkey.cell);
          }
        }
        break;
      }
    }
    return false;
  }

  public sleep(ms: number): any {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async play(script: string): Promise<any> {
    this.playMonkey.rotation = 'down';
    this.playMonkey.maxIndex = this.dimension - 1;
    this.returnField = this.utilsService.mapToField(this.task.map);
    const scriptLength = script.length;
    for (let j = 0; j < this.dimension; j++) {
      for (let k = 0; k < this.dimension; k++) {
        if (this.field.columns[j].cells[k].type === CONSTANTS.FIELD_TYPES.monkey) {
          this.playMonkey.column = j;
          this.playMonkey.cell = k;
          break;
        }
      }
    }
    for (let i = 0; i < scriptLength; i++) {
      console.log(script.charAt(i));
      if (this.playCommand(script.charAt(i))) {
        console.log(script.charAt(i));
        console.log('Не ошибка');
        await this.sleep(700);
      } else {
        this.snackBar.openFromComponent(StudentSnackBarComponent, {
          duration: 1500,
          data: 'Ошибка!',
        });
        break;
      }
    }
    await this.sleep(500);
    this.playMonkey.bananasCounter = 0;
    this.playMonkey.harvestedBananas = 0;
    this.field = this.returnField;
    this.cdr.detectChanges();
  }


  public parseToEndScript(script: string): string {

    const countIteration = script.split('s').length - 1;
    for (let i = 0; i < countIteration; i++) {
      console.log('Скрипт: ' + script);
      const ind = script.length - 1;
      for (let j = ind; j > -1; j--) {
        if (script.charAt(j) === 's') {
          const indexOfStart = j;
          const indexOfEnd = script.indexOf('e', indexOfStart);
          const countOfCycleString = script.substr(j + 1, 2);
          let countOfCycle;
          if (countOfCycleString.charAt(0) === '0') {
            countOfCycle = parseInt(countOfCycleString.charAt(1), 10);
          } else {
            countOfCycle = parseInt(countOfCycleString, 10);
          }
          const cycleString = script.substring(indexOfStart + 3, indexOfEnd);
          const replaceString = cycleString.repeat(countOfCycle);
          script = script.slice(0, indexOfStart) + replaceString + script.slice(indexOfEnd + 1, script.length);
          break;
        }
      }
    }
    return script;
  }

private detectCommand(command: string | null, node: Element): string
{
  switch (command) {
    case 'ВПЕРЕД':
      return CONSTANTS.COMMAND_TYPES.forward;
    case 'НАЗАД':
      return CONSTANTS.COMMAND_TYPES.backward;
    case 'ПОВОРОТ НАЛЕВО':
      return CONSTANTS.COMMAND_TYPES.turn_left;
    case 'ПОВОРОТ НАПРАВО':
      return CONSTANTS.COMMAND_TYPES.turn_right;
    case 'КОНЕЦ ЦИКЛА':
      return CONSTANTS.COMMAND_TYPES.cycle_end;
    case 'ПРЫЖОК':
      return CONSTANTS.COMMAND_TYPES.jump;
    default:
      // @ts-ignore
      let value = node?.children[0].childNodes[1].value;
      if (value.length === 1) {
        value = '0' + value;
      }
      return CONSTANTS.COMMAND_TYPES.cycle_start + value;
  }
}

}
