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
import { selectMap } from 'store/reducers/map';
import MapCursorInformation from 'components/aside-informations/MapCursorInformation';
import MapSuitabilityCategories from 'components/aside-informations/MapSuitabilityCategories';
import MapSuitabilityAboveThreshold from 'components/aside-informations/MapSuitabilityAboveThreshold';
import ValueScalingFunctionGraphs from './aside-informations/ValueScalingFunctionGraphs';
import MapLegend from './aside-informations/MapLegend';
import { flatten } from 'flattenizer';

function Main() {
  const analysis = useAppSelector(selectAnalysis);
  const {
    cursorInformations,
    suitabilityCategories,
    suitabilityAboveThreshold,
  } = useAppSelector(selectMap);
  const objectives = analysis.properties.objectives;
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
      analysis.properties.study_area.length > 0 &&
      (!analysis.properties.study_areaError ||
        analysis.properties.study_areaError.length === 0) &&
      !analysis.properties.study_areaLoading
    );
  }

  function systemTypeIsEnabled() {
    return parametersIsValid() && studyAreaIsValid();
  }

  function systemTypeIsValid() {
    return (
      analysis.properties.nbs_system &&
      (!analysis.properties.nbs_systemError ||
        analysis.properties.nbs_systemError.length === 0) &&
      !analysis.properties.nbs_systemLoading
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
      <div className="d-grid" style={{ gridTemplateColumns: '300px auto' }}>
        <aside id="left-aside">
          <FormsBar>
            <Collapsible
              title={'file explorer'}
              guideHash="analysis/file-explorer"
              collapsed
            >
              <FileExplorer />
            </Collapsible>
            <Collapsible title={'parameters'} guideHash="analysis/parameters">
              <Parameters />
            </Collapsible>
            <Collapsible
              title={'study area'}
              guideHash="analysis/study-area"
              disabled={!studyAreaIsEnabled()}
            >
              <StudyArea disabled={!studyAreaIsEnabled()} />
            </Collapsible>
            <Collapsible
              title={'system type'}
              guideHash="analysis/nbs-system"
              disabled={!systemTypeIsEnabled()}
            >
              <NbsSystem disabled={!systemTypeIsEnabled()} />
            </Collapsible>
            <Collapsible
              title={'objective hierarchy'}
              guideHash="analysis/objectives-hierarchy"
              disabled={!objectiveHierarchyIsEnabled()}
            >
              <ObjectiveHierarchy
                key={JSON.stringify(objectives)}
                disabled={!objectiveHierarchyIsEnabled()}
              />
            </Collapsible>
            <Collapsible
              title={'objectives weighting'}
              disabled={!weightsAreEnabled()}
              guideHash="analysis/weighting"
            >
              <Weighting
                key={`${ohIsLoading}`}
                disabled={!weightsAreEnabled()}
              />
            </Collapsible>
            <Collapsible
              title={'value scaling'}
              guideHash="analysis/value-scaling"
              disabled={!valueScalingIsEnabled()}
            >
              <ValueScaling
                key={`${ohIsLoading}`}
                disabled={!valueScalingIsEnabled()}
              />
            </Collapsible>
          </FormsBar>
        </aside>
        <main className="shadow w-100 position-relative" style={{ zIndex: 1 }}>
          <InteractiveMapContainer
            id="map"
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
              <Collapsible title={'Suitability'}>
                <MapLegend />
              </Collapsible>
            </InformationCard>
            {Object.keys(flatten(analysis.properties.objectives)!).filter(key =>
              /\.properties\.distribution_value\.\d+/.test(key)
            ).length > 0 && (
              <InformationCard>
                <Collapsible title={'value scales'}>
                  <ValueScalingFunctionGraphs />
                </Collapsible>
              </InformationCard>
            )}
            {cursorInformations?.objectives &&
              Object.keys(cursorInformations.objectives).length > 0 && (
                <InformationCard>
                  <Collapsible title={'cursor informations'}>
                    <MapCursorInformation />
                  </Collapsible>
                </InformationCard>
              )}
            {suitabilityAboveThreshold && (
              <InformationCard>
                <Collapsible title={'% of suitability above threshold'}>
                  <MapSuitabilityAboveThreshold />
                </Collapsible>
              </InformationCard>
            )}
            {suitabilityCategories && (
              <InformationCard>
                <Collapsible title={'suitability ranges'}>
                  <MapSuitabilityCategories />
                </Collapsible>
              </InformationCard>
            )}
          </aside>
        </main>
      </div>
    </div>
  );
}

export default Main;
