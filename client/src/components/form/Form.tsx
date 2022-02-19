import React from 'react';
import { uniqueId } from 'lodash';
import { unflatten } from 'flattenizer';

/**
 * Form
 * @param controls A list of controls which will be added to the form
 * @param onSubmit Specify what to do with the fields in the form upon submission
 * @param onReset [optional] Specify how to reset with the fields upon resetting
 * @returns a form as a ReactElement
 */
function Form({
  controls,
  onSubmit = (e: any) => {},
  onReset = (e: any) => {
    e.preventDefault();
    Object.entries(e.target)
      .filter(([_, e]: any) => e?.name && e.readOnly === false)
      .forEach(([_, input]: any) => {
        input.value = input.type === 'file' ? null : input.defaultValue;
      });
  },
  ...props
}: any) {
  const id = uniqueId('form-');

  return (
    <form
      {...props}
      onSubmit={(e: any) => {
        e.preventDefault();
        const fields = Object.fromEntries(
          Object.entries(e.target)
            .filter(([_, e]: any) => e?.name && (e?.value || e?.defaultValue))
            .map(([_, input]: any) => [
              input.name,
              input.type === 'file' ? input.files : input.value,
            ])
        );
        onSubmit(unflatten(fields));
      }}
      onReset={onReset}
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
