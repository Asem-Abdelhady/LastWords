const { moveBlocks } = require("../utils/move-blocks")
const BLOCKS = 2
const SLEEP_AMOUNT = 1000

async function mine() {
    await moveBlocks(BLOCKS, (sleepAmount = 1000))
}

mine()
