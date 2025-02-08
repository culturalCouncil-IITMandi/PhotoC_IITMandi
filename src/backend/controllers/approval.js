import { fileModel } from '../helpers/mongoose.js';

// Approve a photo by ID
export const approvePost = async (req, res) => {
  try {
    const { fileId } = req.params;

    const photo = await fileModel.findOne(fileId);
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

// Reject (or unapprove) a photo by ID
export const delApprovePost = async (req, res) => {
  try {
    const { fileId } = req.params;

    const photo = await fileModel.findOne(fileId);
    if (!photo) {
      return res.status(404).json({ message: "Photo not found" });
    }

    photo.approval = false;
    const updatedPhoto = await photo.save();

    res.json({
      message: "Photo rejected successfully",
      photo: updatedPhoto,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error rejecting photo",
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