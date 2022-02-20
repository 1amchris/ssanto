import { updateStudyArea, updateStudyAreaFiles } from '../reducers/analysis';
import { Layer, upsertLayer } from '../reducers/map';
import { sendFiles, SendFilesModel } from './ServerMiddleware';

const StudyAreaMiddleware = () => {
  return ({ dispatch }: any) =>
    (next: any) =>
    (action: any) => {
      switch (action.type) {
        case updateStudyAreaFiles.type:
          dispatch(
            sendFiles({
              command: 'study_area',
              files: action.payload,
            } as SendFilesModel)
          );
          return next(action);

        case updateStudyArea.type:
          if (!action.payload.error && action.payload.area) {
            dispatch(
              upsertLayer({
                name: 'study area',
                data: action.payload.area,
              } as Layer)
            );
          }
          return next(action);

        default:
          return next(action);
      }
    };
};

export default StudyAreaMiddleware();
