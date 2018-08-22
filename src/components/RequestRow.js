import React, { Component } from "react";
import moment from "moment";
import { Table, Button } from "semantic-ui-react";
import getWeb3 from "../utils/getWeb3";

class RequestRow extends Component {
	state = {
		web3: null,
		loading: false,
		amountContributed: null,
		votedNo: false
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

		this.getNoVotes();
	}

	getNoVotes = async () => {
		const votedNo = await this.props.campaignInstance.getRequestNoVotes(
			this.props.id,
			this.props.currentAccount
		);
		this.setState({ votedNo });
	};

	onVoteNo = async () => {
		// // Will be async because will have to reach out to campaign and attempt to reference a given request and approve it.
		const { campaignInstance, currentAccount, id } = this.props;
		this.setState({ loading: true });
		try {
			campaignInstance
				.voteNo(id, {
					from: currentAccount
				})
				.then(err => {
					this.setState({
						loading: false,
						votedNo: true
					});
					this.props.showCampaign();
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
			campaignInstance
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
			totalContributions,
			amountCurrentAccountContributed,
			isManager
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
					{web3 ? web3.fromWei(request.value, "ether") : "NA"} ETH
				</Cell>
				<Cell>{moment(request.timestamp).format("MMM D, YYYY")}</Cell>
				<Cell>{request.recipient}</Cell>
				<Cell>
					{!(totalContributions * 1)
						? 0
						: (
								(request.noVoteContributionTotal /
									totalContributions) *
								100
						  ).toFixed(0)}
					%
				</Cell>
				<Cell>
					{request.overNoLimit ? (
						<div>Over No Limit</div> // Should also check to see if this account is a contributor.
					) : request.complete ? (
						<div>Request Complete</div>
					) : this.state.votedNo ? ( // Need to add getter to the contract
						<div>Already Voted No</div> // Should also check to see if this account is a contributor.
					) : isManager ? (
						<div>Managers Can't Vote</div>
					) : !amountCurrentAccountContributed ? (
						<div>Contribute to Vote</div>
					) : (
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
					{request.overNoLimit ? (
						<div>Over No Limit</div>
					) : request.complete ? (
						<div>Request Complete</div>
					) : !isManager ? (
						<div>Only Manager Can Finalize</div> // Should also check to see if this account is a contributor.
					) : (
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
