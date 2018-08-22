import React, { Component } from "react";
import { Button, Table } from "semantic-ui-react";
import RequestRow from "../components/RequestRow";
import CreateRequestButton from "../components/CreateRequestButton";
import getWeb3 from "../utils/getWeb3";

class RequestList extends Component {
	state = {
		currentAccount: "",
		web3: null,
		requests: [],
		amountCurrentAccountContributed: 0
	};

	componentWillMount() {
		getWeb3
			.then(results => {
				this.setState({
					web3: results.web3
				});

				// Get current account info
				this.state.web3.eth.getAccounts(async (error, accounts) => {
					this.setState({ currentAccount: accounts[0] });
				});
			})
			.catch(() => {
				console.log("Error finding web3.");
			});

		this.getRequests(this.props.campaignInstance);
		this.getCampaignContribution();
	}

	getCampaignContribution = async () => {
		const contributed = await this.props.campaignInstance.getContributionAmount(
			this.props.currentAccount
		);
		console.log(contributed);
		this.setState({
			amountCurrentAccountContributed: contributed
		});
	};

	getRequests = async campaignInstance => {
		const requestCount = await campaignInstance.getRequestCount.call();

		let requests = [];
		for (var i = 0; i < requestCount; i++) {
			const fetched = await campaignInstance.requests.call(i);
			requests.push({
				description: fetched[0],
				value: fetched[1] * 1,
				recipient: fetched[2],
				complete: fetched[3],
				overNoLimit: fetched[4],
				databaseKey: fetched[5],
				noVoteContributionTotal: fetched[6] * 1,
				createdTimestamp: fetched[7] * 1
			});
		}

		this.setState({ requests });
	};

	renderRows() {
		const {
			address,
			contributorsCount,
			campaignInstance,
			totalContributions
		} = this.props;
		return this.state.requests.map((request, index) => {
			return (
				<RequestRow
					key={index}
					id={index}
					request={request}
					address={address}
					contributorsCount={contributorsCount}
					campaignInstance={campaignInstance}
					currentAccount={this.state.currentAccount}
					totalContributions={totalContributions}
					amountCurrentAccountContributed={
						this.state.amountCurrentAccountContributed
					}
				/>
			);
		});
	}

	render() {
		const { Header, Row, HeaderCell, Body } = Table;
		const { manager, address, requestCount } = this.props;

		return (
			<div>
				<Button onClick={() => this.props.showCampaign(address)}>
					Back
				</Button>
				<h3>Requests</h3>
				<h4>
					Amount Current Account Contributed:{" "}
					{this.state.amountCurrentAccountContributed}
				</h4>
				<CreateRequestButton
					currentAccount={this.state.currentAccount}
					manager={manager}
					address={address}
					createNewRequest={this.props.createNewRequest}
				/>
				<Table>
					<Header>
						<Row>
							<HeaderCell>ID</HeaderCell>
							<HeaderCell>Description</HeaderCell>
							<HeaderCell>Amount</HeaderCell>
							<HeaderCell>Recipient</HeaderCell>
							<HeaderCell>% No Vote</HeaderCell>
							<HeaderCell>Vote No</HeaderCell>
							<HeaderCell>Finalize</HeaderCell>
						</Row>
					</Header>
					<Body>{this.renderRows()}</Body>
				</Table>
				<div>Found {requestCount} requests.</div>
			</div>
		);
	}
}

export default RequestList;
