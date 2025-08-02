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