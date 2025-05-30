/* eslint-disable camelcase */
import { create } from 'ipfs-http-client';

// Injected by CRA from .env
const projectId     = process.env.REACT_APP_INFURA_PROJECT_ID;
const projectSecret = process.env.REACT_APP_INFURA_PROJECT_SECRET;

const auth = 'Basic ' + btoa(`${projectId}:${projectSecret}`);

export const ipfs = create({
  host:     'ipfs.infura.io',
  port:     5001,
  protocol: 'https',
  headers:  { authorization: auth }
});

export async function uploadToIPFS(data, pin = true) {
  const { path } = await ipfs.add(data, {
    pin,
    wrapWithDirectory: false
  });
  return path;             // the CID string
}

