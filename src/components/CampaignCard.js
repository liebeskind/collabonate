import React, { Component } from "react";
import { Card, Button, Icon } from "semantic-ui-react";
import getWeb3 from "../utils/getWeb3";

import styles from "../styles/commonStyles";

class CampaignCard extends Component {
	constructor(props) {
		super(props);

		this.state = {
			web3: null
		};
	}

	componentWillMount() {
		getWeb3.then(results => {
			this.setState({
				web3: results.web3
			});
		});
	}

	render() {
		const {
			balance,
			address,
			requestsCount,
			contributorsCount,
			goal,
			title,
			category
		} = this.props.contractInfo;

		const { web3 } = this.state;

		return (
			<Card
				style={styles.campaignContainer}
				onClick={() => this.props.showCampaignClicked(address)}
			>
				<Card.Content>
					<Card.Header>{title}</Card.Header>
					<Card.Meta>{category}</Card.Meta>
				</Card.Content>
				<Card.Content extra>
					<span>
						<Icon name="money" />
						Goal: {goal * 1} ETH
					</span>
					<span style={styles.floatRight}>
						<Icon name="gift" />
						Raised:{" "}
						{web3 ? web3.fromWei(balance * 1, "ether") : "NA"} ETH
					</span>
					<span style={styles.floatLeft}>
						<Icon name="group" />
						{contributorsCount * 1 > 1 || contributorsCount * 1 < 1
							? `${contributorsCount * 1} Contributors`
							: `${contributorsCount * 1} Contributor`}
					</span>
					<span style={styles.floatRight}>
						<Icon name="idea" />
						{requestsCount * 1} Requests
					</span>
				</Card.Content>
				<Card.Content extra>
					<Button fluid secondary>
						View Campaign
					</Button>
				</Card.Content>
			</Card>
		);
	}
}

export default CampaignCard;
