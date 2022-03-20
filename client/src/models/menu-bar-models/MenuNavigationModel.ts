import MenuItemModel from './MenuItemModel';

export default interface MenuNavigationModel extends MenuItemModel {
  type: 'navigation';
  target: string;
}
