import { useEffect, useState } from 'react';
import { Contract, ethers } from 'ethers';
import { abi } from '../../artifacts/contracts/Marketplace.sol/Marketplace.json';
import { address as contractAddress } from '../../artifacts/contracts/Marketplace.sol/contract-address.json';
import './App.css';
import { ConnectButton } from './components/ConnectButton';
import { AddUSDT } from './components/AddUSDT';
import { AccountDetails } from './components/AccountDetails';
import { Nfts } from './components/Nfts';

const getLeonTokenBalance = async (contract: Contract) =>
  await contract.getLeonTokenBalance();
const getLeocodeTokenBalance = async (contract: Contract) =>
  await contract.getLeocodeTokenBalance();
const getUSDTokenBalance = async (contract: Contract) =>
  await contract.getUSDTokenBalance();

export type Balance = Record<
  string,
  {
    name: string;
    balance: number;
    decimals: number;
  }
>;

function App() {
  let [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(
    null
  );
  let [contract, setContract] = useState<Contract | null>(null);
  let [signerAddress, setSignerAddress] = useState<string>();
  let [balances, setBalances] = useState<Balance>({});
  let [nfts, setNfts] = useState<number[]>([]);
  let [leonTokenUri, setLeonTokenUri] = useState<string>('');

  useEffect(() => {
    setProvider(new ethers.providers.Web3Provider(window.ethereum));
  }, []);

  const getSigner = async () => {
    if (provider) {
      await provider.send('eth_requestAccounts', []);
      return await provider.getSigner();
    }
  };

  const getAllBalances = async (contract: Contract) => {
    return await Promise.all([
      getLeonTokenBalance(contract),
      getLeocodeTokenBalance(contract),
      getUSDTokenBalance(contract),
    ]);
  };

  const handleConnect = async () => {
    const signer = await getSigner();
    const _signerAddress = await signer?.getAddress();
    if (_signerAddress) {
      setSignerAddress(_signerAddress);
      const _contract = new ethers.Contract(contractAddress, abi, signer);
      setContract(_contract);
      const leonTokenUri = await _contract.getLeonTokenUri();
      setLeonTokenUri(leonTokenUri);
      const [leonTokenBalance, leoCodeTokenBalance, USDTokenBalance] =
        await getAllBalances(_contract);
      setNfts(leonTokenBalance);
      setBalances({
        leoCode: {
          name: 'LeoCode Token',
          balance: leoCodeTokenBalance,
          decimals: 18,
        },
        USDT: {
          name: 'USD Token',
          balance: USDTokenBalance,
          decimals: 6,
        },
      });
    }
  };

  const mintUSDTokens = async (amount = 100) => {
    if (contract && signerAddress) {
      await contract.printUSDTokens(amount);
    }
  };

  const buyLeoCodeTokens = async (amount = 200) => {
    if (contract && signerAddress) {
      try {
        await contract.buyLeocodeTokens(amount);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const buyUSDTokens = async (amount = 3) => {
    if (contract && signerAddress) {
      try {
        await contract.buyUSDTokens(amount);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="flex justify-center flex-col items-center py-10 px-6">
      {signerAddress && contract ? (
        <div>
          <AccountDetails balances={balances} signerAddress={signerAddress} />
          <AddUSDT onClick={mintUSDTokens} />
          <Nfts tokens={nfts} uri={leonTokenUri} />
          <button onClick={() => buyLeoCodeTokens()}>buy leocode </button>
          <button onClick={() => buyUSDTokens()}>buy USDT </button>
        </div>
      ) : (
        <ConnectButton onClick={handleConnect} />
      )}
    </div>
  );
}

export default App;
