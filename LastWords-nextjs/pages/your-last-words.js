import Head from "next/head"
import Image from "next/image"
import styles from "../styles/Home.module.css"
import { Button, Form, Upload, useNotification } from "web3uikit"
import { useMoralis, useWeb3Contract } from "react-moralis"
import LastWordsNftAbi from "../constants/LastWordsNft.json"
import LastWordsManagerAbi from "../constants/LastWordsManager.json"
import { useEffect, useState } from "react"

//pinata
const pinataSDK = require("@pinata/sdk")
const pinataApiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY || ""
const pinataApiSecret = process.env.NEXT_PUBLIC_PINATA_API_SECRET || ""
const pinata = pinataSDK(pinataApiKey, pinataApiSecret)

export default function Home() {
    const { chainId, account, isWeb3Enabled, Moralis } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    const LastWordsNftAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3"
    const contractAddresses = require("../constants/networkMapping.json")
    const lastWordsManagerAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512" //contractAddresses[chainString].LastWordsManager[0]
    const [userImageURI, setUserImageURI] = useState("0")
    const [userName, setUserName] = useState("0")
    const [userCity, setUserCity] = useState("0")
    const [userLastWords, setUserLastWords] = useState("0")
    const [userAge, setUserAge] = useState("0")
    const [userInterval, setUserInterval] = useState("0")

    const { runContractFunction } = useWeb3Contract()
    const dispatch = useNotification()

    const [userURI, setUserURI] = useState("0")

    async function uploadToPinata(name, interval, photoIPFS, age, city, lastWords) {
        const metadata = {
            name: name,
            description: lastWords,
            image: photoIPFS,
            attributes: [
                {
                    trait_type: "interval",
                    value: interval,
                },

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
        const tokenURI = await uploadToPinata(name, interval, photoIPFS, age, city, lastWords)
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
                msgValue: Moralis.Units.ETH(2),
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
                functionName: "getTokenURI",
                params: {
                    user: account,
                },
                onError: (error) => console.log(error),
            },
        })
        console.log("User From Contract: ", userURIFromContract)

        if (userURIFromContract) {
            setUserURI(userURIFromContract.toString())
            setUserData(userURIFromContract)
        }
    }

    async function setUserData(tokenURI) {
        if (tokenURI) {
            const requestURL = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")
            const tokenURIResponse = await (await fetch(requestURL)).json()
            const imageURI = tokenURIResponse.image
            const userName = tokenURIResponse.name
            const lastWords = tokenURIResponse.description
            const interval = tokenURIResponse.attributes[0].value
            const age = tokenURIResponse.attributes[1].value
            const city = tokenURIResponse.attributes[2].value

            console.log("Response: ", tokenURIResponse)
            setUserImageURI(imageURI)
            setUserInterval(interval)
            setUserAge(age)
            setUserCity(city)
            setUserLastWords(lastWords)
            setUserName(userName)

            //const imageURIURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/")
            // setImageURI(imageURIURL)
            // setTokenName(tokenURIResponse.name)
            // setTokenDescription(tokenURIResponse.description)
        }
    }
    useEffect(() => {
        if (isWeb3Enabled) getUserURI()
    }, [userURI, account, isWeb3Enabled, chainId])

    return (
        <div className={styles.container}>
            {userURI != "0" ? (
                <div>
                    <Form
                        onSubmit={addUser}
                        data={[
                            {
                                name: "Name",
                                type: "text",
                                value: userName,
                                key: "name",
                                validation: {
                                    required: true,
                                },
                            },

                            {
                                name: "Photo IPFS link",
                                type: "text",
                                value: userImageURI,
                                key: "photo",
                                validation: {
                                    required: true,
                                },
                            },
                            {
                                name: "Interval to check",
                                type: "number",
                                value: userInterval,
                                key: "age",
                                validation: {
                                    required: true,
                                },
                            },
                            {
                                name: "Age",
                                type: "number",
                                value: userAge,
                                key: "age",
                                validation: {
                                    required: true,
                                },
                            },
                            {
                                name: "City",
                                type: "text",
                                value: userCity,
                                key: "city",
                                validation: {
                                    required: true,
                                },
                            },
                            {
                                name: "Your last words to the world",
                                type: "textarea",
                                inputWidth: "100%",
                                value: userLastWords,
                                key: "lastWords",
                                validation: {
                                    required: true,
                                },
                            },
                        ]}
                        title={`Hello ${userName}, take a look at your data and see if you want to edit`}
                        isDisabled="true"
                        id="Main Form"
                        buttonConfig={{ theme: "primary" }}
                    ></Form>
                    <Button theme="secondary" text="mint" onClick={mint}></Button>
                </div>
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
