// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Lottery is ReentrancyGuard {


    // ERRORS

    error NotManager();
    error IncorrectTicketPrice();
    error NotEnoughPlayers();
    error NoPrizeAvailable();
    error PrizeTransferFailed();
    error InvalidLotteryRound();
    error DirectTransferNotAllowed();
    error InvalidFunction();
    error LotteryNotEnded();
    error LotteryAlreadyRunning();
    error LotteryExpired();

   
    //STATE VARIABLES
   
    ///  Contract owner
    address public immutable manager;

    ///  Fixed ticket price
    uint256 public constant TICKET_PRICE = 0.01 ether;

    /// Current lottery players
    address[] public players;

    ///  Current lottery round
    uint256 public currentRound = 1;

    /// Latest winner
    address public latestWinner;

    // Lottery timing
    bool public lotteryOpen;
    uint256 public lotteryStartTime;
    uint256 public lotteryEndTime;
    uint256 public constant LOTTERY_DURATION = 30 minutes;
    
           // STRUCTS
    
    struct LotteryRound {
        uint256 roundId;
        address winner;
        uint256 prizeAmount;
        uint256 totalPlayers;
        uint256 ticketPrice;
        uint256 timestamp;
        bytes32 lotteryHash;
    }

    LotteryRound[] public lotteryHistory;

    // EVENTS
    event TicketPurchased(
    address indexed player,
    uint256 indexed roundId,
    uint256 ticketPrice,
    uint256 timestamp
);

    event WinnerSelected(
    address indexed winner,
    uint256 indexed roundId,
    uint256 prizeAmount,
    uint256 totalPlayers,
    uint256 timestamp
);

    event LotteryStarted(
        uint256 indexed roundId
    );

    event LotteryReset(
        uint256 indexed roundId
    );

    // MODIFIER

    modifier onlyManager() {
        if (msg.sender != manager) {
            revert NotManager();
        }
        _;
    }

     //CONSTRUCTOR
    
    constructor() {
        manager = msg.sender;
    }

    function startLottery() external onlyManager {

        if (lotteryOpen) {
            revert LotteryAlreadyRunning();
        }

        lotteryOpen = true;
        lotteryStartTime = block.timestamp;
        lotteryEndTime = block.timestamp + LOTTERY_DURATION;

        emit LotteryStarted(currentRound);
    }

    // RESET EXPIRED EMPTY LOTTERY
    function resetExpiredLottery() external onlyManager {
        if (!lotteryOpen) {
            revert InvalidFunction();
        }

        if (block.timestamp < lotteryEndTime) {
            revert LotteryNotEnded();
        }

        if (players.length > 0) {
            revert NotEnoughPlayers();
        }

        lotteryOpen = false;
        lotteryStartTime = 0;
        lotteryEndTime = 0;

        emit LotteryReset(currentRound);
        }

     //BUY TICKET
    function buyTicket() external payable {

        if(!lotteryOpen){
            revert InvalidFunction();
        }

         if (block.timestamp >= lotteryEndTime) {
            revert LotteryExpired();
         }   

        if (msg.value != TICKET_PRICE) {
            revert IncorrectTicketPrice();
        }

        players.push(msg.sender);

        emit TicketPurchased(
            msg.sender,
            currentRound,
            TICKET_PRICE,
            block.timestamp
        );
    }

     //RANDOM NUMBER
    
    function random() private view returns (uint256) {

        return uint256(
            keccak256(
                abi.encodePacked(
                    block.timestamp,
                    block.prevrandao,
                    players.length,
                    address(this).balance,
                    currentRound
                )
            )
        );
    }

      //VIEW FUNCTIONS
    
    function getPlayers()
        external
        view
        returns (address[] memory)
    {
        return players;
    }

    function getTotalPlayers()
        external
        view
        returns (uint256)
    {
        return players.length;
    }

    function getContractBalance()
        external
        view
        returns (uint256)
    {
        return address(this).balance;
    }

     //DRAW WINNER

    function drawWinner()
        external
        onlyManager
        nonReentrant
    {
        if (!lotteryOpen) {
            revert InvalidFunction();
        }

        if (block.timestamp < lotteryEndTime) {
            revert LotteryNotEnded();
        }

        if (players.length == 0) {
            revert NotEnoughPlayers();
        }

        uint256 prize = address(this).balance;

        if (prize == 0) {
            revert NoPrizeAvailable();
        }

        uint256 winnerIndex = random() % players.length;
        address winnerAddress = players[winnerIndex];

        // EFFECTS (CEI Pattern)
    
        latestWinner = winnerAddress;

        lotteryHistory.push(
            LotteryRound({
                roundId: currentRound,
                winner: winnerAddress,
                prizeAmount: prize,
                totalPlayers: players.length,
                ticketPrice: TICKET_PRICE,
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
            winnerAddress,
            currentRound,
            prize,
            players.length,
            block.timestamp
        );

        delete players;

        lotteryOpen= false;
        lotteryStartTime= 0;
        lotteryEndTime= 0;

        currentRound++;

        // INTERACTION (External Call)
        (bool success, ) = payable(winnerAddress).call{
            value: prize
        }("");

        if (!success) {
            revert PrizeTransferFailed();
        }
    }

    // HISTORY FUNCTIONS
    
    function getLotteryHistoryCount()
        external
        view
        returns (uint256)
    {
        return lotteryHistory.length;
    }

    function getLotteryRound(
        uint256 index
    )
        external
        view
        returns (LotteryRound memory)
    {
        if (index >= lotteryHistory.length) {
            revert InvalidLotteryRound();
        }

        return lotteryHistory[index];
    }

function getLotteryStatus()
    external
    view
    returns (
        bool isOpen,
        uint256 startTime,
        uint256 endTime,
        uint256 duration
    )
{
    return (
        lotteryOpen,
        lotteryStartTime,
        lotteryEndTime,
        LOTTERY_DURATION
    );
}

    //  LATEST WINNER
    function getLatestWinner()
        external
        view
        returns (address)
    {
        return latestWinner;
    }

    // PREVENT DIRECT ETH TRANSFERS
    
    function ticketPrice() external pure returns (uint256) {
    return TICKET_PRICE;
    }
    
    receive() external payable {
        revert DirectTransferNotAllowed();
    }

    fallback() external payable {
        revert InvalidFunction();
    }
}


