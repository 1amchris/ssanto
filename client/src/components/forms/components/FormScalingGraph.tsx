import { capitalize, uniqueId } from 'lodash';
import { withTranslation } from 'react-i18next';
import FormComponent from './FormComponent';
import { Form } from 'react-bootstrap';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  maintainAspectRatio: false,
  //responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
      text: 'Chart.js Line Chart',
    },
  },
};

export const data = {
  labels: ['0', '20', '40', '60', '80', '100'],
  datasets: [
    {
      label: 'suitability',
      data: [0, 10, 20, 30, 40, 50],
      backgroundColor: '#0D6EFD',
    },
  ],
};

const generateData = (distribution: number[], distribution_value: number[]) => {
  const data = [];
  for (
    let i = 0;
    i < Math.min(distribution.length, distribution_value.length);
    i += 1
  ) {
    data.push({ name: distribution[i], suitability: distribution_value[i] });
  }
  return data;
};

/**
 * FormScalingGraph
 * @param props
 * @returns an augmented input control
 */
class FormScalingGraph extends FormComponent {
  constructor(props: any, key?: string) {
    super(props, uniqueId('form/control-'), key);
  }

  render = () => {
    const {
      t,
      i18n,
      tReady,
      hideLabel,
      visuallyHidden,
      className,
      label,
      distribution,
      distribution_value,
      max,
      min,
      type,
      ...props
    } = this.getFilteredProps();

    return (
      <Form.Group
        key={this.key}
        className={`w-100 ${className} ${
          visuallyHidden ? 'visually-hidden' : ''
        }`}
      >
        <Form.Label visuallyHidden={hideLabel}>
          <small>{capitalize(t(label || this.props.name))}</small>
        </Form.Label>
        <this.Overlay>
          {true ? (
            <div style={{ width: 200, height: 200 }}>
              <Line key={this.key} options={options} data={data} />
            </div>
          ) : (
            //</ResponsiveContainer>
            <></>
          )}
        </this.Overlay>
      </Form.Group>
    );
  };
}

export default withTranslation()(FormScalingGraph);
