import ViewModel from 'models/ViewModel';

export default interface ViewGroupModel {
  uri: string;
  active: string[];
  views: ViewModel[];
}
