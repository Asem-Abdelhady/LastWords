import Button from "react-bootstrap/Button"
import Card from "react-bootstrap/Card"
import { useState, useEffect } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import LastWordsModal from "./LastWordsModal"
import LastWordsNftAbi from "../constants/LastWordsNft.json"

export default function PassedAwayUser({ tokenId, owner }) {
    const LastWordsNftAddress = "0x669F829D85D9b275F9E07683D3cc8692f27F6491"
    const { isWeb3Enabled, account } = useMoralis()

    const [tokenURI, setTokenURI] = useState("")
    const [showModal, setShowModal] = useState("")
    const [userImageURI, setUserImageURI] = useState("0")
    const [userName, setUserName] = useState("0")
    const [userCity, setUserCity] = useState("0")
    const [userLastWords, setUserLastWords] = useState("0")
    const [userAge, setUserAge] = useState("0")
    const [userInterval, setUserInterval] = useState("0")

    const { runContractFunction: getTokenURI } = useWeb3Contract({
        abi: LastWordsNftAbi,
        contractAddress: LastWordsNftAddress,
        functionName: "tokenURI",
        params: {
            tokenId: tokenId,
        },
    })

    function split_str(str) {
        const first_str = str.substring(0, 30)
        return first_str + "..."
    }

    async function updateUI() {
        const tokenURI = await getTokenURI()
        const requestURL = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")
        const tokenURIResponse = await (await fetch(requestURL)).json()
        const imageURI = tokenURIResponse.image
        const imageURIURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/")
        const userName = tokenURIResponse.name
        const lastWords = tokenURIResponse.description
        const interval = tokenURIResponse.attributes[0].value
        const age = tokenURIResponse.attributes[1].value
        const city = tokenURIResponse.attributes[2].value

        //console.log("Response: ", tokenURIResponse)
        setUserImageURI(imageURIURL)
        setUserInterval(interval)
        setUserAge(age)
        setUserCity(city)
        setUserLastWords(lastWords)
        setUserName(userName)
    }

    const showLastWords = () => {
        userLastWords != "0" ? setShowModal(true) : console.log("data not available")
    }
    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    return (
        <div>
            {userImageURI != "0" ? (
                <div>
                    <LastWordsModal
                        isVisible={showModal}
                        onClose={() => setShowModal(false)}
                        name={userName}
                        lastWords={userLastWords}
                    />

                    <Card style={{ width: "18rem" }}>
                        <Card.Img variant="left" src={userImageURI}></Card.Img>
                        <Card.Header as="h5">{userName}</Card.Header>
                        <Card.Body>
                            <Card.Title>Last Words: </Card.Title>
                            <Card.Text>{split_str(userLastWords)}</Card.Text>
                            <Button variant="primary" onClick={showLastWords}>
                                Show the whole last words
                            </Button>
                        </Card.Body>
                    </Card>
                </div>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    )
}
