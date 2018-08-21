import React, { Component } from "react";
import { Form, Input, Message, Button, Icon } from "semantic-ui-react";
import getWeb3 from "../utils/getWeb3";

class ContributeForm extends Component {
	state = {
		value: "",
		errorMessage: "",
		loading: false,
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

	onSubmit = async event => {
		event.preventDefault();

		const { campaignInstance } = this.props;
		const { web3 } = this.state;

		this.setState({ loading: true, errorMessage: "" });

		let valueToSend = web3.toWei(this.state.value, "ether");

		try {
			web3.eth.getAccounts((error, accounts) => {
				campaignInstance
					.contribute({
						from: accounts[0],
						value: valueToSend
					})
					.then(error => {
						this.setState({ loading: false, value: "" });
						this.props.navigateHome();
					});
			});
		} catch (err) {
			this.setState({ errorMessage: err.message, loading: false });
		}
	};

	render() {
		return (
			<Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
				<Form.Field>
					<label>
						Amount to Contribute (
						{this.props.minContribution
							.toString()
							.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
						Wei Minimum)
					</label>
					<Input
						value={this.state.value}
						onChange={event =>
							this.setState({ value: event.target.value })
						}
						label="ETH"
						labelPosition="right"
					/>
				</Form.Field>
				<Message
					header="Adding to Ethereum Blockchain"
					hidden={!this.state.loading}
					content={
						"We've submitted your contribution to the Ethereum blockchain!  Miners are solving the current block hash, which should take ~20 seconds. Ain't technology grand?!"
					}
				/>
				<Message
					error
					header="Oops"
					content={this.state.errorMessage}
				/>
				<Button
					type="submit"
					fluid
					primary
					loading={this.state.loading}
				>
					Contribute!
				</Button>
			</Form>
		);
	}
}

export default ContributeForm;
