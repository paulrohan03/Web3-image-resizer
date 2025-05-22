import React, { useState } from 'react';
import Web3 from 'web3';
import { uploadToIPFS } from './utils/ipfsUtils';  // assume this exists
import { resizeImage } from './utils/image_utils';   // renamed file
import ImageResizerContractABI from './abis/ImageResizerContract.json';  // ABI JSON

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [resizedImageBlob, setResizedImageBlob] = useState(null);
  const [resizedImageWidth, setResizedImageWidth] = useState(null);
  const [resizedImageHeight, setResizedImageHeight] = useState(null);
  const [status, setStatus] = useState('Not connected');

  // Connect MetaMask wallet and contract
  async function connectWallet() {
    if (!window.ethereum) {
      alert('MetaMask is required!');
      return;
    }
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);

      const networkId = await web3.eth.net.getId();
      const deployedNetwork = ImageResizerContractABI.networks[networkId];
      if (!deployedNetwork) {
        setStatus('Smart contract not deployed on current network.');
        return;
      }

      const instance = new web3.eth.Contract(
        ImageResizerContractABI.abi,
        deployedNetwork.address
      );
      setContract(instance);
      setStatus('Wallet connected, ready.');
    } catch (err) {
      setStatus('Error connecting wallet.');
      console.error(err);
    }
  }

  // Handle file input change
  function handleFileChange(event) {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
      setResizedImageBlob(null);
      setResizedImageWidth(null);
      setResizedImageHeight(null);
      setStatus('Image loaded, ready to resize.');
    }
  }

  // Resize image on client side (example: resize to 300x300)
  async function resizeHandler() {
    if (!imageFile) {
      alert('Please upload an image first.');
      return;
    }
    setStatus('Resizing image...');
    try {
      const resizedBlob = await resizeImage(imagePreviewUrl, 300, 300);  // your util function returns Blob

      // Create an image element to get dimensions
      const img = new Image();
      img.src = URL.createObjectURL(resizedBlob);
      await new Promise((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load resized image'));
      });

      setResizedImageBlob(resizedBlob);
      setResizedImageWidth(img.width);
      setResizedImageHeight(img.height);
      setStatus('Image resized, ready to upload.');
    } catch (error) {
      setStatus('Error resizing image.');
      console.error(error);
    }
  }

  // Upload resized image to IPFS and record on blockchain
  async function uploadAndRecord() {
    if (!contract || !account) {
      alert('Connect your wallet first.');
      return;
    }
    if (!resizedImageBlob) {
      alert('Resize the image before uploading.');
      return;
    }
    setStatus('Uploading to IPFS...');
    try {
      const ipfsHash = await uploadToIPFS(resizedImageBlob);
      setStatus(`IPFS uploaded: ${ipfsHash}. Sending transaction...`);

      // Call the correct contract method with all required parameters
      await contract.methods.registerResizedImage(
        ipfsHash,
        resizedImageWidth,
        resizedImageHeight,
        '' // originalImageHash is optional, passing empty string
      ).send({ from: account })
        .on('transactionHash', hash => setStatus(`Tx sent: ${hash}`))
        .on('receipt', () => setStatus('Transaction confirmed!'))
        .on('error', () => setStatus('Transaction failed!'));
    } catch (error) {
      setStatus('Upload or transaction error.');
      console.error(error);
    }
  }

  return (
    <div className="app-container">
      <h1>Web3 Image Resizer</h1>
      <button onClick={connectWallet}>
        {account ? `Connected: ${account.substring(0,6)}...${account.slice(-4)}` : 'Connect Wallet'}
      </button>

      <input type="file" accept="image/*" onChange={handleFileChange} />

      {imagePreviewUrl && (
        <div className="image-preview">
          <h3>Original Image Preview</h3>
          <img src={imagePreviewUrl} alt="Original" />
        </div>
      )}

      <button onClick={resizeHandler} disabled={!imageFile}>Resize Image (300x300)</button>

      {resizedImageBlob && (
        <div className="image-preview">
          <h3>Resized Image Preview</h3>
          <img src={URL.createObjectURL(resizedImageBlob)} alt="Resized" />
        </div>
      )}

      <button onClick={uploadAndRecord} disabled={!resizedImageBlob || !contract}>Upload & Record on Blockchain</button>

      <div className="status">{status}</div>
    </div>
  );
}

export default App;
