pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/CampaignFactory.sol";
import "../contracts/Campaign.sol";

contract TestCampaignFactory {

  function testItDeploysCampaign() public {
    CampaignFactory campaignFactory = CampaignFactory(DeployedAddresses.CampaignFactory());
    campaignFactory.createCampaign(1000, "TestKey", 5);
    address[] memory deployedCampaigns = campaignFactory.getDeployedCampaigns();

    Assert.equal(deployedCampaigns.length, 1, "It should deploy one campaign.");
  }

}
