import { useEffectOnce } from 'hooks';
import { useAppDispatch } from 'store/hooks';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from 'components/Main';
import Guide from 'components/guide/Guide';
import { subscribe, openConnection } from 'store/reducers/server';
import { injectReceivePropertiesCreator } from 'store/reducers/analysis';
import SubscriptionModel from 'models/server-coms/SubscriptionModel';
import {
  updateCursor,
  updateCursorInformations,
  updateSuitabilityAboveThreshold,
  updateSuitabilityCategories,
  updateSuitabilityThreshold,
} from 'store/reducers/map';
import { MapCursorInformationsModel } from 'models/map/MapCursorInformationsModel';
import { LatLong } from 'models/map/LatLong';
import ServerSubscriptionTargets from 'enums/ServerSubscriptionTargets';
import SuitabilityCategoriesModel from 'models/map/SuitabilityCategoriesModel';

function App() {
  const dispatch = useAppDispatch();
  useEffectOnce(() => {
    dispatch(openConnection());
    dispatch(
      subscribe({
        subject: ServerSubscriptionTargets.FileManagerFiles,
        onAction: injectReceivePropertiesCreator('files'),
      } as SubscriptionModel<string, string>)
    );

    dispatch(
      subscribe({
        subject: ServerSubscriptionTargets.FileManagerShapefiles,
        onAction: injectReceivePropertiesCreator('shapefiles'),
      } as SubscriptionModel<string, string>)
    );
    dispatch(
      subscribe({
        subject: ServerSubscriptionTargets.MapCursor,
        onAction: updateCursor,
      } as SubscriptionModel<LatLong>)
    );
    dispatch(
      subscribe({
        subject: ServerSubscriptionTargets.MapCursorInformations,
        onAction: updateCursorInformations,
      } as SubscriptionModel<MapCursorInformationsModel>)
    );
    dispatch(
      subscribe({
        subject: ServerSubscriptionTargets.AnalysisParameters,
        onAction: injectReceivePropertiesCreator('parameters'),
      } as SubscriptionModel<string, string>)
    );
    dispatch(
      subscribe({
        subject: ServerSubscriptionTargets.AnalysisNbsSystem,
        onAction: injectReceivePropertiesCreator('nbs_system'),
      } as SubscriptionModel<string, string>)
    );
    dispatch(
      subscribe({
        subject: ServerSubscriptionTargets.AnalysisObjectives,
        onAction: injectReceivePropertiesCreator('objectives'),
      } as SubscriptionModel<string, string>)
    );
    dispatch(
      subscribe({
        subject:
          ServerSubscriptionTargets.AnalysisGraphSuitabilityAboveThreshold,
        onAction: updateSuitabilityAboveThreshold,
      } as SubscriptionModel<number>)
    );
    dispatch(
      subscribe({
        subject: ServerSubscriptionTargets.AnalysisGraphSuitabilityThreshold,
        onAction: updateSuitabilityThreshold,
      } as SubscriptionModel<number>)
    );
    dispatch(
      subscribe({
        subject: ServerSubscriptionTargets.AnalysisGraphSuitabilityCategories,
        onAction: updateSuitabilityCategories,
      } as SubscriptionModel<SuitabilityCategoriesModel>)
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
