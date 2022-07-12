import IHierarchyAggregation from 'models/IHierarchyAggregation';
import ISecondaryHierarchy from 'models/ISecondaryHierarchy';

export default interface IPrimaryHierarchy {
  name: string;
  weight: number;
  aggregation: IHierarchyAggregation;
  secondaries: ISecondaryHierarchy[];
}
