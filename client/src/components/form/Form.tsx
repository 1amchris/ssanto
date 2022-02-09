import React from 'react';
import { uniqueId } from 'lodash';

function Form({ controls, onSubmit }: any) {
  const id = uniqueId('form-');

  return (
    <form onSubmit={onSubmit}>
      {controls.map((control: any, index: number) => (
        <div key={`${id}-${index}`} className="mb-2">
          {control}
        </div>
      ))}
    </form>
  );
}

export default Form;
