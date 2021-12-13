import {Injectable} from "@angular/core";
import {Field, FieldCell, FieldColumn} from "../models/field";

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  public parseField(field: Field): string {
    let resultField = '';
    field.columns.forEach(column => {
      column.cells.forEach(cell => {
        resultField += cell.type;
      })
    });
    return resultField;
  }

  public mapToField(map: string): Field {
    let field = new Field([]);
    let dimension = Math.sqrt(map.length)
    for (let i = 0; i < dimension; i++){
      let column = new FieldColumn(i,[]);
      for (let j = 0; j < dimension; j++){
        let cell = new FieldCell(j,map[i*dimension+j]);
        column.cells.push(cell);
      }
      field.columns.push(column);
    }
    return field;
  }
}
