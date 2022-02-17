import React from 'react';
import MenuBar from './menu-bar/MenuBar';
import NavigationBar from './navigation-bar/NavigationBar';
import Collapsible from './collapsible/Collapsible';
import InteractiveMapContainer from './map/InteractiveMapContainer';
import Data from './data/Data';
import {
  Parameters,
  StudyArea,
  NbsSystemType,
  ObjectiveHierarchy,
} from './analysis';
import InterativeMapDemo from './analysis/InteractiveMapDemo';

import ServerCom from '../apis/ServerCom';

let server: ServerCom | undefined = undefined;

function App() {
    if (server == undefined) {
        server = new ServerCom();
        server.open()
        setTimeout(() => {
            console.log("called")
            server!.subscribe('myVar', (data: any) => {
                console.log('`myVar` value is ' + data);
            });

            server!.callFunction('function');
            server!.callMethod('a_class', 'method');
        }, 3000);
    }

  return (
    <div className="App">
      <header className="App-header">
        <MenuBar />
      </header>
      <div className="d-grid" style={{ gridTemplateColumns: '270px auto' }}>
        <aside id="left-aside">
          <NavigationBar>
            {/* <Collapsible title={'interactive map'} collapsed>
              <InterativeMapDemo />
            </Collapsible> */}
            <Collapsible title={'analysis parameters'}>
              <Parameters />
            </Collapsible>
            <Collapsible title={'study area'} collapsed>
              <StudyArea />
            </Collapsible>
            <Collapsible title={'NBS system type'} collapsed>
              <NbsSystemType />
            </Collapsible>
            <Collapsible title={'objective hierarchy'} collapsed>
              <ObjectiveHierarchy />
            </Collapsible>
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

export default App;
