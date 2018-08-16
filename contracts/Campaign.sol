pragma solidity ^0.4.24;

/// @title Fundraising campaign where contributors vote on use of funds.
contract Campaign {
    address public manager; // Owner/creator of the campaign.
    uint public minimumContribution; // Minimum amount of wei contributor must contribute to the campaign.
    string public infoKey; // Database/IPFS key (not 100% sure how going to use this yet).
    mapping(address => uint) public contributors; // Address of each approver and how much [uint] each has contributed.
    uint public totalContributions; // Track total contributions, which will differ from this.balance if funds are distributed.
    uint public contributorsCount; // How many contributors are there.  Less important than totalContributions, but still interesting.

    struct Request {
        string description; // Description of the request.  This cannot be changed later, which prevents bait-and-switch.
        uint value; // Quantity of funds requested for distribution.
        address recipient; // Address of intended recipient of the funds.
        bool complete; // Whether this request is complete.
        string databaseKey; // Location of other request-specific assets like images, videos, etc.
        mapping(address => uint) contributorsSnapshot; // Snapshot of contributors at the time the request is made.
        uint totalContributionsSnapshot; // Snapshot of total contributions at the time the request is made.
        uint noVoteContributionTotal; // Sum of no-votes.  Request is denied if noVoteContributionTotal >= 15% of totalContributionsSnapshot.
        mapping(address => bool) noVotes; // Which contributors have voted against a request.  Can't vote against a request more than once per address.
    }
    
    Request[] public requests; // Array of requests.

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
      * @title Contribute wei to the campaign.
      * @param amount of wei contributed to the campaign.
      * @payable this function will receive eth/wei.
      * @public can call this function external to this contract
    */
    function contribute(uint amount) public payable {
        require(msg.value > minimumContribution);
        
        contributors[msg.sender] = contributors[msg.sender] || 0; // Handles case where contributor has previously contributed.  Adds this contribution to any existing contribution.
        contributors[msg.sender] += amount; // Tracks how much each 'approver' has contributed.
        totalContributions += amount;
        contributorsCount++;
    }

    /**
      * @title Request for use of funds created by campaign owner.  
      	@dev The request requires no more than 15% of contributors (by % of total contribution) to vote against it for approval.
      * @param description of the request.
      * @param value amount of wei/eth the request is asking to be distributed.
      * @param recipient address the funds will automatically be sent to if the request is approved.
      * @param databaseKey for IPFS or other database containing request assets (like images/videos/etc).
      * @restricted modifier defined above that only allows campaign creator to call this function.
      * @public can call this function external to this contract.
    */
    function createRequest(string description, uint value, address recipient, string databaseKey) public restricted {
        Request memory newRequest = Request({
           description: description,
           value: value,
           recipient: recipient,
           complete: false,
           databaseKey: databaseKey,
           contributorsSnapshot: contributors, // Can't loop through this because it's a mapping, but can use it to prevent address from voting no more than once.
           totalContributionsSnapshot: totalContributions
        });
        requests.push(newRequest);
    }


}