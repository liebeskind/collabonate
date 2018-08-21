pragma solidity ^0.4.24;

import {Campaign} from './Campaign.sol';

/** @title Campaign Factory 
  * @dev this factory will manage all of the campaigns and make it easy to get an array of deployed campaigns.
*/
contract CampaignFactory {
    // Array of deployed campaign addresses
    address[] public deployedCampaigns;
    
    /** 
      *	@dev send msg.sender into new Campaign because won't have access to msg.sender otherwise.  msg.sender in the Campaign contract will be the address of Campaign Factory.
      * @param minimum amount necessary for contribution
      * @param databaseKey key used to identify this campaign in centralized database / IPFS
    */
    function createCampaign(uint minimum, string databaseKey, uint requestDays, string title, uint goal, string category) public {
        address newCampaign = new Campaign(minimum, msg.sender, databaseKey, requestDays, title, goal, category);
        deployedCampaigns.push(newCampaign);
    }
    
    /** @dev Get all deployed campaigns
      * @return array of deployed campaign addresses
    */
    function getDeployedCampaigns() public view returns(address[]) {
        return deployedCampaigns;
    }
}