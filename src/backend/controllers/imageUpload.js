import multer from 'multer';
import axios from 'axios';
import FormData from 'form-data';
import { fileModel } from '../helpers/mongoose.js';

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
        // 1?? Request a file ID from SeaweedFS Master
        const assignRes = await axios.post('http://localhost:9333/dir/assign');
        console.log(assignRes.data);
        if (!assignRes.data.fid || !assignRes.data.publicUrl) {
          throw new Error('Failed to get a file ID from SeaweedFS');
        }

        const { fid, publicUrl } = assignRes.data;

        // 2?? Upload the file to the assigned volume server
        const formData = new FormData();
        formData.append('file', file.buffer, { filename: file.originalname });

        const uploadRes = await axios.post(`http://${publicUrl}/${fid}`, formData, {
          headers: formData.getHeaders(),
        });

        if (!uploadRes.data || !uploadRes.data.size) {
          throw new Error('File upload to SeaweedFS failed');
        }

        // 3?? Save file info to the database
        const newFile = new fileModel({
          fileId: fid,
          fileName: file.originalname,
          uploader: req.body.uploaderName || 'unknown',
          event: req.body.event || '',
          uploaderEmail: req.body.userEmail || 'unknown',
          uploadedAt: Date.now(),
          approval: req.body.approved === 'true',
          title: req.body.title,
        });
        await newFile.save();

        uploadedFiles.push({ filename: file.originalname, fileId: fid });
      }

      return res.status(200).json({
        message: 'Files uploaded successfully',
        files: uploadedFiles,
      });

    } catch (error) {
      return res.status(500).json({
        message: 'Error uploading to SeaweedFS',
        error: error.message,
      });
    }
  });
};
