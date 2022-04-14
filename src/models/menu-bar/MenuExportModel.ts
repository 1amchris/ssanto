import MenuItemModel from './MenuItemModel';

export default interface MenuExportModel extends MenuItemModel {
  type: 'export';
  getExportedFile: () => File;
}
