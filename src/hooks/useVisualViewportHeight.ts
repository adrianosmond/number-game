import { useEffect, useState } from 'react';

export default () => {
  const [height, setHeight] = useState(`${visualViewport.height}px`);

  useEffect(() => {
    const handler: () => void = () => {
      setHeight(`${visualViewport.height}px`);
    };
    window.visualViewport.addEventListener('resize', handler);
    return () => window.visualViewport.removeEventListener('resize', handler);
  }, []);

  return height;
};
