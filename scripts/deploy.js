const fs = require('fs');
const path = require('path');

const saveContractAddress = (address, contractName = 'Marketplace') => {
  fs.writeFileSync(
    `${path.resolve(
      __dirname,
      '../',
      'artifacts',
      'contracts',
      `${contractName}.sol`
    )}/contract-address.json`,
    JSON.stringify({ address }),
    (err) => {
      if (err) {
        console.error(err);
        return;
      }
    }
  );
};

const copyFolder = () => {
  const srcDir = path.resolve(__dirname, '../', 'artifacts', 'contracts');
  const destDir = path.resolve(__dirname, './');

  // To copy a folder or file
  fse.copySync(srcDir, destDir, function (err) {
    if (err) {
      console.error(err);
      {
        overwrite: true;
      } // add if you want to replace existing folder or file with same name
    } else {
      console.log('success!');
    }
  });
};

async function main() {
  const LeoToken = await ethers.getContractFactory('LeoToken');
  const USDToken = await ethers.getContractFactory('USDToken');
  const LeonNFT = await ethers.getContractFactory('LeonNFT');

  const leoTokenInstance = await LeoToken.deploy();
  const usdTokenInstance = await USDToken.deploy();
  const leonNFTInstance = await LeonNFT.deploy();

  await leoTokenInstance.deployed();
  saveContractAddress(leoTokenInstance.address, 'LeoToken');
  await usdTokenInstance.deployed();
  saveContractAddress(usdTokenInstance.address, 'USDToken');
  await leonNFTInstance.deployed();
  saveContractAddress(leonNFTInstance.address, 'LeonNFT');

  const Marketplace = await ethers.getContractFactory('Marketplace');
  const marketplaceInstance = await Marketplace.deploy(
    leoTokenInstance.address,
    usdTokenInstance.address,
    leonNFTInstance.address
  );
  await marketplaceInstance.deployed();
  saveContractAddress(marketplaceInstance.address, 'Marketplace');

  await leonNFTInstance.mintMarketplace(marketplaceInstance.address);
  await usdTokenInstance.mintUSDT(
    marketplaceInstance.address,
    100000 * 10 ** 6
  );
  await leoTokenInstance.transfer(
    marketplaceInstance.address,
    ethers.BigNumber.from(3000).mul(ethers.BigNumber.from(10).pow(18))
  );

  copyFolder();

  console.log('Marketplace deployed to:', marketplaceInstance.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
