import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { Balance } from '../App';

type TokenInfo = {
  name: string;
  description: string;
  image: string;
  id: string;
};

type Props = {
  tokens: Balance[];
  uri: string;
  onButtonClick: (id: string, type: 'usdt' | 'leocode') => Promise<void>;
  type: 'available' | 'user';
};

export const Nfts = ({ tokens, uri, onButtonClick, type }: Props) => {
  const isAvailableType = type === 'available';
  const [nfts, setNfts] = useState<TokenInfo[]>([]);

  useEffect(() => {
    if (tokens.length && uri) {
      const getData = async (): Promise<TokenInfo[]> => {
        return Promise.all(
          tokens.map(async ({ balance, id }) => {
            if (ethers.BigNumber.from(balance).toNumber() === 0) return;
            const parsedUri = uri.replace('{id}', `${id}`);
            const data = await fetch(parsedUri);
            const newData = await data.json();

            return { ...newData, id: ethers.BigNumber.from(id).toNumber() };
          })
        );
      };

      getData().then((d) => {
        setNfts(d.filter(Boolean));
      });
    }
  }, [tokens, uri]);

  return (
    <div className="text-center mt-6 mb-10">
      <h3 className="text-2xl font-bold mb-8">
        {isAvailableType ? 'Available' : 'Your'} tokens:
      </h3>
      {nfts.length === 0 && (
        <h3 className="text-2xl font-bold mb-2 text-center">
          {isAvailableType
            ? 'There are no available tokens'
            : 'You do not own any tokens'}
        </h3>
      )}
      <ul className="flex justify-center flex-col lg:grid lg:grid-cols-2 lg:gap-4">
        {nfts.map(({ name, description, image, id }) => {
          return (
            <li key={name} className="mb-8">
              <div className="flex flex-col items-center text-center bg-white rounded-xl shadow text-gray-800 p-10">
                <img src={image} className="w-44 h-44 mb-4" />
                <h4 className="text-2xl mb-1 font-semibold">{name}</h4>
                <p className="mb-6">{description}</p>
                <div className="flex flex-col items-center text-center">
                  <button
                    className="text-white bg-gray-800 py-2 px-5 text-sm rounded-lg mb-2 font-bold"
                    onClick={() => {
                      onButtonClick(id, 'leocode');
                    }}
                  >
                    {isAvailableType ? 'Buy' : 'Sell'} for LeocodeTokens
                  </button>
                  <button
                    className="text-white bg-gray-800 py-2 px-5 text-sm rounded-lg mb-2 font-bold"
                    onClick={() => onButtonClick(id, 'usdt')}
                  >
                    {isAvailableType ? 'Buy' : 'Sell'} for USDT
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
