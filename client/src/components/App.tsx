import React from 'react';
import { Counter } from './Counter';

import i18n from 'i18next';
import { withTranslation, initReactI18next, Trans } from 'react-i18next';

import * as en from '../locales/en.json';
import * as fr from '../locales/fr.json';

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: { en, fr },
    lng: 'en', // if you're using a language detector, do not define the lng option
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

function App({ t }: any) {
  const file = 'src/App.tsx';

  return (
    <div className="App">
      <header className="App-header">
        <h2>{t('welcome-message')}</h2>
        <Counter />
        <p>
          <Trans i18nKey="edit-and-save-to-reload" file={file}>
            Edit <code>{{ file }}</code> and save to reload.
          </Trans>
        </p>
      </header>
    </div>
  );
}

export default withTranslation()(App);
