import React from 'react';

export default function TransactionInfo({ hash, network = 'goerli' }) {
  if (!hash) return null;
  const url = `https://${network === 'mainnet' ? '' : network + '.'}etherscan.io/tx/${hash}`;
  return (
    <p style={{ marginTop: 12 }}>
      Tx submitted:&nbsp;
      <a href={url} target="_blank" rel="noopener noreferrer">
        {hash.slice(0, 10)}…
      </a>
    </p>
  );
}
