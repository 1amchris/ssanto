import { selectMap } from 'store/reducers/map';
import { useAppSelector } from 'store/hooks';
import { Bar } from 'react-chartjs-2';

function MapCursorInformation() {
  const { suitabilityCategories } = useAppSelector(selectMap);

  const rows = [
    // suitabilityCategories &&
    //   Object.keys(suitabilityCategories).length > 0 &&
    //   Object.entries(suitabilityCategories).map(([objective, suitability]) => (
    //     <div className="bg-light border rounded p-2 mb-1">
    //       <code>
    //         {objective}: {suitability}
    //       </code>
    //     </div>
    //   )),
    suitabilityCategories && (
      <Bar
        height={Object.keys(suitabilityCategories).length * 50}
        options={{
          scales: {
            y: {
              beginAtZero: true,
              suggestedMax: 1.0,
            },
          },
          indexAxis: 'y' as const,
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },
            title: {
              display: true,
              text: 'Objectives suitability categories',
            },
          },
        }}
        data={{
          labels: Object.keys(suitabilityCategories),
          datasets: [
            {
              label: 'Objective suitability',
              data: Object.values(suitabilityCategories),
              backgroundColor: ['rgba(54, 162, 235, 0.2)'],
              borderColor: ['rgb(54, 162, 235)'],
              borderWidth: 1,
            },
          ],
        }}
      />
    ),
  ];

  return (
    <div>
      {rows.map((row: any, index: number) => (
        <div key={`${index}`} className="mb-2">
          {row}
        </div>
      ))}
    </div>
  );
}

export default MapCursorInformation;
