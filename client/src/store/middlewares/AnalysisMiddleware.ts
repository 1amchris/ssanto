import { toObjectWithSnakeCaseKeys, toSnakeCase } from 'utils';
import {
  receiveProperties,
  sendProperties,
  deleteFile,
} from 'store/reducers/analysis';
import { Layer, removeLayer, upsertLayer } from 'store/reducers/map';
import { call } from 'store/middlewares/ServerMiddleware';

export interface UpdatePropertiesModel {
  property: string;
  [key: string]: any;
}
//Fred: recoit les modifications du serveur et applique les actions nécessaires.

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
          break;

        case receiveProperties.type:
          if (action.payload.properties.area) {
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
          } else if (action.payload.properties.data) {
            const {
              property,
              properties: {
                data: { value: data, error },
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
            // if 'data' exists in properties, display it on the map
          } else {
            return next(action);
          }
          break;

        case deleteFile.type:
          dispatch(
            call({
              target: 'delete_file.index',
              args: [].concat(action.payload.index),
            })
          );
          return next(action);
          break;

        default:
          return next(action);
      }
    };
};

export default AnalysisMiddleware();
