import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';

import { useAppSelector, useAppDispatch } from '../store/hooks';
import {
  decrement,
  increment,
  incrementByAmount,
  incrementAsync,
  incrementIfOdd,
  selectCount,
} from '../store/reducers/counter';
import { FaPlus, FaMinus } from 'react-icons/fa';

interface params {
  t: (str: string) => string;
  className?: string;
  key?: string;
}

function Counter({ t, className, key }: params) {
  const count = useAppSelector(selectCount);
  const dispatch = useAppDispatch();
  const [incrementAmount, setIncrementAmount] = useState('2');

  const incrementValue = Number(incrementAmount) || 0;

  return (
    <div key={key} className={className}>
      <div className="w-100 p-2 card mb-2">
        <div className="mb-2">
          <button
            className="btn btn-sm btn-outline-danger"
            aria-label="Decrement value"
            onClick={() => dispatch(decrement())}
          >
            <FaMinus /> {t('decrement-value')}
          </button>
          <span className="badge bg-primary mx-2">{count}</span>
          <button
            className="btn btn-sm btn-outline-success"
            aria-label="Increment value"
            onClick={() => dispatch(increment())}
          >
            <FaPlus /> {t('increment-value')}
          </button>
        </div>
        <div className="row g-1 mb-2">
          <div className="col-auto">
            <input
              className="form-control"
              aria-label="Set increment amount"
              value={incrementAmount}
              onChange={e => setIncrementAmount(e.target.value)}
            />
          </div>
          <button
            className="btn col-auto"
            onClick={() => dispatch(incrementByAmount(incrementValue))}
          >
            Add Amount
          </button>
          <button
            className="btn col-auto"
            onClick={() => dispatch(incrementAsync(incrementValue))}
          >
            Add Async
          </button>
          <button
            className="btn col-auto"
            onClick={() => dispatch(incrementIfOdd(incrementValue))}
          >
            Add If Odd
          </button>
        </div>
      </div>
    </div>
  );
}

export default withTranslation()(Counter);
