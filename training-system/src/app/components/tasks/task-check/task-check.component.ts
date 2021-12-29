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
  public students: Student[] = [];
  public todo = ['ВПЕРЕД', 'НАЗАД', 'ПОВОРОТ НАЛЕВО', 'ПОВОРОТ НАПРАВО', 'ПРЫЖОК', 'ЦИКЛ'];
  private task: TaskDto;
  private solution: SolutionDto;
  private script: string = '';
  private mark: number;

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
    console.log(studentId);
    this.subs.push(this.solutionService.getStudentSolution(studentId, this.task.id).subscribe(res => {
      this.solution = res;
      this.script = this.solution.algorithm;
      this.parseScriptToCommands();
    }));
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
        return 'ВПЕРЕД';
      case symbols === 'b':
        return 'НАЗАД';
      case symbols === 'l':
        return 'ПОВОРОТ НАЛЕВО';
      case symbols === 'r':
        return 'ПОВОРОТ НАПРАВО';
      case symbols === 'j':
        return 'ПРЫЖОК';
      case symbols === 'e':
        return 'КОНЕЦ ЦИКЛА';
      default:
        return 'ЦИКЛ' + symbols;
    }
  }

  private getColorOFCommand(command: string):string{
    switch (command) {
      case 'ВПЕРЕД':
      case 'НАЗАД':
        return 'dodgerblue';
      case 'ПОВОРОТ НАЛЕВО':
      case 'ПОВОРОТ НАПРАВО':
        return 'limegreen'
      case 'ПРЫЖОК':
        return 'blueviolet'
      default:
        return 'darkorange'
    }
  }

  public setMark(mark: number){
    this.mark = mark;
  }

  public onSendMark(){
    this.subs.push(this.solutionService.sendMark(this.solution.id, this.mark).subscribe(res =>
    {
      this.snackBar.openFromComponent(StudentSnackBarComponent, {
        duration: 1500,
        data: 'Оценка выставлена!',
      });
    }));
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
