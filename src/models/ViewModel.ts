export default interface ViewModel {
  source: string;
  uri: string;
  name: string;
  content?: any;
  modified?: boolean;
  configs?: any;
}
