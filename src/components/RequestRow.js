import React, { Component } from "react";
import { Table, Button } from "semantic-ui-react";
import getWeb3 from "../utils/getWeb3";

class RequestRow extends Component {
	state = {
		web3: null
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

	onApprove = async () => {
		// // Will be async because will have to reach out to campaign and attempt to reference a given request and approve it.
		// const accounts = await web3.eth.getAccounts();
		// await this.props.campaignInstance.methods
		// 	.approveRequest(this.props.id)
		// 	.send({ from: accounts[0] });
	};

	onFinalize = async () => {
		// const campaign = Campaign(this.props.address);

		// const accounts = await web3.eth.getAccounts();
		await this.props.campaignInstance.methods.finalizeRequest(
			this.props.id
		);
		// .send({ from: accounts[0] });
	};

	render() {
		const { Row, Cell } = Table;
		const { id, request, contributorsCount } = this.props;
		const readyToFinalize = request.approvalCount > contributorsCount / 2;
		const { web3 } = this.state;

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
					{request.approvalCount}/{contributorsCount}
				</Cell>
				<Cell>
					{request.complete ? null : (
						<Button color="green" basic onClick={this.onApprove}>
							Approve
						</Button>
					)}
				</Cell>
				<Cell>
					{request.complete ? null : (
						<Button color="teal" basic onClick={this.onFinalize}>
							Finalize
						</Button>
					)}
				</Cell>
			</Row>
		);
	}
}

export default RequestRow;
