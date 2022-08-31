import { useEffect, useState } from 'react';


/**
 * @callback useEffectOnceCallback
 * @return {void}
 */
/**
 * Use effect once.
 * Used to call function once in component.
 * @param {useEffectOnceCallback} effect Callback to call once
 */
export function useEffectOnce(effect: () => void): void {
  const [isCalled, setIsCalled] = useState(false);

  useEffect(() => {
    if (!isCalled) {
      effect();
      setIsCalled(true);
    }
  });
}
