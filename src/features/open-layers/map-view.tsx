import 'ol/ol.css';
import { useEffect, useRef } from 'react';
import { useOpenLayersMap } from './use-open-layers-map.tsx';

export const MapView = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const ol = useOpenLayersMap({ containerRef });


  useEffect(() => {

  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100dvh',
        border: '3px solid purple',
        backgroundColor: 'transparent',
      }}
    />
  );
};