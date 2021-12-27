import {CONSTANTS} from "../constants/utils";

export class FieldCell {
  private _id: number;
  private _type: string;

  constructor(id: number, type: string) {
    this._id = id;
    this._type = type;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get type(): string {
    return this._type;
  }

  set type(value: string) {
    this._type = value;
  }

}

export class FieldColumn {
  private _id: number;
  private _cells: FieldCell[];

  constructor(id: number, cells: FieldCell[]) {
    this._id = id;
    this._cells = cells;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get cells(): FieldCell[] {
    return this._cells;
  }

  set cells(value: FieldCell[]) {
    this._cells = value;
  }

  public initEmptyColumn(dimension: number) {
    for (let i = 0; i < dimension; i++) {
      this._cells.push(new FieldCell(i,CONSTANTS.FIELD_TYPES.empty));
    }
  }

  public setNewCellType(cellId: number,  newCellType: string){
    this._cells[cellId].type = newCellType;
  }
}

export class Field {
  private _columns: FieldColumn[];

  constructor(columns: FieldColumn[]) {
    this._columns = columns;
  }

  get columns(): FieldColumn[] {
    return this._columns;
  }

  set columns(value: FieldColumn[]) {
    this._columns = value;
  }

  public initEmptyField(dimension: number) {
    for (let i = 0; i < dimension; i++) {
      let column = new FieldColumn(i, []);
      column.initEmptyColumn(dimension);
      this._columns.push(column);
    }
  }

  public createEmptyField(dimension: number) {

    for (let i = 0; i < dimension; i++) {
      let column = new FieldColumn(i, []);
      column.initEmptyColumn(dimension);
      this._columns.push(column);
    }
  }
  /*Установка значения ячейки*/
  public setNewCellType(columnId: number, cellId: number, newCellType: string){
    this.columns[columnId].setNewCellType(cellId, newCellType);
  }

  //todo: Resize
}
