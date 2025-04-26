import { BsFillPauseFill, BsFillPlayFill } from "react-icons/bs";
import { twMerge } from "tailwind-merge";

export const PlayPauseButton = ({
  onClick,
  isGameRunning,
}: {
  onClick: () => void;
  isGameRunning: boolean;
}) => {
  return (
    <button
      className={twMerge(
        "flex items-center justify-center h-8 w-8 rounded-full shadow-md transition ease-in ",
        isGameRunning
          ? "bg-gray-700 hover:bg-gray-800"
          : "bg-green-500 hover:bg-green-700"
      )}
      onClick={onClick}
    >
      {isGameRunning ? (
        <BsFillPauseFill className="h-6 w-6" />
      ) : (
        <BsFillPlayFill className="h-6 w-6" />
      )}
    </button>
  );
};
