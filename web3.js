const Web3 = require('web3');
const web3 = new Web3();

// Request access to the Ethereum provider (MetaMask)
async function requestEthereumAccess() {
    try {
        await window.ethereum.enable();
    } catch (error) {
        console.error('Error requesting Ethereum access:', error);
    }
}



// Initialize your contract instance with its ABI and address
const contractAbi = [
	{
		"inputs": [],
		"stateMutability": "payable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "winner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "reward",
				"type": "uint256"
			}
		],
		"name": "GameResult",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "player1",
				"type": "address"
			}
		],
		"name": "GameStarted",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "choice1",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "choice2",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "games",
		"outputs": [
			{
				"internalType": "address",
				"name": "player1",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "player1Choice",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "computerChoice",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "winner",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "reward",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "gameFinished",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "getGame",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "player1",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "player1Choice",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "computerChoice",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "winner",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "reward",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "gameFinished",
						"type": "bool"
					}
				],
				"internalType": "struct RockPaperScissors.Game",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getGameHistoryCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getOwner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getPlayer",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "joinGame",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "choice",
				"type": "uint256"
			}
		],
		"name": "play",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "player1",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "stakeAmount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]; // Your contract ABI
const contractAddress = '0x81BA3580Ce971ED3efDf4C38AC9a4F40d0695E2e';
const contract = new web3.eth.Contract(contractAbi, contractAddress);

// Function to join the game
async function joinGame() {
    try {
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0]; // Assuming you want the first account
        await contract.methods.joinGame().send({ from: account, value: '100000000000' }); // 0.0001 BNB in Wei
        alert('Joined the game successfully.');
    } catch (error) {
        console.error('Error joining the game:', error);
    }
}

// Function to play the game
async function play() {
    try {
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0]; // Assuming you want the first account
        const move = document.getElementById('move').value;
        await contract.methods.play(move).send({ from: account });
        alert('Played the game.');
    } catch (error) {
        console.error('Error playing the game:', error);
    }
}

// Function to get and display game history
async function getGameHistory() {
    try {
        const gameHistoryElement = document.getElementById('gameHistory');
        gameHistoryElement.innerHTML = '';

        const gameCount = await contract.methods.getGameHistoryCount().call();
        for (let i = 0; i < gameCount; i++) {
            const game = await contract.methods.getGame(i).call();
            const listItem = document.createElement('li');
            listItem.textContent = `Game ${i + 1}: Player 1 (${game.player1Choice}), Player 2 (${game.player2Choice}), Winner: ${game.winner}, Reward: ${game.reward / 1e18} BNB`;
            gameHistoryElement.appendChild(listItem);
        }
    } catch (error) {
        console.error('Error fetching game history:', error);
    }
}

// Load player addresses and game history on page load
window.addEventListener('DOMContentLoaded', async () => {
    await requestEthereumAccess();

    const accounts = await web3.eth.getAccounts();
    const account = accounts[0]; // Assuming you want the first account
    document.getElementById('player1Address').textContent = account;
    document.getElementById('player2Address').textContent = account; // Using the same account for both players for now

    getGameHistory();
});