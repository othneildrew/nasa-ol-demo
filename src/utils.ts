import { NASA_GIBS_WMTS_CAPABILITIES_URL, PREFERRED_MATRIX_SETS } from './constants.ts';
import { WMTSCapabilities } from 'ol/format';
import WMTS, { optionsFromCapabilities } from 'ol/source/WMTS';
import TileLayer from 'ol/layer/Tile';

interface WMTSLayer {
  Identifier: string;
  TileMatrixSetLink?: Array<{ TileMatrixSet: string }>;
}

export const fetchWMTSCapabilities = async (): Promise<WMTSCapabilities | null> => {
  try {
    let xml = sessionStorage.getItem('capabilities');

    if (!xml) {
      const res = await fetch(NASA_GIBS_WMTS_CAPABILITIES_URL);
      xml = await res.text();

      if (!res.ok) {
        console.error(
          `Failed to fetch (status: ${res.status}) capabilities from ${NASA_GIBS_WMTS_CAPABILITIES_URL}`
        );
        return null;
      }

      sessionStorage.setItem('capabilities', xml);
    }
    return xml ? new WMTSCapabilities().read(xml) : null;
  } catch (err) {
    console.error('Error fetching WMTS capabilities', err);
    return null;
  }
};

export const getLayerDataFromCapabilities = (
  capabilities: WMTSCapabilities | null
): { layers: []; layerIds: string[] } => {
  const layers = capabilities?.Contents?.Layer || [];

  console.log('layersssss:::', capabilities);
  const layerIds = layers.map((l: WMTSLayer) => l.Identifier).sort();
  return { layers, layerIds };
};

export const findCompatibleMatrixSet = (availableMatrixSets: string[]): string | null => {
  // Try preferred matrix sets first
  for (const preferred of PREFERRED_MATRIX_SETS) {
    if (availableMatrixSets.includes(preferred)) {
      return preferred;
    }
  }

  // Fall back to first available
  return availableMatrixSets[0] || null;
};

export const createWMTSTileLayer = async (layerName: string): Promise<TileLayer<WMTS> | null> => {
  const capabilities = await fetchWMTSCapabilities();
  const { layers, layerIds } = getLayerDataFromCapabilities(capabilities);

  console.log('layers:::', layers);

  // Get the requested layer meta
  const layerMetadata = layers.find((l: WMTSLayer) => l.Identifier === layerName);

  if (!layerMetadata) {
    console.error(`Layer ${layerName} not found. Available layers: ${layerIds.join(', ')}`);
    return null;
  }

  // console.log('Layer metadata:', layerMetadata);

  // Get available matrix sets for this layer
  const availableMatrixSets =
    layerMetadata.TileMatrixSetLink?.map((link) => link.TileMatrixSet) || [];
  const matrixSet = findCompatibleMatrixSet(availableMatrixSets);

  if (!matrixSet) {
    console.error(`No compatible matrix set for layer ${layerName}`);
    return null;
  }

  console.log('Using matrix set:', matrixSet);

  // Create WMTS options from capabilities
  const options = optionsFromCapabilities(capabilities, {
    layer: layerName,
    matrixSet: matrixSet,
    crossOrigin: 'anonymous',
  });

  if (!options) {
    console.error('Failed to create WMTS options from capabilities');
    return null;
  }

  return new TileLayer({
    source: new WMTS(options),
  });
};
