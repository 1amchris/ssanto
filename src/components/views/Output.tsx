import moment from 'moment';
import React from 'react';
import { useAppSelector } from 'store/hooks';
import { selectOutput } from 'store/reducers/output';

function Output() {
  const outputs = useAppSelector(selectOutput).outputs;

  return (
    <div className="h-100 overflow-auto mx-3">
      {outputs.map(({ type, time, message }: any, index: number) => (
        <pre
          key={message + index}
          className="text-black text-nowrap overflow-visible mb-1"
        >
          {`[`}
          {<span className="text-uppercase">{type}</span>}
          {` - `}
          {moment(time).format('hh:mm:ss a')}
          {`] ${message}`}
        </pre>
      ))}
    </div>
  );
}

export default Output;
