import React, { Component } from "react";
import { Card, Button, Segment } from "semantic-ui-react";
// import SimpleStorageContract from "../build/contracts/SimpleStorage.json";
import CampaignFactoryContract from "../build/contracts/CampaignFactory.json";
import CampaignContract from "../build/contracts/Campaign.json";

import getWeb3 from "./utils/getWeb3";

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

  instantiateContract = async () => {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    const contract = require("truffle-contract");
    const campaign = contract(CampaignContract);
    const campaignFactory = contract(CampaignFactoryContract);
    campaign.setProvider(this.state.web3.currentProvider);
    campaignFactory.setProvider(this.state.web3.currentProvider);

    this.state.web3.eth.getAccounts(async (error, accounts) => {
      const campaignFactoryInstance = await campaignFactory.deployed();
      const campaignInstance = await campaign.deployed();

      const campaignsToCheck = await campaignFactoryInstance
        .getDeployedCampaigns()
        .call();

      let campaigns = [];

      for (var i in campaignsToCheck) {
        const campaign = CampaignContract(campaignsToCheck[i]); // This is an address.
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
  };

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
          <a href="#" className="pure-menu-heading pure-menu-link">
            Collabonate
          </a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Welcome to Collabonate!</h1>

              <h3>Active Campaigns</h3>
              <Card.Group>
                {this.state.campaigns.map(contractInfo => {
                  return <div />;
                })}
              </Card.Group>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App;
