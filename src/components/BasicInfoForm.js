import React, { Component } from "react";
import { Form, Input, Button } from "semantic-ui-react";

class NewBasicInfoForm extends Component {
	state = {
		goal: this.props.basicInfo.goal || "", // Should be a 'numeric' input
		minimumContribution: this.props.basicInfo.minimumContribution || "", // Should be a 'numeric' input
		campaignTitle: this.props.basicInfo.campaignTitle || "",
		// whoRaisingFor is a dropdown of Myself, Family Member, Friend, Pet or Animal, Charity or Non-Profit, Other
		whoRaisingFor: this.props.basicInfo.whoRaisingFor || "", //Should be a 'select' input
		zipcode: this.props.basicInfo.zipcode || "",
		category: this.props.basicInfo.category || "" //Should be a 'select' input
		// loading: false
	};

	onSubmit = async event => {
		event.preventDefault();

		const basicInfo = {
			goal: this.state.goal,
			minimumContribution: this.state.minimumContribution,
			campaignTitle: this.state.campaignTitle,
			whoRaisingFor: this.state.whoRaisingFor,
			zipcode: this.state.zipcode,
			category: this.state.category
		};

		this.props.basicInfoSubmitted(basicInfo);
		// this.setState({ loading: true});
	};

	render() {
		return (
			<Form onSubmit={this.onSubmit}>
				<Form.Field required>
					<label>Goal</label>
					<Input
						label="ether"
						labelPosition="right"
						value={this.state.goal}
						onChange={event =>
							this.setState({ goal: event.target.value })
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
					<label>Campaign Title</label>
					<Input
						value={this.state.campaignTitle}
						onChange={event =>
							this.setState({ campaignTitle: event.target.value })
						}
					/>
				</Form.Field>
				<Form.Field required>
					<label>Who are you raising money for?</label>
					<Input
						value={this.state.whoRaisingFor}
						onChange={event =>
							this.setState({ whoRaisingFor: event.target.value })
						}
					/>
				</Form.Field>
				<Form.Field required>
					<label>Zipcode</label>
					<Input
						value={this.state.zipcode}
						onChange={event =>
							this.setState({ zipcode: event.target.value })
						}
					/>
				</Form.Field>
				<Form.Field required>
					<label>Category</label>
					<Input
						value={this.state.category}
						onChange={event =>
							this.setState({ category: event.target.value })
						}
					/>
				</Form.Field>
				<Button floated="right" loading={this.state.loading} primary>
					Next
				</Button>
			</Form>
		);
	}
}

export default NewBasicInfoForm;
