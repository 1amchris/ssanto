import { selectMap } from 'store/reducers/map';
import { useAppSelector } from 'store/hooks';
import { Bar } from 'react-chartjs-2';
import { capitalize } from 'lodash';

function MapCursorInformation() {
  const { cursor, cursorInformations } = useAppSelector(selectMap);

  const rows = [
    // <div>
    //   <small>Latitude/Longitude</small>
    //   <div className="bg-light border rounded p-2">
    //     <code className="d-block">{cursor?.lat}</code>
    //     <code className="d-block">{cursor?.long}</code>
    //   </div>
    // </div>,
    // cursorInformations?.objectives &&
    //   Object.keys(cursorInformations.objectives).length > 0 &&
    //   Object.entries(cursorInformations?.objectives).map(
    //     ([objective, suitability]) => (
    //       <div className="bg-light border rounded p-2 mb-1">
    //         <code>
    //           {objective}: {suitability}
    //         </code>
    //       </div>
    //     )
    //   ),
    cursorInformations?.objectives &&
      Object.keys(cursorInformations.objectives).length > 0 && (
        <Bar
          height={Object.keys(cursorInformations.objectives).length * 75}
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
                text: 'Objectives suitability levels',
              },
            },
          }}
          data={{
            labels: Object.keys(cursorInformations.objectives).map(capitalize),
            datasets: [
              {
                label: 'Objective suitability',
                data: Object.values(cursorInformations.objectives),
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(255, 159, 64, 0.2)',
                  'rgba(255, 205, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(201, 203, 207, 0.2)',
                ],
                borderColor: [
                  'rgb(255, 99, 132)',
                  'rgb(255, 159, 64)',
                  'rgb(255, 205, 86)',
                  'rgb(75, 192, 192)',
                  'rgb(54, 162, 235)',
                  'rgb(153, 102, 255)',
                  'rgb(201, 203, 207)',
                ],
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
