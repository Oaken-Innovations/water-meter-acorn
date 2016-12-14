pragma solidity ^0.4.6;
// Version 1 - For "Liter Limit Demo" Video

contract WaterMeterAcorn {

    /** Variables **/
    uint public meterValue; /** Current water reading in liters **/
    address public meterKey; /** Address of the water meter **/
    address public owner; /** Address of the water company **/
    
    /** Constructor **/
    function WaterMeterAcorn(address newMeterKey){
        meterKey = newMeterKey;
        owner = msg.sender;
    }
    
    /** Functions **/
    
    /** Store the latest meter value **/
    function updateMeterValue (uint newMeterValue) onlyOwner {
        meterValue = newMeterValue;
    }
    
    /** Transfer ownership of meter to a new meter address **/
    function updateMeterKey (address newMeterKey) onlyOwner {
        meterKey = newMeterKey;
        WaterMeterUpdated(block.timestamp, msg.sender, meterKey, 
        meterValue, "Meter value updated");
    }
    
    /** Reset meter **/ 
    function resetMeter (address individualMeter) onlyOwner {
        WaterMeterUpdated(block.timestamp, msg.sender, individualMeter, 
        meterValue, "Meter value updated before reset");
        delete meterValue;
        WaterMeterReset(block.timestamp, msg.sender, individualMeter, 
        meterValue, "Meter reset");
    }
    
    /** Returns t/f if the function caller != meter address or owner. **/
    function isRequestFromOwnerOrMeterKey (address requester) returns (bool) {
        if (meterKey != requester || owner != requester) {
            WaterMeterError(block.timestamp, msg.sender, requester, 
            meterValue, "Error: Unauthorized Access");
            return false;
        }
        return true;
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
            WaterMeterError(block.timestamp, msg.sender, owner, 
            meterValue, "Error: Unauthorized Access");
        }
        _;
    }
    
    /** Events **/
    event WaterMeterUpdated (uint eventTimeStamp,
                            address indexed callingAddress, 
                            address indexed updateMeterAddressRequested, 
                            uint indexed currentMeterValue, 
                            bytes32 description);
    event WaterMeterReset (uint eventTimeStamp, 
                          address indexed callingAddress, 
                          address indexed updateMeterAddressRequested, 
                          uint indexed currentMeterValue, 
                          bytes32 description);
    event WaterMeterError (uint eventTimeStamp, 
                           address indexed callingAddress, 
                           address indexed updateMeterAddressRequested, 
                           uint indexed currentMeterValue, 
                           bytes32 description);
}