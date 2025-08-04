import { type Dispatch, type SetStateAction, useEffect, useState } from 'react';
import type { GeoJSON } from 'ol/format';

export interface PreloadedEvent {
  bounding_box: number[];
  cog: string;
  date: string;
  event_name: string;
  event_type: string;
  geojson: GeoJSON;
  thumbnail: string;
}

export type UsePreLoadedEventsReturnType = [
  PreloadedEvent[],
  Dispatch<SetStateAction<PreloadedEvent[]>>,
];

export const usePreloadedEvents = (): UsePreLoadedEventsReturnType => {
  const [loadedEvents, setLoadedEvents] = useState<PreloadedEvent[]>([]);

  useEffect(() => {
    let shouldLoadEvents: boolean = true;

    (async () => {
      // Lazy load events on mount
      const json = await import('../assets/preloaded_events.json');

      if (shouldLoadEvents) {
        // Only set data if component mounted, prevent stale data
        setLoadedEvents((json.default || json) as PreloadedEvent[]);
      }
    })();

    return () => {
      shouldLoadEvents = false;
    };
  }, []);

  return [loadedEvents, setLoadedEvents];
};
