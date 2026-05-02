/**
 * Client-side image compression to reduce payload size before uploading.
 * Ideal for high-frequency uploads like crowd density estimation frames.
 */
export const compressImage = async (file: File, maxWidth = 800, quality = 0.7): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const scaleFactor = maxWidth / img.width;
        
        if (scaleFactor < 1) {
          canvas.width = maxWidth;
          canvas.height = img.height * scaleFactor;
        } else {
          canvas.width = img.width;
          canvas.height = img.height;
        }

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Canvas to Blob conversion failed'));
          },
          'image/jpeg',
          quality
        );
      };
    };
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Example usage:
 * const optimizedBlob = await compressImage(originalFile);
 * const formData = new FormData();
 * formData.append('image', optimizedBlob, 'frame.jpg');
 */
