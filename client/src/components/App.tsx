import React from 'react';
import Counter from './Counter';
import MenuBar from './menu-bar/MenuBar';

import i18n from 'i18next';
import { withTranslation, initReactI18next, Trans } from 'react-i18next';

import * as en from '../locales/en.json';
import * as fr from '../locales/fr.json';

i18n.use(initReactI18next).init({
  resources: { en, fr },
  lng: 'en', // if you're using a language detector, do not define the lng option
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // done by default by react
  },
});

function App({ t }: any) {
  const file = 'src/App.tsx';

  return (
    <div className="App">
      <header className="App-header">
        <MenuBar />
      </header>
      <main className="container mt-3">
        <Counter />
      </main>
      <footer className="alert alert-warning">
        <Trans i18nKey="edit-and-save-to-reload" file={file}>
          Edit <code>{{ file }}</code> and save to reload.
        </Trans>
      </footer>
    </div>
  );
}

export default withTranslation()(App);
