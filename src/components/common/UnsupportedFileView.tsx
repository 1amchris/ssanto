import React from 'react';

function UnsupportedFileView({ style }: any) {
  return (
    <div
      style={{ width: '100%', height: '100%', ...style, userSelect: 'none' }}
      className="d-flex flex-column justify-content-center align-items-center"
    >
      <p className="d-flex flex-column text-center text-secondary small p-2">
        The file is not displayed in the editor because it is not currently
        supported by SSANTO.
      </p>
    </div>
  );
}

export default UnsupportedFileView;
