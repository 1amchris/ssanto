import { toObjectWithSnakeCaseKeys } from 'utils';
import {
  updateProperties,
  updateStudyArea,
  updateStudyAreaFiles,
} from 'store/reducers/analysis';
import { Layer, removeLayer, upsertLayer } from 'store/reducers/map';
import {
  call,
  sendFiles,
  SendFilesModel,
} from 'store/middlewares/ServerMiddleware';

export interface updatePropertiesModel {
  property: string;
  [key: string]: any;
}

// TODO: Remove properties from model when forwarding action after dispatching server call
const AnalysisMiddleware = () => {
  return ({ dispatch }: any) =>
    (next: any) =>
    (action: any) => {
      switch (action.type) {
        case updateProperties.type:
          Object.entries(
            toObjectWithSnakeCaseKeys(action.payload.properties)
          ).forEach(([target, values]: [string, any]) => {
            dispatch(call({ target, args: [].concat(values) }));
          });
          return next(action);

        case updateStudyAreaFiles.type:
          dispatch(
            sendFiles({
              target: 'study_area',
              files: action.payload,
            } as SendFilesModel)
          );
          return next(action);

        case updateStudyArea.type:
          const layerName = 'study area';
          if (!action.payload.error && action.payload.value?.area) {
            dispatch(
              upsertLayer({
                name: layerName,
                data: action.payload.value?.area,
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
