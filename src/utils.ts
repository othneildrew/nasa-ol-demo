import { NASA_GIBS_WMTS_CAPABILITIES_URL, PREFERRED_MATRIX_SETS } from './constants.ts';
import { WMTSCapabilities } from 'ol/format';
import WMTS, { optionsFromCapabilities } from 'ol/source/WMTS';
import TileLayer from 'ol/layer/Tile';

interface WMTSLayer {
  Identifier: string;
  TileMatrixSetLink?: Array<{ TileMatrixSet: string }>;
}

let capabilitiesPromise: Promise<WMTSCapabilities | null> | null = null;

const loadWMTSCapabilities = async (): Promise<WMTSCapabilities | null> => {
  try {
    const res = await fetch(NASA_GIBS_WMTS_CAPABILITIES_URL);

    if (!res.ok) {
      console.error(
        `Failed to fetch (status: ${res.status}) capabilities from ${NASA_GIBS_WMTS_CAPABILITIES_URL}`
      );
      return null;
    }

    const xml = await res.text();
    return xml ? new WMTSCapabilities().read(xml) : null;
  } catch (err) {
    console.error('Error fetching WMTS capabilities', err);
    return null;
  }
};

export const fetchWMTSCapabilities = async (): Promise<WMTSCapabilities | null> => {
  if (!capabilitiesPromise) {
    capabilitiesPromise = loadWMTSCapabilities().then((capabilities) => {
      if (!capabilities) capabilitiesPromise = null;
      return capabilities;
    });
  }
  return capabilitiesPromise;
};

export const getLayerDataFromCapabilities = (
  capabilities: WMTSCapabilities | null
): { layers: []; layerIds: string[] } => {
  const layers = capabilities?.Contents?.Layer || [];

  console.log('capabilities:::', capabilities);
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

export const createWMTSTileLayer = async (
  layerName: string,
  dateString = '2020-10-26'
): Promise<TileLayer<WMTS> | null> => {
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

  console.log('options', options);

  const layer = new TileLayer({
    source: new WMTS(options),
  });

  const source = layer.getSource();
  const urls = source?.getUrls();

  // Update the urls dynamically to reflected user selected date
  if (urls) {
    const timeUrls = urls.filter((url) => url.includes('{Time}'));
    const updatedUrls = (timeUrls.length ? timeUrls : urls).map((url) => {
      return url.replace('{Time}', dateString);
    });

    source?.setUrls(updatedUrls);
    source?.refresh();
  }

  return layer;
};

/**
 * Returns formatted date string as `YYYY-MM-DD`.
 * Generally speaking, it is better to use the Intl.DateTimeFormat, but for small
 * demo, string operations are faster since we don't need intl support.
 */
export const formateStringFromDate = (date: Date): string => {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};
