var CampaignFactory = artifacts.require("./CampaignFactory.sol");

contract("CampaignFactory", function(accounts) {
	it("...should deploy one campaign.", function() {
		return CampaignFactory.deployed()
			.then(function(instance) {
				campaignFactoryInstance = instance;

				return campaignFactoryInstance.createCampaign(
					1000,
					"TestKey",
					5,
					{ from: accounts[0] }
				);
			})
			.then(function() {
				return campaignFactoryInstance.getDeployedCampaigns.call();
			})
			.then(function(storedData) {
				assert.equal(
					storedData.length,
					1,
					"Did not deploy 1 campaign."
				);
			});
	});
	it("...should deploy a second campaign.", function() {
		return CampaignFactory.deployed()
			.then(function(instance) {
				campaignFactoryInstance = instance;

				// Second campaign
				campaignFactoryInstance.createCampaign(1000, "TestKey", 5, {
					from: accounts[0]
				});
			})
			.then(function() {
				return campaignFactoryInstance.getDeployedCampaigns.call();
			})
			.then(function(storedData) {
				assert.equal(
					storedData.length,
					2,
					"Did not deploy 2 campaigns."
				);
			});
	});
	it("...should have deployed contract addresses of type string.", function() {
		return CampaignFactory.deployed()
			.then(function(instance) {
				campaignFactoryInstance = instance;
			})
			.then(function() {
				return campaignFactoryInstance.getDeployedCampaigns.call();
			})
			.then(function(storedData) {
				assert.equal(
					typeof storedData[0],
					"string",
					"Does not store contract addresses as strings."
				);
			});
	});
});
