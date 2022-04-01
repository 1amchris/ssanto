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
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
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

const generateData = (distribution: number[], distribution_value: number[]) => {
  const data = {
    labels: distribution.map(d => d.toString()),
    datasets: [
      {
        label: 'suitability',
        data: distribution_value,
        backgroundColor: '#0D6EFD',
        tension: 0.4,
      },
    ],
  };
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
      type,
      isCalculated,
      ...props
    } = this.getFilteredProps();
    console.log('isCalculated', isCalculated, isCalculated as Boolean);

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
          {type == 'Continuous' ? (
            <div style={{ width: 200, height: 200 }}>
              <Line
                key={this.key}
                options={options}
                data={generateData(distribution, distribution_value)}
              />
            </div>
          ) : (
            <div style={{ width: 200, height: 200 }}>
              <Bar
                key={this.key}
                options={options}
                data={generateData(distribution, distribution_value)}
              />
            </div>
          )}
        </this.Overlay>
      </Form.Group>
    );
  };
}

export default withTranslation()(FormScalingGraph);
