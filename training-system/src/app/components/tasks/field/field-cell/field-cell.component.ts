import {Component, Input, OnInit, Output} from '@angular/core';
import {EventEmitter} from '@angular/core';

@Component({
  selector: 'app-field-cell',
  templateUrl: './field-cell.component.html',
  styleUrls: ['./field-cell.component.less']
})
export class FieldCellComponent implements OnInit {

  @Input() set type(type: string){
    type === 'monkey' ? this.isMonkey = true : this.isMonkey = false;
    type === 'basket' ? this.isBasket = true : this.isBasket = false;
    type === 'liana' ? this.isLiana = true : this.isLiana = false;
    type === 'banana' ? this.isBanana = true : this.isBanana = false;
    type === 'empty' ? this.isEmpty = true : this.isEmpty = false;
  };
  @Output() cellItem = new EventEmitter();

  public isMonkey: boolean = false;
  public isBasket: boolean = false;
  public isLiana: boolean = false;
  public isBanana: boolean = false;
  public isEmpty: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  public dragStart(event: any){
    this.cellItem.emit(event.target);
  }

}
