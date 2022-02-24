import { toObjectWithSnakeCaseKeys, toSnakeCase } from 'utils';
import { receiveProperties, sendProperties } from 'store/reducers/analysis';
import { Layer, removeLayer, upsertLayer } from 'store/reducers/map';
import { call } from 'store/middlewares/ServerMiddleware';

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
          // if 'area' exists in properties, display it on the map
          if (!action.payload.properties.area) return next(action);

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

        default:
          return next(action);
      }
    };
};

export default AnalysisMiddleware();
