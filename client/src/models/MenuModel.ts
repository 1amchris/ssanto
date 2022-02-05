import MenuItemModel from './MenuItemModel';

export default interface MenuModel {
  name: string;
  enabled: boolean;
  options: MenuItemModel[][];
}
