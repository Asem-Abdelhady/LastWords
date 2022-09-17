import Head from "next/head"
import Image from "next/image"
import styles from "../styles/Home.module.css"
import { Button, Form, Upload, useNotification } from "web3uikit"
import { ethers } from "ethers"
import { useMoralis, useWeb3Contract } from "react-moralis"
import LastWordsNftAbi from "../constants/LastWordsNft.json"
import LastWordsManagerAbi from "../constants/LastWordsManager.json"
import { useEffect, useState } from "react"

export default function Home() {
    const { chainId, account, isWeb3Enabled } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    const LastWordsNftAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3"
    const contractAddresses = require("../constants/networkMapping.json")
    const lastWordsManagerAddress = contractAddresses[chainString].LastWordsManager[0]
    const { runContractFunction } = useWeb3Contract()
    const dispatch = useNotification()

    //pinata
    const pinataSDK = require("@pinata/sdk")
    const pinataApiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY || ""
    const pinataApiSecret = process.env.NEXT_PUBLIC_PINATA_API_SECRET || ""
    const pinata = pinataSDK(pinataApiKey, pinataApiSecret)

    const [userURI, setUserURI] = useState("0")

    async function uploadToPinata(name, photoIPFS, age, city, lastWords) {
        const metadata = {
            name: name,
            description: lastWords,
            image: photoIPFS,
            attributes: [
                {
                    trait_type: "age",
                    value: age,
                },

                {
                    trait_type: "city",
                    value: city,
                },
            ],
        }

        try {
            const response = await pinata.pinJSONToIPFS(metadata)
            console.log("here")
            return `ipfs://${response.IpfsHash}`
        } catch {
            return null
        }
    }

    async function addUser(data) {
        const name = data.data[0].inputResult
        const photoIPFS = data.data[1].inputResult
        const age = data.data[3].inputResult
        const city = data.data[4].inputResult
        const lastWords = data.data[5].inputResult

        const interval = data.data[2].inputResult
        const tokenURI = await uploadToPinata(name, photoIPFS, age, city, lastWords)
        console.log("token URI", tokenURI)

        runContractFunction({
            params: {
                contractAddress: lastWordsManagerAddress,
                abi: LastWordsManagerAbi,
                functionName: "addUser",
                params: {
                    interval: interval,
                    lastWords: lastWords,
                    tokenURI: tokenURI,
                },
            },
            onError: (error) => console.log(error),
            onSuccess: handleAddUserSuccess,
        })
    }

    async function handleAddUserSuccess(tx) {
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "user Added, please referesh",
            position: "topR",
        })
    }
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

    async function getUserURI() {
        const userURIFromContract = await runContractFunction({
            params: {
                contractAddress: lastWordsManagerAddress,
                abi: LastWordsManagerAbi,
                functionName: "getTokenUri",
                params: {
                    user: account,
                },
                onError: (error) => console.log(error),
            },
        })

        if (userURIFromContract) setUserURI(userURIFromContract.toString())
    }
    useEffect(() => {
        if (isWeb3Enabled) getUserURI()
    }, [userURI, account, isWeb3Enabled, chainId])

    return (
        <div className={styles.container}>
            {userURI != "0" ? (
                <div> Hey {userURI}</div>
            ) : (
                <div>
                    <Form
                        onSubmit={addUser}
                        data={[
                            {
                                name: "Name",
                                type: "text",
                                value: "",
                                key: "name",
                                validation: {
                                    required: true,
                                },
                            },

                            {
                                name: "Photo IPFS link",
                                type: "text",
                                value: "",
                                key: "photo",
                                validation: {
                                    required: true,
                                },
                            },
                            {
                                name: "Interval to check",
                                type: "number",
                                value: "",
                                key: "age",
                                validation: {
                                    required: true,
                                },
                            },
                            {
                                name: "Age",
                                type: "number",
                                value: "",
                                key: "age",
                                validation: {
                                    required: true,
                                },
                            },
                            {
                                name: "City",
                                type: "text",
                                value: "",
                                key: "city",
                                validation: {
                                    required: true,
                                },
                            },
                            {
                                name: "Your last words to the world",
                                type: "textarea",
                                inputWidth: "100%",
                                value: "",
                                key: "lastWords",
                                validation: {
                                    required: true,
                                },
                            },
                        ]}
                        title="You're not registered to use the website, add your last words?"
                        id="Main Form"
                        buttonConfig={{ theme: "primary" }}
                    ></Form>
                </div>
            )}
        </div>
    )
}
