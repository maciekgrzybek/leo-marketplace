const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Marketplace', () => {
  let leoTokenInstance;
  let usdTokenInstance;
  let leonNFTInstance;
  let marketplaceInstance;
  let buyer;

  beforeEach(async () => {
    const LeoToken = await ethers.getContractFactory('LeoToken');
    const USDToken = await ethers.getContractFactory('USDToken');
    const LeonNFT = await ethers.getContractFactory('LeonNFT');

    leoTokenInstance = await LeoToken.deploy();
    usdTokenInstance = await USDToken.deploy();
    leonNFTInstance = await LeonNFT.deploy();

    await leoTokenInstance.deployed();
    await usdTokenInstance.deployed();
    await leonNFTInstance.deployed();

    const Marketplace = await ethers.getContractFactory('Marketplace');
    marketplaceInstance = await Marketplace.deploy(
      leoTokenInstance.address,
      usdTokenInstance.address,
      leonNFTInstance.address
    );
    await marketplaceInstance.deployed();

    [buyer] = await ethers.getSigners();

    await usdTokenInstance.mintUSDT(
      marketplaceInstance.address,
      100_000 * 10 ** 6
    );
    await usdTokenInstance.mintUSDT(buyer.address, 100_000 * 10 ** 6);
    await leoTokenInstance.transfer(
      marketplaceInstance.address,
      ethers.BigNumber.from(300).mul(ethers.BigNumber.from(10).pow(18))
    );
    await leonNFTInstance.mintMarketplace(marketplaceInstance.address);
  });

  describe('Exchange', () => {
    it('allows to exchange LeoTokens to USDTokens', async () => {
      //  200 LEO -> 6 USDT
      const leoToSend = '200';
      const USDTToReceive = '6';

      const initialBalance = await usdTokenInstance.balanceOf(buyer.address);
      const amountToSend = ethers.utils.parseUnits(leoToSend, 18);

      await leoTokenInstance.approve(
        marketplaceInstance.address,
        ethers.utils.parseUnits(leoToSend, 18)
      );

      await marketplaceInstance.exchange(
        leoTokenInstance.address,
        usdTokenInstance.address,
        amountToSend
      );

      expect(await usdTokenInstance.balanceOf(buyer.address)).to.equal(
        initialBalance.add(ethers.utils.parseUnits(USDTToReceive, 6))
      );
    });

    it('allows to exchange USDTokens to LeoTokens', async () => {
      //  9 USDT -> 300 LEO
      const USDTToSend = '9';
      const leoToReceive = '300';

      const initialBalance = await leoTokenInstance.balanceOf(buyer.address);
      const amountToSend = ethers.utils.parseUnits(USDTToSend, 6);

      await usdTokenInstance.approve(
        marketplaceInstance.address,
        ethers.utils.parseUnits(USDTToSend, 6)
      );

      await marketplaceInstance.exchange(
        usdTokenInstance.address,
        leoTokenInstance.address,
        amountToSend
      );

      expect(await leoTokenInstance.balanceOf(buyer.address)).to.equal(
        initialBalance.add(ethers.utils.parseUnits(leoToReceive, 18))
      );
    });
  });

  describe('Buying and Selling NFT', () => {
    it('allows to buy Leon NFT for Leo Tokens', async () => {
      const buyPrice = ethers.utils.parseUnits('200', 18);
      const initialLeoBalance = await leoTokenInstance.balanceOf(
        marketplaceInstance.address
      );
      await leoTokenInstance.approve(marketplaceInstance.address, buyPrice);
      await marketplaceInstance.buyNft(0, leoTokenInstance.address);

      // Assert NFT balances
      expect(await leonNFTInstance.balanceOf(buyer.address, 0)).to.equal(1);
      expect(
        await leonNFTInstance.balanceOf(marketplaceInstance.address, 0)
      ).to.equal(0);

      // Assert LeoToken balance
      expect(
        await leoTokenInstance.balanceOf(marketplaceInstance.address)
      ).to.equal(initialLeoBalance.add(buyPrice));
    });

    it('allows to buy Leon NFT for USD Tokens', async () => {
      const buyPrice = ethers.utils.parseUnits('15', 5); // 6 decimals divide by 10 (due to the fact that we need to multiply 1.5 * 10)
      const initialUSDTBalance = await usdTokenInstance.balanceOf(
        marketplaceInstance.address
      );
      await usdTokenInstance.approve(marketplaceInstance.address, buyPrice);
      await marketplaceInstance.buyNft(0, usdTokenInstance.address);

      // Assert NFT balances
      expect(await leonNFTInstance.balanceOf(buyer.address, 0)).to.equal(1);
      expect(
        await leonNFTInstance.balanceOf(marketplaceInstance.address, 0)
      ).to.equal(0);

      // Assert USDT balance
      expect(
        await usdTokenInstance.balanceOf(marketplaceInstance.address)
      ).to.equal(initialUSDTBalance.add(buyPrice));
    });

    it('allows to sell Leon NFT for Leo Tokens', async () => {
      // Buy the NFT first
      const sellPrice = ethers.utils.parseUnits('200', 18);
      await leoTokenInstance.approve(marketplaceInstance.address, sellPrice);
      await marketplaceInstance.buyNft(0, leoTokenInstance.address);

      // Sell the NFT back to the Marketplace
      const initialLeoBalance = await leoTokenInstance.balanceOf(buyer.address);
      await leonNFTInstance.setApprovalForAll(
        marketplaceInstance.address,
        true
      );
      await marketplaceInstance.sellNft(0, leoTokenInstance.address);

      // Assert NFT balance
      expect(
        await leonNFTInstance.balanceOf(marketplaceInstance.address, 0)
      ).to.equal(1);
      expect(await leonNFTInstance.balanceOf(buyer.address, 0)).to.equal(0);

      // Assert LeoToken balance
      expect(await leoTokenInstance.balanceOf(buyer.address)).to.equal(
        initialLeoBalance.add(sellPrice)
      );
    });
    it('allows to sell Leon NFT for USD Tokens', async () => {
      // Buy the NFT first
      const sellPrice = ethers.utils.parseUnits('15', 5); // 6 decimals divide by 10 (due to the fact that we need to multiply 1.5 * 10)
      await usdTokenInstance.approve(marketplaceInstance.address, sellPrice);
      await marketplaceInstance.buyNft(0, usdTokenInstance.address);

      // Sell the NFT back to the Marketplace
      const initialLeoBalance = await usdTokenInstance.balanceOf(buyer.address);
      await leonNFTInstance.setApprovalForAll(
        marketplaceInstance.address,
        true
      );
      await marketplaceInstance.sellNft(0, usdTokenInstance.address);

      // Assert NFT balance
      expect(
        await leonNFTInstance.balanceOf(marketplaceInstance.address, 0)
      ).to.equal(1);
      expect(await leonNFTInstance.balanceOf(buyer.address, 0)).to.equal(0);

      // Assert USDT balance
      expect(await usdTokenInstance.balanceOf(buyer.address)).to.equal(
        initialLeoBalance.add(sellPrice)
      );
    });
  });
});
