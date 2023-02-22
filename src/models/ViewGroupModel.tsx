import ViewModel from 'models/ViewModel';

export default interface ViewGroupModel {
  uri: string;
  active: string | undefined;
  views: ViewModel[];
  icon?: string;
  label?: string;
}
