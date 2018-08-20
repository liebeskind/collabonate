var CampaignFactory = artifacts.require("./CampaignFactory.sol");
var Campaign = artifacts.require("./Campaign.sol");
// const compiledCampaign = require("../build/contracts/Campaign.json");

const minimumContribution = 100;

contract("Campaign", async accounts => {
	// Test to see whether campaign factory deploys.
	it("...should deploy Campaign Factory instance.", async () => {
		const campaignFactoryInstance = await CampaignFactory.deployed();
		assert.ok(campaignFactoryInstance, "Did not deploy Campaign Factory.");
	});

	// Test to see whether campaign factory can deploy a campaign.
	it("...should deploy one campaign.", async () => {
		const campaignFactoryInstance = await CampaignFactory.deployed();
		await campaignFactoryInstance.createCampaign(
			minimumContribution,
			"TestKey",
			5,
			{
				from: accounts[0]
			}
		);
		let storedData = await campaignFactoryInstance.getDeployedCampaigns.call();
		assert.equal(storedData.length, 1, "Did not deploy 1 campaign.");
	});

	// Check that campaign factory deploys a second campaign by looking at the 2nd spot in the deployedCampaigns array.
	it("...should deploy a second campaign.", async () => {
		const campaignFactoryInstance = await CampaignFactory.deployed();
		// Create second campaign
		await campaignFactoryInstance.createCampaign(
			minimumContribution,
			"TestKey",
			5,
			{
				from: accounts[0]
			}
		);
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
		const campaign = await Campaign.at(storedData[0]);
		assert.ok(campaign, "Campaign instance should have been created.");
	});

	// Important to test that the manager address equals accounts[0] rather than the Campaign Factory deployed address.
	// msg.sender at time Campaign is created will equal the Campaign Factory deployed address.
	it("...should have manager address equal to current account.", async () => {
		const campaignFactoryInstance = await CampaignFactory.deployed();
		const storedData = await campaignFactoryInstance.getDeployedCampaigns.call();

		const campaign = await Campaign.at(storedData[0]);
		const managerAddress = await campaign.manager.call();

		assert.equal(
			managerAddress,
			accounts[0],
			"Campaign instance should have manager address equal to current account."
		);
	});

	it("...should be able to contribute to a campaign from second account.", async () => {
		const campaignFactoryInstance = await CampaignFactory.deployed();
		const storedData = await campaignFactoryInstance.getDeployedCampaigns.call();

		const campaign = await Campaign.at(storedData[0]);
		await campaign.contribute(minimumContribution);
		// .call({ from: accounts[1] });
		// const contributors = await campaign.contributors.call();
		// const totalContributions = await campaign.totalContributions.call();
		// const contributorsCount = await campaign.contributorsCount.call();

		assert.equal(
			contributors[accounts[1]],
			minimumContribution,
			"Campaign should have received contribution from accounts[1] of minimumContribution."
		);

		// assert.equal(
		// 	contributors[accounts[1]],
		// 	minimumContribution,
		// 	"Campaign should have received contribution from accounts[1] of minimumContribution."
		// );
	});
});
