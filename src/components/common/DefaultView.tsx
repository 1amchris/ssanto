import React from 'react';
import { min } from 'lodash';
import { useResizeDetector } from 'react-resize-detector';

function DefaultView({ style, showTips = true }: any) {
  const { width, height, ref } = useResizeDetector();
  const maxSize = 175;
  const size = min([width || 0, height || 0, maxSize])!;
  const _showTips = showTips && height !== undefined && height > maxSize * 1.5;

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
        <p className="d-flex flex-column text-secondary p-2">
          <span className="p-1 text-center">
            <kbd className="bg-secondary">CMD</kbd> +{' '}
            <kbd className="bg-secondary">O</kbd> to open a project
          </span>
          <span className="p-1 text-center">
            <kbd className="bg-secondary">CMD</kbd> +{' '}
            <kbd className="bg-secondary">Q</kbd> to close SSanto
          </span>
        </p>
      )}
    </div>
  );
}

export default DefaultView;
