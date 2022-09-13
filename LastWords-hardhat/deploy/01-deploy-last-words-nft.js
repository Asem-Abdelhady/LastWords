const { ethers, network } = require("hardhat")

module.exports = async function ({ getNamedAccounts, deployments }) {
    const accounts = await ethers.getSigners()
    const { deployer } = await getNamedAccounts()

    const { deploy, log } = deployments

    const args = []
    console.log("----------------------------")
    const lastWordsNft = await deploy("LastWordsNft", {
        from: deployer,
        log: true,
        args: args,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    console.log("----------------------------")
}
module.exports.tags = ["all", "nft"]
