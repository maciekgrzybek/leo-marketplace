import { ethers } from 'ethers';
import { Balance } from '../App';

type Props = {
  balances: Balance;
  signerAddress: string;
};

export const AccountDetails = ({ balances, signerAddress }: Props) => {
  console.log({ balances });
  return (
    <div className="mb-3 bg-orange-600 rounded-lg py-6 px-12 flex justify-center flex-col items-center">
      <h2>You are connected to MetaMask Wallet! </h2>
      <br />
      <h3 className="text-xl mb-2">Your details:</h3>
      <ul>
        <li>
          Address: <span className="font-bold">{signerAddress}</span>
        </li>
        {Object.values(balances).map(({ name, balance, decimals }) => {
          return (
            <li key={name}>
              {name} balance:
              <span className="font-bold">
                {ethers.utils
                  .formatUnits(
                    `${ethers.BigNumber.from(balance).toNumber()}`,
                    decimals
                  )
                  .toString()}
                <br />
                {ethers.BigNumber.from(balance).toNumber()}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
