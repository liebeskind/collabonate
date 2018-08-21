pragma solidity ^0.4.11;
import 'zeppelin/contracts/token/StandardToken.sol';

/** @title Creation of a CollabonateCoin, which could be used to power the Collabonate system
  * @dev This coin could be required to make donations and be rewarded for participation in the network.
*/
contract CollabonateCoin is StandardToken {
  string public symbol = "COLL";
  string public name = "CollabonateCoin";
  uint8 public decimals = 18;

  function CollabonateCoin() public {
    balances[msg.sender] = 1000 * (10 ** uint256(decimals));
    totalSupply = 1000 * (10 ** uint256(decimals));
  }
}