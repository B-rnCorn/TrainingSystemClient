import {ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Field} from "../../../models/field";
import {Subscription} from "rxjs";
import {UtilsService} from "../../../services/utils.service";
import {TaskService} from "../../../services/task.service";
import {ActivatedRoute, Router} from "@angular/router";
import {TaskDto} from "../../../models/taskDto";
import {SolutionService} from "../../../services/solution.service";
import {SolutionDto} from "../../../models/solutionDto";
import {StudentSnackBarComponent} from "../../snack-bar/student-snack-bar/student-snack-bar.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CONSTANTS} from "../../../constants/utils";
import {PlayMonkey} from "../../../models/playMonkey";

interface Student {
  id: number;
  username: string;
  fio: string;
}

@Component({
  selector: 'app-task-check',
  templateUrl: './task-check.component.html',
  styleUrls: ['./task-check.component.less']
})
export class TaskCheckComponent implements OnInit, OnDestroy {

  @Input()
  public currentTaskId: number;

  @ViewChild('commandsList')
  private commandsList: ElementRef;

  public dimension: number = 4;
  private subs: Subscription[] = [];
  public field: Field = new Field([]);
  public returnField: Field = new Field([]);
  public playMonkey: PlayMonkey = new PlayMonkey();
  public students: Student[] = [];
  public todo = [CONSTANTS.COMMAND_FULL_TYPES.forward, CONSTANTS.COMMAND_FULL_TYPES.backward, CONSTANTS.COMMAND_FULL_TYPES.turn_left, CONSTANTS.COMMAND_FULL_TYPES.turn_right, CONSTANTS.COMMAND_FULL_TYPES.jump, CONSTANTS.COMMAND_FULL_TYPES.cycle_start];
  private task: TaskDto;
  private solution: SolutionDto;
  private script: string = '';
  private mark: number;
  public end: boolean;
  flag0: boolean = false;
  flag1: boolean = false;
  flag2: boolean = false;
  flag3: boolean = false;
  flag4: boolean = false;
  flag5: boolean = false;

  constructor(public cdr: ChangeDetectorRef,
              private utilsService: UtilsService,
              private taskService: TaskService,
              private solutionService: SolutionService,
              private router: Router,
              private route: ActivatedRoute,
              private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.subs.push(this.route.params.subscribe(params => {
      this.currentTaskId = Number.parseInt(params['id']);
      this.subs.push(this.taskService.getTaskByTeacher().subscribe(tasks => {
        this.task = tasks.find(task => task.id === this.currentTaskId);
        if (this.task) {
          this.field = this.utilsService.mapToField(this.task.map);
          this.dimension = Math.sqrt(this.task.map.length);
          this.subs.push(this.solutionService.getStudentsForTask(this.task.id).subscribe(res => {
            this.students = res;
            console.log('RESPONSE',this.students);
          }));
          this.cdr.detectChanges();
        }
      }));
    }));
  }


  public getSize(size: number): boolean{
    return this.dimension === size;
  }

  public onChooseStudent(studentId: number){
    this.clearList();
    console.log(studentId);
    this.subs.push(this.solutionService.getStudentSolution(studentId, this.task.id).subscribe(res => {
      this.solution = res;
      this.script = this.solution.algorithm;
      this.parseScriptToCommands();
    }));
  }

  public clearList(){
    while (this.commandsList.nativeElement.firstChild){
      this.commandsList.nativeElement.removeChild(this.commandsList.nativeElement.firstChild);
    }
  }

