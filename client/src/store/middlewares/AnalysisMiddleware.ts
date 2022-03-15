import { studyAreaReceived } from 'store/reducers/analysis';
import { Layer, upsertLayer } from 'store/reducers/map';

// TODO: Remove properties from model when forwarding action after dispatching server call
const AnalysisMiddleware = () => {
  return ({ dispatch }: any) =>
    (next: any) =>
    (action: any) => {
      switch (action.type) {
        case studyAreaReceived.type:
          const { data } = action.payload;
          console.log(data);
          dispatch(
            upsertLayer({
              name: data.file_name,
              data: data.area,
            } as Layer)
          );
          return next(action);
          break;

        default:
          return next(action);
      }
    };
};

export default AnalysisMiddleware();
