import cloudinary from "../config/cloudinaryConfig.js";

export const getAllImages = async (req, res) => {
  try {
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: "my_images/",
      max_results: 500
    });

    const grouped = {};

    result.resources.forEach(file => {
      const filename = file.public_id.split("/").pop();
      const match = filename.match(/^(\d+)_/);
      const row = match ? match[1] : "others";

      if (!grouped[row]) grouped[row] = [];

      grouped[row].push({
        name: filename,
        url: file.secure_url // Cloudinary URL now
      });
    });

    res.json({ success: true, rows: grouped });

  } catch (error) {
    console.error("Cloudinary Error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};
