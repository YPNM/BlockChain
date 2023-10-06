// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RockPaperScissors {
    address public owner;
    address public player1;
    address public player2;
    uint256 public stakeAmount = 100000000000; // 0.0001 BNB in Wei

    enum Choices { Rock, Paper, Scissors }

    struct Game {
        address player1;
        address player2;
        uint256 player1Choice;
        uint256 player2Choice;
        address winner;
        uint256 reward;
        bool gameFinished;
    }

    Game[] public games;

    event GameStarted(address indexed player1, address indexed player2);
    event GameResult(address indexed winner, uint256 reward);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function.");
        _;
    }

    function joinGame() external payable {
        require(msg.value == stakeAmount, "Please send 0.0001 BNB to join the game.");
        require(player2 == address(0), "Player 2 is already in the game.");
        player2 = msg.sender;
        emit GameStarted(player1, player2);
    }

    function play(uint256 choice) external {
        require(msg.sender == player1 || msg.sender == player2, "Only players can play.");
        require(player1 != address(0) && player2 != address(0), "Both players must join the game.");
        require(choice >= uint256(Choices.Rock) && choice <= uint256(Choices.Scissors), "Invalid choice.");

        uint256 randomSeed = uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, msg.sender)));
        uint256 randomResult = randomSeed % 3; // 0 for Rock, 1 for Paper, 2 for Scissors

        games.push(Game({
            player1: player1,
            player2: player2,
            player1Choice: msg.sender == player1 ? choice : 0,
            player2Choice: msg.sender == player2 ? choice : 0,
            winner: address(0),
            reward: 0,
            gameFinished: false
        }));

        if (msg.sender == player1) {
            games[games.length - 1].player1Choice = choice;
        } else {
            games[games.length - 1].player2Choice = choice;
        }

        if (games[games.length - 1].player1Choice == games[games.length - 1].player2Choice) {
            // It's a tie, return the stake
            payable(player1).transfer(stakeAmount);
            payable(player2).transfer(stakeAmount);
        } else if (
            (games[games.length - 1].player1Choice == uint256(Choices.Rock) && games[games.length - 1].player2Choice == uint256(Choices.Scissors)) ||
            (games[games.length - 1].player1Choice == uint256(Choices.Paper) && games[games.length - 1].player2Choice == uint256(Choices.Rock)) ||
            (games[games.length - 1].player1Choice == uint256(Choices.Scissors) && games[games.length - 1].player2Choice == uint256(Choices.Paper))
        ) {
            // Player 1 wins, send reward (2x the stake)
            games[games.length - 1].winner = player1;
            games[games.length - 1].reward = stakeAmount * 2;
            payable(player1).transfer(stakeAmount * 2);
            emit GameResult(player1, stakeAmount * 2);
        } else {
            // Player 2 wins, send reward (2x the stake)
            games[games.length - 1].winner = player2;
            games[games.length - 1].reward = stakeAmount * 2;
            payable(player2).transfer(stakeAmount * 2);
            emit GameResult(player2, stakeAmount * 2);
        }

        games[games.length - 1].gameFinished = true;
    }

    function getGameHistoryCount() external view returns (uint256) {
        return games.length;
    }

    function getGame(uint256 index) external view returns (Game memory) {
        require(index < games.length, "Game index out of range.");
        return games[index];
    }
}