import { dirname, join } from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import fs from "fs";

import Video from "../models/Video.js";
import Comentario from "../models/Comentario.js";

const path = fileURLToPath(import.meta.url);
const __dirname = dirname(path);

//Devuelve el video si es el creador o si el video es publico
const obtenerVideo = async (req, res, next) => {
  const { id } = req.params;
  //valida que el id tenga formato correcto
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Acción no válida!.");
    return next({ error, code: 403, msg: "Acción no válida!.", path });
  }

  let video;
  try {
    video = await Video.findById(id)
      .populate({
        path: "comentarios",
        populate: { path: "usuario" },
      })
      .populate("creador");
  } catch (error) {
    return next({ error, code: 500, msg: "Error al buscar el video!.", path });
  }

  //valida que exista el video
  if (!video) {
    const error = new Error("El video no existe!.");
    return next({ error, code: 404, msg: "El video no existe!.", path });
  }

  //verifica si existe autentificacion o es comentario anonimo
  if (req.usuario?._id) {
    //valida si el video es privado y si el usuario no es el creador
    if (
      video.privado &&
      video.creador._id.valueOf() !== req.usuario._id.valueOf()
    ) {
      const error = new Error("No tienes permisos!.");
      return next({ error, code: 403, msg: "No tienes permisos!.", path });
    }
  } else {
    //valida si el video es privado
    if (video.privado) {
      const error = new Error("No tienes permisos!.");
      return next({ error, code: 403, msg: "No tienes permisos!.", path });
    }
  }

  try {
    video = await Video.findById(id)
      .populate({
        path: "comentarios",
        select: "comentario likes  -_id",
        populate: { path: "usuario", select: "nombre  -_id" },
      })
      .populate("creador", "nombre -_id")
      .select("-privado -__v");
  } catch (error) {
    return next({ error, code: 500, msg: "Error al buscar el video!.", path });
  }
  res.json(video);
};

const nuevoVideo = async (req, res, next) => {
  try {
    const video = new Video();
    video.creador = req.usuario._id;
    video.titulo = req.body.titulo;
    video.descripcion = req.body.descripcion;
    video.creditos = req.body.creditos;
    video.privado = req.body.privado == "false" ? false : true;
    video.path = `public/videos/${req.file.filename}`;
    const videoAlmacenado = await video.save();
    res.json(videoAlmacenado);
    next();
  } catch (error) {
    return next({
      error,
      code: 500,
      msg: "Error al almacenar el video!.",
      path,
    });
  }
};

