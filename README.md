# LastWords-Gallery

LastWords is a project to let people share their last words to the world. The way it works by basically storing the data in Ethereum blockchain then an NFT will be minted with user's data. All the minted NFTs will be shown in the gallery. It may take time for Moralis and front-end to process the new  mitned NFTs.
## Installation

To install the project in your local machine clone the repository and then go the block then in the blockchain [directory](https://github.com/Asem-Abdelhady/LastWords/tree/master/LastWords-hardhat) run.

```bash
yarn install
```
After that make **.env** file with your configurations. You can see what configuration you need in the env file from the hardhat [config file](https://github.com/Asem-Abdelhady/LastWords/blob/master/LastWords-hardhat/hardhat.config.js). Now you can compile and deploy the [smart contracts](https://github.com/Asem-Abdelhady/LastWords/tree/master/LastWords-hardhat/contracts) using

```bash
yarn hardhat compile
yarn hardhat deploy
```
in case you want to use in any Ethereum net then deploy using:

```bash
yarn hardhat deploy --network "netowrk_name"
```
But you have to make sure you added the netowrk configuration in the hardhat [helper](https://github.com/Asem-Abdelhady/LastWords/blob/master/LastWords-hardhat/helper-hardhat-config.js) and [config](https://github.com/Asem-Abdelhady/LastWords/blob/master/LastWords-hardhat/hardhat.config.js) files

## Usage
There are 2 ways to interact with the project
#### First way:
The scripts that are written in the [scripts directory](https://github.com/Asem-Abdelhady/LastWords/tree/master/LastWords-hardhat/scripts) using:
```bash
yarn hardhat run ./scripts/"script_name" --netowrk "network_name"
```
you can also write your own scripts to interact with the blockchain smart contracts in the same directory
#### Second way:
Using the front-end that is inside the [front-end directory](https://github.com/Asem-Abdelhady/LastWords/tree/master/LastWords-nextjs). After cloning the repository go to the directory and run:
```bash
yarn install
yarn run dev
``` 
Go to the local host and you will see the front-end. You can interact with the blockchain using the visual part. However, it is under development for more functionalities. If you wish to use the one I already deployed in [https://last-words-last-words-nextjs-33go.vercel.app/](https://last-words-last-words-nextjs-33go.vercel.app/) feel free and follow the [Visuals section](#Visuals) but make sure you are connected to ***Goerli testnet***.

## Visuals
This section is mainly about interacting using my [deployed version](https://last-words-last-words-nextjs-33go.vercel.app/) of the front-end. If your wallet not connected you will be asked to conenct using the conenct button: <br />
<p align="center">
  <img src="https://user-images.githubusercontent.com/40506647/192311054-b41a95c7-c44f-4c41-9ef3-8fd0dc18a3b8.png" />
</p>
<br />

After you connect your home page will reload with the recently listed last words: <br />
<p align="center">
  <img src="https://user-images.githubusercontent.com/40506647/192310252-1450f837-f480-491c-8014-fcfe73b3e530.png" />
</p>
<br />

You can view the last words of anyone by pressing in the button: <br />
<p align="center">
  <img src="https://user-images.githubusercontent.com/40506647/192311888-60fec742-3705-4ecb-bf73-3f08efacef6f.png" />
</p>
<br />


To make your own last words go to [your-last-words](https://last-words-last-words-nextjs-33go.vercel.app/your-last-words) page where you will be asked to enter your data:<br />
<br />
<p align="center">
  <img src="https://user-images.githubusercontent.com/40506647/192312506-0c275096-2c15-4b81-8f1b-7582dec391d4.png" />
</p>
<br />
After you will make a transaction to store your data on the blockchain before it's minted when the interval passes.
Unfortunately, ***Due to lack of the Link token*** I stopped the auto-checking up on the intervals from the chain keepers on my chain-link keeprs account

## Future improvements
- [ ] Add the edit part in the front-end your-last-words page
- [ ] Let the user upload his picture instead of providing an IPFS link for it
- [ ] Add more user's info in the last-words NFT card
- [ ] Create data structre to store the users where their last-words NFT's been already minted
- [ ] Adding some require statments in the Last-Words Manager to ensure that the reansaction reverts in case of any suspecious events
- [ ] Use ownable pattern if the project is going to handle ethers transaction matters
## License
[MIT](https://choosealicense.com/licenses/mit/)
