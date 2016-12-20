var meters = [];
var createNum = 0;
var defaultFrom = 'from: document.getElementById("selectAccount").value';

function getLatestInfo(currentMeterKey) {
    try {
        WaterMeterAcorn = web3.eth.contract(contractABI).at(currentMeterKey);
    } catch (err) {
        swal({ title: "Error!", text: "", type: "error", confirmButtonText: "Close" });
        console.log(err);
    }
}

function createMeter() {
    try {
        // Retrieve contract object.
        var contractObject = getContract();

        // Replace ABI variable with latest ABI.
        contractABI = contractObject.WaterMeterAcorn.info.abiDefinition;

        // Replace WaterMeterAcorn variable with latest info.
        WaterMeterAcorn = web3.eth.contract(contractABI);

        // Deploy the contract in an asyncronous way:
        var myContractReturned = WaterMeterAcorn.new(
            web3.toHex('123 Candy Cane Ln.'), 8, 2016, 5000, 15, {
                data: contractObject.WaterMeterAcorn.code,
                gas: 3000000,
                from: document.getElementById("selectAccount").value
            },
            function(err, myContract) {
                if (!err) {
                    var contractAlerts = document.getElementById("contractAlerts");
                    // NOTE: The callback will fire twice!
                    // Once the contract has the transactionHash property set and once its deployed on an address.

                    // e.g. Check tx hash on the first call (transaction send)
                    if (!myContract.address) {
                        console.log("Transaction Hash: " + myContract.transactionHash) // The hash of the transaction, which deploys the contract
                        var element = document.createElement('div');
                        element.className = 'alert alert-dismissible alert-warning fade in';
                        element.innerHTML = '<button type="button" class="close" data-dismiss="alert">&times;</button><br><h4> Contract processing: ' + myContract.transactionHash + '</h4>';
                        contractAlerts.appendChild(element);

                        // Check address on the second call (contract deployed)
                    } else {
                        console.log("Contract Address: " + myContract.address) // the contract address
                        var element = document.createElement('div');
                        element.className = 'alert alert-dismissible alert-success fade in';
                        element.innerHTML = '<button type="button" class="close" data-dismiss="alert">&times;</button> <br> <h4> Contract created: ' + myContract.address + '</h4>';
                        contractAlerts.appendChild(element);
                        meters.push(myContract.address);
                        document.getElementById("addMeterBox").value = myContract.address;
                        createNum++;
                        document.getElementById("createNum").value = createNum;
                        return myContract.address;
                    }
                } else {
                    swal({ title: "Error!", text: "Error creating contract. Are you connected to an Ethereum node?", type: "error", confirmButtonText: "Close" });
                    console.log("ERROR: " + err);
                }
            });
    } catch (err) {
        swal({ title: "Error!", text: "Error calling createMeter().", type: "error", confirmButtonText: "Close" });
        console.log("ERROR: " + err);
    }
}
0xb6b288235836fcd7b3231cc58e6d6b4ffb74d38b
function addMeter() {
    var meterKey = document.getElementById("addMeterBox").value;
    var sMonth = getMeterConstant('startMonth', meterKey);
    var sYear = getMeterConstant('startYear', meterKey);
    var selectedMonth = document.getElementById("addMonth").value;
    var selectedYear = document.getElementById("addYear").value;
    editMeterTable(sMonth, sYear, meterKey);
    if(selectedMonth == 0 || selectedYear == 0) {
        editMonthlyTable(sMonth, sYear, meterKey)
    } else {
        editMonthlyTable(selectedMonth, selectedYear, meterKey)
    };
    getEvents(null, null, null, '0', 'latest');
}

function updateMeter() {
    var meterKey = document.getElementById("updateMeterBox").value;
    getLatestInfo(meterKey);
    var currentMonth = getMeterConstant('currentMonth', meterKey);
    var currentYear = getMeterConstant('currentYear', meterKey);
    var meterInfoForMonth = getCurrentMeterInfoByMonth(currentMonth, currentYear, meterKey);
    document.getElementById("currMeterBox").value = meterInfoForMonth[0];
    document.getElementById("currGasBox").value = meterInfoForMonth[4];
    document.getElementById("currOwnerBox").value = (getMeterConstant('owner', meterKey)).toString();
}

