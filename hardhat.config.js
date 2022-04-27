require("@nomiclabs/hardhat-waffle");
require('@vechain.energy/hardhat-thor')

module.exports = {
 solidity: "0.8.4",
 defaultNetwork: "vechain",
 networks: {
    vechain: {
      url: 'https://testnet.veblocks.net',
      privateKey: "0xb79c7c145881219876d4e624f725c439f832b89cbea4e7a7b9cb1f43d8e203f9",
      delegateUrl: 'https://sponsor-testnet.vechain.energy/by/90',
      blockGasLimit: 10000000
    }
  }
};
