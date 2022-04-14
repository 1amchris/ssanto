export default interface ShapefileModel {
  name: string;
  stem: string;
  extension: string;
  column_names: string[];
  type: string[];
  categories: any;
  max_value: number[];
  min_value: number[];
}

export const DefaultShapefile = {
  name: '',
  stem: '',
  extension: '',
  column_names: [],
  type: [],
  categories: [],
  max_value: [],
  min_value: [],
};
