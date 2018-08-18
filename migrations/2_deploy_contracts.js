var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var CampaignFactory = artifacts.require("./CampaignFactory.sol");

module.exports = function(deployer) {
	deployer.deploy(SimpleStorage);
	deployer.deploy(CampaignFactory);
};
