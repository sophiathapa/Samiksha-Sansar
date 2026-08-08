import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();
import cloudinary from '../utils/cloudinary.js';
import Book from '../models/book.js'; 


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// adjust this if your uploads folder lives elsewhere relative to /scripts
const UPLOADS_DIR = path.join(__dirname, '../../uploads');
console.log('uploads dir', UPLOADS_DIR);

async function migrate() {
  await mongoose.connect(process.env.MONGO_URL);
  console.log('Connected to MongoDB');

  const books = await Book.find({ coverImg: { $exists: true, $ne: null } });
  console.log(`Found ${books.length} books with coverImg set`);

  let migrated = 0;
  let skipped = 0;
  let failed = 0;

  for (const book of books) {
    // already a full Cloudinary URL — skip
    if (book.coverImg.startsWith('http')) {
      console.log(`Skip (already migrated): ${book.title}`);
      skipped++;
      continue;
    }


    const filename = path.basename(book.coverImg);
    const localPath = path.join(UPLOADS_DIR, filename);

    if (!fs.existsSync(localPath)) {
      console.warn(`File not found for "${book.title}": ${localPath}`);
      failed++;
      continue;
    }

    try {
      const result = await cloudinary.uploader.upload(localPath, {
        folder: 'samiksha-sansar/books',
      });

      book.coverImg = result.secure_url;
      await book.save();
      console.log(`Migrated: ${book.title} -> ${result.secure_url}`);
      migrated++;
    } catch (err) {
      console.error(`Failed to migrate "${book.title}":`, err);
      failed++;
    }
  }

  console.log('\n--- Migration summary ---');
  console.log(`Migrated: ${migrated}`);
  console.log(`Skipped (already done): ${skipped}`);
  console.log(`Failed/missing: ${failed}`);

  await mongoose.disconnect();
}

migrate();