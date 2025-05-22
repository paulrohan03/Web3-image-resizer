import React from 'react';

const FileUpload = ({ onFileChange }) => (
  <input type="file" accept="image/*" onChange={onFileChange} />
);

export default FileUpload;
