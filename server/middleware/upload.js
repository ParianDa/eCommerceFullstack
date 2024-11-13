const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Set upload destination folder
   },
   filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); // Rename the file with the current timestamp
   }
});

const fileFilter = (req, file, cb) => {
   if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
   } else {
      cb(new Error('Unsupported file format'), false);
   }
};

const upload = multer({
   storage: storage,
   limits: {
      fileSize: 1024 * 1024 * 5 // Max file size 5MB
   },
   fileFilter: fileFilter
});

module.exports = upload; // Export directly, not as { upload }
