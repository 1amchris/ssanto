import TopicModel from './TopicModel';

export default interface CategoryModel {
  name: string;
  label: string;
  topics: TopicModel | TopicModel[];
}
