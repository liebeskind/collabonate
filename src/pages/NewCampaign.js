import React, { Component } from "react";
import { Message } from "semantic-ui-react";
import CampaignFactoryContract from "../../build/contracts/CampaignFactory.json";
import getWeb3 from "../utils/getWeb3";
import BasicInfoForm from "../components/BasicInfoForm";
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
		const contract = require("truffle-contract");
		const campaignFactory = contract(CampaignFactoryContract);
		campaignFactory.setProvider(this.state.web3.currentProvider);

		this.state.web3.eth.getAccounts(async (error, accounts) => {
			const campaignFactoryInstance = await campaignFactory.deployed();
			this.setState({ accounts, campaignFactoryInstance });
		});
	};

	basicInfoSubmitted = basicInfo => {
		this.setState({ basicInfo: basicInfo });
		this.onSubmit(basicInfo);
	};

	onSubmit = async basicInfo => {
		const { campaignFactoryInstance, accounts } = this.state;
		this.setState({ loading: true, errorMessage: "" });
		try {
			await campaignFactoryInstance.createCampaign(
				basicInfo.minimumContribution * 1,
				"Test key",
				basicInfo.requestDays * 1,
				basicInfo.title,
				basicInfo.goal * 1,
				basicInfo.category,
				{ from: accounts[0] }
			);
			const deployedCampaigns = await campaignFactoryInstance.getDeployedCampaigns.call();
			console.log("Created new campaign", deployedCampaigns);
			this.props.campaignCreated();
			// this.next();
		} catch (err) {
			this.setState({
				errorMessage: `${
					err.message
				} There was an issue creating the campaign in the blockchain.  You're probably not signed into Metamask.  Please sign in now and try again!"`
			});
		}
		this.setState({ loading: false });
	};

	renderPage = () => {
		// if (this.state.showingPage === 0) {
		return (
			<BasicInfoForm
				basicInfo={this.state.basicInfo}
				basicInfoSubmitted={this.basicInfoSubmitted}
				loading={this.state.loading}
			/>
		);
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
