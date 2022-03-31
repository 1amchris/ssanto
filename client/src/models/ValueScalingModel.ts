import DatasetModel from 'models/DatasetModel';

export default interface ValueScalingModel {
  attributeIndex: number;
  attribute: string;
  dataset: DatasetModel;
  primaryIndex: number;
  secondaryIndex: number;
}
