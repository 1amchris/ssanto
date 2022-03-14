import { toObjectWithSnakeCaseKeys, toSnakeCase } from 'utils';
import { exportPDF, exportJPEG } from 'store/reducers/export';
import { Layer, removeLayer, upsertLayer } from 'store/reducers/map';
import { call } from 'store/middlewares/ServerMiddleware';

export interface UpdatePropertiesModel {
  property: string;
  [key: string]: any;
}

// TODO: Remove properties from model when forwarding action after dispatching server call
const ExportMiddleware = () => {
  return ({ dispatch }: any) =>
    (next: any) =>
    (action: any) => {
      switch (action.type) {
        case exportPDF.type:
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

        case exportJPEG.type:
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

        default:
          return next(action);
      }
    };
};

export default ExportMiddleware();
