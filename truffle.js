var HDWalletProvider = require("truffle-hdwallet-provider");

var infura_apikey = require("./infura");
var mnemonic = require("./mnemonic");

module.exports = {
	networks: {
		development: {
			host: "localhost",
			port: 9545
			// network_id: "*" // match any network
		},
		rpc: {
			host: "127.0.0.1",
			port: 9545
		},
		rinkeby: {
			// Used truffle and HDWalletProvider (infura) instead of geth.
			provider: new HDWalletProvider(
				mnemonic,
				"https://rinkeby.infura.io/" + infura_apikey
			),
			// host: "localhost",
			// port: 8545,
			network_id: 4
		},
		solc: {
			optimizer: {
				enabled: true,
				runs: 200
			}
		}
	}
};
