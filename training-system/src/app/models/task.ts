export class Task {
  title: string;
  description: string;
  map: string;

  constructor(title: string, description: string, map: string) {
    this.title = title;
    this.description = description;
    this.map = map;
  }
}
