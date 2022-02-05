export default interface MenuItemModel {
  name: string;
  enabled: boolean;
  action: (event: any) => null;
}
