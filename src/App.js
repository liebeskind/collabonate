import React, { Component } from "react";
import { Card, Button, Segment } from "semantic-ui-react";

import CampaignFactoryContract from "../build/contracts/CampaignFactory.json";
import CampaignContract from "../build/contracts/Campaign.json";

import getWeb3 from "./utils/getWeb3";

import CampaignCard from "./components/CampaignCard";
import NewCampaign from "./pages/NewCampaign";
import ShowCampaign from "./pages/ShowCampaign";

import styles from "./styles/commonStyles";

import "./css/oswald.css";
import "./css/open-sans.css";
import "./css/pure-min.css";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      campaigns: {},
      web3: null,
      showCreateCampaign: false
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

      let campaigns = {};

      for (var i in campaignsToCheck) {
        const campaignInstance = await campaign.at(campaignsToCheck[i]);
        const summary = await campaignInstance.getSummary.call();
        campaigns[campaignsToCheck[i]] = {
          address: campaignsToCheck[i],
          minimumContribution: summary[0],
          balance: summary[1],
          requestsCount: summary[2],
          contributorsCount: summary[3],
          manager: summary[4],
          infoKey: summary[5],
          requestDaysDeadline: summary[6],
          campaignInstance
        };
      }
      this.setState({ campaigns });
    });
  }

  createNewCampaign = () => {
    this.setState({ showCreateCampaign: true, showCampaign: false });
  };

  showCampaign = address => {
    this.setState({ showCreateCampaign: false, showCampaign: address });
  };

  render() {
    const { campaigns, showCampaign, showCreateCampaign, web3 } = this.state;

    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
          <a href="/" className="pure-menu-heading pure-menu-link">
            Collabonate
          </a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Donate and Collaborate on the Use of Funds</h1>

              {showCampaign && (
                <ShowCampaign
                  balance={
                    web3.fromWei(campaigns[showCampaign].balance, "ether") * 1
                  }
                  address={campaigns[showCampaign].address}
                  manager={campaigns[showCampaign].manager}
                  minimumContribution={
                    campaigns[showCampaign].minimumContribution * 1
                  }
                  requestsCount={campaigns[showCampaign].requestsCount * 1}
                  contributorsCount={
                    campaigns[showCampaign].contributorsCount * 1
                  }
                  infoKey={campaigns[showCampaign].infoKey}
                  campaignInstance={campaigns[showCampaign].campaignInstance}
                />
              )}
              {showCreateCampaign && <NewCampaign />}

              {!showCreateCampaign &&
                !showCampaign && (
                  <div>
                    <Button
                      content="Create a new campaign"
                      icon="add circle"
                      primary
                      onClick={this.createNewCampaign}
                    />

                    <div style={styles.campaignList}>
                      <h3>
                        Active Campaigns ({Object.keys(campaigns).length})
                      </h3>
                      <Card.Group>
                        {Object.keys(campaigns).map(contractInfo => {
                          return (
                            <CampaignCard
                              key={campaigns[contractInfo].address}
                              showCampaignClicked={this.showCampaign}
                              contractInfo={campaigns[contractInfo]}
                            />
                          );
                        })}
                      </Card.Group>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App;
