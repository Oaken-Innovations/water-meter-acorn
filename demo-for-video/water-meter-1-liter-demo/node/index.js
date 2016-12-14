// index.js
var Promise = require('es6-promise').Promise;

// import ethereum web3 nodejs library
var Web3 = require('web3');

// *** temp cycle volume for testing
cycleVolume = .02;

// set your web3 object
var web3 = new Web3();

// set the web3 object local blockchain node
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

// log some web3 object values to make sure we're all connected
console.log(web3.version.api);
console.log(web3.isConnected());
console.log(web3.version.node);

// test to see if a local coinbase is running ... we'll need this account to interact with a contract.
var coinbase = web3.eth.accounts[0];

// if default wallet/account isn't set - this won't have a value.  needed to interact with a contract.
console.log(coinbase);
// let's print the balance of the wallet/account to test coinbase settings
// no worries if this is 0... don't need money to read events!
var balance = web3.eth.getBalance(coinbase);
console.log(balance.toString(10));

//  ABI - Application Binary Interface Definition for the contract that we want to interact with.
//  First set the ABI string ... 
var ABIString = '[{"constant":false,"inputs":[{"name":"newMeterKey","type":"address"}],"name":"updateMeterKey","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"kill","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"newMeterValue","type":"uint256"}],"name":"updateMeterValue","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"meterKey","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferContractOwnership","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"individualMeter","type":"address"}],"name":"resetMeter","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"meterValue","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"requester","type":"address"}],"name":"isRequestFromOwnerOrMeterKey","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"inputs":[{"name":"newMeterKey","type":"address"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"eventTimeStamp","type":"uint256"},{"indexed":true,"name":"callingAddress","type":"address"},{"indexed":true,"name":"updateMeterAddressRequested","type":"address"},{"indexed":true,"name":"currentMeterValue","type":"uint256"},{"indexed":false,"name":"description","type":"bytes32"}],"name":"WaterMeterUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"eventTimeStamp","type":"uint256"},{"indexed":true,"name":"callingAddress","type":"address"},{"indexed":true,"name":"updateMeterAddressRequested","type":"address"},{"indexed":true,"name":"currentMeterValue","type":"uint256"},{"indexed":false,"name":"description","type":"bytes32"}],"name":"WaterMeterReset","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"eventTimeStamp","type":"uint256"},{"indexed":true,"name":"callingAddress","type":"address"},{"indexed":true,"name":"updateMeterAddressRequested","type":"address"},{"indexed":true,"name":"currentMeterValue","type":"uint256"},{"indexed":false,"name":"description","type":"bytes32"}],"name":"WaterMeterError","type":"event"}]'

//  Use the string and convert to a JSON object - ABI
var ABI = JSON.parse(ABIString);

// what contract are we going to interact with?
// Change this once you have a contract
var ContractAddress = '0xabd5587ef85212e6ade9aa9477828d097676d4ef';

// Set the local node default account in order to interact with the contract 
// (can't interact with a contract if it doesn't know 'who' it is interacting with)
web3.eth.defaultAccount = web3.eth.accounts[0];

// now retrieve your contract object with the ABI and contract address values
var waterMeter = web3.eth.contract(ABI).at(ContractAddress);

// console.log(waterMeter);

//go get tally from the BC.
var lastStoredBalance = waterMeter.meterValue();

console.log("lastStoredBalance: " + lastStoredBalance);

// Reset vars
var literCount = 0;
var tally = 0;


if (!lastStoredBalance) { literCount = 0; } else { literCount = lastStoredBalance; }

console.log('literCount ' + literCount);

function action() {
    //console.log('button-pushed');
    setTimeout(function() {
        tally += 5;
        console.log(tally);

        //logic for calculating whole liter.
        if (tally > (1 / cycleVolume)) {

            console.log('tally: ' + tally);

            //update liter count
            literCount++;
            console.log('literCount: ' + literCount);
            //update contract. 
            tally = 0;

            updateContract(literCount).then(function() {
                console.log('contract updated to ' + literCount + ' !');
            });
        }
        action();
    }, 1000);
};

function updateContract(newTally) {
    console.log('**update contract!**');
    return new Promise(resolve => {
        setTimeout(() => {
            waterMeter.updateMeterValue(newTally, function(error, result) {
                if (!error) {
                    console.log("TX = " + result)
                    return resolve();
                } else {
                    console.error(error);
                }
            })
        }, 10000);
    });
}

action();
