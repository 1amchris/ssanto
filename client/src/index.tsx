import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { store } from './store/store';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Guide from './components/Guide';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import * as en from './locales/en.json';
import * as fr from './locales/fr.json';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Leaflet
import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/leaflet.js';

import Client from './client_socket';

i18n.use(initReactI18next).init({
  resources: { en, fr },
  lng: 'en', // if you're using a language detector, do not define the lng option
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // done by default by react
  },
});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/guide" element={<Guide />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

const c = new Client();

setTimeout(() => {
            
    c.open();
    
    c.subscribe('myVar', (data: any) => {
        console.log("`myVar` value is " + data);
    });
    
    c.callf('function');
    c.callm('a_class', 'method');
    
}, 1000);
