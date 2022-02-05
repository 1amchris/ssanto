import React from 'react';
import Counter from './Counter';
import MenuBar from './menu-bar/MenuBar';
import { withTranslation, Trans } from 'react-i18next';
import NavigationBar from './navigation-bar/NavigationBar';

function App({ t }: any) {
  const file = 'src/App.tsx';

  return (
    <div className="App">
      <header className="App-header">
        <MenuBar />
      </header>
      <div className="d-grid" style={{ gridTemplateColumns: '270px auto' }}>
        <aside>
          <NavigationBar>
            <span>field 1</span>
            <span>field 2</span>
            <span>field 3</span>
          </NavigationBar>
        </aside>
        <main className="container mt-3">
          <Counter />
        </main>
      </div>
      {/* <footer className="alert alert-warning">
        <Trans i18nKey="edit-and-save-to-reload" file={file}>
          Edit <code>{{ file }}</code> and save to reload.
        </Trans>
      </footer> */}
    </div>
  );
}

export default withTranslation()(App);
