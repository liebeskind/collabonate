import React, { Component } from "react";
import { Form, Button, Input, Message } from "semantic-ui-react";
// import firebase from "../../utils/firebase";

// import Layout from "../../components/Layout";
import CampaignFactoryContract from "../../build/contracts/CampaignFactory.json";
import CampaignContract from "../../build/contracts/Campaign.json";
import getWeb3 from "../utils/getWeb3";
import BasicInfoForm from "../components/BasicInfoForm";
// import ChooseImage from "../../components/ChooseImage";
// import AddStoryAndSubmit from "../../components/AddStoryAndSubmit";
// import CampaignCreatedCongrats from "../../components/CampaignCreatedCongrats";
import styles from "../styles/commonStyles";

class CampaignNew extends Component {
	constructor(props) {
		super(props);

		this.state = {
			web3: null,
			minimumContribution: "",
			errorMessage: "",
			loading: false,
			basicInfo: {},
			basicInfoError: "",
			basicInfoRef: undefined,
			showingPage: 0,
			// campaignInstance: null,
			accounts: null,
			campaignFactoryInstance: null
		};
	}

	componentWillMount() {
		getWeb3
			.then(results => {
				this.setState({
					web3: results.web3
				});

				// Instantiate contract once web3 provided.
				this.instantiateContract();
			})
			.catch(() => {
				console.log("Error finding web3.");
			});
	}

	instantiateContract = async () => {
		/*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

		const contract = require("truffle-contract");
		// const campaign = contract(CampaignContract);
		const campaignFactory = contract(CampaignFactoryContract);
		// campaign.setProvider(this.state.web3.currentProvider);
		campaignFactory.setProvider(this.state.web3.currentProvider);

		this.state.web3.eth.getAccounts(async (error, accounts) => {
			const campaignFactoryInstance = await campaignFactory.deployed();
			// const campaignInstance = await campaign.deployed();

			this.setState({ accounts, campaignFactoryInstance });
		});
	};

	basicInfoSubmitted = async basicInfo => {
		this.setState({ basicInfo: basicInfo });
		try {
			this.setState({ errorMessage: "" });
			if (this.state.basicInfoRef) {
				await this.state.basicInfoRef.update(basicInfo);
				this.setState({ showingPage: 1 });
			} else {
				// const basicInfoRef = await firebase
				// 	.database()
				// 	.ref("campaignBasicInfo")
				// 	.push(basicInfo);
				// this.setState({ basicInfoRef: basicInfoRef, showingPage: 1 });
				this.onSubmit();
			}
		} catch (err) {
			console.log(err.message);
			this.setState({ errorMessage: err.message });
		}
	};

	goBack = () => {
		let toSetPage = this.state.showingPage;
		toSetPage--;
		this.setState({ showingPage: toSetPage });
	};

	next = () => {
		let toSetPage = this.state.showingPage;
		toSetPage++;
		this.setState({ showingPage: toSetPage });
	};

	onSubmit = async story => {
		const { web3, campaignFactoryInstance, accounts } = this.state;
		console.log(accounts);
		this.setState({ loading: true, errorMessage: "" });

		// if (!this.state.basicInfo || !this.state.basicInfo.minimumContribution)
		// 	return this.setState({
		// 		errorMessage:
		// 			"We've encountered an error.  Please go back and make sure you entered a minimum contribution amount for this campaign.  It's the only thing you can't change later."
		// 	});

		// try {
		// 	this.setState({ errorMessage: "" });
		// 	// if (this.state.basicInfoRef) {
		// 	// const toUpdate = { story: story };
		// 	// await this.state.basicInfoRef.update(toUpdate);
		// 	// console.log(this.state.basicInfoRef.key);
		// 	// Save the campaign to smart contract
		try {
			// const accounts = await web3.eth.getAccounts();
			await campaignFactoryInstance.createCampaign(
				// this.state.basicInfo.minimumContribution,
				// this.state.basicInfoRef.key
				1, // minimumContribution
				"Test key",
				5, // Days for requests
				{ from: accounts[0] }
			);
			const deployedCampaigns = await campaignFactoryInstance.getDeployedCampaigns.call();
			console.log("Created new campaign", deployedCampaigns);
			// this.next();
		} catch (err) {
			this.setState({
				errorMessage: `${
					err.message
				} There was an issue creating the campaign in the blockchain.  You're probably not signed into Metamask.  Please sign in now and try again!"`
			});
		}
		this.setState({ loading: false });
		// } else {
		// 	this.setState({
		// 		errorMessage:
		// 			"Sorry, we ran into an issue saving your campaign.  Try again!"
		// 	});
		// }
		// } catch (err) {
		// 	this.setState({ errorMessage: err.message });
		// }
	};

	renderPage = () => {
		// if (this.state.showingPage === 0) {
		return (
			<BasicInfoForm
				basicInfo={this.state.basicInfo}
				basicInfoSubmitted={this.basicInfoSubmitted}
			/>
		);
		// } else if (this.state.showingPage === 1) {
		// 	return (
		// 		<ChooseImage
		// 			goBack={this.goBack}
		// 			basicInfoRef={this.state.basicInfoRef}
		// 			next={this.next}
		// 		/>
		// 	);
		// } else if (this.state.showingPage === 2) {
		// 	return (
		// 		<AddStoryAndSubmit
		// 			goBack={this.goBack}
		// 			submit={this.onSubmit}
		// 			loading={this.state.loading}
		// 		/>
		// 	);
		// } else if (this.state.showingPage === 3) {
		// 	return <CampaignCreatedCongrats />;
		// } else {
		// 	console.log("Should never get here."); // Route back to dashboard?
		// }
	};

	render() {
		const title =
			this.state.basicInfo && this.state.basicInfo.campaignTitle
				? this.state.basicInfo.campaignTitle
				: "Create a Campaign";
		return (
			<div>
				<h2 style={styles.centerText}>{title}</h2>
				<Message
					error
					hidden={!this.state.errorMessage}
					header="Houston, we've got a problem!"
					content={this.state.errorMessage}
				/>
				<div style={styles.centerItem}>{this.renderPage()}</div>
			</div>
		);
	}
}

export default CampaignNew;
