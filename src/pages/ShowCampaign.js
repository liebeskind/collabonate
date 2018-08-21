import React, { Component } from "react";
import { Card, Icon, Grid, Button, Image, Segment } from "semantic-ui-react";
import getWeb3 from "../utils/getWeb3";
import ContributeForm from "../components/ContributeForm";

class ShowCampaign extends Component {
	constructor(props) {
		super(props);

		this.state = {
			web3: null
		};
	}

	componentWillMount() {
		getWeb3
			.then(results => {
				this.setState({
					web3: results.web3
				});
			})
			.catch(() => {
				console.log("Error finding web3.");
			});
	}

	renderCards() {
		const {
			balance,
			manager,
			minimumContribution,
			requestsCount,
			contributorsCount
		} = this.props;

		const items = [
			{
				header: "Manager",
				meta: manager,
				description:
					"The Manager created this campaign and can create requests to withdraw money.",
				style: { overflowWrap: "break-word" }
			}
		];
		return <Card.Group itemsPerRow={1} doubling items={items} />;
	}

	render() {
		const {
			balance,
			address,
			manager,
			minimumContribution,
			requestsCount,
			contributorsCount,
			infoKey,
			campaignInstance
		} = this.props;

		const { web3 } = this.state;

		// const balanceEther = web3.utils.fromWei(balance, "ether");
		// const progress = (balanceEther / goal) * 100;

		return (
			<Segment>
				<Grid relaxed padded stackable divided="vertically">
					<Grid.Row>
						<Grid.Column width={10}>
							<Grid.Row>
								<Card fluid />
							</Grid.Row>
						</Grid.Column>
						<Grid.Column width={6}>
							<Grid.Row>
								<Segment>
									<h2>
										<strong>Balance: {balance}</strong>
									</h2>
									<div>
										Raised by {contributorsCount} people
									</div>
									<br />
									<ContributeForm
										minContribution={minimumContribution}
										address={address}
										web3={web3}
										campaignInstance={campaignInstance}
									/>
									<br />
								</Segment>
							</Grid.Row>
							<br />
							<Grid.Row>
								<Segment>
									<h3>
										{requestsCount} requests pending (
										{balance} Wei balance)
									</h3>

									<Button fluid secondary>
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
											The Manager created this campaign
											and can create requests to withdraw
											money.
										</Card.Description>
									</Card.Content>
								</Card>
							</Grid.Row>
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</Segment>
		);
	}
}

export default ShowCampaign;
