const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
//storage

const Storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, callback) => {
    const imageId = uuidv4();
    const fileName = file.originalname.split(".")[0] || file.originalname;
    const fileType = file.originalname.split(".")[1] || "";

    callback(null, fileName + `_${imageId}` + `.${fileType}`);
  },
});

const upload = multer({ storage: Storage }).single("image");

module.exports = upload;
