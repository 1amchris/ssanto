export default interface ObjectivesMainModel {
  main: string;
  primaries: {
    primary: String;
    secondaries: {
      secondary: String;
    }[];
  }[];
}

export default interface ObjectiveDataModel {
  mains: ObjectivesMainModel[];
}
