let web3;
let contract;
const vaultAddress = "PASTE_YOUR_CONTRACT_ADDRESS_HERE";
const vaultABI = [PASTE_YOUR_ABI_HERE]; // Paste ABI from ImperialVault_Final_BAL.sol
const BAL_TOKEN_ADDRESS = "PASTE_BAL_TOKEN_ADDRESS_HERE";

async function connectWallet() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
        document.getElementById("wallet-address").innerText = "Connected: " + accounts[0];
        contract = new web3.eth.Contract(vaultABI, vaultAddress);
    } else {
        alert("Please install MetaMask to use this feature.");
    }
}

async function claimBAL() {
    const accounts = await web3.eth.getAccounts();
    document.getElementById("status").innerText = "Claiming BAL rewards...";
    try {
        await contract.methods.claim(BAL_TOKEN_ADDRESS).send({ from: accounts[0] });
        document.getElementById("status").innerText = "Claim successful!";
    } catch (err) {
        console.error(err);
        document.getElementById("status").innerText = "Claim failed. Check console.";
    }
}

async function getTotalGasReimbursed() {
    try {
        const reimbursed = await contract.methods.totalGasReimbursed().call();
        const reimbursedMatic = (Number(reimbursed) / 1e18).toFixed(6);
        document.getElementById("gas-tracker-status").innerText =
            "Total reimbursed: " + reimbursedMatic + " MATIC";
    } catch (err) {
        console.error(err);
        document.getElementById("gas-tracker-status").innerText = "Failed to fetch total reimbursed.";
    }
}

async function checkVaultBalance() {
    try {
        const balanceWei = await web3.eth.getBalance(vaultAddress);
        const balance = web3.utils.fromWei(balanceWei, "ether");
        const balanceEl = document.getElementById("vault-balance-status");
        balanceEl.innerText = "Vault holds " + balance + " MATIC";

        if (parseFloat(balance) < 1) {
            balanceEl.innerText += " ⚠️ Low funds: consider topping up";
            balanceEl.style.color = "orange";
        } else {
            balanceEl.style.color = "lightgreen";
        }
    } catch (err) {
        console.error(err);
        document.getElementById("vault-balance-status").innerText = "Failed to fetch balance.";
    }
}
