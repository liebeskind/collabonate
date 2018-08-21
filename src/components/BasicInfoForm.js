import React, { Component } from "react";
import { Form, Input, Button } from "semantic-ui-react";

class NewBasicInfoForm extends Component {
	state = {
		minimumContribution: this.props.basicInfo.minimumContribution || "",
		requestDays: this.props.basicInfo.requestDays || ""
	};

	onSubmit = async event => {
		event.preventDefault();

		const basicInfo = {
			minimumContribution: this.state.minimumContribution,
			requestDays: this.state.requestDays
		};

		this.props.basicInfoSubmitted(basicInfo);
	};

	render() {
		return (
			<Form onSubmit={this.onSubmit}>
				<Form.Field required>
					<label>Minimum Contribution</label>
					<Input
						label="wei"
						labelPosition="right"
						value={this.state.minimumContribution}
						onChange={event =>
							this.setState({
								minimumContribution: event.target.value
							})
						}
					/>
				</Form.Field>
				<Form.Field required>
					<label># Days for Request Voting</label>
					<Input
						label="days"
						labelPosition="right"
						value={this.state.requestDays}
						onChange={event =>
							this.setState({
								requestDays: event.target.value
							})
						}
					/>
				</Form.Field>
				<Button floated="right" loading={this.props.loading} primary>
					Create Campaign
				</Button>
			</Form>
		);
	}
}

export default NewBasicInfoForm;
