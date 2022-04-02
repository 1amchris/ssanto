import DatasetModel from 'models/DatasetModel';

export default interface ObjectivesHierarchyModel {
  main: string;
  primaries: {
    primary: string[];
    weights: number[];
    secondaries: {
      secondary: string[];
      weights: number[];
      attributes: {
        attribute: string[];
        weights: number[];
        datasets: DatasetModel[];
      }[];
    }[];
  };
}
