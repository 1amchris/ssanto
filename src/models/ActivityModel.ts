import { Activity as Activity } from 'enums/Activity';

export interface IActivityModel {
  id: Activity;
  label: string;
  iconName: string;
}

export class ActivityModel implements IActivityModel {
  readonly id: Activity;
  readonly label: string;
  readonly iconName: string;

  constructor(id: Activity, label: string, iconName: string) {
    this.id = id;
    this.label = label;
    this.iconName = iconName;
  }
}
