import React from 'react';
import { min } from 'lodash';
import { useResizeDetector } from 'react-resize-detector';

function DefaultView({ style, showTips = true }: any) {
  const { width, height, ref } = useResizeDetector();
  const maxSize = 175;
  const size = min([width || 0, height || 0, maxSize])!;
  const _showTips =
    showTips &&
    height !== undefined &&
    height > maxSize * 1.5 &&
    width !== undefined &&
    width > maxSize * 1.5;

  const tips = [
    { label: 'Show all Commands', keys: ['SHIFT', 'CMD', 'P'] },
    { label: 'Open a Project', keys: ['CMD', 'O'] },
    { label: 'Close SSANTO', keys: ['CMD', 'Q'] },
  ];

  return (
    <div
      style={{ width: '100%', height: '100%', ...style, userSelect: 'none' }}
      className="d-flex flex-column justify-content-center align-items-center"
      ref={ref}
    >
      <img
        src="logo512_map.png"
        className="p-3"
        style={{
          width: size,
          height: size,
          opacity: 0.65,
          filter: 'grayscale(100%)',
        }}
        draggable={false}
        alt="SSANTO map logo"
      />
      {_showTips && (
        <p className="d-flex flex-column text-secondary small p-2">
          {tips.map((tip, index) => (
            <span className="p-1 row flex-nowrap" key={index}>
              <span className="col-6 px-0 text-end me-2 text-nowrap">
                {tip.label}
              </span>
              <span className="col-5 px-0 text-start">
                {tip.keys.map((key, index) => (
                  <kbd className="bg-secondary me-1" key={index}>
                    {key}
                  </kbd>
                ))}
              </span>
            </span>
          ))}
        </p>
      )}
    </div>
  );
}

export default DefaultView;
