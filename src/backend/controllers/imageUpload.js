import multer from 'multer';
import axios from 'axios';
import FormData from 'form-data';
import sharp from 'sharp';
import { fileModel } from '../helpers/mongoose.js';

const storage = multer.memoryStorage();
const upload = multer({ storage }).array('files');

const VIRUS_TOTAL_API_KEY = process.env.VIRUS_TOTAL_API_KEY;

// Function to scan file using VirusTotal API
const scanWithVirusTotal = async (fileBuffer) => {
  try {
    const form = new FormData();
    form.append('file', fileBuffer, { filename: 'file' });

    const res = await axios.post('https://www.virustotal.com/api/v3/files', form, {
      headers: {
        ...form.getHeaders(),
        'x-apikey': VIRUS_TOTAL_API_KEY,
      },
    });

    const analysisUrl = res.data.data.id;
    console.log(`File uploaded. Scan ID: ${analysisUrl}`);

    return analysisUrl;
  } catch (err) {
    console.error('Error uploading file to VirusTotal:', err.message);
    throw new Error('Virus scan failed');
  }
};

// Function to fetch scan results from VirusTotal
const getScanResults = async (scanId) => {
  try {
    const res = await axios.get(`https://www.virustotal.com/api/v3/analyses/${scanId}`, {
      headers: {
        'x-apikey': VIRUS_TOTAL_API_KEY,
      },
    });
    const { data } = res.data;
    const isInfected = data.attributes.stats.malicious > 0;

    return isInfected;
  } catch (err) {
    console.error('Error fetching scan results:', err.message);
    throw new Error('Error fetching scan results');
  }
};

// Function to compress the image buffer
const compressImageBuffer = async (buffer) => {
    return await sharp(buffer)
        .rotate()
        .resize(800)
        .jpeg({ quality: 70 })
        .toBuffer();
};

// Upload images function with VirusTotal integration
export const uploadImages = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error('File upload error:', err.message);
      return res.status(500).json({ message: 'File upload failed', error: err.message });
    }

    if (!req.files || req.files.length === 0) {
      console.warn('No files uploaded');
      return res.status(400).json({ message: 'No files uploaded' });
    }

    try {
      let uploadedFiles = [];

      for (const file of req.files) {
        console.log(`Processing file: ${file.originalname} (${file.size} bytes)`);

        // Scan the file with VirusTotal
        const scanId = await scanWithVirusTotal(file.buffer);
        const isInfected = await getScanResults(scanId);

        if (isInfected) {
          console.warn(`Virus detected in file ${file.originalname}`);
          return res.status(400).json({ message: `Virus detected in file ${file.originalname}` });
        }

        console.log(`File ${file.originalname} is clean.`);

        const compressedBuffer = await compressImageBuffer(file.buffer);

        // Request file ID from SeaweedFS
        const assignResponse = await axios.get(`http://localhost:9333/dir/assign`);
        if (!assignResponse.data.fid) {
            return res.status(500).json({ message: 'Error assigning file ID' });
        }
        const { fid, publicUrl } = assignResponse.data;

        // Upload the file using the assigned file ID
        const formData = new FormData();
        formData.append('file', compressedBuffer, file.originalname);

        const uploadResponse = await axios.post(`http://${publicUrl}/${fid}`, formData, {
            headers: formData.getHeaders(),
        });

        uploadedFiles.push({ filename: file.originalname, fileId: fid });

        // Save file details in MongoDB
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
      }

      console.log('All files uploaded successfully!');
      return res.status(200).json({
        message: 'Files uploaded successfully',
        files: uploadedFiles,
      });

    } catch (error) {
      console.error('Error during upload:', error.message);
      return res.status(500).json({
        message: 'Error during file processing',
        error: error.message,
      });
    }
  });
};