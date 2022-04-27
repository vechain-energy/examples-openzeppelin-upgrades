const hre = require("hardhat")
const fs = require('fs')
const ERC1967Proxy = require('@openzeppelin/contracts/build/contracts/ERC1967Proxy.json')
const Web3EthAbi = require('web3-eth-abi')

async function main() {
  await hre.run('compile')


  // deploy initial contract  
  const MyToken = await hre.thor.getContractFactory("MyToken")
  const myToken = await MyToken.deploy()
  console.log("MyToken 1.0 deployed to:", myToken.address)


  // calculate initialize() call during deployment
  const { abi } = await hre.artifacts.readArtifact("MyToken");
  const callInitialize = Web3EthAbi.encodeFunctionCall(
    abi.find(({ name }) => name === 'initialize'), []
  )

  // deploy proxy
  const Proxy = await hre.thor.getContractFactory(ERC1967Proxy.abi, ERC1967Proxy.bytecode)
  const proxy = await Proxy.deploy(myToken.address, callInitialize)
  console.log("Proxy deployed to:", proxy.address)

  fs.writeFileSync('./status.json', JSON.stringify({ proxyAddress: proxy.address, myToken_v1Address: myToken.address }, "", 2))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
