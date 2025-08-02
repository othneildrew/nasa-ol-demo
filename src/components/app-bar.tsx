export interface ControlProps {
  selectedLayer?: string;
  isLoading?: boolean;
  availableLayers: string[];
  error: string | null;
  handleChangeLayer: (value: string) => void;
}

export const AppBar = ({
  selectedLayer,
  handleChangeLayer,
  isLoading,
  availableLayers = [],
  error,
}: ControlProps) => {
  return (
    <div className="bg-[#01030D] text-white/78 w-full h-[100px] p-2">
      <h1>NASA GIBS WMTS Map (EPSG:4326)</h1>
      <div className="mt-2">
        <label>
          Layer:&nbsp;
          {availableLayers.length ? (
            <select
              className="w-[360px] rounded-lg border-none bg-white/5 px-3 py-1 text-sm/6 text-white *:text-black"
              value={selectedLayer}
              onChange={(e) => handleChangeLayer(e.target.value)}
              disabled={isLoading}
            >
              {availableLayers.map((layer) => (
                <option key={layer} value={layer}>
                  {layer.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          ) : null}
        </label>
        <div>
          {error && <span className="text-red-500">Error: {error}</span>}
        </div>
      </div>
    </div>
  );
};
