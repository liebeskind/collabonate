#Collabonate - Collaborative Fundraising Platform#

##How to Run##

##Description##
Collabonate is a decentralized crowdfunding platform that uses the Ethereum Blockchain to eliminate costs, simplify creating campaigns, empower users to moderate and promote campaigns, reward contributions and empower contributors to govern the use of funds.

There is no escrow service holding the funds. Nor does Collabonate ever get access to funds. Instead, the smart contract itself is the custodian of the capital raised. Funds are released automatically upon meeting certain conditions (achieve the required request votes).

##Why build this?##
Nearly 2 billion people around the world don’t have access to banking or fundraising platforms. Cryptocurrency wallets have recently enabled them to set up digital wallets, but how do they fill those wallets so that they can use the funds to make their lives better through entrepreneurship or the improvement of personal circumstances?

Crowdfunding platforms like GofundMe, Kickstarter or IndieGogo are often not an option for the unbanked. They require careful upfront planning, access to a traditional banking system and don’t provide any advice, guidance or continuing support on the use of funds.

In traditional crowdfunding platforms, contributors need to trust campaign organizers to use the funds responsibly once the goal is met and the funds are released. In many cases, the funds are mismanaged or aren’t used for the stated purpose, but the contributors retain no control and can’t communicate with or offer advice to the campaign organizers. Due to this risk, campaign organizers must craft complex campaigns detailing the expected use of funds, which often includes months of preparation, high costs and lots of upfront planning. Once someone contributes to the campaign, they don’t have any ability to influence how the money is used or to give advice to the campaign organizer.

##User Stories##
Campaign managers can create a campaign with a minimum contribution amount and the number of days they must wait for contributors to 'vote no' on each request (Request Timeline) before funds can be distributed. This is then added it to the Ethereum blockchain.

Contributors can contribute to a campaign and send wei/eth to the smart contract. The amount they have contributed and the total contributions are tracked.

Anytime a campaign manager wants to use funds raised in a campaign and held in a Smart Contract, they must submit a request to the campaign contributors (stakeholders). This request includes a proposed use and a destination Ethereum address. Contributors can 'vote no' to the request at any time during the Request Timeline.

Contributors can vote against the request and the request is considered ‘denied’ if, at any time during the Request Timeline, accounts responsible for 15% of the total contributions vote against it. If the proposed request is not denied at the end of the Request Timeline, the campaign manager finalize the request and the funds are sent programatically to the destination Ethereum address.
