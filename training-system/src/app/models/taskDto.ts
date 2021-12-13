import {UserDto} from "./userDto";

export class TaskDto {
  id: number;
  title: string;
  description: string;
  map: string;
  date: string;
  isPublished: boolean;
  author: UserDto;

  constructor(id: number, title: string, description: string, map: string, date: string, isPublished: boolean, author: UserDto) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.map = map;
    this.date = date;
    this.isPublished = isPublished;
    this.author = author;
  }
}
