import { useState } from 'react';

type Props = {
  onClick: (amount: number) => Promise<void>;
};

export const AddUSDT = ({ onClick }: Props) => {
  const [amount, setAmount] = useState();

  const handleClick = () => {
    onClick(Number(amount));
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <input
        className="text-black p-3 mb-2"
        type="number"
        value={amount}
        min="1"
        step="1"
        pattern="[0-9]"
        onInput={(e) => {
          console.log(e.target.value);
          setAmount(Number(e.target.value));
        }}
      />
      <button
        onClick={handleClick}
        className="text-white bg-blue-600 text-lg font-bold py-3 px-5 rounded-lg"
      >
        Top up USDT
      </button>
    </div>
  );
};
