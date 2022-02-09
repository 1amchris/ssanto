import React from 'react';
import Counter from './Counter';
import MenuBar from './menu-bar/MenuBar';
import { withTranslation, Trans } from 'react-i18next';
import NavigationBar from './navigation-bar/NavigationBar';
import Collapsible from './collapsible/Collapsible';
import Data from './data/Data';

function App({ t }: any) {
  // const file = 'src/App.tsx';

  return (
    <div className="App">
      <header className="App-header">
        <MenuBar />
      </header>
      <div className="d-grid" style={{ gridTemplateColumns: '270px auto' }}>
        <aside id="left-aside">
          <NavigationBar>
            <Collapsible title={'Parameters & Settings'}>
              <p style={{ textAlign: 'justify', textIndent: '2rem' }}>
                Anim pariatur cliche reprehenderit, enim eiusmod high life
                accusamus terry richardson ad squid. 3 wolf moon officia aute,
                non cupidatat skateboard dolor brunch. Food truck quinoa
                nesciunt laborum eiusmod.
              </p>
              <p style={{ textAlign: 'justify', textIndent: '2rem' }}>
                Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid
                single-origin coffee nulla assumenda shoreditch et. Nihil anim
                keffiyeh helvetica, craft beer labore wes anderson cred nesciunt
                sapiente ea proident. Ad vegan excepteur butcher vice lomo.
                Leggings occaecat craft beer farm-to-table, raw denim aesthetic
                synth nesciunt you probably haven't heard of them accusamus
                labore sustainable VHS.
              </p>
            </Collapsible>
            <Collapsible title={'Study area'}>
              <div className="mb-3">
                <label className="form-label">Default file input example</label>
                <input className="form-control" type="file" id="formFile" />
              </div>
              <p style={{ textAlign: 'justify', textIndent: '2rem' }}>
                Anim pariatur cliche reprehenderit, enim eiusmod high life
                accusamus terry richardson ad squid. 3 wolf moon officia aute,
                non cupidatat skateboard dolor brunch. Food truck quinoa
                nesciunt laborum eiusmod.
              </p>
            </Collapsible>
            <Collapsible title={'NBS system type'}>
              <p style={{ textAlign: 'justify', textIndent: '2rem' }}>
                Anim pariatur cliche reprehenderit, enim eiusmod high life
                accusamus terry richardson ad squid. 3 wolf moon officia aute,
                non cupidatat skateboard dolor brunch. Food truck quinoa
                nesciunt laborum eiusmod.
              </p>
            </Collapsible>
            <Collapsible title={'Objective hierarchy'}>
              <p style={{ textAlign: 'justify', textIndent: '2rem' }}>
                Anim pariatur cliche reprehenderit, enim eiusmod high life
                accusamus terry richardson ad squid. 3 wolf moon officia aute,
                non cupidatat skateboard dolor brunch. Food truck quinoa
                nesciunt laborum eiusmod.
              </p>
              <p style={{ textAlign: 'justify', textIndent: '2rem' }}>
                Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid
                single-origin coffee nulla assumenda shoreditch et. Nihil anim
                keffiyeh helvetica, craft beer labore wes anderson cred nesciunt
                sapiente ea proident. Ad vegan excepteur butcher vice lomo.
                Leggings occaecat craft beer farm-to-table, raw denim aesthetic
                synth nesciunt you probably haven't heard of them accusamus
                labore sustainable VHS.
              </p>
            </Collapsible>
          </NavigationBar>
        </aside>
        <main
          className="shadow w-100 position-relative"
          style={{ zIndex: 1, backgroundColor: 'lightblue' }}
        >
          <div id="safezone" className="p-3" style={{ marginRight: '270px' }}>
            <Counter />
          </div>
          <aside
            id="right-aside"
            className="position-absolute top-0 end-0 mh-100 py-3 pe-3 overflow-scroll"
            style={{ width: '270px' }}
          >
            {[
              'Interpolation chart',
              'World population',
              'Vertical bar charts',
              'Economics & politics',
            ].map((title: string, index: number) => (
              <Data key={`data-${index}`}>
                <Collapsible title={title}>
                  <p style={{ textAlign: 'justify', textIndent: '2rem' }}>
                    Anim pariatur cliche reprehenderit, enim eiusmod high life
                    accusamus terry richardson ad squid. 3 wolf moon officia
                    aute, non cupidatat skateboard dolor brunch. Food truck
                    quinoa nesciunt laborum eiusmod.
                  </p>
                  <p style={{ textAlign: 'justify', textIndent: '2rem' }}>
                    Brunch 3 wolf moon tempor, sunt aliqua put a bird on it
                    probably haven't heard of them accusamus labore sustainable
                    VHS.
                  </p>
                </Collapsible>
              </Data>
            ))}
          </aside>
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
