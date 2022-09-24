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
    const URI = "ipfs://QmQa3bHiom1xUimBi21M3GuAPvqtgqCB6wo6BC5b5LuiNb"
    const { chainId, account, isWeb3Enabled, Moralis } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    const LastWordsNftAddress = "0x669F829D85D9b275F9E07683D3cc8692f27F6491" //"0x5fbdb2315678afecb367f032d93f642f64180aa3"
    const contractAddresses = require("../constants/networkMapping.json")
    const lastWordsManagerAddress = "0xD90Ea49ee9852C2125CAf2b93ECAA8B8a67277E5" //contractAddresses[chainString].LastWordsManager[0]"0xfdc85F8dE4EfC0635c3369B36a2711D9F12145E6"
    const [userImageURI, setUserImageURI] = useState("")
    const [userName, setUserName] = useState("")
    const [userCity, setUserCity] = useState("")
    const [userLastWords, setUserLastWords] = useState("")
    const [userAge, setUserAge] = useState()
    const [userInterval, setUserInterval] = useState()

    const [isDataSet, setIsDataSet] = useState()
    const { runContractFunction } = useWeb3Contract()
    const dispatch = useNotification()

    const [userURI, setUserURI] = useState("")

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
                msgValue: Moralis.Units.ETH(0.0001),
            },
            onError: (error) => console.log(error),
            onSuccess: handleAddUserSuccess,
        })
    }

    async function handleAddUserSuccess(tx) {
        await tx.wait(1)
        dispatch({
            title: "Added!",
            type: "success",
            message: "User added, please referesh",
            position: "topR",
        })
    }

    async function getUsersNumber() {
        const number = await runContractFunction({
            params: {
                contractAddress: lastWordsManagerAddress,
                abi: LastWordsManagerAbi,
                functionName: "getNumberOfUsers",
                params: {},
                onError: (error) => console.log(error),
            },
        })
        console.log("Number of users: ", number.toString())
    }
    async function getUserInterval() {
        const number = await runContractFunction({
            params: {
                contractAddress: lastWordsManagerAddress,
                abi: LastWordsManagerAbi,
                functionName: "getInterval",
                params: {
                    user: account,
                },
                onError: (error) => console.log(error),
            },
        })
        console.log("Interval: ", number.toString())
    }

    async function getUserRestOfInterval() {
        const number = await runContractFunction({
            params: {
                contractAddress: lastWordsManagerAddress,
                abi: LastWordsManagerAbi,
                functionName: "getRestOfInterval",
                params: {
                    user: account,
                },
                onError: (error) => console.log(error),
            },
        })
        console.log("reset Of interval: ", number.toString())
    }

    async function getBlockTimeStamp() {
        const number = await runContractFunction({
            params: {
                contractAddress: lastWordsManagerAddress,
                abi: LastWordsManagerAbi,
                functionName: "getBlockStampTime",
                params: {},
                onError: (error) => console.log(error),
            },
        })
        console.log("BlockStamp: ", number.toString())
    }

    async function getLastTimeStamp() {
        const number = await runContractFunction({
            params: {
                contractAddress: lastWordsManagerAddress,
                abi: LastWordsManagerAbi,
                functionName: "getUserLastTimeStamp",
                params: {
                    user: account,
                },
                onError: (error) => console.log(error),
            },
        })
        console.log("userLastTime: ", number.toString())
    }

    async function timePassed() {
        const number = await runContractFunction({
            params: {
                contractAddress: lastWordsManagerAddress,
                abi: LastWordsManagerAbi,
                functionName: "getTimePassed",
                params: {
                    user: account,
                },
                onError: (error) => console.log(error),
            },
        })
        console.log("timePassed: ", number.toString())
    }

    async function isTimePassed() {
        const number = await runContractFunction({
            params: {
                contractAddress: lastWordsManagerAddress,
                abi: LastWordsManagerAbi,
                functionName: "isTimePassed",
                params: {
                    user: account,
                },
                onError: (error) => console.log(error),
            },
        })
        console.log("isTimePassed: ", number)
    }

    async function getDeadUsers() {
        const number = await runContractFunction({
            params: {
                contractAddress: lastWordsManagerAddress,
                abi: LastWordsManagerAbi,
                functionName: "getDeadUsers",
                params: {},
                onError: (error) => console.log(error),
            },
        })
        console.log("Dead Users: ", number)
    }

    async function sendLastWords() {
        const number = await runContractFunction({
            params: {
                contractAddress: lastWordsManagerAddress,
                abi: LastWordsManagerAbi,
                functionName: "sendLastWords",
                params: {},
                onError: (error) => console.log(error),
            },
        })
        console.log("sendLastWords: ", number)
    }

    async function mint() {
        const mintOptions = {
            abi: LastWordsNftAbi,
            contractAddress: LastWordsNftAddress,
            functionName: "mintNft",
            chainId: 31337,
            params: {
                holder: account,
                tokenURI: URI,
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
            console.log("inside if: ")
            setUserURI(userURIFromContract.toString())
            console.log("userURI: ", userURI)
            setUserData(userURIFromContract)
            setIsDataSet(true)
            console.log("Data set")
        }
    }

    async function setUserData(tokenURI) {
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
    useEffect(() => {
        if (isWeb3Enabled) {
            getUserURI()
        }
    }, [userURI, account, isWeb3Enabled, chainId])

    useEffect(() => {
        if (isWeb3Enabled) {
            setUserData(userURI)
        }
    }, [userURI, isWeb3Enabled])

    return (
        <div className={styles.container}>
            {isDataSet ? (
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
                        isDisabled={true}
                        id="Main Form"
                        buttonConfig={{ theme: "primary" }}
                    ></Form>
                    <Button theme="secondary" text="mint" onClick={mint}></Button>
                    <Button theme="secondary" text="usersNumber" onClick={getUsersNumber}></Button>
                    <Button theme="secondary" text="interval" onClick={getUserInterval}></Button>
                    <Button
                        theme="secondary"
                        text="blockStamp"
                        onClick={getBlockTimeStamp}
                    ></Button>
                    <Button
                        theme="secondary"
                        text="lastTimeStamp"
                        onClick={getLastTimeStamp}
                    ></Button>
                    <Button
                        theme="secondary"
                        text="resetOfInterval"
                        onClick={getUserRestOfInterval}
                    ></Button>
                    <Button theme="secondary" text="timePassed" onClick={timePassed}></Button>
                    <Button theme="secondary" text="isTimePassed" onClick={isTimePassed}></Button>
                    <Button theme="secondary" text="deadUers" onClick={getDeadUsers}></Button>
                    <Button
                        theme="secondary"
                        text="sendLastWords"
                        onClick={sendLastWords}
                    ></Button>
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
