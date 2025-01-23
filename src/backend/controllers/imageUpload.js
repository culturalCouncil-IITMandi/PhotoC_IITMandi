import multer from 'multer';
import axios from 'axios';

const storage = multer.memoryStorage();
const upload = multer({ storage }).array('files');

// Upload files to SeaweedFS function
export const uploadImages = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: 'File upload failed', error: err.message });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    try {
      let uploadedFiles = [];

      for (const file of req.files) {
        const formData = new FormData();
        formData.append('file', file.buffer, file.originalname);

        const response = await axios.post(PROCESS.env.SEAWEEDFS_URL, formData, {
          headers: formData.getHeaders(),
        });

        uploadedFiles.push({
          filename: file.originalname,
          fileId: response.data.fid});
      }

      return res.status(200).json({
        message: 'Files uploaded successfully',
        files: uploadedFiles,
      });

    } catch (uploadErr) {
      return res.status(500).json({
        message: 'Error uploading to SeaweedFS',
        error: uploadErr.message,
      });
    }
  });
};
