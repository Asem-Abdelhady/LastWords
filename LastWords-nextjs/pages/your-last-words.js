import Head from "next/head"
import Image from "next/image"
import styles from "../styles/Home.module.css"
import { Button, Form, useNotification } from "web3uikit"
import { ethers } from "ethers"
import { useMoralis, useWeb3Contract } from "react-moralis"
import LastWordsNftAbi from "../constants/LastWordsNft.json"
import { useEffect, useState } from "react"

export default function Home() {
    const { chainId, account, isWeb3Enabled } = useMoralis()
    const LastWordsNftAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3"
    const { runContractFunction } = useWeb3Contract()

    async function mint() {
        const mintOptions = {
            abi: LastWordsNftAbi,
            contractAddress: LastWordsNftAddress,
            functionName: "mintNft",
            chainId: 31337,
            params: {
                holder: account,
                tokenURI: "ipfs://QmY9nfJ6iSYzUDgMvAMVw3ngguvhK9cuQzS6z8TgX1Ufuo",
            },
        }

        await runContractFunction({
            params: mintOptions,
            onSuccess: () => console.log("minted"),
            onError: () => console.log("Not minted"),
        })
        console.log("Finished minting !!")
    }

    return (
        <div>
            <Button theme="primary" text="mint" onClick={mint}></Button>
        </div>
    )
}
