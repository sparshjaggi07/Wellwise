const DispensaryRegistry = artifacts.require("DispensaryRegistration");
module.exports = function(deployer) {
  	deployer.deploy(DispensaryRegistry);
};