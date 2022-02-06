import MenuItemModel from './MenuItemModel';

export default interface MenuImportModel extends MenuItemModel {
  type: 'import';
  acceptedExtensions: string;
  onFileImported: (file: File) => void;
}
