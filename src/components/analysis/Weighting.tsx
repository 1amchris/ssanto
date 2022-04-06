import { capitalize, max, sum } from 'lodash';
import { withTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import Form from 'components/forms/Form';
import { call } from 'store/reducers/server';

import {
  Button,
  Spacer,
  Control,
  SimpleList,
} from 'components/forms/components';
import {
  selectAnalysis,
  injectSetLoadingCreator,
  injectSetErrorCreator,
} from 'store/reducers/analysis';
import { FactoryProps } from 'components/forms/components/FormExpandableList';
import LoadingValue from 'models/LoadingValue';
import CallModel from 'models/server-coms/CallModel';
import ServerCallTargets from 'enums/ServerCallTargets';

type ObjectivesHierarchy = {
  main: string;
  primaries: {
    primary: string[];
    weights: number[];
    secondaries: {
      secondary: string[];
      weights: number[];
      attributes: {
        attribute: string[];
        weights: number[];
      }[];
    }[];
  };
};

type WeightsHierarchy = {
  primaries: {
    weights: number[];
    secondaries: {
      weights: number[];
      attributes: {
        weights: number[];
      }[];
    }[];
  };
};

const merge = (
  objectives: ObjectivesHierarchy,
  weights: WeightsHierarchy
): ObjectivesHierarchy => ({
  ...objectives,
  primaries: {
    ...objectives.primaries,
    weights: weights.primaries.weights,
    secondaries: objectives.primaries.secondaries.map(
      (secondaries, sindex) => ({
        ...secondaries,
        weights: weights.primaries.secondaries[sindex]
          ? weights.primaries.secondaries[sindex].weights
          : secondaries.weights,
        attributes: secondaries.attributes.map((attributes, aindex) => ({
          ...attributes,
          weights: weights.primaries.secondaries[sindex].attributes
            ? weights.primaries.secondaries[sindex].attributes[aindex].weights
            : attributes.weights,
        })),
      })
    ),
  },
});

function normalizeWeights({ primaries }: WeightsHierarchy): WeightsHierarchy {
  function normalize(weights: number[]): number[] {
    const total = sum([0, ...weights]);
    if (total === 0) return [...weights];

    return weights.map(weight => max([0, weight / total])!);
  }

  return {
    primaries: {
      weights: normalize(primaries.weights),
      secondaries: primaries.secondaries?.map(secondaries => ({
        weights: normalize(secondaries.weights),
        attributes: secondaries.attributes?.map(attributes => ({
          weights: normalize(attributes.weights),
        })),
      })),
    },
  };
}

function Weighting({ t, disabled }: any) {
  const property = 'objectives';
  const selector = useAppSelector(selectAnalysis);
  const objectives = selector.properties.objectives as ObjectivesHierarchy;
  const dispatch = useAppDispatch();

  const getErrors = selector.properties.objectivesError;
  const isLoading = selector.properties.objectivesLoading;

  let controls = [];
  if (objectives !== undefined && objectives.primaries !== undefined) {
    const attributesFactory = ({ name, key, label, weight }: FactoryProps) => {
      return [
        <Control
          key={key('attribute')}
          label={label}
          name={name('weights')}
          defaultValue={weight}
          type="number"
        />,
      ];
    };

    const secondariesFactory = ({
      name,
      key,
      label,
      weight,
      attributes,
    }: FactoryProps) => {
      return [
        <Control
          key={key('secondary')}
          label={label}
          name={name('weights')}
          defaultValue={weight}
          type="number"
        />,
        attributes.attribute.length > 1 && (
          <SimpleList
            hideLabel
            key={key('attributes')}
            name={name('attributes')}
            factory={attributesFactory}
            controls={attributes.attribute.map((_: any, index: number) => ({
              label: attributes.attribute[index],
              weight: attributes.weights[index],
            }))}
          />
        ),
      ];
    };

    const primariesFactory = ({
      name,
      key,
      label,
      weight,
      secondaries,
    }: FactoryProps) => {
      return [
        <Control
          label={label}
          key={key('primary')}
          name={name('weights')}
          defaultValue={weight}
          type="number"
        />,
        (secondaries.secondary.length > 1 ||
          (secondaries.secondary.length === 1 &&
            secondaries.attributes[0].attribute.length > 1)) && (
          <SimpleList
            hideLabel
            key={key('secondaries')}
            name={name('secondaries')}
            factory={secondariesFactory}
            controls={secondaries.secondary.map((_: any, index: number) => ({
              label: secondaries.secondary[index],
              weight: secondaries.weights[index],
              attributes: secondaries.attributes[index],
            }))}
          />
        ),
      ];
    };

    controls = [
      <SimpleList
        label={objectives.main}
        key={'primaries'}
        name={'primaries'}
        factory={primariesFactory}
        controls={objectives.primaries.primary.map((_: any, index: number) => ({
          label: objectives.primaries.primary[index],
          weight: objectives.primaries.weights[index],
          secondaries: objectives.primaries.secondaries[index],
        }))}
      />,
      <Spacer />,
      <Button variant="outline-primary" loading={isLoading}>
        {capitalize(t('apply'))}
      </Button>,
    ];
  } else {
    controls = [<></>];
  }

  return (
    <Form
      controls={controls}
      errors={getErrors}
      disabled={isLoading || disabled}
      onSubmit={(fields: WeightsHierarchy) => {
        dispatch(
          injectSetLoadingCreator({
            value: property,
            isLoading: true,
          } as LoadingValue<string>)()
        );

        dispatch(
          call({
            target: ServerCallTargets.Update,
            args: [property, merge(objectives, normalizeWeights(fields))],
            onSuccessAction: injectSetLoadingCreator({
              value: property,
              isLoading: false,
            } as LoadingValue<string>),
            onErrorAction: injectSetErrorCreator(property),
          } as CallModel)
        );
      }}
    />
  );
}

export default withTranslation()(Weighting);
