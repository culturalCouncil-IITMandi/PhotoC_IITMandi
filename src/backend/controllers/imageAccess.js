import axios from 'axios';
import { fileModel } from '../helpers/mongoose.js';

export const imageFilters = async (req, res) => {
    const { event, startDate, endDate, approved, uploader } = req.query; 

    let query = {};

    if (event) {
        query.event = event;
    }

    if (uploader) {
        query.uploader = uploader;
    }

    if (startDate || endDate) {
        query.uploadedAt = {};

        if (startDate) {
            query.uploadedAt.$gte = new Date(startDate);
        }

        if (endDate) {
            query.uploadedAt.$lte = new Date(endDate);
        }
    }

    if (approved !== undefined) {
        query.approval = approved === 'true';
    }

    try {
        const files = await fileModel.find(query).sort({ likes: -1, uploadedAt: -1 }).lean();

        if (files.length === 0) {
            return res.status(404).json({ message: 'No files found matching the filters' });
        }

        const fileUrls = files.map(file => ({
            ...file,
            seaweedUrl: `${process.env.SEAWEEDFS_URL}${file.fileId}`
        }));

        return res.status(200).json({
            msg: 'Files fetched successfully',
            files: fileUrls,
        });
    } catch (err) {
        return res.status(500).json({
            msg: 'Error fetching files',
            error: err.message,
        });
    }
};