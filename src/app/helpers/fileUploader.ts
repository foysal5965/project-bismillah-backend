import multer from "multer"
import path from "path"
import { ICloudinaryResponse, IFile } from "../interfaces/file"
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'
import config from "../config";
cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.cloudApiKey,
  api_secret: config.cloudinary.cloudSecret // Click 'View API Keys' above to copy your API secret
});
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });
export const uploadToCloudinary = async (
  files: IFile | IFile[]
): Promise<ICloudinaryResponse | ICloudinaryResponse[] | undefined> => {
  const uploadSingleFile = (file: IFile): Promise<ICloudinaryResponse | undefined> => {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream((error, result) => {
        if (error) {
          reject(error); // Reject the promise if there's an error
        } else {
          //@ts-ignore
          resolve(result); // Resolve with the upload result
        }
      });

      // Pass the file buffer to the Cloudinary upload stream
      //@ts-ignore
      uploadStream.end(file.buffer);
    });
  };

  // If files is an array, handle multiple uploads
  if (Array.isArray(files)) {
    const results = await Promise.all(files.map(uploadSingleFile));
    const validResults = results.filter((result): result is ICloudinaryResponse => result !== undefined);
    return validResults;
  }

  // Otherwise, handle a single file upload
  return uploadSingleFile(files);
};


// Function to handle multiple file uploads
export const uploadMultipleFilesToCloudinary = async (files: IFile[]): Promise<ICloudinaryResponse[]> => {
  const uploadPromises = files.map(file => uploadToCloudinary(file));
  const results = await Promise.all(uploadPromises);

  // Filter out any undefined values and return only successful uploads
  return results.filter((result): result is ICloudinaryResponse => result !== undefined);
};

// Export the fileUploader object
export const multifileUploader = {
  upload: upload.array('files', 2),  // Adjust the field name and limit as needed
  uploadMultipleFilesToCloudinary
};


export const fileUploader = {
  upload,
  uploadToCloudinary
}