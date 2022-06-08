import { LogType } from 'enums/LogType';

export default interface ICreateOutput {
  type: LogType;
  message: string;
}
