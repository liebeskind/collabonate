var CampaignFactory = artifacts.require("./CampaignFactory.sol");
var Campaign = artifacts.require("./Campaign.sol");
// const compiledCampaign = require("../build/contracts/Campaign.json");

const minimumContribution = 1000;

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
			0,
			"Example Title",
			300,
			"Category",
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
			"Example Title",
			300,
			"Category",
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

	// Contribute to account from accounts[1]
	// Then check that total contributions increased by amount contributed.
	// Then check that there is a total of 1 contributor
	it("...should be able to contribute to a campaign from second account.", async () => {
		const campaignFactoryInstance = await CampaignFactory.deployed();
		const storedData = await campaignFactoryInstance.getDeployedCampaigns.call();
		const campaign = await Campaign.at(storedData[0]);

		await campaign.contribute.sendTransaction({
			value: minimumContribution,
			from: accounts[1]
		});

		const totalContributions = await campaign.totalContributions.call();
		const contributorsCount = await campaign.contributorsCount.call();

		assert.equal(
			totalContributions,
			minimumContribution,
			"Campaign should have received contribution from accounts[1] of minimumContribution."
		);

		assert.equal(
			contributorsCount,
			1,
			"Campaign should have 1 contributor."
		);
	});

	// Check that contributor count doesn't increase from 1 if same account contributes a second time.
	// However, totalContributions should increase by the amount of the contribution.
	it("...shouldn't increase contributor count if same account contributes again.", async () => {
		const campaignFactoryInstance = await CampaignFactory.deployed();
		const storedData = await campaignFactoryInstance.getDeployedCampaigns.call();
		const campaign = await Campaign.at(storedData[0]);

		await campaign.contribute.sendTransaction({
			value: minimumContribution,
			from: accounts[1]
		});

		const totalContributions = await campaign.totalContributions.call();
		const contributorsCount = await campaign.contributorsCount.call();

		assert.equal(
			contributorsCount,
			1,
			"Campaign should have 1 contributor."
		);

		assert.equal(
			totalContributions,
			minimumContribution * 2,
			"Campaign should have received contribution from accounts[1] of minimumContribution."
		);
	});

	// Check that contributor count increase to 2 if another account contributes.
	it("...should increase contributor count if another account contributes.", async () => {
		const campaignFactoryInstance = await CampaignFactory.deployed();
		const storedData = await campaignFactoryInstance.getDeployedCampaigns.call();
		const campaign = await Campaign.at(storedData[0]);

		await campaign.contribute.sendTransaction({
			value: minimumContribution,
			from: accounts[2]
		});

		const contributorsCount = await campaign.contributorsCount.call();

		assert.equal(
			contributorsCount,
			2,
			"Campaign should have 2 contributor."
		);
	});

	// Test whether request can be created and whether the requests can be retrieved.
	it("...should be able to create a request from the manager account and set recipient to third account.", async () => {
		const campaignFactoryInstance = await CampaignFactory.deployed();
		const storedData = await campaignFactoryInstance.getDeployedCampaigns.call();
		const campaign = await Campaign.at(storedData[0]);
		const requestAmount = 10;

		await campaign.createRequest(
			"Example description",
			requestAmount,
			accounts[2],
			"Database Key",
			{
				from: accounts[0]
			}
		);

		const request = await campaign.getRequest(0);
		const description = request[0];
		const value = request[1];
		const recipient = request[2];
		const complete = request[3];
		const overNoLimit = request[4];
		const databaseKey = request[5];
		const noVoteContributionTotal = request[6];
		const createdTimestamp = request[7];

		assert.ok(request, "Should have been able to create a request.");

		assert.equal(
			recipient,
			accounts[2],
			"Should have been able to set recipient to the 3rd account."
		);

		assert.equal(
			value,
			requestAmount,
			"Request value should equal request amount."
		);

		assert.equal(complete, false, "Should not be complete.");
		assert.equal(overNoLimit, false, "Should not be over no vote.");
	});

	// Test whether accounts that have contributed can vote against a request.
	// No vote contribution total should equal the amount the voting account contributed.

	// Finalize request
	it("...should be able to finalize a request.", async () => {
		const campaignFactoryInstance = await CampaignFactory.deployed();
		const storedData = await campaignFactoryInstance.getDeployedCampaigns.call();
		const campaign = await Campaign.at(storedData[0]);

		// First parameter is request index account is voting against.  In this case, voting against request #1.
		await campaign.finalizeRequest(0, {
			from: accounts[0]
		});

		const request = await campaign.getRequest(0);
		const complete = request[3];

		assert.equal(complete, true, "Should be able to complete request.");
	});

	it("...should be able to create a second request.", async () => {
		const campaignFactoryInstance = await CampaignFactory.deployed();
		const storedData = await campaignFactoryInstance.getDeployedCampaigns.call();
		const campaign = await Campaign.at(storedData[0]);
		const requestAmount = 10;

		await campaign.createRequest(
			"Example description",
			requestAmount,
			accounts[2],
			"Database Key",
			{
				from: accounts[0]
			}
		);

		const requestCount = await campaign.getRequestCount.call();

		assert.equal(
			requestCount * 1,
			2,
			"Should have been able to create a second request."
		);
	});

	it("...should be able to vote against request from account that contributed.", async () => {
		const campaignFactoryInstance = await CampaignFactory.deployed();
		const storedData = await campaignFactoryInstance.getDeployedCampaigns.call();
		const campaign = await Campaign.at(storedData[0]);

		// First parameter is request index account is voting against.  In this case, voting against request #1.
		await campaign.voteNo(1, {
			from: accounts[1]
		});

		const request = await campaign.getRequest(1);
		const noVoteContributionTotal = request[6];

		assert.equal(
			noVoteContributionTotal,
			minimumContribution * 2,
			"Should have been able to vote no and total contributions of no votes should be correct."
		);
	});

	it("...should be over no vote limit.", async () => {
		const campaignFactoryInstance = await CampaignFactory.deployed();
		const storedData = await campaignFactoryInstance.getDeployedCampaigns.call();
		const campaign = await Campaign.at(storedData[0]);
		const totalContributions = await campaign.totalContributions.call();

		const request = await campaign.getRequest(1);
		const complete = request[3];
		const overNoLimit = request[4];
		const noVoteContributionTotal = request[6];

		assert.isAtLeast(
			noVoteContributionTotal / totalContributions,
			0.15,
			"No Vote contributions / total contributions should be greater than 0.15."
		);

		assert.equal(overNoLimit, true, "Should be over no vote limit.");
		assert.equal(complete, true, "Should be complete.");
	});

	it("...should not let manager finalize request that is over the no vote limit.", async () => {
		const campaignFactoryInstance = await CampaignFactory.deployed();
		const storedData = await campaignFactoryInstance.getDeployedCampaigns.call();
		const campaign = await Campaign.at(storedData[0]);

		// This should fail and throw an error, which we 'catch'.
		campaign
			.finalizeRequest(0, {
				from: accounts[0]
			})
			.then(result => {})
			.catch(error => {
				assert.include(
					error.message,
					"VM Exception",
					"Should throw error if manager tries to finalize request over the no vote limit"
				);
			});
	});
});
