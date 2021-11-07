import { Injectable } from '@angular/core';
import { API } from "../constants/API";
import { CONSTANTS } from "../constants/utils";

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {

  constructor() { }

  API = API;
  CONST = CONSTANTS;
}
