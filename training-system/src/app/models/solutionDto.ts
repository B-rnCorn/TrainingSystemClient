export class SolutionDto {
  id: number;
  title: string;
  algorithm: string;
  mark: string;
  createdDate: Date = new Date();
  isSend: boolean;
}
