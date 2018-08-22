import React, { Component } from "react";
import { Card, Icon, Grid, Button, Image, Segment } from "semantic-ui-react";
import getWeb3 from "../utils/getWeb3";
import ContributeForm from "../components/ContributeForm";

class ShowCampaign extends Component {
	constructor(props) {
		super(props);

		this.state = {
			web3: null,
			currentAccount: null
		};
	}

	componentWillMount() {
		getWeb3
			.then(results => {
				this.setState({
					web3: results.web3
				});

				// Get current account info
				this.state.web3.eth.getAccounts(async (error, accounts) => {
					this.setState({ currentAccount: accounts[0] });
					this.getCampaignContribution(accounts[0]);
				});
			})
			.catch(() => {
				console.log("Error finding web3.");
			});
	}

	getCampaignContribution = async account => {
		const contributed = await this.props.contractInfo.campaignInstance.getContributionAmount(
			account
		);
		this.setState({
			amountCurrentAccountContributed: contributed * 1
		});
	};

	render() {
		const {
			balance,
			address,
			manager,
			minimumContribution,
			requestsCount,
			contributorsCount,
			infoKey,
			campaignInstance,
			days,
			goal,
			title,
			category,
			requestDaysDeadline
		} = this.props.contractInfo;

		const { web3, amountCurrentAccountContributed } = this.state;

		const balanceEther = web3 ? web3.fromWei(balance * 1, "ether") : 0;
		const progress = (balanceEther / goal) * 1 * 100;

		return (
			<div>
				<Button
					onClick={() => this.props.navigateHome(this.props.address)}
				>
					Back
				</Button>
				<Segment>
					<Grid relaxed padded stackable divided="vertically">
						<Grid.Row>
							<Grid.Column width={10}>
								<Grid.Row>
									<Card fluid>
										<Card.Content>
											<Card.Header>{title}</Card.Header>
											<Card.Meta>{category}</Card.Meta>
											<Card.Meta>
												{`Progress: ${balanceEther} / ${goal *
													1} ETH`}
											</Card.Meta>
										</Card.Content>
									</Card>
								</Grid.Row>
							</Grid.Column>
							<Grid.Column width={6}>
								<Grid.Row>
									<Segment>
										<h2>
											<strong>
												Balance: {balanceEther * 1} ETH
											</strong>
										</h2>
										<div>
											Raised from {contributorsCount * 1}{" "}
											contributors
										</div>
										<br />
										<ContributeForm
											minContribution={
												minimumContribution * 1
											}
											navigateHome={
												this.props.navigateHome
											}
											address={address * 1}
											web3={web3}
											campaignInstance={campaignInstance}
											amountCurrentAccountContributed={
												amountCurrentAccountContributed
											}
											isManager={
												this.state.currentAccount ===
												manager
											}
										/>
										<br />
									</Segment>
								</Grid.Row>
								<br />
								<Grid.Row>
									<Segment>
										<h3>{requestsCount * 1} requests</h3>

										<h4>
											Requests can be voted against for{" "}
											{requestDaysDeadline * 1} days
										</h4>

										<Button
											onClick={() =>
												this.props.showRequestList(
													address
												)
											}
											fluid
											secondary
										>
											View Requests
										</Button>
									</Segment>
								</Grid.Row>
								<br />
								<Grid.Row>
									<Card fluid>
										<Card.Content>
											<Card.Header>Manager</Card.Header>
											<Card.Meta
												style={{
													overflowWrap: "break-word"
												}}
											>
												{manager}
											</Card.Meta>
											<Card.Description>
												The Manager created this
												campaign and can create requests
												to withdraw money.
											</Card.Description>
										</Card.Content>
									</Card>
								</Grid.Row>
							</Grid.Column>
						</Grid.Row>
					</Grid>
				</Segment>
			</div>
		);
	}
}

export default ShowCampaign;
