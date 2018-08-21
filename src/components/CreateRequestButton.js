import React, { Component } from "react";
import { Button } from "semantic-ui-react";

class CreateRequestButton extends Component {
	render() {
		if (this.props.currentAccount != this.props.manager) return <div />;
		return (
			<Button
				onClick={this.props.createNewRequest}
				primary
				floated="right"
				style={{ marginBottom: 10 }}
			>
				Create Request
			</Button>
		);
	}
}

export default CreateRequestButton;
