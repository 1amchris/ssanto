import MenuItem from '.';

export default interface MenuModel {
  name: string;
  enabled: boolean;
  options: MenuItem[][];
}
