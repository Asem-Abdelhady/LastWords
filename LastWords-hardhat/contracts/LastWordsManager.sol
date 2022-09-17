// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol";
import "hardhat/console.sol";
import "./LastWordsNft.sol";

//Ownable for money stuff will be added later

//To do !!
//1- Add map for the passedAway alaready
//2- Delete extra variables such userwithInfo
//3- require statments such as making sure the user is not already pased away before resetting
//4- Editing lastwords

error LastWordsManager__NotEnoughFeePaid();

contract LastWordsManager is KeeperCompatibleInterface {
    struct User {
        uint256 interval;
        uint256 lastTimeStamp;
        string lastWords;
        string tokenURI;
    }

    address[] private s_users;
    //Struct variables
    mapping(address => User) private s_addressToUser;
    User[] private s_usersWithInfo;

    uint256 immutable i_regsiterationFee;
    LastWordsNft immutable i_lastWordsNft;

    event UserAdded(
        address indexed userAddress,
        string indexed lastWords,
        string indexed tokenURI,
        uint256 interval
    );
    event EmailAdded(address indexed userAddress, string reciever);
    event InervalSetFromUser(uint256 interval, address indexed user);
    event LastWordsSent(address indexed passedAwayUserAddress, string indexed passedAwayUserURI);

    constructor(uint256 regsiterationFee, address lastWordsNftAddress) {
        i_regsiterationFee = regsiterationFee;
        i_lastWordsNft = LastWordsNft(lastWordsNftAddress);
    }

    function addUser(
        uint256 interval,
        string memory lastWords,
        string memory tokenURI
    ) public payable {
        if (msg.value < i_regsiterationFee) revert LastWordsManager__NotEnoughFeePaid();
        s_addressToUser[msg.sender].interval = interval;
        s_addressToUser[msg.sender].lastTimeStamp = block.timestamp;
        User memory user = User(interval, block.timestamp, lastWords, tokenURI);
        s_addressToUser[msg.sender] = user;
        s_usersWithInfo.push(user);
        s_users.push(msg.sender);

        emit UserAdded(msg.sender, lastWords, tokenURI, interval);
    }

    function checkUpkeep(
        bytes calldata /*checkData*/
    ) external override returns (bool upkeepNeeded, bytes memory performData) {
        console.log("Here from contract 0");
        address[] memory deadUsers = getDeadUsers();
        upkeepNeeded = deadUsers.length > 0;

        performData = abi.encode(deadUsers);
    }

    function performUpkeep(bytes calldata performData) external override {
        address[] memory deadUsers = abi.decode(performData, (address[]));
        sendLastWords(deadUsers);
    }

    function setIntervalFromUser(uint256 interval) public payable {
        s_addressToUser[msg.sender].interval = interval;
        s_addressToUser[msg.sender].lastTimeStamp = block.timestamp;

        emit InervalSetFromUser(interval, msg.sender);
    }

    function getInterval(address user) public view returns (uint256) {
        return s_addressToUser[user].interval;
    }

    function getRestOfInterval(address user) public view returns (uint256) {
        uint256 restOfInterval = s_addressToUser[user].interval -
            block.timestamp -
            s_addressToUser[msg.sender].lastTimeStamp;

        return restOfInterval;
    }

    function getLastWords(address user) public view returns (string memory) {
        return s_addressToUser[user].lastWords;
    }

    function getTokenURI(address user) public view returns (string memory) {
        return s_addressToUser[user].tokenURI;
    }

    function getNumberOfUsers() public view returns (uint256) {
        return s_users.length;
    }

    function getRegisterationFee() public view returns (uint256) {
        return i_regsiterationFee;
    }

    function getNftSymbol() public view returns (string memory) {
        return i_lastWordsNft.symbol();
    }

    function getDeadUsers() public view returns (address[] memory) {
        address[] memory users = s_users;
        address[] memory deadUsers = new address[](users.length);
        uint256 count = 0;
        for (uint256 idx; idx < s_users.length; idx++) {
            address userAddress = users[idx];
            uint256 interval = s_addressToUser[userAddress].interval;
            uint256 lastTimeStamp = s_addressToUser[userAddress].lastTimeStamp;
            if (block.timestamp - lastTimeStamp >= interval) {
                deadUsers[count] = userAddress;

                count++;
            }
        }
        return deadUsers;
    }

    function sendLastWords(address[] memory passedAwayUsers) public {
        for (uint256 idx; idx < passedAwayUsers.length; idx++) {
            User memory user = s_addressToUser[passedAwayUsers[idx]];
            i_lastWordsNft.mintNft(user.tokenURI, passedAwayUsers[idx]);
            delete (s_addressToUser[passedAwayUsers[idx]]);
            emit LastWordsSent(passedAwayUsers[idx], user.tokenURI);
        }
    }
}
