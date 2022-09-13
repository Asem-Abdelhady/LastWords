const { assert, expect } = require("chai")
const { network, ethers, deployments } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("LastWordsNft", function () {
          let lastWordsNft
          beforeEach(async () => {
              accounts = await ethers.getSigners()
              minter = accounts[1]
              await deployments.fixture("nft")

              lastWordsNft = await ethers.getContract("LastWordsNft")
          })

          describe("mintNft", function () {
              it("emits the event after minting", async function () {
                  expect(await lastWordsNft.mintNft("Some URI", accounts[0].address)).to.emit(
                      "NftMinted"
                  )
              })

              it("updates counter and URI after minting", async function () {
                  const counterBefore = await lastWordsNft.getTokenCounter()
                  const response = await lastWordsNft.mintNft("Some URI", accounts[0].address)
                  await response.wait(1)
                  const counterAfter = await lastWordsNft.getTokenCounter()
                  const URI = await lastWordsNft.getURIfromAddress(accounts[0].address)

                  assert(counterAfter.toString() == "1")
                  assert(URI.toString() == "Some URI")
              })
          })
      })
