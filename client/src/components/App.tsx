import React from 'react';
import MenuBar from 'components/menu-bar/MenuBar';
import FormsBar from 'components/forms-bar/FormsBar';
import Collapsible from 'components/collapsible/Collapsible';
import InteractiveMapContainer from 'components/map/InteractiveMapContainer';
import InformationCard from 'components/information-card/InformationCard';
import {
  Parameters,
  StudyArea,
  NbsSystem,
  ObjectiveHierarchy,
} from 'components/analysis';

import { Store } from 'redux';
//import { updateStudyArea } from '../store/reducers/analysis';
import { GeoJSON } from 'geojson';
import ObjectiveHierarchy2 from './analysis/ObjectiveHierarchy';
import DataImportation from './analysis/DataImportation';
import { useEffectOnce } from 'hooks';
import SocketMenu from 'components/analysis/SocketMenu';
import InteractiveMapDemo from 'components/analysis/InteractiveMapDemo';
import { useAppDispatch } from 'store/hooks';
import * as server from 'store/middlewares/ServerMiddleware';
import { addGeoFile } from 'store/reducers/analysis';

function App() {
  const dispatch = useAppDispatch();
  useEffectOnce(() => {
    dispatch(server.openConnection());
  });

  return (
    <div style={{ overflowY: 'clip' }}>
      <header>
        <MenuBar />
      </header>
      <div className="d-grid" style={{ gridTemplateColumns: '270px auto' }}>
        <aside id="left-aside">
          <FormsBar>
            <Collapsible title={'socket menu'} collapsed>
              <SocketMenu />
            </Collapsible>
            <Collapsible title={'interactive map'} collapsed>
              <InteractiveMapDemo />
            </Collapsible>
            <Collapsible title={'analysis parameters'} collapsed>
              <Parameters />
            </Collapsible>
            <Collapsible title={'study area'} collapsed>
              <StudyArea />
            </Collapsible>
            <Collapsible title={'NBS system type'} collapsed>
              <NbsSystem />
            </Collapsible>
            <Collapsible title={'data importation'} collapsed>
              <DataImportation />
            </Collapsible>
            <Collapsible title={'objective hierarchy'}>
              <ObjectiveHierarchy />
            </Collapsible>
          </FormsBar>
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
              <InformationCard key={`data-${index}`}>
                <Collapsible title={title}>
                  <p style={{ textAlign: 'justify', textIndent: '2rem' }}>
                    **Chart**
                  </p>
                  <p style={{ textAlign: 'justify', textIndent: '2rem' }}>
                    **Export button**
                  </p>
                </Collapsible>
              </InformationCard>
            ))}
          </aside>
        </main>
      </div>
    </div>
  );
}

export default App;
