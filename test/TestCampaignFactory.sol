pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/CampaignFactory.sol";
import "../contracts/Campaign.sol";

contract TestCampaignFactory {

  function testItDeploysCampaign() public {
    CampaignFactory campaignFactory = CampaignFactory(DeployedAddresses.CampaignFactory());
    // simpleStorage.set(89);

    // uint expected = 89;

    // Assert.equal(simpleStorage.get(), expected, "It should store the value 89.");
  }

}

// contract TestCampaign {

//   function testItStoresAValue() public {
//     SimpleStorage simpleStorage = SimpleStorage(DeployedAddresses.SimpleStorage());

//     simpleStorage.set(89);

//     uint expected = 89;

//     Assert.equal(simpleStorage.get(), expected, "It should store the value 89.");
//   }

// }