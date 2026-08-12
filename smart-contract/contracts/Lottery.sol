// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Lottery is ReentrancyGuard {

    // ============================================================
    //                        ERRORS
    // ============================================================

    error NotManager();
    error IncorrectTicketPrice();
    error NotEnoughPlayers();
    error NoPrizeAvailable();
    error PrizeTransferFailed();
    error InvalidLotteryRound();
    error DirectTransferNotAllowed();
    error InvalidFunction();

    // ============================================================
    //                    STATE VARIABLES
    // ============================================================

    /// @notice Contract owner
    address public immutable manager;

    /// @notice Fixed ticket price
    uint256 public constant TICKET_PRICE = 0.01 ether;

    /// @notice Current lottery players
    address[] public players;

    /// @notice Current lottery round
    uint256 public currentRound = 1;

    /// @notice Latest winner
    address public latestWinner;

    // ============================================================
    //                        STRUCTS
    // ============================================================

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

    // ============================================================
    //                         EVENTS
    // ============================================================

    event TicketPurchased(
    address indexed player,
    uint256 indexed roundId,
    uint256 ticketPrice,
    uint256 timestamp
);

event WinnerSelected(
    uint256 indexed roundId,
    address indexed winner,
    uint256 prizeAmount,
    uint256 totalPlayers,
    uint256 timestamp
);

    // ============================================================
    //                        MODIFIER
    // ============================================================

    modifier onlyManager() {
        if (msg.sender != manager) {
            revert NotManager();
        }
        _;
    }

    // ============================================================
    //                      CONSTRUCTOR
    // ============================================================

    constructor() {
        manager = msg.sender;
    }

    // ============================================================
    //                    BUY TICKET
    // ============================================================

    function buyTicket() external payable {

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

    // ============================================================
    //                  RANDOM NUMBER (ACADEMIC ONLY)
    // ============================================================

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

    // ============================================================
    //                     VIEW FUNCTIONS
    // ============================================================

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

    // ============================================================
    //                    DRAW WINNER
    // ============================================================

    function drawWinner()
        external
        onlyManager
        nonReentrant
    {
        if (players.length < 2) {
            revert NotEnoughPlayers();
        }

        uint256 prize = address(this).balance;

        if (prize == 0) {
            revert NoPrizeAvailable();
        }

        uint256 winnerIndex = random() % players.length;
        address winnerAddress = players[winnerIndex];

        // ========================================================
        //                EFFECTS (CEI Pattern)
        // ========================================================

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
            currentRound,
            winnerAddress,
            prize,
            players.length,
            block.timestamp
        );

        delete players;

        currentRound++;

        // ========================================================
        //               INTERACTION (External Call)
        // ========================================================

        (bool success, ) = payable(winnerAddress).call{
            value: prize
        }("");

        if (!success) {
            revert PrizeTransferFailed();
        }
    }

    // ============================================================
    //                    HISTORY FUNCTIONS
    // ============================================================

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

    // ============================================================
    //                    LATEST WINNER
    // ============================================================

    function getLatestWinner()
        external
        view
        returns (address)
    {
        return latestWinner;
    }

    // ============================================================
    //              PREVENT DIRECT ETH TRANSFERS
    // ============================================================

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


