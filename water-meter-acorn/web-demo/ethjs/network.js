var Web3 = require('web3');

function connectToEth() {
    var web3Endpoint = document.getElementById("web3Endpoint").value;
    console.log(web3Endpoint);
    if (typeof web3 !== 'undefined')
        web3 = new Web3(web3.currentProvider);
    else
        web3 = new Web3(new Web3.providers.HttpProvider(web3Endpoint));

    isEthNodeConnected();
}

function isEthNodeConnected() {
    if (web3.isConnected()) {
        swal("Nice!", "You are connected to your Ethereum Node!", "success");
        console.log("CONNECTED to Node");

        // Create "Choose an Address" dropdown for owner/buyer
        var accounts = web3.eth.accounts;
        var addySelect = document.getElementById("selectAccount");

        // Collect all of the accounts from your Ethereum node you are connected to.
        // NOTE: If you are not using testrpc, you may need to add some things here
        // in order to unlock the accounts we are collecting.
        for (var i = 0; i < accounts.length; i++) {
            var acct = accounts[i];
            var el = document.createElement("option");
            el.textContent = acct;
            el.value = acct;
            addySelect.appendChild(el);
        }
        // Set the default accounts to be displayed.
        addySelect.selectedIndex = "1";
    } else {
        swal({ title: "Error! Failed to Connect", text: "Make sure you have the right address to connect (either RPC or IPC) and that you have allowed this website by changing the RPC CORS settings in your Ethereum client. Click the \"Need Help\" button for more information.", type: "error", confirmButtonText: "Close" });
    }
}
