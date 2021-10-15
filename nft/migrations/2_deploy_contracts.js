const SlayerBadge = artifacts.require("SlayerBadge");

module.exports = function(deployer) {
  deployer.deploy(SlayerBadge, 5);
};
