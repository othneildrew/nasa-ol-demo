import 'ol/ol.css';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AppBar } from './app-bar.tsx';
import { SimpleTextLoader } from './simple-text-loader.tsx';
import { useOpenLayersMap } from '../hooks/use-open-layers-map.tsx';
import {
  createWMTSTileLayer,
  fetchWMTSCapabilities,
  formateStringFromDate,
  getLayerDataFromCapabilities,
} from '../utils.ts';

export const MapView = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(() => formateStringFromDate(new Date()));
  const [availableLayers, setAvailableLayers] = useState<string[]>([]);
  const [selectedLayer, setSelectedLayer] = useState('MODIS_Terra_CorrectedReflectance_TrueColor');

  const ol = useOpenLayersMap({ containerRef });

  useEffect(() => {
    if (!ol.current || !selectedLayer) return;

    const map = ol.current;
    let shouldSetData = true;

    setError(null);
    setLoading(true);

    (async () => {
      try {
        // Set the list of available map layers to choose from on initial page load
        const capabilities = await fetchWMTSCapabilities();
        const { layerIds } = getLayerDataFromCapabilities(capabilities);

        // Create and set the map layer
        const layer = await createWMTSTileLayer(selectedLayer, selectedDate);

        if (layer) {
          map.addLayer(layer);
        }

        setLoading(false);

        if (shouldSetData) {
          // Only set the data if loaded to prevent stale data for older async requests
          setAvailableLayers(layerIds.filter((id) => id.startsWith('MODIS')));
        }
      } catch (err) {
        console.error('Map initialization error:', err);
        setError(err.message);
        setLoading(false);

        // Clean up on error
        if (map) {
          map.setTarget(undefined);
          map.dispose?.();
        }
      }
    })();

    return () => {
      // Prevent old data from loading if unmounting
      shouldSetData = false;
    };
  }, [ol, selectedDate, selectedLayer]);

  const changeLayer = useCallback(
    async (newLayerName: string) => {
      if (!ol.current) return;

      const map = ol.current;

      try {
        setLoading(true);
        setError(null);

        // Remove existing layers and add the new map layer
        map.getLayers().clear();

        const newMapLayer = await createWMTSTileLayer(newLayerName, selectedDate);

        if (newMapLayer) {
          map.addLayer(newMapLayer);
        }

        setSelectedLayer(newLayerName);
        setLoading(false);
      } catch (err) {
        console.error('Layer change error:', err);
        setError(err.message);
        setLoading(false);
      }
    },
    [ol, selectedDate]
  );

  return (
    <div className="relative w-full h-[100%] flex flex-col bg-black">
      <AppBar
        selectedLayer={selectedLayer}
        isLoading={loading}
        availableLayers={availableLayers}
        handleChangeLayer={changeLayer}
        selectedDate={selectedDate}
        handleSelectedDateChange={setSelectedDate}
        error={error}
      />

      <div ref={containerRef} className="relative flex-1">
        <SimpleTextLoader isLoading={loading} />
      </div>
    </div>
  );
};

export default MapView;
