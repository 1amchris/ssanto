import React from 'react';
import MenuBar from 'components/menu-bar/MenuBar';
// import Collapsible from 'components/Collapsible';
// import FormsBar from 'components/forms/FormsBar';
// import FileExplorer from './analysis/FileExplorer';
// import {
//   Parameters,
//   StudyArea,
//   NbsSystem,
//   ObjectiveHierarchy,
//   Weighting,
//   ValueScaling,
// } from 'components/analysis';
// import InteractiveMapContainer from 'components/map/InteractiveMapContainer';
// import InformationCard from 'components/aside-informations/InformationCard';
// import { useAppSelector } from 'store/hooks';
// import { selectAnalysis } from 'store/reducers/analysis';
// import { selectMap } from 'store/reducers/map';
// import MapCursorInformation from 'components/aside-informations/MapCursorInformation';
// import MapSuitabilityCategories from 'components/aside-informations/MapSuitabilityCategories';
// import MapSuitabilityAboveThreshold from 'components/aside-informations/MapSuitabilityAboveThreshold';
// import ValueScalingFunctionGraphs from './aside-informations/ValueScalingFunctionGraphs';
// import MapLegend from './aside-informations/MapLegend';
// import { flatten } from 'flattenizer';
import ActivityBar from 'components/core/ActivityBar';
import SideBar from 'components/core/SideBar';
import StatusBar from 'components/core/StatusBar';
import SplitView from 'components/core/SplitView';
import EditorGroups from 'components/core/EditorGroups';

/**
 * Main component.
 * Contains the main app.
 * @return {JSX.Element} Html.
 */
