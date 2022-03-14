import React from 'react';

import { useEffectOnce } from 'hooks';
import { useAppDispatch } from 'store/hooks';
import * as server from 'store/middlewares/ServerMiddleware';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './Main';
import Guide from './guide/Guide';

function App() {
  const dispatch = useAppDispatch();
  useEffectOnce(() => {
    dispatch(server.openConnection());
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
