// If you want a default contract, put it in here.
// var contractAddress = "";

// If we have a .sol file on a web server, we can grab it and process it.
// Leave blank if you want to use contractCode variable.
// Example: https://raw.githubusercontent.com/ethereum/dapp-bin/master/witness/contract.sol
var onlineContractCode = '';

// This will retrieve the contract code and compile it into a contract object w/ bytecode.
function getContract() {
    // If you have anything in the onlineContractCode variable it will look for it.
    if (onlineContractCode != '') {
        var compiledCode;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = process;
        xhr.open("GET", onlineContractCode, false);
        xhr.send();

        function process() {
            if (xhr.readyState == 4) {
                if (xhr.status === 200 || rawFile.status == 0) {
                    var strippedCode = xhr.responseText.replace(/(\r\n|\n|\r)/gm, "");
                    try {
                        compiledCode = web3.eth.compile.solidity(strippedCode);
                    } catch (err) {
                        swal({ title: "Error! Your contract code from an external URL cannot be compiled or you are not connected to Geth. ", text: "Make sure there are no // comments or apostrophes in your code and you have connected to Geth.", type: "error", confirmButtonText: "Close" });
                    	console.log("ERROR: " + err);
                    }
                }
            }
        }
        return compiledCode;
    // If you do not have any text in the onlineContractCode variable, it will try to read from the contractCode variable.
    } else {
        try {
            var strippedCode = contractCode.replace(/(\r\n|\n|\r)/gm, "");
            compiledCode = web3.eth.compile.solidity(strippedCode);
            console.log(compiledCode);
        } catch (err) {
            swal({ title: "Error! Your contract code from an external URL cannot be compiled or you are not connected to Geth. ", text: "Make sure there are no // comments or apostrophes in your code and you have connected to Geth.", type: "error", confirmButtonText: "Close" });
            console.log("ERROR: " + err);
        }
        return compiledCode;
    }
}
