const express = require('express');
const router = express.Router();
const authAdmin = require('../middleware/authAdmin');
const uploadCtrl = require('../controllers/uploadCtrl');
const upload = require('../middleware/upload');

// Define the route in a similar format to your example
router.post('/upload', upload.single('image'), function(req, res) {
  uploadCtrl.uploadProductImage(req, res);
});

module.exports = router;
