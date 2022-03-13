import { capitalize } from 'lodash';
import { withTranslation } from 'react-i18next';
import { useEffectOnce } from 'hooks';
import FormSelectOptionModel from 'models/form-models/FormSelectOptionModel';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { selectAnalysis, setError, setLoading } from 'store/reducers/analysis';
import Form from 'components/form/Form';
import { Select, Button, Spacer } from 'components/form/form-components';
import { call, subscribe } from 'store/middlewares/ServerMiddleware';

function NbsSystem({ t }: any) {
  const property = 'nbs_system';
  const selector = useAppSelector(selectAnalysis);
  const properties = selector.properties[property];
  const dispatch = useAppDispatch();

  const getErrors = selector.properties['nbsSystemError'];
  const isLoading = selector.properties['nbsSystemLoading'];

  useEffectOnce(() => {
    dispatch(subscribe({subject: property}));
  });

  const controls = [
    <Select
      label="NBS system type"
      name="system_type"
      defaultValue={properties.system_type}
      options={
        [
          { value: '0', label: 'raingardens & bioretention systems' },
          { value: '1', label: 'rain tanks' },
          { value: '2', label: 'infiltration systems' },
          { value: '3', label: 'green roofs' },
          { value: '4', label: 'swales' },
          { value: '5', label: 'ponds & lakes' },
          { value: '6', label: 'constructed wetlands' },
        ] as FormSelectOptionModel[]
      }
      tooltip={t('the selected NBS system type ...')}
    />,
    <Spacer />,
    <Button variant="outline-primary" type="submit" loading={isLoading}>
      {capitalize(t('apply'))}
    </Button>,
    <Button variant="outline-danger" type="reset">
      {capitalize(t('reset'))}
    </Button>,
  ];

  return (
    <Form
      controls={controls}
      errors={getErrors}
      disabled={isLoading}
      onSubmit={(fields: any) => {
        dispatch(call({target: 'update', args: [property, fields],
            successAction: setLoading, successData: property,
            failureAction: setError, failureData: property}))
      }
        
      }
    />
  );
}

export default withTranslation()(NbsSystem);
