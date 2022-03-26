export default interface ValueScalingModel {
  attribute: string;
  dataset: { name: string; id: string };
  type: string;
  properties: {
    min: number;
    max: number;
    vs_function: string;
    distribution: string[];
    distribution_value: number[];
  };
  primary: string;
  secondary: string;
}
