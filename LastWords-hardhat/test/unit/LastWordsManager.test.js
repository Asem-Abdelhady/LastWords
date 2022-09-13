const { assert, expect } = require("chai")
const { network, ethers, deployments } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("LastWordsManager", function () {
          let lastWordsNft, lastWordsManager, registerationFee, accounts
          beforeEach(async () => {
              accounts = await ethers.getSigners()
              const chainId = network.config.chainId
              await deployments.fixture("all")
              lastWordsNft = await ethers.getContract("LastWordsNft")
              lastWordsManager = await ethers.getContract("LastWordsManager")
              registerationFee = networkConfig[chainId]["registerationsFee"]
          })

          describe("Constructor", function () {
              it("initalizes the values right", async function () {
                  const registerationFeeFromManager = await lastWordsManager.getRegisterationFee()
                  const symbolFromManager = await lastWordsManager.getNftSymbol()
                  const symbolFromNft = await lastWordsNft.getSymbol()

                  console.log("Fee", registerationFeeFromManager.toString())
                  assert(symbolFromManager.toString() == symbolFromNft.toString())
                  assert(registerationFeeFromManager.toString() == registerationFee)
              })
          })
          describe("addUser", function () {
              it("Reverts when not enough Paid", async function () {
                  console.log("")
                  await expect(
                      lastWordsManager.addUser("30", "Sorry to let you down", "Some URI", {
                          value: ethers.utils.parseEther("1"),
                      })
                  ).to.be.revertedWith("LastWordsManager__NotEnoughFeePaid")
              })

              it("Emits event when a user added", async function () {
                  expect(
                      await lastWordsManager.addUser("30", "Sorry to let you down", "Some URI", {
                          value: registerationFee,
                      })
                  ).to.emit("UserAdded")
              })

              it("updates with the right values", async function () {
                  const response = await lastWordsManager.addUser(
                      "30",
                      "Sorry to let you down",
                      "Some URI",
                      {
                          value: registerationFee,
                      }
                  )

                  const responseReceipt = await response.wait(1)
                  const interval = await lastWordsManager.getInterval(accounts[0].address)
                  const lastWords = await lastWordsManager.getLastWords(accounts[0].address)
                  const URI = await lastWordsManager.getTokenURI(accounts[0].address)

                  console.log("Last Words: ", URI)

                  assert(lastWords.toString() == "Sorry to let you down")
                  assert(URI.toString() == "Some URI")
                  assert(interval.toString(), "30")
              })
          })

          describe("checkUpKeep", function () {
              it("returns false if there are no users", async function () {
                  const { upkeepNeeded } = await lastWordsManager.callStatic.checkUpkeep("0x")
                  assert(!upkeepNeeded)
              })

              it("returns true if there are enough users and time passed", async function () {
                  const response = await lastWordsManager.addUser(
                      "30",
                      "Sorry to let you down",
                      "Some URI",
                      {
                          value: registerationFee,
                      }
                  )
                  const responseReceipt = await response.wait(1)
                  await network.provider.send("evm_increaseTime", [31])
                  await network.provider.request({ method: "evm_mine", params: [] })
                  const { upkeepNeeded } = await lastWordsManager.callStatic.checkUpkeep("0x")
                  assert(upkeepNeeded)
              })
          })

          describe("performUpkeep", function () {
              it("emits events after someone passes away", async () => {
                  const response = await lastWordsManager.addUser(
                      "30",
                      "Sorry to let you down",
                      "Some URI",
                      {
                          value: registerationFee,
                      }
                  )
                  const responseReceipt = await response.wait(1)
                  await network.provider.send("evm_increaseTime", [31])
                  await network.provider.request({ method: "evm_mine", params: [] })
                  const passedAwayPeople = await lastWordsManager.getDeadUsers()
                  expect(await lastWordsManager.sendLastWords(passedAwayPeople)).to.emit(
                      "LastWordsSent"
                  )
              })

              it("mints and emits with the right values", async () => {
                  const response = await lastWordsManager.addUser(
                      "30",
                      "Sorry to let you down",
                      "Some URI",
                      {
                          value: registerationFee,
                      }
                  )
                  const responseReceipt = await response.wait(1)
                  await network.provider.send("evm_increaseTime", [31])
                  await network.provider.request({ method: "evm_mine", params: [] })
                  const passedAwayPeople = await lastWordsManager.getDeadUsers()
                  await lastWordsManager.sendLastWords(passedAwayPeople)
                  const URI = await lastWordsNft.getURIfromAddress(accounts[0].address)
                  assert(URI.toString() == "Some URI")
              })
          })
          describe("setIntervalFromUser", () => {
              it("sets the interval correctly", async () => {
                  const response = await lastWordsManager.addUser(
                      "30",
                      "Sorry to let you down",
                      "Some URI",
                      {
                          value: registerationFee,
                      }
                  )

                  const settingResponse = await lastWordsManager.setIntervalFromUser("35", {
                      from: accounts[0].address,
                  })
                  const newInterval = await lastWordsManager.getInterval(accounts[0].address)
                  assert(newInterval.toString() == "35")
              })
          })
      })
