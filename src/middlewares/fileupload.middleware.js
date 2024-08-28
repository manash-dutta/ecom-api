import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    // let name = new Date().toISOString() + file.originalname;
    let name = new Date().toISOString().replace(/:/g, "_") + file.originalname; //Microsoft window compitable
    cb(null, name);
  },
});
const upload = multer({ storage });
export default upload;
