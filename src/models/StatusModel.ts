export interface IStatusModel {
  id: string;
  label: string;
  iconName: string;
  description: string;
}

export class StatusModel implements IStatusModel {
  readonly id: string;
  readonly label: string;
  readonly iconName: string;
  readonly description: string;

  constructor(
    id: string,
    label: string,
    iconName: string,
    description: string
  ) {
    this.id = id;
    this.label = label;
    this.iconName = iconName;
    this.description = description;
  }
}
