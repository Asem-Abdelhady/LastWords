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
    uint256 immutable i_checkUpInterval;
    uint256 private s_lastTimeCheck;

    event UserAdded(
        address indexed userAddress,
        string indexed lastWords,
        string indexed tokenURI,
        uint256 interval
    );
    event EmailAdded(address indexed userAddress, string reciever);
    event InervalSetFromUser(uint256 interval, address indexed user);
    event LastWordsSent(address indexed passedAwayUserAddress, string indexed passedAwayUserURI);
    event UpkeepPerformed(string indexed);
    event InsideLastWords(string indexed);
    event InsideFor(address indexed);
    event OutsideIf();
    event InsideIndexesOf();
    event CalculateData(bool indexed passed, uint256 indexed last_time, uint256 indexed stamp);
    event InsideIfMint();
    event InsideForOfMint();

    constructor(
        uint256 regsiterationFee,
        uint256 interval,
        address lastWordsNftAddress
    ) {
        i_regsiterationFee = regsiterationFee;
        i_lastWordsNft = LastWordsNft(lastWordsNftAddress);
        i_checkUpInterval = interval;
        s_lastTimeCheck = block.timestamp;
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
    ) public view override returns (bool upkeepNeeded, bytes memory performData) {
        upkeepNeeded =
            (block.timestamp - s_lastTimeCheck) >= i_checkUpInterval &&
            s_users.length > 0;

        return (upkeepNeeded, "0x0");
    }

    function performUpkeep(
        bytes calldata /*performData*/
    ) external override {
        emit UpkeepPerformed("performeeeeeeed");
        s_lastTimeCheck = block.timestamp;
        //(address[] memory deadUsers, uint256[] memory idxs) = getDeadUsers();
        sendLastWords();
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
            (block.timestamp - s_addressToUser[user].lastTimeStamp);

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

    function getUserLastTimeStamp(address user) public view returns (uint256) {
        return s_addressToUser[user].lastTimeStamp;
    }

    function getBlockStampTime() public view returns (uint256) {
        return block.timestamp;
    }

    function getTimePassed(address user) public view returns (uint256) {
        return (block.timestamp - s_addressToUser[user].lastTimeStamp) + 1;
    }

    function isTimePassed(address user) public view returns (bool) {
        return ((block.timestamp - s_addressToUser[user].lastTimeStamp) >=
            s_addressToUser[user].interval);
    }

    function getDeadUsers() public view returns (address[] memory, uint256[] memory) {
        address[] memory users = s_users;
        address[] memory deadUsers = new address[](users.length);
        uint256[] memory idxs = new uint256[](users.length);
        uint256 count = 0;
        for (uint256 idx = 0; idx < s_users.length; idx++) {
            address userAddress = users[idx];
            uint256 interval = s_addressToUser[userAddress].interval;
            uint256 lastTimeStamp = s_addressToUser[userAddress].lastTimeStamp;
            if (block.timestamp - lastTimeStamp >= interval) {
                deadUsers[count] = userAddress;
                idxs[count] = idx;
                count++;
            }
        }
        return (deadUsers, idxs);
    }

    function sendLastWords() public {
        emit InsideLastWords("inside last words");
        address[] memory users = s_users;
        address[] memory deadUsers = new address[](s_users.length);
        uint256 count = 0;

        for (uint256 idx = 0; idx < s_users.length; idx++) {
            emit InsideFor(users[idx]);
            address userAddress = users[idx];
            uint256 interval = s_addressToUser[userAddress].interval;
            uint256 lastTimeStamp = s_addressToUser[userAddress].lastTimeStamp;
            bool x = (block.timestamp - lastTimeStamp) >= interval;
            emit CalculateData(x, lastTimeStamp, block.timestamp);
            if (block.timestamp - lastTimeStamp >= interval) {
                emit InsideIndexesOf();
                deadUsers[count] = userAddress;
                delete s_users[idx];
                count++;
            }
        }

        if (deadUsers.length > 0 && deadUsers[0] != address(0)) {
            emit InsideIfMint();
            for (uint256 idx = 0; idx < deadUsers.length; idx++) {
                emit InsideForOfMint();
                User memory user = s_addressToUser[deadUsers[idx]];
                i_lastWordsNft.mintNft(user.tokenURI, deadUsers[idx]);
                delete (s_addressToUser[deadUsers[idx]]);
                emit LastWordsSent(deadUsers[idx], user.tokenURI);
            }
        }
        emit OutsideIf();
    }
}
