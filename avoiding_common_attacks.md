# Avoiding Common Attacks

### Reentrancy

#### What is it?

An attack where a malicious external contract can be created to recursively call a function inside of a target contract. The function called is one where the balance of an account is checked, then the balance is withdrawn. The malicious contract tricks the target contract into withdrawing the same funds multiple times. Often, contracts with msg.sender.call.value(ethAmt)() are vulnerable. This can be changed to msg.sender.send(ethAmt, which limits the gas stipend to 2,300 and is not enough to launch an attack.

#### Collabonate Solution

-   Contributor accounts cannot withdraw funds from a campaign. The only user that can ever withdraw funds is a campaign manager, but they are only able to do so after a Request Timeline window. Funds are sent to a non-manager account programatically and all users of the system can see where those funds are sent. Funds are sent using request.recipient.transfer(ETH).

### Overflow/Underflow of Integers

#### What is it?

If integers become too big or too small, they wrap around. An integer that gets too big becomes 0. This is especially dangerous when users can input arbitrary data.

#### Collabonate Solution

-   Avoided uint256 overflows/underflows by using the Openzeppelin library

### Poison Data

#### What is it?

Users might input unexpected data that could change the state of the contract.

#### Collabonate Solution

-   Validates inputs and uses require statements in all input functions.

### Race conditions

#### What is it?

Where functions are either repeatedly called before finished and/or share state with other functions.

#### Collabonate Solution

-   No functions share state. No external functions are used.

### Transaction Ordering and Timestamp dependence

#### What is it?

Miners can manipulate block timestamps within a small window.

#### Collabonate Solution

-   Block timestamp is only used in determining when a request has passed the Request Timeline (without accumulating no-votes > 15% of contributor capital) and can be finalize (the funds sent to the recipient). This timing is not very sensitive and can handle a 30 second manipulation without any issues.

-   Block timestamp is not used anywhere else.

-   Use require statement to prevent contributor from voting more than once per request or from changing vote.

### DoS with revert / Block Gas Limit

#### What is it?

If there is a require statement that will trigger a revert, an attacker can intentionally force the contract into a state where that revert will always trigger, rendering the contract useless. With a DOS block gas limit, an attacker pushes the contract into a state where the block gas limit is exceeded whenenver a function is called. This might, for example, be due to a contract looping through an array that an attacker makes incredibly long.

#### Collabonate Solution

-   The only function that a non-manager account can call that modifies the contract state is Contribute(). There are no require statements that could cause a permanent revert that rely on an account's contributed balance.

### Forcibly sending Ether to Contract

#### What is it?

This is an issue where a contract has a conditional statement that depends on a contract's balance being below a certain amount. Attackers might be able to manipulate the contract balance. Even if there is a throw condition preventing a contract from receiving ETH, a malicious contract can selfdestruct with the target contract as the target and the fallback won't be called.

#### Collabonate Solution

-   Collabonate does not use the Campaign contract's balance as a guard.

### Malicious Admins

#### What is it?

Contracts owned by a single account address are dangerous. 'Admins' that have too much power are dangerous.

#### Collabonate Solution

-   No single account has admin power over any contract. When an account creates a campaign, that account becomes the manager of that campaign. Manager privelages are limited. For example, managers can't call the contribute function on behalf of another account.
