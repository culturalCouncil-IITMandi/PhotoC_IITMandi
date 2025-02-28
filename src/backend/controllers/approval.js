import { fileModel } from '../helpers/mongoose.js';
import fetch from "node-fetch";

// Approve a photo by ID
export const approvePost = async (req, res) => {
  try {
    const { id } = req.params;
    const photo = await fileModel.findOne( { fileId: id } );
    if (!photo) {
      return res.status(404).json({ message: "Photo not found" });
    }

    photo.approval = true;
    const updatedPhoto = await photo.save();

    res.status(200).json({
      message: "Photo approved successfully",
      photo: updatedPhoto,
    });
    
  } catch (err) {
    res.status(500).json({
      message: "Error approving photo",
      error: err.message,
    });
  }
};

export const disapprovePost = async (req, res) => {
  try {
    const { id } = req.params;
    const photo = await fileModel.findOne({ fileId: id });
    if (!photo) {
      return res.status(404).json({ message: "Photo not found" });
    }

    photo.approval = false;
    const updatedPhoto = await photo.save();

    res.status(200).json({
      message: "Photo disapproved successfully",
      photo: updatedPhoto,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error disapproving photo",
      error: err.message,
    });
  }
};

export const delApprovePost = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the photo in MongoDB
    const photo = await fileModel.findOne({ fileId: id });
    if (!photo) {
      return res.status(404).json({ message: "Photo not found" });
    }

    // Delete the file from SeaweedFS
    const seaweedDeleteUrl = `http://localhost:9333/${id}`;
    const seaweedResponse = await fetch(seaweedDeleteUrl, { method: "DELETE" });

    if (!seaweedResponse.ok) {
      return res.status(500).json({ message: "Failed to delete from SeaweedFS" });
    }

    // Remove the photo from MongoDB
    await fileModel.deleteOne({ fileId: id });

    res.json({ message: "Photo deleted successfully" });
  } catch (err) {
    res.status(500).json({
      message: "Error deleting photo",
      error: err.message,
    });
  }
};

// Get all approved photos
export const getApproved = async (req, res) => {
  try {
    const approvedPhotos = await fileModel.find({ approval: false });

    res.status(200).json(approvedPhotos);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching approved photos",
      error: err.message,
    });
  }
};