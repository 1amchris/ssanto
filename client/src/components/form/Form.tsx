import React from 'react';
import { uniqueId } from 'lodash';

function Form({ controls, store, onSubmit = (e: any) => {}, ...props }: any) {
  const id = uniqueId('form-');

  return (
    <form
      {...props}
      onSubmit={(e: any) => {
        e.preventDefault();
        const fields = Object.fromEntries(
          Object.entries(store).map(([key]) => [key, e.target[key].value])
        );
        onSubmit(fields);
      }}
      onReset={(e: any) => {
        e.preventDefault();
        Object.entries(store).forEach(([key, value]) => {
          e.target[key].type === 'file'
            ? (e.target[key].value = null)
            : (e.target[key].value = value);
        });
      }}
    >
      {controls.map((control: any, index: number) => (
        <div key={`${id}-${index}`} className="mb-2">
          {control}
        </div>
      ))}
    </form>
  );
}

export default Form;
