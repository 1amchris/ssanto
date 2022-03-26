import React from 'react';
import MenuBar from 'components/menu-bar/MenuBar';
import FormsBar from 'components/forms/FormsBar';
import Collapsible from 'components/Collapsible';
import FileExplorer from './analysis/FileExplorer';
import InteractiveMapContainer from 'components/map/InteractiveMapContainer';
import InformationCard from 'components/aside-informations/InformationCard';
import {
  Parameters,
  StudyArea,
  NbsSystem,
  ObjectiveHierarchy,
  Weighting,
  ValueScaling,
} from 'components/analysis';
import { useAppSelector } from 'store/hooks';
import { selectAnalysis } from 'store/reducers/analysis';
import MapCursorInformation from './aside-informations/MapCursorInformation';

function Main() {
  const selector = useAppSelector(selectAnalysis);
  const ohIsLoading = selector.properties.objectivesLoading;
  const valueScalingIsLoading = selector.properties.valueScalingLoading;

  return (
    <div style={{ overflowY: 'clip' }}>
      <header>
        <MenuBar />
      </header>
      <div className="d-grid" style={{ gridTemplateColumns: '270px auto' }}>
        <aside id="left-aside">
          <FormsBar>
            <Collapsible title={'file explorer'}>
              <FileExplorer />
            </Collapsible>
            <Collapsible title={'parameters'} collapsed>
              <Parameters />
            </Collapsible>
            <Collapsible title={'study area'} collapsed>
              <StudyArea />
            </Collapsible>
            <Collapsible title={'system type'} collapsed>
              <NbsSystem />
            </Collapsible>
            <Collapsible title={'objective hierarchy'} collapsed>
              <ObjectiveHierarchy key={'oh' + ohIsLoading} />
            </Collapsible>
            <Collapsible title={'weighting'}>
              <Weighting key={'weighting' + ohIsLoading} collapsed />
            </Collapsible>
            <Collapsible title={'value scaling'}>
              <ValueScaling key={'value_scaling' + valueScalingIsLoading} />
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
            <InformationCard>
              <Collapsible title={'Map informations'}>
                <MapCursorInformation />
              </Collapsible>
            </InformationCard>
            {[
              'Interpolation chart',
              'World population',
              'Vertical bar charts',
              'Economics & politics',
            ].map((title: string, index: number) => (
              <InformationCard key={`data-${index}`}>
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
              </InformationCard>
            ))}
          </aside>
        </main>
      </div>
    </div>
  );
}

export default Main;