  public playCommands() {
    let scriptCopy = JSON.parse(JSON.stringify(this.script));
    let counter = 0;
    for (let i = 0; i < scriptCopy.length; i++) {
      if (scriptCopy.charAt(i) === 'e') {
        counter--;
      }
      if (scriptCopy.charAt(i) === 's') {
        counter++;
      }
      if (counter < 0) {
        this.snackBar.openFromComponent(StudentSnackBarComponent, {
          duration: 1500,
          data: 'В вашем алгоритме ошибка!',
        });
        return;
      }
    }
    if (counter !== 0) {
      this.snackBar.openFromComponent(StudentSnackBarComponent, {
        duration: 1500,
        data: 'В вашем алгоритме ошибка!',
      });
      return;
    }
    console.log(scriptCopy, this.script);
    // @ts-ignore
    const endScript = this.parseToEndScript(scriptCopy);
    this.play(endScript);

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

  async play(script: string): Promise<any> {
    this.end = true;
    this.playMonkey.rotation = 'top';
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
        this.end = false;
        break;
      }
    }
    await this.sleep(500);
    this.playMonkey.bananasCounter = 0;
    this.playMonkey.harvestedBananas = 0;
    this.field = this.returnField;
    this.cdr.detectChanges();
  }

  public sleep(ms: number): any {
    return new Promise(resolve => setTimeout(resolve, ms));
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
            return false;
          }
          if (this.field.columns[this.playMonkey.column].cells[this.playMonkey.cell - 1].type === CONSTANTS.FIELD_TYPES.liana) {
            return this.move(this.playMonkey.column, this.playMonkey.cell - 2);
          }
        }
        if (this.playMonkey.rotation === 'down') {
          if (this.playMonkey.cell + 2 > this.playMonkey.maxIndex || this.playMonkey.cell + 1 > this.playMonkey.maxIndex) {
            return false;
          }
          if (this.field.columns[this.playMonkey.column].cells[this.playMonkey.cell + 1].type === CONSTANTS.FIELD_TYPES.liana) {
            return this.move(this.playMonkey.column, this.playMonkey.cell + 2);
          }
        }
        if (this.playMonkey.rotation === 'left') {
          if (this.playMonkey.column + 2 > this.playMonkey.maxIndex || this.playMonkey.column + 1 > this.playMonkey.maxIndex) {
            return false;
          }
          if (this.field.columns[this.playMonkey.column + 1].cells[this.playMonkey.cell].type === CONSTANTS.FIELD_TYPES.liana) {
            return this.move(this.playMonkey.column + 2, this.playMonkey.cell);
          }
        }
        if (this.playMonkey.rotation === 'right') {
          if (this.playMonkey.column - 2 < this.playMonkey.minIndex || this.playMonkey.column - 1 < this.playMonkey.minIndex) {
            return false;
          }
          if (this.field.columns[this.playMonkey.column - 1].cells[this.playMonkey.cell].type === CONSTANTS.FIELD_TYPES.liana) {
            return this.move(this.playMonkey.column - 2, this.playMonkey.cell);
          }
        }
        break;
      }
    }
    return false;
  }

  public parseScriptToCommands(){
    const script = this.script;
    for (let i = 0; i < script.length; i++){
      let level, command, iterations = 0;
      let newDiv = document.createElement("div");
      level = this.checkNestedLevel(script,i);
      newDiv.className = 'command-list__item space-' + level;
      newDiv.style.marginLeft = 20 * level + 'px';
      newDiv.style.marginBottom = '15px';
      if (script[i] === 's'){
        command = this.recognizeCommand('');
        iterations = Number.parseInt(script[i + 1] + script[i + 2]);
        newDiv.style.backgroundColor = this.getColorOFCommand(command);
        newDiv.innerHTML = '<div class="for-end">' + command +'<input type="number" min="1" max="16" placeholder="i" value="'+iterations+'"></div>';
        console.log(command);
        i = i + 2;
      } else {
        command = this.recognizeCommand(script[i]);
        newDiv.style.backgroundColor = this.getColorOFCommand(command);
        newDiv.innerHTML = '<div class="for-end">' + command + '</div>';
        console.log(command);
      }
      this.commandsList.nativeElement.appendChild(newDiv);
    }
  }

  private  checkNestedLevel(script: string, index: number): number{
    let level = 0;
    for (let i = 0; i <= index; i++) {
      if (script[i - 2] === 's') {
        level = level + 1;
      }
      if (script[i] === 'e') {
        level = level - 1;
      }
      console.log('i  ', script[i], level, index);
    }
    return level;
  }

  private recognizeCommand(symbols: string): string{
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

  private getColorOFCommand(command: string):string{
    switch (command) {
      case CONSTANTS.COMMAND_FULL_TYPES.forward:
      case CONSTANTS.COMMAND_FULL_TYPES.backward:
        return 'dodgerblue';
      case CONSTANTS.COMMAND_FULL_TYPES.turn_left:
      case CONSTANTS.COMMAND_FULL_TYPES.turn_right:
        return 'limegreen'
      case CONSTANTS.COMMAND_FULL_TYPES.jump:
        return 'blueviolet'
      default:
        return 'orange'
    }
  }

  public setMark(mark: number){
    if (mark === 0) {
      this.flag0 = true;
      this.flag1 = false;
      this.flag2 = false;
      this.flag3 = false;
      this.flag4 = false;
      this.flag5 = false;
    }
    else if (mark === 1) {
      this.flag0 = false;
      this.flag1 = true;
      this.flag2 = false;
      this.flag3 = false;
      this.flag4 = false;
      this.flag5 = false;
    }
    else if (mark === 2) {
      this.flag0 = false;
      this.flag1 = false;
      this.flag2 = true;
      this.flag3 = false;
      this.flag4 = false;
      this.flag5 = false;
    }
    else if (mark === 3) {
      this.flag0 = false;
      this.flag1 = false;
      this.flag2 = false;
      this.flag3 = true;
      this.flag4 = false;
      this.flag5 = false;
    }
    else if (mark === 4) {
      this.flag0 = false;
      this.flag1 = false;
      this.flag2 = false;
      this.flag3 = false;
      this.flag4 = true;
      this.flag5 = false;
    }
    else if (mark === 5) {
      this.flag0 = false;
      this.flag1 = false;
      this.flag2 = false;
      this.flag3 = false;
      this.flag4 = false;
      this.flag5 = true;
    }
    this.mark = mark;
  }

  public onSendMark(){
    this.subs.push(this.solutionService.sendMark(this.solution.id, this.mark).subscribe(res =>
    {
      this.snackBar.openFromComponent(StudentSnackBarComponent, {
        duration: 1500,
        data: res.message,
      });
    }));
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
