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
				results.web3.eth.getAccounts().then(accounts => {
					this.setState({ currentAccount: accounts[0] });
				});
			})
			.catch(() => {
				console.log("Error finding web3.");
			});

		this.getRequests(this.props.campaignInstance);
	}

	getRequests = async campaignInstance => {
		// const { address } = props.query;
		// const campaign = Campaign(address);
		const requestCount = await campaignInstance.methods
			.getRequestCount()
			.call();
		const approversCount = await campaignInstance.methods
			.approversCount()
			.call();

		const requests = await Promise.all(
			Array(parseInt(requestCount))
				.fill() // Gives a list of indices that we want to request from 0 to requestCount.
				.map((element, index) => {
					// Map over each index.
					return campaignInstance.methods.requests(index).call(); // Retrieve a given individual request at given index.
				})
		);

		this.setState({ requests });
	};

	renderRows() {
		const { address, contributorsCount, campaignInstance } = this.props;
		return this.props.requests.map((request, index) => {
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
					createNewRequest={() =>
						this.props.createNewRequest(address)
					}
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
