const multer = require("multer");
const { InvalidDocumentType } =  require("../exceptions/common/InvalidDocumentType");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ];

  const allowedExtensions = [".pdf", ".docx"];

  const ext = file.originalname
    .toLowerCase()
    .substring(file.originalname.lastIndexOf("."));

  if (
    allowedMimeTypes.includes(file.mimetype) &&
    allowedExtensions.includes(ext)
  ) {
    cb(null, true);
  } else {
    cb(new InvalidDocumentType(), false);
  }
};

const uploadArchive = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});

module.exports =  { uploadArchive };