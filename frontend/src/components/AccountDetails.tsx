import { ethers } from 'ethers';

type Props = {
  USDTbalance: string;
  leoTokenBalance: string;
  signerAddress: string;
};

export const AccountDetails = ({
  USDTbalance,
  leoTokenBalance,
  signerAddress,
}: Props) => {
  return (
    <div className="flex flex-col items-center text-center bg-white rounded-xl shadow text-gray-800 p-10">
      <h3 className="text-2xl font-bold mb-2">Your details:</h3>
      <ul className="grid gap-y-2">
        <li className="truncate max-w-xs">
          Address:
          <br /> <span className="font-bold">{signerAddress}</span>
        </li>
        <li>
          USDT balance: <br />
          <span className="font-bold">
            {USDTbalance}
            <br />
          </span>
        </li>
        <li>
          LeoToken balance: <br />
          <span className="font-bold">
            {leoTokenBalance}
            <br />
          </span>
        </li>
      </ul>
    </div>
  );
};
