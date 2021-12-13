import {Component, Input, OnInit, Output} from '@angular/core';
import {EventEmitter} from '@angular/core';
import {CONSTANTS} from "../../../../constants/utils";

@Component({
  selector: 'app-field-cell',
  templateUrl: './field-cell.component.html',
  styleUrls: ['./field-cell.component.less']
})
export class FieldCellComponent implements OnInit {

  @Input() isSourceListItem: boolean = false;

  @Input() idColumn: number;
  @Input() idCell: number;

  @Input() set type(type: string){
    type === CONSTANTS.FIELD_TYPES.monkey ? this.isMonkey = true : this.isMonkey = false;
    type === CONSTANTS.FIELD_TYPES.basket ? this.isBasket = true : this.isBasket = false;
    type === CONSTANTS.FIELD_TYPES.liana ? this.isLiana = true : this.isLiana = false;
    type === CONSTANTS.FIELD_TYPES.banana ? this.isBanana = true : this.isBanana = false;
    type === CONSTANTS.FIELD_TYPES.empty ? this.isEmpty = true : this.isEmpty = false;
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
    this.cellItem.emit({target: event.target, idColumn: this.idColumn, idCell: this.idCell});
  }

}
