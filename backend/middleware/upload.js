const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const dozvoljeni = ['.jpg', '.jpeg', '.png', '.webp'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (dozvoljeni.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Only images allowed'));
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 }
});

module.exports = upload;