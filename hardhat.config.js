require('@nomiclabs/hardhat-waffle');
const { resolve } = require('path');
const { config: dotenvConfig } = require('dotenv');

dotenvConfig({ path: resolve(__dirname, './.env') });

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: 'ganache',
  networks: {
    ganache: {
      url: 'http://127.0.0.1:7545',
    },
    rinkeby: {
      url: process.env.ALCHEMY_RINKEBY_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  solidity: '0.8.4',
};
