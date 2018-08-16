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
    	uint createdTimestamp; // Used to calculate the cutoff point where contributors can no longer vote no.
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
        // Initialized with memory keyword because don't need to store this beyond this function.
        // Push newRequest into requests array, where it will be stored long-term.
        Request memory newRequest = Request({ 
           description: description,
           value: value,
           recipient: recipient,
           complete: false,
           databaseKey: databaseKey,
           contributorsSnapshot: contributors, // Can't loop through this because it's a mapping, but can use it to prevent address from voting no more than once.
           totalContributionsSnapshot: totalContributions,
           noVoteContributionTotal: 0, // No contributors have voted against the request yet.
           // Using .timestamp here even though it can be manipulated slightly by miners because we want to prevent voting after ~5 days.  
           // Accuracy not that important and it's easier (and more accurage) to estimate timestamp than block number.
           createdTimestamp: block.timestamp 
        });
        requests.push(newRequest);
    }

    /**
      * @title Vote no for a particular request
      	@dev Requests requires no more than 15% of contributors (by % of total contribution) to vote against it for approval.
      * @param index of the particular request where contributor is voting 'no'.
      * @public can call this function external to this contract.
    */
    function voteNo(uint index) public {
        Request storage request = requests[index]; // Use storage keyword because we want to change the contract's state.
        
        require(request.contributorsSnapshot[msg.sender]); // Check to see if the sender was a contributor to the campaign at the time the request was made.  Prevent them from voting if they were not.
        require(request.createdTimestamp > now - 1000 * 60 * 60 * 24 * 5 ); // Prevents voting if 'now' is more than 5 days from the request creation timestamp.
        require(!request.noVotes[msg.sender]); //Can't vote twice or change vote.
        
        request.noVotes[msg.sender] = true; // Prevents contributor from voting more than once.
        // Increase the no vote contribution total by the amount of wei/eth that the sender address has contributed at the time of the snapshot (when the request was made).
        // Request will be denied if the # of noVoteContributionTotal / totalContributionsSnapshot >= 0.15.
        request.noVoteContributionTotal += request.contributorsSnapshot[msg.sender];
    }

}