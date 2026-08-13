import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js"; 

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'samiksha-sansar/books', 
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 800, height: 1000, crop: 'limit' }], 
  },
});

const storage1 = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'samiksha-sansar/profile', 
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 800, height: 1000, crop: 'limit' }], 
  },
});


const upload = multer({ storage: storage });
const uploadProfile = multer({ storage: storage1 });

export  { upload, uploadProfile };