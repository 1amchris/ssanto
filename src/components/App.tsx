import React from 'react';
import { useEffectOnce } from 'hooks/useEffectOnce';
import { useAppDispatch } from 'store/hooks';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Main from 'components/Main';
import Guide from 'components/guide/Guide';
import { subscribe, openConnection } from 'store/reducers/server';
import {
  analysisSuccess,
  injectReceivePropertiesCreator,
  subAnalysisSuccess,
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
import ServerSubscriptionTarget from 'enums/ServerSubscriptionTarget';
import { LayersGroups } from 'models/map/Layers';
import { setWorkspace } from 'store/reducers/files';
import { setLogs } from 'store/reducers/logger';
import {
  setEditorViews,
  setActiveEditorViews,
  setPanelViews,
  setActivePanelView,
  setSidebarViews,
  setActiveSidebarView,
} from 'store/reducers/views-manager';

/**
 * App component.
 * It initialise the page and the subscribers.
 * @return {JSX.Element} Html.
 */
function App() {
  const dispatch = useAppDispatch();
  useEffectOnce(() => {
    dispatch(openConnection());
    dispatch(
      subscribe({
        subject: ServerSubscriptionTarget.FileManagerFiles,
        onAction: setWorkspace,
      })
    );

    dispatch(
      subscribe({
        subject: ServerSubscriptionTarget.LogsManagerLogs,
        onAction: setLogs,
      })
    );

    dispatch(
      subscribe({
        subject: ServerSubscriptionTarget.ViewsManagerEditorViews,
        onAction: setEditorViews,
      })
    );
    dispatch(
      subscribe({
        subject: ServerSubscriptionTarget.ViewsManagerActiveEditorViews,
        onAction: setActiveEditorViews,
      })
    );

    dispatch(
      subscribe({
        subject: ServerSubscriptionTarget.ViewsManagerPanelViews,
        onAction: setPanelViews,
      })
    );
    dispatch(
      subscribe({
        subject: ServerSubscriptionTarget.ViewsManagerActivePanelView,
        onAction: setActivePanelView,
      })
    );

    dispatch(
      subscribe({
        subject: ServerSubscriptionTarget.ViewsManagerSidebarViews,
        onAction: setSidebarViews,
      })
    );
    dispatch(
      subscribe({
        subject: ServerSubscriptionTarget.ViewsManagerActiveSidebarView,
        onAction: setActiveSidebarView,
      })
    );

    dispatch(
      subscribe({
        subject: ServerSubscriptionTarget.FileManagerShapefiles,
        onAction: injectReceivePropertiesCreator('shapefiles'),
      } as SubscriptionModel<string, string>)
    );

    dispatch(
      subscribe({
        subject: ServerSubscriptionTarget.MapCursor,
        onAction: updateCursor,
      } as SubscriptionModel<LatLong>)
    );
    dispatch(
      subscribe({
        subject: ServerSubscriptionTarget.MapCursorInformations,
        onAction: updateCursorInformations,
      } as SubscriptionModel<MapCursorInformationsModel>)
    );
    dispatch(
      subscribe({
        subject: ServerSubscriptionTarget.Layer,
        onAction: updateLayers,
      } as SubscriptionModel<LayersGroups, void>)
    );
    dispatch(
      subscribe({
        subject: ServerSubscriptionTarget.MapCenter,
        onAction: updateLocation,
      } as SubscriptionModel<LatLong>)
    );
    dispatch(
      subscribe({
        subject: ServerSubscriptionTarget.AnalysisResult,
        onAction: analysisSuccess,
      } as SubscriptionModel<LayersGroups, void>)
    );

    dispatch(
      subscribe({
        subject: ServerSubscriptionTarget.SubAnalysisResult,
        onAction: subAnalysisSuccess,
      } as SubscriptionModel<LayersGroups[], void>)
    );

    dispatch(
      subscribe({
        subject: ServerSubscriptionTarget.AnalysisParameters,
        onAction: injectReceivePropertiesCreator('parameters'),
      } as SubscriptionModel<string, string>)
    );
    dispatch(
      subscribe({
        subject: ServerSubscriptionTarget.AnalysisStudyArea,
        onAction: injectReceivePropertiesCreator('study_area'),
      } as SubscriptionModel<string, any>)
    );
    dispatch(
      subscribe({
        subject: ServerSubscriptionTarget.AnalysisNbsSystem,
        onAction: injectReceivePropertiesCreator('nbs_system'),
      } as SubscriptionModel<string, string>)
    );
    dispatch(
      subscribe({
        subject: ServerSubscriptionTarget.AnalysisObjectivesData,
        onAction: injectReceivePropertiesCreator('objectives_data'),
      } as SubscriptionModel<string, string>)
    );
    dispatch(
      subscribe({
        subject: ServerSubscriptionTarget.AnalysisObjectives,
        onAction: injectReceivePropertiesCreator('objectives'),
      } as SubscriptionModel<string, string>)
    );
    dispatch(
      subscribe({
        subject:
          ServerSubscriptionTarget.AnalysisGraphSuitabilityAboveThreshold,
        onAction: updateSuitabilityAboveThreshold,
      } as SubscriptionModel<number>)
    );
    dispatch(
      subscribe({
        subject: ServerSubscriptionTarget.AnalysisGraphSuitabilityThreshold,
        onAction: updateSuitabilityThreshold,
      } as SubscriptionModel<number>)
    );
    dispatch(
      subscribe({
        subject: ServerSubscriptionTarget.AnalysisGraphSuitabilityCategories,
        onAction: updateSuitabilityCategories,
      } as SubscriptionModel<SuitabilityCategoriesModel>)
    );
  });

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/guide" element={<Guide />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
