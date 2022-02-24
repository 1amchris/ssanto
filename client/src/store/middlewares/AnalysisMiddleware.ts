import { toObjectWithSnakeCaseKeys, toSnakeCase } from 'utils';
import { receiveProperties, sendProperties } from 'store/reducers/analysis';
import { Layer, removeLayer, upsertLayer } from 'store/reducers/map';
import { call } from 'store/middlewares/ServerMiddleware';
import { GeoJSON } from 'geojson';

export interface UpdatePropertiesModel {
  property: string;
  [key: string]: any;
}

// TODO: Remove properties from model when forwarding action after dispatching server call
const AnalysisMiddleware = () => {
  return ({ dispatch }: any) =>
    (next: any) =>
    (action: any) => {
      switch (action.type) {
        case sendProperties.type:
          Object.entries(
            toObjectWithSnakeCaseKeys(action.payload.properties)
          ).forEach(([target, values]: [string, any]) => {
            dispatch(
              call({
                target: `${toSnakeCase(action.payload.property)}.${target}`,
                args: [].concat(values),
              })
            );
          });
          return next(action);

        case receiveProperties.type:
          if (!action.payload.properties.area) return next(action);

          // if the returned value is a GeoJSON
          // (has property 'area'), display it on the map
          const {
            property,
            properties: {
              area: { value: data, error },
            },
          } = action.payload;
          const name = toSnakeCase(property);
          if (!error && data) {
            dispatch(
              upsertLayer({
                name,
                data,
              } as Layer)
            );
          } else if (error) {
            dispatch(removeLayer(name));
          }
          return next(action);

        // case updateStudyAreaFiles.type:
        //   dispatch(
        //     sendFiles({
        //       target: 'study_area',
        //       files: action.payload,
        //     } as SendFilesModel)
        //   );
        //   return next(action);

        // case updateStudyArea.type:
        //   const layerName = 'study area';
        //   if (!action.payload.error && action.payload.value?.area) {
        //     dispatch(
        //       upsertLayer({
        //         name: layerName,
        //         data: action.payload.value?.area,
        //       } as Layer)
        //     );
        //   } else if (action.payload.error) {
        //     dispatch(removeLayer(layerName));
        //   }
        //   return next(action);

        default:
          return next(action);
      }
    };
};

export default AnalysisMiddleware();
