const { ethers } = require("hardhat")

const networkConfig = {
    default: {
        name: "hardhat",
        registerationsFee: ethers.utils.parseEther("0.0001"),
    },

    31337: {
        name: "localhost",
        registerationsFee: ethers.utils.parseEther("0.0001"),
    },

    4: {
        name: "rinkeby",
        registerationsFee: ethers.utils.parseEther("0.0001"),
        waitConfirmations: 6,
    },

    5: {
        name: "gorli",
        registerationsFee: ethers.utils.parseEther("0.0001"),
        waitConfirmations: 6,
    },
}
const developmentChains = ["hardhat", "localhost"]
const VERIFICATION_BLOCK_CONFIRMATIONS = 6

module.exports = {
    networkConfig,
    developmentChains,
    VERIFICATION_BLOCK_CONFIRMATIONS,
}
