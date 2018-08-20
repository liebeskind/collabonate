import React, { Component } from "react";
import {
	Card,
	Segment,
	Image,
	Button,
	Icon,
	Dimmer,
	Loader
} from "semantic-ui-react";
import getWeb3 from "../utils/getWeb3";

import styles from "../styles/commonStyles";
import { Link, BrowserRouter as Router } from "react-router-dom";

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
			manager,
			minimumContribution,
			requestsCount,
			contributorsCount,
			infoKey
		} = this.props.contractInfo;

		const { web3 } = this.state;

		return (
			<Router>
				<Link to={`/campaigns/${address}/`}>
					<Card style={styles.campaignContainer}>
						<Card.Content extra>
							<span style={styles.floatRight}>
								<Icon name="gift" />
								Raised: {balance * 1} ETH
							</span>
							<span style={styles.floatLeft}>
								<Icon name="group" />
								{contributorsCount * 1 > 1 ||
								contributorsCount * 1 < 1
									? `${contributorsCount * 1} Contributors`
									: `${contributorsCount * 1} Contributor`}
							</span>
						</Card.Content>
						<Card.Content extra>
							<Button fluid secondary>
								View Campaign
							</Button>
						</Card.Content>
					</Card>
				</Link>
			</Router>
		);
	}
}

export default CampaignCard;