function updateMeterReading() {
    try {
        var meterKey = document.getElementById("updateMeterBox").value;
        getLatestInfo(meterKey);
        var result = WaterMeterAcorn.updateMeterValue(document.getElementById("newMeterBox").value, getMeterConstant('currentMonth', meterKey), getMeterConstant('currentYear', meterKey), { from: document.getElementById("selectAccount").value, gas: 1800000 });
        console.log("Transaction Hash: " + result) // The hash of the transaction, which deploys the contract
        var element = document.createElement('div');
        element.className = 'alert alert-dismissible alert-warning fade in';
        element.innerHTML = '<button type="button" class="close" data-dismiss="alert">&times;</button><br><h4> Transaction processing: ' + result + '</h4> <p>Give it about 10-20 seconds then close this message and check :)</p>';
        document.getElementById("updateAlerts").appendChild(element);
    } catch (err) {
        swal({ title: "Error!", text: "Error calling updateMeterReading().", type: "error", confirmButtonText: "Close" });
        console.log("ERROR: " + err);
    }
}

function createBill() {
    try {
        var meterKey = document.getElementById("updateMeterBox").value;
        getLatestInfo(meterKey);
        var result = WaterMeterAcorn.createMonthlyBill(getMeterConstant('currentMonth', meterKey), getMeterConstant('currentYear', meterKey), document.getElementById("newGasBox").value, { from: document.getElementById("selectAccount").value, gas: 1800000 });
        console.log("Transaction Hash: " + result) // The hash of the transaction, which deploys the contract
        var element = document.createElement('div');
        element.className = 'alert alert-dismissible alert-warning fade in';
        element.innerHTML = '<button type="button" class="close" data-dismiss="alert">&times;</button><br><h4> Transaction processing: ' + result + '</h4> <p>Give it about 10-20 seconds then close this message and check :)</p>';
        document.getElementById("updateAlerts").appendChild(element);
    } catch (err) {
        swal({ title: "Error!", text: "Error calling createBill Bill Bill Bill Nye The Science Guy().", type: "error", confirmButtonText: "Close" });
        console.log("ERROR: " + err);
    }
}

function transferOwnership() {
    try {
        var meterKey = document.getElementById("updateMeterBox").value;
        getLatestInfo(meterKey);
        var result = WaterMeterAcorn.transferContractOwnership(document.getElementById("newOwnerBox").value, { from: document.getElementById("selectAccount").value, gas: 1800000 });
        console.log("Transaction Hash: " + result) // The hash of the transaction, which deploys the contract
        var element = document.createElement('div');
        element.className = 'alert alert-dismissible alert-warning fade in';
        element.innerHTML = '<button type="button" class="close" data-dismiss="alert">&times;</button><br><h4> Transaction processing: ' + result + '</h4> <p>Give it about 10-20 seconds then close this message and check :)</p>';
        document.getElementById("updateAlerts").appendChild(element);
    } catch (err) {
        swal({ title: "Error!", text: "Error calling transferOwnership().", type: "error", confirmButtonText: "Close" });
        console.log("ERROR: " + err);
    }
}


function getMeterConstant(keyword, meterKey) {
    try {
        getLatestInfo(meterKey);

        var getMeterKeyword;

        if (keyword == 'owner')
            getMeterKeyword = WaterMeterAcorn.owner({ defaultFrom }).toString();
        else if (keyword == 'startYear')
            getMeterKeyword = WaterMeterAcorn.startYear({ defaultFrom }).toString();
        else if (keyword == 'startMonth')
            getMeterKeyword = WaterMeterAcorn.startMonth({ defaultFrom }).toString();
        else if (keyword == 'currentYear')
            getMeterKeyword = WaterMeterAcorn.currentYear({ defaultFrom }).toString();
        else if (keyword == 'currentMonth')
            getMeterKeyword = WaterMeterAcorn.currentMonth({ defaultFrom }).toString();
        else if (keyword == 'physicalAddr')
            getMeterKeyword = web3.toAscii(WaterMeterAcorn.physicalAddr({ defaultFrom }));
        else if (keyword == 'currentMeterValue')
            getMeterKeyword = WaterMeterAcorn.currentMeterValue({ defaultFrom }).toString();
        else if (keyword == 'currentPricePerGallon')
            getMeterKeyword = WaterMeterAcorn.currentPricePerGallon({ defaultFrom }).toString();
        else
            return 'Error!'
        return getMeterKeyword;
    } catch (err) {
        swal({ title: "Error!", text: "Error calling getMeterConstant().", type: "error", confirmButtonText: "Close" });
        console.log("ERROR: " + err);
    }
}

