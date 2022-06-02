const hre = require("hardhat")
const fs = require('fs')
const UUPSUpgradeable = require('@openzeppelin/contracts/build/contracts/UUPSUpgradeable.json')
const status = require('../status.json')

async function main() {
  await hre.run('compile')

  const MyToken_v2 = await hre.thor.getContractFactory("MyToken_v2")
  const myToken_v2 = await MyToken_v2.deploy()
  console.log("MyToken 2.0 deployed to:", myToken_v2.address)

  const proxy = await hre.thor.getContractAt(UUPSUpgradeable.abi, status.proxyAddress)
  await proxy.upgradeTo(myToken_v2.address)
  console.log("Proxy upgraded to:", myToken_v2.address)

  fs.writeFileSync('./status.json', JSON.stringify({ ...status, myToken_v2Address: myToken_v2.address }, "", 2))

  const [deployer] = await hre.thor.getSigners()
  const address = await deployer.getAddress()
  const proxiedMyToken = await hre.thor.getContractAt("MyToken_v2", status.proxyAddress)

  await proxiedMyToken.safeMint(address)
  console.log(`Minted Token to ${address}`)

  const owner = await proxiedMyToken.owner()
  console.log(`Contract Owner is ${owner}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
