import { selectMap } from 'store/reducers/map';
import { useAppSelector } from 'store/hooks';
import React from 'react';

function MapSuitabilityAboveThreshold() {
  const { suitabilityAboveThreshold, suitabilityThreshold } =
    useAppSelector(selectMap);

  const rows = [
    suitabilityAboveThreshold && (
      <div className="bg-light border rounded p-2 mb-1">
        <code>
          Suitability above {suitabilityThreshold}: {suitabilityAboveThreshold}
        </code>
      </div>
    ),
  ];

  return (
    <React.Fragment>
      {rows.map((row: any, index: number) => (
        <div key={`${index}`} className="mb-2">
          {row}
        </div>
      ))}
    </React.Fragment>
  );
}

export default MapSuitabilityAboveThreshold;
