import { Line } from 'react-chartjs-2';
import ColorScaleUtils from 'utils/color-scale-utils';
let width: number, height: number, gradient: any;

const getGradient = (
  ctx: any,
  chartArea: { right: number; left: number; bottom: number; top: number }
) => {
  const chartWidth = chartArea.right - chartArea.left;
  const chartHeight = chartArea.bottom - chartArea.top;
  if (!gradient || width !== chartWidth || height !== chartHeight) {
    width = chartWidth;
    height = chartHeight;
    gradient = ctx.createLinearGradient(chartArea.left, 0, chartArea.right, 0);
    for (let x = 0; x < 100; x++) {
      gradient.addColorStop(
        Math.min(x / 100, 1),
        ColorScaleUtils.greenToRed(Math.min(x, 100))
      );
    }
  }
  return gradient;
};

const generateLegendData = () => {
  return {
    labels: Array.from(Array(10).keys()).map(x => (x + 10) / 100),
    datasets: [
      {
        data: Array.from(Array(100).keys()).map(x => 1),
        tension: 0.5,
        fill: true,
        pointRadius: 0,
        backgroundColor: function (context: { chart: any }) {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          if (!chartArea) {
            // This case happens on initial chart load
            return;
          }
          return getGradient(ctx, chartArea);
        },
        borderColor: function (context: { chart: any }) {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          if (!chartArea) {
            return;
          }
          return getGradient(ctx, chartArea);
        },
      },
    ],
  };
};

function MapLegend() {
  const lineOptions = {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          display: false,
        },
        grid: {
          display: false,
          drawBorder: false,
        },
      },
    },
  };

  return (
    <div>
      <Line
        height="50"
        width="200"
        options={lineOptions}
        data={generateLegendData()}
      />
    </div>
  );
}

export default MapLegend;
