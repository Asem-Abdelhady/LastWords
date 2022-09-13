const { ethers, network } = require("hardhat")
const { upload } = require("../utils/uploadToPinata")
const imageLocation = "./Images/"

async function uploadToIPFSAndMint() {
    const accounts = await ethers.getSigners()
    const lastWordsNft = await ethers.getContractAt("LastWordsNft", accounts[0].address)
    //upload(imageLocation)
    // [
    //     'ipfs://QmY9nfJ6iSYzUDgMvAMVw3ngguvhK9cuQzS6z8TgX1Ufuo',
    //     'ipfs://QmQwPfApNKNMXJTf1PgrUhn7NPLRPv5oAQLdJfpqUMdFNh'
    // ]
    const tokenURI = "ipfs://QmY9nfJ6iSYzUDgMvAMVw3ngguvhK9cuQzS6z8TgX1Ufuo"

    console.log("minting")
    await lastWordsNft.mintNft(tokenURI, accounts[0].address)
    console.log("minted")
}

uploadToIPFSAndMint()
