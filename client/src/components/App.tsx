import { useEffectOnce } from 'hooks';
import { useAppDispatch } from 'store/hooks';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from 'components/Main';
import Guide from 'components/guide/Guide';
import { subscribe, openConnection } from 'store/reducers/server';
import {
  analysisSuccess,
  injectReceivePropertiesCreator,
} from 'store/reducers/analysis';
import SubscriptionModel from 'models/server-coms/SubscriptionModel';
import {
  updateCursor,
  updateCursorInformations,
  updateSuitabilityAboveThreshold,
  updateSuitabilityCategories,
  updateSuitabilityThreshold,
  updateLayers,
  updateLocation,
} from 'store/reducers/map';
import { MapCursorInformationsModel } from 'models/map/MapCursorInformationsModel';
import { LatLong } from 'models/map/LatLong';
import SuitabilityCategoriesModel from 'models/map/SuitabilityCategoriesModel';
import ServerSubscriptionTargets from 'enums/ServerSubscriptionTargets';
import { LayersGroups } from 'models/map/Layers';

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
        subject: ServerSubscriptionTargets.Layer,
        onAction: updateLayers,
      } as SubscriptionModel<LayersGroups, void>)
    );
    dispatch(
      subscribe({
        subject: ServerSubscriptionTargets.MapCenter,
        onAction: updateLocation,
      } as SubscriptionModel<LatLong>)
    );
    dispatch(
      subscribe({
        subject: ServerSubscriptionTargets.AnalysisResult,
        onAction: analysisSuccess,
      } as SubscriptionModel<LayersGroups, void>)
    );
    dispatch(
      subscribe({
        subject: ServerSubscriptionTargets.AnalysisParameters,
        onAction: injectReceivePropertiesCreator('parameters'),
      } as SubscriptionModel<string, string>)
    );
    dispatch(
      subscribe({
        subject: ServerSubscriptionTargets.AnalysisStudyArea,
        onAction: injectReceivePropertiesCreator('study_area'),
      } as SubscriptionModel<string, any>)
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

    dispatch(
      subscribe({
        subject: ServerSubscriptionTargets.AnalysisDefaultMissingData,
        onAction: injectReceivePropertiesCreator('default_missing_data'),
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
