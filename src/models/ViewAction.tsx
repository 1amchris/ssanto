import ViewModel from './ViewModel';

export default interface ViewAction {
  iconName: string;
  label: string;
  action: () => void;
}

export interface ViewActionCallbackProps {
  view: ViewModel;
}
