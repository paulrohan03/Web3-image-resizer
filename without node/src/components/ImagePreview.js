import React from 'react';

const ImagePreview = ({ blob }) =>
  blob ? (
    <img
      src={URL.createObjectURL(blob)}
      alt="preview"
      width="250"
      style={{ marginTop: 16 }}
    />
  ) : null;

export default ImagePreview;
