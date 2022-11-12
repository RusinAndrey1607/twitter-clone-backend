import multer from "multer";
import path from "path";
import { v4 } from "uuid";

const diskStorage = multer.diskStorage({
  destination: path.join(__dirname,"..", "static"),
  filename: (req, file, cb) => {
    cb(null, v4() + "." + file.originalname.split(".").pop());
  },
});

export const upload = multer({ storage: diskStorage });
