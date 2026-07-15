//SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Lottery{

    //address of contract owner
    address public manager;

    //fixed ticket price
    uint public ticketPrice = 0.01 ether;

    //list of players
    address[] public players;
    uint public currentRound = 1;

    address public latestWinner;

    struct LotteryRound {
        uint roundId;
        address winner;
        uint prizeAmount;
        uint totalPlayers;
        uint ticketPrice;
        uint timestamp;
        bytes32 lotteryHash;
    }

    LotteryRound[] public lotteryHistory;

    event TicketPurchased(
        address indexed player,
        uint indexed roundId
    );

    event WinnerSelected(
        uint indexed roundId,
        address indexed winner,
        uint prizeAmount
    );

    //modifier lets us write the check once and reuse Identifier
    modifier onlyManager() {
        require(msg.sender == manager, "Only manager can perform this action");
        _;   //after the security check passes, execute the function
    }

    //constructor: save the wallet address of the person who deployed the contract
    //that person becomes the manager (admin) of the Lottery
    
    constructor(){
        manager = msg.sender;  //wallet address that called current function
    } 

    function buyTicket() public payable {
        require(msg.value == ticketPrice, "Incorrect ticket price");
        players.push(msg.sender);
        emit TicketPurchased(msg.sender, currentRound);
    }

    function getPlayers() public view returns (address[] memory) {
        return players;
    }

    function getTotalPlayers() public view returns (uint) {
        return players.length;
    }

    function getContractBalance() public view returns (uint){
        return address(this).balance;
    }

    function random() private view returns (uint){
        //returns large unsigned integer
        return uint(  
            keccak256( //solidity's cryptographic hash function
                abi.encodePacked(  //combines several values into one byte array before hashing
                    block.timestamp,
                    block.prevrandao,
                    players.length
                )
            )
        );
    }

    function drawWinner() public onlyManager{
        require(players.length >= 2, "At least two players are required");
        require(address(this).balance > 0, "No prize available");

        uint winnerIndex = random() % players.length;
        address winnerAddress = players[winnerIndex];

        latestWinner = winnerAddress;

        uint prize = address(this).balance;

        (bool success, ) = payable(winnerAddress).call{value: prize}("");


        lotteryHistory.push(
            LotteryRound({
                roundId: currentRound,
                winner: winnerAddress,
                prizeAmount: prize,
                totalPlayers: players.length,
                ticketPrice: ticketPrice,
                timestamp: block.timestamp,
                lotteryHash: keccak256(
                    abi.encodePacked(
                        currentRound,
                        winnerAddress,
                        prize,
                        block.timestamp
                    )
                )
            })
        );

        emit WinnerSelected(
            currentRound,
            winnerAddress,
            prize
        );
        delete players;

        currentRound++;
    }

    function getLotteryHistoryCount() public view returns (uint) {
        return lotteryHistory.length;
    }

    function getLotteryRound(
        uint index
    ) public view returns (LotteryRound memory) {

        require(
            index < lotteryHistory.length,
            "Invalid lottery round"
        );

        return lotteryHistory[index];
    }

    function getLatestWinner() public view returns (address) {
        return latestWinner;
    }
}