//Devuelve todos los videos publicos y los videos del propio usuario
//Si no esta autenticado devuelve todos los videos publicos
const obtenerVideos = async (req, res, next) => {
  let videos;

  try {
    //valida si estoy autenticado
    if (req.usuario?._id) {
      //consulta de videos publicos y del usuario
      videos = await Video.find({
        $or: [{ creador: req.usuario._id }, { privado: false }],
      })
        .populate({
          path: "comentarios",
          select: "comentario likes  -_id",
          populate: { path: "usuario", select: "nombre  -_id" },
        })
        .populate("creador", "nombre -_id")
        .select("-privado -__v");
    } else {
      //si no estoy logueado puedo ver los videos publicos
      videos = await Video.find({ privado: false })
        .populate({
          path: "comentarios",
          select: "comentario likes  -_id",
          populate: { path: "usuario", select: "nombre  -_id" },
        })
        .populate("creador", "nombre -_id")
        .select("-privado -__v ");
    }

    res.json(videos);
  } catch (error) {
    return next({
      error,
      code: 500,
      msg: "Error al buscar los videos!.",
      path,
    });
  }
};
const editarVideo = async (req, res, next) => {
  const { id } = req.params;

  //valida el formato del id
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Acción no válida!.");
    return next({ error, code: 403, msg: "Acción no válida!.", path });
  }

  const existeVideo = await Video.findById(id).populate(
    "creador",
    "-email -password -confirmado -isDeleted"
  );

  //valida que exista el video
  if (!existeVideo) {
    const error = new Error("El Viedo no existe!.");
    return next({ error, code: 404, msg: "El Viedo no existe!.", path });
  }

  //valida si el usuario no es el creador
  if (existeVideo.creador._id.valueOf() !== req.usuario._id.valueOf()) {
    const error = new Error("No tienes permisos!.");
    return next({ error, code: 403, msg: "No tienes permisos!.", path });
  }

  existeVideo.titulo = req.body.titulo || existeVideo.titulo;
  existeVideo.descripcion = req.body.descripcion || existeVideo.descripcion;
  existeVideo.creditos = req.body.creditos || existeVideo.creditos;
  existeVideo.privado = req.body.privado == "false" ? false : true;

  try {
    await existeVideo.save();
    res.json(existeVideo);
  } catch (error) {
    return next({
      error,
      code: 500,
      msg: "Error al actualizar el video!.",
      path,
    });
  }
};
const eliminarVideo = async (req, res, next) => {
  const { id } = req.params;

  //valida el formato del id
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Acción no válida!.");
    return next({ error, code: 403, msg: "Acción no válida!.", path });
  }

  const existeVideo = await Video.findById(id).populate("creador");

  //valida que exista el video
  if (!existeVideo) {
    const error = new Error("El Viedo no existe!.");
    return next({ error, code: 404, msg: "El Viedo no existe!.", path });
  }

  //valida si el usuario no es el creador
  if (existeVideo.creador._id.valueOf() !== req.usuario._id.valueOf()) {
    const error = new Error("No tienes permisos!.");
    return next({ error, code: 403, msg: "No tienes permisos!.", path });
  }

  try {
    //eliminar archivoimport { fileURLToPath } from "url";
    fs.unlinkSync(
      `${join(__dirname, `../uploads/${existeVideo.path.substring(6)}`)}`
    );
    await Promise.allSettled([
      await Comentario.deleteMany({ video: existeVideo._id }),
      await existeVideo.deleteOne(),
    ]);
    res.json({ msg: "Video Eliminado!." });
  } catch (error) {
    return next({
      error,
      code: 500,
      msg: "Error al eliminar el video!.",
      path,
    });
  }
};

//Devuelve todos los mejores "X" videos publicos junto a sus propios videos (usuario registrado)
//Si no esta autenticado devuelve los mejores "X" videos publicos
const obtenerMejoresVideos = async (req, res, next) => {
  let videos;
  const { cantidad } = req.params;
  if (!Number.isInteger(parseInt(cantidad))) {
    const error = new Error("Cantidad no válida!.");
    return next({ error, code: 403, msg: "Cantidad no válida!.", path });
  }

  try {
    //valida si estoy autenticado
    if (req.usuario?._id) {
      //consulta de videos publicos y del usuario
      videos = await Video.find({
        $or: [{ creador: req.usuario._id }, { privado: false }],
      })
        .sort({ likes: -1 }) // Ordenar en función de los likes de forma descendente
        .limit(parseInt(cantidad))
        .populate({
          path: "comentarios",
          select: "comentario likes  -_id",
          populate: { path: "usuario", select: "nombre  -_id" },
        })
        .populate("creador", "nombre -_id")
        .select("-privado -__v ");
    } else {
      //si no estoy logueado puedo ver los videos publicos
      videos = await Video.find({ privado: false })
        .sort({ likes: -1 }) // Ordenar en función de los likes de forma descendente
        .limit(parseInt(cantidad))
        .populate({
          path: "comentarios",
          select: "comentario likes  -_id",
          populate: { path: "usuario", select: "nombre  -_id" },
        })
        .populate("creador", "nombre -_id")
        .select("-privado -__v ");
    }

    res.json(videos);
  } catch (error) {
    return next({
      error,
      code: 500,
      msg: "Error al buscar los videos!.",
      path,
    });
  }
};
export {
  obtenerMejoresVideos,
  obtenerVideos,
  obtenerVideo,
  nuevoVideo,
  editarVideo,
  eliminarVideo,
};
