import cloudinary from './cloudinary';

export const uploadImage = async (file: Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: 'blog-thumbnails',
      },
      (error, result) => {
        if (error) reject(error);
        resolve(result?.secure_url || '');
      }
    ).end(file);
  });
};