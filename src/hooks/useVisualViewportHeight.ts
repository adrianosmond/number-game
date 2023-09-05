import { useEffect, useState } from 'react';

export default () => {
  const [height, setHeight] = useState(`${visualViewport?.height || 0}px`);

  useEffect(() => {
    const handler: () => void = () => {
      setHeight(`${visualViewport?.height || 0}px`);
    };
    window.visualViewport?.addEventListener('resize', handler);
    return () => window.visualViewport?.removeEventListener('resize', handler);
  }, []);

  return height;
};
