import React from "react";

export const SpeedSelect = ({
  speed,
  onChange,
}: {
  speed: number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) => {
  return (
    <select
      className="bg-gray-500 px-2 py-1 rounded-3xl hover:bg-gray-700 cursor-pointer text-center transition ease-in"
      value={speed}
      onChange={onChange}
    >
      <option value={25}>Fast</option>
      <option value={100}>Normal</option>
      <option value={250}>Moderate</option>
      <option value={500}>Slow</option>
    </select>
  );
};
