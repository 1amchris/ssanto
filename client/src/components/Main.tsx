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
import { selectMap } from 'store/reducers/map';

function Main() {
  const analysis = useAppSelector(selectAnalysis);
  const { cursor } = useAppSelector(selectMap);
  const ohIsLoading = analysis.properties.objectivesLoading;

  function parametersIsValid() {
    return (
      analysis.properties.parameters.analysis_name?.length > 0 &&
      analysis.properties.parameters.modeler_name?.length > 0 &&
      analysis.properties.parameters.cell_size > 0 &&
      (!analysis.properties.parametersError ||
        analysis.properties.parametersError.length === 0) &&
      !analysis.properties.parametersLoading
    );
  }

  function studyAreaIsEnabled() {
    return parametersIsValid();
  }

  function studyAreaIsValid() {
    return (
      analysis.properties.studyArea.fileName?.length > 0 &&
      analysis.properties.studyArea.area &&
      (!analysis.properties.studyAreaError ||
        analysis.properties.studyAreaError.length === 0) &&
      !analysis.properties.studyAreaLoading
    );
  }

  function systemTypeIsEnabled() {
    return parametersIsValid() && studyAreaIsValid();
  }

  function systemTypeIsValid() {
    return (
      analysis.properties.nbs_system &&
      (!analysis.properties.nbsSystemError ||
        analysis.properties.nbsSystemError.length === 0) &&
      !analysis.properties.nbsSystemLoading
    );
  }

  function objectiveHierarchyIsEnabled() {
    return parametersIsValid() && studyAreaIsValid() && systemTypeIsValid();
  }

  function objectiveHierarchyIsValid() {
    return (
      analysis.properties.objectives &&
      (!analysis.properties.objectivesError ||
        analysis.properties.objectivesError.length === 0) &&
      !analysis.properties.objectivesLoading
    );
  }

  function weightsAreEnabled() {
    return (
      parametersIsValid() &&
      studyAreaIsValid() &&
      systemTypeIsValid() &&
      objectiveHierarchyIsValid()
    );
  }

  function valueScalingIsEnabled() {
    return (
      parametersIsValid() &&
      studyAreaIsValid() &&
      systemTypeIsValid() &&
      objectiveHierarchyIsValid()
    );
  }

  return (
    <div style={{ overflowY: 'clip' }}>
      <header>
        <MenuBar />
      </header>
      <div className="d-grid" style={{ gridTemplateColumns: '270px auto' }}>
        <aside id="left-aside">
          <FormsBar>
            <Collapsible title={'file explorer'} collapsed>
              <FileExplorer />
            </Collapsible>
            <Collapsible title={'parameters'}>
              <Parameters />
            </Collapsible>
            <Collapsible title={'study area'} disabled={!studyAreaIsEnabled()}>
              <StudyArea disabled={!studyAreaIsEnabled()} />
            </Collapsible>
            <Collapsible
              title={'system type'}
              disabled={!systemTypeIsEnabled()}
            >
              <NbsSystem disabled={!systemTypeIsEnabled()} />
            </Collapsible>
            <Collapsible
              title={'objective hierarchy'}
              disabled={!objectiveHierarchyIsEnabled()}
            >
              <ObjectiveHierarchy
                key={'oh' + ohIsLoading}
                disabled={!objectiveHierarchyIsEnabled()}
              />
            </Collapsible>
            <Collapsible
              title={'objectives weighting'}
              disabled={!weightsAreEnabled()}
            >
              <Weighting
                key={'weighting' + ohIsLoading}
                disabled={!weightsAreEnabled()}
              />
            </Collapsible>
            <Collapsible
              title={'value scaling'}
              disabled={!valueScalingIsEnabled()}
            >
              <ValueScaling
                key={'value_scaling' + ohIsLoading}
                disabled={!valueScalingIsEnabled()}
              />
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
            {/*cursor && (
              <InformationCard>
                <Collapsible title={'Map informations'}>
                  <MapCursorInformation />
                </Collapsible>
              </InformationCard>
            )*/}
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
