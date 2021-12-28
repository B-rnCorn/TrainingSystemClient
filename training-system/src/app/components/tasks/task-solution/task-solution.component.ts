import {ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
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
import {SolutionService} from "../../../services/solution.service";

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

  public todo = [CONSTANTS.COMMAND_FULL_TYPES.forward, CONSTANTS.COMMAND_FULL_TYPES.backward, CONSTANTS.COMMAND_FULL_TYPES.turn_left, CONSTANTS.COMMAND_FULL_TYPES.turn_right, CONSTANTS.COMMAND_FULL_TYPES.jump, CONSTANTS.COMMAND_FULL_TYPES.cycle_start];
  public iterationsList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

  public done = [CONSTANTS.COMMAND_FULL_TYPES.cycle_start];


  /**/
  @Input()
  public currentTaskId: number;

  @ViewChild('commandsList')
  private commandsList: ElementRef;

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
  public isSend: boolean = false;
  private solutionId: number = -1;

  /**/

  constructor(private taskService: TaskService,
              private utilsService: UtilsService,
              private dragulaService: DragulaService,
              private solutionService: SolutionService,
              public cdr: ChangeDetectorRef,
              public snackBar: MatSnackBar) {
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
    this.subs.push(this.dragulaService.drop('COPYABLE')
      .subscribe(({el}) => {
        // @ts-ignore
        const level = this.checkNesting(el?.parentElement, Array.from(el?.parentNode?.children).indexOf(el));
        this.removeSpaceIfExist(el);
        el.classList.add('space-' + level);
        console.log('el?.firstElementChild?.className',el,el?.firstElementChild, el?.firstElementChild?.className);
        if (el?.firstElementChild?.className.includes('for-start') && el?.parentElement?.id !== 'left') {
          const newDiv = document.createElement('div');
          newDiv.className = 'command-list__item space-' + level;
          newDiv.style.marginLeft = 20 * level + 'px';
          newDiv.style.marginBottom = '15px';
          newDiv.style.backgroundColor = '#c7783f';
          newDiv.draggable = true;
          newDiv.innerHTML = '<div class="for-end" style="height: 50px">Конец цикла</div>';
          // @ts-ignore
          el?.parentElement?.insertBefore(newDiv, el.nextSibling);
          this.cdr.detectChanges();
        }
        // this.parseCommandsList(el);
        this.el = el;
      })
    );
  }

  ngOnInit(): void {
    this.subs.push(this.taskService.getTaskForStudent()
      .subscribe((data) => {
        this.studentTasks = data;
        // @ts-ignore
        this.task = this.studentTasks.find(task => task.taskDto.id === this.currentTaskId).taskDto;
        this.field = this.utilsService.mapToField(this.task.map);
        this.dimension = Math.sqrt(this.task.map.length);
        this.getSolution();
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
          if (nod.textContent?.trim() === CONSTANTS.COMMAND_FULL_TYPES.cycle_start) {
            level++;
          }
          if (nod.textContent?.trim() === CONSTANTS.COMMAND_FULL_TYPES.cycle_end) {
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

  private parseCommandsList() {
    this.script = '';
    // @ts-ignore
    Array.from(this.commandsList.nativeElement.children).forEach(node => {
      // @ts-ignore
      this.script += this.detectCommand(node.textContent, node);
    });
  }

  public playCommands() {
    this.parseCommandsList();
    let scriptCopy = JSON.parse(JSON.stringify(this.script));
    console.log(scriptCopy, this.script);
    // @ts-ignore
    const endScript = this.parseToEndScript(scriptCopy);
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
          return this.move(this.playMonkey.column, this.playMonkey.cell - 1);
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
          return this.move(this.playMonkey.column, this.playMonkey.cell - 1);
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
        } else if (this.playMonkey.rotation === 'top') {
          this.playMonkey.rotation = 'right';
          return true;
        } else if (this.playMonkey.rotation === 'left') {
          this.playMonkey.rotation = 'top';
          return true;
        } else if (this.playMonkey.rotation === 'right') {
          this.playMonkey.rotation = 'down';
          return true;
        }
        break;
      }
      case 'r': {
        if (this.playMonkey.rotation === 'down') {
          this.playMonkey.rotation = 'right';
          return true;
        } else if (this.playMonkey.rotation === 'top') {
          this.playMonkey.rotation = 'left';
          return true;
        } else if (this.playMonkey.rotation === 'left') {
          this.playMonkey.rotation = 'down';
          return true;
        } else if (this.playMonkey.rotation === 'right') {
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

  private detectCommand(command: string | null, node: Element): string {
    switch (command) {
      case CONSTANTS.COMMAND_FULL_TYPES.forward:
        return CONSTANTS.COMMAND_TYPES.forward;
      case CONSTANTS.COMMAND_FULL_TYPES.backward:
        return CONSTANTS.COMMAND_TYPES.backward;
      case CONSTANTS.COMMAND_FULL_TYPES.turn_left:
        return CONSTANTS.COMMAND_TYPES.turn_left;
      case CONSTANTS.COMMAND_FULL_TYPES.turn_right:
        return CONSTANTS.COMMAND_TYPES.turn_right;
      case CONSTANTS.COMMAND_FULL_TYPES.cycle_end:
        return CONSTANTS.COMMAND_TYPES.cycle_end;
      case CONSTANTS.COMMAND_FULL_TYPES.jump:
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

  /*Сохранение решения
  * Сохраняет решение, если его еще не было или обновляет, если уже имеется*/
  public saveSolution() {
    this.parseCommandsList();
    if (!this.isSend) {
      this.subs.push(this.solutionService.saveSolution(this.task.id, this.script).subscribe(res => {
        this.snackBar.openFromComponent(StudentSnackBarComponent, {
          duration: 1500,
          data: res.message,
        });
      }));
    } else {
      this.subs.push(this.solutionService.updateSolution(this.solutionId, this.script).subscribe(res => {
        this.snackBar.openFromComponent(StudentSnackBarComponent, {
          duration: 1500,
          data: res.message,
        });
      }));
    }
  }

  //---------------Загрузка уже имеющегося решения------------------//

  public parseScriptToCommands(script: string) {
    let cleanScript = this.removeIterationsFromScript(script);
    for (let i = 0; i < script.length; i++) {
      let level, command, iterations = 0;
      let newDiv = document.createElement("div");
      level = this.checkNestedLevel(script, i);
      newDiv.className = 'command-list__item space-' + level;
      newDiv.style.height = '50px';
      newDiv.style.fontWeight = 'bolder';
      newDiv.style.marginLeft = 20 * level + 'px';
      newDiv.style.marginBottom = '15px';
      if (script[i] === 's') {
        command = this.recognizeCommand('');
        iterations = Number.parseInt(script[i + 1] + script[i + 2]);
        newDiv.style.backgroundColor = this.getColorOFCommand(command);
        newDiv.innerHTML = '<div class="for-end">' + command + '<input type="number" min="1" max="16" placeholder="i" value="' + iterations + '"></div>';
        console.log(command);
        i = i + 2;
      } else {
        command = this.recognizeCommand(script[i]);
        newDiv.style.backgroundColor = this.getColorOFCommand(command);
        newDiv.innerHTML = '<div>' + command + '</div>';
        console.log(command);
      }
      this.commandsList.nativeElement.appendChild(newDiv);
    }
  }

  private removeIterationsFromScript(script: string): string {
    let cleanScript = '', commands = 'fbjlrse';
    for (let i = 0; i < script.length; i++) {
      if (commands.indexOf(script[i]) >= 0) {
        cleanScript = cleanScript + script[i];
      }
    }
    return cleanScript;
  }

  private checkNestedLevel(script: string, index: number): number {
    let level = 0;
    for (let i = 0; i <= index; i++) {
      if (script[i - 2] === 's') {
        console.log("LVLUP");
        level = level + 1;
      }
      if (script[i] === 'e') {
        console.log("LVLDOWN");
        level = level - 1;
      }
      console.log('i  ', script[i], level, index);
    }
    return level;
  }

  private recognizeCommand(symbols: string): string {
    switch (true) {
      case symbols === 'f':
        return CONSTANTS.COMMAND_FULL_TYPES.forward;
      case symbols === 'b':
        return CONSTANTS.COMMAND_FULL_TYPES.backward;
      case symbols === 'l':
        return CONSTANTS.COMMAND_FULL_TYPES.turn_left;
      case symbols === 'r':
        return CONSTANTS.COMMAND_FULL_TYPES.turn_right;
      case symbols === 'j':
        return CONSTANTS.COMMAND_FULL_TYPES.jump;
      case symbols === 'e':
        return CONSTANTS.COMMAND_FULL_TYPES.cycle_end;
      default:
        return CONSTANTS.COMMAND_FULL_TYPES.cycle_start + symbols;
    }
  }

  private getColorOFCommand(command: string): string {
    switch (command) {
      case CONSTANTS.COMMAND_FULL_TYPES.forward:
      case CONSTANTS.COMMAND_FULL_TYPES.backward:
        return '#54c4c7';
      case CONSTANTS.COMMAND_FULL_TYPES.turn_left:
      case CONSTANTS.COMMAND_FULL_TYPES.turn_right:
        return '#56c755'
      case CONSTANTS.COMMAND_FULL_TYPES.jump:
        return '#b571c7'
      default:
        return '#c7783f'
    }
  }

  private getSolution() {
    this.subs.push(this.solutionService.getAllStudentSolutions().subscribe(res => {
      console.log('DEBUG 1', res);
      // @ts-ignore
      let solution = res.find(item => {
        return item.task.id === this.task.id;
      })
      let algorithm = solution?.algorithm;
      console.log('DEBUG 2', algorithm);
      if (algorithm) {
        this.isSend = true;
        this.solutionId = solution.id;
        console.log('solutionId',this.solutionId);
        this.script = algorithm;
        this.parseScriptToCommands(this.script);
      }
    }));
  }

}
