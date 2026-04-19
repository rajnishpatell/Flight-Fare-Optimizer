import multer from "multer";
import path from "path";

// Storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/avatars/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}_${req.user}${ext}`);
  }
});

// Validate file types
const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/jpg"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG/PNG images allowed"), false);
  }
};

// 2MB file limit
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2* 1024 * 1024 }
});

export default upload;
