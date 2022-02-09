import React from 'react';
import MenuBar from './menu-bar/MenuBar';
import { withTranslation } from 'react-i18next';
import NavigationBar from './navigation-bar/NavigationBar';
import Collapsible from './collapsible/Collapsible';
import InteractiveMapContainer from './map/InteractiveMapContainer';
import Data from './data/Data';
import Step1 from './steps/Step1';
import Step2 from './steps/Step2';

function App({ t }: any) {
  return (
    <div className="App">
      <header className="App-header">
        <MenuBar />
      </header>
      <div className="d-grid" style={{ gridTemplateColumns: '270px auto' }}>
        <aside id="left-aside">
          <NavigationBar>
            <Collapsible title={'Parameters & Settings'} collapsed={false}>
              <Step1 />
            </Collapsible>
            <Collapsible title={'Study area'} collapsed={true}>
              <Step2 />
            </Collapsible>
            {/* <Collapsible
              title={'NBS system type'}
              collapsed={true}
            ></Collapsible>
            <Collapsible
              title={'Objective hierarchy'}
              collapsed={true}
            ></Collapsible> */}
          </NavigationBar>
        </aside>
        <main className="shadow w-100 position-relative" style={{ zIndex: 1 }}>
          <InteractiveMapContainer
            style={{ zIndex: 0 }}
            className="w-100 h-100 position-absolute top-0 left-0"
          />
          <div
            id="safezone"
            className="p-3"
            style={{ marginRight: '270px' }}
          ></div>
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
    </div>
  );
}

export default withTranslation()(App);
