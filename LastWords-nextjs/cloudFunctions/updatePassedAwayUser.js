Moralis.Cloud.afterSave("NftMinted", async (request) => {
    const confirmed = request.object.get("confirmed")
    const logger = Moralis.Cloud.getLogger()
    logger.info("Looking for confirmed Tx")

    if (confirmed) {
        logger.info("Found Item!")
        const PassedAwayUser = Moralis.Object.extend("PassedAwayUser")

        const query = new Moralis.Query(PassedAwayUser)
        query.equalTo("holder", request.object.get("holder"))
        query.equalTo("tokenURI", request.object.get("tokenURI"))

        logger.info(`LastWordsNft | Query: ${query}`)
        const alreadyListedItem = await query.first()
        console.log(`alreadyListedItem ${JSON.stringify(alreadyListedItem)}`)
        if (alreadyListedItem) {
            logger.info(`Deleting ${alreadyListedItem.id}`)
            await alreadyListedItem.destroy()
            logger.info(
                `Deleted item with tokenId ${request.object.get(
                    "holder"
                )} at address ${request.object.get(
                    "tokenURI"
                )} since the listing is being updated. `
            )
        }

        //create new Entry in the ActiveItem
        const passedAwayUser = new PassedAwayUser()
        passedAwayUser.set("holder", request.object.get("holder"))
        passedAwayUser.set("tokenURI", request.object.get("tokenURI"))

        logger.info(
            `Adding passedAway: ${request.object.get("holder")}. URI: ${request.object.get(
                "tokenURI"
            )}`
        )

        logger.info("Saving...")
        await passedAwayUser.save()
    }
})
