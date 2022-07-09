import React from 'react';
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
      display: true,
    },
    x: {
      display: true,
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
  scales: {
    x: {
      display: true,
    },
    y: {
      display: true,
    },
  },
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

/**
 * @deprecated
 * Form scaling graph component.
 * @return {JSX.Element} Html.
 */
class FormScalingGraph extends FormComponent {
  /**
   * @constructor
   * @param {any} props Props. TODO
   * @param {string} [key] Key name.
   */
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
      distribution_value: distributionValue,
      xAxis,
      yAxis,
      type,
      isCalculated,
      guideHash = '',
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
            {guideHash?.length > 0 && (
              <HashLink to={`/guide#${guideHash}`}>
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
            options={{
              ...lineOptions,
              scales: {
                ...lineOptions.scales,
                x: {
                  ...lineOptions.scales.x,
                  title: {
                    display: xAxis !== undefined,
                    text: xAxis,
                  },
                },
                y: {
                  ...lineOptions.scales.y,
                  title: {
                    display: xAxis !== undefined,
                    text: yAxis,
                  },
                },
              },
            }}
            data={generateLineData(distribution, distributionValue)}
          />
        )}
        {type === 'Categorical' && distributionValue && (
          <Bar
            // For some reason, this Bar chart's height appears 1.6 times thicker?
            height={(distributionValue.length * horizontalBarHeight) / 1.6}
            width="200"
            options={{
              ...barOptions,
              scales: {
                ...barOptions.scales,
                x: {
                  ...barOptions.scales.x,
                  title: {
                    // y because the axis are inverted
                    display: yAxis !== undefined,
                    text: yAxis,
                  },
                },
                y: {
                  ...barOptions.scales.y,
                  title: {
                    // x because the axis are inverted
                    display: xAxis !== undefined,
                    text: xAxis,
                  },
                },
              },
            }}
            key={`${this.key}/graph`}
            data={generateBarData(distribution, distributionValue)}
          />
        )}
      </Form.Group>
    );
  };
}

export default withTranslation()(FormScalingGraph);