function getCurrentMeterInfoByMonth(month, year, meterKey) {
    // Structure
    // 0 uint256 meterValue
    // 1 uint256 amountOwed
    // 2 uint256 amountPaid
    // 3 uint256 lastUpdated
    // 4 uint256 pricePerGallon
    try {
        getLatestInfo(meterKey);
        var meterInfo;
        var info = new Array();

        meterInfo = WaterMeterAcorn.getMeterInfoByMonth(month, year, { defaultFrom });

        for (i = 0; i < meterInfo.length; i++) {
            info[i] = meterInfo[i].toString();
        }

        return info;
    } catch (err) {
        swal({ title: "Error!", text: "Error calling getCurrentMeterInfoByMonth().", type: "error", confirmButtonText: "Close" });
        console.log("ERROR: " + err);
    }
}

function editMeterTable(month, year, meterKey) {
    meterKey = document.getElementById("addMeterBox").value;
    getLatestInfo(meterKey);

    // Find a <table> element with id="metersTable":
    var table = document.getElementById('metersTable');

    deleteRows(table);

    // Create an empty <tr> element and add it to the last position of the table:
    var row = table.insertRow(1);

    // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
    var key = row.insertCell(0);
    var address = row.insertCell(1);
    var currentRead = row.insertCell(2);
    var currPrice = row.insertCell(3);
    var waterCompID = row.insertCell(4);
    var firstDateTracked = row.insertCell(5);

    // Add some text to the new cells:

    // Key
    if (meterKey == "") key.innerHTML = "Pending";
    else
        key.innerHTML = meterKey;

    // Address
    if (getMeterConstant('physicalAddr', meterKey) == "")
        address.innerHTML = "Pending";
    else
        address.innerHTML = getMeterConstant('physicalAddr', meterKey);

    // Current Read
    if (getMeterConstant('currentMeterValue', meterKey) == "")
        currentRead.innerHTML = "Pending";
    else
        currentRead.innerHTML = getMeterConstant('currentMeterValue', meterKey);

    // Current Price Per Gallon
    if (getMeterConstant('currentPricePerGallon', meterKey) == "")
        currPrice.innerHTML = "Pending";
    else
        currPrice.innerHTML = getMeterConstant('currentPricePerGallon', meterKey) + ' wei';

    // Water Company ID
    if (getMeterConstant('owner', meterKey) == "")
        waterCompID.innerHTML = "Pending";
    else
        waterCompID.innerHTML = getMeterConstant('owner', meterKey);

    // First Date Tracked
    if (getMeterConstant('startMonth', meterKey) == "")
        firstDateTracked.innerHTML = "Pending";
    else
        firstDateTracked.innerHTML = getMeterConstant('startMonth', meterKey) + '/' + getMeterConstant('startYear', meterKey);
}

