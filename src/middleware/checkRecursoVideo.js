import { fileURLToPath } from "url";

import Video from "../models/Video.js";

const path = fileURLToPath(import.meta.url);

//Verificar que el usuario pueda obtener el recurso
const checkRecursoVideo = async (req, _res, next) => {
  const video = await Video.findOne({
    path: { $regex: req.url.substring(1), $options: "i" },
  }).populate("creador");

  if (!video) {
    const error = new Error("No existe el video!.");
    return next({ error, code: 404, msg: "No existe el video!.", path });
  }

  if (req.usuario?._id) {
    if (
      video.privado &&
      video.creador._id.valueOf() !== req.usuario._id.valueOf()
    ) {
      const error = new Error("No tienes permiso!.");
      return next({ error, code: 403, msg: "No tienes permiso!.", path });
    }
  } else {
    if (video.privado) {
      const error = new Error("No tienes permiso!.");
      return next({ error, code: 403, msg: "No tienes permiso!.", path });
    }
  }
  next();
};

export default checkRecursoVideo;
