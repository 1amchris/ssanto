import IMainHierarchy from 'models/IMainHierarchy';
import IMainObjective from 'models/IMainObjective';

export default interface IObjectiveHierarchy {
  main: IMainObjective;
  needs: IMainHierarchy;
  opportunities: IMainHierarchy;
}
