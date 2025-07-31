import { type RefObject, useEffect, useRef } from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

export interface UseOpenLayersProps {
  containerRef: RefObject<HTMLDivElement | null>;
  options?: Partial<ConstructorParameters<typeof Map>[0]>;
}

export const DEFAULT_MAP_OPTIONS: Partial<ConstructorParameters<typeof Map>[0]> = {
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
  ],
  view: new View({
    center: [0, 0],
    zoom: 14,
  }),
};

export const useOpenLayersMap = ({ containerRef, options }: UseOpenLayersProps) => {
  const mapRef = useRef<Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      throw new Error('Unable to create ol map instance. Check container or map ref.');
    }

    mapRef.current = new Map({
      target: containerRef.current,
      ...DEFAULT_MAP_OPTIONS,
      ...options,
    });

    return () => {
      //
      mapRef.current?.setTarget(undefined);
      mapRef.current = null;
    };
  }, [containerRef, options]);

  return mapRef.current;
};
