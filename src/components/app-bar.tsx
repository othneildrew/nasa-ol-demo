import { useEffect, useState } from 'react';
import { formateStringFromDate } from '../utils.ts';

export interface ControlProps {
  selectedLayer?: string;
  isLoading?: boolean;
  availableLayers: string[];
  error: string | null;
  handleChangeLayer: (value: string) => void;
  handleSelectedDateChange: (date: string) => void;
  selectedDate: string;
  onShowEvents: () => void;
}

export const AppBar = ({
  selectedLayer,
  handleChangeLayer,
  handleSelectedDateChange,
  selectedDate,
  isLoading,
  availableLayers = [],
  error,
  onShowEvents,
}: ControlProps) => {
  const [maxDate, setMaxDate] = useState<string>('');

  const onDateInputChange = (e) => {
    handleSelectedDateChange(e.target.value);
  };

  useEffect(() => {
    // Set max date so user can't pick a date in the future
    setMaxDate(formateStringFromDate(new Date()));
  }, []);

  return (
    <div className="bg-[#01030D] text-white/78 w-full h-auto pt-2 px-6 pb-6">
      <h1 hidden>NASA GIBS WMTS Map (EPSG:4326)</h1>
      <div className="mt-2 flex gap-2 justify-between items-center">
        <div className="flex gap-2 items-center">
          <label className="flex justify-center flex-col gap-1 text-sm font-semibold text-white/55">
            Layer
            <select
              className="w-[480px] rounded-lg border-none bg-white/5 px-3 h-[36px] text-sm/6 *:text-black"
              value={selectedLayer}
              onChange={(e) => handleChangeLayer(e.target.value)}
              disabled={isLoading}
            >
              <option hidden>-</option>
              {availableLayers.map((layer) => (
                <option key={layer} value={layer}>
                  {layer.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold text-white/55">
            Date
            <input
              className="rounded-lg bg-white/5 px-3 h-[36px] [color-scheme:dark] [::-webkit-calendar-picker-indicator:filter:invert(1)]"
              type="date"
              value={selectedDate}
              max={maxDate}
              onChange={onDateInputChange}
            />
          </label>
          {/*<label className="self-end">*/}
          {/*  <input type="checkbox" /> Show HLS layer*/}
          {/*</label>*/}
        </div>
        <button className="cursor-pointer rounded-lg border-none bg-white/10 px-3 h-[36px]" onClick={onShowEvents}>
          Show Events
        </button>
      </div>
      <div>{error && <span className="text-red-500">Error: {error}</span>}</div>
    </div>
  );
};
