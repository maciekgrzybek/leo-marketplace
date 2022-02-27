type Props = {
  onClick: () => Promise<void>;
};

export const ConnectButton = ({ onClick }: Props) => (
  <button
    onClick={onClick}
    className="text-white bg-gray-600 text-lg font-bold py-3 px-5 rounded-lg"
  >
    Connect to MetMask
  </button>
);
