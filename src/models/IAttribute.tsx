import IValueScaling from 'models/IValueScaling';

export default interface IAttribute {
  name: string;
  dataset: string;
  weight: number;
  scale: IValueScaling;
}
