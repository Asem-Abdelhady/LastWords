const { network } = require("hardhat")

async function move_time() {
    await network.provider.send("evm_increaseTime", [31])
    await network.provider.request({ method: "evm_mine", params: [] })
}

module.exports = { move_time }
