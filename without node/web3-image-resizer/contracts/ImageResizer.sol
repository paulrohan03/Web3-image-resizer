// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ImageResizer {
    // Structure to store image data
    struct ResizedImage {
        string ipfsHash;
        uint256 width;
        uint256 height;
        uint256 timestamp;
        address owner;
        string originalImageHash;  // Optional: Store hash of original image
    }
    
    // Mapping from image ID to image data
    mapping(uint256 => ResizedImage) public images;
    
    // Mapping from user address to their images
    mapping(address => uint256[]) public userImages;
    
    // Counter for image IDs
    uint256 private imageCount;
    
    // Events
    event ImageResized(uint256 indexed id, string ipfsHash, address indexed owner);
    
    // Register a new resized image
    function registerResizedImage(
        string memory _ipfsHash,
        uint256 _width,
        uint256 _height,
        string memory _originalImageHash
    ) public returns (uint256) {
        // Increment image count
        imageCount++;
        
        // Store image data
        images[imageCount] = ResizedImage({
            ipfsHash: _ipfsHash,
            width: _width,
            height: _height,
            timestamp: block.timestamp,
            owner: msg.sender,
            originalImageHash: _originalImageHash
        });
        
        // Add image ID to user's images
        userImages[msg.sender].push(imageCount);
        
        // Emit event
        emit ImageResized(imageCount, _ipfsHash, msg.sender);
        
        return imageCount;
    }
    
    // Get image details by ID
    function getImage(uint256 _id) public view returns (
        string memory ipfsHash,
        uint256 width,
        uint256 height,
        uint256 timestamp,
        address owner,
        string memory originalImageHash
    ) {
        ResizedImage memory img = images[_id];
        return (
            img.ipfsHash,
            img.width,
            img.height,
            img.timestamp,
            img.owner,
            img.originalImageHash
        );
    }
    
    // Get total number of images
    function getImageCount() public view returns (uint256) {
        return imageCount;
    }
    
    // Get all images owned by a user
    function getUserImages(address _user) public view returns (uint256[] memory) {
        return userImages[_user];
    }
    
    // Get user's image count
    function getUserImageCount(address _user) public view returns (uint256) {
        return userImages[_user].length;
    }
}