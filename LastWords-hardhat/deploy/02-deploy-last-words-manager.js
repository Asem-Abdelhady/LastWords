const { ethers, network } = require("hardhat")
const { networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
const { developmentChains } = require("../helper-hardhat-config")

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    const accounts = await ethers.getSigners()
    const chainId = network.config.chainId
    console.log("Chain ID from manager", chainId)

    const lastWordsNft = await ethers.getContract("LastWordsNft")
    const registerationsFee = networkConfig[chainId]["registerationsFee"]
    const interval = networkConfig[chainId]["interval"]

    const args = [registerationsFee, interval, lastWordsNft.address]

    const lastWordsManager = await deploy("LastWordsManager", {
        from: deployer,
        log: true,
        args: args,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(lastWordsManager.address, args)
    }
    log("----------------------------------------------------")
}

module.exports.tags = ["all", "manager"]
