import multer from 'multer';
import axios from 'axios';
import FormData from 'form-data';

import { fileModel } from '../helpers/mongoose.js';

const storage = multer.memoryStorage();
const upload = multer({ storage }).array('files');

// Upload files to SeaweedFS function
export const uploadImages = (req, res) => {
  console.log(req);
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
        const date = Date.now();
        formData.append('file', file.buffer, `${date}-${file.originalname}`);

        const response = await axios.post(`${process.env.SEAWEEDFS_URL}submit`, formData, {
          headers: formData.getHeaders(),
        });

        uploadedFiles.push({
          filename: `${date}-${file.originalname}`,
          fileId: response.data.fid});

        const newFile = new fileModel({
          fileId: response.data.fid,
          fileName: file.originalname,
          uploader: req.body.uploaderName || 'unknown',
          event: req.body.event || '',
          uploaderEmail: req.body.userEmail || 'unknown',
          uploadedAt: date,
          approval: req.body.approved === 'true',
          title: req.body.title,
        });
        await newFile.save();
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
