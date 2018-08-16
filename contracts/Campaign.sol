pragma solidity ^0.4.24;

/// @title Fundraising campaign where contributors vote on use of funds.
contract Campaign {
    address public manager; // Owner/creator of the campaign.
    uint public minimumContribution; // Minimum amount contributor can contribute to the campaign.
    string public infoKey; // Database/IPFS key (not 100% sure how going to use this yet).
    
    /**
      * @param minimum min amount contributor can contribute to this campaign.
      * @param creator address of the person creating the campaign.  Necessary because when using a factory, can't pull msg.sender directly.
	  * @param databseKey key that connects this campaign to external resource.  Probably IPFS for content storage.
	  * @public can call this function externally
    */
    function Campaign(uint minimum, address creator, string databaseKey) public {
        manager = creator;
        minimumContribution = minimum;
        infoKey = databaseKey;
    }
}