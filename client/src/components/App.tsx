import { useEffectOnce } from 'hooks';
import { useAppDispatch } from 'store/hooks';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from 'components/Main';
import Guide from 'components/guide/Guide';
import { subscribe, openConnection } from 'store/reducers/server';
import { injectReceivePropertiesCreator } from 'store/reducers/analysis';
import SubscriptionModel from 'models/server-coms/SubscriptionModel';
import {
  LatLong,
  MapCursorInformations,
  updateCursor,
  updateCursorInformations,
} from 'store/reducers/map';
import ServerSubscriptionTargets from 'enums/ServerSubscriptionTargets';

function App() {
  const dispatch = useAppDispatch();
  useEffectOnce(() => {
    dispatch(openConnection());
    dispatch(
      subscribe({
        subject: ServerSubscriptionTargets.FileManagerFiles,
        onAction: injectReceivePropertiesCreator('files'),
      } as SubscriptionModel<string, any>)
    );
    dispatch(
      subscribe({
        subject: ServerSubscriptionTargets.MapCursor,
        onAction: updateCursor,
      } as SubscriptionModel<LatLong, void>)
    );
    dispatch(
      subscribe({
        subject: ServerSubscriptionTargets.MapCursorInformations,
        onAction: updateCursorInformations,
      } as SubscriptionModel<MapCursorInformations, void>)
    );
    dispatch(
      subscribe({
        subject: ServerSubscriptionTargets.AnalysisParameters,
        onAction: injectReceivePropertiesCreator('parameters'),
      } as SubscriptionModel<string, any>)
    );
    dispatch(
      subscribe({
        subject: ServerSubscriptionTargets.AnalysisNbsSystem,
        onAction: injectReceivePropertiesCreator('nbs_system'),
      } as SubscriptionModel<string, any>)
    );
    dispatch(
      subscribe({
        subject: ServerSubscriptionTargets.AnalysisObjectives,
        onAction: injectReceivePropertiesCreator('objectives'),
      } as SubscriptionModel<string, any>)
    );
    dispatch(
      subscribe({
        subject: ServerSubscriptionTargets.AnalysisValueScaling,
        onAction: injectReceivePropertiesCreator('value_scaling'),
      } as SubscriptionModel<string, any>)
    );
  });

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/guide" element={<Guide />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