function editMonthlyTable(month, year, meterKey) {
    meterKey = document.getElementById("addMeterBox").value;
    getLatestInfo(meterKey);

    // Get meter info
    var meterInfo = getCurrentMeterInfoByMonth(month, year, meterKey);

    // Find a <table> element with id="metersTable":
    var table = document.getElementById('metersMonthlyTable');

    deleteRows(table);

    // Create an empty <tr> element and add it to the last position of the table:
    var row = table.insertRow(1);

    // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
    var date = row.insertCell(0);
    var meterRead = row.insertCell(1);
    var amtOwed = row.insertCell(2);
    var amtPaid = row.insertCell(3);
    var pricePerGallon = row.insertCell(4);
    var lastUpdated = row.insertCell(5);

    // Add some text to the new cells:

    // Date
    date.innerHTML = month + '/' + year;

    // Meter Read
    if (meterInfo[0] == "")
        meterRead.innerHTML = "Pending";
    else
        meterRead.innerHTML = meterInfo[0];

    // Amount Owed
    if (getMeterConstant('currentMeterValue', meterKey) == "")
        amtOwed.innerHTML = "Pending";
    else
        amtOwed.innerHTML = meterInfo[1];

    // Amount Paid
    if (getMeterConstant('currentPricePerGallon', meterKey) == "")
        amtPaid.innerHTML = "Pending";
    else
        amtPaid.innerHTML = meterInfo[2] + ' wei';

    // Price Per Gallon
    if (getMeterConstant('owner', meterKey) == "")
        pricePerGallon.innerHTML = "Pending";
    else
        pricePerGallon.innerHTML = meterInfo[3];

    // Last Updated
    if (getMeterConstant('startMonth', meterKey) == "0")
        lastUpdated.innerHTML = "Pending";
    else
        lastUpdated.innerHTML = meterInfo[4];
}

0x0a9520e6adf1f23a0988c72cba612d74fd76c655

function getEvents(name, desc, functCaller, startBlock, endBlock) {

    var events;
    var argsProperties = {};
    var argsRange = {};

    document.getElementById("notificationList").innerHTML = "";

    if (name != null) {
        console.log("name is not null");
        argsProperties["name"] = name;
        console.log(argsProperties.toString());
    }
    if (desc != null) {
        console.log("desc is not null");
        argsProperties["desc"] = desc;
        console.log(argsProperties.toString());
    }
    if (functCaller != null) {
        console.log("functCaller is not null");
        argsProperties["functCaller"] = functCaller;
        console.log(argsProperties.toString());
    }

    argsRange["fromBlock"] = startBlock;
    argsRange["toBlock"] = endBlock;

    events = WaterMeterAcorn.WaterMeterAlert(argsProperties, argsRange);

    events.get(function(error, result) {
        if (!error) {
            for (i = 0; i < result.length; i++) {
                result[i].event;
                createNotification(result[i], i);
            }
        }
    });
};

function createNotification(result, i) {
    var timestamp = (JSON.stringify(result.args.eventTimeStamp)).replace('"', '');

    var element = document.createElement('a');
    element.href = "#";
    element.className = 'list-group-item';
    element.innerHTML = '<i class="fa fa-comment fa-fw"></i> New Notification<span class="pull-right text-muted small"><em>' + moment(timestamp).fromNow(); + '</em></span>';
    document.getElementById("notificationList").appendChild(element);
    console.log(JSON.stringify(result.args.eventTimeStamp));
    var addToElement = document.getElementsByClassName('list-group-item')[i];
    addToElement.addEventListener("click", function(e) {
        swal({
            title: "Information",
            text: 'Timestamp: ' + moment(parseInt(timestamp, 10) * 1000).format('MMMM Do YYYY, h:mm:ss a') + '\n\n' + 
            'Sender: ' + result.args.callingAddress + '\n\n' + 
            'Meter Key: ' + result.args.meterKey + '\n\n' + 
            'Current Meter Value: ' + result.args.currentMeterValueOrSendAmount + '\n\n' + 
            'Description: ' + web3.toAscii(result.args.description),
        });
    }, false);
}

function getBlockchainURL(type, address) {
    try {
        //window.open("https://live.ether.camp/account/" + document.getElementById("contract").value);
        window.open("https://testnet.etherscan.io/" + document.getElementById("contract").value);
        document.getElementById("viewContractOnChain").innerHTML = "<a href=https://www.etherchain.org/account/" + document.getElementById("contract").value + " &quot; target=&quot;_blank&quot;>View smart contract on the Ethereum blockchain</a>";
    } catch (err) {
        swal({ title: "Error! Check Your Contract Address", text: "", type: "error", confirmButtonText: "Close" });
    }
}

function deleteRows(tableName) {
    var rowCount = tableName.rows.length;
    if (rowCount <= 0)
        return;
    for (var i = rowCount - 1; i > 0; i--) {
        tableName.deleteRow(i);
    }
};
