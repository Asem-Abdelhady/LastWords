import Head from "next/head"
import Image from "next/image"
import PassedAwayUser from "../components/PassedAwayUser"
import styles from "../styles/Home.module.css"
import CardGroup from "react-bootstrap/CardGroup"
import { useMoralis, useMoralisQuery } from "react-moralis"

export default function Home() {
    const { isWeb3Enabled } = useMoralis("")
    const { data: listedNfts, isFetching: fetchingListedNfts } = useMoralisQuery(
        "PassedAwayUser",
        (query) => query.limit(10)
    )

    return (
        <div className="container mx-auto">
            <h1 className="py-4 px-4 font-bold text-2xl">Receently Listed</h1>
            <div className="flex flex-wrap">
                {isWeb3Enabled ? (
                    fetchingListedNfts ? (
                        <div>Loading....</div>
                    ) : (
                        listedNfts.map((nft) => {
                            console.log("Attributes:", nft.attributes)
                            const { tokenId, tokenURI, holder } = nft.attributes
                            return (
                                <div className="m-2">
                                    <PassedAwayUser
                                        tokenId={tokenId}
                                        owner={holder}
                                        key={`${tokenId}${holder}`}
                                    />
                                </div>
                            )
                        })
                    )
                ) : (
                    <div>Web3 Currently not enabled</div>
                )}
            </div>
        </div>
    )
}
