# Design Patterns

-   Use of a factory vs. calling Campaign contract directly.  
    This makes it possible to have an array of campaign addreses, which are used to populate the Campaigns dashboard.

-   Fail early, fail loud. All functions check the conditions required for execution at the beginning of the function call.

-   Restricted access. Most functions are only callable by the account (manager) who created the campaign.

-   Voting on requests based on total contribution rather than each address getting 1 vote.  
    This prevents an attack where someone creates thousands of accounts and contributes 1 wei per account. Basing 'no votes' on contribution power ensures that contributors have skin in the game.

-   The account that creates a campaign is set to the manager property of that campaign. Managers have many function privelages, but can't affect campaigns of which they are not the manager. Managers also are limited in their ability to call functions outside the scope of their management responsibilities. For example, managers can not contribute funds on another account's behalf.

-   Storing campaign descriptions, request description and recipient address on the blockchain and not allowing alterations.  
    Prevents a manager for raising money for one purpose, then changin that purpose. Important because the contributors are effectively stakeholders of the campaign.

-   Set the # of days where contributors can 'vote no' to requests when first create campaign and make it immutable.  
    Contributors should know the timeline for 'no votes' when they first contribute to the campaign. By having it immutable, they can rest assure that they'll have time to vote against request. If they contribute to a campaign where the timeline is short, they may not care much about voting no for that particular campaign.

-   Use require statement to prevent contributor from voting more than once per request or from changing vote.

-   Approve / deny requests based on % of no-votes rather than yes-votes.  
    This makes it so that contributors only have to spend gas to prevent a request, rather than spending gas to approve a vote. It also makes it harder for an account manager to 'vote yes' for their own request by creating an alternative account.

-   If the number of no votes is ever 15%, request is denied at that moment vs. checking to see at the end of the request timeline.  
    This is another safeguard that gives contributors more control and prevents a campaign manager from manipulating the results.

-   Accounts can continue to contribute during a request timeline, then vote no with more eth/wei contributed vs. the contribution amount being locked in at the time the request is made.

-   Mapping of accounts that have 'voted no' against a particular request.

-   Manager can create requests that represent more ETH than exist in the contracts, but won't be able to actually transfer the funds until they exist in the contract.  
    Managers are able to create requests real-time.

-   Having campaign manager finalize request vs. having funds transfer automatically at the end of 5 days
    In most cases, managers won't want the funds to transfer without their approval. What if the request is made in anticipation of a future cost. The timing of the funds being released and the cost being incurred may differ.

-   Using block.timestamp vs. block.number for estimating time elapsed in request
    Timestamp can be manipulated slightly by miners, but in this case the exact timing doesn't matter. Manipulating the timestamp by 30 seconds won't have a significant impact.

-   Emergency stop / circuit breaker
    Implements toggleContractActive function, which serves as a circuit breaker. Adds a modifier to any contract that is not already restricted (where only the campaign owner can call it). The modifier can be triggered by the owner to prevent functionality in the event of an emergency.

-   Using msg.sender throughout contract as Ethereum Core developers have stated that developers should not continue to assume tx.origin will be valid.

-   No looping through Arrays in contracts as this can lead to massive gas usage.

-   No built-in centralized censorship. There is a tradeoff between true decentralization and preventing the abuse of the platform. What's to stop an account from raising funds to do something illegal? One way to regulate this would be to use a token ecosystem. Tokens could be generated from voting, contributing and creating campaigns or by buying them on the open market. Token holders would be a governing body and could remove illegal / undesirable campaigns through a voting mechanism.

-   Updates currentAccount by using results.web3.currentProvider.publicConfigStore.on("update", cb) and flow this through the entire app. Prevents a user from seeing the wrong UI when they switch accounts.
