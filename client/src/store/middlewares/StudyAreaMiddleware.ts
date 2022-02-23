import { updateStudyArea, updateStudyAreaFiles } from '../reducers/analysis';
import { Layer, removeLayer, upsertLayer } from '../reducers/map';
import { sendFiles, SendFilesModel } from './ServerMiddleware';

const AnalysisMiddleware = () => {
  return ({ dispatch }: any) =>
    (next: any) =>
    (action: any) => {
      switch (action.type) {
        case updateStudyAreaFiles.type:
          dispatch(
            sendFiles({
              command: 'analysis.update_study_area',
              files: action.payload,
            } as SendFilesModel)
          );
          return next(action);

        case updateStudyArea.type:
          const layerName = 'study area';
          if (!action.payload.error && action.payload.area) {
            dispatch(
              upsertLayer({
                name: layerName,
                data: action.payload.area,
              } as Layer)
            );
          } else if (action.payload.error) {
            dispatch(removeLayer(layerName));
          }
          return next(action);

        default:
          return next(action);
      }
    };
};

export default AnalysisMiddleware();
