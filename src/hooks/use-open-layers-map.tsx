import { type RefObject, useEffect, useRef } from 'react';
import { Map, View } from 'ol';
import { ScaleLine, defaults as defaultControls } from 'ol/control';

export interface UseOpenLayersProps {
  containerRef: RefObject<HTMLDivElement | null>;
  options?: Partial<ConstructorParameters<typeof Map>[0]>;
}

export const useOpenLayersMap = ({ containerRef, options }: UseOpenLayersProps) => {
  const mapRef = useRef<Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      throw new Error('Unable to create ol map instance. Check container or map ref.');
    }

    mapRef.current = new Map({
      target: containerRef.current,
      controls: defaultControls().extend([
        new ScaleLine({
          units: 'degrees',
        }),
      ]),
      view: new View({
        projection: 'EPSG:4326',
        center: [-64.76276335205254, 17.74294455671927], // approx: USVI
        zoom: 4,
        minZoom: 0,
        maxZoom: 22,
        extent: [-180, -90, 180, 90],
        smoothExtentConstraint: true,
      }),
      ...options,
    });

    return () => {
      mapRef.current?.setTarget(undefined);
      mapRef.current?.dispose?.();
      mapRef.current = null;
    };
  }, [containerRef, options]);

  return mapRef;
};
