import { useEffect, useState } from 'react';

type Props = {
  tokens: number[];
  uri: string;
};
export const Nfts = ({ tokens, uri }: Props) => {
  const [nfts, setNfts] = useState([]);
  useEffect(() => {
    if (tokens && uri) {
      const getData = async () => {
        return Promise.all(
          tokens.map(async (balance, index) => {
            if (!balance) return;
            const parsedUri = uri.replace('{id}', `${index}`);
            const data = await fetch(parsedUri);
            return data.json();
          })
        );
      };

      getData().then((d) => setNfts(d));
    }
  }, [tokens, uri]);
  return (
    <ul>
      {nfts.map(({ name, description, image }) => {
        return (
          <li key={name}>
            <img src={image} className="w-12" />
            <h4>{name}</h4>
            <p>{description}</p>
          </li>
        );
      })}
    </ul>
  );
};
