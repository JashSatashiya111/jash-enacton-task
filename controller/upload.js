
const asyncHandler = require("../middleware/async")
const router = require("express").Router();

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = 'uploads/';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath); // Create the uploads folder if it doesn't exist
        }
        cb(null, uploadPath); // Use the uploads folder for storing uploaded images
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename for each image
    }
});

const upload = multer({ storage: storage });

const upload_image = asyncHandler(async (req, res, next) => {
    try {
        if (!req.file) {
            throwError('No file was uploaded.', 400)
        }

        // Construct the image URL
        const imagePath = path.join('uploads', req.file.filename); // Use path.join to handle file path construction
        // Replacing backslashes with forward slashes and considering the provided folder path
        const imageUrl = `${req.protocol}://${req.get('host')}/${imagePath.replace(/\\/g, '/')}`;

        // Respond with the image URL
        res.status(200).json({ imageUrl: imageUrl });
    } catch (error) {
        return next(setError(error, error?.status));
    }
});

router.post("/upload_image", upload.single('image'), upload_image);

module.exports = router;
