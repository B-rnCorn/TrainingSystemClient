import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-field-items-list',
  templateUrl: './field-items-list.component.html',
  styleUrls: ['./field-items-list.component.less']
})
export class FieldItemsListComponent implements OnInit {

  @Input() public listData: any[];

  @Output() throwCellItem = new EventEmitter();
  @Output() throwDropItemToAnotherItem = new EventEmitter();
  @Output() throwDragOver = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  public onCellItemChange(event: any){
    this.throwCellItem.emit(event);
  }

  public onDragOver(event: any) {
    event.preventDefault();
  }

  public dragOver(event: any) {
    event.preventDefault();
  }

  public dropItemToAnotherItem(event: any): void {
    console.log(event);
    /*if (event.target.classList.contains("cell-content")) {
      let sourceType = TaskCreationComponent.spotCellType(this.cellItem.classList);
      this.cellItem.classList.remove(TaskCreationComponent.spotCellType(this.cellItem.classList));
      this.cellItem.classList.add(TaskCreationComponent.spotCellType(event.target.classList));
      event.target.classList.remove(TaskCreationComponent.spotCellType(event.target.classList));
      event.target.classList.add(sourceType);
      console.log('ЯЧЕЙКА', event.target.children);
    }*/
  }

}
