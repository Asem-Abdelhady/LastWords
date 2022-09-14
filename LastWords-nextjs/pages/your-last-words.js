import Head from "next/head"
import Image from "next/image"
import styles from "../styles/Home.module.css"
import { Button, Form, useNotification } from "web3uikit"
import { ethers } from "ethers"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useEffect, useState } from "react"

export default function Home() {
    return (
        <div className={styles.container}>
            <Form
                data={[
                    {
                        name: "Nft Address",
                        type: "text",
                        inputWidth: "50%",
                        value: "",
                        key: "nftAddress",
                    },
                    {
                        name: "Token ID",
                        type: "number",
                        value: "",
                        key: "tokenId",
                    },
                    {
                        name: "Price (in ETH)",
                        type: "number",
                        value: "",
                        key: "price",
                    },
                ]}
                title="Sell your NFT here!"
                id="Main Form"
                buttonConfig={{ theme: "primary" }}
            ></Form>

            <div className="container px-4">
                <div className="py-4">
                    Your proceeds are: {ethers.utils.formatUnits(5, "ether").toString()}
                </div>
                {5 != "0" ? (
                    <div>
                        <Button theme="primary" text="Withdraw"></Button>
                    </div>
                ) : (
                    <div>No proceeds to withdraw</div>
                )}
            </div>
        </div>
    )
}
