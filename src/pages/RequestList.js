import React, { Component } from "react";
import { Button, Table } from "semantic-ui-react";
import RequestRow from "../components/RequestRow";
import CreateRequestButton from "../components/CreateRequestButton";
import getWeb3 from "../utils/getWeb3";

class RequestList extends Component {
	state = {
		currentAccount: "",
		web3: null,
		requests: []
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
	}

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
		console.log(requests);
		this.setState({ requests });
	};

	renderRows() {
		const { address, contributorsCount, campaignInstance } = this.props;
		console.log(this.state.requests);
		return this.state.requests.map((request, index) => {
			return (
				<RequestRow
					key={index}
					id={index}
					request={request}
					address={address}
					contributorsCount={contributorsCount}
					campaignInstance={campaignInstance}
				/>
			);
		});
	}

	render() {
		const { Header, Row, HeaderCell, Body } = Table;
		const { manager, address, requestCount } = this.props;

		return (
			<div>
				<h3>Requests</h3>
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
							<HeaderCell>Approval Count</HeaderCell>
							<HeaderCell>Approve</HeaderCell>
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
