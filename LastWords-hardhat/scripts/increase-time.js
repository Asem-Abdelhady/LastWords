const { move_time } = require("../utils/move-time")

async function increase_time() {
    console.log("increasing time by 30")
    await move_time()
    console.log("time increased")
}

increase_time()
