import React, { useState } from 'react';
import MenuBar from 'components/menu-bar/MenuBar';
import ActivityBar from 'components/core/ActivityBar';
import SideBar from 'components/core/SideBar';
import StatusBar from 'components/core/StatusBar';
import SplitView from 'components/core/SplitView';
import ToastView from 'components/core/ToastView';
import EditorGroups from 'components/core/EditorGroups';
import PanelBar from 'components/core/PanelBar';
import ViewsRegistry from 'components/ViewsRegistry';
import ViewAction, { ViewActionCallbackProps } from 'models/ViewAction';
import { useAppDispatch } from 'store/hooks';
import ServerCallTarget from 'enums/ServerCallTarget';
import CallModel from 'models/server-coms/CallModel';
import { call } from 'store/reducers/server';

/**
 * Main component.
 * Contains the main app.
 * @return {JSX.Element} Html.
 */
function Main() {
  const dispatch = useAppDispatch();

  const showMap = () => ({
    label: 'Show map',
    iconName: 'VscGlobe',
    action: ({ view }: ViewActionCallbackProps) =>
      dispatch(
        call({
          target: ServerCallTarget.WorkspaceOpenView,
          args: [view.source, 'ssanto-map'],
        } as CallModel)
      ),
  });

  const showSettings = () => ({
    label: 'Show Settings',
    iconName: 'VscSettings',
    action: ({ view }: ViewActionCallbackProps) =>
      dispatch(
        call({
          target: ServerCallTarget.WorkspaceOpenView,
          args: [view.source, 'ssanto-settings'],
        } as CallModel)
      ),
  });

  const showObjectiveHierarchy = () => ({
    label: 'Show Objective Hierarchy Editor',
    iconName: 'VscTypeHierarchy',
    action: ({ view }: ViewActionCallbackProps) =>
      dispatch(
        call({
          target: ServerCallTarget.WorkspaceOpenView,
          args: [view.source, 'ssanto-hierarchy'],
        } as CallModel)
      ),
  });

  const runAnalysis = () => ({
    label: 'Run Analysis',
    iconName: 'VscPlay',
    // style: { color: Color.Primary },
    action: ({ view }: ViewActionCallbackProps) =>
      dispatch(
        call({
          target: ServerCallTarget.WorkspaceViewsPublishEvent,
          args: [view.uri, { ':run': { type: 'analysis' } }],
        } as CallModel)
      ),
  });

  const [factories, setFactories] = useState({
    ['file-explorer']: {
      actions: [
        {
          label: 'New File',
          iconName: 'VscNewFile',
          action: () => console.log('[Explorer] New File'),
        },
        {
          label: 'New Folder',
          iconName: 'VscNewFolder',
          action: () => console.log('[Explorer] New Folder'),
        },
        {
          label: 'Refresh explorer',
          iconName: 'VscRefresh',
          action: () => console.log('[Explorer] Refresh explorer'),
        },
        {
          label: 'Collapse folders in explorer',
          iconName: 'VscCollapseAll',
          action: () => console.log('[Explorer] Collapse folders in explorer'),
        },
      ],
      factory: React.lazy(() => import('components/views/core/FileExplorer')),
    },
    ['file-searcher']: {
      actions: [
        {
          label: 'Refresh',
          iconName: 'VscRefresh',
          action: () => console.log('[Searcher] Refresh'),
        },
        {
          label: 'Clear Search Results',
          iconName: 'VscClearAll',
          action: () => console.log('[Searcher] Clear Search Results'),
        },
      ],
      factory: React.lazy(() => import('components/views/core/FileSearcher')),
    },
    ['output']: {
      actions: [
        {
          label: 'Clear Output',
          iconName: 'VscClearAll',
          action: () => console.log('[Output] Clear Output'),
        },
        {
          label: 'Turn Auto Scrolling Off',
          iconName: 'VscUnlock',
          action: () => console.log('[Output] Turn Auto Scrolling Off'),
        },
        {
          label: 'Open Log Output File',
          iconName: 'VscGoToFile',
          action: () => console.log('[Output] Open Log Output File'),
        },
      ],
      factory: React.lazy(() => import('components/views/core/Output')),
    },
    ['problems-explorer']: {
      actions: [
        {
          label: 'Collapse All',
          iconName: 'VscCollapseAll',
          action: () => console.log('[Problems] Collapse All'),
        },
        {
          label: 'View as Table',
          iconName: 'VscListFlat',
          action: () => console.log('[Problems] Turn Auto Scrolling Off'),
        },
      ],
      factory: React.lazy(
        () => import('components/views/core/ProblemsExplorer')
      ),
    },
    ['ssanto-map']: {
      actions: [runAnalysis(), showObjectiveHierarchy(), showSettings()],
      factory: React.lazy(() => import('components/views/ssanto/SSantoMap')),
    },
    ['ssanto-settings']: {
      actions: [showObjectiveHierarchy(), showMap()],
      factory: React.lazy(
        () => import('components/views/ssanto/SSantoSettingsEditor')
      ),
    },
    ['ssanto-hierarchy']: {
      actions: [runAnalysis(), showSettings(), showMap()],
      factory: React.lazy(
        () => import('components/views/ssanto/SSantoHierarchyEditor')
      ),
    },
    ['ssanto-attribute']: {
      actions: [showObjectiveHierarchy(), showSettings(), showMap()],
      factory: React.lazy(
        () => import('components/views/ssanto/SSantoAttributeEditor')
      ),
    },
    ['geojson-map']: {
      actions: [],
      factory: React.lazy(() => import('components/views/core/GeoJsonMap')),
    },
  });

  const value = {
    factories,
    registerFactory: (
      viewType: string,
      factory: (props: any) => React.ReactNode,
      actions: ViewAction[]
    ) => {
      setFactories({ ...factories, [viewType]: { factory, actions } });
    },
  };

  return (
    <ViewsRegistry.Provider value={value}>
      <ToastView />

      <div className="d-flex flex-column" style={{ maxHeight: '100vh' }}>
        <MenuBar style={{ height: '24px' }} />
        <div
          className="d-flex flex-row"
          style={{
            height: 'calc(100vh - 24px - 22px)',
            maxWidth: '100%',
            overflow: 'auto',
          }}
        >
          <ActivityBar />
          <SplitView direction="row">
            <SideBar style={{ minWidth: 200, width: 240 }} />
            <SplitView style={{ minWidth: 120 }} direction="column">
              <EditorGroups />
              <PanelBar style={{ height: '30%', minHeight: '35px' }} />
            </SplitView>
          </SplitView>
        </div>
        <StatusBar style={{ height: '22px' }} />
      </div>
    </ViewsRegistry.Provider>
  );
}

export default Main;
