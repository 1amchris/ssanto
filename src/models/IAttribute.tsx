import IValueScaling from 'models/IValueScaling';
import IDataset from 'models/IDataset';

export default interface IAttribute {
  name: string;
  dataset: IDataset;
  weight: number;
  scale: IValueScaling;
}
