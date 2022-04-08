import { capitalize, uniqueId } from 'lodash';
import { withTranslation } from 'react-i18next';
import FormComponent from './FormComponent';
import { Form } from 'react-bootstrap';
import { Line, Bar } from 'react-chartjs-2';
import { FiInfo } from 'react-icons/fi';
import { HashLink } from 'react-router-hash-link';
import { bgColors, colors, horizontalBarHeight } from 'consts/graph';

const barOptions = {
  scales: {
    y: {
      beginAtZero: true,
    },
  },
  indexAxis: 'y' as const,
  plugins: {
    legend: {
      display: false,
    },
  },
};

const lineOptions = {
  plugins: {
    legend: {
      display: false,
    },
  },
};

const maxLabelLength = 15;

const generateBarData = (categories: string[], values: number[]) => {
  return {
    labels: categories?.map(c =>
      c.length > maxLabelLength ? c.slice(0, maxLabelLength - 2) + '...' : c
    ),
    datasets: [
      {
        data: values,
        backgroundColor: bgColors.map(
          ([r, g, b, a]) => `rgba(${r}, ${g}, ${b}, ${a})`
        ),
        borderColor: colors.map(
          ([r, g, b, a]) => `rgba(${r}, ${g}, ${b}, ${a})`
        ),
        borderWidth: 1,
      },
    ],
  };
};

const generateLineData = (labels: string[], values: number[]) => {
  return {
    labels: labels?.map(l =>
      l.length > maxLabelLength ? l.slice(0, maxLabelLength - 2) + '...' : l
    ),
    datasets: [
      {
        data: values,
        borderColor: colors.map(
          ([r, g, b, a]) => `rgba(${r}, ${g}, ${b}, ${a})`
        )[0],
        tension: 0.5,
        pointRadius: 0,
      },
    ],
  };
};

class FormScalingGraph extends FormComponent {
  constructor(props: any, key?: string) {
    super(props, uniqueId('form/control-'), key);
  }

  render = () => {
    const {
      t,
      hideLabel,
      visuallyHidden,
      className,
      label,
      distribution,
      distribution_value,
      type,
      isCalculated,
      guide_hash = '',
    } = this.getFilteredProps();

    return (
      <Form.Group
        className={`w-100 ${className} ${
          visuallyHidden ? 'visually-hidden' : ''
        }`}
      >
        <Form.Label visuallyHidden={hideLabel}>
          <small>
            {capitalize(t(label || this.props.name))}{' '}
            {guide_hash?.length > 0 && (
              <HashLink to={`/guide#${guide_hash}`}>
                <FiInfo />
              </HashLink>
            )}
          </small>
        </Form.Label>
        {(type === 'Continuous' ||
          (type === 'Boolean' && isCalculated === true)) && (
          <Line
            height="200"
            width="200"
            key={`${this.key}/graph`}
            options={lineOptions}
            data={generateLineData(distribution, distribution_value)}
          />
        )}
        {type === 'Categorical' && distribution_value && (
          <Bar
            width="200"
            options={barOptions}
            key={`${this.key}/graph`}
            // height={distribution.length * horizontalBarHeight}
            data={generateBarData(distribution, distribution_value)}
          />
        )}
      </Form.Group>
    );
  };
}

export default withTranslation()(FormScalingGraph);
