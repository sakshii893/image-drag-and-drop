const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Multer setup (in-memory)
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * Compression settings:
 * - low: 50% quality
 * - medium: 70% quality
 * - high: 90% quality
 */
const compressionLevels = {
  low: 50,
  medium: 70,
  high: 90
};

// API to compress the image
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const { compression = "medium" } = req.body;
    const imageBuffer = req.file.buffer;

    const originalSize = Buffer.byteLength(imageBuffer);

    const compressedBuffer = await sharp(imageBuffer)
      .jpeg({ quality: compressionLevels[compression] || 70 })
      .toBuffer();

    const compressedSize = Buffer.byteLength(compressedBuffer);

  res.json({
  originalSize: imageBuffer.length,
  compressedSize: compressedBuffer.length,
  compressedImage: `data:image/jpeg;base64,${compressedBuffer.toString("base64")}`,
});

  } catch (err) {
    res.status(500).json({ message: "Compression failed", error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
