import { dirname, extname, join } from "path";
import { fileURLToPath } from "url";
import multer from "multer";

import generarId from "../helpers/generarId.js";

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));
const MIMETYPES = ["video/mp4", "video/x-matroska"];
const MIMETYPESPRINT = ["video/mp4", "video/mkv"];

//configuracion storage Multer
const storage = multer.diskStorage({
  destination: join(CURRENT_DIR, "../uploads/videos"),
  filename: (req, file, cb) => {
    const fileExtension = extname(file.originalname);
    cb(null, `${generarId()}-Video${fileExtension}`);
  },
});

//Configuracion upload Multer
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (MIMETYPES.includes(file.mimetype)) cb(null, true);
    else
      cb(
        new Error(
          `Solo se permiten arvichos con extension ${MIMETYPESPRINT.join(" ")}.`
        )
      );
  },
  limits: {
    fieldSize: 1024 * 1024 * 1024,
  },
});

export default upload;
