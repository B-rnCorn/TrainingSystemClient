import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CdkDragDrop, CdkDragExit, copyArrayItem, moveItemInArray} from "@angular/cdk/drag-drop";
import {TaskStudentDto} from "../../../models/taskStudentdto";
import {TaskService} from "../../../services/task.service";
import {Subscription} from "rxjs";
import {Field} from "../../../models/field";
import {UtilsService} from "../../../services/utils.service";
import {TaskDto} from "../../../models/taskDto";
import {DragulaService} from "ng2-dragula";
import {CONSTANTS} from "../../../constants/utils";

@Component({
  selector: 'app-task-solution',
  templateUrl: './task-solution.component.html',
  styleUrls: ['./task-solution.component.less']
})
export class TaskSolutionComponent implements OnInit, OnDestroy {

  @ViewChild('doneList') doneList: any;
  //@ts-ignore
  public matrix = [[1, 2, 3, 4, 5, 6, 7, 8, 9, 0], [1, 2, 3, 4, 5, 6, 7, 8, 9, 0], [1, 2, 3, 4, 5, 6, 7, 8, 9, 0], [1, 2, 3, 4, 5, 6, 7, 8, 9, 0], [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 0], [1, 2, 3, 4, 5, 6, 7, 8, 9, 0], [1, 2, 3, 4, 5, 6, 7, 8, 9, 0], [1, 2, 3, 4, 5, 6, 7, 8, 9, 0], [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]]

  public todo = ['ВПЕРЕД', 'НАЗАД', 'ПОВОРОТ НАЛЕВО', 'ПОВОРОТ НАПРАВО', 'ПРЫЖОК', 'ЦИКЛ'];
  public iterationsList = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];

  public done = ['ЦИКЛ'];


  /**/
  @Input()
  public currentTaskId: number;

  //@ts-ignore
  public field: Field = new Field([]);
  public dimension: number = 4;
  private subs: Subscription[] = [];
  private studentTasks: TaskStudentDto[] = [];
  private script: string;
  public task: TaskDto;

  /**/

  constructor(private taskService: TaskService,
              private utilsService: UtilsService,
              private dragulaService: DragulaService,
              public cdr: ChangeDetectorRef) {
    this.subs.push(dragulaService.drop('COPYABLE')
      .subscribe(({el}) => {
        // @ts-ignore
        let level = this.checkNesting(el?.parentElement, Array.from(el?.parentNode?.children).indexOf(el));
        this.removeSpaceIfExist(el);
        el.classList.add('space-' + level);
        if (el?.firstElementChild?.className === 'for-start' && el?.parentElement?.id !== 'left') {
          let newDiv = document.createElement("div");
          newDiv.className = 'command-list__item space-' + level;
          newDiv.style.marginLeft = 20 * level + 'px';
          newDiv.style.marginBottom = '15px';
          newDiv.style.backgroundColor = 'darkorange';
          newDiv.draggable = true;
          newDiv.innerHTML = '<div class="for-end">КОНЕЦ ЦИКЛА</div>';
          // @ts-ignore
          el?.parentElement?.insertBefore(newDiv, el.nextSibling);
          cdr.detectChanges();
        }
        this.parseCommandsList(el);
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
            let level = this.checkNesting(el?.parentElement, Array.from(el?.parentNode?.children).indexOf(el));
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
  public checkNesting(listEl: HTMLElement | null | undefined, position: number | null):number {
    let level = 0;
    if (position)
    for (let i = 0; i < position; i++) {
      let node = listEl?.childNodes[i];
      node?.childNodes.forEach(nod => {
        if (nod.textContent?.trim() === 'ЦИКЛ') level++;
        if (nod.textContent?.trim() === 'КОНЕЦ ЦИКЛА') level--;
      });
      console.log('DEBUG',level);
    }
    return level;
  }

  private removeSpaceIfExist(el: Element){
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

  public parseCommandsList(el: Element| undefined){
    this.script = '';
    // @ts-ignore
    Array.from(el?.parentElement?.children).forEach(node => {
      this.script += this.detectCommand(node.textContent,node);
    });
  }

  private detectCommand(command: string | null, node: Element): string{
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
        if(value.length === 1)
          value = '0' + value;
        return CONSTANTS.COMMAND_TYPES.cycle_start + value;
    }
  }

}
