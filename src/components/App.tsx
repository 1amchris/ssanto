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
        subject: ServerSubscriptionTarget.WorkspaceFiles,
        onAction: setWorkspace,
      })
    );

    dispatch(
      subscribe({
        subject: ServerSubscriptionTarget.LoggerLogs,
        onAction: setLogs,
      })
    );

    dispatch(
      subscribe({
        subject: ServerSubscriptionTarget.ToasterToasts,
        onAction: setToasts,
      })
    );

    dispatch(
      subscribe({
        subject: ServerSubscriptionTarget.TaskerTasks,
        onAction: setTasks,
      })
    );

    dispatch(
      subscribe({
        subject: ServerSubscriptionTarget.WorkspaceViewsEditorViews,
        onAction: setEditorViews,
      })
    );
    dispatch(
      subscribe({
        subject: ServerSubscriptionTarget.WorkspaceViewsActiveEditorViews,
        onAction: setActiveEditorViews,
      })
    );

    dispatch(
      subscribe({
        subject: ServerSubscriptionTarget.WorkspaceViewsPanelViews,
        onAction: setPanelViews,
      })
    );
    dispatch(
      subscribe({
        subject: ServerSubscriptionTarget.WorkspaceViewsActivePanelView,
        onAction: setActivePanelView,
      })
    );

    dispatch(
      subscribe({
        subject: ServerSubscriptionTarget.WorkspaceViewsSidebarViews,
        onAction: setSidebarViews,
      })
    );
    dispatch(
      subscribe({
        subject: ServerSubscriptionTarget.WorkspaceViewsActiveSidebarView,
        onAction: setActiveSidebarView,
      })
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
