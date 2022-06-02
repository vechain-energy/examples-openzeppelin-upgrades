const hre = require("hardhat")
const fs = require('fs')
const UUPSUpgradeable = require('@openzeppelin/contracts/build/contracts/UUPSUpgradeable.json')
const status = require('../status.json')

async function main() {
  const [deployer] = await hre.thor.getSigners()
  const address = await deployer.getAddress()
  
  const myToken = await hre.thor.getContractAt("MyToken_v2", status.proxyAddress)

  const {events} = await (await myToken.safeMint(address)).wait()
  events.forEach(({args}) => {
    console.log(`Minted Token #${args.tokenId} to ${args.to}`)
  })
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
