export interface SpinLoaderProps {
  isLoading: boolean;
  text?: string;
}

export const SimpleTextLoader = ({ isLoading, text = 'Loading map data' }: SpinLoaderProps) => {
  return isLoading ? (
    <div className="absolute top-0 left-0 w-full h-full rounded-none flex justify-center items-center">
      <div className="bg-white/32 p-7 rounded-md">
        <p className="text-xl">{text}</p>
      </div>
    </div>
  ) : null;
};
