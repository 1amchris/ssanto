import MenuItem from './menu-item-models';

export default interface MenuModel {
  name: string;
  enabled: boolean;
  options: MenuItem[][];
}
