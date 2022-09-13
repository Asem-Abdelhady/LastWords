// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract LastWordsNft is ERC721URIStorage {
    mapping(uint256 => string) private s_tokenIdToURI;
    mapping(address => string) private s_addressToURI;
    mapping(uint256 => address) private s_tokenIdToHolder;
    mapping(address => uint256) private s_hodlerTokenId;

    uint256 public s_tokenCounter;

    event NftMinted(address indexed holder, string indexed tokenURI);

    constructor() ERC721("Last Words NFT", "LNFT") {}

    function mintNft(string memory tokenURI, address holder) public {
        uint256 newTokenId = s_tokenCounter;
        s_tokenCounter += 1;

        s_tokenIdToHolder[newTokenId] = holder;
        s_tokenIdToURI[newTokenId] = tokenURI;
        s_addressToURI[holder] = tokenURI;
        s_hodlerTokenId[holder] = newTokenId;

        _safeMint(holder, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        emit NftMinted(holder, tokenURI);
    }

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }

    function getTokenUri(uint256 tokenId) public view returns (string memory) {
        return tokenURI(tokenId);
    }

    function getHolderAddress(uint256 tokenId) public view returns (address) {
        return s_tokenIdToHolder[tokenId];
    }

    function getURIfromAddress(address holder) public view returns (string memory) {
        return s_addressToURI[holder];
    }

    function getSymbol() public view returns (string memory) {
        return symbol();
    }
}
