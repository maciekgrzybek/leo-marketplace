import { useEffect, useState } from 'react';
import { BigNumber, Contract, ethers } from 'ethers';
import { abi as marketPlaceAbi } from '../contracts/Marketplace.sol/Marketplace.json';
import { abi as leonNFTContractAbi } from '../contracts/LeonNFT.sol/LeonNFT.json';
import { abi as leoTokenContractAbi } from '../contracts/LeoToken.sol/LeoToken.json';
import { abi as USDTokenContractAbi } from '../contracts/USDToken.sol/USDToken.json';

import { address as marketPlaceAddress } from '../contracts/Marketplace.sol/contract-address.json';
import { address as leonNFTContractAddress } from '../contracts/LeonNFT.sol/contract-address.json';
import { address as leoTokenContractAddress } from '../contracts/LeoToken.sol/contract-address.json';
import { address as USDTokenContractAddress } from '../contracts/USDToken.sol/contract-address.json';
import './App.css';
import { ConnectButton } from './components/ConnectButton';
import { AddUSDT } from './components/AddUSDT';
import { AccountDetails } from './components/AccountDetails';
import { Nfts } from './components/Nfts';
import { BuyTokens } from './components/BuyTokens';

export type Balance = { balance: number; id: number };

function App() {
  let [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(
    null
  );
  let [marketplaceContract, setMarketplaceContract] = useState<Contract | null>(
    null
  );
  let [leonNFTContract, setLeonNFTContract] = useState<Contract | null>(null);
  let [leoTokenContract, setLeoTokenContract] = useState<Contract | null>(null);
  let [USDTokenContract, setUSDTokenContract] = useState<Contract | null>(null);

  let [signerAddress, setSignerAddress] = useState<string>();

  let [USDTBalance, setUSDTBalance] = useState<number>(0);
  let [leoTokenBalance, setLeoTokenBalance] = useState<number>(0);
  let [availableNfts, setAvailableNfts] = useState<Balance[]>([]);
  let [usersNfts, setUsersNfts] = useState<Balance[]>([]);
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

  const setContracts = (signer: ethers.providers.JsonRpcSigner) => {
    const _marketplaceContract = new ethers.Contract(
      marketPlaceAddress,
      marketPlaceAbi,
      signer
    );
    const _leonNFTContract = new ethers.Contract(
      leonNFTContractAddress,
      leonNFTContractAbi,
      signer
    );
    const _leoTokenContract = new ethers.Contract(
      leoTokenContractAddress,
      leoTokenContractAbi,
      signer
    );
    const _USDTokenContract = new ethers.Contract(
      USDTokenContractAddress,
      USDTokenContractAbi,
      signer
    );
    setMarketplaceContract(_marketplaceContract);
    setLeonNFTContract(_leonNFTContract);
    setLeoTokenContract(_leoTokenContract);
    setUSDTokenContract(_USDTokenContract);
  };

  const handleConnect = async () => {
    const signer = await getSigner();
    if (signer) setContracts(signer);
    const _signerAddress = await signer?.getAddress();
    setSignerAddress(_signerAddress);
  };

  useEffect(() => {
    if (leonNFTContract) {
      getLeonNFTBalance();
      leonNFTContract.on('TransferSingle', getLeonNFTBalance);
    }
  }, [leonNFTContract, signerAddress]);

  useEffect(() => {
    if (leonNFTContract) {
      const getUri = async () => {
        const _uri = await leonNFTContract?.uri(0);
        setLeonTokenUri(_uri);
      };
      getUri();
    }
  }, [leonNFTContract]);

  const mintUSDTokens = async (amount: number) => {
    if (marketplaceContract && USDTokenContract) {
      await USDTokenContract.mintUSDT(
        signerAddress,
        ethers.BigNumber.from(amount).mul(ethers.BigNumber.from(10).pow(6))
      );
    }
  };

  useEffect(() => {
    if (USDTokenContract && signerAddress) {
      const handleUSDTChange = async () => {
        const _balance = await USDTokenContract?.balanceOf(signerAddress);
        setUSDTBalance(_balance);
      };
      handleUSDTChange();
      USDTokenContract.on('Transfer', handleUSDTChange);
    }
  }, [USDTokenContract, signerAddress]);

  useEffect(() => {
    if (leoTokenContract && signerAddress) {
      const handleLeoTokenChange = async () => {
        const _balance = await leoTokenContract?.balanceOf(signerAddress);
        setLeoTokenBalance(_balance);
      };
      handleLeoTokenChange();
      leoTokenContract.on('Transfer', handleLeoTokenChange);
    }
  }, [leoTokenContract, signerAddress]);

  const exchangeLeocodeTokensToUSDT = async (amount: BigNumber) => {
    if (leoTokenContract && marketplaceContract) {
      await leoTokenContract.approve(marketPlaceAddress, amount);
      await marketplaceContract.exchange(
        leoTokenContractAddress,
        USDTokenContractAddress,
        amount
      );
    }
  };

  const exchangeUSDTToLeocodeToken = async (amount: BigNumber) => {
    if (USDTokenContract && marketplaceContract) {
      await USDTokenContract.approve(marketPlaceAddress, amount);
      await marketplaceContract.exchange(
        USDTokenContractAddress,
        leoTokenContractAddress,
        amount
      );
    }
  };

  const getLeonNFTBalance = async () => {
    try {
      if (leonNFTContract && signerAddress) {
        const _leonNftBalance = await leonNFTContract.balanceOfBatch(
          [
            ...Array(3).fill(marketPlaceAddress),
            ...Array(3).fill(signerAddress),
          ],
          [0, 1, 2, 0, 1, 2]
        );
        const half = Math.ceil(_leonNftBalance.length / 2);
        setAvailableNfts(
          _leonNftBalance
            .slice(0, half)
            .map((balance: number, i: number) => ({ balance, id: i }))
        );
        setUsersNfts(
          _leonNftBalance
            .slice(-half)
            .map((balance: number, i: number) => ({ balance, id: i }))
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const buyNft = async (id: string, type: 'usdt' | 'leocode') => {
    const payFromContract =
      type === 'usdt' ? USDTokenContract : leoTokenContract;
    const payFromContractAddress =
      type === 'usdt' ? USDTokenContractAddress : leoTokenContractAddress;
    if (payFromContract && marketplaceContract) {
      await payFromContract.approve(
        marketPlaceAddress,
        ethers.utils.parseUnits('200', 18)
      );
      await marketplaceContract.buyNft(id, payFromContractAddress);
    }
  };

  const sellNft = async (id: string, type: 'usdt' | 'leocode') => {
    const payFromContractAddress =
      type === 'usdt' ? USDTokenContractAddress : leoTokenContractAddress;

    if (marketplaceContract && leonNFTContract) {
      await leonNFTContract.setApprovalForAll(marketPlaceAddress, true);
      await marketplaceContract.sellNft(id, payFromContractAddress);
    }
  };

  return (
    <div className="flex justify-center align-items flex-col items-center py-10 px-6 min-h-screen">
      <h1 className="text-5xl mb-8 font-bold text-center">
        Leocode Marketplace
      </h1>
      {signerAddress && marketplaceContract ? (
        <div className="max-w-full">
          <AccountDetails
            USDTbalance={ethers.utils.formatUnits(USDTBalance, 6).toString()}
            leoTokenBalance={ethers.utils
              .formatUnits(leoTokenBalance, 18)
              .toString()}
            signerAddress={signerAddress}
          />

          <Nfts
            tokens={usersNfts}
            uri={leonTokenUri}
            onButtonClick={sellNft}
            type="user"
          />
          <div className="mb-5">
            <AddUSDT onClick={mintUSDTokens} />
          </div>
          <div className="flex gap-5 justify-center flex-col">
            <BuyTokens
              type="leocodeToUSDT"
              onClick={exchangeLeocodeTokensToUSDT}
            />
            <BuyTokens
              type="USDTToLeocode"
              onClick={exchangeUSDTToLeocodeToken}
            />
          </div>
          <Nfts
            tokens={availableNfts}
            uri={leonTokenUri}
            onButtonClick={buyNft}
            type="available"
          />
        </div>
      ) : (
        <ConnectButton onClick={handleConnect} />
      )}
    </div>
  );
}

export default App;
