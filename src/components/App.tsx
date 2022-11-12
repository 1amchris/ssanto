import React from 'react';
import { useEffectOnce } from 'hooks/useEffectOnce';
import { useAppDispatch } from 'store/hooks';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Main from 'components/Main';
import Guide from 'components/guide/Guide';
import { subscribe, openConnection } from 'store/reducers/server';
import ServerSubscriptionTarget from 'enums/ServerSubscriptionTarget';
import { setWorkspace } from 'store/reducers/files';
import { setLogs } from 'store/reducers/logger';
import { setToasts } from 'store/reducers/toaster';
import { setTasks } from 'store/reducers/tasker';
import {
  setEditorViews,
  setActiveEditorViews,
  setPanelViews,
  setActivePanelView,
  setSidebarViews,
  setActiveSidebarView,
} from 'store/reducers/viewer';
import { filterBlobs } from 'store/reducers/blobber';

/**
 * App component.
 * It initialise the page and the subscribers.
 * @return {JSX.Element} Html.
 */
function App() {
  const dispatch = useAppDispatch();
  useEffectOnce(() => {
    dispatch(openConnection());
    [
      {
        subject: ServerSubscriptionTarget.BlobberObjectIds,
        onAction: filterBlobs,
      },
      {
        subject: ServerSubscriptionTarget.LoggerLogs,
        onAction: setLogs,
      },
      {
        subject: ServerSubscriptionTarget.TaskerTasks,
        onAction: setTasks,
      },
      {
        subject: ServerSubscriptionTarget.ToasterToasts,
        onAction: setToasts,
      },
      {
        subject: ServerSubscriptionTarget.WorkspaceFiles,
        onAction: setWorkspace,
      },
      {
        subject: ServerSubscriptionTarget.WorkspaceViewsEditorViews,
        onAction: setEditorViews,
      },
      {
        subject: ServerSubscriptionTarget.WorkspaceViewsActiveEditorViews,
        onAction: setActiveEditorViews,
      },
      {
        subject: ServerSubscriptionTarget.WorkspaceViewsPanelViews,
        onAction: setPanelViews,
      },
      {
        subject: ServerSubscriptionTarget.WorkspaceViewsActivePanelView,
        onAction: setActivePanelView,
      },
      {
        subject: ServerSubscriptionTarget.WorkspaceViewsSidebarViews,
        onAction: setSidebarViews,
      },
      {
        subject: ServerSubscriptionTarget.WorkspaceViewsActiveSidebarView,
        onAction: setActiveSidebarView,
      },
    ].forEach(subscription => dispatch(subscribe(subscription)));
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
