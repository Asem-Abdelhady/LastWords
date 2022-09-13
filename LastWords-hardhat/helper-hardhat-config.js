const { ethers } = require("hardhat")

const networkConfig = {
    31337: {
        name: "localhost",
        registerationsFee: ethers.utils.parseEther("2"),
    },

    4: {
        name: "rinkeby",
        registerationsFee: ethers.utils.parseEther("2"),
        waitConfirmations: 6,
    },
}
const developmentChains = ["hardhat", "localhost"]

module.exports = {
    networkConfig,
    developmentChains,
}
