import { selectMap } from 'store/reducers/map';
import { useAppSelector } from 'store/hooks';
import { Bar } from 'react-chartjs-2';
import { capitalize } from 'lodash';
import { useEffect } from 'react';

function MapCursorInformation() {
  const { cursorInformations } = useAppSelector(selectMap);

  const colors = [
    [255, 99, 132],
    [255, 159, 64],
    [255, 205, 86],
    [75, 192, 192],
    [54, 162, 235],
    [153, 102, 255],
    [201, 203, 207],
  ];

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
                suggestedMin: 0,
                suggestedMax: 1,
              },
            },
            indexAxis: 'y' as const,
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
            labels: Object.keys(cursorInformations.objectives)
              .map(
                objective =>
                  `${objective}${
                    Array.from(cursorInformations.missings).includes(objective)
                      ? ' (est.)'
                      : ''
                  }`
              )
              .map(capitalize),
            datasets: [
              {
                label: 'Objective suitability',
                data: Object.values(cursorInformations.objectives),
                backgroundColor: Object.keys(cursorInformations.objectives).map(
                  (objective, index, objectives) => {
                    const [r, g, b] = colors[index % objectives.length];
                    return `rgba(${r}, ${g}, ${b}, ${
                      Array.from(cursorInformations.missings).includes(
                        objective
                      )
                        ? 0
                        : 0.2
                    })`;
                  }
                ),
                borderColor: Object.keys(cursorInformations.objectives).map(
                  (_, index, objectives) => {
                    const [r, g, b] = colors[index % objectives.length];
                    return `rgba(${r}, ${g}, ${b})`;
                  }
                ),
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
