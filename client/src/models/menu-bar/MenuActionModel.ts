import MenuItemModel from './MenuItemModel';

export default interface MenuActionModel extends MenuItemModel {
  type: 'action';
  onActionCalled: (event: any) => void;
}
