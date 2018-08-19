var CampaignFactory = artifacts.require("./CampaignFactory.sol");
var Campaign = artifacts.require("./Campaign.sol");
// const compiledCampaign = require("../build/contracts/Campaign.json");

contract("Campaign", async accounts => {
	// Test to see whether campaign factory deploys.
	it("...should deploy Campaign Factory instance.", async () => {
		const campaignFactoryInstance = await CampaignFactory.deployed();
		assert.ok(campaignFactoryInstance, "Did not deploy Campaign Factory.");
	});

	// Test to see whether campaign factory can deploy a campaign.
	it("...should deploy one campaign.", async () => {
		const campaignFactoryInstance = await CampaignFactory.deployed();
		await campaignFactoryInstance.createCampaign(1000, "TestKey", 5, {
			from: accounts[0]
		});
		let storedData = await campaignFactoryInstance.getDeployedCampaigns.call();
		assert.equal(storedData.length, 1, "Did not deploy 1 campaign.");
	});

	// Check that campaign factory deploys a second campaign by looking at the 2nd spot in the deployedCampaigns array.
	it("...should deploy a second campaign.", async () => {
		const campaignFactoryInstance = await CampaignFactory.deployed();
		// Create second campaign
		await campaignFactoryInstance.createCampaign(1000, "TestKey", 5, {
			from: accounts[0]
		});
		let storedData = await campaignFactoryInstance.getDeployedCampaigns.call();
		assert.equal(storedData.length, 2, "Did not deploy 2nd campaign.");
	});

	// Calling getDeployedCampaigns should return an array of addresses.  Each address should be of type 'string'.
	it("...should have deployed contract addresses of type string.", async () => {
		const campaignFactoryInstance = await CampaignFactory.deployed();
		const storedData = await campaignFactoryInstance.getDeployedCampaigns.call();

		assert.equal(
			typeof storedData[0],
			"string",
			"Does not store contract addresses as strings."
		);
	});

	// Test to see whether can access campaign instance that was created by Campaign Factory at deployed address.
	it("...should be able to access Campaign instance deployed by Campaign Factory.", async () => {
		const campaignFactoryInstance = await CampaignFactory.deployed();
		const storedData = await campaignFactoryInstance.getDeployedCampaigns.call();

		// Get the first deployed campaign.
		let campaign;
		campaign = await Campaign.at(storedData[0]);
		assert.ok(campaign, "Campaign instance should have been created.");
	});
});
