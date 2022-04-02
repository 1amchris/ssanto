export default interface ShapefileModel {
  name: string;
  id: string;
  stem: string;
  extension: string;
  column_names: string[];
  type: string[];
  categories: any;
  max_value: number[];
  min_value: number[];
}