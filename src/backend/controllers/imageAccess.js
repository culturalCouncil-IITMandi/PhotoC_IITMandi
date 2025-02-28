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

        const fileUrls = await Promise.all(files.map(async file => {
            try {
                // Check if file exists in SeaweedFS
                const response = await axios.head(`${process.env.SEAWEEDFS_URL}${file.fileId}`);
                if (response.status === 200) {
                    return {
                        ...file,
                        seaweedUrl: `${process.env.SEAWEEDFS_URL}${file.fileId}`
                    };
                }
                // File not found in SeaweedFS, remove from MongoDB
                await fileModel.findByIdAndDelete(file._id);
                console.log(`Removed file ${file.fileId} from MongoDB as it was not found in SeaweedFS`);
                return null;
            } catch (err) {
                // Error accessing file, remove from MongoDB
                await fileModel.findByIdAndDelete(file._id);
                console.error(`File ${file.fileId} not found in SeaweedFS and removed from MongoDB`);
                return null;
            }
        }));

        // Filter out any null entries where files weren't found
        const validFiles = fileUrls.filter(file => file !== null);

        return res.status(200).json({
            msg: 'Files fetched successfully',
            files: validFiles,
        });
    } catch (err) {
        return res.status(500).json({
            msg: 'Error fetching files',
            error: err.message,
        });
    }
};