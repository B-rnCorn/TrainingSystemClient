import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.less']
})
export class TasksComponent implements OnInit, OnDestroy {

  public actionType: string = 'create';
  private subs: Subscription[] = [];
  public taskId: number;

  constructor(private route: ActivatedRoute) { }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  ngOnInit(): void {
    this.subs.push(this.route.params.subscribe(params => {
      this.taskId = Number.parseInt(params['id']);
      if (params['action'])
      this.actionType = params['action'];
    }));
  }

}
