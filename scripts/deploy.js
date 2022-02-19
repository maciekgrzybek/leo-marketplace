const hre = require('hardhat');
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
      console.log('wtf');
      if (err) {
        console.error(err);
        return;
      }
    }
  );
};

async function main() {
  const LeonToken = await hre.ethers.getContractFactory('LeonToken');
  const leonTokenInstance = await LeonToken.deploy();

  const LeocodeToken = await hre.ethers.getContractFactory('LeocodeToken');
  const leocodeTokenInstance = await LeocodeToken.deploy();

  const USDToken = await hre.ethers.getContractFactory('USDToken');
  const USDTokenInstance = await USDToken.deploy();

  await leonTokenInstance.deployed();
  await leonTokenInstance.deployed();
  await USDTokenInstance.deployed();

  console.log('USDToken deployed to:', USDTokenInstance.address);

  const Marketplace = await hre.ethers.getContractFactory('Marketplace');
  const marketplaceInstance = await Marketplace.deploy(
    leonTokenInstance.address,
    leocodeTokenInstance.address,
    USDTokenInstance.address
  );
  await marketplaceInstance.deployed();

  saveContractAddress(marketplaceInstance.address);

  await leocodeTokenInstance.setupMarketplace(marketplaceInstance.address);
  await USDTokenInstance.setupMarketplace(marketplaceInstance.address);

  console.log('Marketplace deployed to:', marketplaceInstance.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
