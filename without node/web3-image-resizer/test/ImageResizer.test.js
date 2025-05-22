// test/ImageResizer.test.js
const ImageResizer = artifacts.require("ImageResizer");

contract("ImageResizer", (accounts) => {
  let imageResizer;
  const owner = accounts[0];
  const user1 = accounts[1];
  
  before(async () => {
    imageResizer = await ImageResizer.deployed();
  });

  it("should register a new resized image", async () => {
    const ipfsHash = "QmTestHash123";
    const width = 800;
    const height = 600;
    const originalHash = "QmOriginalHash456";
    
    const result = await imageResizer.registerResizedImage(
      ipfsHash,
      width,
      height,
      originalHash,
      { from: user1 }
    );
    
    // Check if event was emitted
    assert.equal(result.logs[0].event, "ImageResized", "ImageResized event should be emitted");
    
    // Get the imageId from the event
    const imageId = result.logs[0].args.id.toNumber();
    
    // Get the image data
    const imageData = await imageResizer.getImage(imageId);
    
    // Verify the image data
    assert.equal(imageData.ipfsHash, ipfsHash, "IPFS hash should match");
    assert.equal(imageData.width.toNumber(), width, "Width should match");
    assert.equal(imageData.height.toNumber(), height, "Height should match");
    assert.equal(imageData.owner, user1, "Owner should match");
    assert.equal(imageData.originalImageHash, originalHash, "Original hash should match");
  });

  it("should track user's images", async () => {
    // Register a second image for the same user
    const ipfsHash2 = "QmTestHash789";
    const width2 = 400;
    const height2 = 300;
    const originalHash2 = "QmOriginalHash101112";
    
    await imageResizer.registerResizedImage(
      ipfsHash2,
      width2,
      height2,
      originalHash2,
      { from: user1 }
    );
    
    // Get user's image count
    const imageCount = await imageResizer.getUserImageCount(user1);
    assert.equal(imageCount.toNumber(), 2, "User should have 2 images");
    
    // Get user's images
    const userImages = await imageResizer.getUserImages(user1);
    assert.equal(userImages.length, 2, "User's images array should have 2 entries");
  });
});