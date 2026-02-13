import fs from "fs";
import path from "path";
import cloudinary from "./config/cloudinaryConfig.js";

const uploadImages = async () => {
  try {
    const imagesPath = path.join(process.cwd(), "public");

    if (!fs.existsSync(imagesPath)) {
      console.log("Public folder not found!");
      return;
    }
    

    const files = fs.readdirSync(imagesPath).filter(file =>
      /\.(jpg|jpeg|png|webp|gif)$/i.test(file)
    );

    if (files.length === 0) {
      console.log("No images found in the public folder.");
      return;
    }

    console.log(`Found ${files.length} images. Uploading to Cloudinary...`);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const filePath = path.join(imagesPath, file);

      const result = await cloudinary.uploader.upload(filePath, {
        folder: "my_images" // Cloudinary folder
      });

      console.log(`${i + 1}/${files.length} Uploaded: ${file}`);
      console.log(`URL: ${result.secure_url}\n`);
    }

    console.log("All images uploaded successfully!");
  } catch (error) {
    console.error("Error uploading images:", error.message);
  }
};

// Run the function
uploadImages();
