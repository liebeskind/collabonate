import React, { Component } from "react";
import { Form, Input, Button } from "semantic-ui-react";

class NewBasicInfoForm extends Component {
	state = {
		minimumContribution: this.props.basicInfo.minimumContribution || "",
		requestDays: this.props.basicInfo.requestDays || "",
		title: this.props.basicInfo.title || "",
		goal: this.props.basicInfo.goal || "",
		category: this.props.basicInfo.category || ""
	};

	onSubmit = async event => {
		event.preventDefault();

		const basicInfo = {
			minimumContribution: this.state.minimumContribution,
			requestDays: this.state.requestDays,
			title: this.state.title,
			goal: this.state.goal,
			category: this.state.category
		};

		this.props.basicInfoSubmitted(basicInfo);
	};

	render() {
		return (
			<Form onSubmit={this.onSubmit}>
				<Form.Field required>
					<label>Title</label>
					<Input
						value={this.state.title}
						onChange={event =>
							this.setState({
								title: event.target.value
							})
						}
					/>
				</Form.Field>
				<Form.Field required>
					<label>Goal (ETH)</label>
					<Input
						value={this.state.goal}
						type="number"
						onChange={event =>
							this.setState({
								goal: event.target.value
							})
						}
					/>
				</Form.Field>
				{/*Should be refactored as a Select*/}
				<Form.Field required>
					<label>Category</label>
					<Input
						value={this.state.category}
						onChange={event =>
							this.setState({
								category: event.target.value
							})
						}
					/>
				</Form.Field>
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
				<Button
					loading={this.props.loading}
					fluid
					primary
					disabled={
						!this.state.title ||
						!this.state.goal ||
						!this.state.category ||
						!this.state.minimumContribution ||
						!this.state.requestDays
					}
				>
					Create Campaign
				</Button>
			</Form>
		);
	}
}

export default NewBasicInfoForm;
