import IAttribute from 'models/IAttribute';
import IHierarchyAggregation from 'models/IHierarchyAggregation';

export default interface ISecondaryHierarchy {
  name: string;
  weight: number;
  aggregation: IHierarchyAggregation;
  attributes: IAttribute[];
}
