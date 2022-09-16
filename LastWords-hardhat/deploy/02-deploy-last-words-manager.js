const { ethers, network } = require("hardhat")
const { networkConfig } = require("../helper-hardhat-config")

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    const accounts = await ethers.getSigners()
    const chainId = network.config.chainId
    console.log("Chain ID from manager", chainId)

    const lastWordsNft = await ethers.getContract("LastWordsNft")
    const registerationsFee = networkConfig[chainId]["registerationsFee"]

    const args = [registerationsFee, lastWordsNft.address]

    const lastWordsManager = await deploy("LastWordsManager", {
        from: deployer,
        log: true,
        args: args,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    console.log("----------------------------")
}

module.exports.tags = ["all", "manager"]
