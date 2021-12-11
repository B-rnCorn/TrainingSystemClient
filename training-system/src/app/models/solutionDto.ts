import {UserDto} from "./userDto";
import {TaskDto} from "./taskDto";

export class SolutionDto {
  id: number;
  title: string;
  algorithm: string;
  mark: string;
  date: string;
  isSend: boolean;
  user: UserDto;
  task: TaskDto;
}
