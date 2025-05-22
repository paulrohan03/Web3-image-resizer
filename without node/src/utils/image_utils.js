/**
 * Resize an image client side; returns a Blob ready for IPFS.
 * Keeps aspect ratio by fitting inside the target box.
 */
export function resizeImage(file, targetW, targetH, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const img    = new Image();

    reader.onload = e => (img.src = e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);

    img.onload = () => {
      const ratio = Math.min(targetW / img.width, targetH / img.height);
      const w = Math.round(img.width * ratio);
      const h = Math.round(img.height * ratio);

      const canvas = Object.assign(document.createElement('canvas'), {
        width: targetW,
        height: targetH
      });
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, targetW, targetH);
      // center on blank canvas
      ctx.drawImage(img, (targetW - w) / 2, (targetH - h) / 2, w, h);

      canvas.toBlob(
        blob => (blob ? resolve(blob) : reject(new Error('Canvas toBlob failed'))),
        'image/jpeg',
        quality
      );
    };

    img.onerror = reject;
  });
}
