const ImageResizer = artifacts.require("ImageResizer");

module.exports = function (deployer) {
  deployer.deploy(ImageResizer);
};