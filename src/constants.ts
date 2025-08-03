export const NASA_GIBS_WMTS_CAPABILITIES_URL =
  'https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/wmts.cgi?request=GetCapabilities&service=WMTS&version=1.0.0';

export const PREFERRED_MATRIX_SETS = [
  'EPSG4326_250m',
  'EPSG4326_500m',
  'EPSG4326_1km',
  'EPSG4326_2km',
] as const;

type MatrixSet = typeof PREFERRED_MATRIX_SETS[number];

export const ALLOWED_WMTS_MAP_LAYERS = [
  'MODIS_Terra_CorrectedReflectance_TrueColor',
];

export const FIXED_MAP_ZOOM_RESOLUTIONS = [
  0.5625,
  0.28125,
  0.140625,
  0.0703125,
  0.03515625,
  0.017578125,
  0.0087890625,
  0.00439453125,
  0.002197265625,
];
