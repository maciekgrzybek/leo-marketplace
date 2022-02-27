import { BigNumber, ethers } from 'ethers';
import { useState } from 'react';

type Props = {
  onClick: (amount: BigNumber) => Promise<void>;
  type: 'leocodeToUSDT' | 'USDTToLeocode';
};

export const BuyTokens = ({ onClick, type }: Props) => {
  const [amount, setAmount] = useState(0);

  const handleClick = () => {
    const _amount = amount * 10 ** 4;
    console.log(
      ethers.BigNumber.from(10)
        .pow(type === 'leocodeToUSDT' ? 18 - 4 : 6 - 4)
        .toString()
    );
    onClick(
      ethers.BigNumber.from(_amount).mul(
        ethers.BigNumber.from(10).pow(type === 'leocodeToUSDT' ? 18 - 4 : 6 - 4)
      ) // TODO: get the decimals from the contract
    );
    setAmount(0);
  };

  return (
    <div className="flex flex-col justify-center items-center mb-8">
      <h3 className="text-2xl font-bold mb-2 text-center">
        Exchange {type === 'leocodeToUSDT' ? 'Leocode Tokens' : 'USDTokens'} to{' '}
        {type !== 'leocodeToUSDT' ? 'Leocode Tokens' : 'USDTokens'}
      </h3>

      <span className="text-center mb-4">
        <span className="mr-3">Exchange</span>
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
        <span className="mr-3">
          {type === 'leocodeToUSDT' ? 'Leocode Tokens' : 'USDTokens'}
          {` `}
          for {type !== 'leocodeToUSDT' ? 'Leocode Tokens' : 'USDTokens'}
        </span>
      </span>
      <button
        onClick={handleClick}
        className="text-white bg-gray-800 py-2 px-5 text-sm rounded-lg mb-2 font-bold"
      >
        Exchange
      </button>
    </div>
  );
};
