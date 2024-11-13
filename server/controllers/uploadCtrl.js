const path = require("path");

const uploadCtrl = {
  uploadProductImage: (req, res) => {
    try {
      if (!req.file)
        return res.status(400).json({ message: "No such file uploaded" });
      const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`;

      const publicId = req.file.filename;

      res.json({
        message: "File Uploaded successfully",
        url: imageUrl,
        publicId: publicId
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = uploadCtrl;
