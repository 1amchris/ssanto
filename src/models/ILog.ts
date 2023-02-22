import { LogType } from 'enums/LogType';

export default interface ILog {
  message: string;
  type: LogType;
  time: number; // UTC date
}
