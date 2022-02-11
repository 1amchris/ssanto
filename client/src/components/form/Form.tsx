import React from 'react';
import { uniqueId } from 'lodash';

function Form({ controls, onSubmit = (e: any) => {}, ...props }: any) {
  const id = uniqueId('form-');

  return (
    <form
      {...props}
      onSubmit={(e: any) => {
        e.preventDefault();
        const fields = Object.fromEntries(
          Object.entries(e.target)
            .filter(([_, e]: any) => e?.name && (e?.value || e?.defaultValue))
            .map(([_, input]: any) => [input.name, input.value])
        );
        onSubmit(fields);
      }}
      onReset={(e: any) => {
        e.preventDefault();
        Object.entries(e.target)
          .filter(([_, e]: any) => e?.name && e.readOnly === false)
          .forEach(([_, input]: any) => {
            input.value = input.type === 'file' ? null : input.defaultValue;
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
