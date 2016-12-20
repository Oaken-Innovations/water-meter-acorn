pragma solidity ^0.4.7;

/** 
 * Water Meter ACORN Contract v0.2
 * Hudson Jameson
 * Solidity Version: 0.4.7+commit.822622cf.Emscripten.clang
 * License: Apache 2.0
**/

contract WaterMeterAcorn {

    /** Variables **/
    bytes32 public physicalAddr;
    uint public currentMeterValue; /** Current water reading in gallons **/
    uint8 public startMonth; /** Month when the contract was created **/
    uint public startYear; /** Year when the contract was created **/
    uint8 public currentMonth; /** Current month **/
    uint public currentYear; /** Current year **/
    address public meterKey; /** Address of the water meter **/
    address public owner; /** Address of the water company **/
    uint public currentPricePerGallon; /** Price per gallon of water in wei **/
    
    /** Store meter data by month/year **/
    mapping(uint8=>mapping              /** month **/
        (uint=>MonthlyMeterInformation  /** year **/
        ) ) meterInfo;

    struct MonthlyMeterInformation {
      uint meterValue;      /** Water reading in gallons for the month/year **/
      uint amountOwed;      /** amount owed **/
      uint amountPaid;      /** amount paid **/
      uint lastUpdated;     /** epoch time **/
      uint pricePerGallon; /** Price per gallon of water used in wei **/
    }

    /** Constructor **/
    function WaterMeterAcorn(bytes32 newPhysicalAddr, uint8 newMonth, uint newYear, 
    uint initialMeterReading, uint pricePerGallon) {
        physicalAddr = newPhysicalAddr;
        meterKey = this;
        owner = msg.sender;
        startMonth = newMonth;
        startYear = newYear;
        currentMonth = newMonth;
        currentYear = newYear;
        meterInfo[newMonth][newYear];
        decrementDate();
        meterInfo[newMonth][newYear];
        incrementDate();
        currentMeterValue = initialMeterReading;
        meterInfo[newMonth][newYear].meterValue = initialMeterReading;
        meterInfo[newMonth][newYear].pricePerGallon = pricePerGallon;
        currentPricePerGallon = pricePerGallon;
    }
    
    /** Functions **/
    
    /** Store the latest meter value **/
    function updateMeterValue (uint newMeterValue, uint8 month, uint year) {
        if (month == currentMonth && year == currentYear) {
            WaterMeterAlert(block.timestamp, 
            msg.sender, 
            meterKey, 
            currentMeterValue, 
            "Alert: Meter update.");

            currentMeterValue = newMeterValue;
        } else {
            WaterMeterAlert(block.timestamp, 
            msg.sender, 
            meterKey, 
            currentMeterValue, 
            "Meter update outside curr date");

        }
        MonthlyMeterInformation meterInfoToBeUpdated = meterInfo[month][year];
        meterInfoToBeUpdated.meterValue = newMeterValue;
        meterInfoToBeUpdated.lastUpdated = block.timestamp;
    }
    
    /** Transfer ownership of meter to a new meter address **/
    function updateMeterKey (address newMeterKey) onlyOwner {
        meterKey = newMeterKey;
    }
    
    /** Process bill **/
    function createMonthlyBill (uint8 month, uint year, uint newPricePerGallon) {
            MonthlyMeterInformation meterCurrMonth = meterInfo[month][year];
            MonthlyMeterInformation meterPrevMonth = meterInfo[month-1][year-1];
            if (meterCurrMonth.amountOwed == 0 && meterCurrMonth.amountPaid == 0 ) {

                uint billAmount = (meterCurrMonth.meterValue - meterPrevMonth.meterValue) * newPricePerGallon;
                meterCurrMonth.amountOwed = billAmount;
                meterCurrMonth.lastUpdated = block.timestamp;
                meterCurrMonth.pricePerGallon = newPricePerGallon;
                WaterMeterAlert(block.timestamp, msg.sender, meterKey, 
                currentMeterValue, "Alert: Bill created.");
            } else {
                WaterMeterAlert(block.timestamp, msg.sender, owner, 
                currentMeterValue, "Error: Bill creation");
            }
    }
    
     /** Responses
     * 0: Payment failed. Refunding your payment.
     * 1: Payment success. Only a partial payment.
     * 2: Payment success. Bill fully paid for that month.
     * 3: Payment success. Paid with too much ether. Refunding the rest.
     * 4: Payment failed. Already paid in full.
     **/
    function payBill (uint8 month, uint year) payable returns(uint response) {
        MonthlyMeterInformation meter = meterInfo[month][year];
        uint value = msg.value / 2;
        if(meter.amountPaid == meter.amountOwed) {
            return 4;
        } else if (value * 2 <= meter.amountOwed) {
            meter.amountPaid += (value * 2);
            return 1;
        } else if (value * 2 > meter.amountOwed) {
            WaterMeterAlert(block.timestamp, 
            msg.sender, 
            meterKey, 
            currentMeterValue, 
            "Alert: Overpaid. Request refund.");
            meter.amountPaid += (value * 2);
/*          
            Auto-refunds are not working at this time.
            uint sendAmount = (msg.value - meter.amountPaid);
            if(this.balance > sendAmount){
                if (!(msg.sender).send(sendAmount)){d
                    WaterMeterAlert (block.timestamp, msg.sender, sendAmount, msg.sender, "Refund failed.");
                } else {
                  WaterMeterAlert (block.timestamp, msg.sender, sendAmount, msg.sender, "Refund sent.");
                }
*/
            return 3;
        } else {
            return 0;
        }
    }


    /** Reset meter **/ 
    function resetMeter (address individualMeter) onlyOwner {
        WaterMeterAlert(block.timestamp, msg.sender, individualMeter, 
        currentMeterValue, "Meter update before reset");
        delete currentMeterValue;
        WaterMeterAlert(block.timestamp, msg.sender, individualMeter, 
        currentMeterValue, "Meter reset");
    }
    
    /** Returns t/f if the function caller != meter address or owner. **/
    function isRequestFromOwnerOrMeterKey (address requester) returns (bool) {
        if (meterKey != requester || owner != requester) {
            WaterMeterAlert(block.timestamp, msg.sender, requester, 
            currentMeterValue, "Error: Unauthorized Access");
            return false;
        }
        return true;
    }
    
    /** Increment the date **/
    function incrementDate () internal {
        if (currentMonth == 12) {
            currentMonth = 1;
            currentYear += 1;
        } else {
            currentMonth += 1;
        }
    }
    
    /** In the event that you mess up, ability to decrement the date, but event
     * must be declared **/
    function decrementDate() internal {
        if (currentMonth == 1) {
            currentMonth = 12;
            currentYear -= 1;
        } else {
            currentMonth -= 1;
        }
    }
    
    function detectJanuary(uint8 month) internal returns (bool) {
        if (month == 1)
            return true;
        else
            return false;
    }
    
    /** Get monthly reading **/
    function getMeterInfoByMonth(uint8 month, uint year) constant returns 
    (uint meterValue, uint amountOwed, uint amountPaid, uint lastUpdated, uint pricePerGallon) {
        MonthlyMeterInformation retMeterInfo = meterInfo[month][year];
        meterValue = retMeterInfo.meterValue;
        amountOwed = retMeterInfo.amountOwed;
        amountPaid = retMeterInfo.amountPaid;
        lastUpdated = retMeterInfo.lastUpdated;
        pricePerGallon = retMeterInfo.pricePerGallon;
    }
    
    /** Transfer contract ownership to a new water company **/
    function transferContractOwnership(address _newOwner) onlyOwner {
        owner = _newOwner;
    }
    
    /** Destroy contract **/
    function kill() onlyOwner {
        selfdestruct(owner); 
    }
    
    /** Modifers **/
    modifier onlyOwner {
        if (msg.sender != owner) {
            WaterMeterAlert(block.timestamp, msg.sender, owner, 
            currentMeterValue, "Error: Unauthorized Access");
        }
        _;
    }
    
    /** Events **/
    event WaterMeterAlert   (uint eventTimeStamp,
                            address indexed callingAddress, 
                            address indexed meterKey, 
                            uint indexed currentMeterValueOrSendAmount, 
                            bytes32 description);
}