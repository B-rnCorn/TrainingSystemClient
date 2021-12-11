import {UserDto} from "./userDto";

export class TaskDto {
  id: number;
  title: string;
  description: string;
  map: string;
  date: string;
  isPublished: boolean;
  author: UserDto;
}
