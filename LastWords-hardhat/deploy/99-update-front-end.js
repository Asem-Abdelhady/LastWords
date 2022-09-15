const { ethers, network } = require("hardhat")
const fs = require("fs")
const frontEndContractsFile = "../LastWords-nextjs/constants/networkMapping.json"
const frontEndAbiLocation = "../LastWords-nextjs/constants/"

module.exports = async function () {
    if (process.env.UPDATE_FRONT_END) {
        console.log("updating fornt end...")
        await upddateContractAddresses()
        await updateABI()
    }
}
async function updateABI() {
    const accounts = await ethers.getSigners()
    const lastWordsNft = await ethers.getContractAt("LastWordsNft", accounts[0].address)
    fs.writeFileSync(
        `${frontEndAbiLocation}LastWordsNft.json`,
        lastWordsNft.interface.format(ethers.utils.FormatTypes.json)
    )

    const lastWordsManager = await ethers.getContractAt("LastWordsManager", accounts[0].address)
    fs.writeFileSync(
        `${frontEndAbiLocation}LastWordsManager.json`,
        lastWordsManager.interface.format(ethers.utils.FormatTypes.json)
    )
}

async function upddateContractAddresses() {
    const accounts = await ethers.getSigners()
    const lastWordsManager = await ethers.getContractAt("LastWordsManager", accounts[0].address)
    const chainId = network.config.chainId.toString()
    const contractAddresses = JSON.parse(fs.readFileSync(frontEndContractsFile, "utf8"))
    if (chainId in contractAddresses) {
        if (!contractAddresses[chainId]["LastWordsManager"].includes(lastWordsManager.address)) {
            contractAddresses[chainId]["LastWordsManager"].push(lastWordsManager.address)
        }
    } else {
        contractAddresses[chainId] = { LastWordsManager: [lastWordsManager.address] }
    }
    fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses))
}

module.exports.tags = ["all", "frontend"]
