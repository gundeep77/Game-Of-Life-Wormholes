export const OperationalButton = ({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) => {
  return (
    <button
      onClick={onClick}
      className="bg-gray-500 px-3 py-1 rounded-3xl hover:bg-gray-700 cursor-pointer transition ease-in"
    >
      {children}
    </button>
  );
};
