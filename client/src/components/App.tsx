import React from 'react';
import { useEffectOnce } from 'hooks';
import { useAppDispatch } from 'store/hooks';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './Main';
import Guide from './guide/Guide';
import { subscribe, openConnection } from 'store/reducers/server';
import { injectReceivePropertiesCreator } from 'store/reducers/analysis';
import SubscriptionModel from 'models/server-coms/SubscriptionModel';

function App() {
  const dispatch = useAppDispatch();
  useEffectOnce(() => {
    dispatch(openConnection());
    dispatch(
      subscribe({
        subject: 'file_manager.files',
        onAction: injectReceivePropertiesCreator('files'),
      } as SubscriptionModel<string, any>)
    );
    dispatch(
      subscribe({
        subject: 'parameters',
        onAction: injectReceivePropertiesCreator('parameters'),
      } as SubscriptionModel<string, any>)
    );
    dispatch(
      subscribe({
        subject: 'nbs_system',
        onAction: injectReceivePropertiesCreator('nbs_system'),
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
