const { ethers, network, deployments } = require("hardhat")
const { upload } = require("../utils/uploadToPinata")
const imageLocation = "./Images/"
const { moveBlocks } = require("../utils/move-blocks")

async function uploadToIPFSAndMint() {
    console.log("Chin Id from script: ", network.config.chainId)

    const accounts = await ethers.getSigners()

    const lastWordsNft = await ethers.getContract("LastWordsNft", accounts[0])
    //upload(imageLocation)
    // [
    //     'ipfs://QmY9nfJ6iSYzUDgMvAMVw3ngguvhK9cuQzS6z8TgX1Ufuo',
    //     'ipfs://QmQwPfApNKNMXJTf1PgrUhn7NPLRPv5oAQLdJfpqUMdFNh'
    // ]
    const tokenURI = "ipfs://QmY9nfJ6iSYzUDgMvAMVw3ngguvhK9cuQzS6z8TgX1Ufuo"

    console.log("minting")
    const response = await lastWordsNft.mintNft(tokenURI, accounts[0].address)
    console.log("contract address: ", lastWordsNft.address)
    const responeReceipt = await response.wait(1)
    console.log("Event: ", responeReceipt.events[0])
    console.log("minted")
    if (network.config.chainId == 31337) {
        await moveBlocks(2, (sleepAmount = 1000))
    }
}

uploadToIPFSAndMint()
