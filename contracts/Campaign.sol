pragma solidity ^0.4.24;

/// @title Fundraising campaign where contributors vote on use of funds.
contract Campaign {
    address public manager; // Owner/creator of the campaign.
    uint public minimumContribution; // Minimum amount of wei contributor must contribute to the campaign.
    string public infoKey; // Database/IPFS key (not 100% sure how going to use this yet).
    mapping(address => uint) public approvers; // Address of each approver and how much [uint] each has contributed.
    uint public totalContributions; // Track total contributions, which will differ from this.balance if funds are distributed.
    uint public approversCount; // How many approvers are there.  Less important than totalContributions, but still interesting.

    /**
      * @title Initialize the campaign and set total contributions to 0.
      * @param minimum min amount contributor can contribute to this campaign.
      * @param creator address of the person creating the campaign.  Necessary because when using a factory, can't pull msg.sender directly.
	  * @param databseKey key that connects this campaign to external resource.  Probably IPFS for content storage.
	  * @public can call this function external to this contract
    */
    function Campaign(uint minimum, address creator, string databaseKey) public {
        manager = creator;
        minimumContribution = minimum;
        infoKey = databaseKey;
        totalContributions = 0;
    }

    /**
      * @title contribute wei to the campaign.
      * @param amount of wei contributed to the campaign.
      * @payable 
      * @public can call this function external to this contract
    */
    function contribute(uint amount) public payable {
        require(msg.value > minimumContribution);
        
        approvers[msg.sender] = approvers[msg.sender] || 0; // Handles case where contributor has previously contributed.  Adds this contribution to any existing contribution.
        approvers[msg.sender] += amount; // Tracks how much each 'approver' has contributed.
        totalContributions += amount;
        approversCount++;
    }
}