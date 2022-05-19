export interface IActivityModel {
  id: string;
  label: string;
  iconName: string;
}

export class ActivityModel implements IActivityModel {
  readonly id: string;
  readonly label: string;
  readonly iconName: string;

  constructor(id: string, label: string, iconName: string) {
    this.id = id;
    this.label = label;
    this.iconName = iconName;
  }
}
