import React, { Component } from "react";
import { Button } from "semantic-ui-react";

class CreateRequestButton extends Component {
	render() {
		let campaignAdmin = false;
		if (this.props.currentAccount === this.props.manager)
			campaignAdmin = true;
		return (
			<Button
				onClick={() => {
					campaignAdmin
						? this.props.createNewRequest(this.props.address)
						: alert(
								"Only this campaign owner can create requests."
						  );
				}}
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
