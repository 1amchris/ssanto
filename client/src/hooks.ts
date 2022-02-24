import { useEffect, useState } from 'react';

export function useEffectOnce(effect: () => void): void {
  const [isCalled, setIsCalled] = useState(false);

  useEffect(() => {
    if (!isCalled) {
      effect();
      setIsCalled(true);
    }
  });
}
