import React from 'react';
import { uniqueId } from 'lodash';
import { unflatten } from 'flattenizer';
import { Alert } from './components';

/**
 * @callback onCallback
 * @param {Object} e Data
 * @return {void}
 */
/**
 * @deprecated
 * Form
 * @param {ReactElement | ReactElement[]} controls A list of controls which will be added to the form
 * @param {onCallback} onSubmit Specify what to do with the fields in the form upon submission
 * @param {onCallback} onReset [optional] Specify how to reset with the fields upon resetting
 * @return {JSX.Element} A form as a ReactElement
 */
function Form({
  controls,
  disabled,
  errors = [],
  onSubmit = (e: any) => {},
  onReset = (e: any) => {
    e.preventDefault();
    Object.values(e.target)
      .filter((e: any) => e?.name && e?.readOnly !== true)
      .forEach((input: any, index: number) => {
        input.value =
          input.type === 'file' ? null : controls[index].props.defaultValue;
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
          Object.values(e.target)
            .filter((e: any) => e?.name && (e?.value || e?.defaultValue))
            .map((input: any) => [
              input.name,
              input.type === 'file'
                ? input.files
                : input.type === 'number'
                ? +input.value
                : input.value,
            ])
        );
        onSubmit(unflatten(fields));
      }}
      onReset={onReset}
    >
      <fieldset disabled={disabled}>
        {[]
          .concat(errors)
          .filter((error: any) => error)
          .map((error: any, index: number) => (
            <Alert
              key={`${id}-${index}/error`}
              variant="danger"
              className="mb-2"
            >
              {error}
            </Alert>
          ))}
        {controls.map((control: any, index: number) => (
          <div key={`${id}-${index}`} className="mb-2">
            {control}
          </div>
        ))}
      </fieldset>
    </form>
  );
}

export default Form;
