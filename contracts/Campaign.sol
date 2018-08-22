pragma solidity ^0.4.24;
import 'zeppelin/contracts/math/SafeMath.sol';

/// @title Fundraising campaign where contributors vote on use of funds.
contract Campaign {
    using SafeMath for uint256;

    address public manager; // Owner/creator of the campaign.
    uint256 public minimumContribution; // Minimum amount of wei contributor must contribute to the campaign.
    string public infoKey; // Database/IPFS key (not 100% sure how going to use this yet).
    mapping(address => uint256) public contributors; // Address of each approver and how much wei/eth each has contributed.
    address[] public contributorAddresses;
    uint256 public totalContributions; // Track total contributions, which will differ from this.balance if funds are distributed.
    uint256 public contributorsCount; // How many contributors are there.  Less important than totalContributions, but still interesting.
    uint256 public requestDaysDeadline; // Set by the manager when first creating the campaign.  It's known to contributors when they contribute.
    string public title; // Set by the manager when first creating the campaign.
    uint256 public goal; // Set by the manager when first creating the campaign.
    string public category; // Set by the manager when first creating the campaign.
    bool private stopped = false; // Circuit breaker

    // Requests are considered approved if complete === true && overNoLimit === false.  Denied if overNoLimit === true.
    struct Request {
        string description; // Description of the request.  This cannot be changed later, which prevents bait-and-switch.
        uint256 value; // Quantity of funds requested for distribution.
        address recipient; // Address of intended recipient of the funds.
        bool complete; // Whether this request is complete.
        bool overNoLimit; // Are there no votes from addresses accounting for >= 15% of the total contributions?
        string databaseKey; // Location of other request-specific assets like images, videos, etc.
        uint256 noVoteContributionTotal; // Sum of no-votes.  Request is denied if noVoteContributionTotal is ever >= 15% of totalContributions.
        mapping(address => bool) noVotes; // Which contributors have voted against a request.  Can't vote against a request more than once per address.
    	  uint256 createdTimestamp; // Used to calculate the cutoff point where contributors can no longer vote no.
    }
    
    Request[] public requests; // Array of requests.

    // Modifier that restricts the function to only be callable from the manager's address
    modifier restricted() {
        require(msg.sender == manager); // Rejects the function if message sender isn't the manager
        _; // Replaced by the actual function body when the modifier is used.
    }

    // Circuit breaker functionality
    modifier stopInEmergency { if (!stopped) _; }
    modifier onlyInEmergency { if (stopped) _; }

    /**
      * @dev Initialize the campaign and set total contributions to 0.
      * @param minimum min amount contributor can contribute to this campaign.
      * @param creator address of the person creating the campaign.  Necessary because when using a factory, can't pull msg.sender directly.
	    * @param databaseKey key that connects this campaign to external resource.  Probably IPFS for content storage.
      * @param requestDays is set by the manager when first creating the campaign and is known to contributors when they contribute.
      * @param titleInput is set by the manager when first creating the campaign.
      * @param goalInput is set by the manager when first creating the campaign.  This is the funding goal for the campaign.
	    * @param categoryInput is set by the manager when first creating the campaign.
    */
    constructor(uint256 minimum, address creator, string databaseKey, uint256 requestDays, string titleInput, uint256 goalInput, string categoryInput) public {
        manager = creator;
        minimumContribution = minimum;
        infoKey = databaseKey;
        totalContributions = 0;
        requestDaysDeadline = requestDays;
        title = titleInput;
        goal = goalInput;
        category = categoryInput;
    }

    // Circuit breaker functionality
    function toggleContractActive() restricted public {
        // You can add an additional modifier that restricts stopping a contract to be based on another action, such as a vote of users
        stopped = !stopped;
    }

    /**
      * @dev Allows contribution to the campaign.  Campaign manager can stop this functionality in an emergency.
    */    
    function contribute() public payable {
        uint256 amount = msg.value;
        require(msg.value >= minimumContribution);
       
        contributors[msg.sender] += amount; // Tracks how much each 'approver' has contributed.
        totalContributions += msg.value;
       
       	// Increment contributor count only if this is the sender's first contribution. 
        if (contributors[msg.sender] == amount) {
        	contributorsCount++;	
        }  
    }

    /**
      *	@dev The request requires no more than 15% of contributors (by % of total contribution) to vote against it for approval.
      * @param description of the request.
      * @param value amount of wei/eth the request is asking to be distributed.
      * @param recipient address the funds will automatically be sent to if the request is approved.
      * @param databaseKey for IPFS or other database containing request assets (like images/videos/etc).
    */
    function createRequest(string description, uint256 value, address recipient, string databaseKey) public restricted {
        // Initialized with memory keyword because don't need to store this beyond this function.
        // Push newRequest into requests array, where it will be stored long-term.
        Request memory newRequest = Request({ 
           description: description,
           value: value,
           recipient: recipient,
           complete: false,
           overNoLimit: false, // Initialize at false as request isn't over the 15% limit when it's initialized.
           databaseKey: databaseKey,
           noVoteContributionTotal: 0, // No contributors have voted against the request yet.
           /** Using .timestamp here even though it can be manipulated slightly by miners because we want to prevent voting after ~5 days.  
               Accuracy not that important and it's easier (and more accurage) to estimate timestamp than block number.
               Passes the 30 second rule. https://consensys.github.io/smart-contract-best-practices/recommendations/#timestamp-dependence
            */
           createdTimestamp: block.timestamp 
        });
        requests.push(newRequest);
    }

    /**
      *	@dev Requests requires no more than 15% of contributors (by % of total contribution) to vote against it for approval.
      *	@dev Requests will be denied if this no vote pushes it over the 15% limit.
      * @param index of the particular request where contributor is voting 'no'.
    */
    function voteNo(uint256 index) public {
        Request storage request = requests[index]; // Use storage keyword because we want to change the request's state.
        
        require(contributors[msg.sender] > 0); // Check to see if the sender is a contributor to the campaign.
        require(request.createdTimestamp >= now - 1000 * 60 * 60 * 24 * requestDaysDeadline ); // Prevents voting if 'now' is more than 5 days from the request creation timestamp.
        require(!request.noVotes[msg.sender]); //Can't vote twice or change vote.
        
        request.noVotes[msg.sender] = true; // Prevents contributor from voting more than once.
        
        // Increase the no vote contribution total by the amount of wei/eth that the sender address has contributed.
        // If contribute more money after have already voted no, it won't count towards no votes on this request,
        // but it will increase the total contributions, decreasing the % no vote.
        request.noVoteContributionTotal += contributors[msg.sender];

        // Reject the request if this no vote pushes it over the limit
        if ((SafeMath.mul(request.noVoteContributionTotal, 100)).div(totalContributions) >= 15) {
        	request.overNoLimit = true;
        	request.complete = true;
        }
    }

    /**
      * @dev require that request isn't over the 15% no vote limit and that it hasn't been completed previously.
      * @dev can't finalize request if it's not yet past the request days deadline.
      * @param index of the particular request.
    */
    function finalizeRequest(uint256 index) public restricted {
        Request storage request = requests[index]; // Use storage keyword because we want to change the request's state.
        
        require(!request.overNoLimit);
        require(!request.complete);
        require(request.createdTimestamp <= now - 1000 * 60 * 60 * 24 * requestDaysDeadline ); // Prevent finalizing request if haven't reached the request days deadline.
        require(address(this).balance > request.value); // Require there to be enough funds in the campaign.

        request.recipient.transfer(request.value); // Transfer the request total to the recipient address defined when creating the request.
        request.complete = true;
    }

    /**
      * @dev Return request at index.  Restricted, so only manager can access
      * @param index of the particular request to return.
    */
    function getRequest(uint256 index) restricted public view returns(string, uint256, address, bool, bool, string, uint256, uint256) {
        Request memory request = requests[index];  // Use memory so not changing state.
        return (request.description, request.value, request.recipient, request.complete, request.overNoLimit, request.databaseKey, request.noVoteContributionTotal, request.createdTimestamp);
    }

    /**
      * @dev Returns a summary of the campaign
    */
    function getSummary() public view returns(
        uint256, uint256, uint256, uint256, uint256, address, string, uint256, string, uint256, string
    ) { // Not changing in data, so 'view'
        return (
            minimumContribution,
            address(this).balance,
            requests.length,
            contributorsCount,
            totalContributions,
            manager,
            infoKey,
            requestDaysDeadline,
            title, 
            goal, 
            category
        );
    }

    function getRequestCount() public view returns(uint256) {
        return requests.length;
    }

    function getContributionAmount(address contributor) public view returns(uint256) {
      return contributors[contributor];
    }

}