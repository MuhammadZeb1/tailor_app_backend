import fs from "fs";
import path from "path";

export const getAllImages = (req, res) => {
  try {
    // FIX 1: Point to 'public', NOT 'public/row'
    const imagesPath = path.join(process.cwd(), "public");

    // FIX 2: Check if directory exists to prevent server crash
    if (!fs.existsSync(imagesPath)) {
      return res.status(200).json({ 
        success: true, 
        rows: {}, 
        message: "Public folder not found." 
      });
    }

    let files = fs.readdirSync(imagesPath);

    // Filter for images and sort
    files = files
      .filter(file => /\.(jpg|jpeg|png|webp|gif)$/i.test(file))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    const grouped = {};

    files.forEach(file => {
      // FIX 3: Extract "1" from "1_2.png" (the number before the underscore)
      const match = file.match(/^(\d+)_/); 
      const row = match ? match[1] : "others";

      if (!grouped[row]) grouped[row] = [];

      grouped[row].push({
        name: file,
        // FIX 4: Correct URL (no /row/ subfolder)
        url: `${req.protocol}://${req.get("host")}/public/${file}`
      });
    });

    res.json({ success: true, rows: grouped });

  } catch (error) {
    console.error("Server Error:", error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};