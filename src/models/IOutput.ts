import { OutputType } from 'enums/OutputType';

export default interface IOutput {
  message: string;
  type: OutputType;
  time: number; // UTC date
}
