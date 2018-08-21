import React, { Component } from "react";
import { Form, Button, Message, Input } from "semantic-ui-react";
import getWeb3 from "../utils/getWeb3";

class RequestNew extends Component {
	state = {
		value: "",
		description: "",
		recipient: "",
		loading: false,
		errorMessage: "",
		web3: null,
		currentAccount: null
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
	}

	onSubmit = async event => {
		event.preventDefault(); // Don't want it to try submitting to our 'server', which is default behavior.

		const { campaignInstance, address } = this.props;
		const {
			description,
			value,
			recipient,
			web3,
			currentAccount
		} = this.state;

		this.setState({ loading: true, errorMessage: "" });

		const valueToRequest = web3.toWei(value, "ether");
		console.log(description);
		console.log(valueToRequest);
		console.log(recipient);
		console.log(currentAccount);
		try {
			// web3.eth.getAccounts((error, accounts) => {
			campaignInstance.createRequest(
				description,
				valueToRequest,
				recipient,
				"Test Key",
				{
					from: currentAccount
				}
			);
			// });
		} catch (err) {
			this.setState({ loading: false, errorMessage: err.message });
		}
	};

	render() {
		return (
			<div>
				<Button
					onClick={() =>
						this.props.showRequestList(this.props.address)
					}
				>
					Back
				</Button>

				<h3>Create a Request</h3>
				<Form
					onSubmit={this.onSubmit}
					error={!!this.state.errorMessage}
				>
					<Form.Field>
						<label>Description</label>
						<Input
							value={this.state.description}
							onChange={event =>
								this.setState({
									description: event.target.value
								})
							}
						/>
					</Form.Field>
					<Form.Field>
						<label>Value in Ether</label>
						<Input
							value={this.state.value}
							onChange={event =>
								this.setState({ value: event.target.value })
							}
						/>
					</Form.Field>
					<Form.Field>
						<label>Recipient</label>
						<Input
							value={this.state.recipient}
							onChange={event =>
								this.setState({ recipient: event.target.value })
							}
						/>
					</Form.Field>
					<Message error content={this.state.errorMessage} />
					<Button primary loading={this.state.loading}>
						Create
					</Button>
				</Form>
			</div>
		);
	}
}

export default RequestNew;
