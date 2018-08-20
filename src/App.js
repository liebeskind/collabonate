import React, { Component } from "react";
import { Card, Button, Segment } from "semantic-ui-react";

import CampaignFactoryContract from "../build/contracts/CampaignFactory.json";
import CampaignContract from "../build/contracts/Campaign.json";

import getWeb3 from "./utils/getWeb3";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";

import CampaignCard from "./components/CampaignCard";
import NewCampaign from "./pages/NewCampaign";

import styles from "./styles/commonStyles";

import "./css/oswald.css";
import "./css/open-sans.css";
import "./css/pure-min.css";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      campaigns: [],
      web3: null
    };
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
      .then(results => {
        this.setState({
          web3: results.web3
        });

        // Instantiate contract once web3 provided.
        this.instantiateContract();
      })
      .catch(() => {
        console.log("Error finding web3.");
      });
  }

  instantiateContract() {
    const contract = require("truffle-contract");
    let campaign = contract(CampaignContract);
    const campaignFactory = contract(CampaignFactoryContract);
    campaign.setProvider(this.state.web3.currentProvider);
    campaignFactory.setProvider(this.state.web3.currentProvider);

    this.state.web3.eth.getAccounts(async (error, accounts) => {
      const campaignFactoryInstance = await campaignFactory.deployed();
      const campaignsToCheck = await campaignFactoryInstance.getDeployedCampaigns.call(
        { from: accounts[0] }
      );

      let campaigns = [];

      for (var i in campaignsToCheck) {
        const campaignInstance = await campaign.at(campaignsToCheck[i]);
        const summary = await campaignInstance.getSummary.call();
        campaigns.push({
          address: campaignsToCheck[i],
          minimumContribution: summary[0],
          balance: summary[1],
          requestsCount: summary[2],
          contributorsCount: summary[3],
          manager: summary[4],
          infoKey: summary[5],
          requestDaysDeadline: summary[6]
        });
      }
      this.setState({ campaigns });
    });
  }

  render() {
    return (
      <Router>
        <div className="App">
          <nav className="navbar pure-menu pure-menu-horizontal">
            <Link to="/" className="pure-menu-heading pure-menu-link">
              Collabonate
            </Link>
          </nav>

          <Route
            path="/campaigns/new"
            //By passing the component with render, we can pass props.width.  Have to include {...props} here or it will mount/unmount this component every render.
            render={props => <NewCampaign {...props} />}
          />

          <main className="container">
            <div className="pure-g">
              <div className="pure-u-1-1">
                <h1>Welcome to Collabonate!</h1>

                <Link to="/campaigns/new">
                  <Button
                    content="Create a new campaign"
                    icon="add circle"
                    primary
                  />
                </Link>
                <br />

                <div style={styles.campaignList}>
                  <h3>Active Campaigns ({this.state.campaigns.length})</h3>
                  <Card.Group>
                    {this.state.campaigns.map(contractInfo => {
                      return (
                        <CampaignCard
                          key={contractInfo.address}
                          contractInfo={contractInfo}
                        />
                      );
                    })}
                  </Card.Group>
                </div>
              </div>
            </div>
          </main>
        </div>
      </Router>
    );
  }
}

export default App;