function Main() {
  // const analysis = useAppSelector(selectAnalysis);
  // const {
  //   cursorInformations,
  //   suitabilityCategories,
  //   suitabilityAboveThreshold,
  // } = useAppSelector(selectMap);
  // const objectives = analysis.properties.objectives;
  // const ohIsLoading = analysis.properties.objectivesLoading;

  /**
   * Check if the parameters are valid.
   * @return {boolean} True if the parameters are valid, otherwise False.
   */
  // function parametersIsValid() {
  //   return (
  //     analysis.properties.parameters.analysis_name?.length > 0 &&
  //     analysis.properties.parameters.modeler_name?.length > 0 &&
  //     analysis.properties.parameters.cell_size > 0 &&
  //     (!analysis.properties.parametersError ||
  //       analysis.properties.parametersError.length === 0) &&
  //     !analysis.properties.parametersLoading
  //   );
  // }

  /**
   * Check if the study area is enabled.
   * @return {boolean} True if the study area is enabled, otherwise False.
   */
  // function studyAreaIsEnabled() {
  //   return parametersIsValid();
  // }

  /**
   * Check if the study area is valid.
   * @return {boolean} True if the study area is valid, otherwise False.
   */
  // function studyAreaIsValid() {
  //   return (
  //     analysis.properties.study_area.length > 0 &&
  //     (!analysis.properties.study_areaError ||
  //       analysis.properties.study_areaError.length === 0) &&
  //     !analysis.properties.study_areaLoading
  //   );
  // }

  /**
   * Check if the systemType is enabled.
   * @return {boolean} True if the systemType is enabled, otherwise False.
   */
  // function systemTypeIsEnabled() {
  //   return parametersIsValid() && studyAreaIsValid();
  // }

  /**
   * Check if the systemType is valid.
   * @return {boolean} True if the systemType is valid, otherwise False.
   */
  // function systemTypeIsValid() {
  //   return (
  //     analysis.properties.nbs_system &&
  //     (!analysis.properties.nbs_systemError ||
  //       analysis.properties.nbs_systemError.length === 0) &&
  //     !analysis.properties.nbs_systemLoading
  //   );
  // }

  /**
   * Check if the objectiveHierarchy is enabled.
   * @return {boolean} True if the objectiveHierarchy is enabled, otherwise False.
   */
  // function objectiveHierarchyIsEnabled() {
  //   return parametersIsValid() && studyAreaIsValid() && systemTypeIsValid();
  // }

  /**
   * Check if the objectiveHierarchy is valid.
   * @return {boolean} True if the objectiveHierarchy is valid, otherwise False.
   */
  // function objectiveHierarchyIsValid() {
  //   return (
  //     analysis.properties.objectives &&
  //     (!analysis.properties.objectivesError ||
  //       analysis.properties.objectivesError.length === 0) &&
  //     !analysis.properties.objectivesLoading
  //   );
  // }

  /**
   * Check if the weights are enabled.
   * @return {boolean} True if the weights is enabled, otherwise False.
   */
  // function weightsAreEnabled() {
  //   return (
  //     parametersIsValid() &&
  //     studyAreaIsValid() &&
  //     systemTypeIsValid() &&
  //     objectiveHierarchyIsValid()
  //   );
  // }

  /**
   * Check if the valueScaling is enabled.
   * @return {boolean} True if the valueScaling is enabled, otherwise False.
   */
  // function valueScalingIsEnabled() {
  //   return (
  //     parametersIsValid() &&
  //     studyAreaIsValid() &&
  //     systemTypeIsValid() &&
  //     objectiveHierarchyIsValid()
  //   );
  // }

  return (
    <div className="d-flex flex-column" style={{ maxHeight: '100vh' }}>
      <MenuBar style={{ height: '24px' }} />
      <div
        className="d-flex flex-row"
        style={{
          height: 'calc(100vh - 24px - 22px)',
          maxWidth: '100%',
          overflow: 'auto',
        }}
      >
        <ActivityBar />
        <SplitView direction="row">
          <SideBar style={{ minWidth: 120, width: 240 }} />
          <SplitView style={{ minWidth: 120 }} direction="column">
            <EditorGroups />
            <SideBar style={{ height: '30%' }} />
          </SplitView>
        </SplitView>

        {/* <aside id="left-aside">
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
                // disabled={!studyAreaIsEnabled()}
              >
                <StudyArea
                // disabled={!studyAreaIsEnabled()}
                />
              </Collapsible>
              <Collapsible
                title={'system type'}
                guideHash="analysis/nbs-system"
                // disabled={!systemTypeIsEnabled()}
              >
                <NbsSystem
                // disabled={!systemTypeIsEnabled()}
                />
              </Collapsible>
              <Collapsible
                title={'objective hierarchy'}
                guideHash="analysis/objectives-hierarchy"
                // disabled={!objectiveHierarchyIsEnabled()}
              >
                <ObjectiveHierarchy
                  key={JSON.stringify(objectives)}
                  // disabled={!objectiveHierarchyIsEnabled()}
                />
              </Collapsible>
              <Collapsible
                title={'objectives weighting'}
                guideHash="analysis/weighting"
                // disabled={!weightsAreEnabled()}
              >
                <Weighting
                  key={`${ohIsLoading}`}
                  // disabled={!weightsAreEnabled()}
                />
              </Collapsible>
              <Collapsible
                title={'value scaling'}
                guideHash="analysis/value-scaling"
                // disabled={!valueScalingIsEnabled()}
              >
                <ValueScaling
                  key={`${ohIsLoading}`}
                  // disabled={!valueScalingIsEnabled()}
                />
              </Collapsible>
            </FormsBar>
          </aside> */}
        {/* <main
            className="shadow w-100 h-100 position-relative"
            style={{ zIndex: 1 }}
          >
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
              {Object.keys(flatten(analysis.properties.objectives)!).filter(
                key => /\.properties\.distribution_value\.\d+/.test(key)
              ).length > 0 && (
                <InformationCard>
                  <Collapsible
                    title={'value scales'}
                    guideHash="results-and-visualization/value-scaling-visualization"
                  >
                    <ValueScalingFunctionGraphs />
                  </Collapsible>
                </InformationCard>
              )}
              {cursorInformations?.objectives &&
                Object.keys(cursorInformations.objectives).length > 0 && (
                  <InformationCard>
                    <Collapsible
                      title={'cursor informations'}
                      guideHash="results-for-a-specific-cell"
                    >
                      <MapCursorInformation />
                    </Collapsible>
                  </InformationCard>
                )}
              {suitabilityAboveThreshold && (
                <InformationCard>
                  <Collapsible
                    title={'% of suitability above threshold'}
                    guideHash="suitability-threshold"
                  >
                    <MapSuitabilityAboveThreshold />
                  </Collapsible>
                </InformationCard>
              )}
              {suitabilityCategories && (
                <InformationCard>
                  <Collapsible
                    title={'suitability ranges'}
                    guideHash="suitability-range"
                  >
                    <MapSuitabilityCategories />
                  </Collapsible>
                </InformationCard>
              )}
            </aside>
          </main> */}
      </div>
      <StatusBar style={{ height: '22px' }} />
    </div>
  );
}

export default Main;
