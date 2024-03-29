import React, { useEffect, useRef } from 'react';
import moment from 'moment';
import { useAppSelector } from 'store/hooks';
import { selectLogger } from 'store/reducers/logger';

function Output() {
  const logger = useAppSelector(selectLogger);
  const logs = logger.logs;
  const active = logger.active;

  // Always scroll to the bottom of the output
  const endOfOutputRef = useRef(null as HTMLDivElement | null);
  useEffect(() => {
    endOfOutputRef?.current?.scrollIntoView({ behavior: 'smooth' });
  });

  return (
    <div className="h-100 overflow-auto mx-3">
      {logs[active]?.map(({ type, time, message }: any, index: number) => (
        <pre
          key={message + index}
          className="text-black text-nowrap overflow-visible mb-1"
        >
          {`["`}
          {<span className="text-uppercase">{type}</span>}
          {`" - `}
          {/* moment takes milliseconds, and time is in seconds */}
          {moment(time * 1000).format('hh:mm:ss a')}
          {`] ${message}`}
        </pre>
      ))}
      <div ref={endOfOutputRef} />
    </div>
  );
}

export default Output;
