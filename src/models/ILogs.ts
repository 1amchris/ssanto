import { LogType } from 'enums/LogType';
import ILog from './ILog';

type ILogsModel = {
  // eslint-disable-next-line no-unused-vars
  [key in LogType]?: ILog[];
};

export default ILogsModel;
