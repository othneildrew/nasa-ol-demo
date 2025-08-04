import React, { useCallback, useRef, useState } from 'react';
import { type PreloadedEvent, usePreloadedEvents } from '../hooks/use-preloaded-events.tsx';

export interface EventsModalProps {
  open: boolean;
  onClose: () => void;
  onLoadEvent: (e: PreloadedEvent) => void;
}

export const EventsModal = ({ open, onClose, onLoadEvent }: EventsModalProps) => {
  const [events] = usePreloadedEvents();
  const ref = useRef<HTMLDialogElement>(null);
  const [selectedEvent, setSelectedEvent] = useState<PreloadedEvent | null>(null);

  const checkSelected = useCallback(
    (event: PreloadedEvent): boolean => {
      if (!selectedEvent) return false;
      const selectedKey = `${selectedEvent.date}-${selectedEvent.event_name}`;
      const testCaseKey = `${event.date}-${event.event_name}`;
      return selectedKey === testCaseKey;
    },
    [selectedEvent]
  );

  if (!open) return null;

  return (
    <dialog
      ref={ref}
      id="events"
      className="z-20 bg-white absolute rounded-md p-4 top-[50%] left-1/2 transform -translate-1/2 w-[50%] h-[50%] max-w-[600px] flex flex-col"
    >
      {/* Main scrollable content */}
      <div className="overflow-auto flex-grow">
        <p className="font-semibold text-xl mb-2">Preloaded Events</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {events.map((event) => {
            const isSelected = checkSelected(event);

            return (
              <div
                key={`${event.date}-${event.event_name}`}
                onClick={() => setSelectedEvent(event)}
                className="cursor-pointer relative group rounded-md overflow-hidden shadow-sm"
              >
                <img
                  src={event.thumbnail}
                  alt={event.event_name}
                  className="w-full h-64 object-cover transition-opacity duration-300 opacity-70 group-hover:opacity-100"
                />

                {/* Overlay */}
                <div
                  className={[
                    'absolute inset-0 flex flex-col justify-center items-center text-center bg-black/50 text-white text-lg px-4 py-2 transition-opacity duration-300 group-hover:opacity-80',
                    isSelected && 'bg-blue-600/68 text-white cursor-default',
                  ].join(' ')}
                >
                  <p className="font-semibold text-white/80">{event.event_name}</p>
                  <p>({event.event_type})</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-t-gray-300 mt-4 pt-2 flex justify-end gap-2">
        <button className="cursor-pointer px-4 py-2 hover:bg-gray-200 rounded" onClick={onClose}>
          Close
        </button>
        <button
          className="cursor-pointer bg-blue-950 text-white rounded px-4 py-2 hover:bg-blue-900 disabled:bg-blue-200 disabled:cursor-default"
          disabled={!selectedEvent}
          onClick={() => {
            if (selectedEvent) {
              onLoadEvent(selectedEvent);
              onClose();
            }
          }}
        >
          Show event on map
        </button>
      </div>
    </dialog>
  );
};
