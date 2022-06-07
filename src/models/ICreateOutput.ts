import { OutputType } from 'enums/OutputType';

export default interface ICreateOutput {
  type: OutputType;
  message: string;
}
