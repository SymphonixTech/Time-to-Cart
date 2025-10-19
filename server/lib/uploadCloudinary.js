import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (fileBuffer, folder) => {
  try {
    const base64String = `data:image/jpeg;base64,${fileBuffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(base64String, {
      folder,
    });

    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw new Error("Cloudinary upload failed");
  }
};

const deleteFromCloudinary = async (imageId) => {
  try {
    const result = await cloudinary.uploader.destroy(imageId);
    return result;
  }
  catch (error) {
    console.error("Cloudinary Deletion Error:", error);
    throw new Error("Cloudinary deletion failed");
  }
}

export { deleteFromCloudinary };
export default uploadToCloudinary;
