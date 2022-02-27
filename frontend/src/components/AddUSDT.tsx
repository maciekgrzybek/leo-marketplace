import { useState } from 'react';

type Props = {
  onClick: (amount: number) => Promise<void>;
};

export const AddUSDT = ({ onClick }: Props) => {
  const [amount, setAmount] = useState(0);

  const handleClick = () => {
    onClick(Number(amount));
    setAmount(0);
  };

  return (
    <div className="flex flex-col justify-center items-center mb-10">
      <h3 className="text-2xl font-bold mb-2">Top up USDT</h3>
      <span>
        <span className="mr-3">Add</span>
        <input
          className="text-black bg-transparent border-b border-gray-800 w-14 mr-3"
          type="number"
          value={amount}
          min="1"
          step="1"
          pattern="[0-9]"
          onChange={(e) => {
            setAmount(Number(e.target.value));
          }}
        />{' '}
        <span className="mr-3">USDT to your wallet</span>
        <button
          onClick={handleClick}
          className="text-white bg-gray-800 py-2 px-5 text-sm rounded-lg mb-2 font-bold"
        >
          Add
        </button>
      </span>
    </div>
  );
};
