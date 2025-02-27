import { fileModel } from "../helpers/mongoose.js";
import axios from "axios";
import { Readable } from "stream";


// Like a photo by ID
export const likePhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.body.userId; // Ensure userId is sent in request body

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Find the photo in MongoDB
    const photo = await fileModel.findOne({ fileId: id });

    if (!photo) {
      return res.status(404).json({ message: "Photo not found" });
    }

    // Check if the user already liked the photo
    if (photo.likedBy.includes(userId)) {
      return res.status(400).json({ message: "You have already liked this photo" });
    }

    // Increment the like count and add user to likedBy array
    photo.likes = (photo.likes || 0) + 1;
    photo.likedBy.push(userId); // Store user ID to prevent multiple likes

    await photo.save();

    res.status(200).json({
      message: "Photo liked successfully",
      likes: photo.likes,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error liking photo",
      error: err.message,
    });
  }
};

// Get likes for a specific photo
export const getLikes = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the photo in MongoDB
    const photo = await fileModel.findOne({ fileId: id });

    if (!photo) {
      return res.status(404).json({ message: "Photo not found" });
    }

    res.status(200).json({ likes: photo.likes || 0 });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching likes",
      error: err.message,
    });
  }
};

export const downloadPhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const seaweedUrl = `http://20.191.66.216:8080/${id}`;

    const response = await fetch(seaweedUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch from SeaweedFS: ${response.statusText}`);
    }

    const stream = Readable.from(Buffer.from(await response.arrayBuffer()));

    res.set({
      "Access-Control-Allow-Origin": "*",
      "Content-Type": response.headers.get("Content-Type") || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${id}"`,
    });

    // Pipe the stream to the response
    stream.pipe(res);
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({
      message: "Error downloading photo",
      error: error.message,
    });
  }
};