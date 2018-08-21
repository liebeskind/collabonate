import React, { Component } from "react";
import { Table, Button } from "semantic-ui-react";
import getWeb3 from "../utils/getWeb3";

class RequestRow extends Component {
	state = {
		web3: null,
		votedNo: false,
		loading: false
	};

	componentWillMount() {
		// Get network provider and web3 instance.
		// See utils/getWeb3 for more info.

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

	onVoteNo = async () => {
		// // Will be async because will have to reach out to campaign and attempt to reference a given request and approve it.
		const { campaignInstance, currentAccount, id } = this.props;
		this.setState({ loading: true });
		try {
			this.props.campaignInstance
				.voteNo(id, {
					from: currentAccount
				})
				.then(err => {
					this.setState({
						loading: false,
						votedNo: true
					});
				})
				.catch(err => {
					this.setState({
						loading: false,
						errorMessage: err.message
					});
				});
		} catch (err) {
			this.setState({
				loading: false,
				errorMessage: err
			});
		}
	};

	onFinalize = async () => {
		const { campaignInstance, currentAccount, id } = this.props;
		this.setState({ loading: true });
		try {
			this.props.campaignInstance
				.finalizeRequest(id, {
					from: currentAccount
				})
				.then(err => {
					this.setState({
						loading: false,
						votedNo: true
					});
				})
				.catch(err => {
					this.setState({
						loading: false,
						errorMessage: err.message
					});
				});
		} catch (err) {
			this.setState({
				loading: false,
				errorMessage: err
			});
		}
	};

	render() {
		const { Row, Cell } = Table;
		const {
			id,
			request,
			contributorsCount,
			totalContributions
		} = this.props;
		const readyToFinalize = false;
		// const readyToFinalize = request.approvalCount > contributorsCount / 2;
		const { web3, loading } = this.state;

		return (
			<Row
				disabled={request.complete}
				positive={readyToFinalize && !request.complete}
			>
				<Cell>{id}</Cell>
				<Cell>{request.description}</Cell>
				<Cell>
					{web3 ? web3.fromWei(request.value, "ether") : "NA"}
				</Cell>
				<Cell>{request.recipient}</Cell>
				<Cell>
					{(
						(request.noVoteContributionTotal / totalContributions) *
						100
					).toFixed(0)}
					%
				</Cell>
				<Cell>
					{request.complete ? null : ( // Should also check to see if this account is a contributor.
						<Button
							color="green"
							basic
							onClick={this.onVoteNo}
							loading={loading}
						>
							Vote No
						</Button>
					)}
				</Cell>
				<Cell>
					{request.complete ? null : (
						<Button
							color="teal"
							basic
							onClick={this.onFinalize}
							loading={loading}
						>
							Finalize
						</Button>
					)}
				</Cell>
			</Row>
		);
	}
}

export default RequestRow;
